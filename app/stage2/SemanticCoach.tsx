"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { OralCoachQuestion } from "./OralCoach";

type Rating = 0 | 1 | 2 | 3 | 4;
type Progress = Record<string, { rating: Rating; seen: number; updatedAt: number }>;
type Phase = "ready" | "answering" | "review";
type ModelState = "idle" | "loading" | "ready" | "error";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { resultIndex: number; results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type SemanticProgress = { status?: string; progress?: number; loaded?: number; total?: number; file?: string; name?: string };
type SemanticResult = { similarities: number[]; transcriptChunks: number; model: string };
type SemanticEngine = {
  model: string;
  load: (progress?: (info: SemanticProgress) => void) => Promise<{ ready: boolean; model: string }>;
  score: (transcript: string, points: string[], progress?: (info: SemanticProgress) => void) => Promise<SemanticResult>;
};

declare global {
  interface Window {
    __officerSemantic?: SemanticEngine;
  }
}

type Props = {
  questions: OralCoachQuestion[];
  progress: Progress;
  onRate: (questionId: string, rating: Rating) => void;
  onExit: () => void;
};

type PointResult = {
  point: string;
  lexical: number;
  semantic: number | null;
  similarity: number | null;
  hybrid: number;
  paraphrase: boolean;
  numericCheck: boolean;
};

const SCRIPT_ID = "officer-semantic-loader";
const ratings: { value: Rating; label: string }[] = [
  { value: 0, label: "Nie wiem" },
  { value: 1, label: "Słabo" },
  { value: 2, label: "Z pomocą" },
  { value: 3, label: "Samodzielnie" },
  { value: 4, label: "Płynnie" },
];

const stopwords = new Set([
  "oraz", "który", "która", "które", "których", "przez", "przed", "jest", "była", "było", "były", "będzie", "są", "się", "dla", "tego", "jako", "jego", "jej", "ich", "pod", "nad", "lub", "czy", "nie", "tak", "tym", "ten", "ta", "to", "został", "została", "zostały", "według", "w", "we", "z", "ze", "do", "na", "o", "od", "po", "za", "i", "a", "że", "co", "jak", "u", "między", "podczas", "którym", "której", "którego", "jednym", "jednej", "jednego", "może", "ma", "miał", "miała", "miały", "być", "by", "te", "tych", "też", "natomiast",
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ąćęłńóśźż\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keyForToken(token: string) {
  if (/^\d+$/.test(token)) return token;
  if (token.length >= 8) return token.slice(0, 6);
  if (token.length >= 6) return token.slice(0, 5);
  return token;
}

function importantTokens(text: string, limit = 12) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of normalize(text).split(" ")) {
    if (!token || stopwords.has(token) || (token.length < 4 && !/^\d+$/.test(token))) continue;
    const key = keyForToken(token);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= limit) break;
  }
  return out;
}

function lexicalCoverage(transcript: string, point: string) {
  const source = importantTokens(point, 10);
  if (!source.length) return 0;
  const spoken = new Set(importantTokens(transcript, 260));
  return source.filter((key) => spoken.has(key)).length / source.length;
}

function cleanAnswer(answer: string) {
  return answer
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^uzupełniono spoza kompletnej bazy/i.test(line))
    .filter((line) => !/^odpowiedź:?$/i.test(line))
    .filter((line) => !/^źródło uzupełnienia:/i.test(line))
    .filter((line) => !/^uwaga:/i.test(line))
    .join("\n");
}

function sourceChunks(q: OralCoachQuestion) {
  const points = q.keyPoints.map((x) => x.trim()).filter((x) => x.length > 15);
  if (points.length >= 2) return points.slice(0, 8);

  const body = cleanAnswer(q.fullAnswer || points.join(" "));
  const raw = body
    .split(/(?<=[.!?])\s+|\n+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 12);
  if (!raw.length) return points.length ? points : [q.fullAnswer];
  return raw.slice(0, 8);
}

function semanticCoverage(similarity: number) {
  if (!Number.isFinite(similarity) || similarity <= 0.3) return 0;
  if (similarity >= 0.82) return 1;
  return Math.max(0, Math.min(1, (similarity - 0.3) / 0.52));
}

function numericMismatch(point: string, transcript: string) {
  const expected = [...point.matchAll(/\b\d+[\d.,/-]*\b/g)].map((x) => x[0]);
  if (!expected.length) return false;
  const spoken = normalize(transcript);
  return expected.some((value) => !spoken.includes(normalize(value)));
}

function weightedPick(questions: OralCoachQuestion[], progress: Progress, excludeId?: string) {
  const base = excludeId && questions.length > 1 ? questions.filter((q) => q.id !== excludeId) : questions;
  const pool = base.flatMap((q) => Array.from({ length: Math.max(1, 6 - (progress[q.id]?.rating ?? 0)) }, () => q));
  return pool[Math.floor(Math.random() * pool.length)] ?? base[0];
}

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function status(score: number) {
  if (score >= 0.68) return { icon: "✅", label: "sens pokryty", cls: "border-[#526548] bg-[#172016] text-[#c5d6b8]" };
  if (score >= 0.4) return { icon: "🟡", label: "częściowo", cls: "border-amber-900/50 bg-amber-950/10 text-amber-100" };
  return { icon: "❌", label: "brak / słabo", cls: "border-red-950/70 bg-red-950/10 text-red-100" };
}

async function ensureSemanticEngine(): Promise<SemanticEngine> {
  if (window.__officerSemantic) return window.__officerSemantic;

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!existing) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "module";
    script.src = "/semantic-loader.js";
    document.head.appendChild(script);
  }

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Przekroczono czas ładowania modułu semantycznego."));
    }, 30000);
    const onReady = () => {
      if (!window.__officerSemantic) return;
      cleanup();
      resolve(window.__officerSemantic);
    };
    const onError = () => {
      cleanup();
      reject(new Error("Nie udało się pobrać biblioteki analizy semantycznej."));
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("officer-semantic-ready", onReady);
      document.getElementById(SCRIPT_ID)?.removeEventListener("error", onError);
    };
    window.addEventListener("officer-semantic-ready", onReady);
    document.getElementById(SCRIPT_ID)?.addEventListener("error", onError, { once: true });
    if (window.__officerSemantic) onReady();
  });
}

export default function SemanticCoach({ questions, progress, onRate, onExit }: Props) {
  const [question, setQuestion] = useState<OralCoachQuestion | null>(() => weightedPick(questions, progress));
  const [phase, setPhase] = useState<Phase>("ready");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [micSupported, setMicSupported] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState("");
  const [modelState, setModelState] = useState<ModelState>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [modelError, setModelError] = useState("");
  const [analysisBusy, setAnalysisBusy] = useState(false);
  const [results, setResults] = useState<PointResult[] | null>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const chunks = useMemo(() => question ? sourceChunks(question) : [], [question]);
  const lexicalPreview = useMemo(() => chunks.map((point) => lexicalCoverage(transcript, point)), [chunks, transcript]);
  const overall = results?.length ? Math.round(results.reduce((sum, x) => sum + x.hybrid, 0) / results.length * 100) : 0;
  const semanticOverall = results?.length ? Math.round(results.reduce((sum, x) => sum + (x.semantic ?? x.lexical), 0) / results.length * 100) : 0;
  const lexicalOverall = lexicalPreview.length ? Math.round(lexicalPreview.reduce((sum, x) => sum + x, 0) / lexicalPreview.length * 100) : 0;

  useEffect(() => {
    const w = window as typeof window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    setMicSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => recognitionRef.current?.abort();
  }, []);

  useEffect(() => {
    if (phase !== "answering" || startedAt === null) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase, startedAt]);

  function progressHandler(info: SemanticProgress) {
    if (info.status === "progress_total" && typeof info.progress === "number") setModelProgress(Math.round(info.progress));
    else if (info.status === "progress" && typeof info.progress === "number") setModelProgress((p) => Math.max(p, Math.round(info.progress)));
    else if (info.status === "ready") setModelProgress(100);
  }

  async function prepareModel() {
    setModelState("loading");
    setModelError("");
    setModelProgress(0);
    try {
      const engine = await ensureSemanticEngine();
      await engine.load(progressHandler);
      setModelProgress(100);
      setModelState("ready");
    } catch (error) {
      setModelState("error");
      setModelError(error instanceof Error ? error.message : "Nie udało się przygotować modelu.");
    }
  }

  function setupRecognition() {
    const w = window as typeof window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = "pl-PL";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += `${result[0].transcript} `;
        else interimText += result[0].transcript;
      }
      if (finalText) setTranscript((prev) => `${prev} ${finalText}`.replace(/\s+/g, " ").trim());
      setInterim(interimText);
    };
    rec.onerror = (event) => {
      setMicError(event.error === "not-allowed" ? "Brak zgody na mikrofon. Możesz odpowiedzieć bez niego i użyć systemowego dyktowania w polu tekstowym." : "Mikrofon został przerwany. Możesz dokończyć ręcznie.");
      setMicActive(false);
    };
    rec.onend = () => setMicActive(false);
    return rec;
  }

  function startAttempt(withMic: boolean) {
    setTranscript("");
    setInterim("");
    setResults(null);
    setSourceOpen(false);
    setElapsed(0);
    setStartedAt(Date.now());
    setPhase("answering");
    setMicError("");
    if (!withMic) return;
    const rec = setupRecognition();
    if (!rec) {
      setMicError("Ta przeglądarka nie udostępnia rozpoznawania mowy. Odpowiadaj na głos i po próbie wpisz odpowiedź.");
      return;
    }
    recognitionRef.current = rec;
    try {
      rec.start();
      setMicActive(true);
    } catch {
      setMicError("Nie udało się uruchomić mikrofonu. Spróbuj ponownie albo odpowiedz bez niego.");
    }
  }

  function finishAttempt() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setMicActive(false);
    setInterim("");
    setStartedAt(null);
    setPhase("review");
  }

  async function analyzeSemantically() {
    const text = transcript.trim();
    if (!text || !chunks.length) return;
    setAnalysisBusy(true);
    setResults(null);
    setModelError("");
    try {
      if (modelState !== "ready") {
        setModelState("loading");
        const engine = await ensureSemanticEngine();
        await engine.load(progressHandler);
        setModelState("ready");
        setModelProgress(100);
      }
      const engine = await ensureSemanticEngine();
      const output = await engine.score(text, chunks, progressHandler);
      const next = chunks.map((point, index) => {
        const lexical = lexicalCoverage(text, point);
        const similarity = output.similarities[index] ?? 0;
        const semantic = semanticCoverage(similarity);
        const hybridBase = semantic * 0.76 + lexical * 0.24;
        const hybrid = Math.max(hybridBase, lexical * 0.9);
        return {
          point,
          lexical,
          semantic,
          similarity,
          hybrid: Math.max(0, Math.min(1, hybrid)),
          paraphrase: semantic >= 0.58 && semantic - lexical >= 0.22,
          numericCheck: numericMismatch(point, text),
        };
      });
      setResults(next);
    } catch (error) {
      setModelState("error");
      setModelError("Analiza semantyczna nie zadziałała — pokazuję bezpieczny wynik z dotychczasowego matchera słów kluczowych. " + (error instanceof Error ? error.message : ""));
      setResults(chunks.map((point) => {
        const lexical = lexicalCoverage(text, point);
        return { point, lexical, semantic: null, similarity: null, hybrid: lexical, paraphrase: false, numericCheck: numericMismatch(point, text) };
      }));
    } finally {
      setAnalysisBusy(false);
    }
  }

  function nextQuestion() {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setQuestion(weightedPick(questions, progress, question?.id) ?? null);
    setPhase("ready");
    setTranscript("");
    setInterim("");
    setResults(null);
    setSourceOpen(false);
    setElapsed(0);
    setStartedAt(null);
    setMicActive(false);
    setMicError("");
  }

  function rateAndNext(r: Rating) {
    if (question) onRate(question.id, r);
    nextQuestion();
  }

  if (!question) {
    return <div className="space-y-4"><button onClick={onExit} className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold">← Menu Etapu II</button><div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">Brak pytań teoretycznych.</div></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onExit} className="rounded-xl border border-[#46533f] bg-[#11150f] px-4 py-2 text-sm font-bold text-[#bdc9b2]">← Menu Etapu II</button>
        <div className="rounded-full border border-sky-900/60 bg-sky-950/20 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-sky-200">BETA // SEMANTYKA LOKALNA</div>
      </div>

      <section className="rounded-[1.75rem] border border-sky-900/50 bg-[#101719] p-5 sm:p-7">
        <div className="flex flex-wrap gap-2 text-xs text-[#82979a]"><span>TEORIA</span><span>•</span><span>{question.category}</span></div>
        <h1 className="mt-3 text-2xl font-black leading-tight text-white sm:text-4xl">{question.question}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9cabad]">Ten tryb ocenia nie tylko wspólne słowa, ale również podobieństwo znaczeniowe. Możesz więc odpowiadać własnymi słowami. Prawidłowa treść nadal pochodzi wyłącznie z naszej odpowiedzi źródłowej.</p>
      </section>

      <section className="rounded-2xl border border-[#30464a] bg-[#0c1214] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-sky-300/80">Model lokalny</div>
            <h2 className="mt-1 font-bold text-white">Paraphrase Multilingual MiniLM</h2>
            <p className="mt-2 text-sm leading-6 text-[#8fa0a3]">Model działa w przeglądarce. Pierwsze uruchomienie pobiera około 135 MB modelu i tokenizera; później pliki mogą być używane z cache. Transkrypcja nie jest wysyłana do naszego backendu ani do płatnego API.</p>
          </div>
          <div className="min-w-[190px] rounded-xl border border-[#30464a] bg-black/20 p-3">
            <div className="flex items-center justify-between text-xs"><span className="text-[#8fa0a3]">Status</span><b className={modelState === "ready" ? "text-emerald-300" : modelState === "error" ? "text-red-300" : "text-sky-200"}>{modelState === "ready" ? "GOTOWY" : modelState === "loading" ? "ŁADOWANIE" : modelState === "error" ? "FALLBACK" : "NIEURUCHOMIONY"}</b></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#172125]"><div className="h-full bg-sky-300 transition-all" style={{ width: `${modelState === "ready" ? 100 : modelProgress}%` }} /></div>
            <div className="mt-1 text-right font-mono text-[10px] text-[#7e9195]">{modelState === "ready" ? 100 : modelProgress}%</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button disabled={modelState === "loading" || modelState === "ready"} onClick={prepareModel} className="rounded-xl border border-sky-900/60 bg-sky-950/30 px-4 py-2.5 text-sm font-bold text-sky-100 disabled:opacity-50">{modelState === "ready" ? "✓ Model gotowy" : modelState === "loading" ? "Pobieram model…" : "Przygotuj model"}</button>
          {modelState === "error" && <button onClick={prepareModel} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-sm font-bold">Spróbuj ponownie</button>}
        </div>
        {modelError && <p className="mt-3 rounded-xl border border-red-950/60 bg-red-950/10 p-3 text-xs leading-5 text-red-200">{modelError}</p>}
      </section>

      {phase === "ready" && (
        <section className="rounded-2xl border border-[#34474a] bg-[#0f1517] p-5">
          <h2 className="font-bold text-white">Odpowiedz naturalnie</h2>
          <p className="mt-1 text-sm text-[#8d9b9e]">Nie próbuj kopiować tekstu źródłowego. Ten tryb ma sprawdzić, czy umiesz przekazać ten sam sens własnymi słowami.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button disabled={!micSupported} onClick={() => startAttempt(true)} className="rounded-xl bg-[#d9e7e7] px-5 py-3 text-sm font-black text-[#102022] disabled:opacity-40">🎙️ Odpowiadam z mikrofonem</button>
            <button onClick={() => startAttempt(false)} className="rounded-xl border border-[#40565a] bg-[#121b1d] px-5 py-3 text-sm font-bold text-[#c1d0d2]">Bez mikrofonu</button>
            <button onClick={nextQuestion} className="rounded-xl border border-neutral-700 px-5 py-3 text-sm font-bold text-neutral-300">Losuj inne</button>
          </div>
        </section>
      )}

      {phase === "answering" && (
        <section className="rounded-2xl border border-[#385358] bg-[#0d1517] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-[0.15em] text-sky-300/80">Odpowiedź trwa</div><p className="mt-1 text-sm text-[#8fa0a3]">Mów normalnym językiem. Nie ma tu limitu czasu.</p></div><div className="font-mono text-3xl font-black text-white">{fmt(elapsed)}</div></div>
          <div className="mt-5 min-h-24 rounded-xl border border-[#2e4145] bg-black/20 p-4 text-sm leading-6 text-[#bdc9cb]">{transcript || interim ? <>{transcript}{interim && <span className="text-[#71868a]"> {interim}</span>}</> : <span className="text-[#66777a]">Czekam na odpowiedź…</span>}</div>
          {micError && <p className="mt-3 text-xs text-amber-200">{micError}</p>}
          <div className="mt-4 flex flex-wrap gap-3"><button onClick={finishAttempt} className="rounded-xl bg-[#d9e7e7] px-5 py-3 text-sm font-black text-[#102022]">Zakończ odpowiedź</button>{micActive && <span className="self-center text-xs font-bold text-emerald-300">● mikrofon aktywny</span>}</div>
        </section>
      )}

      {phase === "review" && (
        <>
          <section className="rounded-2xl border border-[#34474a] bg-[#0e1517] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-white">Transkrypcja</h2><p className="mt-1 text-xs text-[#7f9093]">Możesz poprawić błędy rozpoznawania mowy przed analizą.</p></div><span className="font-mono text-xs text-[#789094]">matcher: {lexicalOverall}%</span></div>
            <textarea value={transcript} onChange={(e) => { setTranscript(e.target.value); setResults(null); }} rows={6} className="mt-4 w-full rounded-xl border border-[#304247] bg-black/20 p-4 text-sm leading-6 text-[#d0d9da] outline-none focus:border-sky-800" />
            <div className="mt-4 flex flex-wrap gap-3">
              <button disabled={analysisBusy || !transcript.trim()} onClick={analyzeSemantically} className="rounded-xl bg-sky-100 px-5 py-3 text-sm font-black text-[#102327] disabled:opacity-40">{analysisBusy ? "Analizuję znaczenie…" : results ? "Przelicz analizę" : "Analizuj znaczenie"}</button>
              <button onClick={() => { setPhase("ready"); setTranscript(""); setResults(null); }} className="rounded-xl border border-neutral-700 px-4 py-3 text-sm font-bold">Powtórz próbę</button>
            </div>
          </section>

          {analysisBusy && <section className="rounded-2xl border border-sky-900/40 bg-sky-950/10 p-6 text-center"><div className="text-lg font-black text-sky-100">Model porównuje znaczenie odpowiedzi…</div><p className="mt-2 text-sm text-[#8da2a5]">Przy pierwszym użyciu największą część czasu zajmuje pobranie modelu. Następne analizy powinny być znacznie szybsze.</p></section>}

          {results && !analysisBusy && (
            <>
              <section className="rounded-2xl border border-[#3b565b] bg-[#10191b] p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#334b50] bg-black/20 p-4"><div className="text-xs text-[#7f9498]">Wynik hybrydowy</div><div className="mt-1 text-3xl font-black text-white">{overall}%</div></div>
                  <div className="rounded-xl border border-[#334b50] bg-black/20 p-4"><div className="text-xs text-[#7f9498]">Znaczenie / semantyka</div><div className="mt-1 text-3xl font-black text-sky-200">{semanticOverall}%</div></div>
                  <div className="rounded-xl border border-[#334b50] bg-black/20 p-4"><div className="text-xs text-[#7f9498]">Słowa kluczowe</div><div className="mt-1 text-3xl font-black text-[#b6c2c4]">{lexicalOverall}%</div></div>
                </div>
                <p className="mt-4 text-xs leading-5 text-[#809397]">Wynik hybrydowy łączy podobieństwo znaczeniowe z dotychczasowym matcherem. Semantyka ma większą wagę, dlatego poprawna parafraza może zostać zaliczona mimo użycia innych słów. To nadal narzędzie treningowe, nie oficjalna ocena komisji.</p>
              </section>

              <div className="space-y-3">
                {results.map((item, index) => {
                  const s = status(item.hybrid);
                  return <section key={`${index}-${item.point.slice(0, 20)}`} className={`rounded-2xl border p-4 sm:p-5 ${s.cls}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-black">{s.icon} Punkt {index + 1} — {s.label}</div><div className="flex gap-2 font-mono text-[10px]"><span>HYB {Math.round(item.hybrid * 100)}%</span><span>SEM {item.semantic === null ? "—" : Math.round(item.semantic * 100) + "%"}</span><span>KEY {Math.round(item.lexical * 100)}%</span></div></div>
                    <p className="mt-3 text-sm leading-6 opacity-90">{item.point}</p>
                    {item.paraphrase && <div className="mt-3 inline-flex rounded-full border border-sky-800/50 bg-sky-950/20 px-3 py-1 text-xs font-bold text-sky-200">↔ Parafraza rozpoznana — sens jest dużo bliższy niż same słowa</div>}
                    {item.numericCheck && <div className="mt-3 rounded-lg border border-amber-900/40 bg-amber-950/10 p-2 text-xs text-amber-100">⚠ Punkt zawiera liczbę/datę, której matcher tekstowy nie potwierdził. Sprawdź ją ręcznie — rozpoznawanie mowy może zapisać liczbę słownie.</div>}
                  </section>;
                })}
              </div>

              <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                <button onClick={() => setSourceOpen((v) => !v)} className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-bold">{sourceOpen ? "Ukryj pełną odpowiedź" : "Pokaż pełną odpowiedź źródłową"}</button>
                {sourceOpen && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-neutral-300">{question.fullAnswer}</p>}
              </section>

              <section className="rounded-2xl border border-[#34474a] bg-[#0f1517] p-5">
                <h2 className="font-bold text-white">Jak poszłoby Ci przed komisją?</h2>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{ratings.map((r) => <button key={r.value} onClick={() => rateAndNext(r.value)} className="rounded-xl border border-[#3d5054] bg-black/20 px-3 py-3 text-left text-xs font-bold text-[#c1cdcf]"><b className="mr-2 text-base">{r.value}</b>{r.label}</button>)}</div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

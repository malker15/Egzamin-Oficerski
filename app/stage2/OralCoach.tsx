"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type OralCoachQuestion = {
  id: string;
  category: string;
  question: string;
  keyPoints: string[];
  fullAnswer: string;
};

type Rating = 0 | 1 | 2 | 3 | 4;
type Progress = Record<string, { rating: Rating; seen: number; updatedAt: number }>;
type LayerId = "quick" | "standard" | "full";
type Phase = "ready" | "answering" | "review";

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

type Props = {
  questions: OralCoachQuestion[];
  progress: Progress;
  onRate: (questionId: string, rating: Rating) => void;
  onExit: () => void;
};

const layers: { id: LayerId; name: string; badge: string; seconds: number | null; pointLimit: number; description: string }[] = [
  { id: "quick", name: "Sedno", badge: "15 s", seconds: 15, pointLimit: 2, description: "Krótka odpowiedź: złap najważniejszy rdzeń zagadnienia." },
  { id: "standard", name: "Standard", badge: "45 s", seconds: 45, pointLimit: 4, description: "Odpowiedź egzaminacyjna w zwartej, uporządkowanej formie." },
  { id: "full", name: "Pełna", badge: "bez limitu", seconds: null, pointLimit: 99, description: "Referujesz całość i próbujesz pokryć wszystkie elementy odpowiedzi." },
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

function importantTokens(text: string, limit = 10) {
  const normalized = normalize(text);
  const seen = new Set<string>();
  const out: { raw: string; key: string }[] = [];
  for (const token of normalized.split(" ")) {
    if (!token || stopwords.has(token) || (token.length < 4 && !/^\d+$/.test(token))) continue;
    const key = keyForToken(token);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ raw: token, key });
    if (out.length >= limit) break;
  }
  return out;
}

function cleanAnswerForAnalysis(answer: string) {
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
  const keyPoints = q.keyPoints.map((x) => x.trim()).filter((x) => x.length > 15);
  if (keyPoints.length >= 2) return keyPoints.slice(0, 8);

  const body = cleanAnswerForAnalysis(q.fullAnswer || keyPoints.join(" "));
  const raw = body
    .split(/(?<=[.!?])\s+|\n+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 12);

  if (!raw.length) return keyPoints.length ? keyPoints : [q.fullAnswer];

  const compact: string[] = [];
  for (const part of raw) {
    if (compact.length && part.length < 45) compact[compact.length - 1] += ` ${part}`;
    else compact.push(part);
  }
  if (compact.length <= 8) return compact;
  return [...compact.slice(0, 7), compact.slice(7).join(" ")];
}

function anchorFor(text: string) {
  return importantTokens(text, 4).map((x) => x.raw);
}

function pointCoverage(transcript: string, point: string) {
  const source = importantTokens(point, 9);
  if (!source.length) return 0;
  const spoken = new Set(importantTokens(transcript, 200).map((x) => x.key));
  const matched = source.filter((x) => spoken.has(x.key)).length;
  return matched / source.length;
}

function weightedPick(questions: OralCoachQuestion[], progress: Progress, excludeId?: string) {
  const base = excludeId && questions.length > 1 ? questions.filter((q) => q.id !== excludeId) : questions;
  const pool = base.flatMap((q) => Array.from({ length: Math.max(1, 6 - (progress[q.id]?.rating ?? 0)) }, () => q));
  return pool[Math.floor(Math.random() * pool.length)] ?? base[0];
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function OralCoach({ questions, progress, onRate, onExit }: Props) {
  const [question, setQuestion] = useState<OralCoachQuestion | null>(() => weightedPick(questions, progress));
  const [layerId, setLayerId] = useState<LayerId>("standard");
  const [phase, setPhase] = useState<Phase>("ready");
  const [anchorsOpen, setAnchorsOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [micSupported, setMicSupported] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const layer = layers.find((x) => x.id === layerId) ?? layers[1];
  const chunks = useMemo(() => question ? sourceChunks(question) : [], [question]);
  const targetChunks = useMemo(() => chunks.slice(0, Math.min(chunks.length, layer.pointLimit)), [chunks, layer.pointLimit]);
  const analysis = useMemo(() => targetChunks.map((point) => ({ point, coverage: pointCoverage(transcript, point) })), [targetChunks, transcript]);
  const overall = analysis.length ? Math.round((analysis.reduce((sum, x) => sum + x.coverage, 0) / analysis.length) * 100) : 0;

  useEffect(() => {
    const w = window as typeof window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    setMicSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (phase !== "answering" || startedAt === null) return;
    const tick = () => {
      const value = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(value);
      if (layer.seconds !== null && value >= layer.seconds) finishAttempt();
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase, startedAt, layer.seconds]);

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
      setMicError(event.error === "not-allowed" ? "Brak zgody na mikrofon. Możesz kontynuować bez mikrofonu i użyć dyktowania w polu tekstowym." : "Mikrofon został przerwany. Możesz dokończyć odpowiedź bez niego.");
      setMicActive(false);
    };
    rec.onend = () => setMicActive(false);
    return rec;
  }

  function startAttempt(withMic: boolean) {
    setTranscript("");
    setInterim("");
    setElapsed(0);
    setStartedAt(Date.now());
    setPhase("answering");
    setMicError("");
    if (!withMic) return;

    const rec = setupRecognition();
    if (!rec) {
      setMicError("Ta przeglądarka nie udostępnia rozpoznawania mowy. Odpowiadaj na głos, a po próbie wpisz słowa kluczowe lub użyj systemowego dyktowania.");
      return;
    }
    recognitionRef.current = rec;
    try {
      rec.start();
      setMicActive(true);
    } catch {
      setMicError("Nie udało się uruchomić mikrofonu. Spróbuj ponownie albo rozpocznij bez mikrofonu.");
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

  function resetForQuestion(next: OralCoachQuestion | undefined) {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setQuestion(next ?? null);
    setPhase("ready");
    setTranscript("");
    setInterim("");
    setElapsed(0);
    setStartedAt(null);
    setMicActive(false);
    setMicError("");
    setAnchorsOpen(false);
  }

  function nextQuestion() {
    if (!questions.length) return;
    resetForQuestion(weightedPick(questions, progress, question?.id));
  }

  function rateAndNext(rating: Rating) {
    if (question) onRate(question.id, rating);
    nextQuestion();
  }

  if (!question) {
    return (
      <div className="space-y-4">
        <button onClick={onExit} className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold">← Menu Etapu II</button>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">Brak pytań teoretycznych do treningu.</div>
      </div>
    );
  }

  const displaySeconds = layer.seconds === null ? elapsed : Math.max(0, layer.seconds - elapsed);
  const targetLabel = layer.id === "full" ? `${targetChunks.length} punktów` : `${targetChunks.length} z ${chunks.length} punktów`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onExit} className="rounded-xl border border-[#46533f] bg-[#11150f] px-4 py-2 text-sm font-bold text-[#bdc9b2]">← Menu Etapu II</button>
        <div className="rounded-full border border-[#4e5d45] bg-[#151b13] px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#a9b99c]">LAB // TRENER USTNY</div>
      </div>

      <section className="rounded-[1.75rem] border border-[#526048] bg-[#12170f] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#87927f]"><span>TEORIA</span><span>•</span><span>{question.category}</span></div>
        <h1 className="mt-3 text-2xl font-black leading-tight text-white sm:text-4xl">{question.question}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9ca695]">Odpowiadasz na głos. Po próbie aplikacja porówna transkrypcję z pojęciami obecnymi w odpowiedzi źródłowej i pokaże, które elementy prawdopodobnie padły.</p>
      </section>

      <section className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-[#7f8e73]">Warstwa odpowiedzi</div>
            <p className="mt-1 text-sm text-[#899383]">To metoda treningowa aplikacji — treść kontrolna pozostaje oparta na odpowiedzi źródłowej.</p>
          </div>
          <div className="font-mono text-xs font-bold text-[#78856f]">CEL // {targetLabel}</div>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {layers.map((item) => (
            <button
              key={item.id}
              disabled={phase === "answering"}
              onClick={() => setLayerId(item.id)}
              className={`rounded-xl border p-4 text-left transition disabled:opacity-50 ${layerId === item.id ? "border-[#7b8e6d] bg-[#1a2317]" : "border-[#30392c] bg-[#0b0e0a]"}`}
            >
              <div className="flex items-center justify-between gap-3"><span className="font-bold text-white">{item.name}</span><span className="font-mono text-xs text-[#8fa17e]">{item.badge}</span></div>
              <p className="mt-2 text-xs leading-5 text-[#818b7b]">{item.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-[#7f8e73]">Kotwice pamięciowe</div>
            <p className="mt-1 text-sm text-[#879181]">Możesz je podejrzeć przed próbą. Są wyciągane wyłącznie ze słów występujących w odpowiedzi.</p>
          </div>
          <button onClick={() => setAnchorsOpen((v) => !v)} className="rounded-xl border border-[#46533f] px-4 py-2 text-sm font-bold text-[#b7c3ac]">{anchorsOpen ? "Ukryj kotwice" : "Pokaż kotwice"}</button>
        </div>
        {anchorsOpen && (
          <div className="mt-4 space-y-2">
            {targetChunks.map((point, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-[#283225] bg-[#0a0d09] p-3">
                <span className="font-mono text-xs font-black text-[#718068]">{String(i + 1).padStart(2, "0")}</span>
                {anchorFor(point).map((anchor) => <span key={anchor} className="rounded-full border border-[#3a4734] bg-[#151a12] px-2.5 py-1 text-xs font-semibold text-[#b4c0aa]">{anchor}</span>)}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-[#4c5944] bg-[#11150f] p-6 text-center sm:p-8">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-[#819176]">{phase === "ready" ? "Gotowy?" : phase === "answering" ? (micActive ? "Mikrofon aktywny" : "Trwa odpowiedź") : "Próba zakończona"}</div>
        <div className={`mt-2 font-mono text-5xl font-black tabular-nums ${layer.seconds !== null && displaySeconds <= 5 && phase === "answering" ? "text-amber-300" : "text-[#d8dfcf]"}`}>{formatTime(displaySeconds)}</div>
        {layer.seconds === null && <div className="mt-1 text-xs text-[#6e7967]">czas liczy się w górę</div>}

        {phase === "ready" && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => startAttempt(true)} disabled={!micSupported} className="rounded-xl bg-[#c4cdb8] px-5 py-3 text-sm font-black text-[#151914] disabled:opacity-40">🎙️ Start + mikrofon</button>
            <button onClick={() => startAttempt(false)} className="rounded-xl border border-[#4b5843] px-5 py-3 text-sm font-bold text-[#b6c1ac]">Start bez mikrofonu</button>
            <button onClick={nextQuestion} className="rounded-xl border border-[#394434] px-5 py-3 text-sm font-bold text-[#8e9a85]">Losuj inne</button>
          </div>
        )}
        {phase === "answering" && (
          <div className="mt-6">
            <button onClick={finishAttempt} className="rounded-xl bg-[#c4cdb8] px-5 py-3 text-sm font-black text-[#151914]">Skończyłem — analizuj</button>
          </div>
        )}
        {micError && <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-amber-200/90">{micError}</p>}
      </section>

      {(phase === "answering" || phase === "review") && (
        <section className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div><div className="text-xs font-black uppercase tracking-[0.16em] text-[#7f8e73]">Transkrypcja odpowiedzi</div><p className="mt-1 text-xs text-[#7f8978]">Możesz poprawić tekst ręcznie lub użyć systemowego dyktowania telefonu.</p></div>
            {phase === "answering" && interim && <span className="rounded-full border border-[#3c4936] px-3 py-1 text-xs text-[#94a18a]">…{interim}</span>}
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Tutaj pojawi się rozpoznana odpowiedź. Bez mikrofonu możesz wpisać najważniejsze słowa i zdania, które powiedziałeś."
            className="min-h-36 w-full resize-y rounded-xl border border-[#3b4735] bg-[#090c08] p-4 text-sm leading-6 text-neutral-200 outline-none focus:border-[#738267]"
          />
        </section>
      )}

      {phase === "review" && (
        <>
          <section className="rounded-[1.75rem] border border-[#526048] bg-[#12170f] p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#839377]">Orientacyjne pokrycie</div>
                <div className="mt-2 text-5xl font-black text-white">{overall}%</div>
              </div>
              <p className="max-w-xl text-xs leading-5 text-[#7f8a78]">To lokalne porównanie słów i pojęć, a nie ocena komisji. Nie wymaga odpowiedzi słowo w słowo i ma służyć do wychwytywania pominiętych elementów.</p>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#22291f]"><div className="h-full rounded-full bg-[#879c77] transition-all" style={{ width: `${overall}%` }} /></div>
          </section>

          <section className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5">
            <h2 className="font-bold text-white">Punkty kontrolne tej warstwy</h2>
            <div className="mt-4 space-y-3">
              {analysis.map((item, i) => {
                const state = item.coverage >= 0.5 ? "ok" : item.coverage >= 0.25 ? "partial" : "miss";
                return (
                  <div key={i} className={`rounded-xl border p-4 ${state === "ok" ? "border-[#4f6547] bg-[#152014]" : state === "partial" ? "border-amber-900/50 bg-amber-950/10" : "border-red-950/60 bg-red-950/10"}`}>
                    <div className="flex items-center gap-3"><span className="text-lg">{state === "ok" ? "✅" : state === "partial" ? "🟡" : "❌"}</span><span className="font-mono text-xs font-black text-[#849178]">PUNKT {i + 1}</span><span className="ml-auto text-xs text-[#7f8978]">{Math.round(item.coverage * 100)}%</span></div>
                    <p className="mt-3 text-sm leading-6 text-neutral-200">{item.point}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <details className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5">
            <summary className="cursor-pointer font-bold text-white">Pełna odpowiedź źródłowa</summary>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-300">{question.fullAnswer}</p>
          </details>

          <section className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5">
            <h2 className="font-bold text-white">Jak ocenisz swoją odpowiedź?</h2>
            <p className="mt-1 text-xs text-[#7f8978]">Samoocena trafia do tego samego systemu powtórek co zwykła nauka teorii.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                [0, "Nie wiem"], [1, "Słabo"], [2, "Z pomocą"], [3, "Samodzielnie"], [4, "Płynnie"],
              ].map(([value, label]) => (
                <button key={String(value)} onClick={() => rateAndNext(value as Rating)} className="rounded-xl border border-[#3a4634] bg-[#0a0d09] px-3 py-3 text-left text-xs text-[#b2beaa] hover:border-[#6d7d62]"><b className="mr-2 text-base text-white">{value}</b>{label}</button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => resetForQuestion(question)} className="rounded-xl border border-[#46533f] px-4 py-2.5 text-sm font-bold text-[#b7c3ac]">Powtórz to samo pytanie</button>
              <button onClick={nextQuestion} className="rounded-xl border border-[#46533f] px-4 py-2.5 text-sm font-bold text-[#b7c3ac]">Pomiń ocenę i losuj inne</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

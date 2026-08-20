"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { OralCoachQuestion } from "./OralCoach";

type Rating = 0 | 1 | 2 | 3 | 4;
type Progress = Record<string, { rating: Rating; seen: number; updatedAt: number }>;
type Phase = "ready" | "main" | "followupReady" | "followup" | "review";

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
  const seen = new Set<string>();
  const out: { raw: string; key: string }[] = [];
  for (const token of normalize(text).split(" ")) {
    if (!token || stopwords.has(token) || (token.length < 4 && !/^\d+$/.test(token))) continue;
    const key = keyForToken(token);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ raw: token, key });
    if (out.length >= limit) break;
  }
  return out;
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
  const chunks = body
    .split(/(?<=[.!?])\s+|\n+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 12);
  if (!chunks.length) return points.length ? points : [q.fullAnswer];
  return chunks.slice(0, 8);
}

function coverage(transcript: string, point: string) {
  const source = importantTokens(point, 9);
  if (!source.length) return 0;
  const spoken = new Set(importantTokens(transcript, 240).map((x) => x.key));
  return source.filter((x) => spoken.has(x.key)).length / source.length;
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

function status(c: number) {
  if (c >= 0.62) return { icon: "✅", label: "pokryte", cls: "border-[#516547] bg-[#172016] text-[#bfd0b1]" };
  if (c >= 0.28) return { icon: "🟡", label: "częściowo", cls: "border-amber-900/50 bg-amber-950/10 text-amber-100" };
  return { icon: "❌", label: "brak", cls: "border-red-950/70 bg-red-950/10 text-red-100" };
}

export default function AdaptiveExaminer({ questions, progress, onRate, onExit }: Props) {
  const [question, setQuestion] = useState<OralCoachQuestion | null>(() => weightedPick(questions, progress));
  const [phase, setPhase] = useState<Phase>("ready");
  const [mainTranscript, setMainTranscript] = useState("");
  const [followTranscript, setFollowTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [micSupported, setMicSupported] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState("");
  const [pressure, setPressure] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const chunks = useMemo(() => question ? sourceChunks(question) : [], [question]);
  const mainAnalysis = useMemo(() => chunks.map((point) => ({ point, coverage: coverage(mainTranscript, point) })), [chunks, mainTranscript]);
  const weakest = useMemo(() => [...mainAnalysis].sort((a, b) => a.coverage - b.coverage)[0], [mainAnalysis]);
  const combinedTranscript = `${mainTranscript} ${followTranscript}`.trim();
  const finalAnalysis = useMemo(() => chunks.map((point) => ({ point, coverage: coverage(combinedTranscript, point) })), [chunks, combinedTranscript]);
  const mainScore = mainAnalysis.length ? Math.round(mainAnalysis.reduce((sum, x) => sum + x.coverage, 0) / mainAnalysis.length * 100) : 0;
  const finalScore = finalAnalysis.length ? Math.round(finalAnalysis.reduce((sum, x) => sum + x.coverage, 0) / finalAnalysis.length * 100) : 0;
  const followAnchors = useMemo(() => weakest ? importantTokens(weakest.point, 4).map((x) => x.raw) : [], [weakest]);
  const currentLimit = phase === "main" ? 45 : phase === "followup" ? 20 : null;

  useEffect(() => {
    const w = window as typeof window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    setMicSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => recognitionRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!pressure || startedAt === null || currentLimit === null || (phase !== "main" && phase !== "followup")) return;
    const tick = () => {
      const value = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(value);
      if (value >= currentLimit) {
        if (phase === "main") finishMain();
        else finishFollowup();
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [pressure, startedAt, currentLimit, phase]);

  function setupRecognition(target: "main" | "follow") {
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
      if (finalText) {
        const setter = target === "main" ? setMainTranscript : setFollowTranscript;
        setter((prev) => `${prev} ${finalText}`.replace(/\s+/g, " ").trim());
      }
      setInterim(interimText);
    };
    rec.onerror = (event) => {
      setMicError(event.error === "not-allowed" ? "Brak zgody na mikrofon. Możesz kontynuować bez niego i wpisać odpowiedź ręcznie." : "Mikrofon został przerwany. Możesz dokończyć odpowiedź ręcznie.");
      setMicActive(false);
    };
    rec.onend = () => setMicActive(false);
    return rec;
  }

  function begin(which: "main" | "follow", withMic: boolean) {
    setInterim("");
    setMicError("");
    setElapsed(0);
    setStartedAt(Date.now());
    setPhase(which === "main" ? "main" : "followup");
    if (!withMic) return;
    const rec = setupRecognition(which);
    if (!rec) {
      setMicError("Ta przeglądarka nie udostępnia rozpoznawania mowy. Odpowiadaj na głos i po próbie wpisz słowa kluczowe.");
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

  function stopRecognition() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setMicActive(false);
    setInterim("");
    setStartedAt(null);
  }

  function finishMain() {
    stopRecognition();
    setPhase("followupReady");
  }

  function finishFollowup() {
    stopRecognition();
    setPhase("review");
  }

  function nextQuestion() {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setQuestion(weightedPick(questions, progress, question?.id) ?? null);
    setPhase("ready");
    setMainTranscript("");
    setFollowTranscript("");
    setInterim("");
    setMicActive(false);
    setMicError("");
    setElapsed(0);
    setStartedAt(null);
  }

  function rateAndNext(r: Rating) {
    if (question) onRate(question.id, r);
    nextQuestion();
  }

  if (!question) {
    return <div className="space-y-4"><button onClick={onExit} className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold">← Menu Etapu II</button><div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">Brak pytań teoretycznych.</div></div>;
  }

  const timerLeft = currentLimit === null ? elapsed : Math.max(0, currentLimit - elapsed);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onExit} className="rounded-xl border border-[#46533f] bg-[#11150f] px-4 py-2 text-sm font-bold text-[#bdc9b2]">← Menu Etapu II</button>
        <div className="rounded-full border border-[#5d684f] bg-[#171d14] px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#b9c6ac]">LAB // KOMISJA ADAPTACYJNA</div>
      </div>

      <section className="rounded-[1.75rem] border border-[#526048] bg-[#12170f] p-5 sm:p-7">
        <div className="flex flex-wrap gap-2 text-xs text-[#87927f]"><span>TEORIA</span><span>•</span><span>{question.category}</span></div>
        <h1 className="mt-3 text-2xl font-black leading-tight text-white sm:text-4xl">{question.question}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9ca695]">Najpierw odpowiadasz na pytanie główne. Potem aplikacja wybiera najsłabiej pokryty element odpowiedzi i na jego podstawie formułuje dopytanie komisji.</p>
      </section>

      {phase === "ready" && (
        <section className="rounded-2xl border border-[#364231] bg-[#0f130d] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-white">Ustawienia próby</h2>
              <p className="mt-1 text-sm text-[#8f9988]">Tryb presji jest treningowy, nie oznacza oficjalnego limitu egzaminu.</p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[#3d4937] bg-[#11150f] px-4 py-3 text-sm text-[#b7c1ae]">
              <input type="checkbox" checked={pressure} onChange={(e) => setPressure(e.target.checked)} />
              Presja 45 s + 20 s
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => begin("main", true)} disabled={!micSupported} className="rounded-xl bg-[#c8cebd] px-5 py-3 text-sm font-black text-[#171b15] disabled:opacity-40">🎙 Odpowiadam z mikrofonem</button>
            <button onClick={() => begin("main", false)} className="rounded-xl border border-[#4b5843] px-5 py-3 text-sm font-bold text-[#b5c0aa]">Bez mikrofonu</button>
          </div>
        </section>
      )}

      {phase === "main" && (
        <section className="rounded-2xl border border-[#5b6a50] bg-[#141a12] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.18em] text-[#879877]">Odpowiedź główna</div><div className="mt-1 text-sm text-[#99a493]">{micActive ? "Mikrofon aktywny" : "Odpowiadasz"}</div></div><div className="font-mono text-3xl font-black text-[#d9e0d2]">{fmt(timerLeft)}</div></div>
          {(mainTranscript || interim) && <div className="mt-5 rounded-xl border border-[#303a2c] bg-[#0b0e0a] p-4 text-sm leading-6 text-neutral-300">{mainTranscript} <span className="text-neutral-500">{interim}</span></div>}
          {micError && <p className="mt-4 text-sm text-amber-200">{micError}</p>}
          <button onClick={finishMain} className="mt-5 rounded-xl bg-[#c8cebd] px-5 py-3 text-sm font-black text-[#171b15]">Kończę odpowiedź → dopytanie</button>
        </section>
      )}

      {phase === "followupReady" && (
        <section className="rounded-[1.75rem] border border-amber-900/50 bg-amber-950/10 p-5 sm:p-7">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-200/80">Komisja dopytuje</div>
          <h2 className="mt-3 text-xl font-black text-white sm:text-2xl">Rozwiń element odpowiedzi związany z:</h2>
          <div className="mt-4 flex flex-wrap gap-2">{followAnchors.map((x) => <span key={x} className="rounded-full border border-amber-900/50 bg-black/20 px-3 py-1.5 text-sm font-bold text-amber-100">{x}</span>)}</div>
          <p className="mt-4 text-sm leading-6 text-[#a99f87]">Dopytanie powstaje wyłącznie z elementu obecnego w odpowiedzi źródłowej, który w Twojej pierwszej wypowiedzi został pokryty najsłabiej.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => begin("follow", true)} disabled={!micSupported} className="rounded-xl bg-[#c8cebd] px-5 py-3 text-sm font-black text-[#171b15] disabled:opacity-40">🎙 Odpowiedz na dopytanie</button>
            <button onClick={() => begin("follow", false)} className="rounded-xl border border-[#665b3e] px-5 py-3 text-sm font-bold text-amber-100">Bez mikrofonu</button>
            <button onClick={() => setPhase("review")} className="rounded-xl border border-[#3d4937] px-5 py-3 text-sm font-bold text-[#aeb8a5]">Pomiń dopytanie</button>
          </div>
        </section>
      )}

      {phase === "followup" && (
        <section className="rounded-2xl border border-amber-900/50 bg-amber-950/10 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.18em] text-amber-200/80">Dopytanie komisji</div><div className="mt-1 text-sm text-[#aaa18c]">Rozwiń: {followAnchors.join(" • ")}</div></div><div className="font-mono text-3xl font-black text-amber-100">{fmt(timerLeft)}</div></div>
          {(followTranscript || interim) && <div className="mt-5 rounded-xl border border-amber-950/60 bg-black/20 p-4 text-sm leading-6 text-neutral-300">{followTranscript} <span className="text-neutral-500">{interim}</span></div>}
          <button onClick={finishFollowup} className="mt-5 rounded-xl bg-[#c8cebd] px-5 py-3 text-sm font-black text-[#171b15]">Kończę → raport</button>
        </section>
      )}

      {phase === "review" && (
        <>
          <section className="rounded-[1.75rem] border border-[#4b5943] bg-[#10140e] p-5 sm:p-7">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#819176]">Raport po odpowiedzi</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#35402f] bg-[#0b0e0a] p-4"><div className="text-3xl font-black text-white">{mainScore}%</div><div className="mt-1 text-xs uppercase tracking-[0.14em] text-[#74806d]">Przed dopytaniem</div></div>
              <div className="rounded-2xl border border-[#56654d] bg-[#172016] p-4"><div className="text-3xl font-black text-[#d7e0ce]">{finalScore}%</div><div className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8da07d]">Po dopytaniu</div></div>
              <div className="rounded-2xl border border-[#35402f] bg-[#0b0e0a] p-4"><div className="text-3xl font-black text-[#b8c8ab]">+{Math.max(0, finalScore - mainScore)} pp</div><div className="mt-1 text-xs uppercase tracking-[0.14em] text-[#74806d]">Odzyskane</div></div>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#77816f]">To heurystyka treningowa oparta na pojęciach z odpowiedzi źródłowej. Nie jest to ocena komisji ani analiza znaczenia wypowiedzi.</p>
          </section>

          <section className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5 sm:p-6">
            <h2 className="font-bold text-white">Pokrycie punktów odpowiedzi</h2>
            <div className="mt-4 space-y-3">{finalAnalysis.map((x, i) => { const st = status(x.coverage); return <div key={i} className={`rounded-xl border p-4 ${st.cls}`}><div className="flex gap-3"><span>{st.icon}</span><div><div className="text-xs font-black uppercase tracking-[0.13em] opacity-70">{st.label} • {Math.round(x.coverage * 100)}%</div><p className="mt-1 text-sm leading-6">{x.point}</p></div></div></div>; })}</div>
          </section>

          <section className="rounded-2xl border border-[#343f30] bg-[#0f130d] p-5 sm:p-6">
            <details><summary className="cursor-pointer font-bold text-[#c9d1c1]">Pokaż pełną odpowiedź źródłową</summary><p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-300">{question.fullAnswer}</p></details>
          </section>

          <section className="rounded-2xl border border-[#3e4938] bg-[#11150f] p-5 sm:p-6">
            <h2 className="font-bold text-white">Jak poszłoby Ci przed komisją?</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{([0,1,2,3,4] as Rating[]).map((r) => <button key={r} onClick={() => rateAndNext(r)} className="rounded-xl border border-[#43503d] bg-[#0b0e0a] px-3 py-3 text-left text-xs text-[#b7c1ae] hover:border-[#718166]"><b className="mr-2 text-base text-white">{r}</b>{["Nie wiem","Słabo","Z pomocą","Samodzielnie","Płynnie"][r]}</button>)}</div>
          </section>
        </>
      )}
    </div>
  );
}

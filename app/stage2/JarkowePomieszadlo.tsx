"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Rating = 0 | 1 | 2;
type Day = 1 | 2;
type Screen = "dashboard" | "study" | "browse";

type StoryPanel = { icon: string; title: string; caption: string };
type FlashCard = {
  id: string;
  category: string;
  question: string;
  answer: string;
  mnemonic: string;
  warning: string;
  source: string;
  day1Block: number;
  story?: StoryPanel[];
};
type DeckData = { title: string; version: number; source: string; cards: FlashCard[] };
type CardProgress = {
  rating: Rating;
  seen: number;
  streak: number;
  day1Done: boolean;
  day2Done: boolean;
  updatedAt: number;
};
type Progress = Record<string, CardProgress>;
type SessionKind = "block" | "weak" | "mix" | "exam" | "traps";

const LS = "officer_stage2_jarkowe_v1";
const DATA_PARTS = [
  "/stage2/jarkowe_v1_01.txt",
  "/stage2/jarkowe_v1_02.txt",
  "/stage2/jarkowe_v1_03.txt",
  "/stage2/jarkowe_v1_04.txt",
  "/stage2/jarkowe_v1_05.txt",
  "/stage2/jarkowe_v1_06.txt",
  "/stage2/jarkowe_v1_07.txt",
  "/stage2/jarkowe_v1_08.txt",
];

const blockMeta: Record<number, { title: string; subtitle: string }> = {
  1: { title: "OPBMR + wykorzystanie doświadczeń", subtitle: "O01-O10 + D01-D03 • pojęcia i kolejność czynności" },
  2: { title: "Szkolenie strzeleckie I", subtitle: "S01-S15 • budowa, dane, amunicja" },
  3: { title: "Szkolenie strzeleckie II", subtitle: "S16-S30 • bezpieczeństwo, zasady i sprzęt" },
  4: { title: "Taktyka + POPL", subtitle: "T01-T06 + P01-P05 • definicja → elementy → różnice" },
  5: { title: "Prawo konfliktów zbrojnych", subtitle: "M01-M15 • zasada → chronieni → zakaz / wyjątek" },
  6: { title: "Historia I", subtitle: "H01-H13 • przyczyna → przebieg → skutek" },
  7: { title: "Historia II", subtitle: "H14-H26 • przyczyna → przebieg → skutek" },
  8: { title: "Historia III", subtitle: "H27-H39 • przyczyna → przebieg → skutek" },
  9: { title: "Historia IV", subtitle: "H40-H50 • przyczyna → przebieg → skutek" },
};

const categoryVisual: Record<string, { icon: string; label: string }> = {
  "OPBMR": { icon: "☣️", label: "ochrona" },
  "Historia": { icon: "🏛️", label: "oś czasu" },
  "Taktyka": { icon: "🧭", label: "teren i decyzja" },
  "POPL": { icon: "🛡️", label: "obrona" },
  "Prawo konfliktów zbrojnych": { icon: "⚖️", label: "zasada i wyjątek" },
  "Szkolenie strzeleckie": { icon: "🎯", label: "sprzęt i bezpieczeństwo" },
  "Wykorzystanie doświadczeń": { icon: "🔁", label: "obserwacja i poprawa" },
};

const categoryOrder = [
  "OPBMR",
  "Historia",
  "Taktyka",
  "POPL",
  "Prawo konfliktów zbrojnych",
  "Szkolenie strzeleckie",
  "Wykorzystanie doświadczeń",
];

function shuffle<T>(items: T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function interleave(cards: FlashCard[]) {
  const groups = new Map<string, FlashCard[]>();
  for (const card of shuffle(cards)) {
    const arr = groups.get(card.category) ?? [];
    arr.push(card);
    groups.set(card.category, arr);
  }
  const keys = shuffle([...groups.keys()]);
  const out: FlashCard[] = [];
  let last = "";
  while ([...groups.values()].some((x) => x.length)) {
    const candidates = keys.filter((k) => (groups.get(k)?.length ?? 0) > 0 && k !== last);
    const pool = candidates.length ? candidates : keys.filter((k) => (groups.get(k)?.length ?? 0) > 0);
    const key = pool[Math.floor(Math.random() * pool.length)];
    const arr = groups.get(key)!;
    out.push(arr.shift()!);
    last = key;
  }
  return out;
}

function weightedMix(cards: FlashCard[], progress: Progress, count: number) {
  const scored = cards.map((card) => {
    const p = progress[card.id];
    let weight = 2;
    if (!p) weight = 7;
    else if (p.rating === 0) weight = 8;
    else if (p.rating === 1) weight = 6;
    else if (p.streak < 2) weight = 4;
    else weight = 1;
    return { card, key: Math.random() ** (1 / weight) };
  });
  const picked = scored.sort((a, b) => b.key - a.key).slice(0, Math.min(count, cards.length)).map((x) => x.card);
  return interleave(picked);
}

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function skeleton(category: string) {
  if (category === "Historia") return "KIEDY → CO SIĘ STAŁO → DLACZEGO TO WAŻNE";
  if (category === "Szkolenie strzeleckie") return "DO CZEGO → CZĘŚCI → DZIAŁANIE → DANE / BEZPIECZEŃSTWO";
  if (category === "Prawo konfliktów zbrojnych") return "ZASADA → KOGO / CO CHRONI → ZAKAZ LUB WYJĄTEK";
  if (category === "OPBMR") return "CO TO JEST → Z CZEGO SIĘ SKŁADA → CO ROBIĘ PO KOLEI";
  if (category === "Taktyka") return "DEFINICJA → ELEMENTY → RÓŻNICA / PRZYKŁAD";
  if (category === "POPL") return "DEFINICJA → AKTYWNE / PASYWNE → PRZYKŁAD";
  return "CO TO JEST → PO CO → KOLEJNOŚĆ";
}

async function loadDeck(): Promise<DeckData> {
  if (!("DecompressionStream" in window)) throw new Error("Użyj aktualnego Chrome, Edge albo Firefox.");
  const parts = await Promise.all(DATA_PARTS.map(async (url) => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Brak pliku ${url}`);
    return response.text();
  }));
  const encoded = parts.join("").replace(/\s+/g, "");
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const data = JSON.parse(await new Response(stream).text()) as DeckData;
  if (data.cards.length !== 119) throw new Error("Pytania główne: baza nie ma 119 pytań.");
  const expected: Record<string, number> = {
    OPBMR: 10,
    Historia: 50,
    Taktyka: 6,
    POPL: 5,
    "Prawo konfliktów zbrojnych": 15,
    "Szkolenie strzeleckie": 30,
    "Wykorzystanie doświadczeń": 3,
  };
  const ids = new Set<string>();
  const counts: Record<string, number> = {};
  for (const card of data.cards) {
    if (!card.id || !card.category || !card.question || !card.answer || !card.mnemonic || !card.day1Block) {
      throw new Error(`Pytania główne: niepełna karta ${card.id || "bez kodu"}.`);
    }
    if (ids.has(card.id)) throw new Error(`Pytania główne: powtórzony kod ${card.id}.`);
    ids.add(card.id);
    counts[card.category] = (counts[card.category] ?? 0) + 1;
  }
  for (const [category, count] of Object.entries(expected)) {
    if (counts[category] !== count) throw new Error(`Pytania główne: zła liczba kart w dziale ${category}.`);
  }
  return data;
}

export default function JarkowePomieszadlo({ onExit }: { onExit: () => void }) {
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [progress, setProgress] = useState<Progress>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [day, setDay] = useState<Day>(1);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [queue, setQueue] = useState<string[]>([]);
  const [initialIds, setInitialIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(false);
  const [sessionKind, setSessionKind] = useState<SessionKind>("block");
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionStarted, setSessionStarted] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [examTimerEnabled, setExamTimerEnabled] = useState(true);
  const [questionStarted, setQuestionStarted] = useState<number | null>(null);
  const [questionRemaining, setQuestionRemaining] = useState(60);
  const [browseCategory, setBrowseCategory] = useState("Wszystkie");
  const [error, setError] = useState("");
  const byId = useMemo(() => new Map((deck?.cards ?? []).map((c) => [c.id, c])), [deck]);
  const current = queue.length ? byId.get(queue[0]) ?? null : null;

  useEffect(() => {
    loadDeck().then(setDeck).catch((e) => setError(e?.message || "Nie udało się wczytać pytań głównych."));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) setProgress(JSON.parse(raw));
    } catch {}
    setProgressLoaded(true);
  }, []);

  useEffect(() => {
    if (progressLoaded) localStorage.setItem(LS, JSON.stringify(progress));
  }, [progress, progressLoaded]);

  useEffect(() => {
    if (!sessionStarted || screen !== "study") return;
    const tick = () => setElapsed(Math.floor((Date.now() - sessionStarted) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [sessionStarted, screen]);

  useEffect(() => {
    if (screen !== "study" || sessionKind !== "exam" || !examTimerEnabled || !current || revealed) return;
    const started = questionStarted ?? Date.now();
    if (!questionStarted) setQuestionStarted(started);
    const tick = () => setQuestionRemaining(Math.max(0, 60 - Math.floor((Date.now() - started) / 1000)));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [screen, sessionKind, examTimerEnabled, current, revealed, questionStarted]);

  const stats = useMemo(() => {
    const cards = deck?.cards ?? [];
    let unseen = 0, weak = 0, partial = 0, strong = 0, mastered = 0;
    for (const card of cards) {
      const p = progress[card.id];
      if (!p) unseen++;
      else if (p.rating === 0) weak++;
      else if (p.rating === 1) partial++;
      else strong++;
      if (p?.streak >= 2 && p.day2Done) mastered++;
    }
    return { total: cards.length, unseen, weak, partial, strong, mastered };
  }, [deck, progress]);

  const day1Done = useMemo(() => (deck?.cards ?? []).filter((c) => progress[c.id]?.day1Done).length, [deck, progress]);
  const day2Done = useMemo(() => (deck?.cards ?? []).filter((c) => progress[c.id]?.day2Done).length, [deck, progress]);
  const ratedWeakCards = useMemo(() => (deck?.cards ?? []).filter((c) => {
    const rating = progress[c.id]?.rating;
    return rating === 0 || rating === 1;
  }), [deck, progress]);
  const trapCards = useMemo(() => (deck?.cards ?? []).filter((c) => c.warning || /\d/.test(c.answer)), [deck]);
  const nextDay1Block = useMemo(() => {
    if (!deck) return null;
    for (let block = 1; block <= 9; block++) {
      if (deck.cards.some((c) => c.day1Block === block && !progress[c.id]?.day1Done)) return block;
    }
    return null;
  }, [deck, progress]);
  const browseCards = useMemo(() => {
    const cards = deck?.cards ?? [];
    return browseCategory === "Wszystkie" ? cards : cards.filter((c) => c.category === browseCategory);
  }, [deck, browseCategory]);

  function begin(cards: FlashCard[], kind: SessionKind, title: string, targetDay: Day) {
    if (!cards.length) return;
    const ordered = kind === "block" ? shuffle(cards) : kind === "mix" ? interleave(cards) : shuffle(cards);
    setDay(targetDay);
    setQueue(ordered.map((c) => c.id));
    setInitialIds(ordered.map((c) => c.id));
    setAttempts({});
    setRevealed(false);
    setHint(false);
    setSessionKind(kind);
    setSessionTitle(title);
    setSessionStarted(Date.now());
    setElapsed(0);
    setQuestionStarted(Date.now());
    setQuestionRemaining(60);
    setScreen("study");
  }

  function startBlock(block: number) {
    if (!deck) return;
    const cards = deck.cards.filter((c) => c.day1Block === block);
    begin(cards, "block", `Dzień 1 • blok ${block}: ${blockMeta[block].title}`, 1);
  }

  function startWeak() {
    begin(interleave(ratedWeakCards), "weak", "Ratuj słabe • tylko oceny 0 i 1", day);
  }

  function startMix(count: 10 | 20 | 30 = 20) {
    if (!deck) return;
    begin(weightedMix(deck.cards, progress, count), "mix", `Pytania główne — seria mieszana ${count}`, 2);
  }

  function startExam() {
    if (!deck) return;
    begin(interleave(shuffle(deck.cards).slice(0, 10)), "exam", "Próbny egzamin • 10 losowych pytań", 2);
  }

  function startTraps() {
    if (!trapCards.length) return;
    begin(weightedMix(trapCards, progress, Math.min(30, trapCards.length)), "traps", "Pułapki, liczby i miejsca do potwierdzenia", 2);
  }

  function continueLearning() {
    if (!deck) return;
    if (day === 1) {
      if (nextDay1Block) startBlock(nextDay1Block);
      else if (ratedWeakCards.length) begin(interleave(ratedWeakCards), "weak", "Dzień 1 • ratuj oceny 0 i 1", 1);
      else startMix(20);
      return;
    }
    if (ratedWeakCards.length) startWeak();
    else startMix(20);
  }

  const rate = useCallback((rating: Rating) => {
    if (!current) return;
    const nextAttempt = (attempts[current.id] ?? 0) + 1;
    setAttempts((a) => ({ ...a, [current.id]: nextAttempt }));
    setProgress((p) => ({
      ...p,
      [current.id]: {
        rating,
        seen: (p[current.id]?.seen ?? 0) + 1,
        streak: rating === 2 ? Math.min(2, (p[current.id]?.streak ?? 0) + 1) : 0,
        day1Done: p[current.id]?.day1Done || day === 1,
        day2Done: p[current.id]?.day2Done || day === 2,
        updatedAt: Date.now(),
      },
    }));

    const rest = queue.slice(1);
    if (sessionKind !== "exam" && rating < 2 && nextAttempt < 3) {
      const distance = rating === 0 ? 4 : 8;
      const pos = Math.min(distance, rest.length);
      rest.splice(pos, 0, current.id);
    }
    setQueue(rest);
    setRevealed(false);
    setHint(false);
    setQuestionStarted(Date.now());
    setQuestionRemaining(60);
  }, [attempts, current, day, queue, sessionKind]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (screen !== "study" || !current) return;
      if (event.code === "Space") {
        event.preventDefault();
        setRevealed((v) => !v);
        return;
      }
      if (!revealed) return;
      if (event.key === "0") rate(0);
      if (event.key === "1") rate(1);
      if (event.key === "2") rate(2);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, current, revealed, rate]);

  if (error) return <div className="rounded-2xl border border-red-900 bg-red-950/20 p-5 text-red-200">{error}</div>;
  if (!deck) return <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">Wczytuję 119 pytań głównych…</div>;

  if (screen === "browse") {
    return <div className="space-y-5">
      <section className="rounded-[1.75rem] border border-violet-700/50 bg-gradient-to-br from-violet-950/60 via-neutral-900 to-neutral-950 p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><div className="font-mono text-xs font-black uppercase tracking-[.2em] text-violet-300">119 KART // PEŁNY SPIS</div><h2 className="mt-2 text-3xl font-black">Wszystkie fiszki</h2><p className="mt-2 text-sm text-neutral-400">Wybierz dział i wejdź w dowolną kartę. Odpowiedź nadal pozostaje zakryta, dopóki sam jej nie odsłonisz.</p></div>
          <button onClick={() => setScreen("dashboard")} className="rounded-xl border border-violet-700/60 px-4 py-2 text-sm font-bold text-violet-100">← Wróć</button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{["Wszystkie", ...categoryOrder].map((category) => <button key={category} onClick={() => setBrowseCategory(category)} className={`rounded-full border px-3 py-2 text-xs font-bold ${browseCategory === category ? "border-violet-500 bg-violet-950/60 text-violet-100" : "border-neutral-700 bg-neutral-950 text-neutral-400"}`}>{category}</button>)}</div>
      </section>
      <section className="grid gap-2 md:grid-cols-2">{browseCards.map((card) => {
        const p = progress[card.id];
        const status = p ? `${p.rating} • ${p.rating === 0 ? "nie wiem" : p.rating === 1 ? "częściowo" : "umiem"}` : "niepoznana";
        return <button key={card.id} onClick={() => begin([card], "mix", `Wszystkie fiszki • ${card.category}`, day)} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-left transition hover:border-violet-700">
          <div className="flex items-start justify-between gap-3"><div><div className="font-mono text-xs font-black text-violet-300">{card.id} • {card.category}</div><div className="mt-2 text-sm font-bold leading-5 text-white">{card.question}</div></div><span className="shrink-0 rounded-full border border-neutral-700 px-2.5 py-1 text-[10px] font-bold text-neutral-400">{status}</span></div>
        </button>;
      })}</section>
    </div>;
  }

  if (screen === "study") {
    if (!current) {
      const uniqueDone = initialIds.filter((id) => progress[id]?.[day === 1 ? "day1Done" : "day2Done"]).length;
      return <div className="space-y-5">
        <section className="rounded-[1.75rem] border border-violet-700/50 bg-gradient-to-br from-violet-950/60 via-neutral-900 to-neutral-950 p-7">
          <div className="font-mono text-xs font-black uppercase tracking-[.2em] text-violet-300">SESJA ZAKOŃCZONA</div>
          <h2 className="mt-3 text-3xl font-black">Dobra robota. Teraz nie czytaj wszystkiego od nowa.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300">W tej sesji przeszedłeś {initialIds.length} kart bazowych. Słabe odpowiedzi wracały po kilku innych pytaniach, więc trenowałeś odtwarzanie, a nie rozpoznawanie tekstu.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setScreen("dashboard")} className="rounded-xl bg-white px-5 py-3 text-sm font-black text-neutral-950">Wróć do planu</button>
            {day === 2 && <button onClick={() => startMix(20)} className="rounded-xl border border-violet-600 bg-violet-950/40 px-5 py-3 text-sm font-black text-violet-100">Jeszcze 20 pomieszanych</button>}
          </div>
          <div className="mt-4 text-xs text-neutral-500">Czas sesji: {formatTime(elapsed)} • zaliczone w tym dniu: {uniqueDone}/119</div>
        </section>
      </div>;
    }

    const visual = categoryVisual[current.category] ?? { icon: "🧠", label: "skojarzenie" };
    const doneBase = initialIds.filter((id) => id !== current.id && !queue.includes(id)).length;
    const basePct = Math.min(100, Math.round((doneBase / Math.max(1, initialIds.length)) * 100));

    return <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-xs font-black uppercase tracking-[.18em] text-violet-300">{sessionTitle}</div>
          <div className="mt-1 text-xs text-neutral-500">Space = pokaż/ukryj • po odsłonięciu klawisze 0 / 1 / 2</div>
        </div>
        <div className="flex gap-2">
          {sessionKind === "exam" && examTimerEnabled && <span className={`rounded-xl border px-3 py-2 font-mono text-xs font-black ${questionRemaining === 0 ? "border-red-800 bg-red-950/40 text-red-200" : "border-amber-800 bg-amber-950/30 text-amber-200"}`}>{questionRemaining === 0 ? "CZAS" : `${questionRemaining} s`}</span>}
          <span className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-300">{formatTime(elapsed)}</span>
          <button onClick={() => setScreen("dashboard")} className="rounded-xl border border-neutral-700 px-3 py-2 text-xs font-bold">Przerwij</button>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-900"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${basePct}%` }} /></div>

      <section className="overflow-hidden rounded-[1.75rem] border border-neutral-700 bg-[#151515] shadow-2xl shadow-black/20">
        <div className="border-b border-neutral-800 bg-neutral-900/70 px-5 py-4 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-neutral-700 bg-neutral-950 text-2xl">{visual.icon}</span>
              <div><div className="font-mono text-xs font-black text-violet-300">{current.id}</div><div className="text-xs font-bold text-neutral-500">{current.category}</div></div>
            </div>
            <span className="rounded-full border border-neutral-700 px-3 py-1.5 text-[11px] font-bold text-neutral-400">próba {(attempts[current.id] ?? 0) + 1}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="text-[11px] font-black uppercase tracking-[.18em] text-neutral-500">PYTANIE // ODPOWIEDZ NA GŁOS</div>
          <h2 className="mt-3 max-w-[50ch] text-2xl font-black leading-tight text-white sm:text-3xl">{current.question}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">Nie próbuj recytować. Najpierw odpowiedz własnymi słowami i dopiero potem odsłoń kartę.</p>

          {!revealed && <div className="mt-6 space-y-3">
            <button onClick={() => setRevealed(true)} className="w-full rounded-2xl bg-white px-5 py-4 text-base font-black text-neutral-950 hover:bg-neutral-200">Odpowiedziałem — pokaż odpowiedź</button>
            <button onClick={() => setHint((v) => !v)} className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm font-bold text-neutral-300 hover:border-neutral-600">{hint ? "Ukryj hak" : "Utknąłem — daj tylko strukturę odpowiedzi"}</button>
            {hint && <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-4"><div className="text-[10px] font-black uppercase tracking-[.16em] text-amber-300">HAK, NIE ODPOWIEDŹ</div><div className="mt-2 font-mono text-sm font-black text-amber-100">{skeleton(current.category)}</div></div>}
          </div>}

          {revealed && <div className="mt-7 space-y-4">
            <div className="rounded-2xl border-2 border-[#829372] bg-[#edf2e8] p-5 text-[#172015] sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-[.18em] text-[#627257]">RDZEŃ ODPOWIEDZI</div>
              <p className="mt-3 whitespace-pre-line text-[15px] font-semibold leading-7 sm:text-base">{current.answer}</p>
            </div>

            {current.story?.length ? <div className="rounded-2xl border border-violet-800/50 bg-violet-950/20 p-4 sm:p-5">
              <div className="text-[10px] font-black uppercase tracking-[.18em] text-violet-300">KOMIKS PAMIĘCIOWY</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">{current.story.map((panel, i) => <div key={i} className="relative rounded-2xl border border-violet-800/50 bg-neutral-950 p-4 text-center">
                <div className="text-4xl">{panel.icon}</div>
                <div className="mt-3 text-xs font-black text-white">{panel.title}</div>
                <div className="mt-1 text-[11px] leading-4 text-neutral-400">{panel.caption}</div>
                {i < current.story!.length - 1 && <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-xl text-violet-400 sm:block">→</div>}
              </div>)}</div>
            </div> : <div className="rounded-2xl border border-violet-800/50 bg-violet-950/20 p-5">
              <div className="flex gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-900/40 text-3xl">{visual.icon}</div><div><div className="text-[10px] font-black uppercase tracking-[.18em] text-violet-300">OBRAZ / SKOJARZENIE</div><p className="mt-2 text-sm font-semibold leading-6 text-violet-100">{current.mnemonic}</p></div></div>
            </div>}

            {current.warning && <div className="rounded-2xl border border-amber-800 bg-amber-950/30 p-4 text-sm leading-6 text-amber-100"><b>⚠️ Pułapka / rozbieżność:</b> {current.warning}</div>}

            <details className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-500"><summary className="cursor-pointer font-bold text-neutral-400">Źródło karty</summary><div className="mt-2 leading-5">{current.source}</div></details>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="mb-3 text-center text-xs font-bold uppercase tracking-[.14em] text-neutral-500">Jak poszło? Nie oszukuj skali.</div>
              <div className="grid gap-2 sm:grid-cols-3">
                <button onClick={() => rate(0)} className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-4 text-left hover:bg-red-950/50"><div className="text-xl font-black text-red-200">0</div><div className="text-sm font-bold text-red-100">Nie odtworzyłem</div><div className="mt-1 text-xs text-red-300/70">wróci po ~4 kartach</div></button>
                <button onClick={() => rate(1)} className="rounded-xl border border-amber-900 bg-amber-950/20 px-4 py-4 text-left hover:bg-amber-950/40"><div className="text-xl font-black text-amber-200">1</div><div className="text-sm font-bold text-amber-100">Pamiętałem część</div><div className="mt-1 text-xs text-amber-300/70">wróci po ~8 kartach</div></button>
                <button onClick={() => rate(2)} className="rounded-xl border border-emerald-900 bg-emerald-950/20 px-4 py-4 text-left hover:bg-emerald-950/40"><div className="text-xl font-black text-emerald-200">2</div><div className="text-sm font-bold text-emerald-100">Powiedziałem sam</div><div className="mt-1 text-xs text-emerald-300/70">odkładamy do kontroli</div></button>
              </div>
            </div>
          </div>}
        </div>
      </section>
    </div>;
  }

  return <div className="space-y-5">
    <section className="overflow-hidden rounded-[1.8rem] border border-violet-700/50 bg-gradient-to-br from-violet-950/70 via-[#17131d] to-neutral-950 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-mono text-xs font-black uppercase tracking-[.22em] text-violet-300">ETAP II // GŁÓWNA BAZA</div>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Pytania główne</h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-neutral-300 sm:text-base">119 aktualnych pytań Etapu II. Najpierw próbujesz odtworzyć odpowiedź, potem dostajesz poprawny rdzeń, skojarzenie i — tam gdzie pomaga — prosty obraz lub mini-komiks. Postęp tej bazy jest oddzielony od starych pytań i zestawów.</p>
        </div>
        <button onClick={onExit} className="rounded-xl border border-violet-700/60 bg-black/20 px-4 py-2 text-sm font-bold text-violet-100">← Menu Etapu II</button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {[["Wszystkie", stats.total], ["Niepoznane", stats.unseen], ["0 — nie wiem", stats.weak], ["1 — częściowo", stats.partial], ["2 — sam", stats.strong], ["Opanowane", stats.mastered]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-violet-900/50 bg-black/20 p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-violet-300/70">{label}</div><div className="mt-1 text-2xl font-black text-white">{value}</div></div>)}
      </div>
    </section>

    <div className="grid gap-2 sm:grid-cols-2">
      <button onClick={() => setDay(1)} className={`rounded-2xl border p-5 text-left transition ${day === 1 ? "border-violet-500 bg-violet-950/40" : "border-neutral-800 bg-neutral-900"}`}><div className="text-xs font-black uppercase tracking-[.16em] text-violet-300">DZIEŃ 1</div><div className="mt-1 text-xl font-black">Przejdź wszystkie 119</div><div className="mt-2 text-sm text-neutral-400">9 bloków • 5 min przypomnienie → 25 min nowe → 10 min odtwarzanie</div><div className="mt-3 font-mono text-xs text-neutral-500">{day1Done}/119 zaliczone przynajmniej raz</div></button>
      <button onClick={() => setDay(2)} className={`rounded-2xl border p-5 text-left transition ${day === 2 ? "border-violet-500 bg-violet-950/40" : "border-neutral-800 bg-neutral-900"}`}><div className="text-xs font-black uppercase tracking-[.16em] text-violet-300">DZIEŃ 2</div><div className="mt-1 text-xl font-black">Odzyskaj z pamięci i pomieszaj</div><div className="mt-2 text-sm text-neutral-400">Najpierw 0/1 → potem mieszane działy → próbne serie po 10</div><div className="mt-3 font-mono text-xs text-neutral-500">{day2Done}/119 sprawdzone dnia 2</div></button>
    </div>

    <section className="rounded-[1.6rem] border border-violet-700/50 bg-gradient-to-r from-violet-950/35 via-neutral-900 to-neutral-900 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><div className="font-mono text-xs font-black uppercase tracking-[.18em] text-violet-300">TWÓJ NASTĘPNY KROK</div><div className="mt-1 text-lg font-black">{day === 1 ? (nextDay1Block ? `Blok ${nextDay1Block} z 9` : ratedWeakCards.length ? "Ratuj oceny 0 i 1" : "Pierwsze przejście zakończone") : ratedWeakCards.length ? `${ratedWeakCards.length} kart z oceną 0 lub 1` : "Mieszanie wszystkich działów"}</div></div><div className="min-w-[180px] flex-1 sm:max-w-sm"><div className="mb-2 flex justify-between font-mono text-[11px] text-neutral-400"><span>{day1Done}/119 poznanych</span><span>{Math.round(day1Done / 119 * 100)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-neutral-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.round(day1Done / 119 * 100)}%` }} /></div></div></div>
      <button onClick={continueLearning} className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-base font-black text-neutral-950 hover:bg-neutral-200">KONTYNUUJ NAUKĘ →</button>
    </section>

    {day === 1 ? <section className="rounded-[1.6rem] border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="font-mono text-xs font-black uppercase tracking-[.18em] text-violet-300">PLAN // DZIEŃ 1</div><h3 className="mt-1 text-2xl font-black">9 bloków, żeby nie utknąć na pierwszym dziale</h3></div><div className="text-xs text-neutral-500">Po blokach 3 i 6 zrób dłuższą przerwę.</div></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{Object.entries(blockMeta).map(([key, meta]) => {
        const block = Number(key);
        const cards = deck.cards.filter((c) => c.day1Block === block);
        const done = cards.filter((c) => progress[c.id]?.day1Done).length;
        return <button key={block} onClick={() => startBlock(block)} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-left transition hover:border-violet-700">
          <div className="flex items-start justify-between gap-3"><div><div className="font-mono text-xs font-black text-violet-300">BLOK {block}</div><div className="mt-1 font-black text-white">{meta.title}</div></div><span className="rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] font-bold text-neutral-400">{done}/{cards.length}</span></div>
          <p className="mt-2 text-xs leading-5 text-neutral-500">{meta.subtitle}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-800"><div className="h-full bg-violet-500" style={{ width: `${Math.round(done / Math.max(1, cards.length) * 100)}%` }} /></div>
        </button>;
      })}</div>
    </section> : <section className="rounded-[1.6rem] border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
      <div className="font-mono text-xs font-black uppercase tracking-[.18em] text-violet-300">PLAN // DZIEŃ 2</div>
      <h3 className="mt-1 text-2xl font-black">Nie czytamy od początku. Wydobywamy odpowiedzi z głowy.</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <button disabled={!ratedWeakCards.length} onClick={startWeak} className="rounded-2xl border border-red-900/50 bg-red-950/15 p-5 text-left hover:border-red-700 disabled:cursor-not-allowed disabled:opacity-45"><div className="text-2xl">🧯</div><div className="mt-2 text-lg font-black">1. Ratuj 0 i 1</div><p className="mt-2 text-sm leading-6 text-neutral-400">{ratedWeakCards.length ? `${ratedWeakCards.length} kart ma dokładnie ocenę 0 lub 1. Po błędzie wrócą później, nie od razu.` : "Nie masz teraz żadnych kart z oceną 0 lub 1."}</p></button>
        <div className="rounded-2xl border border-violet-800/60 bg-violet-950/20 p-5 text-left"><div className="text-2xl">🌀</div><div className="mt-2 text-lg font-black">2. Pomieszadło</div><p className="mt-2 text-sm leading-6 text-neutral-400">Wybierz długość. Słabe karty mają większą szansę wejścia, ale działy są przeplatane.</p><div className="mt-4 grid grid-cols-3 gap-2">{([10, 20, 30] as const).map((count) => <button key={count} onClick={() => startMix(count)} className="rounded-xl border border-violet-700 bg-violet-950/50 px-3 py-2 text-sm font-black text-violet-100 hover:bg-violet-900/50">{count}</button>)}</div></div>
        <div className="rounded-2xl border border-neutral-700 bg-neutral-950 p-5 text-left"><div className="text-2xl">🎓</div><div className="mt-2 text-lg font-black">3. Próbny egzamin — 10</div><p className="mt-2 text-sm leading-6 text-neutral-400">Odpowiadasz jak przed komisją, potem odsłaniasz odpowiedź i oceniasz się.</p><label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-bold text-neutral-400"><input type="checkbox" checked={examTimerEnabled} onChange={(e) => setExamTimerEnabled(e.target.checked)} className="h-4 w-4 accent-violet-500" /> minutnik 60 s na pytanie</label><button onClick={startExam} className="mt-4 w-full rounded-xl border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm font-black hover:border-neutral-400">Rozpocznij</button></div>
        <button onClick={startTraps} className="rounded-2xl border border-amber-900/60 bg-amber-950/15 p-5 text-left hover:border-amber-700"><div className="text-2xl">⚠️</div><div className="mt-2 text-lg font-black">4. Pułapki Jarka</div><p className="mt-2 text-sm leading-6 text-neutral-400">Parametry, daty oraz karty z uwagami o rozbieżnościach źródeł. To zostawiamy na końcowe doszlifowanie.</p></button>
      </div>
    </section>}

    <section className="grid gap-3 md:grid-cols-2">
      <button onClick={() => setScreen("browse")} className="rounded-2xl border border-neutral-700 bg-neutral-900 p-5 text-left hover:border-violet-700"><div className="text-2xl">🗂️</div><div className="mt-2 text-lg font-black">Wszystkie fiszki</div><p className="mt-2 text-sm leading-6 text-neutral-400">Pełne 119 kart z podziałem na działy. Możesz wejść bezpośrednio w dowolne pytanie.</p></button>
      {day === 1 && <button disabled={!ratedWeakCards.length} onClick={() => begin(interleave(ratedWeakCards), "weak", "Ratuj słabe • tylko oceny 0 i 1", 1)} className="rounded-2xl border border-red-900/50 bg-red-950/15 p-5 text-left hover:border-red-700 disabled:cursor-not-allowed disabled:opacity-45"><div className="text-2xl">🧯</div><div className="mt-2 text-lg font-black">Ratuj słabe</div><p className="mt-2 text-sm leading-6 text-neutral-400">{ratedWeakCards.length ? `${ratedWeakCards.length} kart z oceną 0 lub 1.` : "Pojawi się tutaj, gdy jakaś karta dostanie ocenę 0 lub 1."}</p></button>}
    </section>

    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><div className="text-xl">🧠</div><h3 className="mt-2 font-black">Najpierw odtwórz</h3><p className="mt-2 text-sm leading-6 text-neutral-400">Nie czytaj odpowiedzi dwa razy. Spróbuj powiedzieć ją na głos, nawet jeśli będzie niepełna. Dopiero potem sprawdź.</p></div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><div className="text-xl">⏱️</div><h3 className="mt-2 font-black">Błąd wraca z odstępem</h3><p className="mt-2 text-sm leading-6 text-neutral-400">Ocena 0 wraca po około 4 innych kartach, 1 po około 8. Dzięki temu nie odpowiadasz tylko dlatego, że przed chwilą czytałeś tekst.</p></div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><div className="text-xl">🔀</div><h3 className="mt-2 font-black">Dzień 2 naprawdę miesza</h3><p className="mt-2 text-sm leading-6 text-neutral-400">Historia przeplata się z prawem, taktyką i sprzętem. To jest trudniejsze w odczuciu, ale lepiej sprawdza, czy umiesz sam rozpoznać temat.</p></div>
    </section>

    <section className="rounded-2xl border border-[#4c5d43] bg-[#121911] p-5">
      <div className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-[#91a482]">ZASADA OPANOWANIA</div>
      <p className="mt-2 text-sm leading-6 text-[#bdc9b4]">Karta jest „opanowana” dopiero po dwóch kolejnych odpowiedziach na poziomie 2, z czego co najmniej jedna musi przypaść na Dzień 2. Samo obejrzenie odpowiedzi nie podnosi postępu.</p>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { if (confirm("Wyczyścić postęp pytań głównych? Stare pytania i zestawy pozostaną bez zmian.")) setProgress({}); }} className="rounded-xl border border-red-900/60 bg-red-950/20 px-4 py-2 text-xs font-black text-red-200">Resetuj pytania główne</button></div>
    </section>
  </div>;
}

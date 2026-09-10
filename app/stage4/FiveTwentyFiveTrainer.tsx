"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "525" | "5xc" | "quiz";
type VisualKind = "observe" | "dismount" | "under" | "ring5" | "ring25" | "report" | "check" | "confirm" | "clear" | "cordon" | "control";
type Step = { title: string; subtitle: string; detail: string; visual: VisualKind };

const LS_KEY = "officer_stage4_525_5xc_progress_v1";

const steps525: Step[] = [
  { title: "1. OBSERWUJ", subtitle: "Zatrzymaj pojazd i obserwuj teren", detail: "Po zatrzymaniu najpierw wykonaj kontrolę wzrokową rejonu. Zwróć uwagę na nietypowe przedmioty, przewody, ślady manipulacji i inne oznaki zagrożenia.", visual: "observe" },
  { title: "2. WYSIĄDŹ OSTROŻNIE", subtitle: "Dwóch wyznaczonych żołnierzy opuszcza pojazd", detail: "Przed postawieniem pierwszego kroku kontroluj podłoże. Po wyjściu utrzymuj obserwację i wykorzystuj pojazd jako osłonę.", visual: "dismount" },
  { title: "3. SPRAWDŹ MIEJSCE POSTOJU", subtitle: "Kontrola pod pojazdem i bezpośrednio wokół niego", detail: "Sprawdź spód pojazdu oraz teren tuż przy nim. Nie dotykaj podejrzanych przedmiotów i nie próbuj ich przemieszczać.", visual: "under" },
  { title: "4. STREFA 5 m", subtitle: "Przeszukaj najbliższy obszar", detail: "Rozszerz kontrolę na strefę około 5 m wokół pojazdu, działając metodycznie i sektorami.", visual: "ring5" },
  { title: "5. STREFA 25 m", subtitle: "Rozszerz przeszukanie", detail: "Po sprawdzeniu strefy 5 m rozszerz kontrolę do około 25 m, utrzymując ubezpieczenie i obserwację rejonu.", visual: "ring25" },
  { title: "6. MELDUNEK", subtitle: "CZYSTO / SPRAWDZONE", detail: "Po zakończeniu kontroli przekaż krótki meldunek. Jeżeli wykryjesz podejrzany przedmiot, przejdź do procedury 5xC.", visual: "report" },
];

const steps5xc: Step[] = [
  { title: "1. CHECK", subtitle: "Sprawdź i zgłoś", detail: "Zauważ podejrzany przedmiot i przekaż kierunek, odległość oraz krótki opis. Zachowaj dystans.", visual: "check" },
  { title: "2. CONFIRM", subtitle: "Potwierdź z bezpiecznej odległości", detail: "Potwierdzaj obserwacją. Nie dotykaj, nie przesuwaj i nie otwieraj podejrzanego przedmiotu.", visual: "confirm" },
  { title: "3. CLEAR", subtitle: "Oddal ludzi od zagrożenia", detail: "Odsuń stan osobowy i osoby postronne z rejonu zagrożenia oraz wykorzystaj dostępne osłony.", visual: "clear" },
  { title: "4. CORDON", subtitle: "Odetnij rejon i ubezpiecz 360°", detail: "Wyznacz strefę, ogranicz dostęp do rejonu i zorganizuj obserwację dookoła zagrożenia.", visual: "cordon" },
  { title: "5. CONTROL", subtitle: "Kontroluj rejon i przygotuj miejsce dla EOD", detail: "Kontroluj ruch, utrzymuj bezpieczeństwo i przygotuj warunki do przejęcia miejsca przez wyspecjalizowany zespół.", visual: "control" },
];

function Visual({ kind }: { kind: VisualKind }) {
  const common = "#25311f";
  const accent = "#8a2f25";
  const bg = "#e7eddf";
  const muted = "#809075";
  const soldier = (x: number, y: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="7" fill={common} />
      <rect x="-6" y="8" width="12" height="22" rx="4" fill={common} />
      <line x1="-3" y1="30" x2="-8" y2="44" stroke={common} strokeWidth="5" strokeLinecap="round" />
      <line x1="3" y1="30" x2="8" y2="44" stroke={common} strokeWidth="5" strokeLinecap="round" />
    </g>
  );

  return (
    <svg viewBox="0 0 620 340" className="w-full rounded-2xl border border-[#aebaa4] bg-[#edf2e8]" role="img" aria-label="Poglądowa ilustracja kroku procedury">
      <rect width="620" height="340" fill={bg} />
      <path d="M0 270 C120 250 190 300 310 270 S500 245 620 270" fill="none" stroke="#cbbd96" strokeWidth="28" opacity="0.55" />
      <g opacity="0.45"><circle cx="90" cy="65" r="36" fill={muted}/><circle cx="535" cy="58" r="42" fill={muted}/><circle cx="470" cy="100" r="28" fill={muted}/></g>

      {(kind === "observe" || kind === "dismount" || kind === "under" || kind === "ring5" || kind === "ring25") && (
        <g transform="translate(235 150)">
          <rect x="0" y="25" width="160" height="70" rx="16" fill={common} />
          <rect x="28" y="0" width="92" height="48" rx="10" fill={common} />
          <circle cx="32" cy="105" r="24" fill="#171d14" /><circle cx="132" cy="105" r="24" fill="#171d14" />
          <rect x="49" y="12" width="42" height="25" rx="5" fill="#bdcbb2" />
        </g>
      )}

      {kind === "observe" && <g>{soldier(110,180,"s1")}<path d="M130 172 L210 152" stroke={accent} strokeWidth="4" strokeDasharray="8 8"/><circle cx="218" cy="150" r="10" fill={accent}/><text x="64" y="112" fontSize="22" fontWeight="900" fill={common}>OBSERWACJA 360°</text></g>}
      {kind === "dismount" && <g>{soldier(190,170,"s1")}{soldier(438,170,"s2")}<path d="M208 210 L165 235" stroke={accent} strokeWidth="5" markerEnd="url(#arrow)"/><path d="M445 210 L490 235" stroke={accent} strokeWidth="5" markerEnd="url(#arrow)"/></g>}
      {kind === "under" && <g>{soldier(155,215,"s1")}<ellipse cx="325" cy="270" rx="85" ry="22" fill="none" stroke={accent} strokeWidth="5" strokeDasharray="10 8"/><text x="242" y="308" fontSize="20" fontWeight="900" fill={accent}>SPRAWDŹ POD POJAZDEM</text></g>}
      {kind === "ring5" && <g><ellipse cx="315" cy="225" rx="175" ry="88" fill="none" stroke={accent} strokeWidth="5" strokeDasharray="12 9"/><text x="458" y="158" fontSize="28" fontWeight="900" fill={accent}>5 m</text>{soldier(125,190,"s1")}{soldier(505,195,"s2")}</g>}
      {kind === "ring25" && <g><ellipse cx="315" cy="220" rx="175" ry="78" fill="none" stroke={muted} strokeWidth="4" strokeDasharray="10 8"/><ellipse cx="315" cy="220" rx="270" ry="125" fill="none" stroke={accent} strokeWidth="5" strokeDasharray="13 10"/><text x="520" y="108" fontSize="28" fontWeight="900" fill={accent}>25 m</text>{soldier(65,185,"s1")}{soldier(560,190,"s2")}</g>}
      {kind === "report" && <g>{soldier(205,168,"s1")}<rect x="270" y="105" width="250" height="90" rx="18" fill="white" stroke={common} strokeWidth="4"/><path d="M280 190 L245 215 L292 198" fill="white" stroke={common} strokeWidth="4"/><text x="300" y="145" fontSize="25" fontWeight="900" fill={common}>CZYSTO /</text><text x="300" y="176" fontSize="25" fontWeight="900" fill={common}>SPRAWDZONE</text></g>}

      {(kind === "check" || kind === "confirm") && <g><rect x="460" y="220" width="60" height="38" rx="8" fill="#4a453b"/><circle cx="476" cy="218" r="9" fill="#4a453b"/>{soldier(120,170,"s1")}<path d="M145 175 L450 230" stroke={accent} strokeWidth="4" strokeDasharray="10 9"/><text x="350" y="195" fontSize="18" fontWeight="900" fill={accent}>{kind === "confirm" ? "POTWIERDŹ Z DYSTANSU" : "KIERUNEK • ODLEGŁOŚĆ • OPIS"}</text></g>}
      {kind === "clear" && <g><rect x="470" y="220" width="55" height="36" rx="8" fill="#4a453b"/>{soldier(155,170,"s1")}{soldier(245,180,"s2")}{soldier(300,180,"s3")}<path d="M330 210 L205 210" stroke={accent} strokeWidth="8"/><polygon points="195,210 218,196 218,224" fill={accent}/><text x="130" y="105" fontSize="26" fontWeight="900" fill={common}>ODDAL LUDZI</text></g>}
      {kind === "cordon" && <g><rect x="290" y="190" width="52" height="34" rx="7" fill="#4a453b"/><ellipse cx="316" cy="210" rx="230" ry="110" fill="none" stroke={accent} strokeWidth="5" strokeDasharray="12 8"/>{soldier(315,76,"s1")}{soldier(95,188,"s2")}{soldier(540,190,"s3")}{soldier(315,292,"s4")}<text x="420" y="100" fontSize="28" fontWeight="900" fill={accent}>360°</text></g>}
      {kind === "control" && <g>{soldier(150,165,"s1")}<rect x="315" y="158" width="165" height="80" rx="12" fill={common}/><circle cx="345" cy="245" r="19" fill="#171d14"/><circle cx="445" cy="245" r="19" fill="#171d14"/><text x="357" y="208" fontSize="28" fontWeight="900" fill="white">EOD</text><rect x="210" y="135" width="54" height="90" rx="8" fill="#364532"/><line x1="237" y1="135" x2="237" y2="100" stroke={common} strokeWidth="5"/><text x="78" y="105" fontSize="22" fontWeight="900" fill={common}>KONTROLA REJONU</text></g>}

      <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={accent}/></marker></defs>
    </svg>
  );
}

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function FiveTwentyFiveTrainer() {
  const [mode, setMode] = useState<Mode>("525");
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const [quizType, setQuizType] = useState<"525" | "5xc">("525");
  const [quizItems, setQuizItems] = useState<string[]>(() => ["STREFA 5 m", "OBSERWUJ", "MELDUNEK", "STREFA 25 m", "WYSIĄDŹ OSTROŻNIE", "SPRAWDŹ MIEJSCE POSTOJU"]);
  const [quizResult, setQuizResult] = useState<null | boolean>(null);
  const [streak, setStreak] = useState(0);

  const steps = mode === "5xc" ? steps5xc : steps525;
  const step = steps[Math.min(index, steps.length - 1)];

  useEffect(() => {
    try { setStreak(Math.min(3, Number(localStorage.getItem(LS_KEY)) || 0)); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, String(streak)); } catch {}
  }, [streak]);

  useEffect(() => {
    if (!auto || mode === "quiz") return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [auto, mode, steps.length]);

  function switchMode(next: Mode) {
    setMode(next);
    setIndex(0);
    setAuto(false);
  }

  function makeQuiz(type: "525" | "5xc") {
    const labels = type === "525"
      ? ["OBSERWUJ", "WYSIĄDŹ OSTROŻNIE", "SPRAWDŹ MIEJSCE POSTOJU", "STREFA 5 m", "STREFA 25 m", "MELDUNEK"]
      : ["CHECK", "CONFIRM", "CLEAR", "CORDON", "CONTROL"];
    setQuizType(type);
    setQuizItems(shuffled(labels));
    setQuizResult(null);
  }

  function moveQuiz(from: number, delta: number) {
    if (quizResult !== null) return;
    const to = from + delta;
    if (to < 0 || to >= quizItems.length) return;
    setQuizItems((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }

  function checkQuiz() {
    const expected = quizType === "525"
      ? ["OBSERWUJ", "WYSIĄDŹ OSTROŻNIE", "SPRAWDŹ MIEJSCE POSTOJU", "STREFA 5 m", "STREFA 25 m", "MELDUNEK"]
      : ["CHECK", "CONFIRM", "CLEAR", "CORDON", "CONTROL"];
    const ok = expected.every((item, i) => quizItems[i] === item);
    setQuizResult(ok);
    setStreak((s) => ok ? Math.min(3, s + 1) : 0);
  }

  const progressDots = useMemo(() => steps.map((_, i) => i), [steps]);

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-[#66785a] bg-[#dfe7d7] text-[#11170f] shadow-xl shadow-black/20">
      <div className="border-b border-[#aebaa4] bg-[#cbd6c1] px-5 py-5 sm:px-6">
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#516248]">ETAP IV // 5-25 + 5xC // TRENAŻER WIZUALNY</div>
        <h3 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">Procedura krok po kroku — animacja + komiks + trening</h3>
        <p className="mt-3 max-w-[82ch] text-sm font-medium leading-6 text-[#364033] sm:text-base">Przejdź procedurę jak po planszach komiksu, uruchom automatyczne odtwarzanie albo sprawdź, czy umiesz ułożyć kolejność z pamięci.</p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-3">
          <button type="button" onClick={() => switchMode("525")} className={mode === "525" ? "rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white" : "rounded-xl border border-[#9daa93] bg-[#edf2e8] px-4 py-3 text-sm font-black text-[#526149]"}>5-25 krok po kroku</button>
          <button type="button" onClick={() => switchMode("5xc")} className={mode === "5xc" ? "rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white" : "rounded-xl border border-[#9daa93] bg-[#edf2e8] px-4 py-3 text-sm font-black text-[#526149]"}>5xC krok po kroku</button>
          <button type="button" onClick={() => switchMode("quiz")} className={mode === "quiz" ? "rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white" : "rounded-xl border border-[#9daa93] bg-[#edf2e8] px-4 py-3 text-sm font-black text-[#526149]"}>Ułóż kolejność</button>
        </div>

        {mode !== "quiz" ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <div className="space-y-3">
              <Visual kind={step.visual} />
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#b4c0ab] bg-[#f4f7f1] p-3">
                <div className="flex flex-wrap gap-1.5">{progressDots.map((i) => <button key={i} type="button" onClick={() => setIndex(i)} aria-label={`Krok ${i + 1}`} className={i === index ? "h-3 w-8 rounded-full bg-[#182116]" : "h-3 w-3 rounded-full bg-[#aab6a2]"} />)}</div>
                <button type="button" onClick={() => setAuto((v) => !v)} className={auto ? "rounded-lg bg-[#8a2f25] px-3 py-2 text-xs font-black text-white" : "rounded-lg bg-[#182116] px-3 py-2 text-xs font-black text-white"}>{auto ? "■ Zatrzymaj animację" : "▶ Odtwórz automatycznie"}</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#87957d] bg-[#182116] p-5 text-[#eef3e9]">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">KROK {index + 1} / {steps.length}</div>
                <h4 className="mt-3 text-2xl font-black">{step.title}</h4>
                <div className="mt-2 text-base font-black text-[#d7e0d0]">{step.subtitle}</div>
                <p className="mt-4 text-sm font-medium leading-6 text-[#c8d4c0]">{step.detail}</p>
                <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black disabled:opacity-30">← Wstecz</button><button type="button" onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))} disabled={index === steps.length - 1} className="rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116] disabled:opacity-30">Dalej →</button></div>
              </div>
              {mode === "5xc" && <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold leading-6 text-red-950">Najważniejsze: nie dotykaj, nie przesuwaj i nie otwieraj podejrzanego przedmiotu. 5xC ma uporządkować reakcję i zabezpieczenie rejonu.</div>}
              {mode === "525" && <div className="rounded-2xl border border-[#b7c2ae] bg-[#f5f8f2] p-4 text-sm leading-6 text-[#3f4b3a]"><b>Hak pamięciowy:</b> obserwacja → ostrożne wyjście → pod pojazdem → 5 m → 25 m → meldunek.</div>}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-2xl border border-[#87957d] bg-[#182116] p-5 text-[#eef3e9]">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">MINIGRA</div>
              <h4 className="mt-2 text-xl font-black">Ułóż procedurę w poprawnej kolejności</h4>
              <p className="mt-3 text-sm leading-6 text-[#c8d4c0]">Przesuwaj elementy strzałkami. Trzy poprawne ułożenia z rzędu oznaczają opanowanie.</p>
              <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => makeQuiz("525")} className={quizType === "525" ? "rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black"}>5-25</button><button type="button" onClick={() => makeQuiz("5xc")} className={quizType === "5xc" ? "rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black"}>5xC</button></div>
              <div className="mt-4 rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-3 text-sm font-black">Postęp: {streak >= 3 ? "✓ OPANOWANE" : `${streak}/3`}</div>
            </div>

            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
              <div className="space-y-2">{quizItems.map((item, i) => <div key={`${item}-${i}`} className="flex items-center gap-3 rounded-xl border border-[#b7c2ae] bg-white p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#182116] text-sm font-black text-white">{i + 1}</span><span className="min-w-0 flex-1 text-sm font-black">{item}</span><div className="flex gap-1"><button type="button" onClick={() => moveQuiz(i, -1)} disabled={i === 0 || quizResult !== null} className="grid h-9 w-9 place-items-center rounded-lg border border-[#aebaa4] font-black disabled:opacity-25">↑</button><button type="button" onClick={() => moveQuiz(i, 1)} disabled={i === quizItems.length - 1 || quizResult !== null} className="grid h-9 w-9 place-items-center rounded-lg border border-[#aebaa4] font-black disabled:opacity-25">↓</button></div></div>)}</div>
              {quizResult === null ? <button type="button" onClick={checkQuiz} className="mt-4 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white">Sprawdź kolejność</button> : <div className="mt-4 space-y-3"><div className={quizResult ? "rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold text-emerald-950" : "rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-950"}>{quizResult ? "✓ Poprawna kolejność. Seria rośnie o 1." : "✕ Kolejność jest niepoprawna. Seria wraca do 0/3."}</div><button type="button" onClick={() => makeQuiz(quizType)} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white">Nowa runda</button></div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

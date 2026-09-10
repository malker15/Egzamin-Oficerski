"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = "learn" | "order" | "scenario" | "radio" | "spot";
type Skill = "order" | "scenario" | "radio" | "spot";
type Progress = Record<Skill, number>;
type Priority = { code: "A" | "B" | "C"; count: number; label: string };
type PatientType = { code: "L" | "A"; count: number; label: string };
type Option = { code: string; label: string };
type StatusOption = Option & { count: number; nation?: string };
type MedevacScenario = {
  grid: string;
  frequency: string;
  callsign: string;
  priorities: Priority[];
  equipment: Option;
  patientTypes: PatientType[];
  security: Option;
  marking: Option;
  status: StatusOption;
  hazard: Option;
};

type LineDef = {
  id: number;
  title: string;
  short: string;
  remember: string;
  codes?: Array<{ code: string; text: string }>;
};

const LS_PROGRESS = "officer_stage4_medevac_progress_v1";
const defaultProgress: Progress = { order: 0, scenario: 0, radio: 0, spot: 0 };

const lineDefs: LineDef[] = [
  {
    id: 1,
    title: "Lokalizacja",
    short: "GRID / miejsce podjęcia",
    remember: "Gdzie ma nastąpić podjęcie? Podaj lokalizację — w treningu używamy fikcyjnego 6-cyfrowego GRID-u.",
  },
  {
    id: 2,
    title: "Łączność",
    short: "częstotliwość + kryptonim",
    remember: "Jakie łącze i kto mówi? Podaj częstotliwość radiową oraz kryptonim/call sign.",
  },
  {
    id: 3,
    title: "Liczba pacjentów wg pilności",
    short: "A / B / C",
    remember: "Ilu pacjentów jest w każdej kategorii pilności?",
    codes: [
      { code: "A", text: "pilny — do 2 h" },
      { code: "B", text: "priorytetowy — do 4 h" },
      { code: "C", text: "rutynowy — do 24 h" },
    ],
  },
  {
    id: 4,
    title: "Sprzęt specjalistyczny",
    short: "A / B / C / D",
    remember: "Czy zespół ewakuacyjny musi zabrać dodatkowy sprzęt?",
    codes: [
      { code: "A", text: "brak" },
      { code: "B", text: "wyciągarka" },
      { code: "C", text: "sprzęt ekstrakcyjny" },
      { code: "D", text: "respirator" },
    ],
  },
  {
    id: 5,
    title: "Liczba poszkodowanych wg typu",
    short: "L / A (+ E z notatki)",
    remember: "Jak pacjenci będą transportowani? Podaj kod i liczbę poszkodowanych.",
    codes: [
      { code: "L", text: "leżący + liczba rannych" },
      { code: "A", text: "siedzący / ambulatoryjny + liczba rannych" },
      { code: "E", text: "opieka specjalistyczna + liczba rannych — wariant zapisany w notatce" },
    ],
  },
  {
    id: 6,
    title: "Bezpieczeństwo miejsca podjęcia",
    short: "N / P / E / X",
    remember: "Jaka jest sytuacja przeciwnika w rejonie podjęcia?",
    codes: [
      { code: "N", text: "brak przeciwnika" },
      { code: "P", text: "możliwy przeciwnik" },
      { code: "E", text: "przeciwnik w rejonie" },
      { code: "X", text: "kontakt ogniowy" },
    ],
  },
  {
    id: 7,
    title: "Oznaczenie miejsca podjęcia",
    short: "A / B / C / D / E",
    remember: "W jaki sposób LZ / punkt podjęcia będzie oznaczony?",
    codes: [
      { code: "A", text: "panel sygnalizacyjny" },
      { code: "B", text: "pirotechnika" },
      { code: "C", text: "dym" },
      { code: "D", text: "brak" },
      { code: "E", text: "inne" },
    ],
  },
  {
    id: 8,
    title: "Status / narodowość poszkodowanych",
    short: "A / B / C / D / E / F",
    remember: "Kim są poszkodowani? W razie potrzeby podaj także narodowość.",
    codes: [
      { code: "A", text: "żołnierz sił sprzymierzonych + narodowość" },
      { code: "B", text: "cywil sił sprzymierzonych" },
      { code: "C", text: "żołnierz sił innych niż NATO" },
      { code: "D", text: "cywil nienatowski" },
      { code: "E", text: "przeciwnik / jeniec" },
      { code: "F", text: "dziecko" },
    ],
  },
  {
    id: 9,
    title: "Zagrożenia",
    short: "NBC / skażenia / teren",
    remember: "Jakie są zagrożenia NBC, skażenia albo inne zagrożenia terenowe w rejonie podjęcia?",
  },
];

const equipmentOptions: Option[] = [
  { code: "A", label: "brak sprzętu specjalistycznego" },
  { code: "B", label: "wymagana wyciągarka" },
  { code: "C", label: "wymagany sprzęt ekstrakcyjny" },
  { code: "D", label: "wymagany respirator" },
];

const securityOptions: Option[] = [
  { code: "N", label: "brak przeciwnika w rejonie" },
  { code: "P", label: "możliwy przeciwnik w rejonie" },
  { code: "E", label: "przeciwnik w rejonie" },
  { code: "X", label: "kontakt ogniowy w rejonie" },
];

const markingOptions: Option[] = [
  { code: "A", label: "panel sygnalizacyjny" },
  { code: "B", label: "pirotechnika" },
  { code: "C", label: "dym" },
  { code: "D", label: "brak oznaczenia" },
  { code: "E", label: "inne oznaczenie" },
];

const statusOptions: StatusOption[] = [
  { code: "A", count: 2, nation: "POL", label: "2 żołnierzy sił sprzymierzonych, narodowość POL" },
  { code: "A", count: 3, nation: "POL", label: "3 żołnierzy sił sprzymierzonych, narodowość POL" },
  { code: "B", count: 2, label: "2 cywilów sił sprzymierzonych" },
  { code: "C", count: 2, label: "2 żołnierzy sił innych niż NATO" },
  { code: "D", count: 2, label: "2 cywilów nienatowskich" },
  { code: "E", count: 1, label: "1 przeciwnik / jeniec" },
  { code: "F", count: 1, label: "1 dziecko" },
];

const hazardOptions: Option[] = [
  { code: "H1", label: "brak skażenia; zerwana linia energetyczna w pobliżu" },
  { code: "H2", label: "podejrzenie skażenia chemicznego w rejonie" },
  { code: "H3", label: "brak NBC; grząski teren przy miejscu podjęcia" },
  { code: "H4", label: "brak NBC; drzewa i przeszkody terenowe przy LZ" },
];

const patientSets: Array<{ priorities: Priority[]; types: PatientType[] }> = [
  {
    priorities: [
      { code: "A", count: 1, label: "pilny" },
      { code: "B", count: 2, label: "priorytetowy" },
    ],
    types: [
      { code: "L", count: 2, label: "leżący" },
      { code: "A", count: 1, label: "ambulatoryjny" },
    ],
  },
  {
    priorities: [
      { code: "A", count: 1, label: "pilny" },
      { code: "C", count: 1, label: "rutynowy" },
    ],
    types: [
      { code: "L", count: 1, label: "leżący" },
      { code: "A", count: 1, label: "ambulatoryjny" },
    ],
  },
  {
    priorities: [
      { code: "B", count: 2, label: "priorytetowy" },
      { code: "C", count: 2, label: "rutynowy" },
    ],
    types: [
      { code: "L", count: 2, label: "leżący" },
      { code: "A", count: 2, label: "ambulatoryjny" },
    ],
  },
  {
    priorities: [
      { code: "A", count: 1, label: "pilny" },
      { code: "B", count: 1, label: "priorytetowy" },
      { code: "C", count: 1, label: "rutynowy" },
    ],
    types: [{ code: "L", count: 3, label: "leżący" }],
  },
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function randomGrid() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
}

function randomScenario(): MedevacScenario {
  const patients = pick(patientSets);
  const total = patients.priorities.reduce((sum, x) => sum + x.count, 0);
  const compatibleStatuses = statusOptions.filter((x) => x.count === total);
  return {
    grid: randomGrid(),
    frequency: pick(["41.500", "42.250", "43.750", "46.100"]),
    callsign: pick(["MEDIC 2-1", "RATOWNIK 3-2", "ECHO 6-5", "VICTOR 2-4"]),
    priorities: patients.priorities,
    equipment: pick(equipmentOptions),
    patientTypes: patients.types,
    security: pick(securityOptions),
    marking: pick(markingOptions),
    status: compatibleStatuses.length ? pick(compatibleStatuses) : { code: "A", count: total, nation: "POL", label: `${total} żołnierzy sił sprzymierzonych, narodowość POL` },
    hazard: pick(hazardOptions),
  };
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value: string) {
  return normalize(value).split(" ").filter(Boolean);
}

function hasWord(value: string, token: string) {
  return words(value).includes(normalize(token));
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function hasPair(value: string, code: string, count: number) {
  const n = normalize(value);
  const compact = n.replace(/\s+/g, "");
  return compact.includes(`${code}${count}`) || new RegExp(`\\b${code}\\s+${count}\\b`).test(n);
}

function lineCanonical(s: MedevacScenario, line: number) {
  if (line === 1) return `GRID ${s.grid}`;
  if (line === 2) return `${s.frequency} ${s.callsign}`;
  if (line === 3) return s.priorities.map((x) => `${x.code} ${x.count}`).join(", ");
  if (line === 4) return `${s.equipment.code} — ${s.equipment.label}`;
  if (line === 5) return s.patientTypes.map((x) => `${x.code} ${x.count}`).join(", ");
  if (line === 6) return `${s.security.code} — ${s.security.label}`;
  if (line === 7) return `${s.marking.code} — ${s.marking.label}`;
  if (line === 8) return `${s.status.code} ${s.status.count}${s.status.nation ? ` ${s.status.nation}` : ""} — ${s.status.label}`;
  return s.hazard.label.toUpperCase();
}

function checkLine(s: MedevacScenario, line: number, value: string): string[] {
  const missing: string[] = [];
  if (line === 1) {
    if (!hasWord(value, "GRID")) missing.push("GRID");
    if (!digits(value).includes(s.grid)) missing.push(s.grid);
  }
  if (line === 2) {
    if (!digits(value).includes(digits(s.frequency))) missing.push(s.frequency);
    for (const part of words(s.callsign)) if (!hasWord(value, part)) missing.push(part);
  }
  if (line === 3) {
    for (const p of s.priorities) if (!hasPair(value, p.code, p.count)) missing.push(`${p.code} ${p.count}`);
  }
  if (line === 4) {
    if (!hasWord(value, s.equipment.code)) missing.push(`kod ${s.equipment.code}`);
  }
  if (line === 5) {
    for (const p of s.patientTypes) if (!hasPair(value, p.code, p.count)) missing.push(`${p.code} ${p.count}`);
  }
  if (line === 6) {
    if (!hasWord(value, s.security.code)) missing.push(`kod ${s.security.code}`);
  }
  if (line === 7) {
    if (!hasWord(value, s.marking.code)) missing.push(`kod ${s.marking.code}`);
  }
  if (line === 8) {
    if (!hasPair(value, s.status.code, s.status.count)) missing.push(`${s.status.code} ${s.status.count}`);
    if (s.status.nation && !hasWord(value, s.status.nation)) missing.push(s.status.nation);
  }
  if (line === 9) {
    const n = normalize(value);
    if (s.hazard.code === "H1" && !(n.includes("LINIA") && n.includes("ENERGET"))) missing.push("linia energetyczna");
    if (s.hazard.code === "H2" && !(n.includes("CHEM") || n.includes("SKAZ"))) missing.push("skażenie chemiczne");
    if (s.hazard.code === "H3" && !n.includes("GRZASK")) missing.push("grząski teren");
    if (s.hazard.code === "H4" && !(n.includes("DRZEW") || n.includes("PRZESZK"))) missing.push("drzewa / przeszkody");
  }
  return Array.from(new Set(missing));
}

function statusLabel(value: number) {
  return value >= 3 ? "✓ OPANOWANE" : `${value}/3`;
}

function ProgressCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#65745b] bg-[#111710] px-3 py-2.5">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8ea083]">{label}</div>
      <div className={value >= 3 ? "mt-1 text-sm font-black text-emerald-300" : "mt-1 text-sm font-black text-white"}>{statusLabel(value)}</div>
    </div>
  );
}

function ScenarioBrief({ scenario }: { scenario: MedevacScenario }) {
  const priorityText = scenario.priorities.map((x) => `${x.count} × ${x.label} (${x.code})`).join(", ");
  const typeText = scenario.patientTypes.map((x) => `${x.count} × ${x.label} (${x.code})`).join(", ");
  return (
    <div className="rounded-2xl border border-[#46533f] bg-[#10150f] p-4 text-[#edf3e9] sm:p-5">
      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9caf91]">FIKCYJNY SCENARIUSZ</div>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Lokalizacja:</b> GRID {scenario.grid}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Łączność:</b> {scenario.frequency} • {scenario.callsign}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Pacjenci / pilność:</b> {priorityText}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Sprzęt:</b> {scenario.equipment.label}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Typ transportu:</b> {typeText}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Bezpieczeństwo:</b> {scenario.security.label}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Oznaczenie:</b> {scenario.marking.label}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Poszkodowani:</b> {scenario.status.label}</div>
        <div className="rounded-xl border border-[#34402f] bg-[#182116] p-3"><b>Zagrożenia:</b> {scenario.hazard.label}</div>
      </div>
    </div>
  );
}

export default function MedevacTrainer() {
  const [tab, setTab] = useState<Tab>("learn");
  const [selectedLine, setSelectedLine] = useState(1);
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  const [order, setOrder] = useState<number[]>(() => shuffle(lineDefs.map((x) => x.id)));
  const [orderResult, setOrderResult] = useState<boolean | null>(null);

  const [scenario, setScenario] = useState<MedevacScenario>(() => randomScenario());
  const [answers, setAnswers] = useState<string[]>(Array(9).fill(""));
  const [scenarioResult, setScenarioResult] = useState<string[][] | null>(null);
  const [showCheat, setShowCheat] = useState(false);

  const [radioScenario, setRadioScenario] = useState<MedevacScenario>(() => randomScenario());
  const [radioStep, setRadioStep] = useState(0);
  const [radioAnswers, setRadioAnswers] = useState<string[]>(Array(9).fill(""));
  const [radioValue, setRadioValue] = useState("");
  const [radioResult, setRadioResult] = useState<string[][] | null>(null);

  const [spotScenario, setSpotScenario] = useState<MedevacScenario>(() => randomScenario());
  const [spotWrong, setSpotWrong] = useState(4);
  const [spotSelected, setSpotSelected] = useState<number | null>(null);
  const [spotResult, setSpotResult] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_PROGRESS);
      if (raw) setProgress({ ...defaultProgress, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_PROGRESS, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  function bump(skill: Skill, correct: boolean) {
    setProgress((prev) => ({ ...prev, [skill]: correct ? Math.min(3, prev[skill] + 1) : 0 }));
  }

  function moveLine(index: number, delta: -1 | 1) {
    if (orderResult !== null) return;
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function checkOrder() {
    const correct = order.every((id, i) => id === i + 1);
    setOrderResult(correct);
    bump("order", correct);
  }

  function newOrder() {
    let next = shuffle(lineDefs.map((x) => x.id));
    if (next.every((id, i) => id === i + 1)) next = shuffle(next);
    setOrder(next);
    setOrderResult(null);
  }

  function checkScenario() {
    const result = lineDefs.map((line) => checkLine(scenario, line.id, answers[line.id - 1] ?? ""));
    setScenarioResult(result);
    bump("scenario", result.every((x) => x.length === 0));
  }

  function newScenario() {
    setScenario(randomScenario());
    setAnswers(Array(9).fill(""));
    setScenarioResult(null);
    setShowCheat(false);
  }

  function submitRadioLine() {
    if (!radioValue.trim() || radioResult) return;
    const nextAnswers = [...radioAnswers];
    nextAnswers[radioStep] = radioValue;
    setRadioAnswers(nextAnswers);
    if (radioStep < 8) {
      setRadioStep((s) => s + 1);
      setRadioValue("");
      return;
    }
    const result = lineDefs.map((line) => checkLine(radioScenario, line.id, nextAnswers[line.id - 1] ?? ""));
    setRadioResult(result);
    bump("radio", result.every((x) => x.length === 0));
  }

  function newRadio() {
    setRadioScenario(randomScenario());
    setRadioStep(0);
    setRadioAnswers(Array(9).fill(""));
    setRadioValue("");
    setRadioResult(null);
  }

  function generateSpot() {
    setSpotScenario(randomScenario());
    setSpotWrong(3 + Math.floor(Math.random() * 7));
    setSpotSelected(null);
    setSpotResult(null);
  }

  useEffect(() => {
    generateSpot();
  }, []);

  function corruptedLine(s: MedevacScenario, line: number) {
    if (line !== spotWrong) return lineCanonical(s, line);
    if (line === 3) return "A 9";
    if (line === 4) return `${s.equipment.code === "D" ? "A" : "D"} — INNY SPRZĘT`;
    if (line === 5) return "L 9";
    if (line === 6) return `${s.security.code === "N" ? "X" : "N"} — BŁĘDNA SYTUACJA`;
    if (line === 7) return `${s.marking.code === "C" ? "D" : "C"} — BŁĘDNE OZNACZENIE`;
    if (line === 8) return "F 9 — BŁĘDNY STATUS";
    return s.hazard.code === "H2" ? "BRAK NBC I BRAK ZAGROŻEŃ" : "SKAŻENIE CHEMICZNE";
  }

  function checkSpot() {
    if (!spotSelected) return;
    const correct = spotSelected === spotWrong;
    setSpotResult(correct);
    bump("spot", correct);
  }

  const activeLine = lineDefs[selectedLine - 1];
  const scenarioComplete = answers.every((x) => x.trim().length > 0);
  const scenarioScore = scenarioResult ? scenarioResult.filter((x) => x.length === 0).length : 0;
  const radioScore = radioResult ? radioResult.filter((x) => x.length === 0).length : 0;

  const spotLines = useMemo(() => lineDefs.map((line) => ({ id: line.id, value: corruptedLine(spotScenario, line.id) })), [spotScenario, spotWrong]);

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-[#66785a] bg-[#dfe7d7] text-[#11170f] shadow-xl shadow-black/20">
      <div className="border-b border-[#aebaa4] bg-[#cbd6c1] px-5 py-5 sm:px-6">
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#516248]">ETAP IV // EWAKUACJA RANNEGO // TRENAŻER</div>
        <h3 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">MEDEVAC — 9-Line Trainer</h3>
        <p className="mt-3 max-w-[84ch] text-sm font-medium leading-6 text-[#364033] sm:text-base">
          Uczysz się kolejności dziewięciu linii, kodów, wyciągania danych ze scenariusza i nadawania meldunku z pamięci. Układ linii i oznaczeń w tym module odwzorowuje przekazaną notatkę szkoleniową; wszystkie dane ćwiczeniowe są fikcyjne.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {([
            ["learn", "1. Nauka 9 linii"],
            ["order", "2. Ułóż kolejność"],
            ["scenario", "3. Scenariusz"],
            ["radio", "4. Tryb RADIO"],
            ["spot", "5. Wykryj błąd"],
          ] as Array<[Tab, string]>).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setTab(key)} className={tab === key ? "rounded-xl bg-[#182116] px-3 py-3 text-sm font-black text-white" : "rounded-xl border border-[#9daa93] bg-[#edf2e8] px-3 py-3 text-sm font-black text-[#526149] hover:bg-white"}>{label}</button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ProgressCard label="Kolejność" value={progress.order} />
          <ProgressCard label="Scenariusz 9-Line" value={progress.scenario} />
          <ProgressCard label="Radio z pamięci" value={progress.radio} />
          <ProgressCard label="Wykrywanie błędu" value={progress.spot} />
        </div>

        {tab === "learn" && (
          <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
            <div className="space-y-2">
              {lineDefs.map((line) => (
                <button key={line.id} type="button" onClick={() => setSelectedLine(line.id)} className={selectedLine === line.id ? "flex w-full items-center gap-3 rounded-xl border border-[#526247] bg-[#182116] p-3 text-left text-white" : "flex w-full items-center gap-3 rounded-xl border border-[#b6c1ae] bg-[#f4f7f1] p-3 text-left hover:bg-white"}>
                  <span className={selectedLine === line.id ? "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white font-mono text-sm font-black text-[#182116]" : "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#182116] font-mono text-sm font-black text-white"}>{line.id}</span>
                  <span className="min-w-0"><span className="block text-sm font-black">{line.title}</span><span className={selectedLine === line.id ? "mt-0.5 block text-xs text-[#b7c5ae]" : "mt-0.5 block text-xs text-[#65705f]"}>{line.short}</span></span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-5 text-[#eef3e9] sm:p-6">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">LINIA {activeLine.id} / 9</div>
              <h4 className="mt-2 text-2xl font-black">{activeLine.title}</h4>
              <p className="mt-3 text-sm font-medium leading-6 text-[#d0dbca]">{activeLine.remember}</p>
              {activeLine.codes && (
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {activeLine.codes.map((x) => <div key={`${activeLine.id}-${x.code}`} className="rounded-xl border border-[#394635] bg-[#10150f] p-3"><span className="mr-2 inline-grid h-7 min-w-7 place-items-center rounded-md bg-[#dfe7d7] px-2 font-mono text-xs font-black text-[#182116]">{x.code}</span><span className="text-sm font-semibold">{x.text}</span></div>)}
                </div>
              )}
              <div className="mt-6 rounded-xl border border-[#3b4837] bg-[#0f150e] p-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#9caf91]">Hak pamięciowy całego 9-Line</div>
                <div className="mt-2 text-sm font-black leading-7">1 GDZIE → 2 RADIO → 3 PACJENCI → 4 SPRZĘT → 5 TYP → 6 ZAGROŻENIE → 7 OZNACZENIE → 8 KTO → 9 NBC/TEREN</div>
              </div>
            </div>
          </div>
        )}

        {tab === "order" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">MINIGRA</div><h4 className="mt-1 text-xl font-black">Ułóż 9 linii w poprawnej kolejności</h4></div><span className="rounded-full bg-[#e1e9da] px-3 py-1 text-xs font-black text-[#526149]">{statusLabel(progress.order)}</span></div>
              <div className="mt-4 space-y-2">
                {order.map((id, index) => {
                  const line = lineDefs[id - 1];
                  return <div key={id} className="flex items-center gap-3 rounded-xl border border-[#b7c2ae] bg-white p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#182116] font-mono text-xs font-black text-white">{index + 1}</span><div className="min-w-0 flex-1"><div className="text-sm font-black">{line.title}</div><div className="text-xs font-semibold text-[#697463]">{line.short}</div></div><div className="flex gap-1"><button type="button" aria-label="Przesuń w górę" onClick={() => moveLine(index, -1)} disabled={index === 0 || orderResult !== null} className="grid h-9 w-9 place-items-center rounded-lg border border-[#aebaa4] font-black disabled:opacity-25">↑</button><button type="button" aria-label="Przesuń w dół" onClick={() => moveLine(index, 1)} disabled={index === order.length - 1 || orderResult !== null} className="grid h-9 w-9 place-items-center rounded-lg border border-[#aebaa4] font-black disabled:opacity-25">↓</button></div></div>;
                })}
              </div>
              {orderResult === null ? <button type="button" onClick={checkOrder} className="mt-4 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white">Sprawdź kolejność</button> : <div className="mt-4 space-y-3"><div className={orderResult ? "rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold text-emerald-950" : "rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-950"}>{orderResult ? "✓ Cała kolejność poprawna. Seria rośnie o 1." : "✕ Kolejność nie jest poprawna. Seria wraca do 0/3."}</div><button type="button" onClick={newOrder} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white">Nowe ułożenie</button></div>}
            </div>
            <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-5 text-[#edf3e9]"><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9caf91]">PODPOWIEDŹ PO SPRAWDZENIU</div>{orderResult === false ? <ol className="mt-4 space-y-2">{lineDefs.map((line) => <li key={line.id} className="rounded-xl border border-[#354330] bg-[#10150f] px-3 py-2 text-sm font-bold"><span className="mr-2 text-[#9caf91]">{line.id}.</span>{line.title}</li>)}</ol> : <p className="mt-3 text-sm leading-6 text-[#c9d5c2]">Najpierw spróbuj bez ściągi. Po błędzie pokażę prawidłową kolejność, żebyś od razu utrwalił schemat.</p>}</div>
          </div>
        )}

        {tab === "scenario" && (
          <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
            <ScenarioBrief scenario={scenario} />
            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">PEŁNY 9-LINE</div><h4 className="mt-1 text-xl font-black">Wyciągnij dane ze scenariusza</h4></div><button type="button" onClick={() => setShowCheat((v) => !v)} className="rounded-xl border border-[#9daa93] px-3 py-2 text-xs font-black text-[#526149]">{showCheat ? "Ukryj ściągę" : "Pokaż ściągę"}</button></div>
              {showCheat && <div className="mt-3 rounded-xl border border-[#bcc7b3] bg-[#e9efe4] p-3 text-xs font-bold leading-6 text-[#46533f]">1 GRID • 2 radio/kryptonim • 3 pilność • 4 sprzęt • 5 typ pacjentów • 6 bezpieczeństwo • 7 oznaczenie • 8 status/narodowość • 9 NBC/teren</div>}
              <div className="mt-4 space-y-3">
                {lineDefs.map((line) => <div key={line.id} className="rounded-xl border border-[#bcc7b3] bg-white p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div className="text-sm font-black">LINE {line.id}</div>{scenarioResult && <span className={scenarioResult[line.id - 1].length === 0 ? "text-xs font-black text-emerald-700" : "text-xs font-black text-red-700"}>{scenarioResult[line.id - 1].length === 0 ? "✓ poprawna" : `brakuje: ${scenarioResult[line.id - 1].join(", ")}`}</span>}</div><input value={answers[line.id - 1]} disabled={!!scenarioResult} onChange={(e) => setAnswers((prev) => prev.map((v, i) => i === line.id - 1 ? e.target.value : v))} placeholder={showCheat ? line.short : `Wpisz linię ${line.id} z pamięci`} className="mt-2 w-full rounded-lg border border-[#c0cab8] bg-[#f9fbf8] px-3 py-2.5 text-base font-semibold outline-none focus:border-[#526247] disabled:opacity-70" /></div>)}
              </div>
              {!scenarioResult ? <button type="button" onClick={checkScenario} disabled={!scenarioComplete} className="mt-4 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white disabled:opacity-35">Sprawdź cały 9-Line</button> : <div className="mt-4 space-y-3"><div className={scenarioScore === 9 ? "rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold text-emerald-950" : "rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-bold text-amber-950"}>Wynik: <b>{scenarioScore}/9</b>. {scenarioScore === 9 ? "Pełny meldunek poprawny — seria rośnie." : "Popraw błędne linie w następnym scenariuszu — seria wraca do 0/3."}</div><div className="rounded-xl border border-[#b7c2ae] bg-white p-3"><div className="text-xs font-black uppercase tracking-wider text-[#607057]">Wzorcowe linie</div><div className="mt-2 space-y-1.5 font-mono text-xs font-bold leading-5">{lineDefs.map((line) => <div key={line.id}>{line.id}. {lineCanonical(scenario, line.id)}</div>)}</div></div><button type="button" onClick={newScenario} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white">Nowy scenariusz</button></div>}
            </div>
          </div>
        )}

        {tab === "radio" && (
          <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
            <ScenarioBrief scenario={radioScenario} />
            <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-5 text-[#eef3e9] sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">TRYB RADIO • BEZ PODPOWIEDZI</div><h4 className="mt-2 text-xl font-black">{radioResult ? "Meldunek zakończony" : `LINE ${radioStep + 1}`}</h4></div><span className="rounded-full border border-[#43503d] px-3 py-1 text-xs font-black">{statusLabel(progress.radio)}</span></div>
              {!radioResult ? <><p className="mt-3 text-sm leading-6 text-[#cbd6c4]">Na ekranie widzisz tylko numer aktualnej linii. Z opisu sytuacji po lewej sam przypomnij sobie, jakie dane musisz teraz podać.</p><textarea rows={4} value={radioValue} onChange={(e) => setRadioValue(e.target.value)} placeholder={`Nadaj LINE ${radioStep + 1}...`} className="mt-4 w-full rounded-xl border border-[#43503d] bg-[#0f150e] px-4 py-3 text-base font-semibold text-white outline-none focus:border-[#8fa184]" /><button type="button" onClick={submitRadioLine} disabled={!radioValue.trim()} className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-[#182116] disabled:opacity-30">{radioStep < 8 ? "Zapisz i następna linia →" : "Zakończ i sprawdź 9-Line"}</button><div className="mt-4 flex flex-wrap gap-1.5">{lineDefs.map((line) => <span key={line.id} className={line.id - 1 < radioStep ? "rounded-full bg-emerald-950/60 px-2.5 py-1 text-[10px] font-black text-emerald-200" : line.id - 1 === radioStep ? "rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#182116]" : "rounded-full border border-[#43503d] px-2.5 py-1 text-[10px] font-black text-[#819079]"}>L{line.id}</span>)}</div></> : <div className="mt-4 space-y-3"><div className={radioScore === 9 ? "rounded-xl border border-emerald-700 bg-emerald-950/50 p-4 text-sm font-bold text-emerald-100" : "rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-sm font-bold text-amber-100"}>Wynik RADIO: {radioScore}/9. {radioScore === 9 ? "Bez błędu — seria rośnie." : "Niepełny meldunek — seria wraca do 0/3."}</div><div className="space-y-2">{lineDefs.map((line) => <div key={line.id} className="rounded-xl border border-[#354330] bg-[#10150f] p-3 text-sm"><div className="flex justify-between gap-3"><b>LINE {line.id}</b><span className={radioResult[line.id - 1].length === 0 ? "font-black text-emerald-300" : "font-black text-red-300"}>{radioResult[line.id - 1].length === 0 ? "✓" : `brak: ${radioResult[line.id - 1].join(", ")}`}</span></div><div className="mt-1 text-xs text-[#9caf91]">Wzór: {lineCanonical(radioScenario, line.id)}</div></div>)}</div><button type="button" onClick={newRadio} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-black text-[#182116]">Nowa próba RADIO</button></div>}
            </div>
          </div>
        )}

        {tab === "spot" && (
          <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
            <ScenarioBrief scenario={spotScenario} />
            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">MINIGRA</div><h4 className="mt-1 text-xl font-black">W jednej linii jest błąd. Znajdź ją.</h4></div><span className="rounded-full bg-[#e1e9da] px-3 py-1 text-xs font-black text-[#526149]">{statusLabel(progress.spot)}</span></div>
              <div className="mt-4 space-y-2">{spotLines.map((line) => <button type="button" key={line.id} onClick={() => spotResult === null && setSpotSelected(line.id)} className={spotSelected === line.id ? "w-full rounded-xl border-2 border-[#526247] bg-[#e3ebdc] p-3 text-left" : "w-full rounded-xl border border-[#bcc7b3] bg-white p-3 text-left"}><div className="flex gap-3"><span className="font-mono text-xs font-black text-[#607057]">L{line.id}</span><span className="font-mono text-sm font-bold">{line.value}</span></div></button>)}</div>
              {spotResult === null ? <button type="button" onClick={checkSpot} disabled={!spotSelected} className="mt-4 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white disabled:opacity-35">Sprawdź wskazaną linię</button> : <div className="mt-4 space-y-3"><div className={spotResult ? "rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold text-emerald-950" : "rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-950"}>{spotResult ? `✓ Tak — błąd był w LINE ${spotWrong}.` : `✕ Nie. Błąd był w LINE ${spotWrong}.`}</div><div className="rounded-xl border border-[#b7c2ae] bg-white p-3 text-sm"><b>Poprawna LINE {spotWrong}:</b><div className="mt-1 font-mono font-bold">{lineCanonical(spotScenario, spotWrong)}</div></div><button type="button" onClick={generateSpot} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white">Nowy błąd</button></div>}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[#9dac93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">SYSTEM NAUKI</div><div className="mt-1 text-base font-black">3 poprawne próby z rzędu = opanowane</div></div><button type="button" onClick={() => setProgress(defaultProgress)} className="rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2 text-xs font-black text-[#c5d1bd]">Reset postępu MEDEVAC</button></div>
          <p className="mt-3 text-sm leading-6 text-[#c5d1bd]">Każda minigra ma własną serię. Błąd zeruje tylko serię aktualnego trybu. Dzięki temu od razu widać, czy problemem jest kolejność linii, interpretacja scenariusza, pamięć w trybie RADIO czy rozpoznawanie niezgodności.</p>
        </div>
      </div>
    </section>
  );
}

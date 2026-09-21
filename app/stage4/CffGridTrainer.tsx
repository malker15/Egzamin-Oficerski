"use client";

import { useEffect, useState, type MouseEvent } from "react";

type Section = "learn" | "grid" | "polar" | "mto" | "cff";
type Mode = "read" | "locate";
type Precision = 4 | 6;
type SkillKey = "read4" | "locate4" | "read6" | "locate6";
type Point = { col: number; row: number; eDigit: number; nDigit: number };
type Result = { correct: boolean; selectedGrid?: string } | null;
type Progress = Record<SkillKey, number>;
type TutorialHighlight = "none" | "easting" | "northing" | "precision";
type CffScenario = {
  fdc: string;
  observer: string;
  mission: string;
  point: Point;
  altitude: string;
  target: string;
  engagement: string;
  control: string;
};
type CffAnswers = { one: string; two: string; three: string };
type CffCheck = { correct: boolean; one: string[]; two: string[]; three: string[] } | null;
type PolarScenario = {
  observer: Point;
  target: Point;
  directionMils: number;
  distanceM: number;
};
type PolarResult = {
  correct: boolean;
  clickCorrect: boolean;
  gridCorrect: boolean;
  selectedGrid?: string;
} | null;

const LS_PROGRESS = "officer_stage4_cff_grid_progress_v1";
const LS_CFF_PROGRESS = "officer_stage4_cff_full_progress_v1";
const LS_POLAR_PROGRESS = "officer_stage4_cff_polar_progress_v1";
const MAP_MARGIN = 44;
const MAP_SIZE = 400;
const CELL = 40;
const VIEW = 488;

const defaultProgress: Progress = { read4: 0, locate4: 0, read6: 0, locate6: 0 };
const tutorialPoint: Point = { col: 4, row: 5, eDigit: 5, nDigit: 5 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomPoint(): Point {
  return {
    col: Math.floor(Math.random() * 10),
    row: Math.floor(Math.random() * 10),
    eDigit: Math.floor(Math.random() * 10),
    nDigit: Math.floor(Math.random() * 10),
  };
}

function easting(point: Point) {
  return 10 + point.col;
}

function northing(point: Point) {
  return 29 - point.row;
}

function gridOf(point: Point, precision: Precision) {
  const e = String(easting(point)).padStart(2, "0");
  const n = String(northing(point)).padStart(2, "0");
  if (precision === 4) return `${e}${n}`;
  return `${e}${point.eDigit}${n}${point.nDigit}`;
}

function pointX(point: Point) {
  return MAP_MARGIN + (point.col + (point.eDigit + 0.5) / 10) * CELL;
}

function pointY(point: Point) {
  return MAP_MARGIN + (point.row + 1 - (point.nDigit + 0.5) / 10) * CELL;
}

function pointFromSubgrid(eIndex: number, nIndex: number): Point {
  const e = clamp(Math.round(eIndex), 0, 99);
  const n = clamp(Math.round(nIndex), 0, 99);
  return {
    col: Math.floor(e / 10),
    row: 9 - Math.floor(n / 10),
    eDigit: e % 10,
    nDigit: n % 10,
  };
}

function randomPolarScenario(): PolarScenario {
  const directions = [
    { mils: 0, de: 0, dn: 1 },
    { mils: 800, de: 1, dn: 1 },
    { mils: 1600, de: 1, dn: 0 },
    { mils: 2400, de: 1, dn: -1 },
    { mils: 3200, de: 0, dn: -1 },
    { mils: 4000, de: -1, dn: -1 },
    { mils: 4800, de: -1, dn: 0 },
    { mils: 5600, de: -1, dn: 1 },
  ];
  const vector = pick(directions);
  const step = 4 + Math.floor(Math.random() * 9);
  const observerE = 18 + Math.floor(Math.random() * 64);
  const observerN = 18 + Math.floor(Math.random() * 64);
  const targetE = observerE + vector.de * step;
  const targetN = observerN + vector.dn * step;
  const distanceM = Math.round(Math.hypot(vector.de * step, vector.dn * step)) * 100;

  return {
    observer: pointFromSubgrid(observerE, observerN),
    target: pointFromSubgrid(targetE, targetN),
    directionMils: vector.mils,
    distanceM,
  };
}

function skillKey(mode: Mode, precision: Precision): SkillKey {
  return `${mode}${precision}` as SkillKey;
}

function statusLabel(value: number) {
  if (value >= 3) return "✓ OPANOWANE";
  return `${value}/3`;
}

function cleanGrid(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

function normalizeRadio(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function missingParts(value: string, required: string[]) {
  const normalized = normalizeRadio(value);
  return required.filter((part) => !normalized.includes(normalizeRadio(part)));
}

function randomCffScenario(): CffScenario {
  return {
    fdc: pick(["ALFA 6-9", "BRAVO 6-9", "DELTA 6-9"]),
    observer: pick(["SIGMA 6-7", "ECHO 6-7", "ROMEO 6-7"]),
    mission: pick(["ADJUST FIRE", "FIRE FOR EFFECT", "SUPPRESS"]),
    point: randomPoint(),
    altitude: pick(["120", "150", "180", "210"]),
    target: pick(["3 VEHICLES MOVING EAST", "INFANTRY SQUAD IN OPEN", "2 VEHICLES AT ROAD JUNCTION"]),
    engagement: pick(["AREA FIRE HE", "HIGH ANGLE HE", "PRECISION FIRE HE"]),
    control: pick(["FIRE WHEN READY", "AT MY COMMAND", "TIME ON TARGET 12 30"]),
  };
}

function MiniProgress({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#65745b] bg-[#111710] px-3 py-2.5">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8ea083]">{label}</div>
      <div className={value >= 3 ? "mt-1 text-sm font-black text-emerald-300" : "mt-1 text-sm font-black text-white"}>
        {statusLabel(value)}
      </div>
    </div>
  );
}

function TrainingMap({
  target,
  selected,
  showTarget,
  interactive = false,
  highlight = "none",
  observer,
  directionMils,
  onClick,
}: {
  target: Point;
  selected?: Point | null;
  showTarget: boolean;
  interactive?: boolean;
  highlight?: TutorialHighlight;
  observer?: Point | null;
  directionMils?: number;
  onClick?: (event: MouseEvent<SVGSVGElement>) => void;
}) {
  const cellX = MAP_MARGIN + target.col * CELL;
  const cellY = MAP_MARGIN + target.row * CELL;
  const subX = cellX + target.eDigit * (CELL / 10);
  const subY = cellY + (9 - target.nDigit) * (CELL / 10);
  const observerX = observer ? pointX(observer) : 0;
  const observerY = observer ? pointY(observer) : 0;
  const directionAngle = typeof directionMils === "number" ? (directionMils / 6400) * Math.PI * 2 : 0;
  const directionX = observerX + Math.sin(directionAngle) * 68;
  const directionY = observerY - Math.cos(directionAngle) * 68;

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      onClick={onClick}
      className={interactive ? "aspect-square w-full cursor-crosshair select-none rounded-xl bg-[#dbe5d2]" : "aspect-square w-full select-none rounded-xl bg-[#dbe5d2]"}
      aria-label="Syntetyczna mapa szkoleniowa z siatką"
    >
      <rect x={MAP_MARGIN} y={MAP_MARGIN} width={MAP_SIZE} height={MAP_SIZE} rx="4" fill="#dce6d2" />
      <path d="M 48 350 C 120 305, 175 365, 245 318 S 365 246, 440 285" fill="none" stroke="#8eb1bd" strokeWidth="14" opacity="0.85" />
      <path d="M 63 86 C 145 145, 222 188, 423 397" fill="none" stroke="#c2aa82" strokeWidth="9" opacity="0.95" />
      <path d="M 70 92 C 150 148, 230 190, 421 396" fill="none" stroke="#eee2c8" strokeWidth="3" />
      <ellipse cx="130" cy="190" rx="55" ry="38" fill="#91aa7e" opacity="0.62" />
      <ellipse cx="352" cy="116" rx="48" ry="34" fill="#8da576" opacity="0.58" />
      <ellipse cx="340" cy="338" rx="64" ry="47" fill="#9eb18d" opacity="0.48" />
      <ellipse cx="275" cy="170" rx="42" ry="24" fill="none" stroke="#a38d68" strokeWidth="2" opacity="0.8" />
      <ellipse cx="275" cy="170" rx="27" ry="15" fill="none" stroke="#a38d68" strokeWidth="1.5" opacity="0.8" />
      <rect x="186" y="260" width="20" height="13" rx="2" fill="#786f60" />
      <rect x="212" y="270" width="24" height="15" rx="2" fill="#786f60" />
      <rect x="245" y="252" width="18" height="12" rx="2" fill="#786f60" />

      {highlight === "easting" && <rect x={cellX} y={MAP_MARGIN} width={CELL} height={MAP_SIZE} fill="#f5c542" opacity="0.26" />}
      {highlight === "northing" && <rect x={MAP_MARGIN} y={cellY} width={MAP_SIZE} height={CELL} fill="#f5c542" opacity="0.26" />}

      {Array.from({ length: 11 }).map((_, i) => (
        <g key={`line-${i}`}>
          <line x1={MAP_MARGIN + i * CELL} y1={MAP_MARGIN} x2={MAP_MARGIN + i * CELL} y2={MAP_MARGIN + MAP_SIZE} stroke="#40513a" strokeWidth={i === 0 || i === 10 ? 1.8 : 1} opacity={i === 0 || i === 10 ? 0.85 : 0.52} />
          <line x1={MAP_MARGIN} y1={MAP_MARGIN + i * CELL} x2={MAP_MARGIN + MAP_SIZE} y2={MAP_MARGIN + i * CELL} stroke="#40513a" strokeWidth={i === 0 || i === 10 ? 1.8 : 1} opacity={i === 0 || i === 10 ? 0.85 : 0.52} />
        </g>
      ))}

      {highlight === "precision" && (
        <g>
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={`sub-${i}`}>
              <line x1={cellX + (i + 1) * 4} y1={cellY} x2={cellX + (i + 1) * 4} y2={cellY + CELL} stroke="#7b5d19" strokeWidth="0.7" opacity="0.65" />
              <line x1={cellX} y1={cellY + (i + 1) * 4} x2={cellX + CELL} y2={cellY + (i + 1) * 4} stroke="#7b5d19" strokeWidth="0.7" opacity="0.65" />
            </g>
          ))}
          <rect x={subX} y={subY} width="4" height="4" fill="#f5c542" opacity="0.9" />
        </g>
      )}

      {Array.from({ length: 10 }).map((_, col) => (
        <text key={`e-${col}`} x={MAP_MARGIN + col * CELL + CELL / 2} y={MAP_MARGIN + MAP_SIZE + 25} textAnchor="middle" fontSize="12" fontWeight="800" fill="#344330">
          {10 + col}
        </text>
      ))}
      {Array.from({ length: 10 }).map((_, row) => (
        <text key={`n-${row}`} x={MAP_MARGIN - 18} y={MAP_MARGIN + row * CELL + CELL / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#344330">
          {29 - row}
        </text>
      ))}

      <text x={MAP_MARGIN + MAP_SIZE / 2} y={VIEW - 8} textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="1.5" fill="#61705a">EASTING →</text>
      <text x="12" y={MAP_MARGIN + MAP_SIZE / 2} textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="1.2" fill="#61705a" transform={`rotate(-90 12 ${MAP_MARGIN + MAP_SIZE / 2})`}>NORTHING →</text>

      {observer && (
        <g>
          {typeof directionMils === "number" && (
            <>
              <line x1={observerX} y1={observerY} x2={directionX} y2={directionY} stroke="#1f5d96" strokeWidth="3" strokeDasharray="6 5" opacity="0.85" />
              <circle cx={directionX} cy={directionY} r="4" fill="#1f5d96" />
            </>
          )}
          <circle cx={observerX} cy={observerY} r="10" fill="#1f5d96" stroke="#fff" strokeWidth="3" />
          <text x={observerX + 13} y={observerY - 11} fontSize="10" fontWeight="900" fill="#173c60">OBS</text>
        </g>
      )}

      {selected && (
        <g>
          <circle cx={pointX(selected)} cy={pointY(selected)} r="8" fill="#fff" stroke="#1f2937" strokeWidth="3" />
          <line x1={pointX(selected) - 13} y1={pointY(selected)} x2={pointX(selected) + 13} y2={pointY(selected)} stroke="#1f2937" strokeWidth="2" />
          <line x1={pointX(selected)} y1={pointY(selected) - 13} x2={pointX(selected)} y2={pointY(selected) + 13} stroke="#1f2937" strokeWidth="2" />
        </g>
      )}

      {showTarget && (
        <g>
          <circle cx={pointX(target)} cy={pointY(target)} r="11" fill="#9f2f24" stroke="#fff" strokeWidth="3" />
          <circle cx={pointX(target)} cy={pointY(target)} r="3.5" fill="#fff" />
        </g>
      )}
    </svg>
  );
}

export default function CffGridTrainer() {
  const [section, setSection] = useState<Section>("learn");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [mode, setMode] = useState<Mode>("read");
  const [precision, setPrecision] = useState<Precision>(4);
  const [challenge, setChallenge] = useState<Point>({ col: 4, row: 5, eDigit: 5, nDigit: 5 });
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<Point | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [cffScenario, setCffScenario] = useState<CffScenario>(() => randomCffScenario());
  const [cffAnswers, setCffAnswers] = useState<CffAnswers>({ one: "", two: "", three: "" });
  const [cffCheck, setCffCheck] = useState<CffCheck>(null);
  const [cffStreak, setCffStreak] = useState(0);
  const [polarScenario, setPolarScenario] = useState<PolarScenario>(() => randomPolarScenario());
  const [polarGrid, setPolarGrid] = useState("");
  const [polarSelected, setPolarSelected] = useState<Point | null>(null);
  const [polarResult, setPolarResult] = useState<PolarResult>(null);
  const [polarStreak, setPolarStreak] = useState(0);

  useEffect(() => {
    setChallenge(randomPoint());
    setCffScenario(randomCffScenario());
    setPolarScenario(randomPolarScenario());
    try {
      const raw = localStorage.getItem(LS_PROGRESS);
      if (raw) setProgress({ ...defaultProgress, ...JSON.parse(raw) });
      const rawCff = localStorage.getItem(LS_CFF_PROGRESS);
      if (rawCff) setCffStreak(clamp(Number(rawCff) || 0, 0, 3));
      const rawPolar = localStorage.getItem(LS_POLAR_PROGRESS);
      if (rawPolar) setPolarStreak(clamp(Number(rawPolar) || 0, 0, 3));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_PROGRESS, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_CFF_PROGRESS, String(cffStreak));
    } catch {}
  }, [cffStreak]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_POLAR_PROGRESS, String(polarStreak));
    } catch {}
  }, [polarStreak]);

  function nextChallenge() {
    setChallenge(randomPoint());
    setAnswer("");
    setSelected(null);
    setResult(null);
  }

  function changeMode(next: Mode) {
    setMode(next);
    setChallenge(randomPoint());
    setAnswer("");
    setSelected(null);
    setResult(null);
  }

  function changePrecision(next: Precision) {
    setPrecision(next);
    setChallenge(randomPoint());
    setAnswer("");
    setSelected(null);
    setResult(null);
  }

  function updateProgress(correct: boolean) {
    const key = skillKey(mode, precision);
    setProgress((prev) => ({ ...prev, [key]: correct ? Math.min(3, (prev[key] ?? 0) + 1) : 0 }));
  }

  function checkAnswer() {
    if (result) return;
    const correctGrid = gridOf(challenge, precision);
    if (mode === "read") {
      const submitted = cleanGrid(answer);
      if (!submitted) return;
      const correct = submitted === correctGrid;
      setResult({ correct });
      updateProgress(correct);
      return;
    }
    if (!selected) return;
    const selectedGrid = gridOf(selected, precision);
    const correct = selectedGrid === correctGrid;
    setResult({ correct, selectedGrid });
    updateProgress(correct);
  }

  function handleMapClick(event: MouseEvent<SVGSVGElement>) {
    if (mode !== "locate" || result) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEW;
    const y = ((event.clientY - rect.top) / rect.height) * VIEW;
    if (x < MAP_MARGIN || y < MAP_MARGIN || x >= MAP_MARGIN + MAP_SIZE || y >= MAP_MARGIN + MAP_SIZE) return;
    const relX = x - MAP_MARGIN;
    const relY = y - MAP_MARGIN;
    const col = clamp(Math.floor(relX / CELL), 0, 9);
    const row = clamp(Math.floor(relY / CELL), 0, 9);
    const localX = relX - col * CELL;
    const localY = relY - row * CELL;
    const eDigit = clamp(Math.floor((localX / CELL) * 10), 0, 9);
    const nDigit = clamp(9 - Math.floor((localY / CELL) * 10), 0, 9);
    setSelected({ col, row, eDigit, nDigit });
  }

  function handlePolarMapClick(event: MouseEvent<SVGSVGElement>) {
    if (polarResult) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * VIEW;
    const y = ((event.clientY - rect.top) / rect.height) * VIEW;
    if (x < MAP_MARGIN || y < MAP_MARGIN || x >= MAP_MARGIN + MAP_SIZE || y >= MAP_MARGIN + MAP_SIZE) return;
    const relX = x - MAP_MARGIN;
    const relY = y - MAP_MARGIN;
    const col = clamp(Math.floor(relX / CELL), 0, 9);
    const row = clamp(Math.floor(relY / CELL), 0, 9);
    const localX = relX - col * CELL;
    const localY = relY - row * CELL;
    const eDigit = clamp(Math.floor((localX / CELL) * 10), 0, 9);
    const nDigit = clamp(9 - Math.floor((localY / CELL) * 10), 0, 9);
    setPolarSelected({ col, row, eDigit, nDigit });
  }

  function checkPolar() {
    if (polarResult || !polarSelected || cleanGrid(polarGrid).length !== 6) return;
    const targetGrid = gridOf(polarScenario.target, 6);
    const selectedGrid = gridOf(polarSelected, 6);
    const clickCorrect = selectedGrid === targetGrid;
    const gridCorrect = cleanGrid(polarGrid) === targetGrid;
    const correct = clickCorrect && gridCorrect;
    setPolarResult({ correct, clickCorrect, gridCorrect, selectedGrid });
    setPolarStreak((prev) => (correct ? Math.min(3, prev + 1) : 0));
  }

  function nextPolarScenario() {
    setPolarScenario(randomPolarScenario());
    setPolarGrid("");
    setPolarSelected(null);
    setPolarResult(null);
  }

  function checkFullCff() {
    if (cffCheck) return;
    const grid = gridOf(cffScenario.point, 6);
    const one = missingParts(cffAnswers.one, [cffScenario.fdc, "THIS IS", cffScenario.observer, cffScenario.mission, "OVER"]);
    const two = missingParts(cffAnswers.two, ["GRID", grid, "OVER"]);
    const three = missingParts(cffAnswers.three, [cffScenario.target, cffScenario.engagement, cffScenario.control, "OVER"]);
    const altitudeGiven = normalizeRadio(cffAnswers.two).includes(normalizeRadio(cffScenario.altitude)) || normalizeRadio(cffAnswers.three).includes(normalizeRadio(cffScenario.altitude));
    if (!altitudeGiven) three.push(`ALTITUDE ${cffScenario.altitude} (w transmisji 2 lub 3)`);
    const correct = one.length === 0 && two.length === 0 && three.length === 0;
    setCffCheck({ correct, one, two, three });
    setCffStreak((prev) => (correct ? Math.min(3, prev + 1) : 0));
  }

  function nextCffScenario() {
    setCffScenario(randomCffScenario());
    setCffAnswers({ one: "", two: "", three: "" });
    setCffCheck(null);
  }

  const correctGrid = gridOf(challenge, precision);
  const activeStreak = progress[skillKey(mode, precision)] ?? 0;
  const showTarget = mode === "read" || !!result;
  const tutorial = [
    {
      title: "1. Najpierw zorientuj siatkę",
      text: "Na tej mapie EASTING rośnie w prawo, a NORTHING rośnie do góry. Zapamiętaj prostą regułę: najpierw w prawo → potem w górę ↑.",
      highlight: "none" as TutorialHighlight,
    },
    {
      title: `2. Odczytaj EASTING: ${easting(tutorialPoint)}`,
      text: "Najpierw ustalasz kolumnę, w której leży punkt. W przykładzie czerwony punkt znajduje się w kolumnie 14. To pierwsza część zapisu.",
      highlight: "easting" as TutorialHighlight,
    },
    {
      title: `3. Odczytaj NORTHING: ${northing(tutorialPoint)}`,
      text: "Potem ustalasz wiersz. W przykładzie punkt leży w wierszu 24. Łączysz EASTING + NORTHING, więc GRID 4-cyfrowy to 1424.",
      highlight: "northing" as TutorialHighlight,
    },
    {
      title: `4. Doprecyzuj do 6 cyfr: ${gridOf(tutorialPoint, 6)}`,
      text: "Przy 6 cyfrach dodajesz po jednej cyfrze położenia wewnątrz kwadratu dla osi E i N. Tutaj: E=5 i N=5, więc zapis to 145245.",
      highlight: "precision" as TutorialHighlight,
    },
  ];

  const cffGrid = gridOf(cffScenario.point, 6);
  const modelOne = `${cffScenario.fdc}, THIS IS ${cffScenario.observer}, ${cffScenario.mission}, OVER.`;
  const modelTwo = `GRID ${cffGrid}, ALTITUDE ${cffScenario.altitude}, OVER.`;
  const modelThree = `${cffScenario.target}, ${cffScenario.engagement}, ${cffScenario.control}, OVER.`;
  const canCheckCff = cffAnswers.one.trim() && cffAnswers.two.trim() && cffAnswers.three.trim();
  const polarObserverGrid = gridOf(polarScenario.observer, 6);
  const polarTargetGrid = gridOf(polarScenario.target, 6);
  const canCheckPolar = !!polarSelected && cleanGrid(polarGrid).length === 6;

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-[#66785a] bg-[#dfe7d7] text-[#11170f] shadow-xl shadow-black/20">
      <div className="border-b border-[#aebaa4] bg-[#cbd6c1] px-5 py-5 sm:px-6">
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#516248]">ETAP IV // CFF // TRENAŻER</div>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black leading-tight sm:text-3xl">Call for Fire — od podstaw do pełnej próby</h3>
            <p className="mt-3 max-w-[82ch] text-sm font-medium leading-6 text-[#364033] sm:text-base">
              Ten moduł prowadzi po kolei przez to, co masz zrobić na punkcie: przygotowanie FO/FDC, trzy transmisje CFF, lokalizację celu metodą GRID lub POLAR, MTO i zakończenie. Dopiero na końcu przechodzisz do pełnej próby bez podpowiedzi. Dane treningowe są fikcyjne.
            </p>
          </div>
          <div className="rounded-xl border border-[#87957d] bg-[#edf2e8] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#526149]">dane fikcyjne</div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="rounded-2xl border border-[#aebaa4] bg-[#f4f7f1] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">CFF — HAK PAMIĘCIOWY</div>
              <h4 className="mt-1 text-lg font-black">6 elementów / 3 transmisje</h4>
            </div>
            <div className="rounded-xl bg-[#182116] px-4 py-2 font-mono text-sm font-black tracking-[0.16em] text-[#eef3e9]">1+2 / 3 / 4+5+6</div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-[#bec8b6] bg-white p-4"><div className="text-xs font-black uppercase tracking-wider text-[#607057]">Transmisja 1</div><div className="mt-2 text-sm font-black">1. Observer Identification</div><div className="mt-1 text-sm font-black">2. Warning Order</div></div>
            <div className="rounded-xl border-2 border-[#65775a] bg-[#e3ebdc] p-4"><div className="text-xs font-black uppercase tracking-wider text-[#53634b]">Transmisja 2</div><div className="mt-2 text-base font-black">3. Target Location</div><div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-black uppercase tracking-wider"><span className="rounded-full bg-[#182116] px-2.5 py-1 text-white">GRID</span><span className="rounded-full border border-[#aebaa4] px-2.5 py-1 text-[#687461]">POLAR</span><span className="rounded-full border border-[#aebaa4] px-2.5 py-1 text-[#687461]">SHIFT</span></div></div>
            <div className="rounded-xl border border-[#bec8b6] bg-white p-4"><div className="text-xs font-black uppercase tracking-wider text-[#607057]">Transmisja 3</div><div className="mt-2 text-sm font-black">4. Target Description</div><div className="mt-1 text-sm font-black">5. Method of Engagement</div><div className="mt-1 text-sm font-black">6. Method of Fire & Control</div></div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {([
            ["learn", "1. CFF krok po kroku"],
            ["grid", "2. GRID"],
            ["polar", "3. POLAR"],
            ["mto", "4. MTO / FO-FDC"],
            ["cff", "5. Pełna próba"],
          ] as Array<[Section, string]>).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setSection(key)} className={section === key ? "rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white" : "rounded-xl border border-[#9daa93] bg-[#edf2e8] px-4 py-3 text-sm font-black text-[#526149] hover:bg-white"}>{label}</button>
          ))}
        </div>

        {section === "learn" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-5 text-[#eef3e9] sm:p-6">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">NAJPIERW ZROZUM PUNKT</div>
              <h4 className="mt-2 text-2xl font-black">Jak wygląda CFF na punkcie — według Twoich materiałów</h4>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  ["1", "Dostajesz mapę, protraktor i kompas. W notatce zaznaczono, że warto mieć własny kompas."],
                  ["2", "W materiałach wspomniano, że może być dopuszczone użycie GPS — aplikacja traktuje to jako informację z notatki, a nie stałą zasadę."],
                  ["3", "Ćwiczysz obie metody lokalizacji celu: GRID i POLAR. Każdy ma własny cel."],
                  ["4", "Pracujecie w parze: jedna osoba jest FO, druga FDC. Rozmawiacie ze sobą jak w krótkiej łączności radiowej."],
                  ["5", "Na punkcie ma być samo CFF — bez korekt z OT Factor. Komendy mają być proste i krótkie."],
                  ["6", "Po CFF ważny jest MTO — Message to Observer. Na końcu zamykasz zadanie meldunkiem END MISSION."],
                ].map(([n, text]) => (
                  <div key={n} className="rounded-xl border border-[#354330] bg-[#10150f] p-4">
                    <div className="font-mono text-xs font-black text-[#9fb093]">KROK {n}</div>
                    <div className="mt-2 text-sm font-semibold leading-6 text-[#d5dfce]">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-5 sm:p-6">
              <div className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">CAŁY SCHEMAT W JEDNYM MIEJSCU</div>
              <h4 className="mt-2 text-xl font-black">CFF = 6 elementów przekazanych w 3 transmisjach</h4>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                <div className="rounded-xl border border-[#bec8b6] bg-white p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-[#607057]">TRANSMISJA 1</div>
                  <div className="mt-2 text-base font-black">1. Observer Identification</div>
                  <div className="mt-1 text-base font-black">2. Warning Order</div>
                  <div className="mt-3 rounded-lg bg-[#edf2e8] p-3 font-mono text-xs font-bold leading-5">
                    [FDC] THIS IS [FO], [MISSION], OVER
                  </div>
                  <p className="mt-3 text-xs font-semibold leading-5 text-[#5d6858]">Z formularza i przykładu: identyfikujesz odbiorcę i siebie, a potem podajesz rodzaj misji. Nie komplikuj.</p>
                </div>
                <div className="rounded-xl border-2 border-[#65775a] bg-[#e3ebdc] p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-[#53634b]">TRANSMISJA 2</div>
                  <div className="mt-2 text-base font-black">3. Target Location</div>
                  <div className="mt-3 rounded-lg bg-white p-3 text-sm font-bold leading-6">
                    <div><b>GRID:</b> podajesz współrzędne celu.</div>
                    <div><b>POLAR:</b> podajesz kierunek i odległość od pozycji FO.</div>
                    <div><b>SHIFT:</b> formularz wymienia także shift from a known point.</div>
                  </div>
                  <p className="mt-3 text-xs font-semibold leading-5 text-[#5d6858]">W Twoich materiałach na punkt nacisk jest na GRID i POLAR — obie metody ćwiczymy osobno.</p>
                </div>
                <div className="rounded-xl border border-[#bec8b6] bg-white p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-[#607057]">TRANSMISJA 3</div>
                  <div className="mt-2 text-base font-black">4. Target Description</div>
                  <div className="mt-1 text-base font-black">5. Method of Engagement</div>
                  <div className="mt-1 text-base font-black">6. Method of Fire & Control</div>
                  <p className="mt-3 text-xs font-semibold leading-5 text-[#5d6858]">Opis celu ma być krótki, ale dokładny. Slajd podpowiada: typ celu, aktywność, liczba, stopień osłony i rozmiar celu.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#aebaa4] bg-[#edf2e8] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">KROK 1 — WARNING ORDER</div>
                <h4 className="mt-2 text-lg font-black">Najpierw wybierasz rodzaj misji</h4>
                <p className="mt-3 text-sm font-medium leading-6 text-[#465342]">W przesłanych materiałach pojawiają się m.in.:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["ADJUST FIRE","FIRE FOR EFFECT","IMMEDIATE SUPPRESSION","IMMEDIATE SMOKE","SEAD","SUPPRESS","MARK"].map((x) => (
                    <span key={x} className="rounded-full border border-[#aebaa4] bg-white px-3 py-1.5 text-xs font-black">{x}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-[#677262]">Aplikacja zachowuje nazwy z Twojego formularza/notatek i nie dopisuje dodatkowych definicji, których w materiale nie ma.</p>
              </div>

              <div className="rounded-2xl border border-[#aebaa4] bg-[#edf2e8] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">KROK 2 — OPIS CELU</div>
                <h4 className="mt-2 text-lg font-black">Nie opisuj „ładnie” — opisz użytecznie i krótko</h4>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-bold sm:grid-cols-3">
                  {["Target type","Activity","Amount","Degree of protection","Target size"].map((x) => (
                    <div key={x} className="rounded-xl border border-[#bec8b6] bg-white p-3">{x}</div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-white p-3 font-mono text-xs font-bold leading-5">Przykład ze slajdu: INFANTRY IN TRENCH LINE, L400 W200, ALTITUDE 1200</div>
              </div>

              <div className="rounded-2xl border border-[#aebaa4] bg-[#edf2e8] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">KROK 3 — METHOD OF ENGAGEMENT</div>
                <h4 className="mt-2 text-lg font-black">Tu określasz sposób oddziaływania — tylko jeśli jest potrzebny</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["DANGER CLOSE","HIGH ANGLE","AMMO TYPE REQUESTED","MARK"].map((x) => (
                    <span key={x} className="rounded-full border border-[#aebaa4] bg-white px-3 py-1.5 text-xs font-black">{x}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-[#677262]">To dokładnie pozycje wypisane na przesłanym formularzu CFF.</p>
              </div>

              <div className="rounded-2xl border border-[#aebaa4] bg-[#edf2e8] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">KROK 4 — METHOD OF FIRE & CONTROL</div>
                <h4 className="mt-2 text-lg font-black">Na końcu określasz sposób kontroli wykonania</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["AT MY COMMAND","REQUEST TIME OF FLIGHT","REQUEST SPLASH","REQUEST TOT","DIRECTION"].map((x) => (
                    <span key={x} className="rounded-full border border-[#aebaa4] bg-white px-3 py-1.5 text-xs font-black">{x}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-[#677262]">W odręcznej notatce pojawia się także FIRE WHEN READY. Traktujemy to jako element Twojego materiału szkoleniowego.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <div className="font-black">Ważna różnica między Twoimi materiałami</div>
              <div className="mt-2">Odręczna kartka umieszcza <b>ALTITUDE</b> przy Target Location, a przykład ze slajdu podaje wysokość przy opisie celu w transmisji 3. Dlatego pełny trener akceptuje wysokość w transmisji 2 <b>lub</b> 3 i nie oznacza jednej z tych wersji automatycznie jako błędnej.</div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div className="overflow-hidden rounded-2xl border border-[#87957d] bg-[#eef3e9] p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-2"><div><div className="text-xs font-black uppercase tracking-[0.16em] text-[#607057]">MINI LEKCJA GRID</div><div className="mt-1 text-sm font-bold text-[#394435]">Eastings → • Northings ↑</div></div><div className="rounded-lg border border-[#b0bca7] bg-white px-2.5 py-1 text-[11px] font-black text-[#526149]">N ↑</div></div>
                <TrainingMap target={tutorialPoint} showTarget highlight={tutorial[tutorialStep].highlight} />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-5 text-[#eef3e9]">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">GRID — KROK {tutorialStep + 1} / {tutorial.length}</div>
                  <h4 className="mt-3 text-xl font-black">{tutorial[tutorialStep].title}</h4>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#d2dccb]">{tutorial[tutorialStep].text}</p>
                  <div className="mt-5 flex gap-2"><button type="button" onClick={() => setTutorialStep((v) => Math.max(0, v - 1))} disabled={tutorialStep === 0} className="flex-1 rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black disabled:opacity-30">← Wstecz</button><button type="button" onClick={() => tutorialStep < tutorial.length - 1 ? setTutorialStep((v) => v + 1) : setSection("grid")} className="flex-1 rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116]">{tutorialStep < tutorial.length - 1 ? "Dalej →" : "Ćwicz GRID →"}</button></div>
                </div>
                <div className="rounded-2xl border border-[#b7c2ae] bg-[#f5f8f2] p-4 text-sm leading-6 text-[#3f4b3a]">
                  <div className="font-black">Najprostsza kolejność nauki</div>
                  <div className="mt-2">1. Naucz się 3 transmisji → 2. GRID → 3. POLAR → 4. MTO → 5. Pełna próba.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "grid" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MiniProgress label="Odczyt • 4 cyfry" value={progress.read4} /><MiniProgress label="Znajdź • 4 cyfry" value={progress.locate4} /><MiniProgress label="Odczyt • 6 cyfr" value={progress.read6} /><MiniProgress label="Znajdź • 6 cyfr" value={progress.locate6} /></div>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
              <div className="overflow-hidden rounded-2xl border border-[#87957d] bg-[#eef3e9] p-3 sm:p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><div className="text-xs font-black uppercase tracking-[0.16em] text-[#607057]">MAPA TRENINGOWA</div><div className="mt-1 text-sm font-bold text-[#394435]">Eastings rosną → • Northings rosną ↑</div></div><div className="rounded-lg border border-[#b0bca7] bg-white px-2.5 py-1 text-[11px] font-black text-[#526149]">N ↑</div></div>
                <TrainingMap target={challenge} selected={selected} showTarget={showTarget} interactive={mode === "locate" && !result} onClick={handleMapClick} />
                <div className="mt-3 rounded-xl border border-[#c0cab8] bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#526149]">To celowo uproszczona, fikcyjna siatka szkoleniowa. Nie odwzorowuje MGRS/UTM ani żadnego rzeczywistego rejonu.</div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">TRYB ZADANIA</div>
                  <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => changeMode("read")} className={mode === "read" ? "rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>Odczytaj GRID</button><button type="button" onClick={() => changeMode("locate")} className={mode === "locate" ? "rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>Znajdź GRID</button></div>
                  <div className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">PRECYZJA</div><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => changePrecision(4)} className={precision === 4 ? "rounded-xl bg-[#dfe7d7] px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>4 cyfry</button><button type="button" onClick={() => changePrecision(6)} className={precision === 6 ? "rounded-xl bg-[#dfe7d7] px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>6 cyfr</button></div>
                </div>
                <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2"><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">ZADANIE</div><span className={activeStreak >= 3 ? "rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-900" : "rounded-full bg-[#e1e9da] px-2.5 py-1 text-[11px] font-black text-[#526149]"}>{statusLabel(activeStreak)}</span></div>
                  {mode === "read" ? <><h4 className="mt-3 text-lg font-black">Podaj GRID czerwonego punktu.</h4><p className="mt-2 text-sm font-medium leading-6 text-[#4e5a49]">Czytaj najpierw <b>easting</b>, potem <b>northing</b>. Wpisz samą liczbę.</p><input value={answer} onChange={(e) => setAnswer(cleanGrid(e.target.value))} onKeyDown={(e) => { if (e.key === "Enter") checkAnswer(); }} inputMode="numeric" placeholder={precision === 4 ? "np. 1426" : "np. 145263"} disabled={!!result} className="mt-4 w-full rounded-xl border border-[#9fad96] bg-white px-4 py-3 font-mono text-xl font-black tracking-[0.2em] outline-none focus:border-[#465540] disabled:opacity-70" /></> : <><h4 className="mt-3 text-lg font-black">Kliknij miejsce odpowiadające GRID:</h4><div className="mt-3 rounded-xl bg-[#182116] px-4 py-3 text-center font-mono text-3xl font-black tracking-[0.24em] text-white">{correctGrid}</div><p className="mt-3 text-sm font-medium leading-6 text-[#4e5a49]">{precision === 4 ? "Wskaż właściwy kwadrat siatki." : "Wskaż właściwą dziesiątą część kwadratu w osi E i N."}</p><div className="mt-3 rounded-xl border border-[#c0cab8] bg-white px-3 py-2 text-sm font-bold text-[#526149]">{selected ? "Punkt zaznaczony — możesz sprawdzić odpowiedź." : "Kliknij na mapie, aby zaznaczyć punkt."}</div></>}
                  {!result ? <button type="button" onClick={checkAnswer} disabled={mode === "read" ? cleanGrid(answer).length !== precision : !selected} className="mt-4 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white transition hover:bg-[#263322] disabled:cursor-not-allowed disabled:opacity-35">Sprawdź</button> : <div className="mt-4 space-y-3"><div className={result.correct ? "rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-950" : "rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold leading-6 text-red-950"}>{result.correct ? "✓ Poprawnie. Seria rośnie o 1." : `✕ Nie tym razem. Poprawny GRID: ${correctGrid}. Seria wraca do 0/3.`}{!result.correct && result.selectedGrid ? <div className="mt-1">Twój klik odpowiadał GRID: {result.selectedGrid}.</div> : null}</div><button type="button" onClick={nextChallenge} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white hover:bg-[#263322]">Następne zadanie</button></div>}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#9dac93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">CEL TRENINGOWY</div><div className="mt-1 text-base font-black">3 poprawne z rzędu = opanowane</div></div><button type="button" onClick={() => setProgress(defaultProgress)} className="rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2 text-xs font-black text-[#c5d1bd] hover:bg-[#202a1d]">Reset postępu GRID</button></div></div>
          </>
        )}


        {section === "polar" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
              <div className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">POLAR — JAK TO CZYTAĆ</div>
              <h4 className="mt-2 text-xl font-black">Pozycja obserwatora + kierunek + odległość = położenie celu</h4>
              <p className="mt-3 text-sm font-medium leading-6 text-[#465342]">
                W metodzie POLAR stanowisko kierowania ogniem musi znać pozycję obserwatora. Obserwator podaje kierunek do celu i odległość; jeżeli różnica wysokości jest istotna, dochodzi również przesunięcie pionowe. W tym ćwiczeniu dodatkowo przeliczasz POLAR na punkt na mapie i 6-cyfrowy GRID, żeby zrozumieć geometrię.
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {[
                  ["0", "N"], ["800", "NE"], ["1600", "E"], ["2400", "SE"],
                  ["3200", "S"], ["4000", "SW"], ["4800", "W"], ["5600", "NW"],
                ].map(([mils, dir]) => (
                  <div key={mils} className="rounded-xl border border-[#bec8b6] bg-white px-2 py-3 text-center">
                    <div className="font-mono text-sm font-black">{mils}</div>
                    <div className="mt-1 text-[10px] font-black uppercase tracking-wider text-[#687461]">{dir}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-[#c0cab8] bg-[#edf2e8] px-3 py-3 text-xs font-semibold leading-5 text-[#526149]">
                Hak: <b>0/6400 = północ</b>, <b>1600 = wschód</b>, <b>3200 = południe</b>, <b>4800 = zachód</b>. Kierunek liczysz zgodnie z ruchem wskazówek zegara od północy.
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
              <div className="overflow-hidden rounded-2xl border border-[#87957d] bg-[#eef3e9] p-3 sm:p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-[#607057]">MAPA POLAR</div>
                    <div className="mt-1 text-sm font-bold text-[#394435]">Niebieski = obserwator • linia = kierunek • klik = Twój cel</div>
                  </div>
                  <div className="rounded-lg border border-[#b0bca7] bg-white px-2.5 py-1 text-[11px] font-black text-[#526149]">N ↑</div>
                </div>
                <TrainingMap
                  target={polarScenario.target}
                  observer={polarScenario.observer}
                  directionMils={polarScenario.directionMils}
                  selected={polarSelected}
                  showTarget={!!polarResult}
                  interactive={!polarResult}
                  onClick={handlePolarMapClick}
                />
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wider">
                  <span className="rounded-full bg-[#1f5d96] px-2.5 py-1 text-white">OBS — obserwator</span>
                  <span className="rounded-full border border-[#87957d] bg-white px-2.5 py-1 text-[#526149]">biały celownik — Twój wybór</span>
                  {polarResult && <span className="rounded-full bg-[#9f2f24] px-2.5 py-1 text-white">czerwony — poprawny cel</span>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">FIKCYJNE DANE POLAR</div>
                    <span className={polarStreak >= 3 ? "rounded-full bg-emerald-200 px-2.5 py-1 text-[11px] font-black text-emerald-950" : "rounded-full border border-[#43503d] px-2.5 py-1 text-[11px] font-black"}>{statusLabel(polarStreak)}</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#354330] bg-[#10150f] px-3 py-2.5"><span className="text-[10px] font-black uppercase tracking-wider text-[#8fa184]">OBSERVER GRID</span><span className="font-mono font-black">{polarObserverGrid}</span></div>
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#354330] bg-[#10150f] px-3 py-2.5"><span className="text-[10px] font-black uppercase tracking-wider text-[#8fa184]">DIRECTION</span><span className="font-mono font-black">{polarScenario.directionMils} mil</span></div>
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#354330] bg-[#10150f] px-3 py-2.5"><span className="text-[10px] font-black uppercase tracking-wider text-[#8fa184]">DISTANCE</span><span className="font-mono font-black">{polarScenario.distanceM} m</span></div>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-[#aabd9a]">Na tej uproszczonej mapie jedna duża kratka odpowiada 1000 m, a jedna dziesiąta kratki — 100 m.</p>
                </div>

                <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">ZADANIE</div>
                  <h4 className="mt-2 text-lg font-black">Wyznacz cel z danych POLAR.</h4>
                  <ol className="mt-3 space-y-2 text-sm font-medium leading-6 text-[#4e5a49]">
                    <li><b>1.</b> Zacznij od niebieskiego OBS.</li>
                    <li><b>2.</b> Idź w podanym kierunku.</li>
                    <li><b>3.</b> Odłóż podaną odległość.</li>
                    <li><b>4.</b> Kliknij cel i wpisz jego GRID 6-cyfrowy.</li>
                  </ol>
                  <input
                    value={polarGrid}
                    onChange={(e) => !polarResult && setPolarGrid(cleanGrid(e.target.value))}
                    inputMode="numeric"
                    maxLength={6}
                    disabled={!!polarResult}
                    placeholder="GRID celu, np. 145263"
                    className="mt-4 w-full rounded-xl border border-[#9fad96] bg-white px-4 py-3 font-mono text-xl font-black tracking-[0.2em] outline-none focus:border-[#465540] disabled:opacity-70"
                  />
                  <div className="mt-3 rounded-xl border border-[#c0cab8] bg-white px-3 py-2 text-sm font-bold text-[#526149]">
                    {polarSelected ? `Twój klik: GRID ${gridOf(polarSelected, 6)}` : "Kliknij na mapie miejsce, w którym według Ciebie znajduje się cel."}
                  </div>

                  {!polarResult ? (
                    <button type="button" onClick={checkPolar} disabled={!canCheckPolar} className="mt-4 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white transition hover:bg-[#263322] disabled:cursor-not-allowed disabled:opacity-35">Sprawdź POLAR</button>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <div className={polarResult.correct ? "rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-950" : "rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold leading-6 text-red-950"}>
                        {polarResult.correct ? "✓ Poprawnie. Punkt i GRID zgadzają się — seria POLAR rośnie o 1." : `✕ Nie tym razem. Poprawny punkt to GRID ${polarTargetGrid}. ${!polarResult.clickCorrect ? `Twój klik: ${polarResult.selectedGrid}. ` : ""}${!polarResult.gridCorrect ? `Wpisałeś GRID: ${cleanGrid(polarGrid)}.` : ""}`}
                      </div>
                      <button type="button" onClick={nextPolarScenario} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white hover:bg-[#263322]">Nowe zadanie POLAR</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#9dac93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">WAŻNE W CFF</div>
                  <div className="mt-1 text-base font-black">POLAR ≠ transmisja wynikowego GRID-u</div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#cbd6c4]">W metodzie POLAR FDC zna położenie obserwatora, a Ty przekazujesz położenie celu względem siebie — przede wszystkim kierunek i odległość. Ten moduł każe dodatkowo znaleźć GRID tylko po to, żebyś nauczył się prawidłowo odkładać kierunek i dystans na mapie.</p>
                </div>
                <button type="button" onClick={() => setPolarStreak(0)} className="rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2 text-xs font-black text-[#c5d1bd] hover:bg-[#202a1d]">Reset POLAR</button>
              </div>
            </div>
          </div>
        )}

        {section === "mto" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-5 text-[#eef3e9] sm:p-6">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">ROLE NA PUNKCIE</div>
              <h4 className="mt-2 text-2xl font-black">FO mówi CFF → FDC odpowiada MTO</h4>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#d2dccb]">Z notatki egzaminacyjnej: zdajecie w parach. Jedna osoba pełni rolę FO, druga FDC, a komunikacja między Wami jest oceniana. Dlatego trzeba umieć nie tylko nadać CFF, ale też rozpoznać odpowiedź FDC.</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[#354330] bg-[#10150f] p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-[#9fb093]">FO — Forward Observer</div>
                  <div className="mt-2 text-sm font-semibold leading-6">Przygotowuje dane o celu i nadaje trzy transmisje CFF. Po otrzymaniu odpowiedzi słucha MTO i prowadzi dalszą komunikację zgodnie z zadaniem.</div>
                </div>
                <div className="rounded-xl border border-[#354330] bg-[#10150f] p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-[#9fb093]">FDC — Fire Direction Center</div>
                  <div className="mt-2 text-sm font-semibold leading-6">Odbiera wezwanie FO i przekazuje Message to Observer. W treningu parowym jedna osoba może czytać kartę MTO, druga odpowiadać jako FO.</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-5 sm:p-6">
              <div className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">MESSAGE TO OBSERVER — Z TWOJEGO FORMULARZA</div>
              <h4 className="mt-2 text-xl font-black">MTO składa się z pięciu pól</h4>
              <div className="mt-4 space-y-2">
                {[
                  ["1", "Call of unit firing the mission"],
                  ["2", "Changes to the Call for Fire"],
                  ["3", "Number of rounds"],
                  ["4", "Target number"],
                  ["5", "Additional info — Time of Flight, MAX ORD, GTL"],
                ].map(([n, text]) => (
                  <div key={n} className="flex items-start gap-3 rounded-xl border border-[#bec8b6] bg-white p-4">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#182116] font-mono text-xs font-black text-white">{n}</div>
                    <div className="pt-1 text-sm font-black">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#aebaa4] bg-[#edf2e8] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">PROSTA GIERKA W PARZE</div>
                <h4 className="mt-2 text-lg font-black">Drill FO ↔ FDC</h4>
                <ol className="mt-3 space-y-2 text-sm font-semibold leading-6 text-[#465342]">
                  <li><b>1.</b> FO losuje lub wybiera scenariusz w zakładce Pełna próba.</li>
                  <li><b>2.</b> FO przekazuje trzy transmisje.</li>
                  <li><b>3.</b> FDC odpowiada, korzystając z pięciu pól MTO powyżej.</li>
                  <li><b>4.</b> Zamieniacie się rolami i powtarzacie.</li>
                </ol>
                <div className="mt-4 rounded-xl border border-[#c0cab8] bg-white p-3 text-xs font-semibold leading-5 text-[#526149]">Zgodnie z Twoją notatką: proste komendy, bez „wydziwiania”, i bez korekt z OT Factor.</div>
              </div>

              <div className="rounded-2xl border border-[#aebaa4] bg-[#edf2e8] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">ZAKOŃCZENIE</div>
                <h4 className="mt-2 text-lg font-black">Po wykonaniu zadania zamykasz misję</h4>
                <div className="mt-4 rounded-xl bg-[#182116] p-4 font-mono text-sm font-black text-white">END MISSION … OVER</div>
                <p className="mt-3 text-xs font-semibold leading-5 text-[#677262]">Na przesłanym formularzu pod MTO znajduje się także zapis „If hit or close FIRE FOR EFFECT OVER”. Aplikacja pokazuje go jako element materiału, ale nie rozwija korekt, ponieważ Twoja notatka o punkcie mówi wprost: bez korekt z OT Factor.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#9dac93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">HACZYK PAMIĘCIOWY</div>
              <div className="mt-2 text-base font-black">FO: 3 transmisje → FDC: MTO → FO: zakończenie</div>
              <div className="mt-2 text-sm font-semibold leading-6 text-[#cbd6c4]">Nie próbuj uczyć się wszystkiego naraz. Najpierw automatyzujesz kolejność 3 transmisji, później lokalizację, na końcu dopiero dialog w parze.</div>
            </div>
          </div>
        )}

        {section === "cff" && (
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
                <div className="flex items-center justify-between gap-3"><div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">FIKCYJNY SCENARIUSZ</div><span className={cffStreak >= 3 ? "rounded-full bg-emerald-200 px-2.5 py-1 text-[11px] font-black text-emerald-950" : "rounded-full border border-[#43503d] px-2.5 py-1 text-[11px] font-black"}>{statusLabel(cffStreak)}</span></div>
                <div className="mt-4 grid gap-2 text-sm">
                  {[['FDC', cffScenario.fdc], ['OBSERVER', cffScenario.observer], ['MISSION', cffScenario.mission], ['GRID', cffGrid], ['ALTITUDE', cffScenario.altitude], ['TARGET', cffScenario.target], ['ENGAGEMENT', cffScenario.engagement], ['CONTROL', cffScenario.control]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 rounded-xl border border-[#354330] bg-[#10150f] px-3 py-2.5"><span className="text-[10px] font-black uppercase tracking-wider text-[#8fa184]">{label}</span><span className="text-right font-mono font-black">{value}</span></div>)}
                </div>
                <p className="mt-4 text-xs leading-5 text-[#aabd9a]">Wpisz trzy transmisje samodzielnie. Interpunkcja nie ma znaczenia — sprawdzane są wymagane elementy i ich treść.</p>
              </div>

              <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">PEŁNY CFF — WPISZ Z PAMIĘCI</div>
                <div className="mt-4 space-y-4">
                  {([
                    ["one", "Transmisja 1", "Observer Identification + Warning Order"],
                    ["two", "Transmisja 2", "Target Location"],
                    ["three", "Transmisja 3", "Target Description + Method of Engagement + Fire & Control"],
                  ] as Array<[keyof CffAnswers, string, string]>).map(([key, title, subtitle]) => (
                    <div key={key}><div className="flex flex-wrap items-end justify-between gap-2"><div><div className="text-sm font-black">{title}</div><div className="text-xs font-semibold text-[#687461]">{subtitle}</div></div>{cffCheck && <span className={(cffCheck[key] as string[]).length === 0 ? "text-xs font-black text-emerald-700" : "text-xs font-black text-red-700"}>{(cffCheck[key] as string[]).length === 0 ? "✓ kompletna" : `brakuje: ${(cffCheck[key] as string[]).join(', ')}`}</span>}</div><textarea value={cffAnswers[key]} onChange={(e) => !cffCheck && setCffAnswers((prev) => ({ ...prev, [key]: e.target.value }))} disabled={!!cffCheck} rows={3} placeholder={key === "one" ? "[FDC], THIS IS [OBSERVER], ..." : key === "two" ? "GRID ..., ALTITUDE ..., OVER" : "[TARGET], [ENGAGEMENT], [CONTROL], OVER"} className="mt-2 w-full rounded-xl border border-[#9fad96] bg-white px-3.5 py-3 font-mono text-sm font-semibold leading-6 outline-none focus:border-[#465540] disabled:opacity-70" /></div>
                  ))}
                </div>

                {!cffCheck ? <button type="button" onClick={checkFullCff} disabled={!canCheckCff} className="mt-5 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white transition hover:bg-[#263322] disabled:cursor-not-allowed disabled:opacity-35">Sprawdź cały CFF</button> : <div className="mt-5 space-y-3"><div className={cffCheck.correct ? "rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950" : "rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-bold leading-6 text-red-950"}>{cffCheck.correct ? "✓ Cały meldunek poprawny. Seria CFF rośnie o 1." : "✕ W meldunku brakuje elementów. Seria pełnego CFF wraca do 0/3."}</div><div className="rounded-xl border border-[#b7c2ae] bg-white p-4"><div className="text-xs font-black uppercase tracking-wider text-[#607057]">WZORCOWA WERSJA DLA TEGO SCENARIUSZA</div><div className="mt-3 space-y-2 font-mono text-sm font-bold leading-6"><div>1. {modelOne}</div><div>2. {modelTwo}</div><div>3. {modelThree}</div></div></div><button type="button" onClick={nextCffScenario} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white hover:bg-[#263322]">Nowy scenariusz CFF</button></div>}
              </div>
            </div>

            <div className="rounded-2xl border border-[#b7c2ae] bg-[#edf2e8] p-4 text-sm leading-6 text-[#3f4b3a]">
              <div className="font-black">Jak aplikacja sprawdza meldunek?</div>
              <div className="mt-2">Nie wymaga identycznych przecinków ani kropek. Transmisja 1 musi zawierać kryptonimy, <b>THIS IS</b>, rodzaj misji i <b>OVER</b>. Transmisja 2 musi zawierać <b>GRID</b>, właściwe współrzędne i <b>OVER</b>. Transmisja 3 — opis celu, sposób wykonania, kontrolę i <b>OVER</b>. <b>ALTITUDE</b> może wystąpić w transmisji 2 albo 3, bo oba warianty pojawiają się w przesłanych materiałach.</div>
              <div className="mt-3 rounded-xl border border-[#c0cab8] bg-white p-3 text-xs font-semibold leading-5 text-[#526149]"><b>Przykład ze slajdu:</b> ROPE 15 THIS IS DRAGON 11, FIRE FOR EFFECT, OVER → GRID 33 UWS 286 479, OVER → INFANTRY IN TRENCH LINE, L400 W200, ALTITUDE 1200, OVER.</div>
              <button type="button" onClick={() => setCffStreak(0)} className="mt-3 rounded-xl border border-[#9daa93] bg-white px-3 py-2 text-xs font-black text-[#526149]">Reset postępu pełnego CFF</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

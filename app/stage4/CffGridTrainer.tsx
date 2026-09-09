"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type Mode = "read" | "locate";
type Precision = 4 | 6;
type SkillKey = "read4" | "locate4" | "read6" | "locate6";
type Point = { col: number; row: number; eDigit: number; nDigit: number };
type Result = { correct: boolean; selectedGrid?: string } | null;
type Progress = Record<SkillKey, number>;

const LS_PROGRESS = "officer_stage4_cff_grid_progress_v1";
const MAP_MARGIN = 44;
const MAP_SIZE = 400;
const CELL = 40;
const VIEW = 488;

const defaultProgress: Progress = {
  read4: 0,
  locate4: 0,
  read6: 0,
  locate6: 0,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

export default function CffGridTrainer() {
  const [mode, setMode] = useState<Mode>("read");
  const [precision, setPrecision] = useState<Precision>(4);
  const [challenge, setChallenge] = useState<Point>({ col: 4, row: 5, eDigit: 5, nDigit: 5 });
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<Point | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setChallenge(randomPoint());
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
    setProgress((prev) => ({
      ...prev,
      [key]: correct ? Math.min(3, (prev[key] ?? 0) + 1) : 0,
    }));
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

  const correctGrid = gridOf(challenge, precision);
  const activeStreak = progress[skillKey(mode, precision)] ?? 0;
  const showTarget = mode === "read" || !!result;

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-[#66785a] bg-[#dfe7d7] text-[#11170f] shadow-xl shadow-black/20">
      <div className="border-b border-[#aebaa4] bg-[#cbd6c1] px-5 py-5 sm:px-6">
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#516248]">ETAP IV // CFF // TRENAŻER</div>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black leading-tight sm:text-3xl">Call for Fire — Target Location: GRID</h3>
            <p className="mt-3 max-w-[82ch] text-sm font-medium leading-6 text-[#364033] sm:text-base">
              Zamiast samego tekstu ćwiczysz tutaj położenie na syntetycznej mapie szkoleniowej. Trenażer uczy kolejności odczytu siatki i precyzji zapisu; nie korzysta z prawdziwych map ani danych terenowych.
            </p>
          </div>
          <div className="rounded-xl border border-[#87957d] bg-[#edf2e8] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#526149]">
            dane fikcyjne
          </div>
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
            <div className="rounded-xl border border-[#bec8b6] bg-white p-4">
              <div className="text-xs font-black uppercase tracking-wider text-[#607057]">Transmisja 1</div>
              <div className="mt-2 text-sm font-black">1. Observer Identification</div>
              <div className="mt-1 text-sm font-black">2. Warning Order</div>
            </div>
            <div className="rounded-xl border-2 border-[#65775a] bg-[#e3ebdc] p-4">
              <div className="text-xs font-black uppercase tracking-wider text-[#53634b]">Transmisja 2 • ćwiczymy teraz</div>
              <div className="mt-2 text-base font-black">3. Target Location</div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-black uppercase tracking-wider">
                <span className="rounded-full bg-[#182116] px-2.5 py-1 text-white">GRID</span>
                <span className="rounded-full border border-[#aebaa4] px-2.5 py-1 text-[#687461]">POLAR</span>
                <span className="rounded-full border border-[#aebaa4] px-2.5 py-1 text-[#687461]">SHIFT</span>
              </div>
            </div>
            <div className="rounded-xl border border-[#bec8b6] bg-white p-4">
              <div className="text-xs font-black uppercase tracking-wider text-[#607057]">Transmisja 3</div>
              <div className="mt-2 text-sm font-black">4. Target Description</div>
              <div className="mt-1 text-sm font-black">5. Method of Engagement</div>
              <div className="mt-1 text-sm font-black">6. Method of Fire & Control</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MiniProgress label="Odczyt • 4 cyfry" value={progress.read4} />
          <MiniProgress label="Znajdź • 4 cyfry" value={progress.locate4} />
          <MiniProgress label="Odczyt • 6 cyfr" value={progress.read6} />
          <MiniProgress label="Znajdź • 6 cyfr" value={progress.locate6} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="overflow-hidden rounded-2xl border border-[#87957d] bg-[#eef3e9] p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-[#607057]">MAPA TRENINGOWA</div>
                <div className="mt-1 text-sm font-bold text-[#394435]">Eastings rosną → • Northings rosną ↑</div>
              </div>
              <div className="rounded-lg border border-[#b0bca7] bg-white px-2.5 py-1 text-[11px] font-black text-[#526149]">N ↑</div>
            </div>

            <svg
              ref={svgRef}
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              onClick={handleMapClick}
              className={mode === "locate" && !result ? "aspect-square w-full cursor-crosshair select-none rounded-xl bg-[#dbe5d2]" : "aspect-square w-full select-none rounded-xl bg-[#dbe5d2]"}
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

              {Array.from({ length: 11 }).map((_, i) => (
                <g key={`line-${i}`}>
                  <line x1={MAP_MARGIN + i * CELL} y1={MAP_MARGIN} x2={MAP_MARGIN + i * CELL} y2={MAP_MARGIN + MAP_SIZE} stroke="#40513a" strokeWidth={i === 0 || i === 10 ? 1.8 : 1} opacity={i === 0 || i === 10 ? 0.85 : 0.52} />
                  <line x1={MAP_MARGIN} y1={MAP_MARGIN + i * CELL} x2={MAP_MARGIN + MAP_SIZE} y2={MAP_MARGIN + i * CELL} stroke="#40513a" strokeWidth={i === 0 || i === 10 ? 1.8 : 1} opacity={i === 0 || i === 10 ? 0.85 : 0.52} />
                </g>
              ))}

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

              {selected && (
                <g>
                  <circle cx={pointX(selected)} cy={pointY(selected)} r="8" fill="#fff" stroke="#1f2937" strokeWidth="3" />
                  <line x1={pointX(selected) - 13} y1={pointY(selected)} x2={pointX(selected) + 13} y2={pointY(selected)} stroke="#1f2937" strokeWidth="2" />
                  <line x1={pointX(selected)} y1={pointY(selected) - 13} x2={pointX(selected)} y2={pointY(selected) + 13} stroke="#1f2937" strokeWidth="2" />
                </g>
              )}

              {showTarget && (
                <g>
                  <circle cx={pointX(challenge)} cy={pointY(challenge)} r="11" fill="#9f2f24" stroke="#fff" strokeWidth="3" />
                  <circle cx={pointX(challenge)} cy={pointY(challenge)} r="3.5" fill="#fff" />
                </g>
              )}
            </svg>

            <div className="mt-3 rounded-xl border border-[#c0cab8] bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#526149]">
              To celowo uproszczona, fikcyjna siatka szkoleniowa. Nie odwzorowuje MGRS/UTM ani żadnego rzeczywistego rejonu.
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#9daa93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">TRYB ZADANIA</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => changeMode("read")} className={mode === "read" ? "rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>
                  Odczytaj GRID
                </button>
                <button type="button" onClick={() => changeMode("locate")} className={mode === "locate" ? "rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>
                  Znajdź GRID
                </button>
              </div>

              <div className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">PRECYZJA</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => changePrecision(4)} className={precision === 4 ? "rounded-xl bg-[#dfe7d7] px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>4 cyfry</button>
                <button type="button" onClick={() => changePrecision(6)} className={precision === 6 ? "rounded-xl bg-[#dfe7d7] px-3 py-2.5 text-sm font-black text-[#182116]" : "rounded-xl border border-[#43503d] px-3 py-2.5 text-sm font-black text-[#c5d1bd]"}>6 cyfr</button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#aebaa4] bg-[#f5f8f2] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">ZADANIE</div>
                <span className={activeStreak >= 3 ? "rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-900" : "rounded-full bg-[#e1e9da] px-2.5 py-1 text-[11px] font-black text-[#526149]"}>{statusLabel(activeStreak)}</span>
              </div>

              {mode === "read" ? (
                <>
                  <h4 className="mt-3 text-lg font-black">Podaj GRID czerwonego punktu.</h4>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#4e5a49]">
                    Czytaj najpierw <b>easting</b> (w prawo), potem <b>northing</b> (w górę). Wpisz samą liczbę.
                  </p>
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(cleanGrid(e.target.value))}
                    onKeyDown={(e) => { if (e.key === "Enter") checkAnswer(); }}
                    inputMode="numeric"
                    placeholder={precision === 4 ? "np. 1426" : "np. 145263"}
                    disabled={!!result}
                    className="mt-4 w-full rounded-xl border border-[#9fad96] bg-white px-4 py-3 font-mono text-xl font-black tracking-[0.2em] outline-none focus:border-[#465540] disabled:opacity-70"
                  />
                </>
              ) : (
                <>
                  <h4 className="mt-3 text-lg font-black">Kliknij miejsce odpowiadające GRID:</h4>
                  <div className="mt-3 rounded-xl bg-[#182116] px-4 py-3 text-center font-mono text-3xl font-black tracking-[0.24em] text-white">{correctGrid}</div>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#4e5a49]">
                    {precision === 4 ? "Wskaż właściwy kwadrat siatki." : "Wskaż właściwą dziesiątą część kwadratu w osi E i N."}
                  </p>
                  <div className="mt-3 rounded-xl border border-[#c0cab8] bg-white px-3 py-2 text-sm font-bold text-[#526149]">
                    {selected ? "Punkt zaznaczony — możesz sprawdzić odpowiedź." : "Kliknij na mapie, aby zaznaczyć punkt."}
                  </div>
                </>
              )}

              {!result ? (
                <button
                  type="button"
                  onClick={checkAnswer}
                  disabled={mode === "read" ? cleanGrid(answer).length !== precision : !selected}
                  className="mt-4 w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white transition hover:bg-[#263322] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Sprawdź
                </button>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className={result.correct ? "rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-950" : "rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold leading-6 text-red-950"}>
                    {result.correct ? "✓ Poprawnie. Seria rośnie o 1." : `✕ Nie tym razem. Poprawny GRID: ${correctGrid}. Seria dla tej umiejętności wraca do 0/3.`}
                    {!result.correct && result.selectedGrid ? <div className="mt-1">Twój klik odpowiadał GRID: {result.selectedGrid}.</div> : null}
                  </div>
                  <button type="button" onClick={nextChallenge} className="w-full rounded-xl bg-[#182116] px-4 py-3 text-sm font-black text-white hover:bg-[#263322]">Następne zadanie</button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#b7c2ae] bg-[#edf2e8] p-4 text-sm leading-6 text-[#3f4b3a]">
              <div className="font-black">Jak czytać zapis</div>
              <div className="mt-2"><b>4 cyfry:</b> 2 cyfry easting + 2 cyfry northing = wskazanie kwadratu.</div>
              <div className="mt-1"><b>6 cyfr:</b> do każdej osi dochodzi jedna cyfra doprecyzowania wewnątrz kwadratu.</div>
              <div className="mt-2 font-black">Reguła pamięciowa: najpierw w prawo → potem w górę ↑.</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#9dac93] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">CEL TRENINGOWY</div>
              <div className="mt-1 text-base font-black">3 poprawne z rzędu = opanowane</div>
            </div>
            <button
              type="button"
              onClick={() => setProgress(defaultProgress)}
              className="rounded-xl border border-[#43503d] bg-[#10150f] px-3 py-2 text-xs font-black text-[#c5d1bd] hover:bg-[#202a1d]"
            >
              Reset postępu GRID
            </button>
          </div>
          <p className="mt-3 max-w-[82ch] text-sm leading-6 text-[#c5d1bd]">
            Każdy z czterech wariantów ma osobną serię: odczyt i wskazywanie dla 4 oraz 6 cyfr. Błąd zeruje tylko serię aktualnie ćwiczonej umiejętności.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

const EXAM_DATE = new Date("2026-11-03T00:00:00+01:00").getTime();

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

function getRemaining(): Remaining {
  const difference = Math.max(0, EXAM_DATE - Date.now());

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
    seconds: Math.floor((difference % 60_000) / 1_000),
    finished: difference <= 0,
  };
}

export default function ExamCountdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const update = () => setRemaining(getRemaining());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const values = useMemo(
    () => [
      { label: "dni", value: remaining?.days ?? "—" },
      { label: "godz.", value: remaining ? String(remaining.hours).padStart(2, "0") : "—" },
      { label: "min", value: remaining ? String(remaining.minutes).padStart(2, "0") : "—" },
      { label: "sek", value: remaining ? String(remaining.seconds).padStart(2, "0") : "—" },
    ],
    [remaining]
  );

  return (
    <div className="mil-countdown relative mt-7 max-w-2xl overflow-hidden rounded-2xl border border-[#4a5842] bg-[#0b0f0a] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(127,141,112,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(127,141,112,0.035)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a5b696]/80 to-transparent" />

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-[#303a2c] pb-4">
        <div className="text-left">
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#819176]">OPERACJA // EGZAMIN OFICERSKI</div>
          <div className="mt-2 text-xl font-black uppercase tracking-[0.08em] text-[#e2e7dc] sm:text-2xl">Odliczanie do terminu</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid h-11 min-w-16 place-items-center rounded-lg border border-[#65745a] bg-[#1a2117] px-3 font-mono text-sm font-black tracking-[0.12em] text-[#d2ddc7]">
            {remaining?.finished ? "D+" : `D-${remaining?.days ?? "—"}`}
          </div>
          <div className="text-left">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#697763]">Termin</div>
            <div className="mt-1 font-mono text-sm font-black text-[#d5d9ce]">03.11.2026</div>
          </div>
        </div>
      </div>

      {!remaining?.finished && (
        <div className="relative z-10 mt-4 grid grid-cols-4 gap-2" aria-label="Odliczanie do egzaminu oficerskiego">
          {values.map((item) => (
            <div key={item.label} className="min-w-0 rounded-lg border border-[#303a2c] bg-[#11160f]/90 px-1 py-3 text-center sm:py-4">
              <div className="font-mono text-2xl font-black tabular-nums text-[#cbd7bf] sm:text-4xl">{item.value}</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#65705e] sm:text-[10px]">{item.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="relative z-10 mt-4 flex items-center justify-between gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#626f5b]">
        <span>{remaining?.finished ? "TERMIN OSIĄGNIĘTY" : "ODLICZANIE AKTYWNE"}</span>
        <span>STATUS // GOTOWOŚĆ</span>
      </div>
    </div>
  );
}

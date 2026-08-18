"use client";

import { useEffect, useMemo, useState } from "react";

const EXAM_DATE = new Date("2026-09-30T00:00:00+02:00").getTime();

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
    <div className="mil-countdown relative mt-7 max-w-2xl overflow-hidden rounded-2xl border border-[#46523f] bg-[#0a0d09]/78 p-4 shadow-inner shadow-black/30 sm:p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#819272]/70 to-transparent" />
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 min-w-16 place-items-center rounded-xl border border-[#526049] bg-[#151a12] px-3 font-mono text-sm font-black tracking-[0.12em] text-[#bec9ae]">
            {remaining?.finished ? "D+" : `D-${remaining?.days ?? "—"}`}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#697763]">Termin egzaminu</div>
            <div className="mt-1 text-sm font-semibold text-[#d5d9ce]">30 września 2026</div>
          </div>
        </div>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66725e]">
          {remaining?.finished ? "TERMIN OSIĄGNIĘTY" : "ODLICZANIE AKTYWNE"}
        </div>
      </div>

      {!remaining?.finished && (
        <div className="relative z-10 mt-4 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Odliczanie do egzaminu oficerskiego">
          {values.map((item) => (
            <div key={item.label} className="rounded-xl border border-[#293126] bg-[#11150f]/95 px-2 py-3 text-center sm:px-3">
              <div className="font-mono text-xl font-black tabular-nums text-[#e2e5db] sm:text-2xl">{item.value}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#65705e] sm:text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

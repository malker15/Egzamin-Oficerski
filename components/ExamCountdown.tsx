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
    <div className="mt-7 max-w-2xl rounded-2xl border border-neutral-700/80 bg-neutral-950/65 p-4 shadow-inner shadow-black/20 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Termin egzaminu</div>
          <div className="mt-1 text-sm font-semibold text-neutral-200">30 września 2026</div>
        </div>
        <div className="text-xs font-medium text-neutral-500">{remaining?.finished ? "Termin egzaminu nadszedł" : "Do egzaminu zostało"}</div>
      </div>

      {!remaining?.finished && (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Odliczanie do egzaminu oficerskiego">
          {values.map((item) => (
            <div key={item.label} className="rounded-xl border border-neutral-800 bg-neutral-900/90 px-2 py-3 text-center sm:px-3">
              <div className="font-mono text-xl font-black tabular-nums text-white sm:text-2xl">{item.value}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 sm:text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

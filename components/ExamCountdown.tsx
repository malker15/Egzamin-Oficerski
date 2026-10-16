"use client";

import { useEffect, useMemo, useState } from "react";

const EXAM_DATE = new Date("2026-10-19T00:00:00+02:00").getTime();

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
  const [sound, setSound] = useState(true);

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
    <div className="relative mt-7 max-w-2xl overflow-hidden rounded-2xl border border-[#285039] bg-black p-5 text-center shadow-[0_0_50px_#226c3433] sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#185a3044,transparent_70%)]" />
      <div className="relative font-serif text-4xl font-bold tracking-[0.12em] text-[#c5f5cf] [text-shadow:0_0_24px_#72ff99aa] sm:text-6xl">DOOMSDAY</div>
      <div className="relative mb-7 mt-3 text-[9px] tracking-[0.23em] text-[#80b18c]">CZAS DO OSTATECZNEGO STARCIA</div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#819272]/70 to-transparent" />
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 min-w-16 place-items-center rounded-xl border border-[#526049] bg-[#151a12] px-3 font-mono text-sm font-black tracking-[0.12em] text-[#bec9ae]">
            {remaining?.finished ? "D+" : `D-${remaining?.days ?? "—"}`}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#697763]">Termin egzaminu</div>
            <div className="mt-1 text-sm font-semibold text-[#d5d9ce]">19 października 2026</div>
          </div>
        </div>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66725e]">
          {remaining?.finished ? "TERMIN OSIĄGNIĘTY" : "ODLICZANIE AKTYWNE"}
        </div>
      </div>

      {!remaining?.finished && (
        <div className="relative z-10 mt-4 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Odliczanie do egzaminu oficerskiego">
          {values.map((item) => (
            <div key={item.label} className="min-w-0 border-r border-[#295838] px-1 py-4 text-center last:border-0">
              <div className="font-mono text-3xl font-light tabular-nums text-[#bdffce] [text-shadow:0_0_10px_#6cff9c99,0_0_25px_#40ff7c55] sm:text-5xl">{item.value}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#65705e] sm:text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="relative mt-5 border-t border-[#284832] pt-4">
        <button onClick={() => setSound(!sound)} aria-expanded={sound} className="min-h-11 rounded-lg border border-[#497654] bg-[#102218] px-4 py-2 text-xs text-[#c4e8cf] focus-visible:outline-2 focus-visible:outline-green-300">
          {sound ? "Wyłącz klip" : "▶ O nie, jesteśmy zgubieni"}
        </button>
        {sound && <div className="mx-auto mt-3 max-w-[360px]">
          <p className="mb-2 text-xs leading-5 text-[#95b49e]">Jeśli dźwięk nie ruszył automatycznie, naciśnij ▶ w odtwarzaczu.</p>
          <iframe title="O nie, jesteśmy zgubieni — klip YouTube" className="h-[203px] w-full rounded-lg border-0"
            src="https://www.youtube-nocookie.com/embed/WjrqpJQBKCQ?autoplay=1&playsinline=1&rel=0"
            allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          <a className="mt-2 inline-block text-xs text-[#95b49e] underline" href="https://www.youtube.com/watch?v=WjrqpJQBKCQ" target="_blank" rel="noreferrer">Nie działa? Otwórz klip w YouTube ↗</a>
        </div>}
      </div>
    </div>
  );
}

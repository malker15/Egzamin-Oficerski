"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const EXAM_SECONDS = 4 * 60;

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function findButton(fragment: string) {
  return Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) =>
    (button.textContent ?? "").includes(fragment)
  );
}

export default function Stage3ExamTimer() {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [running, setRunning] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [expired, setExpired] = useState(false);
  const [remaining, setRemaining] = useState(EXAM_SECONDS);

  useEffect(() => {
    let hiddenNativeTimer: HTMLElement | null = null;

    const sync = () => {
      const heading = Array.from(document.querySelectorAll<HTMLElement>("h1")).find((el) =>
        (el.textContent ?? "").includes("Wylosowane zagadnienie")
      );
      const host = heading?.parentElement ?? null;
      setTarget(host);

      const nativeTimer = Array.from(document.querySelectorAll<HTMLElement>("div.max-w-xs")).find((el) => {
        const text = el.textContent ?? "";
        return text.includes("Gotowy?") || text.includes("Czas próby") || text.includes("Próba zakończona");
      }) ?? null;

      if (nativeTimer) {
        hiddenNativeTimer = nativeTimer;
        nativeTimer.style.display = "none";
      }

      const hasAnswer = Array.from(document.querySelectorAll<HTMLElement>("div")).some((el) =>
        (el.textContent ?? "").trim() === "Samoocena"
      );
      if (hasAnswer) {
        setAnswered(true);
        setRunning(false);
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button");
      const text = button?.textContent ?? "";
      if (text.includes("Rozpocznij próbę")) {
        setRemaining(EXAM_SECONDS);
        setExpired(false);
        setAnswered(false);
        setRunning(true);
      } else if (text.includes("Skończyłem — sprawdź odpowiedź") || text.includes("Pokaż odpowiedź bez timera")) {
        setRunning(false);
      } else if (text.includes("Losuj inne")) {
        setRunning(false);
        setAnswered(false);
        setExpired(false);
        setRemaining(EXAM_SECONDS);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
      if (hiddenNativeTimer) hiddenNativeTimer.style.display = "";
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          setRunning(false);
          setExpired(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  if (!target) return null;

  const warning = running && remaining <= 30;
  const label = answered ? "Próba zakończona" : expired ? "Czas minął" : running ? "Pozostały czas" : "Limit egzaminacyjny";

  return createPortal(
    <div className={`mx-auto mt-5 max-w-sm rounded-2xl border p-4 shadow-xl ${warning || expired ? "border-amber-700/70 bg-amber-950/20" : "border-[#4b5843] bg-[#0b0e0a]"}`}>
      <div className={`text-[10px] font-black uppercase tracking-[0.18em] ${warning || expired ? "text-amber-300" : "text-[#7f8e74]"}`}>{label}</div>
      <div className={`mt-1 font-mono text-4xl font-black tabular-nums ${warning || expired ? "text-amber-200" : "text-[#d8dfcf]"}`}>{formatTime(remaining)}</div>
      <div className={`mt-2 text-xs ${warning || expired ? "text-amber-200/80" : "text-[#788272]"}`}>
        {warning ? "30 sekund — przejdź do przerwania ćwiczenia i części końcowej." : expired ? "Limit 4 minut został osiągnięty." : "Na wykonanie zagadnienia masz 4 minuty."}
      </div>
      {expired && !answered && (
        <button
          onClick={() => findButton("Skończyłem — sprawdź odpowiedź")?.click()}
          className="mt-4 rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-2 text-sm font-black text-amber-100 hover:bg-amber-900/30"
        >
          Czas minął — sprawdź odpowiedź
        </button>
      )}
    </div>,
    target
  );
}

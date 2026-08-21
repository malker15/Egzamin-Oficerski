"use client";

import { useEffect, useRef, useState } from "react";

const LAST_SHOWN_KEY = "officer_support_toast_last_shown_v1";
const FIRST_SEEN_KEY = "officer_support_toast_first_seen_v1";
const HOUR_MS = 60 * 60 * 1000;
const FIRST_DELAY_MS = 12 * 60 * 1000;
const DISPLAY_MS = 11_000;

export default function SupportToast({ enabled }: { enabled: boolean }) {
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      setRendered(false);
      return;
    }

    try {
      if (!localStorage.getItem(FIRST_SEEN_KEY)) {
        localStorage.setItem(FIRST_SEEN_KEY, String(Date.now()));
      }
    } catch {}

    function hide() {
      setVisible(false);
      if (removeTimer.current) clearTimeout(removeTimer.current);
      removeTimer.current = setTimeout(() => setRendered(false), 350);
    }

    function maybeShow() {
      if (document.visibilityState !== "visible") return;

      let lastShown = 0;
      let firstSeen = Date.now();
      try {
        lastShown = Number(localStorage.getItem(LAST_SHOWN_KEY) || 0);
        firstSeen = Number(localStorage.getItem(FIRST_SEEN_KEY) || Date.now());
      } catch {}

      const now = Date.now();
      const dueAt = lastShown > 0 ? lastShown + HOUR_MS : firstSeen + FIRST_DELAY_MS;
      if (now < dueAt || rendered) return;

      try {
        localStorage.setItem(LAST_SHOWN_KEY, String(now));
      } catch {}

      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));

      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(hide, DISPLAY_MS);
    }

    maybeShow();
    const interval = window.setInterval(maybeShow, 30_000);
    const onVisibility = () => maybeShow();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, [enabled, rendered]);

  if (!rendered) return null;

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-3 z-[80] transition-all duration-300 sm:left-auto sm:right-5 sm:max-w-sm ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      style={{ bottom: "calc(9rem + env(safe-area-inset-bottom))" }}
    >
      <div className="rounded-2xl border border-[#59684f] bg-[#11140f]/95 px-4 py-3.5 shadow-2xl shadow-black/40 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#4f5d47] bg-[#1a2117] text-lg" aria-hidden="true">
            ☕
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">Podoba Ci się aplikacja?</p>
            <p className="mt-1 text-sm leading-5 text-[#b7c0ad]">
              Postaw mi kawę — BLIK: <span className="font-bold tracking-wide text-[#dce4d2]">694 051 995</span> :)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

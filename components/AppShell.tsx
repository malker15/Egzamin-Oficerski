"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const COPY_REPLACEMENTS: Record<string, string> = {
  "Quiz Agent": "Egzamin Oficerski",
  "v12": "ETAP I",
  "Tryb NAUKA": "Tryb nauki",
  "Tryb EGZAMIN": "Tryb egzaminu",
  "Odpowiedzi: losowe": "Losowa kolejność odpowiedzi",
  "Start NAUKA": "Rozpocznij naukę",
  "Start EGZAMIN": "Symulacja egzaminu",
  "Eksport stats": "Eksportuj postęp",
  "Wyczyść stats": "Wyczyść postęp",
  "Reset": "Resetuj sesję",
};

function polishStageOneCopy() {
  const elements = document.querySelectorAll<HTMLElement>("h1, span, button");
  elements.forEach((element) => {
    const text = element.textContent?.trim() ?? "";
    const replacement = COPY_REPLACEMENTS[text];
    if (replacement && element.textContent !== replacement) element.textContent = replacement;
  });
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const stage = pathname === "/" ? "home" : pathname.startsWith("/stage1") ? "stage1" : pathname.startsWith("/stage2") ? "stage2" : pathname.startsWith("/stage3") ? "stage3" : pathname.startsWith("/stage4") ? "stage4" : "other";

  useEffect(() => {
    if (stage !== "stage1") return;
    polishStageOneCopy();
    const observer = new MutationObserver(() => polishStageOneCopy());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [stage]);

  return <div data-app-stage={stage}>{children}</div>;
}

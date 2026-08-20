"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Stage3ExamTimer from "./Stage3ExamTimer";

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

const STAGE_META = {
  stage1: { code: "MOD-01", label: "TEST WIEDZY" },
  stage2: { code: "MOD-02", label: "TEORIA I PRAKTYKA" },
  stage3: { code: "MOD-03", label: "MUSZTRA" },
  stage4: { code: "MOD-04", label: "PĘTLA TAKTYCZNA" },
} as const;

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
  const meta = stage in STAGE_META ? STAGE_META[stage as keyof typeof STAGE_META] : null;

  useEffect(() => {
    if (stage !== "stage1") return;
    polishStageOneCopy();
    const observer = new MutationObserver(() => polishStageOneCopy());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [stage]);

  return (
    <div data-app-stage={stage} className={meta ? "mil-stage-shell" : undefined}>
      {meta && (
        <div className="mil-stage-ident" aria-hidden="true">
          <span className="mil-stage-ident-code">{meta.code}</span>
          <span className="mil-stage-ident-sep">//</span>
          <span>{meta.label}</span>
        </div>
      )}
      {children}
      {stage === "stage3" && <Stage3ExamTimer />}
    </div>
  );
}

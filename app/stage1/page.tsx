"use client";

import { useEffect, useState } from "react";
import Stage1Quiz from "../Stage1Quiz";

const STAGE1_BANK_VERSION = "615-v2";
const STAGE1_BANK_MARKER = "stage1_bank_version";

export default function Stage1Page() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const currentVersion = localStorage.getItem(STAGE1_BANK_MARKER);

    if (currentVersion !== STAGE1_BANK_VERSION) {
      // Stara wersja zapisywała całą bazę 468 pytań w localStorage.
      // Czyścimy ją jednorazowo, żeby nie mogła przykryć nowej bazy 615.
      localStorage.removeItem("quiz_agent_state_v12");
      localStorage.removeItem("quiz_agent_stats_v1");
      localStorage.setItem(STAGE1_BANK_MARKER, STAGE1_BANK_VERSION);
    }

    setReady(true);
  }, []);

  if (!ready) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-12 text-neutral-100">
        <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
          Ładowanie aktualnej bazy Etapu I…
        </div>
      </main>
    );
  }

  return <Stage1Quiz />;
}

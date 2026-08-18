"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Stage4Page() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        location.href = "/";
        return;
      }
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return <main className="grid min-h-screen place-items-center bg-neutral-950 text-neutral-400">Wczytuję…</main>;
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
            ETAP IV <span className="text-neutral-600">•</span> W PRZYGOTOWANIU
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Pętla taktyczna</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
            Miejsce na późniejszy moduł pętli taktycznej. Zaczniemy od Call for Fire, a kolejne elementy dodamy wtedy, gdy dostarczysz materiały i dokładny przebieg etapu.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Pierwszy moduł</div>
            <h2 className="mt-2 text-lg font-bold">Call for Fire</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Nauka procedury krok po kroku, potem wykonywanie jej bez podpowiedzi.</p>
          </section>
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Plan</div>
            <h2 className="mt-2 text-lg font-bold">Procedury</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Osobne checklisty i tryb nauki dla każdego zadania, które pojawi się na pętli.</p>
          </section>
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Plan</div>
            <h2 className="mt-2 text-lg font-bold">Pełna pętla</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Docelowo losowana kolejność zadań i symulacja całego przebiegu etapu.</p>
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-sm text-neutral-400">
          Ten etap jest tylko przygotowany konstrukcyjnie. Treści dodamy później wyłącznie z materiałów, które przekażesz.
        </div>
      </div>
    </main>
  );
}

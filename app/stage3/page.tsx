"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Stage3Page() {
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
            ETAP III <span className="text-neutral-600">•</span> W PRZYGOTOWANIU
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Musztra</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
            Ta część czeka na materiał do egzaminu z musztry. Gdy dodamy źródła, zbudujemy tu trening komend, kolejności wykonania i symulacje egzaminacyjne.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Plan</div>
            <h2 className="mt-2 text-lg font-bold">Komendy i reakcje</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Nauka poprawnego brzmienia komend i tego, co powinno nastąpić po każdej z nich.</p>
          </section>
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Plan</div>
            <h2 className="mt-2 text-lg font-bold">Sekwencje</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Ćwiczenie całych ciągów czynności bez podpowiedzi, z późniejszą checklistą.</p>
          </section>
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Plan</div>
            <h2 className="mt-2 text-lg font-bold">Symulacja</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Losowe zadanie, czas na przygotowanie i wykonanie jak przed komisją.</p>
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 p-6 text-sm text-neutral-400">
          Na razie niczego tu nie uzupełniam z własnej wiedzy — poczekamy na Twoje materiały do Etapu III.
        </div>
      </div>
    </main>
  );
}

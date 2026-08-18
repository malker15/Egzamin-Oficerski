import Link from "next/link";
import ExamCountdown from "../components/ExamCountdown";

const stages = [
  {
    href: "/stage1",
    roman: "I",
    title: "Test wiedzy",
    description: "Pytania ABCD, tryb nauki, symulacja egzaminu i ranking wyników.",
    status: "Gotowy",
    ready: true,
  },
  {
    href: "/stage2",
    roman: "II",
    title: "Teoria i praktyka",
    description: "Odpowiedzi ustne, checklisty zadań praktycznych, powtórki i symulacja 2+1.",
    status: "Gotowy",
    ready: true,
  },
  {
    href: "/stage3",
    roman: "III",
    title: "Musztra",
    description: "Moduł przygotowany do rozbudowy o komendy, przebieg i ocenę wykonania.",
    status: "W przygotowaniu",
    ready: false,
  },
  {
    href: "/stage4",
    roman: "IV",
    title: "Pętla taktyczna",
    description: "Trenażer wykonania zadań dowódczych, samoocena 80/20 i trening bez podpowiedzi.",
    status: "Trening v1",
    ready: true,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-900/75 p-6 shadow-2xl shadow-black/25 backdrop-blur sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Trener przygotowania
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Egzamin Oficerski
              </h1>
              <ExamCountdown />
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
                Jedno miejsce do przygotowania wszystkich etapów egzaminu. Wybierz moduł i ucz się w formie dopasowanej do tego, jak wygląda dany etap w praktyce.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <div className="text-3xl font-black text-white">4</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-neutral-500">Etapy egzaminu</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <div className="text-3xl font-black text-white">3</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-neutral-500">Aktywne moduły</div>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-4 mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Ścieżka egzaminu</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Wybierz etap</h2>
          </div>
          <p className="hidden text-sm text-neutral-500 sm:block">Postęp i tryby nauki są zapisywane osobno dla każdego modułu.</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {stages.map((stage) => (
            <Link
              key={stage.href}
              href={stage.href}
              className="group relative overflow-hidden rounded-[1.75rem] border border-neutral-800 bg-neutral-900/80 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-600 hover:bg-neutral-900 hover:shadow-2xl hover:shadow-black/20 sm:p-7"
            >
              <div className="flex items-start gap-5">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border text-lg font-black ${stage.ready ? "border-neutral-600 bg-white text-neutral-950" : "border-neutral-700 bg-neutral-950 text-neutral-300"}`}>
                  {stage.roman}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{stage.title}</h3>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${stage.ready ? "border-emerald-900/80 bg-emerald-950/50 text-emerald-300" : "border-neutral-700 bg-neutral-950 text-neutral-400"}`}>
                      {stage.status}
                    </span>
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400">{stage.description}</p>
                </div>
                <div className="mt-1 text-xl text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white">→</div>
              </div>

              <div className="mt-6 h-px bg-gradient-to-r from-neutral-700/70 to-transparent" />
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 group-hover:text-neutral-300">
                Otwórz etap
              </div>
            </Link>
          ))}
        </section>

        <footer className="mt-10 border-t border-neutral-900 pt-6 text-center text-xs text-neutral-600">
          Platforma przygotowania do egzaminu oficerskiego
        </footer>
      </div>
    </main>
  );
}

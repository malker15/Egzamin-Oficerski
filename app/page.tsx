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
    code: "MOD-01",
  },
  {
    href: "/stage2",
    roman: "II",
    title: "Teoria i praktyka",
    description: "Odpowiedzi ustne, checklisty zadań praktycznych, powtórki i symulacja 2+1.",
    status: "Gotowy",
    ready: true,
    code: "MOD-02",
  },
  {
    href: "/stage3",
    roman: "III",
    title: "Musztra",
    description: "22 zagadnienia, schemat odpowiedzi, nauka krok po kroku i losowanie egzaminacyjne.",
    status: "Gotowy",
    ready: true,
    code: "MOD-03",
  },
  {
    href: "/stage4",
    roman: "IV",
    title: "Pętla taktyczna",
    description: "Trenażer wykonania zadań dowódczych, samoocena 80/20 i trening bez podpowiedzi.",
    status: "Trening v1",
    ready: true,
    code: "MOD-04",
  },
];

export default function HomePage() {
  return (
    <main className="mil-app-shell min-h-screen bg-[#090b08] text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <section className="mil-hero relative overflow-hidden rounded-[2rem] border border-[#394334] bg-[#11140f]/92 p-6 shadow-2xl shadow-black/35 backdrop-blur sm:p-10">
          <div className="mil-corner mil-corner-tl" />
          <div className="mil-corner mil-corner-br" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4b5843] bg-[#0c0f0b]/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#a9b49d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#83966f] shadow-[0_0_12px_rgba(131,150,111,0.65)]" />
                System przygotowania
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#66725e]">
                <span>PLAN 2026</span>
                <span className="text-[#3c4637]">/</span>
                <span>TRYB SZKOLENIOWY</span>
                <span className="text-[#3c4637]">/</span>
                <span>4 z 4 modułów aktywnych</span>
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
              <div className="mil-stat-card rounded-2xl border border-[#364031] bg-[#0b0e0a]/80 p-4">
                <div className="text-3xl font-black text-[#d9ddcf]">4</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#66725e]">Etapy egzaminu</div>
              </div>
              <div className="mil-stat-card rounded-2xl border border-[#364031] bg-[#0b0e0a]/80 p-4">
                <div className="text-3xl font-black text-[#a7b68f]">4</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#66725e]">Aktywne moduły</div>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-4 mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748169]">Ścieżka egzaminu</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Wybierz etap</h2>
          </div>
          <p className="hidden text-sm text-[#737b6d] sm:block">Postęp i tryby nauki są zapisywane osobno dla każdego modułu.</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {stages.map((stage) => (
            <Link
              key={stage.href}
              href={stage.href}
              className="mil-stage-card group relative overflow-hidden rounded-[1.75rem] border border-[#30382d] bg-[#11140f]/90 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[#59684f] hover:bg-[#151912] hover:shadow-2xl hover:shadow-black/25 sm:p-7"
            >
              <div className="absolute right-5 top-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#4f5a49]">{stage.code}</div>
              <div className="mil-card-grid absolute inset-0 opacity-30" />

              <div className="relative z-10 flex items-start gap-5">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border text-lg font-black ${stage.ready ? "border-[#78866a] bg-[#c5ccb9] text-[#171b15]" : "border-[#424b3d] bg-[#0b0e0a] text-[#86907d]"}`}>
                  {stage.roman}
                </div>
                <div className="min-w-0 flex-1 pr-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{stage.title}</h3>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${stage.ready ? "border-[#4e6041] bg-[#1a2416] text-[#a8bd91]" : "border-[#3a4037] bg-[#0b0e0a] text-[#777f72]"}`}>
                      {stage.status}
                    </span>
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#a2a99b]">{stage.description}</p>
                </div>
                <div className="mt-1 text-xl text-[#596252] transition group-hover:translate-x-1 group-hover:text-[#c5ccb9]">→</div>
              </div>

              <div className="relative z-10 mt-6 h-px bg-gradient-to-r from-[#56614f]/70 via-[#343d30]/60 to-transparent" />
              <div className="relative z-10 mt-4 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#697362] group-hover:text-[#a9b49d]">Otwórz etap</span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#465040]">STATUS // {stage.ready ? "READY" : "STANDBY"}</span>
              </div>
            </Link>
          ))}
        </section>

        <footer className="mt-10 border-t border-[#1f251d] pt-6 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#4d5548]">
          Platforma przygotowania do egzaminu oficerskiego
        </footer>
      </div>
    </main>
  );
}

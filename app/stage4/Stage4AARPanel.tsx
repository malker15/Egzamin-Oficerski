"use client";

const aarSteps = [
  {
    title: "Zadanie, cel i oczekiwany efekt",
    text: "Przypomnij, jakie było zadanie, jakie były jego założenia oraz jak miało wyglądać prawidłowe wykonanie i oczekiwany efekt końcowy.",
  },
  {
    title: "Przebieg wykonania krok po kroku",
    text: "Krótko odtwórz, jak faktycznie przebiegało zadanie — od rozpoczęcia, przez najważniejsze decyzje i działania, aż do zakończenia.",
  },
  {
    title: "Dlaczego przebieg wyglądał właśnie tak?",
    text: "Przeanalizuj przyczyny powodzeń i błędów. Prowadź otwartą dyskusję z uczestnikami: co wpłynęło na decyzje, komunikację i działanie zespołu. Przykład: odsłonięcie flanki, bo żołnierz nie zrozumiał sygnału o obecności przeciwnika, co umożliwiło atak z nieubezpieczonego kierunku.",
  },
  {
    title: "Co wykonano dobrze, a co trzeba poprawić?",
    text: "Nazwij konkretne mocne strony i konkretne błędy. Oddziel to, co zadziałało prawidłowo — np. wykrycie i sygnalizację przeciwnika — od elementów wymagających poprawy.",
  },
  {
    title: "Podsumowanie, rekomendacje i termin",
    text: "Ustal, co należy przećwiczyć i na czym skupić się przed kolejnym wykonaniem. Mogą to być np. znaki i sygnały taktyczne, komunikacja w marszu ubezpieczonym, zasady 5xC i 5-25. Na końcu wskaż, do kiedy poprawki mają zostać zrealizowane, np. do kolejnych zajęć z taktyki.",
  },
];

export default function Stage4AARPanel() {
  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-[#66785a] bg-[#dfe7d7] text-[#11170f] shadow-xl shadow-black/20">
      <div className="border-b border-[#aebaa4] bg-[#cbd6c1] px-5 py-4 sm:px-6">
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#516248]">AAR // PO ZAKOŃCZENIU ZADANIA</div>
        <h3 className="mt-2 text-xl font-black leading-tight sm:text-2xl">Jak przeprowadzić AAR</h3>
        <p className="mt-3 max-w-[78ch] text-sm font-medium leading-6 text-[#364033] sm:text-base">Nie opowiadaj wszystkiego od nowa. AAR ma odpowiedzieć: co miało się wydarzyć, co się wydarzyło, dlaczego oraz co zrobimy lepiej następnym razem.</p>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        {aarSteps.map((step, index) => (
          <div key={step.title} className="rounded-2xl border border-[#b4c0ab] bg-[#f4f7f1] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#182116] text-sm font-black text-white">{index + 1}</div>
              <div>
                <h4 className="text-base font-black sm:text-lg">{step.title}</h4>
                <p className="mt-2 text-sm font-medium leading-6 text-[#2d3829]">{step.text}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-[#839474] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
          <div className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">SKRÓT DO ZAPAMIĘTANIA</div>
          <p className="mt-3 text-sm font-bold leading-6">CEL I EFEKT → PRZEBIEG → DLACZEGO → DOBRZE / DO POPRAWY → REKOMENDACJE + TERMIN</p>
        </div>
      </div>
    </section>
  );
}

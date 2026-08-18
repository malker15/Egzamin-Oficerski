export type StationPhase = {
  title: string;
  description: string;
  items: string[];
};

export type TacticalStation = {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  sourcePages: string;
  scenario: string;
  task: string;
  goodExecution: StationPhase[];
  changeOfSituation?: string;
  sourceGap?: string;
};

export const examinerCriteria = [
  "Zrozumienie zadania",
  "Postawienie zadania",
  "Określenie swojego miejsca oraz zadań",
  "Realizacja / kontrola podwładnych",
  "AAR na zakończenie",
];

export const peerCriteria = [
  "Postawienie zadania",
  "Pewność siebie",
  "Delegowanie zadań",
  "Reakcja na zmienność sytuacji",
  "Ocena AAR",
];

export const commanderFramework = [
  {
    title: "1. Zrozum zadanie",
    text: "Zanim zaczniesz dowodzić, nazwij cel, ograniczenia czasowe i najważniejsze zagrożenia wynikające z otrzymanej sytuacji.",
  },
  {
    title: "2. Postaw zadanie",
    text: "Podwładni mają rozumieć co wykonują, po co to robią i jaki jest oczekiwany efekt działania.",
  },
  {
    title: "3. Rozdziel role",
    text: "Wyznacz osoby funkcyjne, zastępcę oraz zadania poszczególnych żołnierzy wymagane w danym punkcie.",
  },
  {
    title: "4. Określ swoje miejsce",
    text: "Jako dowódca określ własne miejsce i rolę tak, abyś mógł kierować działaniem i kontrolować wykonanie zadań.",
  },
  {
    title: "5. Kontroluj i reaguj",
    text: "Nie kończ na wydaniu poleceń. Kontroluj podwładnych i reaguj, gdy rozjemca zmienia sytuację taktyczną.",
  },
  {
    title: "6. Zakończ AAR",
    text: "Po wykonaniu zadania przeprowadź AAR. W planie egzaminu ten element jest oceniany osobno i powtarza się na kolejnych punktach.",
  },
];

export const tacticalStations: TacticalStation[] = [
  {
    id: "5-25-5xc",
    number: "01",
    shortTitle: "5-25 / 5xC",
    title: "Dowodzenie podczas wykonywania procedury 5-25 oraz 5xC",
    sourcePages: "6",
    scenario:
      "W rejonie tyłowym przeciwnik prowadzi działania nieregularne i stosuje improwizowane ładunki wybuchowe w celu zakłócenia transportu. Pododdział prowadzi patrol na pojazdach.",
    task: "Wykonać patrol na pojazdach po określonej drodze i w określonym czasie.",
    goodExecution: [
      {
        title: "Przygotowanie i postawienie zadania",
        description: "Egzaminowany powinien pokazać, że rozumie zadanie i potrafi przygotować zespół do działania.",
        items: [
          "Wykorzystuje mapę, busolę / kompas i środki łączności.",
          "Wprowadza podwładnych w sytuację taktyczną i określa zadanie.",
          "Wytycza trasę patrolu.",
          "Stawia zadania w ramach zabezpieczenia bojowego.",
          "Wyznacza osoby funkcyjne i zastępcę.",
          "Określa ugrupowanie marszowe adekwatnie do terenu.",
          "Podaje sygnały dowodzenia.",
        ],
      },
      {
        title: "Realizacja i reakcja",
        description: "Ocena obejmuje nie tylko plan, ale też kierowanie zespołem podczas zmiany sytuacji.",
        items: [
          "Podejmuje decyzje w trakcie zmieniającej się sytuacji.",
          "Reaguje na sytuację związaną z napotkaniem IED.",
          "Kieruje zespołami w trakcie wykonywania procedury 5-25 i 5xC.",
          "Składa meldunki o sytuacji.",
          "Stawia kolejne zadania podwładnym.",
        ],
      },
      {
        title: "Zakończenie",
        description: "Zadanie nie kończy się po zakończeniu działania w terenie.",
        items: ["Na polecenie rozjemcy przeprowadza AAR po wykonanym zadaniu."],
      },
    ],
    changeOfSituation: "W scenariuszu egzaminacyjnym rozjemca może wprowadzić napotkanie IED.",
    sourceGap:
      "Plan egzaminu wymaga wykonania 5-25 i 5xC, ale nie zawiera pełnej treści tych procedur. Do nauki ich dokładnej kolejności potrzebny jest osobny materiał szkoleniowy.",
  },
  {
    id: "supply",
    number: "02",
    shortTitle: "Zaopatrzenie",
    title: "Dowodzenie podczas dostarczenia zaopatrzenia dla walczącego pododdziału",
    sourcePages: "7",
    scenario:
      "Pododdział blokujący drogę podejścia przeciwnika pilnie potrzebuje amunicji. Przeciwnik uszkodził ciężarówkę.",
    task:
      "Dostarczyć amunicję w 30 minut po otrzymaniu zadania. Teren jest niebezpieczny; dowódca ma dostarczyć amunicję i zadbać o bezpieczeństwo podczas marszu.",
    goodExecution: [
      {
        title: "Przygotowanie",
        description: "Dobre wykonanie zaczyna się od jasnego planu i organizacji zespołu.",
        items: [
          "Wykorzystuje mapę, busolę / kompas i środki łączności.",
          "Wprowadza zespół w sytuację taktyczną i określa zadanie.",
          "Wytycza trasę patrolu z uwzględnieniem limitu czasu.",
          "Stawia zadania w ramach zabezpieczenia bojowego.",
          "Wyznacza osoby funkcyjne, zastępcę i ugrupowanie marszowe.",
          "Podaje sygnały dowodzenia.",
        ],
      },
      {
        title: "Dowodzenie w trakcie",
        description: "Komisja oczekuje aktywnego kierowania, a nie tylko dojścia do celu.",
        items: [
          "Kontroluje bezpieczeństwo zespołu w czasie przemieszczania.",
          "Podejmuje decyzje przy zmianie sytuacji taktycznej.",
          "Stawia zadania podwładnym w trakcie działania.",
          "Nawiązuje kontakt z zaopatrywanym pododdziałem.",
        ],
      },
      {
        title: "Zakończenie",
        description: "Po zakończeniu działania oceniane jest podsumowanie pracy dowódcy.",
        items: ["Na polecenie rozjemcy przeprowadza AAR."],
      },
    ],
    changeOfSituation:
      "Trening powinien wymuszać decyzję pod presją czasu i przy założeniu, że teren jest niebezpieczny.",
  },
  {
    id: "okd",
    number: "03",
    shortTitle: "OKD / orientowanie",
    title: "Dowodzenie, orientowanie taktyczne i topograficzne, kodowanie terenu, wskazywanie dozorów (OKD)",
    sourcePages: "7",
    scenario:
      "Przeciwnik aktywnie działa w rejonie tyłowym. Istnieje duże zagrożenie ataku na wojska w rejonach ześrodkowania. Pododdział odłączył się od sił głównych i ma ograniczone zasoby.",
    task:
      "Przystąpić do orientowania taktycznego i topograficznego, wskazać dozory (OKD) dla zabezpieczenia bojowego i być w gotowości do odparcia ataku przeciwnika.",
    goodExecution: [
      {
        title: "Orientowanie i organizacja",
        description: "Egzaminowany ma połączyć pracę z terenem z organizacją funkcjonowania pododdziału.",
        items: [
          "Wykorzystuje mapę, busolę / kompas i środki łączności.",
          "Realizuje orientowanie taktyczne i topograficzne.",
          "Wskazuje dozory (OKD) dla zabezpieczenia bojowego.",
          "Stawia zadania w ramach zabezpieczenia bojowego.",
          "Wyznacza osoby funkcyjne i zastępcę.",
          "Podaje sygnały dowodzenia.",
        ],
      },
      {
        title: "Funkcjonowanie pododdziału",
        description: "Plan egzaminu ocenia również praktyczną organizację działania w rejonie.",
        items: [
          "Organizuje funkcjonowanie pododdziału w bazie.",
          "Organizuje pozyskanie wody oraz pozyskanie i przygotowanie posiłku.",
          "Organizuje przygotowanie schronienia dla podwładnych.",
          "Organizuje system odpoczynku z zachowaniem gotowości do działania na sygnały alarmowania i ostrzegania.",
        ],
      },
      {
        title: "Dowodzenie i zakończenie",
        description: "Dowódca ma utrzymać kontrolę i reagować na zmieniającą się sytuację.",
        items: [
          "Podejmuje decyzje w trakcie zmiany sytuacji taktycznej.",
          "Stawia zadania poszczególnym żołnierzom.",
          "Na zakończenie realizuje AAR.",
        ],
      },
    ],
  },
  {
    id: "cff",
    number: "04",
    shortTitle: "CFF",
    title: "Dowodzenie podczas rozpoznania przeciwnika i wywołania ognia artylerii (CFF)",
    sourcePages: "8",
    scenario:
      "Przeciwnik dokonał włamania w nasze ugrupowanie i organizuje system walki z zamiarem kontynuowania natarcia. Pododdział znajduje się w rejonie ześrodkowania po wykonaniu marszu.",
    task:
      "Zorganizować system posterunków obserwacyjnych, obserwować aktywność przeciwnika, meldować o wykrytych celach i wezwać ogień artylerii w celu rażenia wykrytych obiektów.",
    goodExecution: [
      {
        title: "Organizacja obserwacji",
        description: "Najpierw oceniana jest organizacja pracy pododdziału i posterunków obserwacyjnych.",
        items: [
          "Wykorzystuje mapę, busolę / kompas i środki łączności.",
          "Planuje i organizuje sieć posterunków obserwacyjnych.",
          "Określa zadanie oraz stawia zadania w ramach zabezpieczenia bojowego.",
          "Wyznacza osoby funkcyjne i zastępcę.",
          "Podaje sygnały dowodzenia.",
          "Określa sposób działania adekwatnie do terenu.",
        ],
      },
      {
        title: "Praca po wykryciu przeciwnika",
        description: "Dobre wykonanie wymaga dowodzenia również po pojawieniu się celu.",
        items: [
          "Kieruje pracą posterunków przy dynamicznie zmieniającej się sytuacji.",
          "Podejmuje decyzje w sytuacji taktycznej i dowodzi w walce.",
          "Składa meldunek o wykrytym przeciwniku.",
          "Stawia zadania podwładnym.",
          "Pracuje z mapą w celu wezwania wsparcia artylerii.",
          "Realizuje wymagany meldunek CFF zgodnie z materiałem szkoleniowym.",
        ],
      },
      {
        title: "Zakończenie",
        description: "Po wykonaniu zadania nadal oceniane jest zachowanie dowódcy.",
        items: ["Na polecenie rozjemcy przeprowadza AAR."],
      },
    ],
    changeOfSituation:
      "Punkt ma pozwalać na obserwację i identyfikację obiektów, a sytuacja może zmieniać się w trakcie pracy posterunków.",
    sourceGap:
      "Plan egzaminu mówi o znajomości meldunku CFF, ale nie podaje jego pełnej struktury. Aplikacja nie powinna jej dopisywać bez osobnego materiału szkoleniowego.",
  },
  {
    id: "cbrn",
    number: "05",
    shortTitle: "OPBMR",
    title: "Dowodzenie podczas rozpoznania terenu skażonego",
    sourcePages: "9",
    scenario:
      "Wprowadzono podwyższony poziom zagrożenia od broni i urządzeń CBRN oraz stopień gotowości ISOPS-2.",
    task: "Wykonać marsz w określonym czasie i rozpoznać, jaki środek został użyty.",
    goodExecution: [
      {
        title: "Przygotowanie pododdziału",
        description: "Dowódca ma wykazać gotowość do działania w warunkach zagrożenia skażeniami.",
        items: [
          "Wykorzystuje mapę, busolę / kompas i środki łączności.",
          "Wprowadza zespół w sytuację taktyczną.",
          "Stawia zadania w ramach zabezpieczenia bojowego.",
          "Wyznacza osoby funkcyjne i zastępcę.",
          "Wyznacza operatorów sekcji wykrywania i monitorowania skażeń.",
          "Podaje sygnały dowodzenia.",
          "Podaje komendę do rozpoczęcia rozpoznania.",
        ],
      },
      {
        title: "Reakcja na zagrożenie",
        description: "Egzamin sprawdza właściwą reakcję dowódcy na sygnały i rozwój sytuacji.",
        items: [
          "Reaguje na zagrożenie uderzeniem BŚT w rejonie pododdziału.",
          "Meldjuje o skażeniach.",
          "Podejmuje decyzje w trakcie zmieniającej się sytuacji.",
          "Prowadzi działania wymagane po wyjściu z rejonu skażonego, w tym natychmiastową likwidację skażeń przewidzianą w planie.",
        ],
      },
      {
        title: "Zakończenie",
        description: "Po wykonaniu zadania oceniane jest podsumowanie działania.",
        items: ["Na polecenie rozjemcy przeprowadza AAR."],
      },
    ],
    sourceGap:
      "Dokument nie opisuje szczegółowych procedur OPBMR, sygnałów ani sposobu rozpoznawania środków. Do tych elementów potrzebny jest osobny materiał źródłowy.",
  },
  {
    id: "casualty",
    number: "06",
    shortTitle: "Ewakuacja rannego",
    title: "Dowodzenie podczas ewakuacji rannego",
    sourcePages: "9",
    scenario:
      "Po walce jeden z żołnierzy zostaje ciężko ranny. W terenie może znajdować się przeciwnik.",
    task:
      "Zorganizować udzielenie pierwszej pomocy, zabezpieczyć rannego do transportu, nawiązać łączność z ZEM i dotrzeć do punktu podjęcia, a następnie — po zmianie sytuacji — do punktu zapasowego.",
    goodExecution: [
      {
        title: "Organizacja pomocy i zabezpieczenia",
        description: "Oceniane jest przede wszystkim dowodzenie organizacją pomocy, ewakuacji i ochrony zespołu.",
        items: [
          "Wykorzystuje mapę, busolę / kompas i środki łączności.",
          "Organizuje udzielenie pierwszej pomocy.",
          "Organizuje wezwanie MEDEVAC / kontakt z ZEM zgodnie z materiałem szkoleniowym.",
          "Organizuje przeniesienie rannego do punktu ewakuacji.",
          "Stawia zadania w ramach zabezpieczenia bojowego.",
          "Wyznacza osoby funkcyjne i podaje sygnały dowodzenia.",
          "Zabezpiecza punkt ewakuacji.",
        ],
      },
      {
        title: "Zmiana punktu podjęcia",
        description: "W scenariuszu egzaminacyjnym pierwszy punkt zostaje uznany za niebezpieczny.",
        items: [
          "Przyjmuje informację o zmianie sytuacji.",
          "Podejmuje decyzję i kieruje zespołem do punktu zapasowego.",
          "Utrzymuje kontrolę nad zadaniami podwładnych i zabezpieczeniem rannego.",
        ],
      },
      {
        title: "Zakończenie",
        description: "Po zakończeniu ewakuacji egzaminowany nadal pracuje jako dowódca.",
        items: ["Na polecenie wykładowcy przeprowadza AAR."],
      },
    ],
    changeOfSituation:
      "Po dotarciu do pierwszego punktu szef ZEM informuje, że teren jest niebezpieczny i wskazuje punkt zapasowy.",
    sourceGap:
      "Dokument nie zawiera pełnych procedur medycznych ani pełnej treści meldunku MEDEVAC. W aplikacji nie należy ich uzupełniać bez dodatkowego źródła.",
  },
  {
    id: "march",
    number: "M",
    shortTitle: "Marsz taktyczny",
    title: "Dowodzenie pododdziałem podczas prowadzenia marszu taktycznego",
    sourcePages: "10",
    scenario: "Pododdział znajduje się w rejonie kontrolowanym przez przeciwnika.",
    task:
      "Dotrzeć w określonym czasie do wyznaczonego punktu podjęcia w celu ewakuacji w sytuacji zagrożenia ze strony przeciwnika.",
    goodExecution: [
      {
        title: "Przygotowanie marszu",
        description: "Marsz jest oceniany podczas przemieszczania się na kolejne punkty egzaminacyjne.",
        items: [
          "Wykorzystuje mapę, busolę / kompas i środki łączności.",
          "Wprowadza zespół w sytuację taktyczną i określa zadanie.",
          "Wytycza trasę marszu do punktu podjęcia.",
          "Stawia zadania w ramach zabezpieczenia bojowego.",
          "Wyznacza osoby funkcyjne i zastępcę.",
          "Podaje sygnały dowodzenia.",
          "Określa ugrupowanie marszowe adekwatnie do terenu.",
          "Podaje komendę do rozpoczęcia marszu.",
        ],
      },
      {
        title: "Dowodzenie w marszu",
        description: "Liczy się utrzymanie kontroli nad zespołem i reakcja na zmiany.",
        items: [
          "Podejmuje decyzje w trakcie zmieniającej się sytuacji.",
          "Stawia zadania poszczególnym żołnierzom.",
          "Kontroluje wykonanie zadań do osiągnięcia punktu podjęcia.",
        ],
      },
      {
        title: "Zakończenie",
        description: "Marsz również kończy się ocenianym podsumowaniem.",
        items: ["Na polecenie rozjemcy przeprowadza AAR."],
      },
    ],
  },
];

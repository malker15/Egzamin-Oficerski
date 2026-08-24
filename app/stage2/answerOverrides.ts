export type Stage2AnswerOverride = {
  keyPoints?: string[];
  fullAnswer?: string;
  openingCue?: string;
  steps?: string[];
  checklist?: { id:string; text:string }[];
};

// Odpowiedzi skrócone do formy ustnej: zwykle ok. 40–60 s.
// Zestawy 1–10 zostały zweryfikowane względem brzmienia pytań oraz materiałów źródłowych.
export const STAGE2_ANSWER_OVERRIDES: Record<string, Stage2AnswerOverride> = {
  T001: {
    keyPoints: [
      "Przygotowanie: plan-konspekt, przygotowanie własne, instruktaż osób funkcyjnych i zabezpieczenie materiałowe.",
      "Przed strzelaniem: sprawdzenie strzelnicy, stanu osobowego, broni, wyposażenia i znajomości warunków bezpieczeństwa.",
      "Prowadzenie: organizacja zmian, nadzór nad strzelaniem, amunicją i osobami funkcyjnymi oraz bieżące reagowanie na uchybienia.",
      "Zakończenie: sprawdzenie rozładowania broni, omówienie wyników, rozliczenie amunicji i sprzętu."
    ],
    fullAnswer: "Odpowiedź:\nKoncepcję zajęć rozpocząłbym od przygotowania planu-konspektu, osobistego przygotowania się oraz instruktażu osób funkcyjnych. Trzeba także zabezpieczyć strzelnicę, amunicję, tarcze i wyposażenie oraz przypomnieć warunki bezpieczeństwa. Przed rozpoczęciem sprawdzam stan osobowy, przygotowanie strzelnicy i rozładowanie broni. W części głównej organizuję zmiany strzelających, nadzoruję amunicję i osoby funkcyjne oraz pilnuję bezpiecznego wykonywania strzelania. Po zakończeniu sprawdzam rozładowanie broni, omawiam wyniki i błędy, rozliczam amunicję oraz sprzęt."
  },
  T033: {
    keyPoints: [
      "Związanie przeciwnika walką w centrum.",
      "Wciągnięcie jego głównych sił w głąb własnego ugrupowania.",
      "Silne uderzenia na oba skrzydła, następnie wyjście na boki i tyły przeciwnika.",
      "Zamknięcie przeciwnika w okrążeniu i pozbawienie go możliwości odwrotu."
    ],
    fullAnswer: "Odpowiedź:\nIstotą manewru kanneńskiego jest związanie głównych sił przeciwnika w centrum, przy jednoczesnym stworzeniu warunków do uderzenia na jego skrzydła. Centrum może celowo ustępować lub przyjmować napór, przez co przeciwnik wchodzi głębiej w ugrupowanie. W tym czasie silniejsze skrzydła wychodzą na jego boki, a następnie na tyły. Ostatecznym celem jest zamknięcie przeciwnika w okrążeniu, odcięcie odwrotu i zniszczenie jego głównych sił. Pod Kircholmem Chodkiewicz wykorzystał tę ideę poprzez wciągnięcie Szwedów w niekorzystne położenie i uderzenia jazdy na skrzydła."
  },
  T002: {
    keyPoints: [
      "Część wstępna: zbiórka, temat, cel, organizacja i warunki bezpieczeństwa.",
      "Część główna: czołganie na brzuchu, na czworakach, na boku oraz pokonywanie terenu biegiem i skokami.",
      "Każde zagadnienie: krótkie objaśnienie i pokaz, następnie praktyczne ćwiczenie żołnierzy.",
      "Część końcowa: omówienie wykonania, wskazanie błędów i podsumowanie."
    ],
    fullAnswer: "Odpowiedź:\nZajęcia zorganizowałbym jako praktyczne szkolenie poligonowe. W części wstępnej przyjmuję meldunek, sprawdzam wyposażenie, podaję temat, cel, organizację oraz warunki bezpieczeństwa. Część główną dzielę na cztery zagadnienia: czołganie na brzuchu, na czworakach, na boku oraz pokonywanie terenu biegiem i skokami. Przy każdym sposobie najpierw krótko wyjaśniam zasady i pokazuję prawidłowe wykonanie, a następnie żołnierze ćwiczą praktycznie z bronią i wyposażeniem. Na końcu omawiam najczęstsze błędy, oceniam wykonanie i podsumowuję zajęcia."
  },
  T034: {
    keyPoints: [
      "Regularne działania zaczepne i obronne.",
      "Działania manewrowe, kontruderzenia i pościgi.",
      "Obrona ważnych rejonów, w tym Warszawy, oraz działania wyprawowe na innych obszarach.",
      "W końcowej fazie także działania o charakterze partyzanckim."
    ],
    fullAnswer: "Odpowiedź:\nW powstaniu listopadowym Polacy prowadzili przede wszystkim regularne działania wojenne przeciw armii rosyjskiej. Obejmowały one działania zaczepne i obronne, manewrowanie wojskami, kontruderzenia oraz pościgi. Prowadzono także obronę ważnych rejonów, przede wszystkim Warszawy, oraz wyprawy na Litwę i inne obszary objęte walkami. Przykładem działań regularnych były bitwy pod Olszynką Grochowską, Dębem Wielkim czy Iganiami. W końcowej fazie, po osłabieniu regularnej armii, pojawiały się również działania o charakterze partyzanckim."
  },
  T003: {
    keyPoints: [
      "Część wstępna: meldunek, sprawdzenie ludzi i wyposażenia, temat, cel i bezpieczeństwo.",
      "Podanie właściwej komendy do założenia odzieży ochronnej.",
      "Pokaz wzorowy, następnie pokaz z objaśnieniem kolejnych czynności.",
      "Ćwiczenie praktyczne do opanowania normy, bieżące poprawianie błędów i podsumowanie."
    ],
    fullAnswer: "Odpowiedź:\nZajęcia przeprowadziłbym zgodnie z zatwierdzonym planem-konspektem. W części wstępnej przyjmuję meldunek, sprawdzam obecność i wyposażenie, podaję temat, cel oraz warunki bezpieczeństwa. Następnie podaję komendę, na którą zakłada się środki ochrony, wykonuję wzorowy pokaz całej czynności, a potem pokaz z objaśnieniem. Kolejnym etapem jest praktyczne ćwiczenie przez szkolonych, początkowo pod moją kontrolą, później w całości i na czas zgodnie z normą bojową. Na bieżąco poprawiam błędy i powtarzam ćwiczenie do opanowania czynności. Na końcu omawiam wyniki i najczęstsze błędy."
  },
  T051: {
    keyPoints: [
      "Zwiększa skuteczność i bezpieczeństwo działania.",
      "Pozwala dzielić zadania i wzajemnie się uzupełniać.",
      "Ułatwia wymianę informacji i szybkie reagowanie na zmiany sytuacji.",
      "Buduje zaufanie, morale i odpowiedzialność za innych."
    ],
    fullAnswer: "Odpowiedź:\nDziałanie w zespołach zwiększa w wojsku skuteczność i bezpieczeństwo wykonywania zadań. Pozwala podzielić obowiązki zgodnie z możliwościami poszczególnych żołnierzy, wzajemnie się uzupełniać i szybciej reagować na zagrożenia. Zespół zapewnia również lepszą wymianę informacji oraz możliwość wzajemnego wsparcia w trudnej sytuacji. Jednocześnie wspólne działanie buduje zaufanie, dyscyplinę i morale, a żołnierze uczą się odpowiedzialności nie tylko za własne zadanie, lecz także za swoich kolegów i wynik całego pododdziału."
  },
  P034: {
    openingCue: "Najpierw zachowuję warunki bezpieczeństwa i sprawdzam rozładowanie broni.",
    steps: [
      "Sprawdzić rozładowanie broni.",
      "Rozłożyć węzeł gazowy.",
      "Odłączyć zespół kolby.",
      "Wyjąć zespół mechanizmu powrotnego oraz suwadło z zamkiem.",
      "Nazwać główne części oddzielone podczas częściowego rozkładania.",
      "Złożyć karabinek w odwrotnej kolejności i wykonać kontrolę poprawności złożenia."
    ],
    checklist: [
      {id:"P034-01",text:"Zachowanie warunków bezpieczeństwa i sprawdzenie rozładowania broni."},
      {id:"P034-02",text:"Rozłożenie węzła gazowego."},
      {id:"P034-03",text:"Odłączenie zespołu kolby."},
      {id:"P034-04",text:"Wyjęcie mechanizmu powrotnego oraz suwadła z zamkiem."},
      {id:"P034-05",text:"Nazwanie części: zespół kolby, zespół suwadła z zamkiem, zespół urządzenia powrotnego, tłok gazowy, regulator gazowy."},
      {id:"P034-06",text:"Złożenie w odwrotnej kolejności i kontrola poprawności złożenia."}
    ],
    fullAnswer: "Odpowiedź:\nRozpoczynam od zachowania warunków bezpieczeństwa i sprawdzenia, czy broń jest rozładowana. Częściowe rozkładanie obejmuje kolejno rozłożenie węzła gazowego, odłączenie zespołu kolby oraz wyjęcie zespołu mechanizmu powrotnego i suwadła z zamkiem. Po rozłożeniu nazywam podstawowe oddzielone elementy: zespół kolby, zespół suwadła z zamkiem, zespół urządzenia powrotnego, tłok gazowy i regulator gazowy. Składanie wykonuję w odwrotnej kolejności, zwracając uwagę na prawidłowe osadzenie elementów, a na końcu sprawdzam poprawność złożenia i działanie mechanizmów bez użycia amunicji."
  },
  T049: {
    keyPoints: [
      "Przestrzeganie międzynarodowego prawa humanitarnego konfliktów zbrojnych.",
      "Męstwo, odwaga, roztropność i dawanie przykładu innym.",
      "Troska o współtowarzyszy broni i gotowość niesienia pomocy.",
      "Humanitarne traktowanie jeńców i ludności cywilnej.",
      "Godne zachowanie w niewoli i wierność przysiędze wojskowej."
    ],
    fullAnswer: "Odpowiedź:\nKodeks honorowy wskazuje, że żołnierz zawodowy w sytuacjach bojowych powinien działać zgodnie z międzynarodowym prawem humanitarnym. Na polu walki mają go cechować męstwo, odwaga i roztropność, a własną postawą powinien dawać przykład innym. Ma szczególnie troszczyć się o współtowarzyszy broni i udzielać im pomocy w zagrożeniu. Wobec jeńców wojennych i ludności cywilnej powinien kierować się humanitaryzmem i poszanowaniem życia. Również w niewoli ma zachować godność, wierność przysiędze i nie działać na szkodę Ojczyzny ani współtowarzyszy."
  },
  T005: {
    keyPoints: [
      "Przygotowanie: plan-konspekt, literatura, broń szkolna lub odpowiednio przygotowana, pomoce i warunki bezpieczeństwa.",
      "Część wstępna: temat, cel, organizacja i sprawdzenie przygotowania szkolonych.",
      "Część główna: przeznaczenie i charakterystyka GROT-a, następnie pokaz i omówienie głównych zespołów broni.",
      "Utrwalenie: wskazywanie i nazywanie części przez szkolonych oraz krótkie sprawdzenie wiedzy.",
      "Zakończenie: omówienie błędów, podsumowanie i zadanie do samokształcenia."
    ],
    fullAnswer: "Odpowiedź:\nZajęcia przygotowałbym w oparciu o plan-konspekt i instrukcję użytkowania karabinka GROT, z odpowiednim zabezpieczeniem materiałowym i określeniem warunków bezpieczeństwa. W części wstępnej podaję temat, cel i organizację zajęć. W części głównej krótko omawiam przeznaczenie i charakterystykę broni, a następnie na egzemplarzu lub modelu pokazuję jej główne zespoły: kolbę, mechanizm powrotny, suwadło z zamkiem, komorę zamkową, lufę, komorę spustową i łoże. Wyjaśniam ich podstawowe funkcje, po czym szkoleni sami wskazują i nazywają elementy. Na końcu sprawdzam opanowanie materiału, omawiam błędy i podsumowuję zajęcia."
  },
  T035: {
    keyPoints: [
      "Związanie głównych sił Armii Czerwonej walkami na przedpolach Warszawy.",
      "Skoncentrowanie grupy uderzeniowej nad Wieprzem.",
      "Kontruderzenie na słabiej zabezpieczone południowe skrzydło i tyły wojsk rosyjskich.",
      "Rozbicie ich ugrupowania, zagrożenie liniom komunikacyjnym i wymuszenie odwrotu."
    ],
    fullAnswer: "Odpowiedź:\nOrganizacja działań w Bitwie Warszawskiej polegała na połączeniu obrony stolicy z silnym manewrem zaczepnym. Wojska na przedpolach Warszawy miały zatrzymać i związać główne siły Armii Czerwonej. Jednocześnie nad Wieprzem skoncentrowano grupę uderzeniową pod bezpośrednim dowództwem Józefa Piłsudskiego. 16 sierpnia rozpoczęła ona kontruderzenie na słabiej zabezpieczone południowe skrzydło i tyły wojsk rosyjskich. Manewr zagroził ich liniom komunikacyjnym, rozbił spójność ugrupowania i zmusił przeciwnika do szybkiego odwrotu. To właśnie uderzenie znad Wieprza było kluczowym elementem polskiego zwycięstwa."
  },
  T006: {
    keyPoints: [
      "Przygotowanie planu-konspektu, materiałów maskujących i warunków bezpieczeństwa.",
      "Część wstępna: temat, cel, organizacja i krótkie wprowadzenie.",
      "Część główna: zasady maskowania człowieka i wyposażenia oraz pokaz prawidłowego wykonania.",
      "Praktyczne wykonanie maskowania przez każdego żołnierza, korekta błędów i ocena.",
      "Podsumowanie i wskazanie najczęstszych błędów."
    ],
    fullAnswer: "Odpowiedź:\nZajęcia przygotowałbym jako praktyczne szkolenie z wykorzystaniem planu-konspektu, etatowego wyposażenia żołnierza i środków maskujących. W części wstępnej podaję temat, cel, organizację oraz warunki bezpieczeństwa. Następnie wyjaśniam podstawowe zasady maskowania, przede wszystkim ograniczenie widoczności sylwetki, barwy, połysku i charakterystycznych kształtów. Pokazuję prawidłowe maskowanie umundurowania, twarzy, wyposażenia i broni, po czym każdy żołnierz wykonuje je samodzielnie. Na bieżąco koryguję błędy i oceniam skuteczność maskowania w terenie. Zajęcia kończę krótkim omówieniem i wskazaniem elementów wymagających poprawy."
  },
  T048: {
    keyPoints: [
      "Oficer jest nie tylko dowódcą, ale także nauczycielem zawodu wojskowego.",
      "Odpowiada za praktyczne wyszkolenie podwładnych i przygotowanie ich do walki.",
      "Powinien przekazywać wiedzę, kształtować umiejętności, dyscyplinę i sposób myślenia.",
      "Jego własna wiedza, przykład i odpowiedzialność bezpośrednio wpływają na poziom pododdziału."
    ],
    fullAnswer: "Odpowiedź:\nMyśl Tadeusza Hołówki podkreśla, że oficer jest nie tylko dowódcą, ale również nauczycielem zawodu wojskowego. Tak jak nauczyciel ma nauczyć czytania i pisania, tak oficer powinien nauczyć podwładnych wojskowego rzemiosła i przygotować ich do działania w walce. Oznacza to przekazywanie wiedzy, rozwijanie praktycznych umiejętności, kształtowanie dyscypliny, odpowiedzialności i właściwego sposobu myślenia. Oficer musi więc sam posiadać wysokie kwalifikacje, stale się doskonalić i uczyć przede wszystkim własnym przykładem. Poziom wyszkolenia pododdziału jest w dużej mierze efektem jakości pracy jego dowódcy."
  },
  T060: {
    keyPoints: [
      "Cel wojskowy musi skutecznie przyczyniać się do działań zbrojnych ze względu na charakter, położenie, przeznaczenie lub wykorzystanie.",
      "Jego zniszczenie, zajęcie lub obezwładnienie musi w danych okolicznościach dawać konkretną korzyść wojskową.",
      "Obiekt cywilny nie może być atakowany tylko dlatego, że potencjalnie mógłby mieć znaczenie wojskowe."
    ],
    fullAnswer: "Odpowiedź:\nW rozumieniu międzynarodowego prawa humanitarnego cel wojskowy to taki obiekt, który ze względu na swój charakter, położenie, przeznaczenie albo sposób wykorzystania skutecznie przyczynia się do prowadzenia działań zbrojnych. Jednocześnie jego całkowite lub częściowe zniszczenie, zajęcie albo obezwładnienie musi w danych okolicznościach dawać określoną korzyść wojskową. Oba warunki muszą być spełnione jednocześnie. Typowymi przykładami są stanowiska bojowe, składy amunicji czy używany do walki sprzęt wojskowy. Obiekty cywilne pozostają chronione, dopóki nie spełniają kryteriów celu wojskowego."
  },
  T036: {
    keyPoints: [
      "Stalowa Wola – tradycje Zakładów Południowych, obecnie Huta Stalowa Wola.",
      "Mielec – przedwojenna wytwórnia lotnicza, obecnie PZL Mielec.",
      "Nowa Dęba – przedwojenna wytwórnia amunicji, obecnie DEZAMET."
    ],
    fullAnswer: "Odpowiedź:\nTrzy przykłady miast związanych z zakładami zbrojeniowymi utworzonymi w ramach Centralnego Okręgu Przemysłowego to Stalowa Wola, Mielec i Nowa Dęba. W Stalowej Woli powstały Zakłady Południowe, których tradycję kontynuuje Huta Stalowa Wola. W Mielcu zbudowano wytwórnię lotniczą, z której wywodzi się dzisiejszy PZL Mielec. W Nowej Dębie powstała wytwórnia amunicji, a jej tradycje kontynuuje DEZAMET. Do odpowiedzi na pytanie komisji wystarczy przede wszystkim poprawnie wskazać te trzy miasta."
  },
  T008: {
    keyPoints: [
      "Model podstawowy: temat i cel, komenda, pokaz wzorowy, pokaz z objaśnieniem, ćwiczenie i poprawianie błędów, podsumowanie.",
      "Komendy: „W lewo – ZWROT”, „W prawo – ZWROT”, „W tył – ZWROT”.",
      "W lewo i w tył: obrót na obcasie lewej nogi i czubku prawego buta; w prawo – odwrotnie.",
      "Górna część ciała pozostaje jak w postawie zasadniczej, kolan nie zgina się, po obrocie nogę dostawia się najkrótszą drogą."
    ],
    fullAnswer: "Odpowiedź:\nNa punkcie nauczania najpierw podaję treść zagadnienia i cel szkolenia, a następnie komendy: „W lewo – ZWROT”, „W prawo – ZWROT” i „W tył – ZWROT”. Wykonuję wzorowy pokaz, a potem pokaz z objaśnieniem. Wyjaśniam, że zwrot w lewo i w tył wykonuje się na obcasie lewej nogi i czubku prawego buta, a zwrot w prawo odwrotnie. Górna część ciała pozostaje jak w postawie zasadniczej, kolan nie zgina się, a po obrocie nogę dostawia się energicznie najkrótszą drogą. Następnie szkoleni ćwiczą czynność, najpierw pod kontrolą instruktora, później całościowo. Poprawiam błędy, a na końcu podsumowuję wykonanie."
  },
  T037: {
    keyPoints: [
      "RWD-8 – samolot używany do pilotażu początkowego.",
      "PWS-26 – samolot używany w szkoleniu podstawowym i zaawansowanym przed wojną."
    ],
    fullAnswer: "Odpowiedź:\nPrzed II wojną światową podchorążych Szkoły Orląt szkolono między innymi na samolotach RWD-8 i PWS-26. RWD-8 był podstawową maszyną wykorzystywaną do pilotażu początkowego, czyli pierwszych etapów nauki latania. PWS-26 służył do dalszego szkolenia podstawowego i bardziej zaawansowanych ćwiczeń pilotażowych. W dęblińskim systemie szkolenia używano oczywiście większej liczby typów samolotów, ale jeśli komisja prosi tylko o dwa przykłady, RWD-8 i PWS-26 są poprawną i bezpieczną odpowiedzią."
  },
  T015: {
    keyPoints: [
      "Przygotowanie: plan-konspekt, instruktaż osób funkcyjnych, zabezpieczenie materiałowe i znajomość programu strzelań.",
      "Rozpoczęcie: meldunek, sprawdzenie ludzi, broni, strzelnicy i warunków bezpieczeństwa.",
      "Prowadzenie: organizacja zmian, nadzór nad amunicją, strzelającymi i osobami funkcyjnymi.",
      "Zakończenie: kontrola rozładowania broni, omówienie wyników, rozliczenie amunicji i sprzętu."
    ],
    fullAnswer: "Odpowiedź:\nZajęcia przygotowałbym na podstawie obowiązującego programu strzelań oraz planu-konspektu. Przed zajęciami prowadzę instruktaż osób funkcyjnych, zabezpieczam amunicję, tarcze i wyposażenie oraz sprawdzam przygotowanie szkolonych. Na strzelnicy przyjmuję meldunek, sprawdzam stan osobowy, przygotowanie obiektu i rozładowanie broni, a następnie przypominam warunki bezpieczeństwa. W części głównej organizuję kolejne zmiany i nadzoruję strzelających, amunicyjnego, obserwatorów oraz pozostałe osoby funkcyjne. Po zakończeniu ponownie sprawdzam rozładowanie broni, omawiam wyniki i błędy, rozliczam amunicję oraz sprawdzam stan broni i sprzętu."
  },
  T038: {
    keyPoints: [
      "Brygada Pościgowa – związek lotnictwa myśliwskiego, przeznaczony głównie do obrony rejonu Warszawy.",
      "Brygada Bombowa – związek lotnictwa bombowego podporządkowany Naczelnemu Dowództwu."
    ],
    fullAnswer: "Odpowiedź:\nW 1939 roku były to Brygada Pościgowa i Brygada Bombowa. Brygada Pościgowa skupiała jednostki myśliwskie i jej głównym zadaniem była obrona przestrzeni powietrznej, przede wszystkim rejonu Warszawy. Brygada Bombowa skupiała jednostki lotnictwa bombowego i była przeznaczona do wykonywania uderzeń na wojska oraz ważne cele przeciwnika. Obie brygady stanowiły istotne elementy organizacji polskiego lotnictwa wojskowego w kampanii 1939 roku."
  },
  T062: {
    keyPoints: [
      "F-1 jest ręcznym granatem obronnym o działaniu odłamkowym.",
      "Budowa: żeliwna skorupa, ok. 60 g trotylu i zapalnik czasowy UZRGM.",
      "Masa granatu uzbrojonego: ok. 700 g; średnica korpusu: 54 mm; wysokość z zapalnikiem: ok. 128 mm.",
      "Średnia odległość rzutu: 35–45 m; skuteczny promień rażenia: do ok. 30 m; promień bezpieczeństwa: do 200 m; zwłoka zapalnika: 3,2–4 s."
    ],
    fullAnswer: "Odpowiedź:\nF-1 jest ręcznym granatem obronnym o działaniu odłamkowym, przeznaczonym do rażenia siły żywej przeciwnika. Jego podstawę stanowi żeliwna skorupa wypełniona około 60 gramami trotylu oraz czasowy zapalnik UZRGM. Granat uzbrojony ma masę około 700 gramów, średnicę korpusu 54 mm i wysokość około 128 mm. Średnia odległość rzutu wynosi około 35–45 metrów. Skuteczny promień rażenia określa się na do około 30 metrów, natomiast ze względu na możliwość lotu większych odłamków promień bezpieczeństwa przyjmuje się do 200 metrów. Czas zwłoki zapalnika wynosi około 3,2–4 sekundy."
  },
  T053: {
    keyPoints: [
      "Zasady honoru, patriotyzmu i odpowiedzialności przyszłego oficera.",
      "Dyscyplina, rzetelna służba i praca nad własnym charakterem.",
      "Koleżeństwo, lojalność i szacunek wobec innych.",
      "Dążenie do wysokiego poziomu wiedzy, sprawności i samodyscypliny."
    ],
    fullAnswer: "Odpowiedź:\n„12 Przykazań Podchorążego Szkoły Orląt” dotyczyło przede wszystkim zasad, według których miał kształtować swój charakter przyszły oficer. Akcentowano honor, patriotyzm, dyscyplinę, odpowiedzialność i rzetelne wykonywanie obowiązków. Ważne były również koleżeństwo, lojalność wobec innych żołnierzy oraz szacunek dla służby i tradycji wojskowej. Przekaz tych zasad można sprowadzić do wymagania stałej pracy nad sobą: nad wiedzą, sprawnością, charakterem i samodyscypliną. Miały one przygotować podchorążego nie tylko do dowodzenia, ale również do bycia przykładem dla podwładnych."
  }
};

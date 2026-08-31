export type OtherStage2Question = {
  sourceNumber: number;
  category: string;
  question: string;
  keyPoints: string[];
  fullAnswer: string;
};

export const OTHER_STAGE2_QUESTIONS: OtherStage2Question[] = [
  {
    sourceNumber: 1,
    category: "Szkolenie strzeleckie",
    question: "Jak należy przeprowadzić zajęcia ze szkolenia strzeleckiego nt. „Strzelanie sprawdzające nr 1 z PW” w oparciu o zasady działalności szkoleniowej i szkoleniowo-metodycznej oraz obowiązującego Programu Strzelań z Broni Strzeleckiej?",
    keyPoints: [
      "Realizacja zgodnie z zatwierdzonym planem-konspektem i warunkami strzelania.",
      "Największy nacisk na warunki bezpieczeństwa i upewnienie się, że szkoleni je rozumieją.",
      "W części wstępnej sprawdzenie wyposażenia, oporządzenia i jego dopasowania.",
      "Podczas strzelania stałe panowanie nad grupą i natychmiastowe korygowanie naruszeń bezpieczeństwa."
    ],
    fullAnswer: "Zajęcia przeprowadzam zgodnie z zatwierdzonym planem-konspektem oraz obowiązującymi warunkami strzelania. W części wstępnej sprawdzam stan osobowy, wyposażenie i oporządzenie oraz sposób jego dopasowania. Następnie szczegółowo omawiam warunki bezpieczeństwa, w tym zasady BLOS, i upewniam się, że wszyscy szkoleni je zrozumieli. W części głównej organizuję strzelanie zgodnie z programem, cały czas panuję nad grupą, obserwuję posługiwanie się bronią i natychmiast reaguję na błędy oraz naruszenia bezpieczeństwa. Priorytetem przez całe zajęcia jest bezpieczne wykonanie zadania."
  },
  {
    sourceNumber: 2,
    category: "Historia wojskowości",
    question: "Wskaż miejsce i czas przełomowych bitew okresu napoleońskiego.",
    keyPoints: [
      "Marengo — 14 czerwca 1800 r.",
      "Austerlitz — 2 grudnia 1805 r.; Jena i Auerstedt — 14 października 1806 r.",
      "Frydland — 14 czerwca 1807 r.; Wagram — 5–6 lipca 1809 r.",
      "Borodino — 7 września 1812 r.; Lipsk — 16–19 października 1813 r.; Waterloo — 18 czerwca 1815 r."
    ],
    fullAnswer: "Do przełomowych bitew okresu napoleońskiego zaliczamy: Marengo — 14 czerwca 1800 r., zwycięstwo nad Austriakami; Austerlitz — 2 grudnia 1805 r., zwycięstwo nad armiami rosyjską i austriacką; Jenę i Auerstedt — 14 października 1806 r., zwycięstwo nad Prusami; Frydland — 14 czerwca 1807 r., zwycięstwo nad Rosją; Wagram — 5–6 lipca 1809 r., zwycięstwo nad Austrią; Borodino — 7 września 1812 r.; Lipsk — 16–19 października 1813 r., klęska Napoleona; oraz Waterloo — 18 czerwca 1815 r., ostateczną klęskę Napoleona."
  },
  {
    sourceNumber: 4,
    category: "Historia Polski",
    question: "Jakie wydarzenia zapoczątkowały wybuch powstania listopadowego?",
    keyPoints: [
      "Noc z 29 na 30 listopada 1830 r. — wystąpienie sprzysiężenia podchorążych Piotra Wysockiego.",
      "Atak na Belweder i następnie zdobycie Arsenału w Warszawie.",
      "Tłem było łamanie konstytucji Królestwa Polskiego przez cara.",
      "Bezpośrednie napięcie zwiększała perspektywa użycia polskiego wojska przeciw rewolucjom w Belgii i Francji."
    ],
    fullAnswer: "Powstanie listopadowe rozpoczęły wydarzenia nocy z 29 na 30 listopada 1830 r. Sprzysiężenie podchorążych kierowane przez Piotra Wysockiego rozpoczęło akcję zbrojną, atakując Belweder, a następnie uczestnicząc w opanowaniu Arsenału w Warszawie. Wydarzenia te były bezpośrednim zapalnikiem powstania. Tłem było narastające niezadowolenie z łamania konstytucji Królestwa Polskiego przez cara oraz obawa, że polskie wojsko zostanie wykorzystane do tłumienia rewolucji w Belgii i Francji."
  },
  {
    sourceNumber: 6,
    category: "Historia Szkoły Orląt",
    question: "Przedstaw okoliczności śmierci komendanta Szkoły Orląt płk. Szczepana Ścibiora.",
    keyPoints: [
      "Aresztowany w sierpniu 1951 r. przez Główny Zarząd Informacji WP.",
      "Oskarżony o działalność dywersyjną i szpiegowską.",
      "13 maja 1952 r. skazany przez Najwyższy Sąd Wojskowy na karę śmierci.",
      "Wyrok wykonano 7 sierpnia 1952 r. w więzieniu mokotowskim w Warszawie."
    ],
    fullAnswer: "Płk pil. Szczepan Ścibior został aresztowany w sierpniu 1951 r. przez Główny Zarząd Informacji WP pod zarzutem działalności dywersyjnej i szpiegowskiej. W materiale podkreślono brutalny charakter śledztwa i maltretowanie zatrzymanego. Wyrokiem Najwyższego Sądu Wojskowego z 13 maja 1952 r. został skazany na karę śmierci. Wyrok wykonano 7 sierpnia 1952 r. w więzieniu mokotowskim w Warszawie."
  },
  {
    sourceNumber: 8,
    category: "Historia lotnictwa",
    question: "Zaprezentuj przebieg Międzynarodowych Zawodów Samolotów Turystycznych Challenge 1932 r.",
    keyPoints: [
      "Zawody odbyły się 12–28 sierpnia 1932 r. w Berlinie.",
      "Była to trzecia edycja Challenge International de Tourisme.",
      "Zwyciężyli Franciszek Żwirko i Stanisław Wigura na RWD-6.",
      "Program obejmował ocenę techniczną, konkurencje techniczne, próbę prędkości i lot okrężny wokół Europy."
    ],
    fullAnswer: "Challenge 1932 odbył się w dniach 12–28 sierpnia 1932 r. w Berlinie i był trzecią edycją międzynarodowych zawodów samolotów turystycznych. Zawody obejmowały ocenę techniczną samolotów, konkurencje techniczne, próbę prędkości maksymalnej oraz długi lot okrężny wokół Europy. Zwyciężyła polska załoga Franciszek Żwirko i Stanisław Wigura na samolocie RWD-6. Sukces ten był pierwszym dużym międzynarodowym osiągnięciem polskiego lotnictwa sportowego."
  },
  {
    sourceNumber: 12,
    category: "Historia Polski",
    question: "Jaki przebieg miało wprowadzenie stanu wojennego w Polsce w grudniu 1981 r.?",
    keyPoints: [
      "Stan wojenny wprowadzono w nocy z 12 na 13 grudnia 1981 r.",
      "Internowano i aresztowano działaczy opozycji, szczególnie Solidarności.",
      "Wprowadzono militaryzację części zakładów, godzinę milicyjną i cenzurę.",
      "Strajki i demonstracje były pacyfikowane; w kopalni Wujek zginęło 9 górników."
    ],
    fullAnswer: "Stan wojenny wprowadzono w Polsce w nocy z 12 na 13 grudnia 1981 r. Jego celem było stłumienie opozycji, przede wszystkim Solidarności. Przeprowadzono masowe internowania i aresztowania działaczy, zmilitaryzowano część zakładów pracy i instytucji, wprowadzono godzinę milicyjną i cenzurę oraz zawieszono działalność wielu organizacji. W odpowiedzi dochodziło do strajków i demonstracji, które były pacyfikowane przez siły państwowe. Najbardziej znanym przykładem była pacyfikacja kopalni Wujek, gdzie zginęło 9 górników."
  },
  {
    sourceNumber: 14,
    category: "PSZ na Zachodzie",
    question: "Scharakteryzuj dowódców wielkich jednostek PSZ na Zachodzie w latach 1940–1945.",
    keyPoints: [
      "W materiale wymieniono m.in. gen. Władysława Andersa — związanego z 2. Korpusem Polskim i walkami we Włoszech.",
      "Gen. Stanisław Maczek — dowódca 1. Dywizji Pancernej, walczącej w Normandii i Europie Zachodniej.",
      "Gen. Stanisław Kopański — wskazany jako dowódca jednej z polskich brygad walczących poza krajem.",
      "Materiał wymienia również gen. bryg. Janusza Łańcuckiego i gen. bryg. Adolfa Falkowskiego."
    ],
    fullAnswer: "W materiale jako ważnych dowódców wielkich jednostek PSZ na Zachodzie wskazano przede wszystkim gen. Władysława Andersa, związanego z 2. Korpusem Polskim i walkami we Włoszech, w tym pod Monte Cassino, oraz gen. Stanisława Maczka, dowódcę 1. Dywizji Pancernej walczącej w Normandii, Belgii i Holandii. Wymieniono także gen. Stanisława Kopańskiego oraz gen. bryg. Janusza Łańcuckiego i Adolfa Falkowskiego jako dowódców polskich formacji na Zachodzie. W odpowiedzi warto przede wszystkim kojarzyć dowódcę z jego główną jednostką i teatrem działań."
  },
  {
    sourceNumber: 18,
    category: "Powstanie Warszawskie",
    question: "Scharakteryzuj uzbrojenie powstańców warszawskich w 1944 r.",
    keyPoints: [
      "Uzbrojenie było słabe, niejednorodne i niewystarczające w stosunku do potrzeb.",
      "Wykorzystywano broń ze zrzutów alianckich.",
      "Duże znaczenie miała broń zdobyta na Niemcach.",
      "Produkowano również broń i granaty w podziemnych warsztatach AK."
    ],
    fullAnswer: "Uzbrojenie powstańców warszawskich było bardzo zróżnicowane, ale jednocześnie słabe i niejednorodne. Powstańcy korzystali z broni zgromadzonej wcześniej, dostaw ze zrzutów alianckich oraz przede wszystkim ze zdobyczy na przeciwniku. Wykorzystywano pistolety, karabiny, pistolety maszynowe, granaty ręczne, moździerze i zdobyczny sprzęt niemiecki. Ważnym źródłem uzbrojenia była także konspiracyjna produkcja w warsztatach Armii Krajowej, obejmująca m.in. broń strzelecką, granaty i proste środki wsparcia."
  },
  {
    sourceNumber: 23,
    category: "PSZ na Zachodzie",
    question: "Przedstaw szlak bojowy 2. Korpusu Polskiego na froncie włoskim w latach 1943–1945.",
    keyPoints: [
      "Walki o przełamanie Linii Gustawa i bitwa o Monte Cassino — maj 1944 r.",
      "Zdobycie Ancony — lipiec 1944 r.",
      "Walki o przełamanie Linii Gotów i dalsza kampania adriatycka.",
      "Końcowym ważnym akcentem było wyzwolenie Bolonii."
    ],
    fullAnswer: "Szlak bojowy 2. Korpusu Polskiego we Włoszech obejmował najpierw walki o przełamanie Linii Gustawa, których najważniejszym epizodem była bitwa o Monte Cassino w maju 1944 r. Następnie korpus uczestniczył w działaniach nad Adriatykiem i zdobyciu Ancony w lipcu 1944 r. Później walczył o przełamanie Linii Gotów oraz w rejonach Marche i Emilii-Romanii. Ostatnim ważnym etapem działań było wyzwolenie Bolonii w 1945 r."
  },
  {
    sourceNumber: 25,
    category: "Wychowanie wojskowe",
    question: "Omów zasadę systemowości oddziaływania wychowawczego w wojsku.",
    keyPoints: [
      "Wychowanie ma być prowadzone całościowo, a nie przypadkowo.",
      "Oddziaływanie powinno być planowe i skoordynowane.",
      "Poszczególne działania wychowawcze powinny tworzyć spójny system.",
      "Zasada obejmuje różne aspekty życia i służby żołnierza w jednostce."
    ],
    fullAnswer: "Zasada systemowości oznacza, że wychowanie wojskowe powinno być procesem całościowym, planowym i skoordynowanym. Nie może opierać się na przypadkowych, pojedynczych działaniach, lecz powinno tworzyć spójny system oddziaływania na żołnierza. Obejmuje ono różne aspekty jego życia i służby w jednostce, a działania dowódców i przełożonych powinny wzajemnie się uzupełniać i prowadzić do tych samych celów wychowawczych."
  },
  {
    sourceNumber: 26,
    category: "Metodyka szkolenia",
    question: "Opisz i wyjaśnij, na czym polega metoda pokazowa udzielania instruktażu.",
    keyPoints: [
      "Centralnym elementem jest wzorowy pokaz realizacji zagadnienia.",
      "Pokaz wykonują wcześniej przygotowani instruktorzy lub dowódcy.",
      "Po pokazie następuje omówienie poszczególnych zagadnień.",
      "Na końcu ustala się jednolity przebieg szkolenia na punktach nauczania."
    ],
    fullAnswer: "Metoda pokazowa polega na praktycznym zaprezentowaniu sposobu realizacji zajęć. W części głównej wcześniej przygotowany instruktor lub dowódca wykonuje wzorowy pokaz wybranego zagadnienia. Pozostali uczestnicy obserwują organizację punktu nauczania i sposób działania instruktora. Następnie kierownik omawia pokazane elementy, wyjaśnia wątpliwości i wspólnie porządkuje najważniejsze ustalenia. Końcowym efektem jest przyjęcie jednolitego sposobu prowadzenia szkolenia na poszczególnych punktach nauczania."
  },
  {
    sourceNumber: 27,
    category: "Wychowanie wojskowe",
    question: "Wymień metody wychowania wojskowego i omów jedną z nich.",
    keyPoints: [
      "Materiał łączy wychowanie z praktycznym szkoleniem żołnierza.",
      "Wskazuje m.in. naukę podstawowych postaw i musztry oraz ćwiczenia praktyczne.",
      "Podkreśla realizm, aktywny udział żołnierzy i łączenie teorii z praktyką.",
      "Jako przykład omawia musztrę — postawy, szyk, posługiwanie się bronią i oddawanie honorów."
    ],
    fullAnswer: "W materiale metody wychowania wojskowego przedstawiono szeroko, łącząc je z procesem szkolenia żołnierza. Wskazano naukę podstawowych postaw i musztry, praktyczne ćwiczenia taktyczne i bojowe oraz zajęcia symulujące rzeczywiste działania. Jako ważne zasady podano realizm, aktywny udział szkolonych, łączenie teorii z praktyką i stopniowanie trudności. Jako przykład można omówić musztrę, która kształtuje prawidłowe postawy, zachowanie w szyku, dyscyplinę, posługiwanie się bronią i zasady oddawania honorów."
  },
  {
    sourceNumber: 31,
    category: "Historia Polski",
    question: "Wskaż polskie konspiracyjne organizacje wojskowe prowadzące walkę z Niemcami i sowietami w latach 1939–1945.",
    keyPoints: [
      "Armia Krajowa — poprzedzona przez Służbę Zwycięstwu Polski i Związek Walki Zbrojnej.",
      "Bataliony Chłopskie.",
      "Narodowe Siły Zbrojne — związane m.in. z Narodową Organizacją Wojskową i Związkiem Jaszczurczym.",
      "W materiale wymieniono również Gwardię Ludową."
    ],
    fullAnswer: "W materiale wymieniono kilka głównych polskich organizacji konspiracyjnych działających w czasie II wojny światowej. Najważniejszą była Armia Krajowa, wywodząca się ze Służby Zwycięstwu Polski i Związku Walki Zbrojnej. Wskazano również Bataliony Chłopskie i Narodowe Siły Zbrojne, związane z nurtem narodowym i wcześniejszymi organizacjami konspiracyjnymi. Materiał wymienia także Gwardię Ludową. W odpowiedzi warto podać nazwy organizacji i krótko wskazać ich miejsce w konspiracji."
  },
  {
    sourceNumber: 32,
    category: "Metodyka szkolenia",
    question: "Co to jest instruktaż do zajęć? Co jest jego istotą i celem?",
    keyPoints: [
      "Instruktaż jest najprostszą formą działalności szkoleniowo-metodycznej.",
      "Służy przygotowaniu dowódców i instruktorów do konkretnych zajęć programowych.",
      "Istotą jest przygotowanie merytoryczne i metodyczne oraz określenie roli na punkcie nauczania.",
      "Celem jest ujednolicenie sposobu działania i sprawdzenie gotowości instruktorów."
    ],
    fullAnswer: "Instruktaż jest najprostszą formą działalności szkoleniowo-metodycznej, wykorzystywaną szczególnie w przygotowaniu zajęć programowych. Jego istotą jest merytoryczne i metodyczne przygotowanie dowódców lub instruktorów do pracy na punktach nauczania oraz wskazanie ich roli podczas przyszłych zajęć. Celem jest doskonalenie umiejętności metodycznych, uzgodnienie jednolitego sposobu postępowania, sprawdzenie przygotowania do prowadzenia szkolenia oraz umiejętności wykorzystania bazy szkoleniowej i sprzętu."
  },
  {
    sourceNumber: 33,
    category: "Historia wojskowości",
    question: "Gdzie i kiedy rozegrały się główne bitwy Ludowego Wojska Polskiego w latach 1943–1945?",
    keyPoints: [
      "Lenino — październik 1943 r.",
      "Przełamanie Wału Pomorskiego — styczeń–luty 1945 r.",
      "Walki o Warszawę — styczeń 1945 r.",
      "Berlin — kwiecień–maj 1945 r."
    ],
    fullAnswer: "Do głównych działań i bitew Ludowego Wojska Polskiego w latach 1943–1945 materiał zalicza bitwę pod Lenino w październiku 1943 r., walki związane z przełamaniem Wału Pomorskiego w styczniu i lutym 1945 r., walki o Warszawę w styczniu 1945 r. oraz udział w bitwie o Berlin w kwietniu i maju 1945 r. Były to najważniejsze etapy udziału LWP w działaniach na froncie wschodnim."
  },
  {
    sourceNumber: 35,
    category: "PSZ na Zachodzie",
    question: "Przedstaw szlak bojowy 1. Dywizji Pancernej i 1. Samodzielnej Brygady Spadochronowej na froncie zachodnim w latach 1944–1945.",
    keyPoints: [
      "1. Dywizja Pancerna gen. Maczka walczyła we Francji, Belgii, Holandii i Niemczech.",
      "Kluczowym etapem były walki pod Falaise.",
      "1. Samodzielna Brygada Spadochronowa uczestniczyła w operacji Market Garden.",
      "Jej najważniejsze walki w materiale przypisano do września 1944 r."
    ],
    fullAnswer: "1. Dywizja Pancerna gen. Stanisława Maczka prowadziła działania na froncie zachodnim przez Francję, Belgię, Holandię i dalej na teren Niemiec. Jednym z najważniejszych etapów jej szlaku były walki w rejonie Falaise, a następnie wyzwalanie kolejnych miejscowości Europy Zachodniej. 1. Samodzielna Brygada Spadochronowa uczestniczyła przede wszystkim w operacji Market Garden we wrześniu 1944 r., gdzie prowadziła działania jako polska formacja spadochronowa."
  },
  {
    sourceNumber: 37,
    category: "Historia lotnictwa",
    question: "Którzy polscy piloci wyróżnili się w walkach powietrznych na frontach II wojny światowej?",
    keyPoints: [
      "Materiał wymienia m.in. Stanisława Skalskiego i Witolda Urbanowicza.",
      "Wskazano także Eugeniusza Horbaczewskiego i Bolesława Gładycha.",
      "Wymienieni zostali również Jan Zumbach, Marian Pisarek i Wacław Król.",
      "W materiale na liście znajduje się także Josef František."
    ],
    fullAnswer: "W materiale jako wyróżniających się pilotów walczących na frontach II wojny światowej wymieniono m.in. Stanisława Skalskiego, Witolda Urbanowicza, Eugeniusza Horbaczewskiego, Bolesława Gładycha, Jana Zumbacha, Mariana Pisarka i Wacława Króla. Na liście w materiale znajduje się również Josef František. Do odpowiedzi ustnej wystarczy podać kilka najbardziej rozpoznawalnych nazwisk, przede wszystkim Skalskiego, Urbanowicza, Zumbacha i Horbaczewskiego."
  },
  {
    sourceNumber: 38,
    category: "Rozpoznanie",
    question: "Co to jest rozpoznanie wojskowe? Wymień rodzaje rozpoznania wojskowego i krótko je scharakteryzuj.",
    keyPoints: [
      "Rozpoznanie to ciągłe, zorganizowane zdobywanie informacji o przeciwniku i środowisku działań.",
      "HUMINT — informacje pozyskiwane od ludzi; IMINT — informacje obrazowe.",
      "ELINT — rozpoznanie emisji urządzeń elektronicznych przeciwnika.",
      "Materiał wymienia też rozpoznanie akustyczne, radiolokacyjne, podczerwone i łączności."
    ],
    fullAnswer: "Rozpoznanie wojskowe to zorganizowane i ciągłe działania służące zdobywaniu informacji o przeciwniku, obszarze działań oraz warunkach terenowych i hydrometeorologicznych, potrzebnych do oceny sytuacji i podejmowania decyzji. Materiał wyróżnia m.in. HUMINT, czyli informacje pozyskiwane od ludzi, IMINT — rozpoznanie obrazowe, oraz ELINT — rozpoznanie emisji urządzeń elektronicznych. Wskazuje również specjalistyczne formy rozpoznania technicznego, takie jak rozpoznanie akustyczne, radiolokacyjne, podczerwone i rozpoznanie łączności."
  },
  {
    sourceNumber: 39,
    category: "Historia Polski",
    question: "Opisz rolę sprzysiężenia podchorążych w wybuchu powstania listopadowego 1830 r.",
    keyPoints: [
      "Sprzysiężeniu przewodził Piotr Wysocki.",
      "Organizacja stała się bezpośrednim zapalnikiem zbrojnego wystąpienia.",
      "W nocy z 29 na 30 listopada 1830 r. zaatakowano Belweder.",
      "Następnie opanowano Arsenał, co rozszerzyło wystąpienie."
    ],
    fullAnswer: "Sprzysiężenie podchorążych kierowane przez Piotra Wysockiego odegrało kluczową rolę w rozpoczęciu powstania listopadowego. To jego członkowie stanowili grupę inicjującą zbrojne wystąpienie w Warszawie. W nocy z 29 na 30 listopada 1830 r. przeprowadzili atak na Belweder, a następnie uczestniczyli w zdobyciu Arsenału. Działania sprzysiężenia były więc bezpośrednim zapalnikiem buntu, który następnie przerodził się w szersze powstanie przeciwko Rosji."
  },
  {
    sourceNumber: 41,
    category: "Historia II wojny światowej",
    question: "Wskaż miejsca eksterminacji narodu polskiego pod okupacją niemiecką w latach II wojny światowej.",
    keyPoints: [
      "Obozy koncentracyjne i zagłady — m.in. Auschwitz-Birkenau i Stutthof.",
      "Miejsca masowych egzekucji — m.in. Palmiry i Piaśnica.",
      "Więzienia i areszty — Pawiak, Zamek Lubelski, Montelupich.",
      "Pacyfikowane wsie i wysiedlenia — m.in. Michniów oraz Zamojszczyzna."
    ],
    fullAnswer: "Eksterminacja ludności polskiej pod okupacją niemiecką odbywała się w wielu rodzajach miejsc. Materiał wskazuje obozy koncentracyjne i zagłady, m.in. Auschwitz-Birkenau i Stutthof; miejsca masowych egzekucji, takie jak Palmiry i Piaśnica; więzienia i areszty, m.in. Pawiak, Zamek Lubelski i więzienie Montelupich; a także pacyfikowane wsie, np. Michniów. Elementem polityki okupanta były również masowe wysiedlenia, szczególnie z terenów wcielonych do Rzeszy i z Zamojszczyzny."
  },
  {
    sourceNumber: 43,
    category: "Kampania 1939",
    question: "Wskaż miejsce i czas głównych bitew kampanii polskiej 1939 r.",
    keyPoints: [
      "Westerplatte — 1–7 września 1939 r.; Mokra — 1 września.",
      "Mława — 1–4 września.",
      "Bzura — 9–22 września, największa bitwa kampanii.",
      "Kock — 2–6 października, ostatnia bitwa regularnego Wojska Polskiego."
    ],
    fullAnswer: "Do głównych bitew kampanii polskiej 1939 r. materiał zalicza obronę Westerplatte od 1 do 7 września, bitwę pod Mokrą 1 września, bitwę pod Mławą od 1 do 4 września oraz bitwę nad Bzurą od 9 do 22 września, będącą największym starciem kampanii. Jako ostatnią bitwę regularnego Wojska Polskiego wskazuje bitwę pod Kockiem, trwającą od 2 do 6 października 1939 r."
  },
  {
    sourceNumber: 45,
    category: "Historia lotnictwa",
    question: "Jakie typy samolotów były na stanie lotnictwa polskiego podczas kampanii 1939 r.?",
    keyPoints: [
      "Myśliwskie — PZL P.11 i PZL P.7.",
      "Bombowe — PZL.37 Łoś.",
      "Rozpoznawcze — PZL.23 Karaś.",
      "Do obserwacji i łączności materiał wymienia m.in. RWD-8 i LWS-3 Mewa."
    ],
    fullAnswer: "Podczas kampanii 1939 r. polskie lotnictwo dysponowało kilkoma podstawowymi typami samolotów. W lotnictwie myśliwskim były to przede wszystkim PZL P.11 i PZL P.7. Do zadań bombowych wykorzystywano PZL.37 Łoś, a do rozpoznania PZL.23 Karaś. Materiał wskazuje również samoloty obserwacyjne i łącznikowe, w tym RWD-8 i LWS-3 Mewa. W odpowiedzi najlepiej pogrupować typy według ich głównego przeznaczenia."
  },
  {
    sourceNumber: 46,
    category: "Współczesne Siły Zbrojne",
    question: "Jakie znaczenie, biorąc pod uwagę współczesne zagrożenia, mają Wojska Obrony Terytorialnej?",
    keyPoints: [
      "Wsparcie obrony kraju na poziomie lokalnym.",
      "Reagowanie na zagrożenia asymetryczne i hybrydowe.",
      "Wsparcie podczas katastrof i sytuacji kryzysowych.",
      "Wzmocnienie odstraszania, odporności państwa i bezpieczeństwa wewnętrznego."
    ],
    fullAnswer: "Wojska Obrony Terytorialnej mają znaczenie przede wszystkim jako lokalny komponent wspierający obronę państwa. Materiał podkreśla ich rolę w reagowaniu na zagrożenia asymetryczne i hybrydowe, wspieraniu działań obronnych w regionach oraz szybkim reagowaniu podczas katastrof naturalnych i innych sytuacji kryzysowych. WOT wzmacniają również odstraszanie i odporność państwa oraz mogą wspierać działania związane z bezpieczeństwem wewnętrznym."
  },
  {
    sourceNumber: 48,
    category: "Broń strzelecka",
    question: "Dokonaj częściowego rozłożenia i złożenia pistoletu maszynowego i nazwij jego części.",
    keyPoints: [
      "Wyjmij magazynek i sprawdź, czy komora nabojowa jest pusta.",
      "Zdejmij pokrywę komory zamkowej i zespół sprężyn powrotnych.",
      "Wyjmij zamek, następnie odkręć nakrętkę lufy i wysuń lufę.",
      "Składanie wykonaj w odwrotnej kolejności; nazwij główne zespoły broni."
    ],
    fullAnswer: "Rozkładanie rozpoczynam od wyjęcia magazynka i sprawdzenia, czy w komorze nabojowej nie ma naboju. Następnie przesuwam zatrzask pokrywy, zdejmuję pokrywę komory zamkowej wraz z zespołem sprężyn powrotnych, wyjmuję zamek, naciskam zatrzask nakrętki lufy, odkręcam nakrętkę i wysuwam lufę z komory zamkowej. Materiał pokazuje również rozłączenie chwytu z komorą zamkową przez wyjęcie elementów łącznika. Główne części to m.in. komora zamkowa, pokrywa, zamek, lufa, magazynek, nakrętka lufy, zatrzaski i zespół sprężyn powrotnych. Składanie wykonuję w odwrotnej kolejności."
  },
  {
    sourceNumber: 51,
    category: "MPHKZ",
    question: "Jak MPHKZ definiuje pojęcie jeńca wojennego?",
    keyPoints: [
      "Według materiału jest to osoba zatrzymana przez wrogie siły zbrojne.",
      "Osoba ta brała udział w działaniach bojowych.",
      "Działała pod rozkazami swojego rządu."
    ],
    fullAnswer: "Według odpowiedzi zawartej w materiale jeniec wojenny to osoba zatrzymana przez wrogie siły zbrojne, która brała udział w działaniach bojowych pod rozkazami swojego rządu. W tej sekcji zachowano brzmienie i zakres odpowiedzi z dostarczonego pliku."
  },
  {
    sourceNumber: 56,
    category: "MSBS GROT",
    question: "Zachowując warunki bezpieczeństwa dokonaj częściowego rozłożenia i złożenia karabinka MSBS GROT.",
    keyPoints: [
      "Rozpocznij od zasad bezpieczeństwa i skierowania broni w bezpiecznym kierunku.",
      "Odłącz magazynek i sprawdź komorę nabojową.",
      "Wykonaj strzał kontrolny zgodnie z przyjętą procedurą materiału.",
      "Następnie wykonaj częściowe rozłożenie; składanie prowadź w odwrotnej kolejności."
    ],
    fullAnswer: "Czynność rozpoczynam od zachowania zasad bezpieczeństwa. Odłączam magazynek, sprawdzam komorę nabojową i upewniam się, że broń jest rozładowana. Następnie wykonuję strzał kontrolny w bezpiecznym kierunku, zgodnie z procedurą opisaną w materiale, i przystępuję do częściowego rozłożenia karabinka. Po wykonaniu czynności kontroluję elementy i składam broń w odwrotnej kolejności. W czasie całej procedury lufa pozostaje skierowana w bezpiecznym kierunku."
  },
  {
    sourceNumber: 61,
    category: "Historia lotnictwa",
    question: "Przedstaw najważniejsze fakty z dziejów 315 Dywizjonu Myśliwskiego „Dęblińskiego”.",
    keyPoints: [
      "Dywizjon utworzono na początku 1941 r.",
      "Brał udział w ważnych operacjach lotniczych na froncie zachodnim.",
      "Materiał wskazuje jego udział w działaniach związanych z lądowaniem aliantów w Normandii.",
      "Matką chrzestną dywizjonu była amerykańska aktorka Virginia Cherrill."
    ],
    fullAnswer: "315 Dywizjon Myśliwski „Dębliński” został utworzony na początku 1941 r. W czasie II wojny światowej brał udział w ważnych operacjach lotniczych na froncie zachodnim, a materiał podkreśla jego udział w działaniach związanych z lądowaniem aliantów w Normandii. Dywizjon zasłynął z dobrych dowódców i pilotów. W materiale jako ciekawostkę wskazano, że jego matką chrzestną była amerykańska aktorka Virginia Cherrill."
  }
];

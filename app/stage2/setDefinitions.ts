export type Stage2SetQuestionSpec = {
  text: string;
  anchor: string;
  answerKey?: string;
};

export type Stage2SetDefinition = {
  number: number;
  questions: [Stage2SetQuestionSpec, Stage2SetQuestionSpec];
};

// Zestawy 1-40 przepisane 1:1 z pliku "Zestawy pytań 1-40.pdf".
// "anchor" służy tylko do odzyskania istniejącego typu/odpowiedzi ze starej bazy.
// W aplikacji wyświetlane jest zawsze dokładne brzmienie pola "text".
export const STAGE2_SET_DEFINITIONS: Stage2SetDefinition[] = [
  { number: 1, questions: [
    { text: "Jak należy przeprowadzić zajęcia ze szkolenia strzeleckiego nt. „Strzelanie sprawdzające nr 1 z pistoletu VIS-100” w oparciu o zasady działalności szkoleniowej i szkoleniowo-metodycznej oraz obowiązującego Programu Strzelań z Broni Strzeleckiej.", anchor: "Strzelanie szkolne nr 1 z pistoletu VIS-100" },
    { text: "W 1605 r. Hetman Jan Karol Chodkiewicz, pokonał Szwedów pod Kircholmem, stosując manewr kanneński, zrealizowany przez Hannibala w starciu z Rzymianami w 216 r. p.n.e. Omów główne jego założenia.", anchor: "W 1605 r. Hetman Jan Karol Chodkiewicz" },
  ]},
  { number: 2, questions: [
    { text: "Przedstaw sposób organizacji zajęć ze szkolenia poligonowego (zajęcia z taktyki) nt. „Pokonywanie terenu różnymi sposobami”.", anchor: "Pokonywanie terenu różnymi sposobami" },
    { text: "Jakie rodzaje działań zbrojnych prowadzili Polacy w walce z Rosjanami w latach 1830-1831?", anchor: "działań zbrojnych prowadzili Polacy w walce z Rosjanami w latach 1830-1831" },
  ]},
  { number: 3, questions: [
    { text: "Omów w jaki sposób przeprowadził/a byś zajęcia z OPBMR na temat: „Zakładanie odzieży ochronnej wg. normy bojowej”.", anchor: "Zakładanie odzieży ochronnej wg. Normy bojowej" },
    { text: "Czemu służy i w czym pomaga działanie zespołowe w wojsku?", anchor: "Czemu sprzyja w wojsku działanie w zespołach" },
  ]},
  { number: 4, questions: [
    { text: "Zachowując warunki bezpieczeństwa dokonaj częściowego rozłożenia i złożenia karabinka MSBS GROT. Nazwij jego poszczególne części. Podaj podstawowe dane taktyczno-techniczne.", anchor: "częściowego rozłożenia i złożenia karabinka MSBS GROT" },
    { text: "Przedstaw podstawowe treści zapisu rozdziału „Żołnierz zawodowy w sytuacjach bojowych” z „Kodeksu honorowego żołnierza zawodowego Wojska Polskiego”.", anchor: "Żołnierz zawodowy w sytuacjach bojowych" },
  ]},
  { number: 5, questions: [
    { text: "W oparciu o zasady działalności szkoleniowej i szkoleniowo-metodycznej oraz obowiązującego Programu Strzelań z Broni Strzeleckiej przedstaw koncepcję do zajęć ze szkolenia strzeleckiego na temat: „Budowa broni karabinka MSBS GROT”.", anchor: "Budowa broni karabinka MSBS GROT" },
    { text: "Na czym polegała organizacja działań bojowych zrealizowana przez Marszałka Piłsudskiego, przeciwko Rosjanom w połowie sierpnia 1920 r. potocznie zwana „Cudem nad Wisłą”?", anchor: "Cudem nad Wisłą" },
  ]},
  { number: 6, questions: [
    { text: "Jak przygotował/a byś zajęcia z przedmiotu taktyka na temat: „Maskowanie indywidualne żołnierza”?", anchor: "Maskowanie indywidualne żołnierza" },
    { text: "Wskaż miejsca eksterminacji Narodu Polskiego pod okupacją niemiecką w czasie II wojny światowej.", anchor: "OFICER POLSKI", answerKey: "germanExtermination" },
  ]},
  { number: 7, questions: [
    { text: "Czym według Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy? Czy w przypadku konfliktu rosyjsko-ukraińskiego jego strony przestrzegają jego podstawowych zasad?", anchor: "Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy", answerKey: "ihlUkraine" },
    { text: "Proszę wymienić trzy polskie miasta, w których nadal produkuje się uzbrojenie (sprzęt wojskowy) w zakładach wybudowanych przed II wojną światową w ramach Centralnego Okręgu Przemysłowego.", anchor: "Centralnego Okręgu Przemysłowego", answerKey: "copCities" },
  ]},
  { number: 8, questions: [
    { text: "Przedstaw metodycznie jak zrealizować zajęcia wcielając się w rolę instruktora w punkcie nauczania modelem podstawowym w ramach przedmiotu regulamin musztry nt. „Zwroty w miejscu”.", anchor: "Zwroty w miejscu" },
    { text: "W 2027 roku dęblińska „Szkoła Orląt” będzie obchodziła 100. rocznicę przeniesienia z Grudziądza do Dęblina. Wymień dwa typy samolotów na których szkolono podchorążych w okresie międzywojennym.", anchor: "Szkoła Orląt w Dęblinie będzie świętować w przyszłym roku 100", answerKey: "interwarAircraft" },
  ]},
  { number: 9, questions: [
    { text: "Przedstaw możliwy wariant przeprowadzenia zajęć ze szkolenia strzeleckiego nt. „Strzelanie sprawdzające nr 1 MSBS GROT” w oparciu o zasady działalności szkoleniowej i szkoleniowo-metodycznej oraz obowiązującego Programu Strzelań z Broni Strzeleckiej.", anchor: "Strzelanie szkolne nr 1 MSBS GROT" },
    { text: "Jakie nazwy nosiły dwie główne polskie jednostki lotnicze (myśliwska i bombowa) utworzone w 1939 r.?", anchor: "dwie polskie jednostki lotnicze myśliwska i bombowa utworzone w 1939" },
  ]},
  { number: 10, questions: [
    { text: "Omów budowę i scharakteryzuj granat F-1. Podaj jego dane taktyczno-techniczne.", anchor: "granat F-1" },
    { text: "Czego dotyczyły przedwojenne zapisy dwunastu przykazań podchorążego dęblińskiej „Szkoły Orląt”?", anchor: "12 Przykazań podchorążego Szkoły Orląt" },
  ]},
  { number: 11, questions: [
    { text: "Omów budowę i scharakteryzuj granat RG-42. Podaj jego dane taktyczno-techniczne.", anchor: "granat RG-42" },
    { text: "Wymień nazwiska trzech znanych Ci polskich asów lotnictwa z II wojny światowej. Co oznaczało sformułowanie „as lotnictwa”?", anchor: "3 polskich Asów Lotnictwa z II wojny światowej", answerKey: "aces" },
  ]},
  { number: 12, questions: [
    { text: "W jaki sposób przeprowadził/a byś zajęcia z przedmiotu OPBMR na temat: Zakładanie i zdejmowanie odzieży ochronnej? W oparciu o jaką literaturę przedmiotu należy takie zajęcia przeprowadzić?", anchor: "Zakładanie i zdejmowanie odzieży ochronnej" },
    { text: "Wymień trzy - znane Ci - bitwy, w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie. Podaj nazwiska polskich dowódców.", anchor: "trzy bitwy w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie" },
  ]},
  { number: 13, questions: [
    { text: "Opisz i wyjaśnij dyrektywną (rozkazodawczą) metodę udzielania instruktażu.", anchor: "dyrektywną rozkazodawczą metodę udzielania instruktażu" },
    { text: "Przedstaw na czym polegała eksterminacja Narodu Polskiego w Związku Sowieckim w czasie II wojny światowej.", anchor: "OFICER POLSKI", answerKey: "sovietExtermination" },
  ]},
  { number: 14, questions: [
    { text: "Proszę wymienić metody wychowania wojskowego i omówić jedną z nich.", anchor: "metody wychowania wojskowego i omówić jedną z nich" },
    { text: "W powojennej „Szkole Orląt” w Dęblinie szkolono podchorążych na samolotach polskiej produkcji. Wymień dwa typy znanych Ci statków powietrznych.", anchor: "samolotach polskiej produkcji" },
  ]},
  { number: 15, questions: [
    { text: "Opisz i wyjaśnij na czym polega metoda kolegialna udzielania instruktażu.", anchor: "metoda kolegialna udzielania instruktażu" },
    { text: "W którym roku Polska przystąpiła do Sojuszu Północnoatlantyckiego? Jakie są główne cele powołania i funkcjonowania NATO?", anchor: "ile zakupiliśmy w 2003 r. samolotów F-16", answerKey: "nato" },
  ]},
  { number: 16, questions: [
    { text: "Dokonaj charakterystyki planu-konspektu do zajęć. Jakie treści powinien zawierać ten dokument?", anchor: "plan-konspekt do zajęć wymień i scharakteryzuj jego 14 punktów" },
    { text: "Czemu służy i w czym pomaga działanie zespołowe w wojsku.", anchor: "Czemu sprzyja w wojsku działanie w zespołach" },
  ]},
  { number: 17, questions: [
    { text: "Scharakteryzuj ogólnie Siły Zbrojne Republiki Białorusi. Dokonaj oceny ewentualnego ich użycia w przypadku konfliktu Rosja - NATO.", anchor: "Siły Zbrojne Republiki Białoruś", answerKey: "belarus" },
    { text: "Jakimi typami samolotów dysponowało polskie lotnictwo wojskowe podczas wojny obronnej we wrześniu 1939 roku?", anchor: "Ile Polska zakupiła samolotów F-35", answerKey: "aviation1939" },
  ]},
  { number: 18, questions: [
    { text: "Zachowując warunki bezpieczeństwa dokonaj częściowego rozłożenia i złożenia pistoletu VIS-100. Nazwij poszczególne jego części. Podaj podstawowe dane taktyczno-techniczne.", anchor: "częściowego rozłożenia i złożenia pistoletu VIS-100" },
    { text: "Wymień główne bitwy polskiej wojny obronnej we wrześniu 1939 roku?", anchor: "OFICER POLSKI", answerKey: "battles1939" },
  ]},
  { number: 19, questions: [
    { text: "Wyjaśnij pojęcia „obrona” i „natarcie”. Dokonaj ich krótkiej charakterystyki.", anchor: "pojęcie obrona i natarcie" },
    { text: "W 1605 r. Hetman Jan Karol Chodkiewicz, pokonał Szwedów pod Kircholmem, stosując manewr kanneński, zrealizowany przez Hannibala w starciu z Rzymianami w 216 r. p.n.e. Omów główne jego założenia.", anchor: "W 1605 r. Hetman Jan Karol Chodkiewicz" },
  ]},
  { number: 20, questions: [
    { text: "Dokonaj krótkiej charakterystyki Sił Zbrojnych Federacji Rosyjskiej, uwzględniając jej dotychczasowe użycie w konflikcie rosyjsko-ukraińskim.", anchor: "Sił Zbrojnych Federacji Rosyjskiej uwzględniając jej użycie w konflikcie rosyjsko ukraińskim", answerKey: "russia" },
    { text: "Jakie rodzaje działań zbrojnych prowadziły oddziały polskie w walce z Rosjanami w latach 1830-1831?", anchor: "działań zbrojnych prowadzili Polacy w walce z Rosjanami w latach 1830-1831" },
  ]},
  { number: 21, questions: [
    { text: "Jak rozumiesz pojęcie „powszechna obrona przeciwlotnicza”? Jakie jest jej znaczenie na współczesnym polu walki?", anchor: "powszechna obrona przeciwlotnicza" },
    { text: "Jaką taktykę stosowali powstańcy styczniowi z 1863 r. w walkach z Rosjanami?", anchor: "taktykę stosowali powstańcy styczniowi z 1863" },
  ]},
  { number: 22, questions: [
    { text: "Jakie są podstawowe zadania artylerii na współczesnym polu walki?", anchor: "zadania artylerii na współczesnym polu walki" },
    { text: "Czy powstańcy styczniowi byli objęci szczególną opieką jako kombatanci przez Marszałka Józefa Piłsudskiego?", anchor: "powstańcy styczniowi byli objęci szczególną opieką jako kombatanci" },
  ]},
  { number: 23, questions: [
    { text: "Czym są działania opóźniające? Kiedy się je stosuje i w jakim celu?", anchor: "działania opóźniające" },
    { text: "Na czym polegała organizacja działań bojowych zrealizowana przez Marszałka Piłsudskiego, przeciwko Rosjanom w połowie sierpnia 1920 r. potocznie zwana „Cudem nad Wisłą”?", anchor: "Cudem nad Wisłą" },
  ]},
  { number: 24, questions: [
    { text: "Przedstaw procedurę przeprowadzenia postępowania dyscyplinarnego w pododdziale. W oparciu o jakie przepisy (dokumenty) jest ona realizowana?", anchor: "procedurę przeprowadzenia postępowania dyscyplinarnego", answerKey: "disciplinary" },
    { text: "Jaką koncepcję wojny w obronie granic RP preferował Generalny Inspektor Sił Zbrojnych Marszałek J. Piłsudski?", anchor: "koncepcję wojny w obronie granic Polski" },
  ]},
  { number: 25, questions: [
    { text: "Zachowując warunki bezpieczeństwa dokonaj rozłożenia i złożenia 5,56 mm karabinka standardowego MSBS GROT i nazwij jego części.", anchor: "5,56 mm karabinka standardowego MSBS GROT" },
    { text: "Czemu służy i w czym pomaga działanie zespołowe w wojsku?", anchor: "Czemu sprzyja w wojsku działanie w zespołach" },
  ]},
  { number: 26, questions: [
    { text: "Przedstaw koncepcję do zajęć ze szkolenia strzeleckiego nt. „Strzelanie szkolne nr 1 MSBS GROT”.", anchor: "koncepcję do zajęć ze szkolenia strzeleckiego nt. Strzelanie szkolne nr 1 MSBS GROT" },
    { text: "W 2027 roku dęblińska „Szkoła Orląt” będzie obchodziła 100. rocznicę przeniesienia z Grudziądza do Dęblina. Wymień dwa typy samolotów na których szkolono podchorążych w okresie międzywojennym.", anchor: "Szkoła Orląt w Dęblinie będzie świętować w przyszłym roku 100", answerKey: "interwarAircraft" },
  ]},
  { number: 27, questions: [
    { text: "Scharakteryzuj granat RG-42. Podaj jego dane taktyczno-techniczne.", anchor: "granat RG-42" },
    { text: "Czego dotyczyły przedwojenne zapisy dwunastu przykazań podchorążego dęblińskiej „Szkoły Orląt”?", anchor: "12 Przykazań podchorążego Szkoły Orląt" },
  ]},
  { number: 28, questions: [
    { text: "Przedstaw podstawowe treści zapisu rozdziału „Żołnierz zawodowy w sytuacjach bojowych” z „Kodeksu honorowego żołnierza zawodowego Wojska Polskiego”.", anchor: "Żołnierz zawodowy w sytuacjach bojowych" },
    { text: "Wymień numery taktyczne dwóch polskich dywizjonów myśliwskich, których piloci byli liderami w „Bitwie o Anglię” w liczbie zestrzeleń samolotów Luftwaffe.", anchor: "Bitwie o Anglię", answerKey: "battleBritainSquadrons" },
  ]},
  { number: 29, questions: [
    { text: "Zachowując warunki bezpieczeństwa dokonaj częściowego rozłożenia i złożenia karabinka MSBS GROT. Nazwij jego poszczególne części.", anchor: "częściowego rozłożenia i złożenia karabinka MSBS GROT" },
    { text: "Wymień nazwiska trzech znanych Ci polskich asów lotnictwa z II wojny światowej. Co oznaczało sformułowanie „as lotnictwa”?", anchor: "3 polskich Asów Lotnictwa z II wojny światowej", answerKey: "aces" },
  ]},
  { number: 30, questions: [
    { text: "Dokonaj częściowego rozłożenia pistoletu typu VIS-100. Podaj jego podstawowe dane taktyczno-techniczne.", anchor: "częściowego rozłożenia i złożenia pistoletu VIS-100" },
    { text: "Wymień trzy - znane Ci - bitwy, w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie. Podaj nazwiska polskich dowódców.", anchor: "trzy bitwy w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie" },
  ]},
  { number: 31, questions: [
    { text: "Omów budowę i scharakteryzuj granat F-1. Podaj jego dane taktyczno-techniczne.", anchor: "granat F-1" },
    { text: "Wymień główne bitwy polskiej wojny obronnej we wrześniu 1939 roku?", anchor: "12 Przykazań podchorążego Szkoły Orląt", answerKey: "battles1939" },
  ]},
  { number: 32, questions: [
    { text: "Omów budowę i scharakteryzuj granat RG-42. Podaj jego dane taktyczno-techniczne.", anchor: "granat RG-42" },
    { text: "Przedstaw na czym polegała eksterminacja Narodu Polskiego w Związku Sowieckim w czasie II wojny światowej.", anchor: "W 1605 r. Hetman Jan Karol Chodkiewicz", answerKey: "sovietExtermination" },
  ]},
  { number: 33, questions: [
    { text: "Scharakteryzuj pojęcie „powszechna obrona przeciwlotnicza”? Jakie jest jej znaczenie na współczesnym polu walki?", anchor: "powszechna obrona przeciwlotnicza" },
    { text: "Na czym polegała organizacja działań bojowych zrealizowana przez Marszałka Piłsudskiego, przeciwko Rosjanom w połowie sierpnia 1920 r. potocznie zwana „Cudem nad Wisłą”?", anchor: "Cudem nad Wisłą" },
  ]},
  { number: 34, questions: [
    { text: "Czym według Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy? Czy w przypadku konfliktu rosyjsko-ukraińskiego jego strony przestrzegają jego podstawowych zasad?", anchor: "Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy", answerKey: "ihlUkraine" },
    { text: "Proszę wymienić trzy polskie miasta, w których nadal produkuje się uzbrojenie (sprzęt wojskowy) w zakładach wybudowanych przed II wojną światową w ramach Centralnego Okręgu Przemysłowego.", anchor: "Centralnego Okręgu Przemysłowego", answerKey: "copCities" },
  ]},
  { number: 35, questions: [
    { text: "Zachowując warunki bezpieczeństwa dokonaj częściowego rozłożenia i złożenia karabinka MSBS GROT. Nazwij jego poszczególne części.", anchor: "częściowego rozłożenia i złożenia karabinka MSBS GROT" },
    { text: "Wymień nazwiska trzech znanych Ci polskich asów lotnictwa z II wojny światowej. Co oznaczało sformułowanie „as lotnictwa”?", anchor: "3 polskich Asów Lotnictwa z II wojny światowej", answerKey: "aces" },
  ]},
  { number: 36, questions: [
    { text: "Dokonaj częściowego rozłożenia pistoletu typu VIS-100. Podaj jego podstawowe dane taktyczno-techniczne.", anchor: "częściowego rozłożenia i złożenia pistoletu VIS-100" },
    { text: "Wymień trzy - znane Ci - bitwy, w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie. Podaj nazwiska polskich dowódców.", anchor: "trzy bitwy w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie" },
  ]},
  { number: 37, questions: [
    { text: "Omów budowę i scharakteryzuj granat F-1. Podaj jego dane taktyczno-techniczne.", anchor: "granat F-1" },
    { text: "Wskaż miejsca eksterminacji Narodu Polskiego pod okupacją niemiecką w czasie II wojny światowej.", anchor: "OFICER POLSKI", answerKey: "germanExtermination" },
  ]},
  { number: 38, questions: [
    { text: "Omów budowę i scharakteryzuj granat RG-42. Podaj jego dane taktyczno-techniczne.", anchor: "granat RG-42" },
    { text: "Wymień numery taktyczne dwóch polskich dywizjonów myśliwskich, których piloci byli liderami w „Bitwie o Anglię” w liczbie zestrzeleń samolotów Luftwaffe.", anchor: "Bitwie o Anglię", answerKey: "battleBritainSquadrons" },
  ]},
  { number: 39, questions: [
    { text: "Scharakteryzuj pojęcie „powszechna obrona przeciwlotnicza”? Jakie jest jej znaczenie na współczesnym polu walki.", anchor: "powszechna obrona przeciwlotnicza" },
    { text: "Wymień główne bitwy polskiej wojny obronnej we wrześniu 1939 roku.", anchor: "12 Przykazań podchorążego Szkoły Orląt", answerKey: "battles1939" },
  ]},
  { number: 40, questions: [
    { text: "Czym według Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy? Czy w przypadku konfliktu rosyjsko-ukraińskiego jego strony przestrzegają jego podstawowych zasad?", anchor: "Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy", answerKey: "ihlUkraine" },
    { text: "Proszę wymienić trzy polskie miasta, w których nadal produkuje się uzbrojenie (sprzęt wojskowy) w zakładach wybudowanych przed II wojną światową w ramach Centralnego Okręgu Przemysłowego.", anchor: "Centralnego Okręgu Przemysłowego", answerKey: "copCities" },
  ]},
];

export type Stage2SetDefinition = {
  number: number;
  questionAnchors: [string, string];
};

// Zestawy 1–34 przepisane z arkuszy egzaminacyjnych przekazanych przez użytkownika.
// Anchor służy wyłącznie do odnalezienia istniejącego pytania w bazie Etapu II.
// Treść pytania i odpowiedź wyświetlane w aplikacji pochodzą z istniejącej bazy.
export const STAGE2_SET_DEFINITIONS: Stage2SetDefinition[] = [
  { number: 1, questionAnchors: [
    "Strzelanie szkolne nr 1 z pistoletu VIS-100",
    "W 1605 r. Hetman Jan Karol Chodkiewicz",
  ]},
  { number: 2, questionAnchors: [
    "Pokonywanie terenu różnymi sposobami",
    "działań zbrojnych prowadzili Polacy w walce z Rosjanami w latach 1830-1831",
  ]},
  { number: 3, questionAnchors: [
    "Zakładanie odzieży ochronnej wg. Normy bojowej",
    "Czemu sprzyja w wojsku działanie w zespołach",
  ]},
  { number: 4, questionAnchors: [
    "częściowego rozłożenia i złożenia karabinka MSBS GROT",
    "Żołnierz zawodowy w sytuacjach bojowych",
  ]},
  { number: 5, questionAnchors: [
    "Budowa broni karabinka MSBS GROT",
    "Cudem nad Wisłą",
  ]},
  { number: 6, questionAnchors: [
    "Maskowanie indywidualne żołnierza",
    "OFICER POLSKI",
  ]},
  { number: 7, questionAnchors: [
    "Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy",
    "Centralnego Okręgu Przemysłowego",
  ]},
  { number: 8, questionAnchors: [
    "Zwroty w miejscu",
    "Szkoła Orląt w Dęblinie będzie świętować w przyszłym roku 100",
  ]},
  { number: 9, questionAnchors: [
    "Strzelanie szkolne nr 1 MSBS GROT",
    "dwie polskie jednostki lotnicze myśliwska i bombowa utworzone w 1939",
  ]},
  { number: 10, questionAnchors: [
    "granat F-1",
    "12 Przykazań podchorążego Szkoły Orląt",
  ]},
  { number: 11, questionAnchors: [
    "granat RG-42",
    "3 polskich Asów Lotnictwa z II wojny światowej",
  ]},
  { number: 12, questionAnchors: [
    "Zakładanie i zdejmowanie odzieży ochronnej",
    "trzy bitwy w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie",
  ]},
  { number: 13, questionAnchors: [
    "dyrektywną rozkazodawczą metodę udzielania instruktażu",
    "OFICER POLSKI",
  ]},
  { number: 14, questionAnchors: [
    "metody wychowania wojskowego i omówić jedną z nich",
    "samolotach polskiej produkcji",
  ]},
  { number: 15, questionAnchors: [
    "metoda kolegialna udzielania instruktażu",
    "ile zakupiliśmy w 2003 r. samolotów F-16",
  ]},
  { number: 16, questionAnchors: [
    "plan-konspekt do zajęć wymień i scharakteryzuj jego 14 punktów",
    "Czemu sprzyja w wojsku działanie w zespołach",
  ]},
  { number: 17, questionAnchors: [
    "Siły Zbrojne Republiki Białoruś",
    "Ile Polska zakupiła samolotów F-35",
  ]},
  { number: 18, questionAnchors: [
    "częściowego rozłożenia i złożenia pistoletu VIS-100",
    "OFICER POLSKI",
  ]},
  { number: 19, questionAnchors: [
    "pojęcie obrona i natarcie",
    "W 1605 r. Hetman Jan Karol Chodkiewicz",
  ]},
  { number: 20, questionAnchors: [
    "Sił Zbrojnych Federacji Rosyjskiej uwzględniając jej użycie w konflikcie rosyjsko ukraińskim",
    "działań zbrojnych prowadzili Polacy w walce z Rosjanami w latach 1830-1831",
  ]},
  { number: 21, questionAnchors: [
    "powszechna obrona przeciwlotnicza",
    "taktykę stosowali powstańcy styczniowi z 1863",
  ]},
  { number: 22, questionAnchors: [
    "zadania artylerii na współczesnym polu walki",
    "powstańcy styczniowi byli objęci szczególną opieką jako kombatanci",
  ]},
  { number: 23, questionAnchors: [
    "działania opóźniające",
    "Cudem nad Wisłą",
  ]},
  { number: 24, questionAnchors: [
    "procedurę przeprowadzenia postępowania dyscyplinarnego",
    "koncepcję wojny w obronie granic Polski",
  ]},
  { number: 25, questionAnchors: [
    "5,56 mm karabinka standardowego MSBS GROT",
    "Czemu sprzyja w wojsku działanie w zespołach",
  ]},
  { number: 26, questionAnchors: [
    "koncepcję do zajęć ze szkolenia strzeleckiego nt. Strzelanie szkolne nr 1 MSBS GROT",
    "Szkoła Orląt w Dęblinie będzie świętować w przyszłym roku 100",
  ]},
  { number: 27, questionAnchors: [
    "granat RG-42",
    "12 Przykazań podchorążego Szkoły Orląt",
  ]},
  { number: 28, questionAnchors: [
    "Żołnierz zawodowy w sytuacjach bojowych",
    "Bitwie o Anglię",
  ]},
  { number: 29, questionAnchors: [
    "częściowego rozłożenia i złożenia karabinka MSBS GROT",
    "3 polskich Asów Lotnictwa z II wojny światowej",
  ]},
  { number: 30, questionAnchors: [
    "Systemu Wykorzystania Doświadczeń należy zawrzeć w Arkuszu Zgłoszenia Obserwacji",
    "trzy bitwy w których walczyli żołnierze Polskich Sił Zbrojnych na Zachodzie",
  ]},
  { number: 31, questionAnchors: [
    "granat F-1",
    "12 Przykazań podchorążego Szkoły Orląt",
  ]},
  { number: 32, questionAnchors: [
    "granat RG-42",
    "W 1605 r. Hetman Jan Karol Chodkiewicz",
  ]},
  { number: 33, questionAnchors: [
    "powszechna obrona przeciwlotnicza",
    "Cudem nad Wisłą",
  ]},
  { number: 34, questionAnchors: [
    "Międzynarodowego Prawa Humanitarnego konfliktów zbrojnych jest cel wojskowy",
    "Centralnego Okręgu Przemysłowego",
  ]},
];

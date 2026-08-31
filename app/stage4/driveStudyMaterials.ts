export type StudyBlock = {
  title: string;
  steps: string[];
};

export type Stage4StudyMaterial = {
  title: string;
  summary: string;
  remember: string[];
  blocks: StudyBlock[];
  phrases?: string[];
  sources: string[];
  sourceNote?: string;
};

export const stage4StudyMaterials: Record<string, Stage4StudyMaterial> = {
  "5-25-5xc": {
    title: "5-25 i 5xC — kolejność, którą trzeba mieć w głowie",
    summary:
      "Przy zatrzymaniu najpierw bezpiecznie sprawdzasz otoczenie procedurą 5-25. Gdy wykryjesz lub podejrzewasz IED, przechodzisz do 5xC. W materiale źródłowym kolejność 5xC to: CHECK → CONFIRM → CLEAR → CORDON → CONTROL.",
    remember: [
      "5 m: najpierw kontrola wzrokowa z pojazdu; dwóch wyznaczonych żołnierzy wysiada, zwracając uwagę na miejsce pierwszego kroku.",
      "Sprawdź miejsce pod pojazdem i bezpośrednio wokół niego; po zakończeniu melduj „CZYSTO / SPRAWDZONE”.",
      "25 m: rozszerz przeszukanie wokół pojazdu; po sprawdzeniu ponownie melduj „CZYSTO / SPRAWDZONE”.",
      "Po wykryciu podejrzanego przedmiotu nie dotykaj go i nie próbuj wykonywać czynności należących do EOD/saperów.",
      "5xC: CHECK, CONFIRM, CLEAR, CORDON, CONTROL — tę kolejność warto umieć bez zastanowienia.",
      "W kordonie zapewnij obserwację i ubezpieczenie 360°, sprawdź rejon pod kątem kolejnych urządzeń i kontroluj dostęp osób postronnych.",
    ],
    blocks: [
      {
        title: "Procedura 5-25",
        steps: [
          "Po zatrzymaniu sprawdź wzrokowo teren wokół pojazdu.",
          "Dwóch wyznaczonych żołnierzy opuszcza pojazd, kontrolując miejsce postawienia pierwszego kroku; po wyjściu zamykają drzwi.",
          "W pierwszej kolejności sprawdź, czy pod pojazdem i w miejscu jego postoju nie ma IED.",
          "Przeszukaj strefę 5 m dookoła pojazdu i zamelduj „CZYSTO / SPRAWDZONE”.",
          "Rozszerz przeszukanie do 25 m i po zakończeniu ponownie zamelduj „CZYSTO / SPRAWDZONE”.",
          "Dopiero po sprawdzeniu rejonu podejmuj dalsze spieszenie, zawsze dostosowując je do aktualnego zagrożenia.",
        ],
      },
      {
        title: "Procedura 5xC",
        steps: [
          "CHECK — sprawdź miejsce i zgłoś podejrzany przedmiot/zachowanie: kierunek, odległość, opis.",
          "CONFIRM — potwierdzaj z bezpiecznej odległości, wykorzystując osłonę i przyrządy obserwacyjne; nie dotykaj podejrzanego przedmiotu.",
          "CLEAR — odsuń stan osobowy i osoby postronne od zagrożenia, określ swoje położenie względem IED i wykorzystaj osłonę.",
          "CORDON — odetnij rejon od ruchu, ustanów strefę bezpieczeństwa, przeszukaj miejsce rozwinięcia kordonu i zorganizuj ubezpieczenie 360°.",
          "CONTROL — ustanów punkt kontrolny, kontroluj ruch w rejonie i przygotuj miejsce do działania EOD.",
        ],
      },
    ],
    phrases: [
      "Po sprawdzeniu: „CZYSTO / SPRAWDZONE”.",
      "Podejrzany przedmiot: meldunek z kierunkiem, odległością i krótkim opisem.",
    ],
    sources: [
      "Procedura 5 X C.pdf",
      "Rozkaz bojowy 5-25 + 5C.docx",
      "5-25.pdf",
      "5xC - 5-25.pdf",
    ],
    sourceNote: "Kolejność 5xC została przyjęta z dokumentu „Procedura 5 X C.pdf”.",
  },

  supply: {
    title: "Dostarczenie zaopatrzenia — co komisja powinna zobaczyć",
    summary:
      "To nie jest tylko przeniesienie skrzynki. Dowódca ma zorganizować ubezpieczone przemieszczenie, rozdzielić role, doprowadzić amunicję do walczącego pododdziału i kontrolować bezpieczeństwo całego zespołu.",
    remember: [
      "Skrzynka amunicyjna ma w materiałach 26–30 kg; w ćwiczeniu indywidualnym żołnierz startuje w postawie leżącej.",
      "Wariant czołganiem: 30 m czołganiem na boku.",
      "Wariant skokami: 40 m — dwa skoki po 20 m.",
      "Po osiągnięciu rubieży odłóż skrzynkę, przyjmij postawę strzelecką leżąc i zamelduj „Gotów”.",
      "Nie otwieraj skrzynki w trakcie przemieszczania; wykorzystuj właściwości maskujące terenu.",
      "W zadaniu dowódczym wyznacz trasę, ubezpieczenie, nosicieli, zastępcę, punkt kontaktowy oraz sposób przekazania zaopatrzenia.",
    ],
    blocks: [
      {
        title: "Schemat działania dowódcy",
        steps: [
          "Wprowadź zespół w sytuację i jasno podaj zadanie oraz limit czasu.",
          "Wyznacz trasę skrytą, ugrupowanie marszowe, szperaczy/ubezpieczenie, nosicieli i zastępcę dowódcy.",
          "Prowadź przemieszczenie z ciągłą obserwacją i gotowością do reakcji na kontakt z przeciwnikiem.",
          "W strefie bezpośredniego zagrożenia zastosuj sposób dostarczenia wynikający z zadania — czołganie lub skoki.",
          "Przed punktem kontaktowym rozpoznaj rejon, nawiąż kontakt z pododdziałem, przekaż amunicję i potwierdź wykonanie zadania.",
          "Po powrocie zabezpiecz zespół i przeprowadź AAR.",
        ],
      },
      {
        title: "Norma praktyczna — skrzynka z amunicją",
        steps: [
          "Stan wyjściowy: postawa strzelecka leżąc, skrzynka przy żołnierzu.",
          "Na komendę zabierz skrzynkę i rozpocznij przemieszczanie.",
          "Czołganiem: 30 m na boku; skokami: 40 m w dwóch skokach po 20 m.",
          "Na rubieży końcowej odłóż skrzynkę, przyjmij postawę leżąc i zamelduj „Gotów”.",
        ],
      },
    ],
    phrases: ["Komenda do rozpoczęcia ćwiczenia: „Naprzód!”.", "Po wykonaniu normy: „Gotów”."],
    sources: ["Dostarczanie Amunicji Na Polu Walki.pdf", "Rozkaz bojowy dostarczenie zaopatrzenia.docx", "PP - Dostarczanie Amunicji - Pętla.pdf"],
  },

  okd: {
    title: "OKD / orientowanie — prosty szkielet odpowiedzi i działania",
    summary:
      "Najpierw orientujesz siebie i pododdział w terenie, potem kodujesz dozory i organizujesz system obserwacji oraz obrony. Dalej dowodzisz funkcjonowaniem bazy: ubezpieczenie, ogień, maskowanie, woda, żywność, schronienie i odpoczynek.",
    remember: [
      "Orientowanie: kierunek zasadniczy → miejsce stania → charakterystyka terenu → ocena terenu.",
      "Dozór podajesz w sposób jednoznaczny: numer/nazwa, kierunek lub azymut i odległość.",
      "Koduj charakterystyczne rubieże i obiekty tak, aby cały zespół używał tych samych nazw.",
      "Zorganizuj obserwację okrężną, posterunek obserwacyjny i sektory odpowiedzialności.",
      "Oprzyj system ognia na dozorach i przygotuj stanowiska główne/zapasowe.",
      "W bazie pamiętaj o maskowaniu, wodzie, posiłku, schronieniu, rotacji wart i gotowości alarmowej.",
    ],
    blocks: [
      {
        title: "Orientowanie taktyczno-topograficzne",
        steps: [
          "Wskaż północ/kierunek zasadniczy działania.",
          "Określ miejsce stania na mapie i w terenie.",
          "Scharakteryzuj teren na wprost i na skrzydłach, wskazując elementy wpływające na widoczność i ruch.",
          "Oceń, skąd może działać przeciwnik i jakie naturalne korytarze podejścia istnieją.",
          "Wskaż 3–4 dozory oraz zakoduj ważne rubieże i obiekty.",
        ],
      },
      {
        title: "Organizacja bazy / rejonu",
        steps: [
          "Zajmij rejon w sposób ubezpieczony i zorganizuj obronę okrężną 360°.",
          "Wyznacz posterunki obserwacyjne, sektory i zadania dla środków ogniowych.",
          "Wyznacz osoby funkcyjne, zastępcę i sygnały alarmowania/dowodzenia.",
          "Zorganizuj maskowanie, rozbudowę stanowisk i gotowość do odparcia ataku.",
          "Zorganizuj wodę, posiłek, schronienie i rotacyjny odpoczynek bez utraty gotowości.",
          "Po działaniu przeprowadź AAR.",
        ],
      },
    ],
    sources: ["Rozkaz bojowy OKD.docx", "Organizacja Razenia Ogniem Pododdzialow.pdf", "Instrukcja-kierowania-ogniem.pdf"],
  },

  cff: {
    title: "Call for Fire — 6 elementów w 3 transmisjach",
    summary:
      "Oficjalna procedura CFF dzieli wezwanie wsparcia ogniowego na sześć elementów przekazywanych w trzech transmisjach radiowych. Najważniejsze jest opanowanie ich kolejności, a potem płynne przejście do poprawek, FFE i zakończenia zadania.",
    remember: [
      "Transmisja 1: identyfikacja obserwatora/kryptonim + informacje wstępne (np. ADJUST FIRE).",
      "Transmisja 2: położenie celu.",
      "Transmisja 3: opis celu + sposób wykonania zadania ogniowego + sposób wywołania i kontroli ognia.",
      "Po przyjęciu zadania FDC przekazuje Message to Observer (MTO); obserwator wykonuje sprawdzenie zwrotne.",
      "W trakcie wstrzeliwania stosujesz poprawki kierunku i donośności, np. LEFT/RIGHT oraz ADD/DROP.",
      "Po uzyskaniu właściwego położenia przechodzisz do FIRE FOR EFFECT, a na końcu podajesz END OF MISSION i ocenę skutków rażenia (BDA).",
    ],
    blocks: [
      {
        title: "Trzy transmisje CFF",
        steps: [
          "1. Observer identification / call sign + Warning order.",
          "2. Target location.",
          "3. Target description + Method of engagement + Method of fire and control.",
        ],
      },
      {
        title: "Po przekazaniu wezwania",
        steps: [
          "Odbierz MTO i wykonaj readback/sprawdzenie zwrotne.",
          "Obserwuj pierwszy wybuch i określ poprawkę boczną oraz w donośności.",
          "Podaj poprawkę — np. LEFT/RIGHT oraz ADD/DROP.",
          "Gdy ogień jest właściwie sprowadzony na cel, podaj FIRE FOR EFFECT.",
          "Po zakończeniu oceń efekt i podaj END OF MISSION / BDA.",
        ],
      },
    ],
    phrases: [
      "Szkielet 1. transmisji: „[FDC], THIS IS [OBSERVER], ADJUST FIRE, OVER.”",
      "Szkielet 2. transmisji: „GRID …, ALTITUDE …, OVER.”",
      "Korekta: „LEFT/RIGHT …, ADD/DROP …, OVER.”",
      "Przejście do ognia skutecznego: „FIRE FOR EFFECT, OVER.”",
    ],
    sources: ["PROCEDURY WZYWANIA WSPARCIA OGNIOWEGO Z POLA WALKI (CALL FOR FIRE) DTU-3.2.5.1.1.pdf", "Rozkaz bojowy CFF.docx", "Call-for-Fire-Template.pdf"],
    sourceNote: "Układ 6 elementów / 3 transmisji pochodzi z DTU-3.2.5.1.1.",
  },

  cbrn: {
    title: "OPBMR — rozpoznanie i pokonanie terenu skażonego",
    summary:
      "Dowódca ma wykryć granice skażenia, zidentyfikować środek, oznaczyć strefę i zdecydować o obejściu lub pokonaniu terenu. Jeżeli trzeba wejść w skażenie, pododdział działa w ochronie, przechodzi sprawnie i po wyjściu wykonuje natychmiastową likwidację skażeń.",
    remember: [
      "Przy poziomie podwyższonym / ISOPS-2 środki ochrony pozostają w położeniu „Pogotowie”.",
      "Przed strefą skażenia zatrzymaj ugrupowanie ok. 50–100 m przed granicą i zorganizuj ubezpieczenie.",
      "Na komendę doprowadź indywidualne środki ochrony do położenia bojowego.",
      "Sekcja wykrywania i monitorowania skażeń rozpoznaje, identyfikuje i oznacza granice strefy oraz składa meldunek.",
      "Jeżeli brak drogi obejścia, pokonuj rejon zwartym szykiem i sprawnie, ograniczając kontakt z terenem i roślinnością.",
      "Po wyjściu wykonaj natychmiastową likwidację skażeń; maski zdejmuj dopiero po potwierdzeniu bezpiecznego stężenia i na komendę.",
    ],
    blocks: [
      {
        title: "Kolejność działania",
        steps: [
          "Zatrzymaj pododdział przed podejrzanym rejonem i zorganizuj ubezpieczenie.",
          "Doprowadź środki ochrony do właściwego położenia.",
          "Wyślij sekcję WiMS do rozpoznania; wykryj i oznacz przednią granicę skażenia.",
          "Zidentyfikuj rodzaj zagrożenia przyrządami i zamelduj wynik.",
          "Sprawdź możliwość obejścia; jeśli obejścia brak — pokonaj teren w ochronie.",
          "Oznacz tylną granicę, wyjdź z rejonu i zorganizuj natychmiastową likwidację skażeń.",
          "Sprawdź bezpieczeństwo atmosfery; dopiero wtedy zezwól na zdjęcie masek i kontynuuj marsz.",
        ],
      },
      {
        title: "W samym terenie skażonym",
        steps: [
          "Nie siadaj i nie opieraj się o elementy terenu.",
          "Unikaj gęstych zarośli i wysokiej trawy oraz nie dotykaj nieznanych przedmiotów.",
          "Nie jedz, nie pij, nie pal i nie rozszczelniaj maski.",
        ],
      },
    ],
    phrases: ["Komenda alarmowa z materiału: „ALARM O SKAŻENIACH – MASKI WŁÓŻ”.", "Po wykryciu: zamelduj rodzaj zagrożenia oraz współrzędne początku i końca strefy."],
    sources: ["Rozkaz bojowy OPBMR.docx", "OPBMR.pdf", "Plan-konspekt-Działanie-po-napotkaniu-terenu-skaz-onego-i-w-terenie-.pdf", "Ochrona-Przed-Skazeniami-Temat-3.pdf"],
  },

  medevac: {
    title: "Ewakuacja rannego — MARCH PAWS → 9-Line → transport → MIST",
    summary:
      "Najpierw zabezpiecz poszkodowanego w fazie Tactical Field Care, następnie przygotuj ewakuację i nadaj 9-Line. Ranny przemieszcza się w środku ubezpieczonego ugrupowania. Punkt podjęcia trzeba wcześniej sprawdzić i zabezpieczyć, a podczas przekazania rannego ratownikowi przekazujesz raport MIST.",
    remember: [
      "Przed transportem wykonaj ocenę/zaopatrzenie w schemacie MARCH PAWS i przygotuj Polową Kartę Poszkodowanego.",
      "Ranny jest zabezpieczony na noszach; zespół wyznacza noszowych i ich zmienników oraz ubezpieczenie czołowe, tylne i skrzydłowe.",
      "Nadaj 9-Line MEDEVAC przed dotarciem do punktu podjęcia.",
      "Około 100 m przed PZ zatrzymaj zespół, rozpoznaj rejon i dopiero potem wejdź na strefę.",
      "Na PZ zorganizuj obronę okrężną 360°; jeśli punkt jest niebezpieczny, natychmiast przejdź do punktu zapasowego.",
      "Przy przekazaniu poszkodowanego przekaż MIST oraz kartę TCCC/DD Form 1380.",
    ],
    blocks: [
      {
        title: "9-Line MEDEVAC — kolejność",
        steps: [
          "1. Położenie miejsca podjęcia.",
          "2. Częstotliwość radiowa i kryptonim.",
          "3. Liczba pacjentów według priorytetu.",
          "4. Wymagany sprzęt specjalistyczny.",
          "5. Liczba pacjentów według typu transportu (np. leżący/chodzący).",
          "6. Bezpieczeństwo w strefie podjęcia.",
          "7. Sposób oznakowania strefy podjęcia.",
          "8. Narodowość i status pacjenta.",
          "9. Zagrożenie OPBMR / warunki terenowe.",
        ],
      },
      {
        title: "MIST przy przekazaniu rannego",
        steps: [
          "M — Mechanism of Injury: mechanizm urazu.",
          "I — Injuries: rozpoznane obrażenia.",
          "S — Signs/Symptoms: najważniejsze parametry i objawy.",
          "T — Treatment Given: wykonane czynności i zastosowane leczenie.",
        ],
      },
      {
        title: "Przejście na punkt zapasowy",
        steps: [
          "Po informacji, że PZ jest niebezpieczny, przerwij wejście do strefy.",
          "Podaj sygnał zmiany trasy/punktu i wprowadź szperaczy na nowy kierunek.",
          "Ubezpieczenie osłania odskok, a noszowi utrzymują transport rannego.",
          "Na PZ zapasowym ponownie wykonaj rozpoznanie i zorganizuj obronę 360°.",
        ],
      },
    ],
    phrases: ["Do zapamiętania: MARCH PAWS → 9-Line → PZ → MIST.", "Przy zmianie punktu: krótka komenda kierunkowa i natychmiastowe przejście na PZ zapasowy."],
    sources: ["Rozkaz bojowy - ewakuacja rannego.docx", "T3-Ewakuacja-rannego.pdf", "PP-Ewakuacja-rannego-z-pola-walki-rożnymi-sposobami-1-1.pdf", "Prezentacja-CLS.pdf", "9 line medevc.png"],
    sourceNote: "W folderach znajdują się również materiały wideo do technik ewakuacji, TCCC, 9-Line i MIST; w aplikacji wykorzystano ich tematykę jako wskazanie do treningu, bez kopiowania prywatnych plików wideo.",
  },
};

export const extraShootingMaterial: Stage4StudyMaterial = {
  title: "Materiał dodatkowy — strzelanie przygotowawcze i sprawdzające nr 1",
  summary:
    "Folder zawiera dwa krótkie materiały: strzelanie przygotowawcze nr 1 z pistoletu oraz strzelanie sprawdzające nr 1 z karabinka. Oba uczą podobnego schematu: 5 strzałów → kontrola → awaryjna wymiana magazynka → 5 strzałów → kontrola celu, broni i otoczenia.",
  remember: [
    "Pistolet: tarcza T1, 5 m, 10 nabojów w 2 magazynkach po 5, postawa stojąca, ogień pojedynczy, minimum 6 trafień.",
    "Pistolet: czas 20/25/30 s zależnie od etapu szkolenia; po pierwszych 5 strzałach awaryjna wymiana magazynka.",
    "Karabinek: tarcza T1, 15 m, 10 nabojów w 2 magazynkach po 5, postawa stojąca, ogień pojedynczy.",
    "Karabinek: ocena — 8 trafień bardzo dobrze, 7 dobrze, 6 dostatecznie, poniżej 6 niedostatecznie.",
    "W obu strzelaniach kontrola celu, broni i otoczenia jest elementem wykonania; po zakończeniu przyjmujesz niską gotowość.",
  ],
  blocks: [
    {
      title: "Pistolet — strzelanie przygotowawcze nr 1",
      steps: [
        "Na LOO po komendzie „Ładuj” załaduj broń i przejdź do postawy swobodnej z bronią w kaburze.",
        "Na „OGNIA” dobyj pistolet, wprowadź broń do walki i oddaj 5 strzałów.",
        "Skontroluj cel i broń, wykonaj awaryjną wymianę magazynka.",
        "Wprowadź broń ponownie do walki i oddaj kolejne 5 strzałów.",
        "Skontroluj cel, broń i otoczenie; przejdź do niskiej gotowości.",
        "Na komendy końcowe wykonaj: „Przerwij ogień”, „Rozładuj”, „Przejrzeć broń”.",
      ],
    },
    {
      title: "Karabinek — strzelanie sprawdzające nr 1",
      steps: [
        "Na „Ładuj” załaduj karabinek i przyjmij postawę niskiej gotowości.",
        "Na „OGNIA” wprowadź karabinek do walki i oddaj 5 strzałów.",
        "Skontroluj cel i broń, wykonaj awaryjną wymianę magazynka.",
        "Oddaj kolejne 5 strzałów, następnie skontroluj cel, broń i otoczenie.",
        "Przyjmij niską gotowość i wykonaj komendy końcowe kierownika strzelania.",
      ],
    },
  ],
  sources: ["1 Strzelanie Przygotowawcze NR 1 PW.pdf", "1 Strzelanie Sprawdzające NR 1 Kbs.pdf"],
};

export function hasStage4StudyMaterial(stationId: string) {
  return Boolean(stage4StudyMaterials[stationId]);
}

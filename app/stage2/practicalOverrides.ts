import type { Stage2AnswerOverride } from "./answerOverrides";

function practical(id:string, openingCue:string, steps:string[], fullAnswer:string):Stage2AnswerOverride{
  return {
    openingCue,
    steps,
    checklist: steps.map((text,i)=>({id:`${id}-${String(i+1).padStart(2,"0")}`,text})),
    fullAnswer:`Odpowiedź:\n${fullAnswer}`,
  };
}

const zasadyZolnierskiego=(id:string)=>practical(
  id,
  "Jako kierownik zajęć określam instruktorom temat, cel, organizację, literaturę i sposób przygotowania do zajęć.",
  [
    "Podaj temat i cel: „Zasady żołnierskiego zachowania” — uczyć prawidłowego zachowania żołnierza w codziennej służbie.",
    "Określ organizację: miejsce, czas oraz punkty nauczania — wzajemne zwracanie się żołnierzy, składanie meldunku, zachowanie w różnych sytuacjach i dbałość o mundur oraz wygląd zewnętrzny.",
    "Wskaż sposób prowadzenia i warunki bezpieczeństwa; instruktorzy mają przygotować własne plany pracy.",
    "Poleć przygotowanie merytoryczne na podstawie Regulaminu Ogólnego Żołnierza WP i materiałów obowiązujących na zajęciach.",
    "Sprawdź zrozumienie wytycznych, odpowiedz na pytania i ustal termin gotowości instruktorów."
  ],
  "Występując jako kierownik zajęć, podaję temat i cel szkolenia: „Zasady żołnierskiego zachowania”, a następnie określam organizację zajęć — czas, miejsce i punkty nauczania. Obejmą one wzajemne zwracanie się żołnierzy, składanie meldunku, zachowanie w różnych sytuacjach oraz dbałość o mundur i wygląd zewnętrzny. Określam sposób prowadzenia, niezbędne zabezpieczenie i warunki bezpieczeństwa. Polecam instruktorom przygotować plany pracy i zapoznać się z właściwymi zapisami Regulaminu Ogólnego Żołnierza WP. Na końcu sprawdzam, czy wytyczne są zrozumiałe, odpowiadam na pytania i ustalam termin gotowości do zajęć."
);

const dyrektywna=(id:string)=>practical(
  id,
  "Instruktaż metodą dyrektywną prowadzę tak, że jako kierownik jednoznacznie narzucam sposób przygotowania i realizacji zajęć.",
  [
    "Podaj wybrany temat i cel — np. „Oddawanie honorów”.",
    "Określ zagadnienia, strukturę zajęć, metodę nauczania, potrzebne pomoce oraz organizację punktów nauczania.",
    "Podaj warunki bezpieczeństwa i wskaż literaturę, na podstawie której instruktorzy mają się przygotować.",
    "Praktycznie pokaż oczekiwany sposób realizacji jednego zagadnienia lub wyznacz instruktora do demonstracji.",
    "Na końcu jednoznacznie ustal przyjęty wariant prowadzenia zajęć i sprawdź, czy instruktorzy go rozumieją."
  ],
  "W metodzie dyrektywnej jako kierownik zajęć sam określam, jak szkolenie ma być przeprowadzone. Na przykład dla tematu „Oddawanie honorów” podaję cel, zagadnienia, organizację punktów nauczania, metodę prowadzenia, zabezpieczenie materiałowe i warunki bezpieczeństwa. Wskazuję również literaturę — w tym Regulamin Musztry. Następnie praktycznie demonstruję sposób realizacji wybranego zagadnienia albo polecam wykonanie go przygotowanemu instruktorowi. Po pokazie omawiam najważniejsze elementy i ustalam jeden obowiązujący wariant prowadzenia zajęć."
);

const koniecMusztry=(id:string)=>practical(
  id,
  "Kończę zajęcia zbiórką całości, przypomnieniem tematu i krótkim podsumowaniem stopnia osiągnięcia celu.",
  [
    "Zarządź zakończenie ćwiczeń i zbiórkę w wyznaczonym miejscu.",
    "Przypomnij temat oraz cel zajęć z musztry indywidualnej.",
    "Oceń wykonanie: wskaż najczęstsze błędy, sposób ich poprawy oraz wyróżnij najlepiej ćwiczących.",
    "Podaj zadanie lub materiał do przygotowania na kolejne zajęcia.",
    "Zapytaj o urazy, pytania oraz braki w wyposażeniu i zakończ zajęcia."
  ],
  "Po zakończeniu ćwiczeń zarządzam zbiórkę w miejscu rozpoczęcia zajęć. Przypominam, że tematem była musztra indywidualna i odnoszę się do postawionego celu. Krótko oceniam poziom wykonania, wskazuję najczęstsze błędy — na przykład przy oddawaniu honorów lub pracy rąk w marszu — oraz podaję sposób ich usunięcia. Wyróżniam najlepiej ćwiczących i określam przygotowanie do kolejnych zajęć. Na końcu pytam o urazy, pytania i ewentualne braki w wyposażeniu, po czym kończę zajęcia."
);

const zwroty=(id:string)=>practical(
  id,
  "Podaję temat „Zwroty w miejscu”, cel szkolenia i komendy: „W PRAWO — ZWROT”, „W LEWO — ZWROT”, „W TYŁ — ZWROT”.",
  [
    "Podaj temat, cel i komendy do wykonania zwrotów.",
    "Wykonaj wzorowy pokaz całego zwrotu bez objaśnienia.",
    "Wykonaj pokaz z objaśnieniem: w prawo — na prawej pięcie i palcach lewej stopy; w lewo i w tył — na lewej pięcie i palcach prawej stopy; po zwrocie dostaw wolną stopę.",
    "Przećwicz czynność na tempa, następnie całością; obserwuj wszystkich i natychmiast poprawiaj błędy.",
    "Zakończ krótkim omówieniem, wskaż typowe błędy — utratę równowagi, nieprawidłową pracę stóp i zbyt wolne wykonanie."
  ],
  "Podaję temat „Zwroty w miejscu” i cel: nauczyć prawidłowego wykonywania zwrotów. Podaję właściwe komendy, po czym wykonuję pokaz wzorowy. Następnie pokazuję czynność z objaśnieniem: zwrot w prawo wykonuje się na prawej pięcie i palcach lewej stopy, a zwrot w lewo i w tył — na lewej pięcie i palcach prawej stopy; po wykonaniu zwrotu dostawia się wolną stopę. Dalej ćwiczymy czynność na tempa, a następnie całością do pełnego opanowania. Na bieżąco poprawiam błędy. Kończę omówieniem i wskazaniem najczęstszych uchybień."
);

const koniecStrzelania=(id:string,weapon:string)=>practical(
  id,
  "Po zakończeniu strzelania zarządzam zbiórkę, sprawdzam bezpieczeństwo broni i rozliczenie środków materiałowych.",
  [
    `Zakończ strzelanie, zarządź zbiórkę i przypomnij temat oraz cel zajęć z ${weapon}.`,
    "Dopilnuj sprawdzenia rozładowania broni wszystkich uczestników.",
    "Omów wyniki i najczęstsze błędy, wskaż sposoby ich poprawy i wyróżnij najlepiej ćwiczących.",
    "Nadzoruj zebranie łusek oraz pełne rozliczenie wydanej i niewykorzystanej amunicji.",
    "Sprawdź stan ludzi i wyposażenia, odpowiedz na pytania i zakończ zajęcia."
  ],
  `Kończę strzelanie i zarządzam zbiórkę. Przypominam temat oraz cel zajęć z ${weapon}. Następnie dopilnowuję sprawdzenia rozładowania broni wszystkich szkolonych. Omawiam wyniki i najczęstsze błędy, na przykład nieprawidłową postawę, celowanie lub pracę na języku spustowym, i wskazuję sposób ich poprawy. Wyróżniam najlepiej ćwiczących. Nadzoruję zebranie łusek i pełne rozliczenie amunicji. Na końcu sprawdzam stan ludzi i wyposażenia, pytam o urazy i wątpliwości oraz kończę zajęcia.`
);

const wstepStrzelania=(id:string,weapon:string)=>practical(
  id,
  "Rozpoczynam od meldunku, sprawdzenia stanu osobowego oraz bezpieczeństwa broni, a następnie przedstawiam temat i organizację strzelania.",
  [
    "Przyjmij meldunek, sprawdź obecność, wyposażenie oraz przygotowanie grupy.",
    "Dopilnuj sprawdzenia rozładowania broni przed rozpoczęciem szkolenia.",
    `Podaj temat i cel: strzelanie szkolne nr 1 z ${weapon}; omów organizację punktów nauczania i sposób zmian grup.`,
    "Podaj warunki bezpieczeństwa obowiązujące na strzelnicy oraz zasady meldowania urazów i samowolnego oddalania się.",
    "Podziel szkolonych na grupy, skieruj ich do instruktorów i wydaj polecenie rozpoczęcia zajęć."
  ],
  `Przyjmuję meldunek o gotowości grupy, sprawdzam obecność i wyposażenie oraz dopilnowuję sprawdzenia rozładowania broni. Podaję temat i cel: strzelanie szkolne nr 1 z ${weapon}. Następnie omawiam organizację — punkty nauczania, kolejność zmian grup i odpowiedzialność instruktorów. Przypominam najważniejsze warunki bezpieczeństwa obowiązujące na strzelnicy, w tym zakaz samowolnego oddalania się i obowiązek natychmiastowego meldowania urazów. Na końcu dzielę szkolonych na grupy, kieruję ich na punkty nauczania i wydaję polecenie rozpoczęcia zajęć.`
);

export const STAGE2_PRACTICAL_OVERRIDES:Record<string,Stage2AnswerOverride> = {
  P001: zasadyZolnierskiego("P001"),
  P002: dyrektywna("P002"),
  P003: practical("P003","Instruktaż metodą pokazową opieram na przygotowanym wzorowym pokazie, a dopiero potem na omówieniu i ustaleniu sposobu prowadzenia zajęć.",[
    "Podaj temat, cel oraz organizację instruktażu — np. „Zwroty w miejscu”.",
    "Przygotowany instruktor wykonuje wzorowy pokaz realizacji zagadnienia tak, jak ma ono wyglądać na właściwych zajęciach.",
    "Po pokazie omów kolejno czynności instruktora, organizację szkolonych, pomoce oraz warunki bezpieczeństwa.",
    "Zbierz pytania i uwagi instruktorów, ale ostatecznie sam ustal jednolity sposób prowadzenia zajęć.",
    "Poleć naniesienie ustaleń do planów pracy i przygotowanie się do szkolenia."
  ],"Najpierw podaję temat, cel i organizację instruktażu, na przykład dla zagadnienia „Zwroty w miejscu”. W metodzie pokazowej kluczowy jest wzorowy pokaz przygotowanego instruktora — pozostali obserwują dokładnie sposób prowadzenia punktu nauczania. Po pokazie omawiam kolejno jego elementy: czynności instruktora, organizację szkolonych, wykorzystanie pomocy oraz bezpieczeństwo. Wyjaśniam wątpliwości i na końcu ustalam jeden obowiązujący wariant realizacji, który instruktorzy przenoszą do swoich planów pracy."),
  P004: practical("P004","W metodzie kolegialnej wykorzystuję doświadczenie instruktorów i wspólnie z nimi wypracowuję najlepszy wariant prowadzenia szkolenia.",[
    "Podaj temat, cel, czas, miejsce oraz ograniczenia organizacyjne zajęć.",
    "Poproś instruktorów o przedstawienie własnych wariantów prowadzenia punktów nauczania.",
    "Wspólnie omówcie zalety i wady proponowanych rozwiązań, wykorzystanie bazy szkoleniowej i potrzebne środki.",
    "Określ warunki bezpieczeństwa i limity materiałowe, których wszystkie warianty muszą przestrzegać.",
    "Podsumuj dyskusję i jako kierownik zatwierdź ostateczny sposób realizacji zajęć."
  ],"Podaję temat, cel oraz podstawowe ramy zajęć: czas, miejsce, liczbę punktów nauczania i dostępne środki. Następnie proszę instruktorów o przedstawienie własnych propozycji prowadzenia szkolenia. Omawiamy wspólnie organizację, wykorzystanie bazy, możliwe rozwiązania i ich mocne oraz słabe strony. Jako kierownik określam granice — przede wszystkim warunki bezpieczeństwa i limity środków materiałowych. Na końcu porządkuję wnioski i zatwierdzam jeden wariant, według którego przygotowane zostaną plany pracy instruktorów."),
  P005: practical("P005","Rozpoczynam zajęcia od meldunku i sprawdzenia grupy, następnie podaję temat, cel, organizację i warunki bezpieczeństwa.",[
    "Przyjmij meldunek, sprawdź obecność, ubiór i gotowość szkolonych.",
    "Podaj temat: „Marsz krokiem zwykłym i defiladowym” oraz cel — doskonalić prawidłowe wykonywanie obu rodzajów marszu.",
    "Omów organizację: zagadnienia, czas, miejsce i sposób ćwiczenia oraz zmiany grup, jeżeli występują.",
    "Podaj warunki bezpieczeństwa: wykonywać tylko polecone czynności, nie oddalać się bez zgody, natychmiast meldować urazy.",
    "Sprawdź zrozumienie i wydaj polecenie rozpoczęcia zajęć."
  ],"Przyjmuję meldunek, sprawdzam obecność, ubiór i gotowość szkolonych. Podaję temat: „Marsz krokiem zwykłym i defiladowym” oraz cel zajęć — doskonalić prawidłowe wykonywanie obu rodzajów marszu. Następnie omawiam organizację: zagadnienia, czas, miejsce oraz sposób ćwiczenia. Przypominam warunki bezpieczeństwa: wykonywać tylko czynności nakazane przez instruktora, nie oddalać się bez zgody oraz natychmiast meldować urazy lub złe samopoczucie. Sprawdzam, czy są pytania, i wydaję polecenie rozpoczęcia szkolenia."),
  P006: koniecMusztry("P006"),
  P007: zwroty("P007"),
  P008: practical("P008","Podaję temat „Przyjmowanie postawy strzeleckiej leżąc”, cel oraz zasady bezpieczeństwa związane z kontrolą kierunku broni.",[
    "Podaj temat, cel i komendę do rozpoczęcia ćwiczenia; przypomnij bezpieczny kierunek broni.",
    "Wykonaj wzorowy pokaz całej czynności.",
    "W pokazie z objaśnieniem zaakcentuj stabilne utrzymanie broni, kontrolowane obniżenie sylwetki, podparcie i przyjęcie niskiej, stabilnej postawy.",
    "Przećwicz czynność na części, następnie całością; kontroluj szczególnie kierunek lufy i stabilność postawy.",
    "Podsumuj, wskaż błędy i sposób ich poprawy."
  ],"Podaję temat i cel: nauczyć prawidłowego przyjmowania postawy strzeleckiej leżąc. Przed pokazem przypominam o stałej kontroli kierunku broni. Najpierw wykonuję wzorowy pokaz, a następnie pokaz z objaśnieniem: stabilnie utrzymuję broń, kontrolowanie obniżam sylwetkę, wykorzystuję rękę wspomagającą do podparcia i przyjmuję niską, stabilną postawę. Następnie szkoleni ćwiczą czynność częściami i całością. Obserwuję każdego, natychmiast poprawiam błędy — szczególnie utratę kontroli nad kierunkiem broni i niestabilną postawę. Kończę krótkim omówieniem."),
  P009: practical("P009","Podaję temat „Oddawanie honorów w miejscu w nakryciu głowy”, cel szkolenia i wykonuję wzorowy pokaz.",[
    "Podaj temat i cel zajęć.",
    "Wykonaj wzorowy pokaz salutowania w miejscu.",
    "W pokazie z objaśnieniem zwróć uwagę na postawę zasadniczą, zwrot głowy, szybkie podniesienie prawej ręki do nakrycia głowy oraz prawidłowe ułożenie dłoni i palców.",
    "Przećwicz podniesienie i opuszczenie ręki na tempa, następnie wykonanie całością.",
    "Na bieżąco poprawiaj błędy i zakończ podsumowaniem."
  ],"Podaję temat i cel: nauczyć prawidłowego oddawania honorów w miejscu w nakryciu głowy. Wykonuję pokaz wzorowy, a następnie pokaz z objaśnieniem. Żołnierz przyjmuje postawę zasadniczą, zwraca głowę w stronę przełożonego i szybkim ruchem podnosi prawą rękę do nakrycia głowy; dłoń i palce układa zgodnie z Regulaminem Musztry. Następnie ćwiczymy ruch ręki na tempa i przechodzimy do wykonania całością. Obserwuję szkolonych, poprawiam ułożenie ręki, sylwetkę i moment wykonania czynności. Na końcu podsumowuję zajęcia."),
  P010: practical("P010","Jako kierownik podaję instruktorom temat „Zwroty w miejscu”, cel, organizację zajęć i sposób przygotowania.",[
    "Podaj temat i cel — uczyć prawidłowego wykonywania zwrotów w miejscu.",
    "Określ miejsce, czas, liczbę punktów nauczania i sposób organizacji szkolonych.",
    "Wskaż model podstawowy jako sposób nauczania: pokaz wzorowy, pokaz z objaśnieniem, ćwiczenie i poprawianie błędów.",
    "Podaj warunki bezpieczeństwa i literaturę: Regulamin Musztry SZ RP.",
    "Poleć przygotowanie planu pracy, sprawdź pytania i gotowość instruktorów."
  ],"W wytycznych podaję temat „Zwroty w miejscu” i cel — nauczyć żołnierzy prawidłowego wykonywania zwrotów. Określam miejsce, czas i organizację szkolenia. Wskazuję, że instruktor ma zastosować model podstawowy: podać treść i cel, wykonać pokaz wzorowy, następnie pokaz z objaśnieniem, przeprowadzić ćwiczenia i na bieżąco poprawiać błędy. Przypominam warunki bezpieczeństwa i wskazuję Regulamin Musztry jako podstawową literaturę. Na końcu polecam przygotować plan pracy i sprawdzam, czy instruktorzy mają pytania."),
  P011: zasadyZolnierskiego("P011"),
  P012: koniecStrzelania("P012","pistoletu wojskowego"),
  P013: wstepStrzelania("P013","pistoletu wojskowego"),
  P014: practical("P014","Wytyczne do strzelania z MSBS GROT zaczynam od określenia tematu, celu, organizacji, bezpieczeństwa i odpowiedzialności osób funkcyjnych.",[
    "Podaj temat i cel zajęć oraz termin i miejsce szkolenia zgodnie z planem.",
    "Określ punkty nauczania: strzelanie, przygotowanie do strzelania, budowa/obsługa broni oraz warunki bezpieczeństwa.",
    "Poleć instruktorom przygotowanie planów pracy i zapoznanie się z aktualnym Programem Strzelań z Broni Strzeleckiej.",
    "Przydziel zadania osobom funkcyjnym: amunicyjnemu, instruktorom i zabezpieczeniu medycznemu.",
    "Szczególnie podkreśl kontrolę broni, amunicji, ochronę słuchu i natychmiastowe reagowanie na sytuacje niebezpieczne."
  ],"Podaję temat i cel strzelania szkolnego nr 1 z MSBS GROT oraz określam termin, miejsce i organizację. Wyznaczam punkty nauczania: strzelanie, przygotowanie do strzelania, budowę i obsługę broni oraz warunki bezpieczeństwa. Instruktorom polecam przygotować plany pracy zgodnie z aktualnym Programem Strzelań z Broni Strzeleckiej. Wyznaczam odpowiedzialność amunicyjnego za pobranie, wydawanie i rozliczenie amunicji oraz zabezpieczenia medycznego za gotowość do udzielenia pomocy. Najważniejszym elementem wytycznych jest bezpieczeństwo: kontrola broni, amunicji, ochronniki słuchu i natychmiastowe reagowanie na każde zagrożenie."),
  P015: practical("P015","Jako kierownik określam temat „Przygotowanie do przysięgi wojskowej”, cel szkolenia, organizację i wymagane zabezpieczenie.",[
    "Podaj temat i cel — uczyć prawidłowych czynności wykonywanych podczas przysięgi wojskowej.",
    "Określ czas, miejsce i organizację punktu nauczania.",
    "Wskaż Regulamin Musztry jako podstawę przygotowania instruktora.",
    "Określ wymagane wyposażenie szkolonych zgodnie z planem zajęć i warunki bezpieczeństwa.",
    "Poleć przygotowanie planu pracy, sprawdź pytania i gotowość do szkolenia."
  ],"W wytycznych podaję temat „Przygotowanie do przysięgi wojskowej” oraz cel — nauczyć prawidłowego wykonywania czynności przewidzianych podczas uroczystości. Określam czas, miejsce i organizację zajęć, a jako podstawową literaturę wskazuję Regulamin Musztry. Informuję instruktorów o wymaganym wyposażeniu szkolonych zgodnie z planem zajęć i przypominam warunki bezpieczeństwa. Polecam przygotować plany pracy oraz praktycznie przygotować sposób prowadzenia zagadnienia. Na końcu sprawdzam zrozumienie wytycznych i odpowiadam na pytania."),
  P016: practical("P016","Wytyczne do rzutu granatem bojowym koncentruję przede wszystkim na organizacji, przygotowaniu instruktorów i bezwzględnym przestrzeganiu warunków bezpieczeństwa.",[
    "Podaj temat, cel, termin i miejsce zajęć zgodnie z planem szkolenia.",
    "Określ punkty nauczania: przygotowanie do rzutu, ćwiczenia przygotowawcze/treningowe, właściwe wykonanie zadania i warunki bezpieczeństwa.",
    "Poleć przygotowanie instruktorów na podstawie aktualnego programu strzelań i zatwierdzonych planów pracy.",
    "Wyznacz osoby odpowiedzialne za ewidencję i wydawanie środków oraz zabezpieczenie medyczne.",
    "Podkreśl, że każda czynność odbywa się wyłącznie na komendę i pod bezpośrednim nadzorem instruktora."
  ],"Podaję temat i cel zajęć z rzutu granatem bojowym oraz określam termin i miejsce. Ustalam punkty nauczania obejmujące przygotowanie do rzutu, ćwiczenia przygotowawcze, właściwe wykonanie zadania i warunki bezpieczeństwa. Instruktorom polecam przygotowanie zgodnie z aktualnym programem strzelań i zatwierdzonym planem pracy. Wyznaczam osoby odpowiedzialne za ewidencję i wydawanie środków oraz zabezpieczenie medyczne. Najmocniej akcentuję bezpieczeństwo: wszystkie czynności wykonuje się wyłącznie na komendę, pod bezpośrednim nadzorem i bez odstępstw od obowiązującej procedury."),
  P017: practical("P017","Podaję temat „Budowa karabinka MSBS GROT”, cel oraz informuję, że zajęcia prowadzę modelem podstawowym z wykorzystaniem broni szkoleniowej, planszy lub prezentacji.",[
    "Podaj temat i cel: nauczyć rozpoznawania głównych zespołów karabinka MSBS GROT i ich przeznaczenia.",
    "Wykonaj wzorową prezentację całej broni i wskaż jej główne zespoły.",
    "W pokazie z objaśnieniem omów: zespół kolby, mechanizm powrotny, suwadło z zamkiem, komorę zamkową, lufę, komorę spustową i łoże.",
    "Sprawdź wiedzę szkolonych przez wskazywanie i nazywanie elementów; na bieżąco koryguj błędy.",
    "Podsumuj i zapowiedz przygotowanie do kolejnego zagadnienia — częściowego rozkładania i składania."
  ],"Podaję temat „Budowa karabinka MSBS GROT” i cel — nauczyć rozpoznawania głównych zespołów oraz ich przeznaczenia. Najpierw wykonuję wzorową prezentację całej broni. Następnie, korzystając z egzemplarza szkoleniowego, planszy lub prezentacji, omawiam zespół kolby, mechanizm powrotny, suwadło z zamkiem, komorę zamkową, lufę, komorę spustową i łoże. Po objaśnieniu sprawdzam wiedzę: wskazuję elementy i polecam szkolonym je nazwać. Błędy poprawiam na bieżąco. Kończę podsumowaniem i zapowiadam przygotowanie do częściowego rozkładania i składania broni."),
  P018: practical("P018","Podaję temat „Budowa pistoletu P-83”, cel i przechodzę od pokazania całej broni do omówienia jej głównych zespołów.",[
    "Podaj temat i cel: nauczyć rozpoznawania budowy i głównych zespołów pistoletu P-83.",
    "Wykonaj wzorową prezentację całej broni z zachowaniem warunków bezpieczeństwa.",
    "W pokazie z objaśnieniem omawiaj główne zespoły na podstawie egzemplarza szkoleniowego, planszy lub zatwierdzonego materiału.",
    "Sprawdź wiedzę szkolonych przez wskazywanie i nazywanie elementów; poprawiaj błędy na bieżąco.",
    "Podsumuj zajęcia i określ przygotowanie do rozkładania oraz składania broni."
  ],"Podaję temat „Budowa pistoletu P-83” i cel — nauczyć szkolonych rozpoznawania głównych zespołów broni. Najpierw pokazuję cały pistolet z zachowaniem warunków bezpieczeństwa. Następnie, korzystając z egzemplarza szkoleniowego, planszy lub zatwierdzonego materiału, omawiam kolejno główne zespoły i ich przeznaczenie. Po objaśnieniu sprawdzam wiedzę szkolonych przez wskazywanie elementów i polecenie ich nazwania. Błędy koryguję od razu. Na końcu podsumowuję zajęcia i określam przygotowanie do następnego zagadnienia — rozkładania i składania broni."),
  P019: practical("P019","Podaję temat „Marsz krokiem zwykłym i defiladowym”, cel i rozpoczynam od wzorowego pokazu obu sposobów marszu.",[
    "Podaj temat, cel i podstawowe komendy do rozpoczęcia, zmiany sposobu marszu i zatrzymania.",
    "Wykonaj wzorowy pokaz kroku defiladowego i zwykłego.",
    "W pokazie z objaśnieniem podaj parametry: krok defiladowy 60–80 cm, stopa ok. 10 cm nad podłożem, tempo 112–116 kroków/min; krok zwykły 60–70 cm i tempo 112–116 kroków/min.",
    "Przećwicz pracę nóg i rąk, przejście z kroku defiladowego do zwykłego, następnie marsz całością.",
    "Poprawiaj sylwetkę, rytm i długość kroku; zakończ krótkim omówieniem."
  ],"Podaję temat i cel: nauczyć prawidłowego marszu krokiem zwykłym i defiladowym. Wykonuję wzorowy pokaz obu sposobów marszu, a potem pokaz z objaśnieniem. Dla kroku defiladowego zwracam uwagę na długość 60–80 centymetrów, podniesienie stopy na około 10 centymetrów, tempo 112–116 kroków na minutę oraz regulaminową pracę rąk. Krok zwykły ma długość 60–70 centymetrów i to samo tempo, natomiast ruch rąk jest swobodny. Następnie szkoleni ćwiczą przejścia i marsz całością. Koryguję sylwetkę, rytm i długość kroku, po czym podsumowuję zajęcia."),
  P020: practical("P020","Przyjmuję meldunek, sprawdzam grupę i przedstawiam temat „Zasady udzielania pierwszej pomocy”, cel oraz organizację zajęć.",[
    "Przyjmij meldunek, sprawdź obecność i przygotowanie szkolonych.",
    "Podaj temat i cel zajęć.",
    "Omów organizację punktów nauczania — np. RKO oraz tamowanie masywnego krwotoku — i czas pracy na każdym punkcie.",
    "Podaj warunki bezpieczeństwa oraz zasady meldowania urazów i złego samopoczucia.",
    "Podziel szkolonych na grupy, skieruj do instruktorów i rozpocznij zajęcia."
  ],"Przyjmuję meldunek, sprawdzam obecność i przygotowanie grupy. Podaję temat „Zasady udzielania pierwszej pomocy” i cel szkolenia. Następnie omawiam organizację, na przykład dwa punkty nauczania: resuscytację krążeniowo-oddechową oraz tamowanie masywnego krwotoku. Określam czas na punktach i sposób zmiany grup. Podaję warunki bezpieczeństwa, w tym zakaz samowolnego oddalania się oraz obowiązek meldowania urazów i złego samopoczucia. Dzielę szkolonych na grupy, kieruję ich do instruktorów i wydaję polecenie rozpoczęcia zajęć."),
  P021: practical("P021","Rozpoczynam od meldunku i sprawdzenia grupy, następnie podaję temat „Ewakuacja rannego na polu walki”, cel i zasady organizacji szkolenia.",[
    "Przyjmij meldunek, sprawdź obecność i wyposażenie.",
    "Podaj temat oraz cel zajęć i określ miejsce oraz czas szkolenia.",
    "Omów organizację punktu nauczania i sposób prowadzenia ćwiczeń praktycznych.",
    "Podaj warunki bezpieczeństwa: wykonywać tylko polecone czynności, meldować urazy, dbać o bezpieczeństwo ćwiczącego odgrywającego rannego.",
    "Sprawdź zrozumienie i wydaj polecenie rozpoczęcia zajęć."
  ],"Przyjmuję meldunek, sprawdzam obecność i wyposażenie. Podaję temat „Ewakuacja rannego na polu walki” oraz cel szkolenia. Omawiam organizację punktu nauczania, miejsce, czas i sposób prowadzenia ćwiczeń praktycznych. Szczególnie podkreślam bezpieczeństwo: szkoleni wykonują wyłącznie polecone czynności, natychmiast meldują urazy, a podczas ćwiczeń chronią osobę odgrywającą rannego przed upadkiem lub dodatkowym urazem. Sprawdzam, czy są pytania, i wydaję polecenie rozpoczęcia zajęć."),
  P022: practical("P022","Przyjmuję meldunek, podaję temat „Pokonywanie terenu różnymi sposobami”, cel oraz organizację pracy na punktach nauczania.",[
    "Sprawdź obecność, wyposażenie i gotowość grupy.",
    "Podaj temat i cel zajęć.",
    "Omów trzy punkty nauczania: pokonywanie terenu biegiem, chyłkiem oraz nisko przy ziemi; określ czas i sposób zmiany grup.",
    "Podaj warunki bezpieczeństwa, zwracając uwagę na nierówności terenu, odstępy oraz meldowanie urazów.",
    "Podziel grupę, skieruj na punkty i wydaj polecenie rozpoczęcia szkolenia."
  ],"Przyjmuję meldunek, sprawdzam obecność, wyposażenie i gotowość grupy. Podaję temat „Pokonywanie terenu różnymi sposobami” oraz cel zajęć. Omawiam organizację na trzech punktach nauczania: pokonywanie terenu biegiem, chyłkiem oraz nisko przy ziemi, a także czas i sposób zmiany grup. Podaję warunki bezpieczeństwa — zwracam uwagę na nierówności terenu, zachowanie odstępów, wykonywanie tylko poleconych czynności i natychmiastowe meldowanie urazów. Dzielę szkolonych na grupy, kieruję ich na punkty nauczania i rozpoczynam szkolenie."),
  P023: practical("P023","Instruktaż do „Pokonywania terenu różnymi sposobami” prowadzę dyrektywnie: sam określam cały wariant organizacji i sposób pracy instruktorów.",[
    "Podaj temat, cel i organizację — np. trzy punkty: bieg, poruszanie się chyłkiem i nisko przy ziemi.",
    "Określ czas, miejsce, sposób zmian grup oraz rolę każdego instruktora.",
    "Wskaż metodę nauczania: pokaz wzorowy, pokaz z objaśnieniem, ćwiczenia i poprawianie błędów.",
    "Podaj warunki bezpieczeństwa i wymagane zabezpieczenie materiałowe.",
    "Praktycznie pokaż oczekiwany sposób realizacji punktu i zatwierdź jednolity wariant."
  ],"Jako kierownik zajęć podaję temat i cel „Pokonywania terenu różnymi sposobami” oraz narzucam konkretną organizację, na przykład trzy punkty: bieg, poruszanie się chyłkiem i nisko przy ziemi. Określam czas, miejsce, zmianę grup i zadania instruktorów. Wskazuję metodę nauczania: pokaz wzorowy, pokaz z objaśnieniem, ćwiczenia i bieżące poprawianie błędów. Omawiam warunki bezpieczeństwa i potrzebne zabezpieczenie. Następnie praktycznie pokazuję sposób realizacji wybranego punktu albo polecam to przygotowanemu instruktorowi. Na końcu ustalam jeden obowiązujący wariant."),
  P024: practical("P024","Instruktaż metodą pokazową do „Wykonywania zbiórek w miejscu” opieram na przygotowanej inscenizacji prawidłowego prowadzenia tego zagadnienia.",[
    "Podaj temat, cel i organizację instruktażu.",
    "Przygotowany instruktor pokazuje sposób prowadzenia zagadnienia „Wykonywanie zbiórek w miejscu” zgodnie z Regulaminem Musztry.",
    "Pozostali obserwują ustawienie instruktora, wydawanie komend, organizację szkolonych i sposób korygowania ustawienia szyku.",
    "Po pokazie omów kolejno prawidłowe elementy oraz zauważone błędy.",
    "Na końcu ustal jednolity wariant prowadzenia zajęć i poleć przenieść go do planów pracy."
  ],"Podaję temat i cel instruktażu. W metodzie pokazowej przygotowany wcześniej instruktor przeprowadza wzorową inscenizację zagadnienia „Wykonywanie zbiórek w miejscu” zgodnie z Regulaminem Musztry. Pozostali instruktorzy obserwują jego ustawienie, sposób podawania komend, organizację szkolonych i korygowanie ustawienia szyku. Po pokazie omawiamy kolejno wykonane czynności, wskazuję elementy prawidłowe i błędy. Na końcu jako kierownik ustalam jeden obowiązujący wariant prowadzenia tego punktu i polecam ująć go w planach pracy instruktorów."),
  P025: practical("P025","W metodzie kolegialnej dla tematu „Przyjmowanie postawy strzeleckiej leżąc” najpierw określam ramy, a rozwiązanie sposobu nauczania wypracowuję wspólnie z instruktorami.",[
    "Podaj temat, cel, czas, miejsce i warunki bezpieczeństwa.",
    "Poproś instruktorów o przedstawienie własnego sposobu nauczania postawy leżącej.",
    "Porównaj propozycje dotyczące pokazu, podziału czynności na etapy, ćwiczeń oraz sposobu poprawiania błędów.",
    "Ustal obowiązkowe elementy bezpieczeństwa — przede wszystkim stałą kontrolę kierunku broni podczas ćwiczenia.",
    "Podsumuj dyskusję i zatwierdź wspólnie wypracowany wariant prowadzenia punktu."
  ],"Podaję temat, cel, czas, miejsce i najważniejsze warunki bezpieczeństwa. Następnie proszę instruktorów o przedstawienie własnych sposobów nauczania przyjmowania postawy strzeleckiej leżąc. Wspólnie porównujemy, jak przeprowadzić pokaz, czy dzielić czynność na etapy, jak organizować ćwiczenia i w jaki sposób poprawiać błędy. Niezależnie od wariantu jako obowiązkowy element wskazuję stałą kontrolę kierunku broni i bezpieczne prowadzenie ćwiczeń. Po dyskusji porządkuję wnioski i zatwierdzam jeden wspólnie wypracowany sposób prowadzenia punktu nauczania."),
  P026: koniecMusztry("P026"),
  P027: koniecStrzelania("P027","karabinka MSBS GROT"),
  P028: wstepStrzelania("P028","pistoletu VIS-100"),
  P029: practical("P029","Podaję temat „Budowa pistoletu VIS-100”, cel i prowadzę zajęcia od pokazania całej broni do omówienia jej głównych zespołów.",[
    "Podaj temat i cel: nauczyć rozpoznawania budowy i głównych zespołów VIS-100.",
    "Wykonaj wzorową prezentację pistoletu z zachowaniem warunków bezpieczeństwa.",
    "W pokazie z objaśnieniem omawiaj główne zespoły VIS-100 na podstawie egzemplarza szkoleniowego, instrukcji lub zatwierdzonej planszy — nie P-83.",
    "Sprawdź wiedzę szkolonych przez wskazywanie i nazywanie elementów; poprawiaj błędy na bieżąco.",
    "Podsumuj i określ przygotowanie do rozkładania oraz składania VIS-100."
  ],"Podaję temat „Budowa pistoletu VIS-100” i cel — nauczyć szkolonych rozpoznawania jego głównych zespołów. Najpierw pokazuję cały pistolet z zachowaniem warunków bezpieczeństwa. Następnie korzystam z egzemplarza szkoleniowego, instrukcji lub zatwierdzonej planszy i omawiam kolejno główne zespoły VIS-100 oraz ich przeznaczenie. Po objaśnieniu sprawdzam wiedzę przez wskazywanie elementów i polecenie ich nazwania. Błędy poprawiam od razu. Kończę podsumowaniem i określam przygotowanie do kolejnego zagadnienia — częściowego rozkładania i składania VIS-100."),
  P030: practical("P030","Wytyczne dotyczą „Rzutu granatem ćwiczebnym” — od początku utrzymuję ten temat i organizuję szkolenie zgodnie z programem oraz zasadami bezpieczeństwa.",[
    "Podaj temat, cel, termin i miejsce zajęć zgodnie z planem.",
    "Określ punkty nauczania: technika rzutu ćwiczebnego, czynności przygotowawcze, trening oraz warunki bezpieczeństwa.",
    "Poleć instruktorom przygotowanie planów pracy i zapoznanie się z aktualnym programem strzelań.",
    "Wyznacz osobę odpowiedzialną za wydawanie i rozliczenie środków ćwiczebnych oraz zabezpieczenie medyczne.",
    "Podkreśl wykonywanie czynności wyłącznie na komendę i pod nadzorem instruktora."
  ],"Podaję temat „Rzut granatem ćwiczebnym”, cel, termin i miejsce szkolenia. Ustalam punkty nauczania obejmujące technikę rzutu, czynności przygotowawcze, trening oraz warunki bezpieczeństwa. Instruktorom polecam przygotowanie planów pracy zgodnie z aktualnym programem strzelań. Wyznaczam osobę odpowiedzialną za wydawanie i rozliczenie środków ćwiczebnych oraz zabezpieczenie medyczne. Najważniejsze: wszystkie czynności wykonywane są na komendę, pod bezpośrednim nadzorem instruktora i z zachowaniem ustalonych stref bezpieczeństwa."),
  P031: dyrektywna("P031"),
  P032: practical("P032","Podaję temat „Oddawanie honorów w miejscu i w marszu w nakryciu głowy”, cel, a następnie prezentuję oba warianty zgodnie z Regulaminem Musztry.",[
    "Podaj temat i cel zajęć.",
    "Wykonaj wzorowy pokaz oddawania honorów w miejscu, a następnie w marszu.",
    "W pokazie z objaśnieniem zwróć uwagę na postawę, zwrot głowy, prawidłowe ułożenie prawej ręki przy nakryciu głowy oraz zachowanie rytmu marszu.",
    "Przećwicz elementy, następnie oba warianty całością; poprawiaj błędy natychmiast.",
    "Zakończ omówieniem typowych błędów i sposobów ich usunięcia."
  ],"Podaję temat i cel: nauczyć prawidłowego oddawania honorów w miejscu i w marszu w nakryciu głowy. Najpierw pokazuję wzorowo oba warianty. W pokazie z objaśnieniem zwracam uwagę na postawę, zwrot głowy w stronę przełożonego, prawidłowe ułożenie prawej ręki przy nakryciu głowy oraz — w marszu — utrzymanie właściwego rytmu i sylwetki. Następnie ćwiczymy elementy, a później całość do pełnego opanowania. Błędy koryguję od razu. Kończę krótkim omówieniem najczęstszych uchybień."),
  P033: zwroty("P033"),
  P034: practical("P034","Rozpoczynam od zachowania warunków bezpieczeństwa i sprawdzenia, czy karabinek MSBS GROT jest rozładowany.",[
    "Sprawdź rozładowanie broni i zachowuj bezpieczny kierunek.",
    "Rozłóż węzeł gazowy.",
    "Odłącz zespół kolby oraz wyjmij urządzenie powrotne i suwadło z zamkiem.",
    "Nazwij oddzielone części: zespół kolby, urządzenie powrotne, suwadło z zamkiem, regulator i tłok gazowy.",
    "Złóż karabinek w odwrotnej kolejności i sprawdź poprawność złożenia bez amunicji."
  ],"Rozpoczynam od zachowania warunków bezpieczeństwa i sprawdzenia rozładowania broni. Następnie rozkładam węzeł gazowy, odłączam zespół kolby oraz wyjmuję urządzenie powrotne i suwadło z zamkiem. Po rozłożeniu nazywam główne oddzielone elementy: zespół kolby, urządzenie powrotne, suwadło z zamkiem, regulator gazowy i tłok gazowy. Składanie wykonuję w odwrotnej kolejności. Po zakończeniu sprawdzam prawidłowość złożenia i współdziałanie mechanizmów bez użycia amunicji."),
  P035: practical("P035","Kieruję VIS-100 w bezpiecznym kierunku, trzymam palec poza językiem spustowym i rozpoczynam od sprawdzenia rozładowania.",[
    "Odłącz magazynek i sprawdź komorę nabojową.",
    "Ustaw dźwignię do rozkładania zgodnie z procedurą i zsuń zamek z chwytu.",
    "Wyjmij zespół sprężyny powrotnej oraz lufę.",
    "Nazwij główne części: zamek, lufa, zespół sprężyny powrotnej, chwyt i magazynek.",
    "Złóż pistolet w odwrotnej kolejności i sprawdź poprawność działania bez amunicji."
  ],"Najpierw zachowuję warunki bezpieczeństwa: broń kieruję w bezpiecznym kierunku, palec trzymam poza językiem spustowym, odłączam magazynek i sprawdzam komorę nabojową. Następnie ustawiam dźwignię do rozkładania zgodnie z procedurą i zsuwam zamek z chwytu. Wyjmuję zespół sprężyny powrotnej i lufę. Nazywam główne części: zamek, lufa, zespół sprężyny powrotnej, chwyt i magazynek. Składanie wykonuję w odwrotnej kolejności, a na końcu sprawdzam prawidłowość złożenia i działanie mechanizmów bez amunicji."),
  P036: practical("P036","Rozpoczynam od warunków bezpieczeństwa, odłączenia magazynka i sprawdzenia komory nabojowej karabinka MSBS GROT.",[
    "Sprawdź rozładowanie broni i utrzymuj bezpieczny kierunek.",
    "Rozłóż węzeł gazowy: regulator i tłok gazowy.",
    "Odłącz zespół kolby oraz wyjmij mechanizm powrotny i suwadło z zamkiem.",
    "Nazwij główne oddzielone zespoły i części.",
    "Złóż broń w odwrotnej kolejności i wykonaj kontrolę poprawności złożenia bez amunicji."
  ],"Rozpoczynam od zachowania warunków bezpieczeństwa, odłączam magazynek i sprawdzam komorę nabojową. Następnie rozkładam węzeł gazowy, wyjmując regulator i tłok, odłączam zespół kolby oraz wyjmuję mechanizm powrotny i suwadło z zamkiem. Nazywam główne oddzielone elementy. Składanie wykonuję w odwrotnej kolejności i zwracam uwagę na prawidłowe osadzenie wszystkich zespołów. Na końcu sprawdzam poprawność złożenia i współdziałanie mechanizmów bez użycia amunicji.")
};

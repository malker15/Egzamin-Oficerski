import type { Stage2AnswerOverride } from "./answerOverrides";

export type Stage2PdfAnswerOverride = Stage2AnswerOverride & {
  category?: string;
};

// Odpowiedzi uzupełniające/podmieniające tylko tam, gdzie stara baza Etapu II
// nie odpowiadała nowemu arkuszowi 1-40 albo wymagała aktualizacji faktów.
// Forma: krótka odpowiedź ustna, bez dopisywania niepewnych szczegółów.
export const STAGE2_PDF_ANSWER_OVERRIDES: Record<string, Stage2PdfAnswerOverride> = {
  germanExtermination: {
    category: "Historia II wojny światowej",
    keyPoints: [
      "Obozy koncentracyjne i miejsca masowej zagłady oraz wyniszczenia, m.in. Auschwitz-Birkenau i Stutthof.",
      "Miejsca masowych egzekucji ludności polskiej, m.in. Palmiry i Piaśnica.",
      "Więzienia i areszty terroru okupacyjnego, np. Pawiak, Zamek Lubelski i Montelupich.",
      "Pacyfikacje miejscowości i wysiedlenia, m.in. Michniów oraz Zamojszczyzna."
    ],
    fullAnswer: "Odpowiedź:\nEksterminacja ludności polskiej pod okupacją niemiecką odbywała się w obozach, więzieniach, miejscach masowych egzekucji oraz podczas pacyfikacji i wysiedleń. Jako przykłady można wskazać Auschwitz-Birkenau i Stutthof, Palmiry i Piaśnicę, Pawiak, Zamek Lubelski i więzienie Montelupich, a także spacyfikowany Michniów oraz Zamojszczyznę, skąd prowadzono masowe wysiedlenia ludności."
  },

  ihlUkraine: {
    category: "Międzynarodowe prawo humanitarne",
    keyPoints: [
      "Cel wojskowy to obiekt, który ze względu na charakter, położenie, przeznaczenie lub wykorzystanie skutecznie przyczynia się do działań wojskowych.",
      "Jego zniszczenie, zdobycie lub neutralizacja musi w danych okolicznościach dawać określoną korzyść wojskową.",
      "Podstawowe zasady MPH to m.in. rozróżnianie celów wojskowych i cywilnych, proporcjonalność, środki ostrożności i humanitarne traktowanie jeńców.",
      "ONZ dokumentuje poważne i liczne naruszenia po stronie rosyjskiej, a także konkretne naruszenia po stronie ukraińskiej; nie można więc twierdzić, że zasady są zawsze przestrzegane."
    ],
    fullAnswer: "Odpowiedź:\nWedług międzynarodowego prawa humanitarnego celem wojskowym jest obiekt, który ze względu na swój charakter, położenie, przeznaczenie lub wykorzystanie skutecznie przyczynia się do działań wojskowych, a jego zniszczenie, zdobycie albo neutralizacja daje w danych okolicznościach określoną korzyść wojskową. Strony konfliktu muszą stosować m.in. zasadę rozróżniania, proporcjonalności, środki ostrożności oraz humanitarnie traktować jeńców. W wojnie rosyjsko-ukraińskiej nie można powiedzieć, że zasady te są przestrzegane w każdym przypadku. Misja ONZ dokumentuje poważne i liczne naruszenia po stronie rosyjskiej, w tym dotyczące jeńców i ludności cywilnej, a także konkretne naruszenia po stronie ukraińskiej, m.in. przypadki złego traktowania rosyjskich jeńców."
  },

  copCities: {
    category: "Historia przemysłu obronnego",
    keyPoints: [
      "Radom — Fabryka Broni.",
      "Skarżysko-Kamienna — zakłady amunicyjne, obecnie MESKO.",
      "Stalowa Wola — Zakłady Południowe, obecnie Huta Stalowa Wola."
    ],
    fullAnswer: "Odpowiedź:\nTrzy miasta, które najczęściej wskazuje się w tym kontekście, to Radom, Skarżysko-Kamienna i Stalowa Wola. W Radomiu działa Fabryka Broni, w Skarżysku-Kamiennej zakłady MESKO wywodzące się z przedwojennej Państwowej Fabryki Amunicji, a w Stalowej Woli Huta Stalowa Wola, której poprzednikiem były zbudowane w ramach COP Zakłady Południowe. Zakłady w Skarżysku i Radomiu są starsze od formalnego programu COP, natomiast funkcjonowały w przedwojennym systemie przemysłu obronnego tego regionu."
  },

  interwarAircraft: {
    category: "Historia Szkoły Orląt",
    keyPoints: [
      "RWD-8 — podstawowy samolot szkolny.",
      "PWS-26 — samolot szkolno-treningowy używany do dalszego szkolenia."
    ],
    fullAnswer: "Odpowiedź:\nDwa typy samolotów, na których szkolono podchorążych w Dęblinie w okresie międzywojennym, to RWD-8 oraz PWS-26. RWD-8 służył głównie do szkolenia podstawowego, a PWS-26 do bardziej zaawansowanego szkolenia i treningu pilotażowego."
  },

  aces: {
    category: "Historia lotnictwa",
    keyPoints: [
      "Stanisław Skalski.",
      "Witold Urbanowicz.",
      "Jan Zumbach.",
      "As lotnictwa — pilot myśliwski, któremu przypisano co najmniej 5 potwierdzonych zwycięstw powietrznych."
    ],
    fullAnswer: "Odpowiedź:\nJako trzech znanych polskich asów lotnictwa z II wojny światowej można wskazać Stanisława Skalskiego, Witolda Urbanowicza i Jana Zumbacha. Określenie „as lotnictwa” stosuje się umownie wobec pilota myśliwskiego, któremu zaliczono co najmniej pięć potwierdzonych zwycięstw powietrznych."
  },

  sovietExtermination: {
    category: "Historia II wojny światowej",
    keyPoints: [
      "Po agresji ZSRR na Polskę w 1939 r. nastąpiły masowe aresztowania i represje NKWD wobec obywateli polskich.",
      "Prowadzono deportacje w głąb ZSRR i kierowano ludzi do więzień, łagrów oraz pracy przymusowej.",
      "Symbolem zbrodni jest zbrodnia katyńska z 1940 r. — zamordowanie tysięcy polskich oficerów i przedstawicieli elit.",
      "Represje obejmowały również egzekucje więźniów, przymusowe przesiedlenia i zwalczanie polskich struktur państwowych i społecznych."
    ],
    fullAnswer: "Odpowiedź:\nEksterminacja i represje wobec obywateli polskich ze strony Związku Sowieckiego po agresji z 17 września 1939 r. obejmowały masowe aresztowania przez NKWD, deportacje w głąb ZSRR, osadzanie w więzieniach i łagrach oraz pracę przymusową. Najbardziej znanym przykładem jest zbrodnia katyńska z 1940 r., w której zamordowano tysiące polskich oficerów i przedstawicieli elit. Dochodziło także do egzekucji więźniów i innych represji wymierzonych w polskie struktury państwowe, wojskowe i społeczne."
  },

  nato: {
    category: "Bezpieczeństwo międzynarodowe",
    keyPoints: [
      "Polska została członkiem NATO 12 marca 1999 r.",
      "Podstawą Sojuszu jest kolektywna obrona — atak na jednego sojusznika jest traktowany jako atak na wszystkich.",
      "NATO służy odstraszaniu i obronie, konsultacjom polityczno-wojskowym oraz wzmacnianiu bezpieczeństwa państw członkowskich.",
      "Sojusz prowadzi także działania z zakresu zapobiegania kryzysom i bezpieczeństwa kooperacyjnego."
    ],
    fullAnswer: "Odpowiedź:\nPolska przystąpiła do NATO 12 marca 1999 roku. Głównym celem Sojuszu jest zapewnienie bezpieczeństwa państw członkowskich poprzez odstraszanie i kolektywną obronę. Kluczową zasadą jest art. 5 Traktatu Północnoatlantyckiego — zbrojny atak na jednego członka jest traktowany jako atak na wszystkich. NATO służy również konsultacjom politycznym i wojskowym, zapobieganiu kryzysom oraz współpracy na rzecz stabilności i bezpieczeństwa."
  },

  belarus: {
    category: "Siły zbrojne państw obcych",
    keyPoints: [
      "Główne elementy to wojska lądowe, siły powietrzne i obrony powietrznej oraz wojska operacji specjalnych.",
      "Siły Zbrojne Białorusi są silnie zintegrowane z rosyjskim systemem wojskowym, m.in. przez wspólne struktury, szkolenie i obronę powietrzną.",
      "W hipotetycznym konflikcie Rosja–NATO możliwe role obejmowałyby ochronę własnego terytorium, logistykę, transport, bazowanie, obronę powietrzną i działanie w strukturach zgrupowania z Rosją.",
      "Zakres bezpośredniego użycia bojowego zależałby od decyzji politycznych i rozwoju sytuacji — nie należy przedstawiać go jako pewnika."
    ],
    fullAnswer: "Odpowiedź:\nSiły Zbrojne Republiki Białorusi obejmują przede wszystkim wojska lądowe, siły powietrzne i obrony powietrznej oraz wojska operacji specjalnych. Ich ważną cechą jest bardzo ścisła współpraca i integracja wojskowa z Rosją, m.in. w ramach wspólnego szkolenia, Regionalnego Zgrupowania Wojsk i systemu obrony powietrznej. W hipotetycznym konflikcie Rosja–NATO Białoruś mogłaby pełnić role związane z ochroną własnego terytorium, logistyką, transportem, bazowaniem i obroną powietrzną oraz działać w ramach wspólnych struktur z Rosją. Bezpośrednie użycie bojowe białoruskich wojsk zależałoby jednak od decyzji politycznych i konkretnej sytuacji, więc nie można go przesądzać."
  },

  aviation1939: {
    category: "Historia lotnictwa",
    keyPoints: [
      "Myśliwce: PZL P.11 oraz starsze PZL P.7.",
      "Bombowce: PZL.37 Łoś.",
      "Lekkie bombowce i samoloty rozpoznawcze: PZL.23 Karaś.",
      "W lotnictwie obserwacyjnym i łącznikowym używano również m.in. Lublin R-XIII."
    ],
    fullAnswer: "Odpowiedź:\nWe wrześniu 1939 roku polskie lotnictwo wojskowe dysponowało przede wszystkim myśliwcami PZL P.11 i PZL P.7, bombowcami PZL.37 Łoś oraz lekkimi bombowcami i samolotami rozpoznawczymi PZL.23 Karaś. W jednostkach obserwacyjnych i łącznikowych używano także m.in. samolotów Lublin R-XIII."
  },

  battles1939: {
    category: "Kampania polska 1939",
    keyPoints: [
      "Westerplatte i Mokra — początek kampanii.",
      "Mława i Wizna — ważne walki obronne na północy i północnym wschodzie.",
      "Bitwa nad Bzurą — 9–22 września, największa bitwa kampanii.",
      "Obrona Warszawy i Helu.",
      "Kock — 2–6 października, ostatnia duża bitwa regularnego Wojska Polskiego."
    ],
    fullAnswer: "Odpowiedź:\nDo głównych bitew i walk wojny obronnej 1939 roku zalicza się obronę Westerplatte, bitwę pod Mokrą, bitwę pod Mławą, walki pod Wizną, bitwę nad Bzurą — największą bitwę kampanii — obronę Warszawy i Helu oraz bitwę pod Kockiem, która była ostatnią dużą bitwą regularnego Wojska Polskiego w kampanii."
  },

  russia: {
    category: "Siły zbrojne państw obcych",
    keyPoints: [
      "Trzon Sił Zbrojnych FR stanowią Wojska Lądowe, Siły Powietrzno-Kosmiczne i Marynarka Wojenna; ważną rolę mają też Wojska Rakietowe Przeznaczenia Strategicznego i Wojska Powietrznodesantowe.",
      "W wojnie przeciw Ukrainie Rosja wykorzystuje połączone działania wojsk lądowych, artylerii, lotnictwa, rakiet i bezzałogowców.",
      "Duże znaczenie mają walka radioelektroniczna, obrona powietrzna, rozpoznanie oraz uderzenia na zaplecze i logistykę.",
      "Konflikt ma charakter długotrwałej wojny o dużej intensywności; rosyjskie siły w toku wojny zmieniają organizację i sposoby użycia, zwłaszcza dronów."
    ],
    fullAnswer: "Odpowiedź:\nSiły Zbrojne Federacji Rosyjskiej obejmują przede wszystkim Wojska Lądowe, Siły Powietrzno-Kosmiczne i Marynarkę Wojenną, a także m.in. Wojska Rakietowe Przeznaczenia Strategicznego i Wojska Powietrznodesantowe. W wojnie przeciw Ukrainie Rosja wykorzystuje szeroko artylerię, wojska lądowe, lotnictwo, pociski rakietowe i bezzałogowce, a także walkę radioelektroniczną i rozbudowaną obronę powietrzną. Ważnym elementem są uderzenia na zaplecze i logistykę oraz ciągłe rozpoznanie. Wojna pokazuje również stałą adaptację organizacji i taktyki, szczególnie w zakresie masowego użycia dronów i środków walki elektronicznej."
  },

  disciplinary: {
    category: "Prawo i dyscyplina wojskowa",
    keyPoints: [
      "Podstawą jest ustawa z 11 marca 2022 r. o obronie Ojczyzny — aktualny tekst jednolity Dz.U. 2025 poz. 825.",
      "Wszczęcie postępowania dyscyplinarnego następuje w drodze postanowienia, którego odpis doręcza się obwinionemu.",
      "Rzecznik dyscyplinarny prowadzi postępowanie dowodowe; obwiniony ma prawo do obrony, składania wyjaśnień i zapoznania się z materiałem sprawy.",
      "Po zakończeniu postępowania dowodowego sprawę rozstrzyga właściwy przełożony dyscyplinarny; przewidziane są środki odwoławcze.",
      "Dokumentację regulują m.in. dwa rozporządzenia MON z 12 września 2024 r. — Dz.U. poz. 1532 i 1533."
    ],
    fullAnswer: "Odpowiedź:\nPostępowanie dyscyplinarne żołnierza prowadzi się przede wszystkim na podstawie ustawy z 11 marca 2022 r. o obronie Ojczyzny, obecnie w tekście jednolitym ogłoszonym w Dz.U. z 2025 r. poz. 825. Po uzyskaniu informacji o możliwym przewinieniu właściwy przełożony dyscyplinarny ocenia sprawę, a wszczęcie postępowania następuje w drodze postanowienia doręczanego obwinionemu. Postępowanie dowodowe prowadzi rzecznik dyscyplinarny, z zachowaniem prawa obwinionego do obrony, składania wyjaśnień i zapoznania się z materiałem. Po jego zakończeniu właściwy przełożony wydaje rozstrzygnięcie, od którego przysługują środki przewidziane w ustawie. W zakresie dokumentacji stosuje się także rozporządzenia MON z 12 września 2024 r. — Dz.U. poz. 1532 i 1533."
  },

  battleBritainSquadrons: {
    category: "Historia lotnictwa",
    keyPoints: [
      "Dywizjon 302 „Poznański”.",
      "Dywizjon 303 „Warszawski” im. Tadeusza Kościuszki.",
      "Szczególnie Dywizjon 303 należał do najskuteczniejszych jednostek myśliwskich podczas Bitwy o Anglię."
    ],
    fullAnswer: "Odpowiedź:\nChodzi o polskie dywizjony myśliwskie nr 302 i 303. Dywizjon 302 nosił nazwę „Poznański”, a Dywizjon 303 — „Warszawski” im. Tadeusza Kościuszki. Szczególnie Dywizjon 303 zasłynął bardzo wysoką liczbą zwycięstw powietrznych podczas Bitwy o Anglię."
  }
};

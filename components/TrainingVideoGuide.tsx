"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

type VideoItem = {
  title: string;
  source: string;
  embedUrl: string;
  externalUrl: string;
  note: string;
};

const introDrill: VideoItem = {
  title: "Postawa zasadnicza, swobodna i zwroty w miejscu",
  source: "Paweł Żygliński — nauka musztry",
  embedUrl: "https://www.youtube-nocookie.com/embed/tBKWCBdmt9c",
  externalUrl: "https://www.youtube.com/watch?v=tBKWCBdmt9c",
  note: "Polski materiał instruktażowy. Porównuj wykonanie z dokładną treścią zagadnienia w aplikacji.",
};

const marchDrill: VideoItem = {
  title: "Zwroty oraz marsz",
  source: "Szósta KDH Źródło",
  embedUrl: "https://www.youtube-nocookie.com/embed/vcDannTh46k",
  externalUrl: "https://www.youtube.com/watch?v=vcDannTh46k",
  note: "Materiał pomocniczy do zwrotów, marszu i pracy na komendę. Szczegóły wykonuj według treści aplikacji.",
};

const rifleDrill: VideoItem = {
  title: "Musztra paradna z bronią — Kompania Reprezentacyjna WP",
  source: "pokaz Wojska Polskiego",
  embedUrl: "https://www.youtube-nocookie.com/embed/JBR9T7rktK4",
  externalUrl: "https://www.youtube.com/watch?v=JBR9T7rktK4",
  note: "Podgląd płynności i pracy z bronią, nie instruktaż konkretnych chwytów. Kolejność chwytów ucz się z treści zagadnienia.",
};

const honorsDrill: VideoItem = {
  title: "Salutowanie i oddawanie honorów",
  source: "szer. Kukuła",
  embedUrl: "https://www.youtube-nocookie.com/embed/U6VVS8sik5w",
  externalUrl: "https://www.youtube.com/watch?v=U6VVS8sik5w",
  note: "Materiał pomocniczy dotyczący oddawania honorów. Wariant w miejscu i w marszu porównuj z regulaminową treścią w aplikacji.",
};

const teamDrill: VideoItem = {
  title: "Wojewódzki konkurs musztry — praca całej drużyny",
  source: "IMPERIUM Media / przegląd musztry 2026",
  embedUrl: "https://www.youtube-nocookie.com/embed/23T5RNThvzE",
  externalUrl: "https://www.youtube.com/watch?v=23T5RNThvzE",
  note: "Materiał zbiorczy: obserwuj ustawienie, synchronizację, tempo, reakcję na komendy i pracę dowódcy. Dokładną sekwencję danego zagadnienia wykonuj według aplikacji.",
};

const aar: VideoItem = {
  title: "Jak prowadzić dobry AAR",
  source: "U.S. Army / National Training Center",
  embedUrl: "https://www.dvidshub.net/video/embed/935939",
  externalUrl: "https://www.dvidshub.net/video/935939/tac-talks-ep14-what-makes-great-aar",
  note: "Materiał pomocniczy o After Action Review. AAR jest wspólnym zakończeniem zadań Pętli.",
};

const stage3Videos: Record<string, VideoItem[]> = {
  "Postawa zasadnicza i postawy swobodne": [introDrill],
  "Zwroty": [introDrill, marchDrill],
  "Marsz krokiem zwykłym i defiladowym": [marchDrill],
  "Bieg i zatrzymanie": [marchDrill],
  "Chwyt karabinkiem „przez pierś”, „przez plecy”, „na pas”": [rifleDrill],
  "Chwyt karabinkiem „połóż broń” i „za broń”": [rifleDrill],
  "Oddawanie honorów w miejscu w nakryciu i bez nakrycia głowy": [honorsDrill],
  "Oddawanie honorów w marszu w nakryciu głowy przez salutowanie, bez nakrycia głowy oraz podczas wyprzedzania": [honorsDrill],
  "Występowanie z ugrupowania rozwiniętego (szereg, dwuszereg) oraz marszowego (kolumny dwójkowej) w miejscu i w marszu": [teamDrill],
  "Wykonywanie zbiórek w szeregu, dwuszeregu przy sobie i w nakazanym miejscu": [teamDrill],
  "Wykonywanie zbiórek w rzędzie i kolumnie dwójkowej w miejscu i w marszu": [teamDrill],
  "Formowanie kolumny dwójkowej z szeregu i odwrotnie": [teamDrill],
  "Formowanie kolumny dwójkowej z rzędu i odwrotnie w marszu": [teamDrill],
  "Odliczanie": [teamDrill],
  "Równanie i krycie": [teamDrill],
  "Zmiana frontu ugrupowania rozwiniętego przez zachodzenie": [teamDrill],
  "Odstępowanie i łączenie": [teamDrill],
  "Przesunięcie szyku": [teamDrill],
  "Zaginanie i odginanie skrzydeł": [teamDrill],
  "Formowanie kolumny czwórkowej z dwuszeregu i odwrotnie oraz występowanie": [teamDrill],
  "Przechodzenie z trójszeregu w kolumnę trójkową i odwrotnie oraz występowanie": [teamDrill],
  "Zachowanie się żołnierzy w szyku": [teamDrill, honorsDrill],
};

const stage4Videos: Record<string, VideoItem[]> = {
  "Dowodzenie podczas wykonywania procedury 5-25 oraz 5xC": [
    {
      title: "Reakcja pododdziału na zdarzenie IED",
      source: "U.S. Army / 5th Special Forces Group",
      embedUrl: "https://www.dvidshub.net/video/embed/790169",
      externalUrl: "https://www.dvidshub.net/video/790169/mass-casualty-event-and-react-ied",
      note: "Materiał pomocniczy pokazujący reakcję na IED. Nie zastępuje dokładnej polskiej procedury 5-25 / 5xC wymaganej na egzaminie.",
    },
    aar,
  ],
  "Dowodzenie podczas dostarczenia zaopatrzenia dla walczącego pododdziału": [
    {
      title: "Convoy operations — misja zaopatrzeniowa",
      source: "U.S. Marines / BALTOPS 24",
      embedUrl: "https://www.dvidshub.net/video/embed/928160",
      externalUrl: "https://www.dvidshub.net/video/928160/clb-8-convoy-operations-hms-trosso-resupply",
      note: "Materiał pomocniczy do organizacji konwoju, dostarczenia zaopatrzenia i zabezpieczenia działania.",
    },
    aar,
  ],
  "Dowodzenie, orientowanie taktyczne i topograficzne, kodowanie terenu, wskazywanie dozorów (OKD)": [
    {
      title: "Orientowanie mapy przy użyciu busoli / kompasu",
      source: "U.S. Army — Soldier’s Manual of Common Tasks",
      embedUrl: "https://www.dvidshub.net/video/embed/1003331",
      externalUrl: "https://www.dvidshub.net/video/1003331/smct-orient-map-using-lensatic-compass",
      note: "Dobry podgląd pracy z mapą i kompasem. Kodowanie terenu i wskazywanie dozorów wykonuj zgodnie z materiałem egzaminacyjnym.",
    },
    aar,
  ],
  "Dowodzenie podczas rozpoznania przeciwnika i wywołania ognia artylerii (CFF)": [
    {
      title: "Call for Fire — trening praktyczny",
      source: "U.S. Army / 2nd Cavalry Regiment",
      embedUrl: "https://www.dvidshub.net/video/embed/877371",
      externalUrl: "https://www.dvidshub.net/video/877371/2cr-call-fire-training-tsc-grafenwoehr",
      note: "Materiał pomocniczy z amerykańskiego treningu CFF. Nie traktuj jego terminologii jako zamiennika meldunku wymaganego przez polski materiał szkoleniowy.",
    },
    aar,
  ],
  "Dowodzenie podczas rozpoznania terenu skażonego": [
    {
      title: "CBRN Reconnaissance Platoon — rozpoznanie skażenia",
      source: "U.S. Army / 173rd Airborne Brigade",
      embedUrl: "https://www.dvidshub.net/video/embed/819830",
      externalUrl: "https://www.dvidshub.net/video/819830/bayonet-ready-22-cbrn-reconnaissance-platoon",
      note: "Materiał pomocniczy pokazujący organizację rozpoznania CBRN i pracę w rejonie skażonym. Szczegółowe procedury OPBMR pozostają zgodne z Twoim materiałem szkoleniowym.",
    },
    aar,
  ],
  "Dowodzenie podczas ewakuacji rannego": [
    {
      title: "DUSTOFF — trening 9-line MEDEVAC",
      source: "U.S. Army / 82nd Airborne Division",
      embedUrl: "https://www.dvidshub.net/video/embed/923203",
      externalUrl: "https://www.dvidshub.net/video/923203/dustoff-medevac-training",
      note: "Materiał pomocniczy do organizacji MEDEVAC i pracy zespołu. Dokładną treść meldunków i czynności wykonuj według materiału obowiązującego na egzaminie.",
    },
    aar,
  ],
  "Dowodzenie pododdziałem podczas prowadzenia marszu taktycznego": [
    {
      title: "Squad movement formations and movement techniques",
      source: "U.S. Army — materiał szkoleniowy",
      embedUrl: "https://www.dvidshub.net/video/embed/1003646",
      externalUrl: "https://www.dvidshub.net/video/1003646/squad-movement-formations-and-squad-movement-techniques",
      note: "Materiał pomocniczy do ugrupowania, przemieszczania i kontroli zespołu w marszu. Nie zastępuje scenariusza i kryteriów Pętli.",
    },
    aar,
  ],
};

function VideoCard({ item }: { item: VideoItem }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#3f4b39] bg-[#0b0e0a]">
      <div className="aspect-video w-full bg-black">
        <iframe
          src={item.embedUrl}
          title={item.title}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <div className="text-sm font-black text-white">{item.title}</div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#78866f]">{item.source}</div>
        <p className="mt-2 text-xs leading-5 text-[#929b8b]">{item.note}</p>
        <a href={item.externalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-[#c4d0b8] underline underline-offset-4">
          Otwórz film w nowej karcie ↗
        </a>
      </div>
    </div>
  );
}

export default function TrainingVideoGuide() {
  const pathname = usePathname();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [matchKey, setMatchKey] = useState("");
  const [items, setItems] = useState<VideoItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/stage3") && !pathname.startsWith("/stage4")) {
      setTarget(null);
      setMatchKey("");
      setItems([]);
      return;
    }

    let frame = 0;
    const locate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let heading: HTMLElement | undefined;
        let foundItems: VideoItem[] | undefined;
        let key = "";

        if (pathname.startsWith("/stage3")) {
          const pageText = document.body.innerText;
          const learningView = pageText.includes("Pełna odpowiedź") || pageText.includes("Aktualny blok");
          if (learningView) {
            for (const el of Array.from(document.querySelectorAll<HTMLElement>("h1"))) {
              const title = el.textContent?.trim() ?? "";
              if (stage3Videos[title]) {
                heading = el;
                foundItems = stage3Videos[title];
                key = `stage3:${title}`;
                break;
              }
            }
          }
        } else {
          const hasStationControls = Array.from(document.querySelectorAll("button")).some(
            (button) => button.textContent?.includes("Trening bez podpowiedzi")
          );
          if (hasStationControls) {
            for (const el of Array.from(document.querySelectorAll<HTMLElement>("h2"))) {
              const title = el.textContent?.trim() ?? "";
              if (stage4Videos[title]) {
                heading = el;
                foundItems = stage4Videos[title];
                key = `stage4:${title}`;
                break;
              }
            }
          }
        }

        const nextTarget = heading?.parentElement ?? null;
        setTarget((prev) => (prev === nextTarget ? prev : nextTarget));
        setMatchKey((prev) => (prev === key ? prev : key));
        setItems(foundItems ?? []);
      });
    };

    locate();
    const observer = new MutationObserver(locate);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [matchKey]);

  if (!target || !items.length) return null;

  return createPortal(
    <div className="mt-4 rounded-2xl border border-[#53614a] bg-[#141a12]/95 p-3 sm:p-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-[#9caf8d]">Materiał wideo</div>
          <div className="mt-1 text-sm font-bold text-white">▶ Zobacz wykonanie</div>
        </div>
        <span className="rounded-lg border border-[#4a5743] bg-[#0b0e0a] px-2.5 py-1.5 text-xs font-black text-[#b9c7ad]">{open ? "Zwiń" : `${items.length} ${items.length === 1 ? "film" : "filmy"}`}</span>
      </button>

      {open && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {items.map((item) => <VideoCard key={item.embedUrl} item={item} />)}
        </div>
      )}
    </div>,
    target
  );
}

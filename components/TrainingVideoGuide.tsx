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
  source: "materiał szkoleniowy",
  embedUrl: "https://www.youtube-nocookie.com/embed/U6VVS8sik5w",
  externalUrl: "https://www.youtube.com/watch?v=U6VVS8sik5w",
  note: "Materiał pomocniczy dotyczący oddawania honorów. Wariant w miejscu i w marszu porównuj z regulaminową treścią w aplikacji.",
};

const teamDrill: VideoItem = {
  title: "Praca całej drużyny podczas musztry",
  source: "pokaz musztry zespołowej",
  embedUrl: "https://www.youtube-nocookie.com/embed/23T5RNThvzE",
  externalUrl: "https://www.youtube.com/watch?v=23T5RNThvzE",
  note: "Materiał zbiorczy: obserwuj ustawienie, synchronizację, tempo, reakcję na komendy i pracę dowódcy. Dokładną sekwencję danego zagadnienia wykonuj według aplikacji.",
};


const stage3VideosByNumber: Record<number, VideoItem[]> = {
  1: [introDrill],
  2: [introDrill, marchDrill],
  3: [marchDrill],
  4: [marchDrill],
  5: [rifleDrill],
  6: [rifleDrill],
  7: [honorsDrill],
  8: [honorsDrill],
  9: [teamDrill],
  10: [teamDrill],
  11: [teamDrill],
  12: [teamDrill],
  13: [teamDrill],
  14: [teamDrill],
  15: [teamDrill],
  16: [teamDrill],
  17: [teamDrill],
  18: [teamDrill],
  19: [teamDrill],
  20: [teamDrill],
  21: [teamDrill],
  22: [teamDrill, honorsDrill],
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
  ],
  "Dowodzenie podczas dostarczenia zaopatrzenia dla walczącego pododdziału": [
    {
      title: "Convoy operations — misja zaopatrzeniowa",
      source: "U.S. Marines / BALTOPS 24",
      embedUrl: "https://www.dvidshub.net/video/embed/928160",
      externalUrl: "https://www.dvidshub.net/video/928160/clb-8-convoy-operations-hms-trosso-resupply",
      note: "Materiał pomocniczy do organizacji konwoju, dostarczenia zaopatrzenia i zabezpieczenia działania.",
    },
  ],
  "Dowodzenie, orientowanie taktyczne i topograficzne, kodowanie terenu, wskazywanie dozorów (OKD)": [
    {
      title: "Orientowanie mapy przy użyciu busoli / kompasu",
      source: "U.S. Army — Soldier’s Manual of Common Tasks",
      embedUrl: "https://www.dvidshub.net/video/embed/1003331",
      externalUrl: "https://www.dvidshub.net/video/1003331/smct-orient-map-using-lensatic-compass",
      note: "Dobry podgląd pracy z mapą i kompasem. Kodowanie terenu i wskazywanie dozorów wykonuj zgodnie z materiałem egzaminacyjnym.",
    },
  ],
  "Dowodzenie podczas rozpoznania przeciwnika i wywołania ognia artylerii (CFF)": [
    {
      title: "Call for Fire — trening praktyczny",
      source: "U.S. Army / 2nd Cavalry Regiment",
      embedUrl: "https://www.dvidshub.net/video/embed/877371",
      externalUrl: "https://www.dvidshub.net/video/877371/2cr-call-fire-training-tsc-grafenwoehr",
      note: "Materiał pomocniczy z amerykańskiego treningu CFF. Nie traktuj jego terminologii jako zamiennika meldunku wymaganego przez polski materiał szkoleniowy.",
    },
  ],
  "Dowodzenie podczas rozpoznania terenu skażonego": [
    {
      title: "CBRN Reconnaissance Platoon — rozpoznanie skażenia",
      source: "U.S. Army / 173rd Airborne Brigade",
      embedUrl: "https://www.dvidshub.net/video/embed/819830",
      externalUrl: "https://www.dvidshub.net/video/819830/bayonet-ready-22-cbrn-reconnaissance-platoon",
      note: "Materiał pomocniczy pokazujący organizację rozpoznania CBRN i pracę w rejonie skażonym. Szczegółowe procedury OPBMR pozostają zgodne z Twoim materiałem szkoleniowym.",
    },
  ],
  "Dowodzenie podczas ewakuacji rannego": [
    {
      title: "DUSTOFF — trening 9-line MEDEVAC",
      source: "U.S. Army / 82nd Airborne Division",
      embedUrl: "https://www.dvidshub.net/video/embed/923203",
      externalUrl: "https://www.dvidshub.net/video/923203/dustoff-medevac-training",
      note: "Materiał pomocniczy do organizacji MEDEVAC i pracy zespołu. Dokładną treść meldunków i czynności wykonuj według materiału obowiązującego na egzaminie.",
    },
  ],
  "Dowodzenie pododdziałem podczas prowadzenia marszu taktycznego": [
    {
      title: "Squad movement formations and movement techniques",
      source: "U.S. Army — materiał szkoleniowy",
      embedUrl: "https://www.dvidshub.net/video/embed/1003646",
      externalUrl: "https://www.dvidshub.net/video/1003646/squad-movement-formations-and-squad-movement-techniques",
      note: "Materiał pomocniczy do ugrupowania, przemieszczania i kontroli zespołu w marszu. Nie zastępuje scenariusza i kryteriów Pętli.",
    },
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
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-xs font-bold text-[#c4d0b8] underline underline-offset-4"
        >
          Otwórz film w nowej karcie ↗
        </a>
      </div>
    </div>
  );
}

function findStage3Card(marker: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = marker.parentElement;
  while (node && node !== document.body) {
    if (typeof node.className === "string" && node.className.includes("rounded-[1.75rem]")) return node;
    node = node.parentElement;
  }
  return marker.parentElement;
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
        let nextTarget: HTMLElement | null = null;
        let foundItems: VideoItem[] = [];
        let key = "";

        if (pathname.startsWith("/stage3")) {
          const pageText = document.body.innerText;
          const learningView = pageText.includes("Pełna odpowiedź") || pageText.includes("Aktualny blok");

          if (learningView) {
            const markers = Array.from(document.querySelectorAll<HTMLElement>("div"));
            const marker = markers.find((el) => /^ZAGADNIENIE\s+\d+\s*\/\s*22$/i.test((el.textContent ?? "").trim()));

            if (marker) {
              const match = (marker.textContent ?? "").match(/ZAGADNIENIE\s+(\d+)/i);
              const number = match ? Number(match[1]) : 0;
              if (stage3VideosByNumber[number]) {
                foundItems = stage3VideosByNumber[number];
                key = `stage3:${number}`;
                nextTarget = findStage3Card(marker);
              }
            }
          }
        } else {
          const hasStationControls = Array.from(document.querySelectorAll("button")).some((button) =>
            button.textContent?.includes("Trening bez podpowiedzi")
          );

          if (hasStationControls) {
            for (const el of Array.from(document.querySelectorAll<HTMLElement>("h2"))) {
              const title = el.textContent?.trim() ?? "";
              if (stage4Videos[title]) {
                foundItems = stage4Videos[title];
                key = `stage4:${title}`;
                nextTarget = el.parentElement;
                break;
              }
            }
          }
        }

        setTarget((prev) => (prev === nextTarget ? prev : nextTarget));
        setMatchKey((prev) => (prev === key ? prev : key));
        setItems(foundItems);
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
        className="flex w-full items-center justify-between gap-4 rounded-xl px-2 py-1 text-left"
      >
        <div>
          <div className="text-xs font-black uppercase tracking-[0.16em] text-[#90a182]">Materiał wideo</div>
          <div className="mt-1 text-sm font-black text-white">▶ Zobacz wykonanie</div>
        </div>
        <span className="text-xl text-[#9dac8f]">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <VideoCard key={item.externalUrl} item={item} />
          ))}
        </div>
      )}
    </div>,
    target
  );
}

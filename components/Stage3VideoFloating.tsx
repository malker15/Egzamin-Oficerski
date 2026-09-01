"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type VideoItem = { title: string; source: string; embedUrl: string; externalUrl: string; note: string };

const introDrill: VideoItem = { title: "Postawa zasadnicza, swobodna i zwroty w miejscu", source: "Paweł Żygliński — nauka musztry", embedUrl: "https://www.youtube-nocookie.com/embed/tBKWCBdmt9c", externalUrl: "https://www.youtube.com/watch?v=tBKWCBdmt9c", note: "Polski materiał instruktażowy. Dokładne wykonanie porównuj z treścią zagadnienia w aplikacji." };
const marchDrill: VideoItem = { title: "Zwroty oraz marsz", source: "materiał pokazowy", embedUrl: "https://www.youtube-nocookie.com/embed/vcDannTh46k", externalUrl: "https://www.youtube.com/watch?v=vcDannTh46k", note: "Materiał pomocniczy do zwrotów, marszu i pracy na komendę." };
const rifleDrill: VideoItem = { title: "Musztra paradna z bronią — Kompania Reprezentacyjna WP", source: "pokaz Wojska Polskiego", embedUrl: "https://www.youtube-nocookie.com/embed/JBR9T7rktK4", externalUrl: "https://www.youtube.com/watch?v=JBR9T7rktK4", note: "Podgląd płynności pracy z bronią. Kolejność konkretnych chwytów ucz się z treści zagadnienia." };
const honorsDrill: VideoItem = { title: "Salutowanie i oddawanie honorów", source: "materiał szkoleniowy", embedUrl: "https://www.youtube-nocookie.com/embed/U6VVS8sik5w", externalUrl: "https://www.youtube.com/watch?v=U6VVS8sik5w", note: "Materiał pomocniczy dotyczący oddawania honorów w miejscu i w marszu." };
const teamDrill: VideoItem = { title: "Praca całej drużyny podczas musztry", source: "pokaz musztry zespołowej", embedUrl: "https://www.youtube-nocookie.com/embed/23T5RNThvzE", externalUrl: "https://www.youtube.com/watch?v=23T5RNThvzE", note: "Obserwuj ustawienie, synchronizację, tempo, reakcję na komendy i pracę dowódcy. Dokładną sekwencję wykonuj według aplikacji." };

const videosByTopic: Record<number, VideoItem[]> = { 1:[marchDrill], 2:[rifleDrill], 3:[rifleDrill], 4:[teamDrill], 5:[teamDrill], 6:[teamDrill], 7:[marchDrill], 8:[honorsDrill], 9:[honorsDrill], 10:[teamDrill], 11:[teamDrill], 12:[teamDrill], 13:[teamDrill], 14:[teamDrill], 15:[teamDrill], 16:[teamDrill], 17:[teamDrill], 18:[teamDrill], 19:[teamDrill], 20:[introDrill,marchDrill] };

export default function Stage3VideoFloating() {
  const pathname = usePathname();
  const [topicNumber, setTopicNumber] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/stage3")) { setTopicNumber(null); setOpen(false); return; }
    let frame = 0;
    const detect = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const match = (document.body.innerText || "").match(/ZAGADNIENIE\s+(\d{1,2})\s*\/\s*20/i);
        const number = match ? Number(match[1]) : null;
        setTopicNumber((prev) => prev === number ? prev : number);
      });
    };
    detect();
    const observer = new MutationObserver(detect);
    observer.observe(document.body, { childList:true, subtree:true, characterData:true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [pathname]);

  useEffect(() => { setOpen(false); }, [topicNumber]);

  if (!pathname.startsWith("/stage3") || !topicNumber || !videosByTopic[topicNumber]) return null;
  const items = videosByTopic[topicNumber];

  return (
    <div className="fixed bottom-24 left-3 z-[90] sm:left-5">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="rounded-2xl border border-[#67765d] bg-[#182015]/95 px-4 py-3 text-left shadow-2xl shadow-black/50 backdrop-blur transition hover:bg-[#202a1c]">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#91a384]">Zagadnienie {String(topicNumber).padStart(2,"0")}</div>
          <div className="mt-1 text-sm font-black text-white">▶ Zobacz wykonanie</div>
        </button>
      ) : (
        <div className="max-h-[75vh] w-[min(94vw,760px)] overflow-y-auto rounded-[1.5rem] border border-[#59684f] bg-[#0e120c]/98 p-4 shadow-2xl shadow-black/70 backdrop-blur sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#91a384]">Materiał wideo • zagadnienie {String(topicNumber).padStart(2,"0")}</div><h3 className="mt-1 text-lg font-black text-white">Zobacz wykonanie</h3></div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-[#46523f] px-3 py-1.5 text-sm font-bold text-[#b7c3ad]">Zamknij</button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <div key={item.externalUrl} className="overflow-hidden rounded-2xl border border-[#3f4b39] bg-[#090b08]">
                <div className="aspect-video bg-black"><iframe src={item.embedUrl} title={item.title} className="h-full w-full" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
                <div className="p-4"><div className="text-sm font-black text-white">{item.title}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#78866f]">{item.source}</div><p className="mt-2 text-xs leading-5 text-[#929b8b]">{item.note}</p><a href={item.externalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-bold text-[#c4d0b8] underline underline-offset-4">Otwórz film osobno ↗</a></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

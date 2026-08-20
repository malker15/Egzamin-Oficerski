"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import OralCoach from "./OralCoach";

type Rating = 0 | 1 | 2 | 3 | 4;
type View = "home" | "theory" | "practical" | "mock" | "coach";
type Progress = Record<string, { rating: Rating; seen: number; updatedAt: number }>;
type Theory = { id:string; category:string; question:string; keyPoints:string[]; fullAnswer:string; activeForRandomization:boolean };
type Practical = { id:string; category:string; practicalKind:string; question:string; openingCue:string; steps:string[]; checklist:{id:string;text:string}[]; fullAnswer:string; activeForRandomization:boolean };
type Data = { title:string; counts:{theoryActive:number;practicalActive:number;totalActive:number}; theory:Theory[]; practical:Practical[] };
type MockItem = { kind:"theory"|"practical"; q:Theory|Practical };

const LS = "officer_stage2_progress_v2";
const ratings: { value:Rating; label:string; short:string }[] = [
  {value:0,label:"Nie wiem",short:"0"},{value:1,label:"Słabo",short:"1"},{value:2,label:"Z pomocą",short:"2"},{value:3,label:"Samodzielnie",short:"3"},{value:4,label:"Płynnie",short:"4"},
];

function shuffle<T>(a:T[]) { const x=[...a]; for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];} return x; }
function pickWeighted<T extends {id:string}>(items:T[], p:Progress){
  const pool = items.flatMap(q => Array.from({length: Math.max(1, 6 - (p[q.id]?.rating ?? 0))}, () => q));
  return pool[Math.floor(Math.random()*pool.length)] ?? items[0];
}
async function loadData(): Promise<Data> {
  if (!("DecompressionStream" in window)) throw new Error("Ta przeglądarka nie obsługuje dekompresji danych. Użyj aktualnego Chrome/Edge/Firefox.");
  const urls=["/stage2/data_v2.txt","/stage2/data_v2_02.txt","/stage2/data_v2_03.txt","/stage2/data_v2_04.txt"];
  const parts=await Promise.all(urls.map(async u=>{const r=await fetch(u,{cache:"no-store"});if(!r.ok)throw new Error(`Brak pliku ${u}`);return r.text();}));
  const encoded=parts.join("").replace(/\s+/g,"");
  const bin=atob(encoded); const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const loaded=JSON.parse(await new Response(stream).text()) as Data;
  if(loaded.counts.totalActive!==109 || loaded.counts.theoryActive!==73 || loaded.counts.practicalActive!==36) throw new Error("Baza Etapu II ma nieprawidłową liczbę pytań.");
  return loaded;
}
function cls(...x:(string|false|undefined)[]){return x.filter(Boolean).join(" ");}
function Card({children,className=""}:{children:React.ReactNode;className?:string}){return <section className={cls("rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm",className)}>{children}</section>}
function Btn({children,onClick,kind="primary",disabled=false}:{children:React.ReactNode;onClick?:()=>void;kind?:"primary"|"secondary"|"danger";disabled?:boolean}){
  const s=kind==="primary"?"bg-white text-neutral-950":kind==="danger"?"border-red-900 bg-red-950 text-red-200":"border-neutral-700 bg-neutral-900 text-neutral-100";
  return <button disabled={disabled} onClick={onClick} className={cls("rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-85 disabled:opacity-40",s)}>{children}</button>;
}
function RatingBar({onRate}:{onRate:(r:Rating)=>void}){return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{ratings.map(r=><button key={r.value} onClick={()=>onRate(r.value)} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-left text-xs hover:border-neutral-400"><b className="mr-2 text-base">{r.short}</b>{r.label}</button>)}</div>}

export default function Stage2Page(){
  const [data,setData]=useState<Data|null>(null); const [progress,setProgress]=useState<Progress>({}); const [progressLoaded,setProgressLoaded]=useState(false); const [view,setView]=useState<View>("home");
  const [current,setCurrent]=useState<Theory|Practical|null>(null); const [revealed,setRevealed]=useState(false); const [full,setFull]=useState(false);
  const [checked,setChecked]=useState<Record<string,boolean>>({}); const [mock,setMock]=useState<MockItem[]>([]); const [mockIndex,setMockIndex]=useState(0); const [error,setError]=useState("");

  useEffect(()=>{(async()=>{const {data:s}=await supabase.auth.getSession();if(!s.session?.user){location.href="/";return;}try{setData(await loadData())}catch(e:any){setError(e?.message||"Nie udało się wczytać bazy.")}})()},[]);
  useEffect(()=>{try{const s=localStorage.getItem(LS);if(s)setProgress(JSON.parse(s))}catch{}finally{setProgressLoaded(true)}},[]);
  useEffect(()=>{if(progressLoaded)localStorage.setItem(LS,JSON.stringify(progress))},[progress,progressLoaded]);

  const activeTheory=useMemo(()=>data?.theory.filter(q=>q.activeForRandomization)??[],[data]);
  const activePractical=useMemo(()=>data?.practical.filter(q=>q.activeForRandomization)??[],[data]);
  const summary=useMemo(()=>{const all=[...activeTheory,...activePractical];let seen=0,weak=0,strong=0;for(const q of all){const r=progress[q.id]?.rating;if(r!==undefined)seen++;if(r!==undefined&&r<=2)weak++;if(r!==undefined&&r>=3)strong++;}return{total:all.length,seen,weak,strong,unseen:all.length-seen}},[activeTheory,activePractical,progress]);

  function setQuestion(q:Theory|Practical){setCurrent(q);setRevealed(false);setFull(false);setChecked({});}
  function start(kind:"theory"|"practical") { setView(kind); if(kind==="theory") setQuestion(pickWeighted(activeTheory,progress)); else setQuestion(pickWeighted(activePractical,progress)); }
  function next(){if(view==="theory")setQuestion(pickWeighted(activeTheory,progress));else if(view==="practical")setQuestion(pickWeighted(activePractical,progress));}
  function rate(r:Rating){if(!current)return;setProgress(p=>({...p,[current.id]:{rating:r,seen:(p[current.id]?.seen??0)+1,updatedAt:Date.now()}}));next();}
  function recordCoachRating(id:string,r:Rating){setProgress(p=>({...p,[id]:{rating:r,seen:(p[id]?.seen??0)+1,updatedAt:Date.now()}}));}
  function startMock(){const t=shuffle(activeTheory).slice(0,2).map(q=>({kind:"theory" as const,q}));const p=shuffle(activePractical).slice(0,1).map(q=>({kind:"practical" as const,q}));setMock([...t,...p]);setMockIndex(0);setView("mock");setRevealed(false);setFull(false);setChecked({});}
  function mockNext(){if(mockIndex+1<mock.length){setMockIndex(i=>i+1);setRevealed(false);setFull(false);setChecked({});}else setView("home");}
  const mockCurrent=mock[mockIndex];

  if(error)return <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100"><div className="mx-auto max-w-3xl"><Card><h1 className="text-xl font-bold">Etap II</h1><p className="mt-4 text-red-300">{error}</p><a href="/" className="mt-5 inline-block underline">Wróć do startu</a></Card></div></main>;
  if(!data)return <main className="grid min-h-screen place-items-center bg-neutral-950 text-neutral-300">Wczytuję Etap II…</main>;

  const QuestionView=({q,kind,exam=false}:{q:Theory|Practical;kind:"theory"|"practical";exam?:boolean})=><div className="space-y-4">
    <Card><div className="mb-2 flex flex-wrap gap-2 text-xs text-neutral-400"><span>{kind==="theory"?"TEORIA":"PRAKTYKA"}</span><span>•</span><span>{q.category}</span></div><h2 className="text-xl font-bold leading-snug">{q.question}</h2><p className="mt-4 text-sm text-neutral-400">{kind==="theory"?"Odpowiedz na głos, jak przed komisją.":"Wykonaj zadanie na głos, wcielając się w rolę kierownika/instruktora."}</p></Card>
    {!revealed?<div className="flex gap-2"><Btn onClick={()=>setRevealed(true)}>Sprawdź odpowiedź</Btn>{!exam&&<Btn kind="secondary" onClick={next}>Losuj inne</Btn>}</div>:<>
      {kind==="theory"?<Card><h3 className="font-bold">Punkty kontrolne</h3><ul className="mt-3 space-y-2 text-sm">{(q as Theory).keyPoints.map((x,i)=><li key={i} className="rounded-lg bg-neutral-950 p-3"><b>{i+1}.</b> {x}</li>)}</ul></Card>:<Card><h3 className="font-bold">Checklista wykonania</h3><div className="mt-3 space-y-2">{(q as Practical).checklist.map(x=><label key={x.id} className="flex gap-3 rounded-lg bg-neutral-950 p-3 text-sm"><input type="checkbox" checked={!!checked[x.id]} onChange={e=>setChecked(c=>({...c,[x.id]:e.target.checked}))}/><span>{x.text}</span></label>)}</div></Card>}
      <Btn kind="secondary" onClick={()=>setFull(v=>!v)}>{full?"Ukryj pełną odpowiedź":"Pokaż pełną odpowiedź"}</Btn>
      {full&&<Card><h3 className="font-bold">Pełna odpowiedź źródłowa</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-300">{q.fullAnswer}</p></Card>}
      {!exam&&<Card><h3 className="mb-3 font-bold">Jak Ci poszło?</h3><RatingBar onRate={rate}/></Card>}
    </>}
  </div>;

  return <main className="min-h-screen bg-neutral-950 text-neutral-100"><div className="mx-auto max-w-5xl px-4 py-8">
    <header className="mb-6 flex flex-wrap items-center gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-neutral-500">Egzamin oficerski</p><h1 className="text-2xl font-bold">Etap II — teoria i praktyka</h1></div><div className="ml-auto flex gap-2"><a href="/" className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold">Start</a>{view!=="home"&&view!=="coach"&&<Btn kind="secondary" onClick={()=>setView("home")}>Menu Etapu II</Btn>}</div></header>

    {view==="home"&&<div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-5">{[["Aktywne",summary.total],["Przerobione",summary.seen],["Niepoznane",summary.unseen],["Do poprawy",summary.weak],["Mocne",summary.strong]].map(([a,b])=><Card key={String(a)} className="p-4"><div className="text-xs text-neutral-500">{a}</div><div className="mt-1 text-2xl font-bold">{b}</div></Card>)}</div>
      <div className="grid gap-4 md:grid-cols-3"><button onClick={()=>start("theory")} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left hover:border-neutral-500"><div className="text-sm text-neutral-400">{data.counts.theoryActive} aktywne</div><div className="mt-2 text-xl font-bold">Nauka teorii</div><p className="mt-2 text-sm text-neutral-400">Pytanie → odpowiedź na głos → punkty kontrolne → samoocena.</p></button><button onClick={()=>start("practical")} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left hover:border-neutral-500"><div className="text-sm text-neutral-400">{data.counts.practicalActive} aktywne</div><div className="mt-2 text-xl font-bold">Nauka praktyki</div><p className="mt-2 text-sm text-neutral-400">Wykonujesz zadanie jak kierownik zajęć, potem odhaczasz checklistę.</p></button><button onClick={startMock} className="rounded-2xl border border-neutral-600 bg-white p-6 text-left text-neutral-950 hover:bg-neutral-200"><div className="text-sm text-neutral-600">2 teoria + 1 praktyka</div><div className="mt-2 text-xl font-bold">Symulacja Etapu II</div><p className="mt-2 text-sm text-neutral-600">Trzy losowe zadania bez podpowiedzi do momentu sprawdzenia.</p></button></div>

      <button onClick={()=>setView("coach")} className="group w-full overflow-hidden rounded-[1.65rem] border border-[#657658] bg-[#172015] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#1c2718] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#91a482]">NOWY TRYB // LAB</div>
            <div className="mt-2 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl border border-[#66785a] bg-[#0e130c] text-xl">🎙️</span><div><h2 className="text-xl font-black text-white sm:text-2xl">Trener odpowiedzi ustnej</h2><p className="mt-1 text-sm text-[#9eaa96]">Warstwy 15 s / 45 s / pełna → mikrofon → transkrypcja → orientacyjne wykrywanie pominiętych punktów.</p></div></div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end"><span className="rounded-full border border-[#4a5942] bg-[#0e130c] px-3 py-1.5 text-xs font-bold text-[#afbea4]">15 s</span><span className="rounded-full border border-[#4a5942] bg-[#0e130c] px-3 py-1.5 text-xs font-bold text-[#afbea4]">45 s</span><span className="rounded-full border border-[#4a5942] bg-[#0e130c] px-3 py-1.5 text-xs font-bold text-[#afbea4]">pełna</span><span className="rounded-full border border-[#718365] bg-[#202a1c] px-3 py-1.5 text-xs font-black text-[#c9d5bd]">Otwórz →</span></div>
        </div>
      </button>

      <Card><div className="flex flex-wrap items-center gap-3"><div><h3 className="font-bold">System powtórek</h3><p className="mt-1 text-sm text-neutral-400">Pytania ocenione 0–2 są losowane częściej. Ocena 3–4 stopniowo zmniejsza ich wagę. Trener ustny korzysta z tego samego postępu.</p></div><Btn kind="danger" onClick={()=>{if(confirm("Wyczyścić cały postęp Etapu II?"))setProgress({})}}>Wyczyść postęp</Btn></div></Card>
    </div>}
    {view==="theory"&&current&&<QuestionView q={current} kind="theory"/>}
    {view==="practical"&&current&&<QuestionView q={current} kind="practical"/>}
    {view==="mock"&&mockCurrent&&<div className="space-y-4"><div className="flex items-center justify-between text-sm text-neutral-400"><span>Symulacja</span><span>{mockIndex+1} / {mock.length}</span></div><QuestionView q={mockCurrent.q} kind={mockCurrent.kind} exam/>{revealed&&<div className="flex justify-end"><Btn onClick={mockNext}>{mockIndex+1<mock.length?"Następne zadanie":"Zakończ symulację"}</Btn></div>}</div>}
    {view==="coach"&&<OralCoach questions={activeTheory} progress={progress} onRate={recordCoachRating} onExit={()=>setView("home")}/>} 
  </div></main>;
}

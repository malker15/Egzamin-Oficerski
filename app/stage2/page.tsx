"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import OralCoach from "./OralCoach";
import AdaptiveExaminer from "./AdaptiveExaminer";
import SemanticCoach from "./SemanticCoach";
import { STAGE2_SET_DEFINITIONS } from "./setDefinitions";

type Rating = 0 | 1 | 2 | 3 | 4;
type View = "home" | "theory" | "practical" | "mock" | "sets" | "coach" | "examiner" | "semantic";
type Progress = Record<string, { rating: Rating; seen: number; updatedAt: number }>;
type Theory = { id:string; category:string; question:string; keyPoints:string[]; fullAnswer:string; activeForRandomization:boolean };
type Practical = { id:string; category:string; practicalKind:string; question:string; openingCue:string; steps:string[]; checklist:{id:string;text:string}[]; fullAnswer:string; activeForRandomization:boolean };
type Data = { title:string; counts:{theoryActive:number;practicalActive:number;totalActive:number}; theory:Theory[]; practical:Practical[] };
type ResolvedSetQuestion = { kind:"theory"|"practical"; q:Theory|Practical } | null;
type ResolvedSet = { number:number; questions:[ResolvedSetQuestion, ResolvedSetQuestion] };

const LS = "officer_stage2_progress_v2";
const ratings: { value:Rating; label:string; short:string }[] = [
  {value:0,label:"Nie wiem",short:"0"},
  {value:1,label:"Słabo",short:"1"},
  {value:2,label:"Z pomocą",short:"2"},
  {value:3,label:"Samodzielnie",short:"3"},
  {value:4,label:"Płynnie",short:"4"},
];

function shuffle<T>(a:T[]) {
  const x=[...a];
  for(let i=x.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [x[i],x[j]]=[x[j],x[i]];
  }
  return x;
}

function pickWeighted<T extends {id:string}>(items:T[], p:Progress){
  const pool = items.flatMap(q => Array.from({length: Math.max(1, 6 - (p[q.id]?.rating ?? 0))}, () => q));
  return pool[Math.floor(Math.random()*pool.length)] ?? items[0];
}

function normalizeText(text:string){
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchScore(anchor:string, candidate:string){
  const a=normalizeText(anchor);
  const c=normalizeText(candidate);
  if(!a || !c) return 0;
  if(c.includes(a)) return 10000 + a.length;
  const tokens=a.split(" ").filter(x=>x.length>=3);
  if(!tokens.length) return 0;
  const candidateTokens=new Set(c.split(" "));
  const hit=tokens.filter(x=>candidateTokens.has(x)).length;
  const coverage=hit/tokens.length;
  const phraseBonus=tokens.length>=3 && c.includes(tokens.slice(0,3).join(" ")) ? 20 : 0;
  return coverage*100 + phraseBonus;
}

function resolveSetQuestion(anchor:string, data:Data):ResolvedSetQuestion {
  const pool:{kind:"theory"|"practical";q:Theory|Practical}[]=[
    ...data.theory.map(q=>({kind:"theory" as const,q})),
    ...data.practical.map(q=>({kind:"practical" as const,q})),
  ];
  let best:typeof pool[number]|null=null;
  let bestScore=0;
  for(const item of pool){
    const score=matchScore(anchor,item.q.question);
    if(score>bestScore){bestScore=score;best=item;}
  }
  return bestScore>=55 ? best : null;
}

function buildResolvedSets(data:Data):ResolvedSet[]{
  return STAGE2_SET_DEFINITIONS.map(def=>({
    number:def.number,
    questions:[
      resolveSetQuestion(def.questionAnchors[0],data),
      resolveSetQuestion(def.questionAnchors[1],data),
    ],
  }));
}

async function loadData(): Promise<Data> {
  if (!("DecompressionStream" in window)) throw new Error("Ta przeglądarka nie obsługuje dekompresji danych. Użyj aktualnego Chrome/Edge/Firefox.");
  const urls=["/stage2/data_v2.txt","/stage2/data_v2_02.txt","/stage2/data_v2_03.txt","/stage2/data_v2_04.txt"];
  const parts=await Promise.all(urls.map(async u=>{
    const r=await fetch(u,{cache:"no-store"});
    if(!r.ok) throw new Error(`Brak pliku ${u}`);
    return r.text();
  }));
  const encoded=parts.join("").replace(/\s+/g,"");
  const bin=atob(encoded);
  const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const loaded=JSON.parse(await new Response(stream).text()) as Data;
  if(loaded.counts.totalActive!==109 || loaded.counts.theoryActive!==73 || loaded.counts.practicalActive!==36) throw new Error("Baza Etapu II ma nieprawidłową liczbę pytań.");
  return loaded;
}

function cls(...x:(string|false|undefined)[]){return x.filter(Boolean).join(" ");}
function Card({children,className=""}:{children:React.ReactNode;className?:string}){
  return <section className={cls("rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm",className)}>{children}</section>;
}
function Btn({children,onClick,kind="primary",disabled=false}:{children:React.ReactNode;onClick?:()=>void;kind?:"primary"|"secondary"|"danger";disabled?:boolean}){
  const s=kind==="primary"?"bg-white text-neutral-950":kind==="danger"?"border-red-900 bg-red-950 text-red-200":"border-neutral-700 bg-neutral-900 text-neutral-100";
  return <button disabled={disabled} onClick={onClick} className={cls("rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-85 disabled:opacity-40",s)}>{children}</button>;
}
function RatingBar({onRate}:{onRate:(r:Rating)=>void}){
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{ratings.map(r=><button key={r.value} onClick={()=>onRate(r.value)} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-left text-xs hover:border-neutral-400"><b className="mr-2 text-base">{r.short}</b>{r.label}</button>)}</div>;
}
function SetBadge({number,position}:{number:number;position?:number}){
  return <div className="rounded-xl border border-[#66785a] bg-[#172015] px-3 py-2 text-right shadow-lg shadow-black/20">
    <div className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#91a482]">Zestaw nr</div>
    <div className="mt-0.5 text-2xl font-black text-white">{number}</div>
    {position&&<div className="text-[10px] font-bold text-[#91a482]">pytanie {position}/2</div>}
  </div>;
}

export default function Stage2Page(){
  const [data,setData]=useState<Data|null>(null);
  const [progress,setProgress]=useState<Progress>({});
  const [progressLoaded,setProgressLoaded]=useState(false);
  const [view,setView]=useState<View>("home");
  const [current,setCurrent]=useState<Theory|Practical|null>(null);
  const [revealed,setRevealed]=useState(false);
  const [full,setFull]=useState(false);
  const [checked,setChecked]=useState<Record<string,boolean>>({});
  const [activeSet,setActiveSet]=useState<ResolvedSet|null>(null);
  const [activeSetIndex,setActiveSetIndex]=useState(0);
  const [mockSet,setMockSet]=useState<ResolvedSet|null>(null);
  const [mockIndex,setMockIndex]=useState(0);
  const [selectedSetNumber,setSelectedSetNumber]=useState(1);
  const [expandedAnswers,setExpandedAnswers]=useState<Record<string,boolean>>({});
  const [error,setError]=useState("");

  useEffect(()=>{(async()=>{
    const {data:s}=await supabase.auth.getSession();
    if(!s.session?.user){location.href="/";return;}
    try{setData(await loadData())}catch(e:any){setError(e?.message||"Nie udało się wczytać bazy.")}
  })()},[]);
  useEffect(()=>{try{const s=localStorage.getItem(LS);if(s)setProgress(JSON.parse(s))}catch{}finally{setProgressLoaded(true)}},[]);
  useEffect(()=>{if(progressLoaded)localStorage.setItem(LS,JSON.stringify(progress))},[progress,progressLoaded]);

  const activeTheory=useMemo(()=>data?.theory.filter(q=>q.activeForRandomization)??[],[data]);
  const activePractical=useMemo(()=>data?.practical.filter(q=>q.activeForRandomization)??[],[data]);
  const resolvedSets=useMemo(()=>data?buildResolvedSets(data):[],[data]);
  const completeSets=useMemo(()=>resolvedSets.filter(s=>s.questions.every(Boolean)),[resolvedSets]);
  const unresolvedSets=useMemo(()=>resolvedSets.filter(s=>!s.questions.every(Boolean)),[resolvedSets]);
  const summary=useMemo(()=>{
    const all=[...activeTheory,...activePractical];
    let seen=0,weak=0,strong=0;
    for(const q of all){
      const r=progress[q.id]?.rating;
      if(r!==undefined)seen++;
      if(r!==undefined&&r<=2)weak++;
      if(r!==undefined&&r>=3)strong++;
    }
    return{total:all.length,seen,weak,strong,unseen:all.length-seen};
  },[activeTheory,activePractical,progress]);

  function setQuestion(q:Theory|Practical){
    setCurrent(q);setRevealed(false);setFull(false);setChecked({});
  }
  function randomCompleteSet(exclude?:number){
    const pool=completeSets.filter(s=>s.number!==exclude);
    return pool[Math.floor(Math.random()*pool.length)] ?? completeSets[0] ?? null;
  }
  function startTheorySet(s?:ResolvedSet){
    const chosen=s ?? randomCompleteSet();
    if(!chosen||!chosen.questions[0]) return;
    setActiveSet(chosen);
    setActiveSetIndex(0);
    setQuestion(chosen.questions[0].q);
    setView("theory");
  }
  function startPractical(){
    setActiveSet(null);
    setView("practical");
    setQuestion(pickWeighted(activePractical,progress));
  }
  function skipCurrent(){
    if(view==="theory"){
      startTheorySet(randomCompleteSet(activeSet?.number));
    }else if(view==="practical"){
      setQuestion(pickWeighted(activePractical,progress));
    }
  }
  function advanceAfterRating(){
    if(view==="theory"&&activeSet){
      if(activeSetIndex===0&&activeSet.questions[1]){
        setActiveSetIndex(1);
        setQuestion(activeSet.questions[1].q);
      }else{
        startTheorySet(randomCompleteSet(activeSet.number));
      }
    }else if(view==="practical"){
      setQuestion(pickWeighted(activePractical,progress));
    }
  }
  function rate(r:Rating){
    if(!current)return;
    setProgress(p=>({...p,[current.id]:{rating:r,seen:(p[current.id]?.seen??0)+1,updatedAt:Date.now()}}));
    advanceAfterRating();
  }
  function recordCoachRating(id:string,r:Rating){
    setProgress(p=>({...p,[id]:{rating:r,seen:(p[id]?.seen??0)+1,updatedAt:Date.now()}}));
  }
  function startMock(){
    const chosen=randomCompleteSet();
    if(!chosen)return;
    setMockSet(chosen);
    setMockIndex(0);
    setView("mock");
    setRevealed(false);setFull(false);setChecked({});
  }
  function mockNext(){
    if(!mockSet)return;
    if(mockIndex===0){
      setMockIndex(1);setRevealed(false);setFull(false);setChecked({});
    }else{
      setView("home");setMockSet(null);setMockIndex(0);
    }
  }
  function openSets(){setSelectedSetNumber(1);setExpandedAnswers({});setView("sets");}

  if(error)return <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100"><div className="mx-auto max-w-3xl"><Card><h1 className="text-xl font-bold">Etap II</h1><p className="mt-4 text-red-300">{error}</p><a href="/" className="mt-5 inline-block underline">Wróć do startu</a></Card></div></main>;
  if(!data)return <main className="grid min-h-screen place-items-center bg-neutral-950 text-neutral-300">Wczytuję Etap II…</main>;

  const QuestionView=({q,kind,exam=false,setNumber,setPosition}:{q:Theory|Practical;kind:"theory"|"practical";exam?:boolean;setNumber?:number;setPosition?:number})=><div className="space-y-4">
    {setNumber&&<div className="fixed right-4 top-28 z-40 hidden 2xl:block"><SetBadge number={setNumber} position={setPosition}/></div>}
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-neutral-400"><span>{kind==="theory"?"TEORIA":"PRAKTYKA"}</span><span>•</span><span>{q.category}</span></div>
        {setNumber&&<SetBadge number={setNumber} position={setPosition}/>} 
      </div>
      <h2 className="text-xl font-bold leading-snug">{q.question}</h2>
      <p className="mt-4 text-sm text-neutral-400">{kind==="theory"?"Odpowiedz na głos, jak przed komisją.":"Wykonaj zadanie na głos, wcielając się w rolę kierownika/instruktora."}</p>
    </Card>
    {!revealed?<div className="flex flex-wrap gap-2"><Btn onClick={()=>setRevealed(true)}>Sprawdź odpowiedź</Btn>{!exam&&<Btn kind="secondary" onClick={skipCurrent}>{view==="theory"?"Losuj inny zestaw":"Losuj inne"}</Btn>}</div>:<>
      {kind==="theory"?<Card><h3 className="font-bold">Punkty kontrolne</h3><ul className="mt-3 space-y-2 text-sm">{(q as Theory).keyPoints.map((x,i)=><li key={i} className="rounded-lg bg-neutral-950 p-3"><b>{i+1}.</b> {x}</li>)}</ul></Card>:<Card><h3 className="font-bold">Checklista wykonania</h3><div className="mt-3 space-y-2">{(q as Practical).checklist.map(x=><label key={x.id} className="flex gap-3 rounded-lg bg-neutral-950 p-3 text-sm"><input type="checkbox" checked={!!checked[x.id]} onChange={e=>setChecked(c=>({...c,[x.id]:e.target.checked}))}/><span>{x.text}</span></label>)}</div></Card>}
      <Btn kind="secondary" onClick={()=>setFull(v=>!v)}>{full?"Ukryj pełną odpowiedź":"Pokaż pełną odpowiedź"}</Btn>
      {full&&<Card><h3 className="font-bold">Pełna odpowiedź źródłowa</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-300">{q.fullAnswer}</p></Card>}
      {!exam&&<Card><h3 className="mb-3 font-bold">Jak Ci poszło?</h3><RatingBar onRate={rate}/></Card>}
    </>}
  </div>;

  const selectedSet=resolvedSets.find(s=>s.number===selectedSetNumber) ?? resolvedSets[0];
  const mockCurrent=mockSet?.questions[mockIndex] ?? null;

  return <main className="min-h-screen bg-neutral-950 text-neutral-100"><div className="mx-auto max-w-5xl px-4 py-8">
    <header className="mb-6 flex flex-wrap items-center gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-neutral-500">Egzamin oficerski</p><h1 className="text-2xl font-bold">Etap II — teoria i praktyka</h1></div>
      <div className="ml-auto flex gap-2"><a href="/" className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold">Start</a>{view!=="home"&&view!=="coach"&&view!=="examiner"&&view!=="semantic"&&<Btn kind="secondary" onClick={()=>setView("home")}>Menu Etapu II</Btn>}</div>
    </header>

    {view==="home"&&<div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-5">{[["Aktywne",summary.total],["Przerobione",summary.seen],["Niepoznane",summary.unseen],["Do poprawy",summary.weak],["Mocne",summary.strong]].map(([a,b])=><Card key={String(a)} className="p-4"><div className="text-xs text-neutral-500">{a}</div><div className="mt-1 text-2xl font-bold">{b}</div></Card>)}</div>

      <div className="grid gap-4 md:grid-cols-3">
        <button onClick={()=>startTheorySet()} className="rounded-2xl border border-[#56664c] bg-[#121911] p-6 text-left hover:border-[#809174]">
          <div className="text-sm text-[#91a482]">{completeSets.length} zestawy egzaminacyjne</div>
          <div className="mt-2 text-xl font-bold">Nauka teorii — zestawy</div>
          <p className="mt-2 text-sm text-neutral-400">Losujesz dokładnie zestaw nr 1–34 → pytanie 1 → pytanie 2 → samoocena.</p>
        </button>
        <button onClick={startPractical} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left hover:border-neutral-500">
          <div className="text-sm text-neutral-400">{data.counts.practicalActive} aktywne</div>
          <div className="mt-2 text-xl font-bold">Nauka praktyki</div>
          <p className="mt-2 text-sm text-neutral-400">Wykonujesz zadanie jak kierownik zajęć, potem odhaczasz checklistę.</p>
        </button>
        <button onClick={startMock} className="rounded-2xl border border-neutral-600 bg-white p-6 text-left text-neutral-950 hover:bg-neutral-200">
          <div className="text-sm text-neutral-600">1 zestaw = 2 przypisane pytania</div>
          <div className="mt-2 text-xl font-bold">Symulacja Etapu II</div>
          <p className="mt-2 text-sm text-neutral-600">Losujesz jeden z rzeczywistych zestawów 1–34. Numer zestawu jest widoczny przez całą symulację.</p>
        </button>
      </div>

      <button onClick={openSets} className="w-full rounded-[1.65rem] border border-[#657658] bg-[#172015] p-6 text-left transition hover:bg-[#1c2718] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#91a482]">BAZA // ZESTAWY 1–34</div><h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Podgląd wszystkich zestawów egzaminacyjnych</h2><p className="mt-2 text-sm leading-6 text-[#9eaa96]">Otwórz dowolny numer i zobacz oba pytania wraz z odpowiedziami z obecnej bazy Etapu II.</p></div>
          <span className="rounded-xl border border-[#718365] bg-[#202a1c] px-4 py-2 text-sm font-black text-[#c9d5bd]">Otwórz 34 zestawy →</span>
        </div>
      </button>

      {unresolvedSets.length>0&&<Card className="border-amber-900/60 bg-amber-950/20"><h3 className="font-bold text-amber-200">Do sprawdzenia: mapowanie zestawów</h3><p className="mt-2 text-sm text-amber-100/80">Nie udało się automatycznie połączyć wszystkich pytań z bazą. Zestawy: {unresolvedSets.map(s=>s.number).join(", ")}. Pozostałe działają normalnie.</p></Card>}

      <div className="grid gap-4 lg:grid-cols-3">
        <button onClick={()=>setView("coach")} className="group w-full overflow-hidden rounded-[1.65rem] border border-[#657658] bg-[#172015] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#1c2718] sm:p-7">
          <div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#91a482]">LAB // TRENING</div>
          <div className="mt-3 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#66785a] bg-[#0e130c] text-xl">🎙️</span><div><h2 className="text-xl font-black text-white sm:text-2xl">Trener odpowiedzi ustnej</h2><p className="mt-1 text-sm leading-6 text-[#9eaa96]">Warstwy 15 s / 45 s / pełna → mikrofon → transkrypcja → orientacyjne wykrywanie pominiętych punktów.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-[#4a5942] bg-[#0e130c] px-3 py-1.5 text-xs font-bold text-[#afbea4]">15 s</span><span className="rounded-full border border-[#4a5942] bg-[#0e130c] px-3 py-1.5 text-xs font-bold text-[#afbea4]">45 s</span><span className="rounded-full border border-[#718365] bg-[#202a1c] px-3 py-1.5 text-xs font-black text-[#c9d5bd]">Otwórz →</span></div>
        </button>
        <button onClick={()=>setView("examiner")} className="group w-full overflow-hidden rounded-[1.65rem] border border-amber-900/50 bg-[#1b1810] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#221e13] sm:p-7">
          <div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-amber-200/70">LAB // KOMISJA</div>
          <div className="mt-3 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-amber-900/50 bg-black/20 text-xl">🎯</span><div><h2 className="text-xl font-black text-white sm:text-2xl">Komisja adaptacyjna</h2><p className="mt-1 text-sm leading-6 text-[#aaa18d]">Odpowiadasz → system wykrywa najsłabszy element → komisja dopytuje właśnie o niego → raport pokazuje, ile odzyskałeś.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-amber-900/50 bg-black/20 px-3 py-1.5 text-xs font-bold text-amber-100">dopytanie</span><span className="rounded-full border border-amber-900/50 bg-black/20 px-3 py-1.5 text-xs font-bold text-amber-100">mikrofon</span><span className="rounded-full border border-[#7d704b] bg-[#292316] px-3 py-1.5 text-xs font-black text-[#e4d5aa]">Otwórz →</span></div>
        </button>
        <button onClick={()=>setView("semantic")} className="group w-full overflow-hidden rounded-[1.65rem] border border-sky-900/60 bg-[#10191c] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#132025] sm:p-7">
          <div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-sky-300/80">BETA // SEMANTYKA</div>
          <div className="mt-3 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-sky-900/50 bg-black/20 text-xl">🧠</span><div><h2 className="text-xl font-black text-white sm:text-2xl">Analiza własnymi słowami</h2><p className="mt-1 text-sm leading-6 text-[#92a9ae]">Lokalny model MiniLM porównuje znaczenie Twojej wypowiedzi z odpowiedzią źródłową i łączy je z matcherem słów kluczowych.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-sky-900/50 bg-black/20 px-3 py-1.5 text-xs font-bold text-sky-100">0 zł</span><span className="rounded-full border border-sky-900/50 bg-black/20 px-3 py-1.5 text-xs font-bold text-sky-100">lokalnie</span><span className="rounded-full border border-[#4b7480] bg-[#17282d] px-3 py-1.5 text-xs font-black text-[#c6e1e6]">Otwórz →</span></div>
        </button>
      </div>

      <Card><div className="flex flex-wrap items-center gap-3"><div><h3 className="font-bold">System powtórek</h3><p className="mt-1 text-sm text-neutral-400">Pytania ocenione 0–2 są częściej wybierane w treningach indywidualnych. Zestawy egzaminacyjne są losowane jako całe pary pytań.</p></div><Btn kind="danger" onClick={()=>{if(confirm("Wyczyścić cały postęp Etapu II?"))setProgress({})}}>Wyczyść postęp</Btn></div></Card>
    </div>}

    {view==="sets"&&selectedSet&&<div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#91a482]">PODGLĄD // 34 ZESTAWY</div><h2 className="mt-2 text-2xl font-black">Zestawy egzaminacyjne Etapu II</h2><p className="mt-1 text-sm text-neutral-400">Wybierz numer zestawu. Pytania i odpowiedzi są pobierane z istniejącej bazy.</p></div><Btn onClick={()=>selectedSet.questions.every(Boolean)&&startTheorySet(selectedSet)} disabled={!selectedSet.questions.every(Boolean)}>Ćwicz zestaw nr {selectedSet.number}</Btn></div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-9 lg:grid-cols-17">{resolvedSets.map(s=><button key={s.number} onClick={()=>{setSelectedSetNumber(s.number);setExpandedAnswers({})}} className={cls("rounded-xl border px-2 py-3 text-sm font-black transition",selectedSetNumber===s.number?"border-[#91a482] bg-[#d9e2d2] text-[#10150f]":"border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-600",!s.questions.every(Boolean)&&"border-amber-900/60")}>{s.number}</button>)}</div>
      <Card className="border-[#56664c] bg-[#121911]"><div className="flex items-center justify-between gap-3"><div><div className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#91a482]">ZESTAW EGZAMINACYJNY</div><h3 className="mt-1 text-3xl font-black">Zestaw nr {selectedSet.number}</h3></div><SetBadge number={selectedSet.number}/></div></Card>
      <div className="grid gap-4 lg:grid-cols-2">{selectedSet.questions.map((item,index)=>{
        const key=`${selectedSet.number}-${index}`;
        const anchor=STAGE2_SET_DEFINITIONS.find(x=>x.number===selectedSet.number)?.questionAnchors[index] ?? "";
        if(!item)return <Card key={key} className="border-amber-900/60"><div className="text-xs font-black uppercase tracking-[.15em] text-amber-300">Pytanie {index+1}</div><h3 className="mt-3 text-lg font-bold">{anchor}</h3><p className="mt-3 text-sm text-amber-200/80">Nie udało się automatycznie połączyć tego pytania z obecną bazą.</p></Card>;
        const theory=item.kind==="theory"?item.q as Theory:null;
        return <Card key={key} className="flex flex-col"><div className="flex items-center justify-between gap-2"><div className="text-xs font-black uppercase tracking-[.15em] text-[#91a482]">Pytanie {index+1} • {item.kind==="theory"?"teoria":"praktyka"}</div><span className="rounded-full border border-neutral-700 px-2 py-1 text-[10px] text-neutral-400">{item.q.category}</span></div><h3 className="mt-3 text-lg font-bold leading-snug">{item.q.question}</h3>{theory&&theory.keyPoints.length>0&&<div className="mt-4"><div className="text-xs font-bold uppercase tracking-[.12em] text-neutral-500">Punkty kontrolne</div><ul className="mt-2 space-y-1 text-sm text-neutral-300">{theory.keyPoints.map((x,i)=><li key={i}>• {x}</li>)}</ul></div>}<div className="mt-auto pt-5"><Btn kind="secondary" onClick={()=>setExpandedAnswers(x=>({...x,[key]:!x[key]}))}>{expandedAnswers[key]?"Ukryj odpowiedź":"Pokaż odpowiedź"}</Btn></div>{expandedAnswers[key]&&<div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4"><div className="text-xs font-black uppercase tracking-[.12em] text-neutral-500">Pełna odpowiedź źródłowa</div><p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-300">{item.q.fullAnswer}</p></div>}</Card>;
      })}</div>
    </div>}

    {view==="theory"&&current&&activeSet&&<QuestionView q={current} kind={activeSet.questions[activeSetIndex]?.kind ?? "theory"} setNumber={activeSet.number} setPosition={activeSetIndex+1}/>} 
    {view==="practical"&&current&&<QuestionView q={current} kind="practical"/>}
    {view==="mock"&&mockSet&&mockCurrent&&<div className="space-y-4"><div className="flex items-center justify-between gap-3 text-sm text-neutral-400"><span>Symulacja Etapu II • zestaw nr <b className="text-white">{mockSet.number}</b></span><span>Pytanie {mockIndex+1} / 2</span></div><QuestionView q={mockCurrent.q} kind={mockCurrent.kind} exam setNumber={mockSet.number} setPosition={mockIndex+1}/>{revealed&&<div className="flex justify-end"><Btn onClick={mockNext}>{mockIndex===0?"Następne pytanie z zestawu":"Zakończ symulację"}</Btn></div>}</div>}
    {view==="coach"&&<OralCoach questions={activeTheory} progress={progress} onRate={recordCoachRating} onExit={()=>setView("home")}/>} 
    {view==="examiner"&&<AdaptiveExaminer questions={activeTheory} progress={progress} onRate={recordCoachRating} onExit={()=>setView("home")}/>} 
    {view==="semantic"&&<SemanticCoach questions={activeTheory} progress={progress} onRate={recordCoachRating} onExit={()=>setView("home")}/>} 
  </div></main>;
}

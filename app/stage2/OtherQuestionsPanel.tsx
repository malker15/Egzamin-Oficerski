"use client";

import { useMemo, useState } from "react";
import { OTHER_STAGE2_QUESTIONS } from "./otherQuestions";

export default function OtherQuestionsPanel({onExit}:{onExit:()=>void}){
  const [selectedNumber,setSelectedNumber]=useState(OTHER_STAGE2_QUESTIONS[0]?.sourceNumber ?? 1);
  const [full,setFull]=useState(false);

  const selected=useMemo(
    ()=>OTHER_STAGE2_QUESTIONS.find(q=>q.sourceNumber===selectedNumber) ?? OTHER_STAGE2_QUESTIONS[0],
    [selectedNumber]
  );

  if(!selected)return null;

  const index=OTHER_STAGE2_QUESTIONS.findIndex(q=>q.sourceNumber===selected.sourceNumber);
  const prev=OTHER_STAGE2_QUESTIONS[index-1];
  const next=OTHER_STAGE2_QUESTIONS[index+1];

  function choose(n:number){setSelectedNumber(n);setFull(false);window.scrollTo({top:0,behavior:"smooth"});}

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#91a482]">BAZA // DODATKOWE</div>
        <h2 className="mt-2 text-2xl font-black sm:text-3xl">Inne możliwe pytania</h2>
        <p className="mt-2 max-w-[72ch] text-sm leading-6 text-neutral-400">27 pytań z dodatkowego materiału, których nie było w głównej bazie Etapu II. Każde ma skrót do nauki i pełną odpowiedź.</p>
      </div>
      <button onClick={onExit} className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-bold text-neutral-100 hover:border-neutral-500">Menu Etapu II</button>
    </div>

    <div className="rounded-[1.4rem] border border-[#56664c] bg-[#121911] p-4 sm:p-5">
      <div className="mb-3 text-xs font-black uppercase tracking-[.14em] text-[#91a482]">Wybierz numer z pliku</div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-9 lg:grid-cols-14">
        {OTHER_STAGE2_QUESTIONS.map(q=><button key={q.sourceNumber} onClick={()=>choose(q.sourceNumber)} className={`rounded-xl border px-2 py-3 text-sm font-black transition ${selected.sourceNumber===q.sourceNumber?"border-[#9dad91] bg-[#dfe7d7] text-[#11170f]":"border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-[#66785a]"}`}>{q.sourceNumber}</button>)}
      </div>
    </div>

    <section className="rounded-[1.6rem] border border-neutral-700 bg-[#151815] p-6 shadow-xl shadow-black/20 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[76ch]">
          <div className="font-mono text-[11px] font-black uppercase tracking-[.18em] text-[#91a482]">PYTANIE {selected.sourceNumber} // {selected.category}</div>
          <h3 className="mt-3 text-xl font-black leading-8 text-white sm:text-2xl">{selected.question}</h3>
        </div>
        <div className="rounded-xl border border-[#66785a] bg-[#172015] px-4 py-3 text-center">
          <div className="text-[10px] font-black uppercase tracking-[.14em] text-[#91a482]">Nr z pliku</div>
          <div className="text-2xl font-black text-white">{selected.sourceNumber}</div>
        </div>
      </div>
    </section>

    <section className="overflow-hidden rounded-[1.6rem] border-2 border-[#809173] bg-[#eef2e8] text-[#11170f] shadow-xl shadow-black/20">
      <div className="border-b border-[#c5cfbd] bg-[#dfe7d7] px-5 py-4 sm:px-6">
        <div className="text-[10px] font-black uppercase tracking-[.18em] text-[#617159]">ODPOWIEDŹ // DO NAUKI</div>
        <div className="mt-1 text-lg font-black">Najpierw zapamiętaj ten szkielet</div>
      </div>
      <div className="space-y-3 p-5 sm:p-6">
        {selected.keyPoints.map((point,i)=><div key={i} className="flex gap-4 rounded-2xl border border-[#ccd5c5] bg-white/65 p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1c2718] text-sm font-black text-white">{i+1}</div>
          <p className="pt-1 text-[16px] font-semibold leading-7 text-[#273022]">{point}</p>
        </div>)}
      </div>
      <div className="border-t border-[#c5cfbd] p-5 sm:p-6">
        <button onClick={()=>setFull(v=>!v)} className="w-full rounded-xl border border-[#718365] bg-[#202a1c] px-4 py-3 text-sm font-black text-[#e6ecdf] transition hover:bg-[#283423]">{full?"Ukryj pełną odpowiedź":"Czytaj pełną odpowiedź"}</button>
        {full&&<div className="mt-4 rounded-2xl border border-[#c5cfbd] bg-white/70 p-5"><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#617159]">PEŁNA ODPOWIEDŹ</div><p className="mt-3 max-w-[76ch] whitespace-pre-line text-[16px] font-medium leading-7 text-[#242c20]">{selected.fullAnswer}</p></div>}
      </div>
    </section>

    <div className="flex items-center justify-between gap-3">
      <button disabled={!prev} onClick={()=>prev&&choose(prev.sourceNumber)} className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm font-bold disabled:opacity-30">← Poprzednie</button>
      <div className="text-xs font-bold text-neutral-500">{index+1} / {OTHER_STAGE2_QUESTIONS.length}</div>
      <button disabled={!next} onClick={()=>next&&choose(next.sourceNumber)} className="rounded-xl border border-[#66785a] bg-[#172015] px-4 py-3 text-sm font-bold text-[#dfe7d7] disabled:opacity-30">Następne →</button>
    </div>
  </div>;
}

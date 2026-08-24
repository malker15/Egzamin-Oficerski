"use client";

import React from "react";

type CheckItem = { id:string; text:string };

type Props = {
  kind:"theory"|"practical";
  keyPoints?:string[];
  openingCue?:string;
  checklist?:CheckItem[];
  checked:Record<string,boolean>;
  onToggleCheck:(id:string, value:boolean)=>void;
  fullAnswer:string;
  full:boolean;
  onToggleFull:()=>void;
};

export default function StudyAnswerPanel({kind,keyPoints=[],openingCue="",checklist=[],checked,onToggleCheck,fullAnswer,full,onToggleFull}:Props){
  const isTheory=kind==="theory";

  return <section className="overflow-hidden rounded-[1.75rem] border-2 border-[#809173] bg-[#eef2e8] text-[#11170f] shadow-[0_18px_55px_rgba(0,0,0,.32)]">
    <div className="border-b border-[#c5d0bc] bg-[#dfe7d7] px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[.18em] text-[#506047]">ODPOWIEDŹ // DO NAUKI</div>
          <h3 className="mt-1 text-xl font-black text-[#11170f]">{isTheory?"Powiedz w tej kolejności":"Wykonaj w tej kolejności"}</h3>
        </div>
        <span className="rounded-full border border-[#a8b79d] bg-[#f7f9f4] px-3 py-1.5 text-xs font-bold text-[#3f4d38]">{isTheory?"szkielet odpowiedzi":"schemat wykonania"}</span>
      </div>
      <p className="mt-2 max-w-[72ch] text-sm leading-6 text-[#56604f]">{isTheory?"Najpierw zapamiętaj punkty. Potem rozwiń każdy własnymi słowami.":"Najpierw zapamiętaj kolejność działań. Potem dopracuj szczegóły każdego kroku."}</p>
    </div>

    <div className="space-y-3 p-4 sm:p-6">
      {!isTheory&&openingCue&&<div className="rounded-2xl border border-[#afbdA5] bg-[#f9fbf7] p-4 sm:p-5">
        <div className="text-[10px] font-black uppercase tracking-[.16em] text-[#617159]">ZACZNIJ OD</div>
        <p className="mt-2 max-w-[72ch] text-[16px] font-semibold leading-7 text-[#1d261a]">{openingCue}</p>
      </div>}

      {isTheory?<div className="space-y-3">{keyPoints.map((text,index)=><div key={index} className="grid grid-cols-[2.6rem_1fr] gap-3 rounded-2xl border border-[#c6d0be] bg-white/80 p-4 sm:p-5">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#263422] text-base font-black text-white">{index+1}</div>
        <p className="max-w-[72ch] pt-1 text-[16px] font-medium leading-7 text-[#1b2318]">{text}</p>
      </div>)}</div>:<div className="space-y-3">{checklist.map((item,index)=>{
        const done=!!checked[item.id];
        return <label key={item.id} className={`grid cursor-pointer grid-cols-[1.7rem_1fr] gap-3 rounded-2xl border p-4 transition sm:p-5 ${done?"border-[#6f8b62] bg-[#dce8d5]":"border-[#c6d0be] bg-white/80 hover:border-[#95a789]"}`}>
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[#334b2d]" checked={done} onChange={e=>onToggleCheck(item.id,e.target.checked)}/>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[.15em] text-[#687861]">KROK {index+1}</div>
            <p className="mt-1 max-w-[72ch] text-[16px] font-medium leading-7 text-[#1b2318]">{item.text}</p>
          </div>
        </label>;
      })}</div>}

      <div className="pt-2">
        <button onClick={onToggleFull} className="min-h-12 rounded-xl border border-[#34472f] bg-[#1d281a] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#2a3925]">
          {full?"Ukryj pełną odpowiedź":"Czytaj pełną odpowiedź"}
        </button>
      </div>

      {full&&<article className="rounded-2xl border border-[#c6d0be] bg-white p-5 sm:p-6">
        <div className="text-[10px] font-black uppercase tracking-[.16em] text-[#687861]">PEŁNA ODPOWIEDŹ</div>
        <p className="mt-3 max-w-[76ch] whitespace-pre-line text-[16px] leading-7 text-[#242c20]">{fullAnswer}</p>
      </article>}
    </div>
  </section>;
}

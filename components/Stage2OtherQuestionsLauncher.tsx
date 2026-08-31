"use client";

import { useEffect, useState } from "react";
import OtherQuestionsPanel from "../app/stage2/OtherQuestionsPanel";

export default function Stage2OtherQuestionsLauncher(){
  const [open,setOpen]=useState(false);

  useEffect(()=>{
    if(!open)return;
    const old=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};
    window.addEventListener("keydown",onKey);
    return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",onKey)};
  },[open]);

  return <>
    <button
      onClick={()=>setOpen(true)}
      className="fixed right-4 top-24 z-[55] rounded-xl border border-[#718365] bg-[#172015]/95 px-4 py-3 text-left shadow-xl shadow-black/30 backdrop-blur transition hover:bg-[#202a1c] sm:right-6"
      aria-label="Otwórz inne możliwe pytania Etapu II"
    >
      <div className="font-mono text-[9px] font-black uppercase tracking-[.15em] text-[#91a482]">ETAP II // DODATKOWE</div>
      <div className="mt-0.5 text-sm font-black text-white">Inne pytania <span className="text-[#aebda3]">• 27</span></div>
    </button>

    {open&&<div className="fixed inset-0 z-[100] overflow-y-auto bg-neutral-950/98 text-neutral-100 backdrop-blur-sm">
      <div className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:py-8">
        <OtherQuestionsPanel onExit={()=>setOpen(false)}/>
      </div>
    </div>}
  </>;
}

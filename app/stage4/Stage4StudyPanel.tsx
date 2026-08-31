"use client";

import { useState } from "react";
import { extraShootingMaterial, stage4StudyMaterials, type Stage4StudyMaterial } from "./driveStudyMaterials";

function StudyCard({ material }: { material: Stage4StudyMaterial }) {
  const [showSources, setShowSources] = useState(false);

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-[#66785a] bg-[#dfe7d7] text-[#11170f] shadow-xl shadow-black/20">
      <div className="border-b border-[#aebaa4] bg-[#cbd6c1] px-5 py-4 sm:px-6">
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#516248]">MATERIAŁ Z FOLDERÓW // DO NAUKI</div>
        <h3 className="mt-2 text-xl font-black leading-tight sm:text-2xl">{material.title}</h3>
        <p className="mt-3 max-w-[78ch] text-sm font-medium leading-6 text-[#364033] sm:text-base">{material.summary}</p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#11170f] text-sm font-black text-[#e8eee2]">★</span>
            <h4 className="text-base font-black">To zapamiętaj</h4>
          </div>
          <div className="grid gap-2">
            {material.remember.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-xl border border-[#bcc7b3] bg-[#edf2e8] p-3.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#1a2418] text-xs font-black text-white">{index + 1}</div>
                <p className="text-sm font-semibold leading-6 text-[#222b20]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {material.blocks.map((block) => (
          <div key={block.title} className="rounded-2xl border border-[#b4c0ab] bg-[#f4f7f1] p-4 sm:p-5">
            <div className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#607057]">SEKWENCJA</div>
            <h4 className="mt-1 text-base font-black sm:text-lg">{block.title}</h4>
            <ol className="mt-4 space-y-2.5">
              {block.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-[#2d3829]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#8fa084] bg-white text-xs font-black">{index + 1}</span>
                  <span className="pt-0.5 font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        {material.phrases && material.phrases.length > 0 && (
          <div className="rounded-2xl border border-[#839474] bg-[#182116] p-4 text-[#eef3e9] sm:p-5">
            <div className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-[#aabd9a]">KOMENDY / MELDUNKI</div>
            <div className="mt-3 space-y-2">
              {material.phrases.map((phrase) => (
                <div key={phrase} className="rounded-xl border border-[#34432f] bg-[#0f150e] px-3.5 py-3 text-sm font-semibold leading-6">{phrase}</div>
              ))}
            </div>
          </div>
        )}

        {material.sourceNote && (
          <div className="rounded-xl border border-amber-700/30 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">{material.sourceNote}</div>
        )}

        <button
          type="button"
          onClick={() => setShowSources((v) => !v)}
          className="text-sm font-black text-[#44543d] underline decoration-[#7d9072] underline-offset-4"
        >
          {showSources ? "Ukryj użyte materiały" : `Użyte materiały (${material.sources.length})`}
        </button>
        {showSources && (
          <ul className="grid gap-1.5 rounded-xl border border-[#bdc7b5] bg-[#edf2e9] p-4 text-xs font-semibold leading-5 text-[#44513f] sm:text-sm">
            {material.sources.map((source) => <li key={source}>• {source}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}

export function Stage4StudyPanel({ stationId }: { stationId: string }) {
  const material = stage4StudyMaterials[stationId];
  if (!material) return null;
  return <StudyCard material={material} />;
}

export function Stage4ShootingExtra() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group w-full rounded-[1.5rem] border border-[#526247] bg-[#111810] p-5 text-left transition hover:-translate-y-0.5 hover:bg-[#172015] sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#69785d] bg-[#0a0f09] text-sm font-black text-[#dfe7d7]">+</div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-[#8da07f]">MATERIAŁ DODATKOWY Z DYSKU</div>
              <h3 className="mt-1 font-black text-white">Strzelanie przygotowawcze / sprawdzające nr 1</h3>
              <p className="mt-2 text-sm leading-5 text-neutral-400">Pistolet i karabinek: warunki strzelania, kolejność czynności, awaryjna wymiana magazynka i kryteria zaliczenia.</p>
            </div>
            <span className="text-neutral-500 transition group-hover:translate-x-1 group-hover:text-white">→</span>
          </div>
        </button>
      ) : (
        <div className="space-y-3">
          <button type="button" onClick={() => setOpen(false)} className="text-sm font-bold text-neutral-400 hover:text-white">← Schowaj materiał dodatkowy</button>
          <StudyCard material={extraShootingMaterial} />
        </div>
      )}
    </div>
  );
}

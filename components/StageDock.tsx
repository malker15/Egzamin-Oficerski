"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const stages = [
  { href: "/", roman: "⌂", label: "Start", exact: true },
  { href: "/stage1", roman: "I", label: "Test wiedzy" },
  { href: "/stage2", roman: "II", label: "Teoria i praktyka" },
  { href: "/stage3", roman: "III", label: "Musztra" },
  { href: "/stage4", roman: "IV", label: "Pętla taktyczna" },
];

export default function StageDock() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 px-3" aria-label="Nawigacja egzaminu oficerskiego">
      <div className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl border border-[#3d4837] bg-[#0b0e0a]/94 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {stages.map((stage) => {
          const active = stage.exact ? pathname === stage.href : pathname.startsWith(stage.href);
          return (
            <Link
              key={stage.href}
              href={stage.href}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition sm:px-4 ${
                active
                  ? "bg-[#c5ccb9] text-[#171b15] shadow-sm"
                  : "text-[#a3aa9c] hover:bg-[#171d14] hover:text-white"
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-lg text-[11px] font-black ${
                  active ? "bg-[#1a2017] text-[#dce2d3]" : "bg-[#1a2017] text-[#9ca893]"
                }`}
              >
                {stage.roman}
              </span>
              <span className="hidden sm:inline">{stage.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

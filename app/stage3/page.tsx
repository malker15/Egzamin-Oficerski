"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Topic = {
  id: string;
  number: number;
  title: string;
  opening: string[];
  safety: { forbid: string[]; require: string[] };
  commands: string;
  demo: string[];
  explanation: string[];
  practice: string[];
  react: string[];
  stop: string;
  closing: string[];
};

type View = "home" | "browse" | "topic" | "training" | "random";
type BrowseMode = "open" | "train";
type ProgressEntry = {
  attempts: number;
  mastered: boolean;
  lastStep: number;
  lastSeen: number;
};
type ProgressMap = Record<string, ProgressEntry>;

type LearningBlock = {
  id: string;
  label: string;
  hint: string;
  items?: string[];
  safety?: Topic["safety"];
  tone?: "default" | "command" | "warning" | "finish";
};

const LS_KEY = "officer_stage3_progress_v1";

const schema = [
  { no: "01", label: "Otwarcie", hint: "Baczność → temat → Spocznij" },
  { no: "02", label: "Cel", hint: "Po co uczysz tego zagadnienia" },
  { no: "03", label: "Bezpieczeństwo", hint: "Zabraniam / Nakazuję" },
  { no: "04", label: "Komendy", hint: "Na jakie komendy wykonuje się czynność" },
  { no: "05", label: "Pokaz wzorowy", hint: "Wykonanie całości bez objaśnienia" },
  { no: "06", label: "Pokaz z objaśnieniem", hint: "Pełne omówienie zagadnienia" },
  { no: "07", label: "Ćwiczenie", hint: "Tempa → bez temp, zgodnie z tematem" },
  { no: "08", label: "Reagowanie", hint: "Koryguj błędy podczas ćwiczenia" },
  { no: "09", label: "Przerwij ćwiczenie", hint: "Sygnał 30 s przed końcem" },
  { no: "10", label: "Część końcowa", hint: "Zbiórka → podsumowanie → kontrola → koniec" },
];

function emptyProgress(): ProgressEntry {
  return { attempts: 0, mastered: false, lastStep: 0, lastSeen: 0 };
}

function blocksFor(topic: Topic): LearningBlock[] {
  return [
    {
      id: "opening",
      label: "Otwarcie",
      hint: "Baczność → podaj treść zagadnienia → Spocznij",
      items: topic.opening.slice(0, 3),
    },
    {
      id: "goal",
      label: "Cel",
      hint: "Powiedz, czego uczysz i do czego przyda się to w służbie",
      items: topic.opening.slice(3),
    },
    {
      id: "safety",
      label: "Warunki bezpieczeństwa",
      hint: "Najpierw ZABRANIAM, potem NAKAZUJĘ",
      safety: topic.safety,
      tone: "warning",
    },
    {
      id: "commands",
      label: "Komendy",
      hint: "Podaj komendy, na jakie wykonuje się daną czynność",
      items: [topic.commands],
      tone: "command",
    },
    {
      id: "demo",
      label: "Pokaz wzorowy",
      hint: "Zapowiedz pokaz i wykonaj go, podając komendy dla siebie",
      items: topic.demo,
    },
    {
      id: "explanation",
      label: "Pokaz z objaśnieniem",
      hint: "To najobszerniejsza część — referujesz pełny opis zagadnienia",
      items: topic.explanation,
    },
    {
      id: "practice",
      label: "Ćwiczenie praktyczne",
      hint: "Prowadź ćwiczenie w kolejności zapisanej dla danego zagadnienia",
      items: topic.practice,
    },
    {
      id: "react",
      label: "REAGOWAĆ",
      hint: "Wychwytuj i koryguj błędy od początku ćwiczenia",
      items: topic.react,
      tone: "warning",
    },
    {
      id: "stop",
      label: "PRZERWIJ ĆWICZENIE",
      hint: "30 sekund przed końcem — sygnał od egzaminującego",
      items: [topic.stop],
      tone: "warning",
    },
    {
      id: "closing",
      label: "Część końcowa",
      hint: "Zbiórka, podsumowanie, błędy, literatura, kontrola i zakończenie",
      items: topic.closing,
      tone: "finish",
    },
  ];
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function SchemaFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-5" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-5"}>
      {schema.map((step, i) => (
        <div
          key={step.no}
          className="relative rounded-2xl border border-[#3b4635] bg-[#0c0f0b]/90 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-[#829574]">{step.no}</span>
            {i < schema.length - 1 && <span className="text-[#47523f]">→</span>}
          </div>
          <div className="mt-2 text-sm font-bold text-[#e4e8dc]">{step.label}</div>
          {!compact && <p className="mt-1.5 text-xs leading-5 text-[#889181]">{step.hint}</p>}
        </div>
      ))}
    </div>
  );
}

function BlockBody({ block }: { block: LearningBlock }) {
  if (block.safety) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-red-950/70 bg-red-950/15 p-4">
          <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-red-300/80">Zabraniam</div>
          <ul className="space-y-2 text-sm leading-6 text-neutral-200">
            {block.safety.forbid.map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-[#46533f] bg-[#1a2117]/70 p-4">
          <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#a9bd96]">Nakazuję</div>
          <ul className="space-y-2 text-sm leading-6 text-neutral-200">
            {block.safety.require.map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  const items = block.items ?? [];
  if (block.id === "react") {
    return (
      <ul className="space-y-2 text-sm leading-6 text-neutral-200 sm:text-base">
        {items.map((item, i) => <li key={i} className="rounded-xl border border-amber-950/60 bg-amber-950/10 px-4 py-3">• {item}</li>)}
      </ul>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <p
          key={i}
          className={
            block.tone === "command"
              ? "rounded-xl border border-[#56644d] bg-[#141b12] px-4 py-3 font-mono text-sm font-semibold leading-6 text-[#d6dec9]"
              : block.tone === "warning"
                ? "rounded-xl border border-amber-900/40 bg-amber-950/10 px-4 py-3 text-sm font-semibold leading-6 text-amber-100/90"
                : "text-sm leading-7 text-neutral-200 sm:text-base"
          }
        >
          {item}
        </p>
      ))}
    </div>
  );
}

function FullTopic({ topic }: { topic: Topic }) {
  const blocks = blocksFor(topic);
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <section key={block.id} className="rounded-2xl border border-[#313a2d] bg-[#10130e]/95 p-5 sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#53614a] bg-[#1a2117] font-mono text-xs font-black text-[#afbf9f]">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="font-bold text-white">{block.label}</h3>
              <p className="mt-0.5 text-xs leading-5 text-[#7f8978]">{block.hint}</p>
            </div>
          </div>
          <BlockBody block={block} />
        </section>
      ))}
    </div>
  );
}

export default function Stage3Page() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [view, setView] = useState<View>("home");
  const [browseMode, setBrowseMode] = useState<BrowseMode>("open");
  const [selected, setSelected] = useState<Topic | null>(null);
  const [schemaOpen, setSchemaOpen] = useState(false);

  const [progress, setProgress] = useState<ProgressMap>({});
  const [progressReady, setProgressReady] = useState(false);

  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const [randomTopic, setRandomTopic] = useState<Topic | null>(null);
  const [randomStartedAt, setRandomStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [answerShown, setAnswerShown] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setProgress(JSON.parse(raw) as ProgressMap);
    } catch {
      // Jeżeli lokalny zapis jest uszkodzony, zaczynamy od pustego postępu.
    } finally {
      setProgressReady(true);
    }
  }, []);

  useEffect(() => {
    if (!progressReady) return;
    localStorage.setItem(LS_KEY, JSON.stringify(progress));
  }, [progress, progressReady]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        location.href = "/";
        return;
      }
      if (!active) return;
      setReady(true);

      try {
        const urls = Array.from({ length: 8 }, (_, i) => `/stage3/topics_${String(i + 1).padStart(2, "0")}.json`);
        const chunks = await Promise.all(
          urls.map(async (url) => {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error(`Nie udało się wczytać ${url}`);
            return (await res.json()) as Topic[];
          })
        );
        if (!active) return;
        const loaded = chunks.flat().sort((a, b) => a.number - b.number);
        setTopics(loaded);
      } catch (e) {
        if (!active) return;
        setLoadError(e instanceof Error ? e.message : "Nie udało się wczytać bazy musztry.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (randomStartedAt === null) return;
    const tick = () => setElapsed(Math.floor((Date.now() - randomStartedAt) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [randomStartedAt]);

  const masteredCount = useMemo(
    () => topics.filter((topic) => progress[topic.id]?.mastered).length,
    [topics, progress]
  );
  const attemptedCount = useMemo(
    () => topics.filter((topic) => (progress[topic.id]?.attempts ?? 0) > 0).length,
    [topics, progress]
  );

  function patchProgress(topicId: string, patch: Partial<ProgressEntry>) {
    setProgress((prev) => ({
      ...prev,
      [topicId]: { ...(prev[topicId] ?? emptyProgress()), ...patch, lastSeen: Date.now() },
    }));
  }

  function startTraining(topic: Topic) {
    setSelected(topic);
    setStep(progress[topic.id]?.lastStep ?? 0);
    setRevealed(false);
    setView("training");
  }

  function openTopic(topic: Topic) {
    setSelected(topic);
    patchProgress(topic.id, {});
    setView("topic");
  }

  function finishTraining(topic: Topic) {
    const old = progress[topic.id] ?? emptyProgress();
    patchProgress(topic.id, { attempts: old.attempts + 1, lastStep: 0 });
    setSelected(topic);
    setView("topic");
  }

  function drawRandom() {
    if (!topics.length) return;
    const pool = randomTopic && topics.length > 1 ? topics.filter((t) => t.id !== randomTopic.id) : topics;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setRandomTopic(next);
    setRandomStartedAt(null);
    setElapsed(0);
    setAnswerShown(false);
  }

  function enterRandom() {
    setView("random");
    setTimeout(drawRandom, 0);
  }

  function startRandomAttempt() {
    setRandomStartedAt(Date.now());
    setElapsed(0);
    setAnswerShown(false);
  }

  function showRandomAnswer() {
    if (!randomTopic) return;
    setRandomStartedAt(null);
    if (!answerShown) {
      const old = progress[randomTopic.id] ?? emptyProgress();
      patchProgress(randomTopic.id, { attempts: old.attempts + 1 });
    }
    setAnswerShown(true);
  }

  function goHome() {
    setView("home");
    setSelected(null);
    setRandomStartedAt(null);
    setAnswerShown(false);
  }

  if (!ready) {
    return <main className="grid min-h-screen place-items-center bg-[#090b08] text-[#8b9482]">Wczytuję…</main>;
  }

  return (
    <main className="mil-app-shell min-h-screen bg-[#090b08] px-4 pb-24 pt-8 text-neutral-100 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => location.href = "/"} className="rounded-xl border border-[#35402f] bg-[#0d100c] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#9ca993] hover:border-[#59684f] hover:text-white">
              ← Start
            </button>
            {view !== "home" && (
              <button onClick={goHome} className="rounded-xl border border-[#35402f] bg-[#0d100c] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#9ca993] hover:border-[#59684f] hover:text-white">
                Etap III
              </button>
            )}
          </div>
          <button onClick={() => setSchemaOpen(true)} className="rounded-xl border border-[#66765a] bg-[#1a2117] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#cbd6bd] hover:bg-[#20291c]">
            Schemat odpowiedzi
          </button>
        </header>

        {loadError && (
          <div className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/20 p-5 text-sm text-red-200">
            {loadError}
          </div>
        )}

        {view === "home" && (
          <>
            <section className="mil-hero relative overflow-hidden rounded-[2rem] border border-[#394334] bg-[#11140f]/95 p-6 shadow-2xl shadow-black/30 sm:p-9">
              <div className="mil-corner mil-corner-tl" />
              <div className="mil-corner mil-corner-br" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4b5843] bg-[#0c0f0b]/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#a9b49d]">
                  ETAP III <span className="text-[#596452]">•</span> MUSZTRA <span className="text-[#596452]">•</span> 22 ZAGADNIENIA
                </div>
                <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">Naucz się prowadzić zagadnienie od pierwszej komendy do zakończenia.</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[#a4ac9d] sm:text-base">
                  Każde zagadnienie zachowuje pełną treść z materiału. Uczysz się stałego schematu, potem konkretnego tekstu i na końcu losujesz temat jak na egzaminie.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#35402f] bg-[#0b0e0a]/85 p-4">
                    <div className="text-2xl font-black text-[#dce2d3]">{topics.length || "—"}</div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6f7b67]">Zagadnienia</div>
                  </div>
                  <div className="rounded-2xl border border-[#35402f] bg-[#0b0e0a]/85 p-4">
                    <div className="text-2xl font-black text-[#b8c6a7]">{attemptedCount}</div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6f7b67]">Przećwiczone</div>
                  </div>
                  <div className="rounded-2xl border border-[#35402f] bg-[#0b0e0a]/85 p-4">
                    <div className="text-2xl font-black text-[#9fb48a]">{masteredCount}</div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6f7b67]">Oznaczone „znam”</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <button
                disabled={loading || !topics.length}
                onClick={enterRandom}
                className="group rounded-[1.6rem] border border-[#617255] bg-[#182015] p-6 text-left transition hover:-translate-y-0.5 hover:bg-[#1d2819] disabled:opacity-50"
              >
                <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#8fa17e]">TRYB // EGZAMIN</div>
                <h2 className="mt-3 text-xl font-black text-white">Losuj zagadnienie</h2>
                <p className="mt-2 text-sm leading-6 text-[#9da795]">Dostajesz tylko temat. Referujesz całość z pamięci, a schemat możesz podejrzeć w każdej chwili.</p>
                <div className="mt-5 text-sm font-bold text-[#c6d2ba]">Rozpocznij →</div>
              </button>

              <button
                disabled={loading || !topics.length}
                onClick={() => { setBrowseMode("train"); setView("browse"); }}
                className="group rounded-[1.6rem] border border-[#3a4534] bg-[#11150f] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#5d6d53] hover:bg-[#151a12] disabled:opacity-50"
              >
                <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#77866c]">TRYB // NAUKA</div>
                <h2 className="mt-3 text-xl font-black text-white">Krok po kroku</h2>
                <p className="mt-2 text-sm leading-6 text-[#929b8b]">Wybierz zagadnienie i przejdź przez 10 bloków. Najpierw przypomnij sobie treść, potem ją odsłoń.</p>
                <div className="mt-5 text-sm font-bold text-[#b9c5ad]">Wybierz temat →</div>
              </button>

              <button
                disabled={loading || !topics.length}
                onClick={() => { setBrowseMode("open"); setView("browse"); }}
                className="group rounded-[1.6rem] border border-[#3a4534] bg-[#11150f] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#5d6d53] hover:bg-[#151a12] disabled:opacity-50"
              >
                <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#77866c]">BAZA // 22</div>
                <h2 className="mt-3 text-xl font-black text-white">Wszystkie zagadnienia</h2>
                <p className="mt-2 text-sm leading-6 text-[#929b8b]">Otwórz dowolny temat i zobacz pełną odpowiedź rozbitą na czytelne bloki schematu.</p>
                <div className="mt-5 text-sm font-bold text-[#b9c5ad]">Otwórz bazę →</div>
              </button>
            </section>

            <section className="mt-8 rounded-[1.75rem] border border-[#30392c] bg-[#0e110d]/90 p-5 sm:p-7">
              <div className="mb-5">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-[#78866f]">Mapa odpowiedzi</div>
                <h2 className="mt-2 text-xl font-bold text-white">Jeden schemat dla każdego zagadnienia</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#899282]">Najpierw zapamiętaj kolejność bloków. Potem do każdego z nich dokładasz treść właściwą dla wylosowanego tematu.</p>
              </div>
              <SchemaFlow />
            </section>
          </>
        )}

        {view === "browse" && (
          <section>
            <div className="mb-6">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#79886f]">{browseMode === "train" ? "NAUKA KROK PO KROKU" : "BAZA ZAGADNIEŃ"}</div>
              <h1 className="mt-2 text-3xl font-black text-white">{browseMode === "train" ? "Wybierz zagadnienie do treningu" : "22 zagadnienia z musztry"}</h1>
              <p className="mt-2 text-sm leading-6 text-[#90998a]">{browseMode === "train" ? "Po wyborze zaczniesz od pierwszego bloku schematu." : "Kliknij temat, aby zobaczyć jego pełną treść i uruchomić naukę blokami."}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {topics.map((topic) => {
                const p = progress[topic.id] ?? emptyProgress();
                return (
                  <button
                    key={topic.id}
                    onClick={() => browseMode === "train" ? startTraining(topic) : openTopic(topic)}
                    className="group rounded-2xl border border-[#30392c] bg-[#10130e] p-5 text-left transition hover:border-[#607056] hover:bg-[#151a12]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#4d5b45] bg-[#171d14] font-mono text-sm font-black text-[#b2c1a4]">{String(topic.number).padStart(2, "0")}</div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold leading-6 text-white">{topic.title}</h2>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.13em]">
                          <span className="rounded-full border border-[#343e30] px-2 py-1 text-[#71806a]">Próby: {p.attempts}</span>
                          {p.mastered && <span className="rounded-full border border-[#506546] bg-[#172016] px-2 py-1 text-[#a8bd96]">Znam</span>}
                        </div>
                      </div>
                      <span className="text-[#697461] transition group-hover:translate-x-1">→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {view === "topic" && selected && (
          <section>
            <div className="mb-6 rounded-[1.75rem] border border-[#394334] bg-[#11140f] p-6 sm:p-8">
              <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#7f8e74]">ZAGADNIENIE {String(selected.number).padStart(2, "0")} / 22</div>
              <h1 className="mt-3 max-w-4xl text-2xl font-black leading-tight text-white sm:text-4xl">{selected.title}</h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => startTraining(selected)} className="rounded-xl bg-[#c4cdb8] px-4 py-2.5 text-sm font-black text-[#151914] hover:bg-white">Nauka krok po kroku</button>
                <button
                  onClick={() => {
                    const old = progress[selected.id] ?? emptyProgress();
                    patchProgress(selected.id, { mastered: !old.mastered });
                  }}
                  className="rounded-xl border border-[#4d5b45] bg-[#171d14] px-4 py-2.5 text-sm font-bold text-[#bdc9b2]"
                >
                  {progress[selected.id]?.mastered ? "Oznacz: do powtórki" : "Oznacz: znam"}
                </button>
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#7c8a72]">Pełna odpowiedź</div>
                <p className="mt-1 text-sm text-[#848d7f]">Treść jest rozbita na bloki, ale nie została skrócona.</p>
              </div>
            </div>
            <FullTopic topic={selected} />
          </section>
        )}

        {view === "training" && selected && (() => {
          const blocks = blocksFor(selected);
          const current = blocks[Math.min(step, blocks.length - 1)];
          return (
            <section>
              <div className="mb-5 rounded-[1.75rem] border border-[#394334] bg-[#11140f] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs font-bold tracking-[0.18em] text-[#7f8e74]">ZAGADNIENIE {String(selected.number).padStart(2, "0")} / 22</div>
                    <h1 className="mt-2 max-w-4xl text-xl font-black leading-tight text-white sm:text-3xl">{selected.title}</h1>
                  </div>
                  <div className="rounded-xl border border-[#44503e] bg-[#0b0e0a] px-4 py-2 font-mono text-sm font-black text-[#aebca1]">{step + 1} / {blocks.length}</div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#22291f]">
                  <div className="h-full rounded-full bg-[#829773] transition-all" style={{ width: `${((step + 1) / blocks.length) * 100}%` }} />
                </div>
              </div>

              <div className="mb-4">
                <SchemaFlow compact />
              </div>

              <section className="rounded-[1.75rem] border border-[#48543f] bg-[#11150f] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#66755b] bg-[#1b2418] font-mono text-sm font-black text-[#c4d0b8]">{String(step + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-[#819176]">Aktualny blok</div>
                    <h2 className="mt-1 text-2xl font-black text-white">{current.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#929d8b]">{current.hint}</p>
                  </div>
                </div>

                {!revealed ? (
                  <div className="mt-8 rounded-2xl border border-dashed border-[#4c5944] bg-[#0b0e0a]/70 p-7 text-center">
                    <div className="text-sm font-semibold text-[#a7b39d]">Najpierw powiedz ten fragment z pamięci.</div>
                    <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-[#6f7869]">Gdy skończysz, odsłoń treść i porównaj ją punkt po punkcie z tym, co powiedziałeś.</p>
                    <button onClick={() => setRevealed(true)} className="mt-5 rounded-xl bg-[#c4cdb8] px-5 py-2.5 text-sm font-black text-[#151914] hover:bg-white">Pokaż treść bloku</button>
                  </div>
                ) : (
                  <div className="mt-8 rounded-2xl border border-[#30392c] bg-[#0c0f0b] p-5 sm:p-6">
                    <BlockBody block={current} />
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#283125] pt-5">
                  <button
                    disabled={step === 0}
                    onClick={() => { setStep((s) => Math.max(0, s - 1)); setRevealed(false); }}
                    className="rounded-xl border border-[#3d4937] px-4 py-2.5 text-sm font-bold text-[#aab6a1] disabled:opacity-30"
                  >
                    ← Poprzedni
                  </button>
                  {step < blocks.length - 1 ? (
                    <button
                      onClick={() => {
                        const next = step + 1;
                        setStep(next);
                        setRevealed(false);
                        patchProgress(selected.id, { lastStep: next });
                      }}
                      className="rounded-xl border border-[#5a6b50] bg-[#1a2317] px-5 py-2.5 text-sm font-black text-[#c8d3bd]"
                    >
                      Następny blok →
                    </button>
                  ) : (
                    <button onClick={() => finishTraining(selected)} className="rounded-xl bg-[#c4cdb8] px-5 py-2.5 text-sm font-black text-[#151914] hover:bg-white">
                      Zakończ trening
                    </button>
                  )}
                </div>
              </section>
            </section>
          );
        })()}

        {view === "random" && (
          <section>
            <div className="mb-6 text-center">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#849477]">SYMULACJA // LOSOWANIE</div>
              <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Wylosowane zagadnienie</h1>
              <p className="mt-2 text-sm text-[#87917f]">Masz tylko temat. Schemat możesz podejrzeć, ale treść odpowiedzi pozostaje ukryta do sprawdzenia.</p>
            </div>

            {randomTopic && (
              <>
                <div className="rounded-[2rem] border border-[#66775a] bg-[#151b13] p-7 text-center shadow-2xl shadow-black/30 sm:p-10">
                  <div className="font-mono text-xs font-bold tracking-[0.22em] text-[#819276]">ZAGADNIENIE {String(randomTopic.number).padStart(2, "0")} / 22</div>
                  <h2 className="mx-auto mt-4 max-w-4xl text-2xl font-black leading-tight text-white sm:text-4xl">{randomTopic.title}</h2>

                  <div className="mx-auto mt-7 max-w-xs rounded-2xl border border-[#3f4a39] bg-[#0b0e0a] p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#687361]">{randomStartedAt ? "Czas próby" : answerShown ? "Próba zakończona" : "Gotowy?"}</div>
                    <div className="mt-1 font-mono text-4xl font-black tabular-nums text-[#d8dfcf]">{formatTime(elapsed)}</div>
                  </div>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {!randomStartedAt && !answerShown && (
                      <button onClick={startRandomAttempt} className="rounded-xl bg-[#c4cdb8] px-5 py-3 text-sm font-black text-[#151914] hover:bg-white">Rozpocznij próbę</button>
                    )}
                    {randomStartedAt && (
                      <button onClick={showRandomAnswer} className="rounded-xl bg-[#c4cdb8] px-5 py-3 text-sm font-black text-[#151914] hover:bg-white">Skończyłem — sprawdź odpowiedź</button>
                    )}
                    {!randomStartedAt && !answerShown && (
                      <button onClick={showRandomAnswer} className="rounded-xl border border-[#4c5944] px-5 py-3 text-sm font-bold text-[#acb8a2]">Pokaż odpowiedź bez timera</button>
                    )}
                    <button onClick={drawRandom} className="rounded-xl border border-[#4c5944] px-5 py-3 text-sm font-bold text-[#acb8a2]">Losuj inne</button>
                  </div>
                </div>

                {answerShown && (
                  <div className="mt-7">
                    <div className="mb-5 rounded-2xl border border-[#3c4736] bg-[#10140e] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#7f8e73]">Samoocena</div>
                          <p className="mt-1 text-sm text-[#8f9989]">Porównaj swoją wypowiedź z pełnym tekstem poniżej.</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => patchProgress(randomTopic.id, { mastered: false })} className="rounded-xl border border-amber-900/50 bg-amber-950/10 px-4 py-2 text-sm font-bold text-amber-200/90">Do powtórki</button>
                          <button onClick={() => patchProgress(randomTopic.id, { mastered: true })} className="rounded-xl border border-[#53664a] bg-[#172016] px-4 py-2 text-sm font-bold text-[#b6c9a8]">Znam</button>
                        </div>
                      </div>
                    </div>
                    <FullTopic topic={randomTopic} />
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>

      {schemaOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm" onMouseDown={() => setSchemaOpen(false)}>
          <div className="mx-auto my-6 max-w-5xl rounded-[2rem] border border-[#4a5743] bg-[#0d100c] p-5 shadow-2xl sm:p-8" onMouseDown={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-[#839276]">Schemat zagadnienia</div>
                <h2 className="mt-2 text-2xl font-black text-white">Kolejność, którą masz mieć w głowie</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8d9686]">To mapa całej wypowiedzi. W treningu każdy z tych bloków odsłaniasz osobno.</p>
              </div>
              <button onClick={() => setSchemaOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#3c4736] text-xl text-[#9da895] hover:text-white">×</button>
            </div>
            <SchemaFlow />
          </div>
        </div>
      )}
    </main>
  );
}

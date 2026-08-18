"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  commanderFramework,
  examinerCriteria,
  peerCriteria,
  tacticalStations,
  type TacticalStation,
} from "./data";

type Progress = Record<string, { attempts: number; bestScore: number; lastScore: number; updatedAt: number }>;
type BinaryMap = Record<number, boolean>;
type View = "home" | "framework" | "station" | "practice" | "score";

const LS = "officer_stage4_progress_v1";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function grade(score: number) {
  if (score < 2.75) return { value: 2, label: "niedostateczny" };
  if (score <= 3.5) return { value: 3, label: "dostateczny" };
  if (score <= 4.5) return { value: 4, label: "dobry" };
  return { value: 5, label: "bardzo dobry" };
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("rounded-[1.5rem] border border-neutral-800 bg-neutral-900/85 p-5 shadow-sm", className)}>{children}</section>;
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "amber" }) {
  const style =
    tone === "green"
      ? "border-emerald-900/70 bg-emerald-950/40 text-emerald-300"
      : tone === "amber"
      ? "border-amber-900/70 bg-amber-950/40 text-amber-300"
      : "border-neutral-700 bg-neutral-950 text-neutral-300";
  return <span className={cx("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider", style)}>{children}</span>;
}

function Button({ children, onClick, secondary = false, disabled = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40",
        secondary ? "border border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800" : "bg-white text-neutral-950 hover:bg-neutral-200"
      )}
    >
      {children}
    </button>
  );
}

function CriteriaList({ title, items, values, onChange }: { title: string; items: string[]; values: BinaryMap; onChange: (next: BinaryMap) => void }) {
  return (
    <Card>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-neutral-500">1 = wykonano w sposób zrozumiały • 0 = pominięto albo wykonano nieczytelnie</p>
      <div className="mt-4 space-y-2">
        {items.map((item, index) => (
          <label key={item} className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950/70 p-3 text-sm hover:border-neutral-700">
            <input
              type="checkbox"
              checked={!!values[index]}
              onChange={(e) => onChange({ ...values, [index]: e.target.checked })}
              className="mt-0.5 h-4 w-4"
            />
            <span className="leading-5 text-neutral-300">{item}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}

export default function Stage4Page() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [selectedId, setSelectedId] = useState(tacticalStations[0].id);
  const [progress, setProgress] = useState<Progress>({});
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [executionChecks, setExecutionChecks] = useState<Record<string, boolean>>({});
  const [examiner, setExaminer] = useState<BinaryMap>({});
  const [peer, setPeer] = useState<BinaryMap>({});
  const [savedAttempt, setSavedAttempt] = useState(false);

  const station = useMemo<TacticalStation>(() => tacticalStations.find((x) => x.id === selectedId) ?? tacticalStations[0], [selectedId]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        location.href = "/";
        return;
      }
      try {
        const raw = localStorage.getItem(LS);
        if (raw) setProgress(JSON.parse(raw));
      } catch {}
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LS, JSON.stringify(progress));
  }, [progress, ready]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const examinerCount = examinerCriteria.reduce((sum, _, i) => sum + (examiner[i] ? 1 : 0), 0);
  const peerCount = peerCriteria.reduce((sum, _, i) => sum + (peer[i] ? 1 : 0), 0);
  const trainingScore = Number((examinerCount * 0.8 + peerCount / 5).toFixed(2));
  const trainingGrade = grade(trainingScore);

  const allExecutionItems = useMemo(
    () => station.goodExecution.flatMap((phase, pIndex) => phase.items.map((text, i) => ({ key: `${pIndex}-${i}`, text, phase: phase.title }))),
    [station]
  );
  const executionDone = allExecutionItems.filter((x) => executionChecks[x.key]).length;

  const totalAttempts = Object.values(progress).reduce((sum, x) => sum + x.attempts, 0);
  const stationsPracticed = Object.keys(progress).length;

  function openStation(id: string) {
    setSelectedId(id);
    setView("station");
    setRunning(false);
    setSeconds(0);
    setExecutionChecks({});
    setExaminer({});
    setPeer({});
    setSavedAttempt(false);
  }

  function startPractice() {
    setExecutionChecks({});
    setExaminer({});
    setPeer({});
    setSeconds(0);
    setSavedAttempt(false);
    setRunning(true);
    setView("practice");
  }

  function finishPractice() {
    setRunning(false);
    setView("score");
  }

  function saveAttempt() {
    if (savedAttempt) return;
    setProgress((prev) => {
      const old = prev[station.id] ?? { attempts: 0, bestScore: 0, lastScore: 0, updatedAt: 0 };
      return {
        ...prev,
        [station.id]: {
          attempts: old.attempts + 1,
          bestScore: Math.max(old.bestScore, trainingScore),
          lastScore: trainingScore,
          updatedAt: Date.now(),
        },
      };
    });
    setSavedAttempt(true);
  }

  if (!ready) return <main className="grid min-h-screen place-items-center bg-neutral-950 text-neutral-400">Wczytuję Etap IV…</main>;

  return (
    <main className="min-h-screen bg-neutral-950 px-4 pb-28 pt-8 text-neutral-100 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-wrap items-start gap-4">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge tone="green">ETAP IV • TRENING</Badge>
              <Badge>Źródło: plan egzaminu 2025</Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Pętla taktyczna</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400 sm:text-base">
              Ten moduł skupia się na tym, jak ma wyglądać dobrze wykonane zadanie dowódcze: od zrozumienia sytuacji i postawienia zadania, przez kontrolę podwładnych i reakcję na zmianę sytuacji, aż po AAR.
            </p>
          </div>
          {view !== "home" && (
            <div className="ml-auto">
              <Button secondary onClick={() => setView("home")}>Menu Etapu IV</Button>
            </div>
          )}
        </header>

        {view === "home" && (
          <div className="space-y-6">
            <section className="grid gap-3 sm:grid-cols-3">
              <Card className="p-4"><div className="text-xs uppercase tracking-wider text-neutral-500">Punkty treningowe</div><div className="mt-1 text-3xl font-black">7</div></Card>
              <Card className="p-4"><div className="text-xs uppercase tracking-wider text-neutral-500">Przećwiczone</div><div className="mt-1 text-3xl font-black">{stationsPracticed} / 7</div></Card>
              <Card className="p-4"><div className="text-xs uppercase tracking-wider text-neutral-500">Próby</div><div className="mt-1 text-3xl font-black">{totalAttempts}</div></Card>
            </section>

            <button onClick={() => setView("framework")} className="group w-full rounded-[1.75rem] border border-neutral-700 bg-white p-6 text-left text-neutral-950 transition hover:bg-neutral-200 sm:p-7">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-950 text-lg font-black text-white">★</div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Zacznij tutaj</div>
                  <h2 className="mt-1 text-xl font-black">Jak wygląda dobrze wykonane zadanie?</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">Poznaj wspólną ramę dowodzenia wynikającą z kryteriów oceny. To ona powinna być odruchem na każdym punkcie.</p>
                </div>
                <span className="text-2xl transition group-hover:translate-x-1">→</span>
              </div>
            </button>

            <div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Stacje</p><h2 className="mt-1 text-2xl font-bold">Wybierz zadanie</h2></div>
                <p className="hidden text-xs text-neutral-500 sm:block">6 punktów egzaminacyjnych + marsz między punktami</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {tacticalStations.map((s) => {
                  const p = progress[s.id];
                  return (
                    <button key={s.id} onClick={() => openStation(s.id)} className="group rounded-[1.5rem] border border-neutral-800 bg-neutral-900/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-neutral-600 hover:bg-neutral-900">
                      <div className="flex items-start gap-4">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neutral-700 bg-neutral-950 text-sm font-black">{s.number}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{s.shortTitle}</h3>{p && <Badge tone="green">{p.attempts} prób</Badge>}</div>
                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-neutral-400">{s.title}</p>
                          {p && <p className="mt-3 text-xs text-neutral-500">Najlepszy wynik treningowy: <span className="font-semibold text-neutral-300">{p.bestScore.toFixed(2)} / 5.00</span></p>}
                        </div>
                        <span className="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white">→</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Card className="border-dashed bg-neutral-900/45">
              <div className="flex items-start gap-3">
                <div className="text-lg">ⓘ</div>
                <div>
                  <h3 className="font-bold">Zasada tego modułu</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">Nie dopisujemy procedur, których nie ma w planie egzaminu. Tam, gdzie dokument wymaga np. pełnej procedury 5-25 / 5xC, meldunku CFF, szczegółów OPBMR albo MEDEVAC, aplikacja zaznacza brak źródła. Gdy dodamy właściwe materiały szkoleniowe, uzupełnimy dokładne sekwencje bez zgadywania.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {view === "framework" && (
          <div className="space-y-5">
            <Card className="p-6 sm:p-7">
              <Badge tone="green">WSPÓLNY WZORZEC</Badge>
              <h2 className="mt-4 text-2xl font-black">Dowódca ma być czytelny, aktywny i kontrolować wykonanie</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">Poniższe sześć kroków to rama treningowa zbudowana z elementów powtarzających się w planie egzaminu i kartach oceny. Nie jest nową procedurą taktyczną — ma pomóc nie zgubić kluczowych elementów dowodzenia.</p>
            </Card>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {commanderFramework.map((x) => <Card key={x.title}><h3 className="font-bold">{x.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{x.text}</p></Card>)}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <CriteriaList title="Co ocenia egzaminator — 80%" items={examinerCriteria} values={{}} onChange={() => {}} />
              <CriteriaList title="Co oceniają podwładni — 20%" items={peerCriteria} values={{}} onChange={() => {}} />
            </div>

            <Card className="border-amber-900/40 bg-amber-950/10">
              <h3 className="font-bold text-amber-200">Najczęstszy wspólny element: AAR</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Plan egzaminu nakazuje przeprowadzenie AAR po kolejnych zadaniach, a AAR jest osobnym kryterium zarówno w karcie egzaminatora, jak i w ocenie podwładnych. W treningu traktujemy je więc jako obowiązkowe zakończenie każdej próby.</p>
            </Card>
          </div>
        )}

        {view === "station" && (
          <div className="space-y-5">
            <Card className="p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2"><Badge>PUNKT {station.number}</Badge><Badge>Źródło: s. {station.sourcePages}</Badge></div>
              <h2 className="mt-4 text-2xl font-black leading-tight">{station.title}</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4"><div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Sytuacja</div><p className="mt-2 text-sm leading-6 text-neutral-300">{station.scenario}</p></div>
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4"><div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Zadanie</div><p className="mt-2 text-sm leading-6 text-neutral-300">{station.task}</p></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2"><Button onClick={startPractice}>Trening bez podpowiedzi</Button><Button secondary onClick={() => document.getElementById("wzorzec")?.scrollIntoView({ behavior: "smooth" })}>Pokaż wzorzec wykonania</Button></div>
            </Card>

            {station.changeOfSituation && <Card className="border-amber-900/40 bg-amber-950/10"><div className="text-xs font-bold uppercase tracking-wider text-amber-400">Zmiana sytuacji</div><p className="mt-2 text-sm leading-6 text-neutral-300">{station.changeOfSituation}</p></Card>}

            <section id="wzorzec" className="space-y-3 scroll-mt-5">
              <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Wzorzec wg planu egzaminu</p><h2 className="mt-1 text-2xl font-bold">Jak powinno wyglądać dobrze wykonane zadanie</h2><p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-500">Pogrupowanie na etapy służy nauce. Treść kryteriów pochodzi z planu egzaminu; nie jest to dodatkowa procedura operacyjna.</p></div>
              {station.goodExecution.map((phase, index) => (
                <Card key={phase.title}>
                  <div className="flex gap-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-sm font-black text-neutral-950">{index + 1}</div><div><h3 className="font-bold">{phase.title}</h3><p className="mt-1 text-sm leading-5 text-neutral-500">{phase.description}</p></div></div>
                  <ul className="mt-4 grid gap-2 md:grid-cols-2">{phase.items.map((item) => <li key={item} className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3 text-sm leading-5 text-neutral-300"><span className="mr-2 text-emerald-400">✓</span>{item}</li>)}</ul>
                </Card>
              ))}
            </section>

            {station.sourceGap && <Card className="border-dashed border-amber-900/60 bg-neutral-900/45"><div className="text-xs font-bold uppercase tracking-wider text-amber-400">Do uzupełnienia z osobnego źródła</div><p className="mt-2 text-sm leading-6 text-neutral-400">{station.sourceGap}</p></Card>}
          </div>
        )}

        {view === "practice" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
              <div><div className="text-xs uppercase tracking-wider text-neutral-500">Trening dowodzenia</div><div className="mt-1 font-bold">{station.shortTitle}</div></div>
              <div className="font-mono text-2xl font-black tabular-nums">{formatTime(seconds)}</div>
            </div>
            <Card className="p-6 sm:p-8">
              <Badge tone="amber">BEZ PODPOWIEDZI</Badge>
              <h2 className="mt-4 text-2xl font-black">Wcielasz się w dowódcę</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-neutral-950 p-4"><div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Sytuacja</div><p className="mt-2 text-sm leading-6 text-neutral-300">{station.scenario}</p></div>
                <div className="rounded-2xl bg-neutral-950 p-4"><div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Zadanie</div><p className="mt-2 text-sm leading-6 text-neutral-300">{station.task}</p></div>
              </div>
              {station.changeOfSituation && <div className="mt-4 rounded-2xl border border-amber-900/50 bg-amber-950/15 p-4"><div className="text-xs font-bold uppercase tracking-wider text-amber-400">Rozjemca może wprowadzić</div><p className="mt-2 text-sm leading-6 text-neutral-300">{station.changeOfSituation}</p></div>}
              <p className="mt-5 text-sm leading-6 text-neutral-400">Mów na głos i zachowuj się tak, jakbyś faktycznie prowadził zespół. Nie zaglądaj do wzorca. Kiedy zakończysz działanie i AAR, przejdź do samooceny.</p>
              <div className="mt-5"><Button onClick={finishPractice}>Zakończ próbę i oceń</Button></div>
            </Card>
          </div>
        )}

        {view === "score" && (
          <div className="space-y-5">
            <Card className="p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><Badge tone="green">SAMOOCENA</Badge><h2 className="mt-3 text-2xl font-black">Porównaj wykonanie z planem egzaminu</h2><p className="mt-2 text-sm text-neutral-400">Czas próby: {formatTime(seconds)}</p></div>
                <div className="rounded-2xl border border-neutral-700 bg-neutral-950 p-4 text-right"><div className="text-xs uppercase tracking-wider text-neutral-500">Wynik treningowy</div><div className="mt-1 text-3xl font-black">{trainingScore.toFixed(2)} / 5</div><div className="text-xs text-neutral-400">ocena {trainingGrade.value} • {trainingGrade.label}</div></div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="font-bold">1. Wykonanie elementów zadania</h3><p className="mt-1 text-xs text-neutral-500">Zaznacz tylko to, co faktycznie wykonałeś podczas próby.</p></div><Badge>{executionDone} / {allExecutionItems.length}</Badge></div>
              <div className="mt-4 space-y-2">{allExecutionItems.map((item) => <label key={item.key} className="flex cursor-pointer gap-3 rounded-xl border border-neutral-800 bg-neutral-950/70 p-3 text-sm"><input type="checkbox" checked={!!executionChecks[item.key]} onChange={(e) => setExecutionChecks((c) => ({ ...c, [item.key]: e.target.checked }))} className="mt-0.5 h-4 w-4"/><span><span className="mr-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">{item.phase}</span>{item.text}</span></label>)}</div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <CriteriaList title="2. Karta egzaminatora — 80%" items={examinerCriteria} values={examiner} onChange={setExaminer} />
              <CriteriaList title="3. Ocena podwładnych — 20%" items={peerCriteria} values={peer} onChange={setPeer} />
            </div>

            <Card className="bg-neutral-900/60">
              <h3 className="font-bold">Jak liczymy wynik treningowy</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Egzaminator: {examinerCount}/5 × 0,8 = {(examinerCount * 0.8).toFixed(2)}. Ocena podwładnych w tym trenażerze jest uproszczoną pojedynczą samooceną: {peerCount}/5 = {(peerCount / 5).toFixed(2)}. Razem: {trainingScore.toFixed(2)}. W rzeczywistym egzaminie część 20% jest liczona z kart wszystkich oceniających podwładnych.</p>
              <div className="mt-4 flex flex-wrap gap-2"><Button onClick={saveAttempt}>{savedAttempt ? "Wynik zapisany" : "Zapisz próbę"}</Button><Button secondary onClick={startPractice}>Powtórz zadanie</Button><Button secondary onClick={() => setView("station")}>Wróć do wzorca</Button></div>
            </Card>

            {station.sourceGap && <Card className="border-dashed border-amber-900/60 bg-neutral-900/45"><div className="text-xs font-bold uppercase tracking-wider text-amber-400">Ważne</div><p className="mt-2 text-sm leading-6 text-neutral-400">{station.sourceGap}</p></Card>}
          </div>
        )}
      </div>
    </main>
  );
}

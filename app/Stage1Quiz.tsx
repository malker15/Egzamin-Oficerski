"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Theme = "light" | "dark";
type Mode = "study" | "exam";
type ChoiceKey = "A" | "B" | "C" | "D";

type BaseQuestion = {
  id: string | number;
  question: string;
  image?: string;
};

type McqQuestion = BaseQuestion & {
  type: "mcq";
  choices: Array<{ key: ChoiceKey; text: string }>;
  correctKey: ChoiceKey;
};

type ImageInputQuestion = BaseQuestion & {
  type: "image_input";
  image: string;
  acceptedAnswers: string[];
};

type Question = McqQuestion | ImageInputQuestion;

type Attempt =
  | {
      kind: "mcq";
      qid: Question["id"];
      chosen: ChoiceKey;
      correct: ChoiceKey;
      isCorrect: boolean;
      phase: "main" | "review";
      mode: Mode;
    }
  | {
      kind: "image_input";
      qid: Question["id"];
      answer: string;
      acceptedAnswers: string[];
      isCorrect: boolean;
      phase: "main" | "review";
      mode: Mode;
    };

type AppState = {
  mode: Mode;
  questions: Question[];
  sessionIds: Array<Question["id"]>;
  reviewIds: Array<Question["id"]>;
  phase: "setup" | "main" | "review" | "done";
  index: number;
  attempts: Attempt[];
};

type QStats = {
  correctCount: number;
  wrongCount: number;
  lastCorrectAt: number | null;
  lastWrongAt: number | null;
};

type StatsMap = Record<string, QStats>;

const LS_KEY_STATE = "quiz_agent_state_v12";
const LS_KEY_THEME = "quiz_theme_v1";
const LS_KEY_STATS = "quiz_agent_stats_v1";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sampleUnique<T>(arr: T[], n: number) {
  if (n >= arr.length) return shuffle(arr);
  return shuffle(arr).slice(0, n);
}

function safeJsonParse(text: string): { ok: true; data: any } | { ok: false; error: string } {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Nie udało się sparsować JSON." };
  }
}

function isChoiceKey(x: any): x is ChoiceKey {
  return x === "A" || x === "B" || x === "C" || x === "D";
}

function validateQuestions(data: any): { ok: true; questions: Question[] } | { ok: false; error: string } {
  if (!Array.isArray(data)) return { ok: false, error: "JSON musi być tablicą pytań ([]) ." };

  const out: Question[] = [];

  for (let i = 0; i < data.length; i++) {
    const q = data[i];
    const idx = i + 1;

    if (!q || typeof q !== "object") return { ok: false, error: `Pytanie #${idx} nie jest obiektem.` };
    if (!("id" in q)) return { ok: false, error: `Pytanie #${idx} nie ma pola "id".` };
    if (typeof q.question !== "string" || !q.question.trim())
      return { ok: false, error: `Pytanie #${idx} ma puste/niepoprawne pole "question".` };

    if (q.type === "mcq") {
      if (!Array.isArray(q.choices) || q.choices.length < 2)
        return { ok: false, error: `Pytanie #${idx} (mcq) musi mieć "choices" (min. 2).` };

      for (const c of q.choices) {
        if (!c || typeof c !== "object") return { ok: false, error: `Pytanie #${idx} (mcq) ma złą strukturę choice.` };
        if (!isChoiceKey(c.key)) return { ok: false, error: `Pytanie #${idx} (mcq) ma zły klucz (A/B/C/D).` };
        if (typeof c.text !== "string") return { ok: false, error: `Pytanie #${idx} (mcq) ma pusty tekst odpowiedzi.` };
      }

      if (!isChoiceKey(q.correctKey)) return { ok: false, error: `Pytanie #${idx} (mcq) ma zły "correctKey".` };

      const keys = new Set(q.choices.map((c: any) => c.key));
      if (!keys.has(q.correctKey))
        return { ok: false, error: `Pytanie #${idx} (mcq): correctKey nie istnieje w choices.` };

      out.push({
        id: q.id,
        type: "mcq",
        question: q.question,
        choices: q.choices,
        correctKey: q.correctKey,
        image: typeof q.image === "string" ? q.image : "",
      });
      continue;
    }

    if (q.type === "image_input") {
      if (typeof q.image !== "string" || !q.image.trim())
        return { ok: false, error: `Pytanie #${idx} (image_input) musi mieć "image".` };
      if (!Array.isArray(q.acceptedAnswers) || q.acceptedAnswers.length < 1)
        return { ok: false, error: `Pytanie #${idx} (image_input) musi mieć "acceptedAnswers" (min. 1).` };

      out.push({
        id: q.id,
        type: "image_input",
        question: q.question,
        image: q.image,
        acceptedAnswers: q.acceptedAnswers.map((s: any) => String(s)),
      });
      continue;
    }

    return { ok: false, error: `Pytanie #${idx} ma nieznany typ. Użyj "mcq" lub "image_input".` };
  }

  return { ok: true, questions: out };
}

function findQuestion(questions: Question[], id: Question["id"]) {
  return questions.find((q) => q.id === id);
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (el.isContentEditable) return true;
  return false;
}

function normalizeText(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toKey(id: Question["id"]) {
  return String(id);
}

function defaultStats(): QStats {
  return { correctCount: 0, wrongCount: 0, lastCorrectAt: null, lastWrongAt: null };
}

/**
 * ✅ NOWE: Tasowanie odpowiedzi w MCQ (A/B/C/D) + przeliczenie correctKey
 * Działa w NAUCE i EGZAMINIE, bo robimy to na etapie wczytania bazy pytań.
 */
function shuffleMcqChoices(q: Question): Question {
  if (q.type !== "mcq") return q;

  const correctText = q.choices.find((c) => c.key === q.correctKey)?.text ?? "";
  const shuffledChoices = shuffle(q.choices);

  const newCorrectKey = shuffledChoices.find((c) => c.text === correctText)?.key;
  if (!newCorrectKey) return q; // awaryjnie (nie powinno się zdarzyć)

  return {
    ...q,
    choices: shuffledChoices,
    correctKey: newCorrectKey,
  };
}

/** Study: 50% sesji = powtórki (z historii błędów) */
function buildSessionIdsWithStats(questions: Question[], sessionSize: number, stats: StatsMap, repeatRatio = 0.5) {
  const allIds = questions.map((q) => q.id);
  const size = Math.min(sessionSize, allIds.length);
  const repeatCount = Math.min(size, Math.max(0, Math.round(size * repeatRatio)));

  const repeatCandidates = [...questions]
    .filter((q) => {
      const s = stats[toKey(q.id)];
      return s && s.wrongCount > 0;
    })
    .sort((a, b) => {
      const sa = stats[toKey(a.id)]!;
      const sb = stats[toKey(b.id)]!;
      if (sb.wrongCount !== sa.wrongCount) return sb.wrongCount - sa.wrongCount;
      const ta = sa.lastWrongAt ?? 0;
      const tb = sb.lastWrongAt ?? 0;
      return tb - ta;
    })
    .map((q) => q.id);

  const pickedRepeats = repeatCandidates.slice(0, repeatCount);
  const remaining = allIds.filter((id) => !pickedRepeats.includes(id));
  const rest = sampleUnique(remaining, size - pickedRepeats.length);
  return shuffle([...pickedRepeats, ...rest]);
}

/** Exam: czyste losowanie N pytań */
function buildExamSessionIds(questions: Question[], sessionSize: number) {
  const allIds = questions.map((q) => q.id);
  const size = Math.min(sessionSize, allIds.length);
  return sampleUnique(allIds, size);
}

/** Prosta definicja "opanowane": >=3 poprawne i 0 błędów */
function isMastered(s?: QStats) {
  if (!s) return false;
  return s.correctCount >= 3 && s.wrongCount === 0;
}

function Card({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <section
      className={cx(
        "rounded-2xl border p-6 shadow-sm",
        theme === "dark" ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      {children}
    </section>
  );
}

function Pill({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        theme === "dark"
          ? "border-neutral-800 bg-neutral-900 text-neutral-200"
          : "border-neutral-200 bg-white text-neutral-700"
      )}
    >
      {children}
    </span>
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { theme: Theme }) {
  const { className = "", theme, ...rest } = props;
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
        "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
        theme === "dark" ? "bg-white text-neutral-900 hover:bg-neutral-200" : "bg-neutral-900 text-white hover:bg-neutral-800",
        className
      )}
    />
  );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { theme: Theme }) {
  const { className = "", theme, ...rest } = props;
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition",
        "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
        theme === "dark"
          ? "border-neutral-800 bg-neutral-900 text-neutral-100 hover:bg-neutral-800"
          : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100",
        className
      )}
    />
  );
}

function Input({ theme, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { theme: Theme }) {
  return (
    <input
      {...props}
      className={cx(
        "rounded-xl border px-3 py-2 text-sm shadow-sm outline-none",
        theme === "dark"
          ? "border-neutral-800 bg-neutral-950 text-neutral-100 focus:border-neutral-500"
          : "border-neutral-200 bg-white text-neutral-900 focus:border-neutral-900",
        props.className
      )}
    />
  );
}

export default function Page() {
  const [theme, setTheme] = useState<Theme>("light");
  const [rawJsonName, setRawJsonName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [stats, setStats] = useState<StatsMap>({});

  const [state, setState] = useState<AppState>({
    mode: "study",
    questions: [],
    sessionIds: [],
    reviewIds: [],
    phase: "setup",
    index: 0,
    attempts: [],
  });

  const [sessionSize, setSessionSize] = useState<number>(50);

  const [chosen, setChosen] = useState<ChoiceKey | null>(null);
  const [imageAnswer, setImageAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  // ===== AUTH =====
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPass, setLoginPass] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [savingScore, setSavingScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // theme load/save
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY_THEME);
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_KEY_THEME, theme);
  }, [theme]);

  // stats load/save
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY_STATS);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as StatsMap;
      if (parsed && typeof parsed === "object") setStats(parsed);
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  // state load/save
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY_STATE);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as AppState;
      if (parsed && Array.isArray(parsed.questions) && typeof parsed.phase === "string") setState(parsed);
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_KEY_STATE, JSON.stringify(state));
  }, [state]);

  // auth: init + listener
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;
      setUserId(u?.id ?? "");
      setUserEmail(u?.email ?? "");
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setUserId(u?.id ?? "");
      setUserEmail(u?.email ?? "");
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn() {
    setAuthError("");
    const email = loginEmail.trim();
    const password = loginPass;
    if (!email || !password) {
      setAuthError("Wpisz email i hasło.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUserId("");
    setUserEmail("");
  }

  // AUTO-LOAD from /public/questions.json
  useEffect(() => {
    async function autoLoad() {
      try {
        const res = await fetch("/questions.json", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const validated = validateQuestions(data);
        if (!validated.ok) return;

        // ✅ NOWE: tasowanie odpowiedzi MCQ przy wczytaniu bazy
        const shuffledQuestions = validated.questions.map(shuffleMcqChoices);

        setRawJsonName("questions.json (auto)");
        setState((prev) => ({
          ...prev,
          questions: shuffledQuestions,
          phase: "setup",
          sessionIds: [],
          reviewIds: [],
          index: 0,
          attempts: [],
        }));

        setStats((prev) => {
          const next = { ...prev };
          for (const q of shuffledQuestions) {
            const k = toKey(q.id);
            if (!next[k]) next[k] = defaultStats();
          }
          return next;
        });
      } catch {}
    }
    autoLoad();
  }, []);

  const activeIds = state.phase === "review" ? state.reviewIds : state.sessionIds;
  const activeId = activeIds[state.index];
  const current = useMemo(() => findQuestion(state.questions, activeId), [state.questions, activeId]);

  const totalMain = state.sessionIds.length;
  const totalReview = state.reviewIds.length;

  const progress = useMemo(() => {
    if (state.phase === "main") return totalMain ? Math.round(((state.index + 1) / totalMain) * 100) : 0;
    if (state.phase === "review") return totalReview ? Math.round(((state.index + 1) / totalReview) * 100) : 0;
    return 0;
  }, [state.phase, state.index, totalMain, totalReview]);

  const progressLabel = useMemo(() => {
    if (state.phase === "main") {
      return state.mode === "exam" ? `Egzamin ${state.index + 1} / ${totalMain}` : `Nauka ${state.index + 1} / ${totalMain}`;
    }
    if (state.phase === "review") return `Powtórka ${state.index + 1} / ${totalReview}`;
    return "";
  }, [state.phase, state.index, totalMain, totalReview, state.mode]);

  const progressSummary = useMemo(() => {
    const total = state.questions.length;

    let mastered = 0;
    let needsWork = 0;
    let seen = 0;

    for (const q of state.questions) {
      const s = stats[toKey(q.id)];
      const hasAny = !!s && (s.correctCount > 0 || s.wrongCount > 0);
      if (hasAny) seen++;
      if (isMastered(s)) mastered++;
      if ((s?.wrongCount ?? 0) > 0) needsWork++;
    }

    const unseen = Math.max(0, total - seen);
    return { total, mastered, needsWork, seen, unseen };
  }, [state.questions, stats]);

  const worst20 = useMemo(() => {
    const arr = state.questions
      .map((q) => {
        const s = stats[toKey(q.id)] ?? defaultStats();
        return {
          id: q.id,
          question: q.question,
          wrongCount: s.wrongCount,
          correctCount: s.correctCount,
          lastWrongAt: s.lastWrongAt,
        };
      })
      .filter((x) => x.wrongCount > 0)
      .sort((a, b) => {
        if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
        return (b.lastWrongAt ?? 0) - (a.lastWrongAt ?? 0);
      })
      .slice(0, 20);

    return arr;
  }, [state.questions, stats]);

  function resetQuestionUi() {
    setChosen(null);
    setImageAnswer("");
    setSubmitted(false);
    setError("");
  }

  function bumpStats(qid: Question["id"], isCorrect: boolean) {
    const k = toKey(qid);
    const now = Date.now();
    setStats((prev) => {
      const cur = prev[k] ?? defaultStats();
      const next: QStats = {
        correctCount: cur.correctCount + (isCorrect ? 1 : 0),
        wrongCount: cur.wrongCount + (isCorrect ? 0 : 1),
        lastCorrectAt: isCorrect ? now : cur.lastCorrectAt,
        lastWrongAt: isCorrect ? cur.lastWrongAt : now,
      };
      return { ...prev, [k]: next };
    });
  }

  function startStudy() {
    setScoreSaved(false);
    setSaveError("");
    const ids = buildSessionIdsWithStats(state.questions, sessionSize, stats, 0.5);
    setState({
      mode: "study",
      questions: state.questions,
      sessionIds: ids,
      reviewIds: [],
      phase: "main",
      index: 0,
      attempts: [],
    });
    resetQuestionUi();
  }

  function startExam() {
    setScoreSaved(false);
    setSaveError("");
    const ids = buildExamSessionIds(state.questions, sessionSize);
    setState({
      mode: "exam",
      questions: state.questions,
      sessionIds: ids,
      reviewIds: [],
      phase: "main",
      index: 0,
      attempts: [],
    });
    resetQuestionUi();
  }

  function backToSetup() {
    setState((prev) => ({ ...prev, phase: "setup", sessionIds: [], reviewIds: [], index: 0, attempts: [] }));
    resetQuestionUi();
  }

  function handleFile(file: File) {
    setError("");
    setRawJsonName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const parsed = safeJsonParse(text);
      if (!parsed.ok) return setError(`Błąd JSON: ${parsed.error}`);

      const validated = validateQuestions(parsed.data);
      if (!validated.ok) return setError(validated.error);

      // ✅ NOWE: tasowanie odpowiedzi MCQ przy wczytaniu pliku
      const shuffledQuestions = validated.questions.map(shuffleMcqChoices);

      setState((prev) => ({
        ...prev,
        questions: shuffledQuestions,
        phase: "setup",
        sessionIds: [],
        reviewIds: [],
        index: 0,
        attempts: [],
      }));

      setStats((prev) => {
        const next = { ...prev };
        for (const q of shuffledQuestions) {
          const k = toKey(q.id);
          if (!next[k]) next[k] = defaultStats();
        }
        return next;
      });
    };
    reader.readAsText(file, "utf-8");
  }

  function submitAnswer() {
    setError("");
    if (!current) return setError("Brak pytania.");

    const isExam = state.mode === "exam";

    if (current.type === "mcq") {
      if (!chosen) return setError("Wybierz odpowiedź.");
      const isCorrect = chosen === current.correctKey;

      const attempt: Attempt = {
        kind: "mcq",
        qid: current.id,
        chosen,
        correct: current.correctKey,
        isCorrect,
        phase: state.phase === "review" ? "review" : "main",
        mode: state.mode,
      };

      setState((prev) => {
        const next = { ...prev, attempts: [...prev.attempts, attempt] };

        // study: błędne lecą do powtórki
        if (!isExam && !isCorrect && prev.phase === "main") {
          if (!next.reviewIds.includes(current.id)) next.reviewIds = [...next.reviewIds, current.id];
        }
        return next;
      });

      // stats tylko w study
      if (!isExam) bumpStats(current.id, isCorrect);

      setSubmitted(true);
      return;
    }

    if (current.type === "image_input") {
      const ans = imageAnswer.trim();
      if (!ans) return setError("Wpisz odpowiedź (nazwę).");

      const norm = normalizeText(ans);
      const acceptedNorm = current.acceptedAnswers.map(normalizeText);
      const isCorrect = acceptedNorm.includes(norm);

      const attempt: Attempt = {
        kind: "image_input",
        qid: current.id,
        answer: ans,
        acceptedAnswers: current.acceptedAnswers,
        isCorrect,
        phase: state.phase === "review" ? "review" : "main",
        mode: state.mode,
      };

      setState((prev) => {
        const next = { ...prev, attempts: [...prev.attempts, attempt] };
        if (!isExam && !isCorrect && prev.phase === "main") {
          if (!next.reviewIds.includes(current.id)) next.reviewIds = [...next.reviewIds, current.id];
        }
        return next;
      });

      if (!isExam) bumpStats(current.id, isCorrect);

      setSubmitted(true);
      return;
    }
  }

  function nextQuestion() {
    setError("");
    const ids = state.phase === "review" ? state.reviewIds : state.sessionIds;

    if (state.index + 1 < ids.length) {
      setState((prev) => ({ ...prev, index: prev.index + 1 }));
      resetQuestionUi();
      return;
    }

    if (state.phase === "main") {
      if (state.mode === "study" && state.reviewIds.length > 0) {
        setState((prev) => ({ ...prev, phase: "review", index: 0 }));
        resetQuestionUi();
      } else {
        setState((prev) => ({ ...prev, phase: "done" }));
      }
    } else if (state.phase === "review") {
      setState((prev) => ({ ...prev, phase: "done" }));
    }
  }

  function exportStats() {
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetAll() {
    localStorage.removeItem(LS_KEY_STATE);
    setState({
      mode: "study",
      questions: [],
      sessionIds: [],
      reviewIds: [],
      phase: "setup",
      index: 0,
      attempts: [],
    });
    setRawJsonName("");
    resetQuestionUi();
    setError("");
  }

  function clearStatsOnly() {
    localStorage.removeItem(LS_KEY_STATS);
    setStats({});
    setError("");
  }

  // Feedback w trybie study (prosty: ✅/❌ + poprawna litera)
  const feedback = useMemo(() => {
    if (state.mode !== "study") return null;
    if (!submitted || !current) return null;

    const last = [...state.attempts].reverse().find((a) => a.qid === current.id);
    if (!last) return null;

    if (current.type === "mcq" && last.kind === "mcq") {
      return {
        kind: "mcq" as const,
        isCorrect: last.isCorrect,
        chosen: last.chosen,
        correct: last.correct,
      };
    }

    if (current.type === "image_input" && last.kind === "image_input") {
      return {
        kind: "image_input" as const,
        isCorrect: last.isCorrect,
        answer: last.answer,
        acceptedAnswers: last.acceptedAnswers,
      };
    }

    return null;
  }, [submitted, current, state.attempts, state.mode]);

  // Podsumowanie egzaminu z PEŁNYMI TEKSTAMI odpowiedzi
  const examSummary = useMemo(() => {
    if (state.mode !== "exam") return null;
    if (state.phase !== "done") return null;

    const byId = new Map<string, Question>();
    for (const q of state.questions) byId.set(String(q.id), q);

    let correct = 0;
    const wrong: Array<{
      id: string;
      question: string;
      image?: string;
      chosenText?: string;
      correctText?: string;
    }> = [];

    for (const a of state.attempts) {
      if (a.mode !== "exam") continue;

      const q = byId.get(String(a.qid));
      if (!q) continue;

      if (a.kind === "mcq") {
        if (a.isCorrect) {
          correct++;
        } else {
          const chosenText =
            q.type === "mcq" ? q.choices.find((c) => c.key === a.chosen)?.text ?? "" : "";
          const correctText =
            q.type === "mcq" ? q.choices.find((c) => c.key === a.correct)?.text ?? "" : "";

          wrong.push({
            id: String(a.qid),
            question: q.question,
            image: (q as any)?.image ?? "",
            chosenText,
            correctText,
          });
        }
      }
    }

    const total = state.sessionIds.length || state.attempts.length;
    const scorePct = total ? Math.round((correct / total) * 100) : 0;

    return { total, correct, wrong, scorePct };
  }, [state.mode, state.phase, state.attempts, state.questions, state.sessionIds.length]);

  async function saveScoreToRanking() {
    setSaveError("");

    if (!examSummary) return;
    if (!userId) {
      setSaveError("Brak zalogowanego użytkownika.");
      return;
    }
    if (scoreSaved) return;

    setSavingScore(true);

    const label = (userEmail || "").split("@")[0] || "user";

    const payload = {
      user_id: userId,
      mode: "exam",
      total: examSummary.total,
      correct: examSummary.correct,
      percent: examSummary.scorePct,
      label,
    };

    console.log("INSERT scores payload:", payload);
    const { data, error } = await supabase.from("scores").insert(payload).select();
    console.log("INSERT scores result:", { data, error });

    setSavingScore(false);

    if (error) {
      setSaveError(error.message);
      return;
    }

    setScoreSaved(true);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      const key = e.key;

      if (key.toLowerCase() === "t") {
        e.preventDefault();
        setTheme((t) => (t === "dark" ? "light" : "dark"));
        return;
      }

      const inQuiz = state.phase === "main" || state.phase === "review";
      const inDone = state.phase === "done";

      if ((inQuiz || inDone) && key.toLowerCase() === "r") {
        e.preventDefault();
        backToSetup();
        return;
      }

      if (!inQuiz || !current) return;

      if (key === "Enter") {
        e.preventDefault();
        if (!submitted) submitAnswer();
        else nextQuestion();
        return;
      }

      if (!submitted && current.type === "mcq") {
        if (key === "Backspace") {
          e.preventDefault();
          setChosen(null);
          return;
        }
        const upper = key.toUpperCase();
        if (upper === "A" || upper === "B" || upper === "C" || upper === "D") {
          const k = upper as ChoiceKey;
          const allowed = new Set(current.choices.map((c) => c.key));
          if (allowed.has(k)) {
            e.preventDefault();
            setChosen(k);
          }
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, current, submitted, chosen, imageAnswer, state.index, state.sessionIds, state.reviewIds, state.mode]);

  // ===== LOGIN GATE =====
  if (!userId) {
    return (
      <main className={cx("min-h-screen", theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-neutral-50 text-neutral-900")}>
        <div className="mx-auto max-w-lg px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Quiz Agent</h1>
            <SecondaryButton theme={theme} onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} title="Skrót: T">
              {theme === "dark" ? "Dzień" : "Noc"}
            </SecondaryButton>
          </div>

          <Card theme={theme}>
            <h2 className="text-lg font-bold">Logowanie</h2>
            <p className={cx("mt-2 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-600")}>
              Zaloguj się danymi, które dostaniesz od admina.
            </p>

            <div className="mt-5 grid gap-3">
              <Input theme={theme} placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <Input theme={theme} placeholder="Hasło" type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
              <PrimaryButton theme={theme} onClick={signIn}>Zaloguj</PrimaryButton>
            </div>

            {authError && (
              <div className={cx("mt-4 rounded-xl border p-3 text-sm", theme === "dark" ? "border-red-900 bg-red-950 text-red-200" : "border-red-200 bg-red-50 text-red-700")}>
                {authError}
              </div>
            )}

            <div className={cx("mt-4 text-xs", theme === "dark" ? "text-neutral-500" : "text-neutral-500")}>
              Jeśli widzisz “Email not confirmed” → w Supabase wyłącz email confirmations albo potwierdź użytkownika.
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // ===== MAIN UI =====
  return (
    <main
      className={cx(
        "min-h-screen transition-colors duration-200",
        theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-neutral-50 text-neutral-900"
      )}
    >
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Quiz Agent</h1>
              <Pill theme={theme}>v12</Pill>
              <Pill theme={theme}>{state.mode === "exam" ? "Tryb EGZAMIN" : "Tryb NAUKA"}</Pill>
              <Pill theme={theme}>Odpowiedzi: losowe</Pill>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <a
                href="/ranking"
                className={cx(
                  "rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90",
                  theme === "dark" ? "border-neutral-800 bg-neutral-900 text-neutral-100" : "border-neutral-200 bg-white text-neutral-900"
                )}
              >
                Ranking
              </a>

              <SecondaryButton theme={theme} onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} title="Skrót: T">
                {theme === "dark" ? "Tryb dzienny" : "Tryb nocny"}
              </SecondaryButton>

              <SecondaryButton theme={theme} onClick={exportStats} disabled={Object.keys(stats).length === 0}>
                Eksport stats
              </SecondaryButton>

              <SecondaryButton theme={theme} onClick={clearStatsOnly}>
                Wyczyść stats
              </SecondaryButton>

              <SecondaryButton theme={theme} onClick={resetAll}>
                Reset
              </SecondaryButton>

              <SecondaryButton theme={theme} onClick={signOut}>
                Wyloguj
              </SecondaryButton>
            </div>
          </div>

          <div className={cx("flex flex-wrap items-center gap-2 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
            <Pill theme={theme}>
              Użytkownik: <span className="ml-1 font-semibold">{userEmail}</span>
            </Pill>

            <Pill theme={theme}>
              Baza: <span className="ml-1 font-semibold">{rawJsonName || "—"}</span>
            </Pill>

            <Pill theme={theme}>
              Pytania: <span className="ml-1 font-semibold">{progressSummary.total}</span>
            </Pill>

            <Pill theme={theme}>
              Opanowane: <span className="ml-1 font-semibold">{progressSummary.mastered}</span>
            </Pill>

            <Pill theme={theme}>
              Do poprawy: <span className="ml-1 font-semibold">{progressSummary.needsWork}</span>
            </Pill>

            <div className="ml-auto flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2">
                <span className="text-sm">{state.mode === "exam" ? "Egzamin" : "Sesja"}</span>
                <Input
                  theme={theme}
                  type="number"
                  min={1}
                  max={999}
                  value={sessionSize}
                  onChange={(e) => setSessionSize(Number(e.target.value || 50))}
                  className="w-24"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Setup */}
        {state.phase === "setup" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card theme={theme}>
              <h2 className="text-lg font-bold">Start</h2>
              <p className={cx("mt-2 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-600")}>
                Nauka: feedback po każdej odpowiedzi. Egzamin: brak feedbacku do końca + zapis do rankingu.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <PrimaryButton theme={theme} onClick={startStudy} disabled={state.questions.length === 0}>
                  Start NAUKA
                </PrimaryButton>
                <SecondaryButton theme={theme} onClick={startExam} disabled={state.questions.length === 0}>
                  Start EGZAMIN
                </SecondaryButton>
              </div>

              {error && (
                <div
                  className={cx(
                    "mt-4 rounded-xl border p-3 text-sm",
                    theme === "dark" ? "border-red-900 bg-red-950 text-red-200" : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {error}
                </div>
              )}

              <details className={cx("mt-5 rounded-2xl border p-4", theme === "dark" ? "border-neutral-800" : "border-neutral-200")}>
                <summary className="cursor-pointer text-sm font-semibold">Opcjonalnie: wczytaj inny JSON</summary>

                <div
                  className={cx(
                    "mt-3 rounded-2xl border-2 border-dashed p-5 transition",
                    theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white",
                    isDragging ? (theme === "dark" ? "ring-2 ring-neutral-600" : "ring-2 ring-neutral-900") : ""
                  )}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={onDrop}
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className={cx("text-sm", theme === "dark" ? "text-neutral-200" : "text-neutral-700")}>
                      Upuść plik tutaj albo wybierz ręcznie
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                    />

                    <SecondaryButton theme={theme} onClick={() => fileInputRef.current?.click()}>
                      Wczytaj pytania
                    </SecondaryButton>
                  </div>
                </div>
              </details>
            </Card>

            <Card theme={theme}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">Top 20 do poprawy (nauka)</h2>
                <Pill theme={theme}>{worst20.length}</Pill>
              </div>

              <p className={cx("mt-2 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-600")}>
                Egzamin nie zmienia statystyk nauki. Statystyki zbierasz w “NAUKA”.
              </p>

              {worst20.length === 0 ? (
                <div className={cx("mt-4 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                  Brak błędów w historii.
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {worst20.map((w, idx) => (
                    <div
                      key={String(w.id)}
                      className={cx(
                        "rounded-2xl border p-3",
                        theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">
                          #{idx + 1} • ID: <span className="font-mono">{String(w.id)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Pill theme={theme}>❌ {w.wrongCount}</Pill>
                          <Pill theme={theme}>✅ {w.correctCount}</Pill>
                        </div>
                      </div>
                      <div className={cx("mt-2 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                        {w.question}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Quiz */}
        {(state.phase === "main" || state.phase === "review") && current && (
          <div className="space-y-4">
            <Card theme={theme}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold">{progressLabel}</div>
                <Pill theme={theme}>{progress}%</Pill>
              </div>

              <div className={cx("mt-3 h-2 w-full overflow-hidden rounded-full", theme === "dark" ? "bg-neutral-800" : "bg-neutral-100")}>
                <div className={cx("h-full", theme === "dark" ? "bg-neutral-100" : "bg-neutral-900")} style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-6 text-xl font-bold leading-snug">{current.question}</div>

              {"image" in current && !!(current as any).image && (
                <div className="mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(current as any).image}
                    alt="obrazek do pytania"
                    className={cx(
                      "max-h-[420px] w-full rounded-2xl border object-contain",
                      theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white"
                    )}
                  />
                </div>
              )}

              {current.type === "mcq" ? (
                <div className="mt-5 grid gap-2">
                  {current.choices.map((c) => {
                    const k = c.key;
                    const isSelected = chosen === k;

                    // w EXAM nie kolorujemy poprawności
                    let isCorrectKey = false;
                    let isWrongSelected = false;
                    if (state.mode === "study" && submitted && feedback?.kind === "mcq") {
                      isCorrectKey = k === feedback.correct;
                      isWrongSelected = feedback.chosen === k && feedback.chosen !== feedback.correct;
                    }

                    const base = "rounded-2xl border px-4 py-3 text-left text-sm transition active:scale-[0.995]";
                    const idle =
                      theme === "dark"
                        ? "border-neutral-800 bg-neutral-950 hover:bg-neutral-900"
                        : "border-neutral-200 bg-white hover:bg-neutral-50";
                    const selected = theme === "dark" ? "border-neutral-500 bg-neutral-900" : "border-neutral-900 bg-neutral-50";
                    const correct = theme === "dark" ? "border-emerald-500/60 bg-emerald-950/30" : "border-emerald-300 bg-emerald-50";
                    const wrong = theme === "dark" ? "border-red-500/60 bg-red-950/30" : "border-red-300 bg-red-50";

                    return (
                      <button
                        key={k}
                        onClick={() => !submitted && setChosen(k)}
                        className={cx(
                          base,
                          state.mode === "study" && submitted
                            ? isCorrectKey
                              ? correct
                              : isWrongSelected
                              ? wrong
                              : isSelected
                              ? selected
                              : idle
                            : isSelected
                            ? selected
                            : idle,
                          submitted && "cursor-default"
                        )}
                        title={!submitted ? `Skrót: ${k}` : undefined}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cx(
                              "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-bold",
                              theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white"
                            )}
                          >
                            {k}
                          </div>
                          <div className="leading-relaxed">{c.text}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5">
                  <div className={cx("text-sm font-semibold", theme === "dark" ? "text-neutral-200" : "text-neutral-800")}>
                    Wpisz nazwę
                  </div>
                  <Input
                    theme={theme}
                    value={imageAnswer}
                    onChange={(e) => setImageAnswer(e.target.value)}
                    placeholder="np. F-16 / F16 / ..."
                    disabled={submitted}
                    className="mt-2 w-full"
                  />
                </div>
              )}

              {error && (
                <div
                  className={cx(
                    "mt-4 rounded-xl border p-3 text-sm",
                    theme === "dark" ? "border-red-900 bg-red-950 text-red-200" : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {error}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {!submitted ? (
                  <PrimaryButton theme={theme} onClick={submitAnswer} title="Skrót: Enter">
                    {state.mode === "exam" ? "Dalej" : "Zatwierdź"}
                  </PrimaryButton>
                ) : (
                  <PrimaryButton theme={theme} onClick={nextQuestion} title="Skrót: Enter">
                    Dalej
                  </PrimaryButton>
                )}

                {!submitted && current.type === "mcq" && (
                  <SecondaryButton theme={theme} onClick={() => setChosen(null)} title="Skrót: Backspace">
                    Wyczyść wybór
                  </SecondaryButton>
                )}
              </div>

              <div className={cx("mt-4 text-xs", theme === "dark" ? "text-neutral-400" : "text-neutral-500")}>
                Skróty: Enter zatwierdź/dalej • T tryb • R wróć do startu • MCQ: A/B/C/D wybór, Backspace czyść
              </div>
            </Card>

            {/* FEEDBACK TYLKO W NAUCE */}
            {state.mode === "study" && feedback && (
              <Card theme={theme}>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill theme={theme}>{feedback.isCorrect ? "✅ Poprawnie" : "❌ Błędnie"}</Pill>

                  {feedback.kind === "mcq" ? (
                    <div className={cx("text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                      Twoja: <span className="font-bold">{feedback.chosen}</span> • poprawna:{" "}
                      <span className="font-bold">{feedback.correct}</span>
                    </div>
                  ) : (
                    <div className={cx("text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                      Twoja odpowiedź: <span className="font-bold">{feedback.answer}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* DONE */}
        {state.phase === "done" && (
          <Card theme={theme}>
            {state.mode === "exam" && examSummary ? (
              <>
                <h2 className="text-lg font-bold">Wynik egzaminu</h2>
                <p className={cx("mt-2 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                  Wynik: <span className="font-semibold">{examSummary.correct}</span> /{" "}
                  <span className="font-semibold">{examSummary.total}</span> •{" "}
                  <span className="font-semibold">{examSummary.scorePct}%</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <PrimaryButton theme={theme} onClick={saveScoreToRanking} disabled={savingScore || scoreSaved}>
                    {scoreSaved ? "Zapisano ✅" : savingScore ? "Zapisuję..." : "Zapisz wynik do rankingu"}
                  </PrimaryButton>

                  <a
                    href="/ranking"
                    className={cx(
                      "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90",
                      theme === "dark" ? "border-neutral-800 bg-neutral-900 text-neutral-100" : "border-neutral-200 bg-white text-neutral-900"
                    )}
                  >
                    Zobacz ranking
                  </a>
                </div>

                {saveError && (
                  <div
                    className={cx(
                      "mt-4 rounded-xl border p-3 text-sm",
                      theme === "dark" ? "border-red-900 bg-red-950 text-red-200" : "border-red-200 bg-red-50 text-red-700"
                    )}
                  >
                    {saveError}
                  </div>
                )}

                {examSummary.wrong.length === 0 ? (
                  <div className={cx("mt-4 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                    Bezbłędnie. Kozak.
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <div className="text-sm font-bold">Błędy</div>

                    {examSummary.wrong.map((w) => (
                      <div
                        key={w.id}
                        className={cx(
                          "rounded-2xl border p-4",
                          theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white"
                        )}
                      >
                        <div className="text-sm font-semibold">
                          ID: <span className="font-mono">{w.id}</span>
                        </div>

                        <div className={cx("mt-1 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                          {w.question}
                        </div>

                        {w.image ? (
                          <div className="mt-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={w.image}
                              alt="obrazek"
                              className={cx(
                                "max-h-[220px] w-full rounded-xl border object-contain",
                                theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-white"
                              )}
                            />
                          </div>
                        ) : null}

                        <div className="mt-4 space-y-3 text-sm">
                          <div>
                            <div className="font-semibold">Twoja odpowiedź:</div>
                            <div
                              className={cx(
                                "mt-1 rounded-xl border p-2",
                                theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-neutral-50"
                              )}
                            >
                              {w.chosenText}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold">Poprawna odpowiedź:</div>
                            <div
                              className={cx(
                                "mt-1 rounded-xl border p-2",
                                theme === "dark" ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-neutral-50"
                              )}
                            >
                              {w.correctText}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <PrimaryButton theme={theme} onClick={startExam} disabled={state.questions.length === 0}>
                    Nowy egzamin
                  </PrimaryButton>
                  <SecondaryButton theme={theme} onClick={backToSetup} title="Skrót: R">
                    Wróć do startu
                  </SecondaryButton>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold">Koniec nauki</h2>
                <p className={cx("mt-2 text-sm", theme === "dark" ? "text-neutral-300" : "text-neutral-700")}>
                  Prób: <span className="font-semibold">{state.attempts.length}</span> • Do powtórki:{" "}
                  <span className="font-semibold">{state.reviewIds.length}</span>
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <PrimaryButton theme={theme} onClick={startStudy} disabled={state.questions.length === 0}>
                    Nowa nauka
                  </PrimaryButton>
                  <SecondaryButton theme={theme} onClick={backToSetup} title="Skrót: R">
                    Wróć do startu
                  </SecondaryButton>
                </div>
              </>
            )}
          </Card>
        )}

        <div className={cx("mt-10 text-center text-xs", theme === "dark" ? "text-neutral-500" : "text-neutral-500")}>
          v12: logowanie + nauka + egzamin + zapis wyniku do rankingu + losowe odpowiedzi.
        </div>
      </div>
    </main>
  );
}
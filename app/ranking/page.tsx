"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Theme = "light" | "dark";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ScoreRow = {
  id: string;
  created_at: string;
  label: string | null;
  total: number;
  correct: number;
  percent: number;
};

export default function RankingPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;
      if (!u) {
        // nie zalogowany → wróć na /
        window.location.href = "/";
        return;
      }
      setUserId(u.id);
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("scores")
        .select("id, created_at, label, total, correct, percent")
        .order("percent", { ascending: false })
        .order("correct", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50);

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }
      setRows((data as any) ?? []);
    })();
  }, [userId]);

  const pretty = useMemo(() => {
    return rows.map((r, idx) => ({
      ...r,
      place: idx + 1,
      name: r.label?.trim() || "user",
      when: new Date(r.created_at).toLocaleString(),
    }));
  }, [rows]);

  return (
    <main className={cx("min-h-screen", theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-neutral-50 text-neutral-900")}>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">Ranking (Top 50)</h1>

          <div className="ml-auto flex gap-2">
            <a
              href="/"
              className={cx(
                "rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90",
                theme === "dark" ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
              )}
            >
              ← Wróć
            </a>
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className={cx(
                "rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90",
                theme === "dark" ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
              )}
            >
              {theme === "dark" ? "Tryb dzienny" : "Tryb nocny"}
            </button>
          </div>
        </div>

        {loading && <div className="text-sm opacity-70">Ładuję...</div>}

        {error && (
          <div className={cx("rounded-xl border p-3 text-sm", theme === "dark" ? "border-red-900 bg-red-950 text-red-200" : "border-red-200 bg-red-50 text-red-700")}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className={cx("rounded-2xl border", theme === "dark" ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")}>
            <div className={cx("grid grid-cols-12 gap-2 border-b px-4 py-3 text-xs font-semibold opacity-80", theme === "dark" ? "border-neutral-800" : "border-neutral-200")}>
              <div className="col-span-1">#</div>
              <div className="col-span-4">Użytkownik</div>
              <div className="col-span-2">Wynik</div>
              <div className="col-span-2">%</div>
              <div className="col-span-3">Kiedy</div>
            </div>

            {pretty.map((r) => (
              <div key={r.id} className={cx("grid grid-cols-12 gap-2 px-4 py-3 text-sm", theme === "dark" ? "border-neutral-800" : "border-neutral-200")}>
                <div className="col-span-1 font-semibold">{r.place}</div>
                <div className="col-span-4">{r.name}</div>
                <div className="col-span-2">
                  <span className="font-semibold">{r.correct}</span>/{r.total}
                </div>
                <div className="col-span-2 font-semibold">{r.percent}%</div>
                <div className="col-span-3 text-xs opacity-80">{r.when}</div>
              </div>
            ))}

            {pretty.length === 0 && <div className="p-4 text-sm opacity-70">Brak wyników.</div>}
          </div>
        )}
      </div>
    </main>
  );
}
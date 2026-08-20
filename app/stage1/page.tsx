"use client";

import { useEffect, useState } from "react";
import Stage1Quiz from "../Stage1Quiz";

const STAGE1_CHUNK_COUNT = 12;
const STAGE1_QUESTION_COUNT = 615;

async function loadStage1Json(fetchFn: typeof window.fetch) {
  const chunks = await Promise.all(
    Array.from({ length: STAGE1_CHUNK_COUNT }, async (_, index) => {
      const name = `data_${String(index + 1).padStart(2, "0")}.txt`;
      const response = await fetchFn(`/stage1q615/${name}?bank=615-browser`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Nie udało się pobrać ${name}: HTTP ${response.status}`);
      }

      return (await response.text()).trim();
    })
  );

  const encoded = chunks.join("");
  const compressed = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));

  if (typeof DecompressionStream === "undefined") {
    throw new Error("Ta przeglądarka nie obsługuje rozpakowywania bazy pytań.");
  }

  const decompressedStream = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  const jsonText = await new Response(decompressedStream).text();
  const questions = JSON.parse(jsonText);

  if (!Array.isArray(questions) || questions.length !== STAGE1_QUESTION_COUNT) {
    throw new Error(
      `Nieprawidłowa baza Etapu I: ${Array.isArray(questions) ? questions.length : "brak tablicy"} pytań.`
    );
  }

  return jsonText;
}

function isQuestionsRequest(input: RequestInfo | URL) {
  try {
    const raw =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    return new URL(raw, window.location.origin).pathname === "/questions.json";
  } catch {
    return false;
  }
}

export default function Stage1Page() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    const nativeFetch = window.fetch.bind(window);
    let patched = false;

    void (async () => {
      try {
        const jsonText = await loadStage1Json(nativeFetch);
        if (!active) return;

        const stage1Fetch: typeof window.fetch = async (input, init) => {
          if (isQuestionsRequest(input)) {
            return new Response(jsonText, {
              status: 200,
              headers: {
                "content-type": "application/json; charset=utf-8",
                "cache-control": "no-store",
              },
            });
          }

          return nativeFetch(input, init);
        };

        window.fetch = stage1Fetch;
        patched = true;
        setReady(true);
      } catch (error) {
        if (!active) return;
        console.error("Nie udało się przygotować bazy Etapu I:", error);
        setLoadError(error instanceof Error ? error.message : "Nie udało się załadować bazy Etapu I.");
        setReady(true);
      }
    })();

    return () => {
      active = false;
      if (patched) window.fetch = nativeFetch;
    };
  }, []);

  if (!ready) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-12 text-neutral-100">
        <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
          Ładowanie bazy 615 pytań Etapu I…
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-12 text-neutral-100">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-900/60 bg-neutral-900 p-6">
          <h1 className="text-lg font-semibold">Nie udało się załadować pytań Etapu I</h1>
          <p className="mt-2 text-sm text-neutral-300">{loadError}</p>
          <p className="mt-3 text-xs text-neutral-500">Odśwież stronę. Jeśli błąd pozostanie, jego treść wskaże dokładnie brakujący plik.</p>
        </div>
      </main>
    );
  }

  return <Stage1Quiz />;
}

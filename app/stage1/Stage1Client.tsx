"use client";

import { useEffect, useState } from "react";
import Stage1Quiz from "../Stage1Quiz";

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

export default function Stage1Client({ jsonText }: { jsonText: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const nativeFetch = window.fetch.bind(window);

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
    setReady(true);

    return () => {
      window.fetch = nativeFetch;
    };
  }, [jsonText]);

  if (!ready) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-12 text-neutral-100">
        <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
          Przygotowywanie bazy 615 pytań Etapu I…
        </div>
      </main>
    );
  }

  return <Stage1Quiz />;
}

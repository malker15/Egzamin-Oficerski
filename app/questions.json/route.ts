import { gunzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STAGE1_QUESTION_COUNT = 615;
const STAGE1_CHUNK_COUNT = 12;

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin;

    const chunks = await Promise.all(
      Array.from({ length: STAGE1_CHUNK_COUNT }, async (_, index) => {
        const name = `data_${String(index + 1).padStart(2, "0")}.txt`;
        const url = `${origin}/stage1q615/${name}?bank=615-v2`;
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Nie udało się pobrać ${name}: HTTP ${response.status}`);
        }

        return (await response.text()).trim();
      })
    );

    const encoded = chunks.join("");
    const jsonText = gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
    const questions = JSON.parse(jsonText);

    if (!Array.isArray(questions) || questions.length !== STAGE1_QUESTION_COUNT) {
      throw new Error(
        `Nieprawidłowa liczba pytań Etapu I: ${Array.isArray(questions) ? questions.length : "brak tablicy"}`
      );
    }

    return Response.json(questions, {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate",
        pragma: "no-cache",
        expires: "0",
        "x-stage1-bank": "615-v2",
      },
    });
  } catch (error) {
    console.error("Nie udało się wczytać bazy pytań Etapu I:", error);
    return Response.json(
      {
        error: "Nie udało się wczytać bazy pytań Etapu I.",
        bank: "615-v2",
      },
      {
        status: 500,
        headers: {
          "cache-control": "no-store",
        },
      }
    );
  }
}

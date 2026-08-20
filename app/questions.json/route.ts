import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STAGE1_QUESTION_COUNT = 615;
const STAGE1_CHUNK_COUNT = 12;

export function GET() {
  try {
    const encoded = Array.from({ length: STAGE1_CHUNK_COUNT }, (_, index) => {
      const name = `data_${String(index + 1).padStart(2, "0")}.txt`;
      return readFileSync(join(process.cwd(), "public", "stage1q615", name), "utf8").trim();
    }).join("");

    const jsonText = gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
    const questions = JSON.parse(jsonText);

    if (!Array.isArray(questions) || questions.length !== STAGE1_QUESTION_COUNT) {
      throw new Error(
        `Nieprawidłowa liczba pytań Etapu I: ${Array.isArray(questions) ? questions.length : "brak tablicy"}`
      );
    }

    return new Response(jsonText, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("Nie udało się wczytać bazy pytań Etapu I:", error);
    return Response.json(
      { error: "Nie udało się wczytać bazy pytań Etapu I." },
      { status: 500 }
    );
  }
}

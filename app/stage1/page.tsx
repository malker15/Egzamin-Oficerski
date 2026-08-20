import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import Stage1Client from "./Stage1Client";

export const dynamic = "force-static";

const STAGE1_CHUNK_COUNT = 12;
const STAGE1_QUESTION_COUNT = 615;

function loadStage1Json() {
  const encoded = Array.from({ length: STAGE1_CHUNK_COUNT }, (_, index) => {
    const name = `data_${String(index + 1).padStart(2, "0")}.txt`;
    return readFileSync(join(process.cwd(), "public", "stage1q615", name), "utf8").trim();
  }).join("");

  const jsonText = gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
  const questions = JSON.parse(jsonText);

  if (!Array.isArray(questions) || questions.length !== STAGE1_QUESTION_COUNT) {
    throw new Error(
      `Nieprawidłowa baza Etapu I: ${Array.isArray(questions) ? questions.length : "brak tablicy"} pytań.`
    );
  }

  return jsonText;
}

export default function Stage1Page() {
  const jsonText = loadStage1Json();
  return <Stage1Client jsonText={jsonText} />;
}

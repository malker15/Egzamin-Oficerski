import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

const ROOT = process.cwd();
const CHUNK_DIR = join(ROOT, "public", "stage1q615");
const OUTPUT = join(ROOT, "public", "questions.json");
const CHUNK_COUNT = 12;
const QUESTION_COUNT = 615;

const encoded = Array.from({ length: CHUNK_COUNT }, (_, index) => {
  const name = `data_${String(index + 1).padStart(2, "0")}.txt`;
  return readFileSync(join(CHUNK_DIR, name), "utf8").trim();
}).join("");

const jsonText = gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
const questions = JSON.parse(jsonText);

if (!Array.isArray(questions) || questions.length !== QUESTION_COUNT) {
  throw new Error(
    `Nieprawidłowa baza Etapu I: oczekiwano ${QUESTION_COUNT} pytań, otrzymano ${
      Array.isArray(questions) ? questions.length : "nie-tablicę"
    }.`
  );
}

writeFileSync(OUTPUT, JSON.stringify(questions), "utf8");
console.log(`Etap I: zapisano ${questions.length} pytań do public/questions.json`);

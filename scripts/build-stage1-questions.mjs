import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

const QUESTION_COUNT = 615;
const sourceDir = join(process.cwd(), "public", "stage1q615");
const outputPath = join(process.cwd(), "public", "questions.json");

const parts = readdirSync(sourceDir)
  .filter((name) => /^data_\d+\.txt$/.test(name))
  .sort();

if (parts.length === 0) {
  throw new Error("Brak plików bazy Etapu I w public/stage1q615.");
}

const encoded = parts
  .map((name) => readFileSync(join(sourceDir, name), "utf8").trim())
  .join("");

const jsonText = gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
const questions = JSON.parse(jsonText);

if (!Array.isArray(questions) || questions.length !== QUESTION_COUNT) {
  throw new Error(
    `Nieprawidłowa baza Etapu I: oczekiwano ${QUESTION_COUNT} pytań, otrzymano ${Array.isArray(questions) ? questions.length : "brak tablicy"}.`
  );
}

writeFileSync(outputPath, jsonText, "utf8");
console.log(`Etap I: wygenerowano public/questions.json (${questions.length} pytań).`);

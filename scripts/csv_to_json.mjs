import fs from "fs";

const input = process.argv[2] || "questions.csv";
const output = process.argv[3] || "questions.json";

if (!fs.existsSync(input)) {
  console.error(`❌ Nie znaleziono pliku: ${input}`);
  process.exit(1);
}

const raw = fs.readFileSync(input, "utf-8");

// wykryj delimiter: jeśli dominuje tab i brak przecinków -> TSV, inaczej CSV
const delimiter = raw.includes("\t") && !raw.includes(",") ? "\t" : ",";

// Parser CSV/TSV z obsługą cudzysłowów
function parseDelimited(text, delim) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\uFEFF/g, "")) // usuń BOM jeśli jest
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return [];

  const headers = splitLine(lines[0], delim).map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitLine(lines[i], delim);

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim();
    });

    // pomiń totalnie puste wiersze
    const anyVal = Object.values(row).some((v) => String(v).trim().length > 0);
    if (anyVal) rows.push(row);
  }

  return rows;
}

// dzieli jedną linię na kolumny z uwzględnieniem cudzysłowów
function splitLine(line, delim) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // obsługa podwójnych cudzysłowów "" w polu
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && ch === delim) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out;
}

function normId(x) {
  return String(x ?? "").trim();
}

function isChoiceKey(x) {
  const u = String(x ?? "").trim().toUpperCase();
  return u === "A" || u === "B" || u === "C" || u === "D";
}

const rows = parseDelimited(raw, delimiter);

const result = [];
let skipped = 0;

for (const r of rows) {
  const type = String(r.type ?? "").trim();
  const id = normId(r.id);
  const question = String(r.question ?? "").trim();

  if (!type || !id || !question) {
    skipped++;
    continue;
  }

  if (type === "mcq") {
    const choices = [];

    (["A", "B", "C", "D"]).forEach((letter) => {
      const txt = String(r[letter] ?? "").trim();
      if (txt) choices.push({ key: letter, text: txt });
    });

    const correctRaw = String(r.correct ?? "").trim().toUpperCase();
    const correctKey = isChoiceKey(correctRaw) ? correctRaw : "";

    // ✅ najważniejsze: image też dla mcq
    const image = String(r.image ?? "").trim();

    if (choices.length < 2) {
      console.warn(`⚠️ Pomijam mcq id=${id} (za mało odpowiedzi: ${choices.length})`);
      skipped++;
      continue;
    }

    result.push({
      type: "mcq",
      id,
      question,
      choices,
      correctKey,
      image, // <--- TU
      why_correct_short: "",
      why_correct_long: "",
      trap: "",
    });
    continue;
  }

  // Zostawiamy obsługę innych typów jeśli kiedyś wrócisz do wpisywania
  if (type === "image_input") {
    const image = String(r.image ?? "").trim();
    const accepted = String(r.acceptedAnswers ?? "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    result.push({
      type: "image_input",
      id,
      question,
      image,
      acceptedAnswers: accepted,
      why_correct_short: "",
      why_correct_long: "",
      trap: "",
    });
    continue;
  }

  // nieznany typ
  console.warn(`⚠️ Nieznany typ "${type}" dla id=${id} — pomijam`);
  skipped++;
}

fs.writeFileSync(output, JSON.stringify(result, null, 2), "utf-8");

console.log(`✅ Zrobione: ${output}`);
console.log(`   Pytań: ${result.length}`);
if (skipped) console.log(`   Pominięte wiersze: ${skipped}`);
console.log(`   Wykryty delimiter: ${delimiter === "\t" ? "TAB (TSV)" : "comma (CSV)"}`);
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";

const MODEL_ID = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

env.allowLocalModels = false;
if ("useWasmCache" in env) env.useWasmCache = true;

let extractor = null;
let extractorPromise = null;
const progressListeners = new Set();

function emitProgress(info) {
  for (const listener of progressListeners) {
    try { listener(info); } catch {}
  }
}

function splitTranscript(text, maxChars = 420) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const parts = [];
  let current = "";

  const pushWords = (segment) => {
    const words = segment.split(" ").filter(Boolean);
    let chunk = current;
    for (const word of words) {
      const next = chunk ? `${chunk} ${word}` : word;
      if (next.length > maxChars && chunk) {
        parts.push(chunk);
        chunk = word;
      } else {
        chunk = next;
      }
    }
    current = chunk;
  };

  for (const sentence of sentences.length ? sentences : [clean]) {
    const next = current ? `${current} ${sentence}` : sentence;
    if (next.length <= maxChars) current = next;
    else {
      if (current) parts.push(current);
      current = "";
      pushWords(sentence);
    }
  }
  if (current) parts.push(current);
  return parts.length ? parts : [clean];
}

async function load(progressCallback) {
  if (progressCallback) progressListeners.add(progressCallback);
  try {
    if (extractor) return { ready: true, model: MODEL_ID };
    if (!extractorPromise) {
      extractorPromise = pipeline("feature-extraction", MODEL_ID, {
        dtype: "int8",
        progress_callback: (info) => emitProgress(info),
      });
    }
    extractor = await extractorPromise;
    emitProgress({ status: "ready", progress: 100, name: MODEL_ID });
    return { ready: true, model: MODEL_ID };
  } catch (error) {
    extractorPromise = null;
    extractor = null;
    throw error;
  } finally {
    if (progressCallback) progressListeners.delete(progressCallback);
  }
}

function rowFromTensor(tensor, row) {
  const dims = tensor?.dims || [];
  const data = tensor?.data;
  if (!data || dims.length < 2) throw new Error("Nieprawidłowy wynik modelu embeddingowego.");
  const width = dims[dims.length - 1];
  const start = row * width;
  return data.slice(start, start + width);
}

function dot(a, b) {
  let sum = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) sum += a[i] * b[i];
  return sum;
}

async function score(transcript, points, progressCallback) {
  const cleanPoints = (points || []).map((x) => String(x || "").trim()).filter(Boolean);
  if (!cleanPoints.length) return { similarities: [], transcriptChunks: 0, model: MODEL_ID };

  const transcriptParts = splitTranscript(transcript);
  if (!transcriptParts.length) {
    return { similarities: cleanPoints.map(() => 0), transcriptChunks: 0, model: MODEL_ID };
  }

  await load(progressCallback);
  const inputs = [...transcriptParts, ...cleanPoints];
  const output = await extractor(inputs, { pooling: "mean", normalize: true });
  const transcriptVectors = transcriptParts.map((_, i) => rowFromTensor(output, i));
  const pointVectors = cleanPoints.map((_, i) => rowFromTensor(output, transcriptParts.length + i));

  const similarities = pointVectors.map((pointVector) => {
    let best = -1;
    for (const transcriptVector of transcriptVectors) best = Math.max(best, dot(transcriptVector, pointVector));
    return Math.max(-1, Math.min(1, best));
  });

  return { similarities, transcriptChunks: transcriptParts.length, model: MODEL_ID };
}

window.__officerSemantic = { load, score, model: MODEL_ID };
window.dispatchEvent(new CustomEvent("officer-semantic-ready"));

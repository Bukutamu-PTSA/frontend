import { apiUrl, authHeaders } from "@/lib/api";
import { extractList, isRecord } from "@/lib/json";

export type SatisfactionSource = "aggregate" | "responses";

export type SatisfactionSummary = {
  index: number | null;
  scale: number;
  responses: number;
  source: SatisfactionSource;
};

const SCALE = 5;

const EMPTY_SUMMARY: SatisfactionSummary = {
  index: null,
  scale: SCALE,
  responses: 0,
  source: "responses",
};

const LIKERT_SCORE: Record<string, number> = { baik: 3, cukup: 2, kurang: 1 };

const DIMENSION_QUESTIONS = [2, 3, 4];

const DIMENSION_KEYS = ["komunikasi_petugas", "penjelasan_materi", "sarana_prasarana"] as const;

const SURVEY_LIST_KEYS = ["submissions", "data"];

function likertScore(value: unknown): number | null {
  if (value == null) return null;
  const text = String(value).trim().toLowerCase();
  if (!text) return null;
  return LIKERT_SCORE[text] ?? null;
}

function answerMap(item: Record<string, unknown>): Record<number, unknown> {
  const answers: Record<number, unknown> = {};

  const add = (rawNumber: unknown, value: unknown) => {
    const questionNumber = Number(rawNumber);
    if (Number.isInteger(questionNumber) && questionNumber >= 1 && value != null) {
      answers[questionNumber] = value;
    }
  };

  const raw = item["answers"];
  if (isRecord(raw)) Object.entries(raw).forEach(([key, value]) => add(key, value));

  const responses = item["responses"];
  if (Array.isArray(responses)) {
    responses.forEach((entry) => {
      if (!isRecord(entry)) return;
      add(entry["question_number"] ?? entry["survey_question_id"], entry["answer"]);
    });
  }

  return answers;
}

/** Skor likert 3 dimensi (Q2-Q4), atau dari field flat bila tak ada `answers`. */
function likertScores(item: Record<string, unknown>): number[] {
  const answers = answerMap(item);
  const fromAnswers = DIMENSION_QUESTIONS.map((qn) => likertScore(answers[qn])).filter(
    (score): score is number => score !== null,
  );
  if (fromAnswers.length > 0) return fromAnswers;

  return DIMENSION_KEYS.map((key) => likertScore(item[key])).filter(
    (score): score is number => score !== null,
  );
}

/**
 * Hitung indeks kepuasan dari daftar submission survei mentah.
 * Skor likert 1-3 (Kurang/Cukup/Baik) dikonversi ke skala 1-5 dengan (2*skor - 1)
 * sehingga Baik=5, Cukup=3, Kurang=1.
 */
function computeSatisfaction(items: unknown[]): SatisfactionSummary {
  const averages: number[] = [];
  items.filter(isRecord).forEach((item) => {
    const scores = likertScores(item);
    if (scores.length === 0) return;
    averages.push(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  });

  if (averages.length === 0) return { ...EMPTY_SUMMARY };

  const mean3 = averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
  return {
    index: Math.round((2 * mean3 - 1) * 100) / 100,
    scale: SCALE,
    responses: averages.length,
    source: "responses",
  };
}

function parseAggregate(payload: unknown): SatisfactionSummary | null {
  if (!isRecord(payload)) return null;

  const indexRaw =
    payload["satisfaction_index"] ??
    payload["index"] ??
    payload["score"] ??
    payload["skor"] ??
    payload["nilai"] ??
    payload["average"] ??
    payload["avg"];
  if (indexRaw == null) return null;

  const index = Number(indexRaw);
  if (!Number.isFinite(index)) return null;

  return {
    index,
    scale: Number(payload["satisfaction_scale"] ?? payload["scale"] ?? SCALE),
    responses: Number(
      payload["satisfaction_responses"] ??
        payload["responses"] ??
        payload["responden"] ??
        payload["jumlah"] ??
        0,
    ),
    source: "aggregate",
  };
}

function unwrapAggregate(json: unknown): unknown {
  if (!isRecord(json)) return json;
  return json["data"] ?? json["result"] ?? json["satisfaction"] ?? json;
}

/**
 * Ambil ringkasan indeks kepuasan survei untuk card dashboard/grafik.
 *
 * 1. Coba endpoint agregat /surveys/satisfaction?period=today (data hari ini).
 * 2. Bila tidak tersedia/tidak sesuai, hitung ulang dari /surveys/responses
 *    (sumber data riil yang sama dipakai halaman Report Survei).
 */
export async function fetchSatisfactionSummary(): Promise<SatisfactionSummary> {
  const headers = authHeaders();

  try {
    const aggrRes = await fetch(`${apiUrl("surveys/satisfaction")}?period=today`, { headers });
    if (aggrRes.ok) {
      const json: unknown = await aggrRes.json().catch(() => null);
      const parsed = parseAggregate(unwrapAggregate(json));
      if (parsed) return parsed;
    }
  } catch {
    // endpoint agregat belum tersedia — lanjut ke fallback
  }

  try {
    const res = await fetch(`${apiUrl("surveys/responses")}?per_page=100`, { headers });
    if (!res.ok) return { ...EMPTY_SUMMARY };

    const json: unknown = await res.json().catch(() => null);
    return computeSatisfaction(extractList(json, SURVEY_LIST_KEYS));
  } catch {
    return { ...EMPTY_SUMMARY };
  }
}

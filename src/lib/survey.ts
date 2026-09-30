/**
 * Pembacaan data survei dari backend.
 *
 * Endpoint terkait:
 * - `GET /api/surveys/responses` -> daftar submission (dipakai untuk menemukan
 *   survey id mana yang aktif dipakai responden).
 * - `GET /api/surveys/{survey}`  -> detail survey beserta array `questions`.
 * - `PUT /api/surveys/{survey}`  -> update satu pertanyaan lewat
 *   `{ question_text, options }`.
 */

import { apiUrl, authHeaders } from "@/lib/api";
import { isRecord } from "@/lib/json";

export const SURVEYS_API_URL = apiUrl("surveys");

/** Survey id cadangan dipakai kalau tidak ada respons yang menyebut survey id. */
export const FALLBACK_SURVEY_ID = 1;

export interface SurveyQuestion {
  id?: number | undefined;
  question_number?: number | undefined;
  question_text: string;
  type?: string | null | undefined;
  options: string[];
}

/** Baca array `options` dari berbagai bentuk (array, JSON string, null). */
export function readOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((o) => String(o ?? "").trim());
  if (typeof raw === "string" && raw.trim() !== "") {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((o) => String(o ?? "").trim());
    } catch {
      // Bukan JSON: anggap sebagai satu opsi.
    }
    return [raw.trim()];
  }
  return [];
}

function toQuestion(raw: unknown): SurveyQuestion | null {
  if (!isRecord(raw)) return null;
  const text = String(raw["question_text"] ?? raw["pertanyaan"] ?? "").trim();
  if (text === "") return null;

  return {
    id: raw["id"] == null ? undefined : Number(raw["id"]),
    question_number:
      raw["question_number"] == null ? undefined : Number(raw["question_number"]),
    question_text: text,
    type: raw["type"] == null ? null : String(raw["type"]),
    options: readOptions(raw["options"]),
  };
}

/**
 * Ambil array `questions` dari respons `GET /api/surveys/{id}`.
 * Menangani `{ data: { questions: [...] } }`, `{ questions: [...] }`, dan array polos.
 */
export function extractQuestions(json: unknown): SurveyQuestion[] {
  if (Array.isArray(json)) return json.map(toQuestion).filter((q) => q !== null);

  if (!isRecord(json)) return [];

  const data = json["data"];
  const source = isRecord(data) ? (data["questions"] ?? data) : json["questions"];

  if (Array.isArray(source)) return source.map(toQuestion).filter((q) => q !== null);
  return [];
}

/** Pertanyaan yang punya opsi jawaban (tipe likert), yaitu yang bisa diedit form. */
export function editableQuestions(questions: SurveyQuestion[]): SurveyQuestion[] {
  return questions.filter((q) => q.options.length > 0);
}

/**
 * Cari satu pertanyaan berdasarkan id baris tabel.
 *
 * `id` dikirim sebagai `questions[].id` asli dari API. `question_number`
 * dipakai sebagai cadangan supaya id urut lama tetap resolve.
 */
export function findQuestionByRowId(
  questions: SurveyQuestion[],
  rowId: number,
): SurveyQuestion | null {
  const byId = questions.find((q) => q.id === rowId);
  if (byId) return byId;

  const byNumber = questions.find((q) => q.question_number === rowId);
  if (byNumber) return byNumber;

  return editableQuestions(questions)[0] ?? questions[0] ?? null;
}

/** Ambil daftar id survey yang muncul di respons `/api/surveys/responses`. */
export function extractSurveyIds(json: unknown): number[] {
  const found = new Set<number>();

  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!isRecord(value)) return;

    for (const key of ["survey_id", "surveyId"] as const) {
      const raw = value[key];
      const num = Number(raw);
      if (raw != null && Number.isInteger(num) && num > 0) found.add(num);
    }

    ["submissions", "data", "items", "results"].forEach((key) => {
      const nested = value[key];
      if (nested != null) visit(nested);
    });
  };

  visit(json);
  return [...found];
}

/** Baca pesan error dari respons Laravel (message / errors / nested data). */
export async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  const json: unknown = await res.json().catch(() => null);
  if (!isRecord(json)) return fallback;

  if (isRecord(json["errors"])) {
    const messages = Object.values(json["errors"])
      .flat()
      .filter((v): v is string => typeof v === "string");
    if (messages.length > 0) return messages.join(", ");
  }

  const data = json["data"];
  if (isRecord(data) && typeof data["message"] === "string") return data["message"];
  if (typeof json["message"] === "string") return json["message"];

  return fallback;
}

/** `GET /api/surveys/{survey}` -> daftar pertanyaan survey tersebut. */
export async function fetchSurveyQuestions(surveyId: number): Promise<SurveyQuestion[]> {
  const res = await fetch(`${SURVEYS_API_URL}/${surveyId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, `Gagal memuat data (HTTP ${res.status}).`));
  }

  return extractQuestions(await res.json());
}

/**
 * Tentukan survey id mana yang dipakai halaman data survei.
 *
 * `GET /api/surveys` tidak tersedia (balas 405), jadi id dicari dari submission
 * di `/api/surveys/responses`. Kalau belum ada respons sama sekali, jatuh ke
 * `FALLBACK_SURVEY_ID`.
 */
export async function resolveSurveyId(): Promise<number> {
  try {
    const res = await fetch(`${SURVEYS_API_URL}/responses?per_page=100`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (res.ok) {
      const ids = extractSurveyIds(await res.json());
      const latest = ids.sort((a, b) => b - a)[0];
      if (latest) return latest;
    }
  } catch (err) {
    console.error("[data_survei] Gagal mencari survey id dari responses:", err);
  }

  return FALLBACK_SURVEY_ID;
}

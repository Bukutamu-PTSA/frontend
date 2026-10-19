/**
 * Pembacaan respons JSON dari backend yang bentuknya tidak seragam
 * (Laravel paginate, resource wrapper, atau array polos).
 */

/** Type guard untuk nilai yang aman dibaca sebagai objek. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const DEFAULT_LIST_KEYS = ["data", "notifications"];

function pickArray(
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown[] | undefined {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value;
  }
  return undefined;
}

/**
 * Ambil array pertama yang ditemukan, mendukung bentuk:
 * `[...]`, `{ data: [...] }`, `{ notifications: [...] }`, dan
 * `{ data: { data: [...] } }`.
 */
export function extractList(json: unknown, keys: readonly string[] = DEFAULT_LIST_KEYS): unknown[] {
  if (Array.isArray(json)) return json;
  if (!isRecord(json)) return [];

  const direct = pickArray(json, keys);
  if (direct) return direct;

  const nested = json["data"];
  return isRecord(nested) ? (pickArray(nested, keys) ?? []) : [];
}

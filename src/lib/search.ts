/**
 * Utilitas incremental search (filter langsung saat mengetik) untuk tabel/list admin.
 *
 * - Tidak peka huruf besar/kecil dan aksen ("é" == "e").
 * - Multi-kata: setiap kata kunci harus muncul di salah satu field (logika AND),
 *   jadi "budi jakarta" cocok dengan baris yang memuat "Budi" dan "Jakarta".
 * - Field null/undefined/angka aman dipakai.
 */

type SearchField = string | number | boolean | null | undefined;

/** Normalisasi teks: lowercase, hapus aksen, rapikan spasi. */
export function normalizeSearchText(value: SearchField): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Pecah query menjadi daftar kata kunci yang sudah dinormalisasi. */
export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  return normalized ? normalized.split(" ") : [];
}

/**
 * True bila semua kata kunci di `query` ditemukan di gabungan `fields`.
 * Query kosong selalu cocok.
 */
export function matchesSearch(query: string, fields: SearchField[]): boolean {
  const terms = tokenizeQuery(query);
  if (terms.length === 0) return true;
  const haystack = fields.map(normalizeSearchText).join(" ");
  return terms.every((term) => haystack.includes(term));
}

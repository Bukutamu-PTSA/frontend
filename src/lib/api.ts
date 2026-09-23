/**
 * Konfigurasi API terpusat (softcode).
 *
 * Semua URL backend diturunkan dari satu env var: VITE_API_HOST.
 * Ubah nilainya di file `.env` (VITE_API_HOST) tanpa perlu menyentuh kode.
 */

// Host backend, mis. "http://192.168.147.199:8000". Fallback ke default lama
// agar aplikasi tetap jalan bila .env belum diisi.
export const API_HOST: string = (
  (import.meta.env["VITE_API_HOST"] as string | undefined) ?? "http://192.168.156.206:8000"
).replace(/\/+$/, "");

/** Base URL REST utama, mis. "http://host:8000/api". */
export const API_BASE_URL = `${API_HOST}/api`;

/** Base URL modul auth v1, mis. "http://host:8000/api/v1/auth". */
export const AUTH_BASE_URL = `${API_BASE_URL}/v1/auth`;

/**
 * Bangun URL absolut ke sebuah path di bawah /api.
 * @example apiUrl("complaints") -> "http://host:8000/api/complaints"
 */
export function apiUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `${API_BASE_URL}/${clean}`;
}

/**
 * Bangun URL absolut ke aset storage backend.
 * @example storageUrl("foo/bar.jpg") -> "http://host:8000/storage/foo/bar.jpg"
 */
export function storageUrl(filePath: string): string {
  const clean = filePath.replace(/^\/?storage\//, "").replace(/^\/+/, "");
  return `${API_HOST}/storage/${clean}`;
}

/** Ambil token auth dari local/session storage (browser only). */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token") || null;
}

/** Header standar termasuk Authorization bila token tersedia. */
export function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getAuthToken();
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

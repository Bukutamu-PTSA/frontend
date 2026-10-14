/**
 * Sumber kebenaran untuk sesi login dan hak akses per role.
 *
 * Catatan penting: token & data user disimpan di Web Storage (bukan cookie),
 * jadi TIDAK bisa dibaca saat server render. Semua pemeriksaan role di sini
 * hanya berlaku di sisi browser.
 */

import { storageUrl } from "@/lib/api";

/** Role yang dikenali aplikasi. Nilai ini mengikuti backend (`v1/auth`). */
export type UserRole = "super_admin" | "admin";

/** Data user yang dipakai untuk display di sidebar. */
export interface AuthUser {
  name: string;
  role: string;
  avatar: string;
}

/**
 * Halaman yang hanya boleh dibuka role super admin.
 *
 * `/admin/setting` adalah pusatnya, tapi daftar ini juga memuat halaman yang
 * ditautkan dari card di dalamnya — kalau tidak, admin biasa cukup mengetik URL
 * untuk melewati guard.
 */
const SUPER_ADMIN_ONLY_PATHS: readonly string[] = [
  "/admin/setting",
  // Turunan dari card "Manajemen User".
  "/admin/manajemen_user",
  "/admin/tambah_user",
  "/admin/edit_user",
  // Turunan dari card "FAQ".
  "/admin/faq",
  // Turunan dari card di "General Settings" & "App & Services".
  "/admin/data_survei",
  "/admin/edit_survei",
  "/admin/data_skala",
  "/admin/edit_skala",
  "/admin/data_visitor",
  "/admin/jenis_pengaduan",
];

/**
 * Samakan berbagai variasi penulisan role dari backend/seed lama
 * ("Super Admin", "super-admin", "administrator") ke nilai kanonik.
 *
 * Role yang tidak dikenali jatuh ke "admin" — bukan ke super admin. Ini
 * keputusan yang aman: kalau backend someday mengirim role baru, user tidak
 * otomatis mendapat akses ke semua halaman sensitif.
 */
export function normalizeRole(raw: unknown): UserRole {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (key === "super_admin" || key === "superadmin" || key === "administrator") {
    return "super_admin";
  }

  return "admin";
}

/** Ambil & normalisasi user login dari localStorage/sessionStorage. */
export function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
  if (!raw) return null;

  try {
    const u = JSON.parse(raw);
    if (typeof u !== "object" || u === null) return null;

    const name = String(u.name ?? u.nama ?? u.nama_lengkap ?? u.username ?? u.email ?? "Pengguna");

    // `role` bisa berupa string atau objek ({ name: "Super Admin" }).
    const roleSource = u.role_name ?? u.role ?? u.jabatan ?? u.position ?? "";
    const roleValue =
      typeof roleSource === "object" && roleSource !== null
        ? (roleSource.name ?? roleSource.role_name ?? "")
        : roleSource;

    const rawAvatar = String(u.avatar ?? u.photo ?? u.foto ?? u.image ?? "");
    const avatar = rawAvatar
      ? /^https?:\/\//.test(rawAvatar)
        ? rawAvatar
        : storageUrl(rawAvatar)
      : "";

    return { name, role: String(roleValue || "Petugas"), avatar };
  } catch {
    return null;
  }
}

/** Token auth dari Web Storage, atau null saat belum login / di server. */
export function readAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

/** Role user yang sedang login, atau null kalau belum login. */
export function readRole(): UserRole | null {
  if (!readAuthToken()) return null;
  return normalizeRole(readStoredUser()?.role);
}

/** True kalau ada sesi login yang valid di sisi browser. */
export function hasSession(): boolean {
  return Boolean(readAuthToken());
}

/** True hanya untuk role super admin. */
export function isSuperAdmin(): boolean {
  return readRole() === "super_admin";
}

/**
 * Apakah user saat ini boleh membuka `pathname`.
 *
 * `pathname` dibandingkan dengan prefiks, bukan persis sama, supaya
 * `/admin/edit_user?id=1` tetap ikut aturan `/admin/edit_user`.
 */
export function canAccessPath(pathname: string): boolean {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "";

  const isSuperAdminOnly = SUPER_ADMIN_ONLY_PATHS.some(
    (allowed) => path === allowed || path.startsWith(`${allowed}/`),
  );

  return isSuperAdminOnly ? isSuperAdmin() : true;
}

/** Daftar halaman yang dikunci — dipakai untuk penyaringan menu sidebar. */
export function isSuperAdminOnlyPath(pathname: string): boolean {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "";
  return SUPER_ADMIN_ONLY_PATHS.some(
    (allowed) => path === allowed || path.startsWith(`${allowed}/`),
  );
}

/** Hapus seluruh sesi login (dipakai saat logout). */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_user");
}

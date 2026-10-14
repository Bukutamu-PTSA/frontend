/**
 * Penjaga akses route untuk seluruh halaman di bawah `/admin/*`.
 *
 * Dipasang satu kali di `src/routes/admin/route.tsx` (layout route), sehingga
 * `beforeLoad`-nya otomatis jalan sebelum setiap halaman admin dirender.
 *
 * Aturannya dua lapis:
 * 1. Semua halaman /admin/* wajib punya sesi login.
 * 2. Halaman khusus super admin (/admin/setting beserta turunannya) tidak bisa
 *    dibuka role admin biasa.
 *
 * PENTING soal SSR: token disimpan di localStorage/sessionStorage yang tidak
 * bisa dibaca di server, sehingga guard ini hanya berlaku di browser. Route
 * admin diberi `ssr: false` supaya tidak sempat ter-render di server.
 */

import { redirect } from "@tanstack/react-router";

import { canAccessPath, hasSession } from "@/lib/auth";

/**
 * Guard sebelum halaman admin dirender.
 *
 * - belum login  -> /login, sambil menyimpan tujuan agar bisa kembali ke sana.
 * - role kurang  -> /admin/dashboard.
 */
export function adminAccessGuard({ location }: { location: { pathname: string } }) {
  // Hanya relevan di browser; route admin sudah `ssr: false`.
  if (typeof window === "undefined") return;

  if (!hasSession()) {
    throw redirect({
      to: "/login",
      search: { redirect: location.pathname },
    });
  }

  if (!canAccessPath(location.pathname)) {
    throw redirect({ to: "/admin/dashboard" });
  }
}

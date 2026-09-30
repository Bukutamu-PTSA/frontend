import { Outlet, createFileRoute } from "@tanstack/react-router";

import { adminAccessGuard } from "@/lib/admin-guard";

/**
 * Layout route untuk seluruh halaman di bawah `/admin/*`.
 *
 * Menaruh guard di sini (bukan di tiap file) karena `beforeLoad` pada parent
 * selalu dijalankan sebelum child-nya. Satu titik untuk semua aturan akses.
 *
 * `ssr: false` dipakai karena token login hanya ada di localStorage/
 * sessionStorage yang tidak bisa dibaca server. Tanpa ini, halaman admin
 * ter-render di server dan `beforeLoad` baru berjalan setelah hydration.
 */
export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: adminAccessGuard,
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}

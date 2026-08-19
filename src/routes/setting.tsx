import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { settingMenu } from "@/lib/dashboard-data";

export const Route = createFileRoute("/setting")({
  head: () => ({
    meta: [
      { title: "Setting Apps · PTSA-KEMNAKER" },
      {
        name: "description",
        content:
          "Pusat pengaturan aplikasi layanan pengaduan: halaman beranda, data survei, userlogin, QR, dan master pengaduan.",
      },
      { property: "og:title", content: "Setting Apps · PTSA-KEMNAKER" },
      {
        property: "og:description",
        content: "Kelola konfigurasi aplikasi layanan pengaduan ketenagakerjaan.",
      },
    ],
  }),
  component: SettingPage,
});

function SettingPage() {
  return (
    <AppShell title="Setting Apps" breadcrumb="Setting">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {settingMenu.map((s) => (
          <button
            key={s.no}
            className="card-surface group relative overflow-hidden p-5 text-left transition-shadow hover:shadow-lift"
          >
            <span
              className={`absolute inset-x-0 top-0 h-1 ${s.tone === "warning" ? "bg-warning" : "bg-gradient-brand"}`}
            />
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground">
                {s.no}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display font-semibold">{s.nama}</span>
                <span className="block truncate text-xs text-muted-foreground">{s.desc}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">LAYANAN PENGADUAN</p>
    </AppShell>
  );
}
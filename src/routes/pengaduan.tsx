import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, FileText, Filter, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { pengaduanWlkp } from "@/lib/dashboard-data";

export const Route = createFileRoute("/pengaduan")({
  head: () => ({
    meta: [
      { title: "Report Pengaduan WLKP · PTSA-KEMNAKER" },
      {
        name: "description",
        content:
          "Daftar pengaduan Wajib Lapor Ketenagakerjaan Perusahaan (WLKP) dengan pencarian, status, dan ekspor data.",
      },
      { property: "og:title", content: "Report Pengaduan WLKP · PTSA-KEMNAKER" },
      {
        property: "og:description",
        content: "Kelola dan telusuri pengaduan WLKP dari seluruh provinsi.",
      },
    ],
  }),
  component: PengaduanPage,
});

const statusTone: Record<string, string> = {
  Baru: "bg-info/15 text-info",
  Proses: "bg-warning/20 text-warning",
  Selesai: "bg-success/15 text-success",
};

function PengaduanPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return pengaduanWlkp;
    return pengaduanWlkp.filter((r) =>
      [r.pelapor, r.perusahaan, r.provinsi, r.desk].join(" ").toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <AppShell title="Report Pengaduan WLKP" breadcrumb="Report Pengaduan">
      <div className="card-surface overflow-hidden">
        <div className="grid gap-3 border-b border-border px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">Report Pelayanan Pengaduan WLKP</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Menampilkan {rows.length} dari 5.322 entri
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["Copy", "CSV", "Excel", "PDF"].map((a) => (
              <button
                key={a}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Download className="h-3.5 w-3.5" />
                {a}
              </button>
            ))}
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>
        </div>

        <div className="px-5 py-4">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40 sm:max-w-sm">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari pelapor, perusahaan, provinsi…"
              className="w-full min-w-0 bg-transparent text-sm focus:outline-none"
            />
          </label>
        </div>

        {/* Mobile cards */}
        <ul className="space-y-3 px-4 pb-5 lg:hidden">
          {rows.map((r, i) => (
            <li key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate text-sm font-semibold">{r.perusahaan}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusTone[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {r.pelapor} · {r.provinsi}
              </p>
              <p className="mt-2 text-sm text-foreground/80">{r.desk}</p>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <p className="truncate text-xs text-muted-foreground">{r.tanggal}</p>
                <ToolButtons />
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">Pelapor</th>
                <th className="px-5 py-3 font-semibold">Perusahaan</th>
                <th className="px-5 py-3 font-semibold">Provinsi</th>
                <th className="px-5 py-3 font-semibold">Deskripsi</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Tools</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border align-top hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{r.tanggal}</td>
                  <td className="px-5 py-4 font-medium">{r.pelapor}</td>
                  <td className="px-5 py-4">{r.perusahaan}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.provinsi}</td>
                  <td className="max-w-xs px-5 py-4 text-muted-foreground">{r.desk}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <ToolButtons />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 border-t border-border px-5 py-4 sm:flex sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Halaman 1 dari 533</p>
          <div className="flex flex-wrap items-center gap-1">
            {["Prev", "1", "2", "3", "4", "…", "533", "Next"].map((p) => (
              <button
                key={p}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  p === "1"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ToolButtons() {
  const tools = [
    { icon: FileText, tone: "text-info hover:bg-info/10", label: "Berkas" },
    { icon: Pencil, tone: "text-primary hover:bg-primary/10", label: "Ubah" },
    { icon: Eye, tone: "text-success hover:bg-success/10", label: "Lihat" },
    { icon: Trash2, tone: "text-destructive hover:bg-destructive/10", label: "Hapus" },
  ];
  return (
    <div className="flex shrink-0 items-center gap-1">
      {tools.map((t) => (
        <button
          key={t.label}
          aria-label={t.label}
          className={`rounded-lg border border-border p-2 transition-colors ${t.tone}`}
        >
          <t.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
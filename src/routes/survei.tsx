import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, Filter, Search, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { surveiRingkasan, surveiResponden, type SurveiNilai } from "@/lib/dashboard-data";

export const Route = createFileRoute("/survei")({
  head: () => ({
    meta: [
      { title: "Report Survei Pelayanan · PTSA-KEMNAKER" },
      {
        name: "description",
        content:
          "Hasil survei kepuasan pelayanan pengaduan: komunikasi petugas, substansi materi, dan sarana prasarana.",
      },
      { property: "og:title", content: "Report Survei Pelayanan · PTSA-KEMNAKER" },
      {
        property: "og:description",
        content: "Rekap responden survei kepuasan layanan pengaduan ketenagakerjaan.",
      },
    ],
  }),
  component: SurveiPage,
});

const nilaiTone: Record<SurveiNilai, string> = {
  Baik: "bg-success/15 text-success",
  Cukup: "bg-warning/20 text-warning",
  Kurang: "bg-destructive/15 text-destructive",
};

const cardTone: Record<SurveiNilai, { bar: string; icon: typeof ThumbsUp; text: string }> = {
  Baik: { bar: "bg-success", icon: ThumbsUp, text: "text-success" },
  Cukup: { bar: "bg-warning", icon: Star, text: "text-warning" },
  Kurang: { bar: "bg-destructive", icon: ThumbsDown, text: "text-destructive" },
};

function SurveiPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"Semua" | SurveiNilai>("Semua");

  const rows = useMemo(() => {
    const s = q.toLowerCase().trim();
    return surveiResponden.filter((r) => {
      const cocokFilter =
        filter === "Semua" ||
        r.komunikasi === filter ||
        r.substansi === filter ||
        r.sarana === filter;
      const cocokCari =
        !s || [r.responden, r.keterangan, r.tanggal].join(" ").toLowerCase().includes(s);
      return cocokFilter && cocokCari;
    });
  }, [q, filter]);

  const totalResponden = surveiRingkasan.reduce((a, b) => a + b.total, 0);

  return (
    <AppShell title="Report Survei Pelayanan" breadcrumb="Report Survei">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {surveiRingkasan.map((s) => {
          const tone = cardTone[s.nilai];
          const Icon = tone.icon;
          return (
            <article key={s.nilai} className="card-surface relative overflow-hidden p-5">
              <span className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} />
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">{s.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Komunikasi, Materi, Sarpras
                  </p>
                </div>
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary ${tone.text}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold">
                {s.total.toLocaleString("id-ID")}
                <span className="ml-2 text-sm font-medium text-muted-foreground">Responden</span>
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <span
                  className={`block h-full rounded-full ${tone.bar}`}
                  style={{ width: `${s.share}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <p className="text-xs text-muted-foreground">{s.share}% dari total</p>
                <button
                  onClick={() => setFilter(s.nilai)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <div className="card-surface mt-6 overflow-hidden">
        <div className="grid gap-3 border-b border-border px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">Survei Responden Pelayanan</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Menampilkan {rows.length} dari {totalResponden.toLocaleString("id-ID")} responden
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

        <div className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,20rem)_auto] sm:items-center">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari responden atau keterangan…"
              className="w-full min-w-0 bg-transparent text-sm focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {(["Semua", "Baik", "Cukup", "Kurang"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile cards */}
        <ul className="space-y-3 px-4 pb-5 lg:hidden">
          {rows.map((r) => (
            <li key={r.no} className="rounded-2xl border border-border bg-surface p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate text-sm font-semibold">{r.responden}</p>
                <span className="shrink-0 text-xs text-muted-foreground">#{r.no}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.tanggal}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Nilai label="Komunikasi" value={r.komunikasi} />
                <Nilai label="Materi" value={r.substansi} />
                <Nilai label="Sarpras" value={r.sarana} />
              </div>
              <p className="mt-3 text-sm text-foreground/80">{r.keterangan}</p>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Tidak ada data survei.
            </li>
          )}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">No</th>
                <th className="px-5 py-3 font-semibold">Tanggal Survei</th>
                <th className="px-5 py-3 font-semibold">Responden</th>
                <th className="px-5 py-3 font-semibold">Komunikasi Petugas</th>
                <th className="px-5 py-3 font-semibold">Substansi Materi</th>
                <th className="px-5 py-3 font-semibold">Sarana Prasarana</th>
                <th className="px-5 py-3 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.no} className="border-t border-border align-top hover:bg-secondary/40">
                  <td className="px-5 py-4 text-muted-foreground">{r.no}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{r.tanggal}</td>
                  <td className="px-5 py-4 font-medium">{r.responden}</td>
                  <td className="px-5 py-4">
                    <Badge value={r.komunikasi} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge value={r.substansi} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge value={r.sarana} />
                  </td>
                  <td className="max-w-xs px-5 py-4 text-muted-foreground">{r.keterangan}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr className="border-t border-border">
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    Tidak ada data survei.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 border-t border-border px-5 py-4 sm:flex sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Menampilkan {rows.length} entri · periode Agustus 2026
          </p>
          <div className="flex flex-wrap items-center gap-1">
            {["Prev", "1", "2", "3", "Next"].map((p) => (
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

function Badge({ value }: { value: SurveiNilai }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${nilaiTone[value]}`}>
      {value}
    </span>
  );
}

function Nilai({ label, value }: { label: string; value: SurveiNilai }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${nilaiTone[value]}`}>
      {label}: {value}
    </span>
  );
}
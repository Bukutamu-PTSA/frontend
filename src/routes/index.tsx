import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Building2, FileStack, TrendingDown, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/app-shell";
import { kategoriPengaduan, skalaPerusahaan, trenBulanan, wilayah } from "@/lib/dashboard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Pengaduan PTSA-KEMNAKER" },
      {
        name: "description",
        content:
          "Dashboard modern layanan pengaduan ketenagakerjaan: ringkasan kategori, skala perusahaan, dan sebaran wilayah.",
      },
      { property: "og:title", content: "Dashboard Pengaduan PTSA-KEMNAKER" },
      {
        property: "og:description",
        content: "Pantau pengaduan ketenagakerjaan per kategori, skala perusahaan, dan provinsi.",
      },
    ],
  }),
  component: Index,
});

const totalPengaduan = kategoriPengaduan.reduce((a, b) => a + b.total, 0);
const totalPerusahaan = skalaPerusahaan.reduce((a, b) => a + b.total, 0);

const stats = [
  { label: "Total Pengaduan", value: totalPengaduan, icon: FileStack, delta: "+8,2%" },
  { label: "Perusahaan Terlapor", value: totalPerusahaan, icon: Building2, delta: "+3,1%" },
  { label: "Pelapor Aktif", value: 2481, icon: Users, delta: "+5,6%" },
  { label: "Provinsi Terpantau", value: 33, icon: ArrowUpRight, delta: "stabil" },
];

const nf = new Intl.NumberFormat("id-ID");

function Index() {
  const max = Math.max(...kategoriPengaduan.map((k) => k.total));

  return (
    <AppShell title="Dashboard" breadcrumb="Dashboard">
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-5 transition-shadow hover:shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-sm text-muted-foreground">{s.label}</p>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold">{nf.format(s.value)}</p>
              <p className="mt-1 text-xs font-medium text-success">{s.delta} vs bulan lalu</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="card-surface p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate text-base font-semibold">Tren Pengaduan Bulanan</h2>
              <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                7 bulan
              </span>
            </div>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trenBulanan} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="bulan"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pengaduan"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fill="url(#area)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-base font-semibold">Skala Perusahaan</h2>
            <ul className="mt-4 space-y-4">
              {skalaPerusahaan.map((s) => (
                <li key={s.nama}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-sm font-medium">{s.nama}</p>
                    <p className="shrink-0 text-sm font-semibold text-primary">
                      {nf.format(s.total)}
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-brand"
                      style={{ width: `${(s.total / totalPerusahaan) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-base font-semibold">Pengaduan Berdasarkan Kategori</h2>
            <Link
              to="/pengaduan"
              className="shrink-0 text-sm font-medium text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {kategoriPengaduan.map((k) => (
              <div key={k.nama} className="card-surface flex flex-col p-5 hover:shadow-lift">
                <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold">{k.nama}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="font-display text-2xl font-bold">{nf.format(k.total)}</p>
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      k.trend < 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                    }`}
                  >
                    {k.trend < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {k.trend === 0 ? "0%" : `${Math.abs(k.trend)}%`}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${Math.max((k.total / max) * 100, 2)}%` }}
                  />
                </div>
                <Link
                  to="/pengaduan"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                  Detail <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">Sebaran Pengaduan per Provinsi</h2>
            <p className="mt-1 text-xs text-muted-foreground">Menampilkan 10 dari 33 provinsi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Provinsi</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 text-right font-semibold">WLKP</th>
                  <th className="px-5 py-3 text-right font-semibold">Upah</th>
                  <th className="px-5 py-3 text-right font-semibold">Jamsos</th>
                  <th className="px-5 py-3 text-right font-semibold">Hub. Kerja</th>
                </tr>
              </thead>
              <tbody>
                {wilayah.map((w) => (
                  <tr key={w.provinsi} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-5 py-3 font-medium">{w.provinsi}</td>
                    <td className="px-5 py-3 text-right font-semibold text-primary">
                      {nf.format(w.total)}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{w.wlkp}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{w.upah}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{w.jamsos}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{w.hubker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronRight,
  Download,
  FileText,
  ShieldCheck,
  Star,
  WalletCards,
  Handshake,
  Clock3,
  Scale,
  BriefcaseBusiness,
  HeartPulse,
  PersonStanding,
  Bell,
  LogOut,
  Loader2,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  kategoriPengaduan,
  wilayah,
} from "@/lib/dashboard-data";

const BASE_API_URL = "http://192.168.147.199:8000/api/v1/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Dashboard Pengaduan PTSA-KEMNAKER",
      },
      {
        name: "description",
        content: "Dashboard pelayanan terpadu PTSA KEMNAKER.",
      },
    ],
  }),
  component: Index,
});

const nf = new Intl.NumberFormat("id-ID");

function Index() {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");

    // Bersihkan sesi di browser terlebih dahulu
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");

    try {
      if (token) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        await fetch(`${BASE_API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.warn("Logout request notice:", error);
    } finally {
      // Mengarahkan langsung ke halaman beranda/index
      window.location.href = "/";
    }
  };

  return (
    <AppShell
      title="Dashboard Pengaduan PTSA-KEMNAKER"
      breadcrumb="Dashboard"
    >
      <div className="space-y-5">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[13px] font-semibold text-foreground">
              Executive Dashboard
            </h1>

            <p className="mt-1 text-[9px] text-muted-foreground">
              Ringkasan performa pelayanan terpadu PTSA KEMNAKER
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="
                inline-flex items-center gap-2
                rounded-md
                border border-border
                bg-white
                px-3 py-2
                text-[9px]
                font-medium
                text-muted-foreground
                transition-colors
                hover:bg-secondary
              "
            >
              <CalendarDays className="h-3 w-3" />
              Hari ini
            </button>

            <button
              type="button"
              className="
                inline-flex items-center gap-2
                rounded-md
                border border-border
                bg-white
                px-3 py-2
                text-[9px]
                font-medium
                text-muted-foreground
                transition-colors
                hover:bg-secondary
              "
            >
              <Download className="h-3 w-3" />
              Export Laporan
            </button>

            {/* Tombol Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                inline-flex items-center gap-1.5
                rounded-md
                border border-red-200
                bg-red-50
                px-3 py-2
                text-[9px]
                font-medium
                text-red-600
                transition-colors
                hover:bg-red-100
                disabled:opacity-60
                cursor-pointer
              "
            >
              {loggingOut ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <LogOut className="h-3 w-3" />
              )}
              <span>{loggingOut ? "Keluar..." : "Logout"}</span>
            </button>
          </div>
        </section>


        {/* =====================================================
            STATISTIC CARDS
        ====================================================== */}
        <section className="grid gap-3 md:grid-cols-3">

          {/* Aduan Aktif */}
          <div className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div
                className="
                  grid h-8 w-8
                  shrink-0
                  place-items-center
                  rounded-md
                  bg-amber-50
                "
              >
                <FileText className="h-4 w-4 text-amber-500" />
              </div>

              <span
                className="
                  rounded-full
                  bg-amber-50
                  px-2.5 py-1
                  text-[8px]
                  font-medium
                  text-amber-600
                "
              >
                Sedang Diproses
              </span>
            </div>

            <p className="mt-3 text-[9px] text-muted-foreground">
              Aduan Aktif
            </p>

            <p className="mt-0.5 font-display text-[16px] font-bold text-foreground">
              42 Berkas
            </p>

            <p className="mt-1 text-[8px] text-muted-foreground">
              Aduan yang sedang dalam proses
            </p>
          </div>


          {/* Aduan Selesai */}
          <div className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div
                className="
                  grid h-8 w-8
                  shrink-0
                  place-items-center
                  rounded-md
                  bg-emerald-50
                "
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>

              <span
                className="
                  rounded-full
                  bg-emerald-50
                  px-2.5 py-1
                  text-[8px]
                  font-medium
                  text-emerald-600
                "
              >
                98,4% Rate
              </span>
            </div>

            <p className="mt-3 text-[9px] text-muted-foreground">
              Aduan Selesai Ditangani
            </p>

            <p className="mt-0.5 font-display text-[16px] font-bold text-foreground">
              5,482 Kasus
            </p>

            <p className="mt-1 text-[8px] text-muted-foreground">
              Total kasus berhasil ditangani
            </p>
          </div>


          {/* IKM */}
          <div className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div
                className="
                  grid h-8 w-8
                  shrink-0
                  place-items-center
                  rounded-md
                  bg-slate-50
                "
              >
                <Star className="h-4 w-4 text-slate-500" />
              </div>

              <span
                className="
                  rounded-full
                  bg-slate-100
                  px-2.5 py-1
                  text-[8px]
                  font-medium
                  text-slate-600
                "
              >
                Sangat Baik
              </span>
            </div>

            <p className="mt-3 text-[9px] text-muted-foreground">
              Indeks Kepuasan Masyarakat
            </p>

            <p className="mt-0.5 font-display text-[16px] font-bold text-foreground">
              4.85 / 5.00
            </p>

            <p className="mt-1 text-[8px] text-muted-foreground">
              Berdasarkan survei pelayanan
            </p>
          </div>

        </section>


        {/* =====================================================
            REKAPITULASI KATEGORI (TOP 3)
        ====================================================== */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <h2 className="truncate text-[10px] font-semibold text-foreground">
                Rekapitulasi Layanan Kategori
              </h2>
            </div>

            <Link
              to="/pengaduan"
              className="
                flex shrink-0
                items-center gap-1
                text-[8px]
                font-medium
                text-muted-foreground
                transition-colors
                hover:text-primary
              "
            >
              Lihat Semua Kategori
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <CategoryCard
              title="WAJIB LAPOR KETENAGAKERJAAN"
              value="11,267"
              icon={<FileText className="h-4 w-4 text-red-500" />}
              iconClass="bg-red-50"
            />
            <CategoryCard
              title="UPAH KERJA"
              value="245"
              icon={<WalletCards className="h-4 w-4 text-slate-600" />}
              iconClass="bg-slate-100"
            />
            <CategoryCard
              title="JAMINAN SOSIAL"
              value="19"
              icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
              iconClass="bg-emerald-50"
            />
          </div>
        </section>


        {/* =====================================================
            REPORT WILAYAH
        ====================================================== */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <h2 className="text-[10px] font-semibold text-foreground">
              Report Pelayanan Pengaduan Berdasarkan Wilayah
            </h2>
          </div>

          <div className="card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-[8px] font-semibold text-foreground">
                      NO
                    </th>
                    <th className="px-6 py-4 text-left text-[8px] font-semibold text-foreground">
                      Provinsi
                    </th>
                    <th className="px-6 py-4 text-right text-[8px] font-semibold text-foreground">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {wilayah.slice(0, 5).map((w, index) => (
                    <tr
                      key={w.provinsi}
                      className="
                        border-b
                        border-border/50
                        last:border-0
                        transition-colors
                        hover:bg-secondary/40
                      "
                    >
                      <td className="px-6 py-4 text-[8px] text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-[8px] text-foreground">
                        {w.provinsi}
                      </td>
                      <td className="px-6 py-4 text-right text-[8px] text-muted-foreground">
                        {nf.format(w.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="
                flex
                items-center
                justify-between
                border-t border-border
                px-6 py-3
              "
            >
              <p className="text-[7px] text-muted-foreground">
                Menampilkan 5 dari 128 data hari ini
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="grid h-6 w-6 place-items-center rounded text-[8px] text-muted-foreground hover:bg-secondary"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="grid h-6 w-6 place-items-center rounded bg-primary text-[8px] font-medium text-primary-foreground"
                >
                  1
                </button>
                <button
                  type="button"
                  className="grid h-6 w-6 place-items-center rounded text-[8px] text-muted-foreground hover:bg-secondary"
                >
                  2
                </button>
                <button
                  type="button"
                  className="grid h-6 w-6 place-items-center rounded text-[8px] text-muted-foreground hover:bg-secondary"
                >
                  3
                </button>
                <button
                  type="button"
                  className="grid h-6 w-6 place-items-center rounded text-[8px] text-muted-foreground hover:bg-secondary"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* =====================================================
            DAFTAR KATEGORI LENGKAP
        ====================================================== */}
        <section>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              title="WAJIB LAPOR KETENAGAKERJAAN"
              value="11,267"
              icon={<FileText className="h-4 w-4 text-red-500" />}
              iconClass="bg-red-50"
            />
            <CategoryCard
              title="UPAH KERJA"
              value="245"
              icon={<WalletCards className="h-4 w-4 text-slate-600" />}
              iconClass="bg-slate-100"
            />
            <CategoryCard
              title="JAMINAN SOSIAL"
              value="19"
              icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
              iconClass="bg-emerald-50"
            />
            <CategoryCard
              title="HUBUNGAN KERJA"
              value="5,310"
              icon={<Handshake className="h-4 w-4 text-purple-500" />}
              iconClass="bg-purple-50"
            />
            <CategoryCard
              title="KECELAKAAN KERJA"
              value="147"
              icon={<PersonStanding className="h-4 w-4 text-orange-500" />}
              iconClass="bg-orange-50"
            />
            <CategoryCard
              title="WAKTU KERJA & WAKTU ISTIRAHAT"
              value="14"
              icon={<Clock3 className="h-4 w-4 text-yellow-500" />}
              iconClass="bg-yellow-50"
            />
            <CategoryCard
              title="KADER NORMA KETENAGAKERJAAN"
              value="5,310"
              icon={<Scale className="h-4 w-4 text-blue-500" />}
              iconClass="bg-blue-50"
            />
            <CategoryCard
              title="PENEMPATAN TK DALAM & LUAR NEGERI"
              value="147"
              icon={<BriefcaseBusiness className="h-4 w-4 text-cyan-500" />}
              iconClass="bg-cyan-50"
            />
            <CategoryCard
              title="KESELAMATAN & KESEHATAN KERJA"
              value="14"
              icon={<HeartPulse className="h-4 w-4 text-red-500" />}
              iconClass="bg-red-50"
            />
          </div>
        </section>


        {/* =====================================================
            PUSAT NOTIFIKASI
        ====================================================== */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <h2 className="truncate text-[10px] font-semibold text-foreground">
                Pusat Notifikasi
              </h2>
            </div>

            <button
              type="button"
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-primary
                px-3 py-1.5
                text-[8px]
                font-medium
                text-primary-foreground
                transition-colors
                hover:bg-primary/90
              "
            >
              ✓ Tandai Semua Dibaca
            </button>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="
                  flex items-start gap-3
                  rounded-xl
                  bg-secondary/50
                  p-4
                  transition-colors
                  hover:bg-secondary
                "
              >
                <div
                  className="
                    grid h-8 w-8
                    shrink-0
                    place-items-center
                    rounded-full
                    bg-red-100
                  "
                >
                  <Bell className="h-4 w-4 text-red-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[9px] font-semibold text-foreground">
                      Aduan Baru: Penahanan Dokumen
                    </p>

                    <span className="shrink-0 text-[8px] text-muted-foreground">
                      10 menit yang lalu
                    </span>
                  </div>

                  <p className="mt-1 text-[8px] leading-4 text-muted-foreground">
                    Terdapat laporan baru dari Budi Santoso mengenai penahanan
                    ijazah asli oleh PT Jaya Makmur Sentosa. Segera lakukan
                    peninjauan awal.
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className="
                        rounded-md
                        bg-white
                        px-2 py-1
                        text-[7px]
                        text-muted-foreground
                      "
                    >
                      No. Tiket: TKT-2023-08-001
                    </span>

                    <span
                      className="
                        rounded-md
                        bg-white
                        px-2 py-1
                        text-[7px]
                        text-muted-foreground
                      "
                    >
                      Kategori: Hubungan Industrial
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </AppShell>
  );
}

/* =============================================================
   CATEGORY CARD
============================================================= */

interface CategoryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}

function CategoryCard({
  title,
  value,
  icon,
  iconClass,
}: CategoryCardProps) {
  return (
    <div
      className="
        card-surface
        p-4
        transition-shadow
        hover:shadow-lift
      "
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            grid h-9 w-9
            shrink-0
            place-items-center
            rounded-md
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <h3
          className="
            min-w-0
            pt-0.5
            text-[9px]
            font-semibold
            leading-4
            text-foreground
          "
        >
          {title}
        </h3>
      </div>

      <p className="mt-4 text-[9px] text-muted-foreground">
        {value} Pengaduan
      </p>

      <Link
        to="/pengaduan"
        className="
          mt-3
          flex
          w-full
          items-center
          justify-center
          gap-1
          rounded-md
          bg-secondary
          py-2
          text-[8px]
          font-medium
          text-muted-foreground
          transition-all
          hover:bg-secondary/80
          hover:text-foreground
        "
      >
        Lihat Detail
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
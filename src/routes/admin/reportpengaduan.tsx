import React, { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Download,
  FileText,
  Eye,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin/reportpengaduan")({
  head: () => ({
    meta: [
      {
        title: "All Report Pengaduan - PTSA KEMNAKER",
      },
    ],
  }),
  component: ReportPengaduanPage,
});

const nf = new Intl.NumberFormat("id-ID");

// ================= STAT SKALA USAHA =================
const SCALE_STATS = [
  { key: "mikro", label: "MIKRO", total: 714 },
  { key: "kecil", label: "KECIL", total: 291 },
  { key: "menengah", label: "MENENGAH", total: 312 },
  { key: "besar", label: "BESAR", total: 272 },
];

// ================= DUMMY DATA TABEL =================
interface ReportRow {
  no: number;
  tanggal: string;
  jenis: string;
  pelapor: string;
  perusahaan: string;
}

const ALL_ROWS: ReportRow[] = [
  { no: 1, tanggal: "27 Aug 2026", jenis: "WLKP", pelapor: "Dinda Nurhaliza", perusahaan: "PT Accentuates" },
  { no: 2, tanggal: "27 Aug 2026", jenis: "WLKP", pelapor: "Deasy Ayu Wulan", perusahaan: "PT Raharja Energi" },
  { no: 3, tanggal: "26 Aug 2026", jenis: "WLKP", pelapor: "Anggun Puspita", perusahaan: "PT Mitra-Net" },
  { no: 4, tanggal: "25 Aug 2026", jenis: "Norma Kerja", pelapor: "Budi Santoso", perusahaan: "PT Maju Jaya" },
  { no: 5, tanggal: "25 Aug 2026", jenis: "K3", pelapor: "Siti Aminah", perusahaan: "PT Konstruksi Abadi" },
  { no: 6, tanggal: "24 Aug 2026", jenis: "Upah", pelapor: "Rahmat Hidayat", perusahaan: "PT Retail Sejahtera" },
  { no: 7, tanggal: "24 Aug 2026", jenis: "PHK", pelapor: "Lestari Putri", perusahaan: "PT Tekno Solusi" },
  { no: 8, tanggal: "23 Aug 2026", jenis: "WLKP", pelapor: "Andi Wijaya", perusahaan: "PT Logistik Cepat" },
  { no: 9, tanggal: "22 Aug 2026", jenis: "K3", pelapor: "Retno Sari", perusahaan: "PT Energi Terbarukan" },
  { no: 10, tanggal: "21 Aug 2026", jenis: "Upah", pelapor: "Fajar Nugroho", perusahaan: "PT Sinar Mas" },
  { no: 11, tanggal: "20 Aug 2026", jenis: "Norma Kerja", pelapor: "Wulan Sari", perusahaan: "PT Cahaya Abadi" },
  { no: 12, tanggal: "19 Aug 2026", jenis: "PHK", pelapor: "Bagus Prasetyo", perusahaan: "PT Karya Utama" },
];

const MONTH_OPTIONS = [
  "Semua Bulan",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const YEAR_OPTIONS = ["2026", "2025", "2024", "2023"];

const TOTAL_DATA = 128;

function ReportPengaduanPage() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("Semua Bulan");
  const [year, setYear] = useState("2026");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.pelapor.toLowerCase().includes(q) ||
        r.perusahaan.toLowerCase().includes(q) ||
        r.jenis.toLowerCase().includes(q)
    );
  }, [appliedSearch]);

  const totalPages = Math.max(1, Math.ceil(TOTAL_DATA / itemsPerPage));

  const displayedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilter = () => {
    setAppliedSearch(search);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setMonth("Semua Bulan");
    setYear("2026");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  return (
    <AppShell>
      <div className="space-y-5">
        {/* ================= HEADER PAGE ================= */}
        <div>
          <h1 className="text-[15px] font-bold text-gray-800 tracking-tight">
            All Report Pengaduan
          </h1>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                placeholder="Cari pengaduan..."
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64]"
              />
            </div>

            {/* Month select */}
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#007A64] cursor-pointer"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-gray-400">
                ▼
              </span>
            </div>

            {/* Year select */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#007A64] cursor-pointer"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-gray-400">
                ▼
              </span>
            </div>

            {/* Filter button */}
            <button
              type="button"
              onClick={handleFilter}
              className="inline-flex items-center justify-center rounded-lg bg-[#0F2137] px-5 py-2 text-[11px] font-semibold text-white hover:bg-[#1a2f4a] transition-colors cursor-pointer"
            >
              Filter
            </button>

            {/* Reset button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ================= STAT SKALA USAHA ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SCALE_STATS.map((stat) => (
            <div
              key={stat.key}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-center"
            >
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                {stat.label}
              </p>
              <p className="mt-2 text-[18px] font-bold text-gray-900 leading-none">
                {nf.format(stat.total)}{" "}
                <span className="text-[12px] font-medium text-gray-500">
                  Pengaduan
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* ================= TABEL REPORT ================= */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F5FA] text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3.5 w-16">NO</th>
                  <th className="px-6 py-3.5">TANGGAL PENGADUAN</th>
                  <th className="px-6 py-3.5">JENIS PENGADUAN</th>
                  <th className="px-6 py-3.5">PELAPOR</th>
                  <th className="px-6 py-3.5">PERUSAHAAN</th>
                  <th className="px-6 py-3.5 text-right w-40">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {displayedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Tidak ada data pengaduan.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((row) => (
                    <tr
                      key={row.no}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-gray-600 font-medium">
                        {row.no}
                      </td>
                      <td className="px-6 py-3.5 text-gray-700">
                        {row.tanggal}
                      </td>
                      <td className="px-6 py-3.5 text-gray-700 font-medium">
                        {row.jenis}
                      </td>
                      <td className="px-6 py-3.5 text-gray-800 font-medium">
                        {row.pelapor}
                      </td>
                      <td className="px-6 py-3.5 text-gray-700">
                        {row.perusahaan}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Unduh"
                            className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Detail Berkas"
                            className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Lihat"
                            className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Hapus"
                            className="grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= FOOTER PAGINATION ================= */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-gray-500">
            Menampilkan {displayedRows.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {(currentPage - 1) * itemsPerPage + displayedRows.length} dari{" "}
            {nf.format(TOTAL_DATA)} data
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-[#007A64] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

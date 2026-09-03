import React, { useState, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  FileText,
  ShieldCheck,
  Star,
  WalletCards,
  Handshake,
  Layers,
  ArrowRight,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const COMPLAINTS_API_URL = "http://192.168.147.199:8000/api/complaints";
const SUMMARY_API_URL = "http://192.168.147.199:8000/api/dashboard/complaint-summary";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Executive Dashboard - PTSA KEMNAKER",
      },
    ],
  }),
  component: DashboardExecutive,
});

const nf = new Intl.NumberFormat("id-ID");

const WILAYAH_DATA = [
  { no: 1, provinsi: "Jawa Barat", total: 1243 },
  { no: 2, provinsi: "Jawa Timur", total: 324 },
  { no: 3, provinsi: "Jawa Tengah", total: 532 },
  { no: 4, provinsi: "Kalimantan Tengah", total: 342 },
  { no: 5, provinsi: "DKI Jakarta", total: 890 },
  { no: 6, provinsi: "Sumatera Utara", total: 215 },
  { no: 7, provinsi: "Banten", total: 430 },
  { no: 8, provinsi: "Bali", total: 180 },
];

function extractTotal(json: any): number {
  if (!json) return 0;
  if (typeof json.total === "number") return json.total;
  if (typeof json.meta?.total === "number") return json.meta.total;
  if (typeof json.data?.total === "number") return json.data.total;
  if (typeof json.pagination?.total === "number") return json.pagination.total;
  if (Array.isArray(json.data)) return json.data.length;
  if (Array.isArray(json)) return json.length;
  return 0;
}

function DashboardExecutive() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  const totalItems = 128;
  const totalPages = Math.ceil(WILAYAH_DATA.length / itemsPerPage);

  const [stats, setStats] = useState({
    activeCount: 0,
    resolvedCount: 0,
    resolutionRate: 0,
    ikmScore: 4.85,
    ikmLabel: "Sangat Baik",
  });

  const [categoryCounts, setCategoryCounts] = useState({
    wlkp: 0,
    upah: 0,
    jamsos: 0,
    hubKerja: 0,
  });

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "Semua Waktu";
    const parts = dateStr.split("-").map(Number);
    const year = parts[0] ?? new Date().getFullYear();
    const month = (parts[1] ?? 1) - 1;
    const day = parts[2] ?? 1;

    return new Date(year, month, day).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if ("showPicker" in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    if (dateInputRef.current) dateInputRef.current.value = "";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleExportLaporan = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "No,Provinsi,Total\n" +
      WILAYAH_DATA.map((w) => `${w.no},${w.provinsi},${w.total}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_PTSA_${selectedDate ?? "Semua_Waktu"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token =
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      const authHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const summaryUrl = selectedDate
          ? `${SUMMARY_API_URL}?date=${selectedDate}`
          : SUMMARY_API_URL;

        const summaryRes = await fetch(summaryUrl, {
          method: "GET",
          headers: authHeaders,
        });

        let summaryTotalAccumulated = 0;
        let countWlkp = 0;
        let countUpah = 0;
        let countJamsos = 0;
        let countHubKerja = 0;

        if (summaryRes.ok) {
          const summaryJson = await summaryRes.json();
          const summaryList: any[] = Array.isArray(summaryJson?.data)
            ? summaryJson.data
            : Array.isArray(summaryJson)
            ? summaryJson
            : [];

          summaryList.forEach((item: any) => {
            const id = Number(item.id);
            const code = String(item.category_code ?? "").toUpperCase();
            const total = Number(item.count ?? 0);

            summaryTotalAccumulated += total;

            if (id === 1 || code.includes("WAJIB")) countWlkp = total;
            else if (id === 2 || code.includes("UPAH")) countUpah = total;
            else if (id === 3 || code.includes("JAMSOS") || code.includes("SOSIAL")) countJamsos = total;
            else if (id === 4 || code.includes("HUBUNGAN")) countHubKerja = total;
          });

          setCategoryCounts({
            wlkp: countWlkp,
            upah: countUpah,
            jamsos: countJamsos,
            hubKerja: countHubKerja,
          });
        }

        const totalUrl = selectedDate
          ? `${COMPLAINTS_API_URL}?date=${selectedDate}`
          : COMPLAINTS_API_URL;

        const totalRes = await fetch(totalUrl, {
          method: "GET",
          headers: authHeaders,
        });

        let totalRecords = 0;
        let rawItemsList: any[] = [];

        if (totalRes.ok) {
          const totalJson = await totalRes.json();
          totalRecords = extractTotal(totalJson);
          rawItemsList = Array.isArray(totalJson?.data)
            ? totalJson.data
            : Array.isArray(totalJson?.data?.data)
            ? totalJson.data.data
            : Array.isArray(totalJson)
            ? totalJson
            : [];
        }

        if (totalRecords === 0 && summaryTotalAccumulated > 0) {
          totalRecords = summaryTotalAccumulated;
        }

        const resolvedUrl = selectedDate
          ? `${COMPLAINTS_API_URL}?status=SELESAI&date=${selectedDate}`
          : `${COMPLAINTS_API_URL}?status=SELESAI`;

        let resolvedCount = 0;
        try {
          const resolvedRes = await fetch(resolvedUrl, {
            method: "GET",
            headers: authHeaders,
          });

          if (resolvedRes.ok) {
            const resolvedJson = await resolvedRes.json();
            resolvedCount = extractTotal(resolvedJson);
          }
        } catch (e) {
          console.warn("Gagal query status SELESAI:", e);
        }

        if (resolvedCount === 0 && rawItemsList.length > 0) {
          resolvedCount = rawItemsList.filter((item: any) => {
            const s = String(item.status ?? item.status_pengaduan ?? "").toUpperCase();
            return s.includes("SELESAI") || s.includes("RESOLV") || s.includes("CLOSE") || s.includes("DONE");
          }).length;
        }

        const activeCount = Math.max(0, totalRecords - resolvedCount);
        const rate =
          totalRecords > 0
            ? Number(((resolvedCount / totalRecords) * 100).toFixed(1))
            : 0;

        setStats((prev) => ({
          ...prev,
          activeCount,
          resolvedCount,
          resolutionRate: rate,
        }));
      } catch (err) {
        console.error("Gagal menarik data dashboard:", err);
      }
    };

    fetchDashboardData();
  }, [selectedDate]);

  const displayedWilayah = WILAYAH_DATA.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Page */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[15px] font-bold text-gray-800 tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Ringkasan performa pelayanan terpadu PTSA KEMNAKER
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate ?? ""}
                onChange={(e) => setSelectedDate(e.target.value || null)}
                className="sr-only absolute"
                tabIndex={-1}
              />
              <button
                type="button"
                onClick={handleOpenCalendar}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
                <span>{formatDisplayDate(selectedDate)}</span>

                {selectedDate ? (
                  <span
                    onClick={handleClearDate}
                    title="Reset ke Semua Waktu"
                    className="ml-0.5 rounded-full p-0.5 hover:bg-gray-200 text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-400">▼</span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportLaporan}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Export Laporan</span>
            </button>
          </div>
        </div>

        {/* 3 Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50">
                <FileText className="h-5 w-5 text-amber-500" />
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
                Sedang Diproses
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Aduan Aktif</p>
            <p className="mt-1 text-[20px] font-bold text-gray-900 leading-none">
              {stats.activeCount}{" "}
              <span className="text-[13px] font-medium text-gray-600">Berkas</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-600">
                {stats.resolutionRate}% Rate
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Aduan Selesai Ditangani</p>
            <p className="mt-1 text-[20px] font-bold text-gray-900 leading-none">
              {nf.format(stats.resolvedCount)}{" "}
              <span className="text-[13px] font-medium text-gray-600">Kasus</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50">
                <Star className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                {stats.ikmLabel}
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Indeks Kepuasan Masyarakat</p>
            <p className="mt-1 text-[20px] font-bold text-gray-900 leading-none">
              {stats.ikmScore.toFixed(2)}{" "}
              <span className="text-[13px] font-medium text-gray-500">/ 5.00</span>
            </p>
          </div>
        </div>

        {/* Rekapitulasi Layanan Kategori (Horizontal Scroll) */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-gray-700" />
              <h2 className="text-[13px] font-bold text-gray-800">
                Rekapitulasi Layanan Kategori
              </h2>
            </div>
            <Link
              to="/admin/kategori_pelayanan"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors"
            >
              <span>Lihat Semua Kategori</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`
              flex gap-5 overflow-x-auto pb-2 select-none
              cursor-grab active:cursor-grabbing
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            `}
          >
            {/* Card 1: Wajib Lapor Ketenagakerjaan */}
            <div className="min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 shrink-0">
                    <FileText className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase leading-snug">
                    WAJIB LAPOR KETENAGAKERJAAN
                  </h3>
                </div>
                <p className="text-[12px] text-gray-600 mb-4">
                  {nf.format(categoryCounts.wlkp)} Pengaduan
                </p>
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.location.assign("/admin/detail_kategori_pelayanan?id=1");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>

            {/* Card 2: Upah Kerja */}
            <div className="min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 shrink-0">
                    <WalletCards className="h-5 w-5 text-slate-700" />
                  </div>
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase leading-snug">
                    Upah Kerja
                  </h3>
                </div>
                <p className="text-[12px] text-gray-600 mb-4">
                  {nf.format(categoryCounts.upah)} Pengaduan
                </p>
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.location.assign("/admin/detail_kategori_pelayanan?id=2");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>

            {/* Card 3: Jaminan Sosial */}
            <div className="min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 shrink-0">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase leading-snug">
                    Jaminan Sosial
                  </h3>
                </div>
                <p className="text-[12px] text-gray-600 mb-4">
                  {nf.format(categoryCounts.jamsos)} Pengaduan
                </p>
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.location.assign("/admin/detail_kategori_pelayanan?id=3");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>

            {/* Card 4: Hubungan Kerja */}
            <div className="min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 shrink-0">
                    <Handshake className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-[11px] font-bold text-gray-800 uppercase leading-snug">
                    Hubungan Kerja
                  </h3>
                </div>
                <p className="text-[12px] text-gray-600 mb-4">
                  {nf.format(categoryCounts.hubKerja)} Pengaduan
                </p>
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.location.assign("/admin/detail_kategori_pelayanan?id=4");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabel Wilayah */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <h2 className="text-[13px] font-bold text-gray-800">
                Report Pelayanan Pengaduan Berdasarkan Wilayah
              </h2>
            </div>
            <Link
              to="/admin/wilayah"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F5FA] text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-8 py-3.5 w-24">NO</th>
                  <th className="px-8 py-3.5 text-center">PROVINSI</th>
                  <th className="px-8 py-3.5 text-right w-44">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {displayedWilayah.map((row) => (
                  <tr key={row.provinsi} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-8 py-4 text-gray-600 font-medium">{row.no}</td>
                    <td className="px-8 py-4 text-center text-gray-800 font-medium">{row.provinsi}</td>
                    <td className="px-8 py-4 text-right text-gray-700 font-semibold">{nf.format(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 px-2">
            <p className="text-[11px] text-gray-500">
              Menampilkan {displayedWilayah.length} dari {totalItems} data{" "}
              {selectedDate ? `per ${formatDisplayDate(selectedDate)}` : "keseluruhan"}
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`
                    grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors cursor-pointer
                    ${currentPage === page ? "bg-[#007A64] text-white" : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  {page}
                </button>
              ))}

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
      </div>
    </AppShell>
  );
}
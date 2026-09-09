import React, { useState, useEffect, useRef, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  FileText,
  Star,
  WalletCards,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Handshake,
  PersonStanding,
  Clock3,
  Scale,
  BriefcaseBusiness,
  HeartPulse,
  Baby,
  Award,
  FileCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

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

interface CategoryConfig {
  id: number;
  code: string;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

const ALL_CATEGORIES: CategoryConfig[] = [
  { id: 1, code: "WAJIB_LAPOR", title: "WAJIB LAPOR KETENAGAKERJAAN", icon: FileText, iconColor: "text-red-500", bgColor: "bg-red-50" },
  { id: 2, code: "UPAH_KERJA", title: "Upah Kerja", icon: WalletCards, iconColor: "text-slate-700", bgColor: "bg-slate-100" },
  { id: 3, code: "JAMINAN_SOSIAL", title: "Jaminan Sosial", icon: ShieldCheck, iconColor: "text-emerald-600", bgColor: "bg-emerald-50" },
  { id: 4, code: "HUBUNGAN_KERJA", title: "Hubungan Kerja", icon: Handshake, iconColor: "text-purple-600", bgColor: "bg-purple-50" },
  { id: 5, code: "KECELAKAAN_KERJA", title: "Kecelakaan Kerja", icon: PersonStanding, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { id: 6, code: "WAKTU_KERJA", title: "Waktu Kerja & Istirahat", icon: Clock3, iconColor: "text-amber-500", bgColor: "bg-amber-50" },
  { id: 7, code: "KADER_NORMA", title: "Kader Norma Kerja", icon: Scale, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { id: 8, code: "PENEMPATAN_TK", title: "Penempatan Tenaga Kerja", icon: BriefcaseBusiness, iconColor: "text-cyan-600", bgColor: "bg-cyan-50" },
  { id: 9, code: "K3", title: "Keselamatan & Kesehatan (K3)", icon: HeartPulse, iconColor: "text-red-500", bgColor: "bg-red-50" },
  { id: 10, code: "PEREMPUAN_ANAK", title: "Perlindungan Perempuan & Anak", icon: Baby, iconColor: "text-purple-600", bgColor: "bg-purple-50" },
  { id: 11, code: "NORMA_K3", title: "Kader Norma K3", icon: Award, iconColor: "text-amber-700", bgColor: "bg-amber-50" },
  { id: 12, code: "SKP", title: "SKP", icon: FileCheck, iconColor: "text-slate-600", bgColor: "bg-slate-100" },
];

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

function DashboardExecutive() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("Hari Ini");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const [totalAduan, setTotalAduan] = useState(12450);
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({
    1: 11267,
    2: 245,
    3: 19,
    4: 12,
    5: 8,
    6: 5,
  });

  // Drag-to-Scroll & Animation Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token =
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(SUMMARY_API_URL, { headers });
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
          let total = 0;
          const newCounts: Record<number, number> = {};

          items.forEach((item: any) => {
            const count = Number(item.count || item.total || 0);
            const id = Number(item.id || item.category_id);
            total += count;
            if (id) newCounts[id] = count;
          });

          if (total > 0) setTotalAduan(total);
          if (Object.keys(newCounts).length > 0) {
            setCategoryCounts((prev) => ({ ...prev, ...newCounts }));
          }
        }
      } catch (err) {
        console.error("Gagal sinkron data dashboard:", err);
      }
    };

    fetchDashboardData();
  }, [timeFilter]);

  // Urutkan kategori dari yang paling banyak ke paling sedikit (Descending)
  const sortedCategories = useMemo(() => {
    return [...ALL_CATEGORIES].sort((a, b) => {
      const countA = categoryCounts[a.id] ?? 0;
      const countB = categoryCounts[b.id] ?? 0;
      return countB - countA;
    });
  }, [categoryCounts]);

  // Handlers untuk Drag-to-Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
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
    if (Math.abs(walk) > 5) setHasMoved(true);
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Navigasi tombol panah scroll
  const scrollHorizontally = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleGoToDetail = (categoryId: number) => {
    if (hasMoved) return; // Cegah klik jika user sedang drag
    navigate({
      to: "/admin/detail_kategori_pelayanan",
      search: { id: categoryId },
    });
  };

  const totalItems = 128;
  const totalPages = Math.ceil(WILAYAH_DATA.length / itemsPerPage);
  const displayedWilayah = WILAYAH_DATA.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportLaporan = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "NO,PROVINSI,TOTAL\n" +
      WILAYAH_DATA.map((w) => `${w.no},${w.provinsi},${w.total}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Wilayah_${timeFilter.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* ================= HEADER PAGE ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[16px] font-bold text-gray-900 tracking-tight">
              Executive Dashboard
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Ringkasan performa pelayanan terpadu PTSA KEMNAKER
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-8 pr-7 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#007A64] cursor-pointer"
              >
                <option value="Hari Ini">Hari Ini</option>
                <option value="Minggu Ini">Minggu Ini</option>
                <option value="Bulan Ini">Bulan Ini</option>
                <option value="Tahun Ini">Tahun Ini</option>
              </select>
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-gray-400">
                ▼
              </span>
            </div>

            <button
              type="button"
              onClick={handleExportLaporan}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Export Laporan</span>
            </button>
          </div>
        </div>

        {/* ================= 2 STAT CARDS UTAMA ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileText className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                +5%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[11px] text-gray-500 font-medium">Total Aduan</p>
              <p className="text-[26px] font-bold text-gray-900 tracking-tight mt-0.5">
                {nf.format(totalAduan)}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Periode tahun berjalan</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Star className="h-5 w-5 fill-blue-600/20" />
              </div>
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600">
                Sangat Baik
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[11px] text-gray-500 font-medium">Indeks Kepuasan</p>
              <p className="text-[26px] font-bold text-gray-900 tracking-tight mt-0.5">
                4.82{" "}
                <span className="text-[13px] font-normal text-gray-400">/ 5.00</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Berdasarkan survei masyarakat
              </p>
            </div>
          </div>
        </div>

        {/* ================= REKAPITULASI LAYANAN KATEGORI (SORTED & HORIZONTAL SCROLL) ================= */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-gray-700" />
              <h2 className="text-[13px] font-bold text-gray-800">
                Rekapitulasi Layanan Kategori
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Tombol Panah Scroll */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollHorizontally("left")}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs cursor-pointer"
                  title="Scroll ke kiri"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollHorizontally("right")}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs cursor-pointer"
                  title="Scroll ke kanan"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <Link
                to="/admin/kategori_pelayanan"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors ml-2"
              >
                <span>Lihat Semua Kategori</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Container Scroll Animasi Horizontal */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`
              flex gap-5 overflow-x-auto pb-4 pt-1 px-0.5 select-none
              cursor-grab active:cursor-grabbing scroll-smooth
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            `}
          >
            {sortedCategories.map((item) => {
              const Icon = item.icon;
              const count = categoryCounts[item.id] ?? 0;

              return (
                <div
                  key={item.id}
                  className="min-w-[280px] md:min-w-[320px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.bgColor} ${item.iconColor}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-[11px] font-bold text-gray-800 leading-snug uppercase tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[12px] text-gray-600 mb-5 font-medium">
                      <span className="font-bold text-gray-900 text-[13px]">
                        {nf.format(count)}
                      </span>{" "}
                      Pengaduan
                    </p>
                  </div>

                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleGoToDetail(item.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= TABEL REPORT WILAYAH ================= */}
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
                    <td className="px-8 py-4 text-center text-gray-800 font-medium">
                      {row.provinsi}
                    </td>
                    <td className="px-8 py-4 text-right text-gray-700 font-semibold">
                      {nf.format(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-4 px-2">
            <p className="text-[11px] text-gray-500">
              Menampilkan {displayedWilayah.length} dari {totalItems} data {timeFilter.toLowerCase()}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
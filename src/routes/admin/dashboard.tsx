import React, { useState, useEffect, useRef, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  FileText,
  Star,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";
import { computeGrowth, formatGrowth } from "@/lib/growth";
import { fetchSatisfactionSummary, type SatisfactionSummary } from "@/lib/satisfaction";

const SUMMARY_API_URL = apiUrl("dashboard/complaint-summary");
const PROVINCE_SUMMARY_API_URL = apiUrl("dashboard/province-summary");
const COMPLAINTS_API_URL = apiUrl("complaints");

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
}

const ALL_CATEGORIES: CategoryConfig[] = [
  { id: 1, code: "WAJIB_LAPOR", title: "WAJIB LAPOR KETENAGAKERJAAN" },
  { id: 2, code: "UPAH_KERJA", title: "Upah Kerja" },
  { id: 3, code: "JAMINAN_SOSIAL", title: "Jaminan Sosial" },
  { id: 4, code: "HUBUNGAN_KERJA", title: "Hubungan Kerja" },
  { id: 5, code: "KECELAKAAN_KERJA", title: "Kecelakaan Kerja" },
  { id: 6, code: "WAKTU_KERJA", title: "Waktu Kerja & Istirahat" },
  { id: 7, code: "KADER_NORMA", title: "Kader Norma Kerja" },
  { id: 8, code: "PENEMPATAN_TK", title: "Penempatan Tenaga Kerja" },
  { id: 9, code: "K3", title: "Keselamatan & Kesehatan (K3)" },
  { id: 10, code: "PEREMPUAN_ANAK", title: "Perlindungan Perempuan & Anak" },
  { id: 11, code: "NORMA_K3", title: "Kader Norma K3" },
  { id: 12, code: "SKP", title: "SKP" },
];

interface WilayahRow {
  no: number;
  provinsi: string;
  total: number;
}

// Rapikan nama provinsi (Title Case + normalisasi DKI Jakarta).
function toTitleCase(str: string): string {
  if (!str) return "-";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeProvinsi(raw: string): string {
  const name = toTitleCase(raw || "-");
  const upper = name.toUpperCase();
  if (upper.includes("DKI") || upper.includes("IBUKOTA") || upper.includes("JAKARTA")) {
    return "Daerah Khusus Ibukota Jakarta";
  }
  return name;
}

/** Label indeks kepuasan berdasarkan skor skala 1-5. */
function ikmLabel(score: number): string {
  if (score >= 4.5) return "Sangat Baik";
  if (score >= 3.5) return "Baik";
  if (score >= 2.5) return "Cukup";
  return "Kurang";
}

function DashboardExecutive() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  const [wilayahSearch, setWilayahSearch] = useState("");

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

  // Data provinsi diambil dari API (bukan hardcode).
  const [wilayahData, setWilayahData] = useState<WilayahRow[]>([]);

  const [totalAduan, setTotalAduan] = useState(12450);
  // Persentase kenaikan/penurunan aduan (dihitung riil, sama seperti page Grafik).
  const [growth, setGrowth] = useState<number | null>(null);
  // Indeks kepuasan: endpoint agregat bila ada, fallback hitung dari respons survei.
  const [satisfaction, setSatisfaction] = useState<SatisfactionSummary | null>(null);
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

  // Sinkronisasi data dashboard terpusat. Kalau filter kalender aktif
  // (tanggal/bulan/tahun), total aduan & jumlah per kategori dihitung dari
  // daftar aduan yang dipotong prefix tanggal, dan pertumbuhan membandingkan
  // periode terpilih dengan periode sebelumnya yang sebanding.
  useEffect(() => {
    const headers = authHeaders();
    const prefix = selectedDate;

    const extractList = (json: any): any[] =>
      Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.data?.data)
          ? json.data.data
          : Array.isArray(json)
            ? json
            : Array.isArray(json?.complaints)
              ? json.complaints
              : [];

    const fetchAll = async () => {
      try {
        const first = await fetch(`${COMPLAINTS_API_URL}?per_page=100`, {
          headers,
        });
        if (!first.ok) return;

        const firstJson = await first.json();
        let rawList: any[] = [...extractList(firstJson)];

        const lastPage = Number(
          firstJson?.meta?.last_page ?? firstJson?.last_page ?? firstJson?.data?.last_page ?? 1,
        );
        if (Number.isFinite(lastPage) && lastPage > 1) {
          const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
          const results = await Promise.all(
            pages.map((p) =>
              fetch(`${COMPLAINTS_API_URL}?page=${p}&per_page=100`, { headers })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null),
            ),
          );
          results.forEach((json) => {
            if (json) rawList = rawList.concat(extractList(json));
          });
        }

        if (!prefix) {
          setGrowth(computeGrowth(rawList, null));
          return;
        }

        const filtered = rawList.filter((it: any) =>
          String(it.complaint_date ?? it.created_at ?? "").startsWith(prefix),
        );
        setTotalAduan(filtered.length);
        setGrowth(computeGrowth(rawList, prefix));

        const newCounts: Record<number, number> = {};
        filtered.forEach((it: any) => {
          const code = String(it.category?.category_code ?? it.category?.code ?? "").toUpperCase();
          const match = ALL_CATEGORIES.find((c) => c.code === code);
          if (match) newCounts[match.id] = (newCounts[match.id] ?? 0) + 1;
        });
        setCategoryCounts(newCounts);
      } catch (err) {
        console.error("Gagal menyinkronkan data dashboard:", err);
      }
    };

    const fetchSummary = async () => {
      try {
        const url = prefix
          ? `${SUMMARY_API_URL}?date=${encodeURIComponent(prefix)}`
          : SUMMARY_API_URL;
        const res = await fetch(url, { headers });
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

    fetchAll();
    if (!prefix) fetchSummary();
  }, [selectedDate]);

  // Indeks kepuasan: ambil ringkasan secara terpusat (agregat + fallback respons).
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const summary = await fetchSatisfactionSummary();
      if (!cancelled) setSatisfaction(summary);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Ambil SEMUA data provinsi dari API (endpoint sama dengan halaman Wilayah),
  // lalu urutkan dari total terbesar. Paginasi ditangani di sisi klien.
  useEffect(() => {
    const fetchProvinces = async () => {
      const perPage = 100;
      const prefix = selectedDate;
      const buildUrl = (page: number) =>
        `${PROVINCE_SUMMARY_API_URL}?page=${page}&per_page=${perPage}${
          prefix ? `&date=${encodeURIComponent(prefix)}` : ""
        }`;

      const fetchPage = async (page: number) => {
        const res = await fetch(buildUrl(page), { headers: authHeaders() });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      };

      try {
        const first = await fetchPage(1);
        const collected: any[] = Array.isArray(first?.data) ? [...first.data] : [];

        const lastPage = Number(first?.meta?.last_page ?? first?.last_page ?? 1);
        if (Number.isFinite(lastPage) && lastPage > 1) {
          const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
          const results = await Promise.all(pages.map((p) => fetchPage(p)));
          results.forEach((json) => {
            if (Array.isArray(json?.data)) collected.push(...json.data);
          });
        }

        const rows: WilayahRow[] = collected
          .map((item: any) => ({
            provinsi: normalizeProvinsi(item.provinsi || "-"),
            total: Number(item.count ?? item.total ?? 0),
          }))
          .sort((a, b) => b.total - a.total)
          .map((row, idx) => ({ no: idx + 1, ...row }));

        setWilayahData(rows);
        setCurrentPage(1);
      } catch (err) {
        console.error("Gagal memuat data provinsi:", err);
        setWilayahData([]);
      }
    };

    fetchProvinces();
  }, [selectedDate]);

  // Urutkan kategori dari yang paling banyak ke paling sedikit (Descending)
  const sortedCategories = useMemo(() => {
    return [...ALL_CATEGORIES].sort((a, b) => {
      const countA = categoryCounts[a.id] ?? 0;
      const countB = categoryCounts[b.id] ?? 0;
      return countB - countA;
    });
  }, [categoryCounts]);

  // Tampilkan hanya 5 kategori dengan jumlah pengaduan terbanyak.
  const topCategories = useMemo(() => sortedCategories.slice(0, 5), [sortedCategories]);

  // Filter table wilayah berdasarkan keyword provinsi.
  const filteredWilayah = useMemo(() => {
    const q = wilayahSearch.trim().toLowerCase();
    if (!q) return wilayahData;
    return wilayahData.filter((w) => w.provinsi.toLowerCase().includes(q));
  }, [wilayahData, wilayahSearch]);

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

  const totalItems = filteredWilayah.length;
  const totalPages = Math.max(1, Math.ceil(filteredWilayah.length / itemsPerPage));
  const displayedWilayah = filteredWilayah.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleExportLaporan = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "NO,PROVINSI,TOTAL\n" +
      filteredWilayah.map((w) => `${w.no},${w.provinsi},${w.total}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Laporan_Wilayah_${formatDisplayDate(selectedDate).replace(/\s+/g, "_")}.csv`,
    );
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
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
                <span>{formatDisplayDate(selectedDate)}</span>
                {selectedDate ? (
                  <span
                    onClick={handleClearDate}
                    title="Kembali ke Semua Waktu"
                    className="ml-0.5 rounded-full p-0.5 hover:bg-gray-200 text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="text-[9px] text-gray-400">▼</span>
                )}
              </button>
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
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  (growth ?? 0) >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                }`}
              >
                {(growth ?? 0) >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatGrowth(growth)}
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
                {satisfaction?.index != null ? ikmLabel(satisfaction.index) : "Belum Ada"}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[11px] text-gray-500 font-medium">Indeks Kepuasan</p>
              <p className="text-[26px] font-bold text-gray-900 tracking-tight mt-0.5">
                {satisfaction?.index != null ? satisfaction.index.toFixed(2) : "-"}{" "}
                <span className="text-[13px] font-normal text-gray-400">
                  / {(satisfaction?.scale ?? 5).toFixed(2)}
                </span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                {satisfaction?.index != null && satisfaction.responses > 0
                  ? `Berbasis ${nf.format(satisfaction.responses)} responden${
                      satisfaction.source === "aggregate" ? " hari ini" : ""
                    }`
                  : "Belum ada data survei"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= REKAPITULASI LAYANAN KATEGORI (SORTED & HORIZONTAL SCROLL) ================= */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-gray-700" />
              <h2 className="text-[13px] font-bold text-gray-800">Rekapitulasi Layanan Kategori</h2>
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
            {topCategories.map((item) => {
              const count = categoryCounts[item.id] ?? 0;

              return (
                <div
                  key={item.id}
                  className="min-w-[280px] md:min-w-[320px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-800 leading-snug uppercase tracking-tight mb-4">
                      {item.title}
                    </h3>
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={wilayahSearch}
                  onChange={(e) => {
                    setWilayahSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari provinsi…"
                  className="w-44 rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64]"
                />
              </div>
              <Link
                to="/admin/wilayah"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
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
                {displayedWilayah.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-400">
                      Belum ada data provinsi.
                    </td>
                  </tr>
                ) : (
                  displayedWilayah.map((row) => (
                    <tr key={row.no} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-8 py-4 text-gray-600 font-medium">{row.no}</td>
                      <td className="px-8 py-4 text-center text-gray-800 font-medium">
                        {row.provinsi}
                      </td>
                      <td className="px-8 py-4 text-right text-gray-700 font-semibold">
                        {nf.format(row.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-4 px-2">
            <p className="text-[11px] text-gray-500">
              Menampilkan {displayedWilayah.length} dari {totalItems} provinsi
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

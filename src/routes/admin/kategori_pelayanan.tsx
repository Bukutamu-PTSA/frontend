import React, { useState, useRef, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  FileText,
  WalletCards,
  ShieldCheck,
  Handshake,
  PersonStanding,
  Clock3,
  Scale,
  BriefcaseBusiness,
  HeartPulse,
  Baby,
  Award,
  FileCheck,
  ArrowRight,
  Layers,
  Loader2,
  Search,
  X,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { matchesSearch } from "@/lib/search";
import { apiUrl } from "@/lib/api";
import { PAGE_TITLES } from "@/config/app";

const SUMMARY_API_URL = apiUrl("dashboard/complaint-summary");

export const Route = createFileRoute("/admin/kategori_pelayanan")({
  head: () => ({
    meta: [
      {
        title: PAGE_TITLES.adminKategoriRekap,
      },
    ],
  }),
  component: KategoriPelayananPage,
});

interface CategoryMeta {
  id: number;
  code: string;
  title: string;
  /** Jumlah pengaduan dari backend. */
  count: number;
  /** Ikon lucide (dipakai semua kategori). */
  icon?: LucideIcon;
  iconColor: string;
  bgColor: string;
}

/** Hanya ikon & warna per ID kategori. Nama & jumlah diambil dari backend. */
const CATEGORY_STYLES: Record<number, { icon: LucideIcon; iconColor: string; bgColor: string }> = {
  1: { icon: FileText, iconColor: "text-red-500", bgColor: "bg-red-50" },
  2: { icon: WalletCards, iconColor: "text-slate-600", bgColor: "bg-slate-100" },
  3: { icon: ShieldCheck, iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
  4: { icon: Handshake, iconColor: "text-purple-500", bgColor: "bg-purple-50" },
  5: { icon: PersonStanding, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  6: { icon: Clock3, iconColor: "text-amber-500", bgColor: "bg-amber-50" },
  7: { icon: Scale, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  8: { icon: BriefcaseBusiness, iconColor: "text-cyan-600", bgColor: "bg-cyan-50" },
  9: { icon: HeartPulse, iconColor: "text-red-500", bgColor: "bg-red-50" },
  10: { icon: Baby, iconColor: "text-purple-600", bgColor: "bg-purple-50" },
  11: { icon: Award, iconColor: "text-amber-700", bgColor: "bg-amber-50" },
  12: { icon: FileCheck, iconColor: "text-slate-600", bgColor: "bg-slate-100" },
};

const DEFAULT_STYLE = { icon: Layers, iconColor: "text-slate-600", bgColor: "bg-slate-100" };

const nf = new Intl.NumberFormat("id-ID");

function KategoriPelayananPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState<boolean>(true);

  // Daftar kategori LANGSUNG dari backend (id, nama, jumlah) supaya judul kartu
  // selalu cocok dengan data yang dibuka di halaman detail.
  const [allCategories, setAllCategories] = useState<CategoryMeta[]>([]);

  // Filter kartu kategori berdasarkan nama/kode.
  const filteredCategories = useMemo(() => {
    return allCategories.filter((cat) => matchesSearch(search, [cat.title, cat.code]));
  }, [allCategories, search]);

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

  const handleExportLaporan = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID Kategori,Nama Kategori,Total Pengaduan\n" +
      filteredCategories
        .map((cat) => `"${cat.id}","${cat.title}",${cat.count}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekapitulasi_Kategori_${selectedDate ?? "Semua_Waktu"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchCategorySummary = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    try {
      const url = selectedDate ? `${SUMMARY_API_URL}?date=${selectedDate}` : SUMMARY_API_URL;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const resJson = await response.json();
        const list: any[] = Array.isArray(resJson?.data)
          ? resJson.data
          : Array.isArray(resJson)
            ? resJson
            : [];

        const categories: CategoryMeta[] = list
          .map((item): CategoryMeta | null => {
            const id = Number(item.id ?? item.category_id);
            if (!Number.isFinite(id) || id <= 0) return null;
            const style = CATEGORY_STYLES[id] ?? DEFAULT_STYLE;
            return {
              id,
              code: String(item.category_code ?? ""),
              title: String(item.category_name ?? item.category_code ?? "Kategori").toUpperCase(),
              count: Number(item.count ?? item.total ?? 0),
              ...style,
            };
          })
          .filter((c): c is CategoryMeta => c !== null)
          .sort((a, b) => a.id - b.id);

        setAllCategories(categories);
      }
    } catch (err) {
      console.error("Gagal mengambil data complaint-summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorySummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <AppShell title="Rekapitulasi Layanan Kategori" breadcrumb="Rekapitulasi Kategori">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-gray-700" />
            <h1 className="text-[15px] font-bold text-gray-800 tracking-tight">
              Rekapitulasi Layanan Kategori
            </h1>
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

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kategori…"
                className="w-full sm:w-52 rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#032749]"
              />
            </div>

            <button
              type="button"
              onClick={handleExportLaporan}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Export Laporan</span>
            </button>
          </div>
        </div>

        {/* 12 Cards Grid */}
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center text-gray-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            Tidak ada kategori yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((item) => {
              const count = item.count;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div>
                    <h2 className="text-[13px] font-bold text-gray-800 leading-snug tracking-wide uppercase mb-5">
                      {item.title}
                    </h2>

                    <div className="text-[13px] text-gray-700 mb-5 flex items-center gap-1.5">
                      {loading ? (
                        <span className="inline-flex items-center gap-1 text-muted-foreground text-[12px]">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memuat...
                        </span>
                      ) : (
                        <>
                          <span className="font-bold text-gray-900 text-[14px]">
                            {nf.format(count)}
                          </span>{" "}
                          Pengaduan
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `/admin/detail_kategori_pelayanan?id=${item.id}`;
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </AppShell>
  );
}

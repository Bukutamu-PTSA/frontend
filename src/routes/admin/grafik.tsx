import React, { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  FileText,
  Loader2,
  Star,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";
import { computeGrowth, formatGrowth } from "@/lib/growth";
import { fetchSatisfactionSummary, type SatisfactionSummary } from "@/lib/satisfaction";

// Total aduan & jenis pengaduan diambil dari ringkasan agregat API
// (dashboard/complaint-summary) sehingga tidak lagi terbatas per_page=50.
const SUMMARY_API_URL = apiUrl("dashboard/complaint-summary");
// Daftar nyata kategori pengaduan untuk grafik "Berdasarkan Jenis Pengaduan".
const CATEGORIES_API_URL = apiUrl("complaint-categories");
// Ekspor laporan statistik dalam bentuk PDF dari backend.
const EXPORT_PDF_API_URL = apiUrl("v1/reports/export/pdf");
// Grafik skala perusahaan butuh DAFTAR aduan mentah untuk diagregasi per
// jumlah tenaga kerja pada tiap aduan, ditarik lintas halaman.
const COMPLAINTS_API_URL = apiUrl("complaints");

export const Route = createFileRoute("/admin/grafik")({
  head: () => ({
    meta: [
      {
        title: "Grafik & Statistik Overview - PTSA KEMNAKER",
      },
    ],
  }),
  component: GrafikStatistikPage,
});

const nf = new Intl.NumberFormat("id-ID");

// Skala Perusahaan: Mikro (<10), Kecil (10-49), Menengah (50-199), Besar (>=200)
const SCALE_COLORS = ["#2F4157", "#A2C1D1", "#C7D9E5", "#567C8E"];

// Palet warna bar per jenis pengaduan (nada biru-keabuan yang serupa).
const CATEGORY_COLORS = [
  "#AAB7B8",
  "#8FA6B2",
  "#C2D2DC",
  "#7E97A3",
  "#9FB6BF",
  "#6C8794",
  "#B9CAD3",
  "#5A7683",
  "#D0DDE3",
  "#8AA3AF",
  "#70909C",
  "#C7D6DD",
];

/** Warna per kategori; kategori tambahan (di luar palet) tetap dapat warna sendiri. */
function categoryColor(index: number): string {
  if (index < CATEGORY_COLORS.length) return CATEGORY_COLORS[index] ?? "";
  const extra = index - CATEGORY_COLORS.length;
  const hue = 186 + ((extra * 47) % 34);
  const saturation = 10 + ((extra * 6) % 16);
  const lightness = 42 + ((extra * 13) % 34);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/** Label indeks kepuasan berdasarkan skor 1-5. */
function ikmLabelFromScore(score5: number): string {
  if (score5 >= 4.5) return "Sangat Baik";
  if (score5 >= 3.5) return "Baik";
  if (score5 >= 2.5) return "Cukup";
  return "Kurang";
}

/** Pecah label panjang jadi 2 baris seimbang (label pendek tetap 1 baris). */
function wrapCategoryLabel(label: string, maxChars = 14): string[] {
  const text = String(label ?? "").trim();
  if (text.length <= maxChars) return [text];

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 2) return [text];

  let best: [string, string] = [text, ""];
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(" ");
    const line2 = words.slice(i).join(" ");
    const diff = Math.abs(line1.length - line2.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = [line1, line2];
    }
  }
  return [best[0], best[1]];
}

/** Tick vertikal (rotate -90) dengan dukungan label 2 baris. */
function CategoryTick(props: any) {
  const { x, y, payload } = props;
  const lines = wrapCategoryLabel(String(payload?.value ?? ""));
  const lineHeight = 9;
  const anchorY = Number(y) + 6;
  const centerOffset = ((lines.length - 1) * lineHeight) / 2;

  return (
    <g>
      {lines.map((line, i) => {
        const anchorX = Number(x) - centerOffset + i * lineHeight;
        return (
          <text
            key={`${line}-${i}`}
            x={anchorX}
            y={anchorY}
            textAnchor="end"
            transform={`rotate(-90 ${anchorX} ${anchorY})`}
            fill="#64748B"
            fontSize={9}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
}

function GrafikStatistikPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Card Stats
  const [stats, setStats] = useState({
    totalAduan: 0,
  });

  // Persentase kenaikan/penurunan aduan yang dihitung riil dari data.
  const [growth, setGrowth] = useState<number | null>(null);

  // Indeks kepuasan: endpoint agregat bila ada, fallback hitung dari respons survei.
  const [satisfaction, setSatisfaction] = useState<SatisfactionSummary | null>(null);

  // Chart Data
  const [scaleData, setScaleData] = useState([
    { name: "Mikro", count: 0 },
    { name: "Kecil", count: 0 },
    { name: "Menengah", count: 0 },
    { name: "Besar", count: 0 },
  ]);

  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "Semua Waktu";
    const parts = dateStr.split("-").map(Number);
    const year = parts[0] ?? new Date().getFullYear();
    const month = (parts[1] ?? 1) - 1;
    const day = parts[2] ?? 1;

    const dateObj = new Date(year, month, day);
    return dateObj.toLocaleDateString("id-ID", {
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

  // Unduh laporan statistik sebagai PDF dari endpoint reports/export/pdf.
  const handleExportPdf = async () => {
    if (downloading) return;
    try {
      setDownloading(true);
      const dateParam = selectedDate ? `?date=${encodeURIComponent(selectedDate)}` : "";
      const response = await fetch(`${EXPORT_PDF_API_URL}${dateParam}`, {
        method: "GET",
        headers: {
          Accept: "application/pdf, application/json",
          ...authHeaders(),
        },
      });

      if (!response.ok) {
        let message = `Gagal mengunduh laporan (HTTP ${response.status}).`;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const json = await response.json().catch(() => null);
          message =
            json?.message ||
            json?.data?.message ||
            (json?.errors && typeof json.errors === "object"
              ? Object.values(json.errors).flat().join(", ")
              : "") ||
            message;
        }
        throw new Error(message);
      }

      const contentType = response.headers.get("content-type") || "";

      // Backend mengarahkan ke URL lain (mis. base64 signature PDF).
      if (response.redirected) {
        const a = document.createElement("a");
        a.href = response.url;
        a.target = "_blank";
        a.download = "Laporan_Grafik.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      // Kasus 1: Backend mengembalikan JSON berisi URL file storage.
      if (contentType.includes("application/json")) {
        const json = await response.json();
        const fileUrl = json?.url || json?.data?.url || json?.pdf_url || json?.download_url;

        if (fileUrl) {
          const a = document.createElement("a");
          a.href = fileUrl;
          a.target = "_blank";
          a.download = "Laporan_Grafik.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }

        throw new Error(json?.message || "Format data JSON tidak memuat URL file PDF.");
      }

      // Kasus 2: Backend mengembalikan binary stream PDF murni.
      if (!contentType.includes("application/pdf")) {
        throw new Error(
          `Respons tidak dikenali (${contentType || "tanpa content-type"}). Periksa endpoint backend.`,
        );
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "Laporan_Grafik.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("Export error:", err);
      alert(err.message || "Terjadi kesalahan saat mengunduh laporan PDF.");
    } finally {
      setDownloading(false);
    }
  };

  // Total Aduan & grafik jenis pengaduan diambil dari ringkasan agregat
  // (dashboard/complaint-summary + complaint-categories), tanpa batas halaman 50.
  useEffect(() => {
    const fetchSummary = async () => {
      const headers = authHeaders();
      const dateParam = selectedDate ? `?date=${selectedDate}` : "";

      const extractList = (json: any): any[] =>
        Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.data)
            ? json.data.data
            : Array.isArray(json)
              ? json
              : [];

      try {
        const [summaryJson, categoriesJson] = await Promise.all([
          fetch(`${SUMMARY_API_URL}${dateParam}`, { headers })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch(CATEGORIES_API_URL, { headers })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        const summaryList: any[] = extractList(summaryJson);

        // 1. Total aduan = jumlahkan seluruh ringkasan per kategori.
        const total = summaryList.reduce(
          (sum, item) => sum + Number(item.count ?? item.total ?? 0),
          0,
        );

        setStats({ totalAduan: total });

        // 2. Daftar kategori nyata dari API master kategori.
        const categoryMeta = extractList(categoriesJson).map((c) => ({
          id: Number(c.id),
          name: String(c.category_name ?? c.name ?? ""),
          code: String(c.category_code ?? "").toUpperCase(),
        }));

        // 3. Bangun lookup count per id & kode dari ringkasan.
        const countsById: Record<number, number> = {};
        const countsByCode: Record<string, number> = {};
        summaryList.forEach((item) => {
          const count = Number(item.count ?? item.total ?? 0);
          const id = Number(item.id ?? item.category_id);
          if (id) countsById[id] = count;
          const code = String(item.category_code ?? "").toUpperCase();
          if (code) countsByCode[code] = count;
        });

        // 4. Grafik jenis pengaduan tanpa bar "Total", hanya kategori yang ada.
        setCategoryData(
          categoryMeta
            .filter((c) => c.name)
            .map((c) => ({
              name: c.name,
              count: countsById[c.id] ?? countsByCode[c.code] ?? 0,
            })),
        );
      } catch (err) {
        console.error("Gagal mengambil data ringkasan statistik:", err);
      }
    };

    fetchSummary();
  }, [selectedDate]);

  // Grafik skala perusahaan dihitung dari daftar aduan mentah (lintas halaman),
  // disaring per tanggal bila dipilih.
  useEffect(() => {
    const fetchScale = async () => {
      const headers = authHeaders();

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

      try {
        const first = await fetch(`${COMPLAINTS_API_URL}?per_page=100`, {
          method: "GET",
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

        // Filter per tanggal jika dipilih
        const list = selectedDate
          ? rawList.filter((item: any) => {
              const d = String(item.complaint_date ?? item.created_at ?? "");
              return d.startsWith(selectedDate);
            })
          : rawList;

        // Agregasi Skala Perusahaan (berdasarkan jumlah_naker dari payload company/perusahaan)
        let mikro = 0;
        let kecil = 0;
        let menengah = 0;
        let besar = 0;

        list.forEach((item: any) => {
          const naker = Number(
            item.jumlah_naker ??
              item.company?.jumlah_naker ??
              item.company?.jumlah_tenaga_kerja ??
              item.jumlah_tenaga_kerja ??
              item.perusahaan?.jumlah_naker ??
              0,
          );
          if (naker > 0 && naker < 10) mikro++;
          else if (naker >= 10 && naker < 50) kecil++;
          else if (naker >= 50 && naker < 200) menengah++;
          else if (naker >= 200) besar++;
          else mikro++;
        });

        setScaleData([
          { name: "Mikro", count: mikro },
          { name: "Kecil", count: kecil },
          { name: "Menengah", count: menengah },
          { name: "Besar", count: besar },
        ]);

        // Persentase pertumbuhan riil dihitung dari seluruh aduan (sebelum filter).
        setGrowth(computeGrowth(rawList, selectedDate));
      } catch (err) {
        console.error("Gagal mengambil data skala perusahaan:", err);
      }
    };

    fetchScale();
  }, [selectedDate]);

  // Indeks kepuasan: ambil ringkasan secara terpusat (agregat + fallback respons),
  // sama seperti card Indeks Kepuasan di dashboard.
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

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Page */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[15px] font-bold text-gray-800 tracking-tight">
              Grafik & Statistik Overview
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Ringkasan performa pelayanan terpadu dan analisis data PTSA KEMNAKER
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
                    title="Reset Semua Waktu"
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
              onClick={handleExportPdf}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
              ) : (
                <Download className="h-3.5 w-3.5 text-gray-500" />
              )}
              <span>{downloading ? "Menyiapkan…" : "Export Laporan"}</span>
            </button>
          </div>
        </div>

        {/* 2 Header Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
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
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Total Aduan</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900 leading-none">
              {nf.format(stats.totalAduan)}
            </p>
            <p className="mt-2 text-[10px] text-gray-400">Periode tahun berjalan</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Star className="h-5 w-5 fill-blue-600/20" />
              </div>
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600">
                {satisfaction?.index != null ? ikmLabelFromScore(satisfaction.index) : "Belum Ada"}
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

        {/* Chart 1: Pengaduan Berdasarkan Skala Perusahaan */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[13px] font-bold text-gray-800">
              Pengaduan Berdasarkan Skala Perusahaan
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#2F4157]" />
              <span>Jumlah Pengaduan</span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scaleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: "#F1F5F9" }}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  tickFormatter={(v) => nf.format(v)}
                />
                <Tooltip
                  cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={70}>
                  {scaleData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SCALE_COLORS[index % SCALE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Berdasarkan Jenis Pengaduan */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[13px] font-bold text-gray-800">Berdasarkan Jenis Pengaduan</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#AAB7B8]" />
              <span>Jumlah Pengaduan</span>
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  interval={0}
                  height={130}
                  tickLine={false}
                  axisLine={{ stroke: "#F1F5F9" }}
                  tick={(props: any) => <CategoryTick {...props} />}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  tickFormatter={(v) => nf.format(v)}
                />
                <Tooltip
                  cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={45}>
                  {categoryData.map((_, index) => (
                    <Cell key={`category-cell-${index}`} fill={categoryColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

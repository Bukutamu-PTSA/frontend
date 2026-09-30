import React, { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Download, FileText, Loader2, Star, X, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";
import { computeGrowth, formatGrowth } from "@/lib/growth";
import { fetchSatisfactionSummary } from "@/lib/satisfaction";

// Grafik butuh DAFTAR pengaduan mentah (bukan ringkasan agregat), agar bisa
// diagregasi per skala perusahaan & jenis pengaduan sesuai isi tiap aduan.
const COMPLAINTS_API_URL = apiUrl("complaints");

const CATEGORY_SUMMARY_API_URL = apiUrl("dashboard/complaint-summary");

// Ekspor laporan grafik & statistik dalam bentuk PDF dari backend.
const REPORTS_EXPORT_PDF_API_URL = apiUrl("v1/reports/export/pdf");

const PER_PAGE = 100;

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

/** Label indeks kepuasan berdasarkan skor 1-5. */
function ikmLabelFromScore(score5: number): string {
  if (score5 >= 4.5) return "Sangat Baik";
  if (score5 >= 3.5) return "Baik";
  if (score5 >= 2.5) return "Cukup";
  return "Kurang";
}

// Batas panjang (huruf) nama kategori sebelum dipecah jadi 2 baris vertikal.
const MAX_VERTICAL_CHARS = 18;

/**
 * Pecah nama kategori jadi maksimal 2 baris agar muat sebagai label vertikal
 * di bawah sumbu X. Kalau nama masih pendek, dikembalikan sebagai satu baris utuh.
 */
function splitVerticalLabel(text: string): [string, string] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 2 || text.length <= MAX_VERTICAL_CHARS) return [text, ""];

  const half = text.length / 2;
  const first: string[] = [];
  let used = 0;
  for (const word of words) {
    const next = used === 0 ? word.length : used + 1 + word.length;
    if (first.length > 0 && next > half) break;
    first.push(word);
    used = next;
  }
  if (first.length === 0 || first.length >= words.length) return [text, ""];
  return [first.join(" "), words.slice(first.length).join(" ")];
}

/**
 * Tick XAxis vertikal (rotasi -90°) berisi nama kategori, digambar di bawah
 * garis sumbu X sehingga tidak pernah menutupi batang grafik.
 */
function CategoryTick({
  x,
  y,
  payload,
}: {
  x?: number | string;
  y?: number | string;
  payload?: { value?: unknown } | null;
}) {
  const text = String(payload?.value ?? "").trim();
  if (!text) return null;

  const [line1, line2] = splitVerticalLabel(text);
  // Setelah rotasi -90°, sumbu y lokal menjadi arah horizontal (ke kanan),
  // jadi offset ini memisahkan 2 baris vertikal ke samping secara simetris.
  const offsets = line2 ? [-4.5, 4.5] : [0];

  return (
    <g transform={`translate(${Number(x)}, ${Number(y) + 6}) rotate(-90)`}>
      <text
        textAnchor="end"
        dominantBaseline="central"
        fill="#475569"
        fontSize={9}
        y={offsets[0]}
      >
        {line1}
      </text>
      {line2 ? (
        <text
          textAnchor="end"
          dominantBaseline="central"
          fill="#475569"
          fontSize={9}
          y={offsets[1]}
        >
          {line2}
        </text>
      ) : null}
    </g>
  );
}

function GrafikStatistikPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Card Stats
  const [stats, setStats] = useState({
    totalAduan: 0,
    // Perubahan jumlah aduan bulan berjalan vs bulan sebelumnya (null = belum bisa dihitung).
    growth: null as number | null,
  });

  // Indeks Kepuasan Masyarakat (dari data survei, skala /5.00).
  const [ikm, setIkm] = useState({ score: 0, label: "-" });

  // Chart Data
  const [scaleData, setScaleData] = useState([
    { name: "Mikro", count: 0 },
    { name: "Kecil", count: 0 },
    { name: "Menengah", count: 0 },
    { name: "Besar", count: 0 },
  ]);

  const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);

  const [exportingPdf, setExportingPdf] = useState(false);

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

  // Nama file laporan mengikuti periode yang sedang difilter.
  const exportFileName = () =>
    `Laporan_Grafik_Statistik_${selectedDate ?? "Semua_Waktu"}.pdf`;

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Unduh laporan grafik & statistik sebagai PDF dari endpoint backend.
  const handleExportPdf = async () => {
    if (exportingPdf) return;

    try {
      setExportingPdf(true);

      const url = selectedDate
        ? `${REPORTS_EXPORT_PDF_API_URL}?date=${encodeURIComponent(selectedDate)}`
        : REPORTS_EXPORT_PDF_API_URL;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...authHeaders(),
          Accept: "application/pdf, application/json",
        },
      });

      if (!response.ok) {
        let message = `Gagal mengunduh PDF (HTTP ${response.status}).`;
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

      if (response.redirected) {
        const a = document.createElement("a");
        a.href = response.url;
        a.target = "_blank";
        a.download = exportFileName();
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
          a.download = exportFileName();
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
      downloadFile(blob, exportFileName());
    } catch (err: any) {
      console.error("Export PDF error:", err);
      alert(err.message || "Terjadi kesalahan saat mengunduh PDF.");
    } finally {
      setExportingPdf(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
        // Ambil halaman pertama, lalu sisa halaman agar SEMUA aduan terhitung.
        const first = await fetch(`${COMPLAINTS_API_URL}?per_page=${PER_PAGE}`, {
          method: "GET",
          headers,
        });

        if (!first.ok) {
          console.error(`[grafik] Gagal ambil data aduan, status: ${first.status}`);
          return;
        }

        const firstJson = await first.json();
        let rawList: any[] = [...extractList(firstJson)];

        const lastPage = Number(
          firstJson?.meta?.last_page ?? firstJson?.last_page ?? firstJson?.data?.last_page ?? 1,
        );
        if (Number.isFinite(lastPage) && lastPage > 1) {
          const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
          const results = await Promise.all(
            pages.map((p) =>
              fetch(`${COMPLAINTS_API_URL}?page=${p}&per_page=${PER_PAGE}`, { headers })
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

        // 1. Hitung Statistik Header
        // Pertumbuhan dihitung dari data yang sama supaya badge di card Total
        // Aduan sinkron dengan angka besarnya (bukan angka statis).
        setStats({
          totalAduan: list.length,
          growth: computeGrowth(rawList, selectedDate),
        });

        // 2. Agregasi Skala Perusahaan (berdasarkan jumlah_naker dari payload company/perusahaan)
        let mikro = 0;
        let kecil = 0;
        let menengah = 0;
        let besar = 0;

        list.forEach((item: any) => {
          const naker = Number(
            item.jumlah_naker ?? item.company?.jumlah_naker ?? item.perusahaan?.jumlah_naker ?? 0,
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
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(CATEGORY_SUMMARY_API_URL, {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        if (!alive) return;
        setCategoryData(
          list.map((item: any) => ({
            name: String(item.category_name ?? "Tanpa Nama"),
            count: Number(item.count ?? 0),
          })),
        );
      } catch (err) {
        console.error("Gagal mengambil rekap kategori:", err);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Indeks Kepuasan (IKM): pakai sumber data yang sama dengan Dashboard
  // (endpoint agregat, dengan fallback ke /surveys/responses).
  useEffect(() => {
    let alive = true;

    fetchSatisfactionSummary()
      .then((summary) => {
        if (!alive) return;
        const score = summary.index ?? 0;
        setIkm({ score, label: score > 0 ? ikmLabelFromScore(score) : "-" });
      })
      .catch((err) => {
        console.error("Gagal mengambil data IKM:", err);
      });

    return () => {
      alive = false;
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
              disabled={exportingPdf}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {exportingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
              ) : (
                <Download className="h-3.5 w-3.5 text-gray-500" />
              )}
              <span>{exportingPdf ? "Menyusun…" : "Export Laporan"}</span>
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
                title={
                  stats.growth === null
                    ? "Bulan sebelumnya tidak ada aduan, jadi persentasenya belum bisa dihitung"
                    : "Perubahan jumlah aduan bulan ini dibanding bulan sebelumnya"
                }
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  stats.growth === null
                    ? "bg-gray-100 text-gray-500"
                    : stats.growth >= 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                }`}
              >
                {stats.growth === null ? (
                  <Minus className="h-3 w-3" />
                ) : stats.growth >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatGrowth(stats.growth)}
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Total Aduan</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900 leading-none">
              {nf.format(stats.totalAduan)}
            </p>
            <p className="mt-2 text-[10px] text-gray-400">
              {selectedDate
                ? `Total periode ${formatDisplayDate(selectedDate)}`
                : "Periode tahun berjalan"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                <Star className="h-5 w-5 text-slate-600" />
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
                {ikm.label}
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Indeks Kepuasan</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900 leading-none">
              {ikm.score.toFixed(2)}{" "}
              <span className="text-[13px] font-medium text-gray-400">/ 5.00</span>
            </p>
            <p className="mt-2 text-[10px] text-gray-400">Berdasarkan survei masyarakat</p>
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
              <span className="text-gray-400">· seluruh periode</span>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: "#F1F5F9" }}
                  tick={<CategoryTick />}
                  height={110}
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
                <Bar dataKey="count" fill="#AAB7B8" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

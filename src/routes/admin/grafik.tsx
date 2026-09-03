import React, { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  FileText,
  ShieldCheck,
  Star,
  X,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { AppShell } from "@/components/app-shell";

const COMPLAINTS_API_URL = "http://192.168.147.199:8000/api/dashboard/complaint-summary";

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
const SCALE_COLORS = ["#FCA5A5", "#93C5FD", "#FDE68A", "#99F6E4"];

const CATEGORY_NAMES_MAP = [
  { key: "wlkp", label: "WLKP", aliases: ["wajib lapor", "wlkp"] },
  { key: "upah", label: "Upah Kerja", aliases: ["upah", "gaji"] },
  { key: "jamsos", label: "Jaminan Sosial", aliases: ["jaminan", "jamsos", "bpjs"] },
  { key: "hub_kerja", label: "Hubungan Kerja", aliases: ["hubungan", "phk", "kontrak"] },
  { key: "kecelakaan", label: "Kecelakaan Kerja", aliases: ["kecelakaan"] },
  { key: "waktu_kerja", label: "Waktu Kerja & Istirahat", aliases: ["waktu", "lembur", "istirahat"] },
  { key: "penempatan", label: "Tenaga Kerja Dalam & LN", aliases: ["penempatan", "luar negeri", "dalam negeri", "tk"] },
  { key: "k3", label: "K3", aliases: ["k3", "keselamatan", "kesehatan"] },
  { key: "perempuan_anak", label: "Perempuan & Anak", aliases: ["perempuan", "anak"] },
];

function GrafikStatistikPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Card Stats
  const [stats, setStats] = useState({
    totalAduan: 0,
    aduanSelesai: 0,
    resolutionRate: 0,
    ikmScore: 4.82,
    ikmLabel: "Sangat Baik",
  });

  // Chart Data
  const [scaleData, setScaleData] = useState([
    { name: "Mikro", count: 0 },
    { name: "Kecil", count: 0 },
    { name: "Menengah", count: 0 },
    { name: "Besar", count: 0 },
  ]);

  const [categoryData, setCategoryData] = useState<
    { name: string; count: number }[]
  >([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");

      try {
        const response = await fetch(COMPLAINTS_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) return;
        const resData = await response.json();

        let rawList: any[] = [];
        if (Array.isArray(resData)) rawList = resData;
        else if (Array.isArray(resData?.data?.data)) rawList = resData.data.data;
        else if (Array.isArray(resData?.data)) rawList = resData.data;
        else if (Array.isArray(resData?.complaints)) rawList = resData.complaints;

        // Filter per tanggal jika dipilih
        const list = selectedDate
          ? rawList.filter((item: any) => {
              const d = String(item.complaint_date ?? item.created_at ?? "");
              return d.startsWith(selectedDate);
            })
          : rawList;

        // 1. Hitung Statistik Header
        const total = list.length;
        const resolved = list.filter((item: any) => {
          const s = String(item.status ?? "").toUpperCase();
          return s === "SELESAI" || s === "RESOLVED" || s === "CLOSED";
        }).length;
        const rate = total > 0 ? Number(((resolved / total) * 100).toFixed(1)) : 100;

        setStats({
          totalAduan: total,
          aduanSelesai: resolved,
          resolutionRate: rate,
          ikmScore: 4.82,
          ikmLabel: "Sangat Baik",
        });

        // 2. Agregasi Skala Perusahaan (berdasarkan jumlah_naker dari payload company/perusahaan)
        let mikro = 0;
        let kecil = 0;
        let menengah = 0;
        let besar = 0;

        list.forEach((item: any) => {
          const naker = Number(
            item.jumlah_naker ??
              item.company?.jumlah_naker ??
              item.perusahaan?.jumlah_naker ??
              0
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

        // 3. Agregasi Berdasarkan Jenis Pengaduan
        const catCountRecord: Record<string, number> = {};
        CATEGORY_NAMES_MAP.forEach((c) => {
          catCountRecord[c.key] = 0;
        });

        list.forEach((item: any) => {
          const catId = Number(item.category?.id ?? item.category_id);
          const catName = String(
            item.category?.category_name ?? item.kategori ?? ""
          ).toLowerCase();
          const catCode = String(
            item.category?.category_code ?? ""
          ).toLowerCase();

          for (const c of CATEGORY_NAMES_MAP) {
            if (
              c.aliases.some((a) => catName.includes(a) || catCode.includes(a))
            ) {
              catCountRecord[c.key] = (catCountRecord[c.key] ?? 0) + 1;
              break;
            }
          }
        });

        setCategoryData([
          { name: "Total", count: total },
          ...CATEGORY_NAMES_MAP.map((c) => ({
            name: c.label,
            count: catCountRecord[c.key] ?? 0,
          })),
        ]);
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
      }
    };

    fetchData();
  }, [selectedDate]);

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
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Export Laporan</span>
            </button>
          </div>
        </div>

        {/* 3 Header Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                <TrendingUp className="h-3 w-3" /> +5%
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Total Aduan</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900 leading-none">
              {nf.format(stats.totalAduan)}
            </p>
            <p className="mt-2 text-[10px] text-gray-400">Periode tahun berjalan</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                <ShieldCheck className="h-5 w-5 text-slate-600" />
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-600">
                {stats.resolutionRate}% Rate
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Aduan Selesai</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900 leading-none">
              {nf.format(stats.aduanSelesai)}
            </p>
            <p className="mt-2 text-[10px] text-gray-400">Kasus berhasil ditangani</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                <Star className="h-5 w-5 text-slate-600" />
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
                {stats.ikmLabel}
              </span>
            </div>
            <p className="mt-4 text-[11px] text-gray-500 font-medium">Indeks Kepuasan</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900 leading-none">
              {stats.ikmScore.toFixed(2)}{" "}
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
              <span className="h-2.5 w-2.5 rounded-sm bg-[#FCA5A5]" />
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
                    <Cell
                      key={`cell-${index}`}
                      fill={SCALE_COLORS[index % SCALE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Berdasarkan Jenis Pengaduan */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[13px] font-bold text-gray-800">
              Berdasarkan Jenis Pengaduan
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#7DD3FC]" />
              <span>Jumlah Pengaduan</span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={{ stroke: "#F1F5F9" }}
                  tick={{ fill: "#64748B", fontSize: 9 }}
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
                <Bar dataKey="count" fill="#7DD3FC" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
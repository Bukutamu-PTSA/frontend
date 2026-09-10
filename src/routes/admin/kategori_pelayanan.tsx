import React, { useState, useRef, useEffect } from "react";
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
  X,
  Plus,
  Check,
  Users,
  Briefcase,
  Building,
  GraduationCap,
  Landmark,
  Stethoscope,
  Gavel,
  Globe2,
  HandCoins,
  BookOpen,
  ClipboardList,
  Truck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const SUMMARY_API_URL = "http://192.168.147.199:8000/api/dashboard/complaint-summary";

export const Route = createFileRoute("/admin/kategori_pelayanan")({
  head: () => ({
    meta: [
      {
        title: "Rekapitulasi Layanan Kategori - PTSA KEMNAKER",
      },
    ],
  }),
  component: KategoriPelayananPage,
});

interface CategoryMeta {
  id: number;
  code: string;
  title: string;
  /** Ikon lucide (dipakai semua kategori). */
  icon?: React.ElementType;
  iconColor: string;
  bgColor: string;
}

const CATEGORIES_CONFIG: CategoryMeta[] = [
  { id: 1, code: "WAJIB_LAPOR", title: "WAJIB LAPOR KETENAGAKERJAAN", icon: FileText, iconColor: "text-red-500", bgColor: "bg-red-50" },
  { id: 2, code: "UPAH_KERJA", title: "UPAH KERJA", icon: WalletCards, iconColor: "text-slate-600", bgColor: "bg-slate-100" },
  { id: 3, code: "JAMINAN_SOSIAL", title: "JAMINAN SOSIAL", icon: ShieldCheck, iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
  { id: 4, code: "HUBUNGAN_KERJA", title: "HUBUNGAN KERJA", icon: Handshake, iconColor: "text-purple-500", bgColor: "bg-purple-50" },
  { id: 5, code: "KECELAKAAN_KERJA", title: "KECELAKAAN KERJA", icon: PersonStanding, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { id: 6, code: "WAKTU_KERJA", title: "WAKTU KERJA & WAKTU ISTIRAHAT", icon: Clock3, iconColor: "text-amber-500", bgColor: "bg-amber-50" },
  { id: 7, code: "KADER_NORMA", title: "KADER NORMA KETENAGAKERJAAN", icon: Scale, iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { id: 8, code: "PENEMPATAN_TK", title: "PENEMPATAN TK DALAM & LUAR NEGERI", icon: BriefcaseBusiness, iconColor: "text-cyan-600", bgColor: "bg-cyan-50" },
  { id: 9, code: "K3", title: "KESELAMATAN & KESEHATAN KERJA", icon: HeartPulse, iconColor: "text-red-500", bgColor: "bg-red-50" },
  { id: 10, code: "PEREMPUAN_ANAK", title: "PEREMPUAN & ANAK", icon: Baby, iconColor: "text-purple-600", bgColor: "bg-purple-50" },
  { id: 11, code: "NORMA_K3", title: "Kader Norma K3", icon: Award, iconColor: "text-amber-700", bgColor: "bg-amber-50" },
  { id: 12, code: "SKP", title: "SKP", icon: FileCheck, iconColor: "text-slate-600", bgColor: "bg-slate-100" },
];

// Pilihan ikon dari lucide-react untuk kategori baru.
const ICON_CHOICES: { name: string; icon: React.ElementType }[] = [
  { name: "FileText", icon: FileText },
  { name: "WalletCards", icon: WalletCards },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Handshake", icon: Handshake },
  { name: "PersonStanding", icon: PersonStanding },
  { name: "Clock3", icon: Clock3 },
  { name: "Scale", icon: Scale },
  { name: "BriefcaseBusiness", icon: BriefcaseBusiness },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "Baby", icon: Baby },
  { name: "Award", icon: Award },
  { name: "FileCheck", icon: FileCheck },
  { name: "Users", icon: Users },
  { name: "Briefcase", icon: Briefcase },
  { name: "Building", icon: Building },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Landmark", icon: Landmark },
  { name: "Stethoscope", icon: Stethoscope },
  { name: "Gavel", icon: Gavel },
  { name: "Globe2", icon: Globe2 },
  { name: "HandCoins", icon: HandCoins },
  { name: "BookOpen", icon: BookOpen },
  { name: "ClipboardList", icon: ClipboardList },
  { name: "Truck", icon: Truck },
];

// Pilihan warna (mengikuti gaya kategori bawaan).
const COLOR_CHOICES: { name: string; iconColor: string; bgColor: string; swatch: string }[] = [
  { name: "Merah", iconColor: "text-red-500", bgColor: "bg-red-50", swatch: "bg-red-500" },
  { name: "Oranye", iconColor: "text-orange-500", bgColor: "bg-orange-50", swatch: "bg-orange-500" },
  { name: "Amber", iconColor: "text-amber-500", bgColor: "bg-amber-50", swatch: "bg-amber-500" },
  { name: "Emerald", iconColor: "text-emerald-500", bgColor: "bg-emerald-50", swatch: "bg-emerald-500" },
  { name: "Cyan", iconColor: "text-cyan-600", bgColor: "bg-cyan-50", swatch: "bg-cyan-600" },
  { name: "Biru", iconColor: "text-blue-500", bgColor: "bg-blue-50", swatch: "bg-blue-500" },
  { name: "Ungu", iconColor: "text-purple-500", bgColor: "bg-purple-50", swatch: "bg-purple-500" },
  { name: "Slate", iconColor: "text-slate-600", bgColor: "bg-slate-100", swatch: "bg-slate-500" },
];

const DEFAULT_COLOR = COLOR_CHOICES[0]!;

const nf = new Intl.NumberFormat("id-ID");

function KategoriPelayananPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({});

  // Kategori tambahan buatan admin (disimpan di state lokal untuk saat ini).
  const [customCategories, setCustomCategories] = useState<CategoryMeta[]>([]);

  // State modal "Tambah Kategori".
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string>(
    DEFAULT_COLOR.name
  );
  const [formError, setFormError] = useState<string | null>(null);

  const allCategories = [...CATEGORIES_CONFIG, ...customCategories];

  const resetForm = () => {
    setNewName("");
    setSelectedIconName(null);
    setSelectedColorName(DEFAULT_COLOR.name);
    setFormError(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = newName.trim();
    if (!name) {
      setFormError("Nama kategori wajib diisi.");
      return;
    }
    if (!selectedIconName) {
      setFormError("Pilih salah satu logo kategori.");
      return;
    }

    const iconChoice = ICON_CHOICES.find((c) => c.name === selectedIconName);
    if (!iconChoice) {
      setFormError("Ikon yang dipilih tidak valid.");
      return;
    }
    const colorChoice =
      COLOR_CHOICES.find((c) => c.name === selectedColorName) ?? DEFAULT_COLOR;

    setSaving(true);
    try {
      // TODO(backend): kirim ke API pembuatan kategori bila sudah tersedia.
      // Simpan `name`, nama ikon (selectedIconName), dan warna (selectedColorName).

      const newCategory: CategoryMeta = {
        id: Date.now(), // sementara, ganti dengan id dari backend
        code: name.toUpperCase().replace(/\s+/g, "_"),
        title: name.toUpperCase(),
        icon: iconChoice.icon,
        iconColor: colorChoice.iconColor,
        bgColor: colorChoice.bgColor,
      };

      setCustomCategories((prev) => [...prev, newCategory]);
      setCategoryCounts((prev) => ({ ...prev, [newCategory.id]: 0 }));
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan kategori:", err);
      setFormError("Gagal menyimpan kategori. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

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
      allCategories
        .map((cat) => `"${cat.id}","${cat.title}",${categoryCounts[cat.id] ?? 0}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Rekapitulasi_Kategori_${selectedDate ?? "Semua_Waktu"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchCategorySummary = async () => {
      setLoading(true);
      const token =
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      try {
        const url = selectedDate
          ? `${SUMMARY_API_URL}?date=${selectedDate}`
          : SUMMARY_API_URL;

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

          const counts: Record<number, number> = {};
          CATEGORIES_CONFIG.forEach((cat) => {
            counts[cat.id] = 0;
          });

          list.forEach((item) => {
            const id = Number(item.id);
            const count = Number(item.count ?? 0);

            if (counts[id] !== undefined) {
              counts[id] = count;
            } else {
              const matched = CATEGORIES_CONFIG.find(
                (c) => c.code === String(item.category_code ?? "").toUpperCase()
              );
              if (matched) counts[matched.id] = count;
            }
          });

          setCategoryCounts(counts);
        }
      } catch (err) {
        console.error("Gagal mengambil data complaint-summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySummary();
  }, [selectedDate]);

  return (
    <AppShell
      title="Rekapitulasi Layanan Kategori"
      breadcrumb="Rekapitulasi Kategori"
    >
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

            <button
              type="button"
              onClick={handleExportLaporan}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Export Laporan</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#032749] px-3.5 py-2 text-[11px] font-semibold text-white shadow-xs hover:bg-[#053a6b] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Kategori</span>
            </button>
          </div>
        </div>

        {/* 12 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allCategories.map((item) => {
            const Icon = item.icon;
            const count = categoryCounts[item.id] ?? 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-6">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl ${item.bgColor}`}
                    >
                      {Icon ? (
                        <Icon className={`h-6 w-6 ${item.iconColor}`} />
                      ) : null}
                    </div>
                    <h2 className="text-[12px] font-bold text-gray-800 leading-snug tracking-wide uppercase">
                      {item.title}
                    </h2>
                  </div>

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
      </div>

      {/* ================= MODAL TAMBAH KATEGORI ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            aria-label="Tutup"
            onClick={handleCloseModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-[14px] font-bold text-gray-800">
                Tambah Kategori Layanan
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-4 px-5 py-5">
              {/* Nama Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Perlindungan Pekerja Migran"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                />
              </div>

              {/* Pilih Warna */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Warna
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_CHOICES.map((color) => {
                    const active = selectedColorName === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        title={color.name}
                        onClick={() => setSelectedColorName(color.name)}
                        className={`grid h-7 w-7 place-items-center rounded-full ${color.swatch} transition-transform ${
                          active
                            ? "ring-2 ring-offset-2 ring-[#032749] scale-105"
                            : "hover:scale-105"
                        }`}
                      >
                        {active && <Check className="h-3.5 w-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pilih Logo (Ikon lucide) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Logo Kategori <span className="text-red-500">*</span>
                </label>
                <div className="grid max-h-44 grid-cols-6 gap-2 overflow-y-auto rounded-lg border border-gray-200 p-2.5">
                  {ICON_CHOICES.map(({ name, icon: Icon }) => {
                    const active = selectedIconName === name;
                    const color =
                      COLOR_CHOICES.find((c) => c.name === selectedColorName) ??
                      DEFAULT_COLOR;
                    return (
                      <button
                        key={name}
                        type="button"
                        title={name}
                        onClick={() => setSelectedIconName(name)}
                        className={`grid aspect-square place-items-center rounded-lg border transition-colors ${
                          active
                            ? `${color.bgColor} border-[#032749]`
                            : "border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            active ? color.iconColor : "text-gray-500"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-[10px] text-gray-400">
                  Pilih salah satu ikon sebagai logo kategori.
                </p>
              </div>

              {formError && (
                <p className="text-xs font-medium text-red-500">{formError}</p>
              )}

              {/* Aksi */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#032749] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#053a6b] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {saving ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

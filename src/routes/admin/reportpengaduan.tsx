import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, FileText, Eye, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { confirmDialog } from "@/components/confirm-dialog";
import { pageWindow } from "@/lib/pagination";
import { jenisPengaduanLabel } from "@/lib/complaint";
import { API_BASE_URL as COMPLAINTS_API_URL, apiUrl } from "@/lib/api";
import { isSuperAdmin } from "@/lib/auth";
import { SUCCESS_MESSAGES, ERROR_MESSAGES, CONFIRM_MESSAGES, PAGE_TITLES } from "@/config/app";

export const Route = createFileRoute("/admin/reportpengaduan")({
  head: () => ({
    meta: [
      {
        title: PAGE_TITLES.adminReportPengaduan,
      },
    ],
  }),
  component: ReportPengaduanPage,
});

const nf = new Intl.NumberFormat("id-ID");

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

const YEAR_OPTIONS = ["Semua Tahun", "2026", "2025", "2024", "2023"];

const MONTH_MAP: Record<string, number> = {
  Januari: 1,
  Februari: 2,
  Maret: 3,
  April: 4,
  Mei: 5,
  Juni: 6,
  Juli: 7,
  Agustus: 8,
  September: 9,
  Oktober: 10,
  November: 11,
  Desember: 12,
};

function formatDateIndo(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr.replace(" ", "T"));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function ReportPengaduanPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("Semua Bulan");
  const [year, setYear] = useState("2026");
  const [appliedFilters, setAppliedFilters] = useState({
    month: "Semua Bulan",
    year: "2026",
  });
  // Pagination server: total & jumlah halaman datang dari backend (meta).
  const [totalData, setTotalData] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  // Pencarian yang sudah dikirim ke backend (setelah jeda ketik).
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Naikkan untuk memuat ulang halaman aktif (mis. setelah hapus).
  const [reloadKey, setReloadKey] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [canDelete, setCanDelete] = useState(false);
  const itemsPerPage = 10;

  // Ringkasan skala usaha langsung dari backend (hemat: cukup angka count,
  // tidak perlu menghitung dari seluruh aduan). Lihat GET company-size-summary.
  const [sizeSummary, setSizeSummary] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    setCanDelete(isSuperAdmin());
  }, []);

  const loadSizeSummary = () => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    fetch(apiUrl("v1/dashboard/company-size-summary"), {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const data = json?.data ?? json;
        if (data && typeof data === "object") setSizeSummary(data as Record<string, number>);
      })
      .catch((err) => console.error("Gagal memuat ringkasan skala usaha:", err));
  };

  useEffect(() => {
    loadSizeSummary();
  }, []);

  // 1. Ambil data PER HALAMAN dari backend (pagination server). Hanya 10 baris
  //    yang diminta tiap kali, bukan seluruh aduan. Pencarian, bulan, dan tahun
  //    dikirim sebagai parameter ke GET /complaints.

  // Pencarian incremental dengan jeda 350 ms supaya backend tidak dipanggil di
  // setiap huruf yang diketik.
  useEffect(() => {
    const term = search.trim().slice(0, 255);
    if (term === debouncedSearch) return;
    const timer = setTimeout(() => {
      setDebouncedSearch(term);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    const params = new URLSearchParams({
      page: String(currentPage),
      per_page: String(itemsPerPage),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    const monthNo = MONTH_MAP[appliedFilters.month];
    if (monthNo) params.set("month", String(monthNo));
    if (appliedFilters.year !== "Semua Tahun") params.set("year", appliedFilters.year);

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${COMPLAINTS_API_URL}/complaints?${params.toString()}`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const rows: any[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        const meta = json?.meta ?? {};
        const total = Number(meta.total ?? json?.total ?? rows.length) || 0;
        const last =
          Number(meta.last_page ?? json?.last_page ?? Math.ceil(total / itemsPerPage)) || 1;

        setComplaints(rows);
        setTotalData(total);
        setLastPage(Math.max(1, last));
      } catch (err) {
        // Request lama yang dibatalkan (pindah halaman / ganti filter) bukan error.
        if ((err as Error)?.name === "AbortError") return;
        console.error("Gagal mengambil data report pengaduan:", err);
        setComplaints([]);
        setTotalData(0);
        setLastPage(1);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [currentPage, debouncedSearch, appliedFilters.month, appliedFilters.year, reloadKey]);

  // 3. Stat skala usaha dari ringkasan backend (bukan dihitung dari seluruh
  //    aduan). Backend memakai pembagian min/max karyawan yang resmi.
  const scaleStats = useMemo(() => {
    const s = sizeSummary ?? {};
    return [
      { key: "mikro", label: "MIKRO", total: Number(s["Mikro"] ?? 0) },
      { key: "kecil", label: "KECIL", total: Number(s["Kecil"] ?? 0) },
      { key: "menengah", label: "MENENGAH", total: Number(s["Menengah"] ?? 0) },
      { key: "besar", label: "BESAR", total: Number(s["Besar"] ?? 0) },
    ];
  }, [sizeSummary]);

  // 4. Pagination: total & jumlah halaman dari backend; baris = halaman aktif.
  const totalPages = Math.max(1, lastPage);
  const displayedRows = complaints;
  const visiblePages = pageWindow(currentPage, totalPages);

  useEffect(() => {
    // Setelah hapus/filter, halaman aktif bisa melewati halaman terakhir.
    if (!loading) setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages, loading]);

  const handleFilter = () => {
    // Terapkan juga pencarian yang masih menunggu jeda ketik.
    setDebouncedSearch(search.trim().slice(0, 255));
    setAppliedFilters({ month, year });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");
    setMonth("Semua Bulan");
    setYear("2026");
    setAppliedFilters({ month: "Semua Bulan", year: "2026" });
    setCurrentPage(1);
  };

  // 5. Hapus Pengaduan
  // Konfirmasi hapus lewat modal di tengah layar; hasilnya tetap toast.
  const handleDelete = async (id: number) => {
    const ok = await confirmDialog({
      title: "Hapus Pengaduan",
      message: CONFIRM_MESSAGES.deleteComplaint,
    });
    if (ok) await deleteComplaint(id);
  };

  const deleteComplaint = async (id: number) => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    try {
      const res = await fetch(`${COMPLAINTS_API_URL}/complaints/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        toast.success(SUCCESS_MESSAGES.complaintDeleted);
        // Ambil ulang halaman aktif; bila baris terakhir di halaman ini terhapus,
        // mundur satu halaman. Angka skala usaha ikut disegarkan.
        if (complaints.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
        else setReloadKey((k) => k + 1);
        loadSizeSummary();
      } else {
        toast.error(ERROR_MESSAGES.complaintDeleteFailed);
      }
    } catch (e) {
      console.error("Gagal menghapus aduan:", e);
      toast.error(ERROR_MESSAGES.complaintDeleteError);
    }
  };
  const handleDownloadPdf = async (complaintId: number, ticketNumber?: string) => {
    try {
      setDownloadingId(complaintId);
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      const response = await fetch(apiUrl(`complaints/${complaintId}/pdf`), {
        method: "GET",
        headers: {
          Accept: "application/pdf, application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error("Gagal mengunduh PDF");

      const contentType = response.headers.get("content-type") || "";

      // Kasus 1: Backend mengembalikan JSON (berisi URL file storage)
      if (contentType.includes("application/json")) {
        const json = await response.json();
        const fileUrl = json?.url || json?.data?.url || json?.pdf_url || json?.download_url;

        if (fileUrl) {
          const a = document.createElement("a");
          a.href = fileUrl;
          a.target = "_blank";
          a.download = `Pengaduan_${ticketNumber ?? complaintId}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }

        throw new Error(json?.message || "Format data JSON tidak memuat URL file PDF.");
      }

      // Kasus 2: Backend mengembalikan Binary Stream File PDF murni
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `Pengaduan_${ticketNumber ?? complaintId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error(err.message || ERROR_MESSAGES.pdfComplaintExportFailed);
    } finally {
      setDownloadingId(null);
    }
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
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                placeholder="Cari pelapor, perusahaan, atau jenis..."
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64]"
              />
            </div>

            {/* Month Select */}
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

            {/* Year Select */}
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

            {/* Filter Button */}
            <button
              type="button"
              onClick={handleFilter}
              className="inline-flex items-center justify-center rounded-lg bg-[#0F2137] px-5 py-2 text-[11px] font-semibold text-white hover:bg-[#1a2f4a] transition-colors cursor-pointer"
            >
              Filter
            </button>

            {/* Reset Button */}
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
          {scaleStats.map((stat) => (
            <div
              key={stat.key}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-center"
            >
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                {stat.label}
              </p>
              <p className="mt-2 text-[18px] font-bold text-gray-900 leading-none">
                {nf.format(stat.total)}{" "}
                <span className="text-[12px] font-medium text-gray-500">Pengaduan</span>
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
                  <th className="px-6 py-3.5">BUKTI PENDUKUNG</th>
                  <th className="px-6 py-3.5 text-right w-40">AKSI</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-gray-50 text-[12px] transition-opacity ${
                  loading ? "opacity-50" : ""
                }`}
              >
                {loading && displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
                        <span>Memuat data pengaduan...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                      Tidak ada data pengaduan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((item, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const jenis = jenisPengaduanLabel(item);
                    const pelapor = item.complainant?.nama_lengkap ?? "-";
                    const perusahaan = item.company?.nama_perusahaan ?? "-";
                    const tanggal = formatDateIndo(item.complaint_date ?? item.created_at);

                    return (
                      <tr key={item.id ?? index} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-3.5 text-gray-600 font-medium">{rowNumber}</td>
                        <td className="px-6 py-3.5 text-gray-700">{tanggal}</td>
                        <td className="px-6 py-3.5 text-gray-700 font-medium">{jenis}</td>
                        <td className="px-6 py-3.5 text-gray-800 font-medium">{pelapor}</td>
                        <td className="px-6 py-3.5 text-gray-700">{perusahaan}</td>
                        <td className="px-6 py-3.5">
                          <button
                            type="button"
                            title="Lihat Bukti Pendukung"
                            onClick={() => {
                              window.location.assign(`/admin/view_berkas_pendukung?id=${item.id}`);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#14B846] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#12A63C] transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Unduh */}
                            <button
                              type="button"
                              title="Unduh PDF"
                              disabled={downloadingId === item.id}
                              onClick={() => handleDownloadPdf(item.id, item.ticket_number)}
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {downloadingId === item.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* Detail Berkas (PDF) */}
                            <button
                              type="button"
                              title="Lihat"
                              onClick={() => {
                                window.location.assign(`/admin/view_pdf?id=${item.id}`);
                              }}
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#14B846] text-white hover:bg-[#12A63C] transition-colors cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            {/* Lihat (Detail) */}

                            <button
                              type="button"
                              title="Detail Berkas"
                              onClick={() => {
                                window.location.assign(`/admin/detail_berkas?id=${item.id}`);
                              }}
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#14B846] text-white hover:bg-[#12A63C] transition-colors cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* Hapus (khusus super admin) */}
                            {canDelete && (
                              <button
                                type="button"
                                title="Hapus"
                                onClick={() => handleDelete(item.id)}
                                className="grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= FOOTER PAGINATION ================= */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-gray-500">
            Menampilkan {displayedRows.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {(currentPage - 1) * itemsPerPage + displayedRows.length} dari {nf.format(totalData)}{" "}
            data
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

            {visiblePages.map((page) => (
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
              ›
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Download,
  FileText,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const COMPLAINTS_API_URL = "http://192.168.147.199:8000/api";

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
    search: "",
    month: "Semua Bulan",
    year: "2026",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Fetch seluruh aduan dari API (menghandle pagination backend hingga tuntas)
  const fetchComplaints = async () => {
    setLoading(true);
    const token =
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    const authHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      let allData: any[] = [];
      const res = await fetch(`${COMPLAINTS_API_URL}/complaints?per_page=50`, {
        method: "GET",
        headers: authHeaders,
      });

      if (res.ok) {
        const json = await res.json();
        const firstPageData = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.data)
          ? json.data.data
          : Array.isArray(json)
          ? json
          : [];

        allData = [...firstPageData];

        const lastPage = Number(json?.last_page ?? json?.data?.last_page ?? 1);
        if (lastPage > 1 && allData.length < Number(json?.total ?? json?.data?.total ?? 0)) {
          for (let p = 2; p <= lastPage; p++) {
            const nextRes = await fetch(`${COMPLAINTS_API_URL}/complaints?page=${p}&per_page=50`, {
              headers: authHeaders,
            });
            if (nextRes.ok) {
              const nextJson = await nextRes.json();
              const nextItems = Array.isArray(nextJson?.data)
                ? nextJson.data
                : Array.isArray(nextJson?.data?.data)
                ? nextJson.data.data
                : [];
              allData = [...allData, ...nextItems];
            }
          }
        }
      }

      setComplaints(allData);
    } catch (err) {
      console.error("Gagal mengambil data report pengaduan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // 2. Filter data berdasarkan pencarian, bulan, dan tahun
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const q = appliedFilters.search.trim().toLowerCase();
      const pelapor = String(item.complainant?.nama_lengkap ?? "").toLowerCase();
      const perusahaan = String(item.company?.nama_perusahaan ?? "").toLowerCase();
      const jenis = String(
        item.category?.category_name ?? item.category?.category_code ?? ""
      ).toLowerCase();
      const ticket = String(item.ticket_number ?? "").toLowerCase();

      const matchesSearch =
        !q ||
        pelapor.includes(q) ||
        perusahaan.includes(q) ||
        jenis.includes(q) ||
        ticket.includes(q);

      if (!matchesSearch) return false;

      const dateStr = item.complaint_date ?? item.created_at;
      if (!dateStr) return true;

      const d = new Date(String(dateStr).replace(" ", "T"));
      if (isNaN(d.getTime())) return true;

      // Filter Tahun
      if (
        appliedFilters.year !== "Semua Tahun" &&
        d.getFullYear() !== Number(appliedFilters.year)
      ) {
        return false;
      }

      // Filter Bulan
      if (appliedFilters.month !== "Semua Bulan") {
        const targetMonth = MONTH_MAP[appliedFilters.month];
        if (d.getMonth() + 1 !== targetMonth) return false;
      }

      return true;
    });
  }, [complaints, appliedFilters]);

  // 3. Hitung Stat Skala Usaha dari data terfilter
  const scaleStats = useMemo(() => {
    let mikro = 0;
    let kecil = 0;
    let menengah = 0;
    let besar = 0;

    filteredComplaints.forEach((item) => {
      const naker = Number(
        item.company?.jumlah_naker ?? item.jumlah_naker ?? 0
      );

      if (naker > 0 && naker < 10) mikro++;
      else if (naker >= 10 && naker < 50) kecil++;
      else if (naker >= 50 && naker < 200) menengah++;
      else if (naker >= 200) besar++;
      else mikro++;
    });

    return [
      { key: "mikro", label: "MIKRO", total: mikro },
      { key: "kecil", label: "KECIL", total: kecil },
      { key: "menengah", label: "MENENGAH", total: menengah },
      { key: "besar", label: "BESAR", total: besar },
    ];
  }, [filteredComplaints]);

  // 4. Pagination
  const totalData = filteredComplaints.length;
  const totalPages = Math.max(1, Math.ceil(totalData / itemsPerPage));
  const displayedRows = useMemo(() => {
    return filteredComplaints.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredComplaints, currentPage, itemsPerPage]);

  const handleFilter = () => {
    setAppliedFilters({ search, month, year });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setMonth("Semua Bulan");
    setYear("2026");
    setAppliedFilters({ search: "", month: "Semua Bulan", year: "2026" });
    setCurrentPage(1);
  };

  // 5. Hapus Pengaduan
  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengaduan ini?")) return;

    const token =
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    try {
      const res = await fetch(`${COMPLAINTS_API_URL}/complaints/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        setComplaints((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus aduan.");
      }
    } catch (e) {
      console.error("Gagal menghapus aduan:", e);
    }
  };
  const handleDownloadPdf = async (complaintId: number, ticketNumber?: string) => {
    try {
      setDownloadingId(complaintId);
      const token =
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      const response = await fetch(
        `http://192.168.147.199:8000/api/complaints/${complaintId}/pdf`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf, application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

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
      const downloadUrl = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `Pengaduan_${ticketNumber ?? complaintId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("Download error:", err);
      alert(err.message || "Terjadi kesalahan saat mengunduh PDF pengaduan.");
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
                onChange={(e) => setSearch(e.target.value)}
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
                        <span>Memuat data pengaduan...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Tidak ada data pengaduan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((item, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const jenis =
                      item.category?.category_name ??
                      item.category?.category_code ??
                      item.kategori ??
                      "-";
                    const pelapor = item.complainant?.nama_lengkap ?? "-";
                    const perusahaan = item.company?.nama_perusahaan ?? "-";
                    const tanggal = formatDateIndo(
                      item.complaint_date ?? item.created_at
                    );

                    return (
                      <tr
                        key={item.id ?? index}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-6 py-3.5 text-gray-600 font-medium">
                          {rowNumber}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700">
                          {tanggal}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700 font-medium">
                          {jenis}
                        </td>
                        <td className="px-6 py-3.5 text-gray-800 font-medium">
                          {pelapor}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700">
                          {perusahaan}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Unduh */}
                            <button
                              type="button"
                              title="Unduh PDF"
                              disabled={downloadingId === item.id}
                              onClick={() =>
                                handleDownloadPdf(item.id, item.ticket_number)
                              }
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {downloadingId === item.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {/* Detail Berkas */}
                            <button
                              type="button"
                              title="Detail Berkas"
                              onClick={() => {
                                window.location.assign(`/admin/detail_berkas?id=${item.id}`);
                              }}
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            {/* Lihat */}
                              
                            <button
                              type="button"
                              title="Lihat"
                              onClick={() => {
                                window.location.assign(`/admin/view_pdf?id=${item.id}`);
                              }}
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* Hapus */}
                            <button
                              type="button"
                              title="Hapus"
                              onClick={() => handleDelete(item.id)}
                              className="grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
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
            {(currentPage - 1) * itemsPerPage + displayedRows.length} dari{" "}
            {nf.format(totalData)} data
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

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
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
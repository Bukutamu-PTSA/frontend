import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  Download,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";

const PROVINCE_SUMMARY_API_URL = apiUrl("dashboard/province-summary");
// Ekspor rekapitulasi provinsi dalam bentuk PDF dari backend.
const PROVINCE_PDF_API_URL = apiUrl("dashboard/province-summary/pdf");
// Master kategori pengaduan: sumber kolom tabel agar otomatis mengikuti
// kategori terbaru (termasuk yang baru ditambahkan admin).
const CATEGORIES_API_URL = apiUrl("complaint-categories");

export const Route = createFileRoute("/admin/wilayah")({
  head: () => ({
    meta: [
      {
        title: "Data Provinsi - PTSA KEMNAKER",
      },
    ],
  }),
  component: DataProvinsiPage,
});

interface CategoryColumn {
  apiKey: string;
  label: string;
}

// Cadangan bila API master kategori gagal dimuat.
const DEFAULT_CATEGORY_COLUMNS: CategoryColumn[] = [
  { apiKey: "WAJIB_LAPOR", label: "WAJIB LAPOR KETENAGAKERJAAN" },
  { apiKey: "UPAH_KERJA", label: "UPAH KERJA" },
  { apiKey: "JAMINAN_SOSIAL", label: "JAMINAN SOSIAL" },
  { apiKey: "HUBUNGAN_KERJA", label: "HUBUNGAN KERJA" },
  { apiKey: "KECELAKAAN_KERJA", label: "KECELAKAAN KERJA" },
  { apiKey: "WAKTU_KERJA", label: "WAKTU KERJA & WAKTU ISTIRAHAT" },
  { apiKey: "KADER_NORMA", label: "KADER NORMA KETENAGAKERJAAN" },
  { apiKey: "PENEMPATAN_TK", label: "PENEMPATAN TK DALAM & LUAR NEGERI" },
  { apiKey: "K3", label: "KESELAMATAN & KESEHATAN KERJA" },
  { apiKey: "PEREMPUAN_ANAK", label: "PEREMPUAN & ANAK" },
  { apiKey: "NORMA_K3", label: "KADER NORMA K3" },
  { apiKey: "SKP", label: "SKP" },
];

function toTitleCase(str: string): string {
  if (!str) return "-";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

interface ProvinsiRow {
  no: number;
  provinsi: string;
  total: number;
  [key: string]: string | number;
}

// Ubah satu item mentah dari API menjadi baris tabel lengkap dengan nomor urut.
function mapProvinsiItem(item: any, no: number, columns: CategoryColumn[]): ProvinsiRow {
  let provName = toTitleCase(item.provinsi || "-");
  if (
    provName.toUpperCase().includes("DKI") ||
    provName.toUpperCase().includes("IBUKOTA") ||
    provName.toUpperCase().includes("JAKARTA")
  ) {
    provName = "Daerah Khusus Ibukota Jakarta";
  }

  // Normalisasi kunci category_counts (huruf besar) agar cocok dengan kode master.
  const rawCounts = item.category_counts || {};
  const counts: Record<string, number> = {};
  Object.entries(rawCounts).forEach(([key, value]) => {
    counts[String(key).trim().toUpperCase()] = Number(value ?? 0);
  });

  const rowObj: ProvinsiRow = {
    no,
    provinsi: provName,
    total: Number(item.count ?? item.total ?? 0),
  };

  columns.forEach((col) => {
    rowObj[col.apiKey] = counts[col.apiKey] ?? 0;
  });

  return rowObj;
}

function DataProvinsiPage() {
  const [loading, setLoading] = useState(true);
  const [rawProvinces, setRawProvinces] = useState<any[]>([]);
  const [categoryColumns, setCategoryColumns] =
    useState<CategoryColumn[]>(DEFAULT_CATEGORY_COLUMNS);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [sortField, setSortField] = useState<string>("total");
  const [sortAsc, setSortAsc] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ambil master kategori + SEMUA data provinsi sekali di awal (tarik seluruh
  // halaman dari API), lalu paginasi/pencarian/sort dilakukan di sisi klien.
  useEffect(() => {
    const fetchAllProvinces = async () => {
      setLoading(true);
      const headers = authHeaders();

      const extractList = (json: any): any[] =>
        Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

      // 1. Master kategori -> kolom tabel. Otomatis ikut saat kategori baru
      // ditambahkan, dan kategori tanpa aduan tetap tampil (nilai 0).
      try {
        const categoriesJson = await fetch(CATEGORIES_API_URL, { headers })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);

        const columns: CategoryColumn[] = extractList(categoriesJson)
          .map((c: any) => ({
            apiKey: String(c.category_code ?? "")
              .trim()
              .toUpperCase(),
            label: String(c.category_name ?? c.name ?? "")
              .trim()
              .toUpperCase(),
          }))
          .filter((c) => c.apiKey && c.label)
          .filter((c, i, arr) => arr.findIndex((x) => x.apiKey === c.apiKey) === i);

        if (columns.length > 0) setCategoryColumns(columns);
      } catch (err) {
        console.error("Gagal memuat master kategori:", err);
      }

      // 2. Data provinsi (per_page besar; fallback loop bila dibatasi backend).
      const perPage = 100;

      const buildUrl = (page: number) =>
        `${PROVINCE_SUMMARY_API_URL}?with_categories=1&page=${page}&per_page=${perPage}`;

      const fetchPage = async (page: number) => {
        const res = await fetch(buildUrl(page), { headers });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      };

      try {
        const first = await fetchPage(1);
        const collected: any[] = extractList(first);

        // Tentukan jumlah halaman total dari meta (mendukung beberapa bentuk respons).
        const lastPage = Number(first?.meta?.last_page ?? first?.last_page ?? 1);

        // Ambil sisa halaman (2..lastPage) secara paralel bila ada.
        if (Number.isFinite(lastPage) && lastPage > 1) {
          const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
          const results = await Promise.all(pages.map((p) => fetchPage(p)));
          results.forEach((json) => {
            collected.push(...extractList(json));
          });
        }

        setRawProvinces(collected);
      } catch (err) {
        console.error("Gagal memuat data provinsi:", err);
        setRawProvinces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProvinces();
  }, []);

  // Baris tabel dibangun ulang ketika kolom kategori ikut berubah.
  const tableData = useMemo(
    () => rawProvinces.map((item, idx) => mapProvinsiItem(item, idx + 1, categoryColumns)),
    [rawProvinces, categoryColumns],
  );

  const filteredData = useMemo(() => {
    const result = tableData.filter((row) =>
      row.provinsi.toLowerCase().includes(search.toLowerCase().trim()),
    );

    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA ?? "").localeCompare(String(valB ?? ""))
        : String(valB ?? "").localeCompare(String(valA ?? ""));
    });

    return result;
  }, [tableData, search, sortField, sortAsc]);

  // Total item mengikuti jumlah data hasil filter (seluruh provinsi yang tertarik).
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Kembali ke halaman 1 bila filter/urutan berubah agar tidak "nyangkut".
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortField, sortAsc]);

  // Jaga currentPage tetap valid setelah data/filter berubah.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // Potongan data yang ditampilkan pada halaman aktif (paginasi sisi klien).
  const pagedData = useMemo(
    () => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredData, currentPage, itemsPerPage],
  );

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Susun header & baris data (nomor urut mengikuti urutan hasil filter/sort,
  // sehingga penomoran tetap berlanjut di setiap halaman).
  const buildExportData = () => {
    const headers = ["NO", "PROVINSI", "TOTAL", ...categoryColumns.map((c) => c.label)];

    const rows = filteredData.map((r: ProvinsiRow, index: number) => [
      index + 1,
      r.provinsi,
      r.total,
      ...categoryColumns.map((c) => Number(r[c.apiKey] ?? 0)),
    ]);

    return { headers, rows };
  };

  const fileStamp = () => new Date().toISOString().split("T")[0];

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const { headers, rows } = buildExportData();
    const text = `${headers.join("\t")}\n${rows.map((row) => row.join("\t")).join("\n")}`;

    const copyViaFallback = () => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!copyViaFallback()) {
        throw new Error("Gagal menyalin ke clipboard.");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin data:", err);
    }
  };

  const handleExportCsv = () => {
    const { headers, rows } = buildExportData();
    const escapeCell = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => row.map(escapeCell).join(",")),
    ].join("\n");

    downloadFile(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" }),
      `Data_Provinsi_${fileStamp()}.csv`,
    );
  };

  const handleExportExcel = () => {
    const { headers, rows } = buildExportData();

    const table = `
      <table border="1">
        <thead>
          <tr>${headers
            .map((h) => `<th style="background:#EDF3F8;font-weight:bold;">${h}</th>`)
            .join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>`;

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${table}</body></html>`;

    downloadFile(
      new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }),
      `Data_Provinsi_${fileStamp()}.xls`,
    );
  };

  // Cetak / simpan sebagai PDF memakai dialog print browser (untuk tombol Print).
  const handlePrintPdf = () => {
    window.print();
  };

  // Unduh rekapitulasi provinsi sebagai PDF dari endpoint backend.
  const handleExportPdf = async () => {
    if (downloadingPdf) return;
    try {
      setDownloadingPdf(true);
      const response = await fetch(PROVINCE_PDF_API_URL, {
        method: "GET",
        headers: {
          Accept: "application/pdf, application/json",
          ...authHeaders(),
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
        a.download = `Data_Provinsi_${fileStamp()}.pdf`;
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
          a.download = `Data_Provinsi_${fileStamp()}.pdf`;
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
      downloadFile(blob, `Data_Provinsi_${fileStamp()}.pdf`);
    } catch (err: any) {
      console.error("Export PDF error:", err);
      alert(err.message || "Terjadi kesalahan saat mengunduh PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs print:hidden">
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">Data Provinsi</h1>
          <p className="text-[11.5px] text-gray-500 mt-0.5">
            Rekapitulasi persebaran pelayanan aduan masyarakat di seluruh provinsi
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-3.5 print:hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-[11px] font-medium text-gray-700 shadow-2xs">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1 cursor-pointer border-r border-gray-100"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : null}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100"
              >
                Excel
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={downloadingPdf}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100 flex items-center gap-1 disabled:opacity-60"
              >
                {downloadingPdf ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
                <span>{downloadingPdf ? "Memuat…" : "PDF"}</span>
              </button>
              <button
                type="button"
                onClick={handlePrintPdf}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              >
                Print
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari provinsi..."
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 pr-8 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64]"
              />
              <Search className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div
          id="printable-table"
          className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead>
                <tr className="bg-[#EDF3F8] text-[9.5px] font-bold text-gray-600 uppercase tracking-tight border-b border-gray-200">
                  <th className="px-3 py-3 w-10 text-center">NO</th>
                  <th
                    onClick={() => handleSort("provinsi")}
                    className="px-4 py-3 cursor-pointer select-none hover:text-gray-900"
                  >
                    <div className="flex items-center gap-1">
                      <span>PROVINSI</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("total")}
                    className="px-3 py-3 text-center font-extrabold cursor-pointer select-none hover:text-gray-900 bg-blue-50/50"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>TOTAL</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  {categoryColumns.map((cat) => (
                    <th
                      key={cat.apiKey}
                      onClick={() => handleSort(cat.apiKey)}
                      className="px-3 py-3 text-center cursor-pointer select-none hover:text-gray-900"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{cat.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700 text-[11px]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={categoryColumns.length + 3}
                      className="px-6 py-14 text-center text-gray-400"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
                        <span>Memuat data rekapitulasi provinsi...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={categoryColumns.length + 3}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Tidak ada data provinsi yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  pagedData.map((row: ProvinsiRow, index: number) => (
                    <tr key={row.no} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-3 py-3.5 text-center text-gray-500 font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-800">{row.provinsi}</td>
                      <td className="px-3 py-3.5 text-center font-bold text-gray-900 bg-blue-50/30">
                        {row.total}
                      </td>
                      {categoryColumns.map((cat) => (
                        <td key={cat.apiKey} className="px-3 py-3.5 text-center text-gray-600">
                          {row[cat.apiKey] ?? 0}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3.5 border-t border-gray-100 gap-3 print:hidden">
            <p className="text-[11px] text-gray-500">
              Menampilkan {totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {(currentPage - 1) * itemsPerPage + pagedData.length} dari {totalItems} data
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {paginationRange.map((page, i) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="grid h-7 w-6 place-items-center text-[11px] text-gray-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    type="button"
                    onClick={() => setCurrentPage(Number(page))}
                    className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#007A64] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
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

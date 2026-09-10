import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const BASE_API_URL = "http://192.168.147.199:8000/api";
const PROVINCE_SUMMARY_API_URL = `${BASE_API_URL}/dashboard/province-summary`;

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

const CATEGORY_COLUMNS = [
  { apiKey: "WAJIB_LAPOR", label: "WLKP" },
  { apiKey: "UPAH_KERJA", label: "UPAH KERJA" },
  { apiKey: "JAMINAN_SOSIAL", label: "JAMINAN SOSIAL" },
  { apiKey: "HUBUNGAN_KERJA", label: "HUBUNGAN KERJA" },
  { apiKey: "KECELAKAAN_KERJA", label: "KECELAKAAN KERJA" },
  { apiKey: "WAKTU_KERJA", label: "WAKTU KERJA WAKTU ISTIRAHAT" },
  { apiKey: "PENEMPATAN_TK", label: "TENAGA KERJA DALAM & LN" },
  { apiKey: "K3", label: "K3" },
  { apiKey: "PEREMPUAN ANAK", label: "PEREMPUAN & K3" },
  { apiKey: "KADER NORMA", label: "KADER NORMA K3" },
  { apiKey: "KADER K3", label: "KNK" },
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

function DataProvinsiPage() {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<ProvinsiRow[]>([]);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const [sortField, setSortField] = useState<string>("total");
  const [sortAsc, setSortAsc] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(44);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token =
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      try {
        const url = `${PROVINCE_SUMMARY_API_URL}?with_categories=1&page=${currentPage}&per_page=${itemsPerPage}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const json = await res.json();
        const rawList: any[] = Array.isArray(json?.data) ? json.data : [];

        // Hitung total provinsi yang benar (bukan total pengaduan 146)
        const totalProvCount = Number(
          json?.meta?.total_provinces ??
          json?.meta?.total_data ??
          (json?.meta?.last_page ? json.meta.last_page * itemsPerPage : null) ??
          (json?.last_page ? json.last_page * itemsPerPage : null) ??
          44
        );
        setTotalItems(totalProvCount);

        const rows: ProvinsiRow[] = rawList.map((item: any, idx: number) => {
          let provName = toTitleCase(item.provinsi || "-");
          if (
            provName.toUpperCase().includes("DKI") ||
            provName.toUpperCase().includes("IBUKOTA") ||
            provName.toUpperCase().includes("JAKARTA")
          ) {
            provName = "Daerah Khusus Ibukota Jakarta";
          }

          const counts = item.category_counts || {};

          const rowObj: ProvinsiRow = {
            no: (currentPage - 1) * itemsPerPage + idx + 1,
            provinsi: provName,
            total: Number(item.count ?? item.total ?? 0),
          };

          CATEGORY_COLUMNS.forEach((col) => {
            rowObj[col.apiKey] = Number(counts[col.apiKey] ?? 0);
          });

          return rowObj;
        });

        setTableData(rows);
      } catch (err) {
        console.error("Gagal memuat data provinsi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const filteredData = useMemo(() => {
    const result = tableData.filter((row) =>
      row.provinsi.toLowerCase().includes(search.toLowerCase().trim())
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

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleCopy = () => {
    const headers = ["NO", "PROVINSI", "TOTAL", ...CATEGORY_COLUMNS.map((c) => c.label)].join("\t");
    const body = filteredData
      .map((r: ProvinsiRow) =>
        [r.no, r.provinsi, r.total, ...CATEGORY_COLUMNS.map((c) => r[c.apiKey] ?? 0)].join("\t")
      )
      .join("\n");

    navigator.clipboard.writeText(`${headers}\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ["NO", "PROVINSI", "TOTAL", ...CATEGORY_COLUMNS.map((c) => `"${c.label}"`)].join(",");
    const rows = filteredData
      .map((r: ProvinsiRow) =>
        [r.no, `"${r.provinsi}"`, r.total, ...CATEGORY_COLUMNS.map((c) => r[c.apiKey] ?? 0)].join(",")
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Data_Provinsi_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-xs print:hidden">
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
            Data Provinsi
          </h1>
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
                onClick={handleExportCsv}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100"
              >
                Excel
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100"
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => window.print()}
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
                  {CATEGORY_COLUMNS.map((cat) => (
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
                      colSpan={CATEGORY_COLUMNS.length + 3}
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
                      colSpan={CATEGORY_COLUMNS.length + 3}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Tidak ada data provinsi yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row: ProvinsiRow) => (
                    <tr
                      key={row.provinsi}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-3 py-3.5 text-center text-gray-500 font-medium">
                        {row.no}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-800">
                        {row.provinsi}
                      </td>
                      <td className="px-3 py-3.5 text-center font-bold text-gray-900 bg-blue-50/30">
                        {row.total}
                      </td>
                      {CATEGORY_COLUMNS.map((cat) => (
                        <td
                          key={cat.apiKey}
                          className="px-3 py-3.5 text-center text-gray-600"
                        >
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
              Menampilkan {filteredData.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {(currentPage - 1) * itemsPerPage + filteredData.length} dari {totalItems} data
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
                )
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
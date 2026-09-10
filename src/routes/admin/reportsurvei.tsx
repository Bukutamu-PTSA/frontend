import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Copy,
  FileSpreadsheet,
  FileText,
  FileDown,
  Columns3,
  Smile,
  Meh,
  Frown,
  Inbox,
  Loader2,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const SURVEY_API_URL = "http://192.168.147.199:8000/api";

export const Route = createFileRoute("/admin/reportsurvei")({
  head: () => ({
    meta: [
      {
        title: "Report Survei Pelayanan - PTSA KEMNAKER",
      },
    ],
  }),
  component: ReportSurveiPage,
});

const nf = new Intl.NumberFormat("id-ID");

interface SurveyRespondent {
  id?: number | string;
  survey_date?: string | null;
  created_at?: string | null;
  komunikasi_petugas?: string | number | null;
  substansi_materi?: string | number | null;
  sarana_prasarana?: string | number | null;
  keterangan?: string | null;
  name?: string | null;
  [key: string]: unknown;
}

function formatDateIndo(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(String(dateStr).replace(" ", "T"));
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
}

/** Kategorikan rata-rata nilai menjadi Baik / Cukup / Kurang. */
function categorize(item: SurveyRespondent): "baik" | "cukup" | "kurang" {
  const vals = [
    Number(item.komunikasi_petugas ?? 0),
    Number(item.substansi_materi ?? 0),
    Number(item.sarana_prasarana ?? 0),
  ].filter((v) => !isNaN(v) && v > 0);

  if (vals.length === 0) return "cukup";
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

  if (avg >= 3.5) return "baik";
  if (avg >= 2.5) return "cukup";
  return "kurang";
}

function ReportSurveiPage() {
  const [respondents, setRespondents] = useState<SurveyRespondent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");

      const authHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(`${SURVEY_API_URL}/surveys?per_page=50`, {
          method: "GET",
          headers: authHeaders,
        });

        if (res.ok) {
          const json = await res.json();
          const data: SurveyRespondent[] = Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.data?.data)
            ? json.data.data
            : Array.isArray(json)
            ? json
            : [];
          setRespondents(data);
        } else {
          setRespondents([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data survei:", err);
        setRespondents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Filter berdasarkan pencarian
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return respondents;
    return respondents.filter((item) => {
      const nama = String(item.name ?? "").toLowerCase();
      const ket = String(item.keterangan ?? "").toLowerCase();
      const tgl = formatDateIndo(item.survey_date ?? item.created_at).toLowerCase();
      return nama.includes(q) || ket.includes(q) || tgl.includes(q);
    });
  }, [respondents, search]);

  // Statistik ringkas
  const stats = useMemo(() => {
    let baik = 0;
    let cukup = 0;
    let kurang = 0;
    filtered.forEach((item) => {
      const c = categorize(item);
      if (c === "baik") baik++;
      else if (c === "cukup") cukup++;
      else kurang++;
    });
    return { baik, cukup, kurang };
  }, [filtered]);

  // Pagination
  const totalData = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalData / itemsPerPage));
  const displayedRows = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filtered, currentPage]
  );

  const summaryCards = [
    {
      key: "baik",
      title: "PELAYANAN BAIK",
      total: stats.baik,
      topBorder: "border-t-[#10B981]",
      badgeBg: "bg-[#DCFCE7]",
      badgeText: "text-[#10B981]",
      Icon: Smile,
    },
    {
      key: "cukup",
      title: "PELAYANAN CUKUP",
      total: stats.cukup,
      topBorder: "border-t-[#F59E0B]",
      badgeBg: "bg-[#FEF3C7]",
      badgeText: "text-[#F59E0B]",
      Icon: Meh,
    },
    {
      key: "kurang",
      title: "PELAYANAN KURANG",
      total: stats.kurang,
      topBorder: "border-t-[#EF4444]",
      badgeBg: "bg-[#FEE2E2]",
      badgeText: "text-[#EF4444]",
      Icon: Frown,
    },
  ];

  const startEntry = displayedRows.length
    ? (currentPage - 1) * itemsPerPage + 1
    : 0;
  const endEntry = (currentPage - 1) * itemsPerPage + displayedRows.length;

  return (
    <AppShell title="Report Survei" breadcrumb="Report Survei">
      <div className="space-y-5">
        {/* ================= HEADER PAGE ================= */}
        <h1 className="text-[20px] font-semibold tracking-tight text-gray-800">
          Report Survei Pelayanan
        </h1>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-xl border border-t-2 border-gray-100 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] ${card.topBorder}`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold uppercase tracking-wide text-gray-700">
                    {card.title}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Komunikasi, Materi, Sarpras
                  </p>
                </div>
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${card.badgeBg}`}
                >
                  <card.Icon className={`h-4 w-4 ${card.badgeText}`} />
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <p className="text-[22px] font-bold leading-none text-gray-900">
                  {nf.format(card.total)}
                </p>
                <p className="text-[11px] text-gray-400">Responden</p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DETAIL RESPONDEN PANEL ================= */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-gray-50 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-gray-800">
                Detail Responden
              </h2>
              <span className="rounded-md bg-[#EEF2F6] px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                {nf.format(totalData)} Data
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search responden */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari responden..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64] sm:w-56"
                />
              </div>

              {/* Export buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <FileText className="h-3.5 w-3.5" /> CSV
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#EF4444] transition-colors hover:bg-red-50"
                >
                  <FileDown className="h-3.5 w-3.5" /> PDF
                </button>
                <button
                  type="button"
                  title="Kolom"
                  className="grid h-[30px] w-[30px] place-items-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                >
                  <Columns3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-semibold text-gray-500">
                  <th className="px-6 py-3 w-14">No</th>
                  <th className="px-6 py-3">Tanggal Survei</th>
                  <th className="px-6 py-3">Komunikasi Petugas</th>
                  <th className="px-6 py-3">Substansi Materi</th>
                  <th className="px-6 py-3">Sarana Prasarana</th>
                  <th className="px-6 py-3">Keterangan</th>
                  <th className="px-6 py-3 text-right w-24">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
                        <span>Memuat data responden...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-100">
                          <Inbox className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-[12px] text-gray-400">
                          Tidak ada data responden untuk periode ini
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((item, index) => {
                    const rowNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr
                        key={item.id ?? index}
                        className="transition-colors hover:bg-gray-50/60"
                      >
                        <td className="px-6 py-3.5 font-medium text-gray-600">
                          {rowNumber}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700">
                          {formatDateIndo(item.survey_date ?? item.created_at)}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700">
                          {item.komunikasi_petugas ?? "-"}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700">
                          {item.substansi_materi ?? "-"}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700">
                          {item.sarana_prasarana ?? "-"}
                        </td>
                        <td className="px-6 py-3.5 text-gray-700">
                          {item.keterangan ?? "-"}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="Lihat"
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white transition-colors hover:bg-[#00654F]"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Hapus"
                              className="grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white transition-colors hover:bg-red-600"
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

          {/* Footer pagination */}
          <div className="flex items-center justify-between border-t border-gray-50 px-6 py-3.5">
            <p className="text-[11px] text-gray-500">
              Menampilkan {startEntry} hingga {endEntry} dari{" "}
              {nf.format(totalData)} entri
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="grid h-7 w-7 place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-[#0D2B4C] text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="grid h-7 w-7 place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
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

import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Check,
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
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { API_BASE_URL as SURVEY_API_URL } from "@/lib/api";
import { pageWindow } from "@/lib/pagination";

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
  nama_petugas?: string | null;
  komunikasi_petugas?: string | null;
  penjelasan_materi?: string | null;
  sarana_prasarana?: string | null;
  catatan?: string | null;
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

/** Ambil jawaban dari objek answers sebuah submission (key angka maupun string). */
function answer(answers: any, qn: number): string | null {
  if (!answers || typeof answers !== "object") return null;
  const value = answers[String(qn)] ?? answers[qn];
  return value != null && String(value).trim() !== "" ? String(value) : null;
}

/**
 * Normalisasi data respons survei menjadi satu baris per responden.
 *
 * Bentuk utama (API saat ini): payload.data = { questions, submissions[] }.
 * Tiap submission sudah mewakili 1 responden dengan objek `answers` yang
 * memetakan nomor pertanyaan ke jawaban (Q1 Nama Petugas, Q2 Komunikasi,
 * Q3 Penjelasan Materi, Q4 Sarana & Prasarana, Q5 Catatan).
 *
 * Bentuk lama/fallback:
 * - baris jawaban per-pertanyaan { id, survey_date, question_number, answer },
 *   digrouping memakai heuristik id berurutan (tiap grup = 1 responden);
 * - responden flat { nama_petugas, komunikasi_petugas, ... }.
 */
function normalizeRespondents(payload: any): SurveyRespondent[] {
  const data = payload?.data;

  // Bentuk utama: data.submissions (benda, bukan array jawaban).
  if (data && Array.isArray(data.submissions)) {
    return data.submissions.map((s: any) => ({
      id: s.submission_id ?? s.no ?? s.id,
      survey_date: s.submitted_at ?? s.survey_date ?? s.created_at ?? null,
      created_at: s.submitted_at ?? s.created_at ?? null,
      nama_petugas: answer(s.answers, 1),
      komunikasi_petugas: answer(s.answers, 2),
      penjelasan_materi: answer(s.answers, 3),
      sarana_prasarana: answer(s.answers, 4),
      catatan: answer(s.answers, 5),
    }));
  }

  // Fallback: baris mentah (array).
  const raw = Array.isArray(data)
    ? data
    : Array.isArray(payload?.data?.data)
      ? payload.data.data
      : Array.isArray(payload)
        ? payload
        : [];

  const hasQuestionKey = raw.some(
    (r: any) =>
      r?.question_number != null || r?.survey_question_id != null || Array.isArray(r?.responses),
  );

  if (hasQuestionKey) {
    const leafRows: any[] = [];
    raw.forEach((row: any) => {
      if (Array.isArray(row.responses)) {
        row.responses.forEach((r: any) => leafRows.push({ ...row, ...r }));
      } else {
        leafRows.push(row);
      }
    });

    const sorted = [...leafRows].sort((a, b) => Number(a.id ?? 0) - Number(b.id ?? 0));

    const groups: any[][] = [];
    let current: any[] = [];
    let prevId: number | null = null;
    sorted.forEach((r) => {
      const id = Number(r.id);
      if (prevId !== null && id !== prevId && id !== prevId + 1) {
        if (current.length) groups.push(current);
        current = [];
      }
      current.push(r);
      prevId = id;
    });
    if (current.length) groups.push(current);

    const respondents: SurveyRespondent[] = [];
    groups.forEach((rows) => {
      const byQ = new Map<number, string>();
      rows.forEach((r: any) => {
        const qn = Number(r.question_number ?? r.survey_question_id);
        const ans = r.answer != null ? String(r.answer) : "";
        if (qn && ans) byQ.set(qn, ans);
      });
      const first = rows[0] ?? {};
      respondents.push({
        id: first.survey_id ?? first.respondent_id ?? first.id,
        survey_date: first.survey_date ?? first.created_at ?? null,
        created_at: first.created_at ?? null,
        nama_petugas: byQ.get(1) || null,
        komunikasi_petugas: byQ.get(2) || null,
        penjelasan_materi: byQ.get(3) || null,
        sarana_prasarana: byQ.get(4) || null,
        catatan: byQ.get(5) || null,
      });
    });
    return respondents;
  }

  return raw.map((r: any) => ({
    id: r.id ?? r.survey_id,
    survey_date: r.survey_date ?? r.created_at ?? null,
    created_at: r.created_at ?? null,
    nama_petugas: r.nama_petugas ?? r.name ?? null,
    komunikasi_petugas: r.komunikasi_petugas ?? r.q2 ?? null,
    penjelasan_materi: r.penjelasan_materi ?? r.substansi_materi ?? r.q3 ?? null,
    sarana_prasarana: r.sarana_prasarana ?? r.q4 ?? null,
    catatan: r.catatan ?? r.keterangan ?? r.q5 ?? null,
  }));
}

const LIKERT_SCORE: Record<string, number> = {
  baik: 3,
  cukup: 2,
  kurang: 1,
};

/**
 * Kategorikan jawaban likert (Baik/Cukup/Kurang) menjadi label. Baris tanpa
 * jawaban likert (mis. Q1 Nama Petugas / Q5 Catatan) dikembalikan null.
 */
function categorize(item: SurveyRespondent): "baik" | "cukup" | "kurang" | null {
  const vals = [item.komunikasi_petugas, item.penjelasan_materi, item.sarana_prasarana]
    .map((v) => LIKERT_SCORE[String(v ?? "").toLowerCase()])
    .filter((v): v is number => typeof v === "number");

  if (vals.length === 0) return null;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

  if (avg >= 2.5) return "baik";
  if (avg >= 1.5) return "cukup";
  return "kurang";
}

const COLUMN_DEFS: { key: string; label: string }[] = [
  { key: "tanggal", label: "Tanggal Survei" },
  { key: "nama", label: "Nama Petugas" },
  { key: "komunikasi", label: "Komunikasi Petugas" },
  { key: "materi", label: "Penjelasan Materi" },
  { key: "sarana", label: "Sarana & Prasarana PTSA" },
  { key: "catatan", label: "Catatan" },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Nilai satu sel tabel untuk sebuah kolom responden. */
function cellValue(item: SurveyRespondent, key: string): string {
  switch (key) {
    case "tanggal":
      return formatDateIndo(item.survey_date ?? item.created_at);
    case "nama":
      return item.nama_petugas || "-";
    case "komunikasi":
      return item.komunikasi_petugas || "-";
    case "materi":
      return item.penjelasan_materi || "-";
    case "sarana":
      return item.sarana_prasarana || "-";
    case "catatan":
      return item.catatan || "-";
    default:
      return "-";
  }
}

function ReportSurveiPage() {
  const [respondents, setRespondents] = useState<SurveyRespondent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewItem, setViewItem] = useState<SurveyRespondent | null>(null);
  const [copied, setCopied] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(COLUMN_DEFS.map((c) => c.key));
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      const authHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(`${SURVEY_API_URL}/surveys/responses?per_page=100`, {
          method: "GET",
          headers: authHeaders,
        });

        if (res.ok) {
          const json = await res.json();
          let allRespondents = normalizeRespondents(json);

          const meta = json?.meta ?? json?.data?.meta ?? {};
          const lastPage = Number(
            meta?.last_page ?? json?.last_page ?? json?.data?.last_page ?? 1,
          );
          const total = Number(
            meta?.total ?? json?.total ?? json?.data?.total ?? allRespondents.length,
          );

          if (lastPage > 1 && allRespondents.length < total) {
            for (let p = 2; p <= lastPage; p++) {
              const nextRes = await fetch(
                `${SURVEY_API_URL}/surveys/responses?page=${p}&per_page=100`,
                {
                  method: "GET",
                  headers: authHeaders,
                },
              );
              if (nextRes.ok) {
                const nextJson = await nextRes.json();
                allRespondents = [...allRespondents, ...normalizeRespondents(nextJson)];
              }
            }
          }

          setRespondents(allRespondents);
        } else {
          console.error(
            "[reportsurvei] Gagal ambil respons, status:",
            res.status,
            await res.text(),
          );
          setRespondents([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data survei:", err);
        console.error("[reportsurvei] detail error:", err);
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
      const nama = String(item.nama_petugas ?? "").toLowerCase();
      const komunikasi = String(item.komunikasi_petugas ?? "").toLowerCase();
      const materi = String(item.penjelasan_materi ?? "").toLowerCase();
      const sarana = String(item.sarana_prasarana ?? "").toLowerCase();
      const ket = String(item.catatan ?? "").toLowerCase();
      const tgl = formatDateIndo(item.survey_date ?? item.created_at).toLowerCase();
      return (
        nama.includes(q) ||
        komunikasi.includes(q) ||
        materi.includes(q) ||
        sarana.includes(q) ||
        ket.includes(q) ||
        tgl.includes(q)
      );
    });
  }, [respondents, search]);

  // Statistik ringkas
  const stats = useMemo(() => {
    let baik = 0;
    let cukup = 0;
    let kurang = 0;
    respondents.forEach((item) => {
      const c = categorize(item);
      if (c === "baik") baik++;
      else if (c === "cukup") cukup++;
      else if (c === "kurang") kurang++;
    });
    return { baik, cukup, kurang };
  }, [respondents]);

  // Pagination
  const totalData = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalData / itemsPerPage));
  const displayedRows = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage],
  );

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // ------------- Toolbar ekspor & pengaturan kolom -------------
  const fileStamp = () => new Date().toISOString().split("T")[0];

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const buildExportTable = () => {
    const headers = COLUMN_DEFS.filter((c) => visibleColumns.includes(c.key)).map((c) => c.label);
    const rows = filtered.map((item) =>
      COLUMN_DEFS.filter((c) => visibleColumns.includes(c.key)).map((c) => cellValue(item, c.key)),
    );
    return { headers, rows };
  };

  const handleCopy = async () => {
    const { headers, rows } = buildExportTable();
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
    const { headers, rows } = buildExportTable();
    const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
    const csv = [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => row.map(escapeCell).join(",")),
    ].join("\n");

    downloadFile(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" }),
      `Report_Survei_${fileStamp()}.csv`,
    );
  };

  const handleExportExcel = () => {
    const { headers, rows } = buildExportTable();

    const table = `
      <table border="1">
        <thead>
          <tr>${headers
            .map((h) => `<th style="background:#EDF3F8;font-weight:bold;">${escapeHtml(h)}</th>`)
            .join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>`;

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${table}</body></html>`;

    downloadFile(
      new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }),
      `Report_Survei_${fileStamp()}.xls`,
    );
  };

  const handlePrintPdf = () => {
    const { headers, rows } = buildExportTable();
    const th = (v: string) =>
      `<th style="border:1px solid #d1d5db;padding:6px 10px;background:#EDF3F8;text-align:left;font-size:11px;">${escapeHtml(v)}</th>`;
    const td = (v: string) =>
      `<td style="border:1px solid #d1d5db;padding:6px 10px;font-size:11px;">${escapeHtml(v)}</td>`;

    const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Report Survei Pelayanan</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; margin: 32px; color: #111827; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .sub { font-size: 12px; color: #6b7280; margin: 0 0 20px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d1d5db; padding: 6px 10px; font-size: 11px; text-align: left; }
  th { background: #EDF3F8; }
</style>
</head>
<body>
<h1>Report Survei Pelayanan</h1>
<p class="sub">${nf.format(totalData)} responden &middot; Dicetak ${new Date().toLocaleString("id-ID")}</p>
<table>
<thead><tr><th style="border:1px solid #d1d5db;padding:6px 10px;background:#EDF3F8;text-align:left;">No</th>${headers.map(th).join("")}</tr></thead>
<tbody>${rows.map((row, i) => `<tr><td style="border:1px solid #d1d5db;padding:6px 10px;">${i + 1}</td>${row.map(td).join("")}</tr>`).join("")}</tbody>
</table>
<script>window.addEventListener("load", function () { window.print(); });</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=960,height=640");
    if (!win) {
      alert("Popup diblokir. Izinkan popup agar laporan dapat dicetak/diunduh sebagai PDF.");
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
  };

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

  const startEntry = displayedRows.length ? (currentPage - 1) * itemsPerPage + 1 : 0;
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
                  <p className="mt-1 text-[10px] text-gray-400">Komunikasi, Materi, Sarpras</p>
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
              <h2 className="text-[14px] font-bold text-gray-800">Detail Responden</h2>
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
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Tersalin" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" /> CSV
                </button>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                </button>
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#EF4444] transition-colors hover:bg-red-50 cursor-pointer"
                >
                  <FileDown className="h-3.5 w-3.5" /> PDF
                </button>

                {/* Pilih kolom */}
                <div className="relative">
                  <button
                    type="button"
                    title="Kolom"
                    onClick={() => setColumnsOpen((o) => !o)}
                    className="grid h-[30px] w-[30px] place-items-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    <Columns3 className="h-3.5 w-3.5" />
                  </button>

                  {columnsOpen && (
                    <div className="absolute right-0 z-20 mt-1.5 w-56 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                      <p className="px-2 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Tampilkan Kolom
                      </p>
                      {COLUMN_DEFS.map((col) => (
                        <label
                          key={col.key}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col.key)}
                            onChange={() => toggleColumn(col.key)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          {col.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-semibold text-gray-500">
                  <th className="px-6 py-3 w-14">No</th>
                  {COLUMN_DEFS.filter((col) => visibleColumns.includes(col.key)).map((col) => (
                    <th key={col.key} className="px-6 py-3">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right w-24">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={2 + visibleColumns.length}
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
                        <span>Memuat data responden...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={2 + visibleColumns.length} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-100">
                          <Inbox className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-[12px] text-gray-400">
                          {search.trim()
                            ? "Tidak ada data responden yang cocok dengan pencarian"
                            : "Tidak ada data responden untuk periode ini"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((item, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr key={item.id ?? index} className="transition-colors hover:bg-gray-50/60">
                        <td className="px-6 py-3.5 font-medium text-gray-600">{rowNumber}</td>
                        {COLUMN_DEFS.filter((col) => visibleColumns.includes(col.key)).map(
                          (col) => (
                            <td key={col.key} className="px-6 py-3.5 text-gray-700">
                              {cellValue(item, col.key)}
                            </td>
                          ),
                        )}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="Lihat"
                              onClick={() => setViewItem(item)}
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white transition-colors hover:bg-[#00654F] cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
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
              Menampilkan {startEntry} hingga {endEntry} dari {nf.format(totalData)} entri
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
              {pageWindow(currentPage, totalPages).map((page) => (
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

      {/* ================= MODAL DETAIL RESPONDEN ================= */}
      {viewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-[14px] font-bold text-gray-800">Detail Responden Survei</h3>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  {formatDateIndo(viewItem.survey_date ?? viewItem.created_at)}
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setViewItem(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <DetailField label="Nama Petugas" value={viewItem.nama_petugas} />
              <DetailField label="Komunikasi Petugas" value={viewItem.komunikasi_petugas} />
              <DetailField label="Penjelasan Materi" value={viewItem.penjelasan_materi} />
              <DetailField label="Sarana & Prasarana PTSA" value={viewItem.sarana_prasarana} />
              <DetailField label="Catatan" value={viewItem.catatan} multiline />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Penilaian
                </p>
                <span
                  className={`mt-1.5 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                    categorize(viewItem) === "baik"
                      ? "bg-[#DCFCE7] text-[#10B981]"
                      : categorize(viewItem) === "cukup"
                        ? "bg-[#FEF3C7] text-[#F59E0B]"
                        : categorize(viewItem) === "kurang"
                          ? "bg-[#FEE2E2] text-[#EF4444]"
                          : "bg-[#EEF2F6] text-gray-500"
                  }`}
                >
                  {categorize(viewItem) === "baik"
                    ? "Pelayanan Baik"
                    : categorize(viewItem) === "cukup"
                      ? "Pelayanan Cukup"
                      : categorize(viewItem) === "kurang"
                        ? "Pelayanan Kurang"
                        : "Belum dinilai"}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="w-full rounded-lg bg-[#0D2B4C] py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#123d68] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

/** Baris detail sederhana di dalam modal. */
function DetailField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p
        className={`mt-1 text-[13px] font-medium text-gray-700 ${
          multiline ? "whitespace-pre-wrap leading-relaxed" : ""
        }`}
      >
        {value && String(value).trim() !== "" ? value : "-"}
      </p>
    </div>
  );
}

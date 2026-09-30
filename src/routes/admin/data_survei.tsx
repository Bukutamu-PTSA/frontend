import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { useTableExport } from "@/lib/use-table-export";
import { pageWindow } from "@/lib/pagination";
import { editableQuestions, fetchSurveyQuestions, resolveSurveyId } from "@/lib/survey";

export const Route = createFileRoute("/admin/data_survei")({
  head: () => ({
    meta: [{ title: "Data Survei Pelayanan · PTSA-KEMNAKER" }],
  }),
  component: DataSurveiPage,
});

interface SurveiItem {
  /** `questions[].id` asli dari API — inilah yang dikirim ke form edit. */
  id: number;
  /** Survey tempat pertanyaan ini berada. */
  surveyId: number;
  pertanyaan: string;
  optionA: string;
  optionB: string;
  optionC: string;
}

const ITEMS_PER_PAGE = 10;

function DataSurveiPage() {
  const navigate = useNavigate();
  const [surveyId, setSurveyId] = useState<number | null>(null);
  const [rows, setRows] = useState<SurveiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const id = await resolveSurveyId();
        const questions = await fetchSurveyQuestions(id);
        setSurveyId(id);

        // Tabel hanya menampilkan pertanyaan berskala (punya opsi jawaban).
        setRows(
          editableQuestions(questions).map((q) => ({
            id: q.id ?? q.question_number ?? 0,
            surveyId: id,
            pertanyaan: q.question_text,
            optionA: q.options[0] ?? "",
            optionB: q.options[1] ?? "",
            optionC: q.options[2] ?? "",
          })),
        );
      } catch (err: any) {
        console.error("[data_survei] Gagal memuat pertanyaan survei:", err);
        setRows([]);
        setError(err?.message || "Gagal memuat data survei.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.pertanyaan.toLowerCase().includes(q) ||
        r.optionA.toLowerCase().includes(q) ||
        r.optionB.toLowerCase().includes(q) ||
        r.optionC.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const buildExport = useMemo(() => {
    const headers = ["NO", "SKALA PELAYANAN", "OPTION A", "OPTION B", "OPTION C"];
    const rows: (string | number)[][] = filtered.map((item, index) => [
      index + 1,
      item.pertanyaan,
      item.optionA,
      item.optionB,
      item.optionC,
    ]);
    return { headers, rows };
  }, [filtered]);

  const { copied, handleCopy, handleCsv, handleExcel, handlePrint } = useTableExport({
    baseName: "Data_Survei",
    headers: buildExport.headers,
    rows: buildExport.rows,
  });

  const handleDelete = (id: number) => {
    if (!window.confirm("Hapus pertanyaan survei ini?")) return;
    // TODO(backend): panggil DELETE /api/surveys/{survey}/{question} setelah
    // endpoint hapus perpertanyaan tersedia di backend.
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppShell title="Data Survei" breadcrumb="Data Survei">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Survei Pelayanan</h1>
          <p className="mt-1 text-[12px] text-gray-500">Soal Survei Pelayanan</p>
        </div>

          <div className="px-1">
            {loading && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Memuat pertanyaan survei...
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Toolbar export + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleCsv}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={handleExcel}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50"
            >
              Excel
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50"
            >
              Print
            </button>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari soal pelayanan…"
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#016A61] sm:w-64"
          />
        </div>

        {/* Tabel */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F5FA] text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  <th className="w-14 px-5 py-3.5">No</th>
                  <th className="px-5 py-3.5">Skala Pelayanan</th>
                  <th className="px-5 py-3.5">Option A</th>
                  <th className="px-5 py-3.5">Option B</th>
                  <th className="px-5 py-3.5">Option C</th>
                  <th className="w-28 px-5 py-3.5 text-right">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {!loading && displayed.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                      Tidak ada data survei.
                    </td>
                  </tr>
                ) : (
                  displayed.map((item, index) => (
                    <tr key={`${item.surveyId}-${item.id}`} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-5 py-3.5 text-gray-800">{item.pertanyaan}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.optionA}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.optionB}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.optionC}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              navigate({
                                to: "/admin/edit_survei",
                                search: {
                                  id: item.id,
                                  survey: item.surveyId,
                                },
                              })
                            }
                            className="grid h-7 w-7 place-items-center rounded-md bg-[#016A61] text-white transition-colors hover:bg-[#00544d]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Hapus"
                            onClick={() => handleDelete(item.id)}
                            className="grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white transition-colors hover:bg-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-gray-500">
            {surveyId
              ? `Pertanyaan dari survei #${surveyId} — `
              : ""}
            Menampilkan {displayed.length ? (page - 1) * ITEMS_PER_PAGE + 1 : 0} to{" "}
            {(page - 1) * ITEMS_PER_PAGE + displayed.length} dari {filtered.length} data
          </p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AppShell>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40"
      >
        ‹
      </button>
      {pageWindow(page, totalPages).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors ${
            page === p ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}

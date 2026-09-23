import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Pencil, Trash2, RefreshCw, TriangleAlert } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { apiUrl, getAuthToken } from "@/lib/api";
import { useTableExport } from "@/lib/export-utils";
import { pageWindow } from "@/lib/pagination";

export const Route = createFileRoute("/admin/faq")({
  head: () => ({
    meta: [{ title: "FAQ · PTSA-KEMNAKER" }],
  }),
  component: FaqPage,
});

interface FaqItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

/** Bentuk respons JSON API. */
interface ApiJson {
  success?: boolean;
  message?: string;
  errors?: Record<string, unknown>;
  data?: unknown;
}

const FAQ_LIST_URL = apiUrl("faqs");
const ITEMS_PER_PAGE = 10;

function FaqPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<FaqItem[]>([]);
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchFaqs = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const token = getAuthToken();
      const response = await fetch(FAQ_LIST_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat data (${response.status}).`);
      }

      const json: unknown = await response.json();
      const rawList = Array.isArray(json) ? json : (json as ApiJson)?.data;
      const list = Array.isArray(rawList) ? rawList : [];

      setRows(
        list.map((raw) => {
          const item = raw as {
            id?: unknown;
            pertanyaan?: unknown;
            question?: unknown;
            jawaban?: unknown;
            answer?: unknown;
          };
          return {
            id: Number(item.id),
            pertanyaan: String(item.pertanyaan ?? item.question ?? ""),
            jawaban: String(item.jawaban ?? item.answer ?? ""),
          };
        }),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat data FAQ.";
      console.error("Gagal mengambil data FAQ:", err);
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.pertanyaan.toLowerCase().includes(q) || r.jawaban.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const extractApiError = (json: unknown, fallback: string): string => {
    const api = json as ApiJson;
    let errMsg = "";

    const errors = api?.errors;
    if (errors && typeof errors === "object") {
      Object.values(errors).forEach((val) => {
        const txt = Array.isArray(val) ? val.join(", ") : String(val ?? "");
        if (txt) errMsg += `${txt}. `;
      });
    }

    if (!errMsg) {
      errMsg = api?.message || fallback;
    }
    return errMsg.trim();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const q = pertanyaan.trim();
    const a = jawaban.trim();

    if (!q) {
      setFormError("Pertanyaan wajib diisi.");
      return;
    }
    if (!a) {
      setFormError("Jawaban wajib diisi.");
      return;
    }

    const isEdit = editingId !== null;
    const token = getAuthToken();

    setSaving(true);
    try {
      const response = await fetch(isEdit ? `${FAQ_LIST_URL}/${editingId}` : FAQ_LIST_URL, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: q, answer: a }),
      });

      const json: unknown = await response.json().catch(() => null);

      if (!response.ok || (json as ApiJson)?.success === false) {
        throw new Error(extractApiError(json, `Gagal menyimpan (${response.status}).`));
      }

      setPertanyaan("");
      setJawaban("");
      setEditingId(null);
      await fetchFaqs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      console.error("Gagal menyimpan FAQ:", err);
      setFormError(message || "Gagal menyimpan FAQ. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setPertanyaan(item.pertanyaan);
    setJawaban(item.jawaban);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setPertanyaan("");
    setJawaban("");
    setFormError(null);
  };

  const handleDelete = async (item: FaqItem) => {
    if (!window.confirm(`Hapus FAQ "${item.pertanyaan}"?`)) return;

    const token = getAuthToken();
    try {
      const response = await fetch(`${FAQ_LIST_URL}/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json: unknown = await response.json().catch(() => null);

      if (!response.ok || (json as ApiJson)?.success === false) {
        throw new Error(extractApiError(json, `Gagal menghapus (${response.status}).`));
      }

      if (editingId === item.id) handleCancelEdit();
      await fetchFaqs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      console.error("Gagal menghapus FAQ:", err);
      alert(message || "Gagal menghapus FAQ. Coba lagi.");
    }
  };

  const buildExport = useMemo(() => {
    const headers = ["NO", "PERTANYAAN", "JAWABAN"];
    const rows: (string | number)[][] = filtered.map((item, index) => [
      index + 1,
      item.pertanyaan,
      item.jawaban,
    ]);
    return { headers, rows };
  }, [filtered]);

  const { copied, handleCopy, handleCsv, handleExcel, handlePrint } = useTableExport({
    baseName: "FAQ",
    headers: buildExport.headers,
    rows: buildExport.rows,
  });

  return (
    <AppShell title="FAQ" breadcrumb="FAQ">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">FAQ</h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Frequently Asked Questions - kelola pertanyaan dan jawaban layanan.
          </p>
        </div>

        {/* Form tambah */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="mb-4 text-[13px] font-bold text-gray-800">
            {editingId ? "Edit FAQ" : "Tambah FAQ"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Pertanyaan</label>
              <input
                type="text"
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                placeholder="Contoh: Apa itu layanan PTSA KEMNAKER?"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">Jawaban</label>
              <textarea
                value={jawaban}
                onChange={(e) => setJawaban(e.target.value)}
                placeholder="Tuliskan jawaban lengkap untuk pertanyaan di atas…"
                rows={4}
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </div>
            {formError && <p className="text-xs font-medium text-red-500">{formError}</p>}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#016A61] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
              )}
              {!editingId && (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/admin/setting" })}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  Kembali
                </button>
              )}
            </div>
          </form>
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
              PDF
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
            placeholder="Cari pertanyaan…"
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#016A61] sm:w-64"
          />
        </div>

        {loadError && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-2 text-[11px] text-red-700">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Gagal mengambil data dari server: <span className="font-semibold">{loadError}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={fetchFaqs}
              disabled={loading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              Coba Lagi
            </button>
          </div>
        )}

        {/* Tabel */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F5FA] text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  <th className="w-14 px-5 py-3.5">No</th>
                  <th className="px-5 py-3.5">Pertanyaan</th>
                  <th className="px-5 py-3.5">Jawaban</th>
                  <th className="w-24 px-5 py-3.5 text-right">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memuat...
                      </span>
                    </td>
                  </tr>
                ) : displayed.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                      Tidak ada data FAQ.
                    </td>
                  </tr>
                ) : (
                  displayed.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{item.pertanyaan}</td>
                      <td className="max-w-md px-5 py-3.5 text-gray-700">{item.jawaban}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() => handleEdit(item)}
                            className="grid h-7 w-7 place-items-center rounded-md bg-[#016A61] text-white transition-colors hover:bg-[#00544d]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Hapus"
                            onClick={() => handleDelete(item)}
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
            Menampilkan {displayed.length ? (page - 1) * ITEMS_PER_PAGE + 1 : 0} to{" "}
            {(page - 1) * ITEMS_PER_PAGE + displayed.length} dari {filtered.length} data
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40"
            >
              ‹
            </button>
            {pageWindow(page, totalPages).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors ${
                  page === p ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

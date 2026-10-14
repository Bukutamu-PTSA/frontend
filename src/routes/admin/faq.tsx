import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";
import { extractList, isRecord } from "@/lib/json";
import { pageWindow } from "@/lib/pagination";

export const Route = createFileRoute("/admin/faq")({
  head: () => ({
    meta: [{ title: "Manajemen FAQ · PTSA-KEMNAKER" }],
  }),
  component: FaqPage,
});

const FAQ_API_URL = apiUrl("faqs");

const ITEMS_PER_PAGE = 10;

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqForm {
  question: string;
  answer: string;
}

const EMPTY_FORM: FaqForm = { question: "", answer: "" };

/** Baca pesan error dari respons Laravel (message / errors / nested data). */
async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  const json: unknown = await res.json().catch(() => null);
  if (!isRecord(json)) return fallback;

  if (isRecord(json["errors"])) {
    const messages = Object.values(json["errors"])
      .flat()
      .filter((v): v is string => typeof v === "string");
    if (messages.length > 0) return messages.join(", ");
  }

  const data = json["data"];
  if (isRecord(data) && typeof data["message"] === "string") return data["message"];
  if (typeof json["message"] === "string") return json["message"];

  return fallback;
}

/** Normalisasi satu record FAQ dari berbagai nama field yang dipakai backend. */
function toFaqItem(raw: unknown, index: number): FaqItem | null {
  if (!isRecord(raw)) return null;

  const id = Number(raw["id"] ?? raw["faq_id"] ?? index + 1);
  if (!Number.isFinite(id)) return null;

  return {
    id,
    question: String(raw["question"] ?? raw["pertanyaan"] ?? ""),
    answer: String(raw["answer"] ?? raw["jawaban"] ?? ""),
  };
}

function FaqPage() {
  const [rows, setRows] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FaqForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Ambil daftar FAQ dari API: GET /api/faqs.
  const loadFaqs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(FAQ_API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...authHeaders(),
        },
      });

      if (!res.ok) {
        setError(await readErrorMessage(res, `Gagal memuat FAQ (HTTP ${res.status}).`));
        return;
      }

      const json: unknown = await res.json();
      setRows(extractList(json).map(toFaqItem).filter((item): item is FaqItem => item !== null));
    } catch (err: any) {
      console.error("Gagal memuat FAQ:", err);
      setError(err?.message || "Gagal memuat FAQ. Periksa koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.question.toLowerCase().includes(q) || r.answer.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setForm({ question: item.question, answer: item.answer });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tambah (POST /api/faqs) atau perbarui (PUT /api/faqs/{id}).
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const question = form.question.trim();
    const answer = form.answer.trim();
    if (!question) {
      setError("Pertanyaan wajib diisi.");
      return;
    }
    if (!answer) {
      setError("Jawaban wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        editingId === null ? FAQ_API_URL : `${FAQ_API_URL}/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify({ question, answer }),
        },
      );

      if (!res.ok) {
        throw new Error(
          await readErrorMessage(res, `Gagal menyimpan FAQ (HTTP ${res.status}).`),
        );
      }

      resetForm();
      await loadFaqs();
    } catch (err: any) {
      console.error("Gagal menyimpan FAQ:", err);
      setError(err?.message || "Terjadi kesalahan saat menyimpan FAQ.");
    } finally {
      setSaving(false);
    }
  };

  // Hapus FAQ: DELETE /api/faqs/{id}.
  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus FAQ ini?")) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`${FAQ_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...authHeaders(),
        },
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res, `Gagal menghapus FAQ (HTTP ${res.status}).`));
      }

      setRows((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
    } catch (err: any) {
      console.error("Gagal menghapus FAQ:", err);
      setError(err?.message || "Gagal menghapus FAQ. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell title="Manajemen FAQ" breadcrumb="Manajemen FAQ">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Manajemen FAQ</h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Kelola pertanyaan yang sering ditanyakan beserta jawabannya.
          </p>
        </div>

        {/* Form tambah / edit */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="mb-5 text-[13px] font-bold uppercase tracking-wide text-gray-800">
            {editingId === null ? "Form Tambah FAQ" : "Form Edit FAQ"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[12px] font-semibold text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]">
                Pertanyaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                placeholder="Contoh: Siapa saja yang berhak menyampaikan aduan ketenagakerjaan?"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]">
                Jawaban <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={form.answer}
                onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                placeholder="Tuliskan jawaban lengkap untuk pertanyaan ini"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Batal Edit
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#016A61] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : editingId === null ? (
                  <Plus className="h-3.5 w-3.5" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                {saving
                  ? "Menyimpan…"
                  : editingId === null
                    ? "Tambah FAQ"
                    : "Perbarui FAQ"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabel daftar FAQ */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari pertanyaan atau jawaban…"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#016A61] sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F5FA] text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  <th className="w-14 px-5 py-3.5">No</th>
                  <th className="px-5 py-3.5">Pertanyaan</th>
                  <th className="px-5 py-3.5">Jawaban</th>
                  <th className="w-28 px-5 py-3.5 text-right">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                      {loading ? "Memuat data FAQ..." : "Belum ada data FAQ."}
                    </td>
                  </tr>
                ) : (
                  displayed.map((item, index) => (
                    <tr
                      key={item.id}
                      className={editingId === item.id ? "bg-[#016A61]/5" : "hover:bg-gray-50/60"}
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{item.question}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.answer}</td>
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
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
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

export default FaqPage;

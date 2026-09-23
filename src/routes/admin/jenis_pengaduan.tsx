import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Pencil, Save, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { apiUrl } from "@/lib/api";
import { useTableExport } from "@/lib/export-utils";
import { pageWindow } from "@/lib/pagination";

export const Route = createFileRoute("/admin/jenis_pengaduan")({
  head: () => ({
    meta: [{ title: "Jenis Pengaduan · PTSA-KEMNAKER" }],
  }),
  component: JenisPengaduanPage,
});

interface JenisItem {
  id: number;
  nama: string;
  kode: string;
}

const JENIS_API_URL = apiUrl("complaint-categories");
const ITEMS_PER_PAGE = 10;

function JenisPengaduanPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<JenisItem[]>([]);
  const [nama, setNama] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchJenis = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    try {
      const response = await fetch(JENIS_API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const json = await response.json();
        const list: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

        setRows(
          list.map((item) => ({
            id: Number(item.id),
            nama: String(item.category_name ?? item.name ?? ""),
            kode: String(item.category_code ?? ""),
          })),
        );
      }
    } catch (err) {
      console.error("Gagal mengambil data jenis pengaduan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJenis();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.nama.toLowerCase().includes(q) || r.kode.toLowerCase().includes(q));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const value = nama.trim();
    if (!value) {
      setFormError("The category name field is required.");
      return;
    }

    const category_code = value.toUpperCase().replace(/\s+/g, "_");
    const isEdit = editingId !== null;
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    setSaving(true);
    try {
      const response = await fetch(isEdit ? `${JENIS_API_URL}/${editingId}` : JENIS_API_URL, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ category_code, category_name: value }),
      });

      const json = await response.json().catch(() => null);

      if (!response.ok || json?.success === false) {
        let errMsg = "";
        const errors = json?.errors;
        if (errors && typeof errors === "object") {
          Object.values(errors).forEach((val) => {
            const txt = Array.isArray(val) ? val.join(", ") : String(val ?? "");
            if (txt) errMsg += `${txt}. `;
          });
        }
        if (!errMsg) {
          errMsg = json?.message || `Gagal menyimpan (${response.status}).`;
        }
        throw new Error(errMsg.trim());
      }

      setNama("");
      setEditingId(null);
      fetchJenis();
    } catch (err: any) {
      console.error("Gagal menyimpan jenis pengaduan:", err);
      setFormError(err?.message || "Gagal menyimpan jenis pengaduan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: JenisItem) => {
    setEditingId(item.id);
    setNama(item.nama);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNama("");
    setFormError(null);
  };

  const handleDelete = async (item: JenisItem) => {
    if (!window.confirm(`Hapus jenis pengaduan "${item.nama}"?`)) return;
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    try {
      const response = await fetch(`${JENIS_API_URL}/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await response.json().catch(() => null);

      if (!response.ok || json?.success === false) {
        throw new Error(json?.message || `Gagal menghapus (${response.status}).`);
      }

      fetchJenis();
    } catch (err: any) {
      console.error("Gagal menghapus jenis pengaduan:", err);
      alert(err?.message || "Gagal menghapus jenis pengaduan. Coba lagi.");
    }
  };

  const buildExport = useMemo(() => {
    const headers = ["NO", "JENIS PENGADUAN", "KODE KATEGORI"];
    const rows: (string | number)[][] = filtered.map((item, index) => [
      index + 1,
      item.nama,
      item.kode,
    ]);
    return { headers, rows };
  }, [filtered]);

  const { copied, handleCopy, handleCsv, handleExcel, handlePdf, handlePrint } = useTableExport({
    baseName: "Jenis_Pengaduan",
    headers: buildExport.headers,
    rows: buildExport.rows,
  });

  return (
    <AppShell title="Jenis Pengaduan" breadcrumb="Jenis Pengaduan">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Jenis Pengaduan</h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Master kategori jenis pengaduan masyarakat.
          </p>
        </div>

        {/* Form tambah */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="mb-4 text-[13px] font-bold text-gray-800">
            {editingId ? "Edit Jenis Pengaduan" : "Tambah Jenis Pengaduan"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Upah Kerja"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
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
              onClick={handlePdf}
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
            placeholder="Cari pengaduan…"
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
                  <th className="px-5 py-3.5">Jenis Pengaduan</th>
                  <th className="px-5 py-3.5">Kode Kategori</th>
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
                      Tidak ada data jenis pengaduan.
                    </td>
                  </tr>
                ) : (
                  displayed.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{item.nama}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.kode}</td>
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

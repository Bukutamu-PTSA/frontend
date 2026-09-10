import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Save, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin/jenis_pengaduan")({
  head: () => ({
    meta: [{ title: "Jenis Pengaduan · PTSA-KEMNAKER" }],
  }),
  component: JenisPengaduanPage,
});

interface JenisItem {
  id: number;
  nama: string;
  time: string;
}

// TODO(backend): ganti dengan data dari API jenis pengaduan.
const INITIAL_DATA: JenisItem[] = [
  { id: 1, nama: "Lisensi", time: "2026-01-08 10:12:48" },
  { id: 2, nama: "SKP", time: "2026-01-08 10:12:48" },
];

const EXPORT_ACTIONS = ["Copy", "CSV", "Excel", "PDF", "Print"];
const ITEMS_PER_PAGE = 10;

function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function JenisPengaduanPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<JenisItem[]>(INITIAL_DATA);
  const [nama, setNama] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.nama.toLowerCase().includes(q));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const value = nama.trim();
    if (!value) return;
    // TODO(backend): POST /api/jenis-pengaduan dengan { nama: value }.
    setRows((prev) => [
      ...prev,
      { id: Date.now(), nama: value, time: nowStamp() },
    ]);
    setNama("");
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Hapus jenis pengaduan ini?")) return;
    // TODO(backend): DELETE /api/jenis-pengaduan/{id}.
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppShell title="Jenis Pengaduan" breadcrumb="Jenis Pengaduan">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Jenis Pengaduan
          </h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Master kategori jenis pengaduan masyarakat.
          </p>
        </div>

        {/* Form tambah */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="mb-4 text-[13px] font-bold text-gray-800">
            Tambah Jenis Pengaduan
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Upah Kerja"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#016A61] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d]"
              >
                <Save className="h-3.5 w-3.5" />
                Simpan
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/setting" })}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>

        {/* Toolbar export + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {EXPORT_ACTIONS.map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50"
              >
                {label}
              </button>
            ))}
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
                  <th className="px-5 py-3.5">Time</th>
                  <th className="w-20 px-5 py-3.5 text-right">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {displayed.length === 0 ? (
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
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        {item.nama}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">{item.time}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end">
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
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
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

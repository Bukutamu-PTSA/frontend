import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin/data_skala")({
  head: () => ({
    meta: [{ title: "Data Skala Parameter Perusahaan · PTSA-KEMNAKER" }],
  }),
  component: DataSkalaPage,
});

interface SkalaItem {
  id: number;
  nama: string;
  start: number;
  end: number;
}

// TODO(backend): ganti dengan data dari API skala perusahaan.
const INITIAL_DATA: SkalaItem[] = [
  { id: 1, nama: "Besar", start: 100, end: 999999999 },
  { id: 2, nama: "Menengah", start: 20, end: 99 },
  { id: 3, nama: "Kecil", start: 5, end: 19 },
  { id: 4, nama: "Mikro", start: 0, end: 4 },
];

const EXPORT_ACTIONS = ["Copy", "CSV", "Excel", "PDF", "Print"];
const ITEMS_PER_PAGE = 10;

const nf = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2 });

function DataSkalaPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<SkalaItem[]>(INITIAL_DATA);
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

  const handleDelete = (id: number) => {
    if (!window.confirm("Hapus skala perusahaan ini?")) return;
    // TODO(backend): DELETE /api/skala/{id}.
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppShell title="Skala Perusahaan" breadcrumb="Skala Perusahaan">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Skala Parameter Perusahaan
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">
            Skala Perusahaan Berdasarkan Jumlah Pekerja
          </p>
        </div>

        {/* Toolbar */}
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
            placeholder="Cari skala perusahaan…"
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
                  <th className="px-5 py-3.5">Skala Perusahaan</th>
                  <th className="px-5 py-3.5">Start</th>
                  <th className="px-5 py-3.5">End</th>
                  <th className="w-28 px-5 py-3.5 text-right">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                      Tidak ada data skala.
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
                      <td className="px-5 py-3.5 text-gray-700">
                        {nf.format(item.start)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">
                        {nf.format(item.end)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              navigate({
                                to: "/admin/edit_skala",
                                search: { id: item.id },
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

import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin/data_visitor")({
  head: () => ({
    meta: [{ title: "Data Visitor · PTSA-KEMNAKER" }],
  }),
  component: DataVisitorPage,
});

interface VisitorItem {
  id: number;
  tanggal: string;
  ip: string;
  page: string;
  waktu: string;
}

// TODO(backend): ganti dengan data dari API visitor / analytics.
const INITIAL_DATA: VisitorItem[] = [];

const EXPORT_ACTIONS = ["Copy", "CSV", "Excel", "PDF", "Print"];
const ITEMS_PER_PAGE = 10;

function DataVisitorPage() {
  const [rows] = useState<VisitorItem[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.ip.toLowerCase().includes(q) || r.page.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <AppShell title="Data Visitor" breadcrumb="Data Visitor">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
            Data Visitor
          </h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Statistik kunjungan dan buku tamu digital.
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
            placeholder="Cari pengunjung…"
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
                  <th className="px-5 py-3.5">Tanggal Visitor</th>
                  <th className="px-5 py-3.5">IP MDB</th>
                  <th className="px-5 py-3.5">Page</th>
                  <th className="px-5 py-3.5">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                      Belum ada data pengunjung.
                    </td>
                  </tr>
                ) : (
                  displayed.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700">{item.tanggal}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.ip}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.page}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.waktu}</td>
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

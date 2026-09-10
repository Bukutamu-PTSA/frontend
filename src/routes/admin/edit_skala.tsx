import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin/edit_skala")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search["id"] ? Number(search["id"]) : undefined,
  }),
  head: () => ({
    meta: [{ title: "Edit Skala Perusahaan · PTSA-KEMNAKER" }],
  }),
  component: EditSkalaPage,
});

function EditSkalaPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  // TODO(backend): fetch data skala berdasarkan `id` untuk mengisi nilai awal.
  const [kategori, setKategori] = useState("Besar");
  const [rangeStart, setRangeStart] = useState("100.00");
  const [rangeEnd, setRangeEnd] = useState("999999999.00");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO(backend): PUT /api/skala/{id} dengan { kategori, rangeStart, rangeEnd }.
      await new Promise((r) => setTimeout(r, 400));
      navigate({ to: "/admin/data_skala" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Edit Skala" breadcrumb="Edit Skala">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h2 className="mb-6 text-[14px] font-bold uppercase tracking-wide text-gray-800">
          Form Edit Skala
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]">
              Kategori
            </label>
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]">
                Range Start
              </label>
              <input
                type="number"
                step="0.01"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]">
                Range End
              </label>
              <input
                type="number"
                step="0.01"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/data_skala" })}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#016A61] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50"
            >
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin/edit_survei")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search["id"] ? Number(search["id"]) : undefined,
  }),
  head: () => ({
    meta: [{ title: "Edit Data Survei · PTSA-KEMNAKER" }],
  }),
  component: EditSurveiPage,
});

function EditSurveiPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  // TODO(backend): fetch data survei berdasarkan `id` untuk mengisi nilai awal.
  const [pertanyaan, setPertanyaan] = useState(
    "Bagaimana Sarana dan Prasarana layanan PTSA?"
  );
  const [optionA, setOptionA] = useState("Baik");
  const [optionB, setOptionB] = useState("Cukup");
  const [optionC, setOptionC] = useState("Kurang");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO(backend): PUT /api/survei/{id} dengan { pertanyaan, optionA, optionB, optionC }.
      await new Promise((r) => setTimeout(r, 400));
      navigate({ to: "/admin/data_survei" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Edit Data Survei" breadcrumb="Edit Survei">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h2 className="mb-6 text-[14px] font-bold uppercase tracking-wide text-gray-800">
          Form Edit Survei
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Soal" required>
            <input
              type="text"
              value={pertanyaan}
              onChange={(e) => setPertanyaan(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Option A">
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </Field>
            <Field label="Option B">
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </Field>
            <Field label="Option C">
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/data_survei" })}
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

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

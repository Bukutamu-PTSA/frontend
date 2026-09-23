import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";

export const Route = createFileRoute("/admin/edit_skala")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search["id"] ? Number(search["id"]) : undefined,
  }),
  head: () => ({
    meta: [{ title: "Edit Skala Perusahaan · PTSA-KEMNAKER" }],
  }),
  component: EditSkalaPage,
});

const COMPANY_SIZES_API_URL = apiUrl("v1/company-sizes");
const COMPANY_SIZES_ADMIN_API_URL = apiUrl("v1/admin/company-sizes");

function EditSkalaPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  const [kategori, setKategori] = useState("Besar");
  const [rangeStart, setRangeStart] = useState("100");
  const [rangeEnd, setRangeEnd] = useState("999999999");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data skala berdasarkan id agar form sesuai dengan data yang diklik.
  useEffect(() => {
    const fetchSkala = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const tryFetch = async (url: string) => {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...authHeaders(),
          },
        });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      };

      try {
        let json;
        try {
          json = await tryFetch(`${COMPANY_SIZES_ADMIN_API_URL}/${id}`);
        } catch {
          json = await tryFetch(`${COMPANY_SIZES_API_URL}/${id}`);
        }
        const it = json?.data ?? json ?? {};

        const name = String(
          it.size_name ?? it.nama ?? it.company_size ?? it.name ?? "",
        ).trim();
        if (name) setKategori(name);

        const rawMin = Number(it.min_employees ?? it.start ?? it.min ?? NaN);
        if (Number.isFinite(rawMin)) setRangeStart(String(rawMin));

        const rawMax = it.max_employees ?? it.end ?? it.max ?? undefined;
        if (rawMax !== undefined && rawMax !== null) {
          setRangeEnd(String(Number(rawMax)));
        }
      } catch (err) {
        console.error("Gagal memuat data skala:", err);
        setError("Gagal memuat data skala. Silakan kembali dan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkala();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("ID skala tidak ditemukan.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // PUT /api/v1/admin/company-sizes/{companySize}
      const res = await fetch(`${COMPANY_SIZES_ADMIN_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          size_name: kategori,
          min_employees: Number(rangeStart),
          max_employees: Number(rangeEnd),
        }),
      });

      if (!res.ok) {
        const json = res.status === 204 ? null : await res.json().catch(() => null);
        throw new Error(json?.message || `Gagal menyimpan skala (${res.status}).`);
      }

      navigate({ to: "/admin/data_skala" });
    } catch (err: any) {
      console.error("Edit skala error:", err);
      setError(err.message || "Terjadi kesalahan saat menyimpan skala.");
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
          {loading && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-500">
              Memuat data skala...
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}
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
              disabled={saving || loading}
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

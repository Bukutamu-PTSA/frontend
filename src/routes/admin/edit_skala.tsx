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

type SkalaRecord = {
  name: string;
  min: number | null;
  max: number | null;
};

/** Baca nama skala dari berbagai nama field yang dipakai backend. */
function readSizeName(o: any): string {
  return String(o?.size_name ?? o?.nama ?? o?.company_size ?? o?.name ?? "").trim();
}

/** Baca batas bawah skala; null berarti field tidak ada di respons. */
function readSizeMin(o: any): number | null {
  const raw = o?.min_employees ?? o?.start ?? o?.min;
  if (raw === null || raw === undefined || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Baca batas atas skala; null berarti field tidak ada di respons. */
function readSizeMax(o: any): number | null {
  const raw = o?.max_employees ?? o?.end ?? o?.max;
  if (raw === null || raw === undefined || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Ambil record skala yang SESUAI dengan id yang diklik di tabel.
 *
 * Backend bisa membalas dalam beberapa bentuk: objek tunggal, daftar, atau
 * dibungkus `data`. Selain itu nama field-nya bisa berbeda-beda, jadi semua
 * varian dikumpulkan lalu dicocokkan berdasarkan `id`. Kalau responsnya berupa
 * DAFTAR, kecocokan id diwajibkan supaya tidak salah ambil record lain.
 */
function pickCompanySize(json: any, id: number): SkalaRecord | null {
  const objects: any[] = [];
  let sawList = false;

  const collect = (value: any) => {
    if (Array.isArray(value)) {
      sawList = true;
      objects.push(...value.filter((o) => o && typeof o === "object"));
    } else if (value && typeof value === "object") {
      objects.push(value);
    }
  };

  collect(json?.data);
  collect(json?.data?.data);
  collect(json);

  const named = objects.filter((o) => readSizeName(o) !== "");
  if (named.length === 0) return null;

  const byId = named.find(
    (o) => Number(o?.id ?? o?.company_size_id ?? o?.companySizeId) === id,
  );
  if (byId) {
    return { name: readSizeName(byId), min: readSizeMin(byId), max: readSizeMax(byId) };
  }

  // Respons daftar tanpa id yang cocok: jangan nebak, biarkan caller fallback.
  if (sawList) return null;

  const single = named[0];
  return { name: readSizeName(single), min: readSizeMin(single), max: readSizeMax(single) };
}

function EditSkalaPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  // Kosongkan form, JANGAN isi default: nilai default akan disalahartikan
  // sebagai data record yang sedang diedit.
  const [kategori, setKategori] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data skala berdasarkan id agar form sesuai dengan data yang diklik.
  useEffect(() => {
    const fetchSkala = async () => {
      // Reset dulu supaya data record sebelumnya tidak bocor ke form ini.
      setKategori("");
      setRangeStart("");
      setRangeEnd("");
      setError(null);

      if (!id) {
        setError("ID skala tidak ditemukan.");
        setLoading(false);
        return;
      }
      setLoading(true);

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

      // Endpoint detail (admin lalu public), lalu daftar sebagai jaring pengaman.
      const attempts = [
        `${COMPANY_SIZES_ADMIN_API_URL}/${id}`,
        `${COMPANY_SIZES_API_URL}/${id}`,
        COMPANY_SIZES_API_URL,
      ];

      try {
        let record: SkalaRecord | null = null;

        for (const url of attempts) {
          try {
            const json = await tryFetch(url);
            record = pickCompanySize(json, id);
            if (record) break;
          } catch {
            // Coba endpoint berikutnya.
          }
        }

        if (!record) {
          throw new Error(`Data skala dengan id ${id} tidak ditemukan.`);
        }

        setKategori(record.name);
        setRangeStart(record.min === null ? "" : String(record.min));
        setRangeEnd(record.max === null ? "" : String(record.max));
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

    // Number("") bernilai 0, jadi validasi manual agar tidak terkirim diam-diam.
    if (!kategori.trim()) {
      setError("Kategori skala wajib diisi.");
      return;
    }
    if (rangeStart.trim() === "" || !Number.isFinite(Number(rangeStart))) {
      setError("Range Start wajib diisi dengan angka.");
      return;
    }
    if (rangeEnd.trim() === "" || !Number.isFinite(Number(rangeEnd))) {
      setError("Range End wajib diisi dengan angka.");
      return;
    }
    if (Number(rangeStart) > Number(rangeEnd)) {
      setError("Range Start tidak boleh lebih besar dari Range End.");
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
          size_name: kategori.trim(),
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

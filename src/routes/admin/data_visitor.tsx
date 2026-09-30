import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { pageWindow } from "@/lib/pagination";
import { apiUrl, authHeaders } from "@/lib/api";
import { isRecord } from "@/lib/json";

export const Route = createFileRoute("/admin/data_visitor")({
  head: () => ({
    meta: [{ title: "Data Visitor · PTSA-KEMNAKER" }],
  }),
  component: DataVisitorPage,
});

// Endpoint ini berisi daftar PELAPOR (bukan catatan kunjungan pengunjung),
// jadi kolom tabel mengikuti field yang benar-benar dikirim backend.
const COMPLAINANTS_API_URL = apiUrl("v1/complainants");

const ITEMS_PER_PAGE = 10;
const PER_PAGE = 100;

interface ComplainantItem {
  id: number;
  namaLengkap: string;
  nik: string;
  alamat: string;
  jenisKelamin: string;
  jabatan: string;
  noTelp: string;
  email: string;
  tanggal: string;
}

function toComplainant(raw: unknown): ComplainantItem | null {
  if (!isRecord(raw)) return null;
  const id = Number(raw["id"]);
  if (!Number.isFinite(id)) return null;

  const text = (value: unknown) => (value == null ? "" : String(value));

  return {
    id,
    namaLengkap: text(raw["nama_lengkap"]),
    nik: text(raw["nik"]),
    alamat: text(raw["alamat"]),
    jenisKelamin: text(raw["jenis_kelamin"]),
    jabatan: text(raw["jabatan"]),
    noTelp: text(raw["no_telp"]),
    email: text(raw["email"]),
    tanggal: formatTanggal(text(raw["created_at"])),
  };
}

/** "2026-09-24T02:10:08.000000Z" -> "24 Sep 2026, 09:10" (waktu lokal). */
function formatTanggal(raw: string): string {
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Ambil array pelapor dari respons `v1/complainants`.
 * Bentuknya paginate di dalam `data`: `{ success, data: { current_page, data: [...] } }`.
 */
function extractComplainants(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (!isRecord(json)) return [];

  const data = json["data"];
  if (Array.isArray(data)) return data;
  if (isRecord(data) && Array.isArray(data["data"])) return data["data"];

  return [];
}

function readTotalPages(json: unknown): number {
  if (!isRecord(json)) return 1;
  const data = json["data"];
  if (!isRecord(data)) return 1;
  return Number(data["last_page"] ?? 1) || 1;
}

async function fetchAllComplainants(): Promise<ComplainantItem[]> {
  const first = await fetch(`${COMPLAINANTS_API_URL}?page=1&per_page=${PER_PAGE}`, {
    headers: authHeaders(),
  });

  if (!first.ok) {
    throw new Error(`Gagal memuat data pelapor (HTTP ${first.status}).`);
  }

  const firstJson: unknown = await first.json();
  const list = [...extractComplainants(firstJson)];

  const lastPage = readTotalPages(firstJson);
  if (lastPage > 1) {
    const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
    const results = await Promise.all(
      pages.map((page) =>
        fetch(`${COMPLAINANTS_API_URL}?page=${page}&per_page=${PER_PAGE}`, {
          headers: authHeaders(),
        })
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null),
      ),
    );
    results.forEach((json) => {
      if (json) list.push(...extractComplainants(json));
    });
  }

  return list
    .map(toComplainant)
    .filter((item): item is ComplainantItem => item !== null);
}

function DataVisitorPage() {
  const [rows, setRows] = useState<ComplainantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;

    fetchAllComplainants()
      .then((data) => {
        if (alive) setRows(data);
      })
      .catch((err) => {
        console.error("[data_visitor] Gagal memuat data pelapor:", err);
        if (alive) {
          setRows([]);
          setError(err?.message || "Gagal memuat data pelapor.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((item) =>
      [item.namaLengkap, item.nik, item.alamat, item.jenisKelamin, item.jabatan, item.noTelp, item.email]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <AppShell title="Data Visitor" breadcrumb="Data Visitor">
      <div className="space-y-5">
        {/* Judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Data Visitor</h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Data pelapor yang mengisi formulir pengaduan.
          </p>
        </div>

        <div className="px-1">
          {loading && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Memuat data pelapor...
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-gray-500">
            Menampilkan {displayed.length ? (page - 1) * ITEMS_PER_PAGE + 1 : 0} to{" "}
            {(page - 1) * ITEMS_PER_PAGE + displayed.length} dari {filtered.length} data
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari pelapor…"
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
                  <th className="px-5 py-3.5">Nama Lengkap</th>
                  <th className="px-5 py-3.5">NIK</th>
                  <th className="px-5 py-3.5">Jenis Kelamin</th>
                  <th className="px-5 py-3.5">Jabatan</th>
                  <th className="px-5 py-3.5">No. Telp</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Alamat</th>
                  <th className="px-5 py-3.5">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {!loading && displayed.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-gray-400">
                      Belum ada data pelapor.
                    </td>
                  </tr>
                ) : (
                  displayed.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{item.namaLengkap}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.nik}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.jenisKelamin}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.jabatan}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.noTelp}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.email}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.alamat}</td>
                      <td className="px-5 py-3.5 text-gray-700">{item.tanggal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end px-1">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </AppShell>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40"
      >
        ‹
      </button>
      {pageWindow(page, totalPages).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors ${
            page === p ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}

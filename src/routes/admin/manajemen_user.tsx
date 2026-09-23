import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2, UserPlus } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";
import { useTableExport } from "@/lib/export-utils";

export const Route = createFileRoute("/admin/manajemen_user")({
  head: () => ({
    meta: [{ title: "Manajemen User · PTSA-KEMNAKER" }],
  }),
  component: ManajemenUserPage,
});

interface UserItem {
  id: number;
  nama: string;
  email: string;
  role: string;
}

// TODO(backend): ganti dengan data dari API user.
const INITIAL_DATA: UserItem[] = [
  { id: 1, nama: "Budi Santoso", email: "budi.santoso@kemnaker.go.id", role: "Super Admin" },
  { id: 2, nama: "Siti Aisyah", email: "siti.aisyah@kemnaker.go.id", role: "Admin" },
  { id: 3, nama: "Agus Wijaya", email: "agus.wijaya@kemnaker.go.id", role: "Admin" },
];

const USERS_API_URL = apiUrl("users");

const ITEMS_PER_PAGE = 10;

const ROLE_STYLE: Record<string, string> = {
  "Super Admin": "bg-purple-50 text-purple-600",
  "Admin": "bg-blue-50 text-blue-600",
};

function ManajemenUserPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<UserItem[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Ambil daftar user dari API: GET /api/users.
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(USERS_API_URL, {
          method: "GET",
          headers: authHeaders(),
        });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const json = await res.json();
        const list: any[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.users)
              ? json.users
              : [];

        if (list.length === 0) return;

        setRows(
          list.map((item) => {
            const role =
              typeof item.role === "object" && item.role !== null
                ? String(item.role.name ?? item.role.role ?? "")
                : String(item.role ?? item.role_name ?? "");
            return {
              id: Number(item.id),
              nama: String(item.username ?? item.name ?? item.nama ?? ""),
              email: String(item.email ?? ""),
              role: role || "Pengawas",
            };
          }),
        );
      } catch (err) {
        console.error("Gagal memuat daftar user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.nama.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const buildExport = useMemo(() => {
    const headers = ["NO", "NAMA", "EMAIL", "ROLE"];
    const rows: (string | number)[][] = filtered.map((item, index) => [
      index + 1,
      item.nama,
      item.email,
      item.role,
    ]);
    return { headers, rows };
  }, [filtered]);

  const { copied, handleCopy, handleCsv, handleExcel, handlePdf, handlePrint } = useTableExport({
    baseName: "Manajemen_User",
    headers: buildExport.headers,
    rows: buildExport.rows,
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus user ini?")) return;
    try {
      const response = await fetch(`${USERS_API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.message || `Gagal menghapus (${response.status}).`);
      }
      window.location.reload();
    } catch (err: any) {
      console.error("Gagal menghapus user:", err);
      alert(err?.message || "Gagal menghapus user. Coba lagi.");
    }
  };

  return (
    <AppShell title="Manajemen User" breadcrumb="Manajemen User">
      <div className="space-y-5">
        {/* Judul + tombol tambah */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Manajemen User</h1>
            <p className="mt-1 text-[12px] text-gray-500">
              Kelola akun pengguna, peran, dan akses sistem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/tambah_user" })}
            className="inline-flex items-center gap-2 rounded-lg bg-[#016A61] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d]"
          >
            <UserPlus className="h-4 w-4" />
            Tambah User
          </button>
        </div>

        {/* Toolbar */}
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
            placeholder="Cari user…"
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
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="w-28 px-5 py-3.5 text-right">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[12px]">
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                      {loading ? "Memuat data user..." : "Tidak ada data user."}
                    </td>
                  </tr>
                ) : (
                  displayed.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600">
                            {item.nama
                              .split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-800">{item.nama}</p>
                            <p className="truncate text-[11px] text-gray-500">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            ROLE_STYLE[item.role] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              navigate({
                                to: "/admin/edit_user",
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

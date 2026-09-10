import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Save } from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin/tambah_user")({
  head: () => ({
    meta: [{ title: "Tambah User Baru · PTSA-KEMNAKER" }],
  }),
  component: TambahUserPage,
});

const ROLE_OPTIONS = ["Administrator", "Pengawas", "Petugas"];

function TambahUserPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO(backend): POST /api/users dengan { nama, email, password, role }.
      await new Promise((r) => setTimeout(r, 400));
      navigate({ to: "/admin/manajemen_user" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Tambah User Baru" breadcrumb="Tambah User">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h2 className="text-[15px] font-bold text-gray-800">Tambah User Baru</h2>
        <p className="mt-1 mb-6 text-[12px] text-gray-500">
          Lengkapi form di bawah ini untuk menambahkan pengguna baru ke dalam sistem PTSA.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">
              Nama User
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@kemnaker.go.id"
              className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">
              Role Akses
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none rounded-full border border-gray-300 px-4 py-2.5 pr-9 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                ▼
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/manajemen_user" })}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#016A61] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Menyimpan…" : "Simpan User"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

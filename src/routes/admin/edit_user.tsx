import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Save, Eye, EyeOff } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { apiUrl, authHeaders } from "@/lib/api";

export const Route = createFileRoute("/admin/edit_user")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search["id"] ? Number(search["id"]) : undefined,
  }),
  head: () => ({
    meta: [{ title: "Edit User · PTSA-KEMNAKER" }],
  }),
  component: EditUserPage,
});

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
];
const USERS_API_URL = apiUrl("users");

/** Petakan role lama (Pelapor/Pengawas/Petugas/Administrator) ke role baru. */
function normalizeRole(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (key === "super_admin" || key === "administrator") return "super_admin";
  if (key === "admin") return "admin";
  return "admin";
}

function EditUserPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Ambil data user berdasarkan id: GET /api/users/{id}.
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`${USERS_API_URL}/${id}`, {
          method: "GET",
          headers: authHeaders(),
        });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const json = await res.json();
        const item = json?.data ?? json?.user ?? json;

        setNama(String(item.username ?? item.name ?? item.nama ?? ""));
        setEmail(String(item.email ?? ""));
        const rawRole =
          typeof item.role === "object" && item.role !== null
            ? String(item.role.name ?? item.role.role ?? "")
            : String(item.role ?? item.role_name ?? "");
        if (rawRole) setRole(normalizeRole(rawRole));
      } catch (err) {
        console.error("Gagal memuat data user:", err);
        setErrorMessage("Gagal memuat data user. Silakan kembali dan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setErrorMessage("ID user tidak ditemukan.");
      return;
    }
    setErrorMessage(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        username: nama,
        email: email,
        role: role,
      };
      if (password.trim()) body["password"] = password;

      const response = await fetch(`${USERS_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(body),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        let errMsg = "";
        const errors = result?.errors;
        if (errors && typeof errors === "object") {
          Object.values(errors).forEach((val) => {
            const txt = Array.isArray(val) ? val.join(", ") : String(val ?? "");
            if (txt) errMsg += `${txt}. `;
          });
        }
        throw new Error(
          errMsg.trim() || result?.message || `Gagal memperbarui user (${response.status}).`,
        );
      }

      alert("User berhasil diperbarui!");
      navigate({ to: "/admin/manajemen_user" });
    } catch (err: any) {
      console.error("Perbarui user gagal:", err);
      setErrorMessage(err?.message || "Gagal memperbarui user. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Edit User" breadcrumb="Edit User">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h2 className="text-[15px] font-bold text-gray-800">Edit User</h2>
        <p className="mt-1 mb-6 text-[12px] text-gray-500">
          Perbarui informasi akun pengguna. Kosongkan password bila tidak ingin mengubahnya.
        </p>

        {loading && <p className="mb-4 text-xs text-gray-400">Memuat data user...</p>}

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">Nama User</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">Ganti Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan bila tidak diubah"
                className="w-full rounded-full border border-gray-300 py-2.5 pl-4 pr-12 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-4 text-gray-500 hover:text-[#016A61] focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="size-5 stroke-[1.75]" />
                ) : (
                  <Eye className="size-5 stroke-[1.75]" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">Role Akses</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none rounded-full border border-gray-300 px-4 py-2.5 pr-9 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
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
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

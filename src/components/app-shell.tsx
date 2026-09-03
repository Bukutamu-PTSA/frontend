import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Network,
  AlertCircle,
  FileText,
  BarChart2,
  Eye,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { useState, type ReactNode } from "react";

// Pastikan aset logo sesuai di foldermu
import logokemnaker from "@/assets/kemnaker_logo.png";

const BASE_API_URL = "http://192.168.147.199:8000/api/v1/auth";

// Definisi menu sidebar presisi (tanpa prefix liar yang bikin bentrok)
const sidebarNav = [
  {
    to: "/admin/dashboard",
    icon: Home,
    name: "Beranda",
    exactPaths: ["/admin/dashboard", "/dashboard", "/admin"],
  },
  {
    to: "/admin/kategori_pelayanan",
    icon: Network,
    name: "Pelayanan",
    exactPaths: ["/admin/kategori_pelayanan", "/admin/pelayanan"],
  },
  {
    to: "/admin/reportpengaduan",
    icon: AlertCircle,
    name: "Report Pengaduan",
    exactPaths: ["/admin/reportpengaduan", "/admin/reportpengaduan"],
  },
  {
    to: "/survei",
    icon: FileText,
    name: "Report Survei",
    exactPaths: ["/survei", "/admin/survei"],
  },
  {
  to: "/admin/grafik",
  icon: BarChart2,
  name: "Grafik & Statistik",
  exactPaths: ["/admin/grafik"],
  },
  {
    to: "/admin/dashboard",
    icon: Settings,
    name: "Pengaturan",
    exactPaths: ["/setting", "/admin/pengaturan"],
  },
];

export function AppShell({
  children,
}: {
  children: ReactNode;
  title?: string;
  breadcrumb?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = async () => {
    setLoggingOut(true);
    const token =
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    try {
      if (token) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        await fetch(`${BASE_API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      }
    } catch (err) {
      console.warn("Logout notice:", err);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-[#1E293B]">
      {/* Backdrop Mobile */}
      {mobileOpen && (
        <button
          aria-label="Tutup Navigasi"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-[218px] flex-col bg-[#0F2137] text-white transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header Logo PTSA Kemnaker (Kotak Putih Atas) */}
        <div className="flex h-16 items-center gap-3 bg-white px-4 border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex h-9 w-9 items-center justify-center shrink-0">
            <img
              src={logokemnaker}
              alt="Logo PTSA Kemnaker"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-[13px] font-black tracking-tight text-[#0B3968] leading-none uppercase">
              PTSA KEMNAKER
            </h1>
            <p className="text-[8px] font-medium tracking-wider text-gray-500 uppercase mt-0.5">
              PELAYANAN TERPADU
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profil User (Ikko - Petugas Pelayanan) */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-slate-600 border border-white/20 overflow-hidden flex items-center justify-center text-xs font-semibold text-white">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Ikko"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span>IK</span>
            </div>
            {/* Dot Status Online Hijau */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0F2137]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-white truncate">Ikko</p>
            <p className="text-[9px] text-gray-400 truncate">Petugas Pelayanan</p>
          </div>
        </div>

        {/* Menu Navigasi Samping */}
        <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
          {sidebarNav.map((item) => {
            // Evaluasi path persis agar tidak tumpang tindih
            const isActive = item.exactPaths.some((p) => {
              if (p === "/admin" || p === "/admin/dashboard" || p === "/dashboard") {
                return (
                  pathname === "/admin" ||
                  pathname === "/admin/dashboard" ||
                  pathname === "/dashboard"
                );
              }
              return pathname === p || pathname.startsWith(p + "/");
            });

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] font-medium transition-colors
                  ${
                    isActive
                      ? "bg-[#007A64] text-white shadow-xs font-semibold"
                      : "text-gray-300/80 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout / Keluar Sistem di Bawah */}
        <div className="p-3 border-t border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] font-medium text-gray-300/80 transition-colors hover:bg-white/5 hover:text-red-400 cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <LogOut className="h-4 w-4 text-gray-400" />
            )}
            <span>{loggingOut ? "Keluar..." : "Keluar Sistem"}</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 lg:pl-[218px] flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-gray-600 lg:hidden mr-3 p-1"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar Tengah (Pill Shape) */}
          <div className="flex-1 flex justify-center max-w-xl mx-auto">
            <div className="relative w-full max-w-[340px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Bar (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-[#EEF2F6] pl-9 pr-4 py-1.5 text-[10px] text-gray-700 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#007A64]"
              />
            </div>
          </div>

          {/* Lonceng Notifikasi */}
          <button
            type="button"
            className="relative p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        {/* Isi Halaman */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
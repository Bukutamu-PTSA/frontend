import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Network,
  AlertCircle,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

import { cn } from "@/lib/utils";
// Pastikan aset logo sesuai di foldermu
import logokemnaker from "@/assets/kemnaker_logo.png";
import { AUTH_BASE_URL as BASE_API_URL } from "@/lib/api";
import { clearSession, isSuperAdminOnlyPath, normalizeRole, readStoredUser, type AuthUser } from "@/lib/auth";
import { fetchNotifications } from "@/lib/notifications";

/** Inisial dari nama untuk fallback avatar (mis. "Budi Santoso" -> "BS"). */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return "?";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1] ?? first;
  return ((first[0] ?? "") + (last[0] ?? "")).toUpperCase();
}

interface NavItem {
  to: string;
  icon: LucideIcon;
  name: string;
  /** Path yang dianggap aktif untuk item ini. */
  exactPaths: string[];
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// Definisi menu sidebar presisi (tanpa prefix liar yang bikin bentrok)
const nav: NavGroup[] = [
  {
    label: "Utama",
    items: [
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
        to: "/admin/reportsurvei",
        icon: FileText,
        name: "Report Survei",
        exactPaths: ["/admin/reportsurvei", "/admin/survei"],
      },
    ],
  },
  {
    label: "Chart & Pie",
    items: [
      {
        to: "/admin/grafik",
        icon: BarChart2,
        name: "Grafik & Statistik",
        exactPaths: ["/admin/grafik"],
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        to: "/admin/setting",
        icon: Settings,
        name: "Pengaturan",
        exactPaths: ["/admin/setting", "/admin/pengaturan"],
      },
    ],
  },
];

export function AppShell({
  title = "Dashboard",
  breadcrumb = "Dashboard",
  children,
}: {
  children: ReactNode;
  title?: string;
  breadcrumb?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  // null selama SSR/belum mount, lalu diisi role sebenarnya.
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Baca user yang login setelah mount (menghindari mismatch SSR/hydration).
  useEffect(() => {
    const user = readStoredUser();
    setAuthUser(user);
    setIsSuperAdmin(user !== null && normalizeRole(user.role) === "super_admin");
  }, []);

  // Hitung ulang notifikasi belum dibaca setiap kali berpindah halaman,
  // sehingga badge lonceng selalu sinkron dengan halaman Pusat Notifikasi.
  useEffect(() => {
    let alive = true;
    const loadUnread = async () => {
      try {
        const items = await fetchNotifications(20);
        if (alive) {
          setUnreadNotifications(items.filter((n) => !n.read && !n.dismissed).length);
        }
      } catch {
        if (alive) setUnreadNotifications(0);
      }
    };
    loadUnread();
    return () => {
      alive = false;
    };
  }, [pathname]);

  const displayName = authUser?.name ?? "Pengguna";
  const displayRole = authUser?.role ?? "Petugas";
  const avatarUrl = authUser?.avatar ?? "";

  const isActive = (item: NavItem) =>
    item.exactPaths.some((p) => {
      if (p === "/admin" || p === "/admin/dashboard" || p === "/dashboard") {
        return (
          pathname === "/admin" || pathname === "/admin/dashboard" || pathname === "/dashboard"
        );
      }
      return pathname === p || pathname.startsWith(p + "/");
    });

  const handleLogout = async () => {
    setLoggingOut(true);
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

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
      clearSession();
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop Mobile */}
      {mobileOpen && (
        <button
          aria-label="Tutup menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#0D2B4C] text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header Logo PTSA Kemnaker (Kotak Putih Atas) */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border bg-white px-5">
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
            <img src={logokemnaker} alt="Logo PTSA Kemnaker" className="h-8 w-8 object-contain" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-[13px] font-bold leading-tight text-[#13416B]">
              PTSA KEMNAKER
            </p>
            <p className="truncate text-[9px] uppercase tracking-wider text-[#333333]/70">
              PELAYANAN TERPADU
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-[#333333]/70 hover:bg-black/5 lg:hidden"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profil user */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-600 text-[11px] font-semibold text-white">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Bila gambar gagal dimuat, sembunyikan dan biarkan inisial di bawahnya tampil.
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span>{getInitials(displayName)}</span>
                )}
              </div>
              {/* Dot Status Online Hijau */}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0D2B4C]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-white">{displayName}</p>
              <p className="truncate text-[10px] text-sidebar-foreground/60">{displayRole}</p>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Samping */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
          {nav.map((group) => {
            // Sembunyikan grup yang isinya seluruhnya khusus super admin, dan
            // sembunyikan item terkunci dari grup campuran. Guard route tetap
            // tetap jadi pengaman kalau URL diketik langsung.
            const visibleItems = group.items.filter(
              (item) => isSuperAdmin || !isSuperAdminOnlyPath(item.to),
            );
            if (visibleItems.length === 0) return null;

            return (
            <div key={group.label}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40">
                {group.label}
              </p>
              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 rounded-sm px-3 py-2 text-[12px] font-medium transition-colors",
                          active
                            ? "bg-[#016A61] text-[#FACC15]"
                            : "text-sidebar-foreground/80 hover:bg-[#016a6168] hover:text-white",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-[#FACC15]" : "text-sidebar-foreground/60",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{item.name}</span>
                        {item.badge && (
                          <span className="shrink-0 rounded-full bg-sidebar-primary/25 px-2 py-0.5 text-[9px] font-semibold text-sidebar-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/20 hover:text-white disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            {loggingOut ? "Keluar…" : "Logout"}
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-border bg-surface p-1.5 text-muted-foreground shadow-soft lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                Home <ChevronRight className="inline h-3 w-3" /> {breadcrumb}
              </p>
              <h1 className="truncate text-[16px] font-semibold leading-tight">{title}</h1>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Link
                to="/admin/notifications"
                aria-label="Notifikasi"
                className="relative grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-border bg-surface text-muted-foreground shadow-soft transition-colors hover:text-primary"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Isi Halaman */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="grid gap-2 border-t border-border px-4 py-5 text-[11px] text-muted-foreground sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            BINWASNAKER © 2024–2026 <span className="font-semibold text-primary">TUBSPK.</span>{" "}
            BINSIS
          </p>
          <p>Bangga Melayani Bangsa · BerAKHLAK</p>
        </footer>
      </div>
    </div>
  );
}

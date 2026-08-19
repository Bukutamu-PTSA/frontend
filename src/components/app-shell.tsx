import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Monitor,
  PieChart,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const nav = [
  {
    label: "Utama",
    items: [
      { to: "/", icon: Home, name: "Beranda", match: "/" },
      { to: "/pengaduan", icon: Monitor, name: "Report Pengaduan", badge: "10", match: "/pengaduan" },
      { to: "/survei", icon: Users, name: "Report Survei", match: "/survei" },
    ],
  },
  {
    label: "Chart & Pie",
    items: [
      { to: "/", icon: BarChart3, name: "Grafik", match: null },
      { to: "/", icon: PieChart, name: "Pie", match: null },
    ],
  },
  {
    label: "Tools",
    items: [
      { to: "/chat", icon: MessageSquare, name: "Chat", match: null },
      { to: "/setting", icon: Settings, name: "Setting", badge: "New", match: "/setting" },
    ],
  },
];

export function AppShell({
  title,
  breadcrumb,
  children,
}: {
  title: string;
  breadcrumb: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      {open && (
        <button
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ backgroundImage: "var(--gradient-sidebar)" }}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-primary-foreground">
            PT
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-sidebar-accent-foreground">
              PTSA-KEMNAKER
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">Layanan Pengaduan</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent/60 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-warning/20 text-xs font-semibold text-warning">
              IK
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-accent-foreground">ikko</p>
              <p className="truncate text-xs text-sidebar-foreground/60">Administrator</p>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-xl bg-sidebar-accent/40 px-3 py-2 focus-within:ring-2 focus-within:ring-sidebar-ring">
            <Search className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
            <input
              placeholder="Cari menu…"
              className="w-full min-w-0 bg-transparent text-sm text-sidebar-accent-foreground placeholder:text-sidebar-foreground/40 focus:outline-none"
            />
          </label>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {nav.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = item.match !== null && pathname === item.match;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-sidebar-primary/20 text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-sidebar-primary" : "text-sidebar-foreground/60",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{item.name}</span>
                        {item.badge && (
                          <span className="shrink-0 rounded-full bg-sidebar-primary/25 px-2 py-0.5 text-[10px] font-semibold text-sidebar-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-destructive/20 hover:text-sidebar-accent-foreground">
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl border border-border bg-surface p-2 text-muted-foreground shadow-soft lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-xs text-muted-foreground sm:block">
                Home <ChevronRight className="inline h-3 w-3" /> {breadcrumb}
              </p>
              <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="hidden rounded-xl border border-border bg-surface p-2 text-muted-foreground shadow-soft transition-colors hover:text-primary sm:block">
                <Search className="h-4 w-4" />
              </button>
              <span className="rounded-xl bg-accent px-3 py-2 text-xs font-medium text-accent-foreground">
                v1.0.0
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="grid gap-2 border-t border-border px-4 py-6 text-xs text-muted-foreground sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
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
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BellOff,
  CheckCheck,
  Loader2,
  RefreshCw,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { fetchNotifications, type NotificationItem } from "@/lib/notifications";
import { dismissNotif, markAllNotifRead, markNotifRead } from "@/lib/notification-status";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [{ title: "Pusat Notifikasi - PTSA KEMNAKER" }],
  }),
  component: NotificationsPage,
});

type FilterTab = "semua" | "belum";

function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<FilterTab>("semua");
  const [search, setSearch] = useState("");
  const [openActions, setOpenActions] = useState<number | string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const items = await fetchNotifications(50);
      setNotifications(items);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat notifikasi.";
      console.error("Gagal mengambil notifikasi:", err);
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    let list = notifications.filter((n) => !n.dismissed);
    if (tab === "belum") list = list.filter((n) => !n.read);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.ticket.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [notifications, tab, search]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read && !n.dismissed).length,
    [notifications],
  );

  const activeCount = useMemo(
    () => notifications.filter((n) => !n.dismissed).length,
    [notifications],
  );

  const handleOpen = (item: NotificationItem) => {
    if (!item.read) {
      markNotifRead([item.id]);
      setNotifications((prev) =>
        prev.map((n) => (String(n.id) === String(item.id) ? { ...n, read: true } : n)),
      );
    }
    navigate({ to: "/admin/detail_berkas", search: { id: String(item.id) } });
  };

  const handleMarkAllRead = () => {
    const unread = notifications.filter((n) => !n.read && !n.dismissed);
    if (unread.length === 0) return;
    markAllNotifRead(unread);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = (item: NotificationItem) => {
    dismissNotif([item.id]);
    setOpenActions(null);
    setNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(item.id) ? { ...n, dismissed: true } : n)),
    );
  };

  const handleDismissAll = () => {
    if (visible.length === 0) return;
    if (!window.confirm(`Hapus ${visible.length} notifikasi di daftar ini?`)) return;
    dismissNotif(visible.map((n) => n.id));
    setOpenActions(null);
    setNotifications((prev) =>
      prev.map((n) =>
        visible.some((v) => String(v.id) === String(n.id)) ? { ...n, dismissed: true } : n,
      ),
    );
  };

  return (
    <AppShell title="Notifications" breadcrumb="Notifikasi">
      <div className="space-y-5">
        {/* Header panel */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[16px] font-bold tracking-tight text-gray-800">
                Pusat Notifikasi
              </h1>
              <p className="mt-1 text-[12px] text-gray-500">
                {unreadCount > 0
                  ? `Anda memiliki ${unreadCount} laporan baru yang belum ditinjau.`
                  : "Tidak ada laporan baru. Semua sudah ditinjau."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[11px] font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span>Muat Ulang</span>
              </button>
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#016A61] px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-[#015850] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Tandai Semua Dibaca</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setTab("semua")}
              className={`rounded-md px-4 py-1.5 text-[11px] font-semibold transition-colors ${
                tab === "semua" ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Semua ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setTab("belum")}
              className={`rounded-md px-4 py-1.5 text-[11px] font-semibold transition-colors ${
                tab === "belum" ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          <label className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 shadow-xs sm:w-72">
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari notifikasi…"
              className="w-full min-w-0 bg-transparent text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </label>
        </div>

        {/* Error */}
        {loadError && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-2 text-[11px] text-red-700">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Gagal mengambil data dari server: <span className="font-semibold">{loadError}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              Coba Lagi
            </button>
          </div>
        )}

        {/* Notification list */}
        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-14 text-center">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-gray-300" />
              <p className="mt-3 text-[12px] text-gray-400">Memuat notifikasi…</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-14 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
              <BellOff className="mx-auto h-6 w-6 text-gray-300" />
              <p className="mt-3 text-[12px] text-gray-400">
                {notifications.length === 0
                  ? "Belum ada notifikasi."
                  : tab === "belum"
                    ? "Tidak ada notifikasi yang belum dibaca."
                    : "Tidak ada notifikasi yang cocok dengan pencarian."}
              </p>
            </div>
          ) : (
            visible.map((item) => (
              <article
                key={item.id}
                className={`relative flex items-start gap-3.5 rounded-xl border bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all hover:shadow-md ${
                  item.read ? "border-gray-100" : "border-[#016A6118] ring-1 ring-[#016A6122]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleOpen(item)}
                  className="flex flex-1 items-start gap-3.5 text-left"
                >
                  {/* Icon */}
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                      item.read ? "bg-gray-50 text-gray-400" : "bg-red-50 text-red-500"
                    }`}
                  >
                    <AlertCircle className="h-4.5 w-4.5" />
                  </span>

                  {/* Body */}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <h2
                          className={`text-[13px] ${
                            item.read ? "font-semibold text-gray-600" : "font-bold text-gray-800"
                          }`}
                        >
                          {item.title}
                        </h2>
                        {!item.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        )}
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[10px] text-gray-400">
                        {item.time}
                      </span>
                    </span>

                    <span
                      className={`mt-1 block text-[11px] leading-relaxed ${
                        item.read ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </span>

                    <span className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#EEF2F6] px-2.5 py-1 text-[10px] font-medium text-gray-600">
                        No. Tiket: {item.ticket}
                      </span>
                      <span className="rounded-md bg-[#EEF2F6] px-2.5 py-1 text-[10px] font-medium text-gray-600">
                        Kategori: {item.category}
                      </span>
                    </span>
                  </span>
                </button>

                {/* Dismiss */}
                {openActions === item.id ? (
                  <div className="absolute right-3 top-12 z-10 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => handleDismiss(item)}
                      className="rounded-md px-3 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenActions(null)}
                      className="rounded-md px-3 py-1.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label="Aksi notifikasi"
                    onClick={() => setOpenActions((cur) => (cur === item.id ? null : item.id))}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </article>
            ))
          )}
        </div>

        {/* Footer actions on list */}
        {!loading && visible.length > 0 && (
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleDismissAll}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[11px] font-semibold text-gray-600 shadow-xs transition-colors hover:bg-gray-50"
            >
              Hapus Semua di List Ini
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

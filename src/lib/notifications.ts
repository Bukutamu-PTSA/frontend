/**
 * Lapisan data notifikasi.
 *
 * Sumber: endpoint notifikasi backend.
 *   GET   /api/v1/dashboard/notifications?limit=1-50 (default 10)
 *   PATCH /api/v1/dashboard/notifications/{complaint}/read
 *
 * Status "sudah dibaca" (is_read) berasal dari backend, bukan localStorage.
 * Status "dismissed" (sembunyikan dari daftar) tetap lokal karena backend
 * belum menyediakannya, lihat `./notification-status`.
 */
import { apiUrl, authHeaders } from "@/lib/api";
import { isRecord } from "@/lib/json";
import { loadNotifStatus, type NotifStatus } from "@/lib/notification-status";

export interface NotificationItem {
  /** complaint_id dari backend (dipakai juga untuk PATCH read). */
  id: string;
  title: string;
  description: string;
  ticket: string;
  category: string;
  time: string;
  createdAt: string;
  read: boolean;
  dismissed: boolean;
}

export const NOTIFICATIONS_PATH = "v1/dashboard/notifications";

type RawNotification = {
  complaint_id?: unknown;
  ticket_number?: unknown;
  category?: unknown;
  complainant_name?: unknown;
  company?: unknown;
  is_read?: unknown;
  created_at?: unknown;
  [key: string]: unknown;
};

/** Parser tanggal tangguh: ISO (termasuk UTC/Z), "YYYY-MM-DD", atau "DD/MM/YYYY". */
function parseDate(value: string | null | undefined): Date | null {
  const text = String(value ?? "").trim();
  if (!text) return null;

  if (/Z$|[+-]\d{2}:?\d{2}$/.test(text)) {
    const d = new Date(text);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (iso) {
    return new Date(
      Number(iso[1]),
      Number(iso[2]) - 1,
      Number(iso[3]),
      Number(iso[4]),
      Number(iso[5]),
      iso[6] ? Number(iso[6]) : 0,
    );
  }

  const dateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }

  const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmy) {
    return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function timeMs(value: string): number {
  return parseDate(value)?.getTime() ?? 0;
}

function timeAgo(value: string | null | undefined): string {
  const date = parseDate(value);
  if (!date) return "Baru saja";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "Baru saja";

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari yang lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu yang lalu`;
  if (days < 365) return `${Math.floor(days / 30)} bulan yang lalu`;
  return `${Math.floor(days / 365)} tahun yang lalu`;
}

function companyName(raw: RawNotification): string {
  const company = raw.company;
  if (typeof company === "string") return company;
  if (isRecord(company) && company["nama_perusahaan"] != null) {
    return String(company["nama_perusahaan"]);
  }
  return "";
}

function toNotification(raw: RawNotification, status: NotifStatus): NotificationItem {
  const id = String(raw.complaint_id ?? raw.ticket_number ?? Math.random().toString(36).slice(2));

  const complainant = raw.complainant_name != null ? String(raw.complainant_name) : "Pengunjung";
  const company = companyName(raw);
  const category = raw.category != null ? String(raw.category) : "Laporan";
  const createdAt = String(raw.created_at ?? "");

  return {
    id,
    title: "Aduan Baru",
    description: company
      ? `Terdapat laporan baru dari ${complainant} (${company}) yang perlu ditinjau.`
      : `Terdapat laporan baru dari ${complainant} yang perlu ditinjau.`,
    ticket: String(raw.ticket_number ?? "-"),
    category,
    time: timeAgo(createdAt),
    createdAt,
    // Backend adalah sumber kebenaran untuk "sudah dibaca".
    read: raw.is_read === true,
    // Dismissed masih lokal (belum ada di backend).
    dismissed: status.dismissed.has(id),
  };
}

/**
 * Ambil notifikasi aduan belum dibaca dari backend, terurut paling baru duluan.
 * @throws Error bila fetch gagal.
 */
export async function fetchNotifications(limit = 50): Promise<NotificationItem[]> {
  const safeLimit = Math.min(50, Math.max(1, Math.trunc(limit) || 10));
  const res = await fetch(`${apiUrl(NOTIFICATIONS_PATH)}?limit=${safeLimit}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Gagal memuat notifikasi (${res.status}).`);
  }

  const json: unknown = await res.json();
  const data = isRecord(json) && isRecord(json["data"]) ? json["data"] : json;
  const rawList = isRecord(data) && Array.isArray(data["notifications"]) ? data["notifications"] : [];
  const status = loadNotifStatus();

  return rawList
    .filter(isRecord)
    .map((raw) => toNotification(raw, status))
    .sort((a, b) => timeMs(b.createdAt) - timeMs(a.createdAt));
}

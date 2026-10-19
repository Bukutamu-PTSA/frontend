/**
 * Lapisan data notifikasi.
 *
 * Backend belum menyediakan endpoint notifikasi khusus, jadi notifikasi
 * diturunkan dari data pengaduan (GET /api/complaints) yang sudah ada:
 * setiap aduan baru direpresentasikan sebagai satu notifikasi "Aduan Baru".
 *
 * Status dibaca/diabaikan disimpan lokal, lihat `./notification-status`.
 */
import { apiUrl, authHeaders } from "@/lib/api";
import { extractList, isRecord } from "@/lib/json";
import { loadNotifStatus, type NotifStatus } from "@/lib/notification-status";

export interface NotificationItem {
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

type RawComplaint = {
  id?: unknown;
  ticket_number?: unknown;
  created_at?: unknown;
  complaint_date?: unknown;
  complainant?: unknown;
  company?: unknown;
  category?: unknown;
  [key: string]: unknown;
};

/** Parser tanggal tangguh: ISO (termasuk UTC/Z), "YYYY-MM-DD", atau "DD/MM/YYYY". */
function parseDate(value: string | null | undefined): Date | null {
  const text = String(value ?? "").trim();
  if (!text) return null;

  // ISO dengan timezone eksplisit (Z atau +HH:MM / -HH:MM) → biarkan Date
  // native yang handle UTC dengan benar.
  if (/Z$|[+-]\d{2}:?\d{2}$/.test(text)) {
    const d = new Date(text);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // ISO tanpa timezone → asumsikan lokal (perilaku lama).
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

function firstValue(source: unknown, keys: readonly string[]): string | undefined {
  if (!isRecord(source)) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (value != null) return String(value);
  }
  return undefined;
}

function toNotification(raw: RawComplaint, status: NotifStatus): NotificationItem {
  const id = String(raw.id ?? raw.ticket_number ?? Math.random().toString(36).slice(2));

  const complainantName =
    firstValue(raw.complainant, ["nama_lengkap", "nama"]) ??
    firstValue(raw, ["nama_pelapor"]) ??
    "Pengunjung";
  const companyName =
    firstValue(raw.company, ["nama_perusahaan"]) ?? firstValue(raw, ["nama_perusahaan"]) ?? "";
  const categoryName =
    firstValue(raw.category, ["category_name", "category_code", "code"]) ??
    firstValue(raw, ["jenis_pengaduan"]) ??
    "Laporan";

  const createdAt = String(raw.created_at ?? raw.complaint_date ?? "");

  return {
    id,
    title: "Aduan Baru",
    description: companyName
      ? `Terdapat laporan baru dari ${complainantName} (${companyName}) yang perlu ditinjau.`
      : `Terdapat laporan baru dari ${complainantName} yang perlu ditinjau.`,
    ticket: String(raw.ticket_number ?? "-"),
    category: categoryName,
    time: timeAgo(createdAt),
    createdAt,
    read: status.read.has(id),
    dismissed: status.dismissed.has(id),
  };
}

/**
 * Ambil notifikasi terbaru dari data pengaduan, terurut paling baru duluan.
 * @throws Error bila fetch gagal.
 */
export async function fetchNotifications(limit = 50): Promise<NotificationItem[]> {
  const res = await fetch(`${apiUrl("complaints")}?per_page=${limit}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Gagal memuat notifikasi (${res.status}).`);
  }

  const json: unknown = await res.json();
  const status = loadNotifStatus();

  return extractList(json)
    .filter(isRecord)
    .map((raw) => toNotification(raw, status))
    .sort((a, b) => timeMs(b.createdAt) - timeMs(a.createdAt));
}

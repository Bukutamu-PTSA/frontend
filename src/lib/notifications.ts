/**
 * Lapisan data notifikasi.
 *
 * Backend belum menyediakan endpoint notifikasi khusus, jadi notifikasi
 * diturunkan dari data pengaduan (GET /api/complaints) yang sudah ada:
 * setiap aduan baru direpresentasikan sebagai satu notifikasi "Aduan Baru".
 *
 * Status dibaca/diabaikan disimpan lokal (localStorage) sehingga tetap
 * bertahan antar sesi.
 */
import { apiUrl, authHeaders } from "@/lib/api";

export interface NotificationItem {
  id: number | string;
  title: string;
  description: string;
  ticket: string;
  category: string;
  time: string;
  createdAt: string;
  read: boolean;
  dismissed: boolean;
}

const READ_IDS_KEY = "ptsa_notif_read_ids";
const DISMISSED_IDS_KEY = "ptsa_notif_dismissed_ids";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function parseIdList(value: string | null): string[] {
  try {
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function saveIds(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids));
}

export function isNotifRead(id: number | string): boolean {
  return readIds().includes(String(id));
}

export function markNotifRead(ids: (number | string)[]): void {
  const next = new Set(readIds());
  ids.forEach((id) => next.add(String(id)));
  saveIds(READ_IDS_KEY, [...next]);
}

export function markAllNotifRead(list: Pick<NotificationItem, "id">[]): void {
  markNotifRead(list.map((n) => n.id));
}

export function dismissNotif(ids: (number | string)[]): void {
  const next = new Set(parseIdList(localStorage.getItem(DISMISSED_IDS_KEY)));
  ids.forEach((id) => next.add(String(id)));
  saveIds(DISMISSED_IDS_KEY, [...next]);
}

export function isNotifDismissed(id: number | string): boolean {
  if (typeof window === "undefined") return false;
  return parseIdList(localStorage.getItem(DISMISSED_IDS_KEY)).includes(String(id));
}

/** Ambil daftar JSON apa pun bentuknya (Laravel paginate / raw array / wrapper). */
function extractList(json: unknown): unknown[] {
  const obj = json as Record<string, unknown> | null;
  if (Array.isArray(json)) return json;
  if (!obj) return [];
  if (Array.isArray(obj["data"])) return obj["data"] as unknown[];
  if (Array.isArray(obj["notifications"])) return obj["notifications"] as unknown[];
  const nested = obj["data"] as Record<string, unknown> | null;
  if (nested && Array.isArray(nested["data"])) return nested["data"] as unknown[];
  return [];
}

/** Parser tanggal tangguh: ISO, "YYYY-MM-DD", atau "DD/MM/YYYY". */
function parseDate(value: string): Date | null {
  const s = String(value ?? "").trim();
  if (!s) return null;

  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
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

  const dateOnly = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }

  const dmy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmy) {
    return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  }

  const parsed = new Date(s);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Waktu relatif berbahasa Indonesia. */
export function timeAgo(value: string | null | undefined): string {
  const date = parseDate(value ?? "");
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

interface RawComplaint {
  id?: unknown;
  ticket_number?: unknown;
  created_at?: unknown;
  complaint_date?: unknown;
  complainant?: Record<string, unknown>;
  company?: Record<string, unknown>;
  category?: Record<string, unknown>;
}

function toNotification(raw: RawComplaint): NotificationItem {
  const id = String(raw?.id ?? raw?.ticket_number ?? Math.random().toString(36).slice(2));

  const complainant = raw?.complainant ?? {};
  const company = raw?.company ?? {};
  const category = raw?.category ?? {};

  const complainantName = String(
    complainant["nama_lengkap"] ??
      complainant["nama"] ??
      (raw as Record<string, unknown>)["nama_pelapor"] ??
      "Pengunjung",
  );

  const companyName = String(
    company["nama_perusahaan"] ?? (raw as Record<string, unknown>)["nama_perusahaan"] ?? "",
  );

  const categoryName = String(
    category["category_name"] ??
      category["category_code"] ??
      category["code"] ??
      (raw as Record<string, unknown>)["jenis_pengaduan"] ??
      "Laporan",
  );

  const dateStr = String(raw?.created_at ?? raw?.complaint_date ?? "");

  return {
    id,
    title: "Aduan Baru",
    description: companyName
      ? `Terdapat laporan baru dari ${complainantName} (${companyName}) yang perlu ditinjau.`
      : `Terdapat laporan baru dari ${complainantName} yang perlu ditinjau.`,
    ticket: String(raw?.ticket_number ?? "-"),
    category: categoryName,
    time: timeAgo(dateStr),
    createdAt: dateStr,
    read: isNotifRead(id),
    dismissed: isNotifDismissed(id),
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
  const items = extractList(json)
    .filter((it) => it && typeof it === "object")
    .map((it) => toNotification(it as RawComplaint))
    .sort((a, b) => {
      const ta = parseDate(a.createdAt)?.getTime() ?? 0;
      const tb = parseDate(b.createdAt)?.getTime() ?? 0;
      return tb - ta;
    });

  return items;
}

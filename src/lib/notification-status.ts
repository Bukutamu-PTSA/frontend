/**
 * Status notifikasi (sudah dibaca / diabaikan) disimpan di localStorage agar
 * tetap bertahan antar sesi. Semua akses storage dijaga agar aman saat SSR.
 */

const READ_IDS_KEY = "ptsa_notif_read_ids";
const DISMISSED_IDS_KEY = "ptsa_notif_dismissed_ids";

export type NotifStatus = {
  read: Set<string>;
  dismissed: Set<string>;
};

function parseIdList(value: string | null): string[] {
  try {
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  return parseIdList(localStorage.getItem(key));
}

function saveIds(key: string, ids: Iterable<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify([...ids]));
}

/** Baca kedua set sekaligus agar localStorage tidak di-parse berulang kali. */
export function loadNotifStatus(): NotifStatus {
  return {
    read: new Set(readIds(READ_IDS_KEY)),
    dismissed: new Set(readIds(DISMISSED_IDS_KEY)),
  };
}

export function markNotifRead(ids: Iterable<string | number>): void {
  const next = new Set([...readIds(READ_IDS_KEY), ...Array.from(ids, String)]);
  saveIds(READ_IDS_KEY, next);
}

export function markAllNotifRead(list: { id: string | number }[]): void {
  markNotifRead(list.map((item) => item.id));
}

export function dismissNotif(ids: Iterable<string | number>): void {
  const next = new Set([...readIds(DISMISSED_IDS_KEY), ...Array.from(ids, String)]);
  saveIds(DISMISSED_IDS_KEY, next);
}

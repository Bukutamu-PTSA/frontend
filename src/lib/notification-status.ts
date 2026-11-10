/**
 * Status notifikasi.
 *
 * - "Sudah dibaca" (is_read) ditangani BACKEND lewat
 *   PATCH /api/v1/dashboard/notifications/{complaint}/read.
 * - "Dismissed" (sembunyikan dari daftar) belum ada di backend, jadi disimpan
 *   di localStorage agar tetap bertahan antar sesi. Akses storage dijaga aman
 *   saat SSR.
 */
import { apiUrl, authHeaders } from "@/lib/api";
import { NOTIFICATIONS_PATH } from "@/lib/notifications";

const DISMISSED_IDS_KEY = "ptsa_notif_dismissed_ids";

export type NotifStatus = {
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

export function loadNotifStatus(): NotifStatus {
  return {
    dismissed: new Set(readIds(DISMISSED_IDS_KEY)),
  };
}

/** Tandai satu notifikasi sudah dibaca di backend (PATCH). */
export async function markNotifRead(ids: Iterable<string | number>): Promise<void> {
  await Promise.all(
    Array.from(ids, (id) =>
      fetch(apiUrl(`${NOTIFICATIONS_PATH}/${id}/read`), {
        method: "PATCH",
        headers: authHeaders(),
      }).catch((err) => {
        console.error(`Gagal menandai notifikasi ${id} dibaca:`, err);
      }),
    ),
  );
}

export async function markAllNotifRead(list: { id: string | number }[]): Promise<void> {
  await markNotifRead(list.map((item) => item.id));
}

/** Sembunyikan notifikasi dari daftar (lokal, backend belum mendukung). */
export function dismissNotif(ids: Iterable<string | number>): void {
  const next = new Set([...readIds(DISMISSED_IDS_KEY), ...Array.from(ids, String)]);
  saveIds(DISMISSED_IDS_KEY, next);
}

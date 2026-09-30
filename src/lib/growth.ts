/**
 * Perhitungan persentase pertumbuhan aduan secara riil dari daftar aduan.
 *
 * - Saat filter tanggal dipilih: hari tersebut vs hari terdekat sebelumnya.
 * - Tanpa filter: bulan berjalan vs bulan sebelumnya.
 */

const nf = new Intl.NumberFormat("id-ID");

const DAY_LENGTH = 10;
const MONTH_LENGTH = 7;

/** Bentuk minimum data aduan yang dibutuhkan perhitungan pertumbuhan. */
export type GrowthRecord = {
  complaint_date?: string | null;
  created_at?: string | null;
};

function tallyByPeriod(list: GrowthRecord[], length: number): Map<string, number> {
  const totals = new Map<string, number>();
  list.forEach((item) => {
    const key = String(item?.complaint_date ?? item?.created_at ?? "").slice(0, length);
    if (key) totals.set(key, (totals.get(key) ?? 0) + 1);
  });
  return totals;
}

function percentChange(current: number, previous: number): number | null {
  return previous > 0 ? ((current - previous) / previous) * 100 : null;
}

/** Prefix "YYYY-MM" dari tanggal hari ini. */
function currentMonth(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Prefix "YYYY-MM" satu bulan sebelum `prefix`. Aman untuk pergantian tahun. */
function previousMonth(prefix: string): string {
  const [year, month] = prefix.split("-").map(Number);
  // month berawalan 1, jadi dikurangi 2 agar jadi indeks 0-based bulan sebelumnya.
  const date = new Date(year ?? 1970, (month ?? 1) - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function computeGrowth(
  rawList: GrowthRecord[],
  selectedDate: string | null = null,
  now: Date = new Date(),
): number | null {
  if (selectedDate) {
    const dayTotals = tallyByPeriod(rawList, DAY_LENGTH);
    const sortedDays = [...dayTotals.keys()].sort();
    const idx = sortedDays.indexOf(selectedDate);
    const previousDay = idx > 0 ? sortedDays[idx - 1] : undefined;
    if (previousDay === undefined) return null;
    return percentChange(dayTotals.get(selectedDate) ?? 0, dayTotals.get(previousDay) ?? 0);
  }

  // Bandingkan bulan kalender yang sedang jalan dengan bulan sebelumnya, bukan
  // "dua bulan terakhir yang punya data". Kalau memakai cara latter, badge bisa
  // melompat ke bulan lama begitu bulan berjalan masih kosong, dan tidak lagi
  // cocok dengan angka total yang ditampilkan di card.
  const monthTotals = tallyByPeriod(rawList, MONTH_LENGTH);
  const thisMonth = currentMonth(now);
  const lastMonth = previousMonth(thisMonth);
  return percentChange(monthTotals.get(thisMonth) ?? 0, monthTotals.get(lastMonth) ?? 0);
}

export function formatGrowth(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${nf.format(rounded)}%`;
}

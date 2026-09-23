/**
 * Perhitungan persentase pertumbuhan aduan secara riil dari daftar aduan.
 *
 * - Saat filter tanggal dipilih: hari tersebut vs hari terdekat sebelumnya.
 * - Tanpa filter: bulan dengan data terakhir vs bulan sebelumnya.
 */

const nf = new Intl.NumberFormat("id-ID");

export function computeGrowth(rawList: any[], selectedDate: string | null = null): number | null {
  const dayTotals = new Map<string, number>();
  rawList.forEach((item: any) => {
    const d = String(item.complaint_date ?? item.created_at ?? "").slice(0, 10);
    if (d) dayTotals.set(d, (dayTotals.get(d) ?? 0) + 1);
  });

  const sortedDays = [...dayTotals.keys()].sort();
  if (sortedDays.length === 0) return null;

  const pct = (current: number, prev: number): number | null =>
    prev > 0 ? ((current - prev) / prev) * 100 : null;

  if (selectedDate) {
    const current = dayTotals.get(selectedDate) ?? 0;
    const idx = sortedDays.indexOf(selectedDate);
    if (idx <= 0) return null;
    return pct(current, dayTotals.get(sortedDays[idx - 1]!) ?? 0);
  }

  const monthTotals = new Map<string, number>();
  rawList.forEach((item: any) => {
    const m = String(item.complaint_date ?? item.created_at ?? "").slice(0, 7);
    if (m) monthTotals.set(m, (monthTotals.get(m) ?? 0) + 1);
  });

  const months = [...monthTotals.keys()].sort();
  if (months.length < 2) return null;
  return pct(monthTotals.get(months.at(-1)!) ?? 0, monthTotals.get(months.at(-2)!) ?? 0);
}

export function formatGrowth(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${nf.format(rounded)}%`;
}

/** Geser awalan tanggal/bulan/tahun satu periode ke belakang. */
function shiftPrefixBack(mode: "day" | "month" | "year", value: string): string {
  if (mode === "day") {
    const [y = 0, m = 1, d = 1] = value.split("-").map(Number);
    const prev = new Date(y, m - 1, d - 1);
    return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-${String(prev.getDate()).padStart(2, "0")}`;
  }
  if (mode === "month") {
    const [y = 0, m = 1] = value.split("-").map(Number);
    const prev = new Date(y, m - 2, 1);
    return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
  }
  return String(Number(value) - 1);
}

/**
 * Pertumbuhan untuk periode terpilih (day/month/year) dibanding periode
 * sebelumnya yang sebanding (hari kemarin / bulan lalu / tahun lalu).
 */
export function computeFilteredGrowth(
  rawList: any[],
  mode: "day" | "month" | "year",
  value: string,
): number | null {
  const prefix =
    mode === "day" ? value.slice(0, 10) : mode === "month" ? value.slice(0, 7) : value.slice(0, 4);
  const prevPrefix = shiftPrefixBack(mode, value);

  let current = 0;
  let previous = 0;
  rawList.forEach((item: any) => {
    const d = String(item.complaint_date ?? item.created_at ?? "");
    if (d.startsWith(prefix)) current += 1;
    else if (d.startsWith(prevPrefix)) previous += 1;
  });

  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

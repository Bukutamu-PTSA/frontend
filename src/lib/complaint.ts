/**
 * Helper tampilan untuk data pengaduan dari backend.
 */

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Teks "Jenis Pengaduan" untuk ditampilkan.
 *
 * Backend mengirim `jenis_pengaduan_label`: nama kategori biasa, atau
 * "Lainnya (isian pelapor)" untuk kategori Lainnya. Bila field itu belum ada
 * (backend lama) atau kosong, dipakai nama kategori sebagai cadangan.
 *
 * @param item     objek pengaduan dari API
 * @param fallback teks bila semua sumber kosong
 */
export function jenisPengaduanLabel(item: any, fallback = "-"): string {
  return (
    text(item?.jenis_pengaduan_label) ||
    text(item?.category?.category_name) ||
    text(item?.category_name) ||
    text(item?.jenis_pengaduan) ||
    text(item?.category?.category_code) ||
    text(item?.kategori) ||
    fallback
  );
}

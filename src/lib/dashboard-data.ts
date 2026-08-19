export type Kategori = { nama: string; total: number; trend: number };

export const kategoriPengaduan: Kategori[] = [
  { nama: "WLKP", total: 5322, trend: 12.4 },
  { nama: "Upah Kerja", total: 147, trend: 4.1 },
  { nama: "Jaminan Sosial", total: 14, trend: -2.3 },
  { nama: "Hubungan Kerja", total: 70, trend: 6.8 },
  { nama: "Kecelakaan Kerja", total: 14, trend: 1.2 },
  { nama: "Waktu Kerja & Istirahat", total: 6, trend: 0 },
  { nama: "Penempatan TK Dalam & Luar Negeri", total: 13, trend: -1.5 },
  { nama: "Keselamatan & Kesehatan Kerja", total: 12, trend: 3.3 },
  { nama: "Perempuan & Anak", total: 6, trend: 0.8 },
  { nama: "Kader Norma K3", total: 2, trend: 0 },
  { nama: "Kader Norma Ketenagakerjaan", total: 5, trend: 2.0 },
  { nama: "SKP", total: 0, trend: 0 },
];

export const skalaPerusahaan = [
  { nama: "Perusahaan Mikro", label: "Mikro", total: 709 },
  { nama: "Perusahaan Kecil", label: "Kecil", total: 1416 },
  { nama: "Perusahaan Menengah", label: "Menengah", total: 1684 },
  { nama: "Perusahaan Besar", label: "Besar", total: 1957 },
];

export const wilayah = [
  { provinsi: "Aceh", total: 6, wlkp: 6, upah: 0, jamsos: 0, hubker: 0 },
  { provinsi: "Bali", total: 67, wlkp: 66, upah: 0, jamsos: 0, hubker: 0 },
  { provinsi: "Banten", total: 510, wlkp: 454, upah: 26, jamsos: 0, hubker: 6 },
  { provinsi: "DI Yogyakarta", total: 8, wlkp: 6, upah: 1, jamsos: 0, hubker: 1 },
  { provinsi: "DKI Jakarta", total: 4232, wlkp: 3933, upah: 88, jamsos: 13, hubker: 48 },
  { provinsi: "Jambi", total: 1, wlkp: 1, upah: 0, jamsos: 0, hubker: 0 },
  { provinsi: "Jawa Barat", total: 584, wlkp: 535, upah: 14, jamsos: 1, hubker: 8 },
  { provinsi: "Jawa Tengah", total: 49, wlkp: 45, upah: 2, jamsos: 0, hubker: 0 },
  { provinsi: "Jawa Timur", total: 80, wlkp: 70, upah: 4, jamsos: 0, hubker: 2 },
  { provinsi: "Kalimantan Barat", total: 10, wlkp: 9, upah: 0, jamsos: 0, hubker: 0 },
];

export const trenBulanan = [
  { bulan: "Feb", pengaduan: 320 },
  { bulan: "Mar", pengaduan: 412 },
  { bulan: "Apr", pengaduan: 388 },
  { bulan: "Mei", pengaduan: 501 },
  { bulan: "Jun", pengaduan: 664 },
  { bulan: "Jul", pengaduan: 742 },
  { bulan: "Agu", pengaduan: 830 },
];

export const pengaduanWlkp = [
  {
    tanggal: "12 Agu 2026 · 11:45",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "J. Dola Sinulingga",
    perusahaan: "Boga Makmur Intipangan",
    provinsi: "Banten",
    desk: "Perubahan sistem WLKP menjadi kendala pelaporan, notif pengelola tidak termasuk tenaga kerja.",
    status: "Proses",
  },
  {
    tanggal: "12 Agu 2026 · 11:25",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "Ridhotta Maralam",
    perusahaan: "PT Bangkitgiat Usaha Mandiri",
    provinsi: "DKI Jakarta",
    desk: "Tambah cabang.",
    status: "Selesai",
  },
  {
    tanggal: "12 Agu 2026 · 10:48",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "Almaria",
    perusahaan: "PT Karya Bahana Unigam",
    provinsi: "Jawa Barat",
    desk: "Tidak bisa lapor LKPM karena adanya kekurangan data.",
    status: "Proses",
  },
  {
    tanggal: "12 Agu 2026 · 10:27",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "Errin Windasti",
    perusahaan: "PT Global Lintasindo Logistik",
    provinsi: "DKI Jakarta",
    desk: "Tidak bisa login dan pengalihan akun.",
    status: "Baru",
  },
  {
    tanggal: "12 Agu 2026 · 10:19",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "Ratna Herkristiani",
    perusahaan: "PT Ippudo Catering Indonesia",
    provinsi: "DKI Jakarta",
    desk: "Penggantian pengelola akun WLKP cabang.",
    status: "Selesai",
  },
  {
    tanggal: "12 Agu 2026 · 10:08",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "Rian Ardian",
    perusahaan: "PT Nusa Elang Satria",
    provinsi: "DKI Jakarta",
    desk: "Pengalihan akun dan penghapusan akun.",
    status: "Proses",
  },
  {
    tanggal: "12 Agu 2026 · 09:53",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "E M Titiek",
    perusahaan: "PT KKI Nusantara Gemilang",
    provinsi: "DKI Jakarta",
    desk: "Tidak bisa memproses laporan WLKP.",
    status: "Baru",
  },
  {
    tanggal: "12 Agu 2026 · 09:36",
    jenis: "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP",
    pelapor: "Achmad Aminulloh",
    perusahaan: "Nirmala Coal Nusantara",
    provinsi: "DKI Jakarta",
    desk: "Tidak bisa melakukan pelaporan.",
    status: "Proses",
  },
];

export const settingMenu = [
  { no: 1, nama: "Halaman Beranda", desc: "Konten hero, banner, dan pengumuman", tone: "brand" },
  { no: 2, nama: "Data Skala Perusahaan", desc: "Kelola klasifikasi mikro s.d. besar", tone: "brand" },
  { no: 3, nama: "Data Survei", desc: "Pertanyaan dan periode survei kepuasan", tone: "brand" },
  { no: 4, nama: "Userlogin", desc: "Akun petugas, peran, dan akses", tone: "brand" },
  { no: 5, nama: "Data Visitor", desc: "Statistik kunjungan layanan", tone: "brand" },
  { no: 6, nama: "Generate QR", desc: "QR antrian dan tautan layanan", tone: "brand" },
  { no: 7, nama: "Shortlink URL", desc: "Pemendek tautan publikasi", tone: "warning" },
  { no: 8, nama: "Jenis Pengaduan", desc: "Master kategori pengaduan", tone: "warning" },
];

export type SurveiNilai = "Baik" | "Cukup" | "Kurang";

export type SurveiRingkasan = {
  nilai: SurveiNilai;
  label: string;
  total: number;
  share: number;
};

export type SurveiResponden = {
  no: number;
  tanggal: string;
  responden: string;
  komunikasi: SurveiNilai;
  substansi: SurveiNilai;
  sarana: SurveiNilai;
  keterangan: string;
};

export const surveiRingkasan: SurveiRingkasan[] = [
  { nilai: "Baik", label: "Puas dengan Layanan", total: 612, share: 68 },
  { nilai: "Cukup", label: "Cukup Puas", total: 214, share: 24 },
  { nilai: "Kurang", label: "Perlu Perbaikan", total: 72, share: 8 },
];

export const surveiResponden: SurveiResponden[] = [
  {
    no: 1,
    tanggal: "12 Agu 2026 · 11:52",
    responden: "J. Dola Sinulingga",
    komunikasi: "Baik",
    substansi: "Baik",
    sarana: "Cukup",
    keterangan: "Petugas responsif, ruang tunggu agak sempit saat jam sibuk.",
  },
  {
    no: 2,
    tanggal: "12 Agu 2026 · 11:30",
    responden: "Ridhotta Maralam",
    komunikasi: "Baik",
    substansi: "Baik",
    sarana: "Baik",
    keterangan: "Proses pengaduan cepat dan penjelasan mudah dipahami.",
  },
  {
    no: 3,
    tanggal: "12 Agu 2026 · 10:55",
    responden: "Almaria",
    komunikasi: "Cukup",
    substansi: "Kurang",
    sarana: "Cukup",
    keterangan: "Penjelasan terkait kekurangan data laporan kurang detail.",
  },
  {
    no: 4,
    tanggal: "12 Agu 2026 · 10:33",
    responden: "Errin Windasti",
    komunikasi: "Kurang",
    substansi: "Cukup",
    sarana: "Kurang",
    keterangan: "Menunggu lama untuk konfirmasi pengalihan akun, sistem antrian membingungkan.",
  },
  {
    no: 5,
    tanggal: "12 Agu 2026 · 10:21",
    responden: "Ratna Herkristiani",
    komunikasi: "Baik",
    substansi: "Baik",
    sarana: "Baik",
    keterangan: "Petugas membantu penggantian pengelola akun dengan jelas.",
  },
  {
    no: 6,
    tanggal: "12 Agu 2026 · 10:10",
    responden: "Rian Ardian",
    komunikasi: "Cukup",
    substansi: "Baik",
    sarana: "Cukup",
    keterangan: "Materi cukup jelas, fasilitas ruang tunggu perlu ditambah.",
  },
  {
    no: 7,
    tanggal: "12 Agu 2026 · 09:58",
    responden: "E M Titiek",
    komunikasi: "Baik",
    substansi: "Cukup",
    sarana: "Baik",
    keterangan: "Petugas ramah, namun solusi teknis butuh eskalasi lebih lanjut.",
  },
  {
    no: 8,
    tanggal: "12 Agu 2026 · 09:41",
    responden: "Achmad Aminulloh",
    komunikasi: "Kurang",
    substansi: "Kurang",
    sarana: "Cukup",
    keterangan: "Kendala pelaporan belum terselesaikan setelah dua kali kunjungan.",
  },
];
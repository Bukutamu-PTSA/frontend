import type { NavLink, SocialLink, Step, RatingOption, CategoryConfig } from "@/types/config";

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Sistem Pengaduan Tenaga Kerja";
export const APP_SHORT_NAME = import.meta.env.VITE_APP_SHORT_NAME || "PTSA Kemnaker";
export const ORGANIZATION_NAME = import.meta.env.VITE_ORGANIZATION_NAME || "Kementerian Ketenagakerjaan RI";
export const ORGANIZATION_NAME_SHORT = import.meta.env.VITE_ORGANIZATION_NAME_SHORT || "Kementerian Ketenagakerjaan";
export const ORGANIZATION_UNIT = import.meta.env.VITE_ORGANIZATION_UNIT || "BINWASNAKER & K3";
export const ORGANIZATION_UNIT_FULL = import.meta.env.VITE_ORGANIZATION_UNIT_FULL || "Ditjen Binwasnaker & K3";

export const BRAND_PRIMARY_COLOR = import.meta.env.VITE_BRAND_PRIMARY_COLOR || "#032749";
export const BRAND_SECONDARY_COLOR = import.meta.env.VITE_BRAND_SECONDARY_COLOR || "#0E3B68";
export const BRAND_ACCENT_COLOR = import.meta.env.VITE_BRAND_ACCENT_COLOR || "#10B981";

export const DEFAULT_TOTAL_LAPORAN = Number(import.meta.env.VITE_DEFAULT_TOTAL_LAPORAN || 12450);

export const COPYRIGHT_START_YEAR = Number(import.meta.env.VITE_COPYRIGHT_START_YEAR || 2024);
export const COPYRIGHT_END_YEAR = Number(import.meta.env.VITE_COPYRIGHT_END_YEAR || 2026);

/** Rentang tahun hak cipta, mis. "2024–2026" (atau satu tahun bila sama). */
export const COPYRIGHT_YEARS =
  COPYRIGHT_START_YEAR === COPYRIGHT_END_YEAR
    ? String(COPYRIGHT_START_YEAR)
    : `${COPYRIGHT_START_YEAR}–${COPYRIGHT_END_YEAR}`;

/** Nama pengembang / vendor aplikasi (ditampilkan di footer). */
export const DEVELOPER_NAME = import.meta.env.VITE_DEVELOPER_NAME || "TUBSPK";
/** Nama unit sistem informasi / pemilik aplikasi (ditampilkan di footer). */
export const SYSTEM_OWNER_NAME = import.meta.env.VITE_SYSTEM_OWNER_NAME || "BINSIS";
/** Tagline / motto yang ditampilkan di footer admin. */
export const FOOTER_TAGLINE =
  import.meta.env.VITE_FOOTER_TAGLINE || "Bangga Melayani Bangsa · BerAKHLAK";

export const ADDRESS_LINE_1 = import.meta.env.VITE_ADDRESS_LINE_1 || "Jl. Jend. Gatot Subroto Kav. 51";
export const ADDRESS_LINE_2 = import.meta.env.VITE_ADDRESS_LINE_2 || "RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi";
export const ADDRESS_LINE_3 = import.meta.env.VITE_ADDRESS_LINE_3 || "Kota Jakarta Selatan, DKI Jakarta 12950";

export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "pengaduanwlkp@gmail.com";
export const MAPS_URL = import.meta.env.VITE_MAPS_URL || "https://maps.app.goo.gl/QiLps9tsVMszzHf79";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "x",
    label: "X (Twitter)",
    href: import.meta.env.VITE_SOCIAL_X_URL || "https://x.com/KemnakerRI",
    icon: "XIcon",
  },
  {
    platform: "facebook",
    label: "Facebook",
    href: import.meta.env.VITE_SOCIAL_FACEBOOK_URL || "https://www.facebook.com/share/1B4YgTmbGG/?mibextid=wwXIfr",
    icon: "Facebook",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL || "https://www.instagram.com/kemnaker?stkn=MWdxZjhmMG81aTZ3YQ==",
    icon: "Instagram",
  },
];

export const NAV_LINKS: NavLink[] = [
  { label: "Beranda", to: "/" },
  { label: "Pengaduan", to: "/pengaduan" },
  { label: "Survei", to: "/survei" },
];

export const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Manajemen User", to: "/admin/manajemen_user" },
  { label: "Kategori Pelayanan", to: "/admin/kategori_pelayanan" },
  { label: "Jenis Pengaduan", to: "/admin/jenis_pengaduan" },
  { label: "Data Survei", to: "/admin/data_survei" },
  { label: "Data Pengaduan", to: "/admin/data_visitor" },
  { label: "Report Survei", to: "/admin/reportsurvei" },
  { label: "Report Pengaduan", to: "/admin/reportpengaduan" },
  { label: "Grafik", to: "/admin/grafik" },
  { label: "Wilayah", to: "/admin/wilayah" },
  { label: "FAQ", to: "/admin/faq" },
  { label: "Notifikasi", to: "/admin/notifications" },
  { label: "Pengaturan", to: "/admin/setting" },
];

export const HERO_STEPS: Step[] = [
  {
    title: "Siapkan Data & Bukti",
    body: "Kumpulkan dokumen pendukung seperti slip gaji, kontrak kerja, atau bukti komunikasi yang relevan dengan aduan Anda.",
  },
  {
    title: "Isi Formulir Pengaduan",
    body: "Lengkapi formulir secara online dengan detail kronologi kejadian secara jelas dan faktual pada portal ini.",
  },
];

export const RATING_OPTIONS: RatingOption[] = [
  { value: "Baik", label: "Baik" },
  { value: "Cukup", label: "Cukup" },
  { value: "Kurang", label: "Kurang" },
];

export const CATEGORIES: CategoryConfig[] = [
  { id: 1, code: "WAJIB_LAPOR", title: "WAJIB LAPOR KETENAGAKERJAAN" },
  { id: 2, code: "UPAH_KERJA", title: "Upah Kerja" },
  { id: 3, code: "JAMINAN_SOSIAL", title: "Jaminan Sosial" },
  { id: 4, code: "HUBUNGAN_KERJA", title: "Hubungan Kerja" },
  { id: 5, code: "KECELAKAAN_KERJA", title: "Kecelakaan Kerja" },
  { id: 6, code: "WAKTU_KERJA", title: "Waktu Kerja & Istirahat" },
  { id: 7, code: "KADER_NORMA", title: "Kader Norma Kerja" },
  { id: 8, code: "PENEMPATAN_TK", title: "Penempatan Tenaga Kerja" },
  { id: 9, code: "K3", title: "Keselamatan & Kesehatan (K3)" },
  { id: 10, code: "PEREMPUAN_ANAK", title: "Perlindungan Perempuan & Anak" },
  { id: 11, code: "NORMA_K3", title: "Kader Norma K3" },
  { id: 12, code: "SKP", title: "SKP" },
];

export const MOCK_OFFICERS = [
  { id: "1", name: "Ahmad Fauzi - Petugas PTSA 1" },
  { id: "2", name: "Siti Rahmawati - Petugas PTSA 2" },
  { id: "3", name: "Budi Santoso - Petugas PTSA 3" },
];

export const FORM_PLACEHOLDERS = {
  pengaduan: {
    namaPelapor: "Nama Lengkap Pelapor",
    nik: "Masukkan 16 digit NIK",
    alamatPelapor: "Masukkan alamat lengkap",
    jabatan: "Contoh: Staff",
    noTelpPelapor: "08xx xxxx xxxx",
    emailPelapor: "email@contoh.com",
    namaPerusahaan: "PT / CV ....",
    jumlahPekerja: "0",
    emailPerusahaan: "hrd@perusahaan.com",
    noTelpPerusahaan: "021-xxxxxxx",
    alamatPerusahaan: "Jalan, Gedung, dll",
    lainnya: "Masukkan Jenis Pengaduan",
    selectProvinsi: "Pilih Provinsi",
    selectKabupaten: "Pilih Kota/Kabupaten",
    selectKecamatan: "Pilih Kecamatan",
    selectKelurahan: "Pilih Kelurahan",
    selectCategory: "Pilih Jenis Pengaduan",
    selectSector: "Pilih Sektor",
  },
  survei: {
    selectOfficer: "Pilih",
    catatan: "isi dengan singkat catatan untuk perbaikan pelayanan",
  },
  login: {
    email: "Masukkan email Anda",
    password: "Masukkan password Anda",
  },
};

export const FORM_LABELS = {
  pengaduan: {
    jenisPengaduan: "Jenis Pengaduan",
    lainnya: "Lainnya",
    tanggalPelaporan: "Tanggal Pelaporan",
    namaPelapor: "Nama Pelapor",
    nik: "NIK",
    alamatPelapor: "Alamat",
    jenisKelamin: "Jenis Kelamin",
    jabatan: "Jabatan",
    noTelpPelapor: "No Telp",
    emailPelapor: "Email",
    namaPerusahaan: "Nama Perusahaan",
    sektorIndustri: "Sektor Industri",
    jumlahPekerja: "Jumlah Pekerja",
    provinsi: "Provinsi",
    kabupaten: "Kota/Kabupaten",
    kecamatan: "Kecamatan",
    kelurahan: "Kelurahan",
    emailPerusahaan: "Email Perusahaan",
    noTelpPerusahaan: "No Telp Perusahaan",
    alamatPerusahaan: "Alamat Perusahaan",
  },
  survei: {
    officer: "Masukkan Nama Petugas",
    komunikasiPetugas: "Bagaimana Komunikasi Petugas Dalam Memberikan Layanan:",
    penjelasanMateri: "Bagaimana Penjelasan Materi yang Diberikan oleh Petugas:",
    saranaPrasarana: "Bagaimana Sarana dan Prasarana Layanan PTSA:",
    catatan: "Catatan:",
  },
  login: {
    email: "Username",
    password: "Password",
    rememberMe: "Remember me",
    submit: "Masuk",
  },
};

export const VALIDATION_MESSAGES = {
  required: "Wajib diisi",
  email: "Format email tidak valid",
  nikLength: "NIK harus 16 digit",
  selectOption: "Silakan pilih opsi",
  selectOfficer: "Silakan pilih nama petugas terlebih dahulu",
  completeSurvey: "Silakan lengkapi seluruh penilaian survei",
  loginFailed: "Email atau password yang Anda masukkan salah.",
  submitFailed: "Gagal mengirim data. Silakan coba kembali.",
};

export const SUCCESS_MESSAGES = {
  login: "Login berhasil! Mengalihkan ke dashboard...",
  logout: "Anda berhasil keluar.",
  surveiSubmitted: "Terima kasih! Survei kepuasan layanan Anda berhasil dikirim.",
  pengaduanDraftSaved: "Draft pengaduan disimpan. Lanjut ke detail aduan.",
  pengaduanSubmitted: "Pengaduan berhasil disimpan!",
  dataUpdated: "Data berhasil diperbarui!",
  userCreated: "User berhasil ditambahkan!",
  userUpdated: "User berhasil diperbarui!",
  skalaDeleted: "Skala perusahaan berhasil dihapus.",
  jenisPengaduanDeleted: "Jenis pengaduan berhasil dihapus.",
  complaintDeleted: "Aduan berhasil dihapus.",
};

export const ERROR_MESSAGES = {
  networkError: "Terjadi kesalahan jaringan. Silakan coba lagi.",
  serverError: "Terjadi kesalahan server. Silakan hubungi administrator.",
  unauthorized: "Sesi Anda telah berakhir. Silakan login kembali.",
  forbidden: "Anda tidak memiliki akses ke halaman ini.",
  submitFailed: "Gagal mengirim data. Silakan coba kembali.",
  pengaduanSubmitFailed: "Gagal menyimpan pengaduan.",
  pengaduanValidationFailed: "Data formulir tidak memenuhi validasi server.",
  pengaduanNetworkError: "Terjadi kendala jaringan saat menghubungi server.",
  dataUpdateFailed: "Terjadi kesalahan saat menyimpan data.",
  userCreateFailed: "Gagal mendaftarkan user. Silakan coba lagi.",
  userUpdateFailed: "Gagal memperbarui user. Silakan coba lagi.",
  userDeleteFailed: "Gagal menghapus user. Coba lagi.",
  skalaDeleteFailed: "Gagal menghapus skala. Coba lagi.",
  jenisPengaduanDeleteFailed: "Gagal menghapus jenis pengaduan. Coba lagi.",
  complaintDeleteFailed: "Gagal menghapus aduan.",
  complaintDeleteError: "Terjadi kesalahan saat menghapus aduan.",
  pdfExportFailed: "Terjadi kesalahan saat mengunduh PDF.",
  pdfComplaintExportFailed: "Terjadi kesalahan saat mengunduh PDF pengaduan.",
};

export const CONFIRM_MESSAGES = {
  deleteSkala: "Hapus skala perusahaan ini?",
  deleteSurveiQuestion: "Hapus pertanyaan survei ini?",
  deleteComplaint: "Apakah Anda yakin ingin menghapus pengaduan ini?",
  deleteUser: "Hapus user ini?",
  deleteFaq: "Hapus FAQ ini?",
  deleteJenisPengaduan: (name: string) => `Hapus jenis pengaduan "${name}"?`,
  dismissAllNotifications: (count: number) => `Hapus ${count} notifikasi di daftar ini?`,
};

export const PAGE_TITLES = {
  home: `${APP_NAME} | Kemnaker RI`,
  pengaduan: `Formulir Pengaduan - ${ORGANIZATION_NAME_SHORT}`,
  survei: `Form Survei Layanan PTSA | Kemnaker RI`,
  login: `Login - ${ORGANIZATION_NAME_SHORT}`,
  buktiPendukung: `Detail Aduan & Bukti Pendukung - ${ORGANIZATION_NAME_SHORT}`,
  faq: `FAQ - ${ORGANIZATION_NAME_SHORT}`,
  adminDashboard: `Executive Dashboard - ${APP_SHORT_NAME}`,
  adminCategories: `Kategori Pelayanan - Admin`,
  adminSurvei: `Data Survei - Admin`,
  adminPengaduan: `Data Pengaduan - Admin`,
  adminGrafik: `Grafik & Statistik Overview - ${APP_SHORT_NAME}`,
  adminWilayah: `Data Provinsi - ${APP_SHORT_NAME}`,
  adminFAQ: `FAQ - Admin`,
  adminSettings: `Setting Apps - ${APP_SHORT_NAME}`,
  adminReportPengaduan: `All Report Pengaduan - ${APP_SHORT_NAME}`,
  adminReportSurvei: `Report Survei Pelayanan - ${APP_SHORT_NAME}`,
  adminReportKategori: `Report Pengaduan Kategori - ${APP_SHORT_NAME}`,
  adminReportPelayanan: `Report Pelayanan - ${APP_SHORT_NAME}`,
  adminKategoriRekap: `Rekapitulasi Layanan Kategori - ${APP_SHORT_NAME}`,
  adminNotifications: `Pusat Notifikasi - ${APP_SHORT_NAME}`,
  adminViewPdf: `Cetak Dokumen Pengaduan - ${APP_SHORT_NAME}`,
};

export const PAGE_DESCRIPTIONS = {
  home: "Portal resmi pelaporan pelanggaran norma kerja, perselisihan hubungan industrial, dan masalah ketenagakerjaan secara aman dan terpantau.",
  pengaduan: "Formulir pengaduan pelanggaran norma kerja dan masalah ketenagakerjaan.",
  survei: "Form survei kepuasan layanan Pelayanan Terpadu Satu Atap (PTSA) Kementerian Ketenagakerjaan.",
};

export const FOOTER_LINKS = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Syarat & Ketentuan", href: "#" },
  { label: "FAQ", href: "/faqpage" },
  { label: "Hubungi Kami", href: "#" },
];

export const GENDER_OPTIONS = [
  { value: "Laki-laki", label: "Laki-laki" },
  { value: "Perempuan", label: "Perempuan" },
];

export const JENIS_PENGADUAN_OTHER_VALUE = "other";

export const ITEMS_PER_PAGE = {
  wilayah: 4,
  default: 10,
};

export const SCROLL_AMOUNT = 340;

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

export const IKM_LABELS = {
  sangatBaik: "Sangat Baik",
  baik: "Baik",
  cukup: "Cukup",
  kurang: "Kurang",
};

export const IKM_THRESHOLDS = {
  sangatBaik: 4.5,
  baik: 3.5,
  cukup: 2.5,
};

export const SURVEY_QUESTION_NUMBERS = {
  officer: 1,
  komunikasi: 2,
  penjelasan: 3,
  sarana: 4,
  catatan: 5,
};

export const API_ENDPOINTS = {
  login: "/v1/auth/login",
  complaintCategories: "/complaint-categories",
  industrialSectors: "/industrial-sectors",
  provinces: "/provinces",
  cities: "/cities",
  districts: "/districts",
  villages: "/villages",
  complaints: "/complaints",
  complaintSummary: "/dashboard/complaint-summary",
  provinceSummary: "/dashboard/province-summary",
  officers: "/officers",
  petugas: "/petugas",
  surveys: "/surveys",
};

export const STORAGE_KEYS = {
  authToken: "auth_token",
  authUser: "auth_user",
  draftPengaduan: "draft_pengaduan",
};

export const SESSION_TIMEOUT = Number(import.meta.env.VITE_SESSION_TIMEOUT || 3600000);

/**
 * Terapkan warna brand dari env ke CSS custom properties (softcode runtime).
 *
 * Utility Tailwind seperti `bg-brand-primary`, `text-brand-secondary`, dan
 * `ring-brand-accent` membaca variabel `--brand-*` yang didefinisikan di
 * `src/styles.css`. Fungsi ini menimpa nilai default tersebut dengan nilai dari
 * `VITE_BRAND_*` sehingga seluruh warna brand bisa diubah lewat `.env` tanpa
 * menyentuh kode. Dipanggil sekali saat aplikasi dimuat (lihat __root.tsx).
 */
export function applyBrandColors(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", BRAND_PRIMARY_COLOR);
  root.style.setProperty("--brand-secondary", BRAND_SECONDARY_COLOR);
  root.style.setProperty("--brand-accent", BRAND_ACCENT_COLOR);
}

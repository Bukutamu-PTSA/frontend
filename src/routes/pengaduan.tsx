import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  User,
  Building2,
  ArrowLeft,
  ArrowRight,
  Twitter,
  Facebook,
  MessageSquare,
  Instagram,
  MapPin,
  Mail,
} from "lucide-react";
import logoKemnaker from "@/assets/kemnaker_logo.png";

const BASE_API_URL = "http://192.168.147.199:8000/api";

export const Route = createFileRoute("/pengaduan")({
  head: () => ({
    meta: [{ title: "Formulir Pengaduan | Kemnaker RI" }],
  }),
  component: FormulirPengaduanPage,
});

interface OptionItem {
  code: string | number;
  name: string;
}

const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Pengaduan", to: "/pengaduan" },
  { label: "Survei", to: "/survei" },
];

const socials = [
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: MessageSquare, href: "#" },
  { icon: Instagram, href: "#" },
];

const parseDropdownData = (res: any, keyMap?: { codeKey: string; nameKey: string }): OptionItem[] => {
  if (!res) return [];
  const rawData = res.data ? res.data : res;

  if (typeof rawData === "object" && !Array.isArray(rawData)) {
    return Object.entries(rawData).map(([code, name]) => ({
      code: String(code),
      name: String(name),
    }));
  }

  if (Array.isArray(rawData)) {
    return rawData.map((item: any) => ({
      code: String(
        (keyMap?.codeKey && item[keyMap.codeKey]) ??
        item.sector_code ??
        item.id ??
        item.code ??
        ""
      ),
      name: String(
        (keyMap?.nameKey && item[keyMap.nameKey]) ??
        item.sector_name ??
        item.category_name ??
        item.name ??
        item.nama ??
        item
      ),
    }));
  }

  return [];
};

function FormulirPengaduanPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    nama_lengkap: "",
    nik: "",
    alamat_pelapor: "",
    jenis_kelamin: "laki-laki",
    jabatan: "",
    no_telp_pelapor: "",
    email_pelapor: "",
    nama_perusahaan: "",
    sektor_industri: "",
    alamat_perusahaan: "",
    jumlah_naker: "",
    provinsi: "",
    provinsiCode: "",
    kota_kab: "",
    kotaCode: "",
    kecamatan: "",
    kecamatanCode: "",
    kelurahan: "",
    kelurahanCode: "",
    no_telp_perusahaan: "",
    email_perusahaan: "",
  });

  const [kategoriOptions, setKategoriOptions] = useState<OptionItem[]>([]);
  const [sektorOptions, setSektorOptions] = useState<OptionItem[]>([]);
  const [provinsiOptions, setProvinsiOptions] = useState<OptionItem[]>([]);
  const [kotaOptions, setKotaOptions] = useState<OptionItem[]>([]);
  const [kecamatanOptions, setKecamatanOptions] = useState<OptionItem[]>([]);
  const [kelurahanOptions, setKelurahanOptions] = useState<OptionItem[]>([]);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingKota, setLoadingKota] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingKelurahan, setLoadingKelurahan] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("draft_pengaduan");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitial(true);
      try {
        const [resKategori, resSektor, resProv] = await Promise.all([
          fetch(`${BASE_API_URL}/complaint-categories`).then((r) => (r.ok ? r.json() : [])),
          fetch(`${BASE_API_URL}/industrial-sectors`).then((r) => (r.ok ? r.json() : [])),
          fetch(`${BASE_API_URL}/provinces`).then((r) => (r.ok ? r.json() : {})),
        ]);

        setKategoriOptions(parseDropdownData(resKategori, { codeKey: "id", nameKey: "category_name" }));
        setSektorOptions(parseDropdownData(resSektor, { codeKey: "sector_code", nameKey: "sector_name" }));
        setProvinsiOptions(parseDropdownData(resProv));
      } catch (error) {
        console.error("Gagal memuat data awal:", error);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!formData.provinsiCode) {
      setKotaOptions([]);
      setKecamatanOptions([]);
      setKelurahanOptions([]);
      return;
    }

    const fetchKota = async () => {
      setLoadingKota(true);
      try {
        const res = await fetch(`${BASE_API_URL}/cities/${formData.provinsiCode}`);
        if (res.ok) setKotaOptions(parseDropdownData(await res.json()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingKota(false);
      }
    };

    fetchKota();
  }, [formData.provinsiCode]);

  useEffect(() => {
    if (!formData.kotaCode) {
      setKecamatanOptions([]);
      setKelurahanOptions([]);
      return;
    }

    const fetchKecamatan = async () => {
      setLoadingKecamatan(true);
      try {
        const res = await fetch(`${BASE_API_URL}/districts/${formData.kotaCode}`);
        if (res.ok) setKecamatanOptions(parseDropdownData(await res.json()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingKecamatan(false);
      }
    };

    fetchKecamatan();
  }, [formData.kotaCode]);

  useEffect(() => {
    if (!formData.kecamatanCode) {
      setKelurahanOptions([]);
      return;
    }

    const fetchKelurahan = async () => {
      setLoadingKelurahan(true);
      try {
        const res = await fetch(`${BASE_API_URL}/villages/${formData.kecamatanCode}`);
        if (res.ok) setKelurahanOptions(parseDropdownData(await res.json()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingKelurahan(false);
      }
    };

    fetchKelurahan();
  }, [formData.kecamatanCode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "provinsiCode") {
      const selected = provinsiOptions.find((p) => p.code === value);
      setFormData((prev) => ({
        ...prev,
        provinsiCode: value,
        provinsi: selected ? selected.name : "",
        kotaCode: "",
        kota_kab: "",
        kecamatanCode: "",
        kecamatan: "",
        kelurahanCode: "",
        kelurahan: "",
      }));
      return;
    }

    if (name === "kotaCode") {
      const selected = kotaOptions.find((k) => k.code === value);
      setFormData((prev) => ({
        ...prev,
        kotaCode: value,
        kota_kab: selected ? selected.name : "",
        kecamatanCode: "",
        kecamatan: "",
        kelurahanCode: "",
        kelurahan: "",
      }));
      return;
    }

    if (name === "kecamatanCode") {
      const selected = kecamatanOptions.find((k) => k.code === value);
      setFormData((prev) => ({
        ...prev,
        kecamatanCode: value,
        kecamatan: selected ? selected.name : "",
        kelurahanCode: "",
        kelurahan: "",
      }));
      return;
    }

    if (name === "kelurahanCode") {
      const selected = kelurahanOptions.find((k) => k.code === value);
      setFormData((prev) => ({
        ...prev,
        kelurahanCode: value,
        kelurahan: selected ? selected.name : "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("draft_pengaduan", JSON.stringify(formData));
    navigate({ to: '/bukti_pendukung' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoKemnaker} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-[#032749]">
              Kementerian Ketenagakerjaan
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex text-[15px]">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="pb-1 transition-colors font-medium text-gray-600 hover:text-[#032749]"
                activeProps={{
                  className: "text-[#032749] font-bold border-b-2 border-[#032749]",
                }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN FORM */}
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#032749]">Formulir Pengaduan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Mohon lengkapi data diri dan informasi perusahaan Anda dengan akurat untuk memproses laporan ini.
            </p>
          </div>

          <form onSubmit={handleNextStep} autoComplete="off" className="space-y-6">
            {/* --- KARTU 1: DATA PELAPOR --- */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-[#032749] border-b pb-4">
                <User className="size-5" />
                <h2 className="text-base font-bold">Data Pelapor</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nama Pelapor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="Masukkan 16 digit NIK"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alamat_pelapor"
                    rows={3}
                    value={formData.alamat_pelapor}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-6 mt-2">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="jenis_kelamin"
                          value="laki-laki"
                          checked={formData.jenis_kelamin === "laki-laki"}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#032749] focus:ring-[#032749]"
                        />
                        Laki-laki
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="jenis_kelamin"
                          value="perempuan"
                          checked={formData.jenis_kelamin === "perempuan"}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#032749] focus:ring-[#032749]"
                        />
                        Perempuan
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Jabatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jabatan"
                      value={formData.jabatan}
                      onChange={handleChange}
                      placeholder="Contoh: Staff"
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      No Telp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="no_telp_pelapor"
                      value={formData.no_telp_pelapor}
                      onChange={handleChange}
                      placeholder="08xxxxxxxxxx"
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email_pelapor"
                      value={formData.email_pelapor}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- KARTU 2: DATA PERUSAHAAN --- */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-[#032749] border-b pb-4">
                <Building2 className="size-5" />
                <h2 className="text-base font-bold">Data Perusahaan</h2>
              </div>

              <div className="space-y-4">
                {/* Baris 1: Nama Perusahaan & Sektor Industri */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama_perusahaan"
                      value={formData.nama_perusahaan}
                      onChange={handleChange}
                      placeholder="PT / CV ..."
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Sektor Industri <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="sektor_industri"
                      value={formData.sektor_industri}
                      onChange={(e) => {
                        const sel = sektorOptions.find((s) => s.name === e.target.value || s.code === e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          sektor_industri: sel ? sel.name : e.target.value,
                        }));
                      }}
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    >
                      <option value="">{loadingInitial ? "Memuat..." : "Pilih Sektor"}</option>
                      {sektorOptions.map((item) => (
                        <option key={item.code} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Baris 2: Kategori Laporan & Jumlah Naker */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Kategori Laporan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    >
                      <option value="">{loadingInitial ? "Memuat..." : "Pilih Kategori"}</option>
                      {kategoriOptions.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Jumlah Naker <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="jumlah_naker"
                      value={formData.jumlah_naker}
                      onChange={handleChange}
                      placeholder="0"
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    />
                  </div>
                </div>

                {/* Baris 3: Provinsi & Kota/Kabupaten */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="provinsiCode"
                      value={formData.provinsiCode}
                      onChange={handleChange}
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    >
                      <option value="">{loadingInitial ? "Memuat..." : "Pilih"}</option>
                      {provinsiOptions.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Kota/Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="kotaCode"
                      value={formData.kotaCode}
                      onChange={handleChange}
                      disabled={!formData.provinsiCode || loadingKota}
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    >
                      <option value="">
                        {loadingKota ? "Memuat..." : "Pilih"}
                      </option>
                      {kotaOptions.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Baris 4: Kecamatan & Kelurahan */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Kecamatan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="kecamatanCode"
                      value={formData.kecamatanCode}
                      onChange={handleChange}
                      disabled={!formData.kotaCode || loadingKecamatan}
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    >
                      <option value="">
                        {loadingKecamatan ? "Memuat..." : "Pilih"}
                      </option>
                      {kecamatanOptions.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Kelurahan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="kelurahanCode"
                      value={formData.kelurahanCode}
                      onChange={handleChange}
                      disabled={!formData.kecamatanCode || loadingKelurahan}
                      required
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    >
                      <option value="">
                        {loadingKelurahan ? "Memuat..." : "Pilih"}
                      </option>
                      {kelurahanOptions.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Baris 5: No Telp Perusahaan & Email Perusahaan */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      No Telp Perusahaan
                    </label>
                    <input
                      type="tel"
                      name="no_telp_perusahaan"
                      value={formData.no_telp_perusahaan}
                      onChange={handleChange}
                      placeholder="021-xxxxxx"
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Perusahaan
                    </label>
                    <input
                      type="email"
                      name="email_perusahaan"
                      value={formData.email_perusahaan}
                      onChange={handleChange}
                      placeholder="hr@perusahaan.com"
                      suppressHydrationWarning
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                    />
                  </div>
                </div>

                {/* Baris 6: Alamat Perusahaan */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Alamat Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="alamat_perusahaan"
                    value={formData.alamat_perusahaan}
                    onChange={handleChange}
                    placeholder="Jalan, Gedung, dll"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                suppressHydrationWarning
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#032749] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <ArrowLeft className="size-4" />
                Kembali
              </button>

              <button
                type="submit"
                suppressHydrationWarning
                className="inline-flex items-center gap-2 rounded-lg bg-[#032749] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-950 active:scale-95 transition-all shadow-md"
              >
                Lanjut ke Detail Aduan
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#032749] text-white mt-16">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold">
                BINWASNAKER <span className="text-emerald-400">&amp; K3</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Ditjen Binwasnaker &amp; K3 adalah unsur pelaksana yang berada di bawah
                dan bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="mt-6 flex gap-3">
                {socials.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Customer Support</h4>
              <hr className="mt-4 border-white/15" />
              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">›</span>
                  <a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">›</span>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Have a Questions?</h4>
              <hr className="mt-4 border-white/15" />
              <div className="mt-5 flex gap-3 text-sm text-gray-300">
                <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="leading-relaxed">
                  Jl. Gatot Subroto No.51, RT.5/RW.4, Kuningan Timur.
                  Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus
                  Jakarta - 12950 Jakarta - Indonesia
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Mail className="size-5 text-emerald-400" />
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Pengaduan WLKP
                </a>
              </div>
            </div>
          </div>

          <hr className="mt-10 border-white/15" />

          <div className="mt-6 flex flex-col items-center gap-1 text-center text-sm text-gray-300">
            <p>Copyright © BINSIS || 2024 – 2026</p>
            <p>
              Designed by <span className="text-emerald-400">TUBSPK</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
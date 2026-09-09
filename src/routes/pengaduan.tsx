import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  FileText,
  User,
  Building2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import kemnakerLogo from "@/assets/kemnaker_logo.png";

const BASE_API_URL = "http://192.168.147.199:8000/api";

export const Route = createFileRoute("/pengaduan")({
  head: () => ({
    meta: [
      {
        title: "Formulir Pengaduan - Kementerian Ketenagakerjaan",
      },
    ],
  }),
  component: FormulirPengaduanPage,
});

interface DropdownItem {
  id: number | string;
  code?: string | number;
  name: string;
}

// Helper untuk parsing response Key-Value { "11": "ACEH", "31": "DKI JAKARTA" } atau Array biasa [ { id: 31, name: "..." } ]
function parseLocationResponse(json: any): DropdownItem[] {
  if (!json) return [];
  const target = json.data ?? json;

  if (typeof target === "object" && !Array.isArray(target)) {
    return Object.entries(target).map(([code, name]) => ({
      id: code,
      code: code,
      name: String(name),
    }));
  }

  if (Array.isArray(target)) {
    return target.map((item: any) => {
      const code = String(
        item.code ||
          item.id ||
          item.province_code ||
          item.city_code ||
          item.district_code ||
          item.village_code
      );
      return {
        id: item.id ?? code,
        code: code,
        name:
          item.name ||
          item.province_name ||
          item.city_name ||
          item.district_name ||
          item.village_name ||
          item.nama ||
          String(item),
      };
    });
  }

  return [];
}

function FormulirPengaduanPage() {
  const navigate = useNavigate();

  // Master Data Dropdown
  const [kategoriList, setKategoriList] = useState<DropdownItem[]>([]);
  const [sektorList, setSektorList] = useState<DropdownItem[]>([]);
  const [provinsiList, setProvinsiList] = useState<DropdownItem[]>([]);
  const [kabupatenList, setKabupatenList] = useState<DropdownItem[]>([]);
  const [kecamatanList, setKecamatanList] = useState<DropdownItem[]>([]);
  const [kelurahanList, setKelurahanList] = useState<DropdownItem[]>([]);

  // Loading States
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingKab, setLoadingKab] = useState(false);
  const [loadingKec, setLoadingKec] = useState(false);
  const [loadingKel, setLoadingKel] = useState(false);

  // Form State
  const [jenisPengaduan, setJenisPengaduan] = useState("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [lainnya, setLainnya] = useState("");
  const [tanggalPelaporan, setTanggalPelaporan] = useState("");
  const [nomorTiket, setNomorTiket] = useState("");

  const [namaPelapor, setNamaPelapor] = useState("Ikko");
  const [nik, setNik] = useState("");
  const [alamatPelapor, setAlamatPelapor] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [jabatan, setJabatan] = useState("");
  const [noTelpPelapor, setNoTelpPelapor] = useState("");
  const [emailPelapor, setEmailPelapor] = useState("");

  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [sektorIndustri, setSektorIndustri] = useState("");
  const [sectorId, setSectorId] = useState<number | string>("");
  const [jumlahPekerja, setJumlahPekerja] = useState<number | string>(0);

  // Cascading Wilayah State (Code dipakai untuk query path backend, Name untuk display/payload)
  const [selectedProvCode, setSelectedProvCode] = useState<string>("");
  const [provinsiName, setProvinsiName] = useState<string>("");

  const [selectedCityCode, setSelectedCityCode] = useState<string>("");
  const [kabupatenName, setKabupatenName] = useState<string>("");

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [kecamatanName, setKecamatanName] = useState<string>("");

  const [selectedVillageCode, setSelectedVillageCode] = useState<string>("");
  const [kelurahanName, setKelurahanName] = useState<string>("");

  const [noTelpPerusahaan, setNoTelpPerusahaan] = useState("");
  const [emailPerusahaan, setEmailPerusahaan] = useState("");
  const [alamatPerusahaan, setAlamatPerusahaan] = useState("");

  // Inisialisasi tanggal di browser client untuk menghindari hydration warning


  // 1. Fetch Kategori, Sektor, & Provinsi dari Backend
  useEffect(() => {
    const fetchInitialData = async () => {
      const token =
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Kategori: GET /api/complaint-categories
      try {
        const resCat = await fetch(`${BASE_API_URL}/complaint-categories`, { headers });
        if (resCat.ok) {
          const jsonCat = await resCat.json();
          const items = Array.isArray(jsonCat?.data)
            ? jsonCat.data
            : Array.isArray(jsonCat)
            ? jsonCat
            : [];
          setKategoriList(
            items.map((item: any) => ({
              id: item.id,
              name: item.category_name || item.name || item.category_code,
            }))
          );
        }
      } catch (e) {
        console.error("Gagal load complaint-categories:", e);
      }

      // Sektor: GET /api/industrial-sectors
      try {
        const resSek = await fetch(`${BASE_API_URL}/industrial-sectors`, { headers });
        if (resSek.ok) {
          const jsonSek = await resSek.json();
          const items = Array.isArray(jsonSek?.data)
            ? jsonSek.data
            : Array.isArray(jsonSek)
            ? jsonSek
            : [];
          setSektorList(
            items.map((item: any) => ({
              id: item.id,
              name: item.sector_name || item.name,
            }))
          );
        }
      } catch (e) {
        console.error("Gagal load industrial-sectors:", e);
      }

      // Provinsi: GET /api/provinces (Key-Value Object)
      try {
        setLoadingProv(true);
        const resProv = await fetch(`${BASE_API_URL}/provinces`, { headers });
        if (resProv.ok) {
          const jsonProv = await resProv.json();
          const parsed = parseLocationResponse(jsonProv);
          setProvinsiList(parsed);
        }
      } catch (e) {
        console.error("Gagal load provinces:", e);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Fetch Kota/Kabupaten: GET /api/cities/{province_code}
  useEffect(() => {
    setSelectedCityCode("");
    setKabupatenName("");
    setSelectedDistrictCode("");
    setKecamatanName("");
    setSelectedVillageCode("");
    setKelurahanName("");
    setKabupatenList([]);
    setKecamatanList([]);
    setKelurahanList([]);

    if (!selectedProvCode) return;

    const fetchCities = async () => {
      setLoadingKab(true);
      try {
        const res = await fetch(
          `${BASE_API_URL}/cities/${encodeURIComponent(selectedProvCode)}`
        );
        if (res.ok) {
          const json = await res.json();
          const parsed = parseLocationResponse(json);
          setKabupatenList(parsed);
        }
      } catch (e) {
        console.error("Gagal load cities:", e);
      } finally {
        setLoadingKab(false);
      }
    };

    fetchCities();
  }, [selectedProvCode]);

  // 3. Fetch Kecamatan: GET /api/districts/{city_code}
  useEffect(() => {
    setSelectedDistrictCode("");
    setKecamatanName("");
    setSelectedVillageCode("");
    setKelurahanName("");
    setKecamatanList([]);
    setKelurahanList([]);

    if (!selectedCityCode) return;

    const fetchDistricts = async () => {
      setLoadingKec(true);
      try {
        const res = await fetch(
          `${BASE_API_URL}/districts/${encodeURIComponent(selectedCityCode)}`
        );
        if (res.ok) {
          const json = await res.json();
          const parsed = parseLocationResponse(json);
          setKecamatanList(parsed);
        }
      } catch (e) {
        console.error("Gagal load districts:", e);
      } finally {
        setLoadingKec(false);
      }
    };

    fetchDistricts();
  }, [selectedCityCode]);

  // 4. Fetch Kelurahan: GET /api/villages/{district_code}
  useEffect(() => {
    setSelectedVillageCode("");
    setKelurahanName("");
    setKelurahanList([]);

    if (!selectedDistrictCode) return;

    const fetchVillages = async () => {
      setLoadingKel(true);
      try {
        const res = await fetch(
          `${BASE_API_URL}/villages/${encodeURIComponent(selectedDistrictCode)}`
        );
        if (res.ok) {
          const json = await res.json();
          const parsed = parseLocationResponse(json);
          setKelurahanList(parsed);
        }
      } catch (e) {
        console.error("Gagal load villages:", e);
      } finally {
        setLoadingKel(false);
      }
    };

    fetchVillages();
  }, [selectedDistrictCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      category_id: categoryId,
      jenisPengaduan,
      lainnya,
      tanggalPelaporan,
      nomorTiket,
      namaPelapor,
      nik,
      alamatPelapor,
      jenisKelamin,
      jabatan,
      noTelpPelapor,
      emailPelapor,
      namaPerusahaan,
      sector_id: sectorId,
      sektorIndustri,
      jumlahPekerja,
      provinsi: provinsiName,
      province_code: selectedProvCode,
      kabupaten: kabupatenName,
      city_code: selectedCityCode,
      kecamatan: kecamatanName,
      district_code: selectedDistrictCode,
      kelurahan: kelurahanName,
      village_code: selectedVillageCode,
      noTelpPerusahaan,
      emailPerusahaan,
      alamatPerusahaan,
    };

    sessionStorage.setItem("draft_pengaduan", JSON.stringify(formData));
    navigate({ to: "/bukti_pendukung" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800" suppressHydrationWarning>
      {/* Navbar Atas */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-2xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={kemnakerLogo}
              alt="Logo Kemnaker"
              className="h-8 w-auto object-contain"
            />
            <span className="text-[14px] font-bold text-gray-900 tracking-tight">
              Kementerian Ketenagakerjaan
            </span>
          </div>

          <nav className="flex items-center gap-6 text-[12px] font-medium text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              Beranda
            </Link>
            <Link
              to="/pengaduan"
              className="font-semibold text-[#0E3B68] hover:text-[#0E3B68] transition-colors"
            >
              Pengaduan
            </Link>
            <Link to="/survei" className="hover:text-gray-900 transition-colors">
              Survei
            </Link>
          </nav>
        </div>
      </header>

      {/* Form Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
            Formulir Pengaduan
          </h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Mohon lengkapi data diri dan informasi perusahaan Anda dengan akurat untuk memproses laporan ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
          {/* ================= CARD 1: JENIS PENGADUAN ================= */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-[13px] font-bold text-gray-900">
                Jenis Pengaduan
              </h2>
            </div>

            <div className="space-y-4 text-[11px]">
              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  Jenis Pengaduan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    suppressHydrationWarning
                    value={categoryId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setCategoryId(selId);
                      const matched = kategoriList.find((k) => String(k.id) === selId);
                      setJenisPengaduan(matched ? matched.name : "");
                    }}
                    required
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer"
                  >
                    <option value="">Pilih Jenis Pengaduan</option>
                    {kategoriList.map((kat) => (
                      <option key={kat.id} value={kat.id}>
                        {kat.name}
                      </option>
                    ))}
                    <option value="other">Lainnya</option>
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                    ▼
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  Lainnya <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={lainnya}
                  onChange={(e) => setLainnya(e.target.value)}
                  placeholder="Masukkan Jenis Pengaduan"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Tanggal Pelaporan <span className="text-red-500">*</span>
                  </label>
                  <input
                    suppressHydrationWarning
                    type="date"
                    value={tanggalPelaporan}
                    onChange={(e) => setTanggalPelaporan(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Nomor Tiket <span className="text-red-500">*</span>
                  </label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={nomorTiket}
                    onChange={(e) => setNomorTiket(e.target.value)}
                    placeholder="A-123"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================= CARD 2: DATA PELAPOR ================= */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-[13px] font-bold text-gray-900">
                Data Pelapor
              </h2>
            </div>

            <div className="space-y-4 text-[11px]">
              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  Nama Pelapor <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={namaPelapor}
                  onChange={(e) => setNamaPelapor(e.target.value)}
                  placeholder="Nama Lengkap Pelapor"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  NIK <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="Masukkan 16 digit NIK"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={alamatPelapor}
                  onChange={(e) => setAlamatPelapor(e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-5 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        suppressHydrationWarning
                        type="radio"
                        name="jenisKelamin"
                        value="Laki-laki"
                        checked={jenisKelamin === "Laki-laki"}
                        onChange={() => setJenisKelamin("Laki-laki")}
                        className="h-3.5 w-3.5 text-[#0E3B68] focus:ring-[#0E3B68]"
                      />
                      <span className="text-[11px] text-gray-700">Laki-laki</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        suppressHydrationWarning
                        type="radio"
                        name="jenisKelamin"
                        value="Perempuan"
                        checked={jenisKelamin === "Perempuan"}
                        onChange={() => setJenisKelamin("Perempuan")}
                        className="h-3.5 w-3.5 text-[#0E3B68] focus:ring-[#0E3B68]"
                      />
                      <span className="text-[11px] text-gray-700">Perempuan</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Contoh: Staff"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  No Telp <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="tel"
                  value={noTelpPelapor}
                  onChange={(e) => setNoTelpPelapor(e.target.value)}
                  placeholder="08xx xxxx xxxx"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>{" "}
                  <span className="text-gray-400 font-normal">
                    (Alamat email yang digunakan untuk mengirim berkas pengaduan)
                  </span>
                </label>
                <input
                  suppressHydrationWarning
                  type="email"
                  value={emailPelapor}
                  onChange={(e) => setEmailPelapor(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-[10.5px] leading-relaxed text-amber-900">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p>
                  <strong className="font-semibold text-amber-700">PENTING:</strong>{" "}
                  Alamat email yang dicantumkan di formulir ini harus sama persis dengan alamat email yang Anda gunakan saat mengirimkan dokumen/berkas pengaduan untuk kebutuhan verifikasi.
                </p>
              </div>
            </div>
          </section>

          {/* ================= CARD 3: DATA PERUSAHAAN ================= */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600">
                <Building2 className="h-4 w-4" />
              </div>
              <h2 className="text-[13px] font-bold text-gray-900">
                Data Perusahaan
              </h2>
            </div>

            <div className="space-y-4 text-[11px]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    value={namaPerusahaan}
                    onChange={(e) => setNamaPerusahaan(e.target.value)}
                    placeholder="PT / CV ...."
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Sektor Industri <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      suppressHydrationWarning
                      value={sectorId}
                      onChange={(e) => {
                        const selId = e.target.value;
                        setSectorId(selId);
                        const matched = sektorList.find((s) => String(s.id) === selId);
                        setSektorIndustri(matched ? matched.name : "");
                      }}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer"
                    >
                      <option value="">Pilih Sektor</option>
                      {sektorList.map((sek) => (
                        <option key={sek.id} value={sek.id}>
                          {sek.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Jumlah Pekerja <span className="text-red-500">*</span>
                  </label>
                  <input
                    suppressHydrationWarning
                    type="number"
                    value={jumlahPekerja}
                    onChange={(e) => setJumlahPekerja(e.target.value)}
                    placeholder="0"
                    min={0}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                  />
                </div>

                {/* Dropdown 1: Provinsi -> GET /api/provinces */}
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Provinsi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      suppressHydrationWarning
                      value={selectedProvCode}
                      onChange={(e) => {
                        const provCode = e.target.value;
                        setSelectedProvCode(provCode);
                        const matched = provinsiList.find(
                          (p) => String(p.code) === provCode
                        );
                        setProvinsiName(matched ? matched.name : "");
                      }}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer"
                    >
                      <option value="">
                        {loadingProv ? "Memuat data provinsi..." : "Pilih Provinsi"}
                      </option>
                      {provinsiList.map((prov) => (
                        <option key={prov.id} value={prov.code}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                      {loadingProv ? (
                        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                      ) : (
                        "▼"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Dropdown 2: Kota / Kabupaten -> GET /api/cities/{province_code} */}
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Kota/Kabupaten <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      suppressHydrationWarning
                      value={selectedCityCode}
                      onChange={(e) => {
                        const cityCode = e.target.value;
                        setSelectedCityCode(cityCode);
                        const matched = kabupatenList.find(
                          (k) => String(k.code) === cityCode
                        );
                        setKabupatenName(matched ? matched.name : "");
                      }}
                      disabled={!selectedProvCode || loadingKab}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">
                        {!selectedProvCode
                          ? "Pilih Provinsi terlebih dahulu"
                          : loadingKab
                          ? "Memuat kota/kabupaten..."
                          : "Pilih Kota/Kabupaten"}
                      </option>
                      {kabupatenList.map((kab) => (
                        <option key={kab.id} value={kab.code}>
                          {kab.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                      {loadingKab ? (
                        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                      ) : (
                        "▼"
                      )}
                    </span>
                  </div>
                </div>

                {/* Dropdown 3: Kecamatan -> GET /api/districts/{city_code} */}
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      suppressHydrationWarning
                      value={selectedDistrictCode}
                      onChange={(e) => {
                        const distCode = e.target.value;
                        setSelectedDistrictCode(distCode);
                        const matched = kecamatanList.find(
                          (kc) => String(kc.code) === distCode
                        );
                        setKecamatanName(matched ? matched.name : "");
                      }}
                      disabled={!selectedCityCode || loadingKec}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">
                        {!selectedCityCode
                          ? "Pilih Kota/Kabupaten terlebih dahulu"
                          : loadingKec
                          ? "Memuat kecamatan..."
                          : "Pilih Kecamatan"}
                      </option>
                      {kecamatanList.map((kec) => (
                        <option key={kec.id} value={kec.code}>
                          {kec.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                      {loadingKec ? (
                        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                      ) : (
                        "▼"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Dropdown 4: Kelurahan -> GET /api/villages/{district_code} */}
                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Kelurahan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      suppressHydrationWarning
                      value={selectedVillageCode}
                      onChange={(e) => {
                        const villCode = e.target.value;
                        setSelectedVillageCode(villCode);
                        const matched = kelurahanList.find(
                          (kl) => String(kl.code) === villCode
                        );
                        setKelurahanName(matched ? matched.name : "");
                      }}
                      disabled={!selectedDistrictCode || loadingKel}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">
                        {!selectedDistrictCode
                          ? "Pilih Kecamatan terlebih dahulu"
                          : loadingKel
                          ? "Memuat kelurahan..."
                          : "Pilih Kelurahan"}
                      </option>
                      {kelurahanList.map((kel) => (
                        <option key={kel.id} value={kel.code}>
                          {kel.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                      {loadingKel ? (
                        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                      ) : (
                        "▼"
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-medium text-gray-700">
                    Email Perusahaan
                  </label>
                  <input
                    suppressHydrationWarning
                    type="email"
                    value={emailPerusahaan}
                    onChange={(e) => setEmailPerusahaan(e.target.value)}
                    placeholder="hrdperusahaan.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  No Telp Perusahaan
                </label>
                <input
                  suppressHydrationWarning
                  type="tel"
                  value={noTelpPerusahaan}
                  onChange={(e) => setNoTelpPerusahaan(e.target.value)}
                  placeholder="021-xxxxxxx"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  Alamat Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={alamatPerusahaan}
                  onChange={(e) => setAlamatPerusahaan(e.target.value)}
                  placeholder="Jalan, Gedung, dll"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
                />
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali</span>
            </button>

            <button
              suppressHydrationWarning
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E3B68] px-6 py-2.5 text-[11px] font-semibold text-white shadow-xs hover:bg-[#0a2c4e] transition-colors cursor-pointer"
            >
              <span>Lanjut ke Detail Aduan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
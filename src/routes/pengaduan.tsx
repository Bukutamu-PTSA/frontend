import React, { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  FileText,
  User,
  Building2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  XIcon,
  Facebook,
  Instagram,
  MapPin,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import kemnakerLogo from "@/assets/kemnaker_logo.png";
import { API_BASE_URL as BASE_API_URL } from "@/lib/api";
import {
  PAGE_TITLES,
  ORGANIZATION_NAME,
  ORGANIZATION_NAME_SHORT,
  ORGANIZATION_UNIT,
  ORGANIZATION_UNIT_FULL,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ADDRESS_LINE_3,
  CONTACT_EMAIL,
  CONTACT_EMAIL_LABEL,
  MAPS_URL,
  SOCIAL_LINKS,
  COPYRIGHT_YEARS,
} from "@/config/app";

const iconMap = {
  XIcon,
  Facebook,
  Instagram,
};

export const Route = createFileRoute("/pengaduan")({
  head: () => ({
    meta: [
      {
        title: PAGE_TITLES.pengaduan,
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
          item.village_code,
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

/**
 * Nama field untuk pesan "wajib diisi": data-label, atau teks <label> terdekat
 * (tanpa tanda * dan keterangan dalam kurung).
 */
function fieldLabel(el: Element): string {
  const explicit = (el as HTMLElement).dataset?.["label"];
  if (explicit) return explicit;
  let node: Element | null = el.parentElement;
  while (node) {
    const label = node.querySelector("label");
    if (label) {
      const text = (label.firstChild?.textContent ?? label.textContent ?? "")
        .replace(/\*/g, "")
        .replace(/\(.*?\)/g, "")
        .trim();
      if (text) return text;
    }
    node = node.parentElement;
  }
  return "Field ini";
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

  const [namaPelapor, setNamaPelapor] = useState("");
  const [nik, setNik] = useState("");
  const [alamatPelapor, setAlamatPelapor] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [jabatan, setJabatan] = useState("");
  const [noTelpPelapor, setNoTelpPelapor] = useState("");
  const [emailPelapor, setEmailPelapor] = useState("");

  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [sektorIndustri, setSektorIndustri] = useState("");
  const [sectorId, setSectorId] = useState<number | string>("");
  const [jumlahPekerja, setJumlahPekerja] = useState<string>("");

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

  const pendingWilayahRef = useRef<any>(null);

  // 0. Pulihkan data form bila user kembali dari halaman bukti_pendukung.
  useEffect(() => {
    let draft: any = null;
    try {
      const raw = sessionStorage.getItem("draft_pengaduan");
      draft = raw ? JSON.parse(raw) : null;
    } catch {
      draft = null;
    }
    if (!draft || typeof draft !== "object") return;

    const str = (v: unknown) => (v == null ? "" : String(v));
    setCategoryId(draft.category_id ?? "");
    setJenisPengaduan(str(draft.jenisPengaduan));
    setLainnya(str(draft.lainnya));
    setTanggalPelaporan(str(draft.tanggalPelaporan));
    setNamaPelapor(str(draft.namaPelapor));
    setNik(str(draft.nik));
    setAlamatPelapor(str(draft.alamatPelapor));
    setJenisKelamin(draft.jenisKelamin === "Perempuan" ? "Perempuan" : "Laki-laki");
    setJabatan(str(draft.jabatan));
    setNoTelpPelapor(str(draft.noTelpPelapor));
    setEmailPelapor(str(draft.emailPelapor));
    setNamaPerusahaan(str(draft.namaPerusahaan));
    setSectorId(draft.sector_id ?? "");
    setSektorIndustri(str(draft.sektorIndustri));
    setJumlahPekerja(str(draft.jumlahPekerja));
    setNoTelpPerusahaan(str(draft.noTelpPerusahaan));
    setEmailPerusahaan(str(draft.emailPerusahaan));
    setAlamatPerusahaan(str(draft.alamatPerusahaan));

    if (draft.province_code) {
      pendingWilayahRef.current = draft;
      setSelectedProvCode(str(draft.province_code));
      setProvinsiName(str(draft.provinsi));
    }
  }, []);

  // 1. Fetch Kategori, Sektor, & Provinsi dari Backend
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

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
            })),
          );
        }
      } catch (e) {
        console.error("Gagal load complaint-categories:", e);
      }

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
            })),
          );
        }
      } catch (e) {
        console.error("Gagal load industrial-sectors:", e);
      }

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

  // 2. Fetch Kota/Kabupaten
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

    const pending = pendingWilayahRef.current;
    if (pending && String(pending.province_code) === selectedProvCode) {
      if (pending.city_code) {
        setSelectedCityCode(String(pending.city_code));
        setKabupatenName(String(pending.kabupaten ?? ""));
      } else {
        pendingWilayahRef.current = null;
      }
    }

    const fetchCities = async () => {
      setLoadingKab(true);
      try {
        const res = await fetch(`${BASE_API_URL}/cities/${encodeURIComponent(selectedProvCode)}`);
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

  // 3. Fetch Kecamatan
  useEffect(() => {
    setSelectedDistrictCode("");
    setKecamatanName("");
    setSelectedVillageCode("");
    setKelurahanName("");
    setKecamatanList([]);
    setKelurahanList([]);

    if (!selectedCityCode) return;

    const pending = pendingWilayahRef.current;
    if (pending && String(pending.city_code) === selectedCityCode) {
      if (pending.district_code) {
        setSelectedDistrictCode(String(pending.district_code));
        setKecamatanName(String(pending.kecamatan ?? ""));
      } else {
        pendingWilayahRef.current = null;
      }
    }

    const fetchDistricts = async () => {
      setLoadingKec(true);
      try {
        const res = await fetch(
          `${BASE_API_URL}/districts/${encodeURIComponent(selectedCityCode)}`,
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

  // 4. Fetch Kelurahan
  useEffect(() => {
    setSelectedVillageCode("");
    setKelurahanName("");
    setKelurahanList([]);

    if (!selectedDistrictCode) return;

    const pending = pendingWilayahRef.current;
    if (pending && String(pending.district_code) === selectedDistrictCode) {
      if (pending.village_code) {
        setSelectedVillageCode(String(pending.village_code));
        setKelurahanName(String(pending.kelurahan ?? ""));
      }
      pendingWilayahRef.current = null;
    }

    const fetchVillages = async () => {
      setLoadingKel(true);
      try {
        const res = await fetch(
          `${BASE_API_URL}/villages/${encodeURIComponent(selectedDistrictCode)}`,
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyField = Array.from(e.currentTarget.elements).find(
      (el): el is HTMLInputElement =>
        (el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement) &&
        el.required &&
        !el.disabled &&
        el.type !== "radio" &&
        el.value.trim() === "",
    );
    if (emptyField) {
      toast.error(`${fieldLabel(emptyField)} wajib diisi.`);
      emptyField.scrollIntoView({ behavior: "smooth", block: "center" });
      emptyField.focus();
      return;
    }

    const invalid: { id: string; message: string } | null = !/^\d{16}$/.test(nik)
      ? { id: "nik", message: "NIK harus 16 digit angka." }
      : !jumlahPekerja.trim()
        ? { id: "jumlahPekerja", message: "Jumlah Pekerja wajib diisi." }
        : !noTelpPerusahaan.trim()
          ? { id: "noTelpPerusahaan", message: "No Telp Perusahaan wajib diisi." }
          : !/^[0-9+\-() ]{8,20}$/.test(noTelpPerusahaan.trim())
            ? { id: "noTelpPerusahaan", message: "Format No Telp Perusahaan tidak valid." }
            : !emailPerusahaan.trim()
              ? { id: "emailPerusahaan", message: "Email Perusahaan wajib diisi." }
              : null;
    if (invalid) {
      toast.error(invalid.message);
      const el = document.getElementById(invalid.id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
      return;
    }

    const formData = {
      category_id: categoryId,
      jenisPengaduan,
      lainnya,
      tanggalPelaporan,
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
            <img src={kemnakerLogo} alt={`Logo ${ORGANIZATION_NAME_SHORT}`} className="h-8 w-auto object-contain" />
            <span className="text-[14px] font-bold text-gray-900 tracking-tight">
              {ORGANIZATION_NAME_SHORT}
            </span>
          </div>

          <nav className="flex items-center gap-6 text-[12px] font-medium text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              Beranda
            </Link>
            <Link
              to="/pengaduan"
              className="font-semibold text-brand-secondary hover:text-brand-secondary transition-colors"
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
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Formulir Pengaduan</h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Mohon lengkapi data diri dan informasi perusahaan Anda dengan akurat untuk memproses
            laporan ini.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          suppressHydrationWarning
          onInvalidCapture={(e) => {
            const el = e.target as unknown as HTMLInputElement;
            if (el.validity?.valueMissing) {
              el.setCustomValidity(`${fieldLabel(el)} wajib diisi.`);
            }
          }}
          onInputCapture={(e) =>
            (e.target as unknown as HTMLInputElement).setCustomValidity?.("")
          }
          onChangeCapture={(e) =>
            (e.target as unknown as HTMLInputElement).setCustomValidity?.("")
          }
        >
          {/* ================= CARD 1: JENIS PENGADUAN ================= */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-[13px] font-bold text-gray-900">Jenis Pengaduan</h2>
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
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer"
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
                  Lainnya{" "}
                  {String(categoryId) === "other" && <span className="text-red-500">*</span>}
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={lainnya}
                  onChange={(e) => setLainnya(e.target.value)}
                  disabled={String(categoryId) !== "other"}
                  required={String(categoryId) === "other"}
                  data-label="Jenis Pengaduan Lainnya"
                  placeholder={
                    String(categoryId) === "other"
                      ? "Masukkan Jenis Pengaduan"
                      : 'Pilih "Lainnya" pada Jenis Pengaduan dahulu'
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
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
              <h2 className="text-[13px] font-bold text-gray-900">Data Pelapor</h2>
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  NIK <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  id="nik"
                  type="text"
                  inputMode="numeric"
                  value={nik}
                  onChange={(e) => {
                    e.currentTarget.setCustomValidity("");
                    setNik(e.target.value.replace(/\D/g, "").slice(0, 16));
                  }}
                  onInvalid={(e) =>
                    e.currentTarget.setCustomValidity(
                      e.currentTarget.value ? "NIK harus 16 digit angka." : "NIK wajib diisi.",
                    )
                  }
                  placeholder="Masukkan 16 digit NIK"
                  pattern="[0-9]{16}"
                  minLength={16}
                  maxLength={16}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
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
                        className="h-3.5 w-3.5 text-brand-secondary focus:ring-brand-secondary"
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
                        className="h-3.5 w-3.5 text-brand-secondary focus:ring-brand-secondary"
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="email"
                  value={emailPelapor}
                  onChange={(e) => setEmailPelapor(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                />
              </div>
            </div>
          </section>

          {/* ================= CARD 3: DATA PERUSAHAAN ================= */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600">
                <Building2 className="h-4 w-4" />
              </div>
              <h2 className="text-[13px] font-bold text-gray-900">Data Perusahaan</h2>
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
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
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer"
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
                    id="jumlahPekerja"
                    type="text"
                    value={jumlahPekerja}
                    onChange={(e) => {
                      e.currentTarget.setCustomValidity("");
                      setJumlahPekerja(e.target.value);
                    }}
                    onInvalid={(e) =>
                      e.currentTarget.setCustomValidity(
                        e.currentTarget.value.trim() === ""
                          ? "Jumlah Pekerja wajib diisi."
                          : "Jumlah Pekerja wajib diisi.",
                      )
                    }
                    placeholder="Minimal 1 Tenaga Kerja"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                  />
                </div>

                {/* Dropdown 1: Provinsi */}
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
                        const matched = provinsiList.find((p) => String(p.code) === provCode);
                        setProvinsiName(matched ? matched.name : "");
                      }}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer"
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
                {/* Dropdown 2: Kota / Kabupaten */}
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
                        const matched = kabupatenList.find((k) => String(k.code) === cityCode);
                        setKabupatenName(matched ? matched.name : "");
                      }}
                      disabled={!selectedProvCode || loadingKab}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
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

                {/* Dropdown 3: Kecamatan */}
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
                        const matched = kecamatanList.find((kc) => String(kc.code) === distCode);
                        setKecamatanName(matched ? matched.name : "");
                      }}
                      disabled={!selectedCityCode || loadingKec}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
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
                {/* Dropdown 4: Kelurahan */}
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
                        const matched = kelurahanList.find((kl) => String(kl.code) === villCode);
                        setKelurahanName(matched ? matched.name : "");
                      }}
                      disabled={!selectedDistrictCode || loadingKel}
                      required
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
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
                    Email Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    suppressHydrationWarning
                    id="emailPerusahaan"
                    type="email"
                    value={emailPerusahaan}
                    onChange={(e) => {
                      e.currentTarget.setCustomValidity("");
                      setEmailPerusahaan(e.target.value);
                    }}
                    onInvalid={(e) =>
                      e.currentTarget.setCustomValidity(
                        e.currentTarget.value
                          ? "Format Email Perusahaan tidak valid."
                          : "Email Perusahaan wajib diisi.",
                      )
                    }
                    required
                    placeholder="hrdperusahaan.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700">
                  No Telp Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  id="noTelpPerusahaan"
                  type="tel"
                  value={noTelpPerusahaan}
                  onChange={(e) => {
                    e.currentTarget.setCustomValidity("");
                    setNoTelpPerusahaan(e.target.value);
                  }}
                  onInvalid={(e) =>
                    e.currentTarget.setCustomValidity(
                      e.currentTarget.value
                        ? "Format No Telp Perusahaan tidak valid (8–20 karakter: angka, spasi, +, -, ( ))."
                        : "No Telp Perusahaan wajib diisi.",
                    )
                  }
                  required
                  pattern="[0-9+\-\(\) ]{8,20}"
                  maxLength={20}
                  inputMode="tel"
                  placeholder="021-xxxxxxx"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-secondary px-6 py-2.5 text-[11px] font-semibold text-white shadow-xs hover:bg-brand-secondary-hover transition-colors cursor-pointer"
            >
              <span>Lanjut ke Detail Aduan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-brand-primary text-white mt-16">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Kolom 1: Brand */}
            <div>
              <h3 className="text-xl font-bold">{ORGANIZATION_UNIT}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                {ORGANIZATION_UNIT_FULL} adalah unsur pelaksana yang berada di bawah dan
                bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="mt-6 flex gap-3">
                {SOCIAL_LINKS.map(({ icon, href }, i) => {
                  const Icon = iconMap[icon as keyof typeof iconMap];
                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-white"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Kolom 2: Kontak & Bantuan */}
            <div>
              <h4 className="text-lg font-semibold">Ada Pertanyaan?</h4>
              <hr className="mt-4 border-white/15" />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex gap-3 text-sm text-gray-300 transition-colors hover:text-emerald-400"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="leading-relaxed">
                  {ADDRESS_LINE_1}, {ADDRESS_LINE_2}, {ADDRESS_LINE_3}
                </p>
              </a>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Mail className="size-5 text-emerald-400" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  {CONTACT_EMAIL_LABEL}
                </a>
              </div>
              {/* FAQ di bawah kontak */}
              <div className="mt-6 pt-4 border-t border-white/15">
                <Link
                  to="/faqpage"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <span className="text-emerald-400">›</span> FAQ
                </Link>
              </div>
            </div>
          </div>

          <hr className="mt-10 border-white/15" />

          <div className="mt-6 flex flex-col items-center gap-1 text-center text-sm text-gray-300">
            <p>© {COPYRIGHT_YEARS} {ORGANIZATION_NAME}. Seluruh Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
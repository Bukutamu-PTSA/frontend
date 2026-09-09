import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, Building2, Loader2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const BASE_API_URL = "http://192.168.147.199:8000/api";

export type DetailBerkasSearch = {
  id?: string | number;
};

export const Route = createFileRoute("/admin/detail_berkas")({
  validateSearch: (search: Record<string, unknown>): DetailBerkasSearch => {
    return {
      id: search["id"] ? String(search["id"]) : "",
    };
  },
  head: () => ({
    meta: [
      {
        title: "Report Pelayanan - PTSA KEMNAKER",
      },
    ],
  }),
  component: DetailBerkasPage,
});

interface ComplaintDetailData {
  id: number | string;
  jenisPengaduan: string;
  categoryId: number;
  namaLengkap: string;
  nik: string;
  alamatPelapor: string;
  jenisKelamin: string;
  jabatan: string;
  noTelpPelapor: string;
  emailPelapor: string;
  tglPelaporan: string;

  namaPerusahaan: string;
  sektorIndustri: string;
  alamatPerusahaan: string;
  alamatPerusahaanKantor: string;
  jumlahTenagaKerja: number;
  provinsi: string;
  kotaKab: string;
  kecamatan: string;
  kelurahan: string;
  noTelpPerusahaan: string;
  emailPerusahaan: string;

  deskripsiAduan: string;
  photoUrl: string;
}

function DetailBerkasPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const complaintId = search.id;

  const [activeTab, setActiveTab] = useState<"detail" | "edit">("detail");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Inisialisasi awal kosong tanpa data dummy Budi
  const [data, setData] = useState<ComplaintDetailData | null>(null);

  useEffect(() => {
    if (!complaintId) {
      setErrorMsg("ID Pengaduan tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setErrorMsg(null);
      const token =
        localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      try {
        const res = await fetch(`${BASE_API_URL}/complaints/${complaintId}`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const json = await res.json().catch(() => null);
        console.log("Raw response detail dari backend:", json);

        if (!res.ok || !json) {
          throw new Error(
            json?.message || `Gagal mengambil data pengaduan (Status: ${res.status})`
          );
        }

        // Tangkap objek item complaint
        const item = json.data ?? json.complaint ?? json;

        if (!item || typeof item !== "object") {
          throw new Error("Format payload aduan tidak valid dari server.");
        }

        const complainant = item.complainant || {};
        const company = item.company || {};
        const category = item.category || {};
        const attachments = Array.isArray(item.attachments) ? item.attachments : [];
        const photoAttachment = attachments.find((att: any) => att.file_type === "photo");

        setData({
          id: item.id || complaintId,
          jenisPengaduan:
            category.category_name ||
            item.category_name ||
            item.jenis_pengaduan ||
            "-",
          categoryId: category.id || item.category_id || 1,
          namaLengkap:
            complainant.nama_lengkap ||
            complainant.nama ||
            item.nama_pelapor ||
            "-",
          nik: complainant.nik || item.nik || "-",
          alamatPelapor: complainant.alamat || item.alamat_pelapor || "-",
          jenisKelamin: complainant.jenis_kelamin || item.jenis_kelamin || "-",
          jabatan: complainant.jabatan || item.jabatan || "-",
          noTelpPelapor: complainant.no_telp || item.no_telp || "-",
          emailPelapor: complainant.email || item.email || "-",
          tglPelaporan: item.complaint_date
            ? new Date(String(item.complaint_date).replace(" ", "T")).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )
            : "-",

          namaPerusahaan:
            company.nama_perusahaan || item.nama_perusahaan || "-",
          sektorIndustri:
            company.sector?.sector_name ||
            company.sektor_industri ||
            item.sektor_industri ||
            "-",
          alamatPerusahaan:
            company.alamat || item.alamat_perusahaan || "-",
          alamatPerusahaanKantor:
            company.alamat || item.alamat_perusahaan || "-",
          jumlahTenagaKerja: Number(company.jumlah_naker || item.jumlah_naker || 0),
          provinsi: company.provinsi || item.provinsi || "-",
          kotaKab: company.kota_kab || company.city || item.kota_kab || "-",
          kecamatan: company.kecamatan || company.district || item.kecamatan || "-",
          kelurahan: company.kelurahan || company.village || item.kelurahan || "-",
          noTelpPerusahaan: company.no_telp || item.company_no_telp || "-",
          emailPerusahaan: company.email || item.company_email || "-",

          deskripsiAduan: item.description || item.deskripsi || "-",
          photoUrl: photoAttachment?.file_path
            ? `${BASE_API_URL.replace("/api", "")}/storage/${photoAttachment.file_path.replace(/^\/?storage\//, "")}`
            : "",
        });
      } catch (err: any) {
        console.error("Fetch detail berkas error:", err);
        setErrorMsg(err.message || "Terjadi kesalahan saat memuat data berkas.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [complaintId]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    if (!agreedTerms) {
      alert("Harap centang persetujuan 'terms and conditions' terlebih dahulu.");
      return;
    }

    setSaving(true);
    const token =
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

    const payload = {
      description: data.deskripsiAduan,
      complainant: {
        nama_lengkap: data.namaLengkap,
        nik: data.nik,
        alamat: data.alamatPelapor,
        jenis_kelamin: data.jenisKelamin,
        jabatan: data.jabatan,
        no_telp: data.noTelpPelapor,
        email: data.emailPelapor,
      },
      company: {
        nama_perusahaan: data.namaPerusahaan,
        sektor_industri: data.sektorIndustri,
        alamat: data.alamatPerusahaan,
        jumlah_naker: data.jumlahTenagaKerja,
        provinsi: data.provinsi,
        kota_kab: data.kotaKab,
        kecamatan: data.kecamatan,
        kelurahan: data.kelurahan,
        no_telp: data.noTelpPerusahaan,
        email: data.emailPerusahaan,
      },
    };

    try {
      const res = await fetch(`${BASE_API_URL}/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Gagal memperbarui data aduan.");
      }

      alert("Data berhasil diperbarui!");
      setActiveTab("detail");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-[20px] font-normal text-gray-800 tracking-tight">
          View
        </h1>

        {loading ? (
          <div className="flex h-72 items-center justify-center rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
              <span>Memuat detail berkas #{complaintId}...</span>
            </div>
          </div>
        ) : errorMsg || !data ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-white p-12 text-center shadow-2xs">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-[13px] font-semibold text-gray-800">
              {errorMsg || "Data pengaduan tidak ditemukan."}
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/dashboard" })}
              className="rounded-md bg-[#0B3B70] px-4 py-1.5 text-[11px] font-medium text-white hover:bg-[#092e57]"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* ================= SISI KIRI: PROFILE CARD ================= */}
            <div className="w-full lg:w-[280px] shrink-0 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center text-center shadow-2xs">
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-2xl bg-[#EDF2F7] flex items-center justify-center">
                  {data.photoUrl ? (
                    <img
                      src={data.photoUrl}
                      alt={data.namaLengkap}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-9 w-9 text-gray-400 stroke-[1.5]" />
                  )}
                </div>

                <h2 className="text-[17px] font-bold text-gray-900 leading-tight">
                  {data.namaLengkap}
                </h2>
                <p className="text-[12px] text-gray-500 mt-1 mb-5">
                  {data.jabatan}
                </p>

                <button
                  type="button"
                  onClick={() => navigate({ to: "/admin/dashboard" })}
                  className="w-full rounded-md bg-[#0B3B70] py-2 text-[12px] font-semibold text-white hover:bg-[#092e57] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
                <div className="bg-[#0B3B70] px-4 py-2.5">
                  <h3 className="text-[12px] font-bold text-white tracking-wide">
                    Tentang Pelapor
                  </h3>
                </div>

                <div className="p-4 space-y-4 text-[11.5px]">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-gray-800 mb-1">
                      <User className="h-3.5 w-3.5 text-gray-600" />
                      <span>Nama Pelapor</span>
                    </div>
                    <p className="text-gray-700 pl-5.5 font-normal">
                      {data.namaLengkap}
                    </p>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <div className="flex items-center gap-2 font-bold text-gray-800 mb-1">
                      <Building2 className="h-3.5 w-3.5 text-gray-600" />
                      <span>Alamat Perusahaan</span>
                    </div>
                    <p className="text-gray-700 pl-5.5 font-normal leading-relaxed">
                      {data.alamatPerusahaanKantor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= SISI KANAN: MAIN CONTENT (DETAIL / EDIT) ================= */}
            <div className="flex-1 w-full bg-white rounded-lg border border-gray-200 shadow-2xs overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("detail")}
                    className={`px-7 py-1.5 rounded-md text-[11.5px] font-semibold transition-colors cursor-pointer ${
                      activeTab === "detail"
                        ? "bg-[#0B2545] text-white shadow-2xs"
                        : "text-gray-700 hover:text-gray-900 bg-transparent"
                    }`}
                  >
                    Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`px-7 py-1.5 rounded-md text-[11.5px] font-semibold transition-colors cursor-pointer ${
                      activeTab === "edit"
                        ? "bg-[#0B2545] text-white shadow-2xs"
                        : "text-gray-700 hover:text-gray-900 bg-transparent"
                    }`}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* 1. VIEW DETAIL */}
                {activeTab === "detail" && (
                  <div className="space-y-6 text-[12px]">
                    <div className="space-y-3">
                      <h3 className="text-[13px] font-bold text-gray-900">
                        Detail Pelapor
                      </h3>
                      <div className="space-y-2 text-gray-800">
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Pelaporan</span>
                          <span className="font-medium">: {data.jenisPengaduan}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Nama Lengkap</span>
                          <span className="font-medium">: {data.namaLengkap}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">NIK</span>
                          <span className="font-medium">: {data.nik}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Alamat</span>
                          <span className="font-medium">: {data.alamatPelapor}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Jenis Kelamin</span>
                          <span className="font-medium">: {data.jenisKelamin}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Jabatan</span>
                          <span className="font-medium">: {data.jabatan}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">No Telp</span>
                          <span className="font-medium">: {data.noTelpPelapor}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Email</span>
                          <span className="font-medium">: {data.emailPelapor}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Tgl Pelaporan</span>
                          <span className="font-medium">: {data.tglPelaporan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h3 className="text-[13px] font-bold text-[#008767]">
                        Detail Perusahaan
                      </h3>
                      <div className="space-y-2 text-gray-800">
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Nama Perusahaan</span>
                          <span className="font-medium">: {data.namaPerusahaan}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Sektor Industri</span>
                          <span className="font-medium">: {data.sektorIndustri}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Alamat Perusahaan</span>
                          <span className="font-medium">: {data.alamatPerusahaan}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Jumlah Tenaga Kerja</span>
                          <span className="font-medium">: {data.jumlahTenagaKerja}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Provinsi</span>
                          <span className="font-medium">: {data.provinsi}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Kota / Kabupaten</span>
                          <span className="font-medium">: {data.kotaKab}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Kecamatan</span>
                          <span className="font-medium">: {data.kecamatan}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Kelurahan</span>
                          <span className="font-medium">: {data.kelurahan}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">No Telp</span>
                          <span className="font-medium">: {data.noTelpPerusahaan}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-44 shrink-0 text-gray-600">Email</span>
                          <span className="font-medium">: {data.emailPerusahaan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <h3 className="text-[13px] font-bold text-[#008767]">
                        Detail Pengaduan
                      </h3>
                      <p className="text-[11.5px] text-gray-700 underline font-medium">
                        Deskripsi Pengaduan :
                      </p>
                      <p className="text-gray-800 leading-relaxed font-normal pt-0.5">
                        {data.deskripsiAduan}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. EDIT FORM */}
                {activeTab === "edit" && (
                  <form onSubmit={handleSaveEdit} className="space-y-3.5 text-[12px]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Jenis Pengaduan
                      </label>
                      <input
                        type="text"
                        value={data.jenisPengaduan}
                        onChange={(e) =>
                          setData({ ...data, jenisPengaduan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Nama Pelapor
                      </label>
                      <input
                        type="text"
                        value={data.namaLengkap}
                        onChange={(e) =>
                          setData({ ...data, namaLengkap: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        NIK
                      </label>
                      <input
                        type="text"
                        value={data.nik}
                        onChange={(e) => setData({ ...data, nik: e.target.value })}
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Alamat
                      </label>
                      <input
                        type="text"
                        value={data.alamatPelapor}
                        onChange={(e) =>
                          setData({ ...data, alamatPelapor: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Jenis Kelamin
                      </label>
                      <input
                        type="text"
                        value={data.jenisKelamin}
                        onChange={(e) =>
                          setData({ ...data, jenisKelamin: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={data.jabatan}
                        onChange={(e) =>
                          setData({ ...data, jabatan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        No Telp
                      </label>
                      <input
                        type="text"
                        value={data.noTelpPelapor}
                        onChange={(e) =>
                          setData({ ...data, noTelpPelapor: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Email
                      </label>
                      <input
                        type="email"
                        value={data.emailPelapor}
                        onChange={(e) =>
                          setData({ ...data, emailPelapor: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="h-1" />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Nama Perusahaan
                      </label>
                      <input
                        type="text"
                        value={data.namaPerusahaan}
                        onChange={(e) =>
                          setData({ ...data, namaPerusahaan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Sektor Industri
                      </label>
                      <input
                        type="text"
                        value={data.sektorIndustri}
                        onChange={(e) =>
                          setData({ ...data, sektorIndustri: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Alamat
                      </label>
                      <input
                        type="text"
                        value={data.alamatPerusahaan}
                        onChange={(e) =>
                          setData({ ...data, alamatPerusahaan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="h-1" />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Jumlah Pekerja
                      </label>
                      <input
                        type="number"
                        value={data.jumlahTenagaKerja}
                        onChange={(e) =>
                          setData({
                            ...data,
                            jumlahTenagaKerja: Number(e.target.value),
                          })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Provinsi
                      </label>
                      <input
                        type="text"
                        value={data.provinsi}
                        onChange={(e) =>
                          setData({ ...data, provinsi: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Kota/Kabupaten
                      </label>
                      <input
                        type="text"
                        value={data.kotaKab}
                        onChange={(e) =>
                          setData({ ...data, kotaKab: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Kecamatan
                      </label>
                      <input
                        type="text"
                        value={data.kecamatan}
                        onChange={(e) =>
                          setData({ ...data, kecamatan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Kelurahan
                      </label>
                      <input
                        type="text"
                        value={data.kelurahan}
                        onChange={(e) =>
                          setData({ ...data, kelurahan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        No Telp Perusahaan
                      </label>
                      <input
                        type="text"
                        value={data.noTelpPerusahaan}
                        onChange={(e) =>
                          setData({ ...data, noTelpPerusahaan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-44 shrink-0 text-gray-700 font-normal">
                        Email Perusahaan
                      </label>
                      <input
                        type="email"
                        value={data.emailPerusahaan}
                        onChange={(e) =>
                          setData({ ...data, emailPerusahaan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pt-1">
                      <label className="w-44 shrink-0 text-gray-700 font-normal pt-2">
                        Deskripsi Aduan
                      </label>
                      <textarea
                        rows={3}
                        value={data.deskripsiAduan}
                        onChange={(e) =>
                          setData({ ...data, deskripsiAduan: e.target.value })
                        }
                        className="flex-1 rounded-md border border-gray-300 bg-white p-3 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-start gap-2 sm:pl-[200px]">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor="terms"
                        className="text-[11px] text-gray-500 cursor-pointer select-none"
                      >
                        I agree to the{" "}
                        <span className="text-blue-500 hover:underline">
                          terms and conditions
                        </span>
                      </label>
                    </div>

                    <div className="pt-3 sm:pl-[200px]">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-md bg-[#DC2626] px-7 py-2 text-[12px] font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                      >
                        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        <span>Edit</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
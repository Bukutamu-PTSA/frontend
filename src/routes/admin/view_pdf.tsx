import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer, User, Loader2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const BASE_API_URL = "http://192.168.147.199:8000/api";

export type ViewPdfSearch = {
  id?: string | number;
};

export const Route = createFileRoute("/admin/view_pdf")({
  validateSearch: (search: Record<string, unknown>): ViewPdfSearch => {
    return {
      id: search["id"] ? String(search["id"]) : "",
    };
  },
  head: () => ({
    meta: [
      {
        title: "Cetak Dokumen Pengaduan - PTSA KEMNAKER",
      },
    ],
  }),
  component: ViewPdfPage,
});

function formatDateWithTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr.replace(" ", "T"));
    if (isNaN(d.getTime())) return dateStr;
    const formattedDate = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const formattedTime = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return `${formattedDate} - ${formattedTime.toUpperCase()}`;
  } catch {
    return dateStr;
  }
}

function formatDateIndoShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr.replace(" ", "T"));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function ViewPdfPage() {
  // Ambil id dari search query param: /admin/view_pdf?id=41
  const search = Route.useSearch();
  const complaintId = search.id;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    if (!complaintId) {
      setErrorMsg("ID pengaduan tidak ditemukan di URL.");
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
        if (!res.ok || !json) {
          throw new Error(
            json?.message || `Gagal memuat dokumen (Status: ${res.status})`
          );
        }

        const item = json.data ?? json.complaint ?? json;
        setDetail(item);
      } catch (err: any) {
        console.error("Gagal load dokumen PDF:", err);
        setErrorMsg(err.message || "Terjadi kesalahan saat memuat dokumen.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [complaintId]);

  const handlePrint = () => {
    window.print();
  };

  const complainant = detail?.complainant || {};
  const company = detail?.company || {};
  const category = detail?.category || {};
  const attachments = Array.isArray(detail?.attachments) ? detail.attachments : [];
  const photoAttachment = attachments.find((att: any) => att.file_type === "photo");

  const photoUrl = photoAttachment?.file_path
    ? `${BASE_API_URL.replace("/api", "")}/storage/${photoAttachment.file_path.replace(/^\/?storage\//, "")}`
    : "";

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Tombol Cetak Dokumen di Atas */}
        <div className="flex justify-end print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F2137] px-4 py-2 text-[11.5px] font-semibold text-white shadow-xs hover:bg-[#1a2f4a] transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center rounded-2xl border border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
              <span>Menyiapkan formulir pengaduan #{complaintId}...</span>
            </div>
          </div>
        ) : errorMsg || !detail ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-white p-12 text-center shadow-xs">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-[13px] font-semibold text-gray-800">
              {errorMsg || "Dokumen pengaduan tidak ditemukan."}
            </p>
          </div>
        ) : (
          /* ================= LEMBAR KERJA CETAK / PREVIEW A4 ================= */
          <div className="mx-auto flex justify-center pb-12 print:p-0 print:m-0">
            <div
              id="printable-area"
              className="w-full max-w-[760px] bg-white p-12 sm:p-16 border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] print:border-none print:shadow-none print:p-0 print:max-w-none text-[#1A202C] text-[11.5px] leading-relaxed font-sans"
            >
              {/* Judul Formulir */}
              <div className="text-center mb-10">
                <h1 className="text-[15px] font-bold text-gray-900 tracking-wide uppercase underline underline-offset-4">
                  FORMULIR PENGADUAN PELAYANAN
                </h1>
              </div>

              {/* Rincian Atas: Jenis Layanan & Tanggal Pelaporan */}
              <div className="space-y-1.5 mb-6 text-gray-800">
                <div className="flex">
                  <span className="w-44 shrink-0 font-medium">
                    Jenis Layanan Pengaduan
                  </span>
                  <span className="w-4 shrink-0">:</span>
                  <span className="font-bold text-gray-900">
                    {category.category_name ||
                      detail.category_name ||
                      detail.jenis_pengaduan ||
                      "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-44 shrink-0 font-medium">
                    Tanggal Pelaporan
                  </span>
                  <span className="w-4 shrink-0">:</span>
                  <span>
                    {formatDateWithTime(
                      detail.complaint_date || detail.created_at
                    )}
                  </span>
                </div>
              </div>

              {/* Section 1: Biodata Pelapor */}
              <div className="mb-6">
                <h2 className="text-[12px] font-bold text-gray-900 mb-2">
                  Biodata Pelapor
                </h2>
                <div className="space-y-1.5 text-gray-800">
                  <div className="flex">
                    <span className="w-44 shrink-0 font-medium text-gray-600">
                      Nama Pelapor
                    </span>
                    <span className="w-4 shrink-0">:</span>
                    <span className="font-medium">
                      {complainant.nama_lengkap ||
                        complainant.nama ||
                        detail.nama_pelapor ||
                        "-"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-44 shrink-0 font-medium text-gray-600">
                      NIK
                    </span>
                    <span className="w-4 shrink-0">:</span>
                    <span>{complainant.nik || detail.nik || "-"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-44 shrink-0 font-medium text-gray-600">
                      No Telp
                    </span>
                    <span className="w-4 shrink-0">:</span>
                    <span>{complainant.no_telp || detail.no_telp || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Biodata Perusahaan */}
              <div className="mb-6">
                <h2 className="text-[12px] font-bold text-gray-900 mb-2">
                  Biodata Perusahaan
                </h2>
                <div className="space-y-1.5 text-gray-800">
                  <div className="flex">
                    <span className="w-44 shrink-0 font-medium text-gray-600">
                      Nama Perusahaan
                    </span>
                    <span className="w-4 shrink-0">:</span>
                    <span className="font-medium">
                      {company.nama_perusahaan || detail.nama_perusahaan || "-"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-44 shrink-0 font-medium text-gray-600">
                      Alamat Perusahaan
                    </span>
                    <span className="w-4 shrink-0">:</span>
                    <span className="leading-relaxed">
                      {company.alamat || detail.alamat_perusahaan || "-"}
                      {company.kota_kab ? `, ${company.kota_kab}` : ""}
                      {company.provinsi ? ` - ${company.provinsi}` : ""}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-44 shrink-0 font-medium text-gray-600">
                      No Telp Perusahaan
                    </span>
                    <span className="w-4 shrink-0">:</span>
                    <span>{company.no_telp || detail.company_no_telp || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Pengaduan */}
              <div className="mb-8">
                <h2 className="text-[12px] font-bold text-gray-900 mb-2">
                  Pengaduan
                </h2>
                <div className="flex items-start text-gray-800">
                  <span className="w-44 shrink-0 font-medium text-gray-600">
                    Deskripsi Aduan
                  </span>
                  <span className="w-4 shrink-0">:</span>
                  <span className="flex-1 text-justify leading-relaxed">
                    {detail.description || detail.deskripsi || "-"}
                  </span>
                </div>
              </div>

              {/* Kalimat Penutup */}
              <div className="mb-14 text-gray-700">
                <p>
                  Demikian pengaduan ini saya buat. Atas perhatian Bapak/Ibu, saya
                  ucapkan terima kasih..
                </p>
              </div>

              {/* Bagian Tanda Tangan */}
              <div className="grid grid-cols-2 gap-8 text-center pt-2 text-[11.5px] text-gray-800">
                {/* Petugas PTSA */}
                <div className="flex flex-col items-center justify-between min-h-[220px]">
                  <div>
                    <p>
                      Jakarta,{" "}
                      {formatDateIndoShort(
                        detail.complaint_date || detail.created_at
                      )}
                    </p>
                    <p className="mt-1">Petugas PTSA,</p>
                  </div>
                  <div className="text-center w-full">
                    <p>(............................)</p>
                    <p className="mt-1">NIP. .............................</p>
                  </div>
                </div>

                {/* Nama Pelapor & Foto */}
                <div className="flex flex-col items-center justify-between min-h-[220px]">
                  <div>
                    <p className="invisible select-none">Jakarta,</p>
                    <p className="mt-1">Nama Pelapor</p>
                  </div>

                  {/* Foto Pelapor */}
                  <div className="my-3 h-24 w-28 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center overflow-hidden">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Foto Pelapor"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-sky-400 stroke-[1.5]" />
                    )}
                  </div>

                  <div className="text-center w-full">
                    <p className="font-bold text-gray-900">
                      {complainant.nama_lengkap ||
                        complainant.nama ||
                        detail.nama_pelapor ||
                        "-"}
                    </p>
                    <p className="mt-0.5 text-gray-600">
                      NIK. {complainant.nik || detail.nik || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styling Khusus Cetak Kertas */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
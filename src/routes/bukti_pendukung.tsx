import React, { useState, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Camera,
  X,
  ArrowLeft,
  Loader2,
  FileCheck,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Upload,
} from "lucide-react";
import { XIcon } from "@/components/x-icon";
import { apiUrl } from "@/lib/api";

export const Route = createFileRoute("/bukti_pendukung")({
  head: () => ({
    meta: [
      {
        title: "Detail Aduan & Bukti Pendukung - Kementerian Ketenagakerjaan",
      },
    ],
  }),
  component: BuktiPendukungPage,
});

const COMPLAINTS_API_URL = apiUrl("complaints");

// Helper konversi base64 hasil kamera menjadi File objek.
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0]?.match(/:(.*?);/);
  const mime = mimeMatch?.[1] || "image/jpeg, application/pdf";
  const bstr = atob(arr[1] || "");
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function BuktiPendukungPage() {
  const navigate = useNavigate();

  const [deskripsiAduan, setDeskripsiAduan] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  // Camera state (native capture: input type=file + capture)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !/\.(jpe?g|png|pdf)$/i.test(file.name) &&
      !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    ) {
      alert("Bukti foto harus berupa file JPG/JPEG atau PDF.");
      return;
    }

    setCapturedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedPhoto(String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleClearPhoto = () => {
    setCapturedPhoto(null);
    setCapturedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const savedDraft = sessionStorage.getItem("draft_pengaduan");
    const draftData = savedDraft ? JSON.parse(savedDraft) : {};

    setIsSubmitting(true);

    try {
      if (
        selectedDocument &&
        !/\.(pdf|jpe?g|png)$/i.test(selectedDocument.name) &&
        !["application/pdf", "image/jpeg", "image/png"].includes(selectedDocument.type)
      ) {
        alert("Hanya file PDF, JPG, JPEG, atau PNG yang diizinkan.");
        return;
      }

      const formData = new FormData();

      // 1. Root Complaint Fields
      formData.append("category_id", String(draftData.category_id || 1));
      formData.append("description", deskripsiAduan);
      formData.append(
        "complaint_date",
        draftData.tanggalPelaporan || new Date().toISOString().split("T")[0],
      );

      // 2. Complainant Nested Fields
      formData.append("complainant[nama_lengkap]", draftData.namaPelapor || "");
      formData.append("complainant[nik]", draftData.nik || "");
      formData.append("complainant[alamat]", draftData.alamatPelapor || "");
      formData.append(
        "complainant[jenis_kelamin]",
        (draftData.jenisKelamin || "Laki-laki").toLowerCase(),
      );
      formData.append("complainant[jabatan]", draftData.jabatan || "");
      formData.append("complainant[no_telp]", draftData.noTelpPelapor || "");
      formData.append("complainant[email]", draftData.emailPelapor || "");

      // 3. Company Nested Fields
      formData.append("company[nama_perusahaan]", draftData.namaPerusahaan || "");
      formData.append("company[sector_id]", String(draftData.sector_id || 1));
      formData.append("company[alamat]", draftData.alamatPerusahaan || "");
      formData.append("company[jumlah_naker]", String(draftData.jumlahPekerja || 0));
      formData.append("company[provinsi]", draftData.provinsi || "");
      formData.append("company[kota_kab]", draftData.kabupaten || "");
      formData.append("company[kecamatan]", draftData.kecamatan || "");
      formData.append("company[kelurahan]", draftData.kelurahan || "");
      formData.append("company[no_telp]", draftData.noTelpPerusahaan || "");
      formData.append("company[email]", draftData.emailPerusahaan || "");

      // 4. Attachments (attachments[])
      if (capturedFile) {
        formData.append("attachments[]", capturedFile);
      }
      if (selectedDocument) {
        formData.append("attachments[]", selectedDocument);
      }

      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      const res = await fetch(COMPLAINTS_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const responseData = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Backend validation error (HTTP 422):", responseData);
        const errorMessages = responseData?.errors
          ? Object.entries(responseData.errors)
              .map(
                ([field, msgs]: [string, any]) =>
                  `• ${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
              )
              .join("\n")
          : responseData?.message || "Data formulir tidak memenuhi validasi server.";

        alert(`Gagal menyimpan pengaduan (422):\n\n${errorMessages}`);
        return;
      }

      sessionStorage.removeItem("draft_pengaduan");
      alert("Pengaduan berhasil disimpan!");
      navigate({ to: "/" });
    } catch (err) {
      console.error("Gagal mengirim pengaduan:", err);
      alert("Terjadi kendala jaringan saat menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-2xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0E3B68] text-white shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
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

      {/* Main Content */}
      <main className="mx-auto max-w-3xl w-full px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h1 className="text-[16px] font-bold text-gray-900 tracking-tight">
                Detail Aduan & Bukti Pendukung
              </h1>
              <p className="mt-1 text-[11px] text-gray-500">
                Lengkapi informasi di bawah ini dengan sejelas-jelasnya untuk memudahkan proses
                investigasi.
              </p>
            </div>

            {/* Deskripsi Aduan */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-gray-800">
                Deskripsi Aduan <span className="text-red-500">*</span>
              </label>
              <p className="text-[10px] text-gray-400 leading-tight">
                Uraikan kronologi kejadian, pihak yang terlibat, dan kerugian yang dialami. Hindari
                penggunaan singkatan yang tidak umum.
              </p>
              <textarea
                rows={5}
                value={deskripsiAduan}
                onChange={(e) => setDeskripsiAduan(e.target.value)}
                required
                placeholder="Contoh: Pada tanggal 10 Oktober 2024, perusahaan X melakukan pemotongan upah sepihak tanpa pemberitahuan sebelumnya sebesar..."
                className="w-full rounded-xl border border-gray-200 p-3.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] resize-none"
              />
            </div>

            {/* Upload Dokumen */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-gray-800">
                Bukti Pendukung (PDF/JPG/PNG)
              </label>
              <p className="text-[10px] text-gray-400 leading-tight">
                Masukkan dokumen bukti pendukung yang telah dikirimkan via email.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="sr-only"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#FAFBFD] p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {selectedDocument ? (
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                    <FileCheck className="h-4 w-4" />
                    <span>{selectedDocument.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocument(null);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Drag a file here to upload or
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-2.5 rounded-lg border border-gray-300 bg-white px-5 py-1.5 text-[10.5px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors"
                    >
                      Browse...
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bukti Foto Kamera */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-gray-800">
                Bukti Foto (Opsional namun sangat disarankan)
              </label>
              <p className="text-[10px] text-gray-400 leading-tight">
                Di HP: langsung buka kamera. Di laptop: pilih file gambar.
              </p>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                capture="environment"
                onChange={handleCameraChange}
                className="sr-only"
              />

              {capturedPhoto ? (
                <div className="relative mx-auto mt-3 h-52 max-w-md overflow-hidden rounded-xl bg-[#2D3748] flex items-center justify-center">
                  <img
                    src={capturedPhoto}
                    alt="Hasil Foto"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleCapture}
                  className="mt-3 flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 bg-[#FAFBFD] text-gray-400 hover:bg-gray-50 hover:text-[#0E3B68] transition-colors"
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-[11px] font-medium">
                    Ketuk untuk buka kamera / ambil foto
                  </span>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleCapture}
                  className="flex flex-col items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#0E3B68] transition-colors cursor-pointer"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0E3B68] text-white shadow-xs hover:bg-[#0a2c4e] transition-colors">
                    <Camera className="h-5 w-5" />
                  </div>
                  <span>{capturedPhoto ? "Ambil Ulang Foto" : "Mulai Kamera"}</span>
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="rounded-lg border border-gray-200 bg-white px-6 py-2 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Kembali
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0E3B68] px-7 py-2 text-[11px] font-semibold text-white shadow-xs hover:bg-[#0a2c4e] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan →</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#092847] bg-[#071F38] text-white/80">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-[11px]">
            <div className="space-y-3">
              <h3 className="text-[12px] font-bold text-emerald-400 tracking-wide">
                BINWASNAKER & K3
              </h3>
              <p className="text-white/60 leading-relaxed">
                Ditjen Binwasnaker & K3 adalah unsur pelaksana yang berada di bawah dan bertanggung
                jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="flex items-center gap-3 pt-2 text-white/70">
                <a
                  href="https://x.com/KemnakerRI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1B4YgTmbGG/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/kemnaker?stkn=MWdxZjhmMG81aTZ3YQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[12px] font-bold text-white tracking-wide">Customer Support</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link to="/faqpage" className="hover:text-white transition-colors">
                    › FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    › Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-[12px] font-bold text-white tracking-wide">Have a Questions?</h3>
              <div className="space-y-2 text-white/60">
                <a
                  href="https://maps.app.goo.gl/QiLps9tsVMszzHf79"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-white transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Jl. Gatot Subroto No.51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota
                    Jakarta Selatan, Daerah Khusus Jakarta - 12950, Indonesia
                  </p>
                </a>
                <div className="flex items-center gap-2 pt-1">
                  <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <p>Pengaduan WLKP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-center text-[10px] text-white/40">
            <p>Copyright © BINSIS || 2024 - 2026</p>
            <p className="mt-0.5">Designed by TUBSPK</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
import { cn } from "@/lib/utils";

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

/** Batas ukuran satu file bukti: 5 MB. */
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Ekstensi & MIME yang diterima untuk bukti pendukung. */
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|pdf)$/i;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

/**
 * Validasi satu file bukti. Pesan dikembalikan sebagai string agar bisa dipakai
 * baik untuk alert maupunSTATE error di UI.
 *
 * Kalau file punya ekstensi yang benar tapi browser melaporkan MIME kosong
 * (serang terjadi di Windows), MIME diabaikan — ekstensi sudah cukup.
 */
function validateEvidenceFile(file: File): string | null {
  const byExtension = ALLOWED_EXTENSIONS.test(file.name);
  const byMime = file.type === "" || ALLOWED_MIME_TYPES.includes(file.type);

  if (!byExtension && !byMime) {
    return "Bukti pendukung harus berupa file JPG/JPEG, PNG, atau PDF.";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `Ukuran file ${mb} MB melebihi batas 5 MB.`;
  }

  if (file.size === 0) {
    return "File yang dipilih kosong (0 byte).";
  }

  return null;
}

/** Format ukuran file untuk ditampilkan di UI. */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleCapture = () => {
    cameraInputRef.current?.click();
  };

  /** Terapkan file ke input kamera (dipakai oleh pilih-file maupun drop). */
  const applyCameraFile = (file: File | undefined) => {
    if (!file) return;

    const problem = validateEvidenceFile(file);
    if (problem) {
      setFileError(problem);
      return;
    }

    setFileError(null);
    setCapturedFile(file);

    const reader = new FileReader();
    reader.onload = () => setCapturedPhoto(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyCameraFile(e.target.files?.[0]);
    // Reset nilai input supaya memilih file yang sama dua kali tetap memicu
    // event change (tanpa ini, pilih kedua diam-diam diabaikan browser).
    e.target.value = "";
  };

  const handleClearPhoto = () => {
    setCapturedPhoto(null);
    setCapturedFile(null);
  };

  /** Terapkan file ke input dokumen (dipakai oleh pilih-file maupun drop). */
  const applyDocumentFile = (file: File | undefined) => {
    if (!file) return;

    const problem = validateEvidenceFile(file);
    if (problem) {
      setFileError(problem);
      return;
    }

    setFileError(null);
    setSelectedDocument(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyDocumentFile(e.target.files?.[0]);
    // Sama seperti kamera: reset supaya file yang sama bisa dipilih ulang.
    e.target.value = "";
  };

  /** Drop file langsung ke area upload (diodPromisekan dari teks "Drag a file"). */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    applyDocumentFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const savedDraft = sessionStorage.getItem("draft_pengaduan");
    const draftData = savedDraft ? JSON.parse(savedDraft) : {};

    setIsSubmitting(true);

    try {
      // Validasi ulang di sisi submit supaya file yang lolos filter UI (mis.
      // ditambahkan lewat drop) tetapTERcek.
      for (const file of [selectedDocument, capturedFile]) {
        if (!file) continue;
        const problem = validateEvidenceFile(file);
        if (problem) {
          setFileError(problem);
          setIsSubmitting(false);
          return;
        }
      }
      setFileError(null);

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
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition-colors cursor-pointer",
                  isDragging
                    ? "border-[#0E3B68] bg-[#0E3B68]/5"
                    : "border-gray-300 bg-[#FAFBFD] hover:bg-gray-50",
                )}
              >
                {selectedDocument ? (
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                    <FileCheck className="h-4 w-4" />
                    <span className="max-w-[220px] truncate">{selectedDocument.name}</span>
                    <span className="shrink-0 text-emerald-500/80">
                      ({formatFileSize(selectedDocument.size)})
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocument(null);
                        setFileError(null);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload
                      className={cn(
                        "mb-2 h-6 w-6",
                        isDragging ? "text-[#0E3B68]" : "text-gray-300",
                      )}
                    />
                    <p className="text-[11px] text-gray-500 font-medium">
                      {isDragging ? "Lepaskan file di sini" : "Tarik file ke sini atau"}
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
                    <p className="mt-2 text-[10px] text-gray-400">
                      JPG, PNG, atau PDF &middot; maksimal 5 MB
                    </p>
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
      <footer className="bg-[#032749] text-white mt-12">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Kolom 1: Brand */}
            <div>
              <h3 className="text-xl font-bold">
                BINWASNAKER <span className="text-emerald-400">& K3</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Ditjen Binwasnaker & K3 adalah unsur pelaksana yang berada di bawah dan
                bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://x.com/KemnakerRI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                >
                  <XIcon className="size-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1B4YgTmbGG/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                >
                  <Facebook className="size-4" />
                </a>
                <a
                  href="https://www.instagram.com/kemnaker?stkn=MWdxZjhmMG81aTZ3YQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                >
                  <Instagram className="size-4" />
                </a>
              </div>
            </div>

            {/* Kolom 2: Kontak & Bantuan (FAQ di bawah) */}
            <div>
              <h4 className="text-lg font-semibold">Ada Pertanyaan?</h4>
              <hr className="mt-4 border-white/15" />
              <a
                href="https://maps.app.goo.gl/QiLps9tsVMszzHf79"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex gap-3 text-sm text-gray-300 transition-colors hover:text-emerald-400"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="leading-relaxed">
                  Jl. Jend. Gatot Subroto Kav. 51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi,
                  Kota Jakarta Selatan, DKI Jakarta 12950
                </p>
              </a>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Mail className="size-5 text-emerald-400" />
                <a
                  href="mailto:pengaduanwlkp@gmail.com"
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  Pengaduan WLKP
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
            <p>Copyright © BINSIS || 2024–2026</p>
            <p>Designed by TUBSPK</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  UploadCloud,
  Camera,
  Video,
  X,
  ArrowLeft,
  Loader2,
  FileCheck,
  MapPin,
  Mail,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";

export const Route = createFileRoute("/admin/detail_berkas")({
  head: () => ({
    meta: [
      {
        title: "Detail Aduan & Bukti Pendukung - Kementerian Ketenagakerjaan",
      },
    ],
  }),
  component: BuktiPendukungPage,
});

const COMPLAINTS_API_URL = "http://192.168.147.199:8000/api/complaints";

function BuktiPendukungPage() {
  const navigate = useNavigate();

  const [deskripsiAduan, setDeskripsiAduan] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aktifkan stream kamera saat dibutuhkan
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Akses kamera tidak diizinkan atau tidak tersedia:", err);
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const handleCapture = () => {
    if (!cameraActive) {
      setCameraActive(true);
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(dataUrl);
        setCameraActive(false);
      }
    }
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
      const formData = new FormData();

      // Mapping data form tahap 1
      formData.append("ticket_number", draftData.nomorTiket || `TCK-${Date.now()}`);
      formData.append("complaint_date", draftData.tanggalPelaporan || new Date().toISOString());
      formData.append("description", deskripsiAduan);
      formData.append("category_name", draftData.jenisPengaduan || "Lainnya");

      // Complainant data
      formData.append("nama_lengkap", draftData.namaPelapor || "");
      formData.append("nik", draftData.nik || "");
      formData.append("alamat", draftData.alamatPelapor || "");
      formData.append("jenis_kelamin", draftData.jenisKelamin || "Laki-laki");
      formData.append("jabatan", draftData.jabatan || "");
      formData.append("no_telp", draftData.noTelpPelapor || "");
      formData.append("email", draftData.emailPelapor || "");

      // Company data
      formData.append("nama_perusahaan", draftData.namaPerusahaan || "");
      formData.append("sector_name", draftData.sektorIndustri || "");
      formData.append("jumlah_naker", String(draftData.jumlahPekerja || 0));
      formData.append("provinsi", draftData.provinsi || "");
      formData.append("kabupaten", draftData.kabupaten || "");
      formData.append("kecamatan", draftData.kecamatan || "");
      formData.append("kelurahan", draftData.kelurahan || "");
      formData.append("company_no_telp", draftData.noTelpPerusahaan || "");
      formData.append("company_email", draftData.emailPerusahaan || "");
      formData.append("company_alamat", draftData.alamatPerusahaan || "");

      // File Lampiran
      if (selectedDocument) {
        formData.append("attachment", selectedDocument);
      }
      if (capturedPhoto) {
        formData.append("photo_base64", capturedPhoto);
      }

      const res = await fetch(COMPLAINTS_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.warn("Gagal menyimpan ke backend, melanjutkan navigasi...");
      }

      sessionStorage.removeItem("draft_pengaduan");
      alert("Pengaduan berhasil disimpan!");
      navigate({ to: "/admin/reportpengaduan" });
    } catch (err) {
      console.error("Gagal mengirim pengaduan:", err);
      alert("Terjadi kendala saat mengirim pengaduan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-gray-800">
      {/* ================= NAVBAR ATAS ================= */}
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

      {/* ================= FORM CONTENT ================= */}
      <main className="mx-auto max-w-3xl w-full px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header Card */}
            <div className="border-b border-gray-100 pb-4">
              <h1 className="text-[16px] font-bold text-gray-900 tracking-tight">
                Detail Aduan & Bukti Pendukung
              </h1>
              <p className="mt-1 text-[11px] text-gray-500">
                Lengkapi informasi di bawah ini dengan sejelas-jelasnya untuk memudahkan proses investigasi.
              </p>
            </div>

            {/* Field 1: Deskripsi Aduan */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-gray-800">
                Deskripsi Aduan <span className="text-red-500">*</span>
              </label>
              <p className="text-[10px] text-gray-400 leading-tight">
                Uraikan kronologi kejadian, pihak yang terlibat, dan kerugian yang dialami. Hindari penggunaan singkatan yang tidak umum.
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

            {/* Field 2: Upload Dokumen JPG/PDF */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-gray-800">
                Bukti Pendukung (JPG/PDF)
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

            {/* Field 3: Bukti Foto Kamera */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-gray-800">
                Bukti Foto (Opsional namun sangat disarankan)
              </label>
              <p className="text-[10px] text-gray-400 leading-tight">
                Gunakan kamera perangkat untuk mengambil foto Anda.
              </p>

              {/* Viewport Box Kamera */}
              <div className="relative mx-auto mt-3 h-52 max-w-md overflow-hidden rounded-xl bg-[#2D3748] flex items-center justify-center">
                {/* Frame Garis Sudut */}
                <div className="pointer-events-none absolute inset-4 border border-white/20 rounded-lg">
                  <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-white/60" />
                  <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-white/60" />
                  <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-white/60" />
                  <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-white/60" />
                </div>

                {capturedPhoto ? (
                  <div className="relative h-full w-full">
                    <img
                      src={capturedPhoto}
                      alt="Hasil Foto"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCapturedPhoto(null)}
                      className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/50">
                    <Video className="h-9 w-9 stroke-1" />
                    <span className="text-[10.5px]">Kamera Siap</span>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Tombol Ambil Foto */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleCapture}
                  className="flex flex-col items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#0E3B68] transition-colors cursor-pointer"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0E3B68] text-white shadow-xs hover:bg-[#0a2c4e] transition-colors">
                    <Camera className="h-5 w-5" />
                  </div>
                  <span>{capturedPhoto ? "Ambil Ulang Foto" : "Ambil Foto"}</span>
                </button>
              </div>
            </div>

            {/* Tombol Aksi di Bawah Kartu */}
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

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 border-t border-[#092847] bg-[#071F38] text-white/80">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-[11px]">
            {/* Kolom 1: Binwasnaker & K3 */}
            <div className="space-y-3">
              <h3 className="text-[12px] font-bold text-emerald-400 tracking-wide">
                BINWASNAKER & K3
              </h3>
              <p className="text-white/60 leading-relaxed">
                Ditjen Binwasnaker & K3 adalah unsur pelaksana yang berada di bawah dan bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="flex items-center gap-3 pt-2 text-white/70">
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Kolom 2: Customer Support */}
            <div className="space-y-3">
              <h3 className="text-[12px] font-bold text-white tracking-wide">
                Customer Support
              </h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
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

            {/* Kolom 3: Have a Questions? */}
            <div className="space-y-3">
              <h3 className="text-[12px] font-bold text-white tracking-wide">
                Have a Questions?
              </h3>
              <div className="space-y-2 text-white/60">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Jl. Gatot Subroto No.51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Jakarta - 12950, Indonesia
                  </p>
                </div>
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
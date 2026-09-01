import React, { useState, useRef, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Camera,
  RefreshCw,
  Trash2,
  Video,
  Twitter,
  Facebook,
  MessageSquare,
  Instagram,
  MapPin,
  Mail,
  Loader2,
} from "lucide-react";
import logoKemnaker from "@/assets/kemnaker_logo.png";

const BASE_API_URL = "http://192.168.147.199:8000/api";

// Pastikan path rute di sini cocok dengan nama file /bukti_pendukung
export const Route = createFileRoute("/bukti_pendukung")({
  head: () => ({
    meta: [{ title: "Detail Aduan & Bukti Pendukung | Kemnaker RI" }],
  }),
  component: BuktiPendukungPage,
});

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

function BuktiPendukungPage() {
  const navigate = useNavigate();

  const [deskripsiAduan, setDeskripsiAduan] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Gagal membuka kamera:", err);
      alert("Izin kamera ditolak atau perangkat kamera tidak ditemukan.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setCapturedImage(dataUrl);

        canvas.toBlob(
          (blob) => {
            if (blob) setImageBlob(blob);
          },
          "image/jpeg",
          0.85
        );

        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setImageBlob(null);
    startCamera();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskripsiAduan.trim()) {
      alert("Mohon isi deskripsi kronologi aduan terlebih dahulu.");
      return;
    }

    const draftRaw = sessionStorage.getItem("draft_pengaduan");
    if (!draftRaw) {
      alert("Data pelapor tidak ditemukan. Silakan isi formulir dari awal.");
      navigate({ to: "/pengaduan" });
      return;
    }

    const draft = JSON.parse(draftRaw);
    setLoadingSubmit(true);

    try {
      const payload = new FormData();

      // Header fields
      payload.append("category_id", String(draft.category_id || "1"));
      payload.append("description", deskripsiAduan);

      // Complainant fields
      payload.append("complainant[nama_lengkap]", draft.nama_lengkap || "");
      payload.append("complainant[nik]", draft.nik || "");
      payload.append("complainant[alamat]", draft.alamat_pelapor || "");
      payload.append("complainant[jenis_kelamin]", draft.jenis_kelamin || "laki-laki");
      payload.append("complainant[jabatan]", draft.jabatan || "");
      payload.append("complainant[no_telp]", draft.no_telp_pelapor || "");
      if (draft.email_pelapor) {
        payload.append("complainant[email]", draft.email_pelapor);
      }

      // Company fields
      payload.append("company[nama_perusahaan]", draft.nama_perusahaan || "");
      payload.append("company[sektor_industri]", draft.sektor_industri || "Industri Pengolahan");
      payload.append("company[alamat]", draft.alamat_perusahaan || "");
      payload.append("company[jumlah_naker]", String(draft.jumlah_naker || "0"));
      payload.append("company[provinsi]", draft.provinsi || "");
      payload.append("company[kota_kab]", draft.kota_kab || "");
      payload.append("company[kecamatan]", draft.kecamatan || "");
      payload.append("company[kelurahan]", draft.kelurahan || "");
      if (draft.no_telp_perusahaan) {
        payload.append("company[no_telp]", draft.no_telp_perusahaan);
      }
      if (draft.email_perusahaan) {
        payload.append("company[email]", draft.email_perusahaan);
      }

      // Attachment dari jepretan kamera
      if (imageBlob) {
        payload.append("attachments[]", imageBlob, "bukti_kamera.jpg");
      }

      const response = await fetch(`${BASE_API_URL}/complaints`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan pengaduan");
      }

      const result = await response.json();
      console.log("Pengaduan berhasil diajukan:", result);

      sessionStorage.removeItem("draft_pengaduan");
      alert("Laporan pengaduan berhasil dikirim!");
      navigate({ to: "/" });
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error.message || "Terjadi kesalahan saat mengirim aduan.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      <canvas ref={canvasRef} className="hidden" />

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
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* CARD DETAIL & BUKTI */}
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#032749]">
              Detail Aduan &amp; Bukti Pendukung
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Lengkapi informasi di bawah ini dengan sejelas-jelasnya untuk memudahkan proses investigasi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input Deskripsi */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Deskripsi Aduan <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Uraikan kronologi kejadian, pihak yang terlibat, dan kerugian yang dialami. Hindari penggunaan singkatan yang tidak umum.
              </p>
              <textarea
                rows={6}
                value={deskripsiAduan}
                onChange={(e) => setDeskripsiAduan(e.target.value)}
                placeholder="Contoh: Pada tanggal 10 Oktober 2024, perusahaan X melakukan pemotongan upah sepihak tanpa pemberitahuan sebelumnya sebesar..."
                required
                className="w-full rounded-xl border border-gray-300 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749] resize-y"
              />
            </div>

            {/* Input Bukti Foto Kamera */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Bukti Foto <span className="text-xs font-normal text-gray-500">(Opsional namun sangat disarankan)</span>
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Gunakan kamera perangkat untuk mengambil foto Anda.
              </p>

              <div className="relative w-full rounded-xl bg-[#EDF3FA] border border-gray-200 overflow-hidden flex flex-col items-center justify-center p-8 min-h-[340px]">
                {capturedImage ? (
                  <div className="relative w-full flex flex-col items-center">
                    <img
                      src={capturedImage}
                      alt="Hasil Bukti Foto"
                      className="max-h-[300px] w-auto rounded-lg object-contain border border-gray-300 shadow-sm"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={retakePhoto}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#032749] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                      >
                        <RefreshCw className="size-3.5" />
                        Foto Ulang
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCapturedImage(null);
                          setImageBlob(null);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-all shadow-sm"
                      >
                        <Trash2 className="size-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative w-full max-w-lg aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-md">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-6 border-2 border-white/40 rounded-lg pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative w-full max-w-md h-48 sm:h-56 bg-[#2B3545] rounded-xl flex flex-col items-center justify-center text-white shadow-inner p-4">
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60" />

                    <Video className="size-10 text-white/70 mb-3" />
                    <span className="text-xs font-medium text-white/80">Kamera Siap</span>
                  </div>
                )}

                {!capturedImage && (
                  <div className="mt-6 flex flex-col items-center">
                    {isCameraActive ? (
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex flex-col items-center gap-1 group focus:outline-none"
                      >
                        <div className="size-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 active:scale-95 transition-all">
                          <Camera className="size-6" />
                        </div>
                        <span className="text-xs font-bold text-[#032749] mt-1">Jepret Foto</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex flex-col items-center gap-1 group focus:outline-none"
                      >
                        <div className="size-12 rounded-xl bg-[#032749] flex items-center justify-center text-white shadow-md group-hover:scale-105 active:scale-95 transition-all">
                          <Camera className="size-6" />
                        </div>
                        <span className="text-xs font-bold text-[#032749] mt-1">Ambil Foto</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate({ to: "/pengaduan" })}
                className="rounded-lg border border-gray-300 bg-white px-8 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                Kembali
              </button>

              <button
                type="submit"
                disabled={loadingSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-[#032749] px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-950 active:scale-95 disabled:opacity-70 transition-all shadow-md"
              >
                {loadingSubmit ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan
                    <span className="text-sm">➔</span>
                  </>
                )}
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
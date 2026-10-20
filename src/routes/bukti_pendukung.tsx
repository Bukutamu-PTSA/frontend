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
  Check,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { XIcon } from "@/components/x-icon";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  PAGE_TITLES,
  ORGANIZATION_NAME_SHORT,
  ORGANIZATION_UNIT,
  ORGANIZATION_UNIT_FULL,
  COPYRIGHT_YEARS,
  DEVELOPER_NAME,
  SYSTEM_OWNER_NAME,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ADDRESS_LINE_3,
  CONTACT_EMAIL,
  MAPS_URL,
  SOCIAL_LINKS,
} from "@/config/app";

const iconMap = {
  XIcon,
  Facebook,
  Instagram,
};

export const Route = createFileRoute("/bukti_pendukung")({
  head: () => ({
    meta: [
      {
        title: PAGE_TITLES.buktiPendukung,
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

/** Arah kamera: "environment" = belakang, "user" = depan (selfie). */
type FacingMode = "environment" | "user";

/** Satu foto hasil jepretan kamera di galeri. */
interface CapturedPhoto {
  id: string;
  file: File;
  /** Object URL untuk preview; dibebaskan saat foto dihapus / halaman ditutup. */
  url: string;
}

/** Tebak arah kamera dari label perangkat (label baru terisi setelah izin). */
function guessFacingFromLabel(label: string): FacingMode | null {
  if (/front|user|depan|selfie|facetime/i.test(label)) return "user";
  if (/back|rear|environment|belakang/i.test(label)) return "environment";
  return null;
}

/** Jumlah maksimal foto yang bisa diambil sebelum memilih satu. */
const MAX_PHOTOS = 5;

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

  // Galeri foto hasil kamera. Pengguna bisa mengambil beberapa foto, lalu
  // memilih SATU yang dipakai sebagai bukti/foto pelapor.
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId) ?? null;
  // Nilai yang dikirim saat submit & dipakai untuk preview.
  const capturedFile = selectedPhoto?.file ?? null;
  const capturedPhoto = selectedPhoto?.url ?? null;
  const photosRef = useRef<CapturedPhoto[]>([]);
  photosRef.current = photos;

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live camera (getUserMedia) state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  // Default kamera depan (selfie); bisa diganti lewat tombol Depan/Belakang.
  const [facingMode, setFacingMode] = useState<FacingMode>("user");
  // false = getUserMedia tidak tersedia (mis. dibuka lewat http://IP, bukan
  // HTTPS) -> pakai kamera bawaan HP lewat <input capture>.
  const [canUseLiveCamera, setCanUseLiveCamera] = useState(true);
  // Popup pilih kamera yang muncul saat ikon kamera diklik.
  const [isFacingPickerOpen, setIsFacingPickerOpen] = useState(false);
  useEffect(() => {
    setCanUseLiveCamera(Boolean(navigator.mediaDevices?.getUserMedia) && window.isSecureContext);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  /** Hentikan semua track kamera dan lepaskan stream. */
  const stopCameraStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /**
   * Nyalakan stream kamera, lewat deviceId (paling andal untuk flip di HP)
   * atau facingMode. Bila perangkat tidak punya kamera yang diminta, pakai
   * kamera apa pun. Mengembalikan arah kamera yang benar-benar aktif.
   */
  const startStream = async (target: {
    facing: FacingMode;
    deviceId?: string | undefined;
    exact?: boolean | undefined;
  }): Promise<FacingMode> => {
    const hadStream = streamRef.current !== null;
    stopCameraStream();
    // Banyak HP Android belum melepas kamera lama tepat setelah track.stop();
    // tanpa jeda, getUserMedia berikutnya gagal (NotReadableError).
    if (hadStream) await new Promise((r) => setTimeout(r, 300));

    const video: MediaTrackConstraints = target.deviceId
      ? { deviceId: { exact: target.deviceId } }
      : { facingMode: target.exact ? { exact: target.facing } : { ideal: target.facing } };

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name !== "OverconstrainedError" && name !== "NotFoundError") throw err;
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => {});
    }

    const track = stream.getVideoTracks()[0];
    const settings = track?.getSettings?.() ?? {};
    const actual: FacingMode =
      settings.facingMode === "user" || settings.facingMode === "environment"
        ? settings.facingMode
        : (guessFacingFromLabel(track?.label ?? "") ?? target.facing);
    return actual;
  };

  /** Buka kamera langsung di browser lewat getUserMedia. */
  const openCamera = async (facing: FacingMode) => {
    setCameraError(null);
    setIsFacingPickerOpen(false);
    setFacingMode(facing);

    // Browser lama / konteks non-HTTPS tidak punya getUserMedia -> fallback
    // ke kamera bawaan HP, dengan arah sesuai pilihan Depan/Belakang.
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
      const input = cameraInputRef.current;
      if (input) {
        input.setAttribute("capture", facing);
        input.click();
      }
      return;
    }

    setIsCameraStarting(true);
    setIsCameraOpen(true);

    try {
      // `exact` supaya HP benar-benar memakai kamera yang dipilih; bila tidak
      // ada, startStream otomatis jatuh ke kamera apa pun.
      setFacingMode(await startStream({ facing, exact: true }));
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      stopCameraStream();
      setIsCameraOpen(false);
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan izin kamera diberikan, atau pilih file gambar sebagai gantinya.",
      );
    } finally {
      setIsCameraStarting(false);
    }
  };

  /** Tutup modal kamera dan matikan stream. */
  const closeCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setIsCameraStarting(false);
  };

  /** Masukkan foto ke galeri dan jadikan foto terpilih. */
  const addPhoto = (file: File) => {
    if (photosRef.current.length >= MAX_PHOTOS) {
      toast.error(`Maksimal ${MAX_PHOTOS} foto. Hapus salah satu foto dulu.`);
      return false;
    }
    const photo: CapturedPhoto = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      url: URL.createObjectURL(file),
    };
    setPhotos((prev) => [...prev, photo]);
    setSelectedPhotoId(photo.id);
    return true;
  };

  /**
   * Ambil frame dari video dan tambahkan ke galeri. Kamera tetap terbuka
   * supaya pengguna bisa mengambil beberapa foto lalu memilih yang terbaik.
   */
  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    if (photosRef.current.length >= MAX_PHOTOS) {
      toast.error(`Maksimal ${MAX_PHOTOS} foto. Hapus salah satu foto dulu.`);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Kamera depan ditampilkan seperti cermin; simpan hasil yang sama dengan
    // yang dilihat pengguna.
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `bukti-foto-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        const problem = validateEvidenceFile(file);
        if (problem) {
          setFileError(problem);
          return;
        }

        setFileError(null);
        addPhoto(file);
      },
      "image/jpeg",
      0.92,
    );
  };

  // Pastikan stream kamera dilepas & URL preview dibebaskan saat unmount.
  useEffect(() => {
    return () => {
      stopCameraStream();
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  /** Klik ikon kamera -> tampilkan pilihan kamera depan/belakang dulu. */
  const handleCapture = () => {
    setIsFacingPickerOpen(true);
  };

  /** Terapkan file dari input kamera bawaan (fallback browser lama). */
  const applyCameraFile = (file: File | undefined) => {
    if (!file) return;

    const problem = validateEvidenceFile(file);
    if (problem) {
      setFileError(problem);
      return;
    }

    setFileError(null);
    addPhoto(file);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyCameraFile(e.target.files?.[0]);
    // Reset nilai input supaya memilih file yang sama dua kali tetap memicu
    // event change (tanpa ini, pilih kedua diam-diam diabaikan browser).
    e.target.value = "";
  };

  /** Hapus satu foto dari galeri; bila itu foto terpilih, pilih foto terakhir. */
  const handleRemovePhoto = (id: string) => {
    const target = photosRef.current.find((p) => p.id === id);
    if (target) URL.revokeObjectURL(target.url);
    const remaining = photosRef.current.filter((p) => p.id !== id);
    setPhotos(remaining);
    if (selectedPhotoId === id) {
      setSelectedPhotoId(remaining[remaining.length - 1]?.id ?? null);
    }
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

      // 4. Attachments — setiap lampiran dikirim beserta `file_type` supaya
      //    backend bisa membedakan FOTO pelapor (dipakai di view_pdf &
      //    detail_berkas lewat `att.file_type === "photo"`) dari DOKUMEN bukti.
      //    Dikirim sebagai array ber-index terstruktur (pola Laravel), sejajar
      //    dengan bentuk nested complainant[...]/company[...] di atas.
      let attachmentIndex = 0;
      if (capturedFile) {
        formData.append(`attachments[${attachmentIndex}][file]`, capturedFile);
        formData.append(`attachments[${attachmentIndex}][file_type]`, "photo");
        attachmentIndex += 1;
      }
      if (selectedDocument) {
        formData.append(`attachments[${attachmentIndex}][file]`, selectedDocument);
        formData.append(`attachments[${attachmentIndex}][file_type]`, "document");
        attachmentIndex += 1;
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
          : responseData?.message || ERROR_MESSAGES.pengaduanValidationFailed;

        toast.error(ERROR_MESSAGES.pengaduanSubmitFailed, { description: errorMessages });
        return;
      }

      sessionStorage.removeItem("draft_pengaduan");
      toast.success(SUCCESS_MESSAGES.pengaduanSubmitted);
      navigate({ to: "/" });
    } catch (err) {
      console.error("Gagal mengirim pengaduan:", err);
      toast.error(ERROR_MESSAGES.pengaduanNetworkError);
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-secondary text-white shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
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
                className="w-full rounded-xl border border-gray-200 p-3.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary resize-none"
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
                    ? "border-brand-secondary bg-brand-secondary/5"
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
                        isDragging ? "text-brand-secondary" : "text-gray-300",
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

              {fileError && (
                <p className="pt-1 text-[10px] font-medium text-red-500">{fileError}</p>
              )}
            </div>

            {/* Bukti Foto Kamera */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-gray-800">
                Bukti Foto (Opsional namun sangat disarankan)
              </label>
              <p className="text-[10px] text-gray-400 leading-tight">
                Ketuk tombol kamera untuk membuka kamera langsung di browser dan ambil foto.
              </p>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                capture={facingMode}
                onChange={handleCameraChange}
                className="sr-only"
              />

              {capturedPhoto && selectedPhoto ? (
                <div className="mx-auto mt-3 max-w-md space-y-2">
                  {/* Preview foto yang akan dipakai */}
                  <div className="relative h-52 overflow-hidden rounded-xl bg-[#2D3748] flex items-center justify-center">
                    <img
                      src={capturedPhoto}
                      alt="Foto yang akan digunakan"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      <Check className="h-3 w-3" /> Foto yang digunakan
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(selectedPhoto.id)}
                      className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
                      aria-label="Hapus foto ini"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Galeri: pilih foto lain bila mengambil lebih dari satu */}
                  {photos.length > 1 && (
                    <PhotoPicker
                      photos={photos}
                      selectedId={selectedPhotoId}
                      onSelect={setSelectedPhotoId}
                      onRemove={handleRemovePhoto}
                    />
                  )}
                  <p className="text-center text-[10px] text-gray-400">
                    {photos.length > 1
                      ? `Ketuk foto untuk memilih yang digunakan (${photos.length}/${MAX_PHOTOS}).`
                      : `Ambil foto lagi bila ingin membandingkan (maks. ${MAX_PHOTOS}).`}
                  </p>
                </div>
              ) : (
                <div
                  onClick={handleCapture}
                  className="mt-3 flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 bg-[#FAFBFD] text-gray-400 hover:bg-gray-50 hover:text-brand-secondary transition-colors"
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
                  className="flex flex-col items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-brand-secondary transition-colors cursor-pointer"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-secondary text-white shadow-xs hover:bg-brand-secondary-hover transition-colors">
                    <Camera className="h-5 w-5" />
                  </div>
                  <span>{photos.length > 0 ? "Ambil Foto Lagi" : "Mulai Kamera"}</span>
                </button>
              </div>

              {cameraError && (
                <p className="pt-1 text-center text-[10px] font-medium text-red-500">
                  {cameraError}
                </p>
              )}

              {!canUseLiveCamera && (
                <p className="pt-1 text-center text-[10px] text-amber-600">
                  Halaman dibuka tanpa HTTPS, jadi foto diambil lewat aplikasi kamera HP. Buka
                  lewat alamat https:// agar kamera tampil langsung di halaman ini.
                </p>
              )}
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
                className="inline-flex items-center gap-2 rounded-lg bg-brand-secondary px-7 py-2 text-[11px] font-semibold text-white shadow-xs hover:bg-brand-secondary-hover transition-colors cursor-pointer disabled:opacity-50"
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
      <footer className="bg-brand-primary text-white mt-12">
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

            {/* Kolom 2: Kontak & Bantuan (FAQ di bawah) */}
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
            <p>Copyright © {SYSTEM_OWNER_NAME} || {COPYRIGHT_YEARS}</p>
            <p>Designed by {DEVELOPER_NAME}</p>
          </div>
        </div>
      </footer>

      {/* Popup pilih kamera (muncul saat ikon kamera diklik) */}
      {isFacingPickerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setIsFacingPickerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="facing-picker-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 id="facing-picker-title" className="text-[12px] font-bold text-gray-900">
                Pilih Kamera
              </h2>
              <button
                type="button"
                onClick={() => setIsFacingPickerOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "user", label: "Kamera Depan" },
                  { value: "environment", label: "Kamera Belakang" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => openCamera(opt.value)}
                  autoFocus={opt.value === "user"}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-4 text-[11px] font-semibold transition-colors",
                    opt.value === "user"
                      ? "border-brand-secondary bg-brand-secondary text-white hover:bg-brand-secondary-hover"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {opt.value === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Kamera Langsung */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl">
            <div className="flex items-center justify-between bg-black/60 px-4 py-3">
              <span className="text-[12px] font-semibold text-white">
                Ambil Foto Bukti
                <span className="ml-2 font-normal text-white/60">
                  {facingMode === "user" ? "Kamera depan" : "Kamera belakang"}
                </span>
              </span>
              <button
                type="button"
                onClick={closeCamera}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
                aria-label="Tutup kamera"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex aspect-[3/4] w-full items-center justify-center bg-[#111]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                  "h-full w-full object-cover",
                  // Kamera depan ditampilkan seperti cermin agar terasa natural.
                  facingMode === "user" && "-scale-x-100",
                )}
              />
              {isCameraStarting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-[11px]">Menyalakan kamera...</span>
                </div>
              )}
              {photos.length > 0 && (
                <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {photos.length}/{MAX_PHOTOS} foto
                </span>
              )}
            </div>

            {/* Galeri hasil jepretan: ketuk untuk memilih foto yang digunakan */}
            {photos.length > 0 && (
              <div className="bg-black/60 px-4 pt-3">
                <PhotoPicker
                  photos={photos}
                  selectedId={selectedPhotoId}
                  onSelect={setSelectedPhotoId}
                  onRemove={handleRemovePhoto}
                  dark
                />
              </div>
            )}

            <div className="grid grid-cols-3 items-center bg-black/60 px-4 py-5">
              <div className="justify-self-start">
                {photos.length > 0 ? (
                  <button
                    type="button"
                    onClick={closeCamera}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-[11px] font-semibold text-white hover:bg-emerald-600 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Gunakan Foto
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeCamera}
                    className="rounded-lg border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={takePhoto}
                disabled={isCameraStarting || photos.length >= MAX_PHOTOS}
                className="justify-self-center grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-white/20 text-white hover:bg-white/40 transition-colors disabled:opacity-50"
                aria-label="Ambil foto"
              >
                <Camera className="h-6 w-6" />
              </button>

              <div className="justify-self-end" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Deretan thumbnail foto; ketuk untuk memilih foto yang digunakan. */
function PhotoPicker({
  photos,
  selectedId,
  onSelect,
  onRemove,
  dark = false,
}: {
  photos: CapturedPhoto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  dark?: boolean;
}) {
  return (
    <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Pilih foto yang digunakan">
      {photos.map((photo, index) => {
        const isSelected = photo.id === selectedId;
        return (
          <li key={photo.id} className="relative shrink-0">
            <button
              type="button"
              onClick={() => onSelect(photo.id)}
              aria-pressed={isSelected}
              aria-label={`Gunakan foto ${index + 1}`}
              className={cn(
                "block h-16 w-16 overflow-hidden rounded-lg border-2 transition-all",
                isSelected
                  ? "border-emerald-500 ring-2 ring-emerald-500/40"
                  : dark
                    ? "border-white/20 opacity-70 hover:opacity-100"
                    : "border-gray-200 opacity-70 hover:opacity-100",
              )}
            >
              <img src={photo.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
            </button>
            {isSelected && (
              <span className="pointer-events-none absolute bottom-1 left-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              aria-label={`Hapus foto ${index + 1}`}
              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-white hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

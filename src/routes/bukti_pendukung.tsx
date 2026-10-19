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
  SwitchCamera,
  Check,
  Trash2,
  RotateCcw,
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

/** Arah kamera: "environment" = belakang, "user" = depan (selfie). */
type FacingMode = "environment" | "user";

/** Jumlah maksimal foto yang bisa diambil dalam satu sesi kamera. */
const MAX_SHOTS = 5;

/** Satu hasil jepretan di sesi kamera (sebelum dipilih). */
type Shot = { id: string; url: string; file: File };

/** Perangkat sentuh (HP/tablet) hampir selalu punya kamera depan & belakang. */
function isTouchDevice(): boolean {
  return typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
}

/** Tebak arah kamera dari label perangkat (label baru terisi setelah izin). */
function guessFacingFromLabel(label: string): FacingMode | null {
  if (/front|user|depan|selfie|facetime/i.test(label)) return "user";
  if (/back|rear|environment|belakang/i.test(label)) return "environment";
  return null;
}

/** Daftar kamera (videoinput) yang tersedia di perangkat. */
async function listCameras(): Promise<MediaDeviceInfo[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === "videoinput");
  } catch {
    return [];
  }
}

function BuktiPendukungPage() {
  const navigate = useNavigate();

  const [deskripsiAduan, setDeskripsiAduan] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  // Hasil foto (object URL untuk preview + File untuk dikirim).
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kamera langsung (getUserMedia) + flip depan/belakang.
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [canFlipCamera, setCanFlipCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sesi multi-foto: jepret hingga MAX_SHOTS, lalu pilih satu untuk dipakai.
  const [shots, setShots] = useState<Shot[]>([]);
  const [cameraStep, setCameraStep] = useState<"capture" | "select">("capture");
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const shotsRef = useRef<Shot[]>([]);
  shotsRef.current = shots;

  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Hentikan semua track kamera dan lepaskan stream. */
  const stopCameraStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  /**
   * Nyalakan stream kamera, lewat deviceId (paling andal untuk flip) atau
   * facingMode. Mengembalikan arah kamera yang benar-benar aktif.
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

    // Tombol flip muncul bila ada >1 kamera, atau selalu di HP (beberapa
    // browser HP hanya melaporkan 1 kamera lewat enumerateDevices).
    setCanFlipCamera((await listCameras()).length > 1 || isTouchDevice());
    return actual;
  };

  /** Buka kamera langsung di browser. */
  const openCamera = async () => {
    setCameraError(null);

    // getUserMedia hanya ada di HTTPS/localhost. Di luar itu pakai kamera
    // bawaan HP lewat input file (tanpa tombol flip).
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    clearShots();
    setCameraStep("capture");
    setIsCameraOpen(true);
    setIsCameraStarting(true);
    try {
      setFacingMode(await startStream({ facing: facingMode }));
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

  /** Hapus semua jepretan sesi ini & bebaskan object URL-nya. */
  const clearShots = () => {
    shotsRef.current.forEach((s) => URL.revokeObjectURL(s.url));
    shotsRef.current = [];
    setShots([]);
    setSelectedShotId(null);
  };

  /** Tutup modal kamera, matikan stream, dan buang jepretan yang tidak dipakai. */
  const closeCamera = () => {
    stopCameraStream();
    clearShots();
    setCameraStep("capture");
    setIsCameraOpen(false);
    setIsCameraStarting(false);
  };

  /** Selesai memotret: matikan kamera dan tampilkan pilihan foto. */
  const goToSelect = (list: Shot[] = shotsRef.current) => {
    if (list.length === 0) return;
    stopCameraStream();
    setSelectedShotId((prev) =>
      prev && list.some((s) => s.id === prev) ? prev : (list[list.length - 1]?.id ?? null),
    );
    setCameraStep("select");
  };

  /** Kembali ke mode memotret (bila jatah foto masih ada). */
  const backToCapture = async () => {
    if (shotsRef.current.length >= MAX_SHOTS) return;
    setCameraStep("capture");
    setIsCameraStarting(true);
    try {
      setFacingMode(await startStream({ facing: facingMode }));
    } catch (err) {
      console.error("Gagal menyalakan ulang kamera:", err);
      alert("Gagal menyalakan kamera kembali.");
      setCameraStep("select");
    } finally {
      setIsCameraStarting(false);
    }
  };

  /** Hapus satu jepretan dari daftar pilihan. */
  const removeShot = (id: string) => {
    const target = shotsRef.current.find((s) => s.id === id);
    if (target) URL.revokeObjectURL(target.url);
    const next = shotsRef.current.filter((s) => s.id !== id);
    shotsRef.current = next;
    setShots(next);
    if (next.length === 0) {
      void backToCapture();
    } else if (selectedShotId === id) {
      setSelectedShotId(next[next.length - 1]?.id ?? null);
    }
  };

  /** Pakai foto yang dipilih sebagai bukti, lalu tutup kamera. */
  const confirmSelectedShot = () => {
    const chosen = shotsRef.current.find((s) => s.id === selectedShotId);
    if (!chosen) return;
    applyPhoto(chosen.file);
    closeCamera();
  };

  /** Ganti antara kamera belakang dan depan. */
  const flipCamera = async () => {
    const next: FacingMode = facingMode === "environment" ? "user" : "environment";
    const currentId = streamRef.current?.getVideoTracks()[0]?.getSettings?.().deviceId;

    // Pilih kamera tujuan lewat deviceId; facingMode saja sering diabaikan HP
    // dan mengembalikan kamera yang sama.
    const cameras = (await listCameras()).filter((c) => c.deviceId);
    const others = cameras.filter((c) => c.deviceId !== currentId);
    const currentIndex = cameras.findIndex((c) => c.deviceId === currentId);
    const candidate =
      others.find((c) => guessFacingFromLabel(c.label) === next) ??
      (currentIndex >= 0 ? cameras[(currentIndex + 1) % cameras.length] : others[0]);
    // Jangan "flip" ke kamera yang sama; pakai facingMode exact sebagai gantinya.
    const targetCamera = candidate && candidate.deviceId !== currentId ? candidate : undefined;

    setIsCameraStarting(true);
    try {
      let actual = targetCamera
        ? await startStream({ facing: next, deviceId: targetCamera.deviceId })
        : await startStream({ facing: next, exact: true });
      // Bila deviceId ternyata membuka kamera dengan arah yang sama, coba facingMode.
      if (actual !== next && targetCamera) {
        actual = await startStream({ facing: next, exact: true });
      }
      setFacingMode(actual);
    } catch (err) {
      console.error("Gagal mengganti kamera:", err);
      alert("Gagal mengganti kamera. Kembali ke kamera sebelumnya.");
      await startStream({ facing: facingMode, deviceId: currentId })
        .then(setFacingMode)
        .catch(() => closeCamera());
    } finally {
      setIsCameraStarting(false);
    }
  };

  /** Simpan foto sebagai bukti (ganti foto lama & bebaskan URL-nya). */
  const applyPhoto = (file: File) => {
    // URL lama dibebaskan oleh effect cleanup di bawah.
    setCapturedPhoto(URL.createObjectURL(file));
    setCapturedFile(file);
  };

  /** Ambil frame dari video sebagai foto JPEG. */
  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    if (shotsRef.current.length >= MAX_SHOTS) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Kamera depan ditampilkan seperti cermin; simpan sama seperti yang dilihat.
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob || shotsRef.current.length >= MAX_SHOTS) return;
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const file = new File([blob], `bukti-foto-${id}.jpg`, { type: "image/jpeg" });
        const next = [...shotsRef.current, { id, file, url: URL.createObjectURL(file) }];
        shotsRef.current = next;
        setShots(next);
        setSelectedShotId(id);
        // Jatah habis: langsung ke layar pilih foto.
        if (next.length >= MAX_SHOTS) goToSelect(next);
      },
      "image/jpeg",
      0.92,
    );
  };

  // Pengaman: bila stream siap sebelum <video> modal ter-render, pasang di sini.
  useEffect(() => {
    const video = videoRef.current;
    if (isCameraOpen && video && streamRef.current && video.srcObject !== streamRef.current) {
      video.srcObject = streamRef.current;
      video.play().catch(() => {});
    }
  }, [isCameraOpen, isCameraStarting]);

  // Lepas kamera & URL jepretan saat halaman ditinggalkan.
  useEffect(
    () => () => {
      stopCameraStream();
      shotsRef.current.forEach((s) => URL.revokeObjectURL(s.url));
    },
    [],
  );

  // Bebaskan object URL preview saat diganti / unmount.
  useEffect(() => {
    return () => {
      if (capturedPhoto) URL.revokeObjectURL(capturedPhoto);
    };
  }, [capturedPhoto]);

  const handleCapture = () => {
    openCamera();
  };

  /** Fallback input kamera bawaan (non-HTTPS / browser lama). */
  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (
      !/\.(jpe?g|png)$/i.test(file.name) &&
      !["image/jpeg", "image/png"].includes(file.type)
    ) {
      alert("Bukti foto harus berupa file JPG/JPEG atau PNG.");
      return;
    }

    applyPhoto(file);
  };

  const handleClearPhoto = () => {
    setCapturedPhoto(null);
    setCapturedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset supaya memilih file yang sama lagi tetap memicu onChange.
    e.target.value = "";
    if (file) setSelectedDocument(file);
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
                Ketuk tombol kamera untuk membuka kamera langsung di browser. Kamera depan/belakang
                bisa diganti. Ambil hingga {MAX_SHOTS} foto, lalu pilih satu yang paling jelas.
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

              {cameraError && (
                <p className="pt-1 text-center text-[10px] font-medium text-red-500">
                  {cameraError}
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

      {/* Modal Kamera Langsung */}
      {isCameraOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ambil foto bukti"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl">
            <div className="flex items-center justify-between bg-black/60 px-4 py-3">
              <span className="text-[12px] font-semibold text-white">
                {cameraStep === "select" ? "Pilih Foto Bukti" : "Ambil Foto Bukti"}
                <span className="ml-2 font-normal text-white/60">
                  {cameraStep === "select"
                    ? `${shots.length} foto`
                    : `${facingMode === "user" ? "Kamera depan" : "Kamera belakang"} · ${shots.length}/${MAX_SHOTS}`}
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

            {/* Video tetap ter-mount (disembunyikan saat memilih) agar stream bisa
                dipasang ulang tanpa menunggu render. */}
            <div
              className={`relative aspect-[3/4] max-h-[65vh] w-full items-center justify-center bg-[#111] ${
                cameraStep === "select" ? "hidden" : "flex"
              }`}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
              />
              {isCameraStarting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-[11px]">Menyalakan kamera...</span>
                </div>
              )}

              {/* Strip jepretan sementara */}
              {shots.length > 0 && (
                <div className="absolute inset-x-0 bottom-0 flex gap-1.5 overflow-x-auto bg-gradient-to-t from-black/70 to-transparent p-2">
                  {shots.map((s, i) => (
                    <img
                      key={s.id}
                      src={s.url}
                      alt={`Jepretan ${i + 1}`}
                      className="h-12 w-12 shrink-0 rounded-md border border-white/40 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {cameraStep === "select" && (
              <div className="max-h-[65vh] overflow-y-auto bg-[#111] p-3">
                <p className="mb-2 text-[11px] text-white/70">
                  Ketuk foto yang ingin digunakan sebagai bukti.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {shots.map((s, i) => {
                    const isSelected = s.id === selectedShotId;
                    return (
                      <div key={s.id} className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedShotId(s.id)}
                          aria-pressed={isSelected}
                          aria-label={`Pilih foto ${i + 1}`}
                          className={`block aspect-[3/4] w-full overflow-hidden rounded-lg border-2 transition-colors ${
                            isSelected ? "border-emerald-400" : "border-transparent hover:border-white/40"
                          }`}
                        >
                          <img
                            src={s.url}
                            alt={`Foto ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                        {isSelected && (
                          <span className="pointer-events-none absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white shadow">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeShot(s.id)}
                          aria-label={`Hapus foto ${i + 1}`}
                          className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {cameraStep === "select" ? (
              <div className="flex items-center justify-between gap-2 bg-black/60 px-4 py-4">
                <button
                  type="button"
                  onClick={backToCapture}
                  disabled={shots.length >= MAX_SHOTS || isCameraStarting}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white hover:bg-white/20 transition-colors disabled:opacity-40"
                  title={shots.length >= MAX_SHOTS ? `Maksimal ${MAX_SHOTS} foto` : undefined}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {shots.length >= MAX_SHOTS ? `Maks. ${MAX_SHOTS} foto` : "Ambil Lagi"}
                </button>
                <button
                  type="button"
                  onClick={confirmSelectedShot}
                  disabled={!selectedShotId}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2 text-[11px] font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />
                  Gunakan Foto Ini
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-3 items-center bg-black/60 px-4 py-5">
              {shots.length > 0 ? (
                <button
                  type="button"
                  onClick={() => goToSelect()}
                  disabled={isCameraStarting}
                  className="justify-self-start rounded-lg bg-emerald-500 px-4 py-2 text-[11px] font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  Selesai ({shots.length})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={closeCamera}
                  className="justify-self-start rounded-lg border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Batal
                </button>
              )}

              <button
                type="button"
                onClick={takePhoto}
                disabled={isCameraStarting || shots.length >= MAX_SHOTS}
                className="justify-self-center grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-white/20 text-white hover:bg-white/40 active:scale-95 transition disabled:opacity-50"
                aria-label={`Ambil foto (${shots.length}/${MAX_SHOTS})`}
              >
                <Camera className="h-6 w-6" />
              </button>

              <div className="justify-self-end">
                {canFlipCamera && (
                  <button
                    type="button"
                    onClick={flipCamera}
                    disabled={isCameraStarting}
                    className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors disabled:opacity-50"
                    aria-label={
                      facingMode === "user" ? "Ganti ke kamera belakang" : "Ganti ke kamera depan"
                    }
                    title={facingMode === "user" ? "Ganti ke kamera belakang" : "Ganti ke kamera depan"}
                  >
                    <SwitchCamera className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

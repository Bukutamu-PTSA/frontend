import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Batas ukuran gambar yang mulai dikompres saat submit: 2 MB. */
const IMAGE_COMPRESS_THRESHOLD_BYTES = 2 * 1024 * 1024;

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(jpe?g|png)$/i.test(file.name);
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal membaca gambar."));
    };
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Kompres gambar hanya bila ukurannya melebihi `maxBytes` (default 2 MB).
 * File non-gambar dan file yang sudah kecil dikembalikan apa adanya.
 */
export async function compressImageIfNeeded(
  file: File,
  maxBytes = IMAGE_COMPRESS_THRESHOLD_BYTES,
): Promise<File> {
  if (!isImageFile(file) || file.size <= maxBytes) return file;

  try {
    const image = await loadImageElement(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    const naturalWidth = image.naturalWidth || image.width;
    const naturalHeight = image.naturalHeight || image.height;
    if (!naturalWidth || !naturalHeight) return file;

    // PNG dipertahankan agar transparansi tidak hilang; selain itu pakai JPEG.
    const outputType =
      /\.png$/i.test(file.name) || file.type === "image/png" ? "image/png" : "image/jpeg";

    // Batasi dimensi awal agar hasil kompresi tidak terlalu besar.
    const maxDimension = 2560;
    const initialScale = Math.min(1, maxDimension / Math.max(naturalWidth, naturalHeight));
    let width = Math.max(1, Math.round(naturalWidth * initialScale));
    let height = Math.max(1, Math.round(naturalHeight * initialScale));

    const qualitySteps = outputType === "image/jpeg" ? [0.9, 0.8, 0.7, 0.6] : [1];

    for (let attempt = 0; attempt < 8; attempt++) {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);

      // JPEG tidak mendukung transparansi; beri alas putih agar tidak hitam.
      if (outputType === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(image, 0, 0, width, height);

      for (const quality of qualitySteps) {
        const blob = await canvasToBlob(canvas, outputType, quality);
        if (blob && blob.size <= maxBytes) {
          return new File([blob], file.name, { type: outputType });
        }
      }

      width = Math.max(1, Math.round(width * 0.8));
      height = Math.max(1, Math.round(height * 0.8));
    }

    return file;
  } catch (err) {
    console.error("Gagal mengompres gambar:", err);
    return file;
  }
}

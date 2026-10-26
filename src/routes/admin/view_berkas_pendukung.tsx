import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer, Loader2, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { API_BASE_URL as BASE_API_URL, storageUrl } from "@/lib/api";
import { PAGE_TITLES } from "@/config/app";

export type ViewBerkasPendukungSearch = {
  id?: string | number;
};

export const Route = createFileRoute("/admin/view_berkas_pendukung")({
  validateSearch: (search: Record<string, unknown>): ViewBerkasPendukungSearch => {
    return {
      id: search["id"] ? String(search["id"]) : "",
    };
  },
  head: () => ({
    meta: [
      {
        title: PAGE_TITLES.adminViewBerkasPendukung,
      },
    ],
  }),
  component: ViewBerkasPendukungPage,
});

/** Satu file bukti pendukung yang siap ditampilkan. */
type EvidenceFile = {
  key: string;
  url: string;
  name: string;
  kind: "pdf" | "image" | "other";
};

/**
 * URL file lampiran. AttachmentResource backend mengirim `url`
 * (Storage::url), bukan `file_path`. Kalau absolut (mis. APP_URL http://IP),
 * ambil path-nya saja supaya tetap lewat origin yang sama (proxy /storage).
 */
function attachmentUrl(att: any): string {
  const raw: string = att?.url || att?.file_path || "";
  if (!raw) return "";
  if (/^(https?:)?\/\//.test(raw)) {
    try {
      const u = new URL(raw, "http://x");
      return storageUrl(u.pathname + u.search);
    } catch {
      return raw;
    }
  }
  return storageUrl(raw);
}

/** Tentukan jenis file dari MIME atau ekstensi. */
function attachmentKind(att: any, url: string): EvidenceFile["kind"] {
  const mime = String(att?.mime_type || att?.file_mime || "").toLowerCase();
  const name = String(att?.file_name || att?.original_name || url).toLowerCase();
  if (mime === "application/pdf" || /\.pdf(\?|$)/.test(name)) return "pdf";
  if (mime.startsWith("image/") || /\.(jpe?g|png|gif|webp)(\?|$)/.test(name)) return "image";
  return "other";
}

/**
 * Lampiran yang dikirim lewat halaman bukti_pendukung sebagai dokumen
 * (attachments[]). Di backend (Complaint::addAttachment) dokumen disimpan
 * dengan file_type "document" (PDF) atau "photo" (gambar), sedangkan foto
 * kamera disimpan sebagai "foto_pelapor" dan tidak ditampilkan di sini.
 */
function toEvidenceFiles(attachments: any[]): EvidenceFile[] {
  return attachments
    .filter((att) => att && att.file_type !== "foto_pelapor")
    .map((att, i) => {
      const url = attachmentUrl(att);
      const name =
        att.file_name ||
        att.original_name ||
        decodeURIComponent(url.split("/").pop()?.split("?")[0] || "") ||
        `Lampiran ${i + 1}`;
      return { key: String(att.id ?? i), url, name, kind: attachmentKind(att, url) };
    })
    .filter((f) => f.url);
}

function ViewBerkasPendukungPage() {
  // Ambil id dari search query param: /admin/view_berkas_pendukung?id=41
  const search = Route.useSearch();
  const complaintId = search.id;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [files, setFiles] = useState<EvidenceFile[]>([]);

  useEffect(() => {
    if (!complaintId) {
      setErrorMsg("ID pengaduan tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setErrorMsg(null);
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

      try {
        const res = await fetch(`${BASE_API_URL}/complaints/${complaintId}`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const json = await res.json().catch(() => null);
        if (!res.ok || !json) {
          throw new Error(json?.message || `Gagal memuat berkas (Status: ${res.status})`);
        }

        const item = json.data ?? json.complaint ?? json;
        const attachments = Array.isArray(item?.attachments) ? item.attachments : [];
        setFiles(toEvidenceFiles(attachments));
      } catch (err: any) {
        console.error("Gagal load berkas pendukung:", err);
        setErrorMsg(err.message || "Terjadi kesalahan saat memuat berkas.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [complaintId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Tombol Cetak Dokumen di Atas */}
        <div className="flex justify-end print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            disabled={loading || files.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F2137] px-4 py-2 text-[11.5px] font-semibold text-white shadow-xs hover:bg-[#1a2f4a] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center rounded-2xl border border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#007A64]" />
              <span>Menyiapkan berkas pendukung #{complaintId}...</span>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-white p-12 text-center shadow-xs">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-[13px] font-semibold text-gray-800">{errorMsg}</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
            <FileText className="h-8 w-8 text-gray-400" />
            <p className="text-[13px] font-semibold text-gray-800">
              Pelapor tidak melampirkan berkas pendukung.
            </p>
          </div>
        ) : (
          /* ================= LEMBAR KERJA CETAK / PREVIEW A4 ================= */
          <div className="mx-auto flex justify-center pb-12 print:p-0 print:m-0">
            <div
              id="printable-area"
              className="w-full max-w-[760px] bg-white p-12 sm:p-16 border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] print:border-none print:shadow-none print:p-0 print:max-w-none text-[#1A202C] text-[11.5px] leading-relaxed font-sans"
            >
              {/* Judul */}
              <div className="text-center mb-10">
                <h1 className="text-[15px] font-bold text-gray-900 tracking-wide uppercase underline underline-offset-4">
                  BERKAS BUKTI PENDUKUNG
                </h1>
              </div>

              <div className="space-y-8">
                {files.map((file, i) => (
                  <section key={file.key} className="break-inside-avoid">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h2 className="text-[12px] font-bold text-gray-900 break-all">
                        {i + 1}. {file.name}
                      </h2>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#007A64] hover:underline print:hidden"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Buka file
                      </a>
                    </div>

                    {file.kind === "image" ? (
                      <img
                        src={file.url}
                        alt={`Bukti pendukung ${i + 1}: ${file.name}`}
                        className="mx-auto max-h-[900px] w-full rounded-lg border border-gray-100 object-contain"
                      />
                    ) : file.kind === "pdf" ? (
                      <iframe
                        src={file.url}
                        title={`Bukti pendukung ${i + 1}: ${file.name}`}
                        className="h-[900px] w-full rounded-lg border border-gray-100"
                      />
                    ) : (
                      <p className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-gray-500">
                        Pratinjau tidak tersedia untuk jenis file ini. Gunakan "Buka file".
                      </p>
                    )}
                  </section>
                ))}
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

import { useCallback, useRef, useState } from "react";

/**
 * Helper ekspor data tabel (Copy / CSV / Excel / PDF / Print).
 * Pola sama dengan halaman Data Provinsi (wilayah.tsx).
 */

export type ExportRow = (string | number)[];

/**
 * Hook ekspor tabel: menyediakan handler Copy/CSV/Excel/PDF/Print
 * beserta status "Copied!" untuk umpan balik tombol.
 */
export function useTableExport(opts: { baseName: string; headers: string[]; rows: ExportRow[] }) {
  const { baseName, headers, rows } = opts;
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  const showCopied = useCallback(() => {
    setCopied(true);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(headers, rows);
      showCopied();
    } catch (err) {
      console.error("Gagal menyalin data:", err);
      alert("Gagal menyalin data ke clipboard.");
    }
  }, [headers, rows, showCopied]);

  const handleCsv = useCallback(() => {
    exportCsv(headers, rows, baseName);
  }, [headers, rows, baseName]);

  const handleExcel = useCallback(() => {
    exportExcel(headers, rows, baseName);
  }, [headers, rows, baseName]);

  const handlePdf = useCallback(() => {
    exportPdf(headers, rows, baseName);
  }, [headers, rows, baseName]);

  return { copied, handleCopy, handleCsv, handleExcel, handlePdf, handlePrint: exportPrint };
}

function fileStamp(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Teks tab-separated untuk aksi Copy (dibuat sinkron untuk fallback). */
export function buildCopyText(headers: string[], rows: ExportRow[]): string {
  return `${headers.join("\t")}\n${rows.map((row) => row.join("\t")).join("\n")}`;
}

/** Salin ke clipboard dengan fallback document.execCommand. */
export async function copyToClipboard(headers: string[], rows: ExportRow[]): Promise<void> {
  const text = buildCopyText(headers, rows);

  const copyViaFallback = (): boolean => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  };

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else if (!copyViaFallback()) {
    throw new Error("Gagal menyalin ke clipboard.");
  }
}

/** Ekspor ke CSV (dengan BOM UTF-8 agar Excel membaca karakter Indonesia). */
export function exportCsv(headers: string[], rows: ExportRow[], baseName: string): void {
  const escapeCell = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;

  const csv = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ].join("\n");

  downloadFile(
    new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" }),
    `${baseName}_${fileStamp()}.csv`,
  );
}

/** Ekspor ke Excel (.xls) via HTML table. */
export function exportExcel(headers: string[], rows: ExportRow[], baseName: string): void {
  const table = `
    <table border="1">
      <thead>
        <tr>${headers
          .map((h) => `<th style="background:#EDF3F8;font-weight:bold;">${h}</th>`)
          .join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>`;

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${table}</body></html>`;

  downloadFile(
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }),
    `${baseName}_${fileStamp()}.xls`,
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Ekspor ke file PDF (.pdf) dari dokumen HTML yang siap cetak, diunduh langsung (tidak lewat dialog print). */
export function exportPdf(headers: string[], rows: ExportRow[], baseName: string): void {
  const th = (v: string) =>
    `<th style="border:1px solid #d1d5db;padding:6px 10px;background:#EDF3F8;text-align:left;font-size:11px;">${escapeHtml(v)}</th>`;
  const td = (v: string | number) =>
    `<td style="border:1px solid #d1d5db;padding:6px 10px;font-size:11px;">${escapeHtml(String(v))}</td>`;

  const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(baseName)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; margin: 32px; color: #111827; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .sub { font-size: 12px; color: #6b7280; margin: 0 0 20px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d1d5db; padding: 6px 10px; font-size: 11px; text-align: left; }
  th { background: #EDF3F8; }
</style>
</head>
<body>
<h1>${escapeHtml(baseName)}</h1>
<p class="sub">Dicetak ${new Date().toLocaleString("id-ID")}</p>
<table>
<thead><tr><th style="border:1px solid #d1d5db;padding:6px 10px;background:#EDF3F8;text-align:left;">No</th>${headers.map(th).join("")}</tr></thead>
<tbody>${rows
    .map(
      (row, i) =>
        `<tr><td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;">${i + 1}</td>${row.map(td).join("")}</tr>`,
    )
    .join("")}</tbody>
</table>
</body>
</html>`;

  downloadFile(
    new Blob([html], { type: "application/pdf;charset=utf-8;" }),
    `${baseName}_${fileStamp()}.pdf`,
  );
}

/** Cetak / simpan sebagai PDF memakai dialog print browser. */
export function exportPrint(): void {
  window.print();
}

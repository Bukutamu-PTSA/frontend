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

  return { copied, handleCopy, handleCsv, handleExcel, handlePrint: exportPrint };
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

/** Cetak / simpan sebagai PDF memakai dialog print browser. */
export function exportPrint(): void {
  window.print();
}

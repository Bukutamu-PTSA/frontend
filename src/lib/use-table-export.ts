import { useCallback, useEffect, useRef, useState } from "react";
import {
  copyToClipboard,
  exportCsv,
  exportExcel,
  exportPdf,
  exportPrint,
  type ExportRow,
} from "@/lib/export-utils";

export type TableExportOptions = {
  baseName: string;
  headers: string[];
  rows: ExportRow[];
};

/**
 * Hook ekspor tabel: menyediakan handler Copy/CSV/Excel/PDF/Print
 * beserta status "Copied!" untuk umpan balik tombol.
 */
export function useTableExport({ baseName, headers, rows }: TableExportOptions) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const showCopied = useCallback(() => {
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
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

  const handleCsv = useCallback(
    () => exportCsv(headers, rows, baseName),
    [baseName, headers, rows],
  );
  const handleExcel = useCallback(
    () => exportExcel(headers, rows, baseName),
    [baseName, headers, rows],
  );
  const handlePdf = useCallback(
    () => exportPdf(headers, rows, baseName),
    [baseName, headers, rows],
  );

  return { copied, handleCopy, handleCsv, handleExcel, handlePdf, handlePrint: exportPrint };
}

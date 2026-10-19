/**
 * Helper ekspor data tabel (Copy / CSV / Excel / PDF / Print) yang tidak
 * bergantung pada React, dipakai oleh `useTableExport`.
 */

export type ExportRow = (string | number)[];

/** Tanggal hari ini sebagai suffix nama file: "2026-08-12". */
function fileStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Teks tab-separated untuk aksi Copy. */
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
    textarea.remove();
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
          .map((h) => `<th style="background:#EDF3F8;font-weight:bold;">${escapeHtml(h)}</th>`)
          .join("")}</tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join("")}</tr>`,
          )
          .join("")}
      </tbody>
    </table>`;

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${table}</body></html>`;

  downloadFile(
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }),
    `${baseName}_${fileStamp()}.xls`,
  );
}

const CELL_BORDER = "border:1px solid #d1d5db;padding:6px 10px;";
const TH_STYLE = `${CELL_BORDER}background:#EDF3F8;text-align:left;font-size:11px;`;
const TD_STYLE = `${CELL_BORDER}font-size:11px;`;
const NO_TH_STYLE = `${CELL_BORDER}background:#EDF3F8;text-align:left;`;
const NO_TD_STYLE = `${CELL_BORDER}text-align:center;`;

/** Unduh dokumen HTML siap cetak dengan ekstensi .pdf (dibuka lewat dialog print browser). */
export function exportPdf(headers: string[], rows: ExportRow[], baseName: string): void {
  const th = (value: string) => `<th style="${TH_STYLE}">${escapeHtml(value)}</th>`;
  const td = (value: string | number) =>
    `<td style="${TD_STYLE}">${escapeHtml(String(value))}</td>`;

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
<thead><tr><th style="${NO_TH_STYLE}">No</th>${headers.map(th).join("")}</tr></thead>
<tbody>${rows
    .map(
      (row, index) =>
        `<tr><td style="${NO_TD_STYLE}">${index + 1}</td>${row.map(td).join("")}</tr>`,
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

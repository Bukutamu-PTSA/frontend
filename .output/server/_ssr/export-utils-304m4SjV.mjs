import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-utils-304m4SjV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Hook ekspor tabel: menyediakan handler Copy/CSV/Excel/PDF/Print
* beserta status "Copied!" untuk umpan balik tombol.
*/
function useTableExport(opts) {
	const { baseName, headers, rows } = opts;
	const [copied, setCopied] = (0, import_react.useState)(false);
	const copyTimer = (0, import_react.useRef)(null);
	const showCopied = (0, import_react.useCallback)(() => {
		setCopied(true);
		if (copyTimer.current) window.clearTimeout(copyTimer.current);
		copyTimer.current = window.setTimeout(() => setCopied(false), 2e3);
	}, []);
	return {
		copied,
		handleCopy: (0, import_react.useCallback)(async () => {
			try {
				await copyToClipboard(headers, rows);
				showCopied();
			} catch (err) {
				console.error("Gagal menyalin data:", err);
				alert("Gagal menyalin data ke clipboard.");
			}
		}, [
			headers,
			rows,
			showCopied
		]),
		handleCsv: (0, import_react.useCallback)(() => {
			exportCsv(headers, rows, baseName);
		}, [
			headers,
			rows,
			baseName
		]),
		handleExcel: (0, import_react.useCallback)(() => {
			exportExcel(headers, rows, baseName);
		}, [
			headers,
			rows,
			baseName
		]),
		handlePrint: exportPrint
	};
}
function fileStamp() {
	return (/* @__PURE__ */ new Date()).toISOString().split("T")[0] ?? "";
}
function downloadFile(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
/** Teks tab-separated untuk aksi Copy (dibuat sinkron untuk fallback). */
function buildCopyText(headers, rows) {
	return `${headers.join("	")}\n${rows.map((row) => row.join("	")).join("\n")}`;
}
/** Salin ke clipboard dengan fallback document.execCommand. */
async function copyToClipboard(headers, rows) {
	const text = buildCopyText(headers, rows);
	const copyViaFallback = () => {
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
	if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
	else if (!copyViaFallback()) throw new Error("Gagal menyalin ke clipboard.");
}
/** Ekspor ke CSV (dengan BOM UTF-8 agar Excel membaca karakter Indonesia). */
function exportCsv(headers, rows, baseName) {
	const escapeCell = (cell) => `"${String(cell).replace(/"/g, "\"\"")}"`;
	const csv = [headers.map(escapeCell).join(","), ...rows.map((row) => row.map(escapeCell).join(","))].join("\n");
	downloadFile(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" }), `${baseName}_${fileStamp()}.csv`);
}
/** Ekspor ke Excel (.xls) via HTML table. */
function exportExcel(headers, rows, baseName) {
	const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${`
    <table border="1">
      <thead>
        <tr>${headers.map((h) => `<th style="background:#EDF3F8;font-weight:bold;">${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>`}</body></html>`;
	downloadFile(new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }), `${baseName}_${fileStamp()}.xls`);
}
/** Cetak / simpan sebagai PDF memakai dialog print browser. */
function exportPrint() {
	window.print();
}
//#endregion
export { useTableExport as t };

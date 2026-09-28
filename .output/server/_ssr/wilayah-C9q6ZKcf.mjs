import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BipEh2FU.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { P as LoaderCircle, X as Download, at as Check, g as Search, it as ChevronLeft, rt as ChevronRight, vt as ArrowUpDown } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CVfVOAjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wilayah-C9q6ZKcf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROVINCE_SUMMARY_API_URL = apiUrl("dashboard/province-summary");
var PROVINCE_PDF_API_URL = apiUrl("dashboard/province-summary/pdf");
var CATEGORIES_API_URL = apiUrl("complaint-categories");
var DEFAULT_CATEGORY_COLUMNS = [
	{
		apiKey: "WAJIB_LAPOR",
		label: "WAJIB LAPOR KETENAGAKERJAAN"
	},
	{
		apiKey: "UPAH_KERJA",
		label: "UPAH KERJA"
	},
	{
		apiKey: "JAMINAN_SOSIAL",
		label: "JAMINAN SOSIAL"
	},
	{
		apiKey: "HUBUNGAN_KERJA",
		label: "HUBUNGAN KERJA"
	},
	{
		apiKey: "KECELAKAAN_KERJA",
		label: "KECELAKAAN KERJA"
	},
	{
		apiKey: "WAKTU_KERJA",
		label: "WAKTU KERJA & WAKTU ISTIRAHAT"
	},
	{
		apiKey: "KADER_NORMA",
		label: "KADER NORMA KETENAGAKERJAAN"
	},
	{
		apiKey: "PENEMPATAN_TK",
		label: "PENEMPATAN TK DALAM & LUAR NEGERI"
	},
	{
		apiKey: "K3",
		label: "KESELAMATAN & KESEHATAN KERJA"
	},
	{
		apiKey: "PEREMPUAN_ANAK",
		label: "PEREMPUAN & ANAK"
	},
	{
		apiKey: "NORMA_K3",
		label: "KADER NORMA K3"
	},
	{
		apiKey: "SKP",
		label: "SKP"
	}
];
function toTitleCase(str) {
	if (!str) return "-";
	return str.toLowerCase().split(" ").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function getPaginationRange(current, total) {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	if (current <= 4) return [
		1,
		2,
		3,
		4,
		5,
		"...",
		total
	];
	if (current >= total - 3) return [
		1,
		"...",
		total - 4,
		total - 3,
		total - 2,
		total - 1,
		total
	];
	return [
		1,
		"...",
		current - 1,
		current,
		current + 1,
		"...",
		total
	];
}
function mapProvinsiItem(item, no, columns) {
	let provName = toTitleCase(item.provinsi || "-");
	if (provName.toUpperCase().includes("DKI") || provName.toUpperCase().includes("IBUKOTA") || provName.toUpperCase().includes("JAKARTA")) provName = "Daerah Khusus Ibukota Jakarta";
	const rawCounts = item.category_counts || {};
	const counts = {};
	Object.entries(rawCounts).forEach(([key, value]) => {
		counts[String(key).trim().toUpperCase()] = Number(value ?? 0);
	});
	const rowObj = {
		no,
		provinsi: provName,
		total: Number(item.count ?? item.total ?? 0)
	};
	columns.forEach((col) => {
		rowObj[col.apiKey] = counts[col.apiKey] ?? 0;
	});
	return rowObj;
}
function DataProvinsiPage() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [rawProvinces, setRawProvinces] = (0, import_react.useState)([]);
	const [categoryColumns, setCategoryColumns] = (0, import_react.useState)(DEFAULT_CATEGORY_COLUMNS);
	const [search, setSearch] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [downloadingPdf, setDownloadingPdf] = (0, import_react.useState)(false);
	const [sortField, setSortField] = (0, import_react.useState)("total");
	const [sortAsc, setSortAsc] = (0, import_react.useState)(false);
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 10;
	(0, import_react.useEffect)(() => {
		const fetchAllProvinces = async () => {
			setLoading(true);
			const headers = authHeaders();
			const extractList = (json) => Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
			try {
				const columns = extractList(await fetch(CATEGORIES_API_URL, { headers }).then((r) => r.ok ? r.json() : null).catch(() => null)).map((c) => ({
					apiKey: String(c.category_code ?? "").trim().toUpperCase(),
					label: String(c.category_name ?? c.name ?? "").trim().toUpperCase()
				})).filter((c) => c.apiKey && c.label).filter((c, i, arr) => arr.findIndex((x) => x.apiKey === c.apiKey) === i);
				if (columns.length > 0) setCategoryColumns(columns);
			} catch (err) {
				console.error("Gagal memuat master kategori:", err);
			}
			const perPage = 100;
			const buildUrl = (page) => `${PROVINCE_SUMMARY_API_URL}?with_categories=1&page=${page}&per_page=${perPage}`;
			const fetchPage = async (page) => {
				const res = await fetch(buildUrl(page), { headers });
				if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
				return res.json();
			};
			try {
				const first = await fetchPage(1);
				const collected = extractList(first);
				const lastPage = Number(first?.meta?.last_page ?? first?.last_page ?? 1);
				if (Number.isFinite(lastPage) && lastPage > 1) {
					const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
					(await Promise.all(pages.map((p) => fetchPage(p)))).forEach((json) => {
						collected.push(...extractList(json));
					});
				}
				setRawProvinces(collected);
			} catch (err) {
				console.error("Gagal memuat data provinsi:", err);
				setRawProvinces([]);
			} finally {
				setLoading(false);
			}
		};
		fetchAllProvinces();
	}, []);
	const tableData = (0, import_react.useMemo)(() => rawProvinces.map((item, idx) => mapProvinsiItem(item, idx + 1, categoryColumns)), [rawProvinces, categoryColumns]);
	const filteredData = (0, import_react.useMemo)(() => {
		const result = tableData.filter((row) => row.provinsi.toLowerCase().includes(search.toLowerCase().trim()));
		result.sort((a, b) => {
			const valA = a[sortField];
			const valB = b[sortField];
			if (typeof valA === "number" && typeof valB === "number") return sortAsc ? valA - valB : valB - valA;
			return sortAsc ? String(valA ?? "").localeCompare(String(valB ?? "")) : String(valB ?? "").localeCompare(String(valA ?? ""));
		});
		return result;
	}, [
		tableData,
		search,
		sortField,
		sortAsc
	]);
	const totalItems = filteredData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
	(0, import_react.useEffect)(() => {
		setCurrentPage(1);
	}, [
		search,
		sortField,
		sortAsc
	]);
	(0, import_react.useEffect)(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [currentPage, totalPages]);
	const pagedData = (0, import_react.useMemo)(() => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [
		filteredData,
		currentPage,
		itemsPerPage
	]);
	const paginationRange = (0, import_react.useMemo)(() => getPaginationRange(currentPage, totalPages), [currentPage, totalPages]);
	const handleSort = (field) => {
		if (sortField === field) setSortAsc(!sortAsc);
		else {
			setSortField(field);
			setSortAsc(false);
		}
	};
	const buildExportData = () => {
		return {
			headers: [
				"NO",
				"PROVINSI",
				"TOTAL",
				...categoryColumns.map((c) => c.label)
			],
			rows: filteredData.map((r, index) => [
				index + 1,
				r.provinsi,
				r.total,
				...categoryColumns.map((c) => Number(r[c.apiKey] ?? 0))
			])
		};
	};
	const fileStamp = () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const downloadFile = (blob, filename) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};
	const handleCopy = async () => {
		const { headers, rows } = buildExportData();
		const text = `${headers.join("	")}\n${rows.map((row) => row.join("	")).join("\n")}`;
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
		try {
			if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
			else if (!copyViaFallback()) throw new Error("Gagal menyalin ke clipboard.");
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		} catch (err) {
			console.error("Gagal menyalin data:", err);
		}
	};
	const handleExportCsv = () => {
		const { headers, rows } = buildExportData();
		const escapeCell = (cell) => `"${String(cell).replace(/"/g, "\"\"")}"`;
		const csv = [headers.map(escapeCell).join(","), ...rows.map((row) => row.map(escapeCell).join(","))].join("\n");
		downloadFile(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" }), `Data_Provinsi_${fileStamp()}.csv`);
	};
	const handleExportExcel = () => {
		const { headers, rows } = buildExportData();
		const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${`
      <table border="1">
        <thead>
          <tr>${headers.map((h) => `<th style="background:#EDF3F8;font-weight:bold;">${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>`}</body></html>`;
		downloadFile(new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }), `Data_Provinsi_${fileStamp()}.xls`);
	};
	const handlePrintPdf = () => {
		window.print();
	};
	const handleExportPdf = async () => {
		if (downloadingPdf) return;
		try {
			setDownloadingPdf(true);
			const response = await fetch(PROVINCE_PDF_API_URL, {
				method: "GET",
				headers: {
					Accept: "application/pdf, application/json",
					...authHeaders()
				}
			});
			if (!response.ok) {
				let message = `Gagal mengunduh PDF (HTTP ${response.status}).`;
				if ((response.headers.get("content-type") || "").includes("application/json")) {
					const json = await response.json().catch(() => null);
					message = json?.message || json?.data?.message || (json?.errors && typeof json.errors === "object" ? Object.values(json.errors).flat().join(", ") : "") || message;
				}
				throw new Error(message);
			}
			const contentType = response.headers.get("content-type") || "";
			if (response.redirected) {
				const a = document.createElement("a");
				a.href = response.url;
				a.target = "_blank";
				a.download = `Data_Provinsi_${fileStamp()}.pdf`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				return;
			}
			if (contentType.includes("application/json")) {
				const json = await response.json();
				const fileUrl = json?.url || json?.data?.url || json?.pdf_url || json?.download_url;
				if (fileUrl) {
					const a = document.createElement("a");
					a.href = fileUrl;
					a.target = "_blank";
					a.download = `Data_Provinsi_${fileStamp()}.pdf`;
					document.body.appendChild(a);
					a.click();
					a.remove();
					return;
				}
				throw new Error(json?.message || "Format data JSON tidak memuat URL file PDF.");
			}
			if (!contentType.includes("application/pdf")) throw new Error(`Respons tidak dikenali (${contentType || "tanpa content-type"}). Periksa endpoint backend.`);
			const blob = await response.blob();
			downloadFile(blob, `Data_Provinsi_${fileStamp()}.pdf`);
		} catch (err) {
			console.error("Export PDF error:", err);
			alert(err.message || "Terjadi kesalahan saat mengunduh PDF.");
		} finally {
			setDownloadingPdf(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-xl border border-gray-100 p-6 shadow-xs print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[17px] font-bold text-gray-900 tracking-tight",
					children: "Data Provinsi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11.5px] text-gray-500 mt-0.5",
					children: "Rekapitulasi persebaran pelayanan aduan masyarakat di seluruh provinsi"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-3.5 print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-[11px] font-medium text-gray-700 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleCopy,
								className: "px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1 cursor-pointer border-r border-gray-100",
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-emerald-600" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied!" : "Copy" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleExportCsv,
								className: "px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100",
								children: "CSV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleExportExcel,
								className: "px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100",
								children: "Excel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleExportPdf,
								disabled: downloadingPdf,
								className: "px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border-r border-gray-100 flex items-center gap-1 disabled:opacity-60",
								children: [downloadingPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: downloadingPdf ? "Memuat…" : "PDF" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePrintPdf,
								className: "px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors cursor-pointer",
								children: "Print"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Cari provinsi...",
							className: "w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 pr-8 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "printable-table",
				className: "bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-[11px] whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-[#EDF3F8] text-[9.5px] font-bold text-gray-600 uppercase tracking-tight border-b border-gray-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 w-10 text-center",
									children: "NO"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("provinsi"),
									className: "px-4 py-3 cursor-pointer select-none hover:text-gray-900",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PROVINSI" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 opacity-60" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort("total"),
									className: "px-3 py-3 text-center font-extrabold cursor-pointer select-none hover:text-gray-900 bg-blue-50/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 opacity-60" })]
									})
								}),
								categoryColumns.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									onClick: () => handleSort(cat.apiKey),
									className: "px-3 py-3 text-center cursor-pointer select-none hover:text-gray-900",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-center gap-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.label })
									})
								}, cat.apiKey))
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-100 text-gray-700 text-[11px]",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: categoryColumns.length + 3,
								className: "px-6 py-14 text-center text-gray-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#007A64]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Memuat data rekapitulasi provinsi..." })]
								})
							}) }) : filteredData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: categoryColumns.length + 3,
								className: "px-6 py-10 text-center text-gray-400",
								children: "Tidak ada data provinsi yang ditemukan."
							}) }) : pagedData.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50/70 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3.5 text-center text-gray-500 font-medium",
										children: (currentPage - 1) * itemsPerPage + index + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 font-medium text-gray-800",
										children: row.provinsi
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3.5 text-center font-bold text-gray-900 bg-blue-50/30",
										children: row.total
									}),
									categoryColumns.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3.5 text-center text-gray-600",
										children: row[cat.apiKey] ?? 0
									}, cat.apiKey))
								]
							}, row.no))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center justify-between px-4 py-3.5 border-t border-gray-100 gap-3 print:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-gray-500",
						children: [
							"Menampilkan ",
							totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0,
							" to",
							" ",
							(currentPage - 1) * itemsPerPage + pagedData.length,
							" dari ",
							totalItems,
							" data"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
								disabled: currentPage === 1,
								className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
							}),
							paginationRange.map((page, i) => page === "..." ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-7 w-6 place-items-center text-[11px] text-gray-400 select-none",
								children: "..."
							}, `ellipsis-${i}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCurrentPage(Number(page)),
								className: `grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${currentPage === page ? "bg-[#007A64] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"}`,
								children: page
							}, `page-${page}`)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
								disabled: currentPage === totalPages,
								className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
							})
						]
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { DataProvinsiPage as component };

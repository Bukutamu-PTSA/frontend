import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as Download, M as Eye, d as Search, k as FileText, o as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CZ5KQ9QL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reportpengaduan-Cb3NAqqq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nf = new Intl.NumberFormat("id-ID");
var SCALE_STATS = [
	{
		key: "mikro",
		label: "MIKRO",
		total: 714
	},
	{
		key: "kecil",
		label: "KECIL",
		total: 291
	},
	{
		key: "menengah",
		label: "MENENGAH",
		total: 312
	},
	{
		key: "besar",
		label: "BESAR",
		total: 272
	}
];
var ALL_ROWS = [
	{
		no: 1,
		tanggal: "27 Aug 2026",
		jenis: "WLKP",
		pelapor: "Dinda Nurhaliza",
		perusahaan: "PT Accentuates"
	},
	{
		no: 2,
		tanggal: "27 Aug 2026",
		jenis: "WLKP",
		pelapor: "Deasy Ayu Wulan",
		perusahaan: "PT Raharja Energi"
	},
	{
		no: 3,
		tanggal: "26 Aug 2026",
		jenis: "WLKP",
		pelapor: "Anggun Puspita",
		perusahaan: "PT Mitra-Net"
	},
	{
		no: 4,
		tanggal: "25 Aug 2026",
		jenis: "Norma Kerja",
		pelapor: "Budi Santoso",
		perusahaan: "PT Maju Jaya"
	},
	{
		no: 5,
		tanggal: "25 Aug 2026",
		jenis: "K3",
		pelapor: "Siti Aminah",
		perusahaan: "PT Konstruksi Abadi"
	},
	{
		no: 6,
		tanggal: "24 Aug 2026",
		jenis: "Upah",
		pelapor: "Rahmat Hidayat",
		perusahaan: "PT Retail Sejahtera"
	},
	{
		no: 7,
		tanggal: "24 Aug 2026",
		jenis: "PHK",
		pelapor: "Lestari Putri",
		perusahaan: "PT Tekno Solusi"
	},
	{
		no: 8,
		tanggal: "23 Aug 2026",
		jenis: "WLKP",
		pelapor: "Andi Wijaya",
		perusahaan: "PT Logistik Cepat"
	},
	{
		no: 9,
		tanggal: "22 Aug 2026",
		jenis: "K3",
		pelapor: "Retno Sari",
		perusahaan: "PT Energi Terbarukan"
	},
	{
		no: 10,
		tanggal: "21 Aug 2026",
		jenis: "Upah",
		pelapor: "Fajar Nugroho",
		perusahaan: "PT Sinar Mas"
	},
	{
		no: 11,
		tanggal: "20 Aug 2026",
		jenis: "Norma Kerja",
		pelapor: "Wulan Sari",
		perusahaan: "PT Cahaya Abadi"
	},
	{
		no: 12,
		tanggal: "19 Aug 2026",
		jenis: "PHK",
		pelapor: "Bagus Prasetyo",
		perusahaan: "PT Karya Utama"
	}
];
var MONTH_OPTIONS = [
	"Semua Bulan",
	"Januari",
	"Februari",
	"Maret",
	"April",
	"Mei",
	"Juni",
	"Juli",
	"Agustus",
	"September",
	"Oktober",
	"November",
	"Desember"
];
var YEAR_OPTIONS = [
	"2026",
	"2025",
	"2024",
	"2023"
];
var TOTAL_DATA = 128;
function ReportPengaduanPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [month, setMonth] = (0, import_react.useState)("Semua Bulan");
	const [year, setYear] = (0, import_react.useState)("2026");
	const [appliedSearch, setAppliedSearch] = (0, import_react.useState)("");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 10;
	const filteredRows = (0, import_react.useMemo)(() => {
		const q = appliedSearch.trim().toLowerCase();
		if (!q) return ALL_ROWS;
		return ALL_ROWS.filter((r) => r.pelapor.toLowerCase().includes(q) || r.perusahaan.toLowerCase().includes(q) || r.jenis.toLowerCase().includes(q));
	}, [appliedSearch]);
	const totalPages = Math.max(1, Math.ceil(TOTAL_DATA / itemsPerPage));
	const displayedRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const handleFilter = () => {
		setAppliedSearch(search);
		setCurrentPage(1);
	};
	const handleReset = () => {
		setSearch("");
		setMonth("Semua Bulan");
		setYear("2026");
		setAppliedSearch("");
		setCurrentPage(1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[15px] font-bold text-gray-800 tracking-tight",
				children: "All Report Pengaduan"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-xl border border-gray-100 p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2.5 md:flex-row md:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleFilter(),
								placeholder: "Cari pengaduan...",
								className: "w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: month,
								onChange: (e) => setMonth(e.target.value),
								className: "appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#007A64] cursor-pointer",
								children: MONTH_OPTIONS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m,
									children: m
								}, m))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-gray-400",
								children: "▼"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: year,
								onChange: (e) => setYear(e.target.value),
								className: "appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#007A64] cursor-pointer",
								children: YEAR_OPTIONS.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: y,
									children: y
								}, y))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-gray-400",
								children: "▼"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleFilter,
							className: "inline-flex items-center justify-center rounded-lg bg-[#0F2137] px-5 py-2 text-[11px] font-semibold text-white hover:bg-[#1a2f4a] transition-colors cursor-pointer",
							children: "Filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleReset,
							className: "inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer",
							children: "Reset"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: SCALE_STATS.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold tracking-wider text-gray-400 uppercase",
						children: stat.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[18px] font-bold text-gray-900 leading-none",
						children: [
							nf.format(stat.total),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-medium text-gray-500",
								children: "Pengaduan"
							})
						]
					})]
				}, stat.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-[#F0F5FA] text-[10px] font-bold text-gray-600 uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3.5 w-16",
									children: "NO"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3.5",
									children: "TANGGAL PENGADUAN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3.5",
									children: "JENIS PENGADUAN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3.5",
									children: "PELAPOR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3.5",
									children: "PERUSAHAAN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3.5 text-right w-40",
									children: "AKSI"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-50 text-[12px]",
							children: displayedRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "px-6 py-10 text-center text-gray-400",
								children: "Tidak ada data pengaduan."
							}) }) : displayedRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50/60 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3.5 text-gray-600 font-medium",
										children: row.no
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3.5 text-gray-700",
										children: row.tanggal
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3.5 text-gray-700 font-medium",
										children: row.jenis
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3.5 text-gray-800 font-medium",
										children: row.pelapor
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3.5 text-gray-700",
										children: row.perusahaan
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Unduh",
													className: "grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Detail Berkas",
													className: "grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Lihat",
													className: "grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white hover:bg-[#00654F] transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Hapus",
													className: "grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})
											]
										})
									})
								]
							}, row.no))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-gray-500",
					children: [
						"Menampilkan ",
						displayedRows.length ? (currentPage - 1) * itemsPerPage + 1 : 0,
						" to",
						" ",
						(currentPage - 1) * itemsPerPage + displayedRows.length,
						" dari",
						" ",
						nf.format(TOTAL_DATA),
						" data"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
							disabled: currentPage === 1,
							className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40",
							children: "‹"
						}),
						Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCurrentPage(page),
							className: `grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${currentPage === page ? "bg-[#007A64] text-white" : "text-gray-600 hover:bg-gray-100"}`,
							children: page
						}, page)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
							disabled: currentPage === totalPages,
							className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40",
							children: "›"
						})
					]
				})]
			})
		]
	}) });
}
//#endregion
export { ReportPengaduanPage as component };

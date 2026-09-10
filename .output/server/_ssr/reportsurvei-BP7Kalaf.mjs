import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as LoaderCircle, J as FileSpreadsheet, K as Frown, Q as Eye, Y as FileDown, d as Trash2, it as Columns3, j as Meh, lt as ChevronRight, m as Smile, q as FileText, rt as Copy, ut as ChevronLeft, v as Search, z as Inbox } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-q-G8Lutm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reportsurvei-BP7Kalaf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SURVEY_API_URL = "http://192.168.147.199:8000/api";
var nf = new Intl.NumberFormat("id-ID");
function formatDateIndo(dateStr) {
	if (!dateStr) return "-";
	try {
		const d = new Date(String(dateStr).replace(" ", "T"));
		if (isNaN(d.getTime())) return String(dateStr);
		return d.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		});
	} catch {
		return String(dateStr);
	}
}
/** Kategorikan rata-rata nilai menjadi Baik / Cukup / Kurang. */
function categorize(item) {
	const vals = [
		Number(item.komunikasi_petugas ?? 0),
		Number(item.substansi_materi ?? 0),
		Number(item.sarana_prasarana ?? 0)
	].filter((v) => !isNaN(v) && v > 0);
	if (vals.length === 0) return "cukup";
	const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
	if (avg >= 3.5) return "baik";
	if (avg >= 2.5) return "cukup";
	return "kurang";
}
function ReportSurveiPage() {
	const [respondents, setRespondents] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 10;
	(0, import_react.useEffect)(() => {
		const fetchSurveys = async () => {
			setLoading(true);
			const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
			const authHeaders = {
				"Content-Type": "application/json",
				Accept: "application/json",
				...token ? { Authorization: `Bearer ${token}` } : {}
			};
			try {
				const res = await fetch(`${SURVEY_API_URL}/surveys?per_page=50`, {
					method: "GET",
					headers: authHeaders
				});
				if (res.ok) {
					const json = await res.json();
					const data = Array.isArray(json?.data) ? json.data : Array.isArray(json?.data?.data) ? json.data.data : Array.isArray(json) ? json : [];
					setRespondents(data);
				} else setRespondents([]);
			} catch (err) {
				console.error("Gagal mengambil data survei:", err);
				setRespondents([]);
			} finally {
				setLoading(false);
			}
		};
		fetchSurveys();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return respondents;
		return respondents.filter((item) => {
			const nama = String(item.name ?? "").toLowerCase();
			const ket = String(item.keterangan ?? "").toLowerCase();
			const tgl = formatDateIndo(item.survey_date ?? item.created_at).toLowerCase();
			return nama.includes(q) || ket.includes(q) || tgl.includes(q);
		});
	}, [respondents, search]);
	const stats = (0, import_react.useMemo)(() => {
		let baik = 0;
		let cukup = 0;
		let kurang = 0;
		filtered.forEach((item) => {
			const c = categorize(item);
			if (c === "baik") baik++;
			else if (c === "cukup") cukup++;
			else kurang++;
		});
		return {
			baik,
			cukup,
			kurang
		};
	}, [filtered]);
	const totalData = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalData / itemsPerPage));
	const displayedRows = (0, import_react.useMemo)(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage]);
	const summaryCards = [
		{
			key: "baik",
			title: "PELAYANAN BAIK",
			total: stats.baik,
			topBorder: "border-t-[#10B981]",
			badgeBg: "bg-[#DCFCE7]",
			badgeText: "text-[#10B981]",
			Icon: Smile
		},
		{
			key: "cukup",
			title: "PELAYANAN CUKUP",
			total: stats.cukup,
			topBorder: "border-t-[#F59E0B]",
			badgeBg: "bg-[#FEF3C7]",
			badgeText: "text-[#F59E0B]",
			Icon: Meh
		},
		{
			key: "kurang",
			title: "PELAYANAN KURANG",
			total: stats.kurang,
			topBorder: "border-t-[#EF4444]",
			badgeBg: "bg-[#FEE2E2]",
			badgeText: "text-[#EF4444]",
			Icon: Frown
		}
	];
	const startEntry = displayedRows.length ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endEntry = (currentPage - 1) * itemsPerPage + displayedRows.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Report Survei",
		breadcrumb: "Report Survei",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[20px] font-semibold tracking-tight text-gray-800",
					children: "Report Survei Pelayanan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-4 md:grid-cols-3",
					children: summaryCards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-xl border border-t-2 border-gray-100 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] ${card.topBorder}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] font-bold uppercase tracking-wide text-gray-700",
									children: card.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[10px] text-gray-400",
									children: "Komunikasi, Materi, Sarpras"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-8 w-8 shrink-0 place-items-center rounded-full ${card.badgeBg}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.Icon, { className: `h-4 w-4 ${card.badgeText}` })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-end justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[22px] font-bold leading-none text-gray-900",
								children: nf.format(card.total)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-400",
								children: "Responden"
							})]
						})]
					}, card.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 border-b border-gray-50 p-4 lg:flex-row lg:items-center lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-[14px] font-bold text-gray-800",
									children: "Detail Responden"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-[#EEF2F6] px-2 py-0.5 text-[10px] font-semibold text-gray-500",
									children: [nf.format(totalData), " Data"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: search,
										onChange: (e) => {
											setSearch(e.target.value);
											setCurrentPage(1);
										},
										placeholder: "Cari responden...",
										className: "w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64] sm:w-56"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), " Copy"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), " CSV"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5" }), " Excel"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#EF4444] transition-colors hover:bg-red-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-3.5 w-3.5" }), " PDF"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											title: "Kolom",
											className: "grid h-[30px] w-[30px] place-items-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns3, { className: "h-3.5 w-3.5" })
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "text-[11px] font-semibold text-gray-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-6 py-3 w-14",
											children: "No"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-6 py-3",
											children: "Tanggal Survei"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-6 py-3",
											children: "Komunikasi Petugas"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-6 py-3",
											children: "Substansi Materi"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-6 py-3",
											children: "Sarana Prasarana"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-6 py-3",
											children: "Keterangan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-6 py-3 text-right w-24",
											children: "Tools"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-gray-50 text-[12px]",
									children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 7,
										className: "px-6 py-16 text-center text-gray-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#007A64]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Memuat data responden..." })]
										})
									}) }) : displayedRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 7,
										className: "px-6 py-16 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-12 w-12 place-items-center rounded-full bg-gray-100",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-5 w-5 text-gray-400" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[12px] text-gray-400",
												children: "Tidak ada data responden untuk periode ini"
											})]
										})
									}) }) : displayedRows.map((item, index) => {
										const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "transition-colors hover:bg-gray-50/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-6 py-3.5 font-medium text-gray-600",
													children: rowNumber
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-6 py-3.5 text-gray-700",
													children: formatDateIndo(item.survey_date ?? item.created_at)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-6 py-3.5 text-gray-700",
													children: item.komunikasi_petugas ?? "-"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-6 py-3.5 text-gray-700",
													children: item.substansi_materi ?? "-"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-6 py-3.5 text-gray-700",
													children: item.sarana_prasarana ?? "-"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-6 py-3.5 text-gray-700",
													children: item.keterangan ?? "-"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-6 py-3.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-end gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															title: "Lihat",
															className: "grid h-7 w-7 place-items-center rounded-md bg-[#007A64] text-white transition-colors hover:bg-[#00654F]",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															title: "Hapus",
															className: "grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white transition-colors hover:bg-red-600",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
														})]
													})
												})
											]
										}, item.id ?? index);
									})
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-gray-50 px-6 py-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-gray-500",
								children: [
									"Menampilkan ",
									startEntry,
									" hingga ",
									endEntry,
									" dari",
									" ",
									nf.format(totalData),
									" entri"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
										disabled: currentPage === 1,
										className: "grid h-7 w-7 place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
									}),
									Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCurrentPage(page),
										className: `grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold transition-colors ${currentPage === page ? "bg-[#0D2B4C] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`,
										children: page
									}, page)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
										disabled: currentPage === totalPages,
										className: "grid h-7 w-7 place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
									})
								]
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ReportSurveiPage as component };

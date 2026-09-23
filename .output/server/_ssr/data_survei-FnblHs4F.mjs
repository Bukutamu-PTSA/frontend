import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Trash2, w as Pencil } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-DcmoFzPa.mjs";
import { t as useTableExport } from "./export-utils-304m4SjV.mjs";
import { t as pageWindow } from "./pagination-ChhiJOl5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data_survei-FnblHs4F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_DATA = [
	{
		id: 1,
		pertanyaan: "Bagaimana Sarana dan Prasarana layanan PTSA?",
		optionA: "Baik",
		optionB: "Cukup",
		optionC: "Kurang"
	},
	{
		id: 2,
		pertanyaan: "Bagaimana Pemberian Materi yang diberikan oleh Petugas?",
		optionA: "Baik",
		optionB: "Cukup",
		optionC: "Kurang"
	},
	{
		id: 3,
		pertanyaan: "Bagaimana Komunikasi Petugas dalam memberikan layanan?",
		optionA: "Baik",
		optionB: "Cukup",
		optionC: "Kurang"
	}
];
var ITEMS_PER_PAGE = 10;
function DataSurveiPage() {
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)(INITIAL_DATA);
	const [search, setSearch] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter((r) => r.pertanyaan.toLowerCase().includes(q) || r.optionA.toLowerCase().includes(q) || r.optionB.toLowerCase().includes(q) || r.optionC.toLowerCase().includes(q));
	}, [rows, search]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const buildExport = (0, import_react.useMemo)(() => {
		return {
			headers: [
				"NO",
				"SKALA PELAYANAN",
				"OPTION A",
				"OPTION B",
				"OPTION C"
			],
			rows: filtered.map((item, index) => [
				index + 1,
				item.pertanyaan,
				item.optionA,
				item.optionB,
				item.optionC
			])
		};
	}, [filtered]);
	const { copied, handleCopy, handleCsv, handleExcel, handlePrint } = useTableExport({
		baseName: "Data_Survei",
		headers: buildExport.headers,
		rows: buildExport.rows
	});
	const handleDelete = (id) => {
		if (!window.confirm("Hapus pertanyaan survei ini?")) return;
		setRows((prev) => prev.filter((r) => r.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Data Survei",
		breadcrumb: "Data Survei",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[17px] font-bold tracking-tight text-gray-900",
						children: "Survei Pelayanan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[12px] text-gray-500",
						children: "Soal Survei Pelayanan"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleCopy,
								className: "rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50",
								children: copied ? "Copied!" : "Copy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleCsv,
								className: "rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50",
								children: "CSV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleExcel,
								className: "rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50",
								children: "Excel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePrint,
								className: "rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50",
								children: "PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePrint,
								className: "rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-xs hover:bg-gray-50",
								children: "Print"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: search,
						onChange: (e) => {
							setSearch(e.target.value);
							setPage(1);
						},
						placeholder: "Cari soal pelayanan…",
						className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#016A61] sm:w-64"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-[#F0F5FA] text-[10px] font-bold uppercase tracking-wider text-gray-600",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-14 px-5 py-3.5",
										children: "No"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Skala Pelayanan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Option A"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Option B"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Option C"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-28 px-5 py-3.5 text-right",
										children: "Tools"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-gray-50 text-[12px]",
								children: displayed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 6,
									className: "px-5 py-10 text-center text-gray-400",
									children: "Tidak ada data survei."
								}) }) : displayed.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-gray-50/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 font-medium text-gray-600",
											children: (page - 1) * ITEMS_PER_PAGE + index + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-gray-800",
											children: item.pertanyaan
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-gray-700",
											children: item.optionA
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-gray-700",
											children: item.optionB
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-gray-700",
											children: item.optionC
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Edit",
													onClick: () => navigate({
														to: "/admin/edit_survei",
														search: { id: item.id }
													}),
													className: "grid h-7 w-7 place-items-center rounded-md bg-[#016A61] text-white transition-colors hover:bg-[#00544d]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Hapus",
													onClick: () => handleDelete(item.id),
													className: "grid h-7 w-7 place-items-center rounded-md bg-red-500 text-white transition-colors hover:bg-red-600",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})]
											})
										})
									]
								}, item.id))
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
							displayed.length ? (page - 1) * ITEMS_PER_PAGE + 1 : 0,
							" to",
							" ",
							(page - 1) * ITEMS_PER_PAGE + displayed.length,
							" dari ",
							filtered.length,
							" data"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
						page,
						totalPages,
						onChange: setPage
					})]
				})
			]
		})
	});
}
function Pagination({ page, totalPages, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(Math.max(1, page - 1)),
				disabled: page === 1,
				className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40",
				children: "‹"
			}),
			pageWindow(page, totalPages).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(p),
				className: `grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors ${page === p ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"}`,
				children: p
			}, p)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(Math.min(totalPages, page + 1)),
				disabled: page === totalPages,
				className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40",
				children: "›"
			})
		]
	});
}
//#endregion
export { DataSurveiPage as component };

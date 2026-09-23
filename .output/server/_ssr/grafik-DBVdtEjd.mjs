import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BipEh2FU.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { H as FileText, X as Download, c as TrendingUp, d as Star, lt as CalendarDays, t as X } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CVfVOAjz.mjs";
import { a as Cell, i as Bar, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grafik-DBVdtEjd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUMMARY_API_URL = apiUrl("grafik/complaint-summary");
var nf = new Intl.NumberFormat("id-ID");
var SCALE_COLORS = [
	"#2F4157",
	"#A2C1D1",
	"#C7D9E5",
	"#567C8E"
];
var SURVEYS_API_URL = apiUrl("surveys");
/** Label indeks kepuasan berdasarkan skor 1-5. */
function ikmLabelFromScore(score5) {
	if (score5 >= 4.5) return "Sangat Baik";
	if (score5 >= 3.5) return "Baik";
	if (score5 >= 2.5) return "Cukup";
	return "Kurang";
}
var CATEGORY_NAMES_MAP = [
	{
		key: "wlkp",
		label: "WLKP",
		aliases: ["wajib lapor", "wlkp"]
	},
	{
		key: "upah",
		label: "Upah Kerja",
		aliases: ["upah", "gaji"]
	},
	{
		key: "jamsos",
		label: "Jaminan Sosial",
		aliases: [
			"jaminan",
			"jamsos",
			"bpjs"
		]
	},
	{
		key: "hub_kerja",
		label: "Hubungan Kerja",
		aliases: [
			"hubungan",
			"phk",
			"kontrak"
		]
	},
	{
		key: "kecelakaan",
		label: "Kecelakaan Kerja",
		aliases: ["kecelakaan"]
	},
	{
		key: "waktu_kerja",
		label: "Waktu Kerja & Istirahat",
		aliases: [
			"waktu",
			"lembur",
			"istirahat"
		]
	},
	{
		key: "penempatan",
		label: "Tenaga Kerja Dalam & LN",
		aliases: [
			"penempatan",
			"luar negeri",
			"dalam negeri",
			"tk"
		]
	},
	{
		key: "k3",
		label: "K3",
		aliases: [
			"k3",
			"keselamatan",
			"kesehatan"
		]
	},
	{
		key: "perempuan_anak",
		label: "Perempuan & Anak",
		aliases: ["perempuan", "anak"]
	}
];
function GrafikStatistikPage() {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const dateInputRef = (0, import_react.useRef)(null);
	const [stats, setStats] = (0, import_react.useState)({ totalAduan: 0 });
	const [ikm, setIkm] = (0, import_react.useState)({
		score: 0,
		label: "-"
	});
	const [scaleData, setScaleData] = (0, import_react.useState)([
		{
			name: "Mikro",
			count: 0
		},
		{
			name: "Kecil",
			count: 0
		},
		{
			name: "Menengah",
			count: 0
		},
		{
			name: "Besar",
			count: 0
		}
	]);
	const [categoryData, setCategoryData] = (0, import_react.useState)([]);
	const formatDisplayDate = (dateStr) => {
		if (!dateStr) return "Semua Waktu";
		const parts = dateStr.split("-").map(Number);
		const year = parts[0] ?? (/* @__PURE__ */ new Date()).getFullYear();
		const month = (parts[1] ?? 1) - 1;
		const day = parts[2] ?? 1;
		return new Date(year, month, day).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	};
	const handleOpenCalendar = () => {
		if (dateInputRef.current) {
			if ("showPicker" in HTMLInputElement.prototype) dateInputRef.current.showPicker();
			else dateInputRef.current.focus();
		}
	};
	const handleClearDate = (e) => {
		e.stopPropagation();
		setSelectedDate(null);
		if (dateInputRef.current) dateInputRef.current.value = "";
	};
	(0, import_react.useEffect)(() => {
		const fetchData = async () => {
			const headers = authHeaders();
			const extractList = (json) => Array.isArray(json?.data) ? json.data : Array.isArray(json?.data?.data) ? json.data.data : Array.isArray(json) ? json : Array.isArray(json?.complaints) ? json.complaints : [];
			try {
				const first = await fetch(`${SUMMARY_API_URL}?per_page=50`, {
					method: "GET",
					headers
				});
				if (!first.ok) return;
				const firstJson = await first.json();
				let rawList = [...extractList(firstJson)];
				const lastPage = Number(firstJson?.last_page ?? firstJson?.data?.last_page ?? 1);
				if (Number.isFinite(lastPage) && lastPage > 1) {
					const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
					(await Promise.all(pages.map((p) => fetch(`${SUMMARY_API_URL}?page=${p}&per_page=50`, { headers }).then((r) => r.ok ? r.json() : null).catch(() => null)))).forEach((json) => {
						if (json) rawList = rawList.concat(extractList(json));
					});
				}
				const list = selectedDate ? rawList.filter((item) => {
					return String(item.complaint_date ?? item.created_at ?? "").startsWith(selectedDate);
				}) : rawList;
				const total = list.length;
				setStats({ totalAduan: total });
				let mikro = 0;
				let kecil = 0;
				let menengah = 0;
				let besar = 0;
				list.forEach((item) => {
					const naker = Number(item.jumlah_naker ?? item.company?.jumlah_naker ?? item.perusahaan?.jumlah_naker ?? 0);
					if (naker > 0 && naker < 10) mikro++;
					else if (naker >= 10 && naker < 50) kecil++;
					else if (naker >= 50 && naker < 200) menengah++;
					else if (naker >= 200) besar++;
					else mikro++;
				});
				setScaleData([
					{
						name: "Mikro",
						count: mikro
					},
					{
						name: "Kecil",
						count: kecil
					},
					{
						name: "Menengah",
						count: menengah
					},
					{
						name: "Besar",
						count: besar
					}
				]);
				const catCountRecord = {};
				CATEGORY_NAMES_MAP.forEach((c) => {
					catCountRecord[c.key] = 0;
				});
				list.forEach((item) => {
					Number(item.category?.id ?? item.category_id);
					const catName = String(item.category?.category_name ?? item.kategori ?? "").toLowerCase();
					const catCode = String(item.category?.category_code ?? "").toLowerCase();
					for (const c of CATEGORY_NAMES_MAP) if (c.aliases.some((a) => catName.includes(a) || catCode.includes(a))) {
						catCountRecord[c.key] = (catCountRecord[c.key] ?? 0) + 1;
						break;
					}
				});
				setCategoryData([{
					name: "Total",
					count: total
				}, ...CATEGORY_NAMES_MAP.map((c) => ({
					name: c.label,
					count: catCountRecord[c.key] ?? 0
				}))]);
			} catch (err) {
				console.error("Gagal mengambil data statistik:", err);
			}
		};
		fetchData();
	}, [selectedDate]);
	(0, import_react.useEffect)(() => {
		const fetchIkm = async () => {
			try {
				const res = await fetch(`${SURVEYS_API_URL}?per_page=50`, { headers: authHeaders() });
				if (!res.ok) return;
				const json = await res.json();
				const list = Array.isArray(json?.data) ? json.data : Array.isArray(json?.data?.data) ? json.data.data : Array.isArray(json) ? json : [];
				const filtered = selectedDate ? list.filter((item) => {
					return String(item.survey_date ?? item.created_at ?? "").startsWith(selectedDate);
				}) : list;
				const values = [];
				filtered.forEach((item) => {
					[
						item.komunikasi_petugas,
						item.substansi_materi,
						item.sarana_prasarana
					].forEach((v) => {
						const n = Number(v);
						if (!isNaN(n) && n > 0) values.push(n);
					});
				});
				if (values.length === 0) {
					setIkm({
						score: 0,
						label: "-"
					});
					return;
				}
				const avgRaw = values.reduce((a, b) => a + b, 0) / values.length;
				const score5 = Math.min(5, Number((avgRaw / 4 * 5).toFixed(2)));
				setIkm({
					score: score5,
					label: ikmLabelFromScore(score5)
				});
			} catch (err) {
				console.error("Gagal mengambil data IKM:", err);
			}
		};
		fetchIkm();
	}, [selectedDate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[15px] font-bold text-gray-800 tracking-tight",
					children: "Grafik & Statistik Overview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-gray-500 mt-0.5",
					children: "Ringkasan performa pelayanan terpadu dan analisis data PTSA KEMNAKER"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: dateInputRef,
							type: "date",
							value: selectedDate ?? "",
							onChange: (e) => setSelectedDate(e.target.value || null),
							className: "sr-only absolute",
							tabIndex: -1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleOpenCalendar,
							className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5 text-gray-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDisplayDate(selectedDate) }),
								selectedDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									onClick: handleClearDate,
									title: "Reset Semua Waktu",
									className: "ml-0.5 rounded-full p-0.5 hover:bg-gray-200 text-gray-400 hover:text-gray-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[8px] text-gray-400",
									children: "▼"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Laporan" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-slate-600" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), " +5%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-[11px] text-gray-500 font-medium",
							children: "Total Aduan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[22px] font-bold text-gray-900 leading-none",
							children: nf.format(stats.totalAduan)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[10px] text-gray-400",
							children: "Periode tahun berjalan"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 text-slate-600" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600",
								children: ikm.label
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-[11px] text-gray-500 font-medium",
							children: "Indeks Kepuasan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[22px] font-bold text-gray-900 leading-none",
							children: [
								ikm.score.toFixed(2),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px] font-medium text-gray-400",
									children: "/ 5.00"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[10px] text-gray-400",
							children: "Berdasarkan survei masyarakat"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[13px] font-bold text-gray-800",
						children: "Pengaduan Berdasarkan Skala Perusahaan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-[11px] text-gray-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-sm bg-[#2F4157]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Jumlah Pengaduan" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[280px] w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: scaleData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tickLine: false,
									axisLine: { stroke: "#F1F5F9" },
									tick: {
										fill: "#64748B",
										fontSize: 11
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#94A3B8",
										fontSize: 10
									},
									tickFormatter: (v) => nf.format(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "rgba(241, 245, 249, 0.6)" },
									contentStyle: {
										backgroundColor: "#FFFFFF",
										borderRadius: "12px",
										border: "1px solid #E2E8F0",
										fontSize: "11px"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									radius: [
										6,
										6,
										0,
										0
									],
									maxBarSize: 70,
									children: scaleData.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: SCALE_COLORS[index % SCALE_COLORS.length] }, `cell-${index}`))
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[13px] font-bold text-gray-800",
						children: "Berdasarkan Jenis Pengaduan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-[11px] text-gray-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-sm bg-[#AAB7B8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Jumlah Pengaduan" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[280px] w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: categoryData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 20
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									interval: 0,
									angle: -15,
									textAnchor: "end",
									tickLine: false,
									axisLine: { stroke: "#F1F5F9" },
									tick: {
										fill: "#64748B",
										fontSize: 9
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									tick: {
										fill: "#94A3B8",
										fontSize: 10
									},
									tickFormatter: (v) => nf.format(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "rgba(241, 245, 249, 0.6)" },
									contentStyle: {
										backgroundColor: "#FFFFFF",
										borderRadius: "12px",
										border: "1px solid #E2E8F0",
										fontSize: "11px"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									fill: "#AAB7B8",
									radius: [
										4,
										4,
										0,
										0
									],
									maxBarSize: 45
								})
							]
						})
					})
				})]
			})
		]
	}) });
}
//#endregion
export { GrafikStatistikPage as component };

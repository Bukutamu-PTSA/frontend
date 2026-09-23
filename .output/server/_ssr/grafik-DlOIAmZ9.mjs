import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { H as FileText, P as LoaderCircle, X as Download, c as TrendingUp, d as Star, dt as CalendarDays, l as TrendingDown, t as X } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-DcmoFzPa.mjs";
import { n as fetchSatisfactionSummary, r as formatGrowth, t as computeGrowth } from "./satisfaction-CkGRGmDB.mjs";
import { a as Cell, i as Bar, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grafik-DlOIAmZ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUMMARY_API_URL = apiUrl("dashboard/complaint-summary");
var CATEGORIES_API_URL = apiUrl("complaint-categories");
var EXPORT_PDF_API_URL = apiUrl("v1/reports/export/pdf");
var COMPLAINTS_API_URL = apiUrl("complaints");
var nf = new Intl.NumberFormat("id-ID");
var SCALE_COLORS = [
	"#2F4157",
	"#A2C1D1",
	"#C7D9E5",
	"#567C8E"
];
var CATEGORY_COLORS = [
	"#AAB7B8",
	"#8FA6B2",
	"#C2D2DC",
	"#7E97A3",
	"#9FB6BF",
	"#6C8794",
	"#B9CAD3",
	"#5A7683",
	"#D0DDE3",
	"#8AA3AF",
	"#70909C",
	"#C7D6DD"
];
/** Warna per kategori; kategori tambahan (di luar palet) tetap dapat warna sendiri. */
function categoryColor(index) {
	if (index < CATEGORY_COLORS.length) return CATEGORY_COLORS[index] ?? "";
	const extra = index - CATEGORY_COLORS.length;
	return `hsl(${186 + extra * 47 % 34}, ${10 + extra * 6 % 16}%, ${42 + extra * 13 % 34}%)`;
}
/** Label indeks kepuasan berdasarkan skor 1-5. */
function ikmLabelFromScore(score5) {
	if (score5 >= 4.5) return "Sangat Baik";
	if (score5 >= 3.5) return "Baik";
	if (score5 >= 2.5) return "Cukup";
	return "Kurang";
}
/** Pecah label panjang jadi 2 baris seimbang (label pendek tetap 1 baris). */
function wrapCategoryLabel(label, maxChars = 14) {
	const text = String(label ?? "").trim();
	if (text.length <= maxChars) return [text];
	const words = text.split(/\s+/).filter(Boolean);
	if (words.length < 2) return [text];
	let best = [text, ""];
	let bestDiff = Number.POSITIVE_INFINITY;
	for (let i = 1; i < words.length; i++) {
		const line1 = words.slice(0, i).join(" ");
		const line2 = words.slice(i).join(" ");
		const diff = Math.abs(line1.length - line2.length);
		if (diff < bestDiff) {
			bestDiff = diff;
			best = [line1, line2];
		}
	}
	return [best[0], best[1]];
}
/** Tick vertikal (rotate -90) dengan dukungan label 2 baris. */
function CategoryTick(props) {
	const { x, y, payload } = props;
	const lines = wrapCategoryLabel(String(payload?.value ?? ""));
	const lineHeight = 9;
	const anchorY = Number(y) + 6;
	const centerOffset = (lines.length - 1) * lineHeight / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: lines.map((line, i) => {
		const anchorX = Number(x) - centerOffset + i * lineHeight;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: anchorX,
			y: anchorY,
			textAnchor: "end",
			transform: `rotate(-90 ${anchorX} ${anchorY})`,
			fill: "#64748B",
			fontSize: 9,
			children: line
		}, `${line}-${i}`);
	}) });
}
function GrafikStatistikPage() {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const dateInputRef = (0, import_react.useRef)(null);
	const [downloading, setDownloading] = (0, import_react.useState)(false);
	const [stats, setStats] = (0, import_react.useState)({ totalAduan: 0 });
	const [growth, setGrowth] = (0, import_react.useState)(null);
	const [satisfaction, setSatisfaction] = (0, import_react.useState)(null);
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
	const handleExportPdf = async () => {
		if (downloading) return;
		try {
			setDownloading(true);
			const dateParam = selectedDate ? `?date=${encodeURIComponent(selectedDate)}` : "";
			const response = await fetch(`${EXPORT_PDF_API_URL}${dateParam}`, {
				method: "GET",
				headers: {
					Accept: "application/pdf, application/json",
					...authHeaders()
				}
			});
			if (!response.ok) {
				let message = `Gagal mengunduh laporan (HTTP ${response.status}).`;
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
				a.download = "Laporan_Grafik.pdf";
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
					a.download = "Laporan_Grafik.pdf";
					document.body.appendChild(a);
					a.click();
					a.remove();
					return;
				}
				throw new Error(json?.message || "Format data JSON tidak memuat URL file PDF.");
			}
			if (!contentType.includes("application/pdf")) throw new Error(`Respons tidak dikenali (${contentType || "tanpa content-type"}). Periksa endpoint backend.`);
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
			const a = document.createElement("a");
			a.href = downloadUrl;
			a.download = "Laporan_Grafik.pdf";
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(downloadUrl);
		} catch (err) {
			console.error("Export error:", err);
			alert(err.message || "Terjadi kesalahan saat mengunduh laporan PDF.");
		} finally {
			setDownloading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		const fetchSummary = async () => {
			const headers = authHeaders();
			const dateParam = selectedDate ? `?date=${selectedDate}` : "";
			const extractList = (json) => Array.isArray(json?.data) ? json.data : Array.isArray(json?.data?.data) ? json.data.data : Array.isArray(json) ? json : [];
			try {
				const [summaryJson, categoriesJson] = await Promise.all([fetch(`${SUMMARY_API_URL}${dateParam}`, { headers }).then((r) => r.ok ? r.json() : null).catch(() => null), fetch(CATEGORIES_API_URL, { headers }).then((r) => r.ok ? r.json() : null).catch(() => null)]);
				const summaryList = extractList(summaryJson);
				const total = summaryList.reduce((sum, item) => sum + Number(item.count ?? item.total ?? 0), 0);
				setStats({ totalAduan: total });
				const categoryMeta = extractList(categoriesJson).map((c) => ({
					id: Number(c.id),
					name: String(c.category_name ?? c.name ?? ""),
					code: String(c.category_code ?? "").toUpperCase()
				}));
				const countsById = {};
				const countsByCode = {};
				summaryList.forEach((item) => {
					const count = Number(item.count ?? item.total ?? 0);
					const id = Number(item.id ?? item.category_id);
					if (id) countsById[id] = count;
					const code = String(item.category_code ?? "").toUpperCase();
					if (code) countsByCode[code] = count;
				});
				setCategoryData(categoryMeta.filter((c) => c.name).map((c) => ({
					name: c.name,
					count: countsById[c.id] ?? countsByCode[c.code] ?? 0
				})));
			} catch (err) {
				console.error("Gagal mengambil data ringkasan statistik:", err);
			}
		};
		fetchSummary();
	}, [selectedDate]);
	(0, import_react.useEffect)(() => {
		const fetchScale = async () => {
			const headers = authHeaders();
			const extractList = (json) => Array.isArray(json?.data) ? json.data : Array.isArray(json?.data?.data) ? json.data.data : Array.isArray(json) ? json : Array.isArray(json?.complaints) ? json.complaints : [];
			try {
				const first = await fetch(`${COMPLAINTS_API_URL}?per_page=100`, {
					method: "GET",
					headers
				});
				if (!first.ok) return;
				const firstJson = await first.json();
				let rawList = [...extractList(firstJson)];
				const lastPage = Number(firstJson?.meta?.last_page ?? firstJson?.last_page ?? firstJson?.data?.last_page ?? 1);
				if (Number.isFinite(lastPage) && lastPage > 1) {
					const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
					(await Promise.all(pages.map((p) => fetch(`${COMPLAINTS_API_URL}?page=${p}&per_page=100`, { headers }).then((r) => r.ok ? r.json() : null).catch(() => null)))).forEach((json) => {
						if (json) rawList = rawList.concat(extractList(json));
					});
				}
				const list = selectedDate ? rawList.filter((item) => {
					return String(item.complaint_date ?? item.created_at ?? "").startsWith(selectedDate);
				}) : rawList;
				let mikro = 0;
				let kecil = 0;
				let menengah = 0;
				let besar = 0;
				list.forEach((item) => {
					const naker = Number(item.jumlah_naker ?? item.company?.jumlah_naker ?? item.company?.jumlah_tenaga_kerja ?? item.jumlah_tenaga_kerja ?? item.perusahaan?.jumlah_naker ?? 0);
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
				setGrowth(computeGrowth(rawList, selectedDate));
			} catch (err) {
				console.error("Gagal mengambil data skala perusahaan:", err);
			}
		};
		fetchScale();
	}, [selectedDate]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const load = async () => {
			const summary = await fetchSatisfactionSummary();
			if (!cancelled) setSatisfaction(summary);
		};
		load();
		return () => {
			cancelled = true;
		};
	}, []);
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
						onClick: handleExportPdf,
						disabled: downloading,
						className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60",
						children: [downloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-gray-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: downloading ? "Menyiapkan…" : "Export Laporan" })]
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
								className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${(growth ?? 0) >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`,
								children: [(growth ?? 0) >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }), formatGrowth(growth)]
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
					className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-blue-600/20" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600",
							children: satisfaction?.index != null ? ikmLabelFromScore(satisfaction.index) : "Belum Ada"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-500 font-medium",
								children: "Indeks Kepuasan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[26px] font-bold text-gray-900 tracking-tight mt-0.5",
								children: [
									satisfaction?.index != null ? satisfaction.index.toFixed(2) : "-",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[13px] font-normal text-gray-400",
										children: ["/ ", (satisfaction?.scale ?? 5).toFixed(2)]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-gray-400 mt-1",
								children: satisfaction?.index != null && satisfaction.responses > 0 ? `Berbasis ${nf.format(satisfaction.responses)} responden${satisfaction.source === "aggregate" ? " hari ini" : ""}` : "Belum ada data survei"
							})
						]
					})]
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
					className: "h-[380px] w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: categoryData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									interval: 0,
									height: 130,
									tickLine: false,
									axisLine: { stroke: "#F1F5F9" },
									tick: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryTick, { ...props })
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
										4,
										4,
										0,
										0
									],
									maxBarSize: 45,
									children: categoryData.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: categoryColor(index) }, `category-cell-${index}`))
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

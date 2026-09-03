import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as FileCheck, C as LoaderCircle, D as HeartPulse, F as Download, H as CalendarDays, I as Clock3, J as Award, O as Handshake, W as BriefcaseBusiness, X as ArrowRight, c as ShieldCheck, f as Scale, h as PersonStanding, k as FileText, n as WalletCards, q as Baby, t as X, w as Layers } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CZ5KQ9QL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kategori_pelayanan-DC8Wp0Zj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMPLAINTS_API_URL = "http://192.168.147.199:8000/api/complaints";
var CATEGORIES_CONFIG = [
	{
		id: 1,
		code: "WAJIB_LAPOR",
		title: "WAJIB LAPOR KETENAGAKERJAAN",
		aliases: ["wajib lapor", "wlkp"],
		icon: FileText,
		iconColor: "text-red-500",
		bgColor: "bg-red-50"
	},
	{
		id: 2,
		code: "UPAH_KERJA",
		title: "UPAH KERJA",
		aliases: ["upah", "gaji"],
		icon: WalletCards,
		iconColor: "text-slate-600",
		bgColor: "bg-slate-100"
	},
	{
		id: 3,
		code: "JAMINAN_SOSIAL",
		title: "JAMINAN SOSIAL",
		aliases: [
			"jaminan sosial",
			"jamsos",
			"bpjs"
		],
		icon: ShieldCheck,
		iconColor: "text-emerald-500",
		bgColor: "bg-emerald-50"
	},
	{
		id: 4,
		code: "HUBUNGAN_KERJA",
		title: "HUBUNGAN KERJA",
		aliases: [
			"hubungan kerja",
			"phk",
			"kontrak",
			"pkwt"
		],
		icon: Handshake,
		iconColor: "text-purple-500",
		bgColor: "bg-purple-50"
	},
	{
		id: 5,
		code: "KECELAKAAN_KERJA",
		title: "KECELAKAAN KERJA",
		aliases: ["kecelakaan", "kecelakaan kerja"],
		icon: PersonStanding,
		iconColor: "text-orange-500",
		bgColor: "bg-orange-50"
	},
	{
		id: 6,
		code: "WAKTU_KERJA",
		title: "WAKTU KERJA & WAKTU ISTIRAHAT",
		aliases: [
			"waktu kerja",
			"lembur",
			"istirahat",
			"cuti"
		],
		icon: Clock3,
		iconColor: "text-amber-500",
		bgColor: "bg-amber-50"
	},
	{
		id: 7,
		code: "KADER_NORMA",
		title: "KADER NORMA KETENAGAKERJAAN",
		aliases: ["kader norma", "knk"],
		icon: Scale,
		iconColor: "text-blue-500",
		bgColor: "bg-blue-50"
	},
	{
		id: 8,
		code: "PENEMPATAN_TK",
		title: "PENEMPATAN TK DALAM & LUAR NEGERI",
		aliases: [
			"penempatan",
			"luar negeri",
			"dalam negeri",
			"pmi"
		],
		icon: BriefcaseBusiness,
		iconColor: "text-cyan-600",
		bgColor: "bg-cyan-50"
	},
	{
		id: 9,
		code: "K3",
		title: "KESELAMATAN & KESEHATAN KERJA",
		aliases: [
			"k3",
			"keselamatan",
			"kesehatan kerja"
		],
		icon: HeartPulse,
		iconColor: "text-red-500",
		bgColor: "bg-red-50"
	},
	{
		id: 10,
		code: "PEREMPUAN_ANAK",
		title: "PEREMPUAN & ANAK",
		aliases: [
			"perempuan",
			"anak",
			"pekerja anak"
		],
		icon: Baby,
		iconColor: "text-purple-600",
		bgColor: "bg-purple-50"
	},
	{
		id: 11,
		code: "NORMA_K3",
		title: "Kader Norma K3",
		aliases: ["norma k3", "kader k3"],
		icon: Award,
		iconColor: "text-amber-700",
		bgColor: "bg-amber-50"
	},
	{
		id: 12,
		code: "SKP",
		title: "SKP",
		aliases: ["skp", "surat keputusan penunjukan"],
		icon: FileCheck,
		iconColor: "text-slate-600",
		bgColor: "bg-slate-100"
	}
];
var nf = new Intl.NumberFormat("id-ID");
function KategoriLaporanPage() {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const dateInputRef = (0, import_react.useRef)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [categoryCounts, setCategoryCounts] = (0, import_react.useState)({});
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
	const handleExportLaporan = () => {
		const csvContent = "data:text/csv;charset=utf-8,ID Kategori,Nama Kategori,Total Pengaduan\n" + CATEGORIES_CONFIG.map((cat) => `"${cat.id}","${cat.title}",${categoryCounts[cat.id] ?? 0}`).join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `Rekapitulasi_Kategori_${selectedDate ?? "Semua_Waktu"}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	(0, import_react.useEffect)(() => {
		const fetchComplaints = async () => {
			setLoading(true);
			const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
			try {
				const response = await fetch(COMPLAINTS_API_URL, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						...token ? { Authorization: `Bearer ${token}` } : {}
					}
				});
				if (!response.ok) throw new Error(`Status: ${response.status}`);
				const resData = await response.json();
				let rawList = [];
				if (Array.isArray(resData)) rawList = resData;
				else if (Array.isArray(resData?.data?.data)) rawList = resData.data.data;
				else if (Array.isArray(resData?.data)) rawList = resData.data;
				else if (Array.isArray(resData?.complaints)) rawList = resData.complaints;
				const list = selectedDate ? rawList.filter((item) => {
					return String(item.complaint_date ?? item.created_at ?? "").startsWith(selectedDate);
				}) : rawList;
				const counts = {};
				CATEGORIES_CONFIG.forEach((cat) => {
					counts[cat.id] = 0;
				});
				list.forEach((item) => {
					const categoryId = Number(item.category?.id ?? item.category_id);
					const categoryCode = String(item.category?.category_code ?? "").toUpperCase();
					const categoryName = String(item.category?.category_name ?? item.kategori ?? "").toLowerCase();
					if (categoryId && counts[categoryId] !== void 0) {
						counts[categoryId] += 1;
						return;
					}
					for (const cat of CATEGORIES_CONFIG) if (categoryCode.includes(cat.code) || cat.aliases.some((alias) => categoryName.includes(alias))) {
						counts[cat.id] = (counts[cat.id] ?? 0) + 1;
						break;
					}
				});
				setCategoryCounts(counts);
			} catch (err) {
				console.error("Gagal menarik data pengaduan kategori:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchComplaints();
	}, [selectedDate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Rekapitulasi Layanan Kategori",
		breadcrumb: "Rekapitulasi Kategori",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5 text-gray-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[15px] font-bold text-gray-800 tracking-tight",
						children: "Rekapitulasi Layanan Kategori"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5 text-gray-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDisplayDate(selectedDate) }),
								selectedDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									onClick: handleClearDate,
									title: "Kembali ke Semua Waktu",
									className: "ml-0.5 rounded-full p-0.5 hover:bg-gray-200 text-gray-400 hover:text-gray-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-gray-400",
									children: "▼"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleExportLaporan,
						className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Laporan" })]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
				children: CATEGORIES_CONFIG.map((item) => {
					const Icon = item.icon;
					const count = categoryCounts[item.id] ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl ${item.bgColor}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-6 w-6 ${item.iconColor}` })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[12px] font-bold text-gray-800 leading-snug tracking-wide uppercase",
								children: item.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13px] text-gray-700 mb-5 flex items-center gap-1.5",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-muted-foreground text-[12px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Memuat..."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-gray-900 text-[14px]",
									children: nf.format(count)
								}),
								" ",
								"Pengaduan"
							] })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/pengaduan",
							search: { category_id: item.id },
							className: "w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Detail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-gray-600" })]
						})]
					}, item.id);
				})
			})]
		})
	});
}
//#endregion
export { KategoriLaporanPage as component };

import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BipEh2FU.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Layers, H as FileText, X as Download, c as TrendingUp, d as Star, g as Search, it as ChevronLeft, l as TrendingDown, lt as CalendarDays, rt as ChevronRight, t as X, yt as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CVfVOAjz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-_StPMeQB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Perhitungan persentase pertumbuhan aduan secara riil dari daftar aduan.
*
* - Saat filter tanggal dipilih: hari tersebut vs hari terdekat sebelumnya.
* - Tanpa filter: bulan dengan data terakhir vs bulan sebelumnya.
*/
var nf$1 = new Intl.NumberFormat("id-ID");
function computeGrowth(rawList, selectedDate = null) {
	const dayTotals = /* @__PURE__ */ new Map();
	rawList.forEach((item) => {
		const d = String(item.complaint_date ?? item.created_at ?? "").slice(0, 10);
		if (d) dayTotals.set(d, (dayTotals.get(d) ?? 0) + 1);
	});
	const sortedDays = [...dayTotals.keys()].sort();
	if (sortedDays.length === 0) return null;
	const pct = (current, prev) => prev > 0 ? (current - prev) / prev * 100 : null;
	if (selectedDate) {
		const current = dayTotals.get(selectedDate) ?? 0;
		const idx = sortedDays.indexOf(selectedDate);
		if (idx <= 0) return null;
		return pct(current, dayTotals.get(sortedDays[idx - 1]) ?? 0);
	}
	const monthTotals = /* @__PURE__ */ new Map();
	rawList.forEach((item) => {
		const m = String(item.complaint_date ?? item.created_at ?? "").slice(0, 7);
		if (m) monthTotals.set(m, (monthTotals.get(m) ?? 0) + 1);
	});
	const months = [...monthTotals.keys()].sort();
	if (months.length < 2) return null;
	return pct(monthTotals.get(months.at(-1)) ?? 0, monthTotals.get(months.at(-2)) ?? 0);
}
function formatGrowth(value) {
	if (value === null || !Number.isFinite(value)) return "—";
	const rounded = Math.round(value * 10) / 10;
	return `${rounded > 0 ? "+" : ""}${nf$1.format(rounded)}%`;
}
var EMPTY_SUMMARY = {
	index: null,
	scale: 5,
	responses: 0,
	source: "responses"
};
var LIKERT_SCORE = {
	baik: 3,
	cukup: 2,
	kurang: 1
};
function likertScore(value) {
	if (value == null) return null;
	const text = String(value).trim().toLowerCase();
	if (!text) return null;
	return LIKERT_SCORE[text] ?? null;
}
function answerMap(item) {
	const answers = {};
	const raw = item?.answers;
	if (raw && typeof raw === "object" && !Array.isArray(raw)) Object.keys(raw).forEach((key) => {
		const qn = Number(key);
		if (Number.isInteger(qn) && qn >= 1) answers[qn] = raw[key];
	});
	if (Array.isArray(item?.responses)) item.responses.forEach((r) => {
		const qn = Number(r?.question_number ?? r?.survey_question_id);
		if (Number.isInteger(qn) && qn >= 1 && r?.answer != null) answers[qn] = r.answer;
	});
	return answers;
}
/** Skor likert 3 dimensi (Q2-Q4), atau dari field flat bila tak ada `answers`. */
function likertScores(item) {
	if (!item || typeof item !== "object") return [];
	const answers = answerMap(item);
	const fromAnswers = [
		2,
		3,
		4
	].map((qn) => likertScore(answers[qn])).filter((s) => s != null);
	if (fromAnswers.length > 0) return fromAnswers;
	return [
		"komunikasi_petugas",
		"penjelasan_materi",
		"sarana_prasarana"
	].map((key) => likertScore(item[key])).filter((s) => s != null);
}
/**
* Hitung indeks kepuasan dari daftar submission survei mentah.
* Skor likert 1-3 (Kurang/Cukup/Baik) dikonversi ke skala 1-5 dengan (2*skor - 1)
* sehingga Baik=5, Cukup=3, Kurang=1.
*/
function computeSatisfaction(items) {
	const averages = [];
	items.forEach((item) => {
		const scores = likertScores(item);
		if (scores.length === 0) return;
		averages.push(scores.reduce((sum, score) => sum + score, 0) / scores.length);
	});
	if (averages.length === 0) return { ...EMPTY_SUMMARY };
	const mean3 = averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
	return {
		index: Math.round((2 * mean3 - 1) * 100) / 100,
		scale: 5,
		responses: averages.length,
		source: "responses"
	};
}
function parseAggregate(d) {
	if (!d || typeof d !== "object") return null;
	const indexRaw = d.satisfaction_index ?? d.index ?? d.score ?? d.skor ?? d.nilai ?? d.average ?? d.avg;
	if (indexRaw == null) return null;
	const index = Number(indexRaw);
	if (!Number.isFinite(index)) return null;
	return {
		index,
		scale: Number(d.satisfaction_scale ?? d.scale ?? 5),
		responses: Number(d.satisfaction_responses ?? d.responses ?? d.responden ?? d.jumlah ?? 0),
		source: "aggregate"
	};
}
/**
* Ambil ringkasan indeks kepuasan survei untuk card dashboard/grafik.
*
* 1. Coba endpoint agregat /surveys/satisfaction?period=today (data hari ini).
* 2. Bila tidak tersedia/tidak sesuai, hitung ulang dari /surveys/responses
*    (sumber data riil yang sama dipakai halaman Report Survei).
*/
async function fetchSatisfactionSummary() {
	const headers = authHeaders();
	try {
		const aggrRes = await fetch(`${apiUrl("surveys/satisfaction")}?period=today`, { headers });
		if (aggrRes.ok) {
			const json = await aggrRes.json().catch(() => null);
			const parsed = parseAggregate(json?.data ?? json?.result ?? json?.satisfaction ?? json);
			if (parsed) return parsed;
		}
	} catch {}
	try {
		const res = await fetch(`${apiUrl("surveys/responses")}?per_page=100`, { headers });
		if (!res.ok) return { ...EMPTY_SUMMARY };
		const json = await res.json().catch(() => null);
		const data = json?.data;
		return computeSatisfaction(Array.isArray(data?.submissions) ? data.submissions : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(json) ? json : []);
	} catch {
		return { ...EMPTY_SUMMARY };
	}
}
var SUMMARY_API_URL = apiUrl("dashboard/complaint-summary");
var PROVINCE_SUMMARY_API_URL = apiUrl("dashboard/province-summary");
var COMPLAINTS_API_URL = apiUrl("complaints");
var nf = new Intl.NumberFormat("id-ID");
var ALL_CATEGORIES = [
	{
		id: 1,
		code: "WAJIB_LAPOR",
		title: "WAJIB LAPOR KETENAGAKERJAAN"
	},
	{
		id: 2,
		code: "UPAH_KERJA",
		title: "Upah Kerja"
	},
	{
		id: 3,
		code: "JAMINAN_SOSIAL",
		title: "Jaminan Sosial"
	},
	{
		id: 4,
		code: "HUBUNGAN_KERJA",
		title: "Hubungan Kerja"
	},
	{
		id: 5,
		code: "KECELAKAAN_KERJA",
		title: "Kecelakaan Kerja"
	},
	{
		id: 6,
		code: "WAKTU_KERJA",
		title: "Waktu Kerja & Istirahat"
	},
	{
		id: 7,
		code: "KADER_NORMA",
		title: "Kader Norma Kerja"
	},
	{
		id: 8,
		code: "PENEMPATAN_TK",
		title: "Penempatan Tenaga Kerja"
	},
	{
		id: 9,
		code: "K3",
		title: "Keselamatan & Kesehatan (K3)"
	},
	{
		id: 10,
		code: "PEREMPUAN_ANAK",
		title: "Perlindungan Perempuan & Anak"
	},
	{
		id: 11,
		code: "NORMA_K3",
		title: "Kader Norma K3"
	},
	{
		id: 12,
		code: "SKP",
		title: "SKP"
	}
];
function toTitleCase(str) {
	if (!str) return "-";
	return str.toLowerCase().split(" ").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function normalizeProvinsi(raw) {
	const name = toTitleCase(raw || "-");
	const upper = name.toUpperCase();
	if (upper.includes("DKI") || upper.includes("IBUKOTA") || upper.includes("JAKARTA")) return "Daerah Khusus Ibukota Jakarta";
	return name;
}
/** Label indeks kepuasan berdasarkan skor skala 1-5. */
function ikmLabel(score) {
	if (score >= 4.5) return "Sangat Baik";
	if (score >= 3.5) return "Baik";
	if (score >= 2.5) return "Cukup";
	return "Kurang";
}
function DashboardExecutive() {
	const navigate = useNavigate();
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const dateInputRef = (0, import_react.useRef)(null);
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 4;
	const [wilayahSearch, setWilayahSearch] = (0, import_react.useState)("");
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
	const [wilayahData, setWilayahData] = (0, import_react.useState)([]);
	const [totalAduan, setTotalAduan] = (0, import_react.useState)(12450);
	const [growth, setGrowth] = (0, import_react.useState)(null);
	const [satisfaction, setSatisfaction] = (0, import_react.useState)(null);
	const [categoryCounts, setCategoryCounts] = (0, import_react.useState)({
		1: 11267,
		2: 245,
		3: 19,
		4: 12,
		5: 8,
		6: 5
	});
	const scrollContainerRef = (0, import_react.useRef)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [startX, setStartX] = (0, import_react.useState)(0);
	const [scrollLeft, setScrollLeft] = (0, import_react.useState)(0);
	const [hasMoved, setHasMoved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const headers = authHeaders();
		const prefix = selectedDate;
		const extractList = (json) => Array.isArray(json?.data) ? json.data : Array.isArray(json?.data?.data) ? json.data.data : Array.isArray(json) ? json : Array.isArray(json?.complaints) ? json.complaints : [];
		const fetchAll = async () => {
			try {
				const first = await fetch(`${COMPLAINTS_API_URL}?per_page=100`, { headers });
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
				if (!prefix) {
					setGrowth(computeGrowth(rawList, null));
					return;
				}
				const filtered = rawList.filter((it) => String(it.complaint_date ?? it.created_at ?? "").startsWith(prefix));
				setTotalAduan(filtered.length);
				setGrowth(computeGrowth(rawList, prefix));
				const newCounts = {};
				filtered.forEach((it) => {
					const code = String(it.category?.category_code ?? it.category?.code ?? "").toUpperCase();
					const match = ALL_CATEGORIES.find((c) => c.code === code);
					if (match) newCounts[match.id] = (newCounts[match.id] ?? 0) + 1;
				});
				setCategoryCounts(newCounts);
			} catch (err) {
				console.error("Gagal menyinkronkan data dashboard:", err);
			}
		};
		const fetchSummary = async () => {
			try {
				const url = prefix ? `${SUMMARY_API_URL}?date=${encodeURIComponent(prefix)}` : SUMMARY_API_URL;
				const res = await fetch(url, { headers });
				if (res.ok) {
					const json = await res.json();
					const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
					let total = 0;
					const newCounts = {};
					items.forEach((item) => {
						const count = Number(item.count || item.total || 0);
						const id = Number(item.id || item.category_id);
						total += count;
						if (id) newCounts[id] = count;
					});
					if (total > 0) setTotalAduan(total);
					if (Object.keys(newCounts).length > 0) setCategoryCounts((prev) => ({
						...prev,
						...newCounts
					}));
				}
			} catch (err) {
				console.error("Gagal sinkron data dashboard:", err);
			}
		};
		fetchAll();
		if (!prefix) fetchSummary();
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
	(0, import_react.useEffect)(() => {
		const fetchProvinces = async () => {
			const perPage = 100;
			const prefix = selectedDate;
			const buildUrl = (page) => `${PROVINCE_SUMMARY_API_URL}?page=${page}&per_page=${perPage}${prefix ? `&date=${encodeURIComponent(prefix)}` : ""}`;
			const fetchPage = async (page) => {
				const res = await fetch(buildUrl(page), { headers: authHeaders() });
				if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
				return res.json();
			};
			try {
				const first = await fetchPage(1);
				const collected = Array.isArray(first?.data) ? [...first.data] : [];
				const lastPage = Number(first?.meta?.last_page ?? first?.last_page ?? 1);
				if (Number.isFinite(lastPage) && lastPage > 1) {
					const pages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
					(await Promise.all(pages.map((p) => fetchPage(p)))).forEach((json) => {
						if (Array.isArray(json?.data)) collected.push(...json.data);
					});
				}
				const rows = collected.map((item) => ({
					provinsi: normalizeProvinsi(item.provinsi || "-"),
					total: Number(item.count ?? item.total ?? 0)
				})).sort((a, b) => b.total - a.total).map((row, idx) => ({
					no: idx + 1,
					...row
				}));
				setWilayahData(rows);
				setCurrentPage(1);
			} catch (err) {
				console.error("Gagal memuat data provinsi:", err);
				setWilayahData([]);
			}
		};
		fetchProvinces();
	}, [selectedDate]);
	const sortedCategories = (0, import_react.useMemo)(() => {
		return [...ALL_CATEGORIES].sort((a, b) => {
			const countA = categoryCounts[a.id] ?? 0;
			return (categoryCounts[b.id] ?? 0) - countA;
		});
	}, [categoryCounts]);
	const topCategories = (0, import_react.useMemo)(() => sortedCategories.slice(0, 5), [sortedCategories]);
	const filteredWilayah = (0, import_react.useMemo)(() => {
		const q = wilayahSearch.trim().toLowerCase();
		if (!q) return wilayahData;
		return wilayahData.filter((w) => w.provinsi.toLowerCase().includes(q));
	}, [wilayahData, wilayahSearch]);
	const handleMouseDown = (e) => {
		if (!scrollContainerRef.current) return;
		setIsDragging(true);
		setHasMoved(false);
		setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
		setScrollLeft(scrollContainerRef.current.scrollLeft);
	};
	const handleMouseLeave = () => setIsDragging(false);
	const handleMouseUp = () => setIsDragging(false);
	const handleMouseMove = (e) => {
		if (!isDragging || !scrollContainerRef.current) return;
		e.preventDefault();
		const walk = (e.pageX - scrollContainerRef.current.offsetLeft - startX) * 1.5;
		if (Math.abs(walk) > 5) setHasMoved(true);
		scrollContainerRef.current.scrollLeft = scrollLeft - walk;
	};
	const scrollHorizontally = (direction) => {
		if (!scrollContainerRef.current) return;
		scrollContainerRef.current.scrollBy({
			left: direction === "left" ? -340 : 340,
			behavior: "smooth"
		});
	};
	const handleGoToDetail = (categoryId) => {
		if (hasMoved) return;
		navigate({
			to: "/admin/detail_kategori_pelayanan",
			search: { id: categoryId }
		});
	};
	const totalItems = filteredWilayah.length;
	const totalPages = Math.max(1, Math.ceil(filteredWilayah.length / itemsPerPage));
	const displayedWilayah = filteredWilayah.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const handleExportLaporan = () => {
		const csvContent = "data:text/csv;charset=utf-8,NO,PROVINSI,TOTAL\n" + filteredWilayah.map((w) => `${w.no},${w.provinsi},${w.total}`).join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `Laporan_Wilayah_${formatDisplayDate(selectedDate).replace(/\s+/g, "_")}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[16px] font-bold text-gray-900 tracking-tight",
					children: "Executive Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-gray-500 mt-0.5",
					children: "Ringkasan performa pelayanan terpadu PTSA KEMNAKER"
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
						className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Laporan" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${(growth ?? 0) >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`,
							children: [(growth ?? 0) >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }), formatGrowth(growth)]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-500 font-medium",
								children: "Total Aduan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[26px] font-bold text-gray-900 tracking-tight mt-0.5",
								children: nf.format(totalAduan)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-gray-400 mt-1",
								children: "Periode tahun berjalan"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-blue-600/20" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600",
							children: satisfaction?.index != null ? ikmLabel(satisfaction.index) : "Belum Ada"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-gray-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[13px] font-bold text-gray-800",
						children: "Rekapitulasi Layanan Kategori"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => scrollHorizontally("left"),
							className: "grid h-7 w-7 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs cursor-pointer",
							title: "Scroll ke kiri",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => scrollHorizontally("right"),
							className: "grid h-7 w-7 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-2xs cursor-pointer",
							title: "Scroll ke kanan",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/kategori_pelayanan",
						className: "inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors ml-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Semua Kategori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scrollContainerRef,
				onMouseDown: handleMouseDown,
				onMouseLeave: handleMouseLeave,
				onMouseUp: handleMouseUp,
				onMouseMove: handleMouseMove,
				className: `
              flex gap-5 overflow-x-auto pb-4 pt-1 px-0.5 select-none
              cursor-grab active:cursor-grabbing scroll-smooth
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            `,
				children: topCategories.map((item) => {
					const count = categoryCounts[item.id] ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[280px] md:min-w-[320px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[11px] font-bold text-gray-800 leading-snug uppercase tracking-tight mb-4",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] text-gray-600 mb-5 font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-gray-900 text-[13px]",
									children: nf.format(count)
								}),
								" ",
								"Pengaduan"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onMouseDown: (e) => e.stopPropagation(),
							onClick: () => handleGoToDetail(item.id),
							className: "w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Detail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-gray-600" })]
						})]
					}, item.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-red-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[13px] font-bold text-gray-800",
							children: "Report Pelayanan Pengaduan Berdasarkan Wilayah"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: wilayahSearch,
								onChange: (e) => {
									setWilayahSearch(e.target.value);
									setCurrentPage(1);
								},
								placeholder: "Cari provinsi…",
								className: "w-44 rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007A64]"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/wilayah",
							className: "inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Semua" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-[#F0F5FA] text-[10px] font-bold text-gray-600 uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-8 py-3.5 w-24",
									children: "NO"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-8 py-3.5 text-center",
									children: "PROVINSI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-8 py-3.5 text-right w-44",
									children: "TOTAL"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-50 text-[12px]",
							children: displayedWilayah.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 3,
								className: "px-8 py-10 text-center text-gray-400",
								children: "Belum ada data provinsi."
							}) }) : displayedWilayah.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50/60 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-8 py-4 text-gray-600 font-medium",
										children: row.no
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-8 py-4 text-center text-gray-800 font-medium",
										children: row.provinsi
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-8 py-4 text-right text-gray-700 font-semibold",
										children: nf.format(row.total)
									})
								]
							}, row.no))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-4 px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-gray-500",
						children: [
							"Menampilkan ",
							displayedWilayah.length,
							" dari ",
							totalItems,
							" provinsi"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
							disabled: currentPage === 1,
							className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
							disabled: currentPage === totalPages,
							className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
						})]
					})]
				})
			] })
		]
	}) });
}
//#endregion
export { DashboardExecutive as component };

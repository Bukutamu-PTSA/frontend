import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as Download, H as CalendarDays, O as Handshake, X as ArrowRight, c as ShieldCheck, k as FileText, n as WalletCards, s as Star, t as X, w as Layers } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CZ5KQ9QL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-p42OVmMg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMPLAINTS_API_URL = "http://192.168.147.199:8000/api/complaints";
var nf = new Intl.NumberFormat("id-ID");
var WILAYAH_DATA = [
	{
		no: 1,
		provinsi: "Jawa Barat",
		total: 1243
	},
	{
		no: 2,
		provinsi: "Jawa Timur",
		total: 324
	},
	{
		no: 3,
		provinsi: "Jawa Tengah",
		total: 532
	},
	{
		no: 4,
		provinsi: "Kalimantan Tengah",
		total: 342
	},
	{
		no: 5,
		provinsi: "DKI Jakarta",
		total: 890
	},
	{
		no: 6,
		provinsi: "Sumatera Utara",
		total: 215
	},
	{
		no: 7,
		provinsi: "Banten",
		total: 430
	},
	{
		no: 8,
		provinsi: "Bali",
		total: 180
	}
];
function DashboardExecutive() {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const dateInputRef = (0, import_react.useRef)(null);
	const scrollContainerRef = (0, import_react.useRef)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [startX, setStartX] = (0, import_react.useState)(0);
	const [scrollLeft, setScrollLeft] = (0, import_react.useState)(0);
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 4;
	const totalItems = 128;
	const totalPages = Math.ceil(WILAYAH_DATA.length / itemsPerPage);
	const [stats, setStats] = (0, import_react.useState)({
		activeCount: 0,
		resolvedCount: 0,
		resolutionRate: 0,
		ikmScore: 4.85,
		ikmLabel: "Sangat Baik"
	});
	const [categoryCounts, setCategoryCounts] = (0, import_react.useState)({
		wlkp: 0,
		upah: 0,
		jamsos: 0,
		hubKerja: 0
	});
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
	const handleMouseDown = (e) => {
		if (!scrollContainerRef.current) return;
		setIsDragging(true);
		setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
		setScrollLeft(scrollContainerRef.current.scrollLeft);
	};
	const handleMouseLeave = () => {
		setIsDragging(false);
	};
	const handleMouseUp = () => {
		setIsDragging(false);
	};
	const handleMouseMove = (e) => {
		if (!isDragging || !scrollContainerRef.current) return;
		e.preventDefault();
		const walk = (e.pageX - scrollContainerRef.current.offsetLeft - startX) * 1.5;
		scrollContainerRef.current.scrollLeft = scrollLeft - walk;
	};
	const handleExportLaporan = () => {
		const csvContent = "data:text/csv;charset=utf-8,No,Provinsi,Total\n" + WILAYAH_DATA.map((w) => `${w.no},${w.provinsi},${w.total}`).join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `Laporan_PTSA_${selectedDate ?? "Semua_Waktu"}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	(0, import_react.useEffect)(() => {
		const fetchComplaintsData = async () => {
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
				if (response.ok) {
					const resData = await response.json();
					let rawList = [];
					if (Array.isArray(resData)) rawList = resData;
					else if (Array.isArray(resData?.data?.data)) rawList = resData.data.data;
					else if (Array.isArray(resData?.data)) rawList = resData.data;
					else if (Array.isArray(resData?.complaints)) rawList = resData.complaints;
					const list = selectedDate ? rawList.filter((item) => {
						return String(item.complaint_date ?? item.created_at ?? "").startsWith(selectedDate);
					}) : rawList;
					const active = list.filter((item) => {
						const s = String(item.status ?? "").toUpperCase();
						return s === "DIPROSES" || s === "PENDING" || s === "OPEN" || s.includes("PROSES");
					}).length;
					const resolved = list.filter((item) => {
						const s = String(item.status ?? "").toUpperCase();
						return s === "SELESAI" || s === "RESOLVED" || s === "CLOSED";
					}).length;
					const total = active + resolved;
					const rate = total > 0 ? Number((resolved / total * 100).toFixed(1)) : 100;
					setStats({
						activeCount: active,
						resolvedCount: resolved,
						resolutionRate: rate,
						ikmScore: 4.85,
						ikmLabel: "Sangat Baik"
					});
					let countWlkp = 0;
					let countUpah = 0;
					let countJamsos = 0;
					let countHubKerja = 0;
					list.forEach((item) => {
						const catId = Number(item.category?.id ?? item.category_id);
						const catCode = String(item.category?.category_code ?? "").toUpperCase();
						const catName = String(item.category?.category_name ?? item.kategori ?? "").toUpperCase();
						if (catId === 1 || catCode.includes("WAJIB") || catName.includes("WAJIB")) countWlkp++;
						else if (catId === 2 || catCode.includes("UPAH") || catName.includes("UPAH") || catName.includes("GAJI")) countUpah++;
						else if (catId === 3 || catCode.includes("JAMSOS") || catCode.includes("SOSIAL") || catName.includes("SOSIAL") || catName.includes("BPJS")) countJamsos++;
						else if (catId === 4 || catCode.includes("HUBUNGAN") || catName.includes("HUBUNGAN") || catName.includes("PHK")) countHubKerja++;
					});
					setCategoryCounts({
						wlkp: countWlkp,
						upah: countUpah,
						jamsos: countJamsos,
						hubKerja: countHubKerja
					});
				}
			} catch (e) {
				console.error("Gagal menarik data pengaduan:", e);
			}
		};
		fetchComplaintsData();
	}, [selectedDate]);
	const displayedWilayah = WILAYAH_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[15px] font-bold text-gray-800 tracking-tight",
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
							className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5 text-gray-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDisplayDate(selectedDate) }),
								selectedDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									onClick: handleClearDate,
									title: "Reset ke Semua Waktu",
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
						onClick: handleExportLaporan,
						className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Laporan" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-amber-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-amber-500" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600",
									children: "Sedang Diproses"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-[11px] text-gray-500 font-medium",
								children: "Aduan Aktif"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[20px] font-bold text-gray-900 leading-none",
								children: [
									stats.activeCount,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-medium text-gray-600",
										children: "Berkas"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-teal-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-teal-600" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-600",
									children: [stats.resolutionRate, "% Rate"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-[11px] text-gray-500 font-medium",
								children: "Aduan Selesai Ditangani"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[20px] font-bold text-gray-900 leading-none",
								children: [
									nf.format(stats.resolvedCount),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-medium text-gray-600",
										children: "Kasus"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-indigo-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 text-indigo-600" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700",
									children: stats.ikmLabel
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-[11px] text-gray-500 font-medium",
								children: "Indeks Kepuasan Masyarakat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[20px] font-bold text-gray-900 leading-none",
								children: [
									stats.ikmScore.toFixed(2),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-medium text-gray-500",
										children: "/ 5.00"
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-gray-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[13px] font-bold text-gray-800",
						children: "Rekapitulasi Layanan Kategori"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/kategori_pelayanan",
					className: "inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Semua Kategori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scrollContainerRef,
				onMouseDown: handleMouseDown,
				onMouseLeave: handleMouseLeave,
				onMouseUp: handleMouseUp,
				onMouseMove: handleMouseMove,
				className: `
              flex gap-5 overflow-x-auto pb-2 select-none
              cursor-grab active:cursor-grabbing
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            `,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-xl bg-red-50 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-red-500" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[11px] font-bold text-gray-800 uppercase leading-snug",
								children: "WAJIB LAPOR KETENAGAKERJAAN"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] text-gray-600 mb-4",
							children: [nf.format(categoryCounts.wlkp), " Pengaduan"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/pengaduan",
							search: { category_id: 1 },
							className: "w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Detail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-gray-600" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-xl bg-slate-100 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletCards, { className: "h-5 w-5 text-slate-700" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[11px] font-bold text-gray-800 uppercase leading-snug",
								children: "Upah Kerja"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] text-gray-600 mb-4",
							children: [nf.format(categoryCounts.upah), " Pengaduan"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/pengaduan",
							search: { category_id: 2 },
							className: "w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Detail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-gray-600" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-emerald-600" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[11px] font-bold text-gray-800 uppercase leading-snug",
								children: "Jaminan Sosial"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] text-gray-600 mb-4",
							children: [nf.format(categoryCounts.jamsos), " Pengaduan"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/pengaduan",
							search: { category_id: 3 },
							className: "w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Detail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-gray-600" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[300px] md:min-w-[340px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-xl bg-purple-50 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "h-5 w-5 text-purple-600" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[11px] font-bold text-gray-800 uppercase leading-snug",
								children: "Hubungan Kerja"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] text-gray-600 mb-4",
							children: [nf.format(categoryCounts.hubKerja), " Pengaduan"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/pengaduan",
							search: { category_id: 4 },
							className: "w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Detail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-gray-600" })]
						})]
					})
				]
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/wilayah",
						className: "inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#007A64] transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Semua" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
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
							children: displayedWilayah.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
							}, row.provinsi))
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
							" data",
							" ",
							selectedDate ? `per ${formatDisplayDate(selectedDate)}` : "keseluruhan"
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
							Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCurrentPage(page),
								className: `
                    grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors cursor-pointer
                    ${currentPage === page ? "bg-[#007A64] text-white" : "text-gray-600 hover:bg-gray-100"}
                  `,
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
			] })
		]
	}) });
}
//#endregion
export { DashboardExecutive as component };

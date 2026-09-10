import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Ct as Award, H as Handshake, I as Layers, St as Baby, Tt as ArrowRight, V as HeartPulse, X as FileCheck, at as Clock3, h as ShieldCheck, lt as ChevronRight, mt as CalendarDays, n as WalletCards, nt as Download, p as Star, q as FileText, u as TrendingUp, ut as ChevronLeft, vt as BriefcaseBusiness, w as PersonStanding, y as Scale } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-q-G8Lutm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CnxDCnck.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUMMARY_API_URL = "http://192.168.147.199:8000/api/dashboard/complaint-summary";
var nf = new Intl.NumberFormat("id-ID");
var ALL_CATEGORIES = [
	{
		id: 1,
		code: "WAJIB_LAPOR",
		title: "WAJIB LAPOR KETENAGAKERJAAN",
		icon: FileText,
		iconColor: "text-red-500",
		bgColor: "bg-red-50"
	},
	{
		id: 2,
		code: "UPAH_KERJA",
		title: "Upah Kerja",
		icon: WalletCards,
		iconColor: "text-slate-700",
		bgColor: "bg-slate-100"
	},
	{
		id: 3,
		code: "JAMINAN_SOSIAL",
		title: "Jaminan Sosial",
		icon: ShieldCheck,
		iconColor: "text-emerald-600",
		bgColor: "bg-emerald-50"
	},
	{
		id: 4,
		code: "HUBUNGAN_KERJA",
		title: "Hubungan Kerja",
		icon: Handshake,
		iconColor: "text-purple-600",
		bgColor: "bg-purple-50"
	},
	{
		id: 5,
		code: "KECELAKAAN_KERJA",
		title: "Kecelakaan Kerja",
		icon: PersonStanding,
		iconColor: "text-orange-500",
		bgColor: "bg-orange-50"
	},
	{
		id: 6,
		code: "WAKTU_KERJA",
		title: "Waktu Kerja & Istirahat",
		icon: Clock3,
		iconColor: "text-amber-500",
		bgColor: "bg-amber-50"
	},
	{
		id: 7,
		code: "KADER_NORMA",
		title: "Kader Norma Kerja",
		icon: Scale,
		iconColor: "text-blue-500",
		bgColor: "bg-blue-50"
	},
	{
		id: 8,
		code: "PENEMPATAN_TK",
		title: "Penempatan Tenaga Kerja",
		icon: BriefcaseBusiness,
		iconColor: "text-cyan-600",
		bgColor: "bg-cyan-50"
	},
	{
		id: 9,
		code: "K3",
		title: "Keselamatan & Kesehatan (K3)",
		icon: HeartPulse,
		iconColor: "text-red-500",
		bgColor: "bg-red-50"
	},
	{
		id: 10,
		code: "PEREMPUAN_ANAK",
		title: "Perlindungan Perempuan & Anak",
		icon: Baby,
		iconColor: "text-purple-600",
		bgColor: "bg-purple-50"
	},
	{
		id: 11,
		code: "NORMA_K3",
		title: "Kader Norma K3",
		icon: Award,
		iconColor: "text-amber-700",
		bgColor: "bg-amber-50"
	},
	{
		id: 12,
		code: "SKP",
		title: "SKP",
		icon: FileCheck,
		iconColor: "text-slate-600",
		bgColor: "bg-slate-100"
	}
];
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
	const navigate = useNavigate();
	const [timeFilter, setTimeFilter] = (0, import_react.useState)("Hari Ini");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 4;
	const [totalAduan, setTotalAduan] = (0, import_react.useState)(12450);
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
		const fetchDashboardData = async () => {
			const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
			const headers = {
				Accept: "application/json",
				...token ? { Authorization: `Bearer ${token}` } : {}
			};
			try {
				const res = await fetch(SUMMARY_API_URL, { headers });
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
		fetchDashboardData();
	}, [timeFilter]);
	const sortedCategories = (0, import_react.useMemo)(() => {
		return [...ALL_CATEGORIES].sort((a, b) => {
			const countA = categoryCounts[a.id] ?? 0;
			return (categoryCounts[b.id] ?? 0) - countA;
		});
	}, [categoryCounts]);
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
	const totalItems = 128;
	const totalPages = Math.ceil(WILAYAH_DATA.length / itemsPerPage);
	const displayedWilayah = WILAYAH_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const handleExportLaporan = () => {
		const csvContent = "data:text/csv;charset=utf-8,NO,PROVINSI,TOTAL\n" + WILAYAH_DATA.map((w) => `${w.no},${w.provinsi},${w.total}`).join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `Laporan_Wilayah_${timeFilter.replace(/\s+/g, "_")}.csv`);
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
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: timeFilter,
								onChange: (e) => setTimeFilter(e.target.value),
								className: "appearance-none rounded-lg border border-gray-200 bg-white pl-8 pr-7 py-1.5 text-[11px] font-medium text-gray-700 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#007A64] cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Hari Ini",
										children: "Hari Ini"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Minggu Ini",
										children: "Minggu Ini"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Bulan Ini",
										children: "Bulan Ini"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Tahun Ini",
										children: "Tahun Ini"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-gray-400",
								children: "▼"
							})
						]
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
							className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), "+5%"]
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
							children: "Sangat Baik"
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
									"4.82",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-normal text-gray-400",
										children: "/ 5.00"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-gray-400 mt-1",
								children: "Berdasarkan survei masyarakat"
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
				children: sortedCategories.map((item) => {
					const Icon = item.icon;
					const count = categoryCounts[item.id] ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[280px] md:min-w-[320px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.bgColor} ${item.iconColor}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[11px] font-bold text-gray-800 leading-snug uppercase tracking-tight",
								children: item.title
							})]
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
							" data ",
							timeFilter.toLowerCase()
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
								disabled: currentPage === 1,
								className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" })
							}),
							Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
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

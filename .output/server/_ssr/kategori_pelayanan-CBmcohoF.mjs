import { i as __toESM } from "../_runtime.mjs";
import { r as apiUrl } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { $ as Clock3, B as Handshake, C as PersonStanding, F as Layers, G as FileCheck, H as FileText, P as LoaderCircle, X as Download, _ as Scale, _t as Baby, dt as CalendarDays, g as Search, n as WalletCards, p as ShieldCheck, pt as BriefcaseBusiness, t as X, vt as Award, x as Plus, xt as ArrowRight, z as HeartPulse } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-DcmoFzPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kategori_pelayanan-CBmcohoF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SUMMARY_API_URL = apiUrl("dashboard/complaint-summary");
var CATEGORIES_CONFIG = [
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
		title: "UPAH KERJA",
		icon: WalletCards,
		iconColor: "text-slate-600",
		bgColor: "bg-slate-100"
	},
	{
		id: 3,
		code: "JAMINAN_SOSIAL",
		title: "JAMINAN SOSIAL",
		icon: ShieldCheck,
		iconColor: "text-emerald-500",
		bgColor: "bg-emerald-50"
	},
	{
		id: 4,
		code: "HUBUNGAN_KERJA",
		title: "HUBUNGAN KERJA",
		icon: Handshake,
		iconColor: "text-purple-500",
		bgColor: "bg-purple-50"
	},
	{
		id: 5,
		code: "KECELAKAAN_KERJA",
		title: "KECELAKAAN KERJA",
		icon: PersonStanding,
		iconColor: "text-orange-500",
		bgColor: "bg-orange-50"
	},
	{
		id: 6,
		code: "WAKTU_KERJA",
		title: "WAKTU KERJA & WAKTU ISTIRAHAT",
		icon: Clock3,
		iconColor: "text-amber-500",
		bgColor: "bg-amber-50"
	},
	{
		id: 7,
		code: "KADER_NORMA",
		title: "KADER NORMA KETENAGAKERJAAN",
		icon: Scale,
		iconColor: "text-blue-500",
		bgColor: "bg-blue-50"
	},
	{
		id: 8,
		code: "PENEMPATAN_TK",
		title: "PENEMPATAN TK DALAM & LUAR NEGERI",
		icon: BriefcaseBusiness,
		iconColor: "text-cyan-600",
		bgColor: "bg-cyan-50"
	},
	{
		id: 9,
		code: "K3",
		title: "KESELAMATAN & KESEHATAN KERJA",
		icon: HeartPulse,
		iconColor: "text-red-500",
		bgColor: "bg-red-50"
	},
	{
		id: 10,
		code: "PEREMPUAN_ANAK",
		title: "PEREMPUAN & ANAK",
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
var nf = new Intl.NumberFormat("id-ID");
function KategoriPelayananPage() {
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const dateInputRef = (0, import_react.useRef)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [categoryCounts, setCategoryCounts] = (0, import_react.useState)({});
	const [customCategories, setCustomCategories] = (0, import_react.useState)([]);
	const [showAddModal, setShowAddModal] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [newCode, setNewCode] = (0, import_react.useState)("");
	const [newName, setNewName] = (0, import_react.useState)("");
	const [formError, setFormError] = (0, import_react.useState)(null);
	const allCategories = (0, import_react.useMemo)(() => [...CATEGORIES_CONFIG, ...customCategories], [customCategories]);
	const filteredCategories = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return allCategories;
		return allCategories.filter((cat) => cat.title.toLowerCase().includes(q) || cat.code.toLowerCase().includes(q));
	}, [allCategories, search]);
	const resetForm = () => {
		setNewCode("");
		setNewName("");
		setFormError(null);
	};
	const handleCloseModal = () => {
		setShowAddModal(false);
		resetForm();
	};
	const handleSubmitCategory = async (e) => {
		e.preventDefault();
		setFormError(null);
		const category_code = newCode.trim().toUpperCase();
		const name = newName.trim();
		if (!category_code) {
			setFormError("The category code field is required.");
			return;
		}
		if (!name) {
			setFormError("The category name field is required.");
			return;
		}
		const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
		setSaving(true);
		try {
			const response = await fetch(apiUrl("complaint-categories"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				},
				body: JSON.stringify({
					category_code,
					category_name: name
				})
			});
			const json = await response.json().catch(() => null);
			if (!response.ok || json?.success === false) {
				let errMsg = "";
				const errors = json?.errors;
				if (errors && typeof errors === "object") Object.values(errors).forEach((val) => {
					const txt = Array.isArray(val) ? val.join(", ") : String(val ?? "");
					if (txt) errMsg += `${txt}. `;
				});
				if (!errMsg) errMsg = json?.message || `Gagal menyimpan kategori (${response.status}).`;
				throw new Error(errMsg.trim());
			}
			const created = json?.data ?? null;
			const newCategory = {
				id: Number(created?.id ?? Date.now()),
				code: String(created?.category_code ?? category_code),
				title: String(created?.category_name ?? name).toUpperCase(),
				icon: Layers,
				iconColor: "text-slate-600",
				bgColor: "bg-slate-100"
			};
			setCustomCategories((prev) => [...prev, newCategory]);
			setCategoryCounts((prev) => ({
				...prev,
				[newCategory.id]: 0
			}));
			setShowAddModal(false);
			resetForm();
			fetchCategorySummary([newCategory]);
		} catch (err) {
			console.error("Gagal menyimpan kategori:", err);
			setFormError(err?.message || "Gagal menyimpan kategori. Coba lagi.");
		} finally {
			setSaving(false);
		}
	};
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
		const csvContent = "data:text/csv;charset=utf-8,ID Kategori,Nama Kategori,Total Pengaduan\n" + filteredCategories.map((cat) => `"${cat.id}","${cat.title}",${categoryCounts[cat.id] ?? 0}`).join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `Rekapitulasi_Kategori_${selectedDate ?? "Semua_Waktu"}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const fetchCategorySummary = async (extraCategories = []) => {
		setLoading(true);
		const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
		try {
			const url = selectedDate ? `${SUMMARY_API_URL}?date=${selectedDate}` : SUMMARY_API_URL;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				}
			});
			if (response.ok) {
				const resJson = await response.json();
				const list = Array.isArray(resJson?.data) ? resJson.data : Array.isArray(resJson) ? resJson : [];
				const merged = /* @__PURE__ */ new Map();
				CATEGORIES_CONFIG.forEach((cat) => merged.set(cat.id, cat));
				extraCategories.forEach((cat) => merged.set(cat.id, cat));
				list.forEach((item) => {
					const id = Number(item.id);
					if (!id) return;
					if (!merged.has(id)) merged.set(id, {
						id,
						code: String(item.category_code ?? ""),
						title: String(item.category_name ?? "Kategori").toUpperCase(),
						icon: Layers,
						iconColor: "text-slate-600",
						bgColor: "bg-slate-100"
					});
				});
				const counts = {};
				merged.forEach((_, id) => {
					counts[id] = 0;
				});
				list.forEach((item) => {
					const id = Number(item.id);
					const count = Number(item.count ?? 0);
					if (counts[id] !== void 0) counts[id] = count;
					else {
						const matched = [...merged.values()].find((c) => c.code === String(item.category_code ?? "").toUpperCase());
						if (matched) counts[matched.id] = count;
					}
				});
				setCustomCategories([...merged.values()].filter((cat) => !CATEGORIES_CONFIG.some((c) => c.id === cat.id)));
				setCategoryCounts(counts);
			}
		} catch (err) {
			console.error("Gagal mengambil data complaint-summary:", err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchCategorySummary();
	}, [selectedDate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Rekapitulasi Layanan Kategori",
		breadcrumb: "Rekapitulasi Kategori",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Cari kategori…",
								className: "w-full sm:w-52 rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#032749]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleExportLaporan,
							className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-gray-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export Laporan" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowAddModal(true),
							className: "inline-flex items-center gap-2 rounded-lg bg-[#032749] px-3.5 py-2 text-[11px] font-semibold text-white shadow-xs hover:bg-[#053a6b] transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tambah Kategori" })]
						})
					]
				})]
			}), filteredCategories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center text-gray-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
				children: "Tidak ada kategori yang cocok dengan pencarian."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
				children: filteredCategories.map((item) => {
					const count = categoryCounts[item.id] ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[13px] font-bold text-gray-800 leading-snug tracking-wide uppercase mb-5",
							children: item.title
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
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								window.location.href = `/admin/detail_kategori_pelayanan?id=${item.id}`;
							},
							className: "w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#F8FAFC] text-[11px] font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lihat Detail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-gray-600" })]
						})]
					}, item.id);
				})
			})]
		}), showAddModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Tutup",
				onClick: handleCloseModal,
				className: "absolute inset-0 bg-black/40 backdrop-blur-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-gray-100 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[14px] font-bold text-gray-800",
						children: "Tambah Kategori Layanan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleCloseModal,
						className: "rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmitCategory,
					className: "space-y-4 px-5 py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-bold text-gray-700 mb-1.5",
								children: ["Kode Kategori ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: newCode,
								onChange: (e) => setNewCode(e.target.value),
								placeholder: "Contoh: PERLINDUNGAN_PM",
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm uppercase placeholder:normal-case focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[10px] text-gray-400",
								children: "Kode unik kategori (huruf besar, tanpa spasi; gunakan underscore untuk memisahkan kata)."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-gray-700 mb-1.5",
							children: ["Nama Kategori ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: newName,
							onChange: (e) => setNewName(e.target.value),
							placeholder: "Contoh: Perlindungan Pekerja Migran",
							className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
						})] }),
						formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-red-500",
							children: formError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleCloseModal,
								className: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50",
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saving,
								className: "inline-flex items-center gap-2 rounded-lg bg-[#032749] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#053a6b] disabled:opacity-50",
								children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), saving ? "Menyimpan..." : "Simpan Kategori"]
							})]
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { KategoriPelayananPage as component };

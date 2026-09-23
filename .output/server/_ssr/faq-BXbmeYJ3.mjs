import { i as __toESM } from "../_runtime.mjs";
import { a as getAuthToken, r as apiUrl } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as LoaderCircle, s as TriangleAlert, u as Trash2, w as Pencil, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-DcmoFzPa.mjs";
import { t as useTableExport } from "./export-utils-304m4SjV.mjs";
import { t as pageWindow } from "./pagination-ChhiJOl5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-BXbmeYJ3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FAQ_LIST_URL = apiUrl("faqs");
var ITEMS_PER_PAGE = 10;
function FaqPage() {
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [pertanyaan, setPertanyaan] = (0, import_react.useState)("");
	const [jawaban, setJawaban] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const fetchFaqs = async () => {
		setLoading(true);
		setLoadError(null);
		try {
			const token = getAuthToken();
			const response = await fetch(FAQ_LIST_URL, {
				method: "GET",
				headers: {
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				}
			});
			if (!response.ok) throw new Error(`Gagal memuat data (${response.status}).`);
			const json = await response.json();
			const rawList = Array.isArray(json) ? json : json?.data;
			setRows((Array.isArray(rawList) ? rawList : []).map((raw) => {
				const item = raw;
				return {
					id: Number(item.id),
					pertanyaan: String(item.pertanyaan ?? item.question ?? ""),
					jawaban: String(item.jawaban ?? item.answer ?? "")
				};
			}));
		} catch (err) {
			const message = err instanceof Error ? err.message : "Gagal memuat data FAQ.";
			console.error("Gagal mengambil data FAQ:", err);
			setLoadError(message);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchFaqs();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter((r) => r.pertanyaan.toLowerCase().includes(q) || r.jawaban.toLowerCase().includes(q));
	}, [rows, search]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const extractApiError = (json, fallback) => {
		const api = json;
		let errMsg = "";
		const errors = api?.errors;
		if (errors && typeof errors === "object") Object.values(errors).forEach((val) => {
			const txt = Array.isArray(val) ? val.join(", ") : String(val ?? "");
			if (txt) errMsg += `${txt}. `;
		});
		if (!errMsg) errMsg = api?.message || fallback;
		return errMsg.trim();
	};
	const handleSave = async (e) => {
		e.preventDefault();
		setFormError(null);
		const q = pertanyaan.trim();
		const a = jawaban.trim();
		if (!q) {
			setFormError("Pertanyaan wajib diisi.");
			return;
		}
		if (!a) {
			setFormError("Jawaban wajib diisi.");
			return;
		}
		const isEdit = editingId !== null;
		const token = getAuthToken();
		setSaving(true);
		try {
			const response = await fetch(isEdit ? `${FAQ_LIST_URL}/${editingId}` : FAQ_LIST_URL, {
				method: isEdit ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				},
				body: JSON.stringify({
					question: q,
					answer: a
				})
			});
			const json = await response.json().catch(() => null);
			if (!response.ok || json?.success === false) throw new Error(extractApiError(json, `Gagal menyimpan (${response.status}).`));
			setPertanyaan("");
			setJawaban("");
			setEditingId(null);
			await fetchFaqs();
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			console.error("Gagal menyimpan FAQ:", err);
			setFormError(message || "Gagal menyimpan FAQ. Coba lagi.");
		} finally {
			setSaving(false);
		}
	};
	const handleEdit = (item) => {
		setEditingId(item.id);
		setPertanyaan(item.pertanyaan);
		setJawaban(item.jawaban);
		setFormError(null);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const handleCancelEdit = () => {
		setEditingId(null);
		setPertanyaan("");
		setJawaban("");
		setFormError(null);
	};
	const handleDelete = async (item) => {
		if (!window.confirm(`Hapus FAQ "${item.pertanyaan}"?`)) return;
		const token = getAuthToken();
		try {
			const response = await fetch(`${FAQ_LIST_URL}/${item.id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				}
			});
			const json = await response.json().catch(() => null);
			if (!response.ok || json?.success === false) throw new Error(extractApiError(json, `Gagal menghapus (${response.status}).`));
			if (editingId === item.id) handleCancelEdit();
			await fetchFaqs();
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			console.error("Gagal menghapus FAQ:", err);
			alert(message || "Gagal menghapus FAQ. Coba lagi.");
		}
	};
	const buildExport = (0, import_react.useMemo)(() => {
		return {
			headers: [
				"NO",
				"PERTANYAAN",
				"JAWABAN"
			],
			rows: filtered.map((item, index) => [
				index + 1,
				item.pertanyaan,
				item.jawaban
			])
		};
	}, [filtered]);
	const { copied, handleCopy, handleCsv, handleExcel, handlePrint } = useTableExport({
		baseName: "FAQ",
		headers: buildExport.headers,
		rows: buildExport.rows
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "FAQ",
		breadcrumb: "FAQ",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[17px] font-bold tracking-tight text-gray-900",
						children: "FAQ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[12px] text-gray-500",
						children: "Frequently Asked Questions - kelola pertanyaan dan jawaban layanan."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 text-[13px] font-bold text-gray-800",
						children: editingId ? "Edit FAQ" : "Tambah FAQ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSave,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-xs font-bold text-gray-700",
								children: "Pertanyaan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: pertanyaan,
								onChange: (e) => setPertanyaan(e.target.value),
								placeholder: "Contoh: Apa itu layanan PTSA KEMNAKER?",
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-xs font-bold text-gray-700",
								children: "Jawaban"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: jawaban,
								onChange: (e) => setJawaban(e.target.value),
								placeholder: "Tuliskan jawaban lengkap untuk pertanyaan di atas…",
								rows: 4,
								className: "w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
							})] }),
							formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-red-500",
								children: formError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										disabled: saving,
										className: "inline-flex items-center gap-2 rounded-lg bg-[#016A61] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50",
										children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan"]
									}),
									editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleCancelEdit,
										className: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50",
										children: "Batal"
									}),
									!editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => navigate({ to: "/admin/setting" }),
										className: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50",
										children: "Kembali"
									})
								]
							})
						]
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
						placeholder: "Cari pertanyaan…",
						className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#016A61] sm:w-64"
					})]
				}),
				loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-[11px] text-red-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Gagal mengambil data dari server: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: loadError
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: fetchFaqs,
						disabled: loading,
						className: "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50",
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), "Coba Lagi"]
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
										children: "Pertanyaan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Jawaban"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-24 px-5 py-3.5 text-right",
										children: "Tools"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-gray-50 text-[12px]",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 4,
									className: "px-5 py-10 text-center text-gray-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Memuat..."]
									})
								}) }) : displayed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 4,
									className: "px-5 py-10 text-center text-gray-400",
									children: "Tidak ada data FAQ."
								}) }) : displayed.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-gray-50/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 font-medium text-gray-600",
											children: (page - 1) * ITEMS_PER_PAGE + index + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 font-medium text-gray-800",
											children: item.pertanyaan
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "max-w-md px-5 py-3.5 text-gray-700",
											children: item.jawaban
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Edit",
													onClick: () => handleEdit(item),
													className: "grid h-7 w-7 place-items-center rounded-md bg-[#016A61] text-white transition-colors hover:bg-[#00544d]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Hapus",
													onClick: () => handleDelete(item),
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPage((p) => Math.max(1, p - 1)),
								disabled: page === 1,
								className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40",
								children: "‹"
							}),
							pageWindow(page, totalPages).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPage(p),
								className: `grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold transition-colors ${page === p ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"}`,
								children: p
							}, p)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
								disabled: page === totalPages,
								className: "grid h-7 w-7 place-items-center rounded-md text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40",
								children: "›"
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { FaqPage as component };

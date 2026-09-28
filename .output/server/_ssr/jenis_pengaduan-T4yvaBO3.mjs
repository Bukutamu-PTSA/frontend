import { i as __toESM } from "../_runtime.mjs";
import { r as apiUrl } from "./api-BipEh2FU.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as LoaderCircle, u as Trash2, w as Pencil } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CVfVOAjz.mjs";
import { t as useTableExport } from "./export-utils-DLo2bII_.mjs";
import { t as pageWindow } from "./pagination-ChhiJOl5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jenis_pengaduan-T4yvaBO3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var JENIS_API_URL = apiUrl("complaint-categories");
var ITEMS_PER_PAGE = 10;
function JenisPengaduanPage() {
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [nama, setNama] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const fetchJenis = async () => {
		setLoading(true);
		const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
		try {
			const response = await fetch(JENIS_API_URL, {
				method: "GET",
				headers: {
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				}
			});
			if (response.ok) {
				const json = await response.json();
				const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
				setRows(list.map((item) => ({
					id: Number(item.id),
					nama: String(item.category_name ?? item.name ?? ""),
					kode: String(item.category_code ?? "")
				})));
			}
		} catch (err) {
			console.error("Gagal mengambil data jenis pengaduan:", err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchJenis();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter((r) => r.nama.toLowerCase().includes(q) || r.kode.toLowerCase().includes(q));
	}, [rows, search]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const handleSave = async (e) => {
		e.preventDefault();
		setFormError(null);
		const value = nama.trim();
		if (!value) {
			setFormError("The category name field is required.");
			return;
		}
		const category_code = value.toUpperCase().replace(/\s+/g, "_");
		const isEdit = editingId !== null;
		const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
		setSaving(true);
		try {
			const response = await fetch(isEdit ? `${JENIS_API_URL}/${editingId}` : JENIS_API_URL, {
				method: isEdit ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				},
				body: JSON.stringify({
					category_code,
					category_name: value
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
				if (!errMsg) errMsg = json?.message || `Gagal menyimpan (${response.status}).`;
				throw new Error(errMsg.trim());
			}
			setNama("");
			setEditingId(null);
			fetchJenis();
		} catch (err) {
			console.error("Gagal menyimpan jenis pengaduan:", err);
			setFormError(err?.message || "Gagal menyimpan jenis pengaduan. Coba lagi.");
		} finally {
			setSaving(false);
		}
	};
	const handleEdit = (item) => {
		setEditingId(item.id);
		setNama(item.nama);
		setFormError(null);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const handleCancelEdit = () => {
		setEditingId(null);
		setNama("");
		setFormError(null);
	};
	const handleDelete = async (item) => {
		if (!window.confirm(`Hapus jenis pengaduan "${item.nama}"?`)) return;
		const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
		try {
			const response = await fetch(`${JENIS_API_URL}/${item.id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				}
			});
			const json = await response.json().catch(() => null);
			if (!response.ok || json?.success === false) throw new Error(json?.message || `Gagal menghapus (${response.status}).`);
			fetchJenis();
		} catch (err) {
			console.error("Gagal menghapus jenis pengaduan:", err);
			alert(err?.message || "Gagal menghapus jenis pengaduan. Coba lagi.");
		}
	};
	const buildExport = (0, import_react.useMemo)(() => {
		return {
			headers: [
				"NO",
				"JENIS PENGADUAN",
				"KODE KATEGORI"
			],
			rows: filtered.map((item, index) => [
				index + 1,
				item.nama,
				item.kode
			])
		};
	}, [filtered]);
	const { copied, handleCopy, handleCsv, handleExcel, handlePdf, handlePrint } = useTableExport({
		baseName: "Jenis_Pengaduan",
		headers: buildExport.headers,
		rows: buildExport.rows
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Jenis Pengaduan",
		breadcrumb: "Jenis Pengaduan",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[17px] font-bold tracking-tight text-gray-900",
						children: "Jenis Pengaduan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[12px] text-gray-500",
						children: "Master kategori jenis pengaduan masyarakat."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 text-[13px] font-bold text-gray-800",
						children: editingId ? "Edit Jenis Pengaduan" : "Tambah Jenis Pengaduan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSave,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: nama,
								onChange: (e) => setNama(e.target.value),
								placeholder: "Contoh: Upah Kerja",
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
							}),
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
								onClick: handlePdf,
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
						placeholder: "Cari pengaduan…",
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
										children: "Jenis Pengaduan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Kode Kategori"
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
									children: "Tidak ada data jenis pengaduan."
								}) }) : displayed.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-gray-50/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 font-medium text-gray-600",
											children: (page - 1) * ITEMS_PER_PAGE + index + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 font-medium text-gray-800",
											children: item.nama
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-gray-700",
											children: item.kode
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
export { JenisPengaduanPage as component };

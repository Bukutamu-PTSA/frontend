import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as UserPlus, u as Trash2, w as Pencil } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-DcmoFzPa.mjs";
import { t as useTableExport } from "./export-utils-304m4SjV.mjs";
import { t as pageWindow } from "./pagination-ChhiJOl5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/manajemen_user-D_jtz-Mb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_DATA = [
	{
		id: 1,
		nama: "Budi Santoso",
		email: "budi.santoso@kemnaker.go.id",
		role: "Administrator"
	},
	{
		id: 2,
		nama: "Siti Aisyah",
		email: "siti.aisyah@kemnaker.go.id",
		role: "Pengawas"
	},
	{
		id: 3,
		nama: "Agus Wijaya",
		email: "agus.wijaya@kemnaker.go.id",
		role: "Petugas"
	}
];
var USERS_API_URL = apiUrl("users");
var ITEMS_PER_PAGE = 10;
var ROLE_STYLE = {
	super_admin: "bg-purple-50 text-purple-600",
	Administrator: "bg-purple-50 text-purple-600",
	admin: "bg-blue-50 text-blue-600",
	Pengawas: "bg-blue-50 text-blue-600",
	Petugas: "bg-emerald-50 text-emerald-600"
};
var ROLE_LABEL = {
	super_admin: "Super Admin",
	administrator: "Super Admin",
	admin: "Admin"
};
function ManajemenUserPage() {
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)(INITIAL_DATA);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch(USERS_API_URL, {
					method: "GET",
					headers: authHeaders()
				});
				if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
				const json = await res.json();
				const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.users) ? json.users : [];
				if (list.length === 0) {
					setRows([]);
					return;
				}
				setRows(list.map((item) => {
					const role = typeof item.role === "object" && item.role !== null ? String(item.role.name ?? item.role.role ?? "") : String(item.role ?? item.role_name ?? "");
					return {
						id: Number(item.id),
						nama: String(item.username ?? item.name ?? item.nama ?? ""),
						email: String(item.email ?? ""),
						role: role || "admin"
					};
				}));
			} catch (err) {
				console.error("Gagal memuat daftar user:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter((r) => {
			const role = String(r.role);
			const roleLabel = (ROLE_LABEL[role.toLowerCase()] ?? role).toLowerCase();
			return r.nama.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || role.toLowerCase().includes(q) || roleLabel.includes(q);
		});
	}, [rows, search]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const displayed = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	(0, import_react.useEffect)(() => {
		setPage((p) => Math.min(p, totalPages));
	}, [totalPages]);
	const buildExport = (0, import_react.useMemo)(() => {
		return {
			headers: [
				"NO",
				"NAMA",
				"EMAIL",
				"ROLE"
			],
			rows: filtered.map((item, index) => [
				index + 1,
				item.nama,
				item.email,
				item.role
			])
		};
	}, [filtered]);
	const { copied, handleCopy, handleCsv, handleExcel, handlePrint } = useTableExport({
		baseName: "Manajemen_User",
		headers: buildExport.headers,
		rows: buildExport.rows
	});
	const handleDelete = async (id) => {
		if (!window.confirm("Hapus user ini?")) return;
		try {
			const response = await fetch(`${USERS_API_URL}/${id}`, {
				method: "DELETE",
				headers: authHeaders()
			});
			if (!response.ok) {
				const json = await response.json().catch(() => null);
				throw new Error(json?.message || `Gagal menghapus (${response.status}).`);
			}
			window.location.reload();
		} catch (err) {
			console.error("Gagal menghapus user:", err);
			alert(err?.message || "Gagal menghapus user. Coba lagi.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Manajemen User",
		breadcrumb: "Manajemen User",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[17px] font-bold tracking-tight text-gray-900",
						children: "Manajemen User"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[12px] text-gray-500",
						children: "Kelola akun pengguna, peran, dan akses sistem."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => navigate({ to: "/admin/tambah_user" }),
						className: "inline-flex items-center gap-2 rounded-lg bg-[#016A61] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), "Tambah User"]
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
						placeholder: "Cari user…",
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
										children: "User"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Role"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-28 px-5 py-3.5 text-right",
										children: "Tools"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-gray-50 text-[12px]",
								children: displayed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 4,
									className: "px-5 py-10 text-center text-gray-400",
									children: loading ? "Memuat data user..." : "Tidak ada data user."
								}) }) : displayed.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-gray-50/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 font-medium text-gray-600",
											children: (page - 1) * ITEMS_PER_PAGE + index + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600",
													children: item.nama.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate font-semibold text-gray-800",
														children: item.nama
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate text-[11px] text-gray-500",
														children: item.email
													})]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${ROLE_STYLE[item.role.toLowerCase()] ?? "bg-slate-100 text-slate-600"}`,
												children: ROLE_LABEL[item.role.toLowerCase()] ?? item.role
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													title: "Edit",
													onClick: () => navigate({
														to: "/admin/edit_user",
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
export { ManajemenUserPage as component };

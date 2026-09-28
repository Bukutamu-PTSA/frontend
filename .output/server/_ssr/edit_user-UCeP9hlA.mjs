import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BipEh2FU.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as EyeOff, q as Eye, v as Save } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CVfVOAjz.mjs";
import { r as Route$11 } from "./router-Dr0ZvI5T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit_user-UCeP9hlA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_OPTIONS = [{
	value: "super_admin",
	label: "Super Admin"
}, {
	value: "admin",
	label: "Admin"
}];
var USERS_API_URL = apiUrl("users");
/** Petakan role lama (Pelapor/Pengawas/Petugas/Administrator) ke role baru. */
function normalizeRole(raw) {
	const key = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
	if (key === "super_admin" || key === "administrator") return "super_admin";
	if (key === "admin") return "admin";
	return "admin";
}
function EditUserPage() {
	const navigate = useNavigate();
	const { id } = Route$11.useSearch();
	const [nama, setNama] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)(ROLE_OPTIONS[0].value);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const fetchUser = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const res = await fetch(`${USERS_API_URL}/${id}`, {
					method: "GET",
					headers: authHeaders()
				});
				if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
				const json = await res.json();
				const item = json?.data ?? json?.user ?? json;
				setNama(String(item.username ?? item.name ?? item.nama ?? ""));
				setEmail(String(item.email ?? ""));
				const rawRole = typeof item.role === "object" && item.role !== null ? String(item.role.name ?? item.role.role ?? "") : String(item.role ?? item.role_name ?? "");
				if (rawRole) setRole(normalizeRole(rawRole));
			} catch (err) {
				console.error("Gagal memuat data user:", err);
				setErrorMessage("Gagal memuat data user. Silakan kembali dan coba lagi.");
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [id]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!id) {
			setErrorMessage("ID user tidak ditemukan.");
			return;
		}
		setErrorMessage(null);
		setSaving(true);
		try {
			const body = {
				username: nama,
				email,
				role
			};
			if (password.trim()) body["password"] = password;
			const response = await fetch(`${USERS_API_URL}/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...authHeaders()
				},
				body: JSON.stringify(body)
			});
			const result = await response.json().catch(() => null);
			if (!response.ok || result?.success === false) {
				let errMsg = "";
				const errors = result?.errors;
				if (errors && typeof errors === "object") Object.values(errors).forEach((val) => {
					const txt = Array.isArray(val) ? val.join(", ") : String(val ?? "");
					if (txt) errMsg += `${txt}. `;
				});
				throw new Error(errMsg.trim() || result?.message || `Gagal memperbarui user (${response.status}).`);
			}
			alert("User berhasil diperbarui!");
			navigate({ to: "/admin/manajemen_user" });
		} catch (err) {
			console.error("Perbarui user gagal:", err);
			setErrorMessage(err?.message || "Gagal memperbarui user. Silakan coba lagi.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Edit User",
		breadcrumb: "Edit User",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[15px] font-bold text-gray-800",
					children: "Edit User"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-6 text-[12px] text-gray-500",
					children: "Perbarui informasi akun pengguna. Kosongkan password bila tidak ingin mengubahnya."
				}),
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-xs text-gray-400",
					children: "Memuat data user..."
				}),
				errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600",
					children: errorMessage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold text-gray-700",
							children: "Nama User"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: nama,
							onChange: (e) => setNama(e.target.value),
							className: "w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold text-gray-700",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold text-gray-700",
							children: "Ganti Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showPassword ? "text" : "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "Kosongkan bila tidak diubah",
								className: "w-full rounded-full border border-gray-300 py-2.5 pl-4 pr-12 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								"aria-label": showPassword ? "Sembunyikan password" : "Tampilkan password",
								className: "absolute right-4 text-gray-500 hover:text-[#016A61] focus:outline-none",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5 stroke-[1.75]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5 stroke-[1.75]" })
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold text-gray-700",
							children: "Role Akses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: role,
								onChange: (e) => setRole(e.target.value),
								className: "w-full appearance-none rounded-full border border-gray-300 px-4 py-2.5 pr-9 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]",
								children: ROLE_OPTIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r.value,
									children: r.label
								}, r.value))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400",
								children: "▼"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => navigate({ to: "/admin/manajemen_user" }),
								className: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50",
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saving,
								className: "inline-flex items-center gap-2 rounded-lg bg-[#016A61] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), saving ? "Menyimpan…" : "Simpan Perubahan"]
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { EditUserPage as component };

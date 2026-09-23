import { i as __toESM } from "../_runtime.mjs";
import { n as AUTH_BASE_URL } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as Save } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-Z3ttINws.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tambah_user-DTKptWq9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_OPTIONS = [
	"Super Admin",
	"Admin"
];
function TambahUserPage() {
	const navigate = useNavigate();
	const [nama, setNama] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)(ROLE_OPTIONS[0]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(null);
		setSaving(true);
		try {
			const response = await fetch(`${AUTH_BASE_URL}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({
					username: nama,
					email,
					password,
					password_confirmation: password,
					role
				})
			});
			const result = await response.json().catch(() => null);
			if (!response.ok || result?.success === false) {
				let errMsg = "";
				const errors = result?.errors;
				if (errors && typeof errors === "object") Object.values(errors).forEach((val) => {
					const txt = Array.isArray(val) ? val.join(", ") : String(val ?? "");
					if (txt) errMsg += `${txt}. `;
				});
				throw new Error(errMsg.trim() || result?.message || `Gagal mendaftarkan user (${response.status}).`);
			}
			alert("User berhasil ditambahkan!");
			navigate({ to: "/admin/manajemen_user" });
		} catch (err) {
			console.error("Registrasi user gagal:", err);
			setErrorMessage(err?.message || "Gagal mendaftarkan user. Silakan coba lagi.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Tambah User Baru",
		breadcrumb: "Tambah User",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[15px] font-bold text-gray-800",
					children: "Tambah User Baru"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-6 text-[12px] text-gray-500",
					children: "Lengkapi form di bawah ini untuk menambahkan pengguna baru ke dalam sistem PTSA."
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
							placeholder: "Masukkan nama lengkap",
							className: "w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold text-gray-700",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "nama@kemnaker.go.id",
							className: "w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold text-gray-700",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••",
							className: "w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
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
									value: r,
									children: r
								}, r))
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), saving ? "Menyimpan…" : "Simpan User"]
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { TambahUserPage as component };

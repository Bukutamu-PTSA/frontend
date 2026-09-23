import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./app-shell-DcmoFzPa.mjs";
import { a as Route$14 } from "./router-vlArUx9x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit_skala-CJP9-aKk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMPANY_SIZES_API_URL = apiUrl("v1/company-sizes");
var COMPANY_SIZES_ADMIN_API_URL = apiUrl("v1/admin/company-sizes");
function EditSkalaPage() {
	const navigate = useNavigate();
	const { id } = Route$14.useSearch();
	const [kategori, setKategori] = (0, import_react.useState)("Besar");
	const [rangeStart, setRangeStart] = (0, import_react.useState)("100");
	const [rangeEnd, setRangeEnd] = (0, import_react.useState)("999999999");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const fetchSkala = async () => {
			if (!id) {
				setLoading(false);
				return;
			}
			setLoading(true);
			setError(null);
			const tryFetch = async (url) => {
				const res = await fetch(url, {
					method: "GET",
					headers: {
						Accept: "application/json",
						...authHeaders()
					}
				});
				if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
				return res.json();
			};
			try {
				let json;
				try {
					json = await tryFetch(`${COMPANY_SIZES_ADMIN_API_URL}/${id}`);
				} catch {
					json = await tryFetch(`${COMPANY_SIZES_API_URL}/${id}`);
				}
				const it = json?.data ?? json ?? {};
				const name = String(it.size_name ?? it.nama ?? it.company_size ?? it.name ?? "").trim();
				if (name) setKategori(name);
				const rawMin = Number(it.min_employees ?? it.start ?? it.min ?? NaN);
				if (Number.isFinite(rawMin)) setRangeStart(String(rawMin));
				const rawMax = it.max_employees ?? it.end ?? it.max ?? void 0;
				if (rawMax !== void 0 && rawMax !== null) setRangeEnd(String(Number(rawMax)));
			} catch (err) {
				console.error("Gagal memuat data skala:", err);
				setError("Gagal memuat data skala. Silakan kembali dan coba lagi.");
			} finally {
				setLoading(false);
			}
		};
		fetchSkala();
	}, [id]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!id) {
			setError("ID skala tidak ditemukan.");
			return;
		}
		setSaving(true);
		setError(null);
		try {
			const res = await fetch(`${COMPANY_SIZES_ADMIN_API_URL}/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...authHeaders()
				},
				body: JSON.stringify({
					size_name: kategori,
					min_employees: Number(rangeStart),
					max_employees: Number(rangeEnd)
				})
			});
			if (!res.ok) {
				const json = res.status === 204 ? null : await res.json().catch(() => null);
				throw new Error(json?.message || `Gagal menyimpan skala (${res.status}).`);
			}
			navigate({ to: "/admin/data_skala" });
		} catch (err) {
			console.error("Edit skala error:", err);
			setError(err.message || "Terjadi kesalahan saat menyimpan skala.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Edit Skala",
		breadcrumb: "Edit Skala",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-6 text-[14px] font-bold uppercase tracking-wide text-gray-800",
				children: "Form Edit Skala"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-500",
						children: "Memuat data skala..."
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]",
						children: "Kategori"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: kategori,
						onChange: (e) => setKategori(e.target.value),
						className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]",
							children: "Range Start"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "0.01",
							value: rangeStart,
							onChange: (e) => setRangeStart(e.target.value),
							className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]",
							children: "Range End"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "0.01",
							value: rangeEnd,
							onChange: (e) => setRangeEnd(e.target.value),
							className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => navigate({ to: "/admin/data_skala" }),
							className: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50",
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: saving || loading,
							className: "rounded-lg bg-[#016A61] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50",
							children: saving ? "Menyimpan…" : "Simpan Perubahan"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { EditSkalaPage as component };

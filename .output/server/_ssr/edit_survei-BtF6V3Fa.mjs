import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as AppShell } from "./app-shell-q-G8Lutm.mjs";
import { i as Route$10 } from "./router-D_q8IFgo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit_survei-BtF6V3Fa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditSurveiPage() {
	const navigate = useNavigate();
	const { id } = Route$10.useSearch();
	const [pertanyaan, setPertanyaan] = (0, import_react.useState)("Bagaimana Sarana dan Prasarana layanan PTSA?");
	const [optionA, setOptionA] = (0, import_react.useState)("Baik");
	const [optionB, setOptionB] = (0, import_react.useState)("Cukup");
	const [optionC, setOptionC] = (0, import_react.useState)("Kurang");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			await new Promise((r) => setTimeout(r, 400));
			navigate({ to: "/admin/data_survei" });
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Edit Data Survei",
		breadcrumb: "Edit Survei",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-6 text-[14px] font-bold uppercase tracking-wide text-gray-800",
				children: "Form Edit Survei"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Soal",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: pertanyaan,
							onChange: (e) => setPertanyaan(e.target.value),
							className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Option A",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: optionA,
									onChange: (e) => setOptionA(e.target.value),
									className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Option B",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: optionB,
									onChange: (e) => setOptionB(e.target.value),
									className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Option C",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: optionC,
									onChange: (e) => setOptionC(e.target.value),
									className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => navigate({ to: "/admin/data_survei" }),
							className: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50",
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: saving,
							className: "rounded-lg bg-[#016A61] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50",
							children: saving ? "Menyimpan…" : "Simpan Perubahan"
						})]
					})
				]
			})]
		})
	});
}
function Field({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]",
		children: [
			label,
			" ",
			required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				children: "*"
			})
		]
	}), children] });
}
//#endregion
export { EditSurveiPage as component };

import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { z as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CZ5KQ9QL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setting-BsrOPf_E.js
var import_jsx_runtime = require_jsx_runtime();
var settingMenu = [
	{
		no: 1,
		nama: "Halaman Beranda",
		desc: "Konten hero, banner, dan pengumuman",
		tone: "brand"
	},
	{
		no: 2,
		nama: "Data Skala Perusahaan",
		desc: "Kelola klasifikasi mikro s.d. besar",
		tone: "brand"
	},
	{
		no: 3,
		nama: "Data Survei",
		desc: "Pertanyaan dan periode survei kepuasan",
		tone: "brand"
	},
	{
		no: 4,
		nama: "Userlogin",
		desc: "Akun petugas, peran, dan akses",
		tone: "brand"
	},
	{
		no: 5,
		nama: "Data Visitor",
		desc: "Statistik kunjungan layanan",
		tone: "brand"
	},
	{
		no: 6,
		nama: "Generate QR",
		desc: "QR antrian dan tautan layanan",
		tone: "brand"
	},
	{
		no: 7,
		nama: "Shortlink URL",
		desc: "Pemendek tautan publikasi",
		tone: "warning"
	},
	{
		no: 8,
		nama: "Jenis Pengaduan",
		desc: "Master kategori pengaduan",
		tone: "warning"
	}
];
function SettingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Setting Apps",
		breadcrumb: "Setting",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: settingMenu.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "card-surface group relative overflow-hidden p-5 text-left transition-shadow hover:shadow-lift",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute inset-x-0 top-0 h-1 ${s.tone === "warning" ? "bg-warning" : "bg-gradient-brand"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground",
							children: s.no
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-display font-semibold",
								children: s.nama
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: s.desc
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" })
					]
				})]
			}, s.no))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-center text-sm text-muted-foreground",
			children: "LAYANAN PENGADUAN"
		})]
	});
}
//#endregion
export { SettingPage as component };

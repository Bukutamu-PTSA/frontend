import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { O as MonitorSmartphone, Tt as ArrowRight, gt as Building2, i as Users, l as TriangleAlert, ot as ClipboardList } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-q-G8Lutm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setting-BlQtjn13.js
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = [
	{
		label: "General Settings",
		cards: [{
			title: "Data Survei",
			desc: "Kelola kuesioner dan parameter survei kepuasan.",
			icon: ClipboardList,
			to: "/admin/data_survei"
		}, {
			title: "Data Visitor",
			desc: "Pengaturan data kunjungan dan buku tamu digital.",
			icon: MonitorSmartphone,
			to: "/admin/data_visitor"
		}]
	},
	{
		label: "App & Services",
		cards: [{
			title: "Data Skala Perusahaan",
			desc: "Konfigurasi kategori dan parameter skala perusahaan.",
			icon: Building2,
			to: "/admin/data_skala"
		}, {
			title: "Jenis Pengaduan",
			desc: "Kelola kategori dan alur jenis pengaduan masyarakat.",
			icon: TriangleAlert,
			to: "/admin/jenis_pengaduan"
		}]
	},
	{
		label: "User Management",
		cards: [{
			title: "Manajemen User",
			desc: "Kelola akun pengguna, peran, dan akses pengguna dalam sistem.",
			icon: Users,
			to: "/admin/manajemen_user"
		}]
	}
];
function SettingPage() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Setting Apps",
		breadcrumb: "Setting",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[20px] font-bold tracking-tight text-gray-900",
					children: "Pengaturan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[12px] text-gray-500",
					children: "Kelola konfigurasi layanan pengaduan ketenagakerjaan."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-3",
				children: SECTIONS.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 border-b border-gray-100 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400",
					children: section.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: section.cards.map((card) => {
						const Icon = card.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => card.to && navigate({ to: card.to }),
							className: "group relative flex w-full cursor-pointer items-start gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#016A61]/10 text-[#016A61]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1 pr-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[13px] font-bold leading-snug text-gray-800",
										children: card.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[11px] leading-relaxed text-gray-500",
										children: card.desc
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "absolute right-4 top-4 h-4 w-4 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-[#016A61]" })
							]
						}, card.title);
					})
				})] }, section.label))
			})]
		})
	});
}
//#endregion
export { SettingPage as component };

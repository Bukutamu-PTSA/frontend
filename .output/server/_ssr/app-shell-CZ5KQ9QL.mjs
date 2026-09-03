import { r as __toESM } from "../_runtime.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { B as ChartNoAxesColumn, C as LoaderCircle, E as House, G as Bell, M as Eye, R as CircleAlert, S as LogOut, _ as Network, d as Search, k as FileText, l as Settings, t as X, y as Menu } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-CZ5KQ9QL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_API_URL = "http://192.168.147.199:8000/api/v1/auth";
var sidebarNav = [
	{
		to: "/admin/dashboard",
		icon: House,
		name: "Beranda",
		exactPaths: [
			"/admin/dashboard",
			"/dashboard",
			"/admin"
		]
	},
	{
		to: "/admin/kategori_laporan",
		icon: Network,
		name: "Pelayanan",
		exactPaths: [
			"/admin/kategori_laporan",
			"/admin/kategori_laporan",
			"/admin/pelayanan"
		]
	},
	{
		to: "/admin/reportpengaduan",
		icon: CircleAlert,
		name: "Report Pengaduan",
		exactPaths: ["/admin/reportpengaduan", "/admin/reportpengaduan"]
	},
	{
		to: "/survei",
		icon: FileText,
		name: "Report Survei",
		exactPaths: ["/survei", "/admin/survei"]
	},
	{
		to: "/admin/dashboard",
		icon: ChartNoAxesColumn,
		name: "Grafik & Statistik",
		exactPaths: ["/admin/grafik"]
	},
	{
		to: "/admin/dashboard",
		icon: Eye,
		name: "Pengawas",
		exactPaths: ["/admin/pengawas"]
	},
	{
		to: "/admin/dashboard",
		icon: Settings,
		name: "Pengaturan",
		exactPaths: ["/setting", "/admin/pengaturan"]
	}
];
function AppShell({ children }) {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [loggingOut, setLoggingOut] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const handleLogout = async () => {
		setLoggingOut(true);
		const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
		try {
			if (token) {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 1500);
				await fetch(`${BASE_API_URL}/logout`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${token}`
					},
					signal: controller.signal
				});
				clearTimeout(timeoutId);
			}
		} catch (err) {
			console.warn("Logout notice:", err);
		} finally {
			localStorage.removeItem("auth_token");
			localStorage.removeItem("auth_user");
			sessionStorage.removeItem("auth_token");
			sessionStorage.removeItem("auth_user");
			window.location.href = "/";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-[#1E293B]",
		children: [
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Tutup Navigasi",
				onClick: () => setMobileOpen(false),
				className: "fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `
          fixed inset-y-0 left-0 z-40 flex w-[218px] flex-col bg-[#0F2137] text-white transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center gap-3 bg-white px-4 border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: kemnaker_logo_default,
									alt: "Logo PTSA Kemnaker",
									className: "h-8 w-8 object-contain"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-[13px] font-black tracking-tight text-[#0B3968] leading-none uppercase",
									children: "PTSA KEMNAKER"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[8px] font-medium tracking-wider text-gray-500 uppercase mt-0.5",
									children: "PELAYANAN TERPADU"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMobileOpen(false),
								className: "ml-auto text-gray-400 hover:text-gray-600 lg:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-4 py-4 border-b border-white/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-9 w-9 rounded-full bg-slate-600 border border-white/20 overflow-hidden flex items-center justify-center text-xs font-semibold text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
									alt: "Ikko",
									className: "h-full w-full object-cover",
									onError: (e) => {
										e.target.style.display = "none";
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IK" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0F2137]" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold text-white truncate",
								children: "Ikko"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] text-gray-400 truncate",
								children: "Petugas Pelayanan"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-1 px-3 py-3 overflow-y-auto",
						children: sidebarNav.map((item) => {
							const isActive = item.exactPaths.some((p) => {
								if (p === "/admin" || p === "/admin/dashboard" || p === "/dashboard") return pathname === "/admin" || pathname === "/admin/dashboard" || pathname === "/dashboard";
								return pathname === p || pathname.startsWith(p + "/");
							});
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: () => setMobileOpen(false),
								className: `
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] font-medium transition-colors
                  ${isActive ? "bg-[#007A64] text-white shadow-xs font-semibold" : "text-gray-300/80 hover:bg-white/5 hover:text-white"}
                `,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name })]
							}, item.name);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 border-t border-white/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleLogout,
							disabled: loggingOut,
							className: "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] font-medium text-gray-300/80 transition-colors hover:bg-white/5 hover:text-red-400 cursor-pointer disabled:opacity-50",
							children: [loggingOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-gray-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loggingOut ? "Keluar..." : "Keluar Sistem" })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 lg:pl-[218px] flex flex-col min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMobileOpen(true),
							className: "text-gray-600 lg:hidden mr-3 p-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 flex justify-center max-w-xl mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full max-w-[340px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Search Bar (Ctrl+K)",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									className: "w-full rounded-full bg-[#EEF2F6] pl-9 pr-4 py-1.5 text-[10px] text-gray-700 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#007A64]"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "relative p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-6",
					children
				})]
			})
		]
	});
}
//#endregion
export { AppShell as t };

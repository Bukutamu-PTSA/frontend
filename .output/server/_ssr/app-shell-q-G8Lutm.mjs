import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Menu, B as House, D as Network, F as LoaderCircle, P as LogOut, bt as Bell, ct as CircleAlert, ft as ChartNoAxesColumn, g as Settings, lt as ChevronRight, q as FileText, t as X, v as Search } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-q-G8Lutm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var zuan_default = "/assets/zuan-B7L94sx0.jpeg";
var BASE_API_URL = "http://192.168.147.199:8000/api/v1/auth";
var nav = [
	{
		label: "Utama",
		items: [
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
				to: "/admin/kategori_pelayanan",
				icon: Network,
				name: "Pelayanan",
				exactPaths: ["/admin/kategori_pelayanan", "/admin/pelayanan"]
			},
			{
				to: "/admin/reportpengaduan",
				icon: CircleAlert,
				name: "Report Pengaduan",
				exactPaths: ["/admin/reportpengaduan", "/admin/reportpengaduan"]
			},
			{
				to: "/admin/reportsurvei",
				icon: FileText,
				name: "Report Survei",
				exactPaths: ["/admin/reportsurvei", "/admin/survei"]
			}
		]
	},
	{
		label: "Chart & Pie",
		items: [{
			to: "/admin/grafik",
			icon: ChartNoAxesColumn,
			name: "Grafik & Statistik",
			exactPaths: ["/admin/grafik"]
		}]
	},
	{
		label: "Tools",
		items: [{
			to: "/setting",
			icon: Settings,
			name: "Pengaturan",
			exactPaths: ["/setting", "/admin/pengaturan"]
		}]
	}
];
function AppShell({ title = "Dashboard", breadcrumb = "Dashboard", children }) {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [loggingOut, setLoggingOut] = (0, import_react.useState)(false);
	const [menuQuery, setMenuQuery] = (0, import_react.useState)("");
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (item) => item.exactPaths.some((p) => {
		if (p === "/admin" || p === "/admin/dashboard" || p === "/dashboard") return pathname === "/admin" || pathname === "/admin/dashboard" || pathname === "/dashboard";
		return pathname === p || pathname.startsWith(p + "/");
	});
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
	const filteredNav = nav.map((group) => ({
		...group,
		items: group.items.filter((item) => item.name.toLowerCase().includes(menuQuery.trim().toLowerCase()))
	})).filter((group) => group.items.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Tutup menu",
				onClick: () => setMobileOpen(false),
				className: "fixed inset-0 z-30 bg-foreground/50 backdrop-blur-sm lg:hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#0D2B4C] text-sidebar-foreground transition-transform duration-300 lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center gap-3 border-b border-sidebar-border bg-white px-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: kemnaker_logo_default,
									alt: "Logo PTSA Kemnaker",
									className: "h-8 w-8 object-contain"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display text-[13px] font-bold leading-tight text-[#13416B]",
									children: "PTSA KEMNAKER"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[9px] uppercase tracking-wider text-[#333333]/70",
									children: "PELAYANAN TERPADU"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMobileOpen(false),
								className: "ml-auto rounded-lg p-1.5 text-[#333333]/70 hover:bg-black/5 lg:hidden",
								"aria-label": "Tutup",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-600 text-[11px] font-semibold text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: zuan_default,
										alt: "Zuan",
										className: "h-full w-full object-cover",
										onError: (e) => {
											e.target.style.display = "none";
										}
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0D2B4C]" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[12px] font-semibold text-white",
									children: "Zuan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[10px] text-sidebar-foreground/60",
									children: "Petugas Pelayanan"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3.5 flex items-center gap-2 rounded-lg bg-sidebar-accent/40 px-3 py-2 focus-within:ring-2 focus-within:ring-sidebar-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: menuQuery,
								onChange: (e) => setMenuQuery(e.target.value),
								placeholder: "Cari menu…",
								className: "w-full min-w-0 bg-transparent text-[11px] text-sidebar-accent-foreground placeholder:text-sidebar-foreground/40 focus:outline-none"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex-1 space-y-5 overflow-y-auto px-3 pb-6",
						children: [
							filteredNav.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40",
								children: group.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: group.items.map((item) => {
									const active = isActive(item);
									const Icon = item.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										onClick: () => setMobileOpen(false),
										className: cn("group flex items-center gap-3 rounded-sm px-3 py-2 text-[12px] font-medium transition-colors", active ? "bg-[#016A61] text-[#FACC15]" : "text-sidebar-foreground/80 hover:bg-[#016a6168] hover:text-white"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4 shrink-0", active ? "text-[#FACC15]" : "text-sidebar-foreground/60") }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate",
												children: item.name
											}),
											item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "shrink-0 rounded-full bg-sidebar-primary/25 px-2 py-0.5 text-[9px] font-semibold text-sidebar-primary-foreground",
												children: item.badge
											})
										]
									}) }, item.name);
								})
							})] }, group.label)),
							filteredNav.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 text-[11px] text-sidebar-foreground/40",
								children: "Menu tidak ditemukan."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleLogout,
								disabled: loggingOut,
								className: "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/20 hover:text-white disabled:opacity-50",
								children: [loggingOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 shrink-0 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 shrink-0" }), loggingOut ? "Keluar…" : "Logout"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-72",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-14 items-center gap-3 px-4 sm:px-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMobileOpen(true),
									className: "rounded-lg border border-border bg-surface p-1.5 text-muted-foreground shadow-soft lg:hidden",
									"aria-label": "Buka menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "hidden text-[11px] text-muted-foreground sm:block",
										children: [
											"Home ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "inline h-3 w-3" }),
											" ",
											breadcrumb
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "truncate text-[16px] font-semibold leading-tight",
										children: title
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-auto flex shrink-0 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-label": "Notifikasi",
										className: "relative grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-border bg-surface text-muted-foreground shadow-soft transition-colors hover:text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "hidden items-center gap-2 rounded-lg border border-border bg-surface py-1.5 pl-3 pr-16 shadow-soft focus-within:ring-2 focus-within:ring-ring sm:flex",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "search",
											placeholder: "Cari…",
											className: "w-32 min-w-0 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none md:w-56"
										})]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-6 sm:px-6 lg:px-8",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "grid gap-2 border-t border-border px-4 py-5 text-[11px] text-muted-foreground sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"BINWASNAKER © 2024–2026",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-primary",
								children: "TUBSPK."
							}),
							" BINSIS"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bangga Melayani Bangsa · BerAKHLAK" })]
					})
				]
			})
		]
	});
}
//#endregion
export { AppShell as t };

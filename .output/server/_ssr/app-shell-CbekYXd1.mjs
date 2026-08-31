import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChartColumn, O as ChevronRight, _ as MessageSquare, b as House, f as Search, g as Monitor, k as ChartPie, r as Users, t as X, u as Settings, v as Menu, y as LogOut } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-CbekYXd1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var nav = [
	{
		label: "Utama",
		items: [
			{
				to: "/",
				icon: House,
				name: "Beranda",
				match: "/"
			},
			{
				to: "/pengaduan",
				icon: Monitor,
				name: "Report Pengaduan",
				badge: "10",
				match: "/pengaduan"
			},
			{
				to: "/survei",
				icon: Users,
				name: "Report Survei",
				match: "/survei"
			}
		]
	},
	{
		label: "Chart & Pie",
		items: [{
			to: "/",
			icon: ChartColumn,
			name: "Grafik",
			match: null
		}, {
			to: "/",
			icon: ChartPie,
			name: "Pie",
			match: null
		}]
	},
	{
		label: "Tools",
		items: [{
			to: "/chat",
			icon: MessageSquare,
			name: "Chat",
			match: null
		}, {
			to: "/setting",
			icon: Settings,
			name: "Setting",
			badge: "New",
			match: "/setting"
		}]
	}
];
function AppShell({ title, breadcrumb, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Tutup menu",
				onClick: () => setOpen(false),
				className: "fixed inset-0 z-30 bg-foreground/50 backdrop-blur-sm lg:hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex w-72 flex-col text-sidebar-foreground transition-transform duration-300 lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
				style: { backgroundImage: "var(--gradient-sidebar)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-sidebar-border px-5 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-primary-foreground",
								children: "PT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display text-sm font-semibold text-sidebar-accent-foreground",
									children: "PTSA-KEMNAKER"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-sidebar-foreground/60",
									children: "Layanan Pengaduan"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(false),
								className: "ml-auto rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden",
								"aria-label": "Tutup",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-2xl bg-sidebar-accent/60 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-warning/20 text-xs font-semibold text-warning",
								children: "IK"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-sidebar-accent-foreground",
									children: "ikko"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-sidebar-foreground/60",
									children: "Administrator"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 flex items-center gap-2 rounded-xl bg-sidebar-accent/40 px-3 py-2 focus-within:ring-2 focus-within:ring-sidebar-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0 text-sidebar-foreground/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Cari menu…",
								className: "w-full min-w-0 bg-transparent text-sm text-sidebar-accent-foreground placeholder:text-sidebar-foreground/40 focus:outline-none"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex-1 space-y-6 overflow-y-auto px-3 pb-6",
						children: [nav.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40",
							children: group.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: group.items.map((item) => {
								const active = item.match !== null && pathname === item.match;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									onClick: () => setOpen(false),
									className: cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-sidebar-primary/20 text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: cn("h-4 w-4 shrink-0", active ? "text-sidebar-primary" : "text-sidebar-foreground/60") }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 truncate",
											children: item.name
										}),
										item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 rounded-full bg-sidebar-primary/25 px-2 py-0.5 text-[10px] font-semibold text-sidebar-primary-foreground",
											children: item.badge
										})
									]
								}) }, item.name);
							})
						})] }, group.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-destructive/20 hover:text-sidebar-accent-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 shrink-0" }), "Logout"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-72",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setOpen(true),
									className: "rounded-xl border border-border bg-surface p-2 text-muted-foreground shadow-soft lg:hidden",
									"aria-label": "Buka menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "hidden text-xs text-muted-foreground sm:block",
										children: [
											"Home ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "inline h-3 w-3" }),
											" ",
											breadcrumb
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "truncate text-lg font-semibold sm:text-xl",
										children: title
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "hidden rounded-xl border border-border bg-surface p-2 text-muted-foreground shadow-soft transition-colors hover:text-primary sm:block",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-xl bg-accent px-3 py-2 text-xs font-medium text-accent-foreground",
										children: "v1.0.0"
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
						className: "grid gap-2 border-t border-border px-4 py-6 text-xs text-muted-foreground sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"BINWASNAKER © 2024–2026 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-primary",
								children: "TUBSPK."
							}),
							" ",
							"BINSIS"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bangga Melayani Bangsa · BerAKHLAK" })]
					})
				]
			})
		]
	});
}
//#endregion
export { cn as n, AppShell as t };

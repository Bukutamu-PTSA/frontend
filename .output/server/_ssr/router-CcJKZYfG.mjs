import { n as __exportAll, r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CcJKZYfG.js
var router_CcJKZYfG_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C0ypxMRs.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$10 = () => import("./routes-2hjgoRdG.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Sistem Pengaduan Tenaga Kerja | Kemnaker RI" },
		{
			name: "description",
			content: "Portal resmi pelaporan pelanggaran norma kerja, perselisihan hubungan industrial, dan masalah ketenagakerjaan secara aman dan terpantau."
		},
		{
			property: "og:title",
			content: "Sistem Pengaduan Tenaga Kerja | Kemnaker RI"
		},
		{
			property: "og:description",
			content: "Laporkan masalah ketenagakerjaan Anda melalui portal resmi. Data pelapor dijaga kerahasiaannya."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./bukti_pendukung-CbeDgIIP.mjs");
var Route$9 = createFileRoute("/bukti_pendukung")({
	head: () => ({ meta: [{ title: "Detail Aduan & Bukti Pendukung | Kemnaker RI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./chat-BP9Vn5Up.mjs");
var Route$8 = createFileRoute("/chat")({
	head: () => ({ meta: [
		{ title: "Chat Layanan — PTSA-KEMNAKER" },
		{
			name: "description",
			content: "Ruangan percakapan layanan pengaduan ketenagakerjaan."
		},
		{
			property: "og:title",
			content: "Chat Layanan — PTSA-KEMNAKER"
		},
		{
			property: "og:description",
			content: "Ruangan percakapan layanan pengaduan ketenagakerjaan."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./login-aXks2EyW.mjs");
var Route$7 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./pengaduan-Sqp5L18k.mjs");
var Route$6 = createFileRoute("/pengaduan")({
	head: () => ({ meta: [{ title: "Formulir Pengaduan | Kemnaker RI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./setting-BsrOPf_E.mjs");
var Route$5 = createFileRoute("/setting")({
	head: () => ({ meta: [
		{ title: "Setting Apps · PTSA-KEMNAKER" },
		{
			name: "description",
			content: "Pusat pengaturan aplikasi layanan pengaduan: halaman beranda, data survei, userlogin, QR, dan master pengaduan."
		},
		{
			property: "og:title",
			content: "Setting Apps · PTSA-KEMNAKER"
		},
		{
			property: "og:description",
			content: "Kelola konfigurasi aplikasi layanan pengaduan ketenagakerjaan."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./survei-BatUNwgt.mjs");
var Route$4 = createFileRoute("/survei")({
	head: () => ({ meta: [{ title: "Form Survei Layanan PTSA | Kemnaker RI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dashboard-p42OVmMg.mjs");
var Route$3 = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [{ title: "Executive Dashboard - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./kategori_pelayanan-DC8Wp0Zj.mjs");
var Route$2 = createFileRoute("/admin/kategori_pelayanan")({
	head: () => ({ meta: [{ title: "Rekapitulasi Layanan Kategori - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./reportpengaduan-Cb3NAqqq.mjs");
var Route$1 = createFileRoute("/admin/reportpengaduan")({
	head: () => ({ meta: [{ title: "All Report Pengaduan - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./wilayah-Q-rDP3Zj.mjs");
var Route = createFileRoute("/admin/wilayah")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	Bukti_pendukungRoute: Route$9.update({
		id: "/bukti_pendukung",
		path: "/bukti_pendukung",
		getParentRoute: () => Route$11
	}),
	ChatRoute: Route$8.update({
		id: "/chat",
		path: "/chat",
		getParentRoute: () => Route$11
	}),
	LoginRoute: Route$7.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$11
	}),
	PengaduanRoute: Route$6.update({
		id: "/pengaduan",
		path: "/pengaduan",
		getParentRoute: () => Route$11
	}),
	SettingRoute: Route$5.update({
		id: "/setting",
		path: "/setting",
		getParentRoute: () => Route$11
	}),
	SurveiRoute: Route$4.update({
		id: "/survei",
		path: "/survei",
		getParentRoute: () => Route$11
	}),
	AdminDashboardRoute: Route$3.update({
		id: "/admin/dashboard",
		path: "/admin/dashboard",
		getParentRoute: () => Route$11
	}),
	AdminKategori_pelayananRoute: Route$2.update({
		id: "/admin/kategori_pelayanan",
		path: "/admin/kategori_pelayanan",
		getParentRoute: () => Route$11
	}),
	AdminReportpengaduanRoute: Route$1.update({
		id: "/admin/reportpengaduan",
		path: "/admin/reportpengaduan",
		getParentRoute: () => Route$11
	}),
	AdminWilayahRoute: Route.update({
		id: "/admin/wilayah",
		path: "/admin/wilayah",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter, router_CcJKZYfG_exports as t };

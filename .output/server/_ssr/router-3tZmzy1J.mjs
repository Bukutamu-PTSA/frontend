import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-3tZmzy1J.js
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-CVb5aLu8.css";
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
var Route$26 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PTSA KEMNAKER" },
			{
				name: "description",
				content: "Pelayanan Terpadu Satu Atap - Kemnaker"
			},
			{
				name: "author",
				content: "PTSA KEMNAKER"
			},
			{
				property: "og:title",
				content: "PTSA KEMNAKER"
			},
			{
				property: "og:description",
				content: "Pelayanan Terpadu Satu Atap - Kemnaker"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
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
	const { queryClient } = Route$26.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$25 = () => import("./routes-QVG0eMXu.mjs");
var Route$25 = createFileRoute("/")({
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
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./bukti_pendukung-CfMy0jOQ.mjs");
var Route$24 = createFileRoute("/bukti_pendukung")({
	head: () => ({ meta: [{ title: "Detail Aduan & Bukti Pendukung - Kementerian Ketenagakerjaan" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./chat-DRrv2QJm.mjs");
var Route$23 = createFileRoute("/chat")({
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
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./login-BDCHLxCE.mjs");
var Route$22 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./pengaduan-8D88AbKr.mjs");
var Route$21 = createFileRoute("/pengaduan")({
	head: () => ({ meta: [{ title: "Formulir Pengaduan - Kementerian Ketenagakerjaan" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./survei-ByoOENVe.mjs");
var Route$20 = createFileRoute("/survei")({
	head: () => ({ meta: [{ title: "Form Survei Layanan PTSA | Kemnaker RI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./dashboard-_StPMeQB.mjs");
var Route$19 = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [{ title: "Executive Dashboard - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
/** Label indeks kepuasan berdasarkan skor skala 1-5. */
var $$splitComponentImporter$18 = () => import("./data_skala-CQv1y1S6.mjs");
var Route$18 = createFileRoute("/admin/data_skala")({
	head: () => ({ meta: [{ title: "Data Skala Parameter Perusahaan · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./data_survei-B1H7EmbV.mjs");
var Route$17 = createFileRoute("/admin/data_survei")({
	head: () => ({ meta: [{ title: "Data Survei Pelayanan · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./data_visitor-EGtg3KAk.mjs");
var Route$16 = createFileRoute("/admin/data_visitor")({
	head: () => ({ meta: [{ title: "Data Visitor · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./detail_berkas-Dsnyq1Gy.mjs");
var Route$15 = createFileRoute("/admin/detail_berkas")({
	validateSearch: (search) => {
		return { id: search["id"] ? String(search["id"]) : "" };
	},
	head: () => ({ meta: [{ title: "Report Pelayanan - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./detail_kategori_pelayanan-BMlCq9QQ.mjs");
var Route$14 = createFileRoute("/admin/detail_kategori_pelayanan")({
	validateSearch: (search) => {
		return { id: search["id"] ? Number(search["id"]) : 1 };
	},
	head: () => ({ meta: [{ title: "Report Pengaduan Kategori - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./edit_skala-CCGMZvhM.mjs");
var Route$13 = createFileRoute("/admin/edit_skala")({
	validateSearch: (search) => ({ id: search["id"] ? Number(search["id"]) : void 0 }),
	head: () => ({ meta: [{ title: "Edit Skala Perusahaan · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./edit_survei-fbNiiAiL.mjs");
var Route$12 = createFileRoute("/admin/edit_survei")({
	validateSearch: (search) => ({ id: search["id"] ? Number(search["id"]) : void 0 }),
	head: () => ({ meta: [{ title: "Edit Data Survei · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./edit_user-D1nLDbhM.mjs");
var Route$11 = createFileRoute("/admin/edit_user")({
	validateSearch: (search) => ({ id: search["id"] ? Number(search["id"]) : void 0 }),
	head: () => ({ meta: [{ title: "Edit User · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
/** Petakan role lama (Pelapor/Pengawas/Petugas/Administrator) ke role baru. */
var $$splitComponentImporter$10 = () => import("./grafik-DBVdtEjd.mjs");
var Route$10 = createFileRoute("/admin/grafik")({
	head: () => ({ meta: [{ title: "Grafik & Statistik Overview - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
/** Label indeks kepuasan berdasarkan skor 1-5. */
var $$splitComponentImporter$9 = () => import("./jenis_pengaduan-T4yvaBO3.mjs");
var Route$9 = createFileRoute("/admin/jenis_pengaduan")({
	head: () => ({ meta: [{ title: "Jenis Pengaduan · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./kategori_pelayanan-DuZfg89Z.mjs");
var Route$8 = createFileRoute("/admin/kategori_pelayanan")({
	head: () => ({ meta: [{ title: "Rekapitulasi Layanan Kategori - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./manajemen_user-DG1lsV_a.mjs");
var Route$7 = createFileRoute("/admin/manajemen_user")({
	head: () => ({ meta: [{ title: "Manajemen User · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./notifications-B5-99DDi.mjs");
var Route$6 = createFileRoute("/admin/notifications")({
	head: () => ({ meta: [{ title: "Pusat Notifikasi - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./reportpengaduan-DGTqzoBe.mjs");
var Route$5 = createFileRoute("/admin/reportpengaduan")({
	head: () => ({ meta: [{ title: "All Report Pengaduan - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./reportsurvei-BLEnljdT.mjs");
var Route$4 = createFileRoute("/admin/reportsurvei")({
	head: () => ({ meta: [{ title: "Report Survei Pelayanan - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/** Ambil jawaban dari objek answers sebuah submission (key angka maupun string). */
/**
* Normalisasi data respons survei menjadi satu baris per responden.
*
* Bentuk utama (API saat ini): payload.data = { questions, submissions[] }.
* Tiap submission sudah mewakili 1 responden dengan objek `answers` yang
* memetakan nomor pertanyaan ke jawaban (Q1 Nama Petugas, Q2 Komunikasi,
* Q3 Penjelasan Materi, Q4 Sarana & Prasarana, Q5 Catatan).
*
* Bentuk lama/fallback:
* - baris jawaban per-pertanyaan { id, survey_date, question_number, answer },
*   digrouping memakai heuristik id berurutan (tiap grup = 1 responden);
* - responden flat { nama_petugas, komunikasi_petugas, ... }.
*/
/**
* Kategorikan jawaban likert (Baik/Cukup/Kurang) menjadi label. Baris tanpa
* jawaban likert (mis. Q1 Nama Petugas / Q5 Catatan) dikembalikan null.
*/
/** Nilai satu sel tabel untuk sebuah kolom responden. */
/** Baris detail sederhana di dalam modal. */
var $$splitComponentImporter$3 = () => import("./setting-CvmfCeoC.mjs");
var Route$3 = createFileRoute("/admin/setting")({
	head: () => ({ meta: [{ title: "Setting Apps - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./tambah_user-B3SSr13N.mjs");
var Route$2 = createFileRoute("/admin/tambah_user")({
	head: () => ({ meta: [{ title: "Tambah User Baru · PTSA-KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./view_pdf-BFr4cK1Y.mjs");
var Route$1 = createFileRoute("/admin/view_pdf")({
	validateSearch: (search) => {
		return { id: search["id"] ? String(search["id"]) : "" };
	},
	head: () => ({ meta: [{ title: "Cetak Dokumen Pengaduan - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./wilayah-C9q6ZKcf.mjs");
var Route = createFileRoute("/admin/wilayah")({
	head: () => ({ meta: [{ title: "Data Provinsi - PTSA KEMNAKER" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$25.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$26
	}),
	Bukti_pendukungRoute: Route$24.update({
		id: "/bukti_pendukung",
		path: "/bukti_pendukung",
		getParentRoute: () => Route$26
	}),
	ChatRoute: Route$23.update({
		id: "/chat",
		path: "/chat",
		getParentRoute: () => Route$26
	}),
	LoginRoute: Route$22.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$26
	}),
	PengaduanRoute: Route$21.update({
		id: "/pengaduan",
		path: "/pengaduan",
		getParentRoute: () => Route$26
	}),
	SurveiRoute: Route$20.update({
		id: "/survei",
		path: "/survei",
		getParentRoute: () => Route$26
	}),
	AdminDashboardRoute: Route$19.update({
		id: "/admin/dashboard",
		path: "/admin/dashboard",
		getParentRoute: () => Route$26
	}),
	AdminData_skalaRoute: Route$18.update({
		id: "/admin/data_skala",
		path: "/admin/data_skala",
		getParentRoute: () => Route$26
	}),
	AdminData_surveiRoute: Route$17.update({
		id: "/admin/data_survei",
		path: "/admin/data_survei",
		getParentRoute: () => Route$26
	}),
	AdminData_visitorRoute: Route$16.update({
		id: "/admin/data_visitor",
		path: "/admin/data_visitor",
		getParentRoute: () => Route$26
	}),
	AdminDetail_berkasRoute: Route$15.update({
		id: "/admin/detail_berkas",
		path: "/admin/detail_berkas",
		getParentRoute: () => Route$26
	}),
	AdminDetail_kategori_pelayananRoute: Route$14.update({
		id: "/admin/detail_kategori_pelayanan",
		path: "/admin/detail_kategori_pelayanan",
		getParentRoute: () => Route$26
	}),
	AdminEdit_skalaRoute: Route$13.update({
		id: "/admin/edit_skala",
		path: "/admin/edit_skala",
		getParentRoute: () => Route$26
	}),
	AdminEdit_surveiRoute: Route$12.update({
		id: "/admin/edit_survei",
		path: "/admin/edit_survei",
		getParentRoute: () => Route$26
	}),
	AdminEdit_userRoute: Route$11.update({
		id: "/admin/edit_user",
		path: "/admin/edit_user",
		getParentRoute: () => Route$26
	}),
	AdminGrafikRoute: Route$10.update({
		id: "/admin/grafik",
		path: "/admin/grafik",
		getParentRoute: () => Route$26
	}),
	AdminJenis_pengaduanRoute: Route$9.update({
		id: "/admin/jenis_pengaduan",
		path: "/admin/jenis_pengaduan",
		getParentRoute: () => Route$26
	}),
	AdminKategori_pelayananRoute: Route$8.update({
		id: "/admin/kategori_pelayanan",
		path: "/admin/kategori_pelayanan",
		getParentRoute: () => Route$26
	}),
	AdminManajemen_userRoute: Route$7.update({
		id: "/admin/manajemen_user",
		path: "/admin/manajemen_user",
		getParentRoute: () => Route$26
	}),
	AdminNotificationsRoute: Route$6.update({
		id: "/admin/notifications",
		path: "/admin/notifications",
		getParentRoute: () => Route$26
	}),
	AdminReportpengaduanRoute: Route$5.update({
		id: "/admin/reportpengaduan",
		path: "/admin/reportpengaduan",
		getParentRoute: () => Route$26
	}),
	AdminReportsurveiRoute: Route$4.update({
		id: "/admin/reportsurvei",
		path: "/admin/reportsurvei",
		getParentRoute: () => Route$26
	}),
	AdminSettingRoute: Route$3.update({
		id: "/admin/setting",
		path: "/admin/setting",
		getParentRoute: () => Route$26
	}),
	AdminTambah_userRoute: Route$2.update({
		id: "/admin/tambah_user",
		path: "/admin/tambah_user",
		getParentRoute: () => Route$26
	}),
	AdminView_pdfRoute: Route$1.update({
		id: "/admin/view_pdf",
		path: "/admin/view_pdf",
		getParentRoute: () => Route$26
	}),
	AdminWilayahRoute: Route.update({
		id: "/admin/wilayah",
		path: "/admin/wilayah",
		getParentRoute: () => Route$26
	})
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
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
export { Route$13 as a, Route$12 as i, Route$1 as n, Route$14 as o, Route$11 as r, Route$15 as s, router_exports as t };

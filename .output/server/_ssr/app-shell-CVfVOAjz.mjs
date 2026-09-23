import { i as __toESM } from "../_runtime.mjs";
import { a as storageUrl, i as authHeaders, n as AUTH_BASE_URL, r as apiUrl } from "./api-BipEh2FU.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Network, H as FileText, N as LogOut, P as LoaderCircle, R as House, ft as Bell, k as Menu, m as Settings, nt as CircleAlert, rt as ChevronRight, st as ChartNoAxesColumn, t as X } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-CVfVOAjz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Lapisan data notifikasi.
*
* Backend belum menyediakan endpoint notifikasi khusus, jadi notifikasi
* diturunkan dari data pengaduan (GET /api/complaints) yang sudah ada:
* setiap aduan baru direpresentasikan sebagai satu notifikasi "Aduan Baru".
*
* Status dibaca/diabaikan disimpan lokal (localStorage) sehingga tetap
* bertahan antar sesi.
*/
var READ_IDS_KEY = "ptsa_notif_read_ids";
var DISMISSED_IDS_KEY = "ptsa_notif_dismissed_ids";
function readIds() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(READ_IDS_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.map(String) : [];
	} catch {
		return [];
	}
}
function parseIdList(value) {
	try {
		const parsed = value ? JSON.parse(value) : [];
		return Array.isArray(parsed) ? parsed.map(String) : [];
	} catch {
		return [];
	}
}
function saveIds(key, ids) {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(ids));
}
function isNotifRead(id) {
	return readIds().includes(String(id));
}
function markNotifRead(ids) {
	const next = new Set(readIds());
	ids.forEach((id) => next.add(String(id)));
	saveIds(READ_IDS_KEY, [...next]);
}
function markAllNotifRead(list) {
	markNotifRead(list.map((n) => n.id));
}
function dismissNotif(ids) {
	const next = new Set(parseIdList(localStorage.getItem(DISMISSED_IDS_KEY)));
	ids.forEach((id) => next.add(String(id)));
	saveIds(DISMISSED_IDS_KEY, [...next]);
}
function isNotifDismissed(id) {
	if (typeof window === "undefined") return false;
	return parseIdList(localStorage.getItem(DISMISSED_IDS_KEY)).includes(String(id));
}
/** Ambil daftar JSON apa pun bentuknya (Laravel paginate / raw array / wrapper). */
function extractList(json) {
	const obj = json;
	if (Array.isArray(json)) return json;
	if (!obj) return [];
	if (Array.isArray(obj["data"])) return obj["data"];
	if (Array.isArray(obj["notifications"])) return obj["notifications"];
	const nested = obj["data"];
	if (nested && Array.isArray(nested["data"])) return nested["data"];
	return [];
}
/** Parser tanggal tangguh: ISO, "YYYY-MM-DD", atau "DD/MM/YYYY". */
function parseDate(value) {
	const s = String(value ?? "").trim();
	if (!s) return null;
	const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
	if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), Number(iso[4]), Number(iso[5]), iso[6] ? Number(iso[6]) : 0);
	const dateOnly = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (dateOnly) return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
	const dmy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
	const parsed = new Date(s);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}
/** Waktu relatif berbahasa Indonesia. */
function timeAgo(value) {
	const date = parseDate(value ?? "");
	if (!date) return "Baru saja";
	const diffMs = Date.now() - date.getTime();
	if (diffMs < 0) return "Baru saja";
	const minutes = Math.floor(diffMs / 6e4);
	if (minutes < 1) return "Baru saja";
	if (minutes < 60) return `${minutes} menit yang lalu`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} jam yang lalu`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} hari yang lalu`;
	if (days < 30) return `${Math.floor(days / 7)} minggu yang lalu`;
	if (days < 365) return `${Math.floor(days / 30)} bulan yang lalu`;
	return `${Math.floor(days / 365)} tahun yang lalu`;
}
function toNotification(raw) {
	const id = String(raw?.id ?? raw?.ticket_number ?? Math.random().toString(36).slice(2));
	const complainant = raw?.complainant ?? {};
	const company = raw?.company ?? {};
	const category = raw?.category ?? {};
	const complainantName = String(complainant["nama_lengkap"] ?? complainant["nama"] ?? raw["nama_pelapor"] ?? "Pengunjung");
	const companyName = String(company["nama_perusahaan"] ?? raw["nama_perusahaan"] ?? "");
	const categoryName = String(category["category_name"] ?? category["category_code"] ?? category["code"] ?? raw["jenis_pengaduan"] ?? "Laporan");
	const dateStr = String(raw?.created_at ?? raw?.complaint_date ?? "");
	return {
		id,
		title: "Aduan Baru",
		description: companyName ? `Terdapat laporan baru dari ${complainantName} (${companyName}) yang perlu ditinjau.` : `Terdapat laporan baru dari ${complainantName} yang perlu ditinjau.`,
		ticket: String(raw?.ticket_number ?? "-"),
		category: categoryName,
		time: timeAgo(dateStr),
		createdAt: dateStr,
		read: isNotifRead(id),
		dismissed: isNotifDismissed(id)
	};
}
/**
* Ambil notifikasi terbaru dari data pengaduan, terurut paling baru duluan.
* @throws Error bila fetch gagal.
*/
async function fetchNotifications(limit = 50) {
	const res = await fetch(`${apiUrl("complaints")}?per_page=${limit}`, { headers: authHeaders() });
	if (!res.ok) throw new Error(`Gagal memuat notifikasi (${res.status}).`);
	return extractList(await res.json()).filter((it) => it && typeof it === "object").map((it) => toNotification(it)).sort((a, b) => {
		const ta = parseDate(a.createdAt)?.getTime() ?? 0;
		return (parseDate(b.createdAt)?.getTime() ?? 0) - ta;
	});
}
/** Ambil & normalisasi user login dari localStorage/sessionStorage. */
function readAuthUser() {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
	if (!raw) return null;
	try {
		const u = JSON.parse(raw);
		const name = String(u.name ?? u.nama ?? u.nama_lengkap ?? u.username ?? u.email ?? "Pengguna");
		const role = String(u.role_name ?? u.role ?? u.jabatan ?? u.position ?? (typeof u.role === "object" ? u.role?.name : "") ?? "Petugas");
		const rawAvatar = String(u.avatar ?? u.photo ?? u.foto ?? u.image ?? "");
		return {
			name,
			role,
			avatar: rawAvatar ? /^https?:\/\//.test(rawAvatar) ? rawAvatar : storageUrl(rawAvatar) : ""
		};
	} catch {
		return null;
	}
}
/** Inisial dari nama untuk fallback avatar (mis. "Budi Santoso" -> "BS"). */
function getInitials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	const first = parts[0];
	if (!first) return "?";
	if (parts.length === 1) return first.slice(0, 2).toUpperCase();
	const last = parts[parts.length - 1] ?? first;
	return ((first[0] ?? "") + (last[0] ?? "")).toUpperCase();
}
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
			to: "/admin/setting",
			icon: Settings,
			name: "Pengaturan",
			exactPaths: ["/admin/setting", "/admin/pengaturan"]
		}]
	}
];
function AppShell({ title = "Dashboard", breadcrumb = "Dashboard", children }) {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [loggingOut, setLoggingOut] = (0, import_react.useState)(false);
	const [authUser, setAuthUser] = (0, import_react.useState)(null);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [unreadNotifications, setUnreadNotifications] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setAuthUser(readAuthUser());
	}, []);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const loadUnread = async () => {
			try {
				const items = await fetchNotifications(20);
				if (alive) setUnreadNotifications(items.filter((n) => !n.read && !n.dismissed).length);
			} catch {
				if (alive) setUnreadNotifications(0);
			}
		};
		loadUnread();
		return () => {
			alive = false;
		};
	}, [pathname]);
	const displayName = authUser?.name ?? "Pengguna";
	const displayRole = authUser?.role ?? "Petugas";
	const avatarUrl = authUser?.avatar ?? "";
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
				await fetch(`${AUTH_BASE_URL}/logout`, {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-600 text-[11px] font-semibold text-white",
									children: avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: avatarUrl,
										alt: displayName,
										className: "h-full w-full object-cover",
										onError: (e) => {
											e.currentTarget.style.display = "none";
										}
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getInitials(displayName) })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0D2B4C]" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[12px] font-semibold text-white",
									children: displayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[10px] text-sidebar-foreground/60",
									children: displayRole
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex-1 space-y-5 overflow-y-auto px-3 pb-6",
						children: [nav.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
						})] }, group.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleLogout,
							disabled: loggingOut,
							className: "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/20 hover:text-white disabled:opacity-50",
							children: [loggingOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 shrink-0 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 shrink-0" }), loggingOut ? "Keluar…" : "Logout"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col lg:pl-72",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ml-auto flex shrink-0 items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/admin/notifications",
										"aria-label": "Notifikasi",
										className: "relative grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-border bg-surface text-muted-foreground shadow-soft transition-colors hover:text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unreadNotifications > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white",
											children: unreadNotifications > 9 ? "9+" : unreadNotifications
										})]
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 px-4 py-6 sm:px-6 lg:px-8",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "grid gap-2 border-t border-border px-4 py-5 text-[11px] text-muted-foreground sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8",
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
export { markNotifRead as a, markAllNotifRead as i, dismissNotif as n, fetchNotifications as r, AppShell as t };

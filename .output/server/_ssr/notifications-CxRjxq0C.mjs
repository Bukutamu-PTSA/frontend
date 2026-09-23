import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as LoaderCircle, ct as CheckCheck, g as Search, ht as BellOff, rt as CircleAlert, s as TriangleAlert, t as X, y as RefreshCw } from "../_libs/lucide-react.mjs";
import { a as markNotifRead, i as markAllNotifRead, n as dismissNotif, r as fetchNotifications, t as AppShell } from "./app-shell-DcmoFzPa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-CxRjxq0C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const navigate = useNavigate();
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("semua");
	const [search, setSearch] = (0, import_react.useState)("");
	const [openActions, setOpenActions] = (0, import_react.useState)(null);
	const load = async () => {
		setLoading(true);
		setLoadError(null);
		try {
			const items = await fetchNotifications(50);
			setNotifications(items);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Gagal memuat notifikasi.";
			console.error("Gagal mengambil notifikasi:", err);
			setLoadError(message);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const visible = (0, import_react.useMemo)(() => {
		let list = notifications.filter((n) => !n.dismissed);
		if (tab === "belum") list = list.filter((n) => !n.read);
		const q = search.trim().toLowerCase();
		if (q) list = list.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.ticket.toLowerCase().includes(q) || n.category.toLowerCase().includes(q));
		return list;
	}, [
		notifications,
		tab,
		search
	]);
	const unreadCount = (0, import_react.useMemo)(() => notifications.filter((n) => !n.read && !n.dismissed).length, [notifications]);
	const activeCount = (0, import_react.useMemo)(() => notifications.filter((n) => !n.dismissed).length, [notifications]);
	const handleOpen = (item) => {
		if (!item.read) {
			markNotifRead([item.id]);
			setNotifications((prev) => prev.map((n) => String(n.id) === String(item.id) ? {
				...n,
				read: true
			} : n));
		}
		navigate({
			to: "/admin/detail_berkas",
			search: { id: String(item.id) }
		});
	};
	const handleMarkAllRead = () => {
		const unread = notifications.filter((n) => !n.read && !n.dismissed);
		if (unread.length === 0) return;
		markAllNotifRead(unread);
		setNotifications((prev) => prev.map((n) => ({
			...n,
			read: true
		})));
	};
	const handleDismiss = (item) => {
		dismissNotif([item.id]);
		setOpenActions(null);
		setNotifications((prev) => prev.map((n) => String(n.id) === String(item.id) ? {
			...n,
			dismissed: true
		} : n));
	};
	const handleDismissAll = () => {
		if (visible.length === 0) return;
		if (!window.confirm(`Hapus ${visible.length} notifikasi di daftar ini?`)) return;
		dismissNotif(visible.map((n) => n.id));
		setOpenActions(null);
		setNotifications((prev) => prev.map((n) => visible.some((v) => String(v.id) === String(n.id)) ? {
			...n,
			dismissed: true
		} : n));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Notifications",
		breadcrumb: "Notifikasi",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[16px] font-bold tracking-tight text-gray-800",
							children: "Pusat Notifikasi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[12px] text-gray-500",
							children: unreadCount > 0 ? `Anda memiliki ${unreadCount} laporan baru yang belum ditinjau.` : "Tidak ada laporan baru. Semua sudah ditinjau."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: load,
								disabled: loading,
								className: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[11px] font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-50",
								children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Muat Ulang" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleMarkAllRead,
								disabled: unreadCount === 0,
								className: "inline-flex items-center justify-center gap-2 rounded-lg bg-[#016A61] px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-[#015850] disabled:cursor-not-allowed disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tandai Semua Dibaca" })]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab("semua"),
							className: `rounded-md px-4 py-1.5 text-[11px] font-semibold transition-colors ${tab === "semua" ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"}`,
							children: [
								"Semua (",
								activeCount,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab("belum"),
							className: `rounded-md px-4 py-1.5 text-[11px] font-semibold transition-colors ${tab === "belum" ? "bg-[#016A61] text-white" : "text-gray-600 hover:bg-gray-100"}`,
							children: [
								"Belum Dibaca (",
								unreadCount,
								")"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 shadow-xs sm:w-72",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 shrink-0 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Cari notifikasi…",
							className: "w-full min-w-0 bg-transparent text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
						})]
					})]
				}),
				loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-[11px] text-red-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Gagal mengambil data dari server: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: loadError
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: load,
						disabled: loading,
						className: "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50",
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), "Coba Lagi"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-100 bg-white p-14 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-5 w-5 animate-spin text-gray-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[12px] text-gray-400",
							children: "Memuat notifikasi…"
						})]
					}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-100 bg-white p-14 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "mx-auto h-6 w-6 text-gray-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[12px] text-gray-400",
							children: notifications.length === 0 ? "Belum ada notifikasi." : tab === "belum" ? "Tidak ada notifikasi yang belum dibaca." : "Tidak ada notifikasi yang cocok dengan pencarian."
						})]
					}) : visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `relative flex items-start gap-3.5 rounded-xl border bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all hover:shadow-md ${item.read ? "border-gray-100" : "border-[#016A6118] ring-1 ring-[#016A6122]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleOpen(item),
							className: "flex flex-1 items-start gap-3.5 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-9 w-9 shrink-0 place-items-center rounded-full ${item.read ? "bg-gray-50 text-gray-400" : "bg-red-50 text-red-500"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4.5 w-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: `text-[13px] ${item.read ? "font-semibold text-gray-600" : "font-bold text-gray-800"}`,
												children: item.title
											}), !item.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 shrink-0 rounded-full bg-red-500" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 whitespace-nowrap text-[10px] text-gray-400",
											children: item.time
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `mt-1 block text-[11px] leading-relaxed ${item.read ? "text-gray-400" : "text-gray-500"}`,
										children: item.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-3 flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-md bg-[#EEF2F6] px-2.5 py-1 text-[10px] font-medium text-gray-600",
											children: ["No. Tiket: ", item.ticket]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-md bg-[#EEF2F6] px-2.5 py-1 text-[10px] font-medium text-gray-600",
											children: ["Kategori: ", item.category]
										})]
									})
								]
							})]
						}), openActions === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-3 top-12 z-10 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleDismiss(item),
								className: "rounded-md px-3 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-50",
								children: "Hapus"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setOpenActions(null),
								className: "rounded-md px-3 py-1.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-50",
								children: "Batal"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Aksi notifikasi",
							onClick: () => setOpenActions((cur) => cur === item.id ? null : item.id),
							className: "grid h-6 w-6 shrink-0 place-items-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})]
					}, item.id))
				}),
				!loading && visible.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleDismissAll,
						className: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-[11px] font-semibold text-gray-600 shadow-xs transition-colors hover:bg-gray-50",
						children: "Hapus Semua di List Ini"
					})
				})
			]
		})
	});
}
//#endregion
export { NotificationsPage as component };

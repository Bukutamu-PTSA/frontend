import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as FileText, D as Download, S as Funnel, T as Eye, f as Search, m as Pencil, o as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CbekYXd1.mjs";
import { n as pengaduanWlkp } from "./dashboard-data-B7ZWMbxL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pengaduan-B5HyQEE4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusTone = {
	Baru: "bg-info/15 text-info",
	Proses: "bg-warning/20 text-warning",
	Selesai: "bg-success/15 text-success"
};
function PengaduanPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const s = q.toLowerCase().trim();
		if (!s) return pengaduanWlkp;
		return pengaduanWlkp.filter((r) => [
			r.pelapor,
			r.perusahaan,
			r.provinsi,
			r.desk
		].join(" ").toLowerCase().includes(s));
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Report Pengaduan WLKP",
		breadcrumb: "Report Pengaduan",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 border-b border-border px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate text-base font-semibold",
							children: "Report Pelayanan Pengaduan WLKP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								"Menampilkan ",
								rows.length,
								" dari 5.322 entri"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [[
							"Copy",
							"CSV",
							"Excel",
							"PDF"
						].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), a]
						}, a)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), "Filter"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40 sm:max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Cari pelapor, perusahaan, provinsi…",
							className: "w-full min-w-0 bg-transparent text-sm focus:outline-none"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3 px-4 pb-5 lg:hidden",
					children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: r.perusahaan
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusTone[r.status]}`,
									children: r.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									r.pelapor,
									" · ",
									r.provinsi
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-foreground/80",
								children: r.desk
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: r.tanggal
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButtons, {})]
							})
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden overflow-x-auto lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[900px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Tanggal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Pelapor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Perusahaan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Provinsi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Deskripsi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right font-semibold",
									children: "Tools"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border align-top hover:bg-secondary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "whitespace-nowrap px-5 py-4 text-muted-foreground",
									children: r.tanggal
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 font-medium",
									children: r.pelapor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: r.perusahaan
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 text-muted-foreground",
									children: r.provinsi
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "max-w-xs px-5 py-4 text-muted-foreground",
									children: r.desk
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[r.status]}`,
										children: r.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButtons, {})
									})
								})
							]
						}, i)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 border-t border-border px-5 py-4 sm:flex sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Halaman 1 dari 533"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-1",
						children: [
							"Prev",
							"1",
							"2",
							"3",
							"4",
							"…",
							"533",
							"Next"
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${p === "1" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`,
							children: p
						}, p))
					})]
				})
			]
		})
	});
}
function ToolButtons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex shrink-0 items-center gap-1",
		children: [
			{
				icon: FileText,
				tone: "text-info hover:bg-info/10",
				label: "Berkas"
			},
			{
				icon: Pencil,
				tone: "text-primary hover:bg-primary/10",
				label: "Ubah"
			},
			{
				icon: Eye,
				tone: "text-success hover:bg-success/10",
				label: "Lihat"
			},
			{
				icon: Trash2,
				tone: "text-destructive hover:bg-destructive/10",
				label: "Hapus"
			}
		].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": t.label,
			className: `rounded-lg border border-border p-2 transition-colors ${t.tone}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-3.5 w-3.5" })
		}, t.label))
	});
}
//#endregion
export { PengaduanPage as component };

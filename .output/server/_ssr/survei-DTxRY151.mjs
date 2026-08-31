import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Download, S as Funnel, T as Eye, c as ThumbsDown, f as Search, l as Star, s as ThumbsUp } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CbekYXd1.mjs";
import { a as surveiResponden, o as surveiRingkasan } from "./dashboard-data-B7ZWMbxL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/survei-DTxRY151.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nilaiTone = {
	Baik: "bg-success/15 text-success",
	Cukup: "bg-warning/20 text-warning",
	Kurang: "bg-destructive/15 text-destructive"
};
var cardTone = {
	Baik: {
		bar: "bg-success",
		icon: ThumbsUp,
		text: "text-success"
	},
	Cukup: {
		bar: "bg-warning",
		icon: Star,
		text: "text-warning"
	},
	Kurang: {
		bar: "bg-destructive",
		icon: ThumbsDown,
		text: "text-destructive"
	}
};
function SurveiPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("Semua");
	const rows = (0, import_react.useMemo)(() => {
		const s = q.toLowerCase().trim();
		return surveiResponden.filter((r) => {
			const cocokFilter = filter === "Semua" || r.komunikasi === filter || r.substansi === filter || r.sarana === filter;
			const cocokCari = !s || [
				r.responden,
				r.keterangan,
				r.tanggal
			].join(" ").toLowerCase().includes(s);
			return cocokFilter && cocokCari;
		});
	}, [q, filter]);
	const totalResponden = surveiRingkasan.reduce((a, b) => a + b.total, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Report Survei Pelayanan",
		breadcrumb: "Report Survei",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: surveiRingkasan.map((s) => {
				const tone = cardTone[s.nilai];
				const Icon = tone.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "card-surface relative overflow-hidden p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute inset-x-0 top-0 h-1 ${tone.bar}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display font-semibold",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Komunikasi, Materi, Sarpras"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary ${tone.text}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-display text-3xl font-bold",
							children: [s.total.toLocaleString("id-ID"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-sm font-medium text-muted-foreground",
								children: "Responden"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-2 overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block h-full rounded-full ${tone.bar}`,
								style: { width: `${s.share}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [s.share, "% dari total"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilter(s.nilai),
								className: "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), "View"]
							})]
						})
					]
				}, s.nilai);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface mt-6 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 border-b border-border px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate text-base font-semibold",
							children: "Survei Responden Pelayanan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								"Menampilkan ",
								rows.length,
								" dari ",
								totalResponden.toLocaleString("id-ID"),
								" responden"
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,20rem)_auto] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Cari responden atau keterangan…",
							className: "w-full min-w-0 bg-transparent text-sm focus:outline-none"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 sm:justify-end",
						children: [
							"Semua",
							"Baik",
							"Cukup",
							"Kurang"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilter(f),
							className: `rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary"}`,
							children: f
						}, f))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-3 px-4 pb-5 lg:hidden",
					children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: r.responden
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 text-xs text-muted-foreground",
									children: ["#", r.no]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: r.tanggal
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nilai, {
										label: "Komunikasi",
										value: r.komunikasi
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nilai, {
										label: "Materi",
										value: r.substansi
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nilai, {
										label: "Sarpras",
										value: r.sarana
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-foreground/80",
								children: r.keterangan
							})
						]
					}, r.no)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
						children: "Tidak ada data survei."
					})]
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
									children: "No"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Tanggal Survei"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Responden"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Komunikasi Petugas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Substansi Materi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Sarana Prasarana"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 font-semibold",
									children: "Keterangan"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border align-top hover:bg-secondary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 text-muted-foreground",
									children: r.no
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "whitespace-nowrap px-5 py-4 text-muted-foreground",
									children: r.tanggal
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 font-medium",
									children: r.responden
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: r.komunikasi })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: r.substansi })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { value: r.sarana })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "max-w-xs px-5 py-4 text-muted-foreground",
									children: r.keterangan
								})
							]
						}, r.no)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-t border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "Tidak ada data survei."
							})
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 border-t border-border px-5 py-4 sm:flex sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Menampilkan ",
							rows.length,
							" entri · periode Agustus 2026"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-1",
						children: [
							"Prev",
							"1",
							"2",
							"3",
							"Next"
						].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${p === "1" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`,
							children: p
						}, p))
					})]
				})
			]
		})]
	});
}
function Badge({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2.5 py-1 text-xs font-medium ${nilaiTone[value]}`,
		children: value
	});
}
function Nilai({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `rounded-full px-2.5 py-1 text-xs font-medium ${nilaiTone[value]}`,
		children: [
			label,
			": ",
			value
		]
	});
}
//#endregion
export { SurveiPage as component };

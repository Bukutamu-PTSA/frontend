import { i as __toESM } from "../_runtime.mjs";
import { i as authHeaders, r as apiUrl } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as XIcon } from "./x-icon-LOvW3t4T.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as Instagram, K as Facebook, M as Mail, P as LoaderCircle, j as MapPin, ot as ChevronDown, s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faqpage-D65dwDJ8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var socials = [
	{
		icon: XIcon,
		href: "https://x.com/KemnakerRI"
	},
	{
		icon: Facebook,
		href: "https://www.facebook.com/share/1B4YgTmbGG/?mibextid=wwXIfr"
	},
	{
		icon: Instagram,
		href: "https://www.instagram.com/kemnaker?stkn=MWdxZjhmMG81aTZ3YQ=="
	}
];
var FAQ_LIST_URL = apiUrl("faqs");
var navLinks = [
	{
		label: "Beranda",
		to: "/"
	},
	{
		label: "Pengaduan",
		to: "/pengaduan"
	},
	{
		label: "Survei",
		to: "/survei"
	}
];
function FaqPage() {
	const navigate = useNavigate();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(null);
	const fetchFaqs = async () => {
		setLoading(true);
		setLoadError(null);
		try {
			const response = await fetch(FAQ_LIST_URL, {
				method: "GET",
				headers: authHeaders()
			});
			if (!response.ok) throw new Error(`Gagal memuat data (${response.status}).`);
			const json = await response.json();
			const rawList = Array.isArray(json) ? json : json?.data;
			setRows((Array.isArray(rawList) ? rawList : []).map((raw) => {
				const item = raw;
				return {
					id: Number(item.id),
					pertanyaan: String(item.pertanyaan ?? item.question ?? ""),
					jawaban: String(item.jawaban ?? item.answer ?? "")
				};
			}));
		} catch (err) {
			const message = err instanceof Error ? err.message : "Gagal memuat data FAQ.";
			console.error("Gagal mengambil data FAQ:", err);
			setLoadError(message);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchFaqs();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-[#F4F7FB] font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-gray-200 bg-white px-8 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: kemnaker_logo_default,
							alt: "Logo Kemnaker",
							className: "h-8 w-8 object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-bold text-[#032749]",
							children: "Kementerian Ketenagakerjaan"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							"aria-label": "Navigasi utama",
							className: "hidden items-center gap-8 text-[15px] md:flex",
							children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: link.to,
								className: "pb-1 font-medium text-gray-600 transition-colors hover:text-[#032749]",
								activeProps: { className: "text-[#032749] font-bold border-b-2 border-[#032749]" },
								activeOptions: { exact: link.to === "/" },
								children: link.label
							}, link.to))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => navigate({ to: "/login" }),
							className: "rounded-md bg-[#032749] px-6 py-2 font-semibold text-white shadow-sm transition-all hover:bg-blue-950",
							children: "Masuk"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-4xl px-6 py-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#032749] shadow-sm",
								children: "Frequently Asked Questions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 text-3xl font-extrabold tracking-tight text-[#032749] sm:text-4xl",
								children: "FAQ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-3 max-w-2xl text-[15px] text-slate-600",
								children: "Pertanyaan yang paling sering ditanyakan. Temukan jawaban seputar layanan Pelayanan Terpadu Satu Atap Kemnaker."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 space-y-3",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2 py-16 text-sm text-gray-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Memuat FAQ..."]
						}) : loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-2 text-sm text-red-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Gagal memuat data dari server: ", loadError] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: fetchFaqs,
								disabled: loading,
								className: "mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50",
								children: loading ? "Memuat..." : "Coba Lagi"
							})]
						}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center text-sm text-gray-400",
							children: "Belum ada FAQ yang tersedia."
						}) : rows.map((item) => {
							const isOpen = open === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setOpen(isOpen ? null : item.id),
									className: "flex w-full items-center justify-between gap-4 px-5 py-4 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[15px] font-semibold text-[#032749]",
										children: item.pertanyaan
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}` })]
								}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-t border-gray-100 px-5 py-4 text-[14px] leading-relaxed text-slate-600",
									children: item.jawaban
								})]
							}, item.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "bg-[#032749] text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-6 py-14",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-12 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-xl font-bold",
										children: ["BINWASNAKER ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400",
											children: "& K3"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-sm leading-relaxed text-gray-300",
										children: "Ditjen Binwasnaker & K3 adalah unsur pelaksana yang berada di bawah dan bertanggung jawab kepada Menteri Ketenagakerjaan."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 flex gap-3",
										children: socials.map(({ icon: Icon, href }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
										}, i))
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-lg font-semibold",
										children: "Customer Support"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "mt-4 border-white/15" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "mt-5 space-y-3 text-sm text-gray-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-400",
												children: "›"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/faqpage",
												className: "font-medium text-emerald-300 transition-colors hover:text-emerald-200",
												children: "FAQ"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-400",
												children: "›"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#",
												className: "transition-colors hover:text-emerald-400",
												children: "Contact Us"
											})]
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-lg font-semibold",
										children: "Ada Pertanyaan?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "mt-4 border-white/15" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://maps.app.goo.gl/QiLps9tsVMszzHf79",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "mt-5 flex gap-3 text-sm text-gray-300 transition-colors hover:text-emerald-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-relaxed",
											children: "Jl. Jend. Gatot Subroto Kav. 51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12950"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-center gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "#",
											className: "text-gray-300 transition-colors hover:text-emerald-400",
											children: "Pengaduan WLKP"
										})]
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "mt-10 border-white/15" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex flex-col items-center gap-1 text-center text-sm text-gray-300",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2024–2026 Kementerian Ketenagakerjaan RI. Seluruh Hak Cipta Dilindungi." })
						})
					]
				})
			})
		]
	});
}
//#endregion
export { FaqPage as component };

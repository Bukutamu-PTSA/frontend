import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { M as MapPin, N as Mail, R as Instagram, Z as Facebook, k as MessageSquare, q as FileText, s as Twitter, xt as BadgeCheck } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CG5J1Qlv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var gedung_kemnaker_default = "/assets/gedung-kemnaker-B2b0w9_z.jpg";
var binwasnaker_logo_default = "/assets/binwasnaker_logo-CTvh8meT.png";
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
var stats = [{
	icon: BadgeCheck,
	value: "12.450+",
	label: "Laporan Diselesaikan"
}];
var steps = [{
	title: "Siapkan Data & Bukti",
	body: "Kumpulkan dokumen pendukung seperti slip gaji, kontrak kerja, atau bukti komunikasi yang relevan dengan aduan Anda."
}, {
	title: "Isi Formulir Pengaduan",
	body: "Lengkapi formulir secara online dengan detail kronologi kejadian secara jelas dan faktual pada portal ini."
}];
var socials = [
	{
		icon: Twitter,
		href: "#"
	},
	{
		icon: Facebook,
		href: "#"
	},
	{
		icon: MessageSquare,
		href: "#"
	},
	{
		icon: Instagram,
		href: "#"
	}
];
function Index() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-[#F4F7FB] font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30",
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
							className: "hidden items-center gap-8 md:flex text-[15px]",
							children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: link.to,
								className: "pb-1 transition-colors font-medium text-gray-600 hover:text-[#032749]",
								activeProps: { className: "text-[#032749] font-bold border-b-2 border-[#032749]" },
								activeOptions: { exact: link.to === "/" },
								children: link.label
							}, link.to))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => navigate({ to: "/login" }),
							className: "bg-[#032749] hover:bg-blue-950 text-white rounded-md px-6 py-2 font-semibold shadow-sm transition-all",
							children: "Masuk"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative w-full min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden px-8 py-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: gedung_kemnaker_default,
								alt: "Gedung Kemnaker RI",
								className: "absolute inset-0 w-full h-full object-cover object-center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-white/75 backdrop-blur-[1px]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-7 space-y-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-2 rounded-full bg-white/90 border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-[#032749] shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4 text-blue-600 fill-blue-600 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pelayanan Terpadu Satu Atap" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-4xl sm:text-5xl font-extrabold tracking-tight text-[#032749] leading-tight",
											children: "Sistem Pengaduan Tenaga Kerja"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl",
											children: "Platform resmi untuk melaporkan pelanggaran norma kerja, perselisihan hubungan industrial, dan masalah ketenagakerjaan lainnya secara aman dan terpantau."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "lg",
											onClick: () => navigate({ to: "/pengaduan" }),
											className: "bg-[#032749] hover:bg-blue-950 text-white font-semibold rounded-lg px-6 py-3.5 shadow-md flex items-center gap-2.5 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Formulir Pengaduan"]
										}) })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-5 flex items-center justify-center md:justify-end gap-6 sm:gap-10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: kemnaker_logo_default,
										alt: "Logo Kemnaker",
										className: "w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-md"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: binwasnaker_logo_default,
										alt: "Logo Binwasnaker",
										className: "w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-md"
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "bg-white border-y border-gray-200",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto max-w-6xl px-6 py-10",
							children: stats.map(({ icon: Icon, value, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "mx-auto size-7 text-[#032749]",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-3xl font-bold text-[#032749]",
										children: value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-gray-500 font-medium",
										children: label
									})
								]
							}, label))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-6xl px-6 py-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-center text-2xl font-bold text-[#032749] md:text-3xl",
								children: "Proses Pelaporan yang Transparan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-gray-600",
								children: "Ikuti langkah mudah ini untuk melaporkan masalah ketenagakerjaan Anda. Kami menjamin kerahasiaan data pelapor."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-10 grid gap-6 md:grid-cols-2",
								children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex size-10 items-center justify-center rounded-full bg-[#032749] text-sm font-bold text-white mb-4",
											children: i + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-base font-bold text-[#032749]",
											children: step.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-relaxed text-gray-600",
											children: step.body
										})
									]
								}, step.title))
							})
						]
					})
				]
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
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#",
												className: "hover:text-emerald-400 transition-colors",
												children: "FAQ"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-400",
												children: "›"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#",
												className: "hover:text-emerald-400 transition-colors",
												children: "Hubungi Kami"
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex gap-3 text-sm text-gray-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-relaxed",
											children: "Jl. Jend. Gatot Subroto Kav. 51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12950"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-center gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "#",
											className: "text-gray-300 hover:text-emerald-400 transition-colors",
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
export { Index as component };

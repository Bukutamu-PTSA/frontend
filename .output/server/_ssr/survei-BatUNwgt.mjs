import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as LoaderCircle, M as MapPin, N as Mail, R as Instagram, Z as Facebook, _ as Send, gt as Building2, k as MessageSquare, s as Twitter } from "../_libs/lucide-react.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/survei-BatUNwgt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_API_URL = "http://192.168.147.199:8000/api";
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
var ratingOptions = [
	"Baik",
	"Cukup",
	"Kurang"
];
var parseOfficerData = (res) => {
	if (!res) return [];
	const rawData = res.data ? res.data : res;
	if (typeof rawData === "object" && !Array.isArray(rawData)) return Object.entries(rawData).map(([id, name]) => ({
		id: String(id),
		name: String(name)
	}));
	if (Array.isArray(rawData)) return rawData.map((item) => ({
		id: String(item.id ?? item.code ?? item.officer_id ?? ""),
		name: String(item.name ?? item.nama ?? item.officer_name ?? item.nama_petugas ?? item)
	}));
	return [];
};
function FormSurveiPage() {
	const navigate = useNavigate();
	const [officers, setOfficers] = (0, import_react.useState)([]);
	const [loadingOfficers, setLoadingOfficers] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)({
		officer_id: "",
		officer_name: "",
		komunikasi_petugas: "",
		penjelasan_materi: "",
		sarana_prasarana: "",
		catatan: ""
	});
	(0, import_react.useEffect)(() => {
		const fetchOfficers = async () => {
			setLoadingOfficers(true);
			try {
				const res = await fetch(`${BASE_API_URL}/officers`).catch(() => fetch(`${BASE_API_URL}/petugas`));
				if (res && res.ok) {
					const data = await res.json();
					setOfficers(parseOfficerData(data));
				} else setOfficers([
					{
						id: "1",
						name: "Ahmad Fauzi - Petugas PTSA 1"
					},
					{
						id: "2",
						name: "Siti Rahmawati - Petugas PTSA 2"
					},
					{
						id: "3",
						name: "Budi Santoso - Petugas PTSA 3"
					}
				]);
			} catch (error) {
				console.error("Gagal memuat petugas:", error);
			} finally {
				setLoadingOfficers(false);
			}
		};
		fetchOfficers();
	}, []);
	const handleOfficerChange = (e) => {
		const selectedId = e.target.value;
		const selectedObj = officers.find((o) => String(o.id) === selectedId);
		setFormData((prev) => ({
			...prev,
			officer_id: selectedId,
			officer_name: selectedObj ? selectedObj.name : ""
		}));
	};
	const handleRatingSelect = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.officer_id) {
			alert("Silakan pilih nama petugas terlebih dahulu.");
			return;
		}
		if (!formData.komunikasi_petugas || !formData.penjelasan_materi || !formData.sarana_prasarana) {
			alert("Silakan lengkapi seluruh penilaian survei.");
			return;
		}
		setSubmitting(true);
		try {
			if (!(await fetch(`${BASE_API_URL}/surveys`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify(formData)
			})).ok) throw new Error("Gagal mengirim survei");
			alert("Terima kasih! Survei kepuasan layanan Anda berhasil dikirim.");
			navigate({ to: "/" });
		} catch (error) {
			console.error(error);
			alert("Terjadi kendala saat mengirim survei. Silakan coba kembali.");
		} finally {
			setSubmitting(false);
		}
	};
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Navigasi utama",
						className: "hidden items-center gap-8 md:flex text-[15px]",
						children: navLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: "pb-1 transition-colors font-medium text-gray-600 hover:text-[#032749]",
							activeProps: { className: "text-[#032749] font-bold border-b-2 border-[#032749]" },
							activeOptions: { exact: link.to === "/" },
							children: link.label
						}, link.to))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 py-12 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mb-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-md bg-[#EDF3FA] px-3 py-1 text-xs font-bold text-[#032749] mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KEMNAKER" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#032749]",
								children: "FORM SURVEI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-[#032749]/80 mt-1",
								children: "#SURVEI LAYANAN PTSA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-2 leading-relaxed",
								children: "Partisipasi Anda sangat berarti bagi kami untuk meningkatkan kualitas layanan Pelayanan Terpadu Satu Atap (PTSA) Kementerian Ketenagakerjaan."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white",
										children: "1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-bold text-gray-900",
										children: "Masukkan Nama Petugas:"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: formData.officer_id,
									onChange: handleOfficerChange,
									required: true,
									className: "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: loadingOfficers ? "Memuat petugas..." : "Pilih"
									}), officers.map((officer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: officer.id,
										children: officer.name
									}, officer.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white",
										children: "2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-bold text-gray-900",
										children: "Bagaimana Komunikasi Petugas Dalam Memberikan Layanan:"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-3",
									children: ratingOptions.map((option) => {
										const isSelected = formData.komunikasi_petugas === option;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleRatingSelect("komunikasi_petugas", option),
											className: `py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${isSelected ? "bg-[#032749] text-white border-[#032749] shadow-sm" : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"}`,
											children: option
										}, option);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white",
										children: "3"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-bold text-gray-900",
										children: "Bagaimana Penjelasan Materi yang Diberikan oleh Petugas:"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-3",
									children: ratingOptions.map((option) => {
										const isSelected = formData.penjelasan_materi === option;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleRatingSelect("penjelasan_materi", option),
											className: `py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${isSelected ? "bg-[#032749] text-white border-[#032749] shadow-sm" : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"}`,
											children: option
										}, option);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white",
										children: "4"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-bold text-gray-900",
										children: "Bagaimana Sarana dan Prasarana Layanan PTSA:"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-3",
									children: ratingOptions.map((option) => {
										const isSelected = formData.sarana_prasarana === option;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleRatingSelect("sarana_prasarana", option),
											className: `py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${isSelected ? "bg-[#032749] text-white border-[#032749] shadow-sm" : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"}`,
											children: option
										}, option);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white",
										children: "5"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-bold text-gray-900",
										children: "Catatan:"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: formData.catatan,
									onChange: (e) => setFormData((prev) => ({
										...prev,
										catatan: e.target.value
									})),
									placeholder: "isi dengan singkat catatan untuk perbaikan pelayanan",
									className: "w-full rounded-2xl border border-gray-300 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749] resize-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: submitting,
										className: "inline-flex items-center gap-2 rounded-full bg-[#032749] px-7 py-3 text-sm font-semibold text-white hover:bg-blue-950 active:scale-95 disabled:opacity-70 transition-all shadow-md",
										children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Mengirim..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Kirim Survei", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })] })
									})
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "bg-[#032749] text-white mt-16",
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
												children: "Contact Us"
											})]
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-lg font-semibold",
										children: "Have a Questions?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "mt-4 border-white/15" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex gap-3 text-sm text-gray-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-relaxed",
											children: "Jl. Gatot Subroto No.51, RT.5/RW.4, Kuningan Timur. Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Jakarta - 12950 Jakarta - Indonesia"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col items-center gap-1 text-center text-sm text-gray-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Copyright © BINSIS || 2024 – 2026" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Designed by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-400",
								children: "TUBSPK"
							})] })]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { FormSurveiPage as component };

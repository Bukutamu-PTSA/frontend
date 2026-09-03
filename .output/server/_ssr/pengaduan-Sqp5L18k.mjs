import { r as __toESM } from "../_runtime.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { T as Instagram, U as Building2, X as ArrowRight, Z as ArrowLeft, a as Twitter, b as MapPin, i as User, j as Facebook, v as MessageSquare, x as Mail } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pengaduan-Sqp5L18k.js
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
var parseDropdownData = (res, keyMap) => {
	if (!res) return [];
	const rawData = res.data ? res.data : res;
	if (typeof rawData === "object" && !Array.isArray(rawData)) return Object.entries(rawData).map(([code, name]) => ({
		code: String(code),
		name: String(name)
	}));
	if (Array.isArray(rawData)) return rawData.map((item) => ({
		code: String((keyMap?.codeKey && item[keyMap.codeKey]) ?? item.sector_code ?? item.id ?? item.code ?? ""),
		name: String((keyMap?.nameKey && item[keyMap.nameKey]) ?? item.sector_name ?? item.category_name ?? item.name ?? item.nama ?? item)
	}));
	return [];
};
function FormulirPengaduanPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = (0, import_react.useState)({
		category_id: "",
		nama_lengkap: "",
		nik: "",
		alamat_pelapor: "",
		jenis_kelamin: "laki-laki",
		jabatan: "",
		no_telp_pelapor: "",
		email_pelapor: "",
		nama_perusahaan: "",
		sektor_industri: "",
		alamat_perusahaan: "",
		jumlah_naker: "",
		provinsi: "",
		provinsiCode: "",
		kota_kab: "",
		kotaCode: "",
		kecamatan: "",
		kecamatanCode: "",
		kelurahan: "",
		kelurahanCode: "",
		no_telp_perusahaan: "",
		email_perusahaan: ""
	});
	const [kategoriOptions, setKategoriOptions] = (0, import_react.useState)([]);
	const [sektorOptions, setSektorOptions] = (0, import_react.useState)([]);
	const [provinsiOptions, setProvinsiOptions] = (0, import_react.useState)([]);
	const [kotaOptions, setKotaOptions] = (0, import_react.useState)([]);
	const [kecamatanOptions, setKecamatanOptions] = (0, import_react.useState)([]);
	const [kelurahanOptions, setKelurahanOptions] = (0, import_react.useState)([]);
	const [loadingInitial, setLoadingInitial] = (0, import_react.useState)(false);
	const [loadingKota, setLoadingKota] = (0, import_react.useState)(false);
	const [loadingKecamatan, setLoadingKecamatan] = (0, import_react.useState)(false);
	const [loadingKelurahan, setLoadingKelurahan] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = sessionStorage.getItem("draft_pengaduan");
		if (saved) try {
			setFormData(JSON.parse(saved));
		} catch (e) {
			console.error(e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const fetchInitialData = async () => {
			setLoadingInitial(true);
			try {
				const [resKategori, resSektor, resProv] = await Promise.all([
					fetch(`${BASE_API_URL}/complaint-categories`).then((r) => r.ok ? r.json() : []),
					fetch(`${BASE_API_URL}/industrial-sectors`).then((r) => r.ok ? r.json() : []),
					fetch(`${BASE_API_URL}/provinces`).then((r) => r.ok ? r.json() : {})
				]);
				setKategoriOptions(parseDropdownData(resKategori, {
					codeKey: "id",
					nameKey: "category_name"
				}));
				setSektorOptions(parseDropdownData(resSektor, {
					codeKey: "sector_code",
					nameKey: "sector_name"
				}));
				setProvinsiOptions(parseDropdownData(resProv));
			} catch (error) {
				console.error("Gagal memuat data awal:", error);
			} finally {
				setLoadingInitial(false);
			}
		};
		fetchInitialData();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!formData.provinsiCode) {
			setKotaOptions([]);
			setKecamatanOptions([]);
			setKelurahanOptions([]);
			return;
		}
		const fetchKota = async () => {
			setLoadingKota(true);
			try {
				const res = await fetch(`${BASE_API_URL}/cities/${formData.provinsiCode}`);
				if (res.ok) setKotaOptions(parseDropdownData(await res.json()));
			} catch (error) {
				console.error(error);
			} finally {
				setLoadingKota(false);
			}
		};
		fetchKota();
	}, [formData.provinsiCode]);
	(0, import_react.useEffect)(() => {
		if (!formData.kotaCode) {
			setKecamatanOptions([]);
			setKelurahanOptions([]);
			return;
		}
		const fetchKecamatan = async () => {
			setLoadingKecamatan(true);
			try {
				const res = await fetch(`${BASE_API_URL}/districts/${formData.kotaCode}`);
				if (res.ok) setKecamatanOptions(parseDropdownData(await res.json()));
			} catch (error) {
				console.error(error);
			} finally {
				setLoadingKecamatan(false);
			}
		};
		fetchKecamatan();
	}, [formData.kotaCode]);
	(0, import_react.useEffect)(() => {
		if (!formData.kecamatanCode) {
			setKelurahanOptions([]);
			return;
		}
		const fetchKelurahan = async () => {
			setLoadingKelurahan(true);
			try {
				const res = await fetch(`${BASE_API_URL}/villages/${formData.kecamatanCode}`);
				if (res.ok) setKelurahanOptions(parseDropdownData(await res.json()));
			} catch (error) {
				console.error(error);
			} finally {
				setLoadingKelurahan(false);
			}
		};
		fetchKelurahan();
	}, [formData.kecamatanCode]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "provinsiCode") {
			const selected = provinsiOptions.find((p) => p.code === value);
			setFormData((prev) => ({
				...prev,
				provinsiCode: value,
				provinsi: selected ? selected.name : "",
				kotaCode: "",
				kota_kab: "",
				kecamatanCode: "",
				kecamatan: "",
				kelurahanCode: "",
				kelurahan: ""
			}));
			return;
		}
		if (name === "kotaCode") {
			const selected = kotaOptions.find((k) => k.code === value);
			setFormData((prev) => ({
				...prev,
				kotaCode: value,
				kota_kab: selected ? selected.name : "",
				kecamatanCode: "",
				kecamatan: "",
				kelurahanCode: "",
				kelurahan: ""
			}));
			return;
		}
		if (name === "kecamatanCode") {
			const selected = kecamatanOptions.find((k) => k.code === value);
			setFormData((prev) => ({
				...prev,
				kecamatanCode: value,
				kecamatan: selected ? selected.name : "",
				kelurahanCode: "",
				kelurahan: ""
			}));
			return;
		}
		if (name === "kelurahanCode") {
			const selected = kelurahanOptions.find((k) => k.code === value);
			setFormData((prev) => ({
				...prev,
				kelurahanCode: value,
				kelurahan: selected ? selected.name : ""
			}));
			return;
		}
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const handleNextStep = (e) => {
		e.preventDefault();
		sessionStorage.setItem("draft_pengaduan", JSON.stringify(formData));
		navigate({ to: "/bukti_pendukung" });
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
				className: "flex-1 py-10 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold text-[#032749]",
							children: "Formulir Pengaduan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-gray-500",
							children: "Mohon lengkapi data diri dan informasi perusahaan Anda dengan akurat untuk memproses laporan ini."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleNextStep,
						autoComplete: "off",
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-6 text-[#032749] border-b pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-base font-bold",
										children: "Data Pelapor"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-xs font-bold text-gray-700 mb-1.5",
											children: ["Nama Pelapor ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "nama_lengkap",
											value: formData.nama_lengkap,
											onChange: handleChange,
											placeholder: "Masukkan nama lengkap",
											required: true,
											suppressHydrationWarning: true,
											className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-xs font-bold text-gray-700 mb-1.5",
											children: ["NIK ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "nik",
											maxLength: 16,
											value: formData.nik,
											onChange: handleChange,
											placeholder: "Masukkan 16 digit NIK",
											required: true,
											suppressHydrationWarning: true,
											className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-xs font-bold text-gray-700 mb-1.5",
											children: ["Alamat ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											name: "alamat_pelapor",
											rows: 3,
											value: formData.alamat_pelapor,
											onChange: handleChange,
											placeholder: "Masukkan alamat lengkap",
											required: true,
											suppressHydrationWarning: true,
											className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-2",
												children: ["Jenis Kelamin ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-6 mt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "radio",
														name: "jenis_kelamin",
														value: "laki-laki",
														checked: formData.jenis_kelamin === "laki-laki",
														onChange: handleChange,
														className: "h-4 w-4 text-[#032749] focus:ring-[#032749]"
													}), "Laki-laki"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "flex items-center gap-2 text-sm text-gray-700 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "radio",
														name: "jenis_kelamin",
														value: "perempuan",
														checked: formData.jenis_kelamin === "perempuan",
														onChange: handleChange,
														className: "h-4 w-4 text-[#032749] focus:ring-[#032749]"
													}), "Perempuan"]
												})]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Jabatan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												name: "jabatan",
												value: formData.jabatan,
												onChange: handleChange,
												placeholder: "Contoh: Staff",
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["No Telp ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "tel",
												name: "no_telp_pelapor",
												value: formData.no_telp_pelapor,
												onChange: handleChange,
												placeholder: "08xxxxxxxxxx",
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												name: "email_pelapor",
												value: formData.email_pelapor,
												onChange: handleChange,
												placeholder: "email@contoh.com",
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
											})] })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-6 text-[#032749] border-b pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-base font-bold",
										children: "Data Perusahaan"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Nama Perusahaan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												name: "nama_perusahaan",
												value: formData.nama_perusahaan,
												onChange: handleChange,
												placeholder: "PT / CV ...",
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Sektor Industri ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												name: "sektor_industri",
												value: formData.sektor_industri,
												onChange: (e) => {
													const sel = sektorOptions.find((s) => s.name === e.target.value || s.code === e.target.value);
													setFormData((prev) => ({
														...prev,
														sektor_industri: sel ? sel.name : e.target.value
													}));
												},
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: loadingInitial ? "Memuat..." : "Pilih Sektor"
												}), sektorOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: item.name,
													children: item.name
												}, item.code))]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Kategori Laporan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												name: "category_id",
												value: formData.category_id,
												onChange: handleChange,
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: loadingInitial ? "Memuat..." : "Pilih Kategori"
												}), kategoriOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: item.code,
													children: item.name
												}, item.code))]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Jumlah Naker ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												name: "jumlah_naker",
												value: formData.jumlah_naker,
												onChange: handleChange,
												placeholder: "0",
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Provinsi ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												name: "provinsiCode",
												value: formData.provinsiCode,
												onChange: handleChange,
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: loadingInitial ? "Memuat..." : "Pilih"
												}), provinsiOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: item.code,
													children: item.name
												}, item.code))]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Kota/Kabupaten ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												name: "kotaCode",
												value: formData.kotaCode,
												onChange: handleChange,
												disabled: !formData.provinsiCode || loadingKota,
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: loadingKota ? "Memuat..." : "Pilih"
												}), kotaOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: item.code,
													children: item.name
												}, item.code))]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Kecamatan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												name: "kecamatanCode",
												value: formData.kecamatanCode,
												onChange: handleChange,
												disabled: !formData.kotaCode || loadingKecamatan,
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: loadingKecamatan ? "Memuat..." : "Pilih"
												}), kecamatanOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: item.code,
													children: item.name
												}, item.code))]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: ["Kelurahan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												name: "kelurahanCode",
												value: formData.kelurahanCode,
												onChange: handleChange,
												disabled: !formData.kecamatanCode || loadingKelurahan,
												required: true,
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: loadingKelurahan ? "Memuat..." : "Pilih"
												}), kelurahanOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: item.code,
													children: item.name
												}, item.code))]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: "No Telp Perusahaan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "tel",
												name: "no_telp_perusahaan",
												value: formData.no_telp_perusahaan,
												onChange: handleChange,
												placeholder: "021-xxxxxx",
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-gray-700 mb-1.5",
												children: "Email Perusahaan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												name: "email_perusahaan",
												value: formData.email_perusahaan,
												onChange: handleChange,
												placeholder: "hr@perusahaan.com",
												suppressHydrationWarning: true,
												className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-xs font-bold text-gray-700 mb-1.5",
											children: ["Alamat Perusahaan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "alamat_perusahaan",
											value: formData.alamat_perusahaan,
											onChange: handleChange,
											placeholder: "Jalan, Gedung, dll",
											required: true,
											suppressHydrationWarning: true,
											className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
										})] })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => navigate({ to: "/" }),
									suppressHydrationWarning: true,
									className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#032749] hover:bg-gray-50 active:scale-95 transition-all shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Kembali"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									suppressHydrationWarning: true,
									className: "inline-flex items-center gap-2 rounded-lg bg-[#032749] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-950 active:scale-95 transition-all shadow-md",
									children: ["Lanjut ke Detail Aduan", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})]
							})
						]
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
export { FormulirPengaduanPage as component };

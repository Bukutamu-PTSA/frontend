import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Et as ArrowLeft, F as LoaderCircle, Tt as ArrowRight, a as User, gt as Building2, l as TriangleAlert, q as FileText } from "../_libs/lucide-react.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pengaduan-D91__gcp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_API_URL = "http://192.168.147.199:8000/api";
function parseLocationResponse(json) {
	if (!json) return [];
	const target = json.data ?? json;
	if (typeof target === "object" && !Array.isArray(target)) return Object.entries(target).map(([code, name]) => ({
		id: code,
		code,
		name: String(name)
	}));
	if (Array.isArray(target)) return target.map((item) => {
		const code = String(item.code || item.id || item.province_code || item.city_code || item.district_code || item.village_code);
		return {
			id: item.id ?? code,
			code,
			name: item.name || item.province_name || item.city_name || item.district_name || item.village_name || item.nama || String(item)
		};
	});
	return [];
}
function FormulirPengaduanPage() {
	const navigate = useNavigate();
	const [kategoriList, setKategoriList] = (0, import_react.useState)([]);
	const [sektorList, setSektorList] = (0, import_react.useState)([]);
	const [provinsiList, setProvinsiList] = (0, import_react.useState)([]);
	const [kabupatenList, setKabupatenList] = (0, import_react.useState)([]);
	const [kecamatanList, setKecamatanList] = (0, import_react.useState)([]);
	const [kelurahanList, setKelurahanList] = (0, import_react.useState)([]);
	const [loadingProv, setLoadingProv] = (0, import_react.useState)(false);
	const [loadingKab, setLoadingKab] = (0, import_react.useState)(false);
	const [loadingKec, setLoadingKec] = (0, import_react.useState)(false);
	const [loadingKel, setLoadingKel] = (0, import_react.useState)(false);
	const [jenisPengaduan, setJenisPengaduan] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [lainnya, setLainnya] = (0, import_react.useState)("");
	const [tanggalPelaporan, setTanggalPelaporan] = (0, import_react.useState)("");
	const [nomorTiket, setNomorTiket] = (0, import_react.useState)("");
	const [namaPelapor, setNamaPelapor] = (0, import_react.useState)("Zuan");
	const [nik, setNik] = (0, import_react.useState)("");
	const [alamatPelapor, setAlamatPelapor] = (0, import_react.useState)("");
	const [jenisKelamin, setJenisKelamin] = (0, import_react.useState)("Laki-laki");
	const [jabatan, setJabatan] = (0, import_react.useState)("");
	const [noTelpPelapor, setNoTelpPelapor] = (0, import_react.useState)("");
	const [emailPelapor, setEmailPelapor] = (0, import_react.useState)("");
	const [namaPerusahaan, setNamaPerusahaan] = (0, import_react.useState)("");
	const [sektorIndustri, setSektorIndustri] = (0, import_react.useState)("");
	const [sectorId, setSectorId] = (0, import_react.useState)("");
	const [jumlahPekerja, setJumlahPekerja] = (0, import_react.useState)(0);
	const [selectedProvCode, setSelectedProvCode] = (0, import_react.useState)("");
	const [provinsiName, setProvinsiName] = (0, import_react.useState)("");
	const [selectedCityCode, setSelectedCityCode] = (0, import_react.useState)("");
	const [kabupatenName, setKabupatenName] = (0, import_react.useState)("");
	const [selectedDistrictCode, setSelectedDistrictCode] = (0, import_react.useState)("");
	const [kecamatanName, setKecamatanName] = (0, import_react.useState)("");
	const [selectedVillageCode, setSelectedVillageCode] = (0, import_react.useState)("");
	const [kelurahanName, setKelurahanName] = (0, import_react.useState)("");
	const [noTelpPerusahaan, setNoTelpPerusahaan] = (0, import_react.useState)("");
	const [emailPerusahaan, setEmailPerusahaan] = (0, import_react.useState)("");
	const [alamatPerusahaan, setAlamatPerusahaan] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const fetchInitialData = async () => {
			const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
			const headers = {
				Accept: "application/json",
				...token ? { Authorization: `Bearer ${token}` } : {}
			};
			try {
				const resCat = await fetch(`${BASE_API_URL}/complaint-categories`, { headers });
				if (resCat.ok) {
					const jsonCat = await resCat.json();
					const items = Array.isArray(jsonCat?.data) ? jsonCat.data : Array.isArray(jsonCat) ? jsonCat : [];
					setKategoriList(items.map((item) => ({
						id: item.id,
						name: item.category_name || item.name || item.category_code
					})));
				}
			} catch (e) {
				console.error("Gagal load complaint-categories:", e);
			}
			try {
				const resSek = await fetch(`${BASE_API_URL}/industrial-sectors`, { headers });
				if (resSek.ok) {
					const jsonSek = await resSek.json();
					const items = Array.isArray(jsonSek?.data) ? jsonSek.data : Array.isArray(jsonSek) ? jsonSek : [];
					setSektorList(items.map((item) => ({
						id: item.id,
						name: item.sector_name || item.name
					})));
				}
			} catch (e) {
				console.error("Gagal load industrial-sectors:", e);
			}
			try {
				setLoadingProv(true);
				const resProv = await fetch(`${BASE_API_URL}/provinces`, { headers });
				if (resProv.ok) {
					const parsed = parseLocationResponse(await resProv.json());
					setProvinsiList(parsed);
				}
			} catch (e) {
				console.error("Gagal load provinces:", e);
			} finally {
				setLoadingProv(false);
			}
		};
		fetchInitialData();
	}, []);
	(0, import_react.useEffect)(() => {
		setSelectedCityCode("");
		setKabupatenName("");
		setSelectedDistrictCode("");
		setKecamatanName("");
		setSelectedVillageCode("");
		setKelurahanName("");
		setKabupatenList([]);
		setKecamatanList([]);
		setKelurahanList([]);
		if (!selectedProvCode) return;
		const fetchCities = async () => {
			setLoadingKab(true);
			try {
				const res = await fetch(`${BASE_API_URL}/cities/${encodeURIComponent(selectedProvCode)}`);
				if (res.ok) {
					const parsed = parseLocationResponse(await res.json());
					setKabupatenList(parsed);
				}
			} catch (e) {
				console.error("Gagal load cities:", e);
			} finally {
				setLoadingKab(false);
			}
		};
		fetchCities();
	}, [selectedProvCode]);
	(0, import_react.useEffect)(() => {
		setSelectedDistrictCode("");
		setKecamatanName("");
		setSelectedVillageCode("");
		setKelurahanName("");
		setKecamatanList([]);
		setKelurahanList([]);
		if (!selectedCityCode) return;
		const fetchDistricts = async () => {
			setLoadingKec(true);
			try {
				const res = await fetch(`${BASE_API_URL}/districts/${encodeURIComponent(selectedCityCode)}`);
				if (res.ok) {
					const parsed = parseLocationResponse(await res.json());
					setKecamatanList(parsed);
				}
			} catch (e) {
				console.error("Gagal load districts:", e);
			} finally {
				setLoadingKec(false);
			}
		};
		fetchDistricts();
	}, [selectedCityCode]);
	(0, import_react.useEffect)(() => {
		setSelectedVillageCode("");
		setKelurahanName("");
		setKelurahanList([]);
		if (!selectedDistrictCode) return;
		const fetchVillages = async () => {
			setLoadingKel(true);
			try {
				const res = await fetch(`${BASE_API_URL}/villages/${encodeURIComponent(selectedDistrictCode)}`);
				if (res.ok) {
					const parsed = parseLocationResponse(await res.json());
					setKelurahanList(parsed);
				}
			} catch (e) {
				console.error("Gagal load villages:", e);
			} finally {
				setLoadingKel(false);
			}
		};
		fetchVillages();
	}, [selectedDistrictCode]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = {
			category_id: categoryId,
			jenisPengaduan,
			lainnya,
			tanggalPelaporan,
			nomorTiket,
			namaPelapor,
			nik,
			alamatPelapor,
			jenisKelamin,
			jabatan,
			noTelpPelapor,
			emailPelapor,
			namaPerusahaan,
			sector_id: sectorId,
			sektorIndustri,
			jumlahPekerja,
			provinsi: provinsiName,
			province_code: selectedProvCode,
			kabupaten: kabupatenName,
			city_code: selectedCityCode,
			kecamatan: kecamatanName,
			district_code: selectedDistrictCode,
			kelurahan: kelurahanName,
			village_code: selectedVillageCode,
			noTelpPerusahaan,
			emailPerusahaan,
			alamatPerusahaan
		};
		sessionStorage.setItem("draft_pengaduan", JSON.stringify(formData));
		navigate({ to: "/bukti_pendukung" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F8FAFC] text-gray-800",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-50 border-b border-gray-100 bg-white shadow-2xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: kemnaker_logo_default,
						alt: "Logo Kemnaker",
						className: "h-8 w-auto object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[14px] font-bold text-gray-900 tracking-tight",
						children: "Kementerian Ketenagakerjaan"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-6 text-[12px] font-medium text-gray-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-gray-900 transition-colors",
							children: "Beranda"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pengaduan",
							className: "font-semibold text-[#0E3B68] hover:text-[#0E3B68] transition-colors",
							children: "Pengaduan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/survei",
							className: "hover:text-gray-900 transition-colors",
							children: "Survei"
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-8 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[22px] font-bold text-gray-900 tracking-tight",
					children: "Formulir Pengaduan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[12px] text-gray-500",
					children: "Mohon lengkapi data diri dan informasi perusahaan Anda dengan akurat untuk memproses laporan ini."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				suppressHydrationWarning: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[13px] font-bold text-gray-900",
								children: "Jenis Pengaduan"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: ["Jenis Pengaduan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										suppressHydrationWarning: true,
										value: categoryId,
										onChange: (e) => {
											const selId = e.target.value;
											setCategoryId(selId);
											const matched = kategoriList.find((k) => String(k.id) === selId);
											setJenisPengaduan(matched ? matched.name : "");
										},
										required: true,
										className: "w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Pilih Jenis Pengaduan"
											}),
											kategoriList.map((kat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: kat.id,
												children: kat.name
											}, kat.id)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "other",
												children: "Lainnya"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400",
										children: "▼"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: ["Lainnya ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "text",
									value: lainnya,
									onChange: (e) => setLainnya(e.target.value),
									placeholder: "Masukkan Jenis Pengaduan",
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Tanggal Pelaporan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										suppressHydrationWarning: true,
										type: "date",
										value: tanggalPelaporan,
										onChange: (e) => setTanggalPelaporan(e.target.value),
										required: true,
										className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Nomor Tiket ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										suppressHydrationWarning: true,
										type: "text",
										value: nomorTiket,
										onChange: (e) => setNomorTiket(e.target.value),
										placeholder: "A-123",
										required: true,
										className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
									})] })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[13px] font-bold text-gray-900",
								children: "Data Pelapor"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: ["Nama Pelapor ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "text",
									value: namaPelapor,
									onChange: (e) => setNamaPelapor(e.target.value),
									placeholder: "Nama Lengkap Pelapor",
									required: true,
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: ["NIK ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "text",
									value: nik,
									onChange: (e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16)),
									placeholder: "Masukkan 16 digit NIK",
									required: true,
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: ["Alamat ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "text",
									value: alamatPelapor,
									onChange: (e) => setAlamatPelapor(e.target.value),
									placeholder: "Masukkan alamat lengkap",
									required: true,
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-2 block font-medium text-gray-700",
										children: ["Jenis Kelamin ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-5 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												suppressHydrationWarning: true,
												type: "radio",
												name: "jenisKelamin",
												value: "Laki-laki",
												checked: jenisKelamin === "Laki-laki",
												onChange: () => setJenisKelamin("Laki-laki"),
												className: "h-3.5 w-3.5 text-[#0E3B68] focus:ring-[#0E3B68]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-gray-700",
												children: "Laki-laki"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												suppressHydrationWarning: true,
												type: "radio",
												name: "jenisKelamin",
												value: "Perempuan",
												checked: jenisKelamin === "Perempuan",
												onChange: () => setJenisKelamin("Perempuan"),
												className: "h-3.5 w-3.5 text-[#0E3B68] focus:ring-[#0E3B68]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-gray-700",
												children: "Perempuan"
											})]
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Jabatan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										suppressHydrationWarning: true,
										type: "text",
										value: jabatan,
										onChange: (e) => setJabatan(e.target.value),
										placeholder: "Contoh: Staff",
										required: true,
										className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: ["No Telp ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "tel",
									value: noTelpPelapor,
									onChange: (e) => setNoTelpPelapor(e.target.value),
									placeholder: "08xx xxxx xxxx",
									required: true,
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: [
										"Email ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-400 font-normal",
											children: "(Alamat email yang digunakan untuk mengirim berkas pengaduan)"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "email",
									value: emailPelapor,
									onChange: (e) => setEmailPelapor(e.target.value),
									placeholder: "email@contoh.com",
									required: true,
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-[10.5px] leading-relaxed text-amber-900",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-amber-600 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "font-semibold text-amber-700",
											children: "PENTING:"
										}),
										" ",
										"Alamat email yang dicantumkan di formulir ini harus sama persis dengan alamat email yang Anda gunakan saat mengirimkan dokumen/berkas pengaduan untuk kebutuhan verifikasi."
									] })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-7 w-7 place-items-center rounded-lg bg-sky-50 text-sky-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[13px] font-bold text-gray-900",
								children: "Data Perusahaan"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Nama Perusahaan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										suppressHydrationWarning: true,
										type: "text",
										value: namaPerusahaan,
										onChange: (e) => setNamaPerusahaan(e.target.value),
										placeholder: "PT / CV ....",
										required: true,
										className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Sektor Industri ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											suppressHydrationWarning: true,
											value: sectorId,
											onChange: (e) => {
												const selId = e.target.value;
												setSectorId(selId);
												const matched = sektorList.find((s) => String(s.id) === selId);
												setSektorIndustri(matched ? matched.name : "");
											},
											required: true,
											className: "w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Pilih Sektor"
											}), sektorList.map((sek) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: sek.id,
												children: sek.name
											}, sek.id))]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400",
											children: "▼"
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Jumlah Pekerja ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										suppressHydrationWarning: true,
										type: "number",
										value: jumlahPekerja,
										onChange: (e) => setJumlahPekerja(e.target.value),
										placeholder: "0",
										min: 0,
										required: true,
										className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Provinsi ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											suppressHydrationWarning: true,
											value: selectedProvCode,
											onChange: (e) => {
												const provCode = e.target.value;
												setSelectedProvCode(provCode);
												const matched = provinsiList.find((p) => String(p.code) === provCode);
												setProvinsiName(matched ? matched.name : "");
											},
											required: true,
											className: "w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: loadingProv ? "Memuat data provinsi..." : "Pilih Provinsi"
											}), provinsiList.map((prov) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: prov.code,
												children: prov.name
											}, prov.id))]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400",
											children: loadingProv ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin text-gray-400" }) : "▼"
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Kota/Kabupaten ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											suppressHydrationWarning: true,
											value: selectedCityCode,
											onChange: (e) => {
												const cityCode = e.target.value;
												setSelectedCityCode(cityCode);
												const matched = kabupatenList.find((k) => String(k.code) === cityCode);
												setKabupatenName(matched ? matched.name : "");
											},
											disabled: !selectedProvCode || loadingKab,
											required: true,
											className: "w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: !selectedProvCode ? "Pilih Provinsi terlebih dahulu" : loadingKab ? "Memuat kota/kabupaten..." : "Pilih Kota/Kabupaten"
											}), kabupatenList.map((kab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: kab.code,
												children: kab.name
											}, kab.id))]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400",
											children: loadingKab ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin text-gray-400" }) : "▼"
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Kecamatan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											suppressHydrationWarning: true,
											value: selectedDistrictCode,
											onChange: (e) => {
												const distCode = e.target.value;
												setSelectedDistrictCode(distCode);
												const matched = kecamatanList.find((kc) => String(kc.code) === distCode);
												setKecamatanName(matched ? matched.name : "");
											},
											disabled: !selectedCityCode || loadingKec,
											required: true,
											className: "w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: !selectedCityCode ? "Pilih Kota/Kabupaten terlebih dahulu" : loadingKec ? "Memuat kecamatan..." : "Pilih Kecamatan"
											}), kecamatanList.map((kec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: kec.code,
												children: kec.name
											}, kec.id))]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400",
											children: loadingKec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin text-gray-400" }) : "▼"
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: ["Kelurahan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											suppressHydrationWarning: true,
											value: selectedVillageCode,
											onChange: (e) => {
												const villCode = e.target.value;
												setSelectedVillageCode(villCode);
												const matched = kelurahanList.find((kl) => String(kl.code) === villCode);
												setKelurahanName(matched ? matched.name : "");
											},
											disabled: !selectedDistrictCode || loadingKel,
											required: true,
											className: "w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: !selectedDistrictCode ? "Pilih Kecamatan terlebih dahulu" : loadingKel ? "Memuat kelurahan..." : "Pilih Kelurahan"
											}), kelurahanList.map((kel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: kel.code,
												children: kel.name
											}, kel.id))]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400",
											children: loadingKel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin text-gray-400" }) : "▼"
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1.5 block font-medium text-gray-700",
										children: "Email Perusahaan"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										suppressHydrationWarning: true,
										type: "email",
										value: emailPerusahaan,
										onChange: (e) => setEmailPerusahaan(e.target.value),
										placeholder: "hrdperusahaan.com",
										className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: "No Telp Perusahaan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "tel",
									value: noTelpPerusahaan,
									onChange: (e) => setNoTelpPerusahaan(e.target.value),
									placeholder: "021-xxxxxxx",
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block font-medium text-gray-700",
									children: ["Alamat Perusahaan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									suppressHydrationWarning: true,
									type: "text",
									value: alamatPerusahaan,
									onChange: (e) => setAlamatPerusahaan(e.target.value),
									placeholder: "Jalan, Gedung, dll",
									required: true,
									className: "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68]"
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							suppressHydrationWarning: true,
							type: "button",
							onClick: () => window.history.back(),
							className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kembali" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							suppressHydrationWarning: true,
							type: "submit",
							className: "inline-flex items-center gap-1.5 rounded-lg bg-[#0E3B68] px-6 py-2.5 text-[11px] font-semibold text-white shadow-xs hover:bg-[#0a2c4e] transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lanjut ke Detail Aduan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { FormulirPengaduanPage as component };

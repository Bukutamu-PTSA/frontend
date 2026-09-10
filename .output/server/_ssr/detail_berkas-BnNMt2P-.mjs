import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as LoaderCircle, a as User, ct as CircleAlert, gt as Building2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-q-G8Lutm.mjs";
import { s as Route$13 } from "./router-D_q8IFgo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/detail_berkas-BnNMt2P-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_API_URL = "http://192.168.147.199:8000/api";
function DetailBerkasPage() {
	const search = Route$13.useSearch();
	const navigate = useNavigate();
	const complaintId = search.id;
	const [activeTab, setActiveTab] = (0, import_react.useState)("detail");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [agreedTerms, setAgreedTerms] = (0, import_react.useState)(false);
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!complaintId) {
			setErrorMsg("ID Pengaduan tidak ditemukan di URL.");
			setLoading(false);
			return;
		}
		const fetchDetail = async () => {
			setLoading(true);
			setErrorMsg(null);
			const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
			try {
				const res = await fetch(`${BASE_API_URL}/complaints/${complaintId}`, { headers: {
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				} });
				const json = await res.json().catch(() => null);
				console.log("Raw response detail dari backend:", json);
				if (!res.ok || !json) throw new Error(json?.message || `Gagal mengambil data pengaduan (Status: ${res.status})`);
				const item = json.data ?? json.complaint ?? json;
				if (!item || typeof item !== "object") throw new Error("Format payload aduan tidak valid dari server.");
				const complainant = item.complainant || {};
				const company = item.company || {};
				const category = item.category || {};
				const photoAttachment = (Array.isArray(item.attachments) ? item.attachments : []).find((att) => att.file_type === "photo");
				setData({
					id: item.id || complaintId,
					jenisPengaduan: category.category_name || item.category_name || item.jenis_pengaduan || "-",
					categoryId: category.id || item.category_id || 1,
					namaLengkap: complainant.nama_lengkap || complainant.nama || item.nama_pelapor || "-",
					nik: complainant.nik || item.nik || "-",
					alamatPelapor: complainant.alamat || item.alamat_pelapor || "-",
					jenisKelamin: complainant.jenis_kelamin || item.jenis_kelamin || "-",
					jabatan: complainant.jabatan || item.jabatan || "-",
					noTelpPelapor: complainant.no_telp || item.no_telp || "-",
					emailPelapor: complainant.email || item.email || "-",
					tglPelaporan: item.complaint_date ? new Date(String(item.complaint_date).replace(" ", "T")).toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "long",
						year: "numeric"
					}) : "-",
					namaPerusahaan: company.nama_perusahaan || item.nama_perusahaan || "-",
					sektorIndustri: company.sector?.sector_name || company.sektor_industri || item.sektor_industri || "-",
					alamatPerusahaan: company.alamat || item.alamat_perusahaan || "-",
					alamatPerusahaanKantor: company.alamat || item.alamat_perusahaan || "-",
					jumlahTenagaKerja: Number(company.jumlah_naker || item.jumlah_naker || 0),
					provinsi: company.provinsi || item.provinsi || "-",
					kotaKab: company.kota_kab || company.city || item.kota_kab || "-",
					kecamatan: company.kecamatan || company.district || item.kecamatan || "-",
					kelurahan: company.kelurahan || company.village || item.kelurahan || "-",
					noTelpPerusahaan: company.no_telp || item.company_no_telp || "-",
					emailPerusahaan: company.email || item.company_email || "-",
					deskripsiAduan: item.description || item.deskripsi || "-",
					photoUrl: photoAttachment?.file_path ? `${BASE_API_URL.replace("/api", "")}/storage/${photoAttachment.file_path.replace(/^\/?storage\//, "")}` : ""
				});
			} catch (err) {
				console.error("Fetch detail berkas error:", err);
				setErrorMsg(err.message || "Terjadi kesalahan saat memuat data berkas.");
			} finally {
				setLoading(false);
			}
		};
		fetchDetail();
	}, [complaintId]);
	const handleSaveEdit = async (e) => {
		e.preventDefault();
		if (!data) return;
		if (!agreedTerms) {
			alert("Harap centang persetujuan 'terms and conditions' terlebih dahulu.");
			return;
		}
		setSaving(true);
		const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
		const payload = {
			description: data.deskripsiAduan,
			complainant: {
				nama_lengkap: data.namaLengkap,
				nik: data.nik,
				alamat: data.alamatPelapor,
				jenis_kelamin: data.jenisKelamin,
				jabatan: data.jabatan,
				no_telp: data.noTelpPelapor,
				email: data.emailPelapor
			},
			company: {
				nama_perusahaan: data.namaPerusahaan,
				sektor_industri: data.sektorIndustri,
				alamat: data.alamatPerusahaan,
				jumlah_naker: data.jumlahTenagaKerja,
				provinsi: data.provinsi,
				kota_kab: data.kotaKab,
				kecamatan: data.kecamatan,
				kelurahan: data.kelurahan,
				no_telp: data.noTelpPerusahaan,
				email: data.emailPerusahaan
			}
		};
		try {
			const res = await fetch(`${BASE_API_URL}/complaints/${complaintId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				},
				body: JSON.stringify(payload)
			});
			if (!res.ok) {
				const errJson = await res.json().catch(() => null);
				throw new Error(errJson?.message || "Gagal memperbarui data aduan.");
			}
			alert("Data berhasil diperbarui!");
			setActiveTab("detail");
		} catch (err) {
			console.error(err);
			alert(err.message || "Terjadi kesalahan saat menyimpan data.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-[20px] font-normal text-gray-800 tracking-tight",
			children: "View"
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-72 items-center justify-center rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-[12px] text-gray-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#007A64]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Memuat detail berkas #",
					complaintId,
					"..."
				] })]
			})
		}) : errorMsg || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-white p-12 text-center shadow-2xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 text-red-500" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-semibold text-gray-800",
					children: errorMsg || "Data pengaduan tidak ditemukan."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => navigate({ to: "/admin/dashboard" }),
					className: "rounded-md bg-[#0B3B70] px-4 py-1.5 text-[11px] font-medium text-white hover:bg-[#092e57]",
					children: "Kembali ke Dashboard"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col lg:flex-row items-start gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full lg:w-[280px] shrink-0 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center text-center shadow-2xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 h-24 w-24 overflow-hidden rounded-2xl bg-[#EDF2F7] flex items-center justify-center",
							children: data.photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: data.photoUrl,
								alt: data.namaLengkap,
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-9 w-9 text-gray-400 stroke-[1.5]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[17px] font-bold text-gray-900 leading-tight",
							children: data.namaLengkap
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-gray-500 mt-1 mb-5",
							children: data.jabatan
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => navigate({ to: "/admin/dashboard" }),
							className: "w-full rounded-md bg-[#0B3B70] py-2 text-[12px] font-semibold text-white hover:bg-[#092e57] transition-colors cursor-pointer",
							children: "Home"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-[#0B3B70] px-4 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[12px] font-bold text-white tracking-wide",
							children: "Tentang Pelapor"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 space-y-4 text-[11.5px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-bold text-gray-800 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-gray-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nama Pelapor" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-700 pl-5.5 font-normal",
								children: data.namaLengkap
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-gray-100" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-bold text-gray-800 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-gray-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Alamat Perusahaan" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-700 pl-5.5 font-normal leading-relaxed",
								children: data.alamatPerusahaanKantor
							})] })
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 w-full bg-white rounded-lg border border-gray-200 shadow-2xs overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-gray-200 px-6 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("detail"),
							className: `px-7 py-1.5 rounded-md text-[11.5px] font-semibold transition-colors cursor-pointer ${activeTab === "detail" ? "bg-[#0B2545] text-white shadow-2xs" : "text-gray-700 hover:text-gray-900 bg-transparent"}`,
							children: "Detail"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("edit"),
							className: `px-7 py-1.5 rounded-md text-[11.5px] font-semibold transition-colors cursor-pointer ${activeTab === "edit" ? "bg-[#0B2545] text-white shadow-2xs" : "text-gray-700 hover:text-gray-900 bg-transparent"}`,
							children: "Edit"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 sm:p-8",
					children: [activeTab === "detail" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 text-[12px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[13px] font-bold text-gray-900",
									children: "Detail Pelapor"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-gray-800",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Pelaporan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.jenisPengaduan]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Nama Lengkap"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.namaLengkap]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "NIK"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.nik]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Alamat"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.alamatPelapor]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Jenis Kelamin"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.jenisKelamin]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Jabatan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.jabatan]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "No Telp"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.noTelpPelapor]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.emailPelapor]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Tgl Pelaporan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.tglPelaporan]
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[13px] font-bold text-[#008767]",
									children: "Detail Perusahaan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-gray-800",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Nama Perusahaan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.namaPerusahaan]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Sektor Industri"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.sektorIndustri]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Alamat Perusahaan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.alamatPerusahaan]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Jumlah Tenaga Kerja"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.jumlahTenagaKerja]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Provinsi"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.provinsi]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Kota / Kabupaten"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.kotaKab]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Kecamatan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.kecamatan]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Kelurahan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.kelurahan]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "No Telp"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.noTelpPerusahaan]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-44 shrink-0 text-gray-600",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [": ", data.emailPerusahaan]
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-[13px] font-bold text-[#008767]",
										children: "Detail Pengaduan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11.5px] text-gray-700 underline font-medium",
										children: "Deskripsi Pengaduan :"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-gray-800 leading-relaxed font-normal pt-0.5",
										children: data.deskripsiAduan
									})
								]
							})
						]
					}), activeTab === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveEdit,
						className: "space-y-3.5 text-[12px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Jenis Pengaduan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.jenisPengaduan,
									onChange: (e) => setData({
										...data,
										jenisPengaduan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Nama Pelapor"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.namaLengkap,
									onChange: (e) => setData({
										...data,
										namaLengkap: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "NIK"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.nik,
									onChange: (e) => setData({
										...data,
										nik: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Alamat"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.alamatPelapor,
									onChange: (e) => setData({
										...data,
										alamatPelapor: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Jenis Kelamin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.jenisKelamin,
									onChange: (e) => setData({
										...data,
										jenisKelamin: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Jabatan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.jabatan,
									onChange: (e) => setData({
										...data,
										jabatan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "No Telp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.noTelpPelapor,
									onChange: (e) => setData({
										...data,
										noTelpPelapor: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: data.emailPelapor,
									onChange: (e) => setData({
										...data,
										emailPelapor: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Nama Perusahaan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.namaPerusahaan,
									onChange: (e) => setData({
										...data,
										namaPerusahaan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Sektor Industri"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.sektorIndustri,
									onChange: (e) => setData({
										...data,
										sektorIndustri: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Alamat"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.alamatPerusahaan,
									onChange: (e) => setData({
										...data,
										alamatPerusahaan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Jumlah Pekerja"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: data.jumlahTenagaKerja,
									onChange: (e) => setData({
										...data,
										jumlahTenagaKerja: Number(e.target.value)
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Provinsi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.provinsi,
									onChange: (e) => setData({
										...data,
										provinsi: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Kota/Kabupaten"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.kotaKab,
									onChange: (e) => setData({
										...data,
										kotaKab: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Kecamatan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.kecamatan,
									onChange: (e) => setData({
										...data,
										kecamatan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Kelurahan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.kelurahan,
									onChange: (e) => setData({
										...data,
										kelurahan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "No Telp Perusahaan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: data.noTelpPerusahaan,
									onChange: (e) => setData({
										...data,
										noTelpPerusahaan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal",
									children: "Email Perusahaan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: data.emailPerusahaan,
									onChange: (e) => setData({
										...data,
										emailPerusahaan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "w-44 shrink-0 text-gray-700 font-normal pt-2",
									children: "Deskripsi Aduan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: data.deskripsiAduan,
									onChange: (e) => setData({
										...data,
										deskripsiAduan: e.target.value
									}),
									className: "flex-1 rounded-md border border-gray-300 bg-white p-3 text-[12px] text-gray-800 focus:border-[#0B3B70] focus:outline-none resize-none"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center justify-start gap-2 sm:pl-[200px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "terms",
									checked: agreedTerms,
									onChange: (e) => setAgreedTerms(e.target.checked),
									className: "h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "terms",
									className: "text-[11px] text-gray-500 cursor-pointer select-none",
									children: [
										"I agree to the",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-blue-500 hover:underline",
											children: "terms and conditions"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-3 sm:pl-[200px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: saving,
									className: "rounded-md bg-[#DC2626] px-7 py-2 text-[12px] font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs",
									children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit" })]
								})
							})
						]
					})]
				})]
			})]
		})]
	}) });
}
//#endregion
export { DetailBerkasPage as component };

import { i as __toESM } from "../_runtime.mjs";
import { r as apiUrl } from "./api-BnPXX3Pj.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as XIcon } from "./x-icon-LOvW3t4T.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as FileCheck, I as Instagram, K as Facebook, M as Mail, P as LoaderCircle, ft as Building2, j as MapPin, t as X, ut as Camera } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bukti_pendukung-DVeL2QGE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMPLAINTS_API_URL = apiUrl("complaints");
function BuktiPendukungPage() {
	const navigate = useNavigate();
	const [deskripsiAduan, setDeskripsiAduan] = (0, import_react.useState)("");
	const [selectedDocument, setSelectedDocument] = (0, import_react.useState)(null);
	const [capturedPhoto, setCapturedPhoto] = (0, import_react.useState)(null);
	const [capturedFile, setCapturedFile] = (0, import_react.useState)(null);
	const cameraInputRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const handleCapture = () => {
		cameraInputRef.current?.click();
	};
	const handleCameraChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!/\.(jpe?g|png|pdf)$/i.test(file.name) && ![
			"image/jpeg",
			"image/png",
			"application/pdf"
		].includes(file.type)) {
			alert("Bukti foto harus berupa file JPG/JPEG atau PDF.");
			return;
		}
		setCapturedFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setCapturedPhoto(String(reader.result ?? ""));
		};
		reader.readAsDataURL(file);
		e.target.value = "";
	};
	const handleClearPhoto = () => {
		setCapturedPhoto(null);
		setCapturedFile(null);
	};
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) setSelectedDocument(e.target.files[0]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const savedDraft = sessionStorage.getItem("draft_pengaduan");
		const draftData = savedDraft ? JSON.parse(savedDraft) : {};
		setIsSubmitting(true);
		try {
			if (selectedDocument && !/\.(pdf|jpe?g|png)$/i.test(selectedDocument.name) && ![
				"application/pdf",
				"image/jpeg",
				"image/png"
			].includes(selectedDocument.type)) {
				alert("Hanya file PDF, JPG, JPEG, atau PNG yang diizinkan.");
				return;
			}
			const formData = new FormData();
			formData.append("category_id", String(draftData.category_id || 1));
			formData.append("description", deskripsiAduan);
			formData.append("complaint_date", draftData.tanggalPelaporan || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			formData.append("complainant[nama_lengkap]", draftData.namaPelapor || "");
			formData.append("complainant[nik]", draftData.nik || "");
			formData.append("complainant[alamat]", draftData.alamatPelapor || "");
			formData.append("complainant[jenis_kelamin]", (draftData.jenisKelamin || "Laki-laki").toLowerCase());
			formData.append("complainant[jabatan]", draftData.jabatan || "");
			formData.append("complainant[no_telp]", draftData.noTelpPelapor || "");
			formData.append("complainant[email]", draftData.emailPelapor || "");
			formData.append("company[nama_perusahaan]", draftData.namaPerusahaan || "");
			formData.append("company[sector_id]", String(draftData.sector_id || 1));
			formData.append("company[alamat]", draftData.alamatPerusahaan || "");
			formData.append("company[jumlah_naker]", String(draftData.jumlahPekerja || 0));
			formData.append("company[provinsi]", draftData.provinsi || "");
			formData.append("company[kota_kab]", draftData.kabupaten || "");
			formData.append("company[kecamatan]", draftData.kecamatan || "");
			formData.append("company[kelurahan]", draftData.kelurahan || "");
			formData.append("company[no_telp]", draftData.noTelpPerusahaan || "");
			formData.append("company[email]", draftData.emailPerusahaan || "");
			if (capturedFile) formData.append("attachments[]", capturedFile);
			if (selectedDocument) formData.append("attachments[]", selectedDocument);
			const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
			const res = await fetch(COMPLAINTS_API_URL, {
				method: "POST",
				headers: {
					Accept: "application/json",
					...token ? { Authorization: `Bearer ${token}` } : {}
				},
				body: formData
			});
			const responseData = await res.json().catch(() => null);
			if (!res.ok) {
				console.error("Backend validation error (HTTP 422):", responseData);
				const errorMessages = responseData?.errors ? Object.entries(responseData.errors).map(([field, msgs]) => `• ${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`).join("\n") : responseData?.message || "Data formulir tidak memenuhi validasi server.";
				alert(`Gagal menyimpan pengaduan (422):\n\n${errorMessages}`);
				return;
			}
			sessionStorage.removeItem("draft_pengaduan");
			alert("Pengaduan berhasil disimpan!");
			navigate({ to: "/" });
		} catch (err) {
			console.error("Gagal mengirim pengaduan:", err);
			alert("Terjadi kendala jaringan saat menghubungi server.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-gray-800",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-50 border-b border-gray-100 bg-white shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-[#0E3B68] text-white shadow-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-3xl w-full px-4 py-8 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit: handleSubmit,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-gray-100 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-[16px] font-bold text-gray-900 tracking-tight",
									children: "Detail Aduan & Bukti Pendukung"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-gray-500",
									children: "Lengkapi informasi di bawah ini dengan sejelas-jelasnya untuk memudahkan proses investigasi."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-[11px] font-semibold text-gray-800",
										children: ["Deskripsi Aduan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-gray-400 leading-tight",
										children: "Uraikan kronologi kejadian, pihak yang terlibat, dan kerugian yang dialami. Hindari penggunaan singkatan yang tidak umum."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 5,
										value: deskripsiAduan,
										onChange: (e) => setDeskripsiAduan(e.target.value),
										required: true,
										placeholder: "Contoh: Pada tanggal 10 Oktober 2024, perusahaan X melakukan pemotongan upah sepihak tanpa pemberitahuan sebelumnya sebesar...",
										className: "w-full rounded-xl border border-gray-200 p-3.5 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-[#0E3B68] focus:outline-none focus:ring-1 focus:ring-[#0E3B68] resize-none"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-semibold text-gray-800",
										children: "Bukti Pendukung (PDF/JPG/PNG)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-gray-400 leading-tight",
										children: "Masukkan dokumen bukti pendukung yang telah dikirimkan via email."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileInputRef,
										type: "file",
										accept: ".jpg,.jpeg,.png,.pdf",
										onChange: handleFileChange,
										className: "sr-only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										onClick: () => fileInputRef.current?.click(),
										className: "mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#FAFBFD] p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer",
										children: selectedDocument ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-[11px] text-emerald-700 font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedDocument.name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: (e) => {
														e.stopPropagation();
														setSelectedDocument(null);
													},
													className: "ml-2 text-gray-400 hover:text-red-500",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-gray-500 font-medium",
											children: "Drag a file here to upload or"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: (e) => {
												e.stopPropagation();
												fileInputRef.current?.click();
											},
											className: "mt-2.5 rounded-lg border border-gray-300 bg-white px-5 py-1.5 text-[10.5px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors",
											children: "Browse..."
										})] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-semibold text-gray-800",
										children: "Bukti Foto (Opsional namun sangat disarankan)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-gray-400 leading-tight",
										children: "Di HP: langsung buka kamera. Di laptop: pilih file gambar."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: cameraInputRef,
										type: "file",
										accept: "image/jpeg,image/png,image/jpg",
										capture: "environment",
										onChange: handleCameraChange,
										className: "sr-only"
									}),
									capturedPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mx-auto mt-3 h-52 max-w-md overflow-hidden rounded-xl bg-[#2D3748] flex items-center justify-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: capturedPhoto,
											alt: "Hasil Foto",
											className: "h-full w-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleClearPhoto,
											className: "absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: handleCapture,
										className: "mt-3 flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 bg-[#FAFBFD] text-gray-400 hover:bg-gray-50 hover:text-[#0E3B68] transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-medium",
											children: "Ketuk untuk buka kamera / ambil foto"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleCapture,
											className: "flex flex-col items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#0E3B68] transition-colors cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-10 w-10 place-items-center rounded-xl bg-[#0E3B68] text-white shadow-xs hover:bg-[#0a2c4e] transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: capturedPhoto ? "Ambil Ulang Foto" : "Mulai Kamera" })]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-t border-gray-100 pt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => window.history.back(),
									className: "rounded-lg border border-gray-200 bg-white px-6 py-2 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer",
									children: "Kembali"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSubmitting,
									className: "inline-flex items-center gap-2 rounded-lg bg-[#0E3B68] px-7 py-2 text-[11px] font-semibold text-white shadow-xs hover:bg-[#0a2c4e] transition-colors cursor-pointer disabled:opacity-50",
									children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Menyimpan..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Simpan →" })
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-12 border-t border-[#092847] bg-[#071F38] text-white/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-4 py-10 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-8 md:grid-cols-3 text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-[12px] font-bold text-emerald-400 tracking-wide",
										children: "BINWASNAKER & K3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-white/60 leading-relaxed",
										children: "Ditjen Binwasnaker & K3 adalah unsur pelaksana yang berada di bawah dan bertanggung jawab kepada Menteri Ketenagakerjaan."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 pt-2 text-white/70",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "https://x.com/KemnakerRI",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "hover:text-white transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XIcon, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "https://www.facebook.com/share/1B4YgTmbGG/?mibextid=wwXIfr",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "hover:text-white transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "https://www.instagram.com/kemnaker?stkn=MWdxZjhmMG81aTZ3YQ==",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "hover:text-white transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" })
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[12px] font-bold text-white tracking-wide",
									children: "Customer Support"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-2 text-white/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/faqpage",
										className: "hover:text-white transition-colors",
										children: "› FAQ"
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/",
										className: "hover:text-white transition-colors",
										children: "› Contact Us"
									}) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[12px] font-bold text-white tracking-wide",
									children: "Have a Questions?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-white/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://maps.app.goo.gl/QiLps9tsVMszzHf79",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex items-start gap-2 hover:text-white transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-snug",
											children: "Jl. Gatot Subroto No.51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Jakarta - 12950, Indonesia"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Pengaduan WLKP" })]
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-white/10 pt-5 text-center text-[10px] text-white/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Copyright © BINSIS || 2024 - 2026" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5",
							children: "Designed by TUBSPK"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { BuktiPendukungPage as component };

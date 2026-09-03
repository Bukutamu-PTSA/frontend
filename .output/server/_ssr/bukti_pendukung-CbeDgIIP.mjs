import { r as __toESM } from "../_runtime.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as LoaderCircle, T as Instagram, V as Camera, a as Twitter, b as MapPin, j as Facebook, o as Trash2, p as RefreshCw, r as Video, v as MessageSquare, x as Mail } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bukti_pendukung-CbeDgIIP.js
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
function BuktiPendukungPage() {
	const navigate = useNavigate();
	const [deskripsiAduan, setDeskripsiAduan] = (0, import_react.useState)("");
	const [capturedImage, setCapturedImage] = (0, import_react.useState)(null);
	const [imageBlob, setImageBlob] = (0, import_react.useState)(null);
	const [isCameraActive, setIsCameraActive] = (0, import_react.useState)(false);
	const [loadingSubmit, setLoadingSubmit] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: "environment"
				},
				audio: false
			});
			if (videoRef.current) videoRef.current.srcObject = stream;
			streamRef.current = stream;
			setIsCameraActive(true);
		} catch (err) {
			console.error("Gagal membuka kamera:", err);
			alert("Izin kamera ditolak atau perangkat kamera tidak ditemukan.");
		}
	};
	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		setIsCameraActive(false);
	};
	(0, import_react.useEffect)(() => {
		return () => {
			stopCamera();
		};
	}, []);
	const capturePhoto = () => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			canvas.width = video.videoWidth || 640;
			canvas.height = video.videoHeight || 480;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const dataUrl = canvas.toDataURL("image/jpeg", .85);
				setCapturedImage(dataUrl);
				canvas.toBlob((blob) => {
					if (blob) setImageBlob(blob);
				}, "image/jpeg", .85);
				stopCamera();
			}
		}
	};
	const retakePhoto = () => {
		setCapturedImage(null);
		setImageBlob(null);
		startCamera();
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!deskripsiAduan.trim()) {
			alert("Mohon isi deskripsi kronologi aduan terlebih dahulu.");
			return;
		}
		const draftRaw = sessionStorage.getItem("draft_pengaduan");
		if (!draftRaw) {
			alert("Data pelapor tidak ditemukan. Silakan isi formulir dari awal.");
			navigate({ to: "/pengaduan" });
			return;
		}
		const draft = JSON.parse(draftRaw);
		setLoadingSubmit(true);
		try {
			const payload = new FormData();
			payload.append("category_id", String(draft.category_id || "1"));
			payload.append("description", deskripsiAduan);
			payload.append("complainant[nama_lengkap]", draft.nama_lengkap || "");
			payload.append("complainant[nik]", draft.nik || "");
			payload.append("complainant[alamat]", draft.alamat_pelapor || "");
			payload.append("complainant[jenis_kelamin]", draft.jenis_kelamin || "laki-laki");
			payload.append("complainant[jabatan]", draft.jabatan || "");
			payload.append("complainant[no_telp]", draft.no_telp_pelapor || "");
			if (draft.email_pelapor) payload.append("complainant[email]", draft.email_pelapor);
			payload.append("company[nama_perusahaan]", draft.nama_perusahaan || "");
			payload.append("company[sektor_industri]", draft.sektor_industri || "Industri Pengolahan");
			payload.append("company[alamat]", draft.alamat_perusahaan || "");
			payload.append("company[jumlah_naker]", String(draft.jumlah_naker || "0"));
			payload.append("company[provinsi]", draft.provinsi || "");
			payload.append("company[kota_kab]", draft.kota_kab || "");
			payload.append("company[kecamatan]", draft.kecamatan || "");
			payload.append("company[kelurahan]", draft.kelurahan || "");
			if (draft.no_telp_perusahaan) payload.append("company[no_telp]", draft.no_telp_perusahaan);
			if (draft.email_perusahaan) payload.append("company[email]", draft.email_perusahaan);
			if (imageBlob) payload.append("attachments[]", imageBlob, "bukti_kamera.jpg");
			const response = await fetch(`${BASE_API_URL}/complaints`, {
				method: "POST",
				headers: { Accept: "application/json" },
				body: payload
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal menyimpan pengaduan");
			}
			const result = await response.json();
			console.log("Pengaduan berhasil diajukan:", result);
			sessionStorage.removeItem("draft_pengaduan");
			alert("Laporan pengaduan berhasil dikirim!");
			navigate({ to: "/" });
		} catch (error) {
			console.error("Submit error:", error);
			alert(error.message || "Terjadi kesalahan saat mengirim aduan.");
		} finally {
			setLoadingSubmit(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-[#F4F7FB] font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "hidden"
			}),
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
							children: link.label
						}, link.to))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 py-10 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-bold text-[#032749]",
							children: "Detail Aduan & Bukti Pendukung"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-gray-500",
							children: "Lengkapi informasi di bawah ini dengan sejelas-jelasnya untuk memudahkan proses investigasi."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm font-bold text-gray-800 mb-1",
									children: ["Deskripsi Aduan ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-500 mb-3",
									children: "Uraikan kronologi kejadian, pihak yang terlibat, dan kerugian yang dialami. Hindari penggunaan singkatan yang tidak umum."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 6,
									value: deskripsiAduan,
									onChange: (e) => setDeskripsiAduan(e.target.value),
									placeholder: "Contoh: Pada tanggal 10 Oktober 2024, perusahaan X melakukan pemotongan upah sepihak tanpa pemberitahuan sebelumnya sebesar...",
									required: true,
									className: "w-full rounded-xl border border-gray-300 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749] resize-y"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm font-bold text-gray-800 mb-1",
									children: ["Bukti Foto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-gray-500",
										children: "(Opsional namun sangat disarankan)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-500 mb-4",
									children: "Gunakan kamera perangkat untuk mengambil foto Anda."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-full rounded-xl bg-[#EDF3FA] border border-gray-200 overflow-hidden flex flex-col items-center justify-center p-8 min-h-[340px]",
									children: [capturedImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-full flex flex-col items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: capturedImage,
											alt: "Hasil Bukti Foto",
											className: "max-h-[300px] w-auto rounded-lg object-contain border border-gray-300 shadow-sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-3 mt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: retakePhoto,
												className: "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#032749] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), "Foto Ulang"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setCapturedImage(null);
													setImageBlob(null);
												},
												className: "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-all shadow-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Hapus"]
											})]
										})]
									}) : isCameraActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-full max-w-lg aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center shadow-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
											ref: videoRef,
											autoPlay: true,
											playsInline: true,
											className: "w-full h-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-6 border-2 border-white/40 rounded-lg pointer-events-none" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-full max-w-md h-48 sm:h-56 bg-[#2B3545] rounded-xl flex flex-col items-center justify-center text-white shadow-inner p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-10 text-white/70 mb-3" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-white/80",
												children: "Kamera Siap"
											})
										]
									}), !capturedImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 flex flex-col items-center",
										children: isCameraActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: capturePhoto,
											className: "flex flex-col items-center gap-1 group focus:outline-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "size-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 active:scale-95 transition-all",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-6" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-[#032749] mt-1",
												children: "Jepret Foto"
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: startCamera,
											className: "flex flex-col items-center gap-1 group focus:outline-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "size-12 rounded-xl bg-[#032749] flex items-center justify-center text-white shadow-md group-hover:scale-105 active:scale-95 transition-all",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-6" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-[#032749] mt-1",
												children: "Ambil Foto"
											})]
										})
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-gray-200" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => navigate({ to: "/pengaduan" }),
									className: "rounded-lg border border-gray-300 bg-white px-8 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm",
									children: "Kembali"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loadingSubmit,
									className: "inline-flex items-center gap-2 rounded-lg bg-[#032749] px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-950 active:scale-95 disabled:opacity-70 transition-all shadow-md",
									children: loadingSubmit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Menyimpan..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Simpan", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: "➔"
									})] })
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
export { BuktiPendukungPage as component };

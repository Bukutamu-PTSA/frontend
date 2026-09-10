import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as LoaderCircle, a as User, ct as CircleAlert, x as Printer } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-q-G8Lutm.mjs";
import { n as Route$1 } from "./router-D_q8IFgo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/view_pdf-Dpts_Q3s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_API_URL = "http://192.168.147.199:8000/api";
function formatDateWithTime(dateStr) {
	if (!dateStr) return "-";
	try {
		const d = new Date(dateStr.replace(" ", "T"));
		if (isNaN(d.getTime())) return dateStr;
		return `${d.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric"
		})} - ${d.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true
		}).toUpperCase()}`;
	} catch {
		return dateStr;
	}
}
function formatDateIndoShort(dateStr) {
	if (!dateStr) return "-";
	try {
		const d = new Date(dateStr.replace(" ", "T"));
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric"
		});
	} catch {
		return dateStr;
	}
}
function ViewPdfPage() {
	const complaintId = Route$1.useSearch().id;
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!complaintId) {
			setErrorMsg("ID pengaduan tidak ditemukan di URL.");
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
				if (!res.ok || !json) throw new Error(json?.message || `Gagal memuat dokumen (Status: ${res.status})`);
				const item = json.data ?? json.complaint ?? json;
				setDetail(item);
			} catch (err) {
				console.error("Gagal load dokumen PDF:", err);
				setErrorMsg(err.message || "Terjadi kesalahan saat memuat dokumen.");
			} finally {
				setLoading(false);
			}
		};
		fetchDetail();
	}, [complaintId]);
	const handlePrint = () => {
		window.print();
	};
	const complainant = detail?.complainant || {};
	const company = detail?.company || {};
	const category = detail?.category || {};
	const photoAttachment = (Array.isArray(detail?.attachments) ? detail.attachments : []).find((att) => att.file_type === "photo");
	const photoUrl = photoAttachment?.file_path ? `${BASE_API_URL.replace("/api", "")}/storage/${photoAttachment.file_path.replace(/^\/?storage\//, "")}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end print:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: handlePrint,
				className: "inline-flex items-center gap-2 rounded-lg bg-[#0F2137] px-4 py-2 text-[11.5px] font-semibold text-white shadow-xs hover:bg-[#1a2f4a] transition-colors cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cetak Dokumen" })]
			})
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-96 items-center justify-center rounded-2xl border border-gray-100 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-[12px] text-gray-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#007A64]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Menyiapkan formulir pengaduan #",
					complaintId,
					"..."
				] })]
			})
		}) : errorMsg || !detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-white p-12 text-center shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] font-semibold text-gray-800",
				children: errorMsg || "Dokumen pengaduan tidak ditemukan."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex justify-center pb-12 print:p-0 print:m-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "printable-area",
				className: "w-full max-w-[760px] bg-white p-12 sm:p-16 border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] print:border-none print:shadow-none print:p-0 print:max-w-none text-[#1A202C] text-[11.5px] leading-relaxed font-sans",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center mb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[15px] font-bold text-gray-900 tracking-wide uppercase underline underline-offset-4",
							children: "FORMULIR PENGADUAN PELAYANAN"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 mb-6 text-gray-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-44 shrink-0 font-medium",
									children: "Jenis Layanan Pengaduan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-4 shrink-0",
									children: ":"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-gray-900",
									children: category.category_name || detail.category_name || detail.jenis_pengaduan || "Wajib Lapor Ketenagakerjaan Perusahaan - WLKP"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-44 shrink-0 font-medium",
									children: "Tanggal Pelaporan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-4 shrink-0",
									children: ":"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDateWithTime(detail.complaint_date || detail.created_at) })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[12px] font-bold text-gray-900 mb-2",
							children: "Biodata Pelapor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-gray-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-44 shrink-0 font-medium text-gray-600",
											children: "Nama Pelapor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 shrink-0",
											children: ":"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: complainant.nama_lengkap || complainant.nama || detail.nama_pelapor || "-"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-44 shrink-0 font-medium text-gray-600",
											children: "NIK"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 shrink-0",
											children: ":"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: complainant.nik || detail.nik || "-" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-44 shrink-0 font-medium text-gray-600",
											children: "No Telp"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 shrink-0",
											children: ":"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: complainant.no_telp || detail.no_telp || "-" })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[12px] font-bold text-gray-900 mb-2",
							children: "Biodata Perusahaan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-gray-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-44 shrink-0 font-medium text-gray-600",
											children: "Nama Perusahaan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 shrink-0",
											children: ":"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: company.nama_perusahaan || detail.nama_perusahaan || "-"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-44 shrink-0 font-medium text-gray-600",
											children: "Alamat Perusahaan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 shrink-0",
											children: ":"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "leading-relaxed",
											children: [
												company.alamat || detail.alamat_perusahaan || "-",
												company.kota_kab ? `, ${company.kota_kab}` : "",
												company.provinsi ? ` - ${company.provinsi}` : ""
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-44 shrink-0 font-medium text-gray-600",
											children: "No Telp Perusahaan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 shrink-0",
											children: ":"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: company.no_telp || detail.company_no_telp || "-" })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[12px] font-bold text-gray-900 mb-2",
							children: "Pengaduan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start text-gray-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-44 shrink-0 font-medium text-gray-600",
									children: "Deskripsi Aduan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-4 shrink-0",
									children: ":"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-justify leading-relaxed",
									children: detail.description || detail.deskripsi || "-"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-14 text-gray-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Demikian pengaduan ini saya buat. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.." })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-8 text-center pt-2 text-[11.5px] text-gray-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-between min-h-[220px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Jakarta,",
								" ",
								formatDateIndoShort(detail.complaint_date || detail.created_at)
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1",
								children: "Petugas PTSA,"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "(............................)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: "NIP. ............................."
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-between min-h-[220px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "invisible select-none",
									children: "Jakarta,"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: "Nama Pelapor"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "my-3 h-24 w-28 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center overflow-hidden",
									children: photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: photoUrl,
										alt: "Foto Pelapor",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-8 w-8 text-sky-400 stroke-[1.5]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-gray-900",
										children: complainant.nama_lengkap || complainant.nama || detail.nama_pelapor || "-"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-gray-600",
										children: ["NIK. ", complainant.nik || detail.nik || "-"]
									})]
								})
							]
						})]
					})
				]
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      ` })] });
}
//#endregion
export { ViewPdfPage as component };

import "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as AtSign, T as Eye, j as Building2, x as Hexagon } from "../_libs/lucide-react.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate({ from: "/login" });
	const handleLogin = (e) => {
		e.preventDefault();
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-[#F4F7FB] font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hexagon, { className: "h-7 w-7 text-[#032749] fill-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold text-[#032749]",
						children: "Kementerian Ketenagakerjaan"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex gap-8 text-[15px] text-gray-600",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "hover:text-[#032749] active:scale-95 transition-transform",
							children: "Beranda"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-[#032749] font-semibold border-b-2 border-[#032749] pb-1 active:scale-95 transition-transform",
							children: "Pengaduan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "hover:text-[#032749] active:scale-95 transition-transform",
							children: "Survei"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-xl shadow-lg p-10 w-full max-w-[440px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[28px] font-bold text-center text-[#032749] mb-2",
							children: "Form Login"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-gray-500 text-sm mb-8",
							children: "Masukkan Email dan Password anda untuk login"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "space-y-6",
							onSubmit: handleLogin,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-bold text-[#032749] mb-2",
									children: "Username"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-5 w-5 text-gray-500" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Masukkan email Anda",
										className: "w-full pl-10 pr-4 py-3 border border-gray-400 rounded-full text-sm focus:outline-none focus:border-[#032749] focus:ring-1 focus:ring-[#032749]"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-bold text-[#032749] mb-2",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										placeholder: "Masukkan password Anda",
										className: "w-full pl-4 pr-10 py-3 border border-gray-400 rounded-full text-sm focus:outline-none focus:border-[#032749] focus:ring-1 focus:ring-[#032749]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5 text-gray-500" })
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "remember",
										className: "h-4 w-4 text-[#032749] border-gray-400 rounded focus:ring-[#032749]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "remember",
										className: "ml-2 text-sm font-bold text-[#032749]",
										children: "Remember me"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "w-full bg-[#032749] text-white font-semibold py-3 rounded-full hover:bg-blue-900 active:scale-95 transition-all mt-2",
									children: "Masuk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "text-sm font-bold text-blue-600 hover:underline",
										children: "Lupa password?"
									})
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "bg-[#032749] text-white py-8 px-10 flex flex-col md:flex-row justify-between items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-center md:text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center md:justify-start gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-bold",
							children: "Kemnaker RI"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gray-300",
						children: "© 2024 Kementerian Ketenagakerjaan Republik Indonesia. Seluruh Hak Cipta Dilindungi Undang-Undang."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-6 text-sm text-gray-300 font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white",
							children: "Kebijakan Privasi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white",
							children: "Syarat & Ketentuan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white",
							children: "Peta Situs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white",
							children: "Hubungi Kami"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { LoginPage as component };

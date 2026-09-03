import { r as __toESM } from "../_runtime.mjs";
import { t as kemnaker_logo_default } from "./kemnaker_logo-dwy3NVSV.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as LoaderCircle, L as CircleCheck, M as Eye, N as EyeOff, R as CircleAlert, U as Building2, Y as AtSign } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-aXks2EyW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_API_URL = "http://192.168.147.199:8000/api/auth";
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [successMessage, setSuccessMessage] = (0, import_react.useState)(null);
	const handleLogin = async (e) => {
		e.preventDefault();
		setErrorMessage(null);
		setSuccessMessage(null);
		setLoading(true);
		try {
			const response = await fetch(`${BASE_API_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({
					email,
					password,
					remember
				})
			});
			const result = await response.json();
			if (!response.ok || result.success === false) throw new Error(result.message || "Email atau password yang Anda masukkan salah.");
			const token = result.data?.token;
			const user = result.data?.user;
			if (token) {
				if (remember) {
					localStorage.setItem("auth_token", token);
					if (user) localStorage.setItem("auth_user", JSON.stringify(user));
				} else {
					sessionStorage.setItem("auth_token", token);
					if (user) sessionStorage.setItem("auth_user", JSON.stringify(user));
				}
			}
			setSuccessMessage(result.message || "Login berhasil! Mengalihkan ke dashboard...");
			setTimeout(() => {
				navigate({ to: "/admin/dashboard" });
			}, 800);
		} catch (err) {
			console.error("Login error:", err);
			setErrorMessage(err.message || "Email atau password yang Anda masukkan salah.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-[#F3F6FD] font-sans antialiased text-[#1E293B]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "bg-white border-b border-gray-200/80 px-12 py-4 flex justify-between items-center shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: kemnaker_logo_default,
						alt: "Logo Kemnaker",
						className: "h-8 w-8 object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[20px] font-bold text-[#032749] tracking-tight",
						children: "Kementerian Ketenagakerjaan"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-8 text-[15px] font-semibold text-gray-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-[#032749] transition-colors",
							children: "Beranda"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pengaduan",
							className: "hover:text-[#032749] transition-colors",
							children: "Pengaduan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/survei",
							className: "hover:text-[#032749] transition-colors",
							children: "Survei"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 flex items-center justify-center px-4 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl shadow-[0_10px_35px_-4px_rgba(0,0,0,0.06)] p-12 w-full max-w-[460px] border border-gray-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[32px] font-bold text-center text-[#032749] tracking-tight mb-2",
							children: "Form Login"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-gray-500 text-[14px] mb-8",
							children: "Masukkan Email dan Password anda untuk login"
						}),
						errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage })]
						}),
						successMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMessage })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "space-y-5",
							onSubmit: handleLogin,
							autoComplete: "off",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "email",
									className: "block text-[14px] font-bold text-[#032749] mb-2",
									children: "Username"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute left-4 pointer-events-none text-gray-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "size-5 stroke-[1.75]" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "email",
										type: "text",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "Masukkan email Anda",
										required: true,
										suppressHydrationWarning: true,
										autoComplete: "off",
										className: "w-full pl-12 pr-4 py-3 rounded-full border border-gray-400/80 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#032749] focus:ring-1 focus:ring-[#032749] transition-all"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "password",
									className: "block text-[14px] font-bold text-[#032749] mb-2",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "password",
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "Masukkan password Anda",
										required: true,
										suppressHydrationWarning: true,
										autoComplete: "off",
										className: "w-full pl-5 pr-12 py-3 rounded-full border border-gray-400/80 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#032749] focus:ring-1 focus:ring-[#032749] transition-all"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPassword(!showPassword),
										suppressHydrationWarning: true,
										className: "absolute right-4 text-gray-500 hover:text-[#032749] focus:outline-hidden",
										"aria-label": showPassword ? "Sembunyikan password" : "Tampilkan password",
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5 stroke-[1.75]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5 stroke-[1.75]" })
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "remember",
										checked: remember,
										onChange: (e) => setRemember(e.target.checked),
										suppressHydrationWarning: true,
										className: "size-4.5 rounded-sm border-gray-400 text-[#032749] focus:ring-[#032749] cursor-pointer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "remember",
										className: "ml-2.5 text-[14px] font-bold text-[#032749] cursor-pointer select-none",
										children: "Remember me"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: loading || !!successMessage,
										suppressHydrationWarning: true,
										className: "w-full bg-[#032749] hover:bg-[#021f3b] text-white font-semibold py-3.5 rounded-full text-[15px] shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 transition-all cursor-pointer",
										children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Memverifikasi..."] }) : "Masuk"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center pt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "text-[14px] font-semibold text-[#1D74E7] hover:underline",
										children: "Lupa password?"
									})
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "bg-[#032749] text-white py-6 px-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto text-[13px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 text-center md:text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center md:justify-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[15px] font-bold",
							children: "Kemnaker RI"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-300",
						children: "© 2024 Kementerian Ketenagakerjaan Republik Indonesia. Seluruh Hak Cipta Dilindungi Undang-Undang."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-6 text-gray-300 font-normal",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white transition-colors",
							children: "Kebijakan Privasi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white transition-colors",
							children: "Syarat & Ketentuan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white transition-colors",
							children: "Peta Situs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-white transition-colors",
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

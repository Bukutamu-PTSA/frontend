import React, { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AtSign, Eye, EyeOff, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "../assets/kemnaker_logo.png";
import { AUTH_BASE_URL as BASE_API_URL } from "@/lib/api";

import {
  ORGANIZATION_NAME,
  BRAND_PRIMARY_COLOR,
  NAV_LINKS,
  ORGANIZATION_UNIT,
  COPYRIGHT_START_YEAR,
  COPYRIGHT_END_YEAR,
  FOOTER_LINKS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
} from "@/config/app";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  component: LoginPage,
});

function safeRedirectPath(raw: string | undefined): string {
  if (!raw) return "/admin/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin/dashboard";
  return raw;
}

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          remember: remember,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || VALIDATION_MESSAGES.loginFailed);
      }

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

      setLoginSuccess(true);
      toast.success(result.message || SUCCESS_MESSAGES.login);

      setTimeout(() => {
        navigate({ to: safeRedirectPath(redirectTo) as "/admin/dashboard" });
      }, 800);
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || VALIDATION_MESSAGES.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = BRAND_PRIMARY_COLOR;
  const primaryHover = "#021f3b";

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FD] font-sans antialiased text-[#1E293B]">
      <header className="bg-white border-b border-gray-200/80 px-12 py-4 flex justify-between items-center shadow-xs">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
          <span className="text-[20px] font-bold" style={{ color: primaryColor }}>
            {ORGANIZATION_NAME}
          </span>
        </Link>
        <nav className="flex items-center gap-8 text-[15px] font-semibold text-gray-500">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-[#032749] transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-[0_10px_35px_-4px_rgba(0,0,0,0.06)] p-12 w-full max-w-[460px] border border-gray-100">
          <h2 className="text-[32px] font-bold text-center" style={{ color: primaryColor }} tracking-tight mb-2>
            Form Login
          </h2>
          <p className="text-center text-gray-500 text-[14px] mb-8">
            Masukkan Email dan Password anda untuk login
          </p>

          <form className="space-y-5" onSubmit={handleLogin} autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-[14px] font-bold" style={{ color: primaryColor }} mb-2>
                {FORM_LABELS.login.email}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-gray-500">
                  <AtSign className="size-5 stroke-[1.75]" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={FORM_PLACEHOLDERS.login.email}
                  required
                  suppressHydrationWarning
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-400/80 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#032749] focus:ring-1 focus:ring-[#032749] transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[14px] font-bold" style={{ color: primaryColor }} mb-2>
                {FORM_LABELS.login.password}
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={FORM_PLACEHOLDERS.login.password}
                  required
                  suppressHydrationWarning
                  autoComplete="off"
                  className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-400/80 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#032749] focus:ring-1 focus:ring-[#032749] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                  className="absolute right-4 text-gray-500 hover:text-[#032749] focus:outline-hidden"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 stroke-[1.75]" />
                  ) : (
                    <Eye className="size-5 stroke-[1.75]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                suppressHydrationWarning
                className="size-4.5 rounded-sm border-gray-400 focus:ring-2 focus:ring-[#032749] focus:ring-offset-2 cursor-pointer" style={{ accentColor: primaryColor }}
              />
              <label htmlFor="remember" className="ml-2.5 text-[14px] font-bold cursor-pointer select-none" style={{ color: primaryColor }}>
                {FORM_LABELS.login.rememberMe}
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || loginSuccess}
                suppressHydrationWarning
                className="w-full text-white font-semibold py-3.5 rounded-full text-[15px] shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 transition-all cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  FORM_LABELS.login.submit
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-[#032749] text-white py-8 px-12 mt-auto">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]">
            <div className="flex items-center gap-2">
              <Building2 className="size-4.5" />
              <span className="text-[15px] font-bold">{ORGANIZATION_UNIT}</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-300 font-normal">
              {FOOTER_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-gray-300">
              © {COPYRIGHT_START_YEAR} {ORGANIZATION_NAME}. Seluruh Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { AtSign, Eye, EyeOff, Building2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import logo from '../assets/kemnaker_logo.png';

const BASE_API_URL = "http://192.168.147.199:8000/api/v1/auth";

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  // State Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State Notifikasi & Loading
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          remember: remember,
        }),
      });

      const result = await response.json();

      // Validasi respons berdasarkan struktur backend ("success": true)
      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Email atau password yang Anda masukkan salah.');
      }

      // Ambil token dan data user
      const token = result.data?.token;
      const user = result.data?.user;

      if (token) {
        if (remember) {
          localStorage.setItem('auth_token', token);
          if (user) localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('auth_token', token);
          if (user) sessionStorage.setItem('auth_user', JSON.stringify(user));
        }
      }

      setSuccessMessage(result.message || 'Login berhasil! Mengalihkan ke dashboard...');

      // Redirect ke /dashboard setelah notifikasi muncul
      setTimeout(() => {
        navigate({ to: '/dashboard' });
      }, 800);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Email atau password yang Anda masukkan salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FD] font-sans antialiased text-[#1E293B]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 px-12 py-4 flex justify-between items-center shadow-xs">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
          <span className="text-[20px] font-bold text-[#032749] tracking-tight">
            Kementerian Ketenagakerjaan
          </span>
        </Link>
        <nav className="flex items-center gap-8 text-[15px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#032749] transition-colors">Beranda</Link>
          <Link to="/pengaduan" className="hover:text-[#032749] transition-colors">Pengaduan</Link>
          <Link to="/survei" className="hover:text-[#032749] transition-colors">Survei</Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-[0_10px_35px_-4px_rgba(0,0,0,0.06)] p-12 w-full max-w-[460px] border border-gray-100">
          <h2 className="text-[32px] font-bold text-center text-[#032749] tracking-tight mb-2">
            Form Login
          </h2>
          <p className="text-center text-gray-500 text-[14px] mb-8">
            Masukkan Email dan Password anda untuk login
          </p>

          {/* Notifikasi Gagal (Merah) */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 shadow-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Notifikasi Sukses (Hijau) */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 shadow-xs">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin} autoComplete="off">
            {/* Input Email / Username */}
            <div>
              <label htmlFor="email" className="block text-[14px] font-bold text-[#032749] mb-2">
                Username
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
                  placeholder="Masukkan email Anda"
                  required
                  suppressHydrationWarning
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-400/80 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-[#032749] focus:ring-1 focus:ring-[#032749] transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-[14px] font-bold text-[#032749] mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
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
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 stroke-[1.75]" />
                  ) : (
                    <Eye className="size-5 stroke-[1.75]" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                suppressHydrationWarning
                className="size-4.5 rounded-sm border-gray-400 text-[#032749] focus:ring-[#032749] cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2.5 text-[14px] font-bold text-[#032749] cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Tombol Masuk */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !!successMessage}
                suppressHydrationWarning
                className="w-full bg-[#032749] hover:bg-[#021f3b] text-white font-semibold py-3.5 rounded-full text-[15px] shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </div>

            {/* Lupa Password */}
            <div className="text-center pt-1">
              <a href="#" className="text-[14px] font-semibold text-[#1D74E7] hover:underline">
                Lupa password?
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#032749] text-white py-6 px-12 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto text-[13px]">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Building2 className="size-4.5" />
            <span className="text-[15px] font-bold">Kemnaker RI</span>
          </div>
          <p className="text-gray-300">
            © 2024 Kementerian Ketenagakerjaan Republik Indonesia. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-gray-300 font-normal">
          <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-white transition-colors">Syarat &amp; Ketentuan</a>
          <a href="#" className="hover:text-white transition-colors">Peta Situs</a>
          <a href="#" className="hover:text-white transition-colors">Hubungi Kami</a>
        </div>
      </footer>
    </div>
  );
}
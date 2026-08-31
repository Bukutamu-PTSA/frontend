import React, { useState } from 'react';
import logo from '../assets/kemnaker_logo.png'; // Sesuaikan relative path ini
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AtSign, Eye, EyeOff, Building2 } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate({ from: '/login' });
  
  // State untuk toggle visibilitas password
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo Perusahaan" className="h-7 w-7 object-contain" />
          <h1 className="text-xl font-bold text-[#032749]">
            Kementerian Ketenagakerjaan
          </h1>
        </div>
        <nav className="flex gap-8 text-[15px] text-gray-600">
          <button type="button" className="hover:text-[#032749] active:scale-95 transition-transform">Beranda</button>
          <button type="button" className="text-[#032749] font-semibold border-b-2 border-[#032749] pb-1 active:scale-95 transition-transform">
            Pengaduan
          </button>
          <button type="button" className="hover:text-[#032749] active:scale-95 transition-transform">Survei</button>
        </nav>
      </header>

      {/* --- MAIN CONTENT (LOGIN CARD) --- */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-[440px]">
          <h2 className="text-[28px] font-bold text-center text-[#032749] mb-2">
            Form Login
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Masukkan Email dan Password anda untuk login
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Input Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-[#032749] mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan email Anda"
                  className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-full text-sm focus:outline-none focus:border-[#032749] focus:ring-1 focus:ring-[#032749]"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#032749] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password Anda"
                  className="w-full pl-4 pr-12 py-3 border border-gray-400 rounded-full text-sm focus:outline-none focus:border-[#032749] focus:ring-1 focus:ring-[#032749]"
                />
                {/* Tombol Toggle Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#032749] focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-[#032749] border-gray-400 rounded focus:ring-[#032749]"
              />
              <label htmlFor="remember" className="ml-2 text-sm font-bold text-[#032749] cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Button Masuk */}
            <button
              type="submit"
              className="w-full bg-[#032749] text-white font-semibold py-3 rounded-full hover:bg-blue-900 active:scale-95 transition-all mt-2"
            >
              Masuk
            </button>

            {/* Lupa Password */}
            <div className="text-center pt-2">
              <a href="#" className="text-sm font-bold text-blue-600 hover:underline">
                Lupa password?
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#032749] text-white py-8 px-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">Kemnaker RI</span>
          </div>
          <p className="text-sm text-gray-300">
            © 2024 Kementerian Ketenagakerjaan Republik Indonesia. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-gray-300 font-medium">
          <a href="#" className="hover:text-white">Kebijakan Privasi</a>
          <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
          <a href="#" className="hover:text-white">Peta Situs</a>
          <a href="#" className="hover:text-white">Hubungi Kami</a>
        </div>
      </footer>
      
    </div>
  );
}
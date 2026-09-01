import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  FileText,
  Twitter,
  Facebook,
  MessageSquare,
  Instagram,
  MapPin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import heroImage from "@/assets/gedung-kemnaker.jpg";
import logoKemnaker from "@/assets/kemnaker_logo.png";
import logoBinwasnaker from "@/assets/binwasnaker_logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sistem Pengaduan Tenaga Kerja | Kemnaker RI" },
      {
        name: "description",
        content:
          "Portal resmi pelaporan pelanggaran norma kerja, perselisihan hubungan industrial, dan masalah ketenagakerjaan secara aman dan terpantau.",
      },
      { property: "og:title", content: "Sistem Pengaduan Tenaga Kerja | Kemnaker RI" },
      {
        property: "og:description",
        content:
          "Laporkan masalah ketenagakerjaan Anda melalui portal resmi. Data pelapor dijaga kerahasiaannya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Pengaduan", to: "/pengaduan" },
  { label: "Survei", to: "/survei" },
];

const stats = [
  { icon: BadgeCheck, value: "12.450+", label: "Laporan Diselesaikan" },
];

const steps = [
  {
    title: "Siapkan Data & Bukti",
    body: "Kumpulkan dokumen pendukung seperti slip gaji, kontrak kerja, atau bukti komunikasi yang relevan dengan aduan Anda.",
  },
  {
    title: "Isi Formulir Pengaduan",
    body: "Lengkapi formulir secara online dengan detail kronologi kejadian secara jelas dan faktual pada portal ini.",
  },
];

const socials = [
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: MessageSquare, href: "#" },
  { icon: Instagram, href: "#" },
];

function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          {/* Logo & Judul Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoKemnaker}
              alt="Logo Kemnaker"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-[#032749]">
              Kementerian Ketenagakerjaan
            </span>
          </Link>

          {/* Menu Navigasi & Tombol Masuk */}
          <div className="flex items-center gap-8">
            <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex text-[15px]">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="pb-1 transition-colors font-medium text-gray-600 hover:text-[#032749]"
                  activeProps={{
                    className: "text-[#032749] font-bold border-b-2 border-[#032749]",
                  }}
                  activeOptions={{ exact: link.to === "/" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button
              size="sm"
              onClick={() => navigate({ to: "/login" })}
              className="bg-[#032749] hover:bg-blue-950 text-white rounded-md px-6 py-2 font-semibold shadow-sm transition-all"
            >
              Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1">
        {/* --- HERO SECTION FULL BACKGROUND --- */}
        <section className="relative w-full min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden px-8 py-16">
          {/* Background Gedung */}
          <img
            src={heroImage}
            alt="Gedung Kemnaker RI"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Overlay Putih Semi-Transparan */}
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px]" />

          {/* Konten Hero */}
          <div className="relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Kolom Kiri: Teks & Tombol Aksi */}
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-[#032749] shadow-sm">
                <BadgeCheck className="size-4 text-blue-600 fill-blue-600 text-white" />
                <span>Pelayanan Terpadu Satu Atap</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#032749] leading-tight">
                Sistem Pengaduan Tenaga Kerja
              </h1>

              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl">
                Platform resmi untuk melaporkan pelanggaran norma kerja, perselisihan hubungan
                industrial, dan masalah ketenagakerjaan lainnya secara aman dan terpantau.
              </p>

              <div>
                <Button
                  size="lg"
                  onClick={() => navigate({ to: "/pengaduan" })}
                  className="bg-[#032749] hover:bg-blue-950 text-white font-semibold rounded-lg px-6 py-3.5 shadow-md flex items-center gap-2.5 transition-all"
                >
                  <FileText className="size-4" />
                  Formulir Pengaduan
                </Button>
              </div>
            </div>

            {/* Kolom Kanan: Logo Kemnaker & Binwasnaker */}
            <div className="md:col-span-5 flex items-center justify-center md:justify-end gap-6 sm:gap-10">
              <img
                src={logoKemnaker}
                alt="Logo Kemnaker"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-md"
              />
              <img
                src={logoBinwasnaker}
                alt="Logo Binwasnaker"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-md"
              />
            </div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className="bg-white border-y border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-10">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto size-7 text-[#032749]" aria-hidden="true" />
                <p className="mt-3 text-3xl font-bold text-[#032749]">{value}</p>
                <p className="mt-1 text-sm text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- STEPS SECTION --- */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold text-[#032749] md:text-3xl">
            Proses Pelaporan yang Transparan
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-gray-600">
            Ikuti langkah mudah ini untuk melaporkan masalah ketenagakerjaan Anda. Kami menjamin
            kerahasiaan data pelapor.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#032749] text-sm font-bold text-white mb-4">
                  {i + 1}
                </span>
                <h3 className="text-base font-bold text-[#032749]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#032749] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Kolom 1 */}
            <div>
              <h3 className="text-xl font-bold">
                BINWASNAKER <span className="text-emerald-400">&amp; K3</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Ditjen Binwasnaker &amp; K3 adalah unsur pelaksana yang berada di bawah
                dan bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="mt-6 flex gap-3">
                {socials.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Kolom 2 */}
            <div>
              <h4 className="text-lg font-semibold">Customer Support</h4>
              <hr className="mt-4 border-white/15" />
              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">›</span>
                  <a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">›</span>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Hubungi Kami</a>
                </li>
              </ul>
            </div>

            {/* Kolom 3 */}
            <div>
              <h4 className="text-lg font-semibold">Ada Pertanyaan?</h4>
              <hr className="mt-4 border-white/15" />
              <div className="mt-5 flex gap-3 text-sm text-gray-300">
                <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="leading-relaxed">
                  Jl. Jend. Gatot Subroto Kav. 51, RT.5/RW.4, Kuningan Timur,
                  Kecamatan Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12950
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Mail className="size-5 text-emerald-400" />
                <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Pengaduan WLKP
                </a>
              </div>
            </div>
          </div>

          <hr className="mt-10 border-white/15" />

          <div className="mt-6 flex flex-col items-center gap-1 text-center text-sm text-gray-300">
            <p>© 2024–2026 Kementerian Ketenagakerjaan RI. Seluruh Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
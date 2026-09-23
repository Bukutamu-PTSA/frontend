import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import { XIcon } from "@/components/x-icon";

const socials = [
  { icon: XIcon, href: "https://x.com/KemnakerRI" },
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/1B4YgTmbGG/?mibextid=wwXIfr",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/kemnaker?stkn=MWdxZjhmMG81aTZ3YQ==",
  },
];
import { Button } from "@/components/ui/button";
import { apiUrl, authHeaders } from "@/lib/api";

import logoKemnaker from "@/assets/kemnaker_logo.png";

export const Route = createFileRoute("/faqpage")({
  head: () => ({
    meta: [{ title: "FAQ · PTSA-KEMNAKER" }],
  }),
  component: FaqPage,
});

interface FaqItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

interface ApiJson {
  success?: boolean;
  data?: unknown;
}

const FAQ_LIST_URL = apiUrl("faqs");

const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Pengaduan", to: "/pengaduan" },
  { label: "Survei", to: "/survei" },
];

function FaqPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const fetchFaqs = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch(FAQ_LIST_URL, {
        method: "GET",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat data (${response.status}).`);
      }

      const json: unknown = await response.json();
      const rawList = Array.isArray(json) ? json : (json as ApiJson)?.data;
      const list = Array.isArray(rawList) ? rawList : [];

      setRows(
        list.map((raw) => {
          const item = raw as {
            id?: unknown;
            pertanyaan?: unknown;
            question?: unknown;
            jawaban?: unknown;
            answer?: unknown;
          };
          return {
            id: Number(item.id),
            pertanyaan: String(item.pertanyaan ?? item.question ?? ""),
            jawaban: String(item.jawaban ?? item.answer ?? ""),
          };
        }),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat data FAQ.";
      console.error("Gagal mengambil data FAQ:", err);
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7FB] font-sans">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoKemnaker} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-[#032749]">Kementerian Ketenagakerjaan</span>
          </Link>

          <div className="flex items-center gap-8">
            <nav
              aria-label="Navigasi utama"
              className="hidden items-center gap-8 text-[15px] md:flex"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="pb-1 font-medium text-gray-600 transition-colors hover:text-[#032749]"
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
              className="rounded-md bg-[#032749] px-6 py-2 font-semibold text-white shadow-sm transition-all hover:bg-blue-950"
            >
              Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-14">
          <div className="text-center">
            <span className="inline-block rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#032749] shadow-sm">
              Frequently Asked Questions
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#032749] sm:text-4xl">
              FAQ
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] text-slate-600">
              Pertanyaan yang paling sering ditanyakan. Temukan jawaban seputar layanan Pelayanan
              Terpadu Satu Atap Kemnaker.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat FAQ...
              </div>
            ) : loadError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-red-700">
                  <TriangleAlert className="h-4 w-4" />
                  <p>Gagal memuat data dari server: {loadError}</p>
                </div>
                <button
                  type="button"
                  onClick={fetchFaqs}
                  disabled={loading}
                  className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {loading ? "Memuat..." : "Coba Lagi"}
                </button>
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center text-sm text-gray-400">
                Belum ada FAQ yang tersedia.
              </div>
            ) : (
              rows.map((item) => {
                const isOpen = open === item.id;
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-[15px] font-semibold text-[#032749]">
                        {item.pertanyaan}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 text-[14px] leading-relaxed text-slate-600">
                        {item.jawaban}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#032749] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold">
                BINWASNAKER <span className="text-emerald-400">&amp; K3</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Ditjen Binwasnaker &amp; K3 adalah unsur pelaksana yang berada di bawah dan
                bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="mt-6 flex gap-3">
                {socials.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Customer Support</h4>
              <hr className="mt-4 border-white/15" />
              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">›</span>
                  <Link
                    to="/faqpage"
                    className="font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">›</span>
                  <a href="#" className="transition-colors hover:text-emerald-400">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Ada Pertanyaan?</h4>
              <hr className="mt-4 border-white/15" />
              <a
                href="https://maps.app.goo.gl/QiLps9tsVMszzHf79"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex gap-3 text-sm text-gray-300 transition-colors hover:text-emerald-400"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="leading-relaxed">
                  Jl. Jend. Gatot Subroto Kav. 51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi,
                  Kota Jakarta Selatan, DKI Jakarta 12950
                </p>
              </a>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Mail className="size-5 text-emerald-400" />
                <a href="#" className="text-gray-300 transition-colors hover:text-emerald-400">
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

import React, { useState, useEffect } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Building2,
  Users,
  Camera,
  ShieldCheck,
  CreditCard,
  Facebook,
  Instagram,
  MapPin,
  Mail,
  Loader2,
  XIcon,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';
import { extractList, isRecord } from '@/lib/json';
import logoKemnaker from '@/assets/kemnaker_logo.png';

const FAQ_API_URL = apiUrl('faqs');

export interface FAQItem {
  id: string | number;
  pertanyaan: string;
  jawaban: string;
  poin_jawaban?: Array<{
    judul: string;
    deskripsi: string;
  }>;
  catatan?: string;
}

function toFaqItem(row: unknown): FAQItem | null {
  if (!isRecord(row)) return null;

  const pertanyaan = row['pertanyaan'] ?? row['question'] ?? row['judul'];
  const jawaban = row['jawaban'] ?? row['answer'] ?? row['isi'];
  if (typeof pertanyaan !== 'string' || typeof jawaban !== 'string') return null;

  const poin = row['poin_jawaban'];
  const item: FAQItem = {
    id: (row['id'] as FAQItem['id']) ?? '',
    pertanyaan,
    jawaban,
  };

  if (Array.isArray(poin)) item.poin_jawaban = poin as NonNullable<FAQItem['poin_jawaban']>;
  if (typeof row['catatan'] === 'string') item.catatan = row['catatan'];

  return item;
}

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/pengaduan", label: "Pengaduan" },
  { to: "/survei", label: "Survei" },
];

export const FaqPage: React.FC = () => {
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(FAQ_API_URL, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data FAQ dari server');
        }

        const result: unknown = await response.json();
        if (!active) return;

        const items = extractList(result)
          .map((row) => toFaqItem(row))
          .filter((item): item is FAQItem => item !== null);
        setFaqs(items);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchFaqs();
    return () => {
      active = false;
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const getQuestionIcon = (index: number) => {
    const icons = [Users, FileText, Camera, ShieldCheck, CreditCard];
    const IconComponent = icons[index % icons.length] ?? Users;
    return <IconComponent className="w-5 h-5 text-blue-900 flex-shrink-0" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoKemnaker} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-[#032749]">Kementerian Ketenagakerjaan</span>
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-8 md:flex text-[15px]"
          >
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
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Title Header */}
          <div className="text-center mb-10 space-y-3">
            <h1 className="text-3xl font-extrabold text-[#0a2540] tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
              Partisipasi Anda sangat berarti bagi kami untuk meningkatkan kualitas layanan
              Pelayanan Terpadu Satu Atap (PTSA) Kementerian Ketenagakerjaan.
            </p>
          </div>

          {/* Status Loading & Error */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-blue-900" />
              <p className="text-xs">Memuat daftar pertanyaan...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
              {error}
            </div>
          )}

          {/* Daftar Accordion FAQ */}
          {!isLoading && !error && (
            <div className="space-y-4">
              {faqs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Belum ada data pertanyaan yang tersedia.
                </div>
              ) : (
                faqs.map((faq, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={faq.id || index}
                      className={`bg-white rounded-xl transition-all duration-200 ${
                        isOpen
                          ? 'border-2 border-slate-300 shadow-sm'
                          : 'border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Tombol Header Accordion */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-center justify-between p-5 text-left gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="p-2 rounded-lg bg-slate-100 flex items-center justify-center">
                            {getQuestionIcon(index)}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            {faq.pertanyaan}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {/* Badan Accordion (Jawaban) */}
                      {isOpen && (
                        <div className="px-6 pb-6 pt-1 text-xs text-slate-600 space-y-4 border-t border-slate-100">
                          <p className="leading-relaxed text-slate-600 pt-3">{faq.jawaban}</p>

                          {faq.poin_jawaban && faq.poin_jawaban.length > 0 && (
                            <div className="space-y-3">
                              {faq.poin_jawaban.map((poin, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 space-y-1"
                                >
                                  <p className="font-semibold text-blue-950 flex items-center gap-2">
                                    <span>{poin.judul}</span>
                                  </p>
                                  <p className="text-slate-600 leading-relaxed text-[11px]">
                                    {poin.deskripsi}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {faq.catatan && (
                            <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 text-slate-600 flex items-start gap-2.5">
                              <Info className="w-4 h-4 text-blue-900 mt-0.5 flex-shrink-0" />
                              <div className="text-[11px] leading-relaxed">
                                <span className="font-semibold text-blue-950">
                                  Ketentuan Berkas Digital:
                                </span>{' '}
                                {faq.catatan}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#032749] text-white mt-16">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Kolom 1: Brand */}
            <div>
              <h3 className="text-xl font-bold">
                BINWASNAKER <span className="text-emerald-400">& K3</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Ditjen Binwasnaker & K3 adalah unsur pelaksana yang berada di bawah dan
                bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://x.com/KemnakerRI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                >
                  <XIcon className="size-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1B4YgTmbGG/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                >
                  <Facebook className="size-4" />
                </a>
                <a
                  href="https://www.instagram.com/kemnaker?stkn=MWdxZjhmMG81aTZ3YQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                >
                  <Instagram className="size-4" />
                </a>
              </div>
            </div>

            {/* Kolom 2: Kontak & Bantuan */}
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
                <a
                  href="mailto:pengaduanwlkp@gmail.com"
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  Pengaduan WLKP
                </a>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15">
                <a
                  href="#faq"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <span className="text-emerald-400">›</span> Kembali ke FAQ
                </a>
              </div>
            </div>
          </div>

          <hr className="mt-10 border-white/15" />

          <div className="mt-6 flex flex-col items-center gap-1 text-center text-sm text-gray-300">
            <p>Copyright © BINSIS || 2024–2026</p>
            <p>Designed by TUBSPK</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const Route = createFileRoute('/faqpage')({
  component: FaqPage,
});

export default FaqPage;
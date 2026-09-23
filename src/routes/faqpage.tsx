import React, { useState, useEffect } from 'react';
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
  Twitter,
  Facebook,
  Instagram,
  MapPin,
  Mail,
  Loader2,
} from 'lucide-react';

// Struktur response data dari backend
export interface FAQItem {
  id: string | number;
  pertanyaan: string;
  jawaban: string;
  // Opsional: jika backend mengirimkan sub-poin atau list khusus
  poin_jawaban?: Array<{
    judul: string;
    deskripsi: string;
  }>;
  catatan?: string;
}

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Default terbuka item ke-2 seperti di gambar
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data FAQ dari Backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        // Ganti URL endpoint berikut sesuai konfigurasi route backend Anda
        const response = await fetch('/api/faq');
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data FAQ dari server');
        }

        const result = await response.json();
        // Sesuaikan jika data bersarang, misalnya: result.data
        setFaqs(Array.isArray(result) ? result : result.data || []);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Helper ikon pertanyaan sesuai urutan index
  const getQuestionIcon = (index: number) => {
    const icons = [Users, FileText, Camera, ShieldCheck, CreditCard];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5 text-blue-900 flex-shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* ================= HEADER / NAVBAR ================= */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-blue-950 flex items-center justify-center">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-wide">
              Kementerian Ketenagakerjaan
            </span>
          </div>

          <nav className="flex items-center gap-8 text-xs font-medium text-slate-500">
            <a href="#beranda" className="hover:text-slate-900 transition-colors">
              Beranda
            </a>
            <a href="#pengaduan" className="hover:text-slate-900 transition-colors">
              Pengaduan
            </a>
            <a href="#survei" className="hover:text-slate-900 transition-colors">
              Survei
            </a>
          </nav>
        </div>
      </header>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
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
                        {/* Teks Jawaban Utama */}
                        <p className="leading-relaxed text-slate-600 pt-3">{faq.jawaban}</p>

                        {/* Sub-poin (jika format data backend menyediakan poin rincian) */}
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

                        {/* Kotak Catatan / Ketentuan */}
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
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0a2540] text-slate-300 text-xs pt-12 pb-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-700/60">
          {/* Kolom 1: Profil */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-teal-400 tracking-wider">
              BINWASNAKER &amp; K3
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed pr-4">
              Ditjen Binwasnaker &amp; K3 adalah unsur pelaksana yang berada di bawah dan
              bertanggung jawab kepada Menteri Ketenagakerjaan.
            </p>
            <div className="flex items-center gap-3 pt-2 text-white">
              <a href="#" className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Tautan */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Customer Support</h3>
            <ul className="space-y-2.5 text-slate-400 text-[11px]">
              <li>
                <a href="#faq" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="text-slate-500">›</span> FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="text-slate-500">›</span> Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak Alamat */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Have a Questions?</h3>
            <div className="space-y-3 text-[11px] text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Jl. Gatot Subroto No.51, RT.5/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota
                  Jakarta Selatan, Daerah Khusus Ibukota Jakarta - 12950, Indonesia
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Pengaduan WLKP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto px-6 pt-6 text-center text-[11px] text-slate-500 space-y-1">
          <p>Copyright © BINSIS || 2024 - 2026</p>
          <p>Designed by TUBSPK</p>
        </div>
      </footer>
    </div>
  );
};

export default FaqPage;
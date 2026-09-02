import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Send,
  Building2,
  Twitter,
  Facebook,
  MessageSquare,
  Instagram,
  MapPin,
  Mail,
  Loader2,
} from "lucide-react";
import logoKemnaker from "@/assets/kemnaker_logo.png";

const BASE_API_URL = "http://192.168.147.199:8000/api";

export const Route = createFileRoute("/survei")({
  head: () => ({
    meta: [{ title: "Form Survei Layanan PTSA | Kemnaker RI" }],
  }),
  component: FormSurveiPage,
});

interface OfficerItem {
  id: string | number;
  name: string;
}

const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Pengaduan", to: "/pengaduan" },
  { label: "Survei", to: "/survei" },
];

const socials = [
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: MessageSquare, href: "#" },
  { icon: Instagram, href: "#" },
];

const ratingOptions = ["Baik", "Cukup", "Kurang"];

// Helper parser fleksibel untuk list petugas dari backend
const parseOfficerData = (res: any): OfficerItem[] => {
  if (!res) return [];
  const rawData = res.data ? res.data : res;

  if (typeof rawData === "object" && !Array.isArray(rawData)) {
    return Object.entries(rawData).map(([id, name]) => ({
      id: String(id),
      name: String(name),
    }));
  }

  if (Array.isArray(rawData)) {
    return rawData.map((item: any) => ({
      id: String(item.id ?? item.code ?? item.officer_id ?? ""),
      name: String(item.name ?? item.nama ?? item.officer_name ?? item.nama_petugas ?? item),
    }));
  }

  return [];
};

function FormSurveiPage() {
  const navigate = useNavigate();

  // State Form Survei
  const [officers, setOfficers] = useState<OfficerItem[]>([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    officer_id: "",
    officer_name: "",
    komunikasi_petugas: "",
    penjelasan_materi: "",
    sarana_prasarana: "",
    catatan: "",
  });

  // Fetch daftar nama petugas dari backend
  useEffect(() => {
    const fetchOfficers = async () => {
      setLoadingOfficers(true);
      try {
        // Endpoint petugas (sesuaikan dengan route backend jika ada nama route spesifik)
        const res = await fetch(`${BASE_API_URL}/officers`).catch(() =>
          fetch(`${BASE_API_URL}/petugas`)
        );

        if (res && res.ok) {
          const data = await res.json();
          setOfficers(parseOfficerData(data));
        } else {
          // Mock data fallback jika endpoint belum dibuat di backend
          setOfficers([
            { id: "1", name: "Ahmad Fauzi - Petugas PTSA 1" },
            { id: "2", name: "Siti Rahmawati - Petugas PTSA 2" },
            { id: "3", name: "Budi Santoso - Petugas PTSA 3" },
          ]);
        }
      } catch (error) {
        console.error("Gagal memuat petugas:", error);
      } finally {
        setLoadingOfficers(false);
      }
    };

    fetchOfficers();
  }, []);

  const handleOfficerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedObj = officers.find((o) => String(o.id) === selectedId);
    setFormData((prev) => ({
      ...prev,
      officer_id: selectedId,
      officer_name: selectedObj ? selectedObj.name : "",
    }));
  };

  const handleRatingSelect = (field: "komunikasi_petugas" | "penjelasan_materi" | "sarana_prasarana", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.officer_id) {
      alert("Silakan pilih nama petugas terlebih dahulu.");
      return;
    }
    if (!formData.komunikasi_petugas || !formData.penjelasan_materi || !formData.sarana_prasarana) {
      alert("Silakan lengkapi seluruh penilaian survei.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${BASE_API_URL}/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim survei");
      }

      alert("Terima kasih! Survei kepuasan layanan Anda berhasil dikirim.");
      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
      alert("Terjadi kendala saat mengirim survei. Silakan coba kembali.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoKemnaker} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-[#032749]">
              Kementerian Ketenagakerjaan
            </span>
          </Link>

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
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EDF3FA] px-3 py-1 text-xs font-bold text-[#032749] mb-4">
              <Building2 className="size-3.5" />
              <span>KEMNAKER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#032749]">
              FORM SURVEI
            </h1>
            <p className="text-sm font-bold text-[#032749]/80 mt-1">
              #SURVEI LAYANAN PTSA
            </p>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-2 leading-relaxed">
              Partisipasi Anda sangat berarti bagi kami untuk meningkatkan kualitas layanan Pelayanan Terpadu Satu Atap (PTSA) Kementerian Ketenagakerjaan.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Masukkan Nama Petugas */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    1
                  </span>
                  <label className="text-sm font-bold text-gray-900">
                    Masukkan Nama Petugas:
                  </label>
                </div>
                <select
                  value={formData.officer_id}
                  onChange={handleOfficerChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                >
                  <option value="">
                    {loadingOfficers ? "Memuat petugas..." : "Pilih"}
                  </option>
                  {officers.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Komunikasi Petugas */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    2
                  </span>
                  <label className="text-sm font-bold text-gray-900">
                    Bagaimana Komunikasi Petugas Dalam Memberikan Layanan:
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {ratingOptions.map((option) => {
                    const isSelected = formData.komunikasi_petugas === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleRatingSelect("komunikasi_petugas", option)}
                        className={`py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-[#032749] text-white border-[#032749] shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Penjelasan Materi */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    3
                  </span>
                  <label className="text-sm font-bold text-gray-900">
                    Bagaimana Penjelasan Materi yang Diberikan oleh Petugas:
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {ratingOptions.map((option) => {
                    const isSelected = formData.penjelasan_materi === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleRatingSelect("penjelasan_materi", option)}
                        className={`py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-[#032749] text-white border-[#032749] shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Sarana dan Prasarana */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    4
                  </span>
                  <label className="text-sm font-bold text-gray-900">
                    Bagaimana Sarana dan Prasarana Layanan PTSA:
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {ratingOptions.map((option) => {
                    const isSelected = formData.sarana_prasarana === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleRatingSelect("sarana_prasarana", option)}
                        className={`py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-[#032749] text-white border-[#032749] shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Catatan */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    5
                  </span>
                  <label className="text-sm font-bold text-gray-900">
                    Catatan:
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={formData.catatan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, catatan: e.target.value }))}
                  placeholder="isi dengan singkat catatan untuk perbaikan pelayanan"
                  className="w-full rounded-2xl border border-gray-300 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749] resize-none"
                />
              </div>

              {/* Tombol Kirim Survei */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#032749] px-7 py-3 text-sm font-semibold text-white hover:bg-blue-950 active:scale-95 disabled:opacity-70 transition-all shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Survei
                      <Send className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#032749] text-white mt-16">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
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
                  <a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Have a Questions?</h4>
              <hr className="mt-4 border-white/15" />
              <div className="mt-5 flex gap-3 text-sm text-gray-300">
                <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="leading-relaxed">
                  Jl. Gatot Subroto No.51, RT.5/RW.4, Kuningan Timur.
                  Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus
                  Jakarta - 12950 Jakarta - Indonesia
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
            <p>Copyright © BINSIS || 2024 – 2026</p>
            <p>
              Designed by <span className="text-emerald-400">TUBSPK</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  FileText,
  Facebook,
  Instagram,
  MapPin,
  Mail,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiUrl, authHeaders } from "@/lib/api";

import heroImage from "@/assets/gedung-kemnaker.jpg";
import logoKemnaker from "@/assets/kemnaker_logo.png";

import {
  APP_NAME,
  ORGANIZATION_NAME,
  ORGANIZATION_UNIT,
  ORGANIZATION_UNIT_FULL,
  BRAND_PRIMARY_COLOR,
  DEFAULT_TOTAL_LAPORAN,
  NAV_LINKS,
  HERO_STEPS,
  SOCIAL_LINKS,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ADDRESS_LINE_3,
  CONTACT_EMAIL,
  CONTACT_EMAIL_LABEL,
  MAPS_URL,
  COPYRIGHT_START_YEAR,
  COPYRIGHT_END_YEAR,
  PAGE_TITLES,
  PAGE_DESCRIPTIONS,
  FOOTER_LINKS,
} from "@/config/app";

const nf = new Intl.NumberFormat("id-ID");

const iconMap = {
  XIcon,
  Facebook,
  Instagram,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLES.home },
      {
        name: "description",
        content: PAGE_DESCRIPTIONS.home,
      },
      { property: "og:title", content: PAGE_TITLES.home },
      {
        property: "og:description",
        content: PAGE_DESCRIPTIONS.home,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const [totalLaporan, setTotalLaporan] = useState<number>(DEFAULT_TOTAL_LAPORAN);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTotalLaporan = async () => {
      try {
        const res = await fetch(apiUrl("dashboard/complaint-summary"), {
          headers: authHeaders(),
          signal: controller.signal,
        });
        if (!res.ok) return;

        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

        const total = items.reduce(
          (sum: number, item: any) => sum + Number(item.count ?? item.total ?? 0),
          0,
        );

        if (total > 0) setTotalLaporan(total);
      } catch {
      }
    };

    fetchTotalLaporan();
    return () => controller.abort();
  }, []);

  const stats = [
    {
      icon: BadgeCheck,
      value: `${nf.format(totalLaporan)}+`,
      label: "Laporan Diselesaikan",
    },
  ];

  const brandStyle = {
    color: BRAND_PRIMARY_COLOR,
  } as React.CSSProperties;

  const primaryButtonStyle = {
    backgroundColor: BRAND_PRIMARY_COLOR,
  } as React.CSSProperties;

  const primaryHoverStyle = {
    backgroundColor: "#021f3b",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoKemnaker} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold" style={brandStyle}>
              {ORGANIZATION_NAME}
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex text-[15px]">
              {NAV_LINKS.map((link) => (
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
              onClick={() => navigate({ to: "/login", search: { redirect: undefined } })}
              className="bg-[#032749] hover:bg-blue-950 text-white rounded-md px-6 py-2 font-semibold shadow-sm transition-all"
            >
              Masuk
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden px-8 py-16">
          <img
            src={heroImage}
            alt="Gedung Kemnaker RI"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px]" />

          <div className="relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
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

            <div className="md:col-span-5 flex items-center justify-center md:justify-end gap-6 sm:gap-10">
              <img
                src={logoKemnaker}
                alt="Logo Kemnaker"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-md"
              />
            </div>
          </div>
        </section>

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

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center text-2xl font-bold text-[#032749] md:text-3xl">
            Proses Pelaporan yang Transparan
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-gray-600">
            Ikuti langkah mudah ini untuk melaporkan masalah ketenagakerjaan Anda. Kami menjamin
            kerahasiaan data pelapor.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {HERO_STEPS.map((step, i) => (
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

      <footer className="bg-[#032749] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              {/* Judul + garis dibuat sama dengan kolom "Ada Pertanyaan?" supaya sejajar. */}
              <h3 className="text-lg font-semibold">
                {ORGANIZATION_UNIT} <span className="text-emerald-400">& K3</span>
              </h3>
              <hr className="mt-4 border-white/15" />
              <p className="mt-5 text-sm leading-relaxed text-gray-300">
                {ORGANIZATION_UNIT_FULL} adalah unsur pelaksana yang berada di bawah dan
                bertanggung jawab kepada Menteri Ketenagakerjaan.
              </p>
              <div className="mt-6 flex gap-3">
                {SOCIAL_LINKS.map(({ icon, href }, i) => {
                  const Icon = iconMap[icon as keyof typeof iconMap];
                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-400 hover:text-[#032749]"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold">Ada Pertanyaan?</h4>
              <hr className="mt-4 border-white/15" />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex gap-3 text-sm text-gray-300 transition-colors hover:text-emerald-400"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="leading-relaxed">
                  {ADDRESS_LINE_1}, {ADDRESS_LINE_2}, {ADDRESS_LINE_3}
                </p>
              </a>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Mail className="size-5 text-emerald-400" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  {CONTACT_EMAIL_LABEL}
                </a>
              </div>
              <div className="mt-6 pt-4 border-t border-white/15">
                <Link
                  to="/faqpage"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <span className="text-emerald-400">›</span> FAQ
                </Link>
              </div>
            </div>
          </div>

          <hr className="mt-10 border-white/15" />

          <div className="mt-6 flex flex-col items-center gap-1 text-center text-sm text-gray-300">
            <p>© {COPYRIGHT_START_YEAR}–{COPYRIGHT_END_YEAR} {ORGANIZATION_NAME}. Seluruh Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  MonitorSmartphone,
  AlertTriangle,
  Users,
  type LucideIcon,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/setting")({
  head: () => ({
    meta: [
      { title: "Setting Apps · PTSA-KEMNAKER" },
      {
        name: "description",
        content:
          "Pusat pengaturan aplikasi layanan pengaduan: halaman beranda, data survei, userlogin, QR, dan master pengaduan.",
      },
      { property: "og:title", content: "Setting Apps · PTSA-KEMNAKER" },
      {
        property: "og:description",
        content: "Kelola konfigurasi aplikasi layanan pengaduan ketenagakerjaan.",
      },
    ],
  }),
  component: SettingPage,
});

interface SettingCard {
  title: string;
  desc: string;
  icon: LucideIcon;
  to?: string;
}

interface SettingSection {
  label: string;
  cards: SettingCard[];
}

const SECTIONS: SettingSection[] = [
  {
    label: "General Settings",
    cards: [
      {
        title: "Data Survei",
        desc: "Kelola kuesioner dan parameter survei kepuasan.",
        icon: ClipboardList,
        to: "/admin/data_survei",
      },
      {
        title: "Data Visitor",
        desc: "Pengaturan data kunjungan dan buku tamu digital.",
        icon: MonitorSmartphone,
        to: "/admin/data_visitor",
      },
    ],
  },
  {
    label: "App & Services",
    cards: [
      {
        title: "Data Skala Perusahaan",
        desc: "Konfigurasi kategori dan parameter skala perusahaan.",
        icon: Building2,
        to: "/admin/data_skala",
      },
      {
        title: "Jenis Pengaduan",
        desc: "Kelola kategori dan alur jenis pengaduan masyarakat.",
        icon: AlertTriangle,
        to: "/admin/jenis_pengaduan",
      },
    ],
  },
  {
    label: "User Management",
    cards: [
      {
        title: "Manajemen User",
        desc: "Kelola akun pengguna, peran, dan akses pengguna dalam sistem.",
        icon: Users,
        to: "/admin/manajemen_user",
      },
    ],
  },
];

function SettingPage() {
  const navigate = useNavigate();
  return (
    <AppShell title="Setting Apps" breadcrumb="Setting">
      <div className="space-y-6">
        {/* Kartu judul */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h1 className="text-[20px] font-bold tracking-tight text-gray-900">
            Pengaturan
          </h1>
          <p className="mt-1 text-[12px] text-gray-500">
            Kelola konfigurasi layanan pengaduan ketenagakerjaan.
          </p>
        </div>

        {/* Kolom-kolom bergrup */}
        <div className="grid gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map((section) => (
            <section key={section.label}>
              <h2 className="mb-3 border-b border-gray-100 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                {section.label}
              </h2>

              <div className="space-y-4">
                {section.cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => card.to && navigate({ to: card.to })}
                      className="group relative flex w-full items-start gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-md"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#016A61]/10 text-[#016A61]">
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="min-w-0 flex-1 pr-5">
                        <span className="block text-[13px] font-bold leading-snug text-gray-800">
                          {card.title}
                        </span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-gray-500">
                          {card.desc}
                        </span>
                      </span>

                      <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-[#016A61]" />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

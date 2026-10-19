import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Send,
  Building2,
  Facebook,
  Instagram,
  MapPin,
  Mail,
  Loader2,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import logoKemnaker from "@/assets/kemnaker_logo.png";
import { API_BASE_URL as BASE_API_URL } from "@/lib/api";

import {
  ORGANIZATION_NAME,
  ORGANIZATION_UNIT,
  ORGANIZATION_UNIT_FULL,
  BRAND_PRIMARY_COLOR,
  NAV_LINKS,
  SOCIAL_LINKS,
  RATING_OPTIONS,
  MOCK_OFFICERS,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ADDRESS_LINE_3,
  CONTACT_EMAIL,
  MAPS_URL,
  COPYRIGHT_START_YEAR,
  COPYRIGHT_END_YEAR,
  PAGE_TITLES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  SURVEY_QUESTION_NUMBERS,
} from "@/config/app";

export const Route = createFileRoute("/survei")({
  head: () => ({
    meta: [{ title: PAGE_TITLES.survei }],
  }),
  component: FormSurveiPage,
});

interface OfficerItem {
  id: string | number;
  name: string;
}

const iconMap = {
  XIcon,
  Facebook,
  Instagram,
};

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

  useEffect(() => {
    const fetchOfficers = async () => {
      setLoadingOfficers(true);
      try {
        const res = await fetch(`${BASE_API_URL}/officers`).catch(() =>
          fetch(`${BASE_API_URL}/petugas`),
        );

        if (res && res.ok) {
          const data = await res.json();
          setOfficers(parseOfficerData(data));
        } else {
          setOfficers(MOCK_OFFICERS);
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

  const handleRatingSelect = (
    field: "komunikasi_petugas" | "penjelasan_materi" | "sarana_prasarana",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.officer_id) {
      toast.error(VALIDATION_MESSAGES.selectOfficer);
      return;
    }
    if (!formData.komunikasi_petugas || !formData.penjelasan_materi || !formData.sarana_prasarana) {
      toast.error(VALIDATION_MESSAGES.completeSurvey);
      return;
    }

    setSubmitting(true);
    try {
      const responses = [
        { question_number: SURVEY_QUESTION_NUMBERS.officer, answer: formData.officer_name },
        { question_number: SURVEY_QUESTION_NUMBERS.komunikasi, answer: formData.komunikasi_petugas },
        { question_number: SURVEY_QUESTION_NUMBERS.penjelasan, answer: formData.penjelasan_materi },
        { question_number: SURVEY_QUESTION_NUMBERS.sarana, answer: formData.sarana_prasarana },
        ...(formData.catatan ? [{ question_number: SURVEY_QUESTION_NUMBERS.catatan, answer: formData.catatan }] : []),
      ];

      const response = await fetch(`${BASE_API_URL}/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        let message = ERROR_MESSAGES.submitFailed;
        try {
          const json = await response.json();
          if (json?.message) message = json.message;
        } catch {
        }
        throw new Error(message);
      }

      toast.success(SUCCESS_MESSAGES.surveiSubmitted);
      navigate({ to: "/" });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || ERROR_MESSAGES.submitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const primaryColor = BRAND_PRIMARY_COLOR;

  const selectedButtonStyle = (selected: boolean) => ({
    backgroundColor: selected ? primaryColor : "white",
    color: selected ? "white" : "gray",
    borderColor: selected ? primaryColor : "gray",
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoKemnaker} alt="Logo Kemnaker" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold" style={{ color: primaryColor }}>
              {ORGANIZATION_NAME}
            </span>
          </Link>

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
        </div>
      </header>

      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EDF3FA] px-3 py-1 text-xs font-bold text-[#032749] mb-4">
              <Building2 className="size-3.5" />
              <span>KEMNAKER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
              FORM SURVEI
            </h1>
            <p className="text-sm font-bold" style={{ color: primaryColor }} mt-1>#SURVEI LAYANAN PTSA</p>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-2 leading-relaxed">
              Partisipasi Anda sangat berarti bagi kami untuk meningkatkan kualitas layanan
              Pelayanan Terpadu Satu Atap (PTSA) Kementerian Ketenagakerjaan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    {SURVEY_QUESTION_NUMBERS.officer}
                  </span>
                  <label className="text-sm font-bold text-gray-900">{FORM_LABELS.survei.officer}</label>
                </div>
                <select
                  value={formData.officer_id}
                  onChange={handleOfficerChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white text-gray-700 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749]"
                >
                  <option value="">{loadingOfficers ? "Memuat petugas..." : FORM_PLACEHOLDERS.survei.selectOfficer}</option>
                  {officers.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    {SURVEY_QUESTION_NUMBERS.komunikasi}
                  </span>
                  <label className="text-sm font-bold text-gray-900">{FORM_LABELS.survei.komunikasiPetugas}</label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {RATING_OPTIONS.map((option) => {
                    const isSelected = formData.komunikasi_petugas === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleRatingSelect("komunikasi_petugas", option.value)}
                        className={`py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-[#032749] text-white border-[#032749] shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    {SURVEY_QUESTION_NUMBERS.penjelasan}
                  </span>
                  <label className="text-sm font-bold text-gray-900">{FORM_LABELS.survei.penjelasanMateri}</label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {RATING_OPTIONS.map((option) => {
                    const isSelected = formData.penjelasan_materi === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleRatingSelect("penjelasan_materi", option.value)}
                        className={`py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-[#032749] text-white border-[#032749] shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    {SURVEY_QUESTION_NUMBERS.sarana}
                  </span>
                  <label className="text-sm font-bold text-gray-900">{FORM_LABELS.survei.saranaPrasarana}</label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {RATING_OPTIONS.map((option) => {
                    const isSelected = formData.sarana_prasarana === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleRatingSelect("sarana_prasarana", option.value)}
                        className={`py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-[#032749] text-white border-[#032749] shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#032749] hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#032749] text-xs font-bold text-white">
                    {SURVEY_QUESTION_NUMBERS.catatan}
                  </span>
                  <label className="text-sm font-bold text-gray-900">{FORM_LABELS.survei.catatan}</label>
                </div>
                <textarea
                  rows={4}
                  value={formData.catatan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, catatan: e.target.value }))}
                  placeholder={FORM_PLACEHOLDERS.survei.catatan}
                  className="w-full rounded-2xl border border-gray-300 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#032749] focus:outline-none focus:ring-1 focus:ring-[#032749] resize-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white hover:bg-blue-950 active:scale-95 disabled:opacity-70 transition-all shadow-md"
                  style={{ backgroundColor: primaryColor }}
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

      <footer className="bg-[#032749] text-white mt-16">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold">
                {ORGANIZATION_UNIT} <span className="text-emerald-400">& K3</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
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
                  Pengaduan WLKP
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
            <p>Copyright © BINSIS || {COPYRIGHT_START_YEAR}–{COPYRIGHT_END_YEAR}</p>
            <p>
              Designed by <span className="text-emerald-400">TUBSPK</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
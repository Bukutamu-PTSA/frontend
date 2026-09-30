import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  FALLBACK_SURVEY_ID,
  SURVEYS_API_URL,
  fetchSurveyQuestions,
  findQuestionByRowId,
  readErrorMessage,
} from "@/lib/survey";

export const Route = createFileRoute("/admin/edit_survei")({
  validateSearch: (search: Record<string, unknown>) => ({
    // `id` = questions[].id dari baris tabel yang diklik.
    id: search["id"] ? Number(search["id"]) : undefined,
    // `survey` = id survey pemilik pertanyaan tersebut.
    survey: search["survey"] ? Number(search["survey"]) : undefined,
  }),
  head: () => ({
    meta: [{ title: "Edit Data Survei · PTSA-KEMNAKER" }],
  }),
  component: EditSurveiPage,
});

function EditSurveiPage() {
  const navigate = useNavigate();
  const { id, survey } = Route.useSearch();
  const surveyId = survey ?? FALLBACK_SURVEY_ID;

  // Kosongkan form, JANGAN isi default: nilai default akan disalahartikan
  // sebagai data record yang sedang diedit.
  const [pertanyaan, setPertanyaan] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil data survei berdasarkan id agar form sesuai dengan baris yang diklik.
  useEffect(() => {
    const fetchSurvey = async () => {
      setPertanyaan("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setError(null);

      if (!id) {
        setError("ID pertanyaan tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const questions = await fetchSurveyQuestions(surveyId);
        // Cari berdasarkan `questions[].id` yang sama persis dengan baris tabel,
        // supaya pertanyaan yang tampil adalah yang diklik user.
        const question = findQuestionByRowId(questions, id);

        if (!question) {
          throw new Error(`Pertanyaan dengan id ${id} tidak ditemukan pada survei #${surveyId}.`);
        }

        setPertanyaan(question.question_text);
        setOptionA(question.options[0] ?? "");
        setOptionB(question.options[1] ?? "");
        setOptionC(question.options[2] ?? "");
      } catch (err: any) {
        console.error("Gagal memuat data survei:", err);
        setError(err?.message || "Gagal memuat data survei. Silakan kembali dan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id, surveyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("ID pertanyaan tidak ditemukan.");
      return;
    }
    if (!pertanyaan.trim()) {
      setError("Soal wajib diisi.");
      return;
    }

    const options = [optionA, optionB, optionC].map((v) => v.trim());
    if (options.every((v) => v === "")) {
      setError("Minimal satu opsi jawaban wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // PUT /api/surveys/{survey} dengan { question_text, options }.
      const res = await fetch(`${SURVEYS_API_URL}/${surveyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          question_text: pertanyaan.trim(),
          options,
        }),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res, `Gagal menyimpan (HTTP ${res.status}).`));
      }

      navigate({ to: "/admin/data_survei" });
    } catch (err: any) {
      console.error("Edit survei error:", err);
      setError(err?.message || "Terjadi kesalahan saat menyimpan survei.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Edit Data Survei" breadcrumb="Edit Survei">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <h2 className="mb-6 text-[14px] font-bold uppercase tracking-wide text-gray-800">
          Form Edit Survei
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {loading && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Memuat data survei...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <Field label="Soal" required>
            <input
              type="text"
              value={pertanyaan}
              onChange={(e) => setPertanyaan(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Option A">
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </Field>
            <Field label="Option B">
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </Field>
            <Field label="Option C">
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#016A61] focus:outline-none focus:ring-1 focus:ring-[#016A61]"
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/data_survei" })}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#016A61] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#00544d] disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#016A61]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

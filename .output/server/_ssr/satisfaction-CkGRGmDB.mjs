import { i as authHeaders, r as apiUrl } from "./api-BnPXX3Pj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/satisfaction-CkGRGmDB.js
/**
* Perhitungan persentase pertumbuhan aduan secara riil dari daftar aduan.
*
* - Saat filter tanggal dipilih: hari tersebut vs hari terdekat sebelumnya.
* - Tanpa filter: bulan dengan data terakhir vs bulan sebelumnya.
*/
var nf = new Intl.NumberFormat("id-ID");
function computeGrowth(rawList, selectedDate = null) {
	const dayTotals = /* @__PURE__ */ new Map();
	rawList.forEach((item) => {
		const d = String(item.complaint_date ?? item.created_at ?? "").slice(0, 10);
		if (d) dayTotals.set(d, (dayTotals.get(d) ?? 0) + 1);
	});
	const sortedDays = [...dayTotals.keys()].sort();
	if (sortedDays.length === 0) return null;
	const pct = (current, prev) => prev > 0 ? (current - prev) / prev * 100 : null;
	if (selectedDate) {
		const current = dayTotals.get(selectedDate) ?? 0;
		const idx = sortedDays.indexOf(selectedDate);
		if (idx <= 0) return null;
		return pct(current, dayTotals.get(sortedDays[idx - 1]) ?? 0);
	}
	const monthTotals = /* @__PURE__ */ new Map();
	rawList.forEach((item) => {
		const m = String(item.complaint_date ?? item.created_at ?? "").slice(0, 7);
		if (m) monthTotals.set(m, (monthTotals.get(m) ?? 0) + 1);
	});
	const months = [...monthTotals.keys()].sort();
	if (months.length < 2) return null;
	return pct(monthTotals.get(months.at(-1)) ?? 0, monthTotals.get(months.at(-2)) ?? 0);
}
function formatGrowth(value) {
	if (value === null || !Number.isFinite(value)) return "—";
	const rounded = Math.round(value * 10) / 10;
	return `${rounded > 0 ? "+" : ""}${nf.format(rounded)}%`;
}
var EMPTY_SUMMARY = {
	index: null,
	scale: 5,
	responses: 0,
	source: "responses"
};
var LIKERT_SCORE = {
	baik: 3,
	cukup: 2,
	kurang: 1
};
function likertScore(value) {
	if (value == null) return null;
	const text = String(value).trim().toLowerCase();
	if (!text) return null;
	return LIKERT_SCORE[text] ?? null;
}
function answerMap(item) {
	const answers = {};
	const raw = item?.answers;
	if (raw && typeof raw === "object" && !Array.isArray(raw)) Object.keys(raw).forEach((key) => {
		const qn = Number(key);
		if (Number.isInteger(qn) && qn >= 1) answers[qn] = raw[key];
	});
	if (Array.isArray(item?.responses)) item.responses.forEach((r) => {
		const qn = Number(r?.question_number ?? r?.survey_question_id);
		if (Number.isInteger(qn) && qn >= 1 && r?.answer != null) answers[qn] = r.answer;
	});
	return answers;
}
/** Skor likert 3 dimensi (Q2-Q4), atau dari field flat bila tak ada `answers`. */
function likertScores(item) {
	if (!item || typeof item !== "object") return [];
	const answers = answerMap(item);
	const fromAnswers = [
		2,
		3,
		4
	].map((qn) => likertScore(answers[qn])).filter((s) => s != null);
	if (fromAnswers.length > 0) return fromAnswers;
	return [
		"komunikasi_petugas",
		"penjelasan_materi",
		"sarana_prasarana"
	].map((key) => likertScore(item[key])).filter((s) => s != null);
}
/**
* Hitung indeks kepuasan dari daftar submission survei mentah.
* Skor likert 1-3 (Kurang/Cukup/Baik) dikonversi ke skala 1-5 dengan (2*skor - 1)
* sehingga Baik=5, Cukup=3, Kurang=1.
*/
function computeSatisfaction(items) {
	const averages = [];
	items.forEach((item) => {
		const scores = likertScores(item);
		if (scores.length === 0) return;
		averages.push(scores.reduce((sum, score) => sum + score, 0) / scores.length);
	});
	if (averages.length === 0) return { ...EMPTY_SUMMARY };
	const mean3 = averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
	return {
		index: Math.round((2 * mean3 - 1) * 100) / 100,
		scale: 5,
		responses: averages.length,
		source: "responses"
	};
}
function parseAggregate(d) {
	if (!d || typeof d !== "object") return null;
	const indexRaw = d.satisfaction_index ?? d.index ?? d.score ?? d.skor ?? d.nilai ?? d.average ?? d.avg;
	if (indexRaw == null) return null;
	const index = Number(indexRaw);
	if (!Number.isFinite(index)) return null;
	return {
		index,
		scale: Number(d.satisfaction_scale ?? d.scale ?? 5),
		responses: Number(d.satisfaction_responses ?? d.responses ?? d.responden ?? d.jumlah ?? 0),
		source: "aggregate"
	};
}
/**
* Ambil ringkasan indeks kepuasan survei untuk card dashboard/grafik.
*
* 1. Coba endpoint agregat /surveys/satisfaction?period=today (data hari ini).
* 2. Bila tidak tersedia/tidak sesuai, hitung ulang dari /surveys/responses
*    (sumber data riil yang sama dipakai halaman Report Survei).
*/
async function fetchSatisfactionSummary() {
	const headers = authHeaders();
	try {
		const aggrRes = await fetch(`${apiUrl("surveys/satisfaction")}?period=today`, { headers });
		if (aggrRes.ok) {
			const json = await aggrRes.json().catch(() => null);
			const parsed = parseAggregate(json?.data ?? json?.result ?? json?.satisfaction ?? json);
			if (parsed) return parsed;
		}
	} catch {}
	try {
		const res = await fetch(`${apiUrl("surveys/responses")}?per_page=100`, { headers });
		if (!res.ok) return { ...EMPTY_SUMMARY };
		const json = await res.json().catch(() => null);
		const data = json?.data;
		return computeSatisfaction(Array.isArray(data?.submissions) ? data.submissions : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(json) ? json : []);
	} catch {
		return { ...EMPTY_SUMMARY };
	}
}
//#endregion
export { fetchSatisfactionSummary as n, formatGrowth as r, computeGrowth as t };

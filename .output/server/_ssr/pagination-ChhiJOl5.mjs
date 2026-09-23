//#region node_modules/.nitro/vite/services/ssr/assets/pagination-ChhiJOl5.js
/**
* Hitung jendela nomor halaman yang ditampilkan di pagination.
*
* Selalu menampilkan maksimal `maxVisible` nomor, diitung mundur dari
* `currentPage` agar tombol halaman aktif tetap terlihat meski berada
* jauh di tengah (mis. halaman 12 dari 40).
*/
function pageWindow(currentPage, totalPages, maxVisible = 5) {
	const max = Math.max(1, maxVisible);
	let start = Math.max(1, currentPage - Math.floor(max / 2));
	const end = Math.min(Math.max(1, totalPages), start + max - 1);
	start = Math.max(1, end - max + 1);
	const pages = [];
	for (let i = start; i <= end; i++) pages.push(i);
	return pages;
}
//#endregion
export { pageWindow as t };

//#region node_modules/.nitro/vite/services/ssr/assets/api-BipEh2FU.js
/**
* Konfigurasi API terpusat (softcode).
*
* Semua URL backend diturunkan dari satu env var: VITE_API_HOST.
* Ubah nilainya di file `.env` (VITE_API_HOST) tanpa perlu menyentuh kode.
*/
var API_HOST = ({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_HOST": "http://192.168.156.206:8000"
}["VITE_API_HOST"] ?? "http://192.168.156.206:8000").replace(/\/+$/, "");
/** Base URL REST utama, mis. "http://host:8000/api". */
var API_BASE_URL = `${API_HOST}/api`;
/** Base URL modul auth v1, mis. "http://host:8000/api/v1/auth". */
var AUTH_BASE_URL = `${API_BASE_URL}/v1/auth`;
/**
* Bangun URL absolut ke sebuah path di bawah /api.
* @example apiUrl("complaints") -> "http://host:8000/api/complaints"
*/
function apiUrl(path) {
	return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
/**
* Bangun URL absolut ke aset storage backend.
* @example storageUrl("foo/bar.jpg") -> "http://host:8000/storage/foo/bar.jpg"
*/
function storageUrl(filePath) {
	return `${API_HOST}/storage/${filePath.replace(/^\/?storage\//, "").replace(/^\/+/, "")}`;
}
/** Ambil token auth dari local/session storage (browser only). */
function getAuthToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token") || null;
}
/** Header standar termasuk Authorization bila token tersedia. */
function authHeaders(extra) {
	const token = getAuthToken();
	return {
		Accept: "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {},
		...extra
	};
}
//#endregion
export { storageUrl as a, authHeaders as i, AUTH_BASE_URL as n, apiUrl as r, API_BASE_URL as t };

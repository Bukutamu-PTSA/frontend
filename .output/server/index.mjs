globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-08-26T01:45:54.824Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/arrow-left-CLvYhhAL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-O/H+30a4IbdZf4Oy8/fcFTdueqE\"",
		"mtime": "2026-09-03T01:13:55.312Z",
		"size": 162,
		"path": "../public/assets/arrow-left-CLvYhhAL.js"
	},
	"/assets/arrow-right-DAnghy1Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-jAlrCvwYzPjBR/8DXoVb/+kstEc\"",
		"mtime": "2026-09-03T01:13:55.314Z",
		"size": 162,
		"path": "../public/assets/arrow-right-DAnghy1Z.js"
	},
	"/assets/building-2-yN1AKihS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17c-1G7zmN41RzYqpbWQqFpcaoWVMjc\"",
		"mtime": "2026-09-03T01:13:55.315Z",
		"size": 380,
		"path": "../public/assets/building-2-yN1AKihS.js"
	},
	"/assets/app-shell-CPgBEjvX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20e2-nZB3iBHiNsV/cEyxxzghOZ3d/kY\"",
		"mtime": "2026-09-03T01:13:55.310Z",
		"size": 8418,
		"path": "../public/assets/app-shell-CPgBEjvX.js"
	},
	"/assets/bukti_pendukung-Di741tzk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3377-EcyVxa4S4MG0+Lryz50f0XJMYE0\"",
		"mtime": "2026-09-03T01:13:55.316Z",
		"size": 13175,
		"path": "../public/assets/bukti_pendukung-Di741tzk.js"
	},
	"/assets/binwasnaker_logo-CTvh8meT.png": {
		"type": "image/png",
		"etag": "\"f9a5-LRId0rzgKNbKBJuPN+nJhqrP3ao\"",
		"mtime": "2026-09-03T01:13:55.503Z",
		"size": 63909,
		"path": "../public/assets/binwasnaker_logo-CTvh8meT.png"
	},
	"/assets/chat-CERcSPYk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"229b-t7Yy6h3HuOg6ZdMgEO9GitfD1KA\"",
		"mtime": "2026-09-03T01:13:55.331Z",
		"size": 8859,
		"path": "../public/assets/chat-CERcSPYk.js"
	},
	"/assets/download-CYkjhES8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e5-+enZ6cppVY8uHsuDcEi+ohCuanE\"",
		"mtime": "2026-09-03T01:13:55.378Z",
		"size": 229,
		"path": "../public/assets/download-CYkjhES8.js"
	},
	"/assets/dashboard-bz93fTKB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f22-tjbnB7krbugX7mJSpExBotdcu1Q\"",
		"mtime": "2026-09-03T01:13:55.350Z",
		"size": 16162,
		"path": "../public/assets/dashboard-bz93fTKB.js"
	},
	"/assets/eye-BC1P2wl6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c2-h4jVJuh5QJ2jfFQ9PB8UF9YGu/c\"",
		"mtime": "2026-09-03T01:13:55.379Z",
		"size": 450,
		"path": "../public/assets/eye-BC1P2wl6.js"
	},
	"/assets/file-text-BaVwYPGI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17e-lWEWfYJmE5RC5KcDTGk9G6ZCjbw\"",
		"mtime": "2026-09-03T01:13:55.382Z",
		"size": 382,
		"path": "../public/assets/file-text-BaVwYPGI.js"
	},
	"/assets/kategori_pelayanan-KDiIOWxB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2467-Ce1ax+9glzKt8GpQoYtAeR7cYbk\"",
		"mtime": "2026-09-03T01:13:55.388Z",
		"size": 9319,
		"path": "../public/assets/kategori_pelayanan-KDiIOWxB.js"
	},
	"/assets/kemnaker_logo-C5FQ7msx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d3-FMdyeBoPngWkemX2ZSwCxijvMsw\"",
		"mtime": "2026-09-03T01:13:55.399Z",
		"size": 1235,
		"path": "../public/assets/kemnaker_logo-C5FQ7msx.js"
	},
	"/assets/kemnaker_logo-0DRbGcnj.png": {
		"type": "image/png",
		"etag": "\"a9fd-Xcq9upMMMzjpDjbY7sCDYvg28m0\"",
		"mtime": "2026-09-03T01:13:55.507Z",
		"size": 43517,
		"path": "../public/assets/kemnaker_logo-0DRbGcnj.png"
	},
	"/assets/loader-circle-B8FfMXvW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-b1Lp9iD88U1QZPZxuCeCBn8Itl4\"",
		"mtime": "2026-09-03T01:13:55.401Z",
		"size": 141,
		"path": "../public/assets/loader-circle-B8FfMXvW.js"
	},
	"/assets/login-CwyPl98K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1edd-K2xzQ5yzwTNdFbKFYnm6u0i4vYo\"",
		"mtime": "2026-09-03T01:13:55.403Z",
		"size": 7901,
		"path": "../public/assets/login-CwyPl98K.js"
	},
	"/assets/pengaduan-DqVxG7xO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4eb0-+ErqggwBkLfuTIuSFwc0HCQWbCs\"",
		"mtime": "2026-09-03T01:13:55.409Z",
		"size": 20144,
		"path": "../public/assets/pengaduan-DqVxG7xO.js"
	},
	"/assets/reportpengaduan-CVSMtp3U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2312-JcQSY9ra88xAM+pIhbSciBF4XKA\"",
		"mtime": "2026-09-03T01:13:55.421Z",
		"size": 8978,
		"path": "../public/assets/reportpengaduan-CVSMtp3U.js"
	},
	"/assets/gedung-kemnaker-B2b0w9_z.jpg": {
		"type": "image/jpeg",
		"etag": "\"59667-mohFUpkyzf13UyGl+ZHRovt3JVE\"",
		"mtime": "2026-09-03T01:13:55.506Z",
		"size": 366183,
		"path": "../public/assets/gedung-kemnaker-B2b0w9_z.jpg"
	},
	"/assets/send-B45thjjo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11f-3hfw0hBPRqjmAKVL9IWUzfsFHWY\"",
		"mtime": "2026-09-03T01:13:55.449Z",
		"size": 287,
		"path": "../public/assets/send-B45thjjo.js"
	},
	"/assets/routes-BCOtHbZe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3280-yVO0nbGWTIt3CYys6afQPSnNhuE\"",
		"mtime": "2026-09-03T01:13:55.437Z",
		"size": 12928,
		"path": "../public/assets/routes-BCOtHbZe.js"
	},
	"/assets/index-CPzTcZAI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55be9-UxGaMPuT/USJjIlWymeXE+MpY+I\"",
		"mtime": "2026-09-03T01:13:54.885Z",
		"size": 351209,
		"path": "../public/assets/index-CPzTcZAI.js"
	},
	"/assets/setting-DVAG96PS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7e5-ywYjQCoF77JRzkyfPJDd4moi8tE\"",
		"mtime": "2026-09-03T01:13:55.450Z",
		"size": 2021,
		"path": "../public/assets/setting-DVAG96PS.js"
	},
	"/assets/styles-C0ypxMRs.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18471-F6ekxAmwiLtKgenair2MxPIJXgU\"",
		"mtime": "2026-09-03T01:13:55.509Z",
		"size": 99441,
		"path": "../public/assets/styles-C0ypxMRs.css"
	},
	"/assets/trash-2-B1J95VIs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"145-sW7zVwfh4yhbkhkFp+hLk/RL1Wc\"",
		"mtime": "2026-09-03T01:13:55.466Z",
		"size": 325,
		"path": "../public/assets/trash-2-B1J95VIs.js"
	},
	"/assets/survei-D4gyk5x2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c01-Ss4C7BvTgawXkhmNJz9SUVWH88I\"",
		"mtime": "2026-09-03T01:13:55.455Z",
		"size": 11265,
		"path": "../public/assets/survei-D4gyk5x2.js"
	},
	"/assets/twitter-DY4RvKwp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"470-Gs0ZCV3YDLasBci3XgXx8KB5Q78\"",
		"mtime": "2026-09-03T01:13:55.468Z",
		"size": 1136,
		"path": "../public/assets/twitter-DY4RvKwp.js"
	},
	"/assets/utils-DojpP95n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7e-rehYKtt6GcJPoEspFNv2VomMQ30\"",
		"mtime": "2026-09-03T01:13:55.471Z",
		"size": 27262,
		"path": "../public/assets/utils-DojpP95n.js"
	},
	"/assets/wallet-cards-BAUX5cq3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ee-PpwsYp1nTCDLbihicPjmP6ZXVZo\"",
		"mtime": "2026-09-03T01:13:55.499Z",
		"size": 1774,
		"path": "../public/assets/wallet-cards-BAUX5cq3.js"
	},
	"/assets/wilayah-yDUeVy8C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92-7oj3rksCv7mTa3YPNLir3KQ5Mr4\"",
		"mtime": "2026-09-03T01:13:55.501Z",
		"size": 146,
		"path": "../public/assets/wilayah-yDUeVy8C.js"
	},
	"/assets/video-BQ_x-lBN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-2ZrgXvh+obQY14scXezxeJHj7x4\"",
		"mtime": "2026-09-03T01:13:55.496Z",
		"size": 245,
		"path": "../public/assets/video-BQ_x-lBN.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_QUw1z0 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_QUw1z0
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };

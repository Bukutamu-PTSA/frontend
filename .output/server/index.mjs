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
	"/assets/app-shell-B_kM-L8_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b09-MU29bcTjQTsFbw4upoLGKX1DXmA\"",
		"mtime": "2026-08-26T06:59:26.635Z",
		"size": 35593,
		"path": "../public/assets/app-shell-B_kM-L8_.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-08-26T01:45:54.824Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/building-2-B9vWa5hq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17f-kuTM3nqGCphDo6Y0XDmfKoG9XuU\"",
		"mtime": "2026-08-26T06:59:26.681Z",
		"size": 383,
		"path": "../public/assets/building-2-B9vWa5hq.js"
	},
	"/assets/dashboard-data-CR0rHxUZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1740-1U7h+OT5Bj8dXxKqYaphIqNHfDY\"",
		"mtime": "2026-08-26T06:59:26.708Z",
		"size": 5952,
		"path": "../public/assets/dashboard-data-CR0rHxUZ.js"
	},
	"/assets/chat-BeFbQPK0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2406-1wikv32BDmTwcg8KihgO6M38ZGw\"",
		"mtime": "2026-08-26T06:59:26.685Z",
		"size": 9222,
		"path": "../public/assets/chat-BeFbQPK0.js"
	},
	"/assets/createLucideIcon-DYb-dwrU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a9-qVz+8E7IGB+Tkcdrf+YuSUeOX5I\"",
		"mtime": "2026-08-26T06:59:26.705Z",
		"size": 1193,
		"path": "../public/assets/createLucideIcon-DYb-dwrU.js"
	},
	"/assets/eye-CIptCDKC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-3Hh2qmxJtNhFyfswS2IwjPZ8RqY\"",
		"mtime": "2026-08-26T06:59:26.720Z",
		"size": 256,
		"path": "../public/assets/eye-CIptCDKC.js"
	},
	"/assets/funnel-ClD7jrbP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b3-KOcB7fhJcFo4g7Agnue7XgmqAhc\"",
		"mtime": "2026-08-26T06:59:26.722Z",
		"size": 435,
		"path": "../public/assets/funnel-ClD7jrbP.js"
	},
	"/assets/pengaduan-CbsveQHK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a29-vp2p/x2TWBsJ2uSN73/pVGJILPU\"",
		"mtime": "2026-08-26T06:59:26.730Z",
		"size": 6697,
		"path": "../public/assets/pengaduan-CbsveQHK.js"
	},
	"/assets/login-B--rf3Wg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12c9-eLipAiqmkirVVo+TIeOfOpI42IE\"",
		"mtime": "2026-08-26T06:59:26.724Z",
		"size": 4809,
		"path": "../public/assets/login-B--rf3Wg.js"
	},
	"/assets/setting-rWUoQzHe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"529-mFb6sTXbZhU+LMrqrKACRvf1SpA\"",
		"mtime": "2026-08-26T06:59:27.662Z",
		"size": 1321,
		"path": "../public/assets/setting-rWUoQzHe.js"
	},
	"/assets/useRouter-B64lGpJS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21c3-zzmYM01eKBeLDXNG1KZYTLnsRQs\"",
		"mtime": "2026-08-26T06:59:27.680Z",
		"size": 8643,
		"path": "../public/assets/useRouter-B64lGpJS.js"
	},
	"/assets/survei-MJhJ0CKP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2426-EgFNQ6aLSx5BvPoilLhHi+fyd5w\"",
		"mtime": "2026-08-26T06:59:27.664Z",
		"size": 9254,
		"path": "../public/assets/survei-MJhJ0CKP.js"
	},
	"/assets/index-DIbZF4I_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53524-5ZYYKrQFYoc21wyhACQqW+QfN9s\"",
		"mtime": "2026-08-26T06:59:26.129Z",
		"size": 341284,
		"path": "../public/assets/index-DIbZF4I_.js"
	},
	"/assets/styles-5jO4gCEq.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15d9d-vEGm3UI5YyAah+dAXpUh7lgV8mg\"",
		"mtime": "2026-08-26T06:59:27.691Z",
		"size": 89501,
		"path": "../public/assets/styles-5jO4gCEq.css"
	},
	"/assets/routes-BGX5whZZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e2bf-lmk0o5V+gYgTdQPsuCn+vi3fjVY\"",
		"mtime": "2026-08-26T06:59:26.743Z",
		"size": 385727,
		"path": "../public/assets/routes-BGX5whZZ.js"
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

import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grok-CBqtJ2Hg.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SEVERITIES = /* @__PURE__ */ new Set([
	"blocker",
	"major",
	"minor",
	"note"
]);
function asRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function asString(value, max) {
	if (typeof value !== "string") return null;
	const text = value.trim();
	if (!text) return null;
	return text.slice(0, max);
}
function asBool(value) {
	return typeof value === "boolean" ? value : void 0;
}
function sanitizeMerge(value) {
	const src = asRecord(value);
	if (!src) return {};
	const merge = {};
	const name = asString(src.name, 40);
	if (name) merge.name = name;
	const offline = asBool(src.offline);
	if (offline !== void 0) merge.offline = offline;
	const largeType = asBool(src.largeType);
	if (largeType !== void 0) merge.largeType = largeType;
	const crashHandler = asBool(src.crashHandler);
	if (crashHandler !== void 0) merge.crashHandler = crashHandler;
	const signup = asRecord(src.signup);
	if (signup) {
		const next = {};
		const show = asBool(signup.showPasswordRules);
		if (show !== void 0) next.showPasswordRules = show;
		const collect = asBool(signup.collectDisplayName);
		if (collect !== void 0) next.collectDisplayName = collect;
		if (typeof signup.minPassword === "number" && Number.isInteger(signup.minPassword)) next.minPassword = Math.min(64, Math.max(8, signup.minPassword));
		if (Object.keys(next).length) merge.signup = next;
	}
	const empty = asRecord(src.empty);
	if (empty) {
		const next = {};
		const title = asString(empty.title, 80);
		const cta = typeof empty.cta === "string" ? empty.cta.trim().slice(0, 40) : null;
		if (title) next.title = title;
		if (cta !== null) next.cta = cta;
		if (Object.keys(next).length) merge.empty = next;
	}
	const paywall = asRecord(src.paywall);
	if (paywall) {
		const next = {};
		const title = asString(paywall.title, 40);
		const price = typeof paywall.price === "string" ? paywall.price.trim().slice(0, 40) : null;
		const cta = asString(paywall.cta, 40);
		if (title) next.title = title;
		if (price !== null) next.price = price;
		if (cta) next.cta = cta;
		if (Object.keys(next).length) merge.paywall = next;
	}
	return merge;
}
function sanitizeFile(value) {
	const src = asRecord(value);
	if (!src) return void 0;
	const path = asString(src.path, 80);
	const content = asString(src.content, 4e3);
	if (!path || !content) return void 0;
	if (!/^src\/features\/[A-Za-z0-9._-]+\.ts$/.test(path)) return void 0;
	return {
		path,
		content
	};
}
function sanitize(payload) {
	const src = asRecord(payload) ?? {};
	const findings = [];
	if (Array.isArray(src.findings)) for (const item of src.findings) {
		if (findings.length >= 4) break;
		const row = asRecord(item);
		if (!row) continue;
		const severity = SEVERITIES.has(row.severity) ? row.severity : null;
		const area = asString(row.area, 32);
		const title = asString(row.title, 120);
		const body = asString(row.body, 500);
		if (!severity || !area || !title || !body) continue;
		const repro = Array.isArray(row.repro) ? row.repro.flatMap((step) => {
			const line = asString(step, 160);
			return line ? [line] : [];
		}).slice(0, 4) : [];
		findings.push({
			severity,
			area,
			title,
			body,
			repro
		});
	}
	const patches = [];
	if (Array.isArray(src.patches)) for (const item of src.patches) {
		if (patches.length >= 2) break;
		const row = asRecord(item);
		if (!row) continue;
		const title = asString(row.title, 120);
		const rationale = asString(row.rationale, 500);
		if (!title || !rationale) continue;
		const merge = sanitizeMerge(row.merge);
		const newFile = sanitizeFile(row.newFile);
		if (Object.keys(merge).length === 0 && !newFile) continue;
		patches.push({
			title,
			rationale,
			merge,
			newFile
		});
	}
	return {
		findings,
		patches
	};
}
function parseModelJson(text) {
	const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
	return JSON.parse(trimmed);
}
var askSwarm_createServerFn_handler = createServerRpc({
	id: "e8fd2bccce3d75338a07d63509d5c2f4fccada69913442288f50ce77424bfae8",
	name: "askSwarm",
	filename: "src/lib/canary/grok.ts"
}, (opts) => askSwarm.__executeServer(opts));
var askSwarm = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input.mission !== "string" || typeof input.configJson !== "string") throw new Error("Missing build");
	return {
		mission: input.mission.slice(0, 800),
		configJson: input.configJson.slice(0, 8e3),
		bots: typeof input.bots === "string" ? input.bots.slice(0, 6e3) : ""
	};
}).handler(askSwarm_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Grok is not available in this environment. The protocol still filed."
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			signal: AbortSignal.timeout(25e3),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .3,
				max_tokens: 900,
				messages: [{
					role: "system",
					content: "You are the lead tester in Canary, a Play Store beta swarm. Return JSON only, no markdown. Shape: {\"findings\":[{\"severity\":\"blocker\"|\"major\"|\"minor\"|\"note\",\"area\":\"string\",\"title\":\"string\",\"body\":\"string\",\"repro\":[\"string\"]}],\"patches\":[{\"title\":\"string\",\"rationale\":\"string\",\"merge\":{\"signup\":{\"showPasswordRules\":true,\"minPassword\":10,\"collectDisplayName\":true},\"empty\":{\"title\":\"\",\"cta\":\"\"},\"paywall\":{\"title\":\"\",\"price\":\"\",\"cta\":\"\"},\"offline\":true,\"largeType\":true,\"crashHandler\":true},\"newFile\":{\"path\":\"src/features/Name.ts\",\"content\":\"ts source\"}}]}. At most 4 findings and 2 patches. Only include merge keys that should change. Omit newFile unless you are adding one module under src/features/. Do not restate defects already fixed in the config. Write like a release engineer. No hype, no emoji."
				}, {
					role: "user",
					content: `Brief:\n${data.mission}\n\nBuild config:\n${data.configJson}\n\nBots:\n${data.bots}`
				}]
			})
		});
		if (!res.ok) return {
			ok: false,
			error: `Grok did not answer (${res.status}). The protocol still filed.`
		};
		const text = (await res.json()).choices?.[0]?.message?.content ?? "";
		if (!text) return {
			ok: false,
			error: "Grok returned an empty note. The protocol still filed."
		};
		return {
			ok: true,
			...sanitize(parseModelJson(text))
		};
	} catch {
		return {
			ok: false,
			error: "Grok pass did not finish. The protocol still filed."
		};
	}
});
//#endregion
export { askSwarm_createServerFn_handler };

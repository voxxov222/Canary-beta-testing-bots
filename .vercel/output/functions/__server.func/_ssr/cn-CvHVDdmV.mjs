import { a as object, i as number, n as boolean, o as string, t as _enum } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cn-CvHVDdmV.js
var configSchema = object({
	name: string().trim().min(1).max(40),
	packageId: string().trim().min(3).max(80).regex(/^[A-Za-z][\w.]*$/, "Package id looks wrong"),
	version: string().trim().min(1).max(20),
	versionCode: number().int().min(1).max(999999),
	track: _enum([
		"internal",
		"closed",
		"open",
		"production"
	]),
	rollout: number().min(0).max(100),
	signup: object({
		showPasswordRules: boolean(),
		minPassword: number().int().min(1).max(64),
		collectDisplayName: boolean()
	}),
	empty: object({
		title: string().max(80),
		cta: string().max(40)
	}),
	paywall: object({
		title: string().max(40),
		price: string().max(40),
		cta: string().max(40)
	}),
	offline: boolean(),
	largeType: boolean(),
	crashHandler: boolean()
});
var SEED_CONFIG = {
	name: "Northline",
	packageId: "app.northline.notes",
	version: "0.9.4",
	versionCode: 42,
	track: "closed",
	rollout: 20,
	signup: {
		showPasswordRules: false,
		minPassword: 4,
		collectDisplayName: false
	},
	empty: {
		title: "No notes yet",
		cta: ""
	},
	paywall: {
		title: "Northline Plus",
		price: "",
		cta: "Buy"
	},
	offline: false,
	largeType: false,
	crashHandler: false
};
var SEED_MISSION = "Prove a first-time tester on a slow phone can create an account, understand what Plus costs, and write a note without a network.";
function serializeConfig(config) {
	const ordered = {
		name: config.name,
		packageId: config.packageId,
		version: config.version,
		versionCode: config.versionCode,
		track: config.track,
		rollout: config.rollout,
		signup: {
			showPasswordRules: config.signup.showPasswordRules,
			minPassword: config.signup.minPassword,
			collectDisplayName: config.signup.collectDisplayName
		},
		empty: {
			title: config.empty.title,
			cta: config.empty.cta
		},
		paywall: {
			title: config.paywall.title,
			price: config.paywall.price,
			cta: config.paywall.cta
		},
		offline: config.offline,
		largeType: config.largeType,
		crashHandler: config.crashHandler
	};
	return `${JSON.stringify(ordered, null, 2)}\n`;
}
function parseConfig(raw) {
	let json;
	try {
		json = JSON.parse(raw);
	} catch {
		throw new Error("That is not valid JSON.");
	}
	const parsed = configSchema.safeParse(json);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		const path = issue?.path.join(".") || "config";
		throw new Error(`${path}: ${issue?.message ?? "invalid"}`);
	}
	return parsed.data;
}
function applyMerge(config, merge) {
	return {
		...config,
		name: merge.name ?? config.name,
		offline: merge.offline ?? config.offline,
		largeType: merge.largeType ?? config.largeType,
		crashHandler: merge.crashHandler ?? config.crashHandler,
		signup: {
			...config.signup,
			...merge.signup
		},
		empty: {
			...config.empty,
			...merge.empty
		},
		paywall: {
			...config.paywall,
			...merge.paywall
		}
	};
}
function mergeIsEmpty(merge) {
	return merge.name === void 0 && merge.offline === void 0 && merge.largeType === void 0 && merge.crashHandler === void 0 && !merge.signup && !merge.empty && !merge.paywall;
}
function buildKey(mission, config, bots) {
	const flock = bots.filter((bot) => bot.armed).map((bot) => `${bot.callsign}:${bot.style}:${bot.persona}`).join("|");
	return `${mission.trim()}::${serializeConfig(config)}::${flock}`;
}
var OFFLINE_FILE = `/** Northline offline queue. Written by the swarm. */
export type QueuedNote = { id: string; body: string; at: number };

const KEY = "northline.queue";

export function enqueue(body: string): QueuedNote[] {
  const prev = read();
  const next = [...prev, { id: String(Date.now()), body, at: Date.now() }];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function read(): QueuedNote[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as QueuedNote[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
`;
function preflight(config) {
	return [
		{
			id: "password",
			ok: config.signup.showPasswordRules && config.signup.minPassword >= 8,
			label: "Password policy is visible and at least 8 characters"
		},
		{
			id: "name",
			ok: config.signup.collectDisplayName,
			label: "Signup collects a display name"
		},
		{
			id: "empty",
			ok: config.empty.cta.trim().length > 0,
			label: "Empty home has a way in"
		},
		{
			id: "price",
			ok: config.paywall.price.trim().length > 0,
			label: "Plus shows a price"
		},
		{
			id: "offline",
			ok: config.offline,
			label: "Offline queue is in the build"
		},
		{
			id: "crash",
			ok: config.crashHandler,
			label: "Crash boundary is on"
		},
		{
			id: "type",
			ok: config.largeType,
			label: "Large text is honored"
		}
	];
}
function pick(bots, styles) {
	for (const style of styles) {
		const hit = bots.find((bot) => bot.style === style);
		if (hit) return hit;
	}
	return bots[0];
}
function drafts(mission) {
	return [
		{
			id: "password",
			styles: ["adversarial", "scripted"],
			severity: "blocker",
			area: "Signup",
			title: "Password rules stay hidden until the form fails",
			body: "Testers burn attempts before they learn the policy. Play pre-launch will flag this as a broken credential form.",
			repro: [
				"Opt into the track and open signup.",
				"Submit a short password.",
				"Notice the rule only appears in the error."
			],
			merge: { signup: {
				showPasswordRules: true,
				minPassword: 10
			} },
			when: (config) => !config.signup.showPasswordRules || config.signup.minPassword < 8
		},
		{
			id: "name",
			styles: ["exploratory", "adversarial"],
			severity: "minor",
			area: "Signup",
			title: "Accounts are created with no name",
			body: "The form never asks who the tester is. Review replies and crash mail will look anonymous.",
			repro: [
				"Create an account.",
				"Open the profile row.",
				"Confirm there is no display name to edit."
			],
			merge: { signup: { collectDisplayName: true } },
			when: (config) => !config.signup.collectDisplayName
		},
		{
			id: "empty",
			styles: ["exploratory", "accessibility"],
			severity: "major",
			area: "Home",
			title: "Empty home is a dead end",
			body: "A first session lands on a title and nothing else. One-handed testers stop here.",
			repro: [
				"Finish signup.",
				"Land on the empty home.",
				"Look for a control that starts a note."
			],
			merge: { empty: { cta: "Write a field note" } },
			when: (config) => config.empty.cta.trim().length === 0
		},
		{
			id: "price",
			styles: ["scripted", "adversarial"],
			severity: "blocker",
			area: "Billing",
			title: "Plus asks for a purchase and never names the price",
			body: "A Buy button with a blank price will fail Play policy and any tester without a card already on file.",
			repro: [
				"Open Plus from the listing.",
				"Read the purchase row.",
				"Confirm there is no price before the button."
			],
			merge: { paywall: {
				price: "$4.99 / month",
				cta: "Start Plus"
			} },
			when: (config) => config.paywall.price.trim().length === 0
		},
		{
			id: "offline",
			styles: ["exploratory", "scripted"],
			severity: "major",
			area: "Network",
			title: "Field notes die without a network",
			body: /offline|network|slow|subway|field|airplane/i.test(mission) ? "The brief asks for a note without a network. This build has no queue." : "Install succeeds on a slow radio, then the first note has nowhere to wait.",
			repro: [
				"Turn the radio off.",
				"Try to keep a note.",
				"Confirm nothing is queued."
			],
			merge: { offline: true },
			newFile: {
				path: "src/features/OfflineQueue.ts",
				content: OFFLINE_FILE
			},
			when: (config) => !config.offline
		},
		{
			id: "crash",
			styles: ["scripted", "adversarial"],
			severity: "major",
			area: "Stability",
			title: "No crash boundary on the beta",
			body: "Pre-launch report will show an unprotected startup. A throw takes the whole activity.",
			repro: ["Read the startup path.", "Confirm there is no boundary around the note screen."],
			merge: { crashHandler: true },
			when: (config) => !config.crashHandler
		},
		{
			id: "type",
			styles: ["accessibility", "exploratory"],
			severity: "major",
			area: "Access",
			title: "Large text is ignored",
			body: "The access seat keeps the system text size up. This build stays at the default scale.",
			repro: [
				"Set large text on the device.",
				"Open signup and Plus.",
				"Confirm the scale did not follow."
			],
			merge: { largeType: true },
			when: (config) => !config.largeType
		}
	];
}
function closer(style) {
	if (style === "adversarial") return "I tried to break signup and the paywall.";
	if (style === "scripted") return "I ran the regression sheet.";
	if (style === "accessibility") return "I stayed on large text and a screen-reader path.";
	return "I wandered without a script.";
}
function planRun(bots, config, mission, now) {
	const armed = bots.filter((bot) => bot.armed);
	const events = [];
	armed.forEach((bot, index) => {
		const start = index * 420;
		const step = 680;
		[
			{
				screen: "listing",
				text: `Opted into ${config.track} testing as ${bot.gmail}.`
			},
			{
				screen: "listing",
				text: `Installed ${config.name} ${config.version} (${config.versionCode}) on ${bot.device}, API ${bot.api}.`
			},
			{
				screen: "signup",
				text: config.signup.showPasswordRules ? `Signup in ${bot.locale} showed the password policy.` : `Signup in ${bot.locale} hid the password policy until it failed.`
			},
			{
				screen: "signup",
				text: config.signup.collectDisplayName ? `Signed up an account named ${bot.callsign}.` : `Signed up ${bot.gmail}. The form never asked for a name.`
			},
			{
				screen: "home",
				text: config.empty.cta.trim() ? `Empty home offered “${config.empty.cta.trim()}”.` : "Empty home had no action. Stopped, then backed out."
			},
			{
				screen: "paywall",
				text: config.paywall.price.trim() ? `Plus listed ${config.paywall.price.trim()}.` : `Plus said “${config.paywall.cta || "Buy"}” and never named a price.`
			},
			{
				screen: "report",
				text: config.offline ? `Offline queue was present. Filed the ${bot.style} note.` : `No offline path. Filed the ${bot.style} note.`
			}
		].forEach((line, i) => {
			events.push({
				id: `${bot.id}-${i}`,
				botId: bot.id,
				at: start + i * step,
				screen: line.screen,
				text: line.text
			});
		});
	});
	const findings = [];
	const patches = [];
	if (armed.length === 0) return {
		events,
		findings,
		patches,
		reviews: [],
		accounts: [],
		duration: 0
	};
	for (const draft of drafts(mission)) {
		if (!draft.when(config)) continue;
		const bot = pick(armed, draft.styles);
		const patchId = draft.merge || draft.newFile ? `p-${draft.id}` : void 0;
		findings.push({
			id: `f-${draft.id}`,
			botId: bot.id,
			severity: draft.severity,
			area: draft.area,
			title: draft.title,
			body: draft.body,
			repro: draft.repro,
			origin: "protocol",
			patchId,
			resolved: false
		});
		if (patchId && (draft.merge || draft.newFile)) patches.push({
			id: patchId,
			botId: bot.id,
			title: draft.title,
			rationale: draft.body,
			merge: draft.merge ?? {},
			newFile: draft.newFile,
			origin: "protocol"
		});
	}
	if (findings.length === 0) {
		const bot = armed[0];
		findings.push({
			id: "f-pass",
			botId: bot.id,
			severity: "note",
			area: "Release",
			title: "Protocol pass on this build",
			body: "No open defects in the signup, home, billing, network, stability, or access checks.",
			repro: ["Re-run after the next flag change."],
			origin: "protocol",
			resolved: false
		});
	}
	return {
		events,
		findings,
		patches,
		reviews: armed.map((bot) => reviewFor(bot, findings)),
		accounts: armed.map((bot) => ({
			email: bot.gmail.trim().toLowerCase(),
			botId: bot.id,
			displayName: config.signup.collectDisplayName ? bot.callsign : "",
			named: config.signup.collectDisplayName,
			createdAt: now
		})),
		duration: events.reduce((max, event) => Math.max(max, event.at), 0) + 900
	};
}
function reviewFor(bot, findings) {
	const top = findings.filter((finding) => finding.botId === bot.id && finding.severity !== "note")[0] ?? findings.find((finding) => finding.severity !== "note");
	let stars = 5;
	if (findings.some((finding) => finding.severity === "blocker")) stars -= 2;
	if (findings.some((finding) => finding.severity === "major")) stars -= 1;
	if (bot.style === "accessibility" && findings.some((finding) => finding.id === "f-type")) stars = Math.min(stars, 2);
	stars = Math.max(1, Math.min(5, stars));
	const bite = top ? top.title : "The closed-track build held under this pass";
	const keep = stars >= 4 ? "I would keep the opt-in" : "I would not widen this track yet";
	return {
		botId: bot.id,
		stars,
		text: `${bot.persona} ${closer(bot.style)} On ${bot.device} (${bot.locale}) ${keep}. ${bite}.`
	};
}
function patchPreview(config, merge) {
	return {
		before: serializeConfig(config),
		after: serializeConfig(applyMerge(config, merge))
	};
}
function vitals(config) {
	const passwordOk = config.signup.showPasswordRules && config.signup.minPassword >= 8;
	return {
		crashFree: config.crashHandler ? 99.4 : 96.1,
		anr: config.offline ? .11 : .46,
		signup: passwordOk ? 94 : 71
	};
}
var DEVICES = [
	"Pixel 9",
	"Pixel 8",
	"Pixel 7a",
	"Pixel Tablet",
	"Pixel Fold",
	"Galaxy S24",
	"Galaxy A15",
	"Moto G54",
	"Nothing Phone 2"
];
var LOCALES = [
	"en-US",
	"en-CA",
	"en-GB",
	"es-MX",
	"fr-CA",
	"pt-BR",
	"de-DE",
	"ja-JP"
];
var APIS = [
	"14",
	"15",
	"16"
];
var STYLES = [
	{
		id: "exploratory",
		label: "Exploratory",
		hint: "Wanders. Files what a new person would hit."
	},
	{
		id: "scripted",
		label: "Scripted",
		hint: "Runs the regression sheet and failed assertions."
	},
	{
		id: "adversarial",
		label: "Adversarial",
		hint: "Tries to break signup, paywall, and policy."
	},
	{
		id: "accessibility",
		label: "Access",
		hint: "Large text and a screen-reader path."
	}
];
var TRACKS = [
	"internal",
	"closed",
	"open",
	"production"
];
var CALLSIGNS = [
	"MOTH",
	"JUNO",
	"IRIS",
	"KESTREL",
	"SABLE",
	"RIO",
	"QUILL",
	"NEST",
	"PIPIT",
	"HARRIER",
	"LOOM",
	"BRAMBLE",
	"VESPER",
	"CEDAR",
	"WREN",
	"TALON",
	"BIRCH",
	"MARLOW",
	"FEN",
	"ORIOLE",
	"NIMBUS",
	"PETREL",
	"ALDER",
	"COVE",
	"LINNET"
];
var SEED_BOTS = [
	{
		callsign: "MOTH",
		gmail: "canary.moth.beta@gmail.com",
		persona: "Impatient returning tester. Quits a form that hides its rules.",
		device: "Pixel 9",
		api: "16",
		locale: "en-US",
		style: "adversarial",
		track: "closed",
		armed: true
	},
	{
		callsign: "JUNO",
		gmail: "canary.juno.beta@gmail.com",
		persona: "First week with a newborn. One hand, short sessions, no patience for a dead end.",
		device: "Galaxy A15",
		api: "14",
		locale: "en-CA",
		style: "exploratory",
		track: "closed",
		armed: true
	},
	{
		callsign: "IRIS",
		gmail: "canary.iris.beta@gmail.com",
		persona: "Screen reader first. Large text always on. Will not guess at unlabeled controls.",
		device: "Pixel 7a",
		api: "15",
		locale: "en-US",
		style: "accessibility",
		track: "closed",
		armed: true
	},
	{
		callsign: "KESTREL",
		gmail: "canary.kestrel.beta@gmail.com",
		persona: "Release regression. Same sheet every build. Failed assertions only.",
		device: "Pixel Tablet",
		api: "15",
		locale: "en-GB",
		style: "scripted",
		track: "closed",
		armed: true
	},
	{
		callsign: "SABLE",
		gmail: "canary.sable.beta@gmail.com",
		persona: "Night-shift field notes. Often underground, often offline.",
		device: "Nothing Phone 2",
		api: "15",
		locale: "en-US",
		style: "exploratory",
		track: "closed",
		armed: true
	},
	{
		callsign: "RIO",
		gmail: "canary.rio.beta@gmail.com",
		persona: "Spanish UI on a slow radio. Judges the build by the first stalled screen.",
		device: "Moto G54",
		api: "14",
		locale: "es-MX",
		style: "exploratory",
		track: "closed",
		armed: true
	},
	{
		callsign: "QUILL",
		gmail: "canary.quill.beta@gmail.com",
		persona: "Power user. Wants a name on the account and a keyboard path into a note.",
		device: "Galaxy S24",
		api: "16",
		locale: "en-US",
		style: "adversarial",
		track: "internal",
		armed: true
	},
	{
		callsign: "NEST",
		gmail: "canary.nest.beta@gmail.com",
		persona: "Brand new Google account. No card on file. Will not tap a priceless Buy.",
		device: "Pixel 8",
		api: "15",
		locale: "fr-CA",
		style: "scripted",
		track: "closed",
		armed: true
	}
];
function seedBots() {
	return SEED_BOTS.map((bot) => ({
		...bot,
		id: `bot_${bot.callsign.toLowerCase()}`
	}));
}
function freshBot(used) {
	const callsign = CALLSIGNS.find((name) => !used.includes(name)) ?? `BOT${used.length + 1}`;
	const slug = callsign.toLowerCase().replace(/[^a-z0-9]/g, "");
	return {
		id: `bot_${crypto.randomUUID().slice(0, 8)}`,
		callsign,
		gmail: `canary.${slug}.beta@gmail.com`,
		persona: "New seat. Describe who this bot is when they open the build.",
		device: "Pixel 8",
		api: "15",
		locale: "en-US",
		style: "exploratory",
		track: "closed",
		armed: true
	};
}
var emptyRuntime = {
	findings: [],
	patches: [],
	shipped: [],
	run: null,
	accounts: [],
	grokOn: true,
	grokBusy: false,
	grokRunId: null,
	grokNote: "",
	lastGrokKey: "",
	files: {}
};
function leadBot(bots) {
	return bots.find((bot) => bot.armed) ?? bots[0];
}
var useCanary = create()(persist((set, get) => ({
	bots: seedBots(),
	mission: SEED_MISSION,
	config: SEED_CONFIG,
	...emptyRuntime,
	setGrokOn: (grokOn) => set({ grokOn }),
	updateBot: (id, patch) => set((state) => ({ bots: state.bots.map((bot) => bot.id === id ? {
		...bot,
		...patch,
		id: bot.id
	} : bot) })),
	addBot: () => {
		const { bots } = get();
		if (bots.length >= 25) return null;
		const bot = freshBot(bots.map((item) => item.callsign));
		set({ bots: [...bots, bot] });
		return bot.id;
	},
	retireBot: (id) => set((state) => ({ bots: state.bots.filter((bot) => bot.id !== id) })),
	setMission: (mission) => set({ mission: mission.slice(0, 800) }),
	setConfig: (config) => set({ config }),
	startRun: () => {
		const state = get();
		if (state.grokBusy) return null;
		if (state.run && Date.now() < state.run.startedAt + state.run.duration) return null;
		const armed = state.bots.filter((bot) => bot.armed);
		if (armed.length === 0) return null;
		const startedAt = Date.now();
		const plan = planRun(state.bots, state.config, state.mission, startedAt);
		const id = `run_${startedAt.toString(36)}`;
		set({
			run: {
				id,
				startedAt,
				duration: plan.duration,
				events: plan.events,
				reviews: plan.reviews,
				botIds: armed.map((bot) => bot.id)
			},
			findings: plan.findings,
			patches: plan.patches,
			accounts: plan.accounts,
			grokNote: "",
			grokRunId: null
		});
		return id;
	},
	applyPatch: (id) => set((state) => {
		const patch = state.patches.find((item) => item.id === id);
		if (!patch) return state;
		const files = { ...state.files };
		if (patch.newFile) files[patch.newFile.path] = patch.newFile.content;
		return {
			config: applyMerge(state.config, patch.merge),
			files,
			patches: state.patches.filter((item) => item.id !== id),
			findings: state.findings.map((finding) => finding.patchId === id ? {
				...finding,
				resolved: true
			} : finding),
			shipped: [{
				id: patch.id,
				title: patch.title,
				at: Date.now(),
				origin: patch.origin
			}, ...state.shipped].slice(0, 40)
		};
	}),
	dismissPatch: (id) => set((state) => ({ patches: state.patches.filter((item) => item.id !== id) })),
	applyAll: () => {
		get().patches.map((patch) => patch.id).forEach((id) => get().applyPatch(id));
	},
	beginGrok: (runId) => set({
		grokBusy: true,
		grokRunId: runId,
		grokNote: "Grok is reading this build."
	}),
	finishGrok: (runId, key, incomingFindings, incomingPatches) => set((state) => {
		if (state.grokRunId !== runId) return state;
		const bot = leadBot(state.bots);
		if (!bot) return {
			...state,
			grokBusy: false,
			grokNote: "No bot to file the Grok pass.",
			grokRunId: null
		};
		const findings = [...state.findings, ...incomingFindings.map((finding, index) => ({
			...finding,
			id: `g-f-${runId}-${index}`,
			botId: bot.id,
			origin: "grok",
			resolved: false,
			patchId: void 0
		}))];
		return {
			findings,
			patches: [...state.patches, ...incomingPatches.map((patch, index) => {
				const id = `g-p-${runId}-${index}`;
				const findingIndex = findings.findIndex((finding) => finding.id === `g-f-${runId}-${index}`);
				if (findingIndex >= 0) findings[findingIndex] = {
					...findings[findingIndex],
					patchId: id
				};
				return {
					...patch,
					id,
					botId: bot.id,
					origin: "grok"
				};
			})],
			lastGrokKey: key,
			grokBusy: false,
			grokRunId: null,
			grokNote: incomingFindings.length === 0 && incomingPatches.length === 0 ? "Grok had nothing new on this build." : "Grok filed an addendum."
		};
	}),
	failGrok: (runId, message) => set((state) => state.grokRunId !== runId ? state : {
		grokBusy: false,
		grokRunId: null,
		grokNote: message
	}),
	noteGrok: (grokNote) => set({
		grokNote,
		grokBusy: false
	}),
	resetAll: () => set({
		bots: seedBots(),
		mission: SEED_MISSION,
		config: SEED_CONFIG,
		...emptyRuntime
	})
}), {
	name: "canary-swarm-v1",
	skipHydration: true,
	partialize: (state) => ({
		bots: state.bots,
		mission: state.mission,
		config: state.config,
		files: state.files,
		findings: state.findings,
		patches: state.patches,
		shipped: state.shipped,
		run: state.run,
		accounts: state.accounts,
		grokOn: state.grokOn,
		grokNote: state.grokNote,
		lastGrokKey: state.lastGrokKey
	})
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
export { STYLES as a, cn as c, patchPreview as d, preflight as f, vitals as h, SEED_CONFIG as i, mergeIsEmpty as l, useCanary as m, DEVICES as n, TRACKS as o, serializeConfig as p, LOCALES as r, buildKey as s, APIS as t, parseConfig as u };

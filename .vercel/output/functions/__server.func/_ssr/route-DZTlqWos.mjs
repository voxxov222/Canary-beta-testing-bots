import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime, b as Link, g as Outlet, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as cn, m as useCanary, p as serializeConfig, s as buildKey } from "./cn-CvHVDdmV.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as ClipboardCheck, i as Hammer, o as Bird, r as LayoutDashboard, s as Activity, t as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DZTlqWos.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askSwarm = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input.mission !== "string" || typeof input.configJson !== "string") throw new Error("Missing build");
	return {
		mission: input.mission.slice(0, 800),
		configJson: input.configJson.slice(0, 8e3),
		bots: typeof input.bots === "string" ? input.bots.slice(0, 6e3) : ""
	};
}).handler(createSsrRpc("e8fd2bccce3d75338a07d63509d5c2f4fccada69913442288f50ce77424bfae8"));
var NAV = [
	{
		to: "/",
		label: "Deck",
		icon: LayoutDashboard
	},
	{
		to: "/flock",
		label: "Flock",
		icon: Users
	},
	{
		to: "/run",
		label: "Run",
		icon: Activity
	},
	{
		to: "/report",
		label: "Report",
		icon: ClipboardCheck
	},
	{
		to: "/forge",
		label: "Forge",
		icon: Hammer
	}
];
function active(path, to) {
	if (to === "/") return path === "/";
	return path === to || path.startsWith(`${to}/`);
}
function Shell({ children }) {
	const path = useRouterState({ select: (state) => state.location.pathname });
	const navigate = useNavigate();
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const bots = useCanary((state) => state.bots);
	const run = useCanary((state) => state.run);
	const grokOn = useCanary((state) => state.grokOn);
	const grokBusy = useCanary((state) => state.grokBusy);
	const setGrokOn = useCanary((state) => state.setGrokOn);
	const armed = bots.filter((bot) => bot.armed).length;
	const running = Boolean(run && now < run.startedAt + run.duration);
	const blocked = grokBusy || running || armed === 0;
	(0, import_react.useEffect)(() => {
		useCanary.persist.rehydrate();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!running) return;
		const id = window.setInterval(() => setNow(Date.now()), 200);
		return () => window.clearInterval(id);
	}, [running]);
	async function onRun() {
		const state = useCanary.getState();
		const runId = state.startRun();
		if (!runId) return;
		setNow(Date.now());
		navigate({ to: "/run" });
		if (!state.grokOn) {
			state.noteGrok("Protocol only. Grok pass is off.");
			return;
		}
		const key = buildKey(state.mission, state.config, state.bots);
		if (key === state.lastGrokKey) {
			state.noteGrok("Grok already read this build. Protocol ran again.");
			return;
		}
		state.beginGrok(runId);
		try {
			const bots = state.bots.filter((bot) => bot.armed).map((bot) => `${bot.callsign} | ${bot.style} | ${bot.device} | ${bot.locale} | ${bot.persona}`).join("\n");
			const result = await askSwarm({ data: {
				mission: state.mission,
				configJson: serializeConfig(state.config),
				bots
			} });
			if (!result.ok) {
				useCanary.getState().failGrok(runId, result.error);
				return;
			}
			useCanary.getState().finishGrok(runId, key, result.findings, result.patches);
		} catch {
			useCanary.getState().failGrok(runId, "Grok pass did not finish. The protocol still filed.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-ink text-paper md:pl-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#content",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-40 focus:bg-canary focus:px-3 focus:py-2 focus:text-canary-ink",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-line bg-ink px-4 py-6 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-mute",
						children: "Play beta swarm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8",
						"aria-label": "Primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-1",
							children: NAV.map((item) => {
								const on = active(path, item.to);
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									"aria-current": on ? "page" : void 0,
									className: cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm", on ? "bg-panel text-canary" : "text-dim hover:text-paper"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4",
										"aria-hidden": true
									}), item.label]
								}) }, item.to);
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-auto font-mono text-xs text-mute tabular-nums",
						children: [
							armed,
							" / ",
							25,
							" in the run"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { compact: true })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hidden text-sm text-mute md:block",
						children: [
							"Up to ",
							25,
							" bots on one Play track"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-2 text-sm text-dim",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: grokOn,
								onChange: (event) => setGrokOn(event.target.checked),
								"aria-label": "Include a Grok pass"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grok" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void onRun(),
							disabled: blocked,
							className: "inline-flex min-h-11 items-center rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink disabled:opacity-50",
							children: grokBusy ? "Grok is reading" : running ? "Swarm is out" : "Run swarm"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "content",
				className: "px-4 py-6 pb-28 md:px-8 md:pb-12",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ink md:hidden",
				"aria-label": "Primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-5",
					children: NAV.map((item) => {
						const on = active(path, item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							"aria-current": on ? "page" : void 0,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-xs", on ? "text-canary" : "text-mute"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4",
								"aria-hidden": true
							}), item.label]
						}) }, item.to);
					})
				})
			})
		]
	});
}
function Mark({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-8 place-items-center rounded-lg bg-canary text-canary-ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bird, {
				className: "size-4",
				strokeWidth: 2.25,
				"aria-hidden": true
			})
		}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-2xl leading-none text-paper",
			children: "Canary"
		})]
	});
}
var SplitComponent = function AppLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
};
//#endregion
export { SplitComponent as component };

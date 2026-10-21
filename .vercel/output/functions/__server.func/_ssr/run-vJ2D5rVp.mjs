import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as useCanary } from "./cn-CvHVDdmV.mjs";
import { a as SeverityLabel, r as Panel } from "./ui-DpBhgMbR.mjs";
import { t as NorthlinePhone } from "./phone-BGqLBnfy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-vJ2D5rVp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RunPage() {
	const run = useCanary((state) => state.run);
	const bots = useCanary((state) => state.bots);
	const config = useCanary((state) => state.config);
	const findings = useCanary((state) => state.findings);
	const grokNote = useCanary((state) => state.grokNote);
	const grokBusy = useCanary((state) => state.grokBusy);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [instant, setInstant] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setInstant(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	}, []);
	const running = Boolean(run && now < run.startedAt + run.duration);
	(0, import_react.useEffect)(() => {
		if (!running || instant) return;
		const id = window.setInterval(() => setNow(Date.now()), 200);
		return () => window.clearInterval(id);
	}, [running, instant]);
	const elapsed = !run || instant ? Number.POSITIVE_INFINITY : now - run.startedAt;
	const visible = run ? run.events.filter((event) => event.at <= elapsed) : [];
	const latest = visible[visible.length - 1];
	const driver = bots.find((bot) => bot.id === latest?.botId);
	const done = Boolean(run && (instant || now >= run.startedAt + run.duration));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-5xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Run"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-dim",
					children: [
						"Armed bots opt in, install ",
						config.name,
						" ",
						config.version,
						", and sign up with their own Gmail. The protocol files what it can see. Grok, if it is on, reads the same build once."
					]
				})]
			}),
			!run ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-paper",
				children: "The swarm has not been out on this build."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: "Use Run swarm in the bar. Arm at least one bot first."
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: done ? "Filed" : "On the track"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-mute tabular-nums",
								children: [
									visible.length,
									"/",
									run.events.length
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "canary-log flex flex-col gap-3 overflow-y-auto",
							"aria-live": "polite",
							children: visible.map((event) => {
								const bot = bots.find((item) => item.id === event.botId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "border-t border-line pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-canary",
										children: bot?.callsign ?? "BOT"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-paper",
										children: event.text
									})]
								}, event.id);
							})
						}),
						grokBusy || grokNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-dim",
							children: grokBusy ? "Grok is reading this build." : grokNote
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NorthlinePhone, {
						config,
						driver: driver?.callsign,
						forcedScreen: !done && latest ? latest.screen : void 0
					})
				})]
			}),
			done && findings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "What they filed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forge",
						className: "text-sm text-dim underline decoration-line underline-offset-4",
						children: "Open forge"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-4",
					children: findings.map((finding) => {
						const bot = bots.find((item) => item.id === finding.botId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityLabel, { severity: finding.severity }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-mute",
											children: bot?.callsign
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs uppercase tracking-widest text-mute",
											children: finding.origin
										}),
										finding.resolved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-dim",
											children: "Patched"
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-paper",
									children: finding.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-dim",
									children: finding.body
								})
							]
						}, finding.id);
					})
				})]
			}) : null
		]
	});
}
//#endregion
export { RunPage as component };

import { Y as require_jsx_runtime, b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { f as preflight, m as useCanary, o as TRACKS } from "./_ssr/cn-CvHVDdmV.mjs";
import { r as Panel } from "./_ssr/ui-DpBhgMbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-M2TtYKf5.js
var import_jsx_runtime = require_jsx_runtime();
function DeckPage() {
	const config = useCanary((state) => state.config);
	const setConfig = useCanary((state) => state.setConfig);
	const mission = useCanary((state) => state.mission);
	const setMission = useCanary((state) => state.setMission);
	const bots = useCanary((state) => state.bots);
	const findings = useCanary((state) => state.findings);
	const patches = useCanary((state) => state.patches);
	const accounts = useCanary((state) => state.accounts);
	const health = preflight(config);
	const open = health.filter((item) => !item.ok).length;
	const armed = bots.filter((bot) => bot.armed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-5xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl text-paper",
					children: "Deck"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-dim",
					children: [
						"Twenty-five seats. Each bot gets a Gmail, a device, and a way of breaking ",
						config.name,
						". They opt into the Play track, sign up for their own accounts, then file the defect or patch it."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "In the run",
						value: `${armed.length}`,
						hint: `of 25 seats`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Accounts",
						value: `${accounts.length}`,
						hint: "created inside the build"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open findings",
						value: `${findings.filter((item) => !item.resolved).length}`,
						hint: "from the last run"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Patches waiting",
						value: `${patches.length}`,
						hint: "ready in the forge"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "flex flex-col gap-4 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Build health"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-mute tabular-nums",
								children: [open, " open"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col",
							children: health.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-4 border-t border-line py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-paper",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: item.ok ? "font-mono text-xs uppercase tracking-widest text-mute" : "font-mono text-xs uppercase tracking-widest text-canary",
									children: item.ok ? "Clear" : "Open"
								})]
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/forge",
							className: "text-sm text-dim underline decoration-line underline-offset-4",
							children: "Edit flags and patches in Forge"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-6 lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: config.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-dim",
									children: "Package"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: config.packageId,
									onChange: (event) => setConfig({
										...config,
										packageId: event.target.value.trim() || config.packageId
									}),
									spellCheck: false,
									className: "font-mono text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-dim",
										children: "Version"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: config.version,
										onChange: (event) => setConfig({
											...config,
											version: event.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-dim",
										children: "Version code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "numeric",
										value: config.versionCode,
										onChange: (event) => {
											const next = Number(event.target.value);
											if (Number.isInteger(next) && next > 0) setConfig({
												...config,
												versionCode: next
											});
										}
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-dim",
									children: "Track"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: config.track,
									onChange: (event) => setConfig({
										...config,
										track: event.target.value
									}),
									children: TRACKS.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: track,
										children: track
									}, track))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-dim",
									children: [
										"Rollout ",
										Math.round(config.rollout),
										"%"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 100,
									value: config.rollout,
									onChange: (event) => setConfig({
										...config,
										rollout: Number(event.target.value)
									})
								})]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "What this swarm is proving"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: mission,
						onChange: (event) => setMission(event.target.value),
						"aria-label": "Mission brief",
						maxLength: 800
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mute",
						children: "The protocol and the Grok pass both read this brief."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Flock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/flock",
					className: "text-sm text-dim underline decoration-line underline-offset-4",
					children: "Customize"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-2",
				children: bots.map((bot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/flock",
					className: bot.armed ? "inline-flex min-h-11 items-center rounded-lg border border-line px-3 font-mono text-xs text-paper" : "inline-flex min-h-11 items-center rounded-lg border border-line px-3 font-mono text-xs text-mute",
					children: bot.callsign
				}) }, bot.id))
			})] })
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl tabular-nums text-paper",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: hint
			})
		]
	});
}
//#endregion
export { DeckPage as component };

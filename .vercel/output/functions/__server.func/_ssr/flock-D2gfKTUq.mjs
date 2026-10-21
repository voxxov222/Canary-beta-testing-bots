import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as STYLES, c as cn, m as useCanary, n as DEVICES, o as TRACKS, r as LOCALES, t as APIS } from "./cn-CvHVDdmV.mjs";
import { n as Field, t as Button } from "./ui-DpBhgMbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/flock-D2gfKTUq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function FlockPage() {
	const bots = useCanary((state) => state.bots);
	const updateBot = useCanary((state) => state.updateBot);
	const addBot = useCanary((state) => state.addBot);
	const retireBot = useCanary((state) => state.retireBot);
	const resetAll = useCanary((state) => state.resetAll);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [confirmReset, setConfirmReset] = (0, import_react.useState)(false);
	const bot = bots.find((item) => item.id === selected) ?? null;
	const openSeats = 25 - bots.length;
	const duplicateGmail = (0, import_react.useMemo)(() => {
		if (!bot) return false;
		const email = bot.gmail.trim().toLowerCase();
		return bots.some((item) => item.id !== bot.id && item.gmail.trim().toLowerCase() === email);
	}, [bot, bots]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-5xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl",
						children: "Flock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-dim",
						children: [
							bots.length,
							" of ",
							25,
							" seats filled. ",
							openSeats,
							" open. Assign a Gmail you control — Canary stores it for the tester list and the in-build signup. It does not create the Google account."
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const id = addBot();
						if (id) setSelected(id);
					},
					disabled: bots.length >= 25,
					children: "Add a bot"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: bots.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(item.id),
					className: cn("flex w-full flex-col gap-2 rounded-xl border border-line bg-panel p-4 text-left", !item.armed && "opacity-60"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm text-paper",
								children: item.callsign
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs uppercase tracking-widest text-mute",
								children: item.armed ? "In the run" : "Benched"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-sm text-dim",
							children: item.gmail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-mute",
							children: [
								item.device,
								" · ",
								item.locale,
								" · ",
								item.style
							]
						})
					]
				}) }, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3",
				children: confirmReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-dim",
						children: "Reset the flock, the build, and the last report?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							resetAll();
							setConfirmReset(false);
							setSelected(null);
						},
						children: "Reset"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						onClick: () => setConfirmReset(false),
						children: "Cancel"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => setConfirmReset(true),
					children: "Reset flock and build"
				})
			}),
			bot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 flex justify-end bg-ink/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex h-full w-full flex-col gap-4 overflow-y-auto border-l border-line bg-ink p-5 md:max-w-md",
					onSubmit: (event) => {
						event.preventDefault();
						setSelected(null);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Seat"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "quiet",
								onClick: () => setSelected(null),
								children: "Close"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Callsign",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: bot.callsign,
								maxLength: 16,
								onChange: (event) => updateBot(bot.id, { callsign: event.target.value.toUpperCase() }),
								className: "font-mono"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Gmail",
							hint: !EMAIL.test(bot.gmail.trim()) ? "Needs a real email shape." : !bot.gmail.toLowerCase().endsWith("@gmail.com") ? "Play closed testing wants a Google account. Gmail is the usual one." : duplicateGmail ? "Another bot already uses this inbox." : "This is the identity that opts into the track and signs up.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: bot.gmail,
								onChange: (event) => updateBot(bot.id, { gmail: event.target.value.trim() }),
								inputMode: "email",
								spellCheck: false,
								className: "font-mono text-sm"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Persona",
							hint: "The protocol quotes this in the Play review.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: bot.persona,
								maxLength: 240,
								onChange: (event) => updateBot(bot.id, { persona: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Device",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								list: "canary-devices",
								value: bot.device,
								onChange: (event) => updateBot(bot.id, { device: event.target.value })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
								id: "canary-devices",
								children: DEVICES.map((device) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: device }, device))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "API",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: bot.api,
									onChange: (event) => updateBot(bot.id, { api: event.target.value }),
									children: APIS.map((api) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: api,
										children: api
									}, api))
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Locale",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									list: "canary-locales",
									value: bot.locale,
									onChange: (event) => updateBot(bot.id, { locale: event.target.value })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "canary-locales",
									children: LOCALES.map((locale) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: locale }, locale))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Play list",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: bot.track,
								onChange: (event) => updateBot(bot.id, { track: event.target.value }),
								children: TRACKS.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: track,
									children: track
								}, track))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "text-sm text-dim",
									children: "Protocol"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2",
									children: STYLES.map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => updateBot(bot.id, { style: style.id }),
										className: cn("min-h-11 rounded-lg border px-3 text-left text-sm", bot.style === style.id ? "border-canary text-canary" : "border-line text-dim"),
										children: style.label
									}, style.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-mute",
									children: STYLES.find((style) => style.id === bot.style)?.hint
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-3 text-sm text-paper",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: bot.armed,
								onChange: (event) => updateBot(bot.id, { armed: event.target.checked })
							}), "In the run"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto flex items-center justify-between pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "quiet",
								onClick: () => {
									retireBot(bot.id);
									setSelected(null);
								},
								children: "Retire"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Done"
							})]
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { FlockPage as component };

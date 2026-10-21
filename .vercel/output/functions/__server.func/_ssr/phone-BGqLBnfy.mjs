import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as cn } from "./cn-CvHVDdmV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phone-BGqLBnfy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "listing",
		label: "List"
	},
	{
		id: "signup",
		label: "Join"
	},
	{
		id: "home",
		label: "Home"
	},
	{
		id: "paywall",
		label: "Plus"
	}
];
function NorthlinePhone({ config, forcedScreen, driver }) {
	const [screen, setScreen] = (0, import_react.useState)("listing");
	(0, import_react.useEffect)(() => {
		if (forcedScreen && forcedScreen !== "report") setScreen(forcedScreen);
	}, [forcedScreen]);
	const type = config.largeType ? "text-base" : "text-sm";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto w-72 rounded-4xl border border-line bg-ink p-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-3xl border border-line bg-panel",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs uppercase tracking-widest text-mute",
						children: [config.track, " track"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-dim",
						children: config.version
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("min-h-80 px-4 pb-4", type),
					children: [
						driver ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-3 font-mono text-xs text-canary",
							children: [driver, " is on the glass"]
						}) : null,
						screen === "listing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Listing, {
							config,
							onJoin: () => setScreen("signup")
						}) : null,
						screen === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signup, {
							config,
							onDone: () => setScreen("home")
						}) : null,
						screen === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home, { config }) : null,
						screen === "paywall" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paywall, { config }) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 border-t border-line",
					children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setScreen(tab.id),
						className: cn("min-h-11 text-xs", screen === tab.id ? "text-canary" : "text-mute"),
						children: tab.label
					}, tab.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-t border-line px-4 py-2 font-mono text-xs text-mute",
					children: config.crashHandler ? "Crash boundary on" : "No crash boundary"
				})
			]
		})
	});
}
function Listing({ config, onJoin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs text-mute",
				children: "Google Play"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-2xl text-paper",
				children: config.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs text-dim",
				children: config.packageId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-dim",
				children: [
					"Closed-style beta. Rollout ",
					Math.round(config.rollout),
					"%. Version code ",
					config.versionCode,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onJoin,
				className: "min-h-11 rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink",
				children: "Join beta"
			})
		]
	});
}
function Signup({ config, onDone }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [ok, setOk] = (0, import_react.useState)(false);
	function submit(event) {
		event.preventDefault();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Use the Google account email for this tester.");
			setOk(false);
			return;
		}
		if (password.length < config.signup.minPassword) {
			setError(config.signup.showPasswordRules ? `Use at least ${config.signup.minPassword} characters.` : `Rejected. The rule was hidden: minimum ${config.signup.minPassword}.`);
			setOk(false);
			return;
		}
		setError(null);
		setOk(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl text-paper",
				children: "Create account"
			}),
			config.signup.collectDisplayName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Display name",
				value: name,
				onChange: (event) => setName(event.target.value),
				placeholder: "Display name"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Email",
				value: email,
				onChange: (event) => setEmail(event.target.value),
				placeholder: "name@gmail.com",
				inputMode: "email"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Password",
				type: "password",
				value: password,
				onChange: (event) => setPassword(event.target.value),
				placeholder: "Password"
			}),
			config.signup.showPasswordRules ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-dim",
				children: [
					"At least ",
					config.signup.minPassword,
					" characters."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-mute",
				children: "No policy is shown before submit."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-canary",
				children: error
			}) : null,
			ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-paper",
				children: [
					"Account created for ",
					email,
					"."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "min-h-11 rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink",
				children: "Sign up"
			}),
			ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onDone,
				className: "min-h-11 text-sm text-dim",
				children: "Continue to home"
			}) : null
		]
	});
}
function Home({ config }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl text-paper",
				children: config.empty.title || "No notes yet"
			}),
			config.empty.cta.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen(true),
				className: "min-h-11 rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink",
				children: config.empty.cta.trim()
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-mute",
				children: "No action on this screen."
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Note drafted." }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-dim",
				children: config.offline ? "Offline queue armed. The note can wait." : "Network required. Nothing is queued."
			})
		]
	});
}
function Paywall({ config }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl text-paper",
				children: config.paywall.title || "Plus"
			}),
			config.paywall.price.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl text-paper",
				children: config.paywall.price
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-widest text-canary",
				children: "Price not set"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 rounded-lg border border-line px-4 text-sm text-paper",
				children: config.paywall.cta || "Buy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-mute",
				children: "Preview only. Nothing is charged."
			})
		]
	});
}
//#endregion
export { NorthlinePhone as t };

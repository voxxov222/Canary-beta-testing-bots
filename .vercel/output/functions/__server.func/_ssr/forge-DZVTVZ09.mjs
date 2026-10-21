import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as cn, d as patchPreview, i as SEED_CONFIG, l as mergeIsEmpty, m as useCanary, p as serializeConfig, u as parseConfig } from "./cn-CvHVDdmV.mjs";
import { n as Field, r as Panel, t as Button } from "./ui-DpBhgMbR.mjs";
import { t as NorthlinePhone } from "./phone-BGqLBnfy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forge-DZVTVZ09.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function diffLines(before, after) {
	const A = before.replace(/\n$/, "").split("\n");
	const B = after.replace(/\n$/, "").split("\n");
	const n = A.length;
	const m = B.length;
	const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
	const out = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) if (A[i] === B[j]) {
		out.push({
			type: "same",
			text: A[i]
		});
		i += 1;
		j += 1;
	} else if (dp[i + 1][j] >= dp[i][j + 1]) {
		out.push({
			type: "del",
			text: A[i]
		});
		i += 1;
	} else {
		out.push({
			type: "add",
			text: B[j]
		});
		j += 1;
	}
	while (i < n) out.push({
		type: "del",
		text: A[i++]
	});
	while (j < m) out.push({
		type: "add",
		text: B[j++]
	});
	return out;
}
function ForgePage() {
	const config = useCanary((state) => state.config);
	const setConfig = useCanary((state) => state.setConfig);
	const files = useCanary((state) => state.files);
	const patches = useCanary((state) => state.patches);
	const shipped = useCanary((state) => state.shipped);
	const bots = useCanary((state) => state.bots);
	const applyPatch = useCanary((state) => state.applyPatch);
	const dismissPatch = useCanary((state) => state.dismissPatch);
	const applyAll = useCanary((state) => state.applyAll);
	const text = serializeConfig(config);
	const [draft, setDraft] = (0, import_react.useState)(text);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [file, setFile] = (0, import_react.useState)("northline.config.json");
	const paths = ["northline.config.json", ...Object.keys(files)];
	(0, import_react.useEffect)(() => {
		if (!dirty) setDraft(text);
	}, [text, dirty]);
	function commit() {
		try {
			setConfig(parseConfig(draft));
			setDirty(false);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not read that build.");
		}
	}
	function patchFlag(key, value) {
		setConfig({
			...config,
			[key]: value
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-5xl flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Forge"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-dim",
				children: "Patches land in this build. The phone follows the config. Feature modules are source you can copy out. They are not executed in the preview."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "order-2 flex flex-col gap-4 lg:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: applyAll,
							disabled: patches.length === 0,
							children: "Apply all"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfig(SEED_CONFIG),
							children: "Restore defective build"
						})]
					}),
					patches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-paper",
						children: "No patches waiting."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-mute",
						children: "Run the swarm against an open defect, or leave the Grok pass on."
					})] }) : patches.map((patch) => {
						const bot = bots.find((item) => item.id === patch.botId);
						const preview = patchPreview(config, patch.merge);
						const lines = mergeIsEmpty(patch.merge) ? [] : diffLines(preview.before, preview.after);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs text-mute",
									children: [
										bot?.callsign ?? "BOT",
										" · ",
										patch.origin
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl",
									children: patch.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-dim",
									children: patch.rationale
								}),
								lines.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Diff, { lines }) : null,
								patch.newFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-mono text-xs text-canary",
									children: patch.newFile.path
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "overflow-x-auto rounded-lg border border-line bg-ink p-3 font-mono text-xs leading-relaxed text-dim",
									children: patch.newFile.content
								})] }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => applyPatch(patch.id),
										children: "Apply"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => dismissPatch(patch.id),
										children: "Dismiss"
									})]
								})
							]
						}, patch.id);
					}),
					shipped.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Shipped"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col",
						children: shipped.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line py-3 text-sm text-dim",
							children: [item.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 font-mono text-xs text-mute",
								children: item.origin
							})]
						}, `${item.id}-${item.at}`))
					})] }) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "order-1 flex flex-col gap-4 lg:order-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NorthlinePhone, { config }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Flags"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
								label: "Show password rules",
								checked: config.signup.showPasswordRules,
								onChange: (checked) => setConfig({
									...config,
									signup: {
										...config.signup,
										showPasswordRules: checked
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Minimum password",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "numeric",
									value: config.signup.minPassword,
									onChange: (event) => {
										const next = Number(event.target.value);
										if (Number.isInteger(next) && next >= 1 && next <= 64) setConfig({
											...config,
											signup: {
												...config.signup,
												minPassword: next
											}
										});
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
								label: "Collect display name",
								checked: config.signup.collectDisplayName,
								onChange: (checked) => setConfig({
									...config,
									signup: {
										...config.signup,
										collectDisplayName: checked
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Empty-home action",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: config.empty.cta,
									placeholder: "No action",
									onChange: (event) => setConfig({
										...config,
										empty: {
											...config.empty,
											cta: event.target.value
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Plus price",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: config.paywall.price,
									placeholder: "Blank",
									onChange: (event) => setConfig({
										...config,
										paywall: {
											...config.paywall,
											price: event.target.value
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
								label: "Offline queue",
								checked: config.offline,
								onChange: (checked) => patchFlag("offline", checked)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
								label: "Large text",
								checked: config.largeType,
								onChange: (checked) => patchFlag("largeType", checked)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
								label: "Crash boundary",
								checked: config.crashHandler,
								onChange: (checked) => patchFlag("crashHandler", checked)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: paths.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setFile(path),
								className: cn("min-h-11 rounded-lg border px-3 font-mono text-xs", file === path ? "border-canary text-canary" : "border-line text-mute"),
								children: path.split("/").pop()
							}, path))
						}), file === "northline.config.json" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								"aria-label": "Build config",
								className: "canary-source font-mono text-xs leading-relaxed",
								value: draft,
								spellCheck: false,
								onChange: (event) => {
									setDraft(event.target.value);
									setDirty(true);
								}
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-canary",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: commit,
								disabled: !dirty,
								children: "Commit build"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "overflow-x-auto font-mono text-xs leading-relaxed text-dim",
							children: files[file]
						})]
					})
				]
			})]
		})]
	});
}
function Flag({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-h-11 items-center justify-between gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			onChange: (event) => onChange(event.target.checked)
		})]
	});
}
function Diff({ lines }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "overflow-x-auto rounded-lg border border-line bg-ink p-3 font-mono text-xs leading-relaxed",
		children: lines.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn(line.type === "add" && "bg-canary/15 text-paper", line.type === "del" && "text-mute"),
			children: [line.type === "add" ? "+ " : line.type === "del" ? "- " : "  ", line.text || " "]
		}, `${line.type}-${index}`))
	});
}
//#endregion
export { ForgePage as component };

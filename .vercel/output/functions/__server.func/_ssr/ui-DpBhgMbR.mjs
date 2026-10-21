import { Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as cn } from "./cn-CvHVDdmV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-DpBhgMbR.js
var import_jsx_runtime = require_jsx_runtime();
function Button({ children, variant = "solid", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50", variant === "solid" && "bg-canary text-canary-ink hover:opacity-90", variant === "ghost" && "border border-line bg-ink text-paper hover:border-dim", variant === "quiet" && "text-dim hover:text-paper", className),
		...props,
		children
	});
}
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-xl border border-line bg-panel p-4 md:p-5", className),
		children
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-dim",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-mute",
				children: hint
			}) : null
		]
	});
}
var SEVERITY_TONE = {
	blocker: "text-canary",
	major: "text-paper",
	minor: "text-dim",
	note: "text-mute"
};
function SeverityLabel({ severity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("font-mono text-xs uppercase tracking-widest", SEVERITY_TONE[severity]),
		children: severity
	});
}
function Pips({ value, of = 5 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex gap-1",
		"aria-label": `${value} of ${of}`,
		children: Array.from({ length: of }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-sm", index < value ? "bg-canary" : "bg-line") }, index))
	});
}
//#endregion
export { SeverityLabel as a, Pips as i, Field as n, Panel as r, Button as t };

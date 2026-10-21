import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, Y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as vitals, m as useCanary } from "./cn-CvHVDdmV.mjs";
import { a as SeverityLabel, i as Pips, r as Panel, t as Button } from "./ui-DpBhgMbR.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-BHvcHgsk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function testerList(bots) {
	return bots.filter((bot) => bot.armed).map((bot) => bot.gmail.trim().toLowerCase()).filter((email) => email.includes("@")).join("\n");
}
function reportMarkdown(input) {
	const { config, bots, findings, reviews, accounts, mission } = input;
	const armed = bots.filter((bot) => bot.armed);
	const health = vitals(config);
	const lines = [
		`# Canary pre-launch — ${config.name} ${config.version}`,
		"",
		`Package \`${config.packageId}\` · ${config.track} track · rollout ${config.rollout}% · versionCode ${config.versionCode}`,
		"",
		`Brief: ${mission}`,
		"",
		"## Vitals",
		"",
		`- Crash-free sessions: ${health.crashFree.toFixed(1)}%`,
		`- ANR: ${health.anr.toFixed(2)}%`,
		`- Signup completion: ${health.signup}%`,
		"",
		"## Findings",
		""
	];
	if (findings.length === 0) lines.push("No run filed yet.");
	for (const finding of findings) {
		const bot = bots.find((item) => item.id === finding.botId);
		lines.push(`- [${finding.severity}] ${finding.title} — ${finding.area} — ${bot?.callsign ?? "bot"} (${finding.origin}${finding.resolved ? ", patched" : ""})`);
		lines.push(`  ${finding.body}`);
	}
	lines.push("", "## Tester list", "");
	for (const bot of armed) lines.push(`- ${bot.gmail} · ${bot.callsign} · ${bot.device} · ${bot.track}`);
	lines.push("", "## Accounts created in the build", "");
	if (accounts.length === 0) lines.push("None this run.");
	for (const account of accounts) lines.push(`- ${account.email}${account.named ? ` (${account.displayName})` : " (no display name)"}`);
	lines.push("", "## Reviews", "");
	for (const review of reviews) {
		const bot = bots.find((item) => item.id === review.botId);
		lines.push(`- ${bot?.callsign ?? "bot"} ${review.stars}/5 — ${review.text}`);
	}
	lines.push("");
	return lines.join("\n");
}
function downloadText(filename, text, type = "text/plain") {
	const blob = new Blob([text], { type });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
function ReportPage() {
	const config = useCanary((state) => state.config);
	const bots = useCanary((state) => state.bots);
	const findings = useCanary((state) => state.findings);
	const reviews = useCanary((state) => state.run?.reviews ?? []);
	const accounts = useCanary((state) => state.accounts);
	const mission = useCanary((state) => state.mission);
	const run = useCanary((state) => state.run);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const health = vitals(config);
	const armed = bots.filter((bot) => bot.armed);
	const counts = /* @__PURE__ */ new Map();
	for (const finding of findings) counts.set(finding.area, (counts.get(finding.area) ?? 0) + 1);
	const chart = [...counts.entries()].map(([area, count]) => ({
		area,
		count
	}));
	const devices = [...new Set(armed.map((bot) => bot.device))];
	async function copyList() {
		const text = testerList(bots);
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-5xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Pre-launch report"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-dim",
					children: [
						config.name,
						" ",
						config.version,
						" · ",
						config.packageId,
						" · ",
						config.track,
						" · rollout ",
						Math.round(config.rollout),
						"%. Paste the tester list into Play Console, then read what the flock filed."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Crash-free",
						value: `${health.crashFree.toFixed(1)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "ANR",
						value: `${health.anr.toFixed(2)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Signup",
						value: `${health.signup}%`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Findings"
						}),
						chart.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-48 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: chart,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "area",
											stroke: "var(--color-mute)",
											fontSize: 12,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											allowDecimals: false,
											hide: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "count",
											fill: "var(--color-canary)",
											radius: 4
										})
									]
								})
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mute",
							children: "Run the swarm to file findings against this build."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
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
													children: finding.area
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs text-mute",
													children: bot?.callsign
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
										}),
										finding.repro.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
											className: "mt-2 list-decimal pl-5 text-sm text-mute",
											children: finding.repro.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: step }, step))
										}) : null
									]
								}, finding.id);
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl",
									children: "Tester list"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-mute",
									children: "Play Console → Testing → Closed testing → Testers. One Google account per line. These are the inboxes you assigned. Canary does not create them."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "max-h-48 overflow-auto rounded-lg border border-line bg-ink p-3 font-mono text-xs text-dim",
									children: testerList(bots) || "No armed bots."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: () => void copyList(),
											children: copied ? "Copied" : "Copy list"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => downloadText("canary-testers.txt", `${testerList(bots)}\n`),
											children: "Download"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => downloadText("canary-prelaunch.md", reportMarkdown({
												config,
												bots,
												findings,
												reviews,
												accounts,
												mission
											}), "text/markdown"),
											children: "Report"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-2xl",
								children: ["Accounts in ", config.name]
							}), accounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "No signups yet. A run creates one account per armed bot."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col",
								children: accounts.map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-col border-t border-line py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-paper",
										children: account.email
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-mute",
										children: account.named ? account.displayName : "No display name collected"
									})]
								}, account.email))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl",
									children: "Device matrix"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-mute",
									children: run ? "This run walked listing, signup, home, and Plus on every armed device." : "Waiting on a run."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "flex flex-col",
									children: devices.map((device) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between border-t border-line py-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: device }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs uppercase tracking-widest text-mute",
											children: run ? "Covered" : "Idle"
										})]
									}, device))
								})
							]
						})
					]
				})]
			}),
			reviews.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Beta reviews"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-4",
					children: reviews.map((review) => {
						const bot = bots.find((item) => item.id === review.botId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-canary",
									children: bot?.callsign
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pips, { value: review.stars })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-dim",
								children: review.text
							})]
						}, review.botId);
					})
				})]
			}) : null
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-mute",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { ReportPage as component };

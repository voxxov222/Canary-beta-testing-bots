import type { Account, Bot, Finding, NorthlineConfig, Review } from "@/lib/canary/types";
import { vitals } from "@/lib/canary/engine";

export function testerList(bots: Bot[]): string {
  return bots
    .filter((bot) => bot.armed)
    .map((bot) => bot.gmail.trim().toLowerCase())
    .filter((email) => email.includes("@"))
    .join("\n");
}

export function reportMarkdown(input: {
  config: NorthlineConfig;
  bots: Bot[];
  findings: Finding[];
  reviews: Review[];
  accounts: Account[];
  mission: string;
}): string {
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
    "",
  ];
  if (findings.length === 0) lines.push("No run filed yet.");
  for (const finding of findings) {
    const bot = bots.find((item) => item.id === finding.botId);
    lines.push(
      `- [${finding.severity}] ${finding.title} — ${finding.area} — ${bot?.callsign ?? "bot"} (${finding.origin}${finding.resolved ? ", patched" : ""})`,
    );
    lines.push(`  ${finding.body}`);
  }
  lines.push("", "## Tester list", "");
  for (const bot of armed) lines.push(`- ${bot.gmail} · ${bot.callsign} · ${bot.device} · ${bot.track}`);
  lines.push("", "## Accounts created in the build", "");
  if (accounts.length === 0) lines.push("None this run.");
  for (const account of accounts) {
    lines.push(`- ${account.email}${account.named ? ` (${account.displayName})` : " (no display name)"}`);
  }
  lines.push("", "## Reviews", "");
  for (const review of reviews) {
    const bot = bots.find((item) => item.id === review.botId);
    lines.push(`- ${bot?.callsign ?? "bot"} ${review.stars}/5 — ${review.text}`);
  }
  lines.push("");
  return lines.join("\n");
}

export function downloadText(filename: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

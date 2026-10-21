import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Panel, Pips, SeverityLabel, Button } from "@/components/canary/ui";
import { vitals } from "@/lib/canary/engine";
import { downloadText, reportMarkdown, testerList } from "@/lib/canary/report-doc";
import { useCanary } from "@/lib/canary/store";

export const Route = createFileRoute("/_app/report")({
  component: ReportPage,
});

function ReportPage() {
  const config = useCanary((state) => state.config);
  const bots = useCanary((state) => state.bots);
  const findings = useCanary((state) => state.findings);
  const reviews = useCanary((state) => state.run?.reviews ?? []);
  const accounts = useCanary((state) => state.accounts);
  const mission = useCanary((state) => state.mission);
  const run = useCanary((state) => state.run);
  const [copied, setCopied] = useState(false);
  const health = vitals(config);
  const armed = bots.filter((bot) => bot.armed);
  const counts = new Map<string, number>();
  for (const finding of findings) counts.set(finding.area, (counts.get(finding.area) ?? 0) + 1);
  const chart = [...counts.entries()].map(([area, count]) => ({ area, count }));
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

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl">Pre-launch report</h1>
        <p className="mt-2 text-dim">
          {config.name} {config.version} · {config.packageId} · {config.track} · rollout {Math.round(config.rollout)}%.
          Paste the tester list into Play Console, then read what the flock filed.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Crash-free" value={`${health.crashFree.toFixed(1)}%`} />
        <Metric label="ANR" value={`${health.anr.toFixed(2)}%`} />
        <Metric label="Signup" value={`${health.signup}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">Findings</h2>
          {chart.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <XAxis dataKey="area" stroke="var(--color-mute)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} hide />
                  <Bar dataKey="count" fill="var(--color-canary)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-mute">Run the swarm to file findings against this build.</p>
          )}
          <ul className="flex flex-col gap-4">
            {findings.map((finding) => {
              const bot = bots.find((item) => item.id === finding.botId);
              return (
                <li key={finding.id} className="border-t border-line pt-3">
                  <p className="flex flex-wrap items-center gap-2">
                    <SeverityLabel severity={finding.severity} />
                    <span className="font-mono text-xs text-mute">{finding.area}</span>
                    <span className="font-mono text-xs text-mute">{bot?.callsign}</span>
                    {finding.resolved ? <span className="font-mono text-xs text-dim">Patched</span> : null}
                  </p>
                  <p className="mt-1 text-paper">{finding.title}</p>
                  <p className="text-sm text-dim">{finding.body}</p>
                  {finding.repro.length > 0 ? (
                    <ol className="mt-2 list-decimal pl-5 text-sm text-mute">
                      {finding.repro.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel className="flex flex-col gap-3">
            <h2 className="font-display text-2xl">Tester list</h2>
            <p className="text-sm text-mute">
              Play Console → Testing → Closed testing → Testers. One Google account per line. These are the inboxes
              you assigned. Canary does not create them.
            </p>
            <pre className="max-h-48 overflow-auto rounded-lg border border-line bg-ink p-3 font-mono text-xs text-dim">
              {testerList(bots) || "No armed bots."}
            </pre>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void copyList()}>{copied ? "Copied" : "Copy list"}</Button>
              <Button variant="ghost" onClick={() => downloadText("canary-testers.txt", `${testerList(bots)}\n`)}>
                Download
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  downloadText(
                    "canary-prelaunch.md",
                    reportMarkdown({ config, bots, findings, reviews, accounts, mission }),
                    "text/markdown",
                  )
                }
              >
                Report
              </Button>
            </div>
          </Panel>

          <Panel className="flex flex-col gap-3">
            <h2 className="font-display text-2xl">Accounts in {config.name}</h2>
            {accounts.length === 0 ? (
              <p className="text-sm text-mute">No signups yet. A run creates one account per armed bot.</p>
            ) : (
              <ul className="flex flex-col">
                {accounts.map((account) => (
                  <li key={account.email} className="flex flex-col border-t border-line py-3">
                    <span className="font-mono text-xs text-paper">{account.email}</span>
                    <span className="text-sm text-mute">
                      {account.named ? account.displayName : "No display name collected"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel className="flex flex-col gap-3">
            <h2 className="font-display text-2xl">Device matrix</h2>
            <p className="text-sm text-mute">
              {run ? "This run walked listing, signup, home, and Plus on every armed device." : "Waiting on a run."}
            </p>
            <ul className="flex flex-col">
              {devices.map((device) => (
                <li key={device} className="flex items-center justify-between border-t border-line py-3 text-sm">
                  <span>{device}</span>
                  <span className="font-mono text-xs uppercase tracking-widest text-mute">{run ? "Covered" : "Idle"}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {reviews.length > 0 ? (
        <Panel className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">Beta reviews</h2>
          <ul className="flex flex-col gap-4">
            {reviews.map((review) => {
              const bot = bots.find((item) => item.id === review.botId);
              return (
                <li key={review.botId} className="border-t border-line pt-3">
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-canary">{bot?.callsign}</span>
                    <Pips value={review.stars} />
                  </p>
                  <p className="mt-2 text-sm text-dim">{review.text}</p>
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line px-4 py-3">
      <p className="text-sm text-mute">{label}</p>
      <p className="font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { NorthlinePhone } from "@/components/canary/phone";
import { Panel, SeverityLabel } from "@/components/canary/ui";
import { useCanary } from "@/lib/canary/store";

export const Route = createFileRoute("/_app/run")({
  component: RunPage,
});

function RunPage() {
  const run = useCanary((state) => state.run);
  const bots = useCanary((state) => state.bots);
  const config = useCanary((state) => state.config);
  const findings = useCanary((state) => state.findings);
  const grokNote = useCanary((state) => state.grokNote);
  const grokBusy = useCanary((state) => state.grokBusy);
  const [now, setNow] = useState(() => Date.now());
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    setInstant(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const running = Boolean(run && now < run.startedAt + run.duration);
  useEffect(() => {
    if (!running || instant) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [running, instant]);

  const elapsed = !run || instant ? Number.POSITIVE_INFINITY : now - run.startedAt;
  const visible = run ? run.events.filter((event) => event.at <= elapsed) : [];
  const latest = visible[visible.length - 1];
  const driver = bots.find((bot) => bot.id === latest?.botId);
  const done = Boolean(run && (instant || now >= run.startedAt + run.duration));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl">Run</h1>
        <p className="mt-2 text-dim">
          Armed bots opt in, install {config.name} {config.version}, and sign up with their own Gmail. The protocol
          files what it can see. Grok, if it is on, reads the same build once.
        </p>
      </header>

      {!run ? (
        <Panel>
          <p className="text-paper">The swarm has not been out on this build.</p>
          <p className="mt-2 text-sm text-mute">Use Run swarm in the bar. Arm at least one bot first.</p>
        </Panel>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <Panel className="lg:col-span-3">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl">{done ? "Filed" : "On the track"}</h2>
              <p className="font-mono text-xs text-mute tabular-nums">
                {visible.length}/{run.events.length}
              </p>
            </div>
            <ol className="canary-log flex flex-col gap-3 overflow-y-auto" aria-live="polite">
              {visible.map((event) => {
                const bot = bots.find((item) => item.id === event.botId);
                return (
                  <li key={event.id} className="border-t border-line pt-3">
                    <p className="font-mono text-xs text-canary">{bot?.callsign ?? "BOT"}</p>
                    <p className="text-sm text-paper">{event.text}</p>
                  </li>
                );
              })}
            </ol>
            {grokBusy || grokNote ? <p className="mt-4 text-sm text-dim">{grokBusy ? "Grok is reading this build." : grokNote}</p> : null}
          </Panel>
          <div className="lg:col-span-2">
            <NorthlinePhone
              config={config}
              driver={driver?.callsign}
              forcedScreen={!done && latest ? latest.screen : undefined}
            />
          </div>
        </div>
      )}

      {done && findings.length > 0 ? (
        <Panel className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">What they filed</h2>
            <Link to="/forge" className="text-sm text-dim underline decoration-line underline-offset-4">
              Open forge
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            {findings.map((finding) => {
              const bot = bots.find((item) => item.id === finding.botId);
              return (
                <li key={finding.id} className="border-t border-line pt-3">
                  <p className="flex flex-wrap items-center gap-2">
                    <SeverityLabel severity={finding.severity} />
                    <span className="font-mono text-xs text-mute">{bot?.callsign}</span>
                    <span className="font-mono text-xs uppercase tracking-widest text-mute">{finding.origin}</span>
                    {finding.resolved ? <span className="font-mono text-xs text-dim">Patched</span> : null}
                  </p>
                  <p className="mt-1 text-paper">{finding.title}</p>
                  <p className="text-sm text-dim">{finding.body}</p>
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}

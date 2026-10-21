import { createFileRoute, Link } from "@tanstack/react-router";
import { preflight } from "@/lib/canary/engine";
import { useCanary } from "@/lib/canary/store";
import { MAX_BOTS, type Track } from "@/lib/canary/types";
import { TRACKS } from "@/lib/canary/seed";
import { Panel } from "@/components/canary/ui";

export const Route = createFileRoute("/_app/")({
  component: DeckPage,
});

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

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl text-paper">Deck</h1>
        <p className="mt-2 text-dim">
          Twenty-five seats. Each bot gets a Gmail, a device, and a way of breaking {config.name}. They opt into
          the Play track, sign up for their own accounts, then file the defect or patch it.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="In the run" value={`${armed.length}`} hint={`of ${MAX_BOTS} seats`} />
        <Stat label="Accounts" value={`${accounts.length}`} hint="created inside the build" />
        <Stat label="Open findings" value={`${findings.filter((item) => !item.resolved).length}`} hint="from the last run" />
        <Stat label="Patches waiting" value={`${patches.length}`} hint="ready in the forge" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel className="flex flex-col gap-4 lg:col-span-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">Build health</h2>
            <p className="font-mono text-xs text-mute tabular-nums">{open} open</p>
          </div>
          <ul className="flex flex-col">
            {health.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 border-t border-line py-3">
                <span className="text-sm text-paper">{item.label}</span>
                <span className={item.ok ? "font-mono text-xs uppercase tracking-widest text-mute" : "font-mono text-xs uppercase tracking-widest text-canary"}>
                  {item.ok ? "Clear" : "Open"}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/forge" className="text-sm text-dim underline decoration-line underline-offset-4">
            Edit flags and patches in Forge
          </Link>
        </Panel>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel className="flex flex-col gap-4">
            <h2 className="font-display text-2xl">{config.name}</h2>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-dim">Package</span>
              <input
                value={config.packageId}
                onChange={(event) => setConfig({ ...config, packageId: event.target.value.trim() || config.packageId })}
                spellCheck={false}
                className="font-mono text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-dim">Version</span>
                <input value={config.version} onChange={(event) => setConfig({ ...config, version: event.target.value })} />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-dim">Version code</span>
                <input
                  inputMode="numeric"
                  value={config.versionCode}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isInteger(next) && next > 0) setConfig({ ...config, versionCode: next });
                  }}
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-dim">Track</span>
              <select
                value={config.track}
                onChange={(event) => setConfig({ ...config, track: event.target.value as Track })}
              >
                {TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-dim">Rollout {Math.round(config.rollout)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={config.rollout}
                onChange={(event) => setConfig({ ...config, rollout: Number(event.target.value) })}
              />
            </label>
          </Panel>
        </div>
      </div>

      <Panel className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">What this swarm is proving</h2>
        <textarea
          value={mission}
          onChange={(event) => setMission(event.target.value)}
          aria-label="Mission brief"
          maxLength={800}
        />
        <p className="text-sm text-mute">The protocol and the Grok pass both read this brief.</p>
      </Panel>

      <Panel>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Flock</h2>
          <Link to="/flock" className="text-sm text-dim underline decoration-line underline-offset-4">
            Customize
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2">
          {bots.map((bot) => (
            <li key={bot.id}>
              <Link
                to="/flock"
                className={
                  bot.armed
                    ? "inline-flex min-h-11 items-center rounded-lg border border-line px-3 font-mono text-xs text-paper"
                    : "inline-flex min-h-11 items-center rounded-lg border border-line px-3 font-mono text-xs text-mute"
                }
              >
                {bot.callsign}
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-line px-4 py-3">
      <p className="text-sm text-mute">{label}</p>
      <p className="font-display text-3xl tabular-nums text-paper">{value}</p>
      <p className="text-sm text-mute">{hint}</p>
    </div>
  );
}

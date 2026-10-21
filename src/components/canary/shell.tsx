import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, Bird, ClipboardCheck, Hammer, LayoutDashboard, Users } from "lucide-react";
import { buildKey, serializeConfig } from "@/lib/canary/config";
import { askSwarm } from "@/lib/canary/grok";
import { useCanary } from "@/lib/canary/store";
import { MAX_BOTS } from "@/lib/canary/types";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/", label: "Deck", icon: LayoutDashboard },
  { to: "/flock", label: "Flock", icon: Users },
  { to: "/run", label: "Run", icon: Activity },
  { to: "/report", label: "Report", icon: ClipboardCheck },
  { to: "/forge", label: "Forge", icon: Hammer },
] as const;

function active(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const [now, setNow] = useState(() => Date.now());
  const bots = useCanary((state) => state.bots);
  const run = useCanary((state) => state.run);
  const grokOn = useCanary((state) => state.grokOn);
  const grokBusy = useCanary((state) => state.grokBusy);
  const setGrokOn = useCanary((state) => state.setGrokOn);
  const armed = bots.filter((bot) => bot.armed).length;
  const running = Boolean(run && now < run.startedAt + run.duration);
  const blocked = grokBusy || running || armed === 0;

  useEffect(() => {
    void useCanary.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [running]);

  async function onRun() {
    const state = useCanary.getState();
    const runId = state.startRun();
    if (!runId) return;
    setNow(Date.now());
    void navigate({ to: "/run" });
    if (!state.grokOn) {
      state.noteGrok("Protocol only. Grok pass is off.");
      return;
    }
    const key = buildKey(state.mission, state.config, state.bots);
    if (key === state.lastGrokKey) {
      state.noteGrok("Grok already read this build. Protocol ran again.");
      return;
    }
    state.beginGrok(runId);
    try {
      const bots = state.bots
        .filter((bot) => bot.armed)
        .map((bot) => `${bot.callsign} | ${bot.style} | ${bot.device} | ${bot.locale} | ${bot.persona}`)
        .join("\n");
      const result = await askSwarm({
        data: { mission: state.mission, configJson: serializeConfig(state.config), bots },
      });
      if (!result.ok) {
        useCanary.getState().failGrok(runId, result.error);
        return;
      }
      useCanary.getState().finishGrok(runId, key, result.findings, result.patches);
    } catch {
      useCanary.getState().failGrok(runId, "Grok pass did not finish. The protocol still filed.");
    }
  }

  return (
    <div className="min-h-screen bg-ink text-paper md:pl-56">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-40 focus:bg-canary focus:px-3 focus:py-2 focus:text-canary-ink"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-line bg-ink px-4 py-6 md:flex">
        <Mark />
        <p className="mt-2 text-sm text-mute">Play beta swarm</p>
        <nav className="mt-8" aria-label="Primary">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => {
              const on = active(path, item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm",
                      on ? "bg-panel text-canary" : "text-dim hover:text-paper",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="mt-auto font-mono text-xs text-mute tabular-nums">
          {armed} / {MAX_BOTS} in the run
        </p>
      </aside>

      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3 md:px-8">
        <div className="md:hidden">
          <Mark compact />
        </div>
        <p className="hidden text-sm text-mute md:block">Up to {MAX_BOTS} bots on one Play track</p>
        <div className="flex items-center gap-2">
          <label className="flex min-h-11 items-center gap-2 text-sm text-dim">
            <input
              type="checkbox"
              checked={grokOn}
              onChange={(event) => setGrokOn(event.target.checked)}
              aria-label="Include a Grok pass"
            />
            <span>Grok</span>
          </label>
          <button
            type="button"
            onClick={() => void onRun()}
            disabled={blocked}
            className="inline-flex min-h-11 items-center rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink disabled:opacity-50"
          >
            {grokBusy ? "Grok is reading" : running ? "Swarm is out" : "Run swarm"}
          </button>
        </div>
      </header>

      <main id="content" className="px-4 py-6 pb-28 md:px-8 md:pb-12">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ink md:hidden" aria-label="Primary">
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const on = active(path, item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                    on ? "text-canary" : "text-mute",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-canary text-canary-ink">
        <Bird className="size-4" strokeWidth={2.25} aria-hidden />
      </span>
      {compact ? null : <span className="font-display text-2xl leading-none text-paper">Canary</span>}
    </span>
  );
}

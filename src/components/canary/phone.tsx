import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { NorthlineConfig, Screen } from "@/lib/canary/types";

const TABS: { id: Screen; label: string }[] = [
  { id: "listing", label: "List" },
  { id: "signup", label: "Join" },
  { id: "home", label: "Home" },
  { id: "paywall", label: "Plus" },
];

export function NorthlinePhone({
  config,
  forcedScreen,
  driver,
}: {
  config: NorthlineConfig;
  forcedScreen?: Screen;
  driver?: string;
}) {
  const [screen, setScreen] = useState<Screen>("listing");
  useEffect(() => {
    if (forcedScreen && forcedScreen !== "report") setScreen(forcedScreen);
  }, [forcedScreen]);

  const type = config.largeType ? "text-base" : "text-sm";

  return (
    <div className="mx-auto w-72 rounded-4xl border border-line bg-ink p-2">
      <div className="overflow-hidden rounded-3xl border border-line bg-panel">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-widest text-mute">{config.track} track</p>
          <p className="font-mono text-xs text-dim">{config.version}</p>
        </div>
        <div className={cn("min-h-80 px-4 pb-4", type)}>
          {driver ? <p className="mb-3 font-mono text-xs text-canary">{driver} is on the glass</p> : null}
          {screen === "listing" ? <Listing config={config} onJoin={() => setScreen("signup")} /> : null}
          {screen === "signup" ? <Signup config={config} onDone={() => setScreen("home")} /> : null}
          {screen === "home" ? <Home config={config} /> : null}
          {screen === "paywall" ? <Paywall config={config} /> : null}
        </div>
        <div className="grid grid-cols-4 border-t border-line">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScreen(tab.id)}
              className={cn(
                "min-h-11 text-xs",
                screen === tab.id ? "text-canary" : "text-mute",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="border-t border-line px-4 py-2 font-mono text-xs text-mute">
          {config.crashHandler ? "Crash boundary on" : "No crash boundary"}
        </p>
      </div>
    </div>
  );
}

function Listing({ config, onJoin }: { config: NorthlineConfig; onJoin: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs text-mute">Google Play</p>
      <h3 className="font-display text-2xl text-paper">{config.name}</h3>
      <p className="font-mono text-xs text-dim">{config.packageId}</p>
      <p className="text-dim">
        Closed-style beta. Rollout {Math.round(config.rollout)}%. Version code {config.versionCode}.
      </p>
      <button type="button" onClick={onJoin} className="min-h-11 rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink">
        Join beta
      </button>
    </div>
  );
}

function Signup({ config, onDone }: { config: NorthlineConfig; onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Use the Google account email for this tester.");
      setOk(false);
      return;
    }
    if (password.length < config.signup.minPassword) {
      setError(
        config.signup.showPasswordRules
          ? `Use at least ${config.signup.minPassword} characters.`
          : `Rejected. The rule was hidden: minimum ${config.signup.minPassword}.`,
      );
      setOk(false);
      return;
    }
    setError(null);
    setOk(true);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <h3 className="font-display text-xl text-paper">Create account</h3>
      {config.signup.collectDisplayName ? (
        <input aria-label="Display name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Display name" />
      ) : null}
      <input aria-label="Email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@gmail.com" inputMode="email" />
      <input
        aria-label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
      />
      {config.signup.showPasswordRules ? (
        <p className="text-dim">At least {config.signup.minPassword} characters.</p>
      ) : (
        <p className="text-mute">No policy is shown before submit.</p>
      )}
      {error ? <p className="text-canary">{error}</p> : null}
      {ok ? <p className="text-paper">Account created for {email}.</p> : null}
      <button type="submit" className="min-h-11 rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink">
        Sign up
      </button>
      {ok ? (
        <button type="button" onClick={onDone} className="min-h-11 text-sm text-dim">
          Continue to home
        </button>
      ) : null}
    </form>
  );
}

function Home({ config }: { config: NorthlineConfig }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-xl text-paper">{config.empty.title || "No notes yet"}</h3>
      {config.empty.cta.trim() ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-11 rounded-lg bg-canary px-4 text-sm font-medium text-canary-ink"
        >
          {config.empty.cta.trim()}
        </button>
      ) : (
        <p className="text-mute">No action on this screen.</p>
      )}
      {open ? <p>Note drafted.</p> : null}
      <p className="text-dim">{config.offline ? "Offline queue armed. The note can wait." : "Network required. Nothing is queued."}</p>
    </div>
  );
}

function Paywall({ config }: { config: NorthlineConfig }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-xl text-paper">{config.paywall.title || "Plus"}</h3>
      {config.paywall.price.trim() ? (
        <p className="font-display text-3xl text-paper">{config.paywall.price}</p>
      ) : (
        <p className="font-mono text-xs uppercase tracking-widest text-canary">Price not set</p>
      )}
      <button type="button" className="min-h-11 rounded-lg border border-line px-4 text-sm text-paper">
        {config.paywall.cta || "Buy"}
      </button>
      <p className="text-mute">Preview only. Nothing is charged.</p>
    </div>
  );
}

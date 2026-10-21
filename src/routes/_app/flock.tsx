import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useCanary } from "@/lib/canary/store";
import { APIS, DEVICES, LOCALES, STYLES, TRACKS } from "@/lib/canary/seed";
import { MAX_BOTS, type Style, type Track } from "@/lib/canary/types";
import { Button, Field } from "@/components/canary/ui";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/_app/flock")({
  component: FlockPage,
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FlockPage() {
  const bots = useCanary((state) => state.bots);
  const updateBot = useCanary((state) => state.updateBot);
  const addBot = useCanary((state) => state.addBot);
  const retireBot = useCanary((state) => state.retireBot);
  const resetAll = useCanary((state) => state.resetAll);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const bot = bots.find((item) => item.id === selected) ?? null;
  const openSeats = MAX_BOTS - bots.length;

  const duplicateGmail = useMemo(() => {
    if (!bot) return false;
    const email = bot.gmail.trim().toLowerCase();
    return bots.some((item) => item.id !== bot.id && item.gmail.trim().toLowerCase() === email);
  }, [bot, bots]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl">Flock</h1>
          <p className="mt-2 text-dim">
            {bots.length} of {MAX_BOTS} seats filled. {openSeats} open. Assign a Gmail you control — Canary stores
            it for the tester list and the in-build signup. It does not create the Google account.
          </p>
        </div>
        <Button
          onClick={() => {
            const id = addBot();
            if (id) setSelected(id);
          }}
          disabled={bots.length >= MAX_BOTS}
        >
          Add a bot
        </Button>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {bots.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setSelected(item.id)}
              className={cn(
                "flex w-full flex-col gap-2 rounded-xl border border-line bg-panel p-4 text-left",
                !item.armed && "opacity-60",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-paper">{item.callsign}</span>
                <span className="font-mono text-xs uppercase tracking-widest text-mute">
                  {item.armed ? "In the run" : "Benched"}
                </span>
              </span>
              <span className="truncate text-sm text-dim">{item.gmail}</span>
              <span className="text-sm text-mute">
                {item.device} · {item.locale} · {item.style}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {confirmReset ? (
          <>
            <p className="text-sm text-dim">Reset the flock, the build, and the last report?</p>
            <Button variant="ghost" onClick={() => { resetAll(); setConfirmReset(false); setSelected(null); }}>
              Reset
            </Button>
            <Button variant="quiet" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="quiet" onClick={() => setConfirmReset(true)}>
            Reset flock and build
          </Button>
        )}
      </div>

      {bot ? (
        <div className="fixed inset-0 z-30 flex justify-end bg-ink/70">
          <form
            className="flex h-full w-full flex-col gap-4 overflow-y-auto border-l border-line bg-ink p-5 md:max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
              setSelected(null);
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Seat</h2>
              <Button variant="quiet" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
            <Field label="Callsign">
              <input
                value={bot.callsign}
                maxLength={16}
                onChange={(event) => updateBot(bot.id, { callsign: event.target.value.toUpperCase() })}
                className="font-mono"
              />
            </Field>
            <Field
              label="Gmail"
              hint={
                !EMAIL.test(bot.gmail.trim())
                  ? "Needs a real email shape."
                  : !bot.gmail.toLowerCase().endsWith("@gmail.com")
                    ? "Play closed testing wants a Google account. Gmail is the usual one."
                    : duplicateGmail
                      ? "Another bot already uses this inbox."
                      : "This is the identity that opts into the track and signs up."
              }
            >
              <input
                value={bot.gmail}
                onChange={(event) => updateBot(bot.id, { gmail: event.target.value.trim() })}
                inputMode="email"
                spellCheck={false}
                className="font-mono text-sm"
              />
            </Field>
            <Field label="Persona" hint="The protocol quotes this in the Play review.">
              <textarea value={bot.persona} maxLength={240} onChange={(event) => updateBot(bot.id, { persona: event.target.value })} />
            </Field>
            <Field label="Device">
              <input
                list="canary-devices"
                value={bot.device}
                onChange={(event) => updateBot(bot.id, { device: event.target.value })}
              />
              <datalist id="canary-devices">
                {DEVICES.map((device) => (
                  <option key={device} value={device} />
                ))}
              </datalist>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="API">
                <select value={bot.api} onChange={(event) => updateBot(bot.id, { api: event.target.value })}>
                  {APIS.map((api) => (
                    <option key={api} value={api}>
                      {api}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Locale">
                <input
                  list="canary-locales"
                  value={bot.locale}
                  onChange={(event) => updateBot(bot.id, { locale: event.target.value })}
                />
                <datalist id="canary-locales">
                  {LOCALES.map((locale) => (
                    <option key={locale} value={locale} />
                  ))}
                </datalist>
              </Field>
            </div>
            <Field label="Play list">
              <select value={bot.track} onChange={(event) => updateBot(bot.id, { track: event.target.value as Track })}>
                {TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </Field>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm text-dim">Protocol</legend>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => updateBot(bot.id, { style: style.id as Style })}
                    className={cn(
                      "min-h-11 rounded-lg border px-3 text-left text-sm",
                      bot.style === style.id ? "border-canary text-canary" : "border-line text-dim",
                    )}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-mute">{STYLES.find((style) => style.id === bot.style)?.hint}</p>
            </fieldset>
            <label className="flex min-h-11 items-center gap-3 text-sm text-paper">
              <input
                type="checkbox"
                checked={bot.armed}
                onChange={(event) => updateBot(bot.id, { armed: event.target.checked })}
              />
              In the run
            </label>
            <div className="mt-auto flex items-center justify-between pt-4">
              <Button variant="quiet" onClick={() => { retireBot(bot.id); setSelected(null); }}>
                Retire
              </Button>
              <Button type="submit">Done</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

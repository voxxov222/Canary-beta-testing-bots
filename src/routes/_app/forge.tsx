import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NorthlinePhone } from "@/components/canary/phone";
import { Button, Field, Panel } from "@/components/canary/ui";
import { mergeIsEmpty, parseConfig, serializeConfig, SEED_CONFIG } from "@/lib/canary/config";
import { diffLines } from "@/lib/canary/diff";
import { patchPreview } from "@/lib/canary/engine";
import { useCanary } from "@/lib/canary/store";
import { cn } from "@/lib/cn";
import type { NorthlineConfig } from "@/lib/canary/types";

export const Route = createFileRoute("/_app/forge")({
  component: ForgePage,
});

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
  const [draft, setDraft] = useState(text);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState("northline.config.json");
  const paths = ["northline.config.json", ...Object.keys(files)];

  useEffect(() => {
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

  function patchFlag<K extends keyof NorthlineConfig>(key: K, value: NorthlineConfig[K]) {
    setConfig({ ...config, [key]: value });
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl">Forge</h1>
        <p className="mt-2 text-dim">
          Patches land in this build. The phone follows the config. Feature modules are source you can copy out.
          They are not executed in the preview.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          <div className="flex flex-wrap gap-2">
            <Button onClick={applyAll} disabled={patches.length === 0}>
              Apply all
            </Button>
            <Button variant="ghost" onClick={() => setConfig(SEED_CONFIG)}>
              Restore defective build
            </Button>
          </div>

          {patches.length === 0 ? (
            <Panel>
              <p className="text-paper">No patches waiting.</p>
              <p className="mt-2 text-sm text-mute">Run the swarm against an open defect, or leave the Grok pass on.</p>
            </Panel>
          ) : (
            patches.map((patch) => {
              const bot = bots.find((item) => item.id === patch.botId);
              const preview = patchPreview(config, patch.merge);
              const lines = mergeIsEmpty(patch.merge) ? [] : diffLines(preview.before, preview.after);
              return (
                <Panel key={patch.id} className="flex flex-col gap-3">
                  <p className="font-mono text-xs text-mute">
                    {bot?.callsign ?? "BOT"} · {patch.origin}
                  </p>
                  <h2 className="font-display text-xl">{patch.title}</h2>
                  <p className="text-sm text-dim">{patch.rationale}</p>
                  {lines.length > 0 ? <Diff lines={lines} /> : null}
                  {patch.newFile ? (
                    <div>
                      <p className="mb-2 font-mono text-xs text-canary">{patch.newFile.path}</p>
                      <pre className="overflow-x-auto rounded-lg border border-line bg-ink p-3 font-mono text-xs leading-relaxed text-dim">
                        {patch.newFile.content}
                      </pre>
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <Button onClick={() => applyPatch(patch.id)}>Apply</Button>
                    <Button variant="ghost" onClick={() => dismissPatch(patch.id)}>
                      Dismiss
                    </Button>
                  </div>
                </Panel>
              );
            })
          )}

          {shipped.length > 0 ? (
            <Panel>
              <h2 className="font-display text-xl">Shipped</h2>
              <ul className="mt-3 flex flex-col">
                {shipped.map((item) => (
                  <li key={`${item.id}-${item.at}`} className="border-t border-line py-3 text-sm text-dim">
                    {item.title}
                    <span className="ml-2 font-mono text-xs text-mute">{item.origin}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>

        <div className="order-1 flex flex-col gap-4 lg:order-2">
          <NorthlinePhone config={config} />
          <Panel className="flex flex-col gap-4">
            <h2 className="font-display text-xl">Flags</h2>
            <Flag
              label="Show password rules"
              checked={config.signup.showPasswordRules}
              onChange={(checked) => setConfig({ ...config, signup: { ...config.signup, showPasswordRules: checked } })}
            />
            <Field label="Minimum password">
              <input
                inputMode="numeric"
                value={config.signup.minPassword}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isInteger(next) && next >= 1 && next <= 64) {
                    setConfig({ ...config, signup: { ...config.signup, minPassword: next } });
                  }
                }}
              />
            </Field>
            <Flag
              label="Collect display name"
              checked={config.signup.collectDisplayName}
              onChange={(checked) => setConfig({ ...config, signup: { ...config.signup, collectDisplayName: checked } })}
            />
            <Field label="Empty-home action">
              <input
                value={config.empty.cta}
                placeholder="No action"
                onChange={(event) => setConfig({ ...config, empty: { ...config.empty, cta: event.target.value } })}
              />
            </Field>
            <Field label="Plus price">
              <input
                value={config.paywall.price}
                placeholder="Blank"
                onChange={(event) => setConfig({ ...config, paywall: { ...config.paywall, price: event.target.value } })}
              />
            </Field>
            <Flag label="Offline queue" checked={config.offline} onChange={(checked) => patchFlag("offline", checked)} />
            <Flag label="Large text" checked={config.largeType} onChange={(checked) => patchFlag("largeType", checked)} />
            <Flag
              label="Crash boundary"
              checked={config.crashHandler}
              onChange={(checked) => patchFlag("crashHandler", checked)}
            />
          </Panel>

          <Panel className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {paths.map((path) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => setFile(path)}
                  className={cn(
                    "min-h-11 rounded-lg border px-3 font-mono text-xs",
                    file === path ? "border-canary text-canary" : "border-line text-mute",
                  )}
                >
                  {path.split("/").pop()}
                </button>
              ))}
            </div>
            {file === "northline.config.json" ? (
              <>
                <textarea
                  aria-label="Build config"
                  className="canary-source font-mono text-xs leading-relaxed"
                  value={draft}
                  spellCheck={false}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setDirty(true);
                  }}
                />
                {error ? <p className="text-sm text-canary">{error}</p> : null}
                <Button onClick={commit} disabled={!dirty}>
                  Commit build
                </Button>
              </>
            ) : (
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-dim">{files[file]}</pre>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Flag({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Diff({ lines }: { lines: { type: "same" | "add" | "del"; text: string }[] }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-line bg-ink p-3 font-mono text-xs leading-relaxed">
      {lines.map((line, index) => (
        <div
          key={`${line.type}-${index}`}
          className={cn(line.type === "add" && "bg-canary/15 text-paper", line.type === "del" && "text-mute")}
        >
          {line.type === "add" ? "+ " : line.type === "del" ? "- " : "  "}
          {line.text || " "}
        </div>
      ))}
    </pre>
  );
}

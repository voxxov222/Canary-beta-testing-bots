import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_CONFIG, SEED_MISSION, applyMerge } from "@/lib/canary/config";
import { planRun } from "@/lib/canary/engine";
import { freshBot, seedBots } from "@/lib/canary/seed";
import type { Bot, Finding, NorthlineConfig, Patch, Run, Shipped } from "@/lib/canary/types";
import { MAX_BOTS } from "@/lib/canary/types";

export type GrokFinding = Omit<Finding, "id" | "botId" | "origin" | "resolved" | "patchId">;
export type GrokPatch = Omit<Patch, "id" | "botId" | "origin">;

type CanaryState = {
  bots: Bot[];
  mission: string;
  config: NorthlineConfig;
  files: Record<string, string>;
  findings: Finding[];
  patches: Patch[];
  shipped: Shipped[];
  run: Run | null;
  accounts: { email: string; botId: string; displayName: string; named: boolean; createdAt: number }[];
  grokOn: boolean;
  grokBusy: boolean;
  grokRunId: string | null;
  grokNote: string;
  lastGrokKey: string;
  setGrokOn: (value: boolean) => void;
  updateBot: (id: string, patch: Partial<Bot>) => void;
  addBot: () => string | null;
  retireBot: (id: string) => void;
  setMission: (mission: string) => void;
  setConfig: (config: NorthlineConfig) => void;
  startRun: () => string | null;
  applyPatch: (id: string) => void;
  dismissPatch: (id: string) => void;
  applyAll: () => void;
  beginGrok: (runId: string) => void;
  finishGrok: (runId: string, key: string, findings: GrokFinding[], patches: GrokPatch[]) => void;
  failGrok: (runId: string, message: string) => void;
  noteGrok: (message: string) => void;
  resetAll: () => void;
};

const emptyRuntime = {
  findings: [] as Finding[],
  patches: [] as Patch[],
  shipped: [] as Shipped[],
  run: null as Run | null,
  accounts: [] as CanaryState["accounts"],
  grokOn: true,
  grokBusy: false,
  grokRunId: null as string | null,
  grokNote: "",
  lastGrokKey: "",
  files: {} as Record<string, string>,
};

function leadBot(bots: Bot[]): Bot | undefined {
  return bots.find((bot) => bot.armed) ?? bots[0];
}

export const useCanary = create<CanaryState>()(
  persist(
    (set, get) => ({
      bots: seedBots(),
      mission: SEED_MISSION,
      config: SEED_CONFIG,
      ...emptyRuntime,
      setGrokOn: (grokOn) => set({ grokOn }),
      updateBot: (id, patch) =>
        set((state) => ({
          bots: state.bots.map((bot) => (bot.id === id ? { ...bot, ...patch, id: bot.id } : bot)),
        })),
      addBot: () => {
        const { bots } = get();
        if (bots.length >= MAX_BOTS) return null;
        const bot = freshBot(bots.map((item) => item.callsign));
        set({ bots: [...bots, bot] });
        return bot.id;
      },
      retireBot: (id) => set((state) => ({ bots: state.bots.filter((bot) => bot.id !== id) })),
      setMission: (mission) => set({ mission: mission.slice(0, 800) }),
      setConfig: (config) => set({ config }),
      startRun: () => {
        const state = get();
        if (state.grokBusy) return null;
        if (state.run && Date.now() < state.run.startedAt + state.run.duration) return null;
        const armed = state.bots.filter((bot) => bot.armed);
        if (armed.length === 0) return null;
        const startedAt = Date.now();
        const plan = planRun(state.bots, state.config, state.mission, startedAt);
        const id = `run_${startedAt.toString(36)}`;
        set({
          run: {
            id,
            startedAt,
            duration: plan.duration,
            events: plan.events,
            reviews: plan.reviews,
            botIds: armed.map((bot) => bot.id),
          },
          findings: plan.findings,
          patches: plan.patches,
          accounts: plan.accounts,
          grokNote: "",
          grokRunId: null,
        });
        return id;
      },
      applyPatch: (id) =>
        set((state) => {
          const patch = state.patches.find((item) => item.id === id);
          if (!patch) return state;
          const files = { ...state.files };
          if (patch.newFile) files[patch.newFile.path] = patch.newFile.content;
          return {
            config: applyMerge(state.config, patch.merge),
            files,
            patches: state.patches.filter((item) => item.id !== id),
            findings: state.findings.map((finding) =>
              finding.patchId === id ? { ...finding, resolved: true } : finding,
            ),
            shipped: [{ id: patch.id, title: patch.title, at: Date.now(), origin: patch.origin }, ...state.shipped].slice(
              0,
              40,
            ),
          };
        }),
      dismissPatch: (id) => set((state) => ({ patches: state.patches.filter((item) => item.id !== id) })),
      applyAll: () => {
        const ids = get().patches.map((patch) => patch.id);
        ids.forEach((id) => get().applyPatch(id));
      },
      beginGrok: (runId) => set({ grokBusy: true, grokRunId: runId, grokNote: "Grok is reading this build." }),
      finishGrok: (runId, key, incomingFindings, incomingPatches) =>
        set((state) => {
          if (state.grokRunId !== runId) return state;
          const bot = leadBot(state.bots);
          if (!bot) return { ...state, grokBusy: false, grokNote: "No bot to file the Grok pass.", grokRunId: null };
          const findings = [
            ...state.findings,
            ...incomingFindings.map((finding, index) => ({
              ...finding,
              id: `g-f-${runId}-${index}`,
              botId: bot.id,
              origin: "grok" as const,
              resolved: false,
              patchId: undefined,
            })),
          ];
          const patches = [
            ...state.patches,
            ...incomingPatches.map((patch, index) => {
              const id = `g-p-${runId}-${index}`;
              const findingIndex = findings.findIndex((finding) => finding.id === `g-f-${runId}-${index}`);
              if (findingIndex >= 0) findings[findingIndex] = { ...findings[findingIndex]!, patchId: id };
              return { ...patch, id, botId: bot.id, origin: "grok" as const };
            }),
          ];
          const note =
            incomingFindings.length === 0 && incomingPatches.length === 0
              ? "Grok had nothing new on this build."
              : "Grok filed an addendum.";
          return {
            findings,
            patches,
            lastGrokKey: key,
            grokBusy: false,
            grokRunId: null,
            grokNote: note,
          };
        }),
      failGrok: (runId, message) =>
        set((state) => (state.grokRunId !== runId ? state : { grokBusy: false, grokRunId: null, grokNote: message })),
      noteGrok: (grokNote) => set({ grokNote, grokBusy: false }),
      resetAll: () =>
        set({
          bots: seedBots(),
          mission: SEED_MISSION,
          config: SEED_CONFIG,
          ...emptyRuntime,
        }),
    }),
    {
      name: "canary-swarm-v1",
      skipHydration: true,
      partialize: (state) => ({
        bots: state.bots,
        mission: state.mission,
        config: state.config,
        files: state.files,
        findings: state.findings,
        patches: state.patches,
        shipped: state.shipped,
        run: state.run,
        accounts: state.accounts,
        grokOn: state.grokOn,
        grokNote: state.grokNote,
        lastGrokKey: state.lastGrokKey,
      }),
    },
  ),
);

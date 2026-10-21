import { z } from "zod";
import type { ConfigMerge, NorthlineConfig } from "@/lib/canary/types";

export const configSchema = z.object({
  name: z.string().trim().min(1).max(40),
  packageId: z
    .string()
    .trim()
    .min(3)
    .max(80)
    .regex(/^[A-Za-z][\w.]*$/, "Package id looks wrong"),
  version: z.string().trim().min(1).max(20),
  versionCode: z.number().int().min(1).max(999999),
  track: z.enum(["internal", "closed", "open", "production"]),
  rollout: z.number().min(0).max(100),
  signup: z.object({
    showPasswordRules: z.boolean(),
    minPassword: z.number().int().min(1).max(64),
    collectDisplayName: z.boolean(),
  }),
  empty: z.object({
    title: z.string().max(80),
    cta: z.string().max(40),
  }),
  paywall: z.object({
    title: z.string().max(40),
    price: z.string().max(40),
    cta: z.string().max(40),
  }),
  offline: z.boolean(),
  largeType: z.boolean(),
  crashHandler: z.boolean(),
});

export const SEED_CONFIG: NorthlineConfig = {
  name: "Northline",
  packageId: "app.northline.notes",
  version: "0.9.4",
  versionCode: 42,
  track: "closed",
  rollout: 20,
  signup: {
    showPasswordRules: false,
    minPassword: 4,
    collectDisplayName: false,
  },
  empty: { title: "No notes yet", cta: "" },
  paywall: { title: "Northline Plus", price: "", cta: "Buy" },
  offline: false,
  largeType: false,
  crashHandler: false,
};

export const SEED_MISSION =
  "Prove a first-time tester on a slow phone can create an account, understand what Plus costs, and write a note without a network.";

export function serializeConfig(config: NorthlineConfig): string {
  const ordered: NorthlineConfig = {
    name: config.name,
    packageId: config.packageId,
    version: config.version,
    versionCode: config.versionCode,
    track: config.track,
    rollout: config.rollout,
    signup: {
      showPasswordRules: config.signup.showPasswordRules,
      minPassword: config.signup.minPassword,
      collectDisplayName: config.signup.collectDisplayName,
    },
    empty: { title: config.empty.title, cta: config.empty.cta },
    paywall: {
      title: config.paywall.title,
      price: config.paywall.price,
      cta: config.paywall.cta,
    },
    offline: config.offline,
    largeType: config.largeType,
    crashHandler: config.crashHandler,
  };
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

export function parseConfig(raw: string): NorthlineConfig {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("That is not valid JSON.");
  }
  const parsed = configSchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path.join(".") || "config";
    throw new Error(`${path}: ${issue?.message ?? "invalid"}`);
  }
  return parsed.data;
}

export function applyMerge(config: NorthlineConfig, merge: ConfigMerge): NorthlineConfig {
  return {
    ...config,
    name: merge.name ?? config.name,
    offline: merge.offline ?? config.offline,
    largeType: merge.largeType ?? config.largeType,
    crashHandler: merge.crashHandler ?? config.crashHandler,
    signup: { ...config.signup, ...merge.signup },
    empty: { ...config.empty, ...merge.empty },
    paywall: { ...config.paywall, ...merge.paywall },
  };
}

export function mergeIsEmpty(merge: ConfigMerge): boolean {
  return (
    merge.name === undefined &&
    merge.offline === undefined &&
    merge.largeType === undefined &&
    merge.crashHandler === undefined &&
    !merge.signup &&
    !merge.empty &&
    !merge.paywall
  );
}

export function buildKey(mission: string, config: NorthlineConfig, bots: { callsign: string; style: string; persona: string; armed: boolean }[]): string {
  const flock = bots
    .filter((bot) => bot.armed)
    .map((bot) => `${bot.callsign}:${bot.style}:${bot.persona}`)
    .join("|");
  return `${mission.trim()}::${serializeConfig(config)}::${flock}`;
}

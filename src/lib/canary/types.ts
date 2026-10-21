export const MAX_BOTS = 25;

export type Style = "exploratory" | "scripted" | "adversarial" | "accessibility";
export type Track = "internal" | "closed" | "open" | "production";
export type Severity = "blocker" | "major" | "minor" | "note";
export type Screen = "listing" | "signup" | "home" | "paywall" | "report";
export type Origin = "protocol" | "grok";

export type NorthlineConfig = {
  name: string;
  packageId: string;
  version: string;
  versionCode: number;
  track: Track;
  rollout: number;
  signup: {
    showPasswordRules: boolean;
    minPassword: number;
    collectDisplayName: boolean;
  };
  empty: { title: string; cta: string };
  paywall: { title: string; price: string; cta: string };
  offline: boolean;
  largeType: boolean;
  crashHandler: boolean;
};

export type ConfigMerge = {
  name?: string;
  offline?: boolean;
  largeType?: boolean;
  crashHandler?: boolean;
  signup?: Partial<NorthlineConfig["signup"]>;
  empty?: Partial<NorthlineConfig["empty"]>;
  paywall?: Partial<NorthlineConfig["paywall"]>;
};

export type Bot = {
  id: string;
  callsign: string;
  gmail: string;
  persona: string;
  device: string;
  api: string;
  locale: string;
  style: Style;
  track: Track;
  armed: boolean;
};

export type Finding = {
  id: string;
  botId: string;
  severity: Severity;
  area: string;
  title: string;
  body: string;
  repro: string[];
  origin: Origin;
  patchId?: string;
  resolved: boolean;
};

export type Patch = {
  id: string;
  botId: string;
  title: string;
  rationale: string;
  merge: ConfigMerge;
  newFile?: { path: string; content: string };
  origin: Origin;
};

export type Shipped = {
  id: string;
  title: string;
  at: number;
  origin: Origin;
};

export type RunEvent = {
  id: string;
  botId: string;
  at: number;
  screen: Screen;
  text: string;
};

export type Review = {
  botId: string;
  stars: number;
  text: string;
};

export type Account = {
  email: string;
  botId: string;
  displayName: string;
  named: boolean;
  createdAt: number;
};

export type Run = {
  id: string;
  startedAt: number;
  duration: number;
  events: RunEvent[];
  reviews: Review[];
  botIds: string[];
};

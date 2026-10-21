import { applyMerge, serializeConfig } from "@/lib/canary/config";
import type {
  Account,
  Bot,
  ConfigMerge,
  Finding,
  NorthlineConfig,
  Patch,
  Review,
  RunEvent,
  Screen,
  Style,
} from "@/lib/canary/types";

const OFFLINE_FILE = `/** Northline offline queue. Written by the swarm. */
export type QueuedNote = { id: string; body: string; at: number };

const KEY = "northline.queue";

export function enqueue(body: string): QueuedNote[] {
  const prev = read();
  const next = [...prev, { id: String(Date.now()), body, at: Date.now() }];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function read(): QueuedNote[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as QueuedNote[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
`;

export type PreflightItem = { id: string; ok: boolean; label: string };

export function preflight(config: NorthlineConfig): PreflightItem[] {
  return [
    {
      id: "password",
      ok: config.signup.showPasswordRules && config.signup.minPassword >= 8,
      label: "Password policy is visible and at least 8 characters",
    },
    {
      id: "name",
      ok: config.signup.collectDisplayName,
      label: "Signup collects a display name",
    },
    {
      id: "empty",
      ok: config.empty.cta.trim().length > 0,
      label: "Empty home has a way in",
    },
    {
      id: "price",
      ok: config.paywall.price.trim().length > 0,
      label: "Plus shows a price",
    },
    {
      id: "offline",
      ok: config.offline,
      label: "Offline queue is in the build",
    },
    {
      id: "crash",
      ok: config.crashHandler,
      label: "Crash boundary is on",
    },
    {
      id: "type",
      ok: config.largeType,
      label: "Large text is honored",
    },
  ];
}

function pick(bots: Bot[], styles: Style[]): Bot {
  for (const style of styles) {
    const hit = bots.find((bot) => bot.style === style);
    if (hit) return hit;
  }
  return bots[0]!;
}

type Draft = {
  id: string;
  styles: Style[];
  severity: Finding["severity"];
  area: string;
  title: string;
  body: string;
  repro: string[];
  merge?: ConfigMerge;
  newFile?: { path: string; content: string };
  when: (config: NorthlineConfig) => boolean;
};

function drafts(mission: string): Draft[] {
  const wantsOffline = /offline|network|slow|subway|field|airplane/i.test(mission);
  return [
    {
      id: "password",
      styles: ["adversarial", "scripted"],
      severity: "blocker",
      area: "Signup",
      title: "Password rules stay hidden until the form fails",
      body: "Testers burn attempts before they learn the policy. Play pre-launch will flag this as a broken credential form.",
      repro: [
        "Opt into the track and open signup.",
        "Submit a short password.",
        "Notice the rule only appears in the error.",
      ],
      merge: { signup: { showPasswordRules: true, minPassword: 10 } },
      when: (config) => !config.signup.showPasswordRules || config.signup.minPassword < 8,
    },
    {
      id: "name",
      styles: ["exploratory", "adversarial"],
      severity: "minor",
      area: "Signup",
      title: "Accounts are created with no name",
      body: "The form never asks who the tester is. Review replies and crash mail will look anonymous.",
      repro: ["Create an account.", "Open the profile row.", "Confirm there is no display name to edit."],
      merge: { signup: { collectDisplayName: true } },
      when: (config) => !config.signup.collectDisplayName,
    },
    {
      id: "empty",
      styles: ["exploratory", "accessibility"],
      severity: "major",
      area: "Home",
      title: "Empty home is a dead end",
      body: "A first session lands on a title and nothing else. One-handed testers stop here.",
      repro: ["Finish signup.", "Land on the empty home.", "Look for a control that starts a note."],
      merge: { empty: { cta: "Write a field note" } },
      when: (config) => config.empty.cta.trim().length === 0,
    },
    {
      id: "price",
      styles: ["scripted", "adversarial"],
      severity: "blocker",
      area: "Billing",
      title: "Plus asks for a purchase and never names the price",
      body: "A Buy button with a blank price will fail Play policy and any tester without a card already on file.",
      repro: ["Open Plus from the listing.", "Read the purchase row.", "Confirm there is no price before the button."],
      merge: { paywall: { price: "$4.99 / month", cta: "Start Plus" } },
      when: (config) => config.paywall.price.trim().length === 0,
    },
    {
      id: "offline",
      styles: ["exploratory", "scripted"],
      severity: "major",
      area: "Network",
      title: "Field notes die without a network",
      body: wantsOffline
        ? "The brief asks for a note without a network. This build has no queue."
        : "Install succeeds on a slow radio, then the first note has nowhere to wait.",
      repro: ["Turn the radio off.", "Try to keep a note.", "Confirm nothing is queued."],
      merge: { offline: true },
      newFile: { path: "src/features/OfflineQueue.ts", content: OFFLINE_FILE },
      when: (config) => !config.offline,
    },
    {
      id: "crash",
      styles: ["scripted", "adversarial"],
      severity: "major",
      area: "Stability",
      title: "No crash boundary on the beta",
      body: "Pre-launch report will show an unprotected startup. A throw takes the whole activity.",
      repro: ["Read the startup path.", "Confirm there is no boundary around the note screen."],
      merge: { crashHandler: true },
      when: (config) => !config.crashHandler,
    },
    {
      id: "type",
      styles: ["accessibility", "exploratory"],
      severity: "major",
      area: "Access",
      title: "Large text is ignored",
      body: "The access seat keeps the system text size up. This build stays at the default scale.",
      repro: ["Set large text on the device.", "Open signup and Plus.", "Confirm the scale did not follow."],
      merge: { largeType: true },
      when: (config) => !config.largeType,
    },
  ];
}

function closer(style: Style): string {
  if (style === "adversarial") return "I tried to break signup and the paywall.";
  if (style === "scripted") return "I ran the regression sheet.";
  if (style === "accessibility") return "I stayed on large text and a screen-reader path.";
  return "I wandered without a script.";
}

export function planRun(bots: Bot[], config: NorthlineConfig, mission: string, now: number) {
  const armed = bots.filter((bot) => bot.armed);
  const events: RunEvent[] = [];
  armed.forEach((bot, index) => {
    const start = index * 420;
    const step = 680;
    const lines: { screen: Screen; text: string }[] = [
      {
        screen: "listing",
        text: `Opted into ${config.track} testing as ${bot.gmail}.`,
      },
      {
        screen: "listing",
        text: `Installed ${config.name} ${config.version} (${config.versionCode}) on ${bot.device}, API ${bot.api}.`,
      },
      {
        screen: "signup",
        text: config.signup.showPasswordRules
          ? `Signup in ${bot.locale} showed the password policy.`
          : `Signup in ${bot.locale} hid the password policy until it failed.`,
      },
      {
        screen: "signup",
        text: config.signup.collectDisplayName
          ? `Signed up an account named ${bot.callsign}.`
          : `Signed up ${bot.gmail}. The form never asked for a name.`,
      },
      {
        screen: "home",
        text: config.empty.cta.trim()
          ? `Empty home offered “${config.empty.cta.trim()}”.`
          : "Empty home had no action. Stopped, then backed out.",
      },
      {
        screen: "paywall",
        text: config.paywall.price.trim()
          ? `Plus listed ${config.paywall.price.trim()}.`
          : `Plus said “${config.paywall.cta || "Buy"}” and never named a price.`,
      },
      {
        screen: "report",
        text: config.offline
          ? `Offline queue was present. Filed the ${bot.style} note.`
          : `No offline path. Filed the ${bot.style} note.`,
      },
    ];
    lines.forEach((line, i) => {
      events.push({
        id: `${bot.id}-${i}`,
        botId: bot.id,
        at: start + i * step,
        screen: line.screen,
        text: line.text,
      });
    });
  });

  const findings: Finding[] = [];
  const patches: Patch[] = [];

  if (armed.length === 0) {
    return { events, findings, patches, reviews: [] as Review[], accounts: [] as Account[], duration: 0 };
  }

  for (const draft of drafts(mission)) {
    if (!draft.when(config)) continue;
    const bot = pick(armed, draft.styles);
    const patchId = draft.merge || draft.newFile ? `p-${draft.id}` : undefined;
    findings.push({
      id: `f-${draft.id}`,
      botId: bot.id,
      severity: draft.severity,
      area: draft.area,
      title: draft.title,
      body: draft.body,
      repro: draft.repro,
      origin: "protocol",
      patchId,
      resolved: false,
    });
    if (patchId && (draft.merge || draft.newFile)) {
      patches.push({
        id: patchId,
        botId: bot.id,
        title: draft.title,
        rationale: draft.body,
        merge: draft.merge ?? {},
        newFile: draft.newFile,
        origin: "protocol",
      });
    }
  }

  if (findings.length === 0) {
    const bot = armed[0]!;
    findings.push({
      id: "f-pass",
      botId: bot.id,
      severity: "note",
      area: "Release",
      title: "Protocol pass on this build",
      body: "No open defects in the signup, home, billing, network, stability, or access checks.",
      repro: ["Re-run after the next flag change."],
      origin: "protocol",
      resolved: false,
    });
  }

  const reviews = armed.map((bot) => reviewFor(bot, findings));
  const accounts: Account[] = armed.map((bot) => ({
    email: bot.gmail.trim().toLowerCase(),
    botId: bot.id,
    displayName: config.signup.collectDisplayName ? bot.callsign : "",
    named: config.signup.collectDisplayName,
    createdAt: now,
  }));

  const last = events.reduce((max, event) => Math.max(max, event.at), 0);
  return { events, findings, patches, reviews, accounts, duration: last + 900 };
}

function reviewFor(bot: Bot, findings: Finding[]): Review {
  const mine = findings.filter((finding) => finding.botId === bot.id && finding.severity !== "note");
  const top = mine[0] ?? findings.find((finding) => finding.severity !== "note");
  let stars = 5;
  if (findings.some((finding) => finding.severity === "blocker")) stars -= 2;
  if (findings.some((finding) => finding.severity === "major")) stars -= 1;
  if (bot.style === "accessibility" && findings.some((finding) => finding.id === "f-type")) stars = Math.min(stars, 2);
  stars = Math.max(1, Math.min(5, stars));
  const bite = top ? top.title : "The closed-track build held under this pass";
  const keep = stars >= 4 ? "I would keep the opt-in" : "I would not widen this track yet";
  return {
    botId: bot.id,
    stars,
    text: `${bot.persona} ${closer(bot.style)} On ${bot.device} (${bot.locale}) ${keep}. ${bite}.`,
  };
}

export function patchPreview(config: NorthlineConfig, merge: ConfigMerge): { before: string; after: string } {
  return {
    before: serializeConfig(config),
    after: serializeConfig(applyMerge(config, merge)),
  };
}

export function vitals(config: NorthlineConfig) {
  const passwordOk = config.signup.showPasswordRules && config.signup.minPassword >= 8;
  return {
    crashFree: config.crashHandler ? 99.4 : 96.1,
    anr: config.offline ? 0.11 : 0.46,
    signup: passwordOk ? 94 : 71,
  };
}

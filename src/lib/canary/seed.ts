import type { Bot, Style, Track } from "@/lib/canary/types";

export const DEVICES = [
  "Pixel 9",
  "Pixel 8",
  "Pixel 7a",
  "Pixel Tablet",
  "Pixel Fold",
  "Galaxy S24",
  "Galaxy A15",
  "Moto G54",
  "Nothing Phone 2",
];

export const LOCALES = ["en-US", "en-CA", "en-GB", "es-MX", "fr-CA", "pt-BR", "de-DE", "ja-JP"];

export const APIS = ["14", "15", "16"];

export const STYLES: { id: Style; label: string; hint: string }[] = [
  { id: "exploratory", label: "Exploratory", hint: "Wanders. Files what a new person would hit." },
  { id: "scripted", label: "Scripted", hint: "Runs the regression sheet and failed assertions." },
  { id: "adversarial", label: "Adversarial", hint: "Tries to break signup, paywall, and policy." },
  { id: "accessibility", label: "Access", hint: "Large text and a screen-reader path." },
];

export const TRACKS: Track[] = ["internal", "closed", "open", "production"];

export const CALLSIGNS = [
  "MOTH",
  "JUNO",
  "IRIS",
  "KESTREL",
  "SABLE",
  "RIO",
  "QUILL",
  "NEST",
  "PIPIT",
  "HARRIER",
  "LOOM",
  "BRAMBLE",
  "VESPER",
  "CEDAR",
  "WREN",
  "TALON",
  "BIRCH",
  "MARLOW",
  "FEN",
  "ORIOLE",
  "NIMBUS",
  "PETREL",
  "ALDER",
  "COVE",
  "LINNET",
];

const SEED_BOTS: Omit<Bot, "id">[] = [
  {
    callsign: "MOTH",
    gmail: "canary.moth.beta@gmail.com",
    persona: "Impatient returning tester. Quits a form that hides its rules.",
    device: "Pixel 9",
    api: "16",
    locale: "en-US",
    style: "adversarial",
    track: "closed",
    armed: true,
  },
  {
    callsign: "JUNO",
    gmail: "canary.juno.beta@gmail.com",
    persona: "First week with a newborn. One hand, short sessions, no patience for a dead end.",
    device: "Galaxy A15",
    api: "14",
    locale: "en-CA",
    style: "exploratory",
    track: "closed",
    armed: true,
  },
  {
    callsign: "IRIS",
    gmail: "canary.iris.beta@gmail.com",
    persona: "Screen reader first. Large text always on. Will not guess at unlabeled controls.",
    device: "Pixel 7a",
    api: "15",
    locale: "en-US",
    style: "accessibility",
    track: "closed",
    armed: true,
  },
  {
    callsign: "KESTREL",
    gmail: "canary.kestrel.beta@gmail.com",
    persona: "Release regression. Same sheet every build. Failed assertions only.",
    device: "Pixel Tablet",
    api: "15",
    locale: "en-GB",
    style: "scripted",
    track: "closed",
    armed: true,
  },
  {
    callsign: "SABLE",
    gmail: "canary.sable.beta@gmail.com",
    persona: "Night-shift field notes. Often underground, often offline.",
    device: "Nothing Phone 2",
    api: "15",
    locale: "en-US",
    style: "exploratory",
    track: "closed",
    armed: true,
  },
  {
    callsign: "RIO",
    gmail: "canary.rio.beta@gmail.com",
    persona: "Spanish UI on a slow radio. Judges the build by the first stalled screen.",
    device: "Moto G54",
    api: "14",
    locale: "es-MX",
    style: "exploratory",
    track: "closed",
    armed: true,
  },
  {
    callsign: "QUILL",
    gmail: "canary.quill.beta@gmail.com",
    persona: "Power user. Wants a name on the account and a keyboard path into a note.",
    device: "Galaxy S24",
    api: "16",
    locale: "en-US",
    style: "adversarial",
    track: "internal",
    armed: true,
  },
  {
    callsign: "NEST",
    gmail: "canary.nest.beta@gmail.com",
    persona: "Brand new Google account. No card on file. Will not tap a priceless Buy.",
    device: "Pixel 8",
    api: "15",
    locale: "fr-CA",
    style: "scripted",
    track: "closed",
    armed: true,
  },
];

export function seedBots(): Bot[] {
  return SEED_BOTS.map((bot) => ({ ...bot, id: `bot_${bot.callsign.toLowerCase()}` }));
}

export function freshBot(used: string[]): Bot {
  const callsign = CALLSIGNS.find((name) => !used.includes(name)) ?? `BOT${used.length + 1}`;
  const slug = callsign.toLowerCase().replace(/[^a-z0-9]/g, "");
  return {
    id: `bot_${crypto.randomUUID().slice(0, 8)}`,
    callsign,
    gmail: `canary.${slug}.beta@gmail.com`,
    persona: "New seat. Describe who this bot is when they open the build.",
    device: "Pixel 8",
    api: "15",
    locale: "en-US",
    style: "exploratory",
    track: "closed",
    armed: true,
  };
}

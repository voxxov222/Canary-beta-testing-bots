import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Severity } from "@/lib/canary/types";

export function Button({
  children,
  variant = "solid",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "quiet" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
        variant === "solid" && "bg-canary text-canary-ink hover:opacity-90",
        variant === "ghost" && "border border-line bg-ink text-paper hover:border-dim",
        variant === "quiet" && "text-dim hover:text-paper",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl border border-line bg-panel p-4 md:p-5", className)}>{children}</section>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-dim">{label}</span>
      {children}
      {hint ? <span className="text-sm text-mute">{hint}</span> : null}
    </label>
  );
}

const SEVERITY_TONE: Record<Severity, string> = {
  blocker: "text-canary",
  major: "text-paper",
  minor: "text-dim",
  note: "text-mute",
};

export function SeverityLabel({ severity }: { severity: Severity }) {
  return (
    <span className={cn("font-mono text-xs uppercase tracking-widest", SEVERITY_TONE[severity])}>{severity}</span>
  );
}

export function Pips({ value, of = 5 }: { value: number; of?: number }) {
  return (
    <span className="inline-flex gap-1" aria-label={`${value} of ${of}`}>
      {Array.from({ length: of }, (_, index) => (
        <span key={index} className={cn("size-2.5 rounded-sm", index < value ? "bg-canary" : "bg-line")} />
      ))}
    </span>
  );
}

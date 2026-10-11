import { Link } from "react-router-dom";
import { Hash, Info, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react";
import { cn } from "@/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  title,
  panel,
  children,
}: {
  id: string;
  title: string;
  panel?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="grid scroll-mt-28 grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-x-10 gap-y-6 border-line pt-12 first:pt-0 max-xl:grid-cols-1"
    >
      <div className="min-w-0 space-y-5">
        <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
          <a href={`#${id}`} className="group flex items-center gap-2">
            {title}
            <Hash className="h-4 w-4 text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </h2>
        {children}
      </div>

      {panel ? (
        <div className="min-w-0 self-start xl:sticky xl:top-[5.5rem]">
          {panel}
        </div>
      ) : null}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.9375rem] leading-[1.75] text-subtle">{children}</p>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-[1.0625rem] leading-[1.7] text-subtle">{children}</p>
  );
}

export function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-2 text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink">
      {children}
    </h3>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-line bg-elevated px-1.5 py-0.5 font-mono text-[0.8125rem] text-ink">
      {children}
    </code>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 text-[0.9375rem] leading-[1.7] text-subtle"
        >
          <span className="mt-[0.6875rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

const CALLOUT_STYLES = {
  info: {
    icon: Info,
    wrapper: "border-accent/25 bg-accent/[0.07]",
    icon_class: "text-accent",
  },
  warning: {
    icon: TriangleAlert,
    wrapper: "border-patch/30 bg-patch/[0.08]",
    icon_class: "text-patch",
  },
  danger: {
    icon: ShieldAlert,
    wrapper: "border-del/30 bg-del/[0.08]",
    icon_class: "text-del",
  },
  tip: {
    icon: Sparkles,
    wrapper: "border-get/30 bg-get/[0.07]",
    icon_class: "text-get",
  },
} as const;

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: keyof typeof CALLOUT_STYLES;
  title: string;
  children: ReactNode;
}) {
  const style = CALLOUT_STYLES[variant];
  const Icon = style.icon;

  return (
    <div className={cn("flex gap-3 rounded-2xl border p-4", style.wrapper)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", style.icon_class)} />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <div className="text-[0.875rem] leading-[1.7] text-subtle">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DocLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
    >
      {children}
    </Link>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy, Lock } from "lucide-react";
import { API_BASE_URL } from "@/constants/navigation";
import { cn } from "@/utils";

const COPIED_RESET_MS = 1800;

export type TMethod = "GET" | "POST" | "PATCH" | "DELETE";

const METHOD_STYLES: Record<TMethod, string> = {
  GET: "bg-get/[0.12] text-get border-get/30",
  POST: "bg-post/[0.12] text-post border-post/30",
  PATCH: "bg-patch/[0.12] text-patch border-patch/30",
  DELETE: "bg-del/[0.12] text-del border-del/30",
};

export function MethodPill({
  method,
  className,
}: {
  method: TMethod;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-[0.625rem] font-semibold tracking-wide",
        METHOD_STYLES[method],
        className
      )}
    >
      {method}
    </span>
  );
}

export function Endpoint({
  method,
  path,
  scope,
}: {
  method: TMethod;
  path: string;
  scope: string;
}) {
  const [copied, setCopied] = useState(false);
  const full = `${API_BASE_URL}${path}`;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const CopyIcon = copied ? Check : Copy;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 max-md:flex-wrap">
      <MethodPill method={method} />
      <code className="min-w-0 flex-1 truncate font-mono text-[0.8125rem] text-ink">
        <span className="text-subtle">{API_BASE_URL}</span>
        {path}
      </code>
      <span className="flex items-center gap-1.5 rounded-md border border-line bg-elevated px-1.5 py-0.5 font-mono text-[0.6875rem] text-subtle">
        <Lock className="h-3 w-3" />
        {scope}
      </span>
      <button
        type="button"
        aria-label="Copy endpoint"
        onClick={() => {
          navigator.clipboard?.writeText(full);
          setCopied(true);
        }}
        className={cn(
          "shrink-0 rounded-lg border border-line p-1.5 text-subtle transition-colors hover:border-accent/50 hover:text-accent",
          copied && "border-accent/50 text-accent"
        )}
      >
        <CopyIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export type TParam = {
  name: string;
  type: string;
  required?: boolean;
  description: ReactNode;
};

export function ParamsTable({
  title,
  params,
}: {
  title: string;
  params: TParam[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="border-b border-line bg-elevated px-4 py-2.5">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-subtle">
          {title}
        </span>
      </div>
      <div className="divide-y divide-line">
        {params.map((param) => (
          <div
            key={param.name}
            className="grid grid-cols-[14rem_minmax(0,1fr)] gap-4 bg-surface px-4 py-3.5 max-md:grid-cols-1 max-md:gap-1.5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-mono text-[0.8125rem] font-medium text-ink">
                {param.name}
              </code>
              <span className="font-mono text-[0.6875rem] text-subtle">
                {param.type}
              </span>
              {param.required ? (
                <span className="rounded border border-del/30 bg-del/10 px-1 py-px text-[0.625rem] font-medium uppercase tracking-wide text-del">
                  required
                </span>
              ) : null}
            </div>
            <p className="text-[0.875rem] leading-[1.65] text-subtle">
              {param.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusRow({
  code,
  label,
  description,
}: {
  code: string;
  label: string;
  description: string;
}) {
  const isSuccess = code.startsWith("2");
  const isServer = code.startsWith("5");

  return (
    <div className="grid grid-cols-[5rem_9rem_minmax(0,1fr)] items-baseline gap-4 bg-surface px-4 py-3 max-md:grid-cols-1 max-md:gap-1">
      <code
        className={cn(
          "font-mono text-[0.8125rem] font-semibold",
          isSuccess ? "text-get" : isServer ? "text-del" : "text-patch"
        )}
      >
        {code}
      </code>
      <span className="font-mono text-[0.75rem] text-ink">{label}</span>
      <p className="text-[0.875rem] leading-[1.65] text-subtle">
        {description}
      </p>
    </div>
  );
}

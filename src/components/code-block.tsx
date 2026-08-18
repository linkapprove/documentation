import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/utils";

const COPIED_RESET_MS = 1800;

export type TCodeSample = {
  language: string;
  label: string;
  code: string;
};

type TRule = {
  pattern: RegExp;
  className: string;
};

const SHELL_RULES: TRule[] = [
  { pattern: /#[^\n]*/, className: "token-comment" },
  { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, className: "token-string" },
  { pattern: /\$\{?[A-Z_][A-Z0-9_]*\}?/, className: "token-var" },
  { pattern: /\s-{1,2}[a-zA-Z][\w-]*/, className: "token-flag" },
  { pattern: /\b(curl|export|echo|jq|http)\b/, className: "token-keyword" },
];

const JSON_RULES: TRule[] = [
  { pattern: /"(?:[^"\\]|\\.)*"(?=\s*:)/, className: "token-key" },
  { pattern: /"(?:[^"\\]|\\.)*"/, className: "token-string" },
  { pattern: /\b(true|false|null)\b/, className: "token-keyword" },
  { pattern: /-?\b\d+(?:\.\d+)?\b/, className: "token-number" },
];

const JS_RULES: TRule[] = [
  { pattern: /\/\/[^\n]*/, className: "token-comment" },
  {
    pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/,
    className: "token-string",
  },
  {
    pattern:
      /\b(const|let|var|await|async|function|return|import|from|export|new|if|else|for|of|try|catch)\b/,
    className: "token-keyword",
  },
  { pattern: /\b(true|false|null|undefined)\b/, className: "token-keyword" },
  { pattern: /-?\b\d+(?:\.\d+)?\b/, className: "token-number" },
];

const PYTHON_RULES: TRule[] = [
  { pattern: /#[^\n]*/, className: "token-comment" },
  {
    pattern: /"""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
    className: "token-string",
  },
  {
    pattern: /\b(import|from|def|return|if|else|for|in|with|as|print|raise)\b/,
    className: "token-keyword",
  },
  { pattern: /\b(True|False|None)\b/, className: "token-keyword" },
  { pattern: /-?\b\d+(?:\.\d+)?\b/, className: "token-number" },
];

const HTTP_RULES: TRule[] = [
  {
    pattern: /^(GET|POST|PATCH|PUT|DELETE)\b/m,
    className: "token-keyword",
  },
  { pattern: /^[A-Za-z-]+(?=:)/m, className: "token-key" },
  { pattern: /-?\b\d+(?:\.\d+)?\b/, className: "token-number" },
];

const PHP_RULES: TRule[] = [
  { pattern: /\/\/[^\n]*|#[^\n]*/, className: "token-comment" },
  { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, className: "token-string" },
  { pattern: /\$[A-Za-z_][A-Za-z0-9_]*/, className: "token-var" },
  {
    pattern:
      /\b(function|return|if|else|foreach|as|new|echo|print_r|json_encode|json_decode|curl_init|curl_setopt_array|curl_exec|curl_close)\b/,
    className: "token-keyword",
  },
  { pattern: /\bCURLOPT_[A-Z_]+\b/, className: "token-key" },
  { pattern: /\b(true|false|null)\b/, className: "token-keyword" },
  { pattern: /-?\b\d+(?:\.\d+)?\b/, className: "token-number" },
];

const GO_RULES: TRule[] = [
  { pattern: /\/\/[^\n]*/, className: "token-comment" },
  { pattern: /"(?:[^"\\]|\\.)*"|`[^`]*`/, className: "token-string" },
  {
    pattern:
      /\b(package|import|func|var|if|err|nil|defer|return|panic|map|range|for)\b/,
    className: "token-keyword",
  },
  { pattern: /\b(string|any|int|bool|error)\b/, className: "token-key" },
  { pattern: /-?\b\d+(?:\.\d+)?\b/, className: "token-number" },
];

const RUBY_RULES: TRule[] = [
  { pattern: /#[^\n]*/, className: "token-comment" },
  { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, className: "token-string" },
  {
    pattern: /\b(require|def|end|do|if|else|puts|module|class|return)\b/,
    className: "token-keyword",
  },
  { pattern: /\b(true|false|nil)\b/, className: "token-keyword" },
  { pattern: /\b[A-Z][A-Za-z0-9_]*(?=::|\.)/, className: "token-key" },
  { pattern: /-?\b\d+(?:\.\d+)?\b/, className: "token-number" },
];

const RULES_BY_LANGUAGE: Record<string, TRule[]> = {
  bash: SHELL_RULES,
  shell: SHELL_RULES,
  json: JSON_RULES,
  js: JS_RULES,
  node: JS_RULES,
  ts: JS_RULES,
  python: PYTHON_RULES,
  php: PHP_RULES,
  go: GO_RULES,
  ruby: RUBY_RULES,
  http: HTTP_RULES,
};

export function highlight(code: string, language: string): ReactNode {
  const rules = RULES_BY_LANGUAGE[language];
  if (!rules) return code;

  const nodes: ReactNode[] = [];
  let rest = code;
  let cursor = 0;

  while (rest.length) {
    let bestIndex = -1;
    let bestMatch: RegExpExecArray | null = null;
    let bestRule: TRule | null = null;

    for (const rule of rules) {
      const matcher = new RegExp(rule.pattern.source, rule.pattern.flags.replace("g", ""));
      const match = matcher.exec(rest);
      if (!match) continue;
      if (bestIndex === -1 || match.index < bestIndex) {
        bestIndex = match.index;
        bestMatch = match;
        bestRule = rule;
      }
    }

    if (!bestMatch || !bestRule || bestIndex === -1) {
      nodes.push(<Fragment key={cursor}>{rest}</Fragment>);
      break;
    }

    if (bestIndex > 0) {
      nodes.push(
        <Fragment key={`plain-${cursor}`}>{rest.slice(0, bestIndex)}</Fragment>
      );
    }

    nodes.push(
      <span key={`token-${cursor}`} className={bestRule.className}>
        {bestMatch[0]}
      </span>
    );

    const consumed = bestIndex + bestMatch[0].length;
    rest = rest.slice(consumed);
    cursor += consumed;
  }

  return nodes;
}

export function CodeBlock({
  samples,
  title,
  className,
}: {
  samples: TCodeSample[];
  title?: string;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = samples[activeIndex] ?? samples[0];

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!active) return null;

  const copy = () => {
    navigator.clipboard?.writeText(active.code);
    setCopied(true);
  };

  const CopyIcon = copied ? Check : Copy;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-code",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line bg-elevated px-3 py-2">
        <div className="scrollbar-slim flex min-w-0 items-center gap-1 overflow-x-auto">
          {samples.length > 1 ? (
            samples.map((sample, index) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  index === activeIndex
                    ? "bg-accent/[0.15] text-accent"
                    : "text-subtle hover:text-ink"
                )}
              >
                {sample.label}
              </button>
            ))
          ) : (
            <span className="flex items-center gap-2 px-1.5 text-xs font-medium text-subtle">
              <Terminal className="h-3.5 w-3.5" />
              {title ?? active.label}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[0.6875rem] font-medium text-subtle transition-colors hover:border-accent/50 hover:text-accent",
            copied && "border-accent/50 text-accent"
          )}
        >
          <CopyIcon className="h-3 w-3" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="scrollbar-slim max-h-[28rem] overflow-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-ink/90">
        <code>{highlight(active.code, active.language)}</code>
      </pre>
    </div>
  );
}

export function JsonView({
  code,
  language = "json",
}: {
  code: string;
  language?: string;
}) {
  return (
    <pre className="scrollbar-slim max-h-[24rem] overflow-auto bg-code p-3.5 font-mono text-[0.75rem] leading-relaxed text-ink/90">
      <code>{highlight(code, language)}</code>
    </pre>
  );
}

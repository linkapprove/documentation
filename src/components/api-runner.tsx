import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { CodeBlock, JsonView } from "@/components/code-block";
import { MethodPill } from "@/components/endpoint";
import { useApiToken } from "@/contexts/api-token-context";
import {
  buildUrl,
  generateSamples,
  type TParamValues,
} from "@/constants/code-generators";
import {
  API_KEYS_URL,
  MONTHLY_QUOTA,
  RATE_LIMIT_PER_MINUTE,
} from "@/constants/navigation";
import type { TEndpointSpec } from "@/constants/endpoints";
import { cn } from "@/utils";

const SIMULATED_LATENCY_MS = 620;
const RESPONSE_HEADERS = `content-type: application/json; charset=utf-8
x-ratelimit-limit: ${RATE_LIMIT_PER_MINUTE}
x-ratelimit-remaining: 103
x-ratelimit-reset: 1755511260
x-quota-used: 128402
x-quota-limit: ${MONTHLY_QUOTA}`;

type TRunState = "idle" | "running" | "done";

export function ApiRunner({ endpoint }: { endpoint: TEndpointSpec }) {
  const { token, setToken, clearToken } = useApiToken();

  const [values, setValues] = useState<TParamValues>(() =>
    endpoint.params.reduce<TParamValues>((seed, param) => {
      seed[param.name] = param.value;
      return seed;
    }, {})
  );
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [isParamsOpen, setIsParamsOpen] = useState(true);
  const [runState, setRunState] = useState<TRunState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [responseTab, setResponseTab] = useState<"body" | "headers">("body");

  const samples = useMemo(
    () => generateSamples(endpoint, values, token),
    [endpoint, values, token]
  );

  const url = buildUrl(endpoint, values);
  const result = token ? endpoint.response : endpoint.unauthorized;
  const isError = result.status >= 400;

  const send = () => {
    setRunState("running");
    setResponseTab("body");
    const started = performance.now();
    setTimeout(() => {
      setElapsed(Math.round(performance.now() - started));
      setRunState("done");
    }, SIMULATED_LATENCY_MS);
  };

  const reset = () => {
    setValues(
      endpoint.params.reduce<TParamValues>((seed, param) => {
        seed[param.name] = param.value;
        return seed;
      }, {})
    );
    setRunState("idle");
  };

  return (
    <div className="space-y-3">
      <CodeBlock samples={samples} />

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-2 border-b border-line bg-elevated px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-subtle">
            <Play className="h-3 w-3" />
            Try it
          </span>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-subtle transition-colors hover:text-accent"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="space-y-3 p-3.5">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-code px-2.5 py-2">
            <MethodPill method={endpoint.method} />
            <code className="min-w-0 flex-1 truncate font-mono text-[0.75rem] text-ink">
              {url}
            </code>
          </div>

          <div>
            <label className="flex items-center justify-between gap-2 pb-1.5">
              <span className="flex items-center gap-1.5 text-[0.75rem] font-medium text-ink">
                <KeyRound className="h-3.5 w-3.5 text-subtle" />
                API key
              </span>
              <span
                className={cn(
                  "flex items-center gap-1.5 text-[0.6875rem] font-medium",
                  token ? "text-get" : "text-subtle"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    token ? "bg-get" : "bg-subtle"
                  )}
                />
                {token ? "Set for this session" : "Not set"}
              </span>
            </label>

            <div className="flex items-center gap-1.5 rounded-xl border border-line bg-canvas px-2.5 py-1.5 focus-within:border-accent/50">
              <input
                type={isTokenVisible ? "text" : "password"}
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="la_…"
                spellCheck={false}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent font-mono text-[0.75rem] text-ink outline-none"
              />
              {token ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsTokenVisible((visible) => !visible)}
                    aria-label={isTokenVisible ? "Hide key" : "Show key"}
                    className="shrink-0 text-subtle transition-colors hover:text-ink"
                  >
                    {isTokenVisible ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearToken}
                    aria-label="Clear key"
                    className="shrink-0 text-subtle transition-colors hover:text-del"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <a
                  href={API_KEYS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[0.6875rem] font-medium text-accent"
                >
                  Get one
                </a>
              )}
            </div>
            <p className="mt-1.5 text-[0.6875rem] leading-snug text-subtle">
              Held in this tab's session storage only, and reused by every
              runner on the site.
            </p>
          </div>

          {endpoint.params.length ? (
            <div className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setIsParamsOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2"
              >
                <span className="text-[0.75rem] font-medium text-ink">
                  Parameters
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-subtle transition-transform",
                    isParamsOpen && "rotate-180"
                  )}
                />
              </button>

              {isParamsOpen ? (
                <div className="space-y-2 border-t border-line p-3">
                  {endpoint.params.map((param) => (
                    <div
                      key={param.name}
                      className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-2"
                    >
                      <label
                        htmlFor={`${endpoint.id}-${param.name}`}
                        className="flex min-w-0 items-center gap-1.5"
                        title={param.description}
                      >
                        <code className="truncate font-mono text-[0.75rem] text-ink">
                          {param.name}
                        </code>
                        {param.required ? (
                          <span className="text-[0.625rem] text-del">*</span>
                        ) : null}
                      </label>
                      <input
                        id={`${endpoint.id}-${param.name}`}
                        value={values[param.name] ?? ""}
                        placeholder={param.placeholder ?? param.type}
                        spellCheck={false}
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [param.name]: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-line bg-canvas px-2 py-1.5 font-mono text-[0.75rem] text-ink outline-none transition-colors focus:border-accent/50"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={send}
            disabled={runState === "running"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-[0.8125rem] font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {runState === "running" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Send request
              </>
            )}
          </button>
        </div>

        {runState === "done" ? (
          <div className="border-t border-line">
            <div className="flex flex-wrap items-center gap-2 bg-elevated px-3.5 py-2.5">
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 font-mono text-[0.6875rem] font-semibold",
                  isError
                    ? "border-del/30 bg-del/[0.12] text-del"
                    : "border-get/30 bg-get/[0.12] text-get"
                )}
              >
                {isError ? (
                  <X className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                {result.status} {result.statusText}
              </span>
              <span className="font-mono text-[0.6875rem] text-subtle">
                {elapsed} ms
              </span>
              <span className="font-mono text-[0.6875rem] text-subtle">
                {new Blob([result.body]).size} B
              </span>

              <div className="ml-auto flex items-center gap-1">
                {(["body", "headers"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setResponseTab(tab)}
                    className={cn(
                      "rounded-lg px-2 py-1 text-[0.6875rem] font-medium capitalize transition-colors",
                      responseTab === tab
                        ? "bg-accent/[0.12] text-accent"
                        : "text-subtle hover:text-ink"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <JsonView
              code={responseTab === "body" ? result.body : RESPONSE_HEADERS}
              language={responseTab === "body" ? "json" : "http"}
            />

            {isError ? (
              <p className="border-t border-line px-3.5 py-2.5 text-[0.6875rem] leading-snug text-subtle">
                No key was set, so the request came back unauthenticated. Paste
                one above and send again.
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="border-t border-line bg-elevated px-3.5 py-2 text-[0.625rem] leading-snug text-subtle">
          This panel replays the documented sample response and does not call
          the API. Copy a code sample to send a real request with your key.
        </p>
      </div>
    </div>
  );
}

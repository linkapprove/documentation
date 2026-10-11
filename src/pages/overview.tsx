import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Link2,
  Package,
  Wallet,
  Webhook,
  Zap,
} from "lucide-react";
import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { MethodPill } from "@/components/endpoint";
import { generateSamples } from "@/constants/code-generators";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  API_BASE_URL,
  API_KEYS_URL,
  API_VERSION,
  pageByPath,
} from "@/constants/navigation";

const PAGE = pageByPath("/overview");

const HELLO_WORLD = generateSamples(
  ENDPOINTS.listPrograms,
  {
    search: "",
    category: "",
    payoutType: "",
    approvalType: "",
    channelId: "",
    page: "1",
    size: "1",
  },
  ""
);

const CAPABILITIES = [
  {
    icon: Package,
    title: "Programs",
    body: "Search 12,000+ merchant campaigns, filter by category or payout model, and apply on behalf of a verified channel.",
  },
  {
    icon: Link2,
    title: "Tracking links",
    body: "Mint a go.linkapprove.com redirect for any approved program, with sub IDs for your own attribution and deep links to a product page.",
  },
  {
    icon: BarChart3,
    title: "Reporting",
    body: "Clicks, conversions and commission. The same numbers your dashboard renders, grouped by program, channel, day or sub ID.",
  },
  {
    icon: Wallet,
    title: "Payments",
    body: "Your balance by state, every credited commission, and each withdrawal with its status history and invoice.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    body: "Get a signed POST when a conversion arrives or changes status, instead of polling on a schedule you had to guess at.",
  },
  {
    icon: Zap,
    title: "Built for scripts",
    body: "Predictable envelopes, page/size pagination and stable IDs, so automation holds up.",
  },
];

const FLOW = [
  {
    step: "01",
    label: "Apply",
    detail: "POST a program application for one of your channels.",
  },
  {
    step: "02",
    label: "Get approved",
    detail:
      "Auto programs clear instantly; manual ones are reviewed by the LinkApprove team.",
  },
  {
    step: "03",
    label: "Mint a link",
    detail:
      "Issue a go.linkapprove.com tracking link against the approved program.",
  },
  {
    step: "04",
    label: "Place it",
    detail: "Your site, newsletter or social post, wherever the traffic is.",
  },
  {
    step: "05",
    label: "Get paid",
    detail:
      "Conversions credit your balance, then you withdraw from the dashboard.",
  },
];

const START_LINKS = [
  {
    to: "/quickstart",
    title: "Quickstart",
    body: "Key to first tracking link, start to finish.",
  },
  {
    to: "/authentication",
    title: "Authentication",
    body: "Bearer keys, scopes and rotation.",
  },
  {
    to: "/programs",
    title: "Programs",
    body: "The catalogue and how to apply.",
  },
  {
    to: "/errors",
    title: "Errors & Limits",
    body: "What a failure looks like and when to back off.",
  },
];

const ENVELOPE = [
  {
    language: "json",
    label: "List envelope",
    code: `{
  "success": true,
  "message": "Programs fetched",
  "data": {
    "data": [ ... ],
    "count": 137,
    "pages": 14
  }
}`,
  },
  {
    language: "json",
    label: "Single object",
    code: `{
  "success": true,
  "message": "Program fetched",
  "data": {
    "id": 4821,
    "merchantName": "Northpeak Outdoors"
  }
}`,
  },
  {
    language: "json",
    label: "Failure",
    code: `{
  "success": false,
  "message": "Program not found",
  "error": { "code": "program_not_found" }
}`,
  },
];

export default function Overview() {
  return (
    <DocLayout page={PAGE}>
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 max-md:p-6">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-halo/25 blur-3xl"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-elevated px-3 py-1 text-[0.6875rem] font-medium text-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-get" />
            Version {API_VERSION} · stable
          </span>
          <h2 className="mt-4 max-w-xl text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-ink max-md:text-[1.375rem]">
            Everything your affiliate business does, available over HTTP.
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-code px-3 py-2">
              <MethodPill method="GET" />
              <code className="font-mono text-[0.8125rem] text-ink">
                {API_BASE_URL}
              </code>
            </div>
            <Link
              to="/quickstart"
              className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
            >
              Start building
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <Section
        id="what-you-can-build"
        title="What you can build"
        panel={<CodeBlock samples={HELLO_WORLD} />}
      >
        <Lead>
          The LinkApprove API is the machine-readable version of the publisher
          dashboard. Anything you can click, a script can do: apply to a
          program, mint a tracking link, pull yesterday's numbers, request a
          payout.
        </Lead>

        <div className="grid grid-cols-2 gap-3 pt-1 max-md:grid-cols-1">
          {CAPABILITIES.map((capability) => (
            <div
              key={capability.title}
              className="rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <capability.icon className="h-4 w-4" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">
                {capability.title}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-subtle">
                {capability.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="how-it-fits-together"
        title="How it fits together"
        panel={
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-subtle">
              The publisher loop
            </p>
            <div className="mt-3 space-y-0">
              {FLOW.map((item, index) => (
                <div key={item.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-[0.625rem] font-semibold text-accent">
                      {index + 1}
                    </span>
                    {index < FLOW.length - 1 ? (
                      <span className="w-px flex-1 bg-line" />
                    ) : null}
                  </div>
                  <div className="min-w-0 pb-4">
                    <p className="text-[0.8125rem] font-semibold text-ink">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] leading-snug text-subtle">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <P>
          LinkApprove brings merchant programs together under one roof. One
          dashboard, one payout, one API, whichever merchant you promote.
        </P>
        <P>
          The publisher lifecycle is five steps, and every one of them has an
          endpoint. Most integrations only need two of them: list programs, and
          mint links.
        </P>

        <Callout variant="info" title="Production only">
          There is no sandbox. Every key talks to live data, so scope keys
          tightly and give anything experimental a short expiry. Both are
          managed from{" "}
          <a
            href={API_KEYS_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-4"
          >
            Account → API Keys
          </a>
          .
        </Callout>
      </Section>

      <Section
        id="conventions"
        title="Conventions"
        panel={<CodeBlock samples={ENVELOPE} />}
      >
        <Sub>The response envelope</Sub>
        <P>
          Every response, success or failure, has the same three top-level
          fields. List endpoints nest a paginated payload inside{" "}
          <Code>data</Code>, so a list is always <Code>data.data</Code>.
        </P>

        <Sub>The rules that never change</Sub>
        <List
          items={[
            <>
              <strong className="font-medium text-ink">Pagination</strong> is{" "}
              <Code>page</Code> (1-based, default <Code>1</Code>) and{" "}
              <Code>size</Code> (default <Code>10</Code>, max <Code>100</Code>).
              Responses carry <Code>count</Code> and <Code>pages</Code>.
            </>,
            <>
              <strong className="font-medium text-ink">Timestamps</strong> are
              ISO 8601 in UTC, always suffixed <Code>Z</Code>.
            </>,
            <>
              <strong className="font-medium text-ink">Money</strong> is a
              two-decimal string (<Code>"128.40"</Code>), never a float, so
              nothing rounds on the way to you. Report earnings and conversion
              webhooks carry the <Code>currency</Code> the network reported, and
              amounts in different currencies are never summed. Balances,
              transactions and withdrawals are your LinkApprove balance and
              carry no currency field.
            </>,
            <>
              <strong className="font-medium text-ink">Versioning</strong>:
              every response carries{" "}
              <Code>LinkApprove-Version: {API_VERSION}</Code>. Log it alongside
              anything you report to support.
            </>,
            <>
              <strong className="font-medium text-ink">IDs</strong> are
              integers.
            </>,
            <>
              <strong className="font-medium text-ink">Removed programs</strong>
              : a program that is removed or deactivated stops appearing in
              lists, and retrieving it returns <Code>404</Code>.
            </>,
          ]}
        />
      </Section>

      <Section id="start-here" title="Start here">
        <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {START_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-ink group-hover:text-accent">
                {link.title}
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </span>
              <span className="text-[0.8125rem] leading-snug text-subtle">
                {link.body}
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </DocLayout>
  );
}

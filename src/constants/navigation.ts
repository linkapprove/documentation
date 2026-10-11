import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Globe,
  KeyRound,
  Link2,
  Package,
  Rocket,
  UserRound,
  Wallet,
  Webhook,
  type LucideIcon,
} from "lucide-react";

import { API_BASE_URL, DASHBOARD_URL, SITE_URL } from "@/config";

export { API_BASE_URL, DASHBOARD_URL, SITE_URL };
export const SITE_NAME = "LinkApprove API Docs";
export const API_KEYS_URL = `${DASHBOARD_URL}/publisher/account/api-keys`;
export const RATE_LIMIT_PER_MINUTE = 120;
export const MONTHLY_QUOTA = 250000;
export const API_VERSION = "2026-05-01";

export type TDocSection = {
  id: string;
  label: string;
};

export type TDocPage = {
  path: string;
  label: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  sections: TDocSection[];
};

export type TNavGroup = {
  title: string;
  pages: TDocPage[];
};

export const NAV_GROUPS: TNavGroup[] = [
  {
    title: "Getting started",
    pages: [
      {
        path: "/overview",
        label: "Overview",
        title: "Affiliate Marketing API Overview",
        eyebrow: "Introduction",
        summary:
          "One REST API for the programs you run, the links you place and the money you earn.",
        description:
          "The LinkApprove API lets publishers manage channels, programs, tracking links, reports, payments and webhooks from their own code. Start here.",
        icon: BookOpen,
        sections: [
          { id: "what-you-can-build", label: "What you can build" },
          { id: "how-it-fits-together", label: "How it fits together" },
          { id: "conventions", label: "Conventions" },
          { id: "start-here", label: "Start here" },
        ],
      },
      {
        path: "/quickstart",
        label: "Quickstart",
        title: "Affiliate API Quickstart",
        eyebrow: "Introduction",
        summary:
          "From a fresh API key to your first tracking link in about four minutes.",
        description:
          "Get started with the LinkApprove API: create a key, find a program, apply with your channel and mint your first tracking link in about four minutes.",
        icon: Rocket,
        sections: [
          { id: "create-a-key", label: "Create a key" },
          { id: "find-a-program", label: "Find a program" },
          { id: "mint-a-link", label: "Mint a tracking link" },
          { id: "read-the-numbers", label: "Read the numbers" },
          { id: "next-steps", label: "Next steps" },
        ],
      },
      {
        path: "/authentication",
        label: "Authentication",
        title: "API Key Authentication",
        eyebrow: "Introduction",
        summary:
          "Bearer keys, scopes, expiry and what to do the moment a secret leaks.",
        description:
          "How LinkApprove API keys work: bearer tokens, scopes, expiry, IP allowlists, rolling a secret and what to do if a key leaks.",
        icon: KeyRound,
        sections: [
          { id: "bearer-tokens", label: "Bearer tokens" },
          { id: "verify-a-key", label: "Verify a key" },
          { id: "scopes", label: "Scopes" },
          { id: "key-lifecycle", label: "Key lifecycle" },
          { id: "handling-a-leak", label: "Handling a leak" },
        ],
      },
    ],
  },
  {
    title: "Core resources",
    pages: [
      {
        path: "/channels",
        label: "Channels",
        title: "Publisher Channels API",
        eyebrow: "Core resources",
        summary:
          "The sites, newsletters and social accounts your traffic comes from, and how to verify them.",
        description:
          "List, create and verify your LinkApprove channels over the API. Websites, newsletters and social accounts, with meta tag verification for sites.",
        icon: Globe,
        sections: [
          { id: "the-channel-object", label: "The channel object" },
          { id: "list-channels", label: "List channels" },
          { id: "retrieve-a-channel", label: "Retrieve a channel" },
          { id: "create-a-channel", label: "Create a channel" },
          { id: "verify-a-channel", label: "Verify a channel" },
        ],
      },
      {
        path: "/programs",
        label: "Programs",
        title: "Affiliate Programs API",
        eyebrow: "Core resources",
        summary:
          "Browse the merchant catalogue, apply on behalf of a channel, track approval state.",
        description:
          "Search the LinkApprove program catalogue by category, payout type and status, see your approval state per channel, and apply from your own code.",
        icon: Package,
        sections: [
          { id: "the-program-object", label: "The program object" },
          { id: "list-programs", label: "List programs" },
          { id: "retrieve-a-program", label: "Retrieve a program" },
          { id: "apply-to-a-program", label: "Apply to a program" },
          { id: "list-applications", label: "List applications" },
        ],
      },
      {
        path: "/tracking-links",
        label: "Tracking Links",
        title: "Affiliate Tracking Links API",
        eyebrow: "Core resources",
        summary:
          "Issue the go.linkapprove.com redirect that turns a click into an attributed conversion.",
        description:
          "Create LinkApprove tracking links with sub IDs and deep links, then list and retrieve them. Every click goes through go.linkapprove.com.",
        icon: Link2,
        sections: [
          { id: "the-link-object", label: "The tracking link object" },
          { id: "create-a-link", label: "Create a tracking link" },
          { id: "sub-ids", label: "Sub IDs and attribution" },
          { id: "deep-links", label: "Deep links" },
          { id: "list-links", label: "List tracking links" },
          { id: "retrieve-a-link", label: "Retrieve a tracking link" },
        ],
      },
      {
        path: "/reports",
        label: "Reports",
        title: "Affiliate Performance Reports API",
        eyebrow: "Core resources",
        summary:
          "Clicks, conversions and earnings for a date range, grouped by program, channel, day or sub ID.",
        description:
          "Pull LinkApprove clicks, conversions and earnings for any range up to 180 days, grouped by program, channel, day or sub ID.",
        icon: BarChart3,
        sections: [
          { id: "the-report-row", label: "The report row" },
          { id: "performance-report", label: "Performance report" },
          { id: "group-by", label: "Grouping" },
          { id: "data-freshness", label: "Data freshness" },
        ],
      },
    ],
  },
  {
    title: "Money & account",
    pages: [
      {
        path: "/payments",
        label: "Payments",
        title: "Affiliate Payments & Balance API",
        eyebrow: "Money & account",
        summary:
          "Your balance by state, the commissions credited to it, and every withdrawal with its invoice.",
        description:
          "Read your LinkApprove balance at every stage, the commissions credited to it and your withdrawals with invoices. Read-only by design.",
        icon: Wallet,
        sections: [
          { id: "how-money-moves", label: "How money moves" },
          { id: "retrieve-balance", label: "Retrieve your balance" },
          { id: "list-transactions", label: "List transactions" },
          { id: "list-withdrawals", label: "List withdrawals" },
          { id: "retrieve-a-withdrawal", label: "Retrieve a withdrawal" },
        ],
      },
      {
        path: "/account",
        label: "Account",
        title: "Publisher Account API",
        eyebrow: "Money & account",
        summary:
          "Your publisher profile and the payout destinations on file, masked.",
        description:
          "Retrieve your LinkApprove publisher profile and the payout methods on file, with account numbers masked. Both endpoints are read-only.",
        icon: UserRound,
        sections: [
          { id: "retrieve-account", label: "Retrieve your account" },
          { id: "list-payment-methods", label: "List payment methods" },
        ],
      },
    ],
  },
  {
    title: "Events",
    pages: [
      {
        path: "/webhooks",
        label: "Webhooks",
        title: "Affiliate Conversion Webhooks",
        eyebrow: "Events",
        summary:
          "A signed POST to your server when a conversion arrives or changes status.",
        description:
          "Get a signed LinkApprove webhook when a conversion arrives or changes status. Verify the signature, handle retries and replay failed deliveries.",
        icon: Webhook,
        sections: [
          { id: "how-webhooks-work", label: "How webhooks work" },
          { id: "events", label: "Events and payloads" },
          { id: "verify-signatures", label: "Verify the signature" },
          { id: "retries", label: "Retries and disabling" },
          { id: "register-an-endpoint", label: "Register an endpoint" },
          { id: "manage-endpoints", label: "Manage endpoints" },
          { id: "rotate-the-secret", label: "Rotate the secret" },
          { id: "send-a-test-event", label: "Send a test event" },
          { id: "deliveries", label: "Deliveries and replay" },
        ],
      },
    ],
  },
  {
    title: "Reference",
    pages: [
      {
        path: "/errors",
        label: "Errors & Limits",
        title: "API Errors & Rate Limits",
        eyebrow: "Reference",
        summary:
          "The response envelope, every status code we return, and how throttling behaves.",
        description:
          "Every status code and error code the LinkApprove API returns, the response envelope, rate limits, monthly quota and when it is safe to retry.",
        icon: AlertTriangle,
        sections: [
          { id: "the-envelope", label: "The response envelope" },
          { id: "status-codes", label: "Status codes" },
          { id: "error-codes", label: "Error codes" },
          { id: "rate-limits", label: "Rate limits" },
          { id: "retries", label: "Retries and idempotency" },
        ],
      },
    ],
  },
];

export const DOC_PAGES = NAV_GROUPS.flatMap((group) => group.pages);

export type TSearchEntry = {
  path: string;
  page: string;
  label: string;
  group: string;
  hash: string;
};

export const SEARCH_INDEX: TSearchEntry[] = NAV_GROUPS.flatMap((group) =>
  group.pages.flatMap((page) => [
    {
      path: page.path,
      page: page.label,
      label: page.label,
      group: group.title,
      hash: "",
    },
    ...page.sections.map((section) => ({
      path: page.path,
      page: page.label,
      label: section.label,
      group: group.title,
      hash: `#${section.id}`,
    })),
  ])
);

export const pageByPath = (path: string) =>
  DOC_PAGES.find((page) => page.path === path) as TDocPage;

export const toDocumentTitle = (page: TDocPage) =>
  `${page.title} · ${SITE_NAME}`;

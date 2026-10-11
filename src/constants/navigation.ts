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
  eyebrow: string;
  summary: string;
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
        eyebrow: "Introduction",
        summary:
          "One REST API for the programs you run, the links you place and the money you earn.",
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
        eyebrow: "Introduction",
        summary:
          "From a fresh API key to your first tracking link in about four minutes.",
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
        eyebrow: "Introduction",
        summary:
          "Bearer keys, scopes, expiry and what to do the moment a secret leaks.",
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
        eyebrow: "Core resources",
        summary:
          "The sites, newsletters and social accounts your traffic comes from, and how to verify them.",
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
        eyebrow: "Core resources",
        summary:
          "Browse the merchant catalogue, apply on behalf of a channel, track approval state.",
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
        eyebrow: "Core resources",
        summary:
          "Issue the go.linkapprove.com redirect that turns a click into an attributed conversion.",
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
        eyebrow: "Core resources",
        summary:
          "Clicks, conversions and earnings for a date range, grouped by program, channel, day or sub ID.",
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
        eyebrow: "Money & account",
        summary:
          "Your balance by state, the commissions credited to it, and every withdrawal with its invoice.",
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
        eyebrow: "Money & account",
        summary:
          "Your publisher profile and the payout destinations on file, masked.",
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
        eyebrow: "Events",
        summary:
          "A signed POST to your server when a conversion arrives or changes status.",
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
        eyebrow: "Reference",
        summary:
          "The response envelope, every status code we return, and how throttling behaves.",
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

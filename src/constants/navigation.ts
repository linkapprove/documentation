import {
  AlertTriangle,
  BookOpen,
  KeyRound,
  Link2,
  Package,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export const API_BASE_URL = "https://api.linkapprove.com/v1";
export const DASHBOARD_URL = "https://app.linkapprove.com";
export const API_KEYS_URL = "https://app.linkapprove.com/publisher/account/api-keys";
export const RATE_LIMIT_PER_MINUTE = 600;
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
        ],
      },
      {
        path: "/tracking-links",
        label: "Tracking Links",
        eyebrow: "Core resources",
        summary:
          "Issue the /go redirect that turns a click into an attributed conversion.",
        icon: Link2,
        sections: [
          { id: "the-link-object", label: "The tracking link object" },
          { id: "create-a-link", label: "Create a tracking link" },
          { id: "sub-ids", label: "Sub IDs and attribution" },
          { id: "deep-links", label: "Deep links" },
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

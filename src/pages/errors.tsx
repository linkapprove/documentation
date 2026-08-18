import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { ParamsTable, StatusRow } from "@/components/endpoint";
import {
  MONTHLY_QUOTA,
  RATE_LIMIT_PER_MINUTE,
  pageByPath,
} from "@/constants/navigation";

const PAGE = pageByPath("/errors");

const ENVELOPES = [
  {
    language: "json",
    label: "Success",
    code: `{
  "success": true,
  "message": "Tracking link created",
  "data": { "id": 90124 }
}`,
  },
  {
    language: "json",
    label: "Validation error",
    code: `{
  "success": false,
  "message": "Validation failed",
  "error": [
    {
      "field": "channelId",
      "code": "required",
      "message": "channelId is required"
    },
    {
      "field": "subId",
      "code": "invalid_format",
      "message": "subId may only contain letters, digits, - and _"
    }
  ]
}`,
  },
  {
    language: "json",
    label: "Single error",
    code: `{
  "success": false,
  "message": "Program not found",
  "error": { "code": "program_not_found" }
}`,
  },
];

const STATUS_CODES = [
  {
    code: "200",
    label: "OK",
    description: "The request succeeded. Read data.",
  },
  {
    code: "201",
    label: "Created",
    description: "A new object exists. data carries it, including its new id.",
  },
  {
    code: "202",
    label: "Accepted",
    description:
      "Queued for background work — bulk applications and webhook replays return this.",
  },
  {
    code: "400",
    label: "Bad Request",
    description:
      "Malformed JSON or an unparseable query parameter. The body never reached validation.",
  },
  {
    code: "401",
    label: "Unauthorized",
    description:
      "Missing, malformed, paused, expired or revoked API key. Not a scope problem.",
  },
  {
    code: "403",
    label: "Forbidden",
    description:
      "The key is valid but lacks the scope, is outside its IP allowlist, or is not approved on the resource.",
  },
  {
    code: "404",
    label: "Not Found",
    description:
      "No such object, or one your account cannot see. We do not distinguish the two on purpose.",
  },
  {
    code: "409",
    label: "Conflict",
    description:
      "The write would duplicate something that already exists, such as a second application for the same program and channel.",
  },
  {
    code: "422",
    label: "Unprocessable",
    description:
      "Well-formed and authorised, but the domain rules say no — a deep link off-domain, a withdrawal above your balance.",
  },
  {
    code: "429",
    label: "Too Many Requests",
    description: "Rate limited. Read Retry-After and back off.",
  },
  {
    code: "500",
    label: "Server Error",
    description:
      "Our fault. Safe to retry an idempotent request; open a ticket if it persists.",
  },
];

const ERROR_CODES = [
  {
    name: "invalid_api_key",
    type: "401",
    description: "The key does not exist, is paused, expired or was revoked.",
  },
  {
    name: "insufficient_scope",
    type: "403",
    description:
      "Valid key, missing scope. The body names the scope that was required.",
  },
  {
    name: "ip_not_allowed",
    type: "403",
    description: "The calling address is outside the key's allowlist.",
  },
  {
    name: "program_not_found",
    type: "404",
    description: "Unknown program ID, or one not available to your account.",
  },
  {
    name: "program_not_approved",
    type: "403",
    description:
      "You are not approved on this program for the channel you passed.",
  },
  {
    name: "channel_not_verified",
    type: "403",
    description:
      "The channel exists but has not completed verification, so it cannot carry links.",
  },
  {
    name: "duplicate_application",
    type: "409",
    description: "This program and channel pair already has an application.",
  },
  {
    name: "destination_not_allowed",
    type: "422",
    description:
      "The deep link is not on the merchant's domain, or the program does not support deep links.",
  },
  {
    name: "insufficient_balance",
    type: "422",
    description: "The withdrawal exceeds your available balance.",
  },
  {
    name: "rate_limited",
    type: "429",
    description: "Too many requests in the window. Retry-After tells you when.",
  },
];

const RATE_HEADERS = [
  {
    language: "http",
    label: "Headers",
    code: `HTTP/1.1 200 OK
X-RateLimit-Limit: ${RATE_LIMIT_PER_MINUTE}
X-RateLimit-Remaining: 583
X-RateLimit-Reset: 1755511260
X-Quota-Used: 128402
X-Quota-Limit: ${MONTHLY_QUOTA}`,
  },
  {
    language: "http",
    label: "Throttled",
    code: `HTTP/1.1 429 Too Many Requests
Retry-After: 14
X-RateLimit-Limit: ${RATE_LIMIT_PER_MINUTE}
X-RateLimit-Remaining: 0`,
  },
];

const BACKOFF = [
  {
    language: "node",
    label: "Node",
    code: `async function callWithRetry(request, attempts = 4) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const res = await request();
    if (res.status !== 429 && res.status < 500) return res;

    const retryAfter = Number(res.headers.get("Retry-After"));
    const backoff = retryAfter
      ? retryAfter * 1000
      : Math.min(2 ** attempt * 500, 8000);

    await new Promise((resolve) => setTimeout(resolve, backoff));
  }

  throw new Error("Gave up after retries");
}`,
  },
];

const ERROR_SHAPES = [
  {
    language: "json",
    label: "insufficient_scope",
    code: `{
  "success": false,
  "message": "This key is missing the links:write scope",
  "error": {
    "code": "insufficient_scope",
    "required": "links:write",
    "granted": ["programs:read", "reports:read"]
  }
}`,
  },
  {
    language: "json",
    label: "duplicate_application",
    code: `{
  "success": false,
  "message": "You have already applied to this program on this channel",
  "error": {
    "code": "duplicate_application",
    "applicationId": 55071,
    "status": "pending"
  }
}`,
  },
  {
    language: "json",
    label: "insufficient_balance",
    code: `{
  "success": false,
  "message": "Withdrawal exceeds your available balance",
  "error": {
    "code": "insufficient_balance",
    "requested": "1200.00",
    "available": "742.18"
  }
}`,
  },
];

export default function Errors() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="the-envelope"
        title="The response envelope"
        panel={<CodeBlock samples={ENVELOPES} />}
      >
        <Lead>
          Every response has the same shape, whether it succeeded or not. Branch
          on the HTTP status, read <Code>message</Code> for a human, read{" "}
          <Code>error</Code> for a machine.
        </Lead>

        <List
          items={[
            <>
              <Code>success</Code> is always present and always a boolean.
            </>,
            <>
              <Code>data</Code> appears only on success;{" "}
              <Code>error</Code> only on failure. They never both appear.
            </>,
            <>
              Validation failures return <Code>error</Code> as an array, one
              entry per offending field. Everything else returns an object.
            </>,
            <>
              <Code>message</Code> is written for a human reading a log. Do not
              match on it — match on <Code>error.code</Code>, which is stable.
            </>,
          ]}
        />
      </Section>

      <Section id="status-codes" title="Status codes">
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="grid grid-cols-[5rem_9rem_minmax(0,1fr)] gap-4 border-b border-line bg-elevated px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-subtle max-md:hidden">
            <span>Status</span>
            <span>Meaning</span>
            <span>When you see it</span>
          </div>
          <div className="divide-y divide-line">
            {STATUS_CODES.map((status) => (
              <StatusRow key={status.code} {...status} />
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="error-codes"
        title="Error codes"
        panel={<CodeBlock samples={ERROR_SHAPES} />}
      >
        <P>
          <Code>error.code</Code> is the contract. It is stable across releases,
          and it is what your retry and alerting logic should branch on.
        </P>
        <ParamsTable title="Code · status" params={ERROR_CODES} />
      </Section>

      <Section
        id="rate-limits"
        title="Rate limits"
        panel={<CodeBlock samples={RATE_HEADERS} />}
      >
        <P>
          Limits are per API key: {RATE_LIMIT_PER_MINUTE} requests per minute in
          a rolling window, against a monthly quota of{" "}
          {MONTHLY_QUOTA.toLocaleString("en-US")} calls across your account.
          Every response tells you where you stand.
        </P>

        <List
          items={[
            <>
              <Code>X-RateLimit-Reset</Code> is a Unix timestamp for when the
              per-minute window clears.
            </>,
            <>
              <Code>Retry-After</Code> appears only on a <Code>429</Code> and is
              in seconds. Honour it rather than guessing.
            </>,
            <>
              Exceeding the monthly quota returns <Code>429</Code> until the
              first of the month, with <Code>error.code</Code> set to{" "}
              <Code>quota_exceeded</Code>.
            </>,
            <>
              The click redirect at <Code>track.linkapprove.com/go/</Code> is
              not rate limited — real visitors are never throttled.
            </>,
          ]}
        />
      </Section>

      <Section
        id="retries"
        title="Retries and idempotency"
        panel={<CodeBlock samples={BACKOFF} />}
      >
        <Sub>What is safe to retry</Sub>
        <List
          items={[
            <>
              Every <Code>GET</Code> is safe. Retry freely.
            </>,
            <>
              <Code>429</Code> and <Code>5xx</Code> are safe to retry with
              back-off — the request either did not run or did not complete.
            </>,
            <>
              <Code>4xx</Code> other than <Code>429</Code> will fail identically
              on retry. Fix the request instead.
            </>,
          ]}
        />

        <Callout variant="info" title="Writes are naturally idempotent">
          Applying twice for the same program and channel returns{" "}
          <Code>409</Code> rather than creating a duplicate, and minting a link
          with an identical program, channel and sub ID returns the existing
          link with <Code>200</Code> instead of <Code>201</Code>. A retried
          write will not double up.
        </Callout>
      </Section>
    </DocLayout>
  );
}

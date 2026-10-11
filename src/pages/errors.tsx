import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { ParamsTable, StatusRow } from "@/components/endpoint";
import {
  API_BASE_URL,
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
      "message": "subId may only contain letters, digits, - and _ (max 64)"
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
    description:
      "The request succeeded. Read data. Also returned when creating a tracking link that already exists.",
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
      "Queued for background work. Webhook test events and delivery replays return this.",
  },
  {
    code: "400",
    label: "Bad Request",
    description: "Malformed JSON or a request that failed validation.",
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
      "The key is valid but lacks the scope or is outside its IP allowlist, or the channel or program is not in a state that allows the write.",
  },
  {
    code: "404",
    label: "Not Found",
    description:
      "No such object, or one your account cannot see. We do not distinguish the two, on purpose. Also an unknown route.",
  },
  {
    code: "409",
    label: "Conflict",
    description:
      "The write clashes with what already exists: a second application for the same program and channel, a second channel for one domain, a sixth webhook endpoint.",
  },
  {
    code: "413",
    label: "Payload Too Large",
    description: "The request body is over 1 MB.",
  },
  {
    code: "422",
    label: "Unprocessable",
    description:
      "Well-formed and authorised, but the domain rules say no: a deep link off-domain, a webhook URL that is not public https, a verification tag we could not find.",
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
    name: "malformed_json",
    type: "400",
    description: "The request body is not valid JSON.",
  },
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
    description:
      "The calling address is outside the key's allowlist. error.ip is the address we saw, often IPv6.",
  },
  {
    name: "route_not_found",
    type: "404",
    description:
      "No endpoint matches the method and path. Check for a missing /v1 or a typo.",
  },
  {
    name: "program_not_found",
    type: "404",
    description: "Unknown program ID, or one not available to your account.",
  },
  {
    name: "channel_not_found",
    type: "404",
    description: "The channelId does not exist or is not one of yours.",
  },
  {
    name: "tracking_link_not_found",
    type: "404",
    description: "The tracking link does not exist or is not one of yours.",
  },
  {
    name: "withdrawal_not_found",
    type: "404",
    description: "The withdrawal does not exist or is not one of yours.",
  },
  {
    name: "webhook_not_found",
    type: "404",
    description:
      "The webhook endpoint does not exist, was deleted, or is not one of yours.",
  },
  {
    name: "delivery_not_found",
    type: "404",
    description: "No delivery with that ID belongs to this webhook endpoint.",
  },
  {
    name: "program_not_approved",
    type: "403",
    description:
      "There is no approved application for this program on the channel you passed.",
  },
  {
    name: "channel_not_verified",
    type: "403",
    description:
      "The channel is not approved, or has a verification step it has not completed, so it cannot apply or carry links.",
  },
  {
    name: "duplicate_application",
    type: "409",
    description:
      "This program and channel pair already has an application, whatever its status, rejected included. error carries applicationId and status. Re-applying is not possible through the API; contact support.",
  },
  {
    name: "duplicate_channel",
    type: "409",
    description: "You already have a channel for this domain.",
  },
  {
    name: "verification_not_required",
    type: "409",
    description:
      "The channel's category has no verification step. Social, email and other channels are reviewed by hand.",
  },
  {
    name: "webhook_limit_reached",
    type: "409",
    description:
      "The account already has five webhook endpoints. Delete one first.",
  },
  {
    name: "delivery_not_replayable",
    type: "409",
    description:
      "The delivery is still queued or retrying. Only succeeded or failed deliveries can be replayed.",
  },
  {
    name: "payload_too_large",
    type: "413",
    description: "The request body is over 1 MB.",
  },
  {
    name: "destination_not_allowed",
    type: "422",
    description:
      "The program does not support deep links, or destinationUrl is not on the merchant's domain or a subdomain of it. error.merchantDomain names the domain.",
  },
  {
    name: "verification_failed",
    type: "422",
    description:
      "We fetched the channel URL but did not find the verification meta tag, or the page could not be fetched.",
  },
  {
    name: "url_not_allowed",
    type: "422",
    description:
      "The webhook URL is not https on port 443, carries credentials, or resolves to a private address.",
  },
  {
    name: "rate_limited",
    type: "429",
    description: "Too many requests in the window. Retry-After tells you when.",
  },
  {
    name: "quota_exceeded",
    type: "429",
    description:
      "The account has used its monthly quota. Retry-After counts down to the 1st (UTC).",
  },
  {
    name: "internal_error",
    type: "500",
    description:
      "Something failed on our side. Safe to retry an idempotent request with back-off.",
  },
];

const RATE_HEADERS = [
  {
    language: "http",
    label: "Headers",
    code: `HTTP/1.1 200 OK
X-RateLimit-Limit: ${RATE_LIMIT_PER_MINUTE}
X-RateLimit-Remaining: 103
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
  {
    language: "bash",
    label: "Health",
    code: `curl ${API_BASE_URL}/health

{
  "success": true,
  "message": "API is healthy",
  "data": null
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
    label: "url_not_allowed",
    code: `{
  "success": false,
  "message": "Webhook URLs must be public https URLs on port 443",
  "error": { "code": "url_not_allowed" }
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
              <Code>data</Code> appears only on success. Every failure carries{" "}
              <Code>error</Code> instead. They never both appear.
            </>,
            <>
              <Code>error</Code> is an object with a <Code>code</Code>, except
              on a validation failure, where it is an array of{" "}
              <Code>{"{ field, code, message }"}</Code> with exactly one entry
              per offending field. There <Code>code</Code> is{" "}
              <Code>required</Code> or <Code>invalid_format</Code>.
            </>,
            <>
              <Code>message</Code> is written for a human reading a log. Do not
              match on it. Match on <Code>error.code</Code>, which is stable.
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
          Limits are per account, shared by all of its API keys:{" "}
          {RATE_LIMIT_PER_MINUTE} requests per minute in a fixed one-minute
          window, against a monthly quota of{" "}
          {MONTHLY_QUOTA.toLocaleString("en-US")} calls. Every request that gets
          past authentication carries the <Code>X-RateLimit-*</Code> headers,
          and the <Code>X-Quota-*</Code> headers unless it was rate limited. A{" "}
          <Code>401</Code> or an <Code>ip_not_allowed</Code> <Code>403</Code>{" "}
          carries neither.
        </P>

        <List
          items={[
            <>
              <Code>X-RateLimit-Reset</Code> is a Unix timestamp for when the
              per-minute window clears.
            </>,
            <>
              <Code>X-Quota-Used</Code> is the month's count before the current
              request; <Code>X-Quota-Limit</Code> is the monthly quota.
            </>,
            <>
              <Code>Retry-After</Code> appears only on a <Code>429</Code> and is
              in seconds. Honour it rather than guessing.
            </>,
            <>
              Exceeding the monthly quota returns <Code>429</Code> until the
              first of the next month (UTC), with <Code>error.code</Code> set to{" "}
              <Code>quota_exceeded</Code>.
            </>,
            <>
              Calls refused with a <Code>401</Code>, an{" "}
              <Code>ip_not_allowed</Code> <Code>403</Code> or any{" "}
              <Code>429</Code> do not count towards the quota. Every other
              authenticated call does, including ones that fail with a{" "}
              <Code>4xx</Code>.
            </>,
            <>
              The click redirect at <Code>go.linkapprove.com</Code> allows up to
              50 requests per second per visitor IP, a ceiling real visitors
              never reach.
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
              back-off, because the request either did not run or did not
              complete.
            </>,
            <>
              <Code>4xx</Code> other than <Code>429</Code> will fail identically
              on retry. Fix the request instead.
            </>,
          ]}
        />

        <Sub>Is it us or you?</Sub>
        <P>
          <Code>GET /v1/health</Code> needs no key, is not rate limited and does
          not count towards the quota. A <Code>200</Code> with{" "}
          <Code>"API is healthy"</Code> means the API is up, so a failure
          elsewhere is about the request or the key.
        </P>

        <Callout variant="info" title="Writes are naturally idempotent">
          Applying twice for the same program and channel returns{" "}
          <Code>409</Code> rather than creating a duplicate, and minting a link
          with an identical program, channel, destination URL,{" "}
          <Code>subId</Code> and <Code>subId2</Code> returns the existing link
          with <Code>200</Code> instead of <Code>201</Code>. A retried write
          will not double up.
        </Callout>
      </Section>
    </DocLayout>
  );
}

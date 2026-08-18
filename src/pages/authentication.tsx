import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { ParamsTable } from "@/components/endpoint";
import {
  API_BASE_URL,
  API_KEYS_URL,
  pageByPath,
} from "@/constants/navigation";

const PAGE = pageByPath("/authentication");

const AUTH_HEADER = [
  {
    language: "http",
    label: "Request",
    code: `GET /v1/programs?size=10 HTTP/1.1
Host: api.linkapprove.com
Authorization: Bearer lk_9f2c4a71e8b350d6c1f4a7e2b8d90c53
Content-Type: application/json`,
  },
  {
    language: "bash",
    label: "cURL",
    code: `curl ${API_BASE_URL}/programs \\
  -H "Authorization: Bearer $LINKAPPROVE_API_KEY"`,
  },
  {
    language: "node",
    label: "Node",
    code: `const client = (path, init = {}) =>
  fetch(\`${API_BASE_URL}\${path}\`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: \`Bearer \${process.env.LINKAPPROVE_API_KEY}\`,
      "Content-Type": "application/json",
    },
  });`,
  },
];

const UNAUTHORIZED = [
  {
    language: "json",
    label: "401 Unauthorized",
    code: `{
  "success": false,
  "message": "Invalid or revoked API key",
  "error": { "code": "invalid_api_key" }
}`,
  },
  {
    language: "json",
    label: "403 Forbidden",
    code: `{
  "success": false,
  "message": "This key is missing the links:write scope",
  "error": {
    "code": "insufficient_scope",
    "required": "links:write",
    "granted": ["programs:read", "links:read", "reports:read"]
  }
}`,
  },
];

const SCOPES = [
  {
    name: "programs:read",
    type: "read",
    description: "Browse the catalogue and see your own applications.",
  },
  {
    name: "programs:write",
    type: "write",
    description: "Apply to programs and bulk-apply on behalf of a channel.",
  },
  {
    name: "links:read",
    type: "read",
    description: "List the tracking links already issued to you.",
  },
  {
    name: "links:write",
    type: "write",
    description: "Mint new tracking links against approved programs.",
  },
  {
    name: "channels:read",
    type: "read",
    description: "Read your verified websites, apps and social properties.",
  },
  {
    name: "channels:write",
    type: "write",
    description: "Submit new channels and trigger re-verification.",
  },
  {
    name: "reports:read",
    type: "read",
    description: "Clicks, conversions, commission and reversals. Read-only.",
  },
  {
    name: "creatives:read",
    type: "read",
    description: "Banners and coupon codes released by merchants. Read-only.",
  },
  {
    name: "payments:read",
    type: "read",
    description: "Balances, credited commissions and payout history.",
  },
  {
    name: "payments:write",
    type: "write",
    description: "Request a withdrawal against your available balance.",
  },
  {
    name: "webhooks:read",
    type: "read",
    description: "List registered endpoints and their delivery history.",
  },
  {
    name: "webhooks:write",
    type: "write",
    description: "Register endpoints and replay failed deliveries.",
  },
];

const ROTATE = [
  {
    language: "bash",
    label: "Rotate",
    code: `# 1. roll the secret in the dashboard, then
export LINKAPPROVE_API_KEY="lk_the_new_secret"

# 2. confirm the new one works
curl -s -o /dev/null -w "%{http_code}\\n" \\
  https://api.linkapprove.com/v1/programs?size=1 \\
  -H "Authorization: Bearer $LINKAPPROVE_API_KEY"

# 200`,
  },
  {
    language: "node",
    label: "Health check",
    code: `const res = await fetch("https://api.linkapprove.com/v1/programs?size=1", {
  headers: { Authorization: \`Bearer \${process.env.LINKAPPROVE_API_KEY}\` },
});

if (res.status === 401) {
  throw new Error("Key is paused, expired or revoked");
}

if (res.status === 403) {
  const body = await res.json();
  throw new Error(\`Missing scope: \${body.error.required}\`);
}`,
  },
];

const ROTATED_ERROR = [
  {
    language: "json",
    label: "Old secret",
    code: `{
  "success": false,
  "message": "This secret was rotated on 2026-08-18",
  "error": {
    "code": "invalid_api_key",
    "rotatedAt": "2026-08-18T09:12:44Z"
  }
}`,
  },
  {
    language: "json",
    label: "Outside allowlist",
    code: `{
  "success": false,
  "message": "Request origin 91.204.11.8 is not in this key's allowlist",
  "error": {
    "code": "ip_not_allowed",
    "allowlist": ["52.14.88.0/24"]
  }
}`,
  },
];

export default function Authentication() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="bearer-tokens"
        title="Bearer tokens"
        panel={<CodeBlock samples={AUTH_HEADER} />}
      >
        <Lead>
          The API authenticates with a single API key sent as a bearer token.
          There is no OAuth dance, no session, no refresh token — one header on
          every request.
        </Lead>

        <List
          items={[
            <>
              Keys are prefixed <Code>lk_</Code> followed by 32 characters.
            </>,
            <>
              Requests must be HTTPS. Plain HTTP is refused before the key is
              read.
            </>,
            <>
              A key identifies a publisher account, not a person — the same key
              can reach every channel that account owns, subject to its scopes.
            </>,
          ]}
        />

        <Sub>When it goes wrong</Sub>
        <P>
          A missing, malformed, paused or revoked key returns <Code>401</Code>.
          A valid key that lacks the scope for the endpoint returns{" "}
          <Code>403</Code>, and tells you exactly which scope was missing.
        </P>
      </Section>

      <Section
        id="scopes"
        title="Scopes"
        panel={<CodeBlock samples={UNAUTHORIZED} />}
      >
        <P>
          Scopes are granted per key and follow a{" "}
          <Code>resource:access</Code> shape. Write implies read — granting{" "}
          <Code>links:write</Code> also grants <Code>links:read</Code>. Two
          resources are read-only by nature and have no write scope at all.
        </P>

        <ParamsTable title="Available scopes" params={SCOPES} />

        <Callout variant="tip" title="Grant the minimum">
          A reporting script that only pulls numbers should hold{" "}
          <Code>reports:read</Code> and nothing else. If that key leaks, the
          worst case is someone reads your revenue — not that they redirect your
          payout.
        </Callout>
      </Section>

      <Section
        id="key-lifecycle"
        title="Key lifecycle"
        panel={<CodeBlock samples={ROTATE} />}
      >
        <P>
          Everything below is managed from{" "}
          <a
            href={API_KEYS_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-4"
          >
            Account → API Keys
          </a>{" "}
          in the publisher dashboard. Keys cannot create other keys.
        </P>

        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
          {[
            {
              title: "Created",
              body: "The secret is displayed once, then only its last four characters are ever shown again. We store a hash.",
            },
            {
              title: "Paused",
              body: "Requests return 401 while the key is paused. Scopes, name and history are preserved — resume and it works again.",
            },
            {
              title: "Rolled",
              body: "A new secret is issued and the old one dies immediately. Permissions, name and reporting carry over.",
            },
            {
              title: "Revoked",
              body: "Permanent. The key stops working and cannot be brought back — you create a new one instead.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-subtle">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <Sub>Optional hardening</Sub>
        <List
          items={[
            <>
              <strong className="font-medium text-ink">Expiry</strong> — 30, 90
              or 365 days. The key returns <Code>401</Code> the moment it
              lapses, so treat expiry as a deadline, not a warning.
            </>,
            <>
              <strong className="font-medium text-ink">IP allowlist</strong> —
              accept a comma-separated list of addresses or CIDR ranges.
              Anything else gets <Code>403</Code> regardless of scope.
            </>,
          ]}
        />
      </Section>

      <Section
        id="handling-a-leak"
        title="Handling a leak"
        panel={<CodeBlock samples={ROTATED_ERROR} />}
      >
        <P>
          If a secret ends up somewhere it should not be — a public repo, a
          screenshot, a shared log — roll it. Rolling is faster than revoking
          and re-integrating, because the key keeps its identity.
        </P>

        <List
          items={[
            <>Roll the secret from the dashboard. The old one dies instantly.</>,
            <>
              Update the environment variable wherever the key runs, then
              redeploy.
            </>,
            <>
              Check the key's request history for calls you do not recognise.
            </>,
            <>
              If anything looks wrong, revoke instead of rolling and open a
              ticket — we can trace every call a key made.
            </>,
          ]}
        />

        <Callout variant="danger" title="Never put a key in a browser">
          There is no public or publishable key. Anything shipped to a client is
          readable by anyone who opens devtools. Proxy through your own backend
          instead.
        </Callout>
      </Section>
    </DocLayout>
  );
}

import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { ApiRunner } from "@/components/api-runner";
import { Endpoint, ParamsTable } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { API_BASE_URL, API_KEYS_URL, pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/authentication");

const AUTH_HEADER = [
  {
    language: "http",
    label: "Request",
    code: `GET /v1/programs?size=10 HTTP/1.1
Host: ${new URL(API_BASE_URL).host}
Authorization: Bearer la_9f2c4a71e8b350d6c1f4a7e2b8d90c53
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
    description: "Apply to programs on behalf of a channel.",
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
    description: "List your channels and their verification state.",
  },
  {
    name: "channels:write",
    type: "write",
    description: "Submit new channels and run the verification check.",
  },
  {
    name: "reports:read",
    type: "read",
    description: "Clicks, conversions and commission. Read-only.",
  },
  {
    name: "payments:read",
    type: "read",
    description:
      "Your balance, credited commissions and withdrawal history. Read-only.",
  },
  {
    name: "webhooks:read",
    type: "read",
    description: "List registered endpoints and their delivery history.",
  },
  {
    name: "webhooks:write",
    type: "write",
    description:
      "Register, change and delete endpoints, rotate their secrets, send test events and replay deliveries.",
  },
  {
    name: "account:read",
    type: "read",
    description:
      "Your profile and payment methods, with payout destinations masked. Read-only.",
  },
];

const ROTATE = [
  {
    language: "bash",
    label: "Rotate",
    code: `# 1. roll the secret in the dashboard, then
export LINKAPPROVE_API_KEY="la_the_new_secret"

# 2. confirm the new one works
curl -s -o /dev/null -w "%{http_code}\\n" \\
  "${API_BASE_URL}/programs?size=1" \\
  -H "Authorization: Bearer $LINKAPPROVE_API_KEY"

# 200`,
  },
  {
    language: "node",
    label: "Health check",
    code: `const res = await fetch("${API_BASE_URL}/programs?size=1", {
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
  "message": "This address is not on the key's IP allowlist",
  "error": {
    "code": "ip_not_allowed",
    "ip": "2001:db8:85a3:4d2::7334"
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
          There is no OAuth dance, no session, no refresh token. Just one header
          on every request.
        </Lead>

        <List
          items={[
            <>
              Keys are prefixed <Code>la_</Code> followed by 32 characters.
            </>,
            <>Use HTTPS. The API is only served over TLS.</>,
            <>
              A key identifies a publisher account, not a person. The same key
              can reach every channel that account owns, subject to its scopes.
            </>,
          ]}
        />

        <Sub>When it goes wrong</Sub>
        <P>
          A missing, malformed, paused, expired or revoked key returns{" "}
          <Code>401</Code>, and so does a key whose publisher account is not
          active. A valid key that lacks the scope for the endpoint returns{" "}
          <Code>403</Code>, and tells you exactly which scope was missing.
        </P>
      </Section>

      <Section
        id="verify-a-key"
        title="Verify a key"
        panel={<ApiRunner endpoint={ENDPOINTS.retrieveMe} />}
      >
        <Endpoint method="GET" path="/me" scope="any" />
        <P>
          Returns the key making the request: its name, last four characters,
          scopes, IP allowlist and expiry, plus <Code>callerIp</Code>, the
          address we saw the request come from. It needs no particular scope, so
          it is the quickest way to confirm a new or rolled key works, and to
          find out exactly what to put in the allowlist.
        </P>
        <P>
          Like every authenticated call it counts towards your rate limit and
          quota and returns the <Code>X-RateLimit-*</Code> and{" "}
          <Code>X-Quota-*</Code> headers. It keeps working after the monthly
          quota runs out, so you can always check where you stand.
        </P>
      </Section>

      <Section
        id="scopes"
        title="Scopes"
        panel={<CodeBlock samples={UNAUTHORIZED} />}
      >
        <P>
          Scopes are granted per key and follow a <Code>resource:access</Code>{" "}
          shape. Write implies read, so granting <Code>links:write</Code> also
          grants <Code>links:read</Code>. Two resources are read-only by nature
          and have no write scope at all.
        </P>

        <ParamsTable title="Available scopes" params={SCOPES} />

        <Callout variant="tip" title="Grant the minimum">
          A reporting script that only pulls numbers should hold{" "}
          <Code>reports:read</Code> and nothing else. If that key leaks, the
          worst case is someone reads your revenue, not that they redirect your
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
          in the publisher dashboard. Keys cannot create other keys, and an
          account can hold at most 10 active keys. Revoked and expired ones do
          not count.
        </P>

        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
          {[
            {
              title: "Created",
              body: "The secret is displayed once, then only its last four characters are ever shown again. We store a hash.",
            },
            {
              title: "Paused",
              body: "Requests return 401 while the key is paused. Scopes, name and history are preserved. Resume it and it works again.",
            },
            {
              title: "Rolled",
              body: "A new secret is issued and the old one dies immediately. Permissions, name and reporting carry over.",
            },
            {
              title: "Revoked",
              body: "Permanent. The key stops working and cannot be brought back, so you create a new one instead.",
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
              <strong className="font-medium text-ink">Expiry</strong>: 30, 90
              or 365 days. The key returns <Code>401</Code> the moment it
              lapses, so treat expiry as a deadline, not a warning.
            </>,
            <>
              <strong className="font-medium text-ink">IP allowlist</strong>:
              accept a comma-separated list of up to 20 IPv4 or IPv6 addresses
              and CIDR ranges. Anything else gets <Code>403</Code> regardless of
              scope, and the error body names the address we saw. A host with
              IPv6 usually calls us over IPv6, so list its IPv6 range (for
              example <Code>2001:db8:85a3:4d2::/64</Code>) as well as its IPv4
              address, or force IPv4 in your client. <Code>GET /me</Code>{" "}
              returns the exact address to add.
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
          If a secret ends up somewhere it should not be, like a public repo, a
          screenshot or a shared log, roll it. Rolling is faster than revoking
          and re-integrating, because the key keeps its identity.
        </P>

        <List
          items={[
            <>
              Roll the secret from the dashboard. The old one dies instantly.
            </>,
            <>
              Update the environment variable wherever the key runs, then
              redeploy.
            </>,
            <>
              Check the key's last-used time and usage in the dashboard for
              activity you did not expect.
            </>,
            <>
              If anything looks wrong, revoke instead of rolling and open a
              ticket.
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

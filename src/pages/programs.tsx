import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { ApiRunner } from "@/components/api-runner";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { Endpoint, ParamsTable } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/programs");

const PROGRAM_OBJECT = [
  {
    language: "json",
    label: "Program",
    code: `{
  "id": 4821,
  "merchantName": "Northpeak Outdoors",
  "merchantDomain": "northpeak.com",
  "description": "Technical outerwear and camping gear.",
  "category": "sports_outdoors",
  "network": "impact",
  "payoutType": "cps",
  "payout": "8.00",
  "payoutUnit": "percent",
  "currency": "USD",
  "cookieDays": 30,
  "approvalType": "manual",
  "status": "approved",
  "regions": ["US", "CA"],
  "supportsDeepLinks": true,
  "logoUrl": "https://cdn.linkapprove.com/merchants/4821.png",
  "termsUrl": "https://northpeak.com/affiliates/terms",
  "isDeleted": false,
  "createdAt": "2025-11-04T18:22:11Z",
  "updatedAt": "2026-08-14T06:01:49Z"
}`,
  },
];

const OBJECT_FIELDS = [
  {
    name: "id",
    type: "integer",
    description:
      "Stable LinkApprove identifier. Mint tracking links against this.",
  },
  {
    name: "merchantName",
    type: "string",
    description: "The brand as the merchant wants it displayed.",
  },
  {
    name: "network",
    type: "enum",
    description: (
      <>
        Where the campaign was ingested from — <Code>impact</Code>,{" "}
        <Code>partnerize</Code>, <Code>admitad</Code>, <Code>takeads</Code>,{" "}
        <Code>linkbux</Code> or <Code>flexoffers</Code>.
      </>
    ),
  },
  {
    name: "payoutType",
    type: "enum",
    description: (
      <>
        <Code>cps</Code> pays a share of the sale, <Code>cpc</Code> pays per
        click, <Code>cpl</Code> pays per lead.
      </>
    ),
  },
  {
    name: "payout",
    type: "string",
    description: "Decimal string. Read together with payoutUnit.",
  },
  {
    name: "payoutUnit",
    type: "enum",
    description: (
      <>
        <Code>percent</Code> for a revenue share, <Code>fixed</Code> for a flat
        amount in <Code>currency</Code>.
      </>
    ),
  },
  {
    name: "cookieDays",
    type: "integer",
    description:
      "Attribution window. A conversion inside it credits your click.",
  },
  {
    name: "approvalType",
    type: "enum",
    description: (
      <>
        <Code>auto</Code> approves the instant you apply; <Code>manual</Code>{" "}
        waits on the merchant.
      </>
    ),
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        Your application state for this program: <Code>not_applied</Code>,{" "}
        <Code>pending</Code>, <Code>approved</Code>, <Code>rejected</Code> or{" "}
        <Code>paused</Code>.
      </>
    ),
  },
  {
    name: "supportsDeepLinks",
    type: "boolean",
    description:
      "Whether the upstream network honours a destinationUrl on a tracking link.",
  },
  {
    name: "regions",
    type: "string[]",
    description: "ISO country codes the merchant ships or converts in.",
  },
];

const LIST_PARAMS = [
  {
    name: "page",
    type: "integer",
    description: "1-based page number. Defaults to 1.",
  },
  {
    name: "size",
    type: "integer",
    description: "Results per page, 1–100. Defaults to 10.",
  },
  {
    name: "search",
    type: "string",
    description: "Fuzzy match against merchant name and domain.",
  },
  {
    name: "category",
    type: "string",
    description: (
      <>
        Filter by category slug, e.g. <Code>fashion</Code> or{" "}
        <Code>sports_outdoors</Code>.
      </>
    ),
  },
  {
    name: "network",
    type: "enum",
    description: "Restrict to campaigns from one upstream network.",
  },
  {
    name: "payoutType",
    type: "enum",
    description: (
      <>
        One of <Code>cps</Code>, <Code>cpc</Code>, <Code>cpl</Code>.
      </>
    ),
  },
  {
    name: "approvalType",
    type: "enum",
    description: (
      <>
        <Code>auto</Code> or <Code>manual</Code>. Useful for finding programs
        you can start on today.
      </>
    ),
  },
  {
    name: "status",
    type: "enum",
    description: "Filter by your own application state for the program.",
  },
];

const APPLY_PARAMS = [
  {
    name: "programId",
    type: "integer",
    required: true,
    description: "The program you want to run.",
  },
  {
    name: "channelId",
    type: "integer",
    required: true,
    description:
      "A verified, approved channel of yours. Applications are per channel, not per account.",
  },
  {
    name: "note",
    type: "string",
    description:
      "Optional message to the merchant — traffic sources, audience size, why you fit.",
  },
];

export default function Programs() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="the-program-object"
        title="The program object"
        panel={<CodeBlock samples={PROGRAM_OBJECT} />}
      >
        <Lead>
          A program is a merchant campaign as LinkApprove presents it — the
          upstream network's terms, normalised into one shape so you do not care
          which network it came from.
        </Lead>

        <ParamsTable title="Fields" params={OBJECT_FIELDS} />

        <Callout variant="info" title="status is about you, not the merchant">
          <Code>status</Code> reflects your application state for the program on
          your channels — not whether the campaign itself is live. A campaign
          that goes dark upstream disappears from the catalogue entirely.
        </Callout>
      </Section>

      <Section
        id="list-programs"
        title="List programs"
        panel={<ApiRunner endpoint={ENDPOINTS.listPrograms} />}
      >
        <Endpoint method="GET" path="/programs" scope="programs:read" />
        <P>
          Returns a paginated list of every campaign available to your account.
          Filters combine with AND.
        </P>

        <ParamsTable title="Query parameters" params={LIST_PARAMS} />

        <Sub>Paginating the whole catalogue</Sub>
        <List
          items={[
            <>
              Read <Code>pages</Code> from the first response and walk{" "}
              <Code>page</Code> up to it — do not guess at an end.
            </>,
            <>
              Use <Code>size=100</Code> for a full sync. That is 137 requests
              for a 13,700-campaign catalogue, comfortably inside the rate
              limit.
            </>,
            <>
              Ordering is newest-first and stable, so a page you already read
              will not reshuffle mid-sync.
            </>,
          ]}
        />
      </Section>

      <Section
        id="retrieve-a-program"
        title="Retrieve a program"
        panel={<ApiRunner endpoint={ENDPOINTS.retrieveProgram} />}
      >
        <Endpoint method="GET" path="/programs/{id}" scope="programs:read" />
        <P>
          Returns a single program with the same shape as a list entry, plus the
          merchant's full terms and the creatives attached to it.
        </P>
        <P>
          An unknown or unavailable ID returns <Code>404</Code> with{" "}
          <Code>program_not_found</Code>. We do not distinguish "does not exist"
          from "not yours" — both are a 404.
        </P>
      </Section>

      <Section
        id="apply-to-a-program"
        title="Apply to a program"
        panel={<ApiRunner endpoint={ENDPOINTS.applyToProgram} />}
      >
        <Endpoint
          method="POST"
          path="/programs/applications"
          scope="programs:write"
        />
        <P>
          Applications are made per channel. The same program can be approved on
          one of your sites and rejected on another, which is why{" "}
          <Code>channelId</Code> is required rather than inferred.
        </P>

        <ParamsTable title="Body parameters" params={APPLY_PARAMS} />

        <Sub>What happens next</Sub>
        <List
          items={[
            <>
              <Code>approvalType: "auto"</Code> comes back <Code>approved</Code>{" "}
              immediately and you can mint links in the same script run.
            </>,
            <>
              <Code>approvalType: "manual"</Code> comes back{" "}
              <Code>pending</Code>. Poll the program, or subscribe to the{" "}
              <Code>application.decided</Code> webhook and stop polling.
            </>,
            <>
              A rejection carries <Code>rejectionReason</Code>. You may re-apply
              once the reason is addressed.
            </>,
            <>
              Applying twice for the same program and channel returns{" "}
              <Code>409</Code> rather than creating a duplicate.
            </>,
          ]}
        />

        <Callout variant="tip" title="Bulk apply">
          Send an array of <Code>{"{ programId, channelId }"}</Code> pairs to{" "}
          <Code>/programs/applications/bulk</Code> to submit up to 50 at once.
          Each entry succeeds or fails independently and the response reports
          both.
        </Callout>
      </Section>
    </DocLayout>
  );
}

import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { ApiRunner } from "@/components/api-runner";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { Endpoint, ParamsTable } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/tracking-links");

const LINK_OBJECT = [
  {
    language: "json",
    label: "Tracking link",
    code: `{
  "id": 90124,
  "programId": 4821,
  "channelId": 12,
  "subId": "spring-guide",
  "subId2": "hero-banner",
  "url": "https://track.linkapprove.com/go/90124",
  "destinationUrl": "https://northpeak.com/collections/shells",
  "clicks": 4180,
  "conversions": 96,
  "commission": "742.18",
  "isDeleted": false,
  "createdAt": "2026-08-18T09:41:02Z",
  "lastClickAt": "2026-08-18T11:07:35Z"
}`,
  },
];

const REDIRECT_FLOW = [
  {
    language: "http",
    label: "Redirect",
    code: `GET /go/90124 HTTP/1.1
Host: track.linkapprove.com

HTTP/1.1 302 Found
Location: https://northpeak.com/collections/shells?irclickid=b8f2...
Set-Cookie: la_click=b8f2...; Max-Age=2592000`,
  },
];

const SUBID_REPORT = [
  {
    language: "json",
    label: "Grouped by subId",
    code: `{
  "success": true,
  "message": "Report fetched",
  "data": {
    "data": [
      { "subId": "spring-guide", "clicks": 2840, "commission": "512.90" },
      { "subId": "post-4471",    "clicks": 1102, "commission": "188.30" },
      { "subId": "sidebar-a",    "clicks": 238,  "commission": "40.98" }
    ],
    "count": 3,
    "pages": 1
  }
}`,
  },
];

const DEEP_LINK_ERROR = [
  {
    language: "json",
    label: "422 Unprocessable",
    code: `{
  "success": false,
  "message": "destinationUrl must be on northpeak.com",
  "error": {
    "code": "destination_not_allowed",
    "merchantDomain": "northpeak.com"
  }
}`,
  },
];

const OBJECT_FIELDS = [
  {
    name: "id",
    type: "integer",
    description: (
      <>
        Also the redirect slug — the link is always{" "}
        <Code>track.linkapprove.com/go/{"{id}"}</Code>.
      </>
    ),
  },
  {
    name: "url",
    type: "string",
    description:
      "The link you place. This is the only URL a visitor should ever see.",
  },
  {
    name: "destinationUrl",
    type: "string",
    description:
      "Where the redirect lands. Null when the link points at the merchant's default landing page.",
  },
  {
    name: "subId",
    type: "string",
    description:
      "Your own attribution tag, echoed back on every click and conversion.",
  },
  {
    name: "subId2",
    type: "string",
    description:
      "A second, independent tag. Useful for placement within a page.",
  },
  {
    name: "clicks",
    type: "integer",
    description: "Total clicks recorded. Updated in batches every ten minutes.",
  },
  {
    name: "conversions",
    type: "integer",
    description:
      "Conversions attributed to this link, including ones still pending merchant approval.",
  },
  {
    name: "lastClickAt",
    type: "string",
    description: "Timestamp of the most recent click, or null if never clicked.",
  },
];

const CREATE_PARAMS = [
  {
    name: "programId",
    type: "integer",
    required: true,
    description: "A program you are approved on for this channel.",
  },
  {
    name: "channelId",
    type: "integer",
    required: true,
    description:
      "The verified channel the traffic will come from. Clicks and commissions attach to it.",
  },
  {
    name: "subId",
    type: "string",
    description:
      "Up to 64 characters: letters, digits, dashes and underscores. Appears in every report.",
  },
  {
    name: "subId2",
    type: "string",
    description: "A second tag with the same rules, tracked independently.",
  },
  {
    name: "destinationUrl",
    type: "string",
    description: (
      <>
        A deep link on the merchant's domain. Must match the program's{" "}
        <Code>merchantDomain</Code>.
      </>
    ),
  },
];

export default function TrackingLinks() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="the-link-object"
        title="The tracking link object"
        panel={<CodeBlock samples={LINK_OBJECT} />}
      >
        <Lead>
          A tracking link is the bridge between a program you are approved on
          and a channel you own. Everything downstream — clicks, conversions,
          commission, your payout — hangs off the link a visitor actually
          clicked.
        </Lead>

        <ParamsTable title="Fields" params={OBJECT_FIELDS} />
      </Section>

      <Section
        id="create-a-link"
        title="Create a tracking link"
        panel={<ApiRunner endpoint={ENDPOINTS.createTrackingLink} />}
      >
        <Endpoint method="POST" path="/tracking-links" scope="links:write" />
        <P>
          Links are cheap and permanent — mint one per placement rather than
          reusing a single link everywhere, so your reporting can tell them
          apart.
        </P>

        <ParamsTable title="Body parameters" params={CREATE_PARAMS} />

        <Callout variant="warning" title="Approval is enforced here">
          Minting against a program you are not approved on for that channel
          returns <Code>403</Code> with <Code>program_not_approved</Code>. Check{" "}
          <Code>status</Code> on the program first, or apply and wait for the
          decision.
        </Callout>
      </Section>

      <Section
        id="sub-ids"
        title="Sub IDs and attribution"
        panel={<CodeBlock samples={SUBID_REPORT} />}
      >
        <P>
          <Code>subId</Code> and <Code>subId2</Code> are yours — we store them,
          echo them back on every click and conversion, and never interpret
          them. They are how you answer "which newsletter earned this?" without
          minting a thousand links you cannot tell apart.
        </P>

        <List
          items={[
            <>
              Pick a scheme and keep it: <Code>2026-08-newsletter</Code>,{" "}
              <Code>post-4471</Code>, <Code>sidebar-a</Code>.
            </>,
            <>
              Sub IDs are set at mint time and immutable afterwards. Mint a new
              link rather than rewriting one.
            </>,
            <>
              Group any report by <Code>subId</Code> to get performance sliced
              your way rather than ours.
            </>,
            <>
              Do not put anything personal in a sub ID. It travels to the
              merchant's network.
            </>,
          ]}
        />

        <Callout variant="tip" title="One link, many placements">
          If you genuinely need one link across placements, append{" "}
          <Code>?s2=</Code> to the tracking URL at click time — it overrides{" "}
          <Code>subId2</Code> for that click only, and needs no extra API call.
        </Callout>
      </Section>

      <Section
        id="deep-links"
        title="Deep links"
        panel={
          <div className="space-y-3">
            <CodeBlock samples={REDIRECT_FLOW} />
            <CodeBlock samples={DEEP_LINK_ERROR} />
          </div>
        }
      >
        <P>
          By default a link lands on the merchant's campaign landing page.
          Passing <Code>destinationUrl</Code> sends the visitor to a specific
          product or collection instead, which converts materially better when
          you are reviewing one item.
        </P>

        <Sub>What the redirect does</Sub>
        <P>
          The <Code>/go</Code> endpoint is deliberately thin. It records the
          click asynchronously and issues a 302 immediately — there is no
          interstitial and no blocking work in the path.
        </P>

        <List
          items={[
            <>
              The URL must be on the program's <Code>merchantDomain</Code> —
              anything else returns <Code>422</Code> with{" "}
              <Code>destination_not_allowed</Code>.
            </>,
            <>
              Existing query parameters are preserved; we append our tracking
              parameters rather than replacing the query string.
            </>,
            <>
              Not every upstream network supports deep links. Check{" "}
              <Code>supportsDeepLinks</Code> on the program before relying on
              it — programs that do not will silently land on the default page.
            </>,
          ]}
        />
      </Section>
    </DocLayout>
  );
}

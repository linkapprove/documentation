import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { ApiRunner } from "@/components/api-runner";
import {
  Callout,
  Code,
  DocLink,
  Lead,
  List,
  P,
  Section,
  Sub,
} from "@/components/prose";
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
  "url": "https://go.linkapprove.com/k3Rm8Qw2Z",
  "destinationUrl": "https://northpeak.com/collections/shells",
  "status": "active",
  "clicks": 4180,
  "lastClickAt": "2026-08-18T11:07:35Z",
  "createdAt": "2026-08-18T09:41:02Z"
}`,
  },
];

const REDIRECT_FLOW = [
  {
    language: "http",
    label: "Redirect",
    code: `GET /k3Rm8Qw2Z HTTP/1.1
Host: go.linkapprove.com

HTTP/1.1 302 Found
Location: https://network.example/c/4821?pub=12&url=https%3A%2F%2Fnorthpeak.com%2Fcollections%2Fshells`,
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
      {
        "subId": "spring-guide",
        "clicks": 2840,
        "conversions": null,
        "conversionRate": null,
        "earnings": []
      },
      {
        "subId": "post-4471",
        "clicks": 1102,
        "conversions": null,
        "conversionRate": null,
        "earnings": []
      },
      {
        "subId": "sidebar-a",
        "clicks": 238,
        "conversions": null,
        "conversionRate": null,
        "earnings": []
      }
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
  "message": "destinationUrl must be an http(s) URL on northpeak.com",
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
    description:
      "LinkApprove's identifier for the link. It is not part of the URL.",
  },
  {
    name: "programId",
    type: "integer",
    description: "The program the link promotes.",
  },
  {
    name: "channelId",
    type: "integer",
    description: "The channel the link was minted for. Clicks attach to it.",
  },
  {
    name: "subId",
    type: "string | null",
    description: (
      <>
        Your own attribution tag, stored on the link. Group the performance
        report by <Code>subId</Code> to see its clicks.
      </>
    ),
  },
  {
    name: "subId2",
    type: "string | null",
    description:
      "A second, independent tag stored the same way. Useful for placement within a page.",
  },
  {
    name: "url",
    type: "string",
    description: (
      <>
        The link you place, <Code>https://go.linkapprove.com/{"{slug}"}</Code>{" "}
        where the slug is nine random letters and digits. This is the only URL a
        visitor should ever see.
      </>
    ),
  },
  {
    name: "destinationUrl",
    type: "string | null",
    description:
      "Where the redirect lands. Null when the link points at the merchant's default landing page.",
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>active</Code> or <Code>paused</Code>. A paused link stops
        redirecting.
      </>
    ),
  },
  {
    name: "clicks",
    type: "integer",
    description: "Total clicks recorded. Updated in batches every ten minutes.",
  },
  {
    name: "lastClickAt",
    type: "string | null",
    description:
      "ISO 8601 timestamp of the most recent click, or null if never clicked.",
  },
  {
    name: "createdAt",
    type: "string",
    description: "ISO 8601 timestamp of when the link was minted.",
  },
];

const LIST_PARAMS = [
  {
    name: "programId",
    type: "integer",
    description: "Only links for this program.",
  },
  {
    name: "channelId",
    type: "integer",
    description: "Only links for this channel.",
  },
  {
    name: "subId",
    type: "string",
    description: "Only links minted with exactly this sub ID.",
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>active</Code> or <Code>paused</Code>.
      </>
    ),
  },
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
      "The verified channel the traffic will come from. Clicks attach to it.",
  },
  {
    name: "subId",
    type: "string",
    description: (
      <>
        1–64 letters, digits, dashes and underscores (
        <Code>^[A-Za-z0-9_-]{"{1,64}"}$</Code>).
      </>
    ),
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
        An http(s) URL of at most 255 characters on the program's{" "}
        <Code>merchantDomain</Code> or a subdomain of it. Only for programs with{" "}
        <Code>supportsDeepLinks: true</Code>.
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
          and a channel you own. Clicks are counted per link.
        </Lead>

        <ParamsTable title="Fields" params={OBJECT_FIELDS} />

        <Callout variant="info" title="Conversions are not per link">
          Networks report conversions against your application for a program on
          a channel, not against an individual link, so the link object carries
          no conversions or commission. Read them from the{" "}
          <DocLink to="/reports#performance-report">performance report</DocLink>{" "}
          grouped by <Code>program</Code> or <Code>channel</Code>.
        </Callout>
      </Section>

      <Section
        id="create-a-link"
        title="Create a tracking link"
        panel={<ApiRunner endpoint={ENDPOINTS.createTrackingLink} />}
      >
        <Endpoint method="POST" path="/tracking-links" scope="links:write" />
        <P>
          Links are cheap and permanent. Mint one per placement rather than
          reusing a single link everywhere, so your click reporting can tell
          them apart.
        </P>

        <ParamsTable title="Body parameters" params={CREATE_PARAMS} />

        <Sub>Idempotent by content</Sub>
        <P>
          A new link returns <Code>201</Code>. If a link with the same{" "}
          <Code>programId</Code>, <Code>channelId</Code>,{" "}
          <Code>destinationUrl</Code>, <Code>subId</Code> and{" "}
          <Code>subId2</Code> already exists, you get that link back with{" "}
          <Code>200</Code> instead, so retrying a create never mints a
          duplicate.
        </P>

        <Sub>When it fails</Sub>
        <List
          items={[
            <>
              <Code>404</Code> <Code>program_not_found</Code>: no such program.
            </>,
            <>
              <Code>404</Code> <Code>channel_not_found</Code>: the channel does
              not exist or is not yours.
            </>,
            <>
              <Code>403</Code> <Code>channel_not_verified</Code>: the channel is
              not approved, or has a verification step it has not completed.
            </>,
            <>
              <Code>422</Code> <Code>destination_not_allowed</Code>: the program
              does not support deep links, or <Code>destinationUrl</Code> is off
              the merchant's domain. See Deep links below.
            </>,
          ]}
        />

        <Callout variant="warning" title="Approval is enforced here">
          Minting against a program with no approved application on that channel
          returns <Code>403</Code> with <Code>program_not_approved</Code>. Check{" "}
          <Code>status</Code> on the program with that <Code>channelId</Code>{" "}
          first, or apply and wait for the decision.
        </Callout>
      </Section>

      <Section
        id="sub-ids"
        title="Sub IDs and attribution"
        panel={<CodeBlock samples={SUBID_REPORT} />}
      >
        <P>
          <Code>subId</Code> and <Code>subId2</Code> are yours. We store them on
          the link and never interpret them. They are not sent to the network
          and are not attached to conversions; they exist so your click
          reporting can answer "which newsletter sent this traffic?" without
          guessing from link IDs.
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
              Group the{" "}
              <DocLink to="/reports#group-by">performance report</DocLink> by{" "}
              <Code>subId</Code> to see clicks sliced your way rather than ours.
            </>,
            <>
              Do not put anything personal in a sub ID. It shows up in reports.
            </>,
          ]}
        />

        <Callout variant="info" title="Sub IDs count clicks, not conversions">
          Sub IDs never reach the network, so conversions cannot be tied to
          them. A <Code>groupBy=subId</Code> row carries clicks only.{" "}
          <Code>conversions</Code> and <Code>conversionRate</Code> are{" "}
          <Code>null</Code> and <Code>earnings</Code> is empty.
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
          The redirect at <Code>go.linkapprove.com</Code> is deliberately thin.
          It records the click asynchronously and issues a 302 immediately.
          There is no interstitial and no blocking work in the path.
        </P>

        <List
          items={[
            <>
              The URL must be http(s) and on the program's{" "}
              <Code>merchantDomain</Code> or a subdomain of it. Anything else
              returns <Code>422</Code> with <Code>destination_not_allowed</Code>{" "}
              and the <Code>merchantDomain</Code> it expected.
            </>,
            <>
              Existing query parameters are preserved; we append our tracking
              parameters rather than replacing the query string.
            </>,
            <>
              Not every program supports deep links. Check{" "}
              <Code>supportsDeepLinks</Code> first. Passing a{" "}
              <Code>destinationUrl</Code> for a program that does not returns{" "}
              <Code>422</Code> <Code>destination_not_allowed</Code>. Omit it to
              land on the merchant's default page.
            </>,
          ]}
        />
      </Section>

      <Section
        id="list-links"
        title="List tracking links"
        panel={<ApiRunner endpoint={ENDPOINTS.listTrackingLinks} />}
      >
        <Endpoint method="GET" path="/tracking-links" scope="links:read" />
        <P>
          Returns the tracking links issued to you, newest first, including the
          ones minted in the dashboard, not only through the API.
        </P>

        <ParamsTable title="Query parameters" params={LIST_PARAMS} />

        <Callout variant="info" title="Click counts lag a little">
          <Code>clicks</Code> and <Code>lastClickAt</Code> are written in
          batches, so a click shows up within about ten minutes.
        </Callout>
      </Section>

      <Section
        id="retrieve-a-link"
        title="Retrieve a tracking link"
        panel={<ApiRunner endpoint={ENDPOINTS.retrieveTrackingLink} />}
      >
        <Endpoint method="GET" path="/tracking-links/{id}" scope="links:read" />
        <P>
          Returns one tracking link. A link that does not exist or is not yours
          returns <Code>404</Code> <Code>tracking_link_not_found</Code>.
        </P>
      </Section>
    </DocLayout>
  );
}

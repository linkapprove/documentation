import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { ApiRunner } from "@/components/api-runner";
import { Code, DocLink, Lead, List, P, Section, Sub } from "@/components/prose";
import { Endpoint, ParamsTable } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/channels");

const CHANNEL_OBJECT = [
  {
    language: "json",
    label: "Website",
    code: `{
  "id": 12,
  "name": "Trail Notes",
  "url": "https://trailnotes.example",
  "category": "content",
  "dailyPageViews": 1400,
  "status": "active",
  "verification": {
    "required": true,
    "verified": true,
    "metaTag": "<meta name=\\"linkapprove-verification\\" content=\\"5b0f2c9e-8a41-4d7e-9c3b-2f6e1d7a4c10\\">"
  },
  "createdAt": "2026-07-02T11:30:00Z"
}`,
  },
  {
    language: "json",
    label: "Social",
    code: `{
  "id": 31,
  "name": "Trail Notes on Instagram",
  "url": "https://instagram.com/trailnotes",
  "category": "social",
  "dailyPageViews": 900,
  "status": "pending",
  "verification": {
    "required": false,
    "verified": false,
    "metaTag": null
  },
  "createdAt": "2026-08-18T10:02:41Z"
}`,
  },
];

const VERIFY_ERRORS = [
  {
    language: "json",
    label: "422 verification_failed",
    code: `{
  "success": false,
  "message": "The verification meta tag was not found on the channel URL",
  "error": {
    "code": "verification_failed",
    "metaTag": "<meta name=\\"linkapprove-verification\\" content=\\"5b0f2c9e-8a41-4d7e-9c3b-2f6e1d7a4c10\\">"
  }
}`,
  },
  {
    language: "json",
    label: "409 verification_not_required",
    code: `{
  "success": false,
  "message": "This channel type does not need verification",
  "error": { "code": "verification_not_required" }
}`,
  },
];

const META_TAG = [
  {
    language: "html",
    label: "<head>",
    code: `<head>
  <meta charset="utf-8">
  <title>Trail Notes</title>
  <meta name="linkapprove-verification" content="5b0f2c9e-8a41-4d7e-9c3b-2f6e1d7a4c10">
</head>`,
  },
];

const OBJECT_FIELDS = [
  { name: "id", type: "integer", description: "The channel ID." },
  { name: "name", type: "string", description: "What you call the channel." },
  {
    name: "url",
    type: "string",
    description: "The site, newsletter archive or profile URL.",
  },
  {
    name: "category",
    type: "enum",
    description: (
      <>
        <Code>website</Code>, <Code>content</Code>, <Code>coupons_deals</Code>,{" "}
        <Code>email</Code>, <Code>social</Code> or <Code>other</Code>.
      </>
    ),
  },
  {
    name: "dailyPageViews",
    type: "integer | null",
    description: "The traffic estimate you submitted.",
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>pending</Code> until the LinkApprove team reviews it, then{" "}
        <Code>active</Code> or <Code>rejected</Code>. An active channel can
        later be <Code>paused</Code> or <Code>suspended</Code>.
      </>
    ),
  },
  {
    name: "verification.required",
    type: "boolean",
    description: (
      <>
        True for <Code>website</Code>, <Code>content</Code> and{" "}
        <Code>coupons_deals</Code>. Other categories are reviewed by hand
        instead.
      </>
    ),
  },
  {
    name: "verification.verified",
    type: "boolean",
    description: "Whether we have found the meta tag on the channel URL.",
  },
  {
    name: "verification.metaTag",
    type: "string | null",
    description: (
      <>
        The exact tag to place in the page's <Code>&lt;head&gt;</Code>. Null
        when no verification is required.
      </>
    ),
  },
  {
    name: "createdAt",
    type: "string",
    description: "When the channel was submitted.",
  },
];

const LIST_PARAMS = [
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>pending</Code>, <Code>active</Code>, <Code>rejected</Code>,{" "}
        <Code>paused</Code> or <Code>suspended</Code>.
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
    name: "name",
    type: "string",
    required: true,
    description: "1–255 characters.",
  },
  {
    name: "url",
    type: "string",
    required: true,
    description: "An http(s) URL, up to 255 characters.",
  },
  {
    name: "category",
    type: "enum",
    required: true,
    description: (
      <>
        <Code>website</Code>, <Code>content</Code>, <Code>coupons_deals</Code>,{" "}
        <Code>email</Code>, <Code>social</Code> or <Code>other</Code>.
      </>
    ),
  },
  {
    name: "dailyPageViews",
    type: "integer",
    required: true,
    description: "Your daily traffic estimate, 0 or more.",
  },
];

export default function Channels() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="the-channel-object"
        title="The channel object"
        panel={<CodeBlock samples={CHANNEL_OBJECT} />}
      >
        <Lead>
          A channel is a property your traffic comes from: a website, a
          newsletter or a social account. Applications and tracking links always
          belong to one.
        </Lead>

        <P>
          A channel can carry links once it is <Code>active</Code> and, when{" "}
          <Code>verification.required</Code> is true, verified. Until then,
          applying or minting a link with it returns <Code>403</Code>{" "}
          <Code>channel_not_verified</Code>.
        </P>

        <ParamsTable title="Fields" params={OBJECT_FIELDS} />
      </Section>

      <Section
        id="list-channels"
        title="List channels"
        panel={<ApiRunner endpoint={ENDPOINTS.listChannels} />}
      >
        <Endpoint method="GET" path="/channels" scope="channels:read" />
        <P>Returns your channels, newest first.</P>

        <ParamsTable title="Query parameters" params={LIST_PARAMS} />
      </Section>

      <Section
        id="retrieve-a-channel"
        title="Retrieve a channel"
        panel={<ApiRunner endpoint={ENDPOINTS.retrieveChannel} />}
      >
        <Endpoint method="GET" path="/channels/{id}" scope="channels:read" />
        <P>
          Returns one channel. A channel that does not exist or is not yours
          returns <Code>404</Code> <Code>channel_not_found</Code>.
        </P>
      </Section>

      <Section
        id="create-a-channel"
        title="Create a channel"
        panel={<ApiRunner endpoint={ENDPOINTS.createChannel} />}
      >
        <Endpoint method="POST" path="/channels" scope="channels:write" />
        <P>
          Submits a channel for review. It comes back <Code>pending</Code>, and
          the LinkApprove team approves or rejects it. Website, content and
          coupon channels also come back with the <Code>metaTag</Code> you need
          for <DocLink to="/channels#verify-a-channel">verification</DocLink>.
        </P>

        <ParamsTable title="Body parameters" params={CREATE_PARAMS} />

        <Sub>When it fails</Sub>
        <List
          items={[
            <>
              <Code>400</Code> <Code>Validation failed</Code>: a missing field,
              a URL that is not http(s), an unknown category or a negative{" "}
              <Code>dailyPageViews</Code>.
            </>,
            <>
              <Code>409</Code> <Code>duplicate_channel</Code>: a website,
              content or coupon channel for this hostname is already pending or
              active on LinkApprove. A leading <Code>www.</Code> is ignored.
            </>,
            <>
              <Code>403</Code> <Code>insufficient_scope</Code>: the key does not
              hold <Code>channels:write</Code>.
            </>,
          ]}
        />
      </Section>

      <Section
        id="verify-a-channel"
        title="Verify a channel"
        panel={
          <div className="space-y-3">
            <ApiRunner endpoint={ENDPOINTS.verifyChannel} />
            <CodeBlock samples={VERIFY_ERRORS} />
          </div>
        }
      >
        <Endpoint
          method="POST"
          path="/channels/{id}/verify"
          scope="channels:write"
        />
        <P>
          Proves you control the site. Put the channel's{" "}
          <Code>verification.metaTag</Code> in the <Code>&lt;head&gt;</Code> of
          the page at its <Code>url</Code>, deploy, then call this endpoint. We
          fetch the page and look for the tag.
        </P>

        <CodeBlock samples={META_TAG} />

        <Sub>How the check runs</Sub>
        <List
          items={[
            <>
              We request the channel URL over http or https on the default port,
              follow up to three redirects, wait up to five seconds and read the
              first megabyte.
            </>,
            <>
              Pages on private or internal addresses are never fetched and
              always fail.
            </>,
            <>
              Calling it on a channel that is already verified returns the
              channel without fetching again.
            </>,
            <>
              Verifying does not approve the channel. <Code>status</Code> still
              waits for the LinkApprove team.
            </>,
          ]}
        />

        <Sub>When it fails</Sub>
        <List
          items={[
            <>
              <Code>422</Code> <Code>verification_failed</Code>: the page could
              not be fetched or the tag was not in it. The error carries the
              exact <Code>metaTag</Code> to compare against.
            </>,
            <>
              <Code>409</Code> <Code>verification_not_required</Code>: email,
              social and other channels have no verification step.
            </>,
            <>
              <Code>404</Code> <Code>channel_not_found</Code>: no such channel
              on your account.
            </>,
          ]}
        />
      </Section>
    </DocLayout>
  );
}

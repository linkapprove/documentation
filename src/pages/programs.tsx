import { DocLayout } from "@/components/doc-layout";
import { CodeBlock } from "@/components/code-block";
import { ApiRunner } from "@/components/api-runner";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { Endpoint, ParamsTable } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { RATE_LIMIT_PER_MINUTE, pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/programs");

const PROGRAM_OBJECT = [
  {
    language: "json",
    label: "Program",
    code: `{
  "id": 4821,
  "merchantName": "Northpeak Outdoors",
  "merchantDomain": "northpeak.com",
  "category": "sports_outdoors",
  "payoutType": "cps",
  "payout": "8.00",
  "payoutUnit": "percent",
  "currency": "USD",
  "cookieDays": 30,
  "approvalType": "manual",
  "status": "approved",
  "supportsDeepLinks": true,
  "description": "Technical outerwear and camping gear.",
  "regions": ["US", "CA"],
  "logoUrl": "https://cdn.linkapprove.com/merchants/4821.png"
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
    type: "string | null",
    description: "The brand as the merchant wants it displayed.",
  },
  {
    name: "merchantDomain",
    type: "string | null",
    description:
      "The merchant's site, without www. Deep links must stay on it or a subdomain of it.",
  },
  {
    name: "category",
    type: "string",
    description: (
      <>
        The program's LinkApprove category as a lowercase slug, e.g.{" "}
        <Code>sports_outdoors</Code>. Always one of the values listed under the{" "}
        <Code>category</Code> filter; <Code>other</Code> when unclassified.
      </>
    ),
  },
  {
    name: "payoutType",
    type: "enum",
    description: (
      <>
        <Code>cps</Code> pays a share of the sale, <Code>cpc</Code> pays per
        click.
      </>
    ),
  },
  {
    name: "payout",
    type: "string | null",
    description: (
      <>
        The most you can earn: the program's highest commission tier with
        LinkApprove's cut already taken off, so it is your 70% share of the
        network's rate. A two-decimal string such as <Code>"8.00"</Code>, read
        together with <Code>payoutUnit</Code>. Null when the network publishes
        no rate.
      </>
    ),
  },
  {
    name: "payoutUnit",
    type: "enum | null",
    description: (
      <>
        <Code>percent</Code> for a revenue share, <Code>fixed</Code> for a flat
        amount. Null when the network does not say which.
      </>
    ),
  },
  {
    name: "currency",
    type: "string | null",
    description:
      "Currency of the payout, when the network states one; null otherwise. ISO 4217, e.g. USD.",
  },
  {
    name: "cookieDays",
    type: "integer | null",
    description:
      "Attribution window in days. A conversion inside it credits your click. Null when the network does not say.",
  },
  {
    name: "approvalType",
    type: "enum | null",
    description: (
      <>
        <Code>auto</Code> approves the instant you apply; <Code>manual</Code>{" "}
        goes to the LinkApprove team for review. Null when the network does not
        say.
      </>
    ),
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        Your application state for this program: <Code>not_applied</Code>,{" "}
        <Code>pending</Code>, <Code>approved</Code>, <Code>rejected</Code>,{" "}
        <Code>paused</Code>, <Code>suspended</Code> or <Code>expired</Code>.
        Scoped to <Code>channelId</Code> when you pass it.
      </>
    ),
  },
  {
    name: "supportsDeepLinks",
    type: "boolean",
    description:
      "Whether a tracking link for this program accepts a destinationUrl.",
  },
  {
    name: "description",
    type: "string | null",
    description: "Retrieve only. The merchant's own pitch.",
  },
  {
    name: "regions",
    type: "string[]",
    description:
      "Retrieve only. ISO 3166-1 alpha-2 codes the merchant ships or converts in.",
  },
  {
    name: "logoUrl",
    type: "string | null",
    description: "Retrieve only. The merchant's logo.",
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
    description: "Matches merchant name or domain.",
  },
  {
    name: "category",
    type: "string",
    description: (
      <>
        One LinkApprove category as a lowercase slug. The full set is 
        <Code>clothing_apparel, jewelry_luxury, department_stores_marketplaces, gifts_parties, home_garden, tools_home_improvement, pets, baby_kids, toys_games, computers_electronics, software_saas, internet_web_services, telecom_mobile, health_beauty, healthcare_pharmacy, fitness_nutrition, food_drinks, wine_spirits, travel, hotels_accommodation, transportation_car_rental, automotive, sports_outdoors, financial_services, banking_cards, loans_credit, investing_trading, insurance, real_estate, utilities_energy, business, education_courses, jobs_careers, video_games, arts_crafts_hobbies, books_magazines, media_entertainment, services_tickets, adult, dating, gambling_betting, tobacco_vaping, other</Code>.
      </>
    ),
  },
  {
    name: "payoutType",
    type: "enum",
    description: (
      <>
        <Code>cps</Code> or <Code>cpc</Code>.
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
    name: "channelId",
    type: "integer",
    description: (
      <>
        Report <Code>status</Code> for this channel. Without it,{" "}
        <Code>status</Code> is the best state across all your channels.
      </>
    ),
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        Only programs in this state: <Code>not_applied</Code>,{" "}
        <Code>pending</Code>, <Code>approved</Code>, <Code>rejected</Code>,{" "}
        <Code>paused</Code>, <Code>suspended</Code> or <Code>expired</Code>.
        Matches the <Code>status</Code> each program comes back with, so it
        follows <Code>channelId</Code> too.
      </>
    ),
  },
];

const APPLICATION_LIST_PARAMS = [
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>pending</Code>, <Code>approved</Code>, <Code>rejected</Code>,{" "}
        <Code>paused</Code>, <Code>suspended</Code> or <Code>expired</Code>.
      </>
    ),
  },
  {
    name: "programId",
    type: "integer",
    description: "Only applications to this program.",
  },
  {
    name: "channelId",
    type: "integer",
    description: "Only applications from this channel.",
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
      "An approved channel of yours that has completed verification. Applications are per channel, not per account.",
  },
  {
    name: "note",
    type: "string",
    description:
      "Optional, up to 500 characters. Accepted for forward compatibility but not stored. Nobody reads it today.",
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
          A program is a merchant campaign as LinkApprove presents it: the
          upstream network's terms, normalised into one shape so you do not care
          which network it came from.
        </Lead>

        <ParamsTable title="Fields" params={OBJECT_FIELDS} />

        <Callout variant="info" title="status is about you, not the merchant">
          <Code>status</Code> reflects your application state for the program on
          your channels, not whether the campaign itself is live. A program that
          is removed or deactivated stops appearing in the list, and retrieving
          it returns <Code>404</Code>.
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
              <Code>page</Code> up to it. Do not guess at an end.
            </>,
            <>
              Use <Code>size=100</Code> for a full sync. A 13,700-campaign
              catalogue is 137 requests. At {RATE_LIMIT_PER_MINUTE} a minute
              that takes just over a minute, so pace your requests or expect a{" "}
              <Code>429</Code> and honour its <Code>Retry-After</Code>.
            </>,
            <>
              Pagination is offset-based, newest first. Programs added or
              removed while you sync shift rows between pages, so a row can
              repeat or be skipped, so dedupe by <Code>id</Code>.
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
          Returns a single program with the same fields as a list entry, plus{" "}
          <Code>description</Code>, <Code>regions</Code> and{" "}
          <Code>logoUrl</Code>. Pass <Code>channelId</Code> to scope{" "}
          <Code>status</Code> to one channel.
        </P>
        <P>
          An unknown or unavailable ID returns <Code>404</Code> with{" "}
          <Code>program_not_found</Code>. We do not distinguish "does not exist"
          from "not yours". Both are a 404.
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
              with <Code>decidedAt</Code> equal to <Code>appliedAt</Code>, and
              you can mint links in the same script run.
            </>,
            <>
              <Code>approvalType: "manual"</Code> comes back{" "}
              <Code>pending</Code> with <Code>decidedAt: null</Code> while the
              LinkApprove team reviews it. Poll{" "}
              <Code>GET /programs/{"{id}"}?channelId=</Code> until{" "}
              <Code>status</Code> changes.
            </>,
            <>
              <Code>rejectionReason</Code> is always <Code>null</Code> for now.
            </>,
            <>
              Applying again for the same program and channel returns{" "}
              <Code>409</Code> <Code>duplicate_application</Code> with the
              existing <Code>applicationId</Code> and its <Code>status</Code>,
              whatever that status is, rejected included.
            </>,
          ]}
        />

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
          ]}
        />

        <Callout variant="warning" title="A rejection is final through the API">
          There is no way to apply again to a program on a channel that already
          has an application, rejected or not. Contact support if you think a
          rejection should be reconsidered.
        </Callout>
      </Section>

      <Section
        id="list-applications"
        title="List applications"
        panel={<ApiRunner endpoint={ENDPOINTS.listApplications} />}
      >
        <Endpoint
          method="GET"
          path="/programs/applications"
          scope="programs:read"
        />
        <P>
          Returns every application you have made, newest first, across all your
          channels. Use it to pick up decisions on manual programs in one call
          instead of polling each program.
        </P>

        <ParamsTable
          title="Query parameters"
          params={APPLICATION_LIST_PARAMS}
        />

        <P>
          Each row is the application object you got back when applying, plus{" "}
          <Code>merchantName</Code>. <Code>decidedAt</Code> is when the
          application left <Code>pending</Code>, or <Code>null</Code> while it
          is still waiting.
        </P>
      </Section>
    </DocLayout>
  );
}

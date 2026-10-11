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

const PAGE = pageByPath("/reports");

const ROW_OBJECT = [
  {
    language: "json",
    label: "program",
    code: `{
  "programId": 4821,
  "merchantName": "Northpeak Outdoors",
  "clicks": 4180,
  "conversions": 96,
  "conversionRate": 2.3,
  "earnings": [
    { "currency": "USD", "commission": "742.18", "pending": "210.40" },
    { "currency": "CAD", "commission": "58.90", "pending": "0.00" }
  ]
}`,
  },
  {
    language: "json",
    label: "channel",
    code: `{
  "channelId": 12,
  "channelName": "Trail Notes",
  "clicks": 6312,
  "conversions": 141,
  "conversionRate": 2.2,
  "earnings": [
    { "currency": "USD", "commission": "1094.55", "pending": "302.10" }
  ]
}`,
  },
  {
    language: "json",
    label: "day",
    code: `{
  "date": "2026-08-01",
  "clicks": 233,
  "conversions": 0,
  "conversionRate": 0,
  "earnings": []
}`,
  },
  {
    language: "json",
    label: "subId",
    code: `{
  "subId": "spring-guide",
  "clicks": 2840,
  "conversions": null,
  "conversionRate": null,
  "earnings": []
}`,
  },
];

const DAY_REPORT = [
  {
    language: "json",
    label: "groupBy=day",
    code: `{
  "success": true,
  "message": "Report fetched",
  "data": {
    "data": [
      {
        "date": "2026-08-01",
        "clicks": 233,
        "conversions": 4,
        "conversionRate": 1.7,
        "earnings": [
          { "currency": "USD", "commission": "31.20", "pending": "12.75" }
        ]
      },
      {
        "date": "2026-08-02",
        "clicks": 0,
        "conversions": 1,
        "conversionRate": null,
        "earnings": [
          { "currency": null, "commission": "0.00", "pending": "6.30" }
        ]
      }
    ],
    "count": 2,
    "pages": 1
  }
}`,
  },
];

const VALIDATION_ERROR = [
  {
    language: "json",
    label: "400 Validation failed",
    code: `{
  "success": false,
  "message": "Validation failed",
  "error": [
    {
      "field": "endDate",
      "code": "invalid_format",
      "message": "The range may cover at most 180 days"
    }
  ]
}`,
  },
];

const ROW_FIELDS = [
  {
    name: "programId",
    type: "integer",
    description: (
      <>
        <Code>groupBy=program</Code> only, alongside <Code>merchantName</Code>{" "}
        (string | null).
      </>
    ),
  },
  {
    name: "channelId",
    type: "integer",
    description: (
      <>
        <Code>groupBy=channel</Code> only, alongside <Code>channelName</Code>{" "}
        (string | null).
      </>
    ),
  },
  {
    name: "date",
    type: "string",
    description: (
      <>
        <Code>groupBy=day</Code> only. A UTC day as <Code>YYYY-MM-DD</Code>.
      </>
    ),
  },
  {
    name: "subId",
    type: "string | null",
    description: (
      <>
        <Code>groupBy=subId</Code> only. Null collects clicks on links minted
        without a sub ID.
      </>
    ),
  },
  {
    name: "clicks",
    type: "integer",
    description: "Clicks recorded in the range.",
  },
  {
    name: "conversions",
    type: "integer | null",
    description: (
      <>
        Conversions reported in the range, rejected ones excluded. Null for{" "}
        <Code>groupBy=subId</Code>.
      </>
    ),
  },
  {
    name: "conversionRate",
    type: "number | null",
    description: (
      <>
        <Code>conversions</Code> as a percentage of <Code>clicks</Code>, rounded
        to one decimal, so <Code>2.3</Code> means 2.3%. Null when the row has no
        clicks, and always null for <Code>groupBy=subId</Code>.
      </>
    ),
  },
  {
    name: "earnings",
    type: "object[]",
    description: (
      <>
        One entry per currency, never summed across currencies. Empty when the
        row has no conversions.
      </>
    ),
  },
  {
    name: "earnings[].currency",
    type: "string | null",
    description:
      "ISO 4217 code the network reported the commission in. Null when the network did not say.",
  },
  {
    name: "earnings[].commission",
    type: "string",
    description: (
      <>
        What you have earned: conversions that are <Code>approved</Code>,{" "}
        <Code>available</Code> or <Code>ready_for_payout</Code>. A two-decimal
        string.
      </>
    ),
  },
  {
    name: "earnings[].pending",
    type: "string",
    description: (
      <>
        Conversions that are still <Code>pending</Code>, reported by the network
        but not yet approved. A two-decimal string.
      </>
    ),
  },
];

const QUERY_PARAMS = [
  {
    name: "startDate",
    type: "string",
    required: true,
    description: (
      <>
        Start of the range as <Code>YYYY-MM-DD</Code>, inclusive.
      </>
    ),
  },
  {
    name: "endDate",
    type: "string",
    required: true,
    description: (
      <>
        End of the range as <Code>YYYY-MM-DD</Code>, inclusive. On or after{" "}
        <Code>startDate</Code>, and the range may cover at most 180 days.
      </>
    ),
  },
  {
    name: "groupBy",
    type: "enum",
    description: (
      <>
        <Code>program</Code>, <Code>channel</Code>, <Code>day</Code> or{" "}
        <Code>subId</Code>. Defaults to <Code>program</Code>.
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
    description: "Rows per page, 1–100. Defaults to 10.",
  },
];

export default function Reports() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="the-report-row"
        title="The report row"
        panel={<CodeBlock samples={ROW_OBJECT} />}
      >
        <Lead>
          A report row is one slice of your traffic for a date range (a program,
          a channel, a day or a sub ID) with its clicks, conversions and
          earnings.
        </Lead>

        <P>
          Every row has <Code>clicks</Code>, <Code>conversions</Code>,{" "}
          <Code>conversionRate</Code> and <Code>earnings</Code>. The key fields
          in front of them depend on <Code>groupBy</Code>.
        </P>

        <ParamsTable title="Fields" params={ROW_FIELDS} />

        <Callout variant="info" title="Money stays in its own currency">
          A program that pays in two currencies returns two{" "}
          <Code>earnings</Code> entries. Convert them yourself if you need one
          total. We never add USD to CAD.
        </Callout>
      </Section>

      <Section
        id="performance-report"
        title="Performance report"
        panel={
          <div className="space-y-3">
            <ApiRunner endpoint={ENDPOINTS.performanceReport} />
            <CodeBlock samples={VALIDATION_ERROR} />
          </div>
        }
      >
        <Endpoint
          method="GET"
          path="/reports/performance"
          scope="reports:read"
        />
        <P>
          Returns a paginated list of report rows for your account across every
          channel. Only programs you have applied to on one of your channels
          contribute.
        </P>

        <ParamsTable title="Query parameters" params={QUERY_PARAMS} />

        <Sub>When it fails</Sub>
        <List
          items={[
            <>
              <Code>400</Code> <Code>startDate is required</Code> or{" "}
              <Code>endDate is required</Code>: both dates are mandatory.
            </>,
            <>
              <Code>400</Code> <Code>startDate must be YYYY-MM-DD</Code> or{" "}
              <Code>startDate is not a real date</Code>: the same two checks
              apply to <Code>endDate</Code>.
            </>,
            <>
              <Code>400</Code> <Code>endDate must not be before startDate</Code>{" "}
              or <Code>The range may cover at most 180 days</Code>: reported
              against <Code>endDate</Code>. Split a longer period into several
              requests.
            </>,
            <>
              <Code>400</Code> <Code>groupBy is invalid</Code>: anything other
              than the four groupings.
            </>,
            <>
              <Code>403</Code> <Code>insufficient_scope</Code>: the key does not
              hold <Code>reports:read</Code>.
            </>,
          ]}
        />
      </Section>

      <Section
        id="group-by"
        title="Grouping"
        panel={<CodeBlock samples={DAY_REPORT} />}
      >
        <P>
          <Code>groupBy</Code> decides what a row is. Each grouping puts its own
          key in front of the common fields.
        </P>

        <List
          items={[
            <>
              <Code>program</Code>: <Code>programId</Code> and{" "}
              <Code>merchantName</Code>. The default.
            </>,
            <>
              <Code>channel</Code>: <Code>channelId</Code> and{" "}
              <Code>channelName</Code>.
            </>,
            <>
              <Code>day</Code>: <Code>date</Code>, one row per UTC day that had
              a click or a conversion. Clicks count on the day they happened,
              conversions on the date the network reported for them.
            </>,
            <>
              <Code>subId</Code>: <Code>subId</Code> from the tracking link.
              Clicks only: sub IDs are not sent to networks, so{" "}
              <Code>conversions</Code> and <Code>conversionRate</Code> are{" "}
              <Code>null</Code> and <Code>earnings</Code> is empty. See{" "}
              <DocLink to="/tracking-links#sub-ids">
                Sub IDs and attribution
              </DocLink>
              .
            </>,
          ]}
        />

        <Sub>Ordering</Sub>
        <P>
          <Code>day</Code> rows come back oldest first. Every other grouping is
          sorted by <Code>clicks</Code>, highest first. Days with no activity
          are not filled in, so a gap in the dates means nothing happened.
        </P>
      </Section>

      <Section id="data-freshness" title="Data freshness">
        <List
          items={[
            <>
              Clicks are written in batches, so they show up within about ten
              minutes.
            </>,
            <>
              Conversions appear as networks report them, and move from{" "}
              <Code>pending</Code> into <Code>commission</Code> as networks
              approve them. Yesterday's numbers can still change.
            </>,
            <>
              A conversion the network rejects drops out of{" "}
              <Code>conversions</Code> and out of both earnings figures.
            </>,
          ]}
        />

        <Callout variant="tip" title="Re-pull recent days">
          If you mirror reports into your own store, re-fetch the last few weeks
          on every run rather than only the newest day, so late approvals and
          rejections land.
        </Callout>
      </Section>
    </DocLayout>
  );
}

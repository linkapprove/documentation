import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
} from "@/components/prose";
import { Endpoint } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { API_BASE_URL, API_KEYS_URL, pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/quickstart");

const EXPORT_KEY = [
  {
    language: "bash",
    label: "Shell",
    code: `export LINKAPPROVE_API_KEY="la_9f2c4a71e8b350d6c1f4a7e2b8d90c53"

curl ${API_BASE_URL}/programs \\
  -H "Authorization: Bearer $LINKAPPROVE_API_KEY"`,
  },
  {
    language: "bash",
    label: ".env",
    code: `# never commit this file
LINKAPPROVE_API_KEY=la_9f2c4a71e8b350d6c1f4a7e2b8d90c53`,
  },
];

const NEXT_LINKS = [
  {
    to: "/authentication",
    title: "Harden the key",
    body: "Scopes, expiry, IP allowlists and rotation.",
  },
  {
    to: "/tracking-links",
    title: "Deep links & sub IDs",
    body: "Send traffic to a product page, not a homepage.",
  },
  {
    to: "/programs",
    title: "Program reference",
    body: "Every field, filter and application state.",
  },
  {
    to: "/errors",
    title: "Failure modes",
    body: "Status codes, error codes and back-off.",
  },
];

const STEPS = [
  { id: "create-a-key", label: "Create a key" },
  { id: "find-a-program", label: "Find a program" },
  { id: "mint-a-link", label: "Mint a link" },
  { id: "read-the-numbers", label: "Read the numbers" },
];

export default function Quickstart() {
  return (
    <DocLayout page={PAGE}>
      <div className="flex flex-wrap items-center gap-2">
        {STEPS.map((step, index) => (
          <a
            key={step.id}
            href={`#${step.id}`}
            className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-subtle transition-colors hover:border-accent/40 hover:text-accent"
          >
            <span className="font-mono text-[0.6875rem] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step.label}
          </a>
        ))}
      </div>

      <Section
        id="create-a-key"
        title="Create a key"
        panel={<CodeBlock samples={EXPORT_KEY} />}
      >
        <Lead>
          Keys live in the publisher dashboard under{" "}
          <a
            href={API_KEYS_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-4"
          >
            Account → API Keys
          </a>
          . Give the key a name, pick its scopes, and copy the secret. It is
          shown exactly once.
        </Lead>

        <P>
          For this walkthrough choose custom scopes rather than a preset, and
          grant four: <Code>programs:read</Code>, <Code>programs:write</Code>,{" "}
          <Code>links:write</Code> and <Code>reports:read</Code>.
        </P>

        <Callout variant="warning" title="Keep it out of your repo">
          A key is a bearer credential. Anyone holding it acts as you, inside
          its scopes. Read it from the environment, never from source, and never
          ship it to a browser.
        </Callout>

        <Callout variant="tip" title="Paste it into the runners below">
          Every endpoint on this site has a <em>Try it</em> panel. Paste your
          key into any one of them and it is reused across the whole site for
          this browser tab, and it is filled into the code samples so you can
          copy a working request.
        </Callout>
      </Section>

      <Section
        id="find-a-program"
        title="Find a program"
        panel={<ApiRunner endpoint={ENDPOINTS.listPrograms} />}
      >
        <P>
          Programs are the merchant campaigns you can promote. Filter the
          catalogue down to something you would actually place, like a category
          you write about, on a payout model you like.
        </P>

        <Endpoint method="GET" path="/programs" scope="programs:read" />

        <P>
          You get back a paginated envelope. Note the <Code>id</Code> on the
          program you want. That is what a tracking link is minted against.
        </P>

        <Callout variant="info" title="Approval comes first">
          Every program needs an approved application on your channel before you
          can mint links against it. <Code>approvalType: "auto"</Code> approves
          the moment you apply; <Code>"manual"</Code> is reviewed by the
          LinkApprove team first. See{" "}
          <Link
            to="/programs#apply-to-a-program"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-4"
          >
            Apply to a program
          </Link>
          .
        </Callout>
      </Section>

      <Section
        id="mint-a-link"
        title="Mint a tracking link"
        panel={<ApiRunner endpoint={ENDPOINTS.createTrackingLink} />}
      >
        <P>
          A tracking link ties three things together: an approved program, one
          of your verified channels, and an optional <Code>subId</Code> you use
          to tell placements apart in reporting.
        </P>

        <Endpoint method="POST" path="/tracking-links" scope="links:write" />

        <P>
          <Code>url</Code> in the response is the link you place. A visitor
          clicking it hits our redirect, gets logged, and lands on the merchant
          with your attribution attached. Calling it again with the same inputs
          returns the same link with <Code>200</Code>.
        </P>
      </Section>

      <Section
        id="read-the-numbers"
        title="Read the numbers"
        panel={<ApiRunner endpoint={ENDPOINTS.performanceReport} />}
      >
        <P>
          Clicks appear within about ten minutes. Conversions arrive when the
          upstream network reports them: in real time for networks that post
          back, and on a six-hour pull for the rest.
        </P>

        <Endpoint
          method="GET"
          path="/reports/performance"
          scope="reports:read"
        />

        <List
          items={[
            <>
              Money sits in <Code>earnings</Code>, one entry per currency and
              never summed across currencies. In each entry{" "}
              <Code>commission</Code> is what you have earned and{" "}
              <Code>pending</Code> is reported by the network but not yet
              approved.
            </>,
            <>
              Group by <Code>program</Code> (the default), <Code>channel</Code>,{" "}
              <Code>day</Code> or <Code>subId</Code>. A <Code>subId</Code>{" "}
              grouping reports clicks only.
            </>,
            <>
              Ranges are inclusive <Code>YYYY-MM-DD</Code> dates, capped at 180
              days per request.
            </>,
          ]}
        />

        <P>
          Every row field and grouping is described in the{" "}
          <DocLink to="/reports">Reports reference</DocLink>.
        </P>
      </Section>

      <Section id="next-steps" title="Next steps">
        <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          {NEXT_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-ink group-hover:text-accent">
                {link.title}
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </span>
              <span className="text-[0.8125rem] leading-snug text-subtle">
                {link.body}
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </DocLayout>
  );
}

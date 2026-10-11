import { DocLayout } from "@/components/doc-layout";
import { ApiRunner } from "@/components/api-runner";
import { Callout, Code, Lead, List, P, Section, Sub } from "@/components/prose";
import { Endpoint, ParamsTable } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/payments");

const BALANCE_FIELDS = [
  {
    name: "pending",
    type: "string",
    description:
      "Commission on conversions the network has reported but not approved yet. It can still be rejected.",
  },
  {
    name: "awaiting",
    type: "string",
    description:
      "Commission the network has approved that has not been credited to your balance yet.",
  },
  {
    name: "available",
    type: "string",
    description: "Credited to your balance and not yet withdrawn.",
  },
  {
    name: "withdrawals.pending",
    type: "string",
    description:
      "Withdrawals you have requested that nobody has picked up yet.",
  },
  {
    name: "withdrawals.processing",
    type: "string",
    description: "Withdrawals being paid out right now.",
  },
  {
    name: "withdrawals.paid",
    type: "string",
    description: "Everything paid out to you, all time.",
  },
];

const TRANSACTION_FIELDS = [
  { name: "id", type: "integer", description: "The transaction ID." },
  { name: "amount", type: "string", description: "The credited amount." },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>credited</Code> means it is in your available balance.{" "}
        <Code>withdrawn</Code> means a withdrawal included it.
      </>
    ),
  },
  {
    name: "withdrawalId",
    type: "integer | null",
    description: "The withdrawal that paid it out. Null while credited.",
  },
  {
    name: "programId",
    type: "integer | null",
    description: (
      <>
        The program the commission came from, alongside{" "}
        <Code>merchantName</Code>.
      </>
    ),
  },
  {
    name: "createdAt",
    type: "string",
    description: "When it was credited.",
  },
];

const TRANSACTION_PARAMS = [
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>credited</Code> or <Code>withdrawn</Code>.
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

const WITHDRAWAL_FIELDS = [
  { name: "id", type: "integer", description: "The withdrawal ID." },
  { name: "amount", type: "string", description: "What you requested." },
  { name: "fees", type: "string", description: "Payout fees deducted." },
  {
    name: "netAmount",
    type: "string",
    description: (
      <>
        <Code>amount</Code> minus <Code>fees</Code>, which is what reaches you.
      </>
    ),
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>pending</Code>, <Code>processing</Code>, <Code>paid</Code>,{" "}
        <Code>failed</Code> or <Code>cancelled</Code>.
      </>
    ),
  },
  {
    name: "paymentMethod",
    type: "object | null",
    description: (
      <>
        <Code>type</Code> (<Code>paypal</Code>, <Code>payoneer</Code>,{" "}
        <Code>bank_transfer</Code> or <Code>crypto</Code>) and a masked{" "}
        <Code>destination</Code>.
      </>
    ),
  },
  {
    name: "transactionReference",
    type: "string | null",
    description: "The payment provider's reference, once paid.",
  },
  {
    name: "invoiceUrl",
    type: "string | null",
    description:
      "A link to the PDF invoice, once paid. Treat it as opaque, since the host can change.",
  },
  {
    name: "statusHistory",
    type: "object[]",
    description: (
      <>
        Every <Code>status</Code> the withdrawal has been in, oldest first, with
        its <Code>timestamp</Code>.
      </>
    ),
  },
  {
    name: "createdAt",
    type: "string",
    description: "When you requested it.",
  },
];

const WITHDRAWAL_PARAMS = [
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>pending</Code>, <Code>processing</Code>, <Code>paid</Code>,{" "}
        <Code>failed</Code> or <Code>cancelled</Code>.
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

export default function Payments() {
  return (
    <DocLayout page={PAGE}>
      <Section id="how-money-moves" title="How money moves">
        <Lead>
          Commission travels through four stages before it reaches your bank,
          and the balance endpoint shows how much sits in each.
        </Lead>

        <List
          items={[
            <>
              <strong className="font-medium text-ink">Pending</strong>: a
              network reports a conversion. It can still be rejected.
            </>,
            <>
              <strong className="font-medium text-ink">Awaiting</strong>: the
              network approves it, and it waits to be credited to your balance.
            </>,
            <>
              <strong className="font-medium text-ink">Available</strong>: the
              commission is credited to your balance as a transaction.
            </>,
            <>
              <strong className="font-medium text-ink">Withdrawn</strong>: you
              request a withdrawal in the dashboard, and it moves from{" "}
              <Code>pending</Code> to <Code>processing</Code> to{" "}
              <Code>paid</Code>.
            </>,
          ]}
        />

        <Callout variant="info" title="Read-only, on purpose">
          The API can read every stage but cannot move money. Withdrawals are
          requested in the dashboard. Amounts here are your LinkApprove balance
          and carry no currency field.
        </Callout>
      </Section>

      <Section
        id="retrieve-balance"
        title="Retrieve your balance"
        panel={<ApiRunner endpoint={ENDPOINTS.retrieveBalance} />}
      >
        <Endpoint method="GET" path="/payments/balance" scope="payments:read" />
        <P>
          Returns the totals at each stage. Every figure is a two-decimal
          string.
        </P>

        <ParamsTable title="Fields" params={BALANCE_FIELDS} />
      </Section>

      <Section
        id="list-transactions"
        title="List transactions"
        panel={<ApiRunner endpoint={ENDPOINTS.listTransactions} />}
      >
        <Endpoint
          method="GET"
          path="/payments/transactions"
          scope="payments:read"
        />
        <P>
          Returns every commission credited to your balance, newest first. A
          transaction stays <Code>credited</Code> until a withdrawal includes
          it.
        </P>

        <ParamsTable title="Query parameters" params={TRANSACTION_PARAMS} />
        <ParamsTable title="Fields" params={TRANSACTION_FIELDS} />
      </Section>

      <Section
        id="list-withdrawals"
        title="List withdrawals"
        panel={<ApiRunner endpoint={ENDPOINTS.listWithdrawals} />}
      >
        <Endpoint method="GET" path="/withdrawals" scope="payments:read" />
        <P>Returns your withdrawals, newest first.</P>

        <ParamsTable title="Query parameters" params={WITHDRAWAL_PARAMS} />
        <ParamsTable title="Fields" params={WITHDRAWAL_FIELDS} />

        <Sub>Payout destinations are masked</Sub>
        <P>
          An email shows its first letter and domain (
          <Code>j•••@example.com</Code>
          ), and account numbers and wallet addresses show their last four
          characters (<Code>•••• 4821</Code>). Full details never leave the
          dashboard.
        </P>
      </Section>

      <Section
        id="retrieve-a-withdrawal"
        title="Retrieve a withdrawal"
        panel={<ApiRunner endpoint={ENDPOINTS.retrieveWithdrawal} />}
      >
        <Endpoint method="GET" path="/withdrawals/{id}" scope="payments:read" />
        <P>
          Returns one withdrawal. A withdrawal that does not exist or is not
          yours returns <Code>404</Code> <Code>withdrawal_not_found</Code>.
        </P>
      </Section>
    </DocLayout>
  );
}

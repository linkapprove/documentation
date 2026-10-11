import { DocLayout } from "@/components/doc-layout";
import { ApiRunner } from "@/components/api-runner";
import { Callout, Code, Lead, P, Section } from "@/components/prose";
import { Endpoint, ParamsTable } from "@/components/endpoint";
import { ENDPOINTS } from "@/constants/endpoints";
import { pageByPath } from "@/constants/navigation";

const PAGE = pageByPath("/account");

const ACCOUNT_FIELDS = [
  { name: "id", type: "integer", description: "Your publisher ID." },
  { name: "username", type: "string", description: "Your login name." },
  {
    name: "firstName",
    type: "string | null",
    description: (
      <>
        Alongside <Code>lastName</Code>.
      </>
    ),
  },
  { name: "email", type: "string", description: "Your account email." },
  {
    name: "emailVerified",
    type: "boolean | null",
    description: "Whether you have confirmed that email.",
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        Always <Code>active</Code> here. Keys on any other account are refused
        with <Code>401</Code> before they reach an endpoint.
      </>
    ),
  },
  {
    name: "createdAt",
    type: "string",
    description: "When you signed up.",
  },
];

const METHOD_FIELDS = [
  { name: "id", type: "integer", description: "The payment method ID." },
  {
    name: "type",
    type: "enum",
    description: (
      <>
        <Code>paypal</Code>, <Code>payoneer</Code>, <Code>bank_transfer</Code>{" "}
        or <Code>crypto</Code>.
      </>
    ),
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>pending</Code> until the LinkApprove team approves it, then{" "}
        <Code>active</Code>, <Code>rejected</Code>, <Code>paused</Code> or{" "}
        <Code>suspended</Code>.
      </>
    ),
  },
  {
    name: "isDefault",
    type: "boolean | null",
    description: "Whether this is your default payout destination.",
  },
  {
    name: "destination",
    type: "string | null",
    description: (
      <>
        Masked: <Code>j•••@example.com</Code> for PayPal and Payoneer,{" "}
        <Code>•••• 4821</Code> for bank accounts and wallets.
      </>
    ),
  },
  {
    name: "createdAt",
    type: "string",
    description: "When it was added.",
  },
];

export default function Account() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="retrieve-account"
        title="Retrieve your account"
        panel={<ApiRunner endpoint={ENDPOINTS.retrieveAccount} />}
      >
        <Lead>
          Who the key belongs to, and where your money goes. Both endpoints are
          read-only. Profile and payout details change in the dashboard.
        </Lead>

        <Endpoint method="GET" path="/account" scope="account:read" />
        <P>Returns the publisher profile the key belongs to.</P>

        <ParamsTable title="Fields" params={ACCOUNT_FIELDS} />
      </Section>

      <Section
        id="list-payment-methods"
        title="List payment methods"
        panel={<ApiRunner endpoint={ENDPOINTS.listPaymentMethods} />}
      >
        <Endpoint
          method="GET"
          path="/account/payment-methods"
          scope="account:read"
        />
        <P>
          Returns every payout destination on file, newest first, as a plain
          array. There are few enough that it is not paginated.
        </P>

        <ParamsTable title="Fields" params={METHOD_FIELDS} />

        <Callout variant="info" title="Full details never leave the dashboard">
          The API returns enough to recognise a destination, never enough to use
          one. There is no way to read or change full account numbers over the
          API.
        </Callout>
      </Section>
    </DocLayout>
  );
}

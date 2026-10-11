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

const PAGE = pageByPath("/webhooks");

const DELIVERY = [
  {
    language: "http",
    label: "Request",
    code: `POST /linkapprove HTTP/1.1
Host: hooks.trailnotes.example
Content-Type: application/json
User-Agent: LinkApprove-Webhooks/1.0
LinkApprove-Event-Id: evt_120460
LinkApprove-Delivery-Attempt: 1
LinkApprove-Signature: t=1755676812,v1=5f2b1c0e9d7a6b4c3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d

{
  "id": "evt_120460",
  "type": "conversion.updated",
  "createdAt": "2026-08-20T08:00:12Z",
  "data": { "conversion": { "id": 771204, "status": "approved" } }
}`,
  },
];

const PAYLOADS = [
  {
    language: "json",
    label: "conversion.created",
    code: `{
  "id": "evt_120411",
  "type": "conversion.created",
  "createdAt": "2026-08-18T21:14:03Z",
  "data": {
    "conversion": {
      "id": 771204,
      "programId": 4821,
      "channelId": 12,
      "status": "pending",
      "saleAmount": "129.00",
      "commission": "7.22",
      "currency": "USD",
      "occurredAt": "2026-08-18T20:58:41Z"
    }
  }
}`,
  },
  {
    language: "json",
    label: "conversion.updated",
    code: `{
  "id": "evt_120460",
  "type": "conversion.updated",
  "createdAt": "2026-08-20T08:00:12Z",
  "data": {
    "conversion": {
      "id": 771204,
      "programId": 4821,
      "channelId": 12,
      "status": "approved",
      "saleAmount": "129.00",
      "commission": "7.22",
      "currency": "USD",
      "occurredAt": "2026-08-18T20:58:41Z"
    }
  }
}`,
  },
  {
    language: "json",
    label: "webhook.test",
    code: `{
  "id": "evt_120455",
  "type": "webhook.test",
  "createdAt": "2026-08-20T07:58:02Z",
  "data": { "message": "This is a test event from LinkApprove" }
}`,
  },
];

const VERIFY = [
  {
    language: "node",
    label: "Node",
    code: `import crypto from "node:crypto";
import express from "express";

const TOLERANCE_SECONDS = 300;
const app = express();

app.post(
  "/linkapprove",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const header = req.get("LinkApprove-Signature") ?? "";
    const parts = Object.fromEntries(
      header.split(",").map((part) => part.split("=", 2))
    );

    const expected = crypto
      .createHmac("sha256", process.env.LINKAPPROVE_WEBHOOK_SECRET)
      .update(\`\${parts.t}.\${req.body}\`)
      .digest("hex");

    const isFresh =
      Math.abs(Date.now() / 1000 - Number(parts.t)) < TOLERANCE_SECONDS;
    const isValid =
      typeof parts.v1 === "string" &&
      parts.v1.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected));

    if (!isFresh || !isValid) return res.sendStatus(400);

    const event = JSON.parse(req.body);
    console.log(event.type, event.data);
    res.sendStatus(200);
  }
);

app.listen(3000);`,
  },
  {
    language: "python",
    label: "Python",
    code: `import hashlib
import hmac
import json
import os
import time

from flask import Flask, abort, request

TOLERANCE_SECONDS = 300
app = Flask(__name__)


@app.post("/linkapprove")
def linkapprove():
    header = request.headers.get("LinkApprove-Signature", "")
    parts = dict(part.split("=", 1) for part in header.split(",") if "=" in part)
    timestamp = parts.get("t", "")
    body = request.get_data()

    expected = hmac.new(
        os.environ["LINKAPPROVE_WEBHOOK_SECRET"].encode(),
        timestamp.encode() + b"." + body,
        hashlib.sha256,
    ).hexdigest()

    if not timestamp.isdigit() or abs(time.time() - int(timestamp)) > TOLERANCE_SECONDS:
        abort(400)
    if not hmac.compare_digest(expected, parts.get("v1", "")):
        abort(400)

    event = json.loads(body)
    print(event["type"], event["data"])
    return "", 200`,
  },
  {
    language: "php",
    label: "PHP",
    code: `<?php

$toleranceSeconds = 300;
$secret = getenv("LINKAPPROVE_WEBHOOK_SECRET");
$body = file_get_contents("php://input");

$parts = [];
foreach (explode(",", $_SERVER["HTTP_LINKAPPROVE_SIGNATURE"] ?? "") as $part) {
    [$key, $value] = array_pad(explode("=", $part, 2), 2, "");
    $parts[$key] = $value;
}

$timestamp = $parts["t"] ?? "";
$expected = hash_hmac("sha256", $timestamp . "." . $body, $secret);

if (!ctype_digit($timestamp) || abs(time() - (int) $timestamp) > $toleranceSeconds) {
    http_response_code(400);
    exit;
}
if (!hash_equals($expected, $parts["v1"] ?? "")) {
    http_response_code(400);
    exit;
}

$event = json_decode($body, true);
error_log($event["type"]);
http_response_code(200);`,
  },
  {
    language: "go",
    label: "Go",
    code: `package main

import (
\t"crypto/hmac"
\t"crypto/sha256"
\t"encoding/hex"
\t"io"
\t"net/http"
\t"os"
\t"strconv"
\t"strings"
\t"time"
)

const toleranceSeconds = 300

func linkapprove(w http.ResponseWriter, r *http.Request) {
\tbody, err := io.ReadAll(r.Body)
\tif err != nil {
\t\thttp.Error(w, "unreadable body", http.StatusBadRequest)
\t\treturn
\t}

\tparts := map[string]string{}
\tfor _, part := range strings.Split(r.Header.Get("LinkApprove-Signature"), ",") {
\t\tif key, value, ok := strings.Cut(part, "="); ok {
\t\t\tparts[key] = value
\t\t}
\t}

\ttimestamp, err := strconv.ParseInt(parts["t"], 10, 64)
\tage := time.Now().Unix() - timestamp
\tif err != nil || age > toleranceSeconds || age < -toleranceSeconds {
\t\thttp.Error(w, "stale signature", http.StatusBadRequest)
\t\treturn
\t}

\tmac := hmac.New(sha256.New, []byte(os.Getenv("LINKAPPROVE_WEBHOOK_SECRET")))
\tmac.Write([]byte(parts["t"] + "." + string(body)))
\texpected := hex.EncodeToString(mac.Sum(nil))
\tif !hmac.Equal([]byte(expected), []byte(parts["v1"])) {
\t\thttp.Error(w, "bad signature", http.StatusBadRequest)
\t\treturn
\t}

\tw.WriteHeader(http.StatusOK)
}

func main() {
\thttp.HandleFunc("/linkapprove", linkapprove)
\thttp.ListenAndServe(":3000", nil)
}`,
  },
  {
    language: "ruby",
    label: "Ruby",
    code: `require "sinatra"
require "openssl"
require "json"

TOLERANCE_SECONDS = 300

post "/linkapprove" do
  body = request.body.read
  header = request.env["HTTP_LINKAPPROVE_SIGNATURE"].to_s
  parts = header.split(",").map { |part| part.split("=", 2) }.select { |pair| pair.size == 2 }.to_h

  expected = OpenSSL::HMAC.hexdigest(
    "SHA256",
    ENV.fetch("LINKAPPROVE_WEBHOOK_SECRET"),
    "#{parts["t"]}.#{body}"
  )

  halt 400 if (Time.now.to_i - parts["t"].to_i).abs > TOLERANCE_SECONDS
  halt 400 unless Rack::Utils.secure_compare(expected, parts["v1"].to_s)

  event = JSON.parse(body)
  logger.info(event["type"])
  status 200
end`,
  },
];

const RETRY_SCHEDULE = [
  {
    language: "text",
    label: "Schedule",
    code: `attempt 1   as soon as the event happens
attempt 2   +1 minute
attempt 3   +5 minutes
attempt 4   +30 minutes
attempt 5   +2 hours
attempt 6   +6 hours
attempt 7   +12 hours
attempt 8   +24 hours   → failed if this one fails too`,
  },
];

const CONVERSION_FIELDS = [
  {
    name: "id",
    type: "integer",
    description:
      "The conversion's LinkApprove ID. Stable across every event for the same sale.",
  },
  {
    name: "programId",
    type: "integer | null",
    description: "The program it was earned on.",
  },
  {
    name: "channelId",
    type: "integer | null",
    description: "The channel that sent the click.",
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        The current status: <Code>pending</Code>, <Code>approved</Code>,{" "}
        <Code>available</Code>, <Code>ready_for_payout</Code> or{" "}
        <Code>rejected</Code>.
      </>
    ),
  },
  {
    name: "saleAmount",
    type: "string | null",
    description: "The order value, as the network reported it.",
  },
  {
    name: "commission",
    type: "string | null",
    description: "Your share of the commission, as the network reported it.",
  },
  {
    name: "currency",
    type: "string | null",
    description:
      "ISO 4217 code for both amounts. Null when the network did not say.",
  },
  {
    name: "occurredAt",
    type: "string | null",
    description: "When the sale happened, according to the network.",
  },
];

const CREATE_PARAMS = [
  {
    name: "url",
    type: "string",
    required: true,
    description: (
      <>
        A public <Code>https</Code> URL on port 443, up to 800 characters, with
        no username or password in it.
      </>
    ),
  },
  {
    name: "events",
    type: "string[]",
    required: true,
    description: (
      <>
        One or more of <Code>conversion.created</Code> and{" "}
        <Code>conversion.updated</Code>. Duplicates are dropped.
      </>
    ),
  },
  {
    name: "description",
    type: "string",
    description: "Your own label, up to 255 characters.",
  },
];

const UPDATE_PARAMS = [
  {
    name: "url",
    type: "string",
    description: "A new URL, under the same rules as when registering.",
  },
  {
    name: "events",
    type: "string[]",
    description: "Replaces the subscribed event types.",
  },
  {
    name: "description",
    type: "string | null",
    description: (
      <>
        A new label. <Code>null</Code> clears it.
      </>
    ),
  },
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>disabled</Code> stops deliveries. <Code>active</Code> turns them
        back on and resets <Code>consecutiveFailures</Code> to 0.
      </>
    ),
  },
];

const DELIVERY_PARAMS = [
  {
    name: "status",
    type: "enum",
    description: (
      <>
        <Code>pending</Code>, <Code>retrying</Code>, <Code>succeeded</Code> or{" "}
        <Code>failed</Code>.
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

export default function Webhooks() {
  return (
    <DocLayout page={PAGE}>
      <Section
        id="how-webhooks-work"
        title="How webhooks work"
        panel={<CodeBlock samples={DELIVERY} />}
      >
        <Lead>
          Register an https URL and we POST a signed JSON event to it when a
          conversion on your account arrives or changes status, so you stop
          polling reports to find out.
        </Lead>

        <List
          items={[
            <>
              Each endpoint subscribes to the event types it wants. An event is
              delivered to every active endpoint subscribed to its type.
            </>,
            <>
              Answer with any <Code>2xx</Code> within ten seconds. Anything else
              (another status, a redirect, a timeout) counts as a failure and is{" "}
              <DocLink to="/webhooks#retries">retried</DocLink>.
            </>,
            <>An account can have up to five endpoints.</>,
          ]}
        />

        <Callout variant="warning" title="Acknowledge first, work later">
          Return <Code>200</Code> as soon as the signature checks out, and do
          the slow part, like database writes and emails, in a background job. A
          handler that takes longer than ten seconds is a failed delivery even
          if it finishes.
        </Callout>
      </Section>

      <Section
        id="events"
        title="Events and payloads"
        panel={<CodeBlock samples={PAYLOADS} />}
      >
        <P>
          Every event has the same envelope: an <Code>id</Code> prefixed{" "}
          <Code>evt_</Code>, its <Code>type</Code>, when it was{" "}
          <Code>createdAt</Code>, and a <Code>data</Code> object.
        </P>

        <List
          items={[
            <>
              <Code>conversion.created</Code>: the first time we see a
              conversion attributed to you.
            </>,
            <>
              <Code>conversion.updated</Code>: its status changed. A network
              resending a conversion with the same status sends nothing.
            </>,
            <>
              <Code>webhook.test</Code>: only from{" "}
              <DocLink to="/webhooks#send-a-test-event">
                Send a test event
              </DocLink>
              . You cannot subscribe to it.
            </>,
          ]}
        />

        <ParamsTable title="data.conversion" params={CONVERSION_FIELDS} />

        <Sub>Duplicates and ordering</Sub>
        <P>
          Deliveries can arrive more than once, after a retry or a replay, and
          are not guaranteed to arrive in order. Store each event{" "}
          <Code>id</Code> you have handled and skip repeats, and when two events
          describe the same conversion, keep the one with the later{" "}
          <Code>createdAt</Code>.
        </P>
      </Section>

      <Section
        id="verify-signatures"
        title="Verify the signature"
        panel={<CodeBlock samples={VERIFY} />}
      >
        <P>
          Anyone can POST to your URL, so check every request before trusting
          it. The <Code>LinkApprove-Signature</Code> header has two parts:{" "}
          <Code>t</Code>, the Unix time we signed at, and <Code>v1</Code>, a hex
          HMAC-SHA256.
        </P>

        <List
          items={[
            <>
              Join <Code>t</Code>, a literal <Code>.</Code> and the raw request
              body: the exact bytes, before any JSON parsing.
            </>,
            <>
              Compute HMAC-SHA256 of that string, keyed with the endpoint's
              whole secret including the <Code>whsec_</Code> prefix.
            </>,
            <>
              Compare it to <Code>v1</Code> in constant time, and reject the
              request if <Code>t</Code> is more than five minutes away from your
              clock.
            </>,
          ]}
        />

        <Callout variant="danger" title="Sign the raw body">
          Parsing the JSON and re-serialising it changes whitespace and key
          order, and the signature will never match. Read the body as bytes.
        </Callout>
      </Section>

      <Section
        id="retries"
        title="Retries and disabling"
        panel={<CodeBlock samples={RETRY_SCHEDULE} />}
      >
        <P>
          A failed delivery is retried up to eight attempts in total, backing
          off from one minute to a day. Times are approximate because deliveries
          go out in batches every minute.{" "}
          <Code>LinkApprove-Delivery-Attempt</Code> tells you which attempt you
          are looking at.
        </P>

        <Sub>Automatic disabling</Sub>
        <P>
          After 20 failed attempts in a row, across all its deliveries, an
          endpoint is set to <Code>disabled</Code>, and deliveries still queued
          for it are marked <Code>failed</Code> as they come due. A successful
          delivery resets the count.
        </P>
        <P>
          Once your server is fixed, set <Code>status</Code> back to{" "}
          <Code>active</Code> with{" "}
          <DocLink to="/webhooks#manage-endpoints">an update</DocLink>, then{" "}
          <DocLink to="/webhooks#deliveries">replay</DocLink> the failed
          deliveries you need. Events that happen while an endpoint is disabled
          are not queued for it.
        </P>
      </Section>

      <Section
        id="register-an-endpoint"
        title="Register an endpoint"
        panel={<ApiRunner endpoint={ENDPOINTS.createWebhook} />}
      >
        <Endpoint method="POST" path="/webhooks" scope="webhooks:write" />
        <P>
          Registers a URL and returns it with its signing <Code>secret</Code>.
        </P>

        <ParamsTable title="Body parameters" params={CREATE_PARAMS} />

        <Callout variant="warning" title="The secret is shown once">
          Store <Code>secret</Code> straight away. No endpoint returns it again.
          If you lose it,{" "}
          <DocLink to="/webhooks#rotate-the-secret">rotate it</DocLink>.
        </Callout>

        <Sub>When it fails</Sub>
        <List
          items={[
            <>
              <Code>400</Code> <Code>Validation failed</Code>: the URL is not
              https, <Code>events</Code> is empty, or it names an unknown event
              type.
            </>,
            <>
              <Code>422</Code> <Code>url_not_allowed</Code>: a port other than
              443, credentials in the URL, or a hostname that resolves to a
              private or internal address.
            </>,
            <>
              <Code>409</Code> <Code>webhook_limit_reached</Code>: the account
              already has five endpoints.
            </>,
          ]}
        />
      </Section>

      <Section
        id="manage-endpoints"
        title="Manage endpoints"
        panel={
          <div className="space-y-3">
            <ApiRunner endpoint={ENDPOINTS.listWebhooks} />
            <ApiRunner endpoint={ENDPOINTS.updateWebhook} />
          </div>
        }
      >
        <Endpoint method="GET" path="/webhooks" scope="webhooks:read" />
        <P>
          Returns all your endpoints, newest first, as a plain array. Each one
          carries its <Code>status</Code>, its <Code>consecutiveFailures</Code>,
          when it was <Code>disabledAt</Code>, and its{" "}
          <Code>lastDeliveryAt</Code>, the last successful delivery.
        </P>

        <Endpoint method="GET" path="/webhooks/{id}" scope="webhooks:read" />
        <P>
          Returns one endpoint, or <Code>404</Code>{" "}
          <Code>webhook_not_found</Code>.
        </P>

        <Endpoint method="PATCH" path="/webhooks/{id}" scope="webhooks:write" />
        <P>
          Changes any of these fields. Leave out the ones you are not changing.
        </P>

        <ParamsTable title="Body parameters" params={UPDATE_PARAMS} />

        <Endpoint
          method="DELETE"
          path="/webhooks/{id}"
          scope="webhooks:write"
        />
        <P>
          Deletes the endpoint. Nothing more is delivered to it, and it no
          longer counts toward the limit of five.
        </P>
      </Section>

      <Section
        id="rotate-the-secret"
        title="Rotate the secret"
        panel={<ApiRunner endpoint={ENDPOINTS.rotateWebhookSecret} />}
      >
        <Endpoint
          method="POST"
          path="/webhooks/{id}/rotate-secret"
          scope="webhooks:write"
        />
        <P>
          Replaces the signing secret and returns the new one, once. The old
          secret stops being used immediately, including for deliveries that
          were already queued.
        </P>

        <Callout variant="tip" title="Rotate without dropping events">
          For a moment after rotating, accept a signature that matches either
          the old or the new secret. Then remove the old one.
        </Callout>
      </Section>

      <Section
        id="send-a-test-event"
        title="Send a test event"
        panel={<ApiRunner endpoint={ENDPOINTS.testWebhook} />}
      >
        <Endpoint
          method="POST"
          path="/webhooks/{id}/test"
          scope="webhooks:write"
        />
        <P>
          Queues a <Code>webhook.test</Code> event for this endpoint only,
          whatever it subscribes to, and returns <Code>202</Code> with the{" "}
          <Code>eventId</Code> and <Code>deliveryId</Code>. It is delivered
          within about a minute, signed like any other event. It is the quickest
          way to check your signature code.
        </P>
      </Section>

      <Section
        id="deliveries"
        title="Deliveries and replay"
        panel={
          <div className="space-y-3">
            <ApiRunner endpoint={ENDPOINTS.listDeliveries} />
            <ApiRunner endpoint={ENDPOINTS.replayDelivery} />
          </div>
        }
      >
        <Endpoint
          method="GET"
          path="/webhooks/{id}/deliveries"
          scope="webhooks:read"
        />
        <P>
          Returns this endpoint's deliveries, newest first, with what your
          server answered: <Code>responseStatus</Code>, the first 500 characters
          of <Code>responseBody</Code>, <Code>durationMs</Code>, and{" "}
          <Code>errorMessage</Code> when there was no response at all.
        </P>

        <ParamsTable title="Query parameters" params={DELIVERY_PARAMS} />

        <Endpoint
          method="POST"
          path="/webhooks/{id}/deliveries/{deliveryId}/replay"
          scope="webhooks:write"
        />
        <P>
          Sends a <Code>succeeded</Code> or <Code>failed</Code> delivery again,
          with the same event <Code>id</Code> and a fresh set of eight attempts.
          Returns <Code>202</Code>.
        </P>

        <List
          items={[
            <>
              <Code>409</Code> <Code>delivery_not_replayable</Code>: it is still{" "}
              <Code>pending</Code> or <Code>retrying</Code>, and will be sent
              anyway.
            </>,
            <>
              <Code>404</Code> <Code>delivery_not_found</Code>: no delivery with
              that ID on this endpoint.
            </>,
          ]}
        />
      </Section>
    </DocLayout>
  );
}

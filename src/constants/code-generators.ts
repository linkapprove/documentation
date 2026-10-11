import type { TCodeSample } from "@/components/code-block";
import { API_BASE_URL } from "@/constants/navigation";
import type { TEndpointSpec, TParamSpec } from "@/constants/endpoints";

export type TParamValues = Record<string, string>;

const ENV_NAME = "LINKAPPROVE_API_KEY";

const filled = (params: TParamSpec[], values: TParamValues, where: string) =>
  params.filter(
    (param) => param.in === where && (values[param.name] ?? param.value).trim()
  );

const valueOf = (param: TParamSpec, values: TParamValues) =>
  (values[param.name] ?? param.value).trim();

const isNumeric = (param: TParamSpec) =>
  param.type === "integer" || param.type === "number";

const isList = (param: TParamSpec) => param.type === "string[]";

const listItems = (raw: string) =>
  raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => JSON.stringify(item))
    .join(", ");

const resolvePath = (endpoint: TEndpointSpec, values: TParamValues) =>
  endpoint.params
    .filter((param) => param.in === "path")
    .reduce(
      (path, param) => path.replace(`{${param.name}}`, valueOf(param, values)),
      endpoint.path
    );

export const buildUrl = (endpoint: TEndpointSpec, values: TParamValues) => {
  const query = filled(endpoint.params, values, "query")
    .map(
      (param) =>
        `${encodeURIComponent(param.name)}=${encodeURIComponent(
          valueOf(param, values)
        )}`
    )
    .join("&");

  const path = `${API_BASE_URL}${resolvePath(endpoint, values)}`;
  return query ? `${path}?${query}` : path;
};

const bodyEntries = (endpoint: TEndpointSpec, values: TParamValues) =>
  filled(endpoint.params, values, "body").map((param) => ({
    key: param.name,
    raw: valueOf(param, values),
    numeric: isNumeric(param),
    list: isList(param),
  }));

const renderValue = (
  entry: { raw: string; numeric: boolean; list: boolean },
  listOpen = "[",
  listClose = "]"
) =>
  entry.list
    ? `${listOpen}${listItems(entry.raw)}${listClose}`
    : entry.numeric
      ? entry.raw
      : JSON.stringify(entry.raw);

const jsonBody = (
  endpoint: TEndpointSpec,
  values: TParamValues,
  indent: string
) => {
  const entries = bodyEntries(endpoint, values);
  if (!entries.length) return "";
  const lines = entries
    .map((entry) => `${indent}  "${entry.key}": ${renderValue(entry)}`)
    .join(",\n");
  return `{\n${lines}\n${indent}}`;
};

type TLiteralOptions = {
  indent?: string;
  step?: string;
  quote: (key: string) => string;
  arrow: string;
  open?: string;
  close?: string;
  trailing?: string;
  listOpen?: string;
  listClose?: string;
};

const literalBody = (
  endpoint: TEndpointSpec,
  values: TParamValues,
  {
    indent = "",
    step = "  ",
    quote,
    arrow,
    open = "{",
    close = "}",
    trailing = "",
    listOpen = "[",
    listClose = "]",
  }: TLiteralOptions
) => {
  const entries = bodyEntries(endpoint, values);
  if (!entries.length) return `${open}${close}`;
  const lines = entries
    .map(
      (entry) =>
        `${indent}${step}${quote(entry.key)}${arrow} ${renderValue(
          entry,
          listOpen,
          listClose
        )}`
    )
    .join(",\n");
  return `${open}\n${lines}${trailing}\n${indent}${close}`;
};

export function generateSamples(
  endpoint: TEndpointSpec,
  values: TParamValues,
  token: string
): TCodeSample[] {
  const url = buildUrl(endpoint, values);
  const hasBody = bodyEntries(endpoint, values).length > 0;
  const method = endpoint.method;

  const shellToken = token || `$${ENV_NAME}`;

  const curlLines = [
    `curl${method === "GET" ? "" : ` -X ${method}`} "${url}" \\`,
  ];
  curlLines.push(
    `  -H "Authorization: Bearer ${shellToken}"${hasBody ? " \\" : ""}`
  );
  if (hasBody) {
    curlLines.push(`  -H "Content-Type: application/json" \\`);
    curlLines.push(`  -d '${jsonBody(endpoint, values, "  ")}'`);
  }

  const nodeToken = token
    ? JSON.stringify(`Bearer ${token}`)
    : `\`Bearer \${process.env.${ENV_NAME}}\``;

  const nodeInit = [
    method === "GET" ? null : `  method: ${JSON.stringify(method)},`,
    `  headers: {`,
    `    Authorization: ${nodeToken},`,
    hasBody ? `    "Content-Type": "application/json",` : null,
    `  },`,
    hasBody
      ? `  body: JSON.stringify(${literalBody(endpoint, values, {
          indent: "  ",
          quote: (key) => key,
          arrow: ":",
        })}),`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const pythonToken = token
    ? `"Bearer ${token}"`
    : `f"Bearer {os.environ['${ENV_NAME}']}"`;

  const pythonCall = [
    `res = requests.${method.toLowerCase()}(`,
    `    ${JSON.stringify(url)},`,
    `    headers={"Authorization": ${pythonToken}},`,
    hasBody
      ? `    json=${literalBody(endpoint, values, {
          indent: "    ",
          step: "    ",
          quote: (key) => `"${key}"`,
          arrow: ":",
        })},`
      : null,
    `)`,
  ]
    .filter(Boolean)
    .join("\n");

  const phpToken = token ? `Bearer ${token}` : `Bearer {$_ENV['${ENV_NAME}']}`;

  const phpOptions = [
    `    CURLOPT_RETURNTRANSFER => true,`,
    method === "GET" ? null : `    CURLOPT_CUSTOMREQUEST => "${method}",`,
    `    CURLOPT_HTTPHEADER => [`,
    `        "Authorization: ${phpToken}",`,
    hasBody ? `        "Content-Type: application/json",` : null,
    `    ],`,
    hasBody
      ? `    CURLOPT_POSTFIELDS => json_encode(${literalBody(endpoint, values, {
          indent: "    ",
          step: "    ",
          quote: (key) => `"${key}"`,
          arrow: " =>",
          open: "[",
          close: "]",
        })}),`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const goToken = token
    ? JSON.stringify(`Bearer ${token}`)
    : `"Bearer "+os.Getenv("${ENV_NAME}")`;

  const goImports = [
    hasBody ? `\t"bytes"` : null,
    `\t"encoding/json"`,
    `\t"fmt"`,
    `\t"net/http"`,
    token ? null : `\t"os"`,
  ]
    .filter(Boolean)
    .join("\n");

  const goBody = hasBody
    ? `\tpayload, _ := json.Marshal(map[string]any${literalBody(
        endpoint,
        values,
        {
          indent: "\t",
          step: "\t",
          quote: (key) => `"${key}"`,
          arrow: ":",
          trailing: ",",
          listOpen: "[]string{",
          listClose: "}",
        }
      )})\n\n`
    : "";

  const goRequest = hasBody
    ? `\treq, _ := http.NewRequest("${method}", ${JSON.stringify(
        url
      )}, bytes.NewBuffer(payload))`
    : `\treq, _ := http.NewRequest("${method}", ${JSON.stringify(url)}, nil)`;

  const rubyToken = token
    ? `"Bearer ${token}"`
    : `"Bearer #{ENV.fetch('${ENV_NAME}')}"`;

  const rubyRequestClass = `Net::HTTP::${
    method.charAt(0) + method.slice(1).toLowerCase()
  }`;

  return [
    {
      language: "bash",
      label: "cURL",
      code: curlLines.join("\n"),
    },
    {
      language: "node",
      label: "Node",
      code: `const res = await fetch(${JSON.stringify(url)}, {
${nodeInit}
});

const { data } = await res.json();
console.log(data);`,
    },
    {
      language: "python",
      label: "Python",
      code: `${token ? "" : "import os\n"}import requests

${pythonCall}
res.raise_for_status()

print(res.json()["data"])`,
    },
    {
      language: "php",
      label: "PHP",
      code: `<?php

$ch = curl_init(${JSON.stringify(url)});

curl_setopt_array($ch, [
${phpOptions}
]);

$response = json_decode(curl_exec($ch), true);
curl_close($ch);

print_r($response["data"]);`,
    },
    {
      language: "go",
      label: "Go",
      code: `package main

import (
${goImports}
)

func main() {
${goBody}${goRequest}
\treq.Header.Set("Authorization", ${goToken})
${hasBody ? `\treq.Header.Set("Content-Type", "application/json")\n` : ""}
\tres, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer res.Body.Close()

\tvar out map[string]any
\tjson.NewDecoder(res.Body).Decode(&out)
\tfmt.Println(out["data"])
}`,
    },
    {
      language: "ruby",
      label: "Ruby",
      code: `require "net/http"
require "json"

uri = URI(${JSON.stringify(url)})
req = ${rubyRequestClass}.new(uri)
req["Authorization"] = ${rubyToken}
${
  hasBody
    ? `req["Content-Type"] = "application/json"
req.body = JSON.dump(${literalBody(endpoint, values, {
        quote: (key) => `"${key}"`,
        arrow: " =>",
      })})
`
    : ""
}
res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(req)
end

puts JSON.parse(res.body)["data"]`,
    },
  ];
}

import type { TMethod } from "@/components/endpoint";

export type TParamLocation = "query" | "body" | "path";

export type TParamSpec = {
  name: string;
  in: TParamLocation;
  type: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  description: string;
};

export type TSampleResponse = {
  status: number;
  statusText: string;
  body: string;
};

export type TEndpointSpec = {
  id: string;
  method: TMethod;
  path: string;
  scope: string;
  title: string;
  params: TParamSpec[];
  response: TSampleResponse;
  unauthorized: TSampleResponse;
};

const UNAUTHORIZED: TSampleResponse = {
  status: 401,
  statusText: "Unauthorized",
  body: `{
  "success": false,
  "message": "Invalid or revoked API key",
  "error": { "code": "invalid_api_key" }
}`,
};

export const ENDPOINTS = {
  retrieveMe: {
    id: "retrieveMe",
    method: "GET",
    path: "/me",
    scope: "any",
    title: "Verify a key",
    params: [],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "API key fetched",
  "data": {
    "id": 14,
    "name": "Production Sync",
    "prefix": "la",
    "last4": "7f3a",
    "scopes": ["links:read", "links:write", "programs:read", "reports:read"],
    "ipAllowlist": ["203.0.113.0/24"],
    "expiresAt": null,
    "createdAt": "2026-10-06T20:57:40.733Z",
    "callerIp": "203.0.113.24"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listPrograms: {
    id: "listPrograms",
    method: "GET",
    path: "/programs",
    scope: "programs:read",
    title: "List programs",
    params: [
      {
        name: "search",
        in: "query",
        type: "string",
        value: "",
        placeholder: "northpeak",
        description: "Matches merchant name or domain.",
      },
      {
        name: "category",
        in: "query",
        type: "string",
        value: "",
        placeholder: "sports_outdoors",
        description:
          "A LinkApprove category as a lowercase slug, e.g. clothing_apparel or sports_outdoors.",
      },
      {
        name: "payoutType",
        in: "query",
        type: "enum",
        value: "cps",
        placeholder: "cps",
        description: "cps or cpc.",
      },
      {
        name: "approvalType",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "auto",
        description: "auto or manual.",
      },
      {
        name: "channelId",
        in: "query",
        type: "integer",
        value: "",
        placeholder: "12",
        description:
          "Report status for this channel. Omit for the best status across your channels.",
      },
      {
        name: "status",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "not_applied",
        description:
          "Only programs in this state: not_applied, pending, approved, rejected, paused, suspended or expired.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Results per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Programs fetched",
  "data": {
    "data": [
      {
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
        "supportsDeepLinks": true
      },
      {
        "id": 5140,
        "merchantName": "Harbour & Field",
        "merchantDomain": "harbourfield.com",
        "category": "clothing_apparel",
        "payoutType": "cpc",
        "payout": "0.35",
        "payoutUnit": "fixed",
        "currency": "USD",
        "cookieDays": null,
        "approvalType": "auto",
        "status": "not_applied",
        "supportsDeepLinks": false
      }
    ],
    "count": 137,
    "pages": 14
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  retrieveProgram: {
    id: "retrieveProgram",
    method: "GET",
    path: "/programs/{id}",
    scope: "programs:read",
    title: "Retrieve a program",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "4821",
        description: "The program to retrieve.",
      },
      {
        name: "channelId",
        in: "query",
        type: "integer",
        value: "",
        placeholder: "12",
        description:
          "Report status for this channel. Omit for the best status across your channels.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Program fetched",
  "data": {
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
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  applyToProgram: {
    id: "applyToProgram",
    method: "POST",
    path: "/programs/applications",
    scope: "programs:write",
    title: "Apply to a program",
    params: [
      {
        name: "programId",
        in: "body",
        type: "integer",
        required: true,
        value: "4821",
        description: "The program you want to run.",
      },
      {
        name: "channelId",
        in: "body",
        type: "integer",
        required: true,
        value: "12",
        description:
          "An approved channel of yours that has completed verification.",
      },
      {
        name: "note",
        in: "body",
        type: "string",
        value: "Outdoor gear reviews, 40k monthly readers, US and CA.",
        description:
          "Optional, up to 500 characters. Accepted but not stored yet.",
      },
    ],
    response: {
      status: 201,
      statusText: "Created",
      body: `{
  "success": true,
  "message": "Application created",
  "data": {
    "id": 55071,
    "programId": 4821,
    "channelId": 12,
    "status": "pending",
    "appliedAt": "2026-08-18T09:12:44Z",
    "decidedAt": null,
    "rejectionReason": null
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  createTrackingLink: {
    id: "createTrackingLink",
    method: "POST",
    path: "/tracking-links",
    scope: "links:write",
    title: "Create a tracking link",
    params: [
      {
        name: "programId",
        in: "body",
        type: "integer",
        required: true,
        value: "4821",
        description: "A program you are approved on for this channel.",
      },
      {
        name: "channelId",
        in: "body",
        type: "integer",
        required: true,
        value: "12",
        description: "The verified channel the traffic comes from.",
      },
      {
        name: "subId",
        in: "body",
        type: "string",
        value: "spring-guide",
        description: "Your own tag. 1–64 letters, digits, - or _.",
      },
      {
        name: "subId2",
        in: "body",
        type: "string",
        value: "",
        placeholder: "hero-banner",
        description: "A second, independent tag with the same rules.",
      },
      {
        name: "destinationUrl",
        in: "body",
        type: "string",
        value: "",
        placeholder: "https://northpeak.com/collections/shells",
        description:
          "An http(s) URL on the merchant's domain or a subdomain, up to 255 characters.",
      },
    ],
    response: {
      status: 201,
      statusText: "Created",
      body: `{
  "success": true,
  "message": "Tracking link created",
  "data": {
    "id": 90124,
    "programId": 4821,
    "channelId": 12,
    "subId": "spring-guide",
    "subId2": null,
    "url": "https://go.linkapprove.com/k3Rm8Qw2Z",
    "destinationUrl": null,
    "status": "active",
    "clicks": 0,
    "lastClickAt": null,
    "createdAt": "2026-08-18T09:41:02Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  performanceReport: {
    id: "performanceReport",
    method: "GET",
    path: "/reports/performance",
    scope: "reports:read",
    title: "Performance report",
    params: [
      {
        name: "startDate",
        in: "query",
        type: "string",
        required: true,
        value: "2026-08-01",
        description: "Inclusive start of the range, YYYY-MM-DD.",
      },
      {
        name: "endDate",
        in: "query",
        type: "string",
        required: true,
        value: "2026-08-18",
        description:
          "Inclusive end, YYYY-MM-DD. On or after startDate, at most 180 days in total.",
      },
      {
        name: "groupBy",
        in: "query",
        type: "enum",
        value: "program",
        description: "program, channel, day or subId. Defaults to program.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Rows per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Report fetched",
  "data": {
    "data": [
      {
        "programId": 4821,
        "merchantName": "Northpeak Outdoors",
        "clicks": 4180,
        "conversions": 96,
        "conversionRate": 2.3,
        "earnings": [
          { "currency": "USD", "commission": "742.18", "pending": "210.40" }
        ]
      }
    ],
    "count": 1,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },
  listApplications: {
    id: "listApplications",
    method: "GET",
    path: "/programs/applications",
    scope: "programs:read",
    title: "List applications",
    params: [
      {
        name: "status",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "pending",
        description:
          "pending, approved, rejected, paused, suspended or expired.",
      },
      {
        name: "programId",
        in: "query",
        type: "integer",
        value: "",
        placeholder: "4821",
        description: "Only applications to this program.",
      },
      {
        name: "channelId",
        in: "query",
        type: "integer",
        value: "",
        placeholder: "12",
        description: "Only applications from this channel.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Results per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Applications fetched",
  "data": {
    "data": [
      {
        "id": 55071,
        "programId": 4821,
        "merchantName": "Northpeak Outdoors",
        "channelId": 12,
        "status": "approved",
        "appliedAt": "2026-08-18T09:12:44Z",
        "decidedAt": "2026-08-19T14:03:10Z",
        "rejectionReason": null
      }
    ],
    "count": 1,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listTrackingLinks: {
    id: "listTrackingLinks",
    method: "GET",
    path: "/tracking-links",
    scope: "links:read",
    title: "List tracking links",
    params: [
      {
        name: "programId",
        in: "query",
        type: "integer",
        value: "",
        placeholder: "4821",
        description: "Only links for this program.",
      },
      {
        name: "channelId",
        in: "query",
        type: "integer",
        value: "",
        placeholder: "12",
        description: "Only links for this channel.",
      },
      {
        name: "subId",
        in: "query",
        type: "string",
        value: "",
        placeholder: "spring-guide",
        description: "Only links minted with this sub ID.",
      },
      {
        name: "status",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "active",
        description: "active or paused.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Results per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Tracking links fetched",
  "data": {
    "data": [
      {
        "id": 90124,
        "programId": 4821,
        "channelId": 12,
        "subId": "spring-guide",
        "subId2": null,
        "url": "https://go.linkapprove.com/k3Rm8Qw2Z",
        "destinationUrl": null,
        "status": "active",
        "clicks": 412,
        "lastClickAt": "2026-08-20T17:22:05Z",
        "createdAt": "2026-08-18T09:41:02Z"
      }
    ],
    "count": 1,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  retrieveTrackingLink: {
    id: "retrieveTrackingLink",
    method: "GET",
    path: "/tracking-links/{id}",
    scope: "links:read",
    title: "Retrieve a tracking link",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "90124",
        description: "The tracking link to retrieve.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Tracking link fetched",
  "data": {
    "id": 90124,
    "programId": 4821,
    "channelId": 12,
    "subId": "spring-guide",
    "subId2": null,
    "url": "https://go.linkapprove.com/k3Rm8Qw2Z",
    "destinationUrl": null,
    "status": "active",
    "clicks": 412,
    "lastClickAt": "2026-08-20T17:22:05Z",
    "createdAt": "2026-08-18T09:41:02Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listChannels: {
    id: "listChannels",
    method: "GET",
    path: "/channels",
    scope: "channels:read",
    title: "List channels",
    params: [
      {
        name: "status",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "active",
        description: "pending, active, rejected, paused or suspended.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Results per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Channels fetched",
  "data": {
    "data": [
      {
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
      },
      {
        "id": 31,
        "name": "Trail Notes on Instagram",
        "url": "https://instagram.com/trailnotes",
        "category": "social",
        "dailyPageViews": 900,
        "status": "pending",
        "verification": { "required": false, "verified": false, "metaTag": null },
        "createdAt": "2026-08-18T10:02:41Z"
      }
    ],
    "count": 2,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  retrieveChannel: {
    id: "retrieveChannel",
    method: "GET",
    path: "/channels/{id}",
    scope: "channels:read",
    title: "Retrieve a channel",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "12",
        description: "The channel to retrieve.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Channel fetched",
  "data": {
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
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  createChannel: {
    id: "createChannel",
    method: "POST",
    path: "/channels",
    scope: "channels:write",
    title: "Create a channel",
    params: [
      {
        name: "name",
        in: "body",
        type: "string",
        required: true,
        value: "Trail Notes",
        description: "What you call the channel, 1–255 characters.",
      },
      {
        name: "url",
        in: "body",
        type: "string",
        required: true,
        value: "https://trailnotes.example",
        description:
          "An http(s) URL, up to 255 characters. One channel per domain.",
      },
      {
        name: "category",
        in: "body",
        type: "enum",
        required: true,
        value: "content",
        description: "website, content, coupons_deals, email, social or other.",
      },
      {
        name: "dailyPageViews",
        in: "body",
        type: "integer",
        required: true,
        value: "1400",
        description: "Your honest daily traffic estimate, 0 or more.",
      },
    ],
    response: {
      status: 201,
      statusText: "Created",
      body: `{
  "success": true,
  "message": "Channel created",
  "data": {
    "id": 12,
    "name": "Trail Notes",
    "url": "https://trailnotes.example",
    "category": "content",
    "dailyPageViews": 1400,
    "status": "pending",
    "verification": {
      "required": true,
      "verified": false,
      "metaTag": "<meta name=\\"linkapprove-verification\\" content=\\"5b0f2c9e-8a41-4d7e-9c3b-2f6e1d7a4c10\\">"
    },
    "createdAt": "2026-07-02T11:30:00Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  verifyChannel: {
    id: "verifyChannel",
    method: "POST",
    path: "/channels/{id}/verify",
    scope: "channels:write",
    title: "Verify a channel",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "12",
        description: "The channel whose page now carries the meta tag.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Channel verified",
  "data": {
    "id": 12,
    "name": "Trail Notes",
    "url": "https://trailnotes.example",
    "category": "content",
    "dailyPageViews": 1400,
    "status": "pending",
    "verification": {
      "required": true,
      "verified": true,
      "metaTag": "<meta name=\\"linkapprove-verification\\" content=\\"5b0f2c9e-8a41-4d7e-9c3b-2f6e1d7a4c10\\">"
    },
    "createdAt": "2026-07-02T11:30:00Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  retrieveBalance: {
    id: "retrieveBalance",
    method: "GET",
    path: "/payments/balance",
    scope: "payments:read",
    title: "Retrieve your balance",
    params: [],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Balance fetched",
  "data": {
    "pending": "210.40",
    "awaiting": "531.78",
    "available": "742.18",
    "withdrawals": {
      "pending": "0.00",
      "processing": "250.00",
      "paid": "1980.00"
    }
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listTransactions: {
    id: "listTransactions",
    method: "GET",
    path: "/payments/transactions",
    scope: "payments:read",
    title: "List transactions",
    params: [
      {
        name: "status",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "credited",
        description: "credited or withdrawn.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Results per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Transactions fetched",
  "data": {
    "data": [
      {
        "id": 8812,
        "amount": "64.20",
        "status": "credited",
        "withdrawalId": null,
        "programId": 4821,
        "merchantName": "Northpeak Outdoors",
        "createdAt": "2026-08-20T08:00:12Z"
      },
      {
        "id": 8790,
        "amount": "250.00",
        "status": "withdrawn",
        "withdrawalId": 3301,
        "programId": 5140,
        "merchantName": "Harbour & Field",
        "createdAt": "2026-08-12T08:00:09Z"
      }
    ],
    "count": 2,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listWithdrawals: {
    id: "listWithdrawals",
    method: "GET",
    path: "/withdrawals",
    scope: "payments:read",
    title: "List withdrawals",
    params: [
      {
        name: "status",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "paid",
        description: "pending, processing, paid, failed or cancelled.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Results per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Withdrawals fetched",
  "data": {
    "data": [
      {
        "id": 3301,
        "amount": "250.00",
        "fees": "2.50",
        "netAmount": "247.50",
        "status": "paid",
        "paymentMethod": { "type": "paypal", "destination": "j•••@example.com" },
        "transactionReference": "5TY29384KL019283X",
        "invoiceUrl": "https://cdn.linkapprove.com/invoices/0b6f6a5e-4d2c-4c1e-9a7e-1f3b2d8c9e41.pdf",
        "statusHistory": [
          { "status": "pending", "timestamp": "2026-08-12T08:00:09Z" },
          { "status": "processing", "timestamp": "2026-08-13T10:15:00Z" },
          { "status": "paid", "timestamp": "2026-08-14T09:02:31Z" }
        ],
        "createdAt": "2026-08-12T08:00:09Z"
      }
    ],
    "count": 1,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  retrieveWithdrawal: {
    id: "retrieveWithdrawal",
    method: "GET",
    path: "/withdrawals/{id}",
    scope: "payments:read",
    title: "Retrieve a withdrawal",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "3301",
        description: "The withdrawal to retrieve.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Withdrawal fetched",
  "data": {
    "id": 3301,
    "amount": "250.00",
    "fees": "2.50",
    "netAmount": "247.50",
    "status": "paid",
    "paymentMethod": { "type": "paypal", "destination": "j•••@example.com" },
    "transactionReference": "5TY29384KL019283X",
    "invoiceUrl": "https://cdn.linkapprove.com/invoices/0b6f6a5e-4d2c-4c1e-9a7e-1f3b2d8c9e41.pdf",
    "statusHistory": [
      { "status": "pending", "timestamp": "2026-08-12T08:00:09Z" },
      { "status": "processing", "timestamp": "2026-08-13T10:15:00Z" },
      { "status": "paid", "timestamp": "2026-08-14T09:02:31Z" }
    ],
    "createdAt": "2026-08-12T08:00:09Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  retrieveAccount: {
    id: "retrieveAccount",
    method: "GET",
    path: "/account",
    scope: "account:read",
    title: "Retrieve your account",
    params: [],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Account fetched",
  "data": {
    "id": 1042,
    "username": "trailnotes",
    "firstName": "Jamie",
    "lastName": "Rivera",
    "email": "jamie@trailnotes.example",
    "emailVerified": true,
    "status": "active",
    "createdAt": "2026-06-30T15:44:02Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listPaymentMethods: {
    id: "listPaymentMethods",
    method: "GET",
    path: "/account/payment-methods",
    scope: "account:read",
    title: "List payment methods",
    params: [],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Payment methods fetched",
  "data": [
    {
      "id": 77,
      "type": "paypal",
      "status": "active",
      "isDefault": true,
      "destination": "j•••@example.com",
      "createdAt": "2026-07-01T09:10:00Z"
    },
    {
      "id": 81,
      "type": "bank_transfer",
      "status": "pending",
      "isDefault": false,
      "destination": "•••• 4821",
      "createdAt": "2026-08-02T16:25:13Z"
    }
  ]
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listWebhooks: {
    id: "listWebhooks",
    method: "GET",
    path: "/webhooks",
    scope: "webhooks:read",
    title: "List webhook endpoints",
    params: [],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Webhooks fetched",
  "data": [
    {
      "id": 7,
      "url": "https://hooks.trailnotes.example/linkapprove",
      "description": "Conversion sync",
      "events": ["conversion.created", "conversion.updated"],
      "status": "active",
      "consecutiveFailures": 0,
      "disabledAt": null,
      "lastDeliveryAt": "2026-08-20T08:01:15Z",
      "createdAt": "2026-08-18T12:00:00Z"
    }
  ]
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  createWebhook: {
    id: "createWebhook",
    method: "POST",
    path: "/webhooks",
    scope: "webhooks:write",
    title: "Register a webhook endpoint",
    params: [
      {
        name: "url",
        in: "body",
        type: "string",
        required: true,
        value: "https://hooks.trailnotes.example/linkapprove",
        description: "A public https URL on port 443, up to 800 characters.",
      },
      {
        name: "events",
        in: "body",
        type: "string[]",
        required: true,
        value: "conversion.created, conversion.updated",
        description: "One or more event types, comma-separated here.",
      },
      {
        name: "description",
        in: "body",
        type: "string",
        value: "Conversion sync",
        description: "Your own label, up to 255 characters.",
      },
    ],
    response: {
      status: 201,
      statusText: "Created",
      body: `{
  "success": true,
  "message": "Webhook created",
  "data": {
    "webhook": {
      "id": 7,
      "url": "https://hooks.trailnotes.example/linkapprove",
      "description": "Conversion sync",
      "events": ["conversion.created", "conversion.updated"],
      "status": "active",
      "consecutiveFailures": 0,
      "disabledAt": null,
      "lastDeliveryAt": null,
      "createdAt": "2026-08-18T12:00:00Z"
    },
    "secret": "whsec_Qm9vT3V0ZG9vcnNTZWNyZXRGb3JEb2NzT25seQ"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  retrieveWebhook: {
    id: "retrieveWebhook",
    method: "GET",
    path: "/webhooks/{id}",
    scope: "webhooks:read",
    title: "Retrieve a webhook endpoint",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "7",
        description: "The endpoint to retrieve.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Webhook fetched",
  "data": {
    "id": 7,
    "url": "https://hooks.trailnotes.example/linkapprove",
    "description": "Conversion sync",
    "events": ["conversion.created", "conversion.updated"],
    "status": "active",
    "consecutiveFailures": 0,
    "disabledAt": null,
    "lastDeliveryAt": "2026-08-20T08:01:15Z",
    "createdAt": "2026-08-18T12:00:00Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  updateWebhook: {
    id: "updateWebhook",
    method: "PATCH",
    path: "/webhooks/{id}",
    scope: "webhooks:write",
    title: "Update a webhook endpoint",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "7",
        description: "The endpoint to change.",
      },
      {
        name: "url",
        in: "body",
        type: "string",
        value: "",
        placeholder: "https://hooks.trailnotes.example/v2",
        description: "A new public https URL on port 443.",
      },
      {
        name: "events",
        in: "body",
        type: "string[]",
        value: "",
        placeholder: "conversion.updated",
        description: "Replaces the subscribed event types.",
      },
      {
        name: "description",
        in: "body",
        type: "string",
        value: "",
        placeholder: "Conversion sync",
        description: "A new label. null clears it.",
      },
      {
        name: "status",
        in: "body",
        type: "enum",
        value: "active",
        description:
          "active re-enables and resets the failure count; disabled pauses deliveries.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Webhook updated",
  "data": {
    "id": 7,
    "url": "https://hooks.trailnotes.example/linkapprove",
    "description": "Conversion sync",
    "events": ["conversion.created", "conversion.updated"],
    "status": "active",
    "consecutiveFailures": 0,
    "disabledAt": null,
    "lastDeliveryAt": "2026-08-20T08:01:15Z",
    "createdAt": "2026-08-18T12:00:00Z"
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  deleteWebhook: {
    id: "deleteWebhook",
    method: "DELETE",
    path: "/webhooks/{id}",
    scope: "webhooks:write",
    title: "Delete a webhook endpoint",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "7",
        description: "The endpoint to delete.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Webhook deleted",
  "data": null
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  rotateWebhookSecret: {
    id: "rotateWebhookSecret",
    method: "POST",
    path: "/webhooks/{id}/rotate-secret",
    scope: "webhooks:write",
    title: "Rotate the signing secret",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "7",
        description: "The endpoint whose secret to replace.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Webhook secret rotated",
  "data": { "secret": "whsec_TmV3U2lnbmluZ1NlY3JldEZvckRvY3NPbmx5" }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  testWebhook: {
    id: "testWebhook",
    method: "POST",
    path: "/webhooks/{id}/test",
    scope: "webhooks:write",
    title: "Send a test event",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "7",
        description: "The endpoint to send a webhook.test event to.",
      },
    ],
    response: {
      status: 202,
      statusText: "Accepted",
      body: `{
  "success": true,
  "message": "Test event queued",
  "data": { "eventId": 120455, "deliveryId": 98112 }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  listDeliveries: {
    id: "listDeliveries",
    method: "GET",
    path: "/webhooks/{id}/deliveries",
    scope: "webhooks:read",
    title: "List deliveries",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "7",
        description: "The endpoint whose deliveries to list.",
      },
      {
        name: "status",
        in: "query",
        type: "enum",
        value: "",
        placeholder: "failed",
        description: "pending, retrying, succeeded or failed.",
      },
      {
        name: "page",
        in: "query",
        type: "integer",
        value: "1",
        description: "1-based page number.",
      },
      {
        name: "size",
        in: "query",
        type: "integer",
        value: "10",
        description: "Results per page, 1–100.",
      },
    ],
    response: {
      status: 200,
      statusText: "OK",
      body: `{
  "success": true,
  "message": "Deliveries fetched",
  "data": {
    "data": [
      {
        "id": 98113,
        "eventId": 120460,
        "eventType": "conversion.updated",
        "status": "retrying",
        "attempt": 2,
        "nextAttemptAt": "2026-08-20T08:36:15Z",
        "responseStatus": 503,
        "responseBody": "upstream unavailable",
        "durationMs": 211,
        "errorMessage": null,
        "deliveredAt": null,
        "createdAt": "2026-08-20T08:00:12Z"
      },
      {
        "id": 98112,
        "eventId": 120455,
        "eventType": "webhook.test",
        "status": "succeeded",
        "attempt": 1,
        "nextAttemptAt": "2026-08-20T07:59:31Z",
        "responseStatus": 200,
        "responseBody": "ok",
        "durationMs": 148,
        "errorMessage": null,
        "deliveredAt": "2026-08-20T07:58:31Z",
        "createdAt": "2026-08-20T07:58:02Z"
      }
    ],
    "count": 2,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },

  replayDelivery: {
    id: "replayDelivery",
    method: "POST",
    path: "/webhooks/{id}/deliveries/{deliveryId}/replay",
    scope: "webhooks:write",
    title: "Replay a delivery",
    params: [
      {
        name: "id",
        in: "path",
        type: "integer",
        required: true,
        value: "7",
        description: "The endpoint the delivery belongs to.",
      },
      {
        name: "deliveryId",
        in: "path",
        type: "integer",
        required: true,
        value: "98112",
        description: "A succeeded or failed delivery to send again.",
      },
    ],
    response: {
      status: 202,
      statusText: "Accepted",
      body: `{
  "success": true,
  "message": "Delivery queued for replay",
  "data": { "deliveryId": 98112 }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },
} satisfies Record<string, TEndpointSpec>;

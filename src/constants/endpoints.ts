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
  "message": "Missing or invalid API key",
  "error": { "code": "invalid_api_key" }
}`,
};

export const ENDPOINTS = {
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
        description: "Fuzzy match against merchant name and domain.",
      },
      {
        name: "category",
        in: "query",
        type: "string",
        value: "",
        placeholder: "sports_outdoors",
        description: "Filter by category slug.",
      },
      {
        name: "payoutType",
        in: "query",
        type: "enum",
        value: "cps",
        placeholder: "cps",
        description: "One of cps, cpc, cpl.",
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
        "network": "impact",
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
        "category": "sports_outdoors",
        "network": "partnerize",
        "payoutType": "cps",
        "payout": "6.50",
        "payoutUnit": "percent",
        "currency": "USD",
        "cookieDays": 45,
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
    "description": "Technical outerwear and camping gear.",
    "category": "sports_outdoors",
    "network": "impact",
    "payoutType": "cps",
    "payout": "8.00",
    "payoutUnit": "percent",
    "currency": "USD",
    "cookieDays": 30,
    "approvalType": "manual",
    "status": "approved",
    "regions": ["US", "CA"],
    "supportsDeepLinks": true,
    "logoUrl": "https://cdn.linkapprove.com/merchants/4821.png",
    "termsUrl": "https://northpeak.com/affiliates/terms",
    "isDeleted": false,
    "createdAt": "2025-11-04T18:22:11Z",
    "updatedAt": "2026-08-14T06:01:49Z"
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
        description: "A verified, approved channel of yours.",
      },
      {
        name: "note",
        in: "body",
        type: "string",
        value: "Outdoor gear reviews, 40k monthly readers, US and CA.",
        description: "Optional message to the merchant.",
      },
    ],
    response: {
      status: 201,
      statusText: "Created",
      body: `{
  "success": true,
  "message": "Application submitted",
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
        description: "Your own attribution tag.",
      },
      {
        name: "subId2",
        in: "body",
        type: "string",
        value: "",
        placeholder: "hero-banner",
        description: "A second, independent tag.",
      },
      {
        name: "destinationUrl",
        in: "body",
        type: "string",
        value: "",
        placeholder: "https://northpeak.com/collections/shells",
        description: "A deep link on the merchant's domain.",
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
    "url": "https://track.linkapprove.com/go/90124",
    "destinationUrl": null,
    "clicks": 0,
    "conversions": 0,
    "commission": "0.00",
    "createdAt": "2026-08-18T09:41:02Z",
    "lastClickAt": null
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
        description: "Inclusive end of the range, max 180 days out.",
      },
      {
        name: "groupBy",
        in: "query",
        type: "enum",
        value: "program",
        description: "program, channel, subId or day.",
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
        "commission": "742.18",
        "pending": "210.40"
      }
    ],
    "count": 1,
    "pages": 1
  }
}`,
    },
    unauthorized: UNAUTHORIZED,
  },
} satisfies Record<string, TEndpointSpec>;

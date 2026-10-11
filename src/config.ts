export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5008/v1";
export const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3001";
export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "http://localhost:3004";
export const GA_MEASUREMENT_ID = (
  import.meta.env.VITE_GA_MEASUREMENT_ID ?? ""
).trim();

import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SERVER_DIST = path.join(ROOT, "dist-ssr");
const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "LinkApprove API Documentation",
};
const NOT_FOUND_URL = "/__not-found__";

const {
  render,
  DOC_PAGES,
  SITE_NAME,
  SITE_URL,
  GA_MEASUREMENT_ID,
  toDocumentTitle,
} = await import(pathToFileURL(path.join(SERVER_DIST, "entry-server.js")).href);

const siteUrl = SITE_URL.replace(/\/$/, "");
const gaMeasurementId = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)
  ? GA_MEASUREMENT_ID
  : null;

if (GA_MEASUREMENT_ID && !gaMeasurementId)
  console.warn(
    `\n⚠️  VITE_GA_MEASUREMENT_ID "${GA_MEASUREMENT_ID}" is not a G- measurement ID, so analytics is left off.\n`
  );

if (siteUrl.includes("localhost"))
  console.warn(
    `\n⚠️  VITE_SITE_URL is not set, so canonical URLs, the sitemap and share images point at ${siteUrl}. Set it to https://docs.linkapprove.com for production builds.\n`
  );
const template = await readFile(path.join(DIST, "index.html"), "utf8");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const replaceOnce = (source, pattern, replacement) => {
  if (!pattern.test(source)) throw new Error(`Template is missing ${pattern}`);
  return source.replace(pattern, replacement);
};

const toHead = ({ title, description, url }) =>
  [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    url
      ? `<link rel="canonical" href="${url}" />`
      : `<meta name="robots" content="noindex" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    url ? `<meta property="og:url" content="${url}" />` : "",
    `<meta property="og:image" content="${siteUrl}${OG_IMAGE.path}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${OG_IMAGE.alt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${siteUrl}${OG_IMAGE.path}" />`,
    `<meta name="twitter:image:alt" content="${OG_IMAGE.alt}" />`,
    gaMeasurementId
      ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>`
      : "",
    gaMeasurementId
      ? `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${gaMeasurementId}");</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

const toDocument = ({ head, html }) => {
  let page = replaceOnce(template, /<title>[\s\S]*?<\/title>/, "");
  page = replaceOnce(page, /<meta\s+name="description"[\s\S]*?\/>/, "");
  page = replaceOnce(page, /<\/head>/, `  ${head}\n  </head>`);
  return replaceOnce(
    page,
    /<div id="root"><\/div>/,
    `<div id="root">${html}</div>`
  );
};

for (const page of DOC_PAGES) {
  const url = `${siteUrl}${page.path}`;
  const document = toDocument({
    head: toHead({
      title: toDocumentTitle(page),
      description: page.summary,
      url,
    }),
    html: render(page.path),
  });
  await writeFile(path.join(DIST, `${page.path.slice(1)}.html`), document);
}

await writeFile(
  path.join(DIST, "404.html"),
  toDocument({
    head: toHead({
      title: `Page not found · ${SITE_NAME}`,
      description: "This page does not exist.",
      url: null,
    }),
    html: render(NOT_FOUND_URL),
  })
);

const sitemapEntries = DOC_PAGES.map(
  (page) => `  <url>\n    <loc>${siteUrl}${page.path}</loc>\n  </url>`
).join("\n");

await writeFile(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
);

await writeFile(
  path.join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);

await rm(SERVER_DIST, { recursive: true, force: true });

console.log(
  `Prerendered ${DOC_PAGES.length} pages, 404.html, sitemap.xml and robots.txt for ${siteUrl}, analytics ${gaMeasurementId ?? "off"}`
);

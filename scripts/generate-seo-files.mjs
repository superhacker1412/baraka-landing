import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(rootDir, "src/lib/seo-routes.json");
const publicDir = resolve(rootDir, "public");
const config = JSON.parse(await readFile(configPath, "utf8"));

const siteOrigin = normalizeOrigin(
  process.env.VITE_SITE_URL || process.env.SITE_URL || config.siteUrl,
);
const lastmod = process.env.SITEMAP_LASTMOD || new Date().toISOString().slice(0, 10);

function normalizeOrigin(value) {
  return String(value || "https://barakalisavdo.uz").replace(/\/+$/, "");
}

function normalizePath(path) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function pageUrl(path, locale) {
  const normalizedPath = normalizePath(path);
  const url = `${siteOrigin}${normalizedPath}`;
  return locale && locale !== config.defaultLocale ? `${url}?lang=${locale}` : url;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatPriority(priority) {
  const trimmed = Number(priority)
    .toFixed(2)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
  return trimmed.includes(".") ? trimmed : `${trimmed}.0`;
}

const urls = config.pages
  .map((page) => {
    const alternates = config.locales
      .map(
        (locale) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(locale.hreflang)}" href="${escapeXml(
            pageUrl(page.path, locale.code),
          )}" />`,
      )
      .join("\n");

    return `  <url>
    <loc>${escapeXml(pageUrl(page.path))}</loc>
    <lastmod>${escapeXml(page.lastmod || lastmod)}</lastmod>
    <changefreq>${escapeXml(page.changefreq || "weekly")}</changefreq>
    <priority>${formatPriority(page.priority ?? 0.7)}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(pageUrl(page.path))}" />
  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteOrigin}/sitemap.xml
`;

await writeFile(resolve(publicDir, "sitemap.xml"), sitemap, "utf8");
await writeFile(resolve(publicDir, "robots.txt"), robots, "utf8");

console.log(`Generated public/sitemap.xml and public/robots.txt for ${siteOrigin}`);

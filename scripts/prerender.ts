import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getNotteContent, getOpeningHours } from "../app/content/notte.de";
import { getRouteSeo } from "../app/content/seo";
import { locales, pathFor, siteContent, type Locale, type PageKey } from "../app/content/site-content";

const outputDirectory = new URL("../dist/", import.meta.url);
const outputPath = fileURLToPath(outputDirectory);
const template = await readFile(new URL("index.html", outputDirectory), "utf8");
const pageKeys: PageKey[] = ["home", "menu", "restaurant", "events", "contact"];
const configuredSiteUrl = process.env.SITE_URL?.trim().replace(/\/$/, "");

for (const locale of locales) {
  for (const pageKey of pageKeys) {
    const routePath = pathFor(locale, pageKey);
    const html = renderDocument(locale, pageKey, routePath);
    const target = join(outputPath, routePath, "index.html");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
  }
}

await writeFile(new URL("index.html", outputDirectory), renderDocument("de", "home", "/de"));
await writeRobotsAndSitemap();

console.info(`Prerendered ${locales.length * pageKeys.length} localized routes${configuredSiteUrl ? " with canonical URLs and sitemap" : " without canonical URLs (SITE_URL is not set)"}.`);

function renderDocument(locale: Locale, pageKey: PageKey, routePath: string): string {
  const seo = getRouteSeo(locale, pageKey);
  const absoluteUrl = configuredSiteUrl ? `${configuredSiteUrl}${routePath}` : undefined;
  const head = [
    `<meta name="description" content="${escapeAttribute(seo.description)}" />`,
    '<meta name="robots" content="index,follow" />',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeAttribute(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}" />`,
    `<meta property="og:locale" content="${seo.localeTag}" />`,
    '<meta property="og:site_name" content="Ristorante Colosseo" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    absoluteUrl ? `<meta property="og:url" content="${escapeAttribute(absoluteUrl)}" />` : "",
    absoluteUrl ? `<link rel="canonical" href="${escapeAttribute(absoluteUrl)}" />` : "",
    ...renderAlternateLinks(pageKey),
    `<script type="application/ld+json">${renderStructuredData(locale, absoluteUrl)}</script>`,
  ].filter(Boolean).join("\n    ");

  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${locale}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>\n    ${head}`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${renderRouteContent(locale, pageKey)}</div>`);
}

function renderAlternateLinks(pageKey: PageKey): string[] {
  if (!configuredSiteUrl) return [];
  const links = locales.map((locale) => `<link rel="alternate" hreflang="${locale}" href="${configuredSiteUrl}${pathFor(locale, pageKey)}" />`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${configuredSiteUrl}${pathFor("de", pageKey)}" />`);
  return links;
}

function renderRouteContent(locale: Locale, pageKey: PageKey): string {
  if (pageKey === "home") return renderHomeContent(locale);
  const page = siteContent[locale].pages[pageKey];
  return `<main class="seo-prerender" id="main-content"><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.intro)}</p>${page.sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("")}</main>`;
}

function renderHomeContent(locale: Locale): string {
  const content = getNotteContent(locale);
  return `<main class="seo-prerender" id="main-content">
    <h1>${escapeHtml(content.hero.title)}</h1>
    <section><h2>${escapeHtml(content.welcome.title)}</h2><p>${escapeHtml(content.welcome.body)}</p></section>
    <section><h2>${escapeHtml(content.family.title)}</h2><p>${escapeHtml(content.family.body)}</p></section>
    <section><h2>${escapeHtml(content.events.title)}</h2><p>${escapeHtml(content.events.body)}</p></section>
    <section><h2>${escapeHtml(content.reservation.title)}</h2><p>${escapeHtml(content.reservation.body)}</p></section>
    <section><h2>${escapeHtml(content.visit.contact)}</h2><address>${escapeHtml(content.visit.addressLine1)}<br />${escapeHtml(content.visit.addressLine2)}<br />${escapeHtml(content.visit.phone)}</address><h3>${escapeHtml(content.visit.hours)}</h3><dl>${getOpeningHours(locale).map(([day, hours]) => `<div><dt>${escapeHtml(day)}</dt><dd>${escapeHtml(hours)}</dd></div>`).join("")}</dl></section>
  </main>`;
}

function renderStructuredData(locale: Locale, url: string | undefined): string {
  const content = getNotteContent(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ristorante Colosseo",
    url,
    telephone: "+49417162952",
    address: {
      "@type": "PostalAddress",
      streetAddress: content.visit.addressLine1,
      postalCode: "21423",
      addressLocality: "Winsen (Luhe)",
      addressCountry: "DE",
    },
    servesCuisine: "Italian",
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

async function writeRobotsAndSitemap(): Promise<void> {
  const robots = ["User-agent: *", "Allow: /", "Disallow: /admin"];
  if (configuredSiteUrl) {
    const routes = locales.flatMap((locale) => pageKeys.map((pageKey) => `${configuredSiteUrl}${pathFor(locale, pageKey)}`));
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
    await writeFile(new URL("sitemap.xml", outputDirectory), sitemap);
    robots.push(`Sitemap: ${configuredSiteUrl}/sitemap.xml`);
  }
  await writeFile(new URL("robots.txt", outputDirectory), `${robots.join("\n")}\n`);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

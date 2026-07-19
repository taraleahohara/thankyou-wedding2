/**
 * Bake per-route link-preview meta into the built site.
 *
 * Runs after `vite build`. For each entry in scripts/og-routes.mjs it replaces
 * the <!--OG:START-->…<!--OG:END--> block of dist/index.html with that route's
 * tags and writes the result to dist/<route>/index.html. Vercel serves those
 * static files directly (a filesystem match wins over the catch-all rewrite in
 * vercel.json), so crawlers get the right title/image while the SPA still boots
 * normally from every file.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ogRoutes, SITE_URL } from "./og-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");

const START = "<!--OG:START-->";
const END = "<!--OG:END-->";

const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function metaBlock(route) {
  const canonical = route.path === "/" ? SITE_URL : SITE_URL + route.path;
  const title = esc(route.title);
  const desc = esc(route.description);
  const image = esc(route.image);
  const url = esc(canonical);
  return [
    START,
    `    <title>${title}</title>`,
    `    <meta name="description" content="${desc}" />`,
    `    <meta name="author" content="Tara &amp; Daniel" />`,
    `    <link rel="canonical" href="${url}" />`,
    ``,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${desc}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:image" content="${image}" />`,
    ``,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${desc}" />`,
    `    <meta name="twitter:image" content="${image}" />`,
    `    ${END}`,
  ].join("\n");
}

const template = await readFile(join(distDir, "index.html"), "utf8");
const startAt = template.indexOf(START);
const endAt = template.indexOf(END);
if (startAt === -1 || endAt === -1) {
  throw new Error(
    "OG markers not found in dist/index.html — did index.html lose its <!--OG:START-->/<!--OG:END--> comments?"
  );
}
const before = template.slice(0, startAt);
const after = template.slice(endAt + END.length);

for (const route of ogRoutes) {
  const html = before + metaBlock(route) + after;
  if (route.path === "/") {
    await writeFile(join(distDir, "index.html"), html);
  } else {
    const dir = join(distDir, route.path);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html);
  }
  console.log(`prerendered OG meta → ${route.path}`);
}

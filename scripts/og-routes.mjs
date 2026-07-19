/**
 * Per-route Open Graph / link-preview metadata.
 *
 * Consumed at build time by scripts/prerender-og.mjs, which bakes these tags
 * into each route's own static index.html. Link-preview crawlers (iMessage,
 * WhatsApp, Slack, Facebook) don't run JS, so the client-side `ogImage` in
 * src/data/chapters.tsx never reaches them — this table does.
 *
 * Keep in sync with src/data/chapters.tsx when a chapter's share image,
 * title, or blurb changes. These are share-preview copy, not on-page copy,
 * so proper-case sentences are intentional (they show inside messaging apps).
 */

export const SITE_URL = "https://taradaniel.life";

/**
 * Size/format a Cloudinary image for link previews: 1080px wide, jpg, auto
 * quality. 1080px stays comfortably above the 600px preview minimum while
 * keeping the file under WhatsApp's ~300KB cache cap (a detailed 1200px shot
 * can spill past it). Non-Cloudinary URLs (local /images) pass through
 * untouched.
 */
function ogVariant(url) {
  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const at = i + marker.length;
  return `${url.slice(0, at)}f_jpg,q_auto,w_1080,c_limit/${url.slice(at)}`;
}

export const ogRoutes = [
  {
    // Homepage — rewrites the root dist/index.html in place.
    path: "/",
    title: "Tara & Daniel - Our Life",
    description:
      "Moments from our life together - our wedding, honeymoon, and everything in between.",
    image: `${SITE_URL}/images/homepage/newhpheader.png`,
  },
  {
    path: "/wedding",
    title: "Tara & Daniel's Wedding",
    description:
      "Our favourite moments from October 4th, 2025 - the best day of our lives.",
    image: ogVariant(
      "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767394827/AP1-6.jpg"
    ),
  },
  {
    path: "/honeymoon",
    title: "Tara & Daniel's Honeymoon",
    description:
      "Our honeymoon through Sri Lanka - ancient cities, misty mountains, and sunlit coastlines.",
    image: ogVariant(
      "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767633211/IMG_3498_bsco2c.jpg"
    ),
  },
  {
    path: "/pets",
    title: "Phoebe & Penny, Our Creatures",
    description:
      "The permanent collection of our creatures - Phoebe the dog and Penny the cat.",
    image: `${SITE_URL}/images/before/AMY_8989_phoebe.jpg`,
  },
];

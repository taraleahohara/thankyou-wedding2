/**
 * POST /api/pets/sign-upload — the curators' gate for adding photos.
 *
 * The pets page is public, but uploading into the collection is limited to
 * the two curators. The client sends a Google Sign-In ID token; this
 * endpoint verifies it with Google, checks the email against the allowlist,
 * and only then returns a signed Cloudinary upload payload (scoped to the
 * Pets folder). The Cloudinary API secret never leaves the server and the
 * client can only upload with parameters we signed.
 *
 * Env (Vercel project settings):
 *   CLOUDINARY_API_SECRET  — required
 *   GOOGLE_CLIENT_ID       — OAuth client ID the site's Sign-In button uses
 *   PETS_UPLOADERS         — comma-separated allowlisted Google emails
 */

import { createHash } from "crypto";

// .trim() throughout: pasted Vercel env values commonly carry a trailing
// newline, which would break the Cloudinary signature.
const CLOUD_NAME = (process.env.CLOUDINARY_CLOUD_NAME || "dbr3xp0bx").trim();
const API_KEY = (process.env.CLOUDINARY_API_KEY || "795228952549794").trim();
const PETS_FOLDER = (process.env.CLOUDINARY_PETS_FOLDER || "Pets").trim();
// Public Client ID (the aud we pin sign-ins to) — committed as the default,
// matching the frontend. Override with GOOGLE_CLIENT_ID if the client changes.
const GOOGLE_CLIENT_ID = (
  process.env.GOOGLE_CLIENT_ID ||
  "545416424508-h6gdqun478ms464e16ebjn0i6rv9f3d1.apps.googleusercontent.com"
).trim();

/**
 * Tags the client may request; anything else is dropped. "phoebe"/"penny" mark
 * who's in the photo; "feature" puts it on the mantel shelf.
 */
const ALLOWED_TAGS = ["phoebe", "penny", "feature"];

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
    setHeader: (name: string, value: string) => void;
  },
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.CLOUDINARY_API_SECRET?.trim();
  const allowlist = (process.env.PETS_UPLOADERS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!secret || allowlist.length === 0) {
    return res.status(500).json({
      error:
        "Upload gate is not configured (CLOUDINARY_API_SECRET and PETS_UPLOADERS must be set)",
    });
  }

  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as
    | { idToken?: string; tags?: unknown }
    | undefined;
  const idToken = body?.idToken;
  if (!idToken || typeof idToken !== "string") {
    return res.status(401).json({ error: "Missing Google ID token" });
  }

  // Verify the token with Google. tokeninfo validates the signature and
  // expiry; we additionally pin the audience to our own OAuth client and
  // require a verified email on the allowlist.
  let tokenInfo: { aud?: string; email?: string; email_verified?: string };
  try {
    const verify = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );
    if (!verify.ok) {
      return res.status(401).json({ error: "Google sign-in could not be verified" });
    }
    tokenInfo = (await verify.json()) as typeof tokenInfo;
  } catch {
    return res.status(502).json({ error: "Could not reach Google to verify sign-in" });
  }

  if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
    return res.status(401).json({ error: "Sign-in came from an unrecognized app" });
  }
  const email = tokenInfo.email?.toLowerCase();
  if (!email || tokenInfo.email_verified !== "true" || !allowlist.includes(email)) {
    return res.status(403).json({ error: "This Google account is not on the curators list" });
  }

  const requestedTags = Array.isArray(body?.tags) ? (body!.tags as unknown[]) : [];
  const tags = ALLOWED_TAGS.filter((tag) => requestedTags.includes(tag)).join(",");

  // Cloudinary signature: params sorted alphabetically, joined with "&",
  // then the API secret appended, SHA-1 hexed. Must exactly match the
  // parameters the client sends with the file.
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = {
    folder: PETS_FOLDER,
    timestamp,
    ...(tags ? { tags } : {}),
  };
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + secret).digest("hex");

  return res.status(200).json({
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    folder: PETS_FOLDER,
    timestamp,
    tags,
    signature,
  });
}

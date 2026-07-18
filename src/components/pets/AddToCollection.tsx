import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { PetPhoto } from "@/hooks/usePetsPhotos";
import { PawPrint } from "./doodles";

/**
 * "add to the collection" — the page's one marigold moment.
 *
 * The page is public; adding photos is curators-only. Clicking the button
 * opens a small gate: sign in with Google, and the serverless endpoint
 * (/api/pets/sign-upload) checks the account against the allowlist before
 * signing a Cloudinary upload scoped to the Pets folder. The signed upload
 * goes browser → Cloudinary directly; the API secret never reaches the client.
 */

// A Google Web-application Client ID is public by design (it ships in every
// frontend), so it's committed as the default here. This is the Waypoints
// OAuth client, reused; override with VITE_GOOGLE_CLIENT_ID if ever needed.
// The private half is the allowlist (PETS_UPLOADERS, server-side only).
const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
  "545416424508-h6gdqun478ms464e16ebjn0i6rv9f3d1.apps.googleusercontent.com";
const TOKEN_KEY = "pets-curator-token";

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleAccountsId } };
  }
}

/** Load the Google Identity Services script once. */
let gisPromise: Promise<GoogleAccountsId> | null = null;
function loadGoogleIdentity(): Promise<GoogleAccountsId> {
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const existing = window.google?.accounts?.id;
      if (existing) return resolve(existing);
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        const api = window.google?.accounts?.id;
        if (api) resolve(api);
        else reject(new Error("Google Identity failed to initialize"));
      };
      script.onerror = () => reject(new Error("Google Identity script failed to load"));
      document.head.appendChild(script);
    });
    gisPromise.catch(() => {
      gisPromise = null;
    });
  }
  return gisPromise;
}

interface AddToCollectionProps {
  onUploaded: (photos: PetPhoto[]) => void;
}

const AddToCollection = ({ onUploaded }: AddToCollectionProps) => {
  const [open, setOpen] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(
    () => sessionStorage.getItem(TOKEN_KEY),
  );
  const [files, setFiles] = useState<File[]>([]);
  const [tagPhoebe, setTagPhoebe] = useState(true);
  const [tagPenny, setTagPenny] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const signInRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Render the official Google button into the gate when sign-in is needed.
  useEffect(() => {
    if (!open || idToken || !GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    loadGoogleIdentity()
      .then((api) => {
        if (cancelled || !signInRef.current) return;
        api.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => {
            sessionStorage.setItem(TOKEN_KEY, credential);
            setIdToken(credential);
          },
        });
        signInRef.current.replaceChildren();
        api.renderButton(signInRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "signin_with",
        });
      })
      .catch(() => {
        if (!cancelled) toast.error("Google sign-in could not load. Try again in a moment.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, idToken]);

  const close = () => {
    if (uploading) return;
    setOpen(false);
    setFiles([]);
  };

  const handleUpload = async () => {
    if (!idToken || files.length === 0) return;
    const tags = [...(tagPhoebe ? ["phoebe"] : []), ...(tagPenny ? ["penny"] : [])];
    if (tags.length === 0) {
      toast.error("Pick who's in the photos: phoebe, penny, or both.");
      return;
    }

    setUploading(true);
    setUploadedCount(0);
    try {
      const signResponse = await fetch("/api/pets/sign-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, tags }),
      });
      if (signResponse.status === 401) {
        // Token expired (Google ID tokens last ~1h) — sign in again.
        sessionStorage.removeItem(TOKEN_KEY);
        setIdToken(null);
        toast.error("Your sign-in expired. Sign in again and retry.");
        return;
      }
      if (signResponse.status === 403) {
        sessionStorage.removeItem(TOKEN_KEY);
        setIdToken(null);
        toast.error("That Google account isn't on the curators list.");
        return;
      }
      if (!signResponse.ok) {
        const body = (await signResponse.json().catch(() => null)) as { error?: string } | null;
        toast.error(body?.error || "The upload gate isn't reachable right now.");
        return;
      }
      const signed = (await signResponse.json()) as {
        cloudName: string;
        apiKey: string;
        folder: string;
        timestamp: number;
        tags: string;
        signature: string;
      };

      const hung: PetPhoto[] = [];
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", signed.apiKey);
        form.append("timestamp", String(signed.timestamp));
        form.append("signature", signed.signature);
        form.append("folder", signed.folder);
        if (signed.tags) form.append("tags", signed.tags);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
          { method: "POST", body: form },
        );
        if (!uploadResponse.ok) {
          toast.error(`"${file.name}" didn't make it. Try that one again.`);
          continue;
        }
        const asset = (await uploadResponse.json()) as {
          public_id: string;
          secure_url: string;
          width: number;
          height: number;
          tags?: string[];
          created_at?: string;
        };
        hung.push({
          id: asset.public_id,
          url: asset.secure_url,
          width: asset.width,
          height: asset.height,
          tags: asset.tags || tags,
          caption: null,
          createdAt: asset.created_at,
        });
        setUploadedCount(hung.length);
      }

      if (hung.length > 0) {
        onUploaded(hung);
        toast.success(
          hung.length === 1
            ? "One photo hung in the collection."
            : `${hung.length} photos hung in the collection.`,
        );
        setFiles([]);
        setOpen(false);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sketchchip inline-flex items-center gap-2 bg-marigold text-ink px-4 py-2 u-label font-semibold tracking-[0.16em] shadow-[2px_2px_0_hsl(var(--ink)/0.25)] transition-transform duration-1 ease-paper hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
      >
        <PawPrint className="w-4 h-4" />
        add to the collection
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Add to the collection"
          onClick={close}
        >
          <div
            className="sketchbox bg-parchment w-full max-w-md px-7 py-7 relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 p-1.5 text-ink/60 hover:text-ink transition-colors duration-1 ease-paper"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="u-label text-copper">curators only</p>

            {!GOOGLE_CLIENT_ID ? (
              <p className="font-body text-ink/70 mt-3">
                Uploads aren't switched on yet. The Google sign-in for this
                site still needs to be configured.
              </p>
            ) : !idToken ? (
              <>
                <p className="font-body text-ink/80 mt-3 mb-5">
                  Adding to the collection is reserved for the two people who
                  buy the treats. Sign in and we'll check the list.
                </p>
                <div ref={signInRef} className="flex justify-center min-h-[44px]" />
              </>
            ) : (
              <>
                <p className="font-body text-ink/80 mt-3">
                  Photos go straight into the collection, and they'll be on the
                  page right away.
                </p>

                <div className="flex items-center gap-2.5 mt-5">
                  <span className="u-label text-ink/60">who's in them</span>
                  <button
                    type="button"
                    onClick={() => setTagPhoebe((v) => !v)}
                    aria-pressed={tagPhoebe}
                    className={`sketchchip px-3.5 py-1 u-label tracking-[0.14em] transition-colors duration-1 ease-paper ${
                      tagPhoebe ? "bg-olive border-olive text-paper" : "text-ink"
                    }`}
                  >
                    phoebe
                  </button>
                  <button
                    type="button"
                    onClick={() => setTagPenny((v) => !v)}
                    aria-pressed={tagPenny}
                    className={`sketchchip px-3.5 py-1 u-label tracking-[0.14em] transition-colors duration-1 ease-paper ${
                      tagPenny ? "bg-olive border-olive text-paper" : "text-ink"
                    }`}
                  >
                    penny
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) =>
                    setFiles(Array.from(event.target.files || []))
                  }
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 w-full border border-dashed border-ink/30 rounded-lg px-4 py-6 text-center font-hand text-xl text-ink/70 hover:border-ink/60 transition-colors duration-1 ease-paper"
                >
                  {files.length === 0
                    ? "choose photos…"
                    : files.length === 1
                      ? files[0].name
                      : `${files.length} photos chosen`}
                </button>

                <button
                  type="button"
                  disabled={files.length === 0 || uploading}
                  onClick={handleUpload}
                  className="sketchchip mt-5 w-full bg-marigold text-ink px-4 py-2.5 u-label font-semibold tracking-[0.16em] disabled:opacity-40 transition-opacity duration-1 ease-paper"
                >
                  {uploading
                    ? `hanging ${uploadedCount + 1} of ${files.length}…`
                    : files.length > 1
                      ? `hang ${files.length} photos`
                      : "hang it in the collection"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCollection;

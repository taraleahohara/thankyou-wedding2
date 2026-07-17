import { useCallback, useEffect, useState } from "react";

/** One photo in the pets collection, as returned by /api/pets/photos. */
export interface PetPhoto {
  id: string;
  url: string;
  width?: number;
  height?: number;
  tags: string[];
  caption?: string | null;
  createdAt?: string;
}

interface PetsPhotosState {
  photos: PetPhoto[];
  loading: boolean;
  /** True when the live listing could not be reached (shows a gentle note). */
  unavailable: boolean;
}

/**
 * The pets collection is listed live from Cloudinary via /api/pets/photos
 * (CDN-cached ~5 min), so uploads appear without a rebuild. In `vite dev`
 * there is no /api, so development falls back to a small local manifest.
 *
 * `appendPhotos` lets the upload flow show new photos immediately —
 * Cloudinary's search index (and our CDN cache) can lag a fresh upload.
 */
export function usePetsPhotos() {
  const [state, setState] = useState<PetsPhotosState>({
    photos: [],
    loading: true,
    unavailable: false,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch("/api/pets/photos");
      if (!response.ok) throw new Error(`listing failed: ${response.status}`);
      const data = (await response.json()) as { photos?: PetPhoto[] };
      setState({ photos: data.photos || [], loading: false, unavailable: false });
    } catch {
      if (import.meta.env.DEV) {
        const { devPetsPhotos } = await import("@/data/petsPhotos.dev");
        setState({ photos: devPetsPhotos, loading: false, unavailable: false });
        return;
      }
      setState({ photos: [], loading: false, unavailable: true });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const appendPhotos = useCallback((newPhotos: PetPhoto[]) => {
    setState((prev) => ({
      ...prev,
      // Newest first, matching the API's sort order.
      photos: [...newPhotos, ...prev.photos],
    }));
  }, []);

  return { ...state, refetch: load, appendPhotos };
}

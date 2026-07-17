// Development-only fallback for the pets collection.
//
// `vite dev` has no /api routes (they only exist on Vercel), so the live
// listing fetch fails locally. This stand-in keeps the page fully viewable
// in development. It is lazy-imported by usePetsPhotos only when
// import.meta.env.DEV is true, so it never ships in the production bundle.

import type { PetPhoto } from "@/hooks/usePetsPhotos";

const phoebe = "/images/before/AMY_8989_phoebe.jpg";

export const devPetsPhotos: PetPhoto[] = [
  {
    id: "dev-1",
    url: phoebe,
    width: 1600,
    height: 1067,
    tags: ["phoebe"],
    caption: "sun patch, claimed",
    createdAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "dev-2",
    url: phoebe,
    width: 1600,
    height: 1067,
    tags: ["phoebe"],
    caption: null,
    createdAt: "2026-06-20T00:00:00Z",
  },
  {
    id: "dev-3",
    url: phoebe,
    width: 1600,
    height: 1067,
    tags: ["penny"],
    caption: "balcony surveillance",
    createdAt: "2026-06-12T00:00:00Z",
  },
  {
    id: "dev-4",
    url: phoebe,
    width: 1600,
    height: 1067,
    tags: ["phoebe", "penny"],
    caption: "a rare truce",
    createdAt: "2026-05-30T00:00:00Z",
  },
  {
    id: "dev-5",
    url: phoebe,
    width: 1600,
    height: 1067,
    tags: ["phoebe"],
    caption: "the hole was already there",
    createdAt: "2026-05-18T00:00:00Z",
  },
  {
    id: "dev-6",
    url: phoebe,
    width: 1600,
    height: 1067,
    tags: ["penny"],
    caption: null,
    createdAt: "2026-05-02T00:00:00Z",
  },
];

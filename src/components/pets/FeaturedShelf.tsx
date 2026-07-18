import { useMemo, useState } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";
import CloudinaryImage from "@/components/CloudinaryImage";
import type { PetPhoto } from "@/hooks/usePetsPhotos";
import SketchFrame from "./SketchFrame";
import { AnnotArrow } from "./doodles";
import { petPhotoAlt } from "./petsAlt";

/**
 * "The mantel" — the featured shelf (design round three, option a).
 *
 * A painted band of the chapter's sage wash with rough hand-torn edges.
 * Six honours (three of Phoebe, three of Penny, dealt at random each visit
 * from the photos tagged `feature`) stand on a hand-drawn shelf, slightly
 * crooked, captions hanging beneath the shelf line like little tags.
 * Whatever hangs here sits out of the feed below for the visit.
 */

/** Frame heights cycle — mixed sizes so the shelf reads propped, not typeset. */
const HEIGHTS = [150, 132, 163, 149, 140, 126] as const;
const ROTATIONS = [-1.2, 1.4, -0.8, 1, -1.4, 0.8] as const;

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Deal the shelf: up to three of each creature from the feature pool,
 * shuffled fresh per call (per page visit), interleaved for display.
 * A photo of both creatures counts for whichever hand drew it first.
 */
export function dealShelf(photos: PetPhoto[]): PetPhoto[] {
  const pool = photos.filter((photo) => (photo.tags || []).includes("feature"));
  const picked = new Set<string>();
  const takeThree = (creature: string): PetPhoto[] => {
    const options = shuffle(
      pool.filter((photo) => (photo.tags || []).includes(creature) && !picked.has(photo.id)),
    ).slice(0, 3);
    options.forEach((photo) => picked.add(photo.id));
    return options;
  };
  const phoebe = takeThree("phoebe");
  const penny = takeThree("penny");
  const interleaved: PetPhoto[] = [];
  for (let i = 0; i < 3; i++) {
    if (phoebe[i]) interleaved.push(phoebe[i]);
    if (penny[i]) interleaved.push(penny[i]);
  }
  return interleaved;
}

/** Rough hand-torn band edge; flip vertically for the bottom. */
const TornEdge = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 1200 14"
    preserveAspectRatio="none"
    className="block w-full h-3.5"
    style={flip ? { transform: "scaleY(-1)" } : undefined}
    aria-hidden="true"
  >
    <path
      d="M0 13 C 90 5, 180 10, 290 7 C 400 4, 520 11, 640 8 C 760 5, 880 10, 1000 6 C 1080 4, 1150 9, 1200 7 L1200 14 L0 14 Z"
      fill="hsl(var(--wash))"
    />
  </svg>
);

interface FeaturedShelfProps {
  /** Already-dealt shelf photos, in display order. Renders nothing if empty. */
  photos: PetPhoto[];
}

const FeaturedShelf = ({ photos }: FeaturedShelfProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const lightboxPhotos = useMemo(
    () =>
      photos.map((photo, index) => ({
        id: photo.id,
        url: photo.url,
        alt: petPhotoAlt(photo, index),
        caption: photo.caption ?? null,
        downloadUrl: photo.url,
      })),
    [photos],
  );

  if (photos.length === 0) return null;

  return (
    <section
      aria-label="On display — featured photos"
      className="relative left-1/2 -translate-x-1/2 w-screen mt-12"
    >
      <TornEdge />
      <div className="bg-wash">
        <div className="max-w-5xl mx-auto px-6 pt-1 pb-12">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="u-label text-brand">on display — six from the collection</span>
            <span className="font-hand text-copper-bright text-lg md:text-xl -rotate-2 inline-block">
              <AnnotArrow className="inline-block w-9 h-7 align-middle -mr-1" />
              different every visit
            </span>
          </div>

          {/* The shelf centers when it fits and scrolls sideways when it
              doesn't (six landscape photos outgrow any container) — a shelf
              extending off the page reads better than shrunken frames. */}
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="w-max min-w-full mx-auto">
              <div className="flex items-end justify-center gap-5 md:gap-6 pt-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative shrink-0"
                    style={{ transform: `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)` }}
                  >
                    <SketchFrame variant={index % 2 === 0 ? "box" : "corners"}>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className="block cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
                        aria-label={`View enlarged ${petPhotoAlt(photo, index)}`}
                      >
                        <CloudinaryImage
                          src={photo.url}
                          alt={petPhotoAlt(photo, index)}
                          width={photo.width}
                          height={photo.height}
                          loading={index < 3 ? "eager" : "lazy"}
                          sizes="250px"
                          className="block w-auto"
                          style={{ height: HEIGHTS[index % HEIGHTS.length] }}
                        />
                      </button>
                    </SketchFrame>
                    {photo.caption && (
                      <span
                        className="font-hand text-base md:text-lg text-ink/70 absolute top-full left-1/2 -translate-x-1/2 w-max max-w-44 mt-3.5 text-center leading-tight"
                        aria-hidden="true"
                      >
                        {photo.caption}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* The shelf line the frames stand on, with support brackets. */}
              <svg
                viewBox="0 0 900 20"
                preserveAspectRatio="none"
                className="block w-full h-5 -mt-0.5"
                aria-hidden="true"
              >
                <path
                  d="M6 6 C 200 4.5, 450 7, 894 5.5"
                  fill="none"
                  stroke="hsl(var(--ink))"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M60 7 l14 8 M846 7 l-14 8"
                  fill="none"
                  stroke="hsl(var(--ink))"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <TornEdge flip />

      {selectedIndex !== null && (
        <PhotoLightbox
          photos={lightboxPhotos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
          variant="archive"
          allowDownload
        />
      )}
    </section>
  );
};

export default FeaturedShelf;

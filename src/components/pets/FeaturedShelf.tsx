import { useEffect, useMemo, useState } from "react";
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
 * from the photos tagged `feature`) stand on hand-drawn shelves, slightly
 * crooked, captions hanging beneath the shelf lines like little tags.
 *
 * The shelf reflows responsively — three across, then two, then a single
 * stack on phones — so every honour always fits with no scrolling: photos
 * fill their column and the band grows to hold them.
 */

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

/** Split the deal into rows of `perRow` for the current breakpoint. */
function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** Photos per shelf at the current width: 3 wide, then 2, then a single stack. */
function usePerRow(): number {
  const read = () => {
    if (typeof window === "undefined") return 3;
    if (window.matchMedia("(min-width: 1024px)").matches) return 3;
    if (window.matchMedia("(min-width: 640px)").matches) return 2;
    return 1;
  };
  const [perRow, setPerRow] = useState(read);
  useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 640px)"),
    ];
    const update = () => setPerRow(read());
    queries.forEach((q) => q.addEventListener("change", update));
    update();
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);
  return perRow;
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

/** The hand-drawn line a shelf's frames stand on, with support brackets. */
const ShelfLine = () => (
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
);

interface ShelfRowProps {
  photos: PetPhoto[];
  /** Index of this row's first photo within the full deal. */
  indexOffset: number;
  /** Columns to lay this row across (matches the breakpoint's perRow). */
  perRow: number;
  /** Priority-load the first shelf's photos. */
  eager: boolean;
  onSelect: (index: number) => void;
}

/**
 * One shelf: a row of frames standing bottom-aligned on a drawn line, with
 * a matching row of handwritten caption tags hanging beneath it. Both rows
 * share the same column template, so captions sit under their photos.
 */
const ShelfRow = ({ photos, indexOffset, perRow, eager, onSelect }: ShelfRowProps) => {
  const columns = { gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` };
  const imageSizes = perRow === 1 ? "88vw" : perRow === 2 ? "44vw" : "30vw";
  const hasAnyCaption = photos.some((photo) => photo.caption);

  return (
    <div>
      <div className="grid items-end gap-4 md:gap-6 justify-items-center" style={columns}>
        {photos.map((photo, rowIndex) => {
          const index = indexOffset + rowIndex;
          return (
            <div
              key={photo.id}
              className="w-full max-w-sm min-w-0"
              style={{ transform: `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)` }}
            >
              <SketchFrame variant={index % 2 === 0 ? "box" : "corners"}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
                  aria-label={`View enlarged ${petPhotoAlt(photo, index)}`}
                >
                  <CloudinaryImage
                    src={photo.url}
                    alt={petPhotoAlt(photo, index)}
                    width={photo.width}
                    height={photo.height}
                    loading={eager ? "eager" : "lazy"}
                    sizes={imageSizes}
                    className="block w-full h-auto"
                  />
                </button>
              </SketchFrame>
            </div>
          );
        })}
      </div>
      <ShelfLine />
      {hasAnyCaption && (
        <div className="grid gap-4 md:gap-6 mt-3 justify-items-center" style={columns}>
          {photos.map((photo) => (
            <span
              key={photo.id}
              className="font-hand text-base md:text-lg text-ink/70 text-center leading-tight px-1"
              aria-hidden="true"
            >
              {photo.caption || ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

interface FeaturedShelfProps {
  /** Already-dealt shelf photos, in display order. Renders nothing if empty. */
  photos: PetPhoto[];
}

const FeaturedShelf = ({ photos }: FeaturedShelfProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const perRow = usePerRow();

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

  const rows = chunk(photos, perRow);

  return (
    <section
      aria-label="On display — featured photos"
      className="relative left-1/2 -translate-x-1/2 w-screen mt-12"
    >
      <TornEdge />
      <div className="bg-wash">
        <div className="max-w-5xl mx-auto px-6 pt-1 pb-12">
          {/* The handwritten label is the whole heading now, so the arrow
              flips to point down at the shelf instead of up at a title. */}
          <span className="font-hand text-copper-bright text-2xl md:text-[1.7rem] -rotate-2 inline-block pt-1">
            on display
            <AnnotArrow className="inline-block w-10 h-8 align-middle -ml-0.5 -scale-y-100 translate-y-3" />
          </span>

          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={rowIndex > 0 ? "mt-10 md:mt-12" : "mt-3"}>
              <ShelfRow
                photos={row}
                indexOffset={rowIndex * perRow}
                perRow={perRow}
                eager={rowIndex === 0}
                onSelect={setSelectedIndex}
              />
            </div>
          ))}
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

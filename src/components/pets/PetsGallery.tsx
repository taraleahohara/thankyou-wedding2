import { useEffect, useMemo, useState } from "react";
import PhotoLightbox from "@/components/PhotoLightbox";
import CloudinaryImage from "@/components/CloudinaryImage";
import type { PetPhoto } from "@/hooks/usePetsPhotos";
import SketchFrame from "./SketchFrame";
import { PawTrailConnector, FadingPawTrail } from "./doodles";
import { petPhotoAlt } from "./petsAlt";

/**
 * The collection itself: a scatter of photos in the chosen frame mix —
 * feature photos (wide slots) wear the sketch box with a handwritten
 * caption; smaller photos wear ink corner brackets. Between rows, a paw
 * trail wanders down the page.
 */

// Desktop scatter recipe on the 12-column grid (from the approved mock).
// One feature + three supporting slots per cycle.
const SLOTS = [
  { start: 1, span: 7, top: 0 },
  { start: 9, span: 4, top: 3.5 },
  { start: 2, span: 4, top: 0.5 },
  { start: 7, span: 5, top: 2.5 },
] as const;

// Slight alternating rotations — pasted in by hand, not typeset.
const ROTATIONS = [-1.2, 1.6, 1.2, -1.8] as const;

// Mobile: stacked with alternating width/alignment (site's existing rhythm).
const MOBILE_SLOTS = [
  { width: "100%", align: "flex-start" },
  { width: "78%", align: "flex-end" },
  { width: "88%", align: "flex-start" },
  { width: "70%", align: "flex-end" },
] as const;

const CONNECTOR_DOODLES = ["bone", "yarn", "none"] as const;

interface PetsGalleryProps {
  photos: PetPhoto[];
  loading: boolean;
  unavailable: boolean;
  /** Label of the active filter, for the empty-state note. */
  filterLabel: string;
}

const PetsGallery = ({ photos, loading, unavailable, filterLabel }: PetsGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="font-hand text-2xl text-ink/60">fetching the collection…</p>
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="py-20 text-center">
        <p className="font-hand text-2xl text-ink/60">
          the collection is napping — check back in a moment.
        </p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <p className="font-hand text-2xl text-ink/60">
          nothing filed under {filterLabel} yet — the first photos are on their way.
        </p>
        <FadingPawTrail className="w-36 h-auto" />
      </div>
    );
  }

  const renderPhoto = (photo: PetPhoto, index: number, isFeature: boolean, rotation: number) => {
    const image = (
      <CloudinaryImage
        src={photo.url}
        alt={petPhotoAlt(photo, index)}
        width={photo.width}
        height={photo.height}
        loading={index < 2 ? "eager" : "lazy"}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`w-full h-auto object-contain ${isFeature ? "" : "shadow-[0_2px_10px_hsl(var(--ink)/0.14)]"}`}
      />
    );

    return (
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        <SketchFrame variant={isFeature ? "box" : "corners"}>
          <button
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
            aria-label={`View enlarged ${petPhotoAlt(photo, index)}`}
          >
            {image}
          </button>
          {isFeature && photo.caption && (
            <figcaption className="font-hand text-lg md:text-xl text-ink/70 text-center pt-2">
              {photo.caption}
            </figcaption>
          )}
        </SketchFrame>
      </div>
    );
  };

  return (
    <>
      {isDesktop ? (
        <div className="grid grid-cols-12 gap-x-4 gap-y-8">
          {photos.map((photo, index) => {
            const slot = SLOTS[index % SLOTS.length];
            const rotation = ROTATIONS[index % ROTATIONS.length];
            const cycle = Math.floor(index / SLOTS.length);
            const endsCycle = index % SLOTS.length === SLOTS.length - 1;
            const hasMore = index < photos.length - 1;
            return (
              <div key={photo.id} className="contents">
                <figure
                  className="m-0"
                  style={{
                    gridColumn: `${slot.start} / span ${slot.span}`,
                    marginTop: `${slot.top}rem`,
                  }}
                >
                  {renderPhoto(photo, index, slot.span >= 7, rotation)}
                </figure>
                {endsCycle && hasMore && (
                  <div className="col-span-12 -my-2">
                    <PawTrailConnector
                      direction={cycle % 2 === 0 ? "right" : "left"}
                      doodle={CONNECTOR_DOODLES[cycle % CONNECTOR_DOODLES.length]}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-9">
          {photos.map((photo, index) => {
            const slot = MOBILE_SLOTS[index % MOBILE_SLOTS.length];
            const rotation = ROTATIONS[index % ROTATIONS.length];
            return (
              <figure
                key={photo.id}
                className="m-0"
                style={{ width: slot.width, alignSelf: slot.align }}
              >
                {renderPhoto(photo, index, slot.width === "100%", rotation)}
              </figure>
            );
          })}
        </div>
      )}

      <div className="mt-14 flex items-center gap-4">
        <span className="font-hand text-xl md:text-2xl text-ink/60">
          the collection keeps growing…
        </span>
        <FadingPawTrail className="w-36 h-auto shrink-0" />
      </div>

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
    </>
  );
};

export default PetsGallery;

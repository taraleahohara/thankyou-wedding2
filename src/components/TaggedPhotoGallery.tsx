import { useState, useMemo, useEffect } from "react";
import { Download, Eye } from "lucide-react";
import PhotoLightbox from "./PhotoLightbox";
import CloudinaryImage from "./CloudinaryImage";
import { getDownloadUrl } from "@/lib/cloudinary";

// Shape of entries in the auto-generated photo manifests (weddingPhotos / honeymoonPhotos)
export interface SourcePhoto {
  id: string;
  url: string;
  width?: number;
  height?: number;
  tags?: string[];
  caption?: string;
}

interface Photo {
  id: string;
  url: string;
  downloadUrl: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string | null;
}

interface TaggedPhotoGalleryProps {
  title: string;
  tag: string;
  categoryIndex: number;
  altPrefix?: string; // Optional prefix for alt text (defaults to title)
  id?: string; // Optional ID for section navigation
  description?: string | React.ReactNode; // Optional description text to display after gallery title
  allowDownload?: boolean; // Whether to show download button (default: true)
  showCaption?: boolean; // Whether to show captions (default: false)
  photos: SourcePhoto[]; // The photo manifest to filter by tag
  eyebrow?: string; // Optional tracked-lowercase overline above the title (archive language)
  frame?: "shadow" | "hairline"; // Thumbnail frame: drop-shadow (default) or hairline border
  layout?: "columns" | "scatter"; // columns (default) = masonry; scatter = staggered editorial layout
  emphasizeTitle?: boolean; // Italicize the last word of the title ("mountains & nature")
}

// Scatter layout: deterministic placement cycle on a 12-column grid —
// varied widths, offsets and stagger, like a magazine spread. Index-based,
// so the layout is stable across renders.
const SCATTER_PATTERN = [
  { start: 1, span: 5, top: 0 },
  { start: 8, span: 4, top: 4 },
  { start: 3, span: 4, top: 3 },
  { start: 8, span: 5, top: 5 },
  { start: 2, span: 3, top: 3.5 },
  { start: 6, span: 6, top: 4.5 },
] as const;

// Mobile scatter: stacked, with alternating width and alignment for a
// gentler version of the same rhythm.
const SCATTER_PATTERN_MOBILE = [
  { width: "100%", align: "flex-start" },
  { width: "78%", align: "flex-end" },
  { width: "88%", align: "flex-start" },
  { width: "70%", align: "flex-end" },
] as const;

// Utility to distribute photos into columns using "Shortest Column First" algorithm
// This minimizes gaps at the bottom by placing each photo in the column with the least current height
const distributePhotosIntoColumns = (photos: Photo[], columnCount: number): Photo[][] => {
  // Initialize columns array
  const columns: Photo[][] = Array.from({ length: columnCount }, () => []);

  // Track the current height of each column
  // Heights are relative based on aspect ratio (assuming all images have same width in column)
  const columnHeights: number[] = Array.from({ length: columnCount }, () => 0);

  // Standard column width (relative unit for height calculation)
  // Since images use w-full, they'll all be same width, so we can use aspect ratio
  const standardWidth = 1; // Relative unit

  photos.forEach((photo) => {
    // Calculate the aspect ratio height for this photo
    // If width/height not available, use default aspect ratio of 4:3
    let aspectRatioHeight: number;

    if (photo.width && photo.height && photo.width > 0 && photo.height > 0) {
      // Calculate height based on aspect ratio (height = width / aspect_ratio)
      // Since all images have same width in column, height is proportional to aspect ratio
      aspectRatioHeight = (photo.height / photo.width) * standardWidth;
    } else {
      // Default to 4:3 aspect ratio if dimensions not available
      aspectRatioHeight = (3 / 4) * standardWidth;
    }

    // Find the column with the minimum current height
    let shortestColumnIndex = 0;
    let minHeight = columnHeights[0];

    for (let i = 1; i < columnCount; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        shortestColumnIndex = i;
      }
    }

    // Add the photo to the shortest column
    columns[shortestColumnIndex].push(photo);

    // Update the column's total height (add photo height + gap)
    // Assuming gap-4 (1rem = 16px) between items, convert to relative units
    const gapHeight = 0.25; // Relative gap height (approximate)
    columnHeights[shortestColumnIndex] += aspectRatioHeight + gapHeight;
  });

  return columns;
};

// Column count for the current viewport (1 mobile / 2 md / 3 lg)
const getColumnCount = (): number => {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
};

const TaggedPhotoGallery = ({
  title,
  tag,
  categoryIndex,
  altPrefix,
  id,
  description,
  allowDownload = true,
  showCaption = false,
  photos: allCloudinaryPhotos,
  eyebrow,
  frame = "shadow",
  layout = "columns",
  emphasizeTitle = false,
}: TaggedPhotoGalleryProps) => {
  const frameClasses =
    frame === "hairline"
      ? "border border-ink/10 transition-colors duration-2 ease-paper group-hover:border-ink/30"
      : "shadow-md transition-all duration-300 group-hover:shadow-xl";
  // Archive pages (hairline frame) use Homestead structure colours on the
  // overlay actions: olive to view, copper to download, pill-shaped.
  // The default (wedding) keeps its existing brand/rounded-lg styling.
  const isArchive = frame === "hairline";
  const viewBtnClasses = isArchive
    ? "bg-olive text-paper rounded-full hover:bg-olive/90"
    : "bg-brand text-white rounded-lg hover:bg-brand/90";
  const downloadBtnClasses = isArchive
    ? "bg-copper text-paper rounded-full hover:bg-copper/90"
    : "bg-brand-alt text-white rounded-lg hover:bg-brand-alt/90";

  // "mountains & nature" → "mountains & <em>nature</em>"
  const displayTitle = (() => {
    if (!emphasizeTitle) return title;
    const lastSpace = title.lastIndexOf(" ");
    if (lastSpace === -1) return <em>{title}</em>;
    return (
      <>
        {title.slice(0, lastSpace + 1)}
        <em>{title.slice(lastSpace + 1)}</em>
      </>
    );
  })();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Filter and map photos from Cloudinary based on the tag
  const photos = useMemo(() => {
    const filtered = (allCloudinaryPhotos || [])
      .filter(photo =>
        photo &&
        photo.tags &&
        Array.isArray(photo.tags) &&
        photo.tags.includes(tag)
      )
      .map((photo, index) => {
        // Use original Cloudinary URL directly - ensure it's a valid URL
        let imageUrl = photo.url;

        // Validate URL format
        if (!imageUrl || !imageUrl.startsWith('http')) {
          imageUrl = ''; // Will trigger error handling
        }

        return {
          id: `${tag}-${index + 1}`,
          url: imageUrl, // Original Cloudinary URL
          downloadUrl: photo.url, // Full resolution for download
          alt: altPrefix
            ? `${altPrefix} ${index + 1}`
            : `${title} ${index + 1}`,
          width: photo.width,
          height: photo.height,
          caption: ('caption' in photo && photo.caption) || null
        };
      })
      // Filter out photos with invalid URLs to prevent holes in the grid
      .filter(photo => photo.url && photo.url.trim() !== '');

    return filtered;
  }, [tag, title, altPrefix, allCloudinaryPhotos]);

  // Filter out failed images from the display
  const validPhotos = useMemo(
    () => photos.filter(photo => !failedImages.has(photo.id)),
    [photos, failedImages]
  );

  // Precomputed id -> index map for lightbox navigation (avoids
  // an O(n) findIndex per photo inside the render loop)
  const photoIndexById = useMemo(() => {
    const map = new Map<string, number>();
    validPhotos.forEach((photo, index) => map.set(photo.id, index));
    return map;
  }, [validPhotos]);

  // Column count driven by matchMedia: fires only when a breakpoint is
  // crossed, instead of a setState on every window resize event.
  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 768px)"),
    ];
    const updateColumnCount = () => setColumnCount(getColumnCount());

    updateColumnCount();
    mediaQueries.forEach(mq => mq.addEventListener("change", updateColumnCount));
    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener("change", updateColumnCount));
    };
  }, []);

  // Distribute photos into columns
  const photoColumns = useMemo(() => {
    return distributePhotosIntoColumns(validPhotos, columnCount);
  }, [validPhotos, columnCount]);

  if (!validPhotos || validPhotos.length === 0) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl text-center mb-12 text-brand-alt">
            {title}
          </h3>
          <p className="text-center text-muted-foreground">No photos available</p>
        </div>
      </section>
    );
  }

  // One photo cell — image, hover overlay, caption — shared by both layouts.
  const renderPhoto = (
    photo: Photo,
    loadingStrategy: "eager" | "lazy",
    captionAlign: "center" | "left",
  ) => {
    const originalIndex = photoIndexById.get(photo.id) ?? 0;

    return (
      <>
        {photo.url ? (
          <CloudinaryImage
            src={photo.url}
            alt={photo.alt}
            loading={loadingStrategy}
            className={`w-full h-auto rounded-lg object-contain ${frameClasses}`}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              // Try to reload with download URL first
              if (e.currentTarget.src !== photo.downloadUrl) {
                e.currentTarget.src = photo.downloadUrl;
              } else {
                // If download URL also fails, remove from grid
                setFailedImages(prev => new Set(prev).add(photo.id));
              }
            }}
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
            Invalid image URL
          </div>
        )}
        {/* Hover/focus overlay: pure CSS (no React state), so
            hovering never re-renders the gallery. Revealed on
            hover (incl. touch-tap :hover emulation) and via
            keyboard focus (focus-within). */}
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center gap-2 sm:gap-4 z-10 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto">
          <button
            onClick={() => setSelectedPhotoIndex(originalIndex)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 transition-colors text-sm sm:text-base ${viewBtnClasses}`}
            aria-label={`View enlarged ${photo.alt}`}
          >
            <Eye size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">View</span>
          </button>
          {allowDownload && (
            <a
              href={getDownloadUrl(photo.downloadUrl)}
              download
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 transition-colors text-sm sm:text-base ${downloadBtnClasses}`}
              aria-label={`Download ${photo.alt}`}
            >
              <Download size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
        </div>
        {showCaption && photo.caption && (
          <div
            className={
              captionAlign === "left"
                ? "mt-2 text-sm italic text-ink/70 text-left"
                : "mt-2 text-sm text-ink text-center"
            }
          >
            {photo.caption}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <section id={id} className="py-16 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          {eyebrow && (
            <p className="u-label text-copper text-center mb-3">{eyebrow}</p>
          )}
          <h3 className="text-4xl md:text-5xl text-center mb-8 text-brand-alt">
            {displayTitle}
          </h3>
          {description && (
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg md:text-xl leading-relaxed text-ink text-center">
                {description}
              </p>
            </div>
          )}
          {layout === "scatter" ? (
            columnCount === 1 ? (
              // Mobile scatter: stacked with alternating width + alignment
              <div className="flex flex-col gap-10">
                {validPhotos.map((photo, index) => {
                  const slot = SCATTER_PATTERN_MOBILE[index % SCATTER_PATTERN_MOBILE.length];
                  return (
                    <div
                      key={photo.id}
                      className="relative group"
                      style={{ width: slot.width, alignSelf: slot.align }}
                    >
                      {renderPhoto(photo, index < 2 ? "eager" : "lazy", "left")}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Desktop scatter: 12-column grid, staggered magazine placement
              <div className="grid grid-cols-12 gap-x-4">
                {validPhotos.map((photo, index) => {
                  const slot = SCATTER_PATTERN[index % SCATTER_PATTERN.length];
                  return (
                    <div
                      key={photo.id}
                      className="relative group"
                      style={{
                        gridColumn: `${slot.start} / span ${slot.span}`,
                        marginTop: `${slot.top}rem`,
                      }}
                    >
                      {renderPhoto(photo, index < 2 ? "eager" : "lazy", "left")}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Masonry layout: flex container with columns */
            <div className="flex gap-4">
              {photoColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex-1 flex flex-col gap-4">
                  {column.map((photo, photoIndex) => {
                    // First few images in the first column load eagerly
                    const shouldLoadEager = columnIndex === 0 && photoIndex < 3;
                    return (
                      <div key={photo.id} className="relative group">
                        {renderPhoto(photo, shouldLoadEager ? "eager" : "lazy", "center")}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={validPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={setSelectedPhotoIndex}
        />
      )}
    </>
  );
};

export default TaggedPhotoGallery;

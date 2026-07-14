import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useEffect } from "react";
import CloudinaryImage from "./CloudinaryImage";
import { getDownloadUrl } from "@/lib/cloudinary";

interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
  /** Full-resolution URL for the download action (archive variant). */
  downloadUrl?: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** "dark" = the original neutral dark chrome (default);
   *  "archive" = the Homestead room: paper surface, ink chrome, olive
   *  structure buttons, copper counter, italic caption. */
  variant?: "dark" | "archive";
  /** Show a download pill (archive variant only). */
  allowDownload?: boolean;
}

const PhotoLightbox = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  variant = "dark",
  allowDownload = false,
}: PhotoLightboxProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  const currentPhoto = photos[currentIndex];
  const isArchive = variant === "archive";

  const overlayClasses = isArchive
    ? "fixed inset-0 z-50 bg-paper/95 backdrop-blur-sm flex flex-col items-center justify-center"
    : "fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center";
  const closeClasses = isArchive
    ? "absolute top-4 right-4 p-2 text-ink border border-ink/20 hover:border-ink/60 rounded-full transition-colors duration-2 ease-paper z-10 bg-paper/60"
    : "absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10";
  const navClasses = isArchive
    ? "p-2 bg-olive text-paper hover:bg-olive/90 rounded-full transition-colors duration-2 ease-paper z-10"
    : "p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10";

  return (
    <div className={overlayClasses}>
      <button onClick={onClose} className={closeClasses} aria-label="Close lightbox">
        <X size={isArchive ? 24 : 32} />
      </button>

      {isArchive && allowDownload && currentPhoto.downloadUrl && (
        <a
          href={getDownloadUrl(currentPhoto.downloadUrl)}
          download
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-olive text-paper rounded-full hover:bg-olive/90 transition-colors duration-2 ease-paper u-label"
          aria-label={`Download ${currentPhoto.alt}`}
        >
          <Download size={16} />
          <span className="hidden sm:inline">download</span>
        </a>
      )}

      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className={`absolute left-4 ${navClasses}`}
          aria-label="Previous photo"
        >
          <ChevronLeft size={isArchive ? 24 : 32} />
        </button>
      )}

      <div className="flex flex-col items-center justify-center max-h-[90vh] max-w-[90vw]">
        <CloudinaryImage
          src={currentPhoto.url}
          alt={currentPhoto.alt}
          className={
            isArchive
              ? "max-h-[82vh] max-w-[90vw] object-contain rounded-lg border border-ink/10"
              : "max-h-[85vh] max-w-[90vw] object-contain"
          }
          loading="eager"
          sizes="90vw"
        />
        {currentPhoto.caption && (
          <div className="mt-4 px-4 text-center max-w-2xl">
            <p
              className={
                isArchive
                  ? "text-sm md:text-base italic text-ink/70"
                  : "text-sm md:text-base text-white"
              }
            >
              {currentPhoto.caption}
            </p>
          </div>
        )}
      </div>

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className={`absolute right-4 ${navClasses}`}
          aria-label="Next photo"
        >
          <ChevronRight size={isArchive ? 24 : 32} />
        </button>
      )}

      <div
        className={
          isArchive
            ? "absolute bottom-4 left-1/2 -translate-x-1/2 u-label text-copper"
            : "absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm"
        }
      >
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
};

export default PhotoLightbox;

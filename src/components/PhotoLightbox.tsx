import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import CloudinaryImage from "./CloudinaryImage";

interface Photo {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const PhotoLightbox = ({ photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) => {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          aria-label="Previous photo"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      <div className="flex flex-col items-center justify-center max-h-[90vh] max-w-[90vw]">
        <CloudinaryImage
          src={currentPhoto.url}
          alt={currentPhoto.alt}
          className="max-h-[85vh] max-w-[90vw] object-contain"
          loading="eager"
          sizes="90vw"
        />
        {currentPhoto.caption && (
          <div className="mt-4 px-4 text-white text-center max-w-2xl">
            <p className="text-sm md:text-base">{currentPhoto.caption}</p>
          </div>
        )}
      </div>

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          aria-label="Next photo"
        >
          <ChevronRight size={32} />
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
};

export default PhotoLightbox;
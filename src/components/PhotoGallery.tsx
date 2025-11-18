import { useState } from "react";
import { Download, Eye } from "lucide-react";
import PhotoLightbox from "./PhotoLightbox";

interface Photo {
  id: string;
  url: string;
  downloadUrl: string;
  alt: string;
}

interface PhotoGalleryProps {
  title: string;
  photos: Photo[];
  categoryIndex: number;
}

const PhotoGallery = ({ title, photos, categoryIndex }: PhotoGalleryProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);

  return (
    <>
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl text-center mb-12 text-wedding-olive">
            {title}
          </h3>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative break-inside-avoid group"
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl"
                />
                {hoveredPhoto === photo.id && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center gap-4 transition-opacity duration-300">
                    <button
                      onClick={() => setSelectedPhotoIndex(index)}
                      className="flex items-center gap-2 px-6 py-3 bg-wedding-rust text-white rounded-lg hover:bg-wedding-rust/90 transition-colors"
                      aria-label={`View enlarged ${photo.alt}`}
                    >
                      <Eye size={20} />
                      <span>View</span>
                    </button>
                    <a
                      href={photo.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-wedding-olive text-white rounded-lg hover:bg-wedding-olive/90 transition-colors"
                      aria-label={`Download ${photo.alt}`}
                    >
                      <Download size={20} />
                      <span>Download</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={setSelectedPhotoIndex}
        />
      )}
    </>
  );
};

export default PhotoGallery;
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { lifeEvents, type LifeEvent } from "@/data/lifeEvents";
import { honeymoonPhotos } from "@/data/honeymoonPhotos";
import { weddingPhotos } from "@/data/weddingPhotos";
import CloudinaryImage from "./CloudinaryImage";

interface RelatedGalleriesProps {
  relatedGalleryIds: string[];
}

// Utility function to get header image for a gallery
const getHeaderImage = (galleryId: string): string | undefined => {
  // Try to extract from gallery-specific photo data
  if (galleryId === "honeymoon") {
    // Find the header image used in Honeymoon page
    const headerImage = honeymoonPhotos.find(photo => 
      photo.url.includes('IMG_3498_bsco2c')
    );
    if (headerImage) {
      return headerImage.url;
    }
  }
  
  if (galleryId === "wedding") {
    // For wedding, we could find a specific header image if needed
    // For now, fallback to lifeEvents
  }
  
  // Fallback to lifeEvents data
  const lifeEvent = lifeEvents.find(event => event.id === galleryId);
  return lifeEvent?.imageUrl;
};

// Format date as "DD.MM.YY" or "ongoing"
const formatDate = (date: string): string => {
  if (date === "ongoing") {
    return "ongoing";
  }
  
  // Parse date string as local date to avoid timezone issues
  // Format: "YYYY-MM-DD"
  const [year, month, day] = date.split('-').map(Number);
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${String(year).slice(-2)}`;
};

// Build link with authentication bypass parameter
const getAuthBypassLink = (galleryId: string): string => {
  if (galleryId === "wedding") {
    return "/wedding?guest=wedding-highlights";
  }
  if (galleryId === "honeymoon") {
    return "/honeymoon?access=honeymoon";
  }
  // Fallback to lifeEvents link
  const lifeEvent = lifeEvents.find(event => event.id === galleryId);
  return lifeEvent?.link || "#";
};

const RelatedGalleries = ({ relatedGalleryIds }: RelatedGalleriesProps) => {
  // Limit to 1-3 galleries
  const galleriesToShow = relatedGalleryIds.slice(0, 3);
  
  if (galleriesToShow.length === 0) {
    return null;
  }
  
  // Get title based on count
  const title = galleriesToShow.length === 1 
    ? "Check out another life moment"
    : "Check out other life moments";
  
  // Get life event data for each gallery
  const galleryData = galleriesToShow
    .map(id => lifeEvents.find(event => event.id === id))
    .filter((event): event is LifeEvent => event !== undefined);
  
  if (galleryData.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 px-6 bg-wedding-rust">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl text-center text-wedding-cream mb-8">
          {title}
        </h2>
        
        <div className={galleryData.length === 1 
          ? "flex justify-center" 
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }>
          {galleryData.map((event) => {
            const headerImage = getHeaderImage(event.id);
            const link = getAuthBypassLink(event.id);
            const formattedDate = formatDate(event.date);
            
            return (
              <div
                key={event.id}
                className={`group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-wedding-rust/20 ${galleryData.length === 1 ? 'w-[300px]' : ''}`}
              >
                {/* Desktop: Entire card is clickable */}
                <Link
                  to={link}
                  className="hidden md:block absolute inset-0 z-30"
                  aria-label={`Go to ${event.title}`}
                />
                
                {/* Content Layer (Background) - Title and Date */}
                <div className="absolute top-0 left-0 right-0 h-[18%] z-0 flex flex-row items-center justify-center gap-3 pt-1 pb-3 px-3 bg-wedding-cream">
                  <span className="text-sm text-muted-foreground">
                    {event.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formattedDate}
                  </span>
                </div>
                
                {/* Image Layer (Foreground) - Slides down to reveal text */}
                <div className="absolute inset-0 z-10 rounded-lg overflow-hidden transition-transform duration-700 ease-out group-hover:translate-y-[12%]">
                  {headerImage && (
                    <CloudinaryImage
                      src={headerImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                
                {/* Go Icon - Bottom Left - Visible on mobile, visible on hover on desktop */}
                <Link
                  to={link}
                  className="absolute bottom-4 left-4 z-20 bg-wedding-rust text-wedding-cream p-2 rounded-full hover:bg-wedding-rust/90 transition-all duration-700 ease-out shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label={`Go to ${event.title}`}
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedGalleries;


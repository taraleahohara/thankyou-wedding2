import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { chapters, type Chapter } from "@/data/chapters";
import CloudinaryImage from "./CloudinaryImage";

interface RelatedGalleriesProps {
  relatedGalleryIds: string[];
}

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

  // Get chapter data for each gallery
  const galleryData = galleriesToShow
    .map(id => chapters.find(chapter => chapter.id === id))
    .filter((chapter): chapter is Chapter => chapter !== undefined);

  if (galleryData.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 bg-brand">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl text-center text-paper mb-8">
          {title}
        </h2>

        <div className={galleryData.length === 1
          ? "flex justify-center"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }>
          {galleryData.map((chapter) => {
            const headerImage = chapter.relatedCardImage || chapter.card.image;
            const link = chapter.magicLink || chapter.path;
            const formattedDate = formatDate(chapter.date);

            return (
              <div
                key={chapter.id}
                className={`group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-brand/20 ${galleryData.length === 1 ? 'w-[300px]' : ''}`}
              >
                {/* Desktop: Entire card is clickable */}
                <Link
                  to={link}
                  className="hidden md:block absolute inset-0 z-30"
                  aria-label={`Go to ${chapter.title}`}
                />

                {/* Content Layer (Background) - Title and Date */}
                <div className="absolute top-0 left-0 right-0 h-[18%] z-0 flex flex-row items-center justify-center gap-3 pt-1 pb-3 px-3 bg-paper">
                  <span className="text-sm text-muted-foreground">
                    {chapter.title}
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
                      alt={chapter.title}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>

                {/* Go Icon - Bottom Left - Visible on mobile, visible on hover on desktop */}
                <Link
                  to={link}
                  className="absolute bottom-4 left-4 z-20 bg-brand text-paper p-2 rounded-full hover:bg-brand/90 transition-all duration-700 ease-out shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label={`Go to ${chapter.title}`}
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

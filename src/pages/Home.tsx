import { useEffect } from "react";
import { chapters } from "@/data/chapters";
import LifeEventCard from "@/components/LifeEventCard";
import { getCloudinaryUrlFromLocalPath } from "@/lib/cloudinary";
import CloudinaryImage from "@/components/CloudinaryImage";

// Helper function to get image URL (Cloudinary if configured, otherwise local)
function getImageUrl(localPath: string): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // If Cloudinary is configured, use it; otherwise use local path
  if (cloudName) {
    return getCloudinaryUrlFromLocalPath(localPath, 'wedding-photos', {
      quality: 'auto',
      format: 'auto',
    });
  }

  // Fallback to local images
  return localPath;
}

const Home = () => {
  // Set page title dynamically
  useEffect(() => {
    document.title = "Tara and Daniel's Life";
  }, []);

  // Filter to only show wedding, honeymoon, and pets
  const displayedEvents = chapters.filter(e =>
    e.id === "wedding" || e.id === "honeymoon" || e.id === "pets"
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="bg-paper shadow-sm border-b border-brand/20">
        <div className="max-w-6xl mx-auto px-6 pt-2 pb-4">
          <div className="flex flex-col items-center">
            <div className="mb-2">
              <CloudinaryImage
                src={getImageUrl("/images/homepage/newhpheader.png")}
                alt="Tara and Daniel"
                className="max-w-72 md:max-w-96 h-auto mx-auto"
                sizes="(max-width: 768px) 288px, 384px"
              />
            </div>
            <div className="text-center max-w-3xl">
              <h1 className="text-4xl md:text-5xl mb-4 text-ink">
                our life.
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Life Events Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-fit">
            {(() => {
              const petsEvent = displayedEvents.find(e => e.id === "pets");
              const otherEvents = displayedEvents.filter(e => e.id !== "pets")
                .sort((a, b) => {
                  if (a.date === "ongoing") return 1;
                  if (b.date === "ongoing") return -1;
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

              // Insert pets at position 2 (third spot)
              const sortedEvents = [
                ...otherEvents.slice(0, 2),
                ...(petsEvent ? [petsEvent] : []),
                ...otherEvents.slice(2)
              ];

              const isOddCount = sortedEvents.length % 2 !== 0;

              return sortedEvents.map((event) => {
                const isPets = event.id === "pets";
                const shouldBeRectangle = isOddCount && isPets;

                return (
                  <div
                    key={event.id}
                    className={shouldBeRectangle ? "w-[300px] md:w-[612px] md:col-span-2" : "w-[300px]"}
                  >
                    <LifeEventCard event={event} isRectangle={shouldBeRectangle} />
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

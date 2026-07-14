import { useEffect } from "react";
import { chapters } from "@/data/chapters";
import LifeEventCard from "@/components/LifeEventCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getImageUrl } from "@/lib/cloudinary";
import CloudinaryImage from "@/components/CloudinaryImage";

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
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* Hero — the illustrated family portrait as the archive's cover plate */}
      <section className="max-w-6xl mx-auto w-full px-6 pt-10 pb-6 md:pt-16 md:pb-10">
        <div className="flex flex-col items-center text-center">
          <p className="u-label text-copper mb-6">the family archive</p>
          <CloudinaryImage
            src={getImageUrl("/images/homepage/newhpheader.png")}
            alt="Tara, Daniel, their dog and cat — an illustrated family portrait"
            className="max-w-72 md:max-w-96 h-auto mx-auto mb-4"
            sizes="(max-width: 768px) 288px, 384px"
          />
          <h1 className="font-display italic text-5xl md:text-7xl text-ink lowercase leading-none mb-4">
            our life.
          </h1>
          <p className="u-label text-muted-foreground max-w-md leading-relaxed">
            milestones, adventures, and our adorable creatures
          </p>
        </div>
      </section>

      {/* Life Events Grid */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1">
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

              return sortedEvents.map((event, i) => {
                const isPets = event.id === "pets";
                const shouldBeRectangle = isOddCount && isPets;

                return (
                  <div
                    key={event.id}
                    className={shouldBeRectangle ? "w-[300px] md:w-[612px] md:col-span-2" : "w-[300px]"}
                  >
                    <LifeEventCard event={event} isRectangle={shouldBeRectangle} index={i + 1} />
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Home;

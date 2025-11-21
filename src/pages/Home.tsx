import { lifeEvents } from "@/data/lifeEvents";
import LifeEventCard from "@/components/LifeEventCard";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="bg-wedding-cream shadow-sm border-b border-wedding-rust/20">
        <div className="max-w-6xl mx-auto px-6 pt-2 pb-4">
          <div className="flex flex-col items-center">
            <div className="mb-2">
              <img 
                src="/images/homepage/newhpheader.png"
                alt="Tara and Daniel"
                className="max-w-72 md:max-w-96 h-auto mx-auto"
              />
            </div>
            <div className="text-center max-w-3xl">
              <h1 className="text-4xl md:text-5xl mb-4 text-wedding-warm-text">
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
              const petsEvent = lifeEvents.find(e => e.id === "pets");
              const otherEvents = lifeEvents.filter(e => e.id !== "pets")
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              
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


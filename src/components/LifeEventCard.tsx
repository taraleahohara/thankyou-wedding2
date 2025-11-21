import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LifeEvent } from "@/data/lifeEvents";

interface LifeEventCardProps {
  event: LifeEvent;
  isRectangle?: boolean;
}

const LifeEventCard = ({ event, isRectangle = false }: LifeEventCardProps) => {
  return (
    <div className={`group relative aspect-square ${isRectangle ? 'md:aspect-[2/1]' : ''} overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-wedding-rust/20 cursor-pointer`}>
      {/* Content Layer (Background) - Title and Date - Always present, revealed as image slides */}
      <div className="absolute top-0 left-0 right-0 h-[18%] z-0 flex flex-row items-center justify-center gap-3 pt-1 pb-3 px-3 bg-wedding-cream">
        <span className="text-sm text-muted-foreground">
          {event.title}
        </span>
        <span className="text-sm text-muted-foreground">
          {event.date === "ongoing" 
            ? "ongoing"
            : (() => {
                const date = new Date(event.date);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = String(date.getFullYear()).slice(-2);
                return `${day}.${month}.${year}`;
              })()
          }
        </span>
      </div>

      {/* Image Layer (Foreground) - Slides down to reveal text */}
      <div className="absolute inset-0 z-10 rounded-lg overflow-hidden transition-transform duration-700 ease-out group-hover:translate-y-[12%]">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Go Icon - Bottom Left - Only visible on hover */}
      <Link
        to={event.link}
        className="absolute bottom-4 left-4 z-20 bg-wedding-rust text-wedding-cream p-2 rounded-full hover:bg-wedding-rust/90 transition-all duration-700 ease-out shadow-lg opacity-0 group-hover:opacity-100"
        aria-label={`Go to ${event.title}`}
      >
        <ArrowRight size={20} />
      </Link>
    </div>
  );
};

export default LifeEventCard;


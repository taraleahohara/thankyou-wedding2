import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Chapter } from "@/data/chapters";
import CloudinaryImage from "./CloudinaryImage";

interface LifeEventCardProps {
  event: Chapter;
  isRectangle?: boolean;
  /** 1-based chapter number shown in the tracked label ("chapter 01"). */
  index?: number;
}

/** "2025-10-04" -> "october 4, 2025"; "ongoing" -> "ongoing". */
function formatArchiveDate(date: string): string {
  if (date === "ongoing") return "ongoing";
  const [year, month, day] = date.split("-").map(Number);
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}

const LifeEventCard = ({ event, isRectangle = false, index }: LifeEventCardProps) => {
  const chapterNo = index != null ? `chapter ${String(index).padStart(2, "0")}` : null;

  return (
    <div
      className={`group relative aspect-square ${isRectangle ? "md:aspect-[2/1]" : ""} overflow-hidden rounded-lg border border-ink/10 transition-colors duration-[var(--dur-2)] ease-[var(--ease-paper)] hover:border-ink/25`}
    >
      {/* Desktop: entire card is clickable */}
      <Link
        to={event.path}
        className="hidden md:block absolute inset-0 z-30"
        aria-label={`go to ${event.title}`}
      />

      {/* Label layer (background) — revealed as the image slides down on hover */}
      <div className="absolute top-0 left-0 right-0 h-[18%] z-0 flex flex-col items-center justify-center gap-0.5 px-3 pb-3 bg-paper">
        {chapterNo && (
          <span className="u-label text-muted-foreground/70 text-[0.6rem]">{chapterNo}</span>
        )}
        <span className="u-label text-ink tracking-[0.14em] text-[0.8rem]">
          {event.title} · {formatArchiveDate(event.date)}
        </span>
      </div>

      {/* Image layer (foreground) — slides down to reveal the label */}
      <div className="absolute inset-0 z-10 rounded-lg overflow-hidden transition-transform duration-[var(--dur-3)] ease-[var(--ease-paper)] group-hover:translate-y-[12%]">
        <CloudinaryImage
          src={event.card.image}
          alt={event.title}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 300px, 612px"
        />
      </div>

      {/* Go pill — visible on mobile, revealed on hover on desktop */}
      <Link
        to={event.path}
        className="absolute bottom-4 left-4 z-20 bg-brand text-paper p-2 rounded-full hover:bg-ink transition-all duration-[var(--dur-2)] ease-[var(--ease-paper)] opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label={`go to ${event.title}`}
      >
        <ArrowRight size={20} />
      </Link>
    </div>
  );
};

export default LifeEventCard;

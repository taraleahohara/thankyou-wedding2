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
  // Homestead shelf rule: the homepage stays calm ivory; each card hints its
  // chapter's colour only in the revealed label rule + hover border.
  const spine = event.spine ? `hsl(${event.spine})` : undefined;

  return (
    <div
      className={`group relative aspect-square ${isRectangle ? "md:aspect-[2/1]" : ""} overflow-hidden rounded-lg border border-ink/10 transition-colors duration-2 ease-paper ${spine ? "hover:border-[color:var(--spine)]" : "hover:border-ink/25"}`}
      style={spine ? ({ "--spine": spine } as React.CSSProperties) : undefined}
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
          <span className="u-label text-copper text-[0.6rem]">{chapterNo}</span>
        )}
        <span className="u-label text-ink tracking-[0.14em] text-[0.8rem]">
          {event.title} · {formatArchiveDate(event.date)}
        </span>
        {spine && (
          <span
            className="block h-0.5 w-8 mt-0.5"
            style={{ background: spine }}
            aria-hidden
          />
        )}
      </div>

      {/* Image layer (foreground) — slides down to reveal the label */}
      <div className="absolute inset-0 z-10 rounded-lg overflow-hidden transition-transform duration-3 ease-paper group-hover:translate-y-[12%]">
        <CloudinaryImage
          src={event.card.image}
          alt={event.title}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 300px, 612px"
        />
      </div>

      {/* Go pill — visible on mobile, revealed on hover on desktop.
          House olive: structure buttons are olive sitewide (Homestead). */}
      <Link
        to={event.path}
        className="absolute bottom-4 left-4 z-20 bg-olive text-paper p-2 rounded-full hover:bg-ink transition-all duration-2 ease-paper opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label={`go to ${event.title}`}
      >
        <ArrowRight size={20} />
      </Link>
    </div>
  );
};

export default LifeEventCard;

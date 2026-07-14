import { useState, useEffect } from "react";
import { List, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

const baseSections: Section[] = [
  { id: "before-ceremony", label: "Before Ceremony" },
  { id: "ceremony", label: "Ceremony" },
  { id: "brunch", label: "Brunch" },
  { id: "after-party", label: "After Party" },
];

interface FloatingGalleryNavProps {
  /** Wedding-only shorthand: appends the "Your Moments" curated section
   *  to the hardcoded wedding sections. Ignored when `sections` is given. */
  hasPersonalizedGallery?: boolean;
  /** Explicit section list — any chapter with multiple gallery sections
   *  passes its own `{ id, label }` list (e.g. honeymoon). */
  sections?: Section[];
  /** Text on the trigger button. Chapters in the archive (lowercase) voice
   *  pass "jump to section"; the wedding keeps its Title Case default. */
  triggerLabel?: string;
}

const FloatingGalleryNav = ({
  hasPersonalizedGallery = false,
  sections: sectionsProp,
  triggerLabel = "Jump to Section",
}: FloatingGalleryNavProps) => {
  const sections = sectionsProp ?? (hasPersonalizedGallery
    ? [...baseSections, { id: "curated-for-you", label: "Your Moments" }]
    : baseSections);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Show button only after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsVisible(scrollY >= 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false); // Close the popover
    
    // Small delay to ensure popover closes before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };

  // Nothing to navigate with a single section (or none).
  if (sections.length < 2 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full",
              "bg-paper/95 backdrop-blur-md",
              "border border-brand-alt/20",
              "text-ink",
              "shadow-lg shadow-brand-alt/10",
              "hover:bg-paper hover:shadow-xl hover:shadow-brand-alt/20",
              "transition-all duration-300",
              "font-medium text-sm"
            )}
            aria-label="Jump to section"
          >
            <List size={18} className="text-brand-alt" />
            <span className="hidden sm:inline">{triggerLabel}</span>
            <ChevronDown 
              size={16} 
              className={cn(
                "text-brand-alt transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          side="top" 
          align="center"
          sideOffset={12}
          className={cn(
            "w-56 p-2",
            "bg-paper/95 backdrop-blur-md",
            "border-brand-alt/20",
            "shadow-xl shadow-brand-alt/20"
          )}
        >
          <div className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-lg",
                  "text-ink text-sm",
                  "hover:bg-brand-alt/10 hover:text-brand-alt",
                  "transition-colors duration-200",
                  "font-medium"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FloatingGalleryNav;


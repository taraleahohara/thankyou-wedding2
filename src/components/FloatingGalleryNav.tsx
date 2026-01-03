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
  hasPersonalizedGallery?: boolean;
}

const FloatingGalleryNav = ({ hasPersonalizedGallery = false }: FloatingGalleryNavProps) => {
  const sections = hasPersonalizedGallery 
    ? [...baseSections, { id: "curated-for-you", label: "Your Moments" }]
    : baseSections;
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

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full",
              "bg-wedding-cream/95 backdrop-blur-md",
              "border border-wedding-olive/20",
              "text-wedding-warm-text",
              "shadow-lg shadow-wedding-olive/10",
              "hover:bg-wedding-cream hover:shadow-xl hover:shadow-wedding-olive/20",
              "transition-all duration-300",
              "font-medium text-sm"
            )}
            aria-label="Jump to section"
          >
            <List size={18} className="text-wedding-olive" />
            <span className="hidden sm:inline">Jump to Section</span>
            <ChevronDown 
              size={16} 
              className={cn(
                "text-wedding-olive transition-transform duration-200",
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
            "bg-wedding-cream/95 backdrop-blur-md",
            "border-wedding-olive/20",
            "shadow-xl shadow-wedding-olive/20"
          )}
        >
          <div className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-lg",
                  "text-wedding-warm-text text-sm",
                  "hover:bg-wedding-olive/10 hover:text-wedding-olive",
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


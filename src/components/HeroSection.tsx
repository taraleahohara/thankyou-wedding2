import FloralDecoration from "./FloralDecoration";
import CloudinaryImage from "./CloudinaryImage";

interface HeroSectionProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  /** "wedding" keeps the Allura + floral treatment; "archive" uses the
   *  family-archive language (Fraunces display, tracked lowercase). */
  variant?: "wedding" | "archive";
  /** Tracked lowercase overline shown above the title (archive only). */
  eyebrow?: string;
}

const HeroSection = ({
  imageUrl,
  title,
  subtitle,
  variant = "wedding",
  eyebrow,
}: HeroSectionProps) => {
  const isArchive = variant === "archive";

  return (
    <section className="relative h-screen overflow-hidden">
      {!isArchive && <FloralDecoration position="top-right" />}
      <CloudinaryImage
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      <div className="absolute bottom-0 left-0 z-10 text-left px-6 pb-6 md:pb-8">
        {isArchive ? (
          <>
            {eyebrow && (
              <p className="u-label text-paper/85 mb-4">{eyebrow}</p>
            )}
            <h1 className="font-display italic lowercase text-7xl md:text-9xl mb-4 text-paper leading-none">
              {title}
            </h1>
            <p className="u-label text-paper/90 text-[0.8rem] tracking-[0.28em]">
              {subtitle}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-7xl md:text-9xl mb-6 text-paper">{title}</h1>
            <p className="text-2xl md:text-3xl font-serif text-paper">{subtitle}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

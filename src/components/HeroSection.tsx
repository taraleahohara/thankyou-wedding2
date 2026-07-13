import FloralDecoration from "./FloralDecoration";
import CloudinaryImage from "./CloudinaryImage";

interface HeroSectionProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const HeroSection = ({ imageUrl, title, subtitle }: HeroSectionProps) => {
  return (
    <section className="relative h-screen overflow-hidden">
      <FloralDecoration position="top-right" />
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
        <h1 className="text-7xl md:text-9xl mb-6 text-paper">
          {title}
        </h1>
        <p className="text-2xl md:text-3xl font-serif text-paper">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

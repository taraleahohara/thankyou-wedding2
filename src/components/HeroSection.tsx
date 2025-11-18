import heroImage from "@/assets/headerimage.jpg";
import FloralDecoration from "./FloralDecoration";

const HeroSection = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      <FloralDecoration position="top-right" />
      <img 
        src={heroImage} 
        alt="Tara and Daniel's Wedding" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      <div className="absolute bottom-0 left-0 z-10 text-left px-6 pb-6 md:pb-8">
        <h1 className="text-7xl md:text-9xl mb-6 text-wedding-cream">
          Tara & Daniel
        </h1>
        <p className="text-2xl md:text-3xl font-serif text-wedding-cream">
          October 4th, 2025
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
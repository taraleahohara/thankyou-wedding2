import CloudinaryImage from "@/components/CloudinaryImage";

interface PlateHeroProps {
  /** wash = pale plate, ink type · band = saturated spine plate, ivory type */
  mode: "wash" | "band";
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

/** Homestead pilot hero: big lowercase title on a colour plate first, the
 *  photograph below it (the Kelsey "title, then image" pattern), joined by
 *  a curved edge — the page's one licensed gesture. */
const PlateHero = ({ mode, eyebrow, title, subtitle, imageUrl }: PlateHeroProps) => {
  const isBand = mode === "band";
  const plate = isBand ? "bg-brand" : "bg-wash";
  const plateFill = isBand ? "text-brand" : "text-wash";

  return (
    <section className="bg-paper">
      <div className={`${plate} px-6 pt-24 pb-10 md:pt-32 md:pb-14 text-center`}>
        <p className={`u-label mb-5 ${isBand ? "text-paper/85" : "text-copper"}`}>
          {eyebrow}
        </p>
        <h1
          className={`font-display italic lowercase text-7xl md:text-9xl leading-none mb-5 ${
            isBand ? "text-paper" : "text-brand"
          }`}
        >
          {title}
        </h1>
        <p className={`u-label text-[0.8rem] tracking-[0.28em] ${isBand ? "text-paper/90" : "text-ink/70"}`}>
          {subtitle}
        </p>
        <div className={`mx-auto mt-8 h-0.5 w-14 ${isBand ? "bg-paper" : "bg-brand"}`} />
      </div>

      {/* Curved edge: the plate colour waving into the paper below. */}
      <svg
        className={`block w-full h-8 md:h-12 -mt-px ${plateFill}`}
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 C360,55 1080,10 1440,45 L1440,0 Z" fill="currentColor" />
      </svg>

      <div className="px-6 pt-10 pb-4 md:pt-14">
        <div className="max-w-5xl mx-auto">
          <CloudinaryImage
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-[80vh] object-cover border border-ink/10"
            loading="eager"
            fetchpriority="high"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      </div>
    </section>
  );
};

export default PlateHero;

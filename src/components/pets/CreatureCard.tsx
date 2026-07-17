import SketchFrame from "./SketchFrame";

export interface Creature {
  /** "the dog" / "the cat" — the tracked overline. */
  kind: string;
  name: string;
  /** "tara's creature first · est. 2017" */
  provenance: string;
  /** Handwritten fact lines. */
  facts: string[];
  portrait: {
    src: string;
    alt: string;
    /** Illustrated portraits render contained on parchment, not cropped. */
    illustrated?: boolean;
  };
  /** Optional handwritten footnote (Penny's "artist's impression"). */
  footnote?: string;
}

/**
 * One creature's card — a sketchbox well with an oval-ringed portrait,
 * the name in display serif, and facts in the chapter's handwriting.
 */
const CreatureCard = ({ creature }: { creature: Creature }) => (
  <div className="sketchbox bg-parchment/60 px-6 py-6 md:px-7">
    <p className="u-label text-brand">{creature.kind}</p>
    <div className="flex items-center gap-5 mt-3">
      <SketchFrame variant="oval" className="shrink-0">
        <img
          src={creature.portrait.src}
          alt={creature.portrait.alt}
          width={104}
          height={104}
          loading="lazy"
          className={`w-24 h-24 md:w-[104px] md:h-[104px] rounded-full ${
            creature.portrait.illustrated
              ? "object-contain bg-parchment p-1.5"
              : "object-cover"
          }`}
        />
      </SketchFrame>
      <div>
        <p className="font-display text-3xl md:text-4xl text-ink leading-tight">
          {creature.name}
        </p>
        <p className="u-label text-ink/60 mt-1.5 tracking-[0.18em] text-[0.64rem]">
          {creature.provenance}
        </p>
      </div>
    </div>
    <ul className="font-hand text-xl md:text-[1.35rem] leading-relaxed text-ink mt-4 space-y-0.5">
      {creature.facts.map((fact) => (
        <li key={fact} className="relative pl-5">
          <span
            className="absolute left-0 top-[0.72em] w-2.5 h-0.5 bg-copper -rotate-6 rounded-full"
            aria-hidden="true"
          />
          {fact}
        </li>
      ))}
    </ul>
    {creature.footnote && (
      <p className="font-hand text-base md:text-lg text-ink/60 mt-3">{creature.footnote}</p>
    )}
  </div>
);

export default CreatureCard;

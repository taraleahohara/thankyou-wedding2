/** The chapter's one hand-made gesture, placed above the footer.
 *  All three wear the ornament tier (polished copper — decorative only). */

const COPPER = "hsl(var(--copper-bright))";

interface GestureDividerProps {
  gesture: "squiggle" | "stitch" | "stamp";
  /** Stamp text, e.g. the chapter number */
  stampLabel?: string;
}

const GestureDivider = ({ gesture, stampLabel = "02" }: GestureDividerProps) => {
  if (gesture === "squiggle") {
    // The footer's hand-drawn wave, grown into a section signature.
    return (
      <div className="flex justify-center py-12" role="presentation">
        <svg
          width="160"
          height="28"
          viewBox="0 0 72 16"
          fill="none"
          aria-hidden
          style={{ color: COPPER }}
        >
          <path
            d="M2 8c6-5 10 5 16 0S28 3 34 8s10 5 16 0 8-6 20-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (gesture === "stitch") {
    // A dashed copper leader line — the Lars dotted rule, warmed up.
    return (
      <div className="flex justify-center py-12" role="presentation">
        <div
          className="w-64 border-t-2 border-dashed"
          style={{ borderColor: COPPER }}
        />
      </div>
    );
  }

  // Passport-style chapter stamp, slightly tilted.
  return (
    <div className="flex justify-center py-10" role="presentation">
      <div
        className="flex flex-col items-center justify-center rounded-full border-2 w-24 h-24 -rotate-6"
        style={{ borderColor: COPPER, color: COPPER }}
      >
        <span className="font-display italic text-3xl leading-none">{stampLabel}</span>
        <span className="u-label mt-1 text-[0.55rem] tracking-[0.18em]">est. 2025</span>
      </div>
    </div>
  );
};

export default GestureDivider;

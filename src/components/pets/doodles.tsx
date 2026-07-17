/**
 * The pets chapter's hand-drawn ink: paw prints, trail connectors, the
 * annotation arrow, and small margin doodles. All pure SVG in ink/copper
 * so they stay crisp at any size and inherit the chapter palette.
 */

interface DoodleProps {
  className?: string;
}

/** A single paw print, drawn as four toes over a pad. */
export const PawPrint = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <ellipse cx="9" cy="14" rx="3.6" ry="5" transform="rotate(-24 9 14)" fill="currentColor" />
    <ellipse cx="16.5" cy="9.5" rx="3.6" ry="5.2" transform="rotate(-7 16.5 9.5)" fill="currentColor" />
    <ellipse cx="24.5" cy="9.5" rx="3.6" ry="5.2" transform="rotate(7 24.5 9.5)" fill="currentColor" />
    <ellipse cx="32" cy="14" rx="3.6" ry="5" transform="rotate(24 32 14)" fill="currentColor" />
    <path
      d="M20.5 20c5.4 0 9.4 3.4 9.4 7.4 0 4.4-4.4 6.6-9.4 6.6s-9.4-2.2-9.4-6.6c0-4 4-7.4 9.4-7.4z"
      fill="currentColor"
    />
  </svg>
);

/** The copper hand-drawn arrow that points annotations at things. */
export const AnnotArrow = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 54 40" className={className} aria-hidden="true">
    <path
      d="M4 34 C 18 30, 34 22, 46 8 M46 8 l-9 2 M46 8 l-1 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/** A dog bone, outlined in copper. */
export const BoneDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 46 22" className={className} aria-hidden="true">
    <path
      d="M9 7 C 5 3, 1 6, 3 10 C 1 14, 5 17, 9 14 L 36 14 C 40 18, 45 15, 43 11 C 45 7, 41 3, 37 8 L 9 7 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

/** A ball of yarn with a trailing thread, outlined in copper. */
export const YarnDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 52 30" className={className} aria-hidden="true">
    <circle cx="15" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M6.5 10 C 12 13, 18 13, 23.5 10 M5.5 16 C 12 19.5, 18 19.5, 24.5 16 M9 22 C 14 24.5, 17 24.5, 21.5 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M25 14 C 34 12, 38 20, 49 17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

interface TrailProps {
  /** Which way the trail bends; alternate per row for a wandering read. */
  direction?: "left" | "right";
  /** Margin doodle drawn beside the trail (cycles bone → yarn → none). */
  doodle?: "bone" | "yarn" | "none";
}

/**
 * A between-rows trail connector: a faint dotted S-curve with paw prints
 * walking along it. Sits in its own full-width cell of the scatter grid.
 */
export const PawTrailConnector = ({ direction = "right", doodle = "none" }: TrailProps) => {
  const flip = direction === "left";
  return (
    <div className="flex items-center justify-center gap-8" aria-hidden="true">
      {doodle === "bone" && (
        <BoneDoodle className="w-11 h-auto text-copper-bright opacity-80 -rotate-12 translate-y-2" />
      )}
      <svg
        viewBox="0 0 220 110"
        className="w-44 h-auto"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <path
          d="M60 4 C 110 30, 168 36, 172 60 C 176 84, 130 88, 118 106"
          fill="none"
          className="stroke-ink/40"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
        <use href="#pets-paw" x="70" y="6" width="15" height="15" transform="rotate(96 77 13)" className="fill-ink/50" />
        <use href="#pets-paw" x="112" y="18" width="15" height="15" transform="rotate(112 119 25)" className="fill-ink/50" />
        <use href="#pets-paw" x="158" y="58" width="15" height="15" transform="rotate(168 165 65)" className="fill-ink/50" />
      </svg>
      {doodle === "yarn" && (
        <YarnDoodle className="w-12 h-auto text-copper-bright opacity-80 rotate-6 -translate-y-1" />
      )}
    </div>
  );
};

/**
 * Hidden symbol definitions used by <use href="#pets-paw"> above.
 * Render once per page (Pets.tsx does).
 */
export const DoodleDefs = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true">
    <defs>
      <symbol id="pets-paw" viewBox="0 0 40 40">
        <ellipse cx="9" cy="14" rx="3.6" ry="5" transform="rotate(-24 9 14)" />
        <ellipse cx="16.5" cy="9.5" rx="3.6" ry="5.2" transform="rotate(-7 16.5 9.5)" />
        <ellipse cx="24.5" cy="9.5" rx="3.6" ry="5.2" transform="rotate(7 24.5 9.5)" />
        <ellipse cx="32" cy="14" rx="3.6" ry="5" transform="rotate(24 32 14)" />
        <path d="M20.5 20c5.4 0 9.4 3.4 9.4 7.4 0 4.4-4.4 6.6-9.4 6.6s-9.4-2.2-9.4-6.6c0-4 4-7.4 9.4-7.4z" />
      </symbol>
    </defs>
  </svg>
);

/** The fading trail that closes the page: "the collection keeps growing…" */
export const FadingPawTrail = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 150 26" className={className} aria-hidden="true">
    <use href="#pets-paw" x="0" y="2" width="15" height="15" transform="rotate(80 8 10)" className="fill-ink/55" />
    <use href="#pets-paw" x="34" y="8" width="15" height="15" transform="rotate(86 42 16)" className="fill-ink/40" />
    <use href="#pets-paw" x="68" y="3" width="15" height="15" transform="rotate(92 76 11)" className="fill-ink/25" />
    <use href="#pets-paw" x="102" y="8" width="15" height="15" transform="rotate(98 110 16)" className="fill-ink/15" />
  </svg>
);

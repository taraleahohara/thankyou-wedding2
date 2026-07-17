import type { ReactNode } from "react";

/**
 * The pets chapter's hand-drawn photo frames — the chosen mix:
 *   "box"     — doubled wobbly ink border on a pale mat (feature photos)
 *   "corners" — hand-inked mount brackets, no full border (smaller photos)
 *   "oval"    — sketched double-ellipse ring (creature-card portraits only)
 */

type SketchFrameVariant = "box" | "corners" | "oval";

interface SketchFrameProps {
  variant: SketchFrameVariant;
  children: ReactNode;
  className?: string;
}

/** One hand-inked corner bracket; rotated into each corner. */
const CornerBracket = ({ rotation }: { rotation: 0 | 90 | 180 | 270 }) => {
  const position =
    rotation === 0
      ? "top-0 left-0"
      : rotation === 90
        ? "top-0 right-0"
        : rotation === 180
          ? "bottom-0 right-0"
          : "bottom-0 left-0";
  return (
    <svg
      viewBox="0 0 30 30"
      className={`absolute ${position} w-7 h-7 text-ink`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path
        d="M27 3.5 C 18 2.5, 10 3, 3.5 4 M4 3.5 C 3 11, 2.8 19, 3.5 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SketchFrame = ({ variant, children, className = "" }: SketchFrameProps) => {
  if (variant === "box") {
    return (
      <div className={`sketchbox bg-parchment p-2.5 ${className}`}>
        {children}
      </div>
    );
  }

  if (variant === "corners") {
    return (
      <div className={`relative p-3 ${className}`}>
        <CornerBracket rotation={0} />
        <CornerBracket rotation={90} />
        <CornerBracket rotation={180} />
        <CornerBracket rotation={270} />
        {children}
      </div>
    );
  }

  // oval — the museum portrait ring; the child should be a round-cropped image.
  return (
    <div className={`relative p-3 ${className}`}>
      <svg className="absolute inset-0 w-full h-full text-ink" aria-hidden="true">
        <ellipse cx="50%" cy="50%" rx="48%" ry="48.5%" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <ellipse cx="50%" cy="50%" rx="46%" ry="46.2%" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
      {children}
    </div>
  );
};

export default SketchFrame;

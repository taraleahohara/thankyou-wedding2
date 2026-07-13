import { useEffect, useState } from "react";

/** Homestead pilot — the design options Tara can flip live in her browser.
 *  Locked by Tara (2026-07-13): hero = wash, galleries = scatter.
 *  Still in play: the gesture, the scatter's scale, and corner style.
 *  Pilot-only tooling: delete this folder when the direction is locked. */
export interface PilotOptions {
  /** The one hand-made move above the footer:
   *  squiggle = the footer's hand-drawn wave, large, in polished copper
   *  stitch   = a dashed copper leader line
   *  stamp    = a passport-style chapter stamp, slightly tilted */
  gesture: "none" | "squiggle" | "stitch" | "stamp";
  /** How dramatic the scatter's size rhythm is */
  scale: "gentle" | "varied" | "bold";
  /** Image corners: soft (rounded) or square (sharp, gallery-print) */
  corners: "soft" | "square";
}

export const defaultPilotOptions: PilotOptions = {
  gesture: "squiggle",
  scale: "varied",
  corners: "soft",
};

const STORAGE_KEY = "homestead-pilot-options";

const isValid = <K extends keyof PilotOptions>(key: K, value: unknown): value is PilotOptions[K] => {
  const allowed: Record<keyof PilotOptions, readonly string[]> = {
    gesture: ["none", "squiggle", "stitch", "stamp"],
    scale: ["gentle", "varied", "bold"],
    corners: ["soft", "square"],
  };
  return typeof value === "string" && allowed[key].includes(value);
};

export function usePilotOptions(): [PilotOptions, (next: Partial<PilotOptions>) => void] {
  const [options, setOptions] = useState<PilotOptions>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PilotOptions>;
        // Drop stale keys/values from earlier pilot rounds (hero, gallery, tape…)
        const next = { ...defaultPilotOptions };
        (Object.keys(next) as (keyof PilotOptions)[]).forEach((key) => {
          if (isValid(key, parsed[key])) next[key] = parsed[key] as never;
        });
        return next;
      }
    } catch {
      // ignore malformed storage
    }
    return defaultPilotOptions;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // storage unavailable (private mode) — options just won't persist
    }
  }, [options]);

  const update = (next: Partial<PilotOptions>) =>
    setOptions((current) => ({ ...current, ...next }));

  return [options, update];
}

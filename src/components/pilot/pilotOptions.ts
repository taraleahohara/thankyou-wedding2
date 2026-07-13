import { useEffect, useState } from "react";

/** Homestead pilot — the design options Tara can flip live in her browser.
 *  Pilot-only tooling: delete this folder when the direction is locked. */
export interface PilotOptions {
  /** photo = full-bleed photo hero (today's archive hero)
   *  wash  = pale terracotta plate: title first, photo below (Kelsey pattern)
   *  band  = full-saturation terracotta plate, ivory type (the Study borrow) */
  hero: "photo" | "wash" | "band";
  /** columns = today's masonry · scatter = Meiwen/ONE-Mag staggered layout */
  gallery: "columns" | "scatter";
  /** tape = Lars tape-stripe divider above the footer */
  gesture: "none" | "tape";
}

export const defaultPilotOptions: PilotOptions = {
  hero: "wash",
  gallery: "scatter",
  gesture: "tape",
};

const STORAGE_KEY = "homestead-pilot-options";

export function usePilotOptions(): [PilotOptions, (next: Partial<PilotOptions>) => void] {
  const [options, setOptions] = useState<PilotOptions>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultPilotOptions, ...JSON.parse(stored) };
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

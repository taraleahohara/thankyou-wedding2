import { useEffect, useState } from "react";

/** Homestead pilot — the design options Tara can flip live in her browser.
 *  Locked by Tara (2026-07-13): hero = wash, galleries = scatter,
 *  no gesture divider, round corners.
 *  Still in play: the scatter recipe (columns + how images scale over them).
 *  Pilot-only tooling: delete this folder when the direction is locked. */
export interface PilotOptions {
  /** Scatter recipes:
   *  gentle / varied / bold = sparse editorial scatter (1–2 per row) at
   *  increasing size drama; cols2 = a staggered two-column rhythm;
   *  cols3 = a denser three-column rhythm; weave = three columns where
   *  some images stretch across two of them. */
  scale: "gentle" | "varied" | "bold" | "cols2" | "cols3" | "weave";
}

export const defaultPilotOptions: PilotOptions = {
  scale: "varied",
};

const STORAGE_KEY = "homestead-pilot-options";

const isValid = <K extends keyof PilotOptions>(key: K, value: unknown): value is PilotOptions[K] => {
  const allowed: Record<keyof PilotOptions, readonly string[]> = {
    scale: ["gentle", "varied", "bold", "cols2", "cols3", "weave"],
  };
  return typeof value === "string" && allowed[key].includes(value);
};

export function usePilotOptions(): [PilotOptions, (next: Partial<PilotOptions>) => void] {
  const [options, setOptions] = useState<PilotOptions>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PilotOptions>;
        // Drop stale keys/values from earlier pilot rounds
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

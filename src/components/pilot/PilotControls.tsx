import { useState } from "react";
import type { PilotOptions } from "./pilotOptions";

interface PilotControlsProps {
  options: PilotOptions;
  onChange: (next: Partial<PilotOptions>) => void;
}

/** Floating switcher so Tara can flip design variants live in her browser.
 *  Hero (wash) and gallery (scatter) are locked; these are the open calls.
 *  Pilot-only tooling: delete with the pilot folder once the direction is locked. */
const PilotControls = ({ options, onChange }: PilotControlsProps) => {
  const [open, setOpen] = useState(true);

  const group = <K extends keyof PilotOptions>(
    label: string,
    key: K,
    choices: { value: PilotOptions[K]; label: string }[],
  ) => (
    <div className="mb-3 last:mb-0">
      <p className="u-label text-copper mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {choices.map((choice) => {
          const active = options[key] === choice.value;
          return (
            <button
              key={String(choice.value)}
              type="button"
              onClick={() => onChange({ [key]: choice.value } as Partial<PilotOptions>)}
              className={`rounded-full px-3 py-1 text-xs lowercase tracking-wide border transition-colors duration-2 ease-paper ${
                active
                  ? "bg-olive text-paper border-olive"
                  : "bg-transparent text-ink border-ink/20 hover:border-ink/50"
              }`}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-olive text-paper px-4 py-2 text-xs lowercase tracking-wide shadow-sm"
      >
        pilot options
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-64 border border-ink/15 bg-parchment p-4 shadow-sm">
      <div className="flex items-baseline justify-between mb-3">
        <p className="u-label text-ink">homestead pilot</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs lowercase text-ink/60 hover:text-ink"
        >
          hide
        </button>
      </div>
      {group("gesture", "gesture", [
        { value: "none", label: "none" },
        { value: "squiggle", label: "squiggle" },
        { value: "stitch", label: "stitch" },
        { value: "stamp", label: "stamp" },
      ])}
      {group("scatter scale", "scale", [
        { value: "gentle", label: "gentle" },
        { value: "varied", label: "varied" },
        { value: "bold", label: "bold" },
      ])}
      {group("corners", "corners", [
        { value: "soft", label: "round" },
        { value: "square", label: "square" },
      ])}
    </div>
  );
};

export default PilotControls;

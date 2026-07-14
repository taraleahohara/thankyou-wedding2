import { useState } from "react";
import type { PilotOptions } from "./pilotOptions";

interface PilotControlsProps {
  options: PilotOptions;
  onChange: (next: Partial<PilotOptions>) => void;
}

/** Floating switcher so Tara can flip design variants live in her browser.
 *  Everything else is locked; the scatter recipe is the one open call.
 *  Pilot-only tooling: delete with the pilot folder once the direction is locked. */
const PilotControls = ({ options, onChange }: PilotControlsProps) => {
  const [open, setOpen] = useState(true);

  const choices: { value: PilotOptions["scale"]; label: string; hint: string }[] = [
    { value: "gentle", label: "gentle", hint: "sparse · even sizes" },
    { value: "varied", label: "varied", hint: "sparse · mixed sizes" },
    { value: "bold", label: "bold", hint: "sparse · big statements" },
    { value: "cols2", label: "2 columns", hint: "denser · staggered pairs" },
    { value: "cols3", label: "3 columns", hint: "denser · trio rhythm" },
    { value: "weave", label: "3 + stretch", hint: "trios · some span 2 cols" },
  ];

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
      <p className="u-label text-copper mb-1.5">scatter recipe</p>
      <div className="flex flex-col gap-1.5">
        {choices.map((choice) => {
          const active = options.scale === choice.value;
          return (
            <button
              key={choice.value}
              type="button"
              onClick={() => onChange({ scale: choice.value })}
              className={`flex items-baseline justify-between rounded-full px-3 py-1.5 text-xs lowercase tracking-wide border transition-colors duration-2 ease-paper ${
                active
                  ? "bg-olive text-paper border-olive"
                  : "bg-transparent text-ink border-ink/20 hover:border-ink/50"
              }`}
            >
              <span>{choice.label}</span>
              <span className={active ? "text-paper/70" : "text-ink/50"}>{choice.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PilotControls;

"use client";

import { useState } from "react";
import { Settings2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const LEVEL_OPTIONS = [
  "Entire Business",
  "Brand",
  "Category",
  "Sub-category",
  "SKU",
] as const;

type ConfigureLevelsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfigureLevels({ open, onOpenChange }: ConfigureLevelsProps) {
  const [levels, setLevels] = useState<Record<string, boolean>>({
    "Entire Business": true,
    Brand: true,
    Category: true,
    "Sub-category": true,
    SKU: true,
  });

  return (
    <div className="relative">
      <Button variant="outline" size="xs" onClick={() => onOpenChange(!open)}>
        <Settings2 className="size-3.5" />
        Configure levels
      </Button>

      {open && (
        <div className="absolute top-9 right-0 z-20 w-56 rounded-lg border border-primary/40 bg-background p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Configure visible levels</p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <ul className="space-y-2">
            {LEVEL_OPTIONS.map((level) => (
              <li key={level} className="flex items-center gap-2 text-sm">
                <input
                  id={`lvl-${level}`}
                  type="checkbox"
                  checked={levels[level]}
                  onChange={() =>
                    setLevels((prev) => ({ ...prev, [level]: !prev[level] }))
                  }
                  className="size-3.5 accent-primary"
                />
                <label htmlFor={`lvl-${level}`}>{level}</label>
              </li>
            ))}
          </ul>
          <Button className="mt-3 w-full" size="sm" onClick={() => onOpenChange(false)}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import type { AlertsGroupBy } from "@/lib/mock-alerts-insights";
import { cn, controlFocusClass } from "@/lib/utils";

const GROUP_BY_OPTIONS = [
  { id: "issue" as const, label: "Issue type" },
  { id: "category" as const, label: "Categories" },
];

type AlertsGroupBySelectProps = {
  value: AlertsGroupBy;
  onChange: (value: AlertsGroupBy) => void;
  /** When false, only the current value shows (label lives outside the button). */
  showInlineLabel?: boolean;
};

/**
 * Compact dropdown for how the Alerts list is grouped.
 * Use showInlineLabel=false when a nearby “Group by” label already exists.
 */
export function AlertsGroupBySelect({
  value,
  onChange,
  showInlineLabel = true,
}: AlertsGroupBySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const label =
    GROUP_BY_OPTIONS.find((o) => o.id === value)?.label ?? "Issue type";

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={`Group by ${label}`}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2 text-xs hover:bg-neutral-100",
          controlFocusClass,
        )}
      >
        {showInlineLabel && (
          <span className="text-muted-foreground">Group by</span>
        )}
        <span className="font-medium text-foreground">{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Group by options"
          className="absolute top-8 right-0 z-30 min-w-40 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg"
        >
          {GROUP_BY_OPTIONS.map((option) => {
            const selected = value === option.id;
            return (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full px-3 py-2 text-left text-xs font-medium",
                    selected
                      ? "bg-neutral-50 text-foreground"
                      : "text-foreground hover:bg-neutral-50",
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

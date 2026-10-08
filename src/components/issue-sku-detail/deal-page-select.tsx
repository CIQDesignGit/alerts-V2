"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import type { DealPageOption } from "@/lib/mock-issue-sku-detail";
import { cn, controlFocusClass } from "@/lib/utils";

type DealPageSelectProps = {
  pages: DealPageOption[];
  value: string;
  onChange: (pageId: string) => void;
};

/** Picks which deals page the dates and top 10 describe. */
export function DealPageSelect({ pages, value, onChange }: DealPageSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const label = pages.find((page) => page.id === value)?.label ?? "Deals page";

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        aria-label={`Deals page ${label}`}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex max-w-full items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-neutral-50",
          open && "bg-neutral-50",
          controlFocusClass,
        )}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Deals pages"
          className="absolute top-9 right-0 z-30 w-80 overflow-hidden rounded-lg border border-border bg-background p-1.5 shadow-lg"
        >
          {pages.map((page) => {
            const selected = page.id === value;
            return (
              <li key={page.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(page.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full rounded-md px-2 py-2 text-left text-sm font-semibold text-foreground",
                    selected ? "bg-brand-50" : "hover:bg-neutral-50",
                  )}
                >
                  {page.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

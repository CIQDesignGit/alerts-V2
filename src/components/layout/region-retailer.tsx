"use client";

import { ChevronDown, Settings } from "lucide-react";

type RegionRetailerProps = {
  collapsed?: boolean;
};

export function RegionRetailer({ collapsed = false }: RegionRetailerProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        aria-label="Region and retailer: US Amazon"
        className="mx-auto flex size-9 items-center justify-center rounded-md bg-shell-elevated text-sm"
      >
        🇺🇸
      </button>
    );
  }

  return (
    <div className="px-3">
      <p className="mb-1.5 text-2xs font-medium tracking-wide text-shell-muted uppercase">
        Region &amp; Retailer
      </p>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md bg-shell-elevated px-2.5 py-2 text-left text-sm text-shell-foreground hover:bg-shell-hover"
      >
        <span aria-hidden className="text-base leading-none">
          🇺🇸
        </span>
        <span className="min-w-0 flex-1 truncate font-medium">US Amazon</span>
        <Settings className="size-3.5 shrink-0 text-shell-muted" />
        <ChevronDown className="size-3.5 shrink-0 text-shell-muted" />
      </button>
    </div>
  );
}

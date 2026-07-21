"use client";

import { Search } from "lucide-react";

type SkuSearchProps = {
  collapsed?: boolean;
};

export function SkuSearch({ collapsed = false }: SkuSearchProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        aria-label="Search for SKUs"
        className="mx-auto flex size-9 items-center justify-center rounded-md text-shell-muted hover:bg-shell-hover hover:text-shell-foreground"
      >
        <Search className="size-4" />
      </button>
    );
  }

  return (
    <div className="px-3">
      <label className="relative block">
        <span className="sr-only">Search for SKUs</span>
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-shell-muted" />
        <input
          type="search"
          placeholder="Search for SKUs"
          className="w-full rounded-md border border-shell-border bg-shell-elevated py-2 pr-3 pl-9 text-sm text-shell-foreground placeholder:text-shell-muted outline-none focus:border-shell-accent"
        />
      </label>
    </div>
  );
}

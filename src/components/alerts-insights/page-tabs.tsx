"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type PageTab = "overview" | "alerts" | "insights";

type PageTabsProps = {
  active: PageTab;
  alertsCount: number;
  onChange: (tab: PageTab) => void;
  /** SKU filter — shown on Alerts and Insights tabs */
  skuFilter?: string;
  onSkuFilterChange?: (value: string) => void;
};

const TABS: { id: PageTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "alerts", label: "Alerts" },
  { id: "insights", label: "Insights" },
];

export function PageTabs({
  active,
  alertsCount,
  onChange,
  skuFilter = "",
  onSkuFilterChange,
}: PageTabsProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6">
      <nav aria-label="Alerts and insights tabs" className="flex gap-6">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {tab.id === "alerts" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-2xs font-semibold",
                    isActive
                      ? "bg-error-500 text-white"
                      : "bg-neutral-100 text-neutral-600",
                  )}
                >
                  {alertsCount}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {(active === "alerts" || active === "insights") && onSkuFilterChange && (
        <label className="relative w-72 shrink-0">
          <span className="sr-only">Filter SKUs by name, ASIN, or $ gap</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={skuFilter}
            onChange={(e) => onSkuFilterChange(e.target.value)}
            placeholder="Filter SKUs by name, ASIN, or $ gap..."
            className="w-full rounded-md border border-border bg-background py-1.5 pr-3 pl-8 text-xs outline-none focus:border-primary"
          />
        </label>
      )}
    </div>
  );
}

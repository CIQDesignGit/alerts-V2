"use client";

import { AlertsFiltersBar } from "@/components/alerts-insights/alerts-filters-bar";
import type { AlertsFilters } from "@/lib/mock-alerts-insights";
import { cn, controlFocusClass } from "@/lib/utils";

export type PageTab = "overview" | "alerts" | "insights";

type PageTabsProps = {
  active: PageTab;
  alertsCount: number;
  onChange: (tab: PageTab) => void;
  /** Shared Brand · Category · SKU filters for Alerts and Insights */
  filters?: AlertsFilters;
  onFiltersChange?: (next: AlertsFilters) => void;
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
  filters,
  onFiltersChange,
}: PageTabsProps) {
  const showFilters =
    (active === "alerts" || active === "insights") &&
    filters &&
    onFiltersChange;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6">
      {/*
        Minimal text tabs — same type language as TopBar breadcrumb
        (muted inactive / medium active). No icons, thin underline.
      */}
      <nav aria-label="Alerts and insights tabs" className="flex shrink-0 gap-5">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 py-2.5 text-sm transition-colors",
                controlFocusClass,
                isActive
                  ? "font-medium text-foreground"
                  : "font-normal text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {tab.id === "alerts" && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-100 px-1 text-2xs font-medium text-neutral-600">
                  {alertsCount}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-foreground" />
              )}
            </button>
          );
        })}
      </nav>

      {showFilters && (
        <AlertsFiltersBar filters={filters} onChange={onFiltersChange} />
      )}
    </div>
  );
}

"use client";

import { AlertsFiltersBar } from "@/components/alerts-insights/alerts-filters-bar";
import type {
  AlertsFilters,
  AlertsGroupBy,
} from "@/lib/mock-alerts-insights";
import { cn, controlFocusClass, fieldFocusClass } from "@/lib/utils";

export type PageTab = "overview" | "alerts" | "insights";

type PageTabsProps = {
  active: PageTab;
  alertsCount: number;
  onChange: (tab: PageTab) => void;
  /** Insights still uses a simple SKU text filter */
  skuFilter?: string;
  onSkuFilterChange?: (value: string) => void;
  /** Alerts tab: Brand · Category · SKU filters + group-by */
  alertsFilters?: AlertsFilters;
  onAlertsFiltersChange?: (next: AlertsFilters) => void;
  alertsGroupBy?: AlertsGroupBy;
  onAlertsGroupByChange?: (value: AlertsGroupBy) => void;
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
  alertsFilters,
  onAlertsFiltersChange,
  alertsGroupBy = "issue",
  onAlertsGroupByChange,
}: PageTabsProps) {
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

      {active === "alerts" &&
        alertsFilters &&
        onAlertsFiltersChange &&
        onAlertsGroupByChange && (
          <AlertsFiltersBar
            filters={alertsFilters}
            onChange={onAlertsFiltersChange}
            groupBy={alertsGroupBy}
            onGroupByChange={onAlertsGroupByChange}
          />
        )}

      {active === "insights" && onSkuFilterChange && (
        <label className="relative w-72 shrink-0">
          <span className="sr-only">Filter SKUs by name, ASIN, or $ gap</span>
          <input
            type="search"
            value={skuFilter}
            onChange={(e) => onSkuFilterChange(e.target.value)}
            placeholder="Filter SKUs by name, ASIN, or $ gap..."
            className={cn(
              "w-full rounded-md border border-border bg-background py-1.5 pr-3 pl-3 text-xs",
              fieldFocusClass,
            )}
          />
        </label>
      )}
    </div>
  );
}

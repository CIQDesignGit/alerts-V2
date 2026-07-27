"use client";

import { AlertsFiltersBar } from "@/components/alerts-insights/alerts-filters-bar";
import type { AlertsFilters } from "@/lib/mock-alerts-insights";

type AlertsPageHeaderProps = {
  filters: AlertsFilters;
  onFiltersChange: (next: AlertsFilters) => void;
};

/** Filters bar for the Alerts landing page — no top-level tabs. */
export function AlertsPageHeader({
  filters,
  onFiltersChange,
}: AlertsPageHeaderProps) {
  return (
    <div className="flex items-center justify-start gap-4 border-b border-border px-6 py-2.5">
      <AlertsFiltersBar filters={filters} onChange={onFiltersChange} />
    </div>
  );
}

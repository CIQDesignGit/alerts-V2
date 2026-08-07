"use client";

import { useState } from "react";

import { AlertsPageHeader } from "@/components/alerts-insights/alerts-page-header";
import { AlertsTab } from "@/components/alerts-insights/alerts-tab";
import {
  emptyAlertsFilters,
  type AlertsFilters,
  type AlertsGroupBy,
} from "@/lib/mock-alerts-insights";

/** Alerts-first landing — no Overview or hierarchy Insights tabs. */
export function HomePage() {
  const [alertsGroupBy, setAlertsGroupBy] = useState<AlertsGroupBy>("issue");
  const [filters, setFilters] = useState<AlertsFilters>(emptyAlertsFilters);

  function onGroupByChange(value: AlertsGroupBy) {
    setAlertsGroupBy(value);
    // Issue filter only applies in taxonomy — clear it when leaving that view
    if (value === "issue" && filters.issueKey) {
      setFilters({ ...filters, issueKey: null });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AlertsPageHeader
        filters={filters}
        onFiltersChange={setFilters}
        groupBy={alertsGroupBy}
      />

      <AlertsTab
        filters={filters}
        groupBy={alertsGroupBy}
        onGroupByChange={onGroupByChange}
      />
    </div>
  );
}

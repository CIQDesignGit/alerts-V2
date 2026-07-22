"use client";

import { useState } from "react";

import { AlertsTab } from "@/components/alerts-insights/alerts-tab";
import { InsightsTab } from "@/components/alerts-insights/insights-tab";
import { OverviewTab } from "@/components/alerts-insights/overview-tab";
import {
  PageTabs,
  type PageTab,
} from "@/components/alerts-insights/page-tabs";
import {
  alertsSummary,
  emptyAlertsFilters,
  type AlertsFilters,
  type AlertsGroupBy,
} from "@/lib/mock-alerts-insights";

export function HomePage() {
  const [tab, setTab] = useState<PageTab>("overview");
  const [skuFilter, setSkuFilter] = useState("");
  const [alertsGroupBy, setAlertsGroupBy] = useState<AlertsGroupBy>("issue");
  const [alertsFilters, setAlertsFilters] =
    useState<AlertsFilters>(emptyAlertsFilters);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageTabs
        active={tab}
        alertsCount={alertsSummary.count}
        onChange={setTab}
        skuFilter={skuFilter}
        onSkuFilterChange={setSkuFilter}
        alertsFilters={alertsFilters}
        onAlertsFiltersChange={setAlertsFilters}
        alertsGroupBy={alertsGroupBy}
        onAlertsGroupByChange={setAlertsGroupBy}
      />

      {tab === "overview" && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <OverviewTab
            onGoToAlerts={() => setTab("alerts")}
            onGoToInsights={() => setTab("insights")}
          />
        </div>
      )}
      {tab === "alerts" && (
        <AlertsTab filters={alertsFilters} groupBy={alertsGroupBy} />
      )}
      {tab === "insights" && <InsightsTab filter={skuFilter} />}
    </div>
  );
}

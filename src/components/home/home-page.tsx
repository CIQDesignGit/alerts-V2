"use client";

import { useState } from "react";

import { AlertsTab } from "@/components/alerts-insights/alerts-tab";
import {
  findBrandByName,
  findHierarchySkuByName,
} from "@/components/alerts-insights/hierarchy-tree";
import { InsightsTab } from "@/components/alerts-insights/insights-tab";
import { OverviewTab } from "@/components/alerts-insights/overview-tab";
import {
  PageTabs,
  type PageTab,
} from "@/components/alerts-insights/page-tabs";
import {
  alertsSummary,
  emptyAlertsFilters,
  hierarchyTree,
  type AlertsFilters,
  type AlertsGroupBy,
  type IssueSku,
} from "@/lib/mock-alerts-insights";

export function HomePage() {
  const [tab, setTab] = useState<PageTab>("overview");
  const [alertsGroupBy, setAlertsGroupBy] = useState<AlertsGroupBy>("issue");
  // Shared across Alerts + Insights so Brand/Category/SKU context carries over
  const [filters, setFilters] = useState<AlertsFilters>(emptyAlertsFilters);
  // Deep-link target for Insights (hierarchy node id). Cleared on normal tab clicks.
  const [insightsFocusId, setInsightsFocusId] = useState<string | null>(null);

  function goToTab(next: PageTab, focusId: string | null = null) {
    setInsightsFocusId(focusId);
    setTab(next);
  }

  /** Alert SKU detail → Insights SKU page (match by product name). */
  function viewSkuInsights(sku: IssueSku) {
    const hierarchySku = findHierarchySkuByName(hierarchyTree, sku.name);
    if (hierarchySku) {
      goToTab("insights", hierarchySku.id);
      return;
    }
    // Fallback: open the brand if this alert SKU isn’t in the mock hierarchy yet
    const brand = findBrandByName(hierarchyTree, sku.brand);
    goToTab("insights", brand?.id ?? null);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageTabs
        active={tab}
        alertsCount={alertsSummary.count}
        onChange={(next) => goToTab(next, null)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {tab === "overview" && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <OverviewTab
            onGoToAlerts={() => goToTab("alerts")}
            onGoToInsights={() => goToTab("insights")}
          />
        </div>
      )}
      {tab === "alerts" && (
        <AlertsTab
          filters={filters}
          groupBy={alertsGroupBy}
          onGroupByChange={setAlertsGroupBy}
          onViewSkuInsights={viewSkuInsights}
        />
      )}
      {tab === "insights" && (
        <InsightsTab filters={filters} initialSkuId={insightsFocusId} />
      )}
    </div>
  );
}

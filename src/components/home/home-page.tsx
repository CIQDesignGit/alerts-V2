"use client";

import { useState } from "react";

import { AlertsTab } from "@/components/alerts-insights/alerts-tab";
import { InsightsTab } from "@/components/alerts-insights/insights-tab";
import { OverviewTab } from "@/components/alerts-insights/overview-tab";
import {
  PageTabs,
  type PageTab,
} from "@/components/alerts-insights/page-tabs";
import { alertsSummary } from "@/lib/mock-alerts-insights";

export function HomePage() {
  const [tab, setTab] = useState<PageTab>("overview");
  const [skuFilter, setSkuFilter] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageTabs
        active={tab}
        alertsCount={alertsSummary.count}
        onChange={setTab}
        skuFilter={skuFilter}
        onSkuFilterChange={setSkuFilter}
      />

      {tab === "overview" && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <OverviewTab
            onGoToAlerts={() => setTab("alerts")}
            onGoToInsights={() => setTab("insights")}
          />
        </div>
      )}
      {tab === "alerts" && <AlertsTab filter={skuFilter} />}
      {tab === "insights" && <InsightsTab />}
    </div>
  );
}

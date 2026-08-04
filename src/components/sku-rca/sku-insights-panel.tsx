"use client";

import { useMemo } from "react";

import { SkuActiveIssuesPanel } from "@/components/sku-rca/sku-active-issues-panel";
import { SkuWeeklyIssueGrid } from "@/components/sku-rca/sku-weekly-issue-grid";
import { DEFAULT_TRENDS_DATE_RANGE } from "@/lib/insights-date-range";
import { getSkuWeeklyIssuesView } from "@/lib/sku-weekly-issues";

type SkuInsightsPanelProps = {
  /** Stable key for widget persistence — SKU id or ASIN */
  entityId: string;
  skuName: string;
};

/**
 * SKU Insights — weekly issue status grid + active issue recommendations.
 * Historic trends only; no live alert diagnosis (that lives on the Alert tab).
 */
export function SkuInsightsPanel({ entityId, skuName }: SkuInsightsPanelProps) {
  const view = useMemo(
    () => getSkuWeeklyIssuesView(entityId, DEFAULT_TRENDS_DATE_RANGE),
    [entityId],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">
          Issue trends for {skuName}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Daily issue status for the selected period
        </p>
      </div>

      <SkuWeeklyIssueGrid view={view} />

      <SkuActiveIssuesPanel issues={view.activeIssues} />
    </div>
  );
}

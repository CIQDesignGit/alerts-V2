"use client";

import { useMemo, useState } from "react";

import { InsightsDateRangePicker } from "@/components/alerts-insights/insights-date-range";
import { SkuActiveIssuesPanel } from "@/components/sku-rca/sku-active-issues-panel";
import { SkuWeeklyIssueGrid } from "@/components/sku-rca/sku-weekly-issue-grid";
import {
  DEFAULT_TRENDS_DATE_RANGE,
  type InsightsDateRange,
} from "@/lib/insights-date-range";
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
  const [dateRange, setDateRange] = useState<InsightsDateRange>(
    DEFAULT_TRENDS_DATE_RANGE,
  );

  const view = useMemo(
    () => getSkuWeeklyIssuesView(entityId, dateRange),
    [entityId, dateRange],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            Issue trends for {skuName}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Daily issue status for the selected period
          </p>
        </div>
        <InsightsDateRangePicker
          value={dateRange}
          onChange={setDateRange}
          variant="toolbar"
          menuAlign="right"
          showRangeInTrigger
        />
      </div>

      <SkuWeeklyIssueGrid view={view} />

      <SkuActiveIssuesPanel issues={view.activeIssues} />
    </div>
  );
}

"use client";

import { InsightsDateRangePicker } from "@/components/alerts-insights/insights-date-range";
import { InsightsModeToggle } from "@/components/alerts-insights/insights-mode-toggle";
import type { InsightsDateRange } from "@/lib/insights-date-range";
import type { InsightsMode } from "@/lib/insights-widgets";
import { formatGapDollars } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type InsightsLevelHeaderProps = {
  name: string;
  gapDollars: number;
  attainmentPct: number;
  mode: InsightsMode;
  onModeChange: (mode: InsightsMode) => void;
  dateRange: InsightsDateRange;
  onDateRangeChange: (next: InsightsDateRange) => void;
};

/**
 * Page header for Insights levels (brand / category / etc.) —
 * flat border-b bar like SkuRcaHeader, not a card inside the scroll body.
 */
export function InsightsLevelHeader({
  name,
  gapDollars,
  attainmentPct,
  mode,
  onModeChange,
  dateRange,
  onDateRangeChange,
}: InsightsLevelHeaderProps) {
  const behindPlan = gapDollars < 0;

  return (
    <header className="relative shrink-0 border-b border-border bg-background">
      <div className="px-6 py-3">
        <div className="flex w-full min-w-0 items-end justify-between gap-4">
          {/* Identity + KPIs */}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold leading-snug text-foreground">
              {name}
            </h2>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  behindPlan ? "text-error-600" : "text-success-600",
                )}
              >
                {formatGapDollars(gapDollars)}
              </span>
              <span className="text-neutral-300" aria-hidden>
                ·
              </span>
              <span
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  attainmentPct < 100 ? "text-error-600" : "text-success-600",
                )}
              >
                {attainmentPct}%
              </span>
              <span className="text-xs text-muted-foreground">attainment</span>
            </div>
          </div>

          {/* Mode + period — bottom-aligned with the left block */}
          <div className="flex shrink-0 flex-wrap items-end justify-end gap-2">
            <InsightsModeToggle mode={mode} onChange={onModeChange} />
            <InsightsDateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              variant="toolbar"
              menuAlign="right"
              showRangeInTrigger
            />
          </div>
        </div>
      </div>
    </header>
  );
}

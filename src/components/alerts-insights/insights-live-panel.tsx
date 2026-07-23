"use client";

import {
  AllyAiHeader,
  AllyAiSurface,
} from "@/components/alerts-insights/ally-ai-surface";
import { InsightsDateRangePicker } from "@/components/alerts-insights/insights-date-range";
import {
  formatAsp,
  formatSignedInt,
  LiveMetricCard,
} from "@/components/alerts-insights/live-metric-card";
import { getIssueIconForLabel } from "@/components/alerts/issue-icons";
import { formatInsightsDateRange } from "@/lib/insights-date-range";
import type { InsightsDateRange } from "@/lib/insights-date-range";
import {
  childLevelLabel,
  formatGapDollars,
  getLiveMetrics,
  type HierarchyIssueChip,
  type HierarchyNode,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type InsightsLivePanelProps = {
  selected: HierarchyNode;
  /** Child nodes that make up this parent (brands, categories, SKUs…) */
  constituents: HierarchyNode[];
  dateRange: InsightsDateRange;
  onDateRangeChange: (next: InsightsDateRange) => void;
  onDrill: (childId: string) => void;
};

/** Compact issue chip with the same Lucide icon used on Alert SKU detail. */
function IssueChipBadge({
  chip,
  size = "sm",
}: {
  chip: HierarchyIssueChip;
  size?: "sm" | "md";
}) {
  const Icon = getIssueIconForLabel(chip.chip);
  const showCount = size === "sm" || chip.count > 1;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium text-neutral-700",
        size === "md"
          ? "rounded-md bg-neutral-100 px-2 py-1 text-xs"
          : "rounded bg-neutral-100 px-1.5 py-0.5 text-2xs text-neutral-600",
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          size === "md" ? "size-3.5 text-neutral-500" : "size-3 text-neutral-500",
        )}
        aria-hidden
      />
      {chip.chip}
      {showCount ? ` ×${chip.count}` : ""}
    </span>
  );
}

/**
 * Snapshot Insights for a hierarchy parent:
 * 1) Period metrics + date range (mode-specific toolbar)
 * 2) Level KPIs + AI narrative
 * 3) Breakdown table of constituents (click to drill)
 */
export function InsightsLivePanel({
  selected,
  constituents,
  dateRange,
  onDateRangeChange,
  onDrill,
}: InsightsLivePanelProps) {
  const metrics = getLiveMetrics(selected);
  const period = formatInsightsDateRange(dateRange);
  const insight =
    selected.insight ??
    `${selected.name} Gap is ${formatGapDollars(selected.gapDollars)} (${metrics.attainmentPct}% attainment). Drill into ${childLevelLabel(selected.level).toLowerCase()}s to see drivers.`;
  const childLabel = childLevelLabel(selected.level);
  const isLeaf = constituents.length === 0;

  const levelTitle =
    selected.level.charAt(0).toUpperCase() + selected.level.slice(1);

  return (
    <div className="flex flex-col gap-5">
      {/* Snapshot period control */}
      <div className="flex justify-end">
        <InsightsDateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          variant="toolbar"
          menuAlign="right"
          showRangeInTrigger
        />
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <LiveMetricCard
          label="$ Gap"
          value={formatGapDollars(selected.gapDollars)}
          tone={selected.gapDollars < 0 ? "neg" : "pos"}
          progressPct={metrics.attainmentPct}
        />
        <LiveMetricCard
          label="Units Δ"
          value={formatSignedInt(metrics.unitsDelta)}
          tone={metrics.unitsDelta < 0 ? "neg" : "pos"}
        />
        <LiveMetricCard
          label="ASP Δ"
          value={formatAsp(metrics.aspDelta)}
          tone={metrics.aspDelta < 0 ? "neg" : "pos"}
        />
      </section>

      <AllyAiSurface contentClassName="p-4 md:p-5">
        <AllyAiHeader
          label={`AllyAI ${levelTitle} Insights · Snapshot`}
          subtitle={`${period.label} · ${period.rangeText}`}
        />
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">{insight}</p>
      </AllyAiSurface>

      {/* Parent levels: drill table. SKU leaf: issue chips only (no children). */}
      {!isLeaf ? (
        <section>
          <h3 className="text-sm font-semibold text-foreground">
            Breakdown by {childLabel.toLowerCase()}
          </h3>
          <p className="text-xs text-muted-foreground">
            Constituents of {selected.name} for {period.label.toLowerCase()} ·
            click a row to drill down
          </p>
          <div className="mt-2 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-neutral-50 text-2xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">{childLabel}</th>
                  <th className="px-3 py-2 text-right font-medium">$ Gap</th>
                  <th className="px-3 py-2 text-right font-medium">Units Δ</th>
                  <th className="px-3 py-2 text-right font-medium">ASP Δ</th>
                  <th className="px-3 py-2 text-right font-medium">Attainment</th>
                  <th className="px-3 py-2 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody>
                {constituents.map((child) => {
                  const m = getLiveMetrics(child);
                  return (
                    <tr
                      key={child.id}
                      className="cursor-pointer border-t border-border hover:bg-neutral-50"
                      onClick={() => onDrill(child.id)}
                    >
                      <td
                        className={cn(
                          "border-l-4 px-3 py-2.5 font-medium",
                          child.gapDollars > 0
                            ? "border-l-success-500"
                            : "border-l-error-500",
                        )}
                      >
                        {child.name}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 text-right font-mono font-semibold tabular-nums",
                          child.gapDollars > 0
                            ? "text-success-600"
                            : "text-error-600",
                        )}
                      >
                        {formatGapDollars(child.gapDollars)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-neutral-700">
                        {formatSignedInt(m.unitsDelta)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-neutral-700">
                        {formatAsp(m.aspDelta)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-neutral-700">
                        {m.attainmentPct}%
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(m.issueChips ?? []).map((chip) => (
                            <IssueChipBadge key={chip.chip} chip={chip} />
                          ))}
                          {!m.issueChips?.length && (
                            <span className="text-2xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : selected.level === "sku" ? (
        <section>
          <h3 className="text-sm font-semibold text-foreground">
            Active issues on this SKU
          </h3>
          <p className="text-xs text-muted-foreground">
            Issue chips for {period.label.toLowerCase()} · open Alerts for
            full diagnosis on a specific issue
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(metrics.issueChips ?? []).map((chip) => (
              <IssueChipBadge key={chip.chip} chip={chip} size="md" />
            ))}
            {!metrics.issueChips?.length && (
              <p className="rounded-lg border border-dashed border-border bg-neutral-50 px-4 py-3 text-sm text-muted-foreground">
                No active issue chips for this SKU in the selected period.
              </p>
            )}
          </div>
        </section>
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-neutral-50 px-4 py-3 text-sm text-muted-foreground">
          No child breakdown at this level.
        </p>
      )}
    </div>
  );
}

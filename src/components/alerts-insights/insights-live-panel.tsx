"use client";

import {
  formatAsp,
  formatSignedInt,
  LiveMetricCard,
} from "@/components/alerts-insights/live-metric-card";
import {
  childLevelLabel,
  formatGapDollars,
  getLiveMetrics,
  type HierarchyNode,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type InsightsLivePanelProps = {
  selected: HierarchyNode;
  /** Child nodes that make up this parent (brands, categories, SKUs…) */
  constituents: HierarchyNode[];
  onDrill: (childId: string) => void;
};

/**
 * Live Insights for a hierarchy parent:
 * 1) Level KPIs + AI narrative
 * 2) Breakdown table of constituents (click to drill)
 */
export function InsightsLivePanel({
  selected,
  constituents,
  onDrill,
}: InsightsLivePanelProps) {
  const metrics = getLiveMetrics(selected);
  const insight =
    selected.insight ??
    `${selected.name} Gap is ${formatGapDollars(selected.gapDollars)} (${metrics.attainmentPct}% attainment). Drill into ${childLevelLabel(selected.level).toLowerCase()}s to see drivers.`;
  const childLabel = childLevelLabel(selected.level);
  const isLeaf = constituents.length === 0;

  return (
    <div className="flex flex-col gap-5">
      <section className="grid gap-3 sm:grid-cols-4">
        <LiveMetricCard
          label="$ Gap vs plan"
          value={formatGapDollars(selected.gapDollars)}
          tone={selected.gapDollars < 0 ? "neg" : "pos"}
        />
        <LiveMetricCard
          label="Attainment"
          value={`${metrics.attainmentPct}%`}
          tone={metrics.attainmentPct < 100 ? "neg" : "pos"}
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

      <section className="rounded-lg border border-border border-l-4 border-l-primary bg-brand-50/40 p-4">
        <p className="text-2xs font-semibold tracking-wider text-primary uppercase">
          AI {selected.level} Insights · Live
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{insight}</p>
        {metrics.issueChips && metrics.issueChips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metrics.issueChips.map((chip) => (
              <span
                key={chip.chip}
                className="rounded-md bg-background px-2 py-0.5 text-2xs font-semibold text-neutral-700 ring-1 ring-border"
              >
                {chip.chip} ×{chip.count}
              </span>
            ))}
          </div>
        )}
      </section>

      {!isLeaf && (
        <section>
          <h3 className="text-sm font-semibold text-foreground">
            Breakdown by {childLabel.toLowerCase()}
          </h3>
          <p className="text-xs text-muted-foreground">
            Constituents of {selected.name} · click a row to drill down
          </p>
          <div className="mt-2 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-neutral-50 text-2xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">{childLabel}</th>
                  <th className="px-3 py-2 font-medium">$ Gap</th>
                  <th className="px-3 py-2 font-medium">Units Δ</th>
                  <th className="px-3 py-2 font-medium">ASP Δ</th>
                  <th className="px-3 py-2 font-medium">Attainment</th>
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
                          "px-3 py-2.5 font-mono font-semibold",
                          child.gapDollars > 0
                            ? "text-success-600"
                            : "text-error-600",
                        )}
                      >
                        {formatGapDollars(child.gapDollars)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-neutral-700">
                        {formatSignedInt(m.unitsDelta)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-neutral-700">
                        {formatAsp(m.aspDelta)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-neutral-700">
                        {m.attainmentPct}%
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(m.issueChips ?? []).map((chip) => (
                            <span
                              key={chip.chip}
                              className="rounded bg-neutral-100 px-1.5 py-0.5 text-2xs font-medium text-neutral-600"
                            >
                              {chip.chip} ×{chip.count}
                            </span>
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
      )}

      {isLeaf && (
        <p className="rounded-lg border border-dashed border-border bg-neutral-50 px-4 py-3 text-sm text-muted-foreground">
          SKU leaf — open this ASIN from Alerts for the full SkuRca detail, or
          ask AllyAI below about {selected.name}.
        </p>
      )}
    </div>
  );
}

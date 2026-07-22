"use client";

import { Package, Zap } from "lucide-react";
import { useMemo } from "react";

import { AlertImpactInsights } from "@/components/alerts-insights/alert-impact-insights";
import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import {
  formatAtRisk,
  getAlertStrategicInsights,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

/** Shared right-pane aggregate for issue- or category-grouped alerts */
export type AlertGroupDetail = {
  title: string;
  /** Stable id for feedback (issueKey or category id) */
  feedbackKey: string;
  skuCount: number;
  atRiskDollars: number;
  aiSignal?: string;
  skus: IssueSku[];
};

type AlertDetailPanelProps = {
  group: AlertGroupDetail;
  selectedSkuId: string | null;
  onSelectSku: (skuId: string) => void;
};

export function AlertDetailPanel({
  group,
  selectedSkuId,
  onSelectSku,
}: AlertDetailPanelProps) {
  const remaining = Math.max(group.skuCount - group.skus.length, 0);
  const remainingGap = Math.max(
    group.atRiskDollars -
      group.skus.reduce((sum, s) => sum + Math.abs(s.gapDollars), 0),
    0,
  );

  // Highest revenue at risk first (same number as Gap $, shown as positive $)
  const sortedSkus = useMemo(
    () =>
      [...group.skus].sort(
        (a, b) => Math.abs(b.gapDollars) - Math.abs(a.gapDollars),
      ),
    [group.skus],
  );

  // A/B/C strategic layer between AI signal and the SKU table
  const strategicInsights = useMemo(
    () =>
      getAlertStrategicInsights(
        group.skus,
        group.atRiskDollars,
        group.feedbackKey,
      ),
    [group.skus, group.atRiskDollars, group.feedbackKey],
  );

  // Competitive columns when every visible row has BB / price data
  const showCompetitiveCols = useMemo(
    () =>
      sortedSkus.length > 0 &&
      sortedSkus.every(
        (sku) =>
          sku.bbOwner != null &&
          sku.theirPrice != null &&
          sku.ourPrice != null,
      ),
    [sortedSkus],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex flex-col gap-5 p-6">
        {/* Title + compact $ / SKU strip */}
        <div className="shrink-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-semibold text-foreground">
              {group.title}
            </h2>
            <div
              className="inline-flex items-center gap-2 rounded-md border border-border bg-neutral-50 px-2 py-1"
              aria-label="Alert summary"
            >
              <span className="font-mono text-sm font-bold tabular-nums text-error-600">
                {formatAtRisk(group.atRiskDollars)}
              </span>
              <span className="text-xs text-muted-foreground">at risk</span>
              <span className="text-neutral-300" aria-hidden>
                ·
              </span>
              <span className="text-sm tabular-nums text-foreground">
                {group.skuCount}{" "}
                <span className="text-muted-foreground">
                  {group.skuCount === 1 ? "SKU" : "SKUs"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {group.aiSignal && (
          <section className="shrink-0 rounded-lg border border-warning-200 bg-warning-50 p-4">
            <p className="flex items-center gap-1.5 text-2xs font-semibold tracking-wider text-warning-700 uppercase">
              <Zap className="size-3.5 fill-warning-500 text-warning-500" />
              AI Signal — Systemic Pattern
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-800">
              {group.aiSignal}
            </p>
          </section>
        )}

        {group.skus.length > 0 && (
          <div className="shrink-0">
            <AlertImpactInsights insights={strategicInsights} />
          </div>
        )}

        {sortedSkus.length > 0 ? (
          <section className="shrink-0 overflow-hidden rounded-xl border border-border bg-background shadow-xs">
            {/* Table section title — names this as the SKU list */}
            <div className="flex items-center justify-between gap-3 border-b border-border bg-neutral-50/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <Package
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
                <h3 className="text-sm font-semibold text-foreground">
                  Affected SKUs
                </h3>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-2xs font-medium text-neutral-600">
                  {sortedSkus.length}
                  {remaining > 0 ? ` of ${group.skuCount}` : ""}
                </span>
              </div>
              <p className="text-2xs text-muted-foreground">
                Sorted by revenue at risk ↓
              </p>
            </div>

            <div className="overflow-x-auto">
              {/* Full-width table so rows reach the card edges */}
              <table className="w-full min-w-full table-auto text-sm">
                <thead className="bg-neutral-50 text-2xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="w-full px-3 py-2 text-left font-medium">
                      Product
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                      Revenue at risk
                    </th>
                    {showCompetitiveCols ? (
                      <>
                        <th className="whitespace-nowrap px-3 py-2 text-left font-medium">
                          BB Owner
                        </th>
                        <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                          Competitor price
                        </th>
                        <th className="whitespace-nowrap px-3 py-2 text-right font-medium">
                          Your price
                        </th>
                      </>
                    ) : (
                      <th className="whitespace-nowrap px-3 py-2 text-left font-medium">
                        Seller
                      </th>
                    )}
                    <th className="whitespace-nowrap px-3 py-2 text-left font-medium">
                      Lost At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSkus.map((sku) => (
                    <SkuRow
                      key={sku.id}
                      sku={sku}
                      selected={selectedSkuId === sku.id}
                      showCompetitiveCols={showCompetitiveCols}
                      onSelect={() => onSelectSku(sku.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {remaining > 0 && (
              <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                + {remaining} more SKUs · {formatAtRisk(remainingGap)} combined
              </p>
            )}
          </section>
        ) : (
          <p className="shrink-0 text-sm text-muted-foreground">
            No SKU rows loaded for this alert yet. Expand the group in the left
            panel when SKUs are available.
          </p>
        )}
      </div>
    </div>
  );
}

function SkuRow({
  sku,
  selected,
  showCompetitiveCols,
  onSelect,
}: {
  sku: IssueSku;
  selected: boolean;
  showCompetitiveCols: boolean;
  onSelect: () => void;
}) {
  return (
    <tr
      onClick={onSelect}
      className={cn(
        "cursor-pointer border-t border-border",
        selected
          ? "bg-brand-50 ring-1 ring-inset ring-brand-200"
          : "hover:bg-neutral-50",
      )}
    >
      <td className="w-full px-3 py-2.5 text-left">
        <div className="flex items-center gap-2.5">
          <SkuThumbnail name={sku.name} size={36} />
          <span className="font-medium text-foreground">{sku.name}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono font-semibold text-error-600">
        {formatAtRisk(Math.abs(sku.gapDollars))}
      </td>
      {showCompetitiveCols ? (
        <>
          <td className="whitespace-nowrap px-3 py-2.5 text-left text-neutral-700">
            {sku.bbOwner ?? "—"}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-neutral-700">
            {sku.theirPrice != null ? `$${sku.theirPrice}` : "—"}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-neutral-700">
            {sku.ourPrice != null ? `$${sku.ourPrice}` : "—"}
          </td>
        </>
      ) : (
        <td className="whitespace-nowrap px-3 py-2.5 text-left text-neutral-700">
          {sku.seller}
        </td>
      )}
      <td className="whitespace-nowrap px-3 py-2.5 text-left text-muted-foreground">
        {sku.lostAt ?? "—"}
      </td>
    </tr>
  );
}

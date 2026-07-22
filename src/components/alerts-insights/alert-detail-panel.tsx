"use client";

import { Package } from "lucide-react";
import { useMemo } from "react";

import { AlertImpactInsights } from "@/components/alerts-insights/alert-impact-insights";
import {
  AllyAiHeader,
  AllyAiSurface,
} from "@/components/alerts-insights/ally-ai-surface";
import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import {
  formatGapDollars,
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
  gapDollars: number;
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
  // Remaining Gap $ when only a subset of SKUs is loaded in the table
  const remainingGap =
    group.gapDollars - group.skus.reduce((sum, s) => sum + s.gapDollars, 0);

  // Worst Gap $ first (most negative)
  const sortedSkus = useMemo(
    () => [...group.skus].sort((a, b) => a.gapDollars - b.gapDollars),
    [group.skus],
  );

  // A/B/C strategic layer between AI signal and the SKU table
  const strategicInsights = useMemo(
    () =>
      getAlertStrategicInsights(
        group.skus,
        group.gapDollars,
        group.feedbackKey,
      ),
    [group.skus, group.gapDollars, group.feedbackKey],
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
                {formatGapDollars(group.gapDollars)}
              </span>
              <span className="text-xs text-muted-foreground">Gap</span>
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
          <AllyAiSurface className="shrink-0" contentClassName="p-4 md:p-5">
            <AllyAiHeader label="AllyAI Signal — Systemic Pattern" />
            <p className="mt-3 text-sm leading-relaxed text-neutral-800">
              {group.aiSignal}
            </p>
          </AllyAiSurface>
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
                Sorted by $ Gap ↓
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
                      $ Gap
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
                + {remaining} more SKUs · {formatGapDollars(remainingGap)}{" "}
                combined
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
        {formatGapDollars(sku.gapDollars)}
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

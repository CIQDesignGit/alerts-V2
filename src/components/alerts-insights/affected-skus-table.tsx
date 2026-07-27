"use client";

import { Package } from "lucide-react";
import { useMemo } from "react";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import { formatGapDollars, type IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type AffectedSkusTableProps = {
  skus: IssueSku[];
  totalSkuCount: number;
  totalGapDollars: number;
  selectedSkuId: string | null;
  onSelectSku: (skuId: string) => void;
};

export function AffectedSkusTable({
  skus,
  totalSkuCount,
  totalGapDollars,
  selectedSkuId,
  onSelectSku,
}: AffectedSkusTableProps) {
  const remaining = Math.max(totalSkuCount - skus.length, 0);
  const remainingGap =
    totalGapDollars - skus.reduce((sum, s) => sum + s.gapDollars, 0);

  const sortedSkus = useMemo(
    () => [...skus].sort((a, b) => a.gapDollars - b.gapDollars),
    [skus],
  );

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

  if (sortedSkus.length === 0) {
    return (
      <p className="shrink-0 text-sm text-muted-foreground">
        No SKU rows loaded for this selection yet.
      </p>
    );
  }

  return (
    <section className="shrink-0 overflow-hidden rounded-xl border border-border bg-background shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-neutral-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            Affected SKUs
          </h3>
          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-2xs font-medium text-neutral-600">
            {sortedSkus.length}
            {remaining > 0 ? ` of ${totalSkuCount}` : ""}
          </span>
        </div>
        <p className="text-2xs text-muted-foreground">Sorted by $ Gap ↓</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto text-sm">
          <thead className="bg-neutral-50 text-2xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="w-full px-3 py-2 text-left font-medium">Product</th>
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
          + {remaining} more SKUs · {formatGapDollars(remainingGap)} combined
        </p>
      )}
    </section>
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

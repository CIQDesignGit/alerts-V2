"use client";

import { ChevronsUp, ChevronUp, Info } from "lucide-react";
import { useMemo } from "react";

import { getMediaSpendSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type MediaSpendSkuDetailProps = {
  sku: IssueSku;
};

function formatMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) return `$${(abs / 1000).toFixed(2)}K`.replace(/\.00K$/, "K");
  return `$${abs.toFixed(2)}`;
}

/** Media Spend — top contributing keywords performance table. */
export function MediaSpendSkuDetail({ sku }: MediaSpendSkuDetailProps) {
  const detail = useMemo(() => getMediaSpendSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Top Contributing Keywords
        </h3>
        <p className="text-xs text-muted-foreground">{detail.periodLabel}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-neutral-50 text-left text-2xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Keyword</th>
              <th className="px-4 py-3">
                <span className="inline-flex items-center gap-1">
                  Importance
                  <Info className="size-3" aria-hidden />
                </span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="inline-flex items-center gap-1">
                  SFR
                  <Info className="size-3" aria-hidden />
                </span>
              </th>
              <th className="px-4 py-3 text-right">{detail.periodLabel}</th>
              <th className="px-4 py-3 text-right">
                {detail.previousPeriodLabel}
              </th>
              <th className="px-4 py-3 text-right">
                Keyword Rank
                <span className="mt-0.5 block font-normal normal-case">
                  (Previous → Last 7 Days)
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {detail.rows.map((row) => {
              const rankDelta = row.rankTo - row.rankFrom;
              const improved = rankDelta < 0;

              return (
                <tr key={row.id}>
                  <td className="px-4 py-3.5 font-medium text-foreground">
                    {row.keyword}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        row.importance === "High"
                          ? "text-error-700"
                          : "text-warning-700",
                      )}
                    >
                      {row.importance === "High" ? (
                        <ChevronsUp className="size-3.5" aria-hidden />
                      ) : (
                        <ChevronUp className="size-3.5" aria-hidden />
                      )}
                      {row.importance}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-foreground">
                    {row.sfr.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right text-foreground">
                    {formatMoney(row.last7Days)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-foreground">
                    −{formatMoney(Math.abs(row.previousDelta))}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-muted-foreground">
                      #{row.rankFrom}
                    </span>
                    <span className="mx-1 text-muted-foreground">→</span>
                    <span className="font-semibold text-foreground">
                      #{row.rankTo}
                    </span>{" "}
                    <span
                      className={cn(
                        "font-medium",
                        improved ? "text-success-600" : "text-error-600",
                      )}
                    >
                      ({improved ? "" : "+"}
                      {rankDelta})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

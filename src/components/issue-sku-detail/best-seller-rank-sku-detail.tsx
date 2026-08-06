"use client";

import { useMemo } from "react";

import { IssueDetailTableHeader, issueDetailTable } from "@/components/issue-sku-detail/issue-detail-table";
import { getBestSellerRankSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type BestSellerRankSkuDetailProps = {
  sku: IssueSku;
};

/** Best Seller Rank — key/value L7D metrics card (issue aggregation SKU view). */
export function BestSellerRankSkuDetail({
  sku,
}: BestSellerRankSkuDetailProps) {
  const detail = useMemo(() => getBestSellerRankSkuDetail(sku), [sku]);

  return (
    <div className={issueDetailTable.frame}>
      <IssueDetailTableHeader title="Best Seller Rank · Last 7 Days" />
      <div className="px-3 py-3">
        <dl>
          {detail.rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "flex items-center justify-between gap-6",
                issueDetailTable.row,
              )}
            >
              <dt className="px-2 py-1">
                <span className={issueDetailTable.cell}>{row.label}</span>
              </dt>
              <dd className="px-2 py-1">
                <span
                  className={cn(
                    issueDetailTable.cellRight,
                    "text-xs font-medium tabular-nums",
                  )}
                >
                  {row.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

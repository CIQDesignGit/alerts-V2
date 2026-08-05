"use client";

import { useMemo } from "react";

import { getBestSellerRankSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type BestSellerRankSkuDetailProps = {
  sku: IssueSku;
};

/** Best Seller Rank — key/value L7D metrics card (issue aggregation SKU view). */
export function BestSellerRankSkuDetail({
  sku,
}: BestSellerRankSkuDetailProps) {
  const detail = useMemo(() => getBestSellerRankSkuDetail(sku), [sku]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <dl className="divide-y divide-border">
        {detail.rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between gap-6 px-4 py-3.5"
          >
            <dt className="text-sm text-foreground">{row.label}</dt>
            <dd className="shrink-0 text-sm font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

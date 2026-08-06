"use client";

import {
  MessageSquare,
  Star,
  TrendingDown,
  Users,
} from "lucide-react";
import { useMemo } from "react";

import { IssueDetailTableHeader, issueDetailTable } from "@/components/issue-sku-detail/issue-detail-table";
import type { RatingReviewsRow } from "@/lib/mock-issue-sku-detail";
import { getRatingReviewsSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type RatingReviewsSkuDetailProps = {
  sku: IssueSku;
};

/** Rating & Reviews — brand vs competitor snapshot (issue aggregation SKU view). */
export function RatingReviewsSkuDetail({
  sku,
}: RatingReviewsSkuDetailProps) {
  const detail = useMemo(() => getRatingReviewsSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{detail.alertMessage}</p>

      <div className={issueDetailTable.frame}>
        <IssueDetailTableHeader title="Rating & Reviews Comparison" />
        <div className="px-3 py-3">
          <div
            className={cn(
              "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]",
              issueDetailTable.headRow,
            )}
          >
            <div className="px-2 py-1 align-top">
              <span className={issueDetailTable.thCell} />
            </div>
            <div className="px-2 py-1 align-top">
              <span
                className={cn(
                  issueDetailTable.thCell,
                  "text-2xs font-medium tracking-wider text-muted-foreground uppercase",
                )}
              >
                {detail.brandLabel}
              </span>
            </div>
            <div className="px-2 py-1 align-top">
              <span
                className={cn(
                  issueDetailTable.thCell,
                  "text-2xs font-medium tracking-wider text-muted-foreground uppercase",
                )}
              >
                {detail.competitorLabel}
              </span>
            </div>
          </div>

          {detail.rows.map((row) => (
            <ComparisonRow key={row.id} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ row }: { row: RatingReviewsRow }) {
  const Icon = ROW_ICONS[row.icon];

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]",
        issueDetailTable.row,
      )}
    >
      <div className="px-2 py-1">
        <span className={cn(issueDetailTable.cell, "gap-2")}>
          <Icon className="size-4 shrink-0 text-neutral-500" aria-hidden />
          <span className="text-xs font-medium">{row.label}</span>
        </span>
      </div>
      <div className="px-2 py-1">
        <span className={issueDetailTable.cell}>
          <CellValue row={row} side="brand" />
        </span>
      </div>
      <div className="px-2 py-1">
        <span className={issueDetailTable.cell}>
          <CellValue row={row} side="competitor" />
        </span>
      </div>
    </div>
  );
}

function CellValue({
  row,
  side,
}: {
  row: RatingReviewsRow;
  side: "brand" | "competitor";
}) {
  if (row.icon === "rating") {
    const rating =
      side === "brand" ? row.brandRating : row.competitorRating;
    const label = side === "brand" ? row.brandValue : row.competitorValue;
    return (
      <span className="inline-flex items-center gap-2 text-xs font-medium">
        <StarRating rating={rating ?? 0} />
        {label}
      </span>
    );
  }

  return (
    <span className="text-xs font-medium tabular-nums">
      {side === "brand" ? row.brandValue : row.competitorValue}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full >= 0.25;

  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < full
              ? "fill-warning-400 text-warning-400"
              : index === full && partial
                ? "fill-warning-200 text-warning-400"
                : "fill-neutral-200 text-neutral-300",
          )}
        />
      ))}
    </span>
  );
}

const ROW_ICONS = {
  rating: Star,
  reviews: Users,
  velocity: MessageSquare,
  sentiment: TrendingDown,
} as const;

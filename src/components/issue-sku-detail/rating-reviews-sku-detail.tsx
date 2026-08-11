"use client";

import { ArrowRight, Star } from "lucide-react";
import { useMemo } from "react";

import { getRatingReviewsSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type RatingReviewsSkuDetailProps = {
  sku: IssueSku;
};

/** Show whole numbers as “4”, keep one decimal for values like 4.2 */
function formatRating(rating: number): string {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

/** Rating Dropped — Old → New rating cards (issue aggregation SKU view). */
export function RatingReviewsSkuDetail({
  sku,
}: RatingReviewsSkuDetailProps) {
  const detail = useMemo(() => getRatingReviewsSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{detail.summary}</p>

      <div className="flex flex-wrap items-center gap-3">
        <RatingCard
          rating={detail.oldRating}
          label="Old"
          variant="old"
        />
        <ArrowRight
          className="size-5 shrink-0 text-neutral-300"
          aria-hidden
        />
        <RatingCard
          rating={detail.newRating}
          label="New"
          variant="new"
        />
      </div>
    </div>
  );
}

function RatingCard({
  rating,
  label,
  variant,
}: {
  rating: number;
  label: string;
  variant: "old" | "new";
}) {
  const isNew = variant === "new";

  return (
    <div className="min-w-38 rounded-xl border border-border bg-neutral-50 px-5 py-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-2xl font-bold tracking-tight tabular-nums",
            isNew ? "text-error-600" : "text-neutral-700",
          )}
        >
          {formatRating(rating)}
        </span>
        <StarRating rating={rating} tone={variant} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function StarRating({
  rating,
  tone,
}: {
  rating: number;
  tone: "old" | "new";
}) {
  const full = Math.floor(rating);
  const partial = rating - full >= 0.25;
  const filled =
    tone === "new"
      ? "fill-error-500 text-error-500"
      : "fill-neutral-400 text-neutral-400";
  const partialFill =
    tone === "new"
      ? "fill-error-200 text-error-500"
      : "fill-neutral-200 text-neutral-400";

  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < full
              ? filled
              : index === full && partial
                ? partialFill
                : "fill-transparent text-neutral-300",
          )}
        />
      ))}
    </span>
  );
}

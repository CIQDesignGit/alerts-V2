"use client";

import { ArrowRight } from "lucide-react";
import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBestSellerRankSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type BestSellerRankSkuDetailProps = {
  sku: IssueSku;
};

const PREVIOUS_AVG_TOOLTIP =
  "This baseline rank is calculated based on the available data from the previous 3 days.";
const CURRENT_AVG_TOOLTIP =
  "This current rank is calculated based on the available data from the last 24 hours.";

/**
 * Elongated hexagon — long vertical sides (~70%), shallow obtuse peaks,
 * rounded corners. viewBox 100×140.
 */
const BADGE_PATH =
  "M41.06 12.47 Q50 8 58.94 12.47 L81.06 23.53 Q90 28 90 38 L90 102 Q90 112 81.06 116.47 L58.94 127.53 Q50 132 41.06 127.53 L18.94 116.47 Q10 112 10 102 L10 38 Q10 28 18.94 23.53 Z";

/** Best Seller Rank — previous → current rank badges (issue aggregation SKU view). */
export function BestSellerRankSkuDetail({
  sku,
}: BestSellerRankSkuDetailProps) {
  const detail = useMemo(() => getBestSellerRankSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col items-start gap-5">
      <p className="max-w-xl text-sm text-muted-foreground">
        {detail.summaryBefore}
        <span className="font-semibold text-foreground">{detail.category}</span>
        .
      </p>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-4"
        aria-label={`Rank changed from #${detail.previousRank} to #${detail.currentRank}`}
      >
        <RankBadge
          rank={detail.previousRank}
          avgLabel={detail.previousAvgLabel}
          avgTooltip={PREVIOUS_AVG_TOOLTIP}
          variant="previous"
        />

        {/* Transition cue — heavier than decorative gray-on-gray */}
        <ArrowRight
          className="size-6 shrink-0 text-neutral-400"
          strokeWidth={1.75}
          aria-hidden
        />

        <RankBadge
          rank={detail.currentRank}
          avgLabel={detail.currentAvgLabel}
          avgTooltip={CURRENT_AVG_TOOLTIP}
          variant="current"
        />
      </div>
    </div>
  );
}

function RankBadge({
  rank,
  avgLabel,
  avgTooltip,
  variant,
}: {
  rank: number;
  avgLabel: string;
  avgTooltip: string;
  variant: "previous" | "current";
}) {
  const isCurrent = variant === "current";

  return (
    <div
      className={cn(
        "relative h-48 w-40 shrink-0",
        // Elevate the “after” badge so the drop is the focal point
        isCurrent && "drop-shadow-sm",
      )}
    >
      <svg
        viewBox="0 0 100 140"
        className="absolute inset-0 size-full"
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={BADGE_PATH}
          className={
            isCurrent
              ? "fill-error-50 stroke-error-500"
              : "fill-neutral-50 stroke-neutral-200"
          }
          strokeWidth={1.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Content sits in the flat mid-band of the hexagon */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pt-1">
        <span
          className={cn(
            "text-2xs font-medium tracking-wider uppercase",
            isCurrent ? "text-error-600/80" : "text-neutral-500",
          )}
        >
          Rank
        </span>
        <span
          className={cn(
            "mt-0.5 text-2xl font-bold tracking-tight tabular-nums",
            isCurrent ? "text-error-600" : "text-neutral-800",
          )}
        >
          #{rank}
        </span>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "mt-2.5 cursor-help border-b border-dotted text-xs",
              isCurrent
                ? "border-error-300 text-neutral-500"
                : "border-neutral-400 text-neutral-500",
            )}
            aria-label={`About ${avgLabel}`}
          >
            {avgLabel}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-left leading-snug">
            {avgTooltip}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

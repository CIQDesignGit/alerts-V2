"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getKeywordRankSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type KeywordRankSkuDetailProps = {
  sku: IssueSku;
};

const PREVIOUS_RANK_TOOLTIP =
  "Previous ranks are calculated based on the available data from the previous 90 days";

const THRESHOLD_BREACH_TOOLTIP =
  "Threshold Breached: Organic keyword rank crossed the defined threshold of 5 ranks.";

/** Keyword Rank — drop cards with threshold badge. */
export function KeywordRankSkuDetail({ sku }: KeywordRankSkuDetailProps) {
  const detail = useMemo(() => getKeywordRankSkuDetail(sku), [sku]);
  const hasThresholdBreach = detail.cards.some((card) => card.thresholdBreached);

  return (
    <div className="flex flex-col gap-4">
      <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>{detail.summary}</span>
        <Tooltip>
          <TooltipTrigger
            className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
            aria-label="About keyword ranks"
          >
            <Info className="size-3.5" aria-hidden />
          </TooltipTrigger>
          <TooltipContent className="flex max-w-xs flex-col gap-2 text-left leading-snug">
            <p>{PREVIOUS_RANK_TOOLTIP}</p>
            {hasThresholdBreach && <p>{THRESHOLD_BREACH_TOOLTIP}</p>}
          </TooltipContent>
        </Tooltip>
      </p>

      <ul className="flex flex-col gap-3">
        {detail.cards.map((card) => (
          <li
            key={card.id}
            className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-background px-4 py-4"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                &ldquo;{card.keyword}&rdquo;
              </span>
              {card.thresholdBreached && (
                <span className="rounded-full bg-error-100 px-2.5 py-0.5 text-2xs font-semibold text-error-700">
                  Threshold Breached
                </span>
              )}
            </div>

            {/* One rank change per keyword — no Organic / Paid split */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">#{card.rankFrom}</span>
              <span className="text-muted-foreground">→</span>
              <span
                className={cn(
                  "font-semibold",
                  card.emphasizeDrop ? "text-error-600" : "text-foreground",
                )}
              >
                #{card.rankTo}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

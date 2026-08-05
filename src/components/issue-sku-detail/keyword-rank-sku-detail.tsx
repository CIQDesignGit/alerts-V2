"use client";

import { useMemo } from "react";

import { getKeywordRankSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type KeywordRankSkuDetailProps = {
  sku: IssueSku;
};

/** Keyword Rank — drop cards with threshold badge. */
export function KeywordRankSkuDetail({ sku }: KeywordRankSkuDetailProps) {
  const detail = useMemo(() => getKeywordRankSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{detail.summary}</p>

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

            <div className="flex flex-col items-end gap-1.5 text-sm">
              <RankLine
                label="Organic"
                from={card.organicFrom}
                to={card.organicTo}
                emphasize={card.emphasizeDrop}
              />
              {card.paidFrom != null && card.paidTo != null && (
                <RankLine
                  label="Paid"
                  from={card.paidFrom}
                  to={card.paidTo}
                  emphasize={card.emphasizeDrop}
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">{detail.thresholdNote}</p>
    </div>
  );
}

function RankLine({
  label,
  from,
  to,
  emphasize,
}: {
  label: string;
  from: number;
  to: number;
  emphasize: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-right text-2xs text-muted-foreground">
        {label}
      </span>
      <span className="text-muted-foreground">#{from}</span>
      <span className="text-muted-foreground">→</span>
      <span
        className={cn(
          "font-semibold",
          emphasize ? "text-error-600" : "text-foreground",
        )}
      >
        #{to}
      </span>
    </div>
  );
}

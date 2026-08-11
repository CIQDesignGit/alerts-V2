"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getConversionDropSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type ConversionDropSkuDetailProps = {
  sku: IssueSku;
};

const BASELINE_TOOLTIP =
  "Yesterday (D-1) vs. 7-day baseline (D-2 through D-8)";

/** Conversion Drop — conversion + glance views metric cards. */
export function ConversionDropSkuDetail({
  sku,
}: ConversionDropSkuDetailProps) {
  const detail = useMemo(() => getConversionDropSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{detail.summary}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {detail.cards.map((card) => (
          <div
            key={card.id}
            className="rounded-xl border border-border bg-background px-4 py-4"
          >
            {/* Title + info */}
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {card.title}
              <Tooltip>
                <TooltipTrigger
                  className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
                  aria-label={`About ${card.title} comparison period`}
                >
                  <Info className="size-3.5" aria-hidden />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-left leading-snug">
                  {BASELINE_TOOLTIP}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Big from → to */}
            <p className="mt-3 text-lg tabular-nums">
              <span className="text-neutral-700">{card.from}</span>
              <span className="mx-1.5 text-muted-foreground">→</span>
              <span className="font-semibold text-error-600">{card.to}</span>
            </p>

            {/* Secondary detail row (magnitude / deviation) */}
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">{card.detailLabel}</span>{" "}
              <span className="font-medium text-foreground">
                {card.detailValue}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

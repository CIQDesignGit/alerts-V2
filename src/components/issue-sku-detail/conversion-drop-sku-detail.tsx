"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";

import { getConversionDropSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type ConversionDropSkuDetailProps = {
  sku: IssueSku;
};

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
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              {card.title}
              <Info className="size-3.5 text-neutral-400" aria-hidden />
            </div>
            <p className="mt-3 text-lg">
              <span className="text-neutral-600">{card.from}</span>
              <span className="mx-1.5 text-muted-foreground">→</span>
              <span className="font-medium text-error-600">{card.to}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                {card.changeLabel}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

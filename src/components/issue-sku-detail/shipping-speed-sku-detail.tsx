"use client";

import { Check } from "lucide-react";
import { useMemo } from "react";

import {
  getShippingSpeedSkuDetail,
  type ShippingMarketPoint,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type ShippingSpeedSkuDetailProps = {
  sku: IssueSku;
};

/** Stem length down to the bar — taller levels need longer stems */
const STEM_CLASS: Record<ShippingMarketPoint["level"], string> = {
  1: "h-3",
  2: "h-10",
  3: "h-[4.25rem]",
};

/** Shipping Speed — avg delivery + market timeline bar. */
export function ShippingSpeedSkuDetail({ sku }: ShippingSpeedSkuDetailProps) {
  const detail = useMemo(() => getShippingSpeedSkuDetail(sku), [sku]);
  const dangerPct = Math.round(detail.dangerAt * 100);
  const okPct = 100 - dangerPct;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{detail.summary}</p>

      <div className="rounded-xl border border-border bg-background px-5 py-5">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,190px)_minmax(0,1fr)]">
          {/* Left stats */}
          <div className="flex flex-col pb-6">
            <p className="text-[2rem] leading-none font-bold tracking-tight text-neutral-800">
              {detail.avgDays} Days
            </p>
            <p className="mt-2 text-sm font-semibold text-neutral-800">
              Avg delivery time
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              across {detail.marketCount} markets
            </p>

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <p className="text-xs leading-snug">
                <span className="font-semibold text-error-600">
                  +{detail.daysAbovePrime} days
                </span>{" "}
                <span className="text-muted-foreground">
                  more than standard Prime delivery
                </span>
              </p>
            </div>
          </div>

          {/* Timeline — all labels above the bar */}
          <div className="min-w-0 px-2">
            <div className="relative h-28">
              {detail.markets.map((market) => (
                <div
                  key={market.id}
                  className="absolute bottom-0 z-10 flex -translate-x-1/2 flex-col items-center"
                  style={{ left: `${market.position * 100}%` }}
                >
                  <PillBubble market={market} />
                  <div
                    className={cn("w-px bg-neutral-300", STEM_CLASS[market.level])}
                    aria-hidden
                  />
                </div>
              ))}
            </div>

            <div className="relative mx-1 h-2.5 overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 rounded-l-full bg-info-100"
                style={{ width: `${okPct}%` }}
              />
              <div
                className="absolute inset-y-0 right-0 rounded-r-full bg-error-100"
                style={{ width: `${dangerPct}%` }}
              />
            </div>

            <div className="mx-1 mt-1.5 flex justify-between text-2xs text-neutral-400">
              <span>{detail.barMinDays} day</span>
              <span>{detail.barMaxDays} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PillBubble({ market }: { market: ShippingMarketPoint }) {
  const isPrime = market.tier === "prime";

  return (
    <div
      className={cn(
        "whitespace-nowrap rounded-full border bg-background px-2.5 py-1 text-xs shadow-xs",
        isPrime ? "border-info-100" : "border-neutral-200",
      )}
    >
      <span className="font-semibold text-neutral-800">{market.city}</span>{" "}
      <span className="text-neutral-500">{market.days} Days</span>{" "}
      {isPrime ? (
        <span className="inline-flex items-center gap-0.5 align-middle font-medium text-info-600">
          <Check
            className="size-3.5 stroke-[2.5] text-warning-500"
            aria-hidden
          />
          prime
        </span>
      ) : (
        <span className="text-neutral-400">(Standard)</span>
      )}
    </div>
  );
}

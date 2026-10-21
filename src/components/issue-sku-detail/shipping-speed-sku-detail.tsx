"use client";

import { Check, TriangleAlert } from "lucide-react";
import { useMemo, type ReactNode } from "react";

import {
  getShippingSpeedSkuDetail,
  type ShippingMarketPoint,
  type ShippingSpeedAlertInfo,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type ShippingSpeedSkuDetailProps = {
  sku: IssueSku;
};

function ShippingSpeedAlertBlock({ alert }: { alert: ShippingSpeedAlertInfo }) {
  const standardDelta = `+${alert.standardPromiseDelta} days`;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-foreground">{alert.headline}</p>

      <div className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-background">
        <AlertMetricTile
          label="Standard promise (days)"
          tone="alert"
          footer={`Worst market: ${alert.worstMarket}`}
        >
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums">
            <span className="text-lg font-bold text-foreground">
              {alert.standardPromiseFrom}
              <span className="mx-1 font-normal text-neutral-400">→</span>
              {alert.standardPromiseTo}
            </span>
            <span className="text-sm font-bold text-error-600">
              {standardDelta}
            </span>
          </p>
        </AlertMetricTile>

        <AlertMetricTile
          label="Prime promise (days)"
          footer={alert.primePromiseDetail}
        >
          <p className="text-base font-bold text-success-700">
            {alert.primePromiseLabel}
          </p>
        </AlertMetricTile>

        <AlertMetricTile
          label="Markets affected"
          footer={alert.marketsAffectedDetail}
        >
          <p className="text-lg font-bold tabular-nums text-foreground">
            {alert.marketsAffected} of {alert.marketsCrawled} crawled
          </p>
        </AlertMetricTile>
      </div>

      <p className="text-xs text-muted-foreground">{alert.statusLine}</p>
    </div>
  );
}

/** Metric strip cell — label / value / footer (matches issue SKU metric tiles). */
function AlertMetricTile({
  label,
  tone = "neutral",
  footer,
  children,
}: {
  label: string;
  tone?: "alert" | "neutral";
  footer?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[5.5rem] min-w-0 flex-col px-4 py-3",
        tone === "alert" && "bg-error-25",
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 min-h-0 flex-1">{children}</div>
      {footer ? (
        <p className="mt-2 text-2xs leading-snug text-muted-foreground">
          {footer}
        </p>
      ) : null}
    </div>
  );
}

/** Stem length down to the bar — light stagger within each column */
const STEM_CLASS: Record<ShippingMarketPoint["level"], string> = {
  1: "h-3",
  2: "h-6",
  3: "h-10",
};

/** Shipping Speed — avg delivery + market timeline bar. */
export function ShippingSpeedSkuDetail({ sku }: ShippingSpeedSkuDetailProps) {
  const detail = useMemo(() => getShippingSpeedSkuDetail(sku), [sku]);
  const marketsByPosition = useMemo(
    () => [...detail.markets].sort((a, b) => a.position - b.position),
    [detail.markets],
  );
  const okPct = Math.round(detail.dangerAt * 100);
  const dangerPct = 100 - okPct;

  return (
    <div className="flex flex-col gap-3">
      <ShippingSpeedAlertBlock alert={detail.alert} />

      <div className="rounded-xl border border-border bg-background px-5 py-5">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,11.875rem)_minmax(18rem,1fr)]">
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

          {/* Timeline — equal columns; pills wrap inside cells (no horizontal bleed) */}
          <div className="min-w-0 px-1">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${marketsByPosition.length}, minmax(0, 1fr))`,
              }}
            >
              {marketsByPosition.map((market) => (
                <div
                  key={market.id}
                  className="flex min-w-0 flex-col items-center justify-end"
                >
                  <PillBubble market={market} />
                  <div
                    className={cn(
                      "mt-1 w-px shrink-0 bg-neutral-300",
                      STEM_CLASS[market.level],
                    )}
                    aria-hidden
                  />
                </div>
              ))}
            </div>

            <div className="relative mx-1 mt-0 h-2.5 overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 rounded-l-full bg-info-100"
                style={{ width: `${okPct}%` }}
              />
              <div
                className="absolute inset-y-0 right-0 rounded-r-full bg-error-100"
                style={{ width: `${dangerPct}%` }}
              />
              {marketsByPosition.map((market, index) => {
                const columnCenterPct =
                  ((index + 0.5) / marketsByPosition.length) * 100;

                return (
                  <div
                    key={market.id}
                    className="absolute top-1/2 z-10 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-500"
                    style={{ left: `${columnCenterPct}%` }}
                    aria-hidden
                  />
                );
              })}
            </div>

            <div className="mx-1 mt-1.5 flex justify-between text-2xs text-neutral-400">
              <span>
                {detail.barMinDays}{" "}
                {detail.barMinDays === 1 ? "day" : "days"}
              </span>
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
  const standardWorsened = market.standardDelta > 0;

  return (
    <div
      className={cn(
        "box-border w-full max-w-full min-w-0 overflow-hidden rounded-xl border bg-background px-1.5 py-1.5 text-center shadow-xs",
        isPrime ? "border-info-100" : "border-neutral-200",
        standardWorsened && "border-l-2 border-l-error-500",
      )}
    >
      <p className="text-2xs leading-snug font-semibold text-neutral-800">
        {market.city}
      </p>
      <p className="mt-0.5 flex flex-wrap items-center justify-center gap-x-1 gap-y-0 text-2xs leading-snug">
        <span className="text-neutral-500">{market.days} Days</span>
        {isPrime ? (
          <span className="inline-flex items-center gap-0.5 font-medium text-info-600">
            <Check
              className="size-3 stroke-[2.5] text-warning-500"
              aria-hidden
            />
            prime
          </span>
        ) : (
          <span className="text-neutral-400">(Standard)</span>
        )}
      </p>
      <div className="mt-1 flex flex-col items-center gap-0.5 text-2xs leading-snug tabular-nums">
        <p className="flex flex-wrap items-center justify-center gap-x-1">
          <span className="text-neutral-600">
            {market.standardFrom}
            <span className="text-neutral-400"> → </span>
            {market.standardTo}
          </span>
          {standardWorsened ? (
            <span className="inline-flex items-center gap-0.5 font-semibold text-error-600">
              <TriangleAlert className="size-2.5 shrink-0" aria-hidden />
              +{market.standardDelta}
            </span>
          ) : null}
        </p>
        {market.primeBadge &&
        market.primeFrom != null &&
        market.primeTo != null ? (
          <p className="text-neutral-600">
            Prime {market.primeFrom}
            <span className="text-neutral-400"> → </span>
            {market.primeTo}
          </p>
        ) : (
          <span
            className="rounded-full bg-neutral-100 px-1.5 py-px text-2xs font-medium text-neutral-600"
          >
            no Prime
          </span>
        )}
      </div>
    </div>
  );
}

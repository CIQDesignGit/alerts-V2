"use client";

import { Check, TriangleAlert } from "lucide-react";
import { useMemo, type CSSProperties, type ReactNode } from "react";

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

/** Market card size and stagger — cards alternate between two rows so neighbours never collide. */
const CARD_MIN_WIDTH_REM = 9;
const CARD_HEIGHT_REM = 3.5;
const ROW_GAP_REM = 0.5;
const CONNECTOR_REM = 1;
const MARKETS_AREA_HEIGHT_REM =
  CARD_HEIGHT_REM * 2 + ROW_GAP_REM + CONNECTOR_REM;

function columnCenterPct(index: number, count: number): number {
  return ((index + 0.5) / count) * 100;
}

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
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,9.5rem)_minmax(22rem,1fr)]">
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

          {/* Timeline — cards alternate top/bottom rows above evenly spaced ticks */}
          <div className="min-w-0">
            <div
              className="relative"
              style={{ height: `${MARKETS_AREA_HEIGHT_REM}rem` }}
            >
              {marketsByPosition.map((market, index) => {
                const center = columnCenterPct(index, marketsByPosition.length);
                const isTopRow = index % 2 === 0;
                const cardTopRem = isTopRow ? 0 : CARD_HEIGHT_REM + ROW_GAP_REM;
                const isFirst = index === 0;
                const isLast = index === marketsByPosition.length - 1;
                // Cards size to their content, so edge cards pin to the track edge instead of centring
                const horizontal: CSSProperties = isFirst
                  ? { left: 0 }
                  : isLast
                    ? { right: 0 }
                    : { left: `${center}%`, transform: "translateX(-50%)" };

                return (
                  <div key={market.id}>
                    <div
                      className="absolute w-px -translate-x-1/2 bg-neutral-300"
                      style={{
                        left: `${center}%`,
                        top: `${cardTopRem + CARD_HEIGHT_REM}rem`,
                        bottom: 0,
                      }}
                      aria-hidden
                    />
                    <div
                      className="absolute z-10"
                      style={{
                        top: `${cardTopRem}rem`,
                        width: "max-content",
                        minWidth: `${CARD_MIN_WIDTH_REM}rem`,
                        height: `${CARD_HEIGHT_REM}rem`,
                        ...horizontal,
                      }}
                    >
                      <PillBubble market={market} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative h-2.5 overflow-visible rounded-full">
              <div
                className="absolute inset-y-0 left-0 rounded-l-full bg-info-100"
                style={{ width: `${okPct}%` }}
              />
              <div
                className="absolute inset-y-0 right-0 rounded-r-full bg-error-100"
                style={{ width: `${dangerPct}%` }}
              />
              {marketsByPosition.map((market, index) => (
                <div
                  key={market.id}
                  className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${columnCenterPct(index, marketsByPosition.length)}%`,
                  }}
                  aria-hidden
                >
                  <div className="h-3 w-0.5 rounded-full bg-neutral-500" />
                </div>
              ))}
            </div>

            <div className="mt-1.5 flex justify-between text-2xs text-neutral-400">
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
        "flex size-full min-w-0 flex-col justify-center gap-1 rounded-lg border border-border bg-background py-2 pr-2 text-left shadow-xs",
        standardWorsened
          ? "border-l-[3px] border-l-error-500 pl-1.5"
          : "pl-2",
      )}
    >
      <p className="flex min-w-0 items-baseline gap-1 whitespace-nowrap text-xs leading-4 tracking-tight">
        <span className="font-semibold text-foreground">{market.city}</span>
        <span className="shrink-0 text-2xs tabular-nums text-muted-foreground">
          {market.days} Days
        </span>
        {isPrime ? (
          <span className="inline-flex shrink-0 items-center gap-px self-center text-2xs font-semibold text-info-600">
            <Check
              className="size-2.5 stroke-[3] text-warning-500"
              aria-hidden
            />
            prime
          </span>
        ) : (
          <span className="shrink-0 text-2xs text-neutral-400">Standard</span>
        )}
      </p>
      <p className="flex min-w-0 items-center gap-1 whitespace-nowrap text-2xs leading-4 tabular-nums">
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
        <span className="text-neutral-300" aria-hidden>
          ·
        </span>
        {market.primeBadge &&
        market.primeFrom != null &&
        market.primeTo != null ? (
          <span className="text-neutral-600">
            Prime {market.primeFrom}
            <span className="text-neutral-400"> → </span>
            {market.primeTo}
          </span>
        ) : (
          <span className="rounded-full bg-neutral-100 px-1.5 font-medium text-neutral-600">
            no Prime
          </span>
        )}
      </p>
    </div>
  );
}

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
          footer={<StandardPromiseAlertFooter alert={alert} />}
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

        <AlertMetricTile label="Prime promise (days)">
          <p className="text-base font-bold text-success-700">
            {alert.primePromiseLabel}
          </p>
        </AlertMetricTile>

        <AlertMetricTile label="Prime Badge Lost">
          <p className="text-lg font-bold text-foreground">
            {alert.primeBadgeLostLabel}
          </p>
        </AlertMetricTile>
      </div>
    </div>
  );
}

function StandardPromiseAlertFooter({
  alert,
}: {
  alert: ShippingSpeedAlertInfo;
}) {
  return (
    <div className="mt-2 flex flex-col gap-0.5 text-xs leading-snug text-muted-foreground">
      <p>
        <span className="font-medium text-foreground">Market:</span>{" "}
        {alert.primaryMarket}
      </p>
      <p>
        <span className="font-medium text-foreground">Affected since:</span> Last{" "}
        {alert.affectedSinceDays} days
      </p>
      <p>
        <span className="font-medium text-foreground">
          Other markets affected:
        </span>{" "}
        {alert.otherMarketsAffectedLabel}
      </p>
    </div>
  );
}

/** Metric strip cell — label / value / footer (matches issue SKU metric tiles). */
function AlertMetricTile({
  label,
  footer,
  children,
}: {
  label: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[5.5rem] min-w-0 flex-col px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 min-h-0 flex-1">{children}</div>
      {footer ? <div className="mt-auto">{footer}</div> : null}
    </div>
  );
}

/** Market card size and stagger — cards alternate between two rows so neighbours never collide. */
const CARD_MIN_WIDTH_REM = 10;
const CARD_HEIGHT_REM = 4.75;
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
  );
}

function PillBubble({ market }: { market: ShippingMarketPoint }) {
  const standardWorsened = market.standardDelta > 0;
  const hasPrime =
    market.primeBadge && market.primeFrom != null && market.primeTo != null;
  const primeDelta = hasPrime ? market.primeTo! - market.primeFrom! : 0;

  return (
    <div
      className={cn(
        "flex size-full min-w-0 flex-col gap-1.5 rounded-lg border border-border bg-background py-2 pr-2.5 text-left shadow-xs",
        standardWorsened ? "border-l-[3px] border-l-error-500 pl-2" : "pl-2.5",
      )}
    >
      <p className="truncate text-xs leading-4 font-semibold text-foreground">
        {market.city}
      </p>

      {/* Label · from → to · delta — columns align across both rows */}
      <dl className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-1 whitespace-nowrap text-2xs leading-4 tabular-nums">
        <dt className="text-muted-foreground">Standard</dt>
        <dd>
          <PromiseRange from={market.standardFrom} to={market.standardTo} />
        </dd>
        <dd>
          {standardWorsened ? (
            <DeltaFlag days={market.standardDelta} />
          ) : null}
        </dd>

        <dt className="inline-flex items-center gap-0.5 text-muted-foreground">
          <Check className="size-2.5 stroke-3 text-warning-500" aria-hidden />
          Prime
        </dt>
        {hasPrime ? (
          <>
            <dd>
              <PromiseRange from={market.primeFrom!} to={market.primeTo!} />
            </dd>
            <dd>{primeDelta > 0 ? <DeltaFlag days={primeDelta} /> : null}</dd>
          </>
        ) : (
          <dd className="col-span-2">
            <span className="rounded-full bg-neutral-100 px-1.5 py-px font-medium text-neutral-600">
              Badge lost
            </span>
          </dd>
        )}
      </dl>
    </div>
  );
}

function PromiseRange({ from, to }: { from: number; to: number }) {
  return (
    <span className="text-neutral-700">
      {from}
      <span className="text-neutral-400"> → </span>
      <span className="font-semibold text-foreground">{to}</span>
      <span className="text-muted-foreground"> {to === 1 ? "day" : "days"}</span>
    </span>
  );
}

function DeltaFlag({ days }: { days: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 font-semibold text-error-600">
      <TriangleAlert className="size-2.5 shrink-0" aria-hidden />+{days}
    </span>
  );
}

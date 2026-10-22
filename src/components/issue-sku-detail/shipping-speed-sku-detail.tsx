"use client";

import { Info } from "lucide-react";
import { useMemo, type ReactNode } from "react";

import { ShippingSpeedMarketGrid } from "@/components/issue-sku-detail/shipping-speed-market-grid";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getShippingSpeedSkuDetail,
  type ShippingSpeedAlertInfo,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type ShippingSpeedSkuDetailProps = {
  sku: IssueSku;
};

const STANDARD_PROMISE_TOOLTIP =
  "30-day median → latest promise from the last 24 hours of crawls. Delta is days slower (+) or faster (−). For the market below.";

function ShippingSpeedAlertHeadline({ alert }: { alert: ShippingSpeedAlertInfo }) {
  return (
    <p className="text-sm text-foreground">
      Standard delivery slowed by up to{" "}
      <span className="font-semibold tabular-nums text-foreground">
        {alert.standardPromiseDelta} days
      </span>{" "}
      in{" "}
      <span className="font-semibold tabular-nums text-foreground">
        {alert.marketsBreachingCount} markets
      </span>{" "}
      vs its <span className="font-semibold text-foreground">30-day norm</span>.
    </p>
  );
}

function ShippingSpeedAlertBlock({ alert }: { alert: ShippingSpeedAlertInfo }) {
  const standardDelta = `+${alert.standardPromiseDelta} days`;

  return (
    <div className="flex flex-col gap-3">
      <ShippingSpeedAlertHeadline alert={alert} />

      <div className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-background">
        <AlertMetricTile
          label="Standard promise (days)"
          labelInfoTooltip={STANDARD_PROMISE_TOOLTIP}
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
          <p className="text-sm font-semibold text-success-700">
            {alert.primePromiseLabel}
          </p>
        </AlertMetricTile>

        <AlertMetricTile label="Prime badge">
          <p className="text-sm font-semibold text-foreground">
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
    <div className="mt-2 flex flex-col gap-0.5 text-xs leading-snug">
      <p>
        <span className="text-neutral-400">Market:</span>{" "}
        <span className="font-medium text-foreground">{alert.primaryMarket}</span>
      </p>
      <p>
        <span className="text-neutral-400">First Seen:</span>{" "}
        <span className="font-medium text-foreground">
          {alert.affectedSinceDays} days ago
        </span>
      </p>
    </div>
  );
}

/** Metric strip cell — label / value / footer (matches issue SKU metric tiles). */
function AlertMetricTile({
  label,
  labelInfoTooltip,
  footer,
  children,
}: {
  label: string;
  labelInfoTooltip?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-22 min-w-0 flex-col px-4 py-3">
      <div className="flex items-center gap-1">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        {labelInfoTooltip ? (
          <Tooltip>
            <TooltipTrigger
              className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="How standard promise is calculated"
            >
              <Info className="size-3" aria-hidden />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-left leading-snug">
              {labelInfoTooltip}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div className="mt-2 min-h-0 flex-1">{children}</div>
      {footer ? <div className="mt-auto">{footer}</div> : null}
    </div>
  );
}

/** Shipping Speed — alert strip + latest status per crawled market. */
export function ShippingSpeedSkuDetail({ sku }: ShippingSpeedSkuDetailProps) {
  const detail = useMemo(() => getShippingSpeedSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-6">
      <ShippingSpeedAlertBlock alert={detail.alert} />
      <ShippingSpeedMarketGrid markets={detail.markets} />
    </div>
  );
}

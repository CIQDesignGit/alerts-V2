"use client";

import { useMemo, type ReactNode } from "react";

import { ShippingSpeedMarketGrid } from "@/components/issue-sku-detail/shipping-speed-market-grid";
import {
  getShippingSpeedSkuDetail,
  type ShippingSpeedAlertInfo,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

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

        <AlertMetricTile label="Prime badge">
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
    <div className="mt-2 flex flex-col gap-0.5 text-xs leading-snug">
      <p>
        <span className="text-neutral-400">Market:</span>{" "}
        <span className="font-medium text-foreground">{alert.primaryMarket}</span>
      </p>
      <p>
        <span className="text-neutral-400">Affected since:</span>{" "}
        <span className="font-medium text-foreground">
          Last {alert.affectedSinceDays} days
        </span>
      </p>
      <p>
        <span className="text-neutral-400">Other markets affected:</span>{" "}
        <span className="font-medium text-foreground">
          {alert.otherMarketsAffectedLabel}
        </span>
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
    <div className="flex min-h-22 min-w-0 flex-col px-4 py-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
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
      <ShippingSpeedMarketGrid
        markets={detail.markets}
        normLabel={detail.normLabel}
        crawlsPerDay={detail.crawlsPerDay}
      />
    </div>
  );
}

"use client";

import { MapPin } from "lucide-react";
import { useMemo } from "react";

import { getStockAvailabilitySkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type StockAvailabilitySkuDetailProps = {
  sku: IssueSku;
};

/** Stock Availability — OOS stamp card + crawl timeline. */
export function StockAvailabilitySkuDetail({
  sku,
}: StockAvailabilitySkuDetailProps) {
  const detail = useMemo(() => getStockAvailabilitySkuDetail(sku), [sku]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
      {/* Current status card */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <div className="relative flex h-40 items-center justify-center bg-[repeating-linear-gradient(-45deg,var(--color-error-50),var(--color-error-50)_10px,#fff_10px,#fff_20px)]">
          <span className="rotate-[-8deg] rounded-md border-2 border-error-600 bg-background px-3 py-1.5 text-xs font-bold tracking-wider text-error-700 uppercase shadow-sm">
            Out of stock
          </span>
        </div>
        <div className="flex flex-col gap-2 px-4 py-4">
          <p className="text-sm font-semibold text-error-600">
            {detail.statusLabel}
          </p>
          <LocationPill location={detail.location} zip={detail.zip} />
          <p className="text-xs text-muted-foreground">{detail.timestamp}</p>
        </div>
      </div>

      {/* Crawl history */}
      <div className="rounded-xl border border-border bg-background px-5 py-4 shadow-sm">
        <p className="text-sm text-foreground">
          This SKU was OOS for{" "}
          <span className="font-semibold">
            {detail.oosCrawlCount}/{detail.totalCrawls} crawls
          </span>{" "}
          in recent scrapes. Latest crawl status is shown first, then the prior{" "}
          {Math.max(detail.crawls.length - 1, 0)} crawls for context.
        </p>

        <ol className="relative mt-5 ml-1.5 border-l border-neutral-200">
          {detail.crawls.map((crawl) => (
            <li key={crawl.id} className="relative pb-5 pl-5 last:pb-0">
              <span
                className={cn(
                  "absolute top-1.5 -left-[5px] size-2.5 rounded-full border-2 border-background",
                  crawl.inStock ? "bg-success-500" : "bg-error-500",
                )}
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-foreground">
                  {crawl.relativeTime} · {crawl.absoluteTime}
                </span>
                <span
                  className={cn(
                    "inline-flex rounded-md px-2 py-0.5 text-2xs font-semibold",
                    crawl.inStock
                      ? "bg-success-100 text-success-700"
                      : "bg-error-100 text-error-700",
                  )}
                >
                  {crawl.inStock ? "In Stock" : "OOS"}
                </span>
                <LocationPill location={crawl.location} zip={crawl.zip} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function LocationPill({ location, zip }: { location: string; zip: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-2xs font-medium text-neutral-600">
      <MapPin className="size-3 shrink-0" aria-hidden />
      {location} ({zip})
    </span>
  );
}

"use client";

import { MapPin } from "lucide-react";
import { useMemo } from "react";

import { getStockAvailabilitySkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type StockAvailabilitySkuDetailProps = {
  sku: IssueSku;
};

/** OOS — summary + status stamp card + crawl timeline (issue aggregation SKU view). */
export function StockAvailabilitySkuDetail({
  sku,
}: StockAvailabilitySkuDetailProps) {
  const detail = useMemo(() => getStockAvailabilitySkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{detail.summary}</p>

      {/* Combined status + crawl panel */}
      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-xl border border-border bg-background lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        {/* Current status card */}
        <div className="border-b border-border lg:border-r lg:border-b-0">
          <div className="relative flex h-40 items-center justify-center bg-[repeating-linear-gradient(-45deg,var(--color-error-50),var(--color-error-50)_10px,#fff_10px,#fff_20px)]">
            <span className="rotate-[-8deg] rounded-md border-2 border-error-600 bg-background px-3 py-1.5 text-xs font-bold tracking-wider text-error-700 uppercase shadow-sm">
              Out of stock
            </span>
          </div>
          {/* Status details — matches OOS reference: skeleton bar, red status, location pill, time */}
          <div className="flex flex-col gap-3 bg-background px-4 py-4">
            <div
              className="h-2.5 w-3/4 rounded-full bg-neutral-100"
              aria-hidden
            />
            <p className="text-sm font-semibold text-error-600">
              {detail.statusLabel}
            </p>
            <LocationPill
              location={detail.location}
              zip={detail.zip}
              size="md"
            />
            <p className="text-xs text-neutral-500">{detail.timestamp}</p>
          </div>
        </div>

        {/* Crawl history */}
        <div className="flex flex-col px-5 py-4">
          <p className="text-sm text-foreground">
            This SKU was OOS for{" "}
            <span className="font-semibold">
              {detail.oosCrawlCount}/{detail.totalCrawls} crawls
            </span>{" "}
            in the previous 24 hours. Here are the latest{" "}
            {detail.visibleCrawlCount} crawls.
          </p>

          <ol className="relative mt-5 ml-1.5 flex-1 border-l border-neutral-200">
            {detail.crawls.map((crawl) => (
              <li key={crawl.id} className="relative pb-5 pl-5 last:pb-0">
                <span
                  className={cn(
                    "absolute top-1.5 -left-1.25 size-2.5 rounded-full border-2 border-background",
                    crawl.inStock ? "bg-success-500" : "bg-error-500",
                  )}
                  aria-hidden
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-foreground">
                    {crawl.whenLabel}
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

          {/* Prototype: label only for now — does not expand the list yet */}
          <button
            type="button"
            className="mt-2 self-start text-sm font-medium text-brand-600 underline-offset-2 hover:underline"
          >
            {detail.showAllLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function LocationPill({
  location,
  zip,
  size = "sm",
}: {
  location: string;
  zip: string;
  /** md = status card pill; sm = compact crawl-row chip */
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center font-medium text-neutral-600",
        size === "md"
          ? "gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs"
          : "gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-2xs",
      )}
    >
      <MapPin
        className={cn(
          "shrink-0 text-neutral-500",
          size === "md" ? "size-3.5" : "size-3",
        )}
        strokeWidth={1.75}
        aria-hidden
      />
      {location} ({zip})
    </span>
  );
}

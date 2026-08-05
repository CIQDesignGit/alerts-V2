"use client";

import { X } from "lucide-react";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import { ScrapeHistoryButton } from "@/components/sku-rca/scrape-history-modal";
import {
  GapBadge,
  PdpPageLink,
  PdpSnapshotsButton,
} from "@/components/sku-rca/sku-rca-header-actions";
import { Button } from "@/components/ui/button";
import type { SkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

/** Same reading column as SkuRca body — 10% wider than max-w-3xl (48rem → 52.8rem) */
export const SKU_RCA_CONTENT_WIDTH = "mx-auto w-full max-w-[52.8rem]";

type SkuRcaHeaderProps = {
  data: SkuRcaData;
  collapsed: boolean;
  onClose: () => void;
  /** Issue-type aggregation SKU pages show scrape history in the header */
  showScrapeHistory?: boolean;
};

export function SkuRcaHeader({
  data,
  collapsed,
  onClose,
  showScrapeHistory = false,
}: SkuRcaHeaderProps) {
  const pdpUrl = `https://www.amazon.com/dp/${data.asin}`;

  return (
    <header className="relative shrink-0 border-b border-border bg-background">
      {/* Expanded header */}
      <div
        className={cn(
          "relative px-6 transition-all duration-200",
          collapsed
            ? "pointer-events-none absolute inset-x-0 opacity-0"
            : "opacity-100",
        )}
        aria-hidden={collapsed}
      >
        <CloseButton onClose={onClose} className="absolute top-2.5 right-4 z-10" />

        <div className={cn(SKU_RCA_CONTENT_WIDTH, "py-3")}>
          <div className="flex w-full items-start gap-3">
            <SkuThumbnail name={data.name} size={80} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                {data.category} ·{" "}
                <span className="font-mono">{data.modelId}</span> ·{" "}
                <span className="font-mono">{data.asin}</span>
              </p>
              <h2 className="mt-0.5 text-lg font-bold leading-snug text-foreground">
                {data.name}
              </h2>
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                <PdpSnapshotsButton />
                <PdpPageLink href={pdpUrl} />
                {showScrapeHistory && (
                  <ScrapeHistoryButton
                    asin={data.asin}
                    skuName={data.name}
                  />
                )}
                <GapBadge dollars={data.gapDollars} units={data.gapUnits} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed sticky strip */}
      <div
        className={cn(
          "relative px-6 transition-all duration-200",
          collapsed
            ? "opacity-100"
            : "pointer-events-none absolute inset-x-0 opacity-0",
        )}
        aria-hidden={!collapsed}
      >
        <div
          className={cn(
            SKU_RCA_CONTENT_WIDTH,
            "flex items-center gap-3 py-2.5",
          )}
        >
          <SkuThumbnail name={data.name} size={32} />
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            {data.name}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <PdpSnapshotsButton compact />
            <PdpPageLink href={pdpUrl} compact />
            {showScrapeHistory && (
              <ScrapeHistoryButton
                asin={data.asin}
                skuName={data.name}
                compact
              />
            )}
            <CloseButton
              onClose={onClose}
              className="size-7 shrink-0 rounded-lg border border-neutral-200 bg-background hover:bg-neutral-50"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function CloseButton({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Close SKU detail"
      onClick={onClose}
      className={className}
    >
      <X className="size-4" />
    </Button>
  );
}

"use client";

import { X } from "lucide-react";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import {
  GapBadge,
  PdpPageLink,
  PdpSnapshotsButton,
} from "@/components/sku-rca/sku-rca-header-actions";
import { Button } from "@/components/ui/button";
import type { SkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaHeaderProps = {
  data: SkuRcaData;
  collapsed: boolean;
  onClose: () => void;
};

export function SkuRcaHeader({ data, collapsed, onClose }: SkuRcaHeaderProps) {
  const pdpUrl = `https://www.amazon.com/dp/${data.asin}`;

  return (
    <header className="relative shrink-0 border-b border-border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Close SKU detail"
        onClick={onClose}
        className="absolute top-2.5 right-3 z-10"
      >
        <X className="size-4" />
      </Button>

      <div
        className={cn(
          "px-6 py-3 pr-14 transition-all duration-200",
          collapsed
            ? "pointer-events-none absolute inset-x-0 opacity-0"
            : "opacity-100",
        )}
        aria-hidden={collapsed}
      >
        <p className="text-xs text-muted-foreground">
          {data.category} ·{" "}
          <span className="font-mono">{data.modelId}</span> ·{" "}
          <span className="font-mono">{data.asin}</span>
        </p>
        <div className="mt-2 flex items-start gap-3">
          <SkuThumbnail name={data.name} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold leading-snug text-foreground">
              {data.name}
            </h2>
            {/* Matches design: PDP · Snapshots · Gap badge in one row */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <PdpPageLink href={pdpUrl} />
              <PdpSnapshotsButton />
              <GapBadge dollars={data.gapDollars} units={data.gapUnits} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 px-6 py-2.5 pr-14 transition-all duration-200",
          collapsed
            ? "opacity-100"
            : "pointer-events-none absolute inset-x-0 opacity-0",
        )}
        aria-hidden={!collapsed}
      >
        <SkuThumbnail name={data.name} size={32} />
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
          {data.name}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <PdpPageLink href={pdpUrl} compact />
          <PdpSnapshotsButton compact />
        </div>
      </div>
    </header>
  );
}

"use client";

import { X } from "lucide-react";

import { InsightsModeToggle } from "@/components/alerts-insights/insights-mode-toggle";
import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import {
  GapBadge,
  PdpPageLink,
  PdpSnapshotsButton,
} from "@/components/sku-rca/sku-rca-header-actions";
import { Button } from "@/components/ui/button";
import type { InsightsMode } from "@/lib/insights-widgets";
import type { SkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

/** Same reading column as SkuRca body — keeps header + content aligned on wide screens */
export const SKU_RCA_CONTENT_WIDTH = "mx-auto w-full max-w-3xl";

type SkuRcaHeaderProps = {
  data: SkuRcaData;
  collapsed: boolean;
  mode: InsightsMode;
  onModeChange: (mode: InsightsMode) => void;
  onClose: () => void;
};

export function SkuRcaHeader({
  data,
  collapsed,
  mode,
  onModeChange,
  onClose,
}: SkuRcaHeaderProps) {
  const pdpUrl = `https://www.amazon.com/dp/${data.asin}`;

  return (
    <header className="relative shrink-0 border-b border-border bg-background">
      {/* Expanded header — same max width as the scroll body */}
      <div
        className={cn(
          "px-6 transition-all duration-200",
          collapsed
            ? "pointer-events-none absolute inset-x-0 opacity-0"
            : "opacity-100",
        )}
        aria-hidden={collapsed}
      >
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "relative py-3 pr-10")}>
          <CloseButton onClose={onClose} className="absolute top-2.5 right-0" />
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
              {/* Actions + Live/Historical sit together as one control row */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PdpPageLink href={pdpUrl} />
                <PdpSnapshotsButton />
                <GapBadge dollars={data.gapDollars} units={data.gapUnits} />
                <InsightsModeToggle
                  mode={mode}
                  onChange={onModeChange}
                  ariaLabel="SKU view mode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed sticky strip — same column width */}
      <div
        className={cn(
          "px-6 transition-all duration-200",
          collapsed
            ? "opacity-100"
            : "pointer-events-none absolute inset-x-0 opacity-0",
        )}
        aria-hidden={!collapsed}
      >
        <div
          className={cn(
            SKU_RCA_CONTENT_WIDTH,
            "relative flex items-center gap-3 py-2.5 pr-10",
          )}
        >
          <CloseButton onClose={onClose} className="absolute top-2 right-0" />
          <SkuThumbnail name={data.name} size={32} />
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            {data.name}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <InsightsModeToggle
              mode={mode}
              onChange={onModeChange}
              ariaLabel="SKU view mode"
            />
            <PdpPageLink href={pdpUrl} compact />
            <PdpSnapshotsButton compact />
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

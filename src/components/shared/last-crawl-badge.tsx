"use client";

import { Clock, Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ALERTS_LAST_CRAWL_LABEL,
  ALERTS_LAST_CRAWL_RELATIVE,
  ALERTS_LAST_CRAWL_TIME,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type LastCrawlBadgeProps = {
  /**
   * Alerts filter bar says "Last crawl";
   * Live issues card says "Last updated" — same clock either way.
   */
  variant?: "crawl" | "updated";
  className?: string;
};

const CRAWL_TOOLTIP =
  "When we last scraped retailer product pages. Alerts and PDP snapshots reflect that crawl.";

const UPDATED_TOOLTIP =
  "When live issue data was last refreshed from the latest retailer page scrape.";

/**
 * Freshness indicator — quiet type, clock on brand-25 / rounded-sm tile.
 */
export function LastCrawlBadge({
  variant = "crawl",
  className,
}: LastCrawlBadgeProps) {
  const prefix = variant === "updated" ? "Last updated" : "Last crawl";
  const tooltip = variant === "updated" ? UPDATED_TOOLTIP : CRAWL_TOOLTIP;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 text-xs leading-none",
        className,
      )}
    >
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-brand-50"
        aria-hidden
      >
        <Clock className="size-3 text-brand-600" />
      </span>
      <span className="text-muted-foreground">{prefix}</span>
      <time
        className="font-semibold tabular-nums text-foreground"
        dateTime={ALERTS_LAST_CRAWL_LABEL}
      >
        {ALERTS_LAST_CRAWL_TIME}
      </time>
      <span className="font-medium text-neutral-600">
        ({ALERTS_LAST_CRAWL_RELATIVE})
      </span>
      <Tooltip>
        <TooltipTrigger
          className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
          aria-label={`About ${prefix}`}
        >
          <Info className="size-3.5" aria-hidden />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-left leading-snug">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}

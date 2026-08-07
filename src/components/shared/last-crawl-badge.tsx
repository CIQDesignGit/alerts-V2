import { Clock } from "lucide-react";

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

/**
 * Freshness indicator — quiet type, clock on brand-25 / rounded-sm tile.
 */
export function LastCrawlBadge({
  variant = "crawl",
  className,
}: LastCrawlBadgeProps) {
  const prefix = variant === "updated" ? "Last updated" : "Last crawl";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 text-xs leading-none",
        className,
      )}
      title={`${prefix} ${ALERTS_LAST_CRAWL_LABEL}`}
    >
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-brand-50"
        aria-hidden
      >
        <Clock className="size-3 text-brand-600" />
      </span>
      <span className="text-muted-foreground">{prefix}</span>
      <time className="font-semibold tabular-nums text-foreground">
        {ALERTS_LAST_CRAWL_TIME}
      </time>
      <span className="font-medium text-neutral-600">
        ({ALERTS_LAST_CRAWL_RELATIVE})
      </span>
    </span>
  );
}

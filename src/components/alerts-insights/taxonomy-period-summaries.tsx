"use client";

import { CalendarRange } from "lucide-react";

import { LastCrawlBadge } from "@/components/shared/last-crawl-badge";
import {
  LAST_WEEK_RANGE_LABEL,
  PeriodBadge,
} from "@/components/shared/period-badge";
import { SkuRcaIssueAiSummary } from "@/components/sku-rca/sku-rca-issue-ai-summary";

type TaxonomyPeriodSummariesProps = {
  liveNowSummary: string;
  thisWeekSummary: string;
  lastWeekSummary: string;
};

/** Soft live pulse — matches SKU “Live right now” card */
function LiveSignalDot() {
  return (
    <span
      className="relative flex size-4 shrink-0 items-center justify-center"
      aria-hidden
    >
      <span className="live-signal-halo absolute size-3 rounded-full bg-error-500" />
      <span className="relative size-2 rounded-full bg-error-500" />
    </span>
  );
}

/** Live / this week / last week AllyAI summaries — Overall · Brand · Category RCA. */
export function TaxonomyPeriodSummaries({
  liveNowSummary,
  thisWeekSummary,
  lastWeekSummary,
}: TaxonomyPeriodSummariesProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <LiveSignalDot />
            <h3 className="text-sm font-semibold text-foreground">
              Live right now
            </h3>
            <PeriodBadge tone="live">Now</PeriodBadge>
          </div>
          <LastCrawlBadge variant="updated" />
        </header>
        <SkuRcaIssueAiSummary summary={liveNowSummary} variant="live" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
          <CalendarRange
            className="size-4 shrink-0 text-cyan-600"
            aria-hidden
          />
          <h3 className="text-sm font-semibold text-foreground">This week</h3>
          <PeriodBadge tone="wtd">WTD</PeriodBadge>
        </header>
        <SkuRcaIssueAiSummary summary={thisWeekSummary} variant="live" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
          <CalendarRange
            className="size-4 shrink-0 text-neutral-500"
            aria-hidden
          />
          <h3 className="text-sm font-semibold text-foreground">Last week</h3>
          <PeriodBadge tone="historical">{LAST_WEEK_RANGE_LABEL}</PeriodBadge>
        </header>
        <SkuRcaIssueAiSummary
          summary={lastWeekSummary}
          variant="historical"
        />
      </div>
    </section>
  );
}

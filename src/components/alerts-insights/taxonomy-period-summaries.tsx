"use client";

import { CalendarRange } from "lucide-react";

import {
  NumberedInsightList,
  PrecomputedInsightFootnote,
} from "@/components/alerts-insights/ally-ai-surface";
import { LastCrawlBadge } from "@/components/shared/last-crawl-badge";
import { LiveSignalDot } from "@/components/shared/live-signal-dot";
import {
  LAST_WEEK_RANGE_LABEL,
  PeriodBadge,
} from "@/components/shared/period-badge";

type TaxonomyPeriodSummariesProps = {
  liveNowBullets: string[];
  lastWeekBullets: string[];
};

/** Live + last week AllyAI summaries — Overall · Brand · Category (3 numbered bullets). */
export function TaxonomyPeriodSummaries({
  liveNowBullets,
  lastWeekBullets,
}: TaxonomyPeriodSummariesProps) {
  return (
    <section className="flex flex-col gap-5">
      {/* Live card + footnote under the box (same pattern as Key insights) */}
      <div className="flex flex-col gap-1.5">
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <LiveSignalDot />
              <h3 className="text-sm font-semibold text-foreground">
                Live right now
              </h3>
              <PeriodBadge tone="live">Now</PeriodBadge>
            </div>
            <LastCrawlBadge variant="updated" />
          </header>
          <NumberedInsightList
            label="Live right now summary"
            tone="brand"
            items={liveNowBullets.map((text, index) => ({
              id: `live-${index}`,
              content: text,
            }))}
          />
        </div>
        <PrecomputedInsightFootnote />
      </div>

      {/* Last week card + same footnote under the box */}
      <div className="flex flex-col gap-1.5">
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <header className="flex items-center gap-2.5 border-b border-neutral-100 px-4 py-2.5">
            <CalendarRange
              className="size-4 shrink-0 text-neutral-500"
              aria-hidden
            />
            <h3 className="text-sm font-semibold text-foreground">Last week</h3>
            <PeriodBadge tone="historical">{LAST_WEEK_RANGE_LABEL}</PeriodBadge>
          </header>
          <NumberedInsightList
            label="Last week summary"
            tone="muted"
            items={lastWeekBullets.map((text, index) => ({
              id: `last-week-${index}`,
              content: text,
            }))}
          />
        </div>
        <PrecomputedInsightFootnote />
      </div>
    </section>
  );
}

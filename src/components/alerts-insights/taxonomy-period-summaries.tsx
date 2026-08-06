"use client";

import { CalendarRange } from "lucide-react";

import { SkuRcaIssueAiSummary } from "@/components/sku-rca/sku-rca-issue-ai-summary";

type TaxonomyPeriodSummariesProps = {
  thisWeekSummary: string;
  lastWeekSummary: string;
};

function LiveSignalDot() {
  return (
    <span className="relative flex size-2.5 shrink-0" aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400/70" />
      <span className="relative inline-flex size-2.5 rounded-full bg-cyan-500" />
    </span>
  );
}

/** This week vs last week AllyAI summaries — Overall / Brand / Category RCA. */
export function TaxonomyPeriodSummaries({
  thisWeekSummary,
  lastWeekSummary,
}: TaxonomyPeriodSummariesProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex items-center gap-2.5 border-b border-border px-4 py-2.5">
          <LiveSignalDot />
          <h3 className="text-sm font-semibold text-foreground">This week</h3>
          <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-2xs font-semibold tracking-wide text-cyan-700 uppercase ring-1 ring-cyan-500/15">
            WTD
          </span>
        </header>
        <SkuRcaIssueAiSummary summary={thisWeekSummary} variant="live" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <CalendarRange
              className="size-4 shrink-0 text-neutral-500"
              aria-hidden
            />
            <h3 className="text-sm font-semibold text-foreground">
              Last week
            </h3>
            <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-2xs font-medium text-neutral-600 ring-1 ring-neutral-200/80">
              Jul 19–25
            </span>
          </div>
        </header>
        <SkuRcaIssueAiSummary
          summary={lastWeekSummary}
          variant="historical"
        />
      </div>
    </section>
  );
}

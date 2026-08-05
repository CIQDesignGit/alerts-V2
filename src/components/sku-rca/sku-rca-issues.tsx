"use client";

import { CalendarRange } from "lucide-react";
import { useMemo, useState } from "react";

import { SkuRcaIssueAiSummary } from "@/components/sku-rca/sku-rca-issue-ai-summary";
import { SkuRcaIssueRow } from "@/components/sku-rca/sku-rca-issue-row";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import {
  isRedIssue,
  type RcaIssueGroup,
  type RcaLastWeekIssue,
} from "@/lib/mock-sku-rca";

type SkuRcaIssuesProps = {
  sku: IssueSku;
  groups: RcaIssueGroup[];
  lastWeekTopIssues: RcaLastWeekIssue[];
  lastUpdated: string;
  liveIssuesSummary: string;
  lastWeekIssuesSummary: string;
};

/** Pulsing dot — cyan “live signal”, distinct from Ally brand purple. */
function LiveSignalDot() {
  return (
    <span className="relative flex size-2.5 shrink-0" aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400/70" />
      <span className="relative inline-flex size-2.5 rounded-full bg-cyan-500" />
    </span>
  );
}

export function SkuRcaIssues({
  sku,
  groups,
  lastWeekTopIssues,
  lastUpdated,
  liveIssuesSummary,
  lastWeekIssuesSummary,
}: SkuRcaIssuesProps) {
  const liveIssues = useMemo(
    () =>
      groups
        .flatMap((group) => group.issues)
        .filter((issue) => isRedIssue(issue.liveStatus))
        .sort(
          (a, b) => (a.impactDollars ?? 0) - (b.impactDollars ?? 0),
        ),
    [groups],
  );

  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-base font-semibold text-foreground">Issues</h3>

      {/* Live — elevated card + cyan real-time signal */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <LiveSignalDot />
            <h4 className="text-sm font-semibold text-foreground">
              Live right now
            </h4>
            <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-2xs font-semibold tracking-wide text-cyan-700 uppercase ring-1 ring-cyan-500/15">
              Now
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{lastUpdated}</p>
        </header>

        <SkuRcaIssueAiSummary summary={liveIssuesSummary} variant="live" />

        {liveIssues.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">
            No active issues — all checks are healthy.
          </p>
        ) : (
          <ul>
            {liveIssues.map((issue) => {
              const rowId = `live:${issue.issueKey}`;
              return (
                <SkuRcaIssueRow
                  key={rowId}
                  issue={issue}
                  sku={sku}
                  open={openIds.has(rowId)}
                  onToggle={() => toggle(rowId)}
                />
              );
            })}
          </ul>
        )}
      </div>

      {/* Last week — inset archive / timeline */}
      <div className="overflow-hidden rounded-xl border border-dashed border-neutral-300/80 bg-neutral-50/60">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 bg-neutral-100/50 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <CalendarRange
              className="size-4 shrink-0 text-neutral-500"
              aria-hidden
            />
            <h4 className="text-sm font-semibold text-foreground">
              Top Issues last week
            </h4>
            <span className="rounded-md bg-neutral-200/80 px-1.5 py-0.5 text-2xs font-medium text-neutral-600">
              7 days
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Days active · Jul 19–25</p>
        </header>

        <SkuRcaIssueAiSummary
          summary={lastWeekIssuesSummary}
          variant="historical"
        />

        {lastWeekTopIssues.length === 0 ? (
          <p className="bg-background/60 px-4 py-3 text-sm text-muted-foreground">
            No material issues recorded last week.
          </p>
        ) : (
          <ul className="bg-background/60">
            {lastWeekTopIssues.map((issue, index) => (
              <SkuRcaIssueRow
                key={`last-week:${issue.issueKey}`}
                lastWeekIssue={issue}
                rank={index + 1}
                variant="historical"
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

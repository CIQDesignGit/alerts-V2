"use client";

import { CalendarRange, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { ISSUE_ICONS } from "@/components/alerts/issue-icons";
import { IssueSkuDetailBody } from "@/components/issue-sku-detail/issue-sku-detail-body";
import { LastCrawlBadge } from "@/components/shared/last-crawl-badge";
import { LiveSignalDot } from "@/components/shared/live-signal-dot";
import {
  LAST_WEEK_RANGE_LABEL,
  PeriodBadge,
} from "@/components/shared/period-badge";
import { SkuRcaIssueAiSummary } from "@/components/sku-rca/sku-rca-issue-ai-summary";
import { SkuRcaIssueRow } from "@/components/sku-rca/sku-rca-issue-row";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import {
  isRedIssue,
  liveIssueChipLabel,
  type RcaIssueGroup,
  type RcaIssueRow,
  type RcaLastWeekIssue,
} from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaIssuesProps = {
  sku: IssueSku;
  groups: RcaIssueGroup[];
  lastWeekTopIssues: RcaLastWeekIssue[];
  liveIssuesSummary: string;
  lastWeekIssuesSummary: string;
};

export function SkuRcaIssues({
  sku,
  groups,
  lastWeekTopIssues,
  liveIssuesSummary,
  lastWeekIssuesSummary,
}: SkuRcaIssuesProps) {
  const liveIssues = useMemo(
    () =>
      groups
        .flatMap((group) => group.issues)
        .filter((issue) => isRedIssue(issue.liveStatus))
        .sort((a, b) => (a.impactDollars ?? 0) - (b.impactDollars ?? 0)),
    [groups],
  );

  // One chip open at a time (null = all collapsed)
  const [openKey, setOpenKey] = useState<RcaIssueRow["issueKey"] | null>(null);
  const openIssue =
    liveIssues.find((issue) => issue.issueKey === openKey) ?? null;

  function toggleChip(issueKey: RcaIssueRow["issueKey"]) {
    setOpenKey((prev) => (prev === issueKey ? null : issueKey));
  }

  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-base font-semibold text-foreground">Issues</h3>

      {/* Live — same card level as last week */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <LiveSignalDot />
            <h4 className="text-sm font-semibold text-foreground">
              Live right now
            </h4>
            <PeriodBadge tone="live">Now</PeriodBadge>
          </div>
          <LastCrawlBadge variant="updated" />
        </header>

        <SkuRcaIssueAiSummary summary={liveIssuesSummary} variant="live" />

        {liveIssues.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">
            No active issues — all checks are healthy.
          </p>
        ) : (
          <>
            <ul className="m-0 flex list-none flex-wrap gap-2 px-4 py-3">
              {liveIssues.map((issue) => {
                const Icon = ISSUE_ICONS[issue.issueKey];
                const open = openKey === issue.issueKey;
                const label = liveIssueChipLabel(issue);

                return (
                  <li key={issue.issueKey} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleChip(issue.issueKey)}
                      aria-expanded={open}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-2 text-sm font-medium transition-colors",
                        open
                          ? "border-brand-300 bg-brand-50 text-brand-800"
                          : "border-border bg-background text-foreground hover:bg-neutral-50",
                      )}
                    >
                      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-error-50">
                        <Icon
                          className="size-3.5 text-error-600"
                          aria-hidden
                        />
                      </span>
                      <span className="whitespace-nowrap">{label}</span>
                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-180 text-brand-600",
                        )}
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {openIssue ? (
              <LiveIssueAccordionPanel issue={openIssue} sku={sku} />
            ) : null}
          </>
        )}
      </div>

      {/* Last week — sibling card, same shell */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <CalendarRange
              className="size-4 shrink-0 text-neutral-500"
              aria-hidden
            />
            <h4 className="text-sm font-semibold text-foreground">
              Top Issues last week
            </h4>
            <PeriodBadge tone="historical">{LAST_WEEK_RANGE_LABEL}</PeriodBadge>
          </div>
          <p className="text-xs text-muted-foreground">
            Days active · {LAST_WEEK_RANGE_LABEL}
          </p>
        </header>

        <SkuRcaIssueAiSummary
          summary={lastWeekIssuesSummary}
          variant="historical"
        />

        {lastWeekTopIssues.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground">
            No material issues recorded last week.
          </p>
        ) : (
          <ul>
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

/** Expanded panel for the selected chip — issue detail only */
function LiveIssueAccordionPanel({
  issue,
  sku,
}: {
  issue: RcaIssueRow;
  sku: IssueSku;
}) {
  return (
    <div className="border-t border-border bg-neutral-50/40 px-4 py-4">
      <IssueSkuDetailBody sku={sku} issueKey={issue.issueKey} />
    </div>
  );
}

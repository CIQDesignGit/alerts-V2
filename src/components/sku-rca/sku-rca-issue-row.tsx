"use client";

import { ISSUE_ICONS } from "@/components/alerts/issue-icons";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import type { RcaLastWeekIssue } from "@/lib/mock-sku-rca";

type SkuRcaIssueRowProps = {
  variant: "historical";
  lastWeekIssue: RcaLastWeekIssue;
  rank: number;
};

/** Last-week issue row — ranked, not expandable. */
export function SkuRcaIssueRow({ lastWeekIssue, rank }: SkuRcaIssueRowProps) {
  const Icon = ISSUE_ICONS[lastWeekIssue.issueKey];
  const label = ISSUE_NAMES[lastWeekIssue.issueKey].pane;

  return (
    <li className="border-t border-border first:border-t-0">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-200/80 text-xs font-semibold text-neutral-600"
        >
          {rank}
        </span>
        <Icon className="size-4 shrink-0 text-neutral-500" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {label}
        </span>
        <span
          className="shrink-0 text-xs tabular-nums text-muted-foreground"
          title={`Issue active ${lastWeekIssue.daysPresent} of ${lastWeekIssue.daysTotal} days last week`}
        >
          {lastWeekIssue.daysPresent}/{lastWeekIssue.daysTotal} days
        </span>
      </div>
    </li>
  );
}

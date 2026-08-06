"use client";

import { ChevronDown } from "lucide-react";

import { ISSUE_ICONS } from "@/components/alerts/issue-icons";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import { IssueSkuDetailBody } from "@/components/issue-sku-detail/issue-sku-detail-body";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import {
  type RcaIssueRow,
  type RcaLastWeekIssue,
  type RcaLiveStatus,
} from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaIssueRowProps =
  | {
      variant?: "live";
      issue: RcaIssueRow;
      sku: IssueSku;
      open: boolean;
      onToggle: () => void;
    }
  | {
      variant: "historical";
      lastWeekIssue: RcaLastWeekIssue;
      rank: number;
    };

export function SkuRcaIssueRow(props: SkuRcaIssueRowProps) {
  if (props.variant === "historical") {
    return (
      <SkuRcaLastWeekIssueRow issue={props.lastWeekIssue} rank={props.rank} />
    );
  }

  return (
    <SkuRcaLiveIssueRow
      issue={props.issue}
      sku={props.sku}
      open={props.open}
      onToggle={props.onToggle}
    />
  );
}

/** Live issue — expandable accordion with the issue-type detail body. */
function SkuRcaLiveIssueRow({
  issue,
  sku,
  open,
  onToggle,
}: {
  issue: RcaIssueRow;
  sku: IssueSku;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = ISSUE_ICONS[issue.issueKey];
  const label = ISSUE_NAMES[issue.issueKey].pane;
          // Hide pill when the product sheet has no unhealthy label (e.g. Coupon / Credit Offer)
  const showStatusPill = issue.statusLabel !== "Active";

  return (
    <li className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-neutral-50"
      >
        <LiveDot status={issue.liveStatus} />
        <Icon className="size-4 shrink-0 text-neutral-500" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {label}
        </span>
        {showStatusPill && (
          <StatusPill label={issue.statusLabel} status={issue.liveStatus} />
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-neutral-50/60 px-3 py-4">
          {/* Same detail body as the issue-type SKU page for this alert */}
          <IssueSkuDetailBody sku={sku} issueKey={issue.issueKey} />
        </div>
      )}
    </li>
  );
}

/** Last-week issue — static row, not expandable. */
function SkuRcaLastWeekIssueRow({
  issue,
  rank,
}: {
  issue: RcaLastWeekIssue;
  rank: number;
}) {
  const Icon = ISSUE_ICONS[issue.issueKey];
  const label = ISSUE_NAMES[issue.issueKey].pane;

  return (
    <li className="border-t border-border bg-neutral-50/40 first:border-t-0">
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
        <DaysPresentLabel issue={issue} />
      </div>
    </li>
  );
}

function DaysPresentLabel({ issue }: { issue: RcaLastWeekIssue }) {
  return (
    <span
      className="shrink-0 text-xs tabular-nums text-muted-foreground"
      title={`Issue active ${issue.daysPresent} of ${issue.daysTotal} days last week`}
    >
      {issue.daysPresent}/{issue.daysTotal} days
    </span>
  );
}

function LiveDot({ status }: { status: RcaLiveStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full",
        status === "bad" && "bg-error-500",
        status === "warning" && "bg-warning-400",
        status === "ok" && "bg-success-500",
      )}
    />
  );
}

function StatusPill({
  label,
  status,
}: {
  label: string;
  status: RcaLiveStatus;
}) {
  return (
    <span
      className={cn(
        "max-w-72 shrink-0 truncate rounded-md px-1.5 py-0.5 text-2xs font-semibold",
        status === "bad" && "bg-error-100 text-error-700",
        status === "warning" && "bg-warning-100 text-warning-700",
        status === "ok" && "bg-success-100 text-success-700",
      )}
      title={label}
    >
      {label}
    </span>
  );
}

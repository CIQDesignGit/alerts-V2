"use client";

import { ChevronDown } from "lucide-react";

import { ISSUE_ICONS } from "@/components/alerts/issue-icons";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import {
  formatCompactDollars,
  type RcaIssueRow,
  type RcaLiveStatus,
} from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaIssueRowProps = {
  issue: RcaIssueRow;
  open: boolean;
  onToggle: () => void;
};

/** Collapsed row + expandable placeholder — typed interiors come later. */
export function SkuRcaIssueRow({ issue, open, onToggle }: SkuRcaIssueRowProps) {
  const Icon = ISSUE_ICONS[issue.issueKey];
  const label = ISSUE_NAMES[issue.issueKey].pane;

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
        <StatusPill label={issue.statusLabel} status={issue.liveStatus} />
        {issue.impactDollars != null && (
          <span
            title="Estimated revenue impacted"
            className="shrink-0 rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-2xs font-semibold text-neutral-700"
          >
            {formatCompactDollars(issue.impactDollars)}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-neutral-50 px-3 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            {label} detail — placeholder
          </p>
          <div className="mt-2 flex h-20 items-center justify-center rounded-md border border-dashed border-border bg-background text-2xs text-muted-foreground">
            Issue detail + optional last-week trend
          </div>
        </div>
      )}
    </li>
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
        "shrink-0 rounded-md px-1.5 py-0.5 text-2xs font-semibold",
        status === "bad" && "bg-error-100 text-error-700",
        status === "warning" && "bg-warning-100 text-warning-700",
        status === "ok" && "bg-success-100 text-success-700",
      )}
    >
      {label}
    </span>
  );
}

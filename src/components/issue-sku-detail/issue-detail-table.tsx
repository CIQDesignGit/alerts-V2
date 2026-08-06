import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared table chrome matching LastWeekTrendCard —
 * same card header, cell height, and alignment for every issue detail table.
 */
export const issueDetailTable = {
  frame: "overflow-hidden rounded-xl border border-border bg-background",
  /** Matches LastWeekTrendCard card header */
  header:
    "flex items-center justify-between gap-3 border-b border-border px-5 py-3.5",
  headerTitle: "text-sm font-semibold text-foreground",
  headerMeta: "shrink-0 text-xs text-muted-foreground",
  scroll: "overflow-x-auto px-3 py-3",
  table: "w-full min-w-xl border-collapse text-left",
  headRow: "border-b border-border",
  /** Left / label column header */
  th: "align-top px-2 py-1 text-left text-2xs font-medium tracking-wider text-muted-foreground uppercase",
  /** Numeric column header — right-aligned */
  thRight:
    "align-top px-2 py-1 text-right text-2xs font-medium tracking-wider text-muted-foreground uppercase",
  row: "align-middle border-b border-border last:border-b-0",
  /** Left / label cell */
  td: "px-2 py-1 text-left text-xs font-medium text-foreground",
  /** Numeric cell — right-aligned */
  tdRight: "px-2 py-1 text-right text-xs font-medium tabular-nums text-foreground",
  /** Body cell shells — vertically centered */
  cell: "flex min-h-9 items-center",
  cellRight: "flex min-h-9 items-center justify-end",
  cellCol: "flex min-h-9 flex-col justify-center",
  cellColRight: "flex min-h-9 flex-col items-end justify-center",
  /** Header cell shells — top-aligned (multi-line labels stay flush top) */
  thCell: "flex min-h-9 items-start",
  thCellRight: "flex min-h-9 items-start justify-end",
  thCellCol: "flex min-h-9 flex-col items-start justify-start",
  thCellColRight: "flex min-h-9 flex-col items-end justify-start",
} as const;

export function issueTh(align: "left" | "right" = "left", className?: string) {
  return cn(
    align === "right" ? issueDetailTable.thRight : issueDetailTable.th,
    className,
  );
}

export function issueTd(align: "left" | "right" = "left", className?: string) {
  return cn(
    align === "right" ? issueDetailTable.tdRight : issueDetailTable.td,
    className,
  );
}

/** Card title bar — same pattern as LastWeekTrendCard header */
export function IssueDetailTableHeader({
  title,
  meta,
}: {
  title: string;
  meta?: ReactNode;
}) {
  return (
    <header className={issueDetailTable.header}>
      <h3 className={issueDetailTable.headerTitle}>{title}</h3>
      {meta ? (
        <div className={issueDetailTable.headerMeta}>{meta}</div>
      ) : null}
    </header>
  );
}

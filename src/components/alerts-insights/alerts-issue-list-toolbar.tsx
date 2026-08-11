"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadAlertsCsv } from "@/lib/export-alerts-csv";
import type { IssueAlert } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

/**
 * Muted caption under the issue-type list —
 * explains ranking + which data window the list uses.
 */
export function AlertsIssueListCaption({
  className,
}: {
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs leading-snug text-muted-foreground",
        className,
      )}
    >
      Ranked by OPS · based on previous{" "}
      <span className="font-semibold text-foreground">24 hours</span> data
    </p>
  );
}

/**
 * Muted caption under the taxonomy tree —
 * brands and categories use the same OPS sort as the issue list.
 */
export function AlertsTaxonomyListCaption({
  className,
}: {
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs leading-snug text-muted-foreground",
        className,
      )}
    >
      Brands and categories sorted by OPS
    </p>
  );
}

/** Ghost icon button — export the currently filtered alerts list as CSV */
export function AlertsIssueListExportButton({
  issues,
}: {
  /** Filtered issue → SKU rows currently shown in the left list */
  issues: IssueAlert[];
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Export alerts list"
      onClick={() => downloadAlertsCsv(issues)}
    >
      <Download className="size-3.5 text-brand-600" aria-hidden />
    </Button>
  );
}

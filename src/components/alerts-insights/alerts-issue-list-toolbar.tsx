"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
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

/** Ghost icon button — export visible issue list */
export function AlertsIssueListExportButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Export alerts list"
      onClick={() => {
        /* Prototype — wire to CSV export when backend is ready */
      }}
    >
      <Download className="size-3.5 text-brand-600" aria-hidden />
    </Button>
  );
}

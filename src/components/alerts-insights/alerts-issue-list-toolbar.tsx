"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { alertsIssueListDataLabel } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

/** Muted caption — data window for the issue-type list (tertiary, not a control) */
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
      {alertsIssueListDataLabel("24h")}
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

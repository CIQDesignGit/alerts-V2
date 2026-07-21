"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  alertsSummary,
  formatAtRisk,
  issueAlerts,
  issueGroup,
  issueLabel,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type OverviewActiveAlertsProps = {
  onGoToAlerts: () => void;
};

/** Ranked issue list — dollar-first teaser into the Alerts tab. */
export function OverviewActiveAlerts({ onGoToAlerts }: OverviewActiveAlertsProps) {
  const top = issueAlerts.slice(0, 5);
  const moreCount = Math.max(0, issueAlerts.length - top.length);

  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-border bg-background shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {alertsSummary.count} issues · {formatAtRisk(alertsSummary.atRiskDollars)} at
            risk
          </p>
        </div>
        <Button size="sm" onClick={onGoToAlerts}>
          Go to Alerts
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      <ul className="divide-y divide-border">
        {top.map((alert) => (
          <li key={alert.issueKey}>
            <button
              type="button"
              onClick={onGoToAlerts}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
            >
              <SeverityDot severity={alert.severity} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {issueLabel(alert.issueKey)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {alert.skuCount} SKUs · {issueGroup(alert.issueKey)}
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 font-mono text-sm font-semibold tabular-nums",
                  alert.severity === "high" && "text-error-600",
                  alert.severity === "mid" && "text-warning-600",
                  alert.severity === "low" && "text-neutral-500",
                )}
              >
                {formatAtRisk(alert.atRiskDollars)}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {moreCount > 0 && (
        <button
          type="button"
          onClick={onGoToAlerts}
          className="border-t border-border px-5 py-3 text-left text-xs font-medium text-primary hover:bg-neutral-50"
        >
          + {moreCount} more issues
        </button>
      )}
    </section>
  );
}

function SeverityDot({ severity }: { severity: "high" | "mid" | "low" }) {
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        severity === "high" && "bg-error-500",
        severity === "mid" && "bg-warning-500",
        severity === "low" && "bg-neutral-300",
      )}
      aria-hidden
    />
  );
}

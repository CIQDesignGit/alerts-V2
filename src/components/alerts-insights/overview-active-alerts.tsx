"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  alertsSummary,
  formatGapDollars,
  getIssueAlertInsights,
  issueAlerts,
  issueLabel,
  type IssueAlert,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type OverviewActiveAlertsProps = {
  onGoToAlerts: () => void;
};

/** Ranked issue list — dollar-first teaser into the Alerts tab (full-width). */
export function OverviewActiveAlerts({
  onGoToAlerts,
}: OverviewActiveAlertsProps) {
  const top = issueAlerts.slice(0, 4);
  const moreCount = Math.max(0, issueAlerts.length - top.length);

  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-border bg-background shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {alertsSummary.count} issues ·{" "}
            {formatGapDollars(alertsSummary.gapDollars)} Gap
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToAlerts}
          className="border-brand-500 text-brand-700 hover:bg-brand-50 hover:text-brand-800"
        >
          Go to Alerts
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      {/* Full-width: 2 columns on large screens so rows don’t stretch empty */}
      <ul className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
        {top.map((alert, i) => (
          <li
            key={alert.issueKey}
            className={cn(
              "border-border",
              // Vertical divider between columns; horizontal between rows
              i % 2 === 0 && "sm:border-r",
              i < 2 && "sm:border-b",
              i >= 2 && "border-t sm:border-t-0",
            )}
          >
            <AlertTeaserRow alert={alert} onClick={onGoToAlerts} />
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

function AlertTeaserRow({
  alert,
  onClick,
}: {
  alert: IssueAlert;
  onClick: () => void;
}) {
  const insights = getIssueAlertInsights(alert);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
    >
      <SeverityDot severity={alert.severity} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {issueLabel(alert.issueKey)}
          </p>
          <span className="inline-flex items-center rounded-xs bg-neutral-100 px-1.5 py-0.5 text-2xs font-medium text-neutral-600">
            {alert.skuCount} SKUs
          </span>
        </div>

        {insights.signalTeaser && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {insights.signalTeaser}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            "font-mono text-sm font-semibold tabular-nums",
            alert.severity === "high" && "text-error-600",
            alert.severity === "mid" && "text-warning-600",
            alert.severity === "low" && "text-neutral-500",
          )}
        >
          {formatGapDollars(alert.gapDollars)}
        </p>
        <p className="mt-0.5 text-2xs text-muted-foreground">Gap</p>
      </div>
    </button>
  );
}

function SeverityDot({ severity }: { severity: IssueAlert["severity"] }) {
  return (
    <span
      className={cn(
        "mt-1.5 size-2 shrink-0 rounded-full",
        severity === "high" && "bg-error-500",
        severity === "mid" && "bg-warning-500",
        severity === "low" && "bg-neutral-300",
      )}
      aria-hidden
    />
  );
}

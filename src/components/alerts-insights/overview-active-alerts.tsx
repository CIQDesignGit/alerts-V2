"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  alertsSummary,
  formatAtRisk,
  getIssueAlertInsights,
  issueAlerts,
  issueLabel,
  type IssueAlert,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type OverviewActiveAlertsProps = {
  onGoToAlerts: () => void;
};

/** Ranked issue list — dollar-first teaser into the Alerts tab. */
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
            {formatAtRisk(alertsSummary.atRiskDollars)} at risk
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
      className="flex w-full gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
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

        {insights.lastSeen && (
          <p className="mt-1.5 text-xs text-neutral-500">
            Since {insights.lastSeen}
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
          {formatAtRisk(alert.atRiskDollars)}
        </p>
        <p className="mt-0.5 text-2xs text-muted-foreground">at risk</p>
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

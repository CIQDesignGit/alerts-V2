"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  alertsSummary,
  aiBrief,
  brandCards,
  formatAtRisk,
  formatGapDollars,
  issueAlerts,
  issueGroup,
  issueLabel,
  portfolioGap,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type OverviewTabProps = {
  onGoToAlerts: () => void;
  onGoToInsights: () => void;
};

export function OverviewTab({ onGoToAlerts, onGoToInsights }: OverviewTabProps) {
  const topAlerts = issueAlerts.slice(0, 4);
  const lowerAlerts = issueAlerts.slice(4, 8);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={portfolioGap.label}
          gapDollars={portfolioGap.gapDollars}
          meta={`vs plan · ${portfolioGap.attainmentPct}% attainment`}
        />
        {brandCards.map((brand) => (
          <MetricCard
            key={brand.name}
            title={`${brand.name} · ${brand.attainmentPct}%`}
            gapDollars={brand.gapDollars}
            meta={brand.subtitle}
          />
        ))}
      </div>

      <section className="rounded-lg border border-border border-l-4 border-l-primary bg-brand-50/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-2xs font-semibold tracking-wider text-primary uppercase">
              AI Brief
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {aiBrief}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Show reasoning →
          </button>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Active Alerts"
          subtitle={`${alertsSummary.count} issues · ${formatAtRisk(alertsSummary.atRiskDollars)} at risk`}
          action={
            <Button onClick={onGoToAlerts}>
              Go to Alerts
              <ArrowRight className="size-4" />
            </Button>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {topAlerts.map((alert) => (
            <button
              key={alert.issueKey}
              type="button"
              onClick={onGoToAlerts}
              className={cn(
                "rounded-lg border border-border p-3 text-left shadow-xs border-l-4",
                alert.severity === "high" && "border-l-error-500",
                alert.severity === "mid" && "border-l-warning-500",
                alert.severity === "low" && "border-l-neutral-300",
              )}
            >
              <p className="text-sm font-semibold">{issueLabel(alert.issueKey)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {alert.skuCount} SKUs · {issueGroup(alert.issueKey)}
              </p>
              <p
                className={cn(
                  "mt-2 font-mono text-lg font-bold",
                  alert.severity === "high" && "text-error-600",
                  alert.severity === "mid" && "text-warning-600",
                  alert.severity === "low" && "text-neutral-500",
                )}
              >
                {formatAtRisk(alert.atRiskDollars)}
              </p>
            </button>
          ))}
        </div>
        {lowerAlerts.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {lowerAlerts.map((alert) => (
              <div
                key={alert.issueKey}
                className="rounded-lg border border-border border-l-4 border-l-neutral-200 p-3 text-muted-foreground"
              >
                <p className="text-sm font-medium">
                  {issueLabel(alert.issueKey)} · {alert.skuCount} SKUs
                </p>
                <p className="mt-1 font-mono text-sm">
                  {formatAtRisk(alert.atRiskDollars)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="Business Overview"
          subtitle="Entire Business → Brand → Category → SKU"
          action={
            <Button variant="outline" onClick={onGoToInsights}>
              Go to Insights
              <ArrowRight className="size-4" />
            </Button>
          }
        />
        <div className="grid gap-3 md:grid-cols-3">
          {brandCards.map((brand) => (
            <MetricCard
              key={brand.name}
              title={brand.name}
              gapDollars={brand.gapDollars}
              meta={brand.subtitle}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {title}
        </h2>
        <p className="text-sm text-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  title,
  gapDollars,
  meta,
}: {
  title: string;
  gapDollars: number;
  meta: string;
}) {
  const positive = gapDollars > 0;
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-background p-4 shadow-xs border-l-4",
        positive ? "border-l-success-500" : "border-l-error-500",
      )}
    >
      <p className="text-xs text-muted-foreground">{title}</p>
      <p
        className={cn(
          "mt-1 font-mono text-2xl font-bold tracking-tight",
          positive ? "text-success-600" : "text-error-600",
        )}
      >
        {formatGapDollars(gapDollars)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
      <div className="mt-3 h-8 rounded-sm bg-neutral-100" aria-hidden />
    </article>
  );
}

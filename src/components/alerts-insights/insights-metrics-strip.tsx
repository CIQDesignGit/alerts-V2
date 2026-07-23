"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import type { SnapshotMetricCell } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type InsightsMetricsStripProps = {
  metrics: SnapshotMetricCell[];
  /** Hide comparison % chips when compare period is off */
  showDeltas?: boolean;
};

/**
 * Snapshot metrics grid — curated set (default 8), configurable per level.
 */
export function InsightsMetricsStrip({
  metrics,
  showDeltas = true,
}: InsightsMetricsStripProps) {
  return (
    <section
      aria-label="Performance metrics"
      className="overflow-hidden rounded-lg border border-border"
    >
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCell
            key={metric.id}
            metric={metric}
            showDelta={showDeltas}
          />
        ))}
      </div>
    </section>
  );
}

function MetricCell({
  metric,
  showDelta,
}: {
  metric: SnapshotMetricCell;
  showDelta: boolean;
}) {
  const isAttainment = metric.variant === "attainment";
  const attainTone =
    Number.parseInt(metric.value, 10) >= 100 ? "pos" : "neg";

  return (
    <div className="flex flex-col gap-3 bg-background px-3 py-2.5">
      <p className="text-sm font-regular text-slate-600">
        {metric.label}
      </p>

      {isAttainment ? (
        <>
          <span
            className={cn(
              "inline-flex w-fit rounded px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums",
              attainTone === "pos"
                ? "bg-success-100 text-success-700"
                : "bg-error-100 text-error-700",
            )}
          >
            {metric.value}
          </span>
          {metric.subtitle && (
            <p className="text-2xs leading-snug text-neutral-500">
              {metric.subtitle}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="font-mono text-sm font-bold tabular-nums text-foreground">
            {metric.value}
          </p>
          {showDelta && metric.deltaPct != null && (
            <DeltaBadge pct={metric.deltaPct} />
          )}
        </>
      )}
    </div>
  );
}

/** Blue = up, amber = down — matches the CIQ consolidated metrics row. */
function DeltaBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  const Icon = up ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-0.5 rounded px-1 py-0.5 font-mono text-2xs font-semibold tabular-nums",
        up
          ? "bg-info-50 text-info-700"
          : "bg-warning-100 text-warning-700",
      )}
    >
      <Icon className="size-2.5" aria-hidden />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

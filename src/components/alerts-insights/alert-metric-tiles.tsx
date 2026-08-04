import type { AlertMetricTilesData } from "@/lib/mock-alerts-insights";

/** Two-up KPI row — new vs carried-over · brand/category concentration */
export function AlertMetricTiles({ metrics }: { metrics: AlertMetricTilesData }) {
  const { recency, concentration } = metrics;
  const recencyValue =
    recency.newCount === 0 && recency.recurringCount === 0
      ? "—"
      : `${recency.newCount} new · ${recency.recurringCount} recurring`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <MetricCell
        label="New vs carried over"
        value={recencyValue}
        subtitle={recency.subtitle}
      />
      <MetricCell
        label={concentration.title}
        value={concentration.value}
        subtitle={concentration.subtitle}
      />
    </div>
  );
}

function MetricCell({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-background px-4 py-3.5">
      <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-lg font-medium tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </article>
  );
}

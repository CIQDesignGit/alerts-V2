import type { ReactNode } from "react";

import type { AlertMetricTilesData } from "@/lib/mock-alerts-insights";

/** Bold the first match of `emphasis` inside plain subtitle text */
function emphasizeInSubtitle(subtitle: string, emphasis?: string): ReactNode {
  if (!emphasis) return subtitle;
  const index = subtitle.indexOf(emphasis);
  if (index < 0) return subtitle;
  return (
    <>
      {subtitle.slice(0, index)}
      <span className="font-semibold text-foreground">{emphasis}</span>
      {subtitle.slice(index + emphasis.length)}
    </>
  );
}

/** Two-up KPI row — new vs carried-over · brand/category concentration */
export function AlertMetricTiles({ metrics }: { metrics: AlertMetricTilesData }) {
  const { recency, concentration } = metrics;

  // Numbers stay large; "new" / "recurring" read as small labels beside them
  const recencyValue =
    recency.newCount === 0 && recency.recurringCount === 0 ? (
      "—"
    ) : (
      <>
        <span className="tabular-nums">{recency.newCount}</span>
        <span className="text-sm font-normal text-muted-foreground"> new</span>
        <span className="text-muted-foreground"> · </span>
        <span className="tabular-nums">{recency.recurringCount}</span>
        <span className="text-sm font-normal text-muted-foreground">
          {" "}
          recurring
        </span>
      </>
    );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <MetricCell
        label={recency.label}
        value={recencyValue}
        subtitle={recency.subtitle}
      />
      <MetricCell
        label={concentration.title}
        value={concentration.value}
        subtitle={emphasizeInSubtitle(
          concentration.subtitle,
          concentration.subtitleEmphasis,
        )}
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
  value: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-border bg-background px-4 py-3.5">
      <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-medium tracking-tight text-foreground">
        {value}
      </p>
      {subtitle ? (
        <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </article>
  );
}

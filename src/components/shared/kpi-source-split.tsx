import type { KpiSourceSplit as KpiSourceSplitData } from "@/lib/mock-calendar";

/** How last-week actual splits between consolidated and real-time sources */
export function KpiSourceSplit({ split }: { split: KpiSourceSplitData }) {
  const { final, realtime } = split;

  return (
    <p
      className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 border-t border-border pt-2 text-2xs leading-snug text-muted-foreground"
      role="group"
      aria-label="Actual by data source"
    >
      <SourceChunk
        label="Final"
        rangeLabel={final.rangeLabel}
        value={final.value}
      />
      <span className="text-muted-foreground/50" aria-hidden>·</span>
      <SourceChunk
        label="Real-time"
        rangeLabel={realtime.rangeLabel}
        value={realtime.value}
      />
    </p>
  );
}

function SourceChunk({
  label,
  rangeLabel,
  value,
}: {
  label: string;
  rangeLabel: string;
  value: string;
}) {
  return (
    <span className="inline-flex min-w-0 flex-wrap items-baseline gap-x-1">
      <span>
        <span className="font-medium text-foreground">{label}</span>
        <span> · {rangeLabel}</span>
      </span>
      <span className="font-mono font-medium tabular-nums text-foreground">
        {value}
      </span>
    </span>
  );
}

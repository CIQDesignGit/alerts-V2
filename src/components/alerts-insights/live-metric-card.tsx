import { cn } from "@/lib/utils";

/** Map attainment % to a fixed Tailwind width class (no inline styles). */
const WIDTH_BY_BUCKET: Record<number, string> = {
  0: "w-0",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-1/5",
  25: "w-1/4",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-2/5",
  45: "w-[45%]",
  50: "w-1/2",
  55: "w-[55%]",
  60: "w-3/5",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-3/4",
  80: "w-4/5",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-full",
};

export function LiveMetricCard({
  label,
  value,
  tone,
  /** When set, show a soft progress bar under the value (e.g. attainment) */
  progressPct,
}: {
  label: string;
  value: string;
  tone: "neg" | "pos" | "neutral";
  progressPct?: number;
}) {
  const bucket =
    progressPct != null
      ? Math.min(100, Math.max(0, Math.round(progressPct / 5) * 5))
      : null;
  const overPlan = progressPct != null && progressPct >= 100;

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-lg font-bold tabular-nums",
          tone === "neg" && "text-error-600",
          tone === "pos" && "text-success-600",
          tone === "neutral" && "text-foreground",
        )}
      >
        {value}
      </p>
      {bucket != null && progressPct != null && (
        <div className="mt-2 flex items-center gap-1.5">
          <div
            className="min-w-0 flex-1 overflow-hidden rounded-none bg-neutral-100 h-2"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPct}% attainment`}
          >
            <div
              className={cn(
                "h-full rounded-none",
                WIDTH_BY_BUCKET[bucket],
                overPlan ? "bg-success-500/35" : "bg-error-500/35",
              )}
            />
          </div>
          <span className="shrink-0 font-mono text-2xs font-semibold tabular-nums text-neutral-600">
            {progressPct}%
          </span>
        </div>
      )}
    </div>
  );
}

export function formatSignedInt(n: number): string {
  if (n > 0) return `+${n.toLocaleString()}`;
  return n.toLocaleString();
}

export function formatAsp(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toFixed(1)}`;
}

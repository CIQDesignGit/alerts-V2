import type { RcaKpiCard } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

/** Three-up performance row — Last Week · WTD · Projected EOW */
export function RcaKpiTiles({ kpis }: { kpis: RcaKpiCard[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {kpis.map((kpi) => (
        <article
          key={kpi.id}
          className="rounded-xl border border-border bg-background px-4 py-3.5"
        >
          <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
            {kpi.title}
          </p>
          <p
            className={cn(
              "mt-1.5 font-mono text-2xl font-bold tabular-nums tracking-tight",
              kpi.tone === "negative" && "text-error-600",
              kpi.tone === "positive" && "text-success-600",
              kpi.tone === "neutral" && "text-foreground",
            )}
          >
            {kpi.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{kpi.subtitle}</p>
        </article>
      ))}
    </div>
  );
}

"use client";

import type { RcaKpiCard } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaSummaryProps = {
  headline: string;
  kpis: RcaKpiCard[];
  alertBanner?: string;
  /** Hide visually while keeping content in the DOM for later */
  hidden?: boolean;
};

export function SkuRcaSummary({
  headline,
  kpis,
  alertBanner,
  hidden = false,
}: SkuRcaSummaryProps) {
  if (hidden) {
    return (
      <section className="hidden" aria-hidden data-sku-rca-summary>
        <p>{headline}</p>
        {kpis.map((kpi) => (
          <article key={kpi.id}>
            <p>{kpi.title}</p>
            <p>{kpi.value}</p>
          </article>
        ))}
        {alertBanner && <p>{alertBanner}</p>}
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-neutral-700">{headline}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <article
            key={kpi.id}
            className="rounded-lg border border-border bg-background p-3"
          >
            <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
              {kpi.title}
            </p>
            <p
              className={cn(
                "mt-1.5 font-mono text-xl font-bold",
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

      {alertBanner && (
        <div className="rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
          {alertBanner}
        </div>
      )}
    </section>
  );
}

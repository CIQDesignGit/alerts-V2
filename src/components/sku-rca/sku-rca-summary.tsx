"use client";

import { RcaKpiTiles } from "@/components/shared/rca-kpi-tiles";
import type { RcaKpiCard } from "@/lib/mock-sku-rca";

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

      <RcaKpiTiles kpis={kpis} />

      {alertBanner && (
        <div className="rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
          {alertBanner}
        </div>
      )}
    </section>
  );
}

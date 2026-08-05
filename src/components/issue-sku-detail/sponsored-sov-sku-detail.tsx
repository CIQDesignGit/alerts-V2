"use client";

import { ChevronRight, Info } from "lucide-react";
import { useMemo } from "react";

import {
  getSponsoredSovSkuDetail,
  type SovChange,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type SponsoredSovSkuDetailProps = {
  sku: IssueSku;
};

function formatPct(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value}%`;
}

function SovDelta({ change }: { change: SovChange }) {
  return (
    <span className="text-sm">
      <span className="text-muted-foreground">{formatPct(change.from)}</span>
      <span className="mx-1 text-muted-foreground">→</span>
      <span className="font-semibold text-error-600">
        {formatPct(change.to)}
      </span>
      <span className="ml-1 text-error-600">({change.deltaPct}%)</span>
    </span>
  );
}

/** Sponsored Share of Voice — SP/SB cards + keyword table. */
export function SponsoredSovSkuDetail({ sku }: SponsoredSovSkuDetailProps) {
  const detail = useMemo(() => getSponsoredSovSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricCard
          title="Sponsored Product SoV"
          change={detail.sp}
          competitorLabel={`Competitor SP SoV ${detail.sp.competitorPct}%`}
        />
        <MetricCard
          title="Sponsored Brand SoV"
          change={detail.sb}
          competitorLabel={`Competitor SB SoV ${detail.sb.competitorPct}%`}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Top Contributing Keywords
        </h3>
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-neutral-50 text-left text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3">Keyword</th>
                <th className="px-4 py-3 text-right">SP SoV (from → to)</th>
                <th className="px-4 py-3 text-right">SB SoV (from → to)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {detail.keywords.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <ChevronRight
                        className="size-3.5 text-neutral-400"
                        aria-hidden
                      />
                      {row.keyword}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <SovDelta change={row.sp} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <SovDelta change={row.sb} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  change,
  competitorLabel,
}: {
  title: string;
  change: SovChange;
  competitorLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-4">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        {title}
        <Info className="size-3.5 text-neutral-400" aria-hidden />
      </div>
      <p className="mt-3 text-lg">
        <span className="text-muted-foreground">{formatPct(change.from)}</span>
        <span className="mx-1.5 text-muted-foreground">→</span>
        <span className="font-bold text-error-600">
          {formatPct(change.to)}
        </span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{competitorLabel}</p>
    </div>
  );
}

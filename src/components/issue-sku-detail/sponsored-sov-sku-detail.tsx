"use client";

import { ChevronRight, Info } from "lucide-react";
import { useMemo } from "react";

import {
  IssueDetailTableHeader,
  issueDetailTable,
  issueTd,
  issueTh,
} from "@/components/issue-sku-detail/issue-detail-table";
import {
  getSponsoredSovSkuDetail,
  type SovChange,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type SponsoredSovSkuDetailProps = {
  sku: IssueSku;
};

function formatPct(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value}%`;
}

function SovDelta({ change }: { change: SovChange }) {
  return (
    <span className={cn(issueDetailTable.cellRight, "gap-1")}>
      <span className="text-muted-foreground">{formatPct(change.from)}</span>
      <span className="text-muted-foreground">→</span>
      <span className="font-semibold text-error-600">
        {formatPct(change.to)}
      </span>
      <span className="text-error-600">({change.deltaPct}%)</span>
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

      <div className={issueDetailTable.frame}>
          <IssueDetailTableHeader title="Top Contributing Keywords" />
          <div className={issueDetailTable.scroll}>
            <table className={issueDetailTable.table}>
              <thead>
                <tr className={issueDetailTable.headRow}>
                  <th className={issueTh()}>
                    <span className={issueDetailTable.thCell}>Keyword</span>
                  </th>
                  <th className={issueTh("right")}>
                    <span className={issueDetailTable.thCellRight}>
                      SP SoV (from → to)
                    </span>
                  </th>
                  <th className={issueTh("right")}>
                    <span className={issueDetailTable.thCellRight}>
                      SB SoV (from → to)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {detail.keywords.map((row) => (
                  <tr key={row.id} className={issueDetailTable.row}>
                    <td className={issueTd()}>
                      <span className={cn(issueDetailTable.cell, "gap-1.5")}>
                        <ChevronRight
                          className="size-3.5 text-neutral-400"
                          aria-hidden
                        />
                        {row.keyword}
                      </span>
                    </td>
                    <td className={issueTd("right")}>
                      <SovDelta change={row.sp} />
                    </td>
                    <td className={issueTd("right")}>
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
      <p className="mt-3 text-lg tabular-nums">
        <span className="text-muted-foreground">{formatPct(change.from)}</span>
        <span className="mx-1.5 text-muted-foreground">→</span>
        <span className="font-bold text-error-600">{formatPct(change.to)}</span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{competitorLabel}</p>
    </div>
  );
}

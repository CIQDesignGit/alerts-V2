"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";

import {
  IssueDetailTableHeader,
  issueDetailTable,
  issueTd,
  issueTh,
} from "@/components/issue-sku-detail/issue-detail-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getSponsoredSovSkuDetail,
  type SovChange,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type SponsoredSovSkuDetailProps = {
  sku: IssueSku;
};

/** Shared SoV definition — same for SP and SB cards */
const SOV_INFO_TOOLTIP = {
  SoV: "Page 1 sponsored placements",
  Current: "7-day avg",
  Baseline: "90-day avg",
} as const;

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
      <p className="text-sm text-muted-foreground">{detail.summary}</p>

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
                      <span className={issueDetailTable.cell}>
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
        <Tooltip>
          <TooltipTrigger
            className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
            aria-label={`About ${title}`}
          >
            <Info className="size-3.5" aria-hidden />
          </TooltipTrigger>
          <TooltipContent className="flex max-w-xs flex-col items-stretch gap-1 px-3 py-2 text-left">
            <SovInfoTooltipBody />
          </TooltipContent>
        </Tooltip>
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

/** Dark tooltip body — bold labels + definitions from design */
function SovInfoTooltipBody() {
  return (
    <div className="flex flex-col gap-1 text-xs leading-snug text-background">
      {Object.entries(SOV_INFO_TOOLTIP).map(([label, value]) => (
        <p key={label}>
          <span className="font-semibold">{label}:</span> {value}
        </p>
      ))}
    </div>
  );
}

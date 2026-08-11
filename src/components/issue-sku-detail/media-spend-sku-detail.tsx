"use client";

import { ChevronsUp, ChevronUp, Info } from "lucide-react";
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
import { getMediaSpendSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type MediaSpendSkuDetailProps = {
  sku: IssueSku;
};

const IMPORTANCE_TOOLTIP =
  "How much this keyword matters to your business — ranked using recent sales, spend trends, search visibility, and overall keyword priority.";
const SFR_TOOLTIP =
  "Search Frequency Rank — how often shoppers search this term. Lower numbers mean higher search volume.";

/** Title-case headers (reference is not ALL CAPS) */
const thNormal = "normal-case tracking-normal";

function formatMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) return `$${(abs / 1000).toFixed(2)}K`.replace(/\.00K$/, "K");
  return `$${abs.toFixed(2)}`;
}

function HeaderInfo({ label, tip }: { label: string; tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex size-3 shrink-0 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-600"
        aria-label={`About ${label}`}
      >
        <Info className="size-3" aria-hidden />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-left leading-snug">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

/** Media Spend — top contributing keywords performance table. */
export function MediaSpendSkuDetail({ sku }: MediaSpendSkuDetailProps) {
  const detail = useMemo(() => getMediaSpendSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {detail.summaryLead}{" "}
        <span className="font-semibold text-foreground">
          {detail.totalSpendLastWeek}
        </span>{" "}
        Last Week vs.{" "}
        <span className="font-semibold text-foreground">
          {detail.totalSpendPreviousWeek}
        </span>{" "}
        Previous Week
      </p>

      <div className={issueDetailTable.frame}>
        <IssueDetailTableHeader
          title="Top Contributing Keywords"
          meta={detail.periodLabel}
        />

        <div className={issueDetailTable.scroll}>
          <table className={cn(issueDetailTable.table, "min-w-[720px]")}>
            <thead>
              <tr className={issueDetailTable.headRow}>
                <th className={issueTh("left", thNormal)}>
                  <span className={issueDetailTable.thCell}>Keyword</span>
                </th>
                <th className={issueTh("left", thNormal)}>
                  <span className={cn(issueDetailTable.thCell, "gap-1")}>
                    Importance
                    <HeaderInfo label="Importance" tip={IMPORTANCE_TOOLTIP} />
                  </span>
                </th>
                <th className={issueTh("right", thNormal)}>
                  <span className={cn(issueDetailTable.thCellRight, "gap-1")}>
                    SFR
                    <HeaderInfo label="SFR" tip={SFR_TOOLTIP} />
                  </span>
                </th>
                <th className={issueTh("right", thNormal)}>
                  <span className={issueDetailTable.thCellColRight}>
                    <span>Spend LW</span>
                    <span className="font-normal text-muted-foreground">
                      {detail.spendLwDates}
                    </span>
                  </span>
                </th>
                <th className={issueTh("right", thNormal)}>
                  <span className={issueDetailTable.thCellColRight}>
                    <span>Spend Change</span>
                    <span className="font-normal text-muted-foreground">
                      {detail.spendChangeVs}
                    </span>
                  </span>
                </th>
                <th className={issueTh("right", thNormal)}>
                  <span className={issueDetailTable.thCellRight}>
                    Rank (PW → LW)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.rows.map((row) => {
                const rankDelta = row.rankTo - row.rankFrom;
                const improved = rankDelta < 0;

                return (
                  <tr key={row.id} className={issueDetailTable.row}>
                    <td className={issueTd()}>
                      <span className={issueDetailTable.cell}>{row.keyword}</span>
                    </td>
                    <td className={issueTd()}>
                      <span
                        className={cn(
                          issueDetailTable.cell,
                          "gap-1",
                          row.importance === "High"
                            ? "text-error-700"
                            : "text-warning-700",
                        )}
                      >
                        {row.importance === "High" ? (
                          <ChevronsUp className="size-3.5" aria-hidden />
                        ) : (
                          <ChevronUp className="size-3.5" aria-hidden />
                        )}
                        {row.importance}
                      </span>
                    </td>
                    <td className={issueTd("right")}>
                      <span className={issueDetailTable.cellRight}>
                        {row.sfr.toLocaleString()}
                      </span>
                    </td>
                    <td className={issueTd("right")}>
                      <span className={issueDetailTable.cellRight}>
                        {formatMoney(row.last7Days)}
                      </span>
                    </td>
                    <td className={issueTd("right")}>
                      <span
                        className={cn(
                          issueDetailTable.cellRight,
                          "font-semibold",
                        )}
                      >
                        −{formatMoney(Math.abs(row.previousDelta))}
                      </span>
                    </td>
                    <td className={issueTd("right")}>
                      <span className={cn(issueDetailTable.cellRight, "gap-1")}>
                        <span className="text-muted-foreground">
                          #{row.rankFrom}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-semibold">#{row.rankTo}</span>
                        <span
                          className={cn(
                            "font-medium",
                            improved ? "text-success-600" : "text-error-600",
                          )}
                        >
                          ({improved ? "" : "+"}
                          {rankDelta})
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

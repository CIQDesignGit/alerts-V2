"use client";

import { ChevronsUp, ChevronUp, Info } from "lucide-react";
import { useMemo } from "react";

import {
  IssueDetailTableHeader,
  issueDetailTable,
  issueTd,
  issueTh,
} from "@/components/issue-sku-detail/issue-detail-table";
import { getMediaSpendSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type MediaSpendSkuDetailProps = {
  sku: IssueSku;
};

function formatMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) return `$${(abs / 1000).toFixed(2)}K`.replace(/\.00K$/, "K");
  return `$${abs.toFixed(2)}`;
}

/** Media Spend — top contributing keywords performance table. */
export function MediaSpendSkuDetail({ sku }: MediaSpendSkuDetailProps) {
  const detail = useMemo(() => getMediaSpendSkuDetail(sku), [sku]);

  return (
    <div className={issueDetailTable.frame}>
      <IssueDetailTableHeader
        title="Top Contributing Keywords"
        meta={detail.periodLabel}
      />

      <div className={issueDetailTable.scroll}>
        <table className={cn(issueDetailTable.table, "min-w-[720px]")}>
            <thead>
              <tr className={issueDetailTable.headRow}>
                <th className={issueTh()}>
                  <span className={issueDetailTable.thCell}>Keyword</span>
                </th>
                <th className={issueTh()}>
                  <span className={cn(issueDetailTable.thCell, "gap-1")}>
                    Importance
                    <Info className="size-3" aria-hidden />
                  </span>
                </th>
                <th className={issueTh("right")}>
                  <span className={cn(issueDetailTable.thCellRight, "gap-1")}>
                    SFR
                    <Info className="size-3" aria-hidden />
                  </span>
                </th>
                <th className={issueTh("right")}>
                  <span className={issueDetailTable.thCellRight}>
                    {detail.periodLabel}
                  </span>
                </th>
                <th className={issueTh("right")}>
                  <span className={issueDetailTable.thCellRight}>
                    {detail.previousPeriodLabel}
                  </span>
                </th>
                <th className={issueTh("right")}>
                  <span className={issueDetailTable.thCellColRight}>
                    <span>Keyword Rank</span>
                    <span className="font-normal normal-case tracking-normal">
                      (Previous → Last 7 Days)
                    </span>
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
  );
}

"use client";

import { CheckCircle2, ExternalLink, Tag, XCircle } from "lucide-react";
import { useMemo } from "react";

import {
  IssueDetailTableHeader,
  issueDetailTable,
  issueTd,
  issueTh,
} from "@/components/issue-sku-detail/issue-detail-table";
import { getCouponSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type CouponSkuDetailProps = {
  sku: IssueSku;
};

export function CouponSkuDetail({ sku }: CouponSkuDetailProps) {
  const detail = useMemo(() => getCouponSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{detail.alertMessage}</p>

      <div className={issueDetailTable.frame}>
        <IssueDetailTableHeader title="Coupon Detection Timeline" />
        <div className={issueDetailTable.scroll}>
          <table className={cn(issueDetailTable.table, "min-w-[640px]")}>
            <thead>
              <tr className={issueDetailTable.headRow}>
                <th className={issueTh()}>
                  <span className={issueDetailTable.thCell}>Time</span>
                </th>
                <th className={issueTh()}>
                  <span className={issueDetailTable.thCell}>Coupon Detected</span>
                </th>
                <th className={issueTh()}>
                  <span className={issueDetailTable.thCell}>Coupon Value</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.rows.map((row) => (
                <tr key={row.id} className={issueDetailTable.row}>
                  <td className={issueTd()}>
                    <span className={cn(issueDetailTable.cell, "items-start gap-1.5 py-1")}>
                      <span className="flex flex-col">
                        <span>{row.relativeTime}</span>
                        <span className="text-2xs font-normal text-muted-foreground">
                          {row.absoluteTime}
                        </span>
                      </span>
                      <ExternalLink
                        className="mt-0.5 size-3.5 shrink-0 text-neutral-400"
                        aria-hidden
                      />
                    </span>
                  </td>
                  <td className={issueTd()}>
                    <span className={issueDetailTable.cell}>
                      <CouponDetectedBadge detected={row.couponDetected} />
                    </span>
                  </td>
                  <td className={issueTd()}>
                    <span className={cn(issueDetailTable.cellCol, "py-1")}>
                      {row.couponValues.length > 0 ? (
                        <ul className="space-y-1.5">
                          {row.couponValues.map((value) => (
                            <li key={value} className="flex items-start gap-2">
                              <Tag
                                className="mt-0.5 size-3.5 shrink-0 text-warning-600"
                                aria-hidden
                              />
                              <span>{value}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </span>
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

function CouponDetectedBadge({ detected }: { detected: boolean }) {
  const Icon = detected ? CheckCircle2 : XCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        detected ? "text-success-700" : "text-neutral-500",
      )}
    >
      <Icon
        className={cn(
          "size-4",
          detected ? "text-success-600" : "text-neutral-400",
        )}
        aria-hidden
      />
      {detected ? "Yes" : "No"}
    </span>
  );
}

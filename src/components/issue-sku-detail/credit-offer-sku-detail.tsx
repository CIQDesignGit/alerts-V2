"use client";

import { Banknote, Check, ExternalLink } from "lucide-react";
import { useMemo } from "react";

import {
  IssueDetailTableHeader,
  issueDetailTable,
  issueTd,
  issueTh,
} from "@/components/issue-sku-detail/issue-detail-table";
import { getCreditOfferSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type CreditOfferSkuDetailProps = {
  sku: IssueSku;
};

/** Same layout as Coupon — shows cashback / credit amounts instead of coupon value. */
export function CreditOfferSkuDetail({ sku }: CreditOfferSkuDetailProps) {
  const detail = useMemo(() => getCreditOfferSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{detail.alertMessage}</p>

      <div className={issueDetailTable.frame}>
        <IssueDetailTableHeader title="Credit Offer Detection Timeline" />
        <div className={issueDetailTable.scroll}>
          <table className={cn(issueDetailTable.table, "min-w-[640px]")}>
            <thead>
              <tr className={issueDetailTable.headRow}>
                <th className={issueTh()}>
                  <span className={issueDetailTable.thCell}>Time</span>
                </th>
                <th className={issueTh()}>
                  <span className={issueDetailTable.thCell}>
                    Credit Offer Detected
                  </span>
                </th>
                <th className={issueTh()}>
                  <span className={issueDetailTable.thCell}>Offer Amount</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.rows.map((row) => (
                <tr key={row.id} className={issueDetailTable.row}>
                  <td className={issueTd()}>
                    <span
                      className={cn(
                        issueDetailTable.cell,
                        "items-start gap-1.5 py-1",
                      )}
                    >
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
                      <OfferDetectedBadge detected={row.offerDetected} />
                    </span>
                  </td>
                  <td className={issueTd()}>
                    <span className={cn(issueDetailTable.cellCol, "py-1")}>
                      {row.offerAmounts.length > 0 ? (
                        <ul className="space-y-1.5">
                          {row.offerAmounts.map((value) => (
                            <li key={value} className="flex items-start gap-2">
                              <Banknote
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

function OfferDetectedBadge({ detected }: { detected: boolean }) {
  if (detected) {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span
          className="inline-flex size-5 items-center justify-center rounded-full bg-error-100"
          aria-hidden
        >
          <span className="size-2 rounded-full bg-error-600" />
        </span>
        Credit Offer detected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      <Check className="size-3.5 text-success-600" aria-hidden />
      No Credit Offer
    </span>
  );
}

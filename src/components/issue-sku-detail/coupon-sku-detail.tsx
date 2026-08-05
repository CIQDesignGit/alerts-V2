"use client";

import { CheckCircle2, ExternalLink, Tag, XCircle } from "lucide-react";
import { useMemo } from "react";

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

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-neutral-50/80 text-left text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Coupon Detected</th>
                <th className="px-4 py-3">Coupon Value</th>
                <th className="px-4 py-3">Buy Box Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {detail.rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-start gap-1.5">
                      <div>
                        <p className="font-medium text-foreground">
                          {row.relativeTime}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {row.absoluteTime}
                        </p>
                      </div>
                      <ExternalLink
                        className="mt-0.5 size-3.5 shrink-0 text-neutral-400"
                        aria-hidden
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <CouponDetectedBadge detected={row.couponDetected} />
                  </td>
                  <td className="px-4 py-4 align-top">
                    {row.couponValues.length > 0 ? (
                      <ul className="space-y-2">
                        {row.couponValues.map((value) => (
                          <li key={value} className="flex items-start gap-2">
                            <Tag
                              className="mt-0.5 size-3.5 shrink-0 text-warning-600"
                              aria-hidden
                            />
                            <span className="text-sm text-foreground">
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-foreground">
                    {row.buyBoxWinner}
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
        "inline-flex items-center gap-1.5 text-sm font-medium",
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

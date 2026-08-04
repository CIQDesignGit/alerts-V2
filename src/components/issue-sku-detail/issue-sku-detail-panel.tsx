"use client";

import type { IssueKey } from "@/components/alerts/issue-names";
import { CouponSkuDetail } from "@/components/issue-sku-detail/coupon-sku-detail";
import { IssueSkuDetailShell } from "@/components/issue-sku-detail/issue-sku-detail-shell";
import { LostBuyBoxSkuDetail } from "@/components/issue-sku-detail/lost-buy-box-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type IssueSkuDetailPanelProps = {
  sku: IssueSku;
  issueKey: IssueKey;
  onClose: () => void;
};

/** Issue-type aggregation SKU detail — layout varies by alert issue. */
export function IssueSkuDetailPanel({
  sku,
  issueKey,
  onClose,
}: IssueSkuDetailPanelProps) {
  return (
    <IssueSkuDetailShell sku={sku} onClose={onClose}>
      {issueKey === "lostBuyBox" && <LostBuyBoxSkuDetail sku={sku} />}
      {issueKey === "coupon" && <CouponSkuDetail sku={sku} />}
    </IssueSkuDetailShell>
  );
}

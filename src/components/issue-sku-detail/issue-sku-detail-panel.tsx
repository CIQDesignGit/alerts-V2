"use client";

import type { IssueKey } from "@/components/alerts/issue-names";
import { IssueSkuDetailBody } from "@/components/issue-sku-detail/issue-sku-detail-body";
import { IssueSkuDetailShell } from "@/components/issue-sku-detail/issue-sku-detail-shell";
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
    <IssueSkuDetailShell sku={sku} issueKey={issueKey} onClose={onClose}>
      <IssueSkuDetailBody sku={sku} issueKey={issueKey} />
    </IssueSkuDetailShell>
  );
}

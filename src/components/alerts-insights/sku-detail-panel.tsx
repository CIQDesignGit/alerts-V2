"use client";

import type { IssueKey } from "@/components/alerts/issue-names";
import { IssueSkuDetailPanel } from "@/components/issue-sku-detail/issue-sku-detail-panel";
import { SkuRca } from "@/components/sku-rca/sku-rca";
import { hasIssueSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

export type SkuAggregationMode = "issue" | "taxonomy";

type SkuDetailPanelProps = {
  sku: IssueSku;
  aggregation: SkuAggregationMode;
  /** Required when aggregation is issue — drives the issue-specific layout */
  issueKey?: IssueKey;
  onBackToAlert: () => void;
};

/**
 * SKU detail routes by left-panel aggregation:
 * - taxonomy → AllyAI RCA diagnosis (SkuRca)
 * - issue → issue-specific SKU page when implemented
 */
export function SkuDetailPanel({
  sku,
  aggregation,
  issueKey,
  onBackToAlert,
}: SkuDetailPanelProps) {
  if (
    aggregation === "issue" &&
    issueKey &&
    hasIssueSkuDetail(issueKey)
  ) {
    return (
      <IssueSkuDetailPanel
        key={`${issueKey}:${sku.id}`}
        sku={sku}
        issueKey={issueKey}
        onClose={onBackToAlert}
      />
    );
  }

  return <SkuRca key={sku.id} sku={sku} onClose={onBackToAlert} />;
}

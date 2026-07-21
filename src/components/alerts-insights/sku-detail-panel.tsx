"use client";

import { SkuRca } from "@/components/sku-rca/sku-rca";
import type { IssueAlert, IssueSku } from "@/lib/mock-alerts-insights";

type SkuDetailPanelProps = {
  issue: IssueAlert;
  sku: IssueSku;
  onBackToAlert: () => void;
};

/** Alerts / Insights shared SKU leaf — renders full SkuRca layout. */
export function SkuDetailPanel({
  sku,
  onBackToAlert,
}: SkuDetailPanelProps) {
  return <SkuRca sku={sku} onClose={onBackToAlert} />;
}

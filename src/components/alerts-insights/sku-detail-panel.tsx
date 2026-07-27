"use client";

import { SkuRca } from "@/components/sku-rca/sku-rca";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type SkuDetailPanelProps = {
  sku: IssueSku;
  onBackToAlert: () => void;
};

/** Alerts-only SKU detail with Alert + SKU Insights sub-tabs. */
export function SkuDetailPanel({ sku, onBackToAlert }: SkuDetailPanelProps) {
  return <SkuRca key={sku.id} sku={sku} onClose={onBackToAlert} />;
}

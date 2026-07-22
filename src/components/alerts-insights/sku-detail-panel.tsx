"use client";

import { SkuRca } from "@/components/sku-rca/sku-rca";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type SkuDetailPanelProps = {
  sku: IssueSku;
  onBackToAlert: () => void;
};

/** Alerts / Insights shared SKU leaf — same SkuRca layout either way. */
export function SkuDetailPanel({ sku, onBackToAlert }: SkuDetailPanelProps) {
  return <SkuRca sku={sku} onClose={onBackToAlert} />;
}

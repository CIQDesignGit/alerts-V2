"use client";

import { SkuRca } from "@/components/sku-rca/sku-rca";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type SkuDetailPanelProps = {
  sku: IssueSku;
  onBackToAlert: () => void;
};

/** Alerts-only SKU detail — Insights uses the Insights level shell instead. */
export function SkuDetailPanel({ sku, onBackToAlert }: SkuDetailPanelProps) {
  return <SkuRca sku={sku} onClose={onBackToAlert} />;
}

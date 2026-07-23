"use client";

import { useEffect, useMemo, useState, type UIEvent } from "react";

import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { SkuRcaLivePanel } from "@/components/sku-rca/sku-rca-live-panel";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaProps = {
  sku: IssueSku;
  onClose: () => void;
  /** Hand-off to Insights SKU page for this product */
  onViewSkuInsights?: () => void;
};

const COLLAPSE_AT = 24;

/**
 * Alert SKU detail — collapsing header + diagnosis + chat.
 * Used from Alerts only; Insights SKU stays in the Insights level shell.
 */
export function SkuRca({ sku, onClose, onViewSkuInsights }: SkuRcaProps) {
  const data = useMemo(() => getSkuRcaData(sku), [sku]);
  const [collapsed, setCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);

  useEffect(() => {
    setCollapsed(false);
  }, [data.asin]);

  function onBodyScroll(e: UIEvent<HTMLDivElement>) {
    setCollapsed(e.currentTarget.scrollTop > COLLAPSE_AT);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <SkuRcaHeader
        data={data}
        collapsed={collapsed}
        onClose={onClose}
        onViewSkuInsights={onViewSkuInsights}
      />

      <div
        onScroll={onBodyScroll}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-6 py-6",
          chatExpanded ? "pb-36" : "pb-16",
        )}
      >
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-8")}>
          <SkuRcaLivePanel data={data} />
        </div>
      </div>

      <SkuRcaChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        skuName={data.name}
      />
    </div>
  );
}

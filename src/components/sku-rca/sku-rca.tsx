"use client";

import { useEffect, useMemo, useState, type UIEvent } from "react";

import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { SkuRcaLivePanel } from "@/components/sku-rca/sku-rca-live-panel";
import {
  DEFAULT_INSIGHTS_DATE_RANGE,
  type InsightsDateRange,
} from "@/lib/insights-date-range";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaProps = {
  sku: IssueSku;
  onClose: () => void;
};

const COLLAPSE_AT = 24;

/**
 * Shared SKU leaf — collapsing header (with period control) + diagnosis + chat.
 */
export function SkuRca({ sku, onClose }: SkuRcaProps) {
  const data = useMemo(() => getSkuRcaData(sku), [sku]);
  const [collapsed, setCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<InsightsDateRange>(
    DEFAULT_INSIGHTS_DATE_RANGE,
  );

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
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClose={onClose}
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

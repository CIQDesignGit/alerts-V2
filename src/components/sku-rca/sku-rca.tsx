"use client";

import { useMemo, useState, type UIEvent } from "react";

import { SkuInsightsPanel } from "@/components/sku-rca/sku-insights-panel";
import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { SkuRcaLivePanel } from "@/components/sku-rca/sku-rca-live-panel";
import {
  SkuRcaViewToggle,
  type SkuRcaView,
} from "@/components/sku-rca/sku-rca-view-toggle";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaProps = {
  sku: IssueSku;
  onClose: () => void;
};

const COLLAPSE_AT = 24;

/**
 * Alert SKU detail — Alert sub-tab (live diagnosis) + SKU Insights sub-tab (issue trends).
 */
export function SkuRca({ sku, onClose }: SkuRcaProps) {
  const data = useMemo(() => getSkuRcaData(sku), [sku]);
  const [view, setView] = useState<SkuRcaView>("alert");
  const [collapsed, setCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);

  function onBodyScroll(e: UIEvent<HTMLDivElement>) {
    setCollapsed(e.currentTarget.scrollTop > COLLAPSE_AT);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <SkuRcaHeader data={data} collapsed={collapsed} onClose={onClose} />

      <div className="shrink-0 border-b border-border bg-background px-6 py-2">
        <div className={SKU_RCA_CONTENT_WIDTH}>
          <SkuRcaViewToggle view={view} onChange={setView} />
        </div>
      </div>

      <div
        onScroll={onBodyScroll}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-6 py-6",
          chatExpanded ? "pb-36" : "pb-16",
        )}
      >
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-8")}>
          {view === "alert" ? (
            <SkuRcaLivePanel data={data} />
          ) : (
            <SkuInsightsPanel entityId={sku.id} skuName={data.name} />
          )}
        </div>
      </div>

      <SkuRcaChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        skuName={data.name}
        view={view}
      />
    </div>
  );
}

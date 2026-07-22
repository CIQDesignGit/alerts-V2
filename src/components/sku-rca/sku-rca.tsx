"use client";

import { useEffect, useMemo, useState, type UIEvent } from "react";

import { InsightsHistoricalPanel } from "@/components/alerts-insights/insights-historical-panel";
import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { SkuRcaLivePanel } from "@/components/sku-rca/sku-rca-live-panel";
import type { InsightsMode } from "@/lib/insights-widgets";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { usePersistedWidgets } from "@/lib/use-persisted-widgets";
import { cn } from "@/lib/utils";

type SkuRcaProps = {
  sku: IssueSku;
  onClose: () => void;
};

const COLLAPSE_AT = 24;

/**
 * Shared SKU leaf — fixed header (collapses on scroll) + Live / Historical body
 * + floating chat. Live = current diagnosis; Historical = trend widgets (same
 * pattern as Insights levels).
 */
export function SkuRca({ sku, onClose }: SkuRcaProps) {
  const data = useMemo(() => getSkuRcaData(sku), [sku]);
  const [collapsed, setCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  // Live = what’s happening now; Historical = trends over time
  const [mode, setMode] = useState<InsightsMode>("live");
  // Widgets save per ASIN so each SKU keeps its own dashboard
  const widgetsApi = usePersistedWidgets(`sku-${data.asin}`);

  // Opening a different SKU starts on Live (current state first)
  useEffect(() => {
    setMode("live");
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
        mode={mode}
        onModeChange={setMode}
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
          {mode === "live" ? (
            <SkuRcaLivePanel data={data} />
          ) : (
            <InsightsHistoricalPanel
              entityName={data.name}
              widgets={widgetsApi.widgets}
              onAdd={widgetsApi.addWidget}
              onAddSuggestion={widgetsApi.addSuggestion}
              onUpdate={widgetsApi.updateWidget}
              onRemove={widgetsApi.removeWidget}
              onReset={widgetsApi.resetToDefaults}
            />
          )}
        </div>
      </div>

      <SkuRcaChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        mode={mode}
        skuName={data.name}
      />
    </div>
  );
}

"use client";

import { useMemo, useState, type UIEvent } from "react";

import { SkuRcaAnalysis } from "@/components/sku-rca/sku-rca-analysis";
import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import { SkuRcaFeedback } from "@/components/sku-rca/sku-rca-feedback";
import { SkuRcaHeader } from "@/components/sku-rca/sku-rca-header";
import { SkuRcaIssues } from "@/components/sku-rca/sku-rca-issues";
import { SkuRcaRecommendations } from "@/components/sku-rca/sku-rca-recommendations";
import { SkuRcaSummary } from "@/components/sku-rca/sku-rca-summary";
import { SkuRcaTrend } from "@/components/sku-rca/sku-rca-trend";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaProps = {
  sku: IssueSku;
  onClose: () => void;
};

const COLLAPSE_AT = 24;

/**
 * Shared SKU leaf — fixed header (collapses on scroll) + body + floating chat.
 * Issue card interiors are stubs for now (12 typed variants later).
 */
export function SkuRca({ sku, onClose }: SkuRcaProps) {
  const data = useMemo(() => getSkuRcaData(sku), [sku]);
  const [collapsed, setCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);

  function onBodyScroll(e: UIEvent<HTMLDivElement>) {
    setCollapsed(e.currentTarget.scrollTop > COLLAPSE_AT);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <SkuRcaHeader data={data} collapsed={collapsed} onClose={onClose} />

      <div
        onScroll={onBodyScroll}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-6 py-6",
          chatExpanded ? "pb-36" : "pb-16",
        )}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <SkuRcaSummary
            headline={data.summaryHeadline}
            kpis={data.kpis}
            alertBanner={data.alertBanner}
          />
          <SkuRcaIssues
            groups={data.issueGroups}
            lastUpdated={data.issuesLastUpdated}
          />
          <SkuRcaTrend data={data.trend} caption={data.trendCaption} />
          <SkuRcaAnalysis blocks={data.analysis} />
          <SkuRcaRecommendations items={data.recommendations} />
          <SkuRcaFeedback />
        </div>
      </div>

      <SkuRcaChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
      />
    </div>
  );
}

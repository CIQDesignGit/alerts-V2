"use client";

import { SkuRcaAnalysis } from "@/components/sku-rca/sku-rca-analysis";
import { SkuRcaFeedback } from "@/components/sku-rca/sku-rca-feedback";
import { SkuRcaIssues } from "@/components/sku-rca/sku-rca-issues";
import { SkuRcaRecommendations } from "@/components/sku-rca/sku-rca-recommendations";
import { SkuRcaSummary } from "@/components/sku-rca/sku-rca-summary";
import type { SkuRcaData } from "@/lib/mock-sku-rca";

type SkuRcaLivePanelProps = {
  data: SkuRcaData;
};

/** Live alert diagnosis — no historic trend charts (those live in SKU Insights). */
export function SkuRcaLivePanel({ data }: SkuRcaLivePanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <SkuRcaSummary
        headline={data.summaryHeadline}
        kpis={data.kpis}
        alertBanner={data.alertBanner}
        hidden
      />
      <SkuRcaIssues
        groups={data.issueGroups}
        lastUpdated={data.issuesLastUpdated}
      />
      <SkuRcaAnalysis blocks={data.analysis} hidden />
      <SkuRcaRecommendations items={data.recommendations} hidden />
      <SkuRcaFeedback feedbackKey={data.asin} />
    </div>
  );
}

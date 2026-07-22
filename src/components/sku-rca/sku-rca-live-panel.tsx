"use client";

import { SkuRcaAnalysis } from "@/components/sku-rca/sku-rca-analysis";
import { SkuRcaFeedback } from "@/components/sku-rca/sku-rca-feedback";
import { SkuRcaIssues } from "@/components/sku-rca/sku-rca-issues";
import { SkuRcaRecommendations } from "@/components/sku-rca/sku-rca-recommendations";
import { SkuRcaSummary } from "@/components/sku-rca/sku-rca-summary";
import { SkuRcaTrend } from "@/components/sku-rca/sku-rca-trend";
import type { SkuRcaData } from "@/lib/mock-sku-rca";

type SkuRcaLivePanelProps = {
  data: SkuRcaData;
};

/**
 * Live SKU view — current metrics, issues, short trend, diagnosis, and actions.
 * (Historical mode swaps this for the widget dashboard.)
 */
export function SkuRcaLivePanel({ data }: SkuRcaLivePanelProps) {
  return (
    <div className="flex flex-col gap-8">
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
      <SkuRcaFeedback feedbackKey={data.asin} />
    </div>
  );
}

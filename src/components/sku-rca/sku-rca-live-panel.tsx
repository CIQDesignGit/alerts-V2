"use client";

import { RcaKpiTiles } from "@/components/shared/rca-kpi-tiles";
import { SkuRcaAnalysis } from "@/components/sku-rca/sku-rca-analysis";
import { SkuRcaFeedback } from "@/components/sku-rca/sku-rca-feedback";
import { SkuRcaIssues } from "@/components/sku-rca/sku-rca-issues";
import { SkuRcaRecommendations } from "@/components/sku-rca/sku-rca-recommendations";
import { SkuRcaSuggestedPrompts } from "@/components/sku-rca/sku-rca-suggested-prompts";
import type { AllyAiPrompt, IssueSku } from "@/lib/mock-alerts-insights";
import type { SkuRcaData } from "@/lib/mock-sku-rca";

type SkuRcaLivePanelProps = {
  data: SkuRcaData;
  sku: IssueSku;
  onPromptSelect?: (prompt: AllyAiPrompt) => void;
};

/** Taxonomy SKU diagnosis — KPI tiles, issues, feedback, then suggested prompts. */
export function SkuRcaLivePanel({
  data,
  sku,
  onPromptSelect,
}: SkuRcaLivePanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <RcaKpiTiles kpis={data.kpis} />

      <SkuRcaIssues
        sku={sku}
        groups={data.issueGroups}
        lastWeekTopIssues={data.lastWeekTopIssues}
        liveIssuesSummary={data.liveIssuesSummary}
        lastWeekIssuesSummary={data.lastWeekIssuesSummary}
      />
      <SkuRcaAnalysis blocks={data.analysis} hidden />
      <SkuRcaRecommendations items={data.recommendations} hidden />
      <SkuRcaFeedback feedbackKey={data.asin} />

      <SkuRcaSuggestedPrompts
        prompts={data.suggestedPrompts}
        onSelect={onPromptSelect}
      />
    </div>
  );
}

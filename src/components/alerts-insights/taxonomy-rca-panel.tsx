"use client";

import { useMemo } from "react";

import { SuggestedAiPrompts } from "@/components/alerts-insights/suggested-ai-prompts";
import { TaxonomyPeriodSummaries } from "@/components/alerts-insights/taxonomy-period-summaries";
import { RcaKpiTiles } from "@/components/shared/rca-kpi-tiles";
import { ContentFeedback } from "@/components/shared/content-feedback";
import { SkuAllyChatThread } from "@/components/sku-rca/sku-ally-chat-thread";
import { SKU_RCA_CONTENT_WIDTH } from "@/components/sku-rca/sku-rca-header";
import { useSkuAllyThread } from "@/components/sku-rca/use-sku-ally-thread";
import {
  buildTaxonomyRcaView,
  FULL_RCA_LAST_WEEK_PROMPT,
  type AlertsTaxonomyNode,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type TaxonomyRcaPanelProps = {
  node: AlertsTaxonomyNode;
};

export function TaxonomyRcaPanel({ node }: TaxonomyRcaPanelProps) {
  const view = useMemo(() => buildTaxonomyRcaView(node), [node]);
  const insightPrompts = useMemo(
    () => [FULL_RCA_LAST_WEEK_PROMPT, ...view.insightPrompts],
    [view.insightPrompts],
  );

  // Sample SKU for the full RCA mock when this entity has affected ASINs
  const reportSku = useMemo(() => {
    const skus = [...node.skus].sort((a, b) => a.gapDollars - b.gapDollars);
    return (
      skus[0] ?? {
        id: node.id,
        name: node.name,
        asin: node.asin ?? "—",
        seller: "—",
        gapDollars: node.gapDollars,
        brand: node.name,
        category: node.name,
      }
    );
  }, [node]);

  const { messages, onPromptSelect } = useSkuAllyThread(reportSku);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-6")}>
          <header className="shrink-0 space-y-1">
            <p className="text-2xs font-semibold tracking-widest text-muted-foreground uppercase">
              {view.levelLabel}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {view.entityName}
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {view.alertCount}
              </span>{" "}
              active alerts
              <span className="mx-1.5 text-neutral-300" aria-hidden>
                ·
              </span>
              <span className="font-medium text-foreground">
                {view.skuCount}
              </span>{" "}
              SKUs affected
            </p>
          </header>

          <RcaKpiTiles kpis={view.performanceKpis} />

          <section className="shrink-0 space-y-3">
            <TaxonomyPeriodSummaries
              liveNowSummary={view.liveNowSummary}
              thisWeekSummary={view.thisWeekSummary}
              lastWeekSummary={view.lastWeekSummary}
            />
            <ContentFeedback
              variant="subtle"
              feedbackKey={node.id}
              surface="taxonomy-rca"
              contextLabel={view.entityName}
              title="Was this insight helpful?"
            />
            <SuggestedAiPrompts
              prompts={insightPrompts}
              onSelect={onPromptSelect}
            />
          </section>

          <SkuAllyChatThread messages={messages} />
        </div>
      </div>
    </div>
  );
}

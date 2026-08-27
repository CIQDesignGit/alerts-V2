"use client";

import { useMemo } from "react";

import { SuggestedAiPrompts } from "@/components/alerts-insights/suggested-ai-prompts";
import { RcaKpiTiles } from "@/components/shared/rca-kpi-tiles";
import { SkuAllyChatThread } from "@/components/sku-rca/sku-ally-chat-thread";
import { SKU_RCA_CONTENT_WIDTH } from "@/components/sku-rca/sku-rca-header";
import { useSkuAllyThread } from "@/components/sku-rca/use-sku-ally-thread";
import {
  buildTaxonomyRcaView,
  type AlertsTaxonomyNode,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type TaxonomyRcaPanelProps = {
  node: AlertsTaxonomyNode;
};

export function TaxonomyRcaPanel({ node }: TaxonomyRcaPanelProps) {
  const view = useMemo(() => buildTaxonomyRcaView(node), [node]);
  // Taxonomy levels: Gap to Plan chip only
  const insightPrompts = view.insightPrompts;

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

  // Overall / Brand / Category — header copy follows the selected level
  const reportScope = useMemo(
    () => ({
      level:
        node.level === "overall" ||
        node.level === "brand" ||
        node.level === "category"
          ? node.level
          : ("sku" as const),
      entityName: node.name,
    }),
    [node.level, node.name],
  );

  const { messages, onPromptSelect } = useSkuAllyThread(reportSku, {
    reportScope,
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {/* Edge-to-edge header — border spans full panel width */}
        <header className="shrink-0 border-b border-border px-6">
          <div
            className={cn(
              SKU_RCA_CONTENT_WIDTH,
              "flex items-end justify-between gap-4 py-4",
            )}
          >
            <div className="min-w-0 space-y-1">
              <p className="text-2xs font-semibold tracking-widest text-muted-foreground uppercase">
                {view.levelLabel}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {view.entityName}
              </h2>
            </div>
            <p className="shrink-0 pb-1 text-right text-sm text-muted-foreground">
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
          </div>
        </header>

        {/* Main content — own padding */}
        <div className="px-6 py-6">
          <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-6")}>
            <RcaKpiTiles kpis={view.performanceKpis} />

            <section className="shrink-0 space-y-3">
              {/* Live / Last week period summaries hidden for Overall · Brand · Category */}
              <SuggestedAiPrompts
                prompts={insightPrompts}
                onSelect={onPromptSelect}
              />
            </section>

            <SkuAllyChatThread messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}

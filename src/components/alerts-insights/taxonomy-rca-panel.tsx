"use client";

import { useMemo, useState } from "react";

import { SuggestedAiPrompts } from "@/components/alerts-insights/suggested-ai-prompts";
import { TaxonomyPeriodSummaries } from "@/components/alerts-insights/taxonomy-period-summaries";
import { RcaKpiTiles } from "@/components/shared/rca-kpi-tiles";
import { AllyChatFooter, allyChatScrollPaddingClass } from "@/components/shared/ally-chat-footer";
import { ContentFeedback } from "@/components/shared/content-feedback";
import {
  buildTaxonomyRcaView,
  type AlertsTaxonomyNode,
  type AllyAiPrompt,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type TaxonomyRcaPanelProps = {
  node: AlertsTaxonomyNode;
};

export function TaxonomyRcaPanel({ node }: TaxonomyRcaPanelProps) {
  const view = useMemo(() => buildTaxonomyRcaView(node), [node]);
  const insightPrompts = useMemo(
    () => [
      {
        id: "full-rca",
        label: `Run full RCA of ${view.entityName}`,
        prompt: `Run a full root cause analysis for ${view.entityName}. Summarize top drivers, seller behavior, and recommended actions for the next 48 hours.`,
        variant: "primary" as const,
      },
      ...view.insightPrompts,
    ],
    [view.entityName, view.insightPrompts],
  );
  const [chatExpanded, setChatExpanded] = useState(false);
  const [promptSeed, setPromptSeed] = useState<
    { id: string; text: string } | undefined
  >();

  function onPromptSelect(prompt: AllyAiPrompt) {
    setPromptSeed({ id: prompt.id, text: prompt.prompt });
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6",
          allyChatScrollPaddingClass(chatExpanded),
        )}
      >
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
            thisWeekSummary={view.thisWeekSummary}
            lastWeekSummary={view.lastWeekSummary}
          />
          <ContentFeedback
            variant="subtle"
            feedbackKey={node.id}
            surface="taxonomy-rca"
            contextLabel={view.entityName}
            title="Was this alert helpful?"
          />
          <SuggestedAiPrompts
            prompts={insightPrompts}
            onSelect={onPromptSelect}
          />
        </section>
      </div>

      <AllyChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        seedPrompt={promptSeed}
        collapsedLabel={`Ask AllyAI about ${view.entityName}…`}
        inputPlaceholder={`Ask about ${view.entityName} alerts, root causes, or next steps…`}
      />
    </div>
  );
}

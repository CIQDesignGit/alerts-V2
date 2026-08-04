"use client";

import { useMemo, useState } from "react";

import { AllyInsightContent } from "@/components/alerts-insights/ally-ai-surface";
import { AlertMetricTiles } from "@/components/alerts-insights/alert-metric-tiles";
import { SuggestedAiPrompts } from "@/components/alerts-insights/suggested-ai-prompts";
import { AllyChatFooter, allyChatScrollPaddingClass } from "@/components/shared/ally-chat-footer";
import { ContentFeedback } from "@/components/shared/content-feedback";
import {
  buildAlertAllyInsightBullets,
  buildAlertAllyInsightPrompts,
  buildAlertMetricTiles,
  type AllyAiPrompt,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

/** Shared right-pane aggregate for issue- or category-grouped alerts */
export type AlertGroupDetail = {
  title: string;
  /** Stable id for feedback (issueKey or category id) */
  feedbackKey: string;
  skuCount: number;
  gapDollars: number;
  aiSignal?: string;
  skus: IssueSku[];
};

type AlertDetailPanelProps = {
  group: AlertGroupDetail;
};

export function AlertDetailPanel({ group }: AlertDetailPanelProps) {
  const [chatExpanded, setChatExpanded] = useState(false);
  const [promptSeed, setPromptSeed] = useState<
    { id: string; text: string } | undefined
  >();

  const allyInsightBullets = useMemo(
    () =>
      buildAlertAllyInsightBullets(
        group.title,
        group.skus,
        group.gapDollars,
        group.skuCount,
        group.aiSignal,
      ),
    [group.title, group.skus, group.gapDollars, group.skuCount, group.aiSignal],
  );

  const insightPrompts = useMemo(
    () =>
      buildAlertAllyInsightPrompts(
        group.title,
        group.skus,
        group.gapDollars,
        group.skuCount,
      ),
    [group.title, group.skus, group.gapDollars, group.skuCount],
  );

  const metricTiles = useMemo(
    () => buildAlertMetricTiles(group.skus, group.gapDollars),
    [group.skus, group.gapDollars],
  );

  function onPromptSelect(prompt: AllyAiPrompt) {
    setPromptSeed({ id: prompt.id, text: prompt.prompt });
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <header className="relative shrink-0 border-b border-border bg-background">
        <div className="px-6 py-3">
          <h2 className="min-w-0 truncate text-lg font-bold leading-snug text-foreground">
            {group.title}
          </h2>
        </div>
      </header>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6",
          allyChatScrollPaddingClass(chatExpanded),
        )}
      >
        <section className="shrink-0 space-y-3">
          <AlertMetricTiles metrics={metricTiles} />
          <AllyInsightContent
            bullets={allyInsightBullets}
            title={`Key insights for ${group.title}`}
          />
          <ContentFeedback
            variant="subtle"
            feedbackKey={group.feedbackKey}
            surface="ally-insight"
            contextLabel={group.title}
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
        collapsedLabel={`Ask AllyAI about ${group.title}…`}
        inputPlaceholder={`Ask about ${group.title}, affected SKUs, or next steps…`}
      />
    </div>
  );
}

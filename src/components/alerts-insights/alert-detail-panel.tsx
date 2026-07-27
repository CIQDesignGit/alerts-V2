"use client";

import { useMemo, useState } from "react";

import { AffectedSkusTable } from "@/components/alerts-insights/affected-skus-table";
import { AllyInsightContent } from "@/components/alerts-insights/ally-ai-surface";
import { AllyChatFooter } from "@/components/shared/ally-chat-footer";
import { ContentFeedback } from "@/components/shared/content-feedback";
import {
  buildAlertAllyInsightBullets,
  buildAlertAllyInsightPrompts,
  type AllyAiPrompt,
  type IssueSku,
} from "@/lib/mock-alerts-insights";

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
  selectedSkuId: string | null;
  onSelectSku: (skuId: string) => void;
};

export function AlertDetailPanel({
  group,
  selectedSkuId,
  onSelectSku,
}: AlertDetailPanelProps) {
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
        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6"
        style={{ paddingBottom: chatExpanded ? "7.5rem" : "4.5rem" }}
      >
        <AllyInsightContent
          bullets={allyInsightBullets}
          prompts={insightPrompts}
          onPromptSelect={onPromptSelect}
        />

        <ContentFeedback
          feedbackKey={group.feedbackKey}
          surface="ally-insight"
          contextLabel={group.title}
          title="Was this Ally Insight useful?"
          subtitle="Helps AllyAI improve alert summaries for your team"
        />

        <AffectedSkusTable
          skus={group.skus}
          totalSkuCount={group.skuCount}
          totalGapDollars={group.gapDollars}
          selectedSkuId={selectedSkuId}
          onSelectSku={onSelectSku}
        />
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

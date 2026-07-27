"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { AffectedSkusTable } from "@/components/alerts-insights/affected-skus-table";
import { InsightSegmentText } from "@/components/alerts-insights/ally-ai-surface";
import { SuggestedAiPrompts } from "@/components/alerts-insights/suggested-ai-prompts";
import { AllyChatFooter } from "@/components/shared/ally-chat-footer";
import { ContentFeedback } from "@/components/shared/content-feedback";
import {
  buildTaxonomyRcaView,
  type AlertsTaxonomyNode,
  type AllyAiPrompt,
} from "@/lib/mock-alerts-insights";

type TaxonomyRcaPanelProps = {
  node: AlertsTaxonomyNode;
  selectedSkuId: string | null;
  onSelectSku: (skuId: string) => void;
};

export function TaxonomyRcaPanel({
  node,
  selectedSkuId,
  onSelectSku,
}: TaxonomyRcaPanelProps) {
  const view = useMemo(() => buildTaxonomyRcaView(node), [node]);
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
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6"
        style={{ paddingBottom: chatExpanded ? "7.5rem" : "4.5rem" }}
      >
        {/* Hero — level label, entity name, summary stats */}
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

        {/* Numbered narrative insights + suggested prompts */}
        {view.narratives.length > 0 && (
          <section className="shrink-0 space-y-3">
            <ol className="flex flex-col gap-3" aria-label="Key insights">
              {view.narratives.map((narrative, index) => (
                <li
                  key={narrative.id}
                  className="flex gap-3 rounded-xl border border-border bg-neutral-50/50 px-4 py-3.5"
                >
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-neutral-800">
                    {narrative.segments.map((segment, segmentIndex) => (
                      <InsightSegmentText
                        key={`${narrative.id}-${segmentIndex}`}
                        segment={segment}
                      />
                    ))}
                  </p>
                </li>
              ))}
            </ol>
            <SuggestedAiPrompts
              prompts={view.insightPrompts}
              onSelect={onPromptSelect}
            />
          </section>
        )}

        {/* Top 3 issues ranked list + suggested prompts */}
        {view.topIssues.length > 0 && (
          <section className="shrink-0 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Top {view.topIssues.length} issues affecting {view.entityName}{" "}
              right now
            </h3>
            <ol className="flex flex-col gap-2">
              {view.topIssues.map((issue) => (
                <li
                  key={issue.issueKey}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
                >
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600"
                    aria-hidden
                  >
                    {issue.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {issue.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {issue.skuCount}{" "}
                      {issue.skuCount === 1 ? "SKU" : "SKUs"}
                      <span className="mx-1.5 text-neutral-300" aria-hidden>
                        ·
                      </span>
                      {issue.group}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <SuggestedAiPrompts
              prompts={view.issuePrompts}
              onSelect={onPromptSelect}
            />
          </section>
        )}

        <ContentFeedback
          feedbackKey={node.id}
          surface="taxonomy-rca"
          contextLabel={view.entityName}
          title="Was this RCA summary useful?"
          subtitle="Helps AllyAI improve portfolio, brand, and category insights"
        />

        {/* Affected SKUs table — retained from alert detail panel */}
        <AffectedSkusTable
          skus={view.skus}
          totalSkuCount={view.skuCount}
          totalGapDollars={view.gapDollars}
          selectedSkuId={selectedSkuId}
          onSelectSku={onSelectSku}
        />

        {/* CTA — deeper RCA (prototype action) */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200/70 bg-brand-50/60 px-4 py-3.5">
          <p className="text-sm text-neutral-800">
            Want to go deeper into what&apos;s driving {view.entityName}&apos;s
            gap?
          </p>
          <button
            type="button"
            onClick={() =>
              onPromptSelect({
                id: "full-rca",
                label: `Run full RCA of ${view.entityName}`,
                prompt: `Run a full root cause analysis for ${view.entityName}. Summarize top drivers, seller behavior, and recommended actions for the next 48 hours.`,
              })
            }
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Run full RCA of {view.entityName}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
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

"use client";

import { AllyChatFooter } from "@/components/shared/ally-chat-footer";
import type { InsightsMode } from "@/lib/insights-widgets";

type SkuRcaChatFooterProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  mode: InsightsMode;
  skuName: string;
};

/** SKU RCA chat — thin wrapper; copy changes with Live vs Historical. */
export function SkuRcaChatFooter({
  expanded,
  onExpandedChange,
  mode,
  skuName,
}: SkuRcaChatFooterProps) {
  const isLive = mode === "live";

  return (
    <AllyChatFooter
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      collapsedLabel={
        isLive
          ? `Ask AllyAI about ${skuName}…`
          : `Ask AllyAI about ${skuName} trends…`
      }
      inputPlaceholder={
        isLive
          ? "Ask a follow-up about this diagnosis…"
          : "Ask about historical trends, or describe a widget to add…"
      }
    />
  );
}

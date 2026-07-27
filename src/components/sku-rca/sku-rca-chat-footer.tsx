"use client";

import { AllyChatFooter } from "@/components/shared/ally-chat-footer";
import type { SkuRcaView } from "@/components/sku-rca/sku-rca-view-toggle";

type SkuRcaChatFooterProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  skuName: string;
  view: SkuRcaView;
};

export function SkuRcaChatFooter({
  expanded,
  onExpandedChange,
  skuName,
  view,
}: SkuRcaChatFooterProps) {
  const isInsights = view === "skuInsights";

  return (
    <AllyChatFooter
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      collapsedLabel={
        isInsights
          ? `Ask AllyAI about ${skuName} issue trends…`
          : `Ask AllyAI about ${skuName}…`
      }
      inputPlaceholder={
        isInsights
          ? "Ask about issue trends, or describe a widget to add…"
          : "Ask a follow-up about this diagnosis…"
      }
    />
  );
}

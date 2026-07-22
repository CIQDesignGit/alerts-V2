"use client";

import { AllyChatFooter } from "@/components/shared/ally-chat-footer";

type SkuRcaChatFooterProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  skuName: string;
};

/** SKU RCA chat — diagnosis follow-ups (Trends mode hidden for now). */
export function SkuRcaChatFooter({
  expanded,
  onExpandedChange,
  skuName,
}: SkuRcaChatFooterProps) {
  return (
    <AllyChatFooter
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      collapsedLabel={`Ask AllyAI about ${skuName}…`}
      inputPlaceholder="Ask a follow-up about this diagnosis…"
    />
  );
}

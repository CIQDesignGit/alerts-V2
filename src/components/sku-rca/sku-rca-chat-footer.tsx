"use client";

import { AllyChatFooter } from "@/components/shared/ally-chat-footer";

type SkuRcaChatFooterProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

/** SKU RCA chat — thin wrapper around the shared AllyAI footer. */
export function SkuRcaChatFooter({
  expanded,
  onExpandedChange,
}: SkuRcaChatFooterProps) {
  return (
    <AllyChatFooter
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      collapsedLabel="Ask AllyAI about this SKU…"
      inputPlaceholder="Ask a follow-up about this diagnosis…"
    />
  );
}

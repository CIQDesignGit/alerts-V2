"use client";

import { AllyChatFooter } from "@/components/shared/ally-chat-footer";

type SkuRcaChatFooterProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  skuName: string;
  seedPrompt?: { id: string; text: string };
  onSend?: (text: string) => void;
};

export function SkuRcaChatFooter({
  expanded,
  onExpandedChange,
  skuName,
  seedPrompt,
  onSend,
}: SkuRcaChatFooterProps) {
  return (
    <AllyChatFooter
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      seedPrompt={seedPrompt}
      onSend={onSend}
      collapsedLabel={`Ask AllyAI about ${skuName}…`}
      inputPlaceholder="Ask a follow-up about this diagnosis…"
    />
  );
}

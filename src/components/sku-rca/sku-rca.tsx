"use client";

import { useMemo, useState, type UIEvent } from "react";

import { SkuAllyChatThread } from "@/components/sku-rca/sku-ally-chat-thread";
import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { SkuRcaLivePanel } from "@/components/sku-rca/sku-rca-live-panel";
import { useSkuAllyThread } from "@/components/sku-rca/use-sku-ally-thread";
import { allyChatScrollPaddingClass } from "@/components/shared/ally-chat-footer";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

type SkuRcaProps = {
  sku: IssueSku;
  onClose: () => void;
};

const COLLAPSE_AT = 24;

/**
 * Alert SKU detail — live diagnosis only for now.
 * SKU Insights sub-tab is wired separately when we re-enable the toggle.
 */
export function SkuRca({ sku, onClose }: SkuRcaProps) {
  const data = useMemo(() => getSkuRcaData(sku), [sku]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    messages,
    promptSeed,
    chatExpanded,
    setChatExpanded,
    onPromptSelect,
    sendMessage,
  } = useSkuAllyThread(sku);

  function onBodyScroll(e: UIEvent<HTMLDivElement>) {
    setCollapsed(e.currentTarget.scrollTop > COLLAPSE_AT);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <SkuRcaHeader data={data} collapsed={collapsed} onClose={onClose} />

      <div
        onScroll={onBodyScroll}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-6 py-6",
          allyChatScrollPaddingClass(chatExpanded),
        )}
      >
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-8")}>
          <SkuRcaLivePanel
            data={data}
            sku={sku}
            onPromptSelect={onPromptSelect}
          />

          <SkuAllyChatThread messages={messages} />
        </div>
      </div>

      <SkuRcaChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        skuName={data.name}
        seedPrompt={promptSeed}
        onSend={sendMessage}
      />
    </div>
  );
}

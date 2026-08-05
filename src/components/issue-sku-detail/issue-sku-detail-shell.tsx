"use client";

import { useMemo, useState, type ReactNode, type UIEvent } from "react";

import type { IssueKey } from "@/components/alerts/issue-names";
import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { SkuRcaSuggestedPrompts } from "@/components/sku-rca/sku-rca-suggested-prompts";
import { allyChatScrollPaddingClass } from "@/components/shared/ally-chat-footer";
import type { AllyAiPrompt, IssueSku } from "@/lib/mock-alerts-insights";
import { getIssueSkuPrompts } from "@/lib/mock-issue-sku-detail";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

const COLLAPSE_AT = 24;

type IssueSkuDetailShellProps = {
  sku: IssueSku;
  issueKey: IssueKey;
  onClose: () => void;
  children: ReactNode;
};

/** Shared chrome for issue-aggregation SKU pages — header + body + prompts + chat. */
export function IssueSkuDetailShell({
  sku,
  issueKey,
  onClose,
  children,
}: IssueSkuDetailShellProps) {
  // Header identity (name, ASIN, gap) — same SKU fields as taxonomy, not the multi-issue body
  const headerData = useMemo(() => getSkuRcaData(sku), [sku]);
  const suggestedPrompts = useMemo(
    () => getIssueSkuPrompts(issueKey, sku),
    [issueKey, sku],
  );
  const [collapsed, setCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [promptSeed, setPromptSeed] = useState<
    { id: string; text: string } | undefined
  >();

  function onBodyScroll(e: UIEvent<HTMLDivElement>) {
    setCollapsed(e.currentTarget.scrollTop > COLLAPSE_AT);
  }

  function onPromptSelect(prompt: AllyAiPrompt) {
    setPromptSeed({ id: prompt.id, text: prompt.prompt });
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <SkuRcaHeader
        data={headerData}
        collapsed={collapsed}
        onClose={onClose}
        showScrapeHistory
      />

      <div
        onScroll={onBodyScroll}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-6 py-6",
          allyChatScrollPaddingClass(chatExpanded),
        )}
      >
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-6")}>
          {children}

          <SkuRcaSuggestedPrompts
            prompts={suggestedPrompts}
            onSelect={onPromptSelect}
          />
        </div>
      </div>

      <SkuRcaChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        skuName={headerData.name}
        seedPrompt={promptSeed}
      />
    </div>
  );
}

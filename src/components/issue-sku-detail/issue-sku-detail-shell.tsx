"use client";

import { useMemo, useState, type ReactNode, type UIEvent } from "react";

import type { IssueKey } from "@/components/alerts/issue-names";
import { SkuAllyChatThread } from "@/components/sku-rca/sku-ally-chat-thread";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { SkuRcaSuggestedPrompts } from "@/components/sku-rca/sku-rca-suggested-prompts";
import { useSkuAllyThread } from "@/components/sku-rca/use-sku-ally-thread";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getIssueSkuPrompts } from "@/lib/mock-issue-sku-detail";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

const COLLAPSE_AT = 24;
/** Stay collapsed until scrolled nearly back to top — avoids threshold flicker */
const EXPAND_AT = 8;

type IssueSkuDetailShellProps = {
  sku: IssueSku;
  issueKey: IssueKey;
  onClose: () => void;
  children: ReactNode;
};

/** Shared chrome for issue-aggregation SKU pages — header + body + prompts + thread. */
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
  // Pass issueKey so the “changed in 7 days” chip can open the right trend card
  const { messages, onPromptSelect } = useSkuAllyThread(sku, { issueKey });

  function onBodyScroll(e: UIEvent<HTMLDivElement>) {
    const top = e.currentTarget.scrollTop;
    setCollapsed((wasCollapsed) =>
      wasCollapsed ? top > EXPAND_AT : top > COLLAPSE_AT,
    );
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
        className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
      >
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-6")}>
          {children}

          <SkuRcaSuggestedPrompts
            prompts={suggestedPrompts}
            onSelect={onPromptSelect}
          />

          <SkuAllyChatThread messages={messages} />
        </div>
      </div>
    </div>
  );
}

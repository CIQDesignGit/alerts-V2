"use client";

import { useMemo, useState, type ReactNode, type UIEvent } from "react";

import { SkuRcaChatFooter } from "@/components/sku-rca/sku-rca-chat-footer";
import {
  SkuRcaHeader,
  SKU_RCA_CONTENT_WIDTH,
} from "@/components/sku-rca/sku-rca-header";
import { allyChatScrollPaddingClass } from "@/components/shared/ally-chat-footer";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getSkuRcaData } from "@/lib/mock-sku-rca";
import { cn } from "@/lib/utils";

const COLLAPSE_AT = 24;

type IssueSkuDetailShellProps = {
  sku: IssueSku;
  onClose: () => void;
  children: ReactNode;
};

/** Shared chrome for issue-aggregation SKU pages — header + chat footer. */
export function IssueSkuDetailShell({
  sku,
  onClose,
  children,
}: IssueSkuDetailShellProps) {
  const headerData = useMemo(() => getSkuRcaData(sku), [sku]);
  const [collapsed, setCollapsed] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);

  function onBodyScroll(e: UIEvent<HTMLDivElement>) {
    setCollapsed(e.currentTarget.scrollTop > COLLAPSE_AT);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <SkuRcaHeader data={headerData} collapsed={collapsed} onClose={onClose} />

      <div
        onScroll={onBodyScroll}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-6 py-6",
          allyChatScrollPaddingClass(chatExpanded),
        )}
      >
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-6")}>
          {children}
        </div>
      </div>

      <SkuRcaChatFooter
        expanded={chatExpanded}
        onExpandedChange={setChatExpanded}
        skuName={headerData.name}
      />
    </div>
  );
}

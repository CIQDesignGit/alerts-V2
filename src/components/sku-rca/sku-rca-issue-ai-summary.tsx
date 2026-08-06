"use client";

import { AllyAiSurface } from "@/components/alerts-insights/ally-ai-surface";
import { cn } from "@/lib/utils";

type SkuRcaIssueAiSummaryProps = {
  summary: string;
  variant?: "live" | "historical";
};

/** Compact AllyAI narrative — purple for live/current week, grey for last week. */
export function SkuRcaIssueAiSummary({
  summary,
  variant = "live",
}: SkuRcaIssueAiSummaryProps) {
  const isHistorical = variant === "historical";

  return (
    <AllyAiSurface
      tone={isHistorical ? "muted" : "brand"}
      className={cn(
        "rounded-none border-x-0 border-t-0 shadow-none",
        isHistorical
          ? "border-b border-neutral-200/70"
          : "border-b border-brand-200/50",
      )}
      contentClassName="px-4 py-3"
    >
      <p className="text-sm leading-relaxed text-neutral-800">{summary}</p>
    </AllyAiSurface>
  );
}

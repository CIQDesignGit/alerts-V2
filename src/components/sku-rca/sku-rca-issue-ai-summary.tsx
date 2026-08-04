"use client";

import { AllyAiSurface } from "@/components/alerts-insights/ally-ai-surface";
import { cn } from "@/lib/utils";

type SkuRcaIssueAiSummaryProps = {
  summary: string;
  variant?: "live" | "historical";
};

/** Compact AllyAI narrative — same gradient shell as Key insights. */
export function SkuRcaIssueAiSummary({
  summary,
  variant = "live",
}: SkuRcaIssueAiSummaryProps) {
  return (
    <AllyAiSurface
      className={cn(
        "rounded-none border-x-0 border-t-0 shadow-none",
        variant === "live" ? "border-b border-brand-200/50" : "border-b border-brand-200/40",
      )}
      contentClassName="px-4 py-3"
    >
      <p className="text-sm leading-relaxed text-neutral-800">{summary}</p>
    </AllyAiSurface>
  );
}

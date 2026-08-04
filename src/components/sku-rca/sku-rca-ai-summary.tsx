"use client";

import {
  AllyAiHeader,
  AllyAiSurface,
} from "@/components/alerts-insights/ally-ai-surface";

type SkuRcaAiSummaryProps = {
  headline: string;
};

/** AllyAI diagnosis narrative — one summary block at the top of SKU detail. */
export function SkuRcaAiSummary({ headline }: SkuRcaAiSummaryProps) {
  return (
    <AllyAiSurface contentClassName="p-4">
      <AllyAiHeader label="AllyAI Diagnosis" />
      <p className="mt-3 text-sm leading-relaxed text-neutral-800">{headline}</p>
    </AllyAiSurface>
  );
}

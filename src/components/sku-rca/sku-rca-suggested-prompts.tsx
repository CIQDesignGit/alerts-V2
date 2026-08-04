"use client";

import {
  SuggestedAiPrompts,
  SUGGESTED_PROMPTS_HEADING,
} from "@/components/alerts-insights/suggested-ai-prompts";
import type { AllyAiPrompt } from "@/lib/mock-alerts-insights";

export { SUGGESTED_PROMPTS_HEADING };

type SkuRcaSuggestedPromptsProps = {
  prompts: AllyAiPrompt[];
  onSelect?: (prompt: AllyAiPrompt) => void;
};

/** SKU RCA — same suggested-question chips as Alerts insight panels. */
export function SkuRcaSuggestedPrompts(props: SkuRcaSuggestedPromptsProps) {
  return <SuggestedAiPrompts {...props} />;
}

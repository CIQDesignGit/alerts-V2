"use client";

import { Sparkles } from "lucide-react";

import type { AllyAiPrompt } from "@/lib/mock-alerts-insights";

/** Shared section label for AllyAI prompt chips across Alerts + RCA surfaces */
export const SUGGESTED_PROMPTS_HEADING = "Explore more";

type SuggestedAiPromptsProps = {
  prompts: AllyAiPrompt[];
  onSelect?: (prompt: AllyAiPrompt) => void;
  /** Override the default section heading when context needs a tighter label */
  heading?: string;
};

/** Clickable AllyAI prompt chips — send into the in-page thread when selected. */
export function SuggestedAiPrompts({
  prompts,
  onSelect,
  heading = SUGGESTED_PROMPTS_HEADING,
}: SuggestedAiPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="space-y-2 pb-4 pt-1">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-brand-600" aria-hidden />
        <p className="text-xs font-medium text-muted-foreground">{heading}</p>
      </div>
      <ul className="m-0 flex list-none flex-row flex-wrap gap-2 p-0">
        {prompts.map((item) => {
          const isPrimary = item.variant === "primary";

          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                title={item.prompt}
                className={
                  isPrimary
                    ? "inline-flex items-center rounded-full border border-brand-200/80 bg-brand-50/60 px-3 py-1.5 text-left text-xs leading-snug whitespace-nowrap font-medium text-neutral-800 transition-colors hover:border-brand-400 hover:bg-brand-50"
                    : "inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs leading-snug whitespace-nowrap text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-foreground"
                }
              >
                <span className="min-w-0">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

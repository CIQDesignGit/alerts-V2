"use client";

import { ArrowRight, Search } from "lucide-react";

import type { AllyAiPrompt } from "@/lib/mock-alerts-insights";

type SuggestedAiPromptsProps = {
  prompts: AllyAiPrompt[];
  onSelect?: (prompt: AllyAiPrompt) => void;
};

/** Clickable AllyAI prompt chips — invites the user to dig deeper. */
export function SuggestedAiPrompts({
  prompts,
  onSelect,
}: SuggestedAiPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-1.5">
        <Search className="size-3.5 text-brand-600" aria-hidden />
        <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
          Analyze further
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {prompts.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              title={item.prompt}
              className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-brand-200/80 bg-brand-50/40 px-3 py-1.5 text-left text-xs leading-snug text-neutral-800 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="min-w-0">{item.label}</span>
              <ArrowRight
                className="size-3 shrink-0 text-brand-500 opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

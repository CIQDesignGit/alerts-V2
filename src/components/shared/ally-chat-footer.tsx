"use client";

import { ArrowUp, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AllyChatFooterProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** Collapsed pill label */
  collapsedLabel: string;
  /** Expanded textarea placeholder */
  inputPlaceholder: string;
  /** Pre-fill the input and expand when a suggested prompt is selected */
  seedPrompt?: { id: string; text: string };
};

/** Short, input-style placeholder — "Ask AllyAI about X" → "Ask Ally about X…" */
function formatCollapsedPlaceholder(label: string) {
  return label.replace(/Ask AllyAI/i, "Ask Ally").replace(/…$/, "").trim() + "…";
}

/** Floating AllyAI chat — bottom-right input pill when collapsed, compact composer when open. */
export function AllyChatFooter({
  expanded,
  onExpandedChange,
  collapsedLabel,
  inputPlaceholder,
  seedPrompt,
}: AllyChatFooterProps) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!seedPrompt) return;
    setDraft(seedPrompt.text);
    onExpandedChange(true);
  }, [seedPrompt?.id, seedPrompt?.text, onExpandedChange]);

  const placeholder = formatCollapsedPlaceholder(collapsedLabel);

  if (!expanded) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-end px-5 pb-5">
        <button
          type="button"
          onClick={() => onExpandedChange(true)}
          aria-label={collapsedLabel}
          className={cn(
            "pointer-events-auto group flex h-12 w-[min(100%,17.5rem)] items-center gap-2 rounded-full",
            "border border-border bg-background pl-1.5 pr-2 shadow-md",
            "transition-[box-shadow,border-color] hover:border-neutral-300 hover:shadow-lg",
          )}
        >
          <span className="flex size-9 shrink-0 overflow-hidden rounded-full">
            <img
              src="/ally-avatar.png"
              alt=""
              className="size-full object-cover"
            />
          </span>
          <span className="min-w-0 flex-1 truncate text-left text-sm text-muted-foreground group-hover:text-foreground">
            {placeholder}
          </span>
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              "bg-neutral-100 text-neutral-500 transition-colors",
              "group-hover:bg-neutral-900 group-hover:text-white",
            )}
            aria-hidden
          >
            <ArrowUp className="size-4" strokeWidth={2.25} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-end px-5 pb-5">
      <div
        className={cn(
          "pointer-events-auto w-[min(100%,20rem)] overflow-hidden rounded-2xl",
          "border border-border bg-background shadow-xl",
        )}
      >
        <div className="flex items-start gap-2 p-2.5">
          <span className="mt-1 flex size-8 shrink-0 overflow-hidden rounded-full">
            <img
              src="/ally-avatar.png"
              alt=""
              className="size-full object-cover"
            />
          </span>

          <div className="min-w-0 flex-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              autoFocus
              placeholder={inputPlaceholder}
              className={cn(
                "max-h-32 min-h-[4.5rem] w-full resize-none bg-transparent px-0.5 py-1 text-sm leading-relaxed text-foreground",
                "placeholder:text-muted-foreground focus-visible:outline-none",
              )}
            />
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-2xs text-muted-foreground">Powered by AllyAI</p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Collapse chat"
                  className="text-muted-foreground"
                  onClick={() => onExpandedChange(false)}
                >
                  <X className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  aria-label="Send"
                  disabled={!draft.trim()}
                  className="rounded-full"
                >
                  <ArrowUp className="size-4" strokeWidth={2.25} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

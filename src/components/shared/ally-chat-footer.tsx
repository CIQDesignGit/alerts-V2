"use client";

import { Send } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";

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
  /** Called when the user sends a message (Send button or Enter) */
  onSend?: (text: string) => void;
};

/** Short, input-style placeholder — "Ask AllyAI about X" → "Ask Ally about X…" */
function formatCollapsedPlaceholder(label: string) {
  return label.replace(/Ask AllyAI/i, "Ask Ally").replace(/…$/, "").trim() + "…";
}

/** Gap between the chat bar and the bottom edge of the panel */
const ALLY_CHAT_BOTTOM_OFFSET = "pb-6";

/** Bottom padding for scroll areas above the floating Ally chat bar */
export function allyChatScrollPaddingClass(expanded: boolean) {
  return expanded ? "pb-56" : "pb-40";
}

function SendButton({
  disabled,
  onClick,
  size = "md",
}: {
  disabled?: boolean;
  onClick?: () => void;
  size?: "md" | "sm";
}) {
  return (
    <button
      type="button"
      aria-label="Send"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors",
        "hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40",
        size === "md" ? "size-9" : "size-8",
      )}
    >
      <Send
        className={cn(size === "md" ? "size-4" : "size-3.5")}
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}

/** Floating AllyAI chat — centered input bar with brand send control. */
export function AllyChatFooter({
  expanded,
  onExpandedChange,
  collapsedLabel,
  inputPlaceholder,
  seedPrompt,
  onSend,
}: AllyChatFooterProps) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!seedPrompt) return;
    setDraft(seedPrompt.text);
    onExpandedChange(true);
  }, [seedPrompt?.id, seedPrompt?.text, onExpandedChange]);

  function submit() {
    const text = draft.trim();
    if (!text) return;
    onSend?.(text);
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter adds a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const placeholder = formatCollapsedPlaceholder(collapsedLabel);

  if (!expanded) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-6",
          ALLY_CHAT_BOTTOM_OFFSET,
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex h-12 w-full max-w-[700px] items-center gap-2 rounded-full",
            "border border-border bg-background pl-1.5 pr-2 shadow-md",
          )}
        >
          <button
            type="button"
            onClick={() => onExpandedChange(true)}
            aria-label={collapsedLabel}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <span className="flex size-9 shrink-0 overflow-hidden rounded-full">
              <img
                src="/ally-avatar.png"
                alt=""
                className="size-full object-cover"
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
              {placeholder}
            </span>
          </button>
          <SendButton onClick={() => onExpandedChange(true)} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-6",
        ALLY_CHAT_BOTTOM_OFFSET,
      )}
    >
      <div
        className={cn(
          "pointer-events-auto w-full max-w-[700px] overflow-hidden rounded-2xl",
          "border border-border bg-background shadow-xl",
        )}
      >
        <div className="flex items-end gap-2 p-2.5">
          <span className="mb-1 flex size-8 shrink-0 overflow-hidden rounded-full">
            <img
              src="/ally-avatar.png"
              alt=""
              className="size-full object-cover"
            />
          </span>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            autoFocus
            placeholder={inputPlaceholder}
            className={cn(
              "max-h-32 min-h-[2.75rem] min-w-0 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm leading-relaxed text-foreground",
              "placeholder:text-muted-foreground focus-visible:outline-none",
            )}
          />

          <div className="mb-0.5 flex shrink-0 items-center">
            <SendButton
              disabled={!draft.trim()}
              size="sm"
              onClick={submit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

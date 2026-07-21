"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SkuRcaChatFooterProps = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

export function SkuRcaChatFooter({
  expanded,
  onExpandedChange,
}: SkuRcaChatFooterProps) {
  const [draft, setDraft] = useState("");

  if (!expanded) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4">
        <button
          type="button"
          onClick={() => onExpandedChange(true)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground shadow-lg hover:border-primary hover:text-foreground"
        >
          <MessageCircle className="size-4 text-primary" />
          Ask AllyAI about this SKU…
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-background px-4 py-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">Ask AllyAI</p>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Collapse chat"
          onClick={() => onExpandedChange(false)}
        >
          <X className="size-3.5" />
        </Button>
      </div>
      <div className="flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Ask a follow-up about this diagnosis…"
          className={cn(
            "min-h-16 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          )}
        />
        <Button
          type="button"
          size="icon"
          aria-label="Send"
          disabled={!draft.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}

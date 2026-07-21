"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SkuRcaFeedback() {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <section className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
      <p className="text-sm text-muted-foreground">Was this helpful?</p>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Thumbs up"
          aria-pressed={vote === "up"}
          onClick={() => setVote("up")}
          className={cn(vote === "up" && "bg-success-100 text-success-700")}
        >
          <ThumbsUp className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Thumbs down"
          aria-pressed={vote === "down"}
          onClick={() => setVote("down")}
          className={cn(vote === "down" && "bg-error-100 text-error-700")}
        >
          <ThumbsDown className="size-4" />
        </Button>
      </div>
    </section>
  );
}

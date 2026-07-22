"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn, controlFocusClass, fieldFocusClass } from "@/lib/utils";

type Vote = "up" | "down";

/** Quick reasons after thumbs up */
const POSITIVE_CHIPS = [
  "Accurate diagnosis",
  "Clear next steps",
  "Actionable recommendations",
  "Right SKU context",
  "Saved me time",
] as const;

/** Quick reasons after thumbs down */
const NEGATIVE_CHIPS = [
  "Wrong root cause",
  "Missing context",
  "Unclear actions",
  "Outdated data",
  "Not relevant",
] as const;

type SkuRcaFeedbackProps = {
  /** ASIN (or similar) so feedback resets when the SKU changes */
  feedbackKey: string;
};

/**
 * SKU-level diagnosis feedback — thumbs + quick chips + optional note.
 */
export function SkuRcaFeedback({ feedbackKey }: SkuRcaFeedbackProps) {
  const [vote, setVote] = useState<Vote | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setVote(null);
    setChips([]);
    setNote("");
    setSubmitted(false);
  }, [feedbackKey]);

  const chipOptions = vote === "up" ? POSITIVE_CHIPS : NEGATIVE_CHIPS;

  function onVote(next: Vote) {
    if (vote === next) {
      setVote(null);
      setChips([]);
      setNote("");
      setSubmitted(false);
      return;
    }
    setVote(next);
    setChips([]);
    setNote("");
    setSubmitted(false);
  }

  function toggleChip(label: string) {
    setChips((prev) =>
      prev.includes(label)
        ? prev.filter((c) => c !== label)
        : [...prev, label],
    );
  }

  function onSubmit() {
    console.log("SKU feedback", {
      key: feedbackKey,
      vote,
      chips,
      note: note.trim() || undefined,
    });
    setSubmitted(true);
  }

  function onSkip() {
    console.log("SKU feedback", { key: feedbackKey, vote, chips });
    setSubmitted(true);
  }

  return (
    <section className="rounded-xl border border-border bg-neutral-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {submitted ? "Thanks for the feedback" : "Was this diagnosis useful?"}
          </p>
          {!submitted && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Helps AllyAI improve RCA for this SKU
            </p>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Thumbs up — useful"
            aria-pressed={vote === "up"}
            disabled={submitted}
            onClick={() => onVote("up")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-neutral-100 hover:text-foreground disabled:opacity-60",
              controlFocusClass,
              vote === "up" &&
                "bg-success-100 text-success-700 hover:bg-success-100",
            )}
          >
            <ThumbsUp className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Thumbs down — not useful"
            aria-pressed={vote === "down"}
            disabled={submitted}
            onClick={() => onVote("down")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-neutral-100 hover:text-foreground disabled:opacity-60",
              controlFocusClass,
              vote === "down" &&
                "bg-error-100 text-error-700 hover:bg-error-100",
            )}
          >
            <ThumbsDown className="size-4" />
          </button>
        </div>
      </div>

      {vote && !submitted && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          <div>
            <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
              {vote === "up" ? "What worked?" : "What missed?"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chipOptions.map((label) => {
                const selected = chips.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleChip(label)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      controlFocusClass,
                      selected
                        ? vote === "up"
                          ? "border-success-600 bg-success-100 text-success-700"
                          : "border-error-600 bg-error-100 text-error-700"
                        : "border-border bg-background text-neutral-700 hover:border-neutral-300",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="sr-only">Optional feedback note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={
                vote === "up"
                  ? "Anything else that helped? (optional)"
                  : "Anything else we should fix? (optional)"
              }
              className={cn(
                "w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
                fieldFocusClass,
              )}
            />
          </label>

          <div className="flex items-center justify-end gap-1.5">
            <Button type="button" variant="ghost" size="sm" onClick={onSkip}>
              Skip
            </Button>
            <Button type="button" size="sm" onClick={onSubmit}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

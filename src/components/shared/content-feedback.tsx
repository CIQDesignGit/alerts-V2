"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  collectFeedback,
  type FeedbackSurface,
  type FeedbackVote,
} from "@/lib/feedback-store";
import { cn, controlFocusClass, fieldFocusClass } from "@/lib/utils";

const DEFAULT_POSITIVE_CHIPS = [
  "Accurate summary",
  "Clear priorities",
  "Useful $ impact",
  "Good context",
  "Saved me time",
] as const;

const DEFAULT_NEGATIVE_CHIPS = [
  "Wrong root cause",
  "Missing context",
  "Unclear actions",
  "Numbers seem off",
  "Not relevant",
] as const;

type ContentFeedbackProps = {
  feedbackKey: string;
  surface: FeedbackSurface;
  contextLabel?: string;
  title?: string;
  subtitle?: string;
  positiveChips?: readonly string[];
  negativeChips?: readonly string[];
  /** Inline row — question + bordered thumb buttons (no card chrome) */
  variant?: "default" | "subtle";
  className?: string;
};

/**
 * Thumbs + quick-reason chips + optional note.
 * Submissions are collected via `collectFeedback` (localStorage in prototype).
 */
export function ContentFeedback({
  feedbackKey,
  surface,
  contextLabel,
  title = "Was this useful?",
  subtitle = "Helps AllyAI improve insights for your team",
  positiveChips = DEFAULT_POSITIVE_CHIPS,
  negativeChips = DEFAULT_NEGATIVE_CHIPS,
  variant = "default",
  className,
}: ContentFeedbackProps) {
  const [vote, setVote] = useState<FeedbackVote | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setVote(null);
    setChips([]);
    setNote("");
    setSubmitted(false);
  }, [feedbackKey, surface]);

  const chipOptions = vote === "up" ? positiveChips : negativeChips;

  function onVote(next: FeedbackVote) {
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

  function persist(includeNote: boolean) {
    if (!vote) return;

    collectFeedback({
      surface,
      contextKey: feedbackKey,
      contextLabel,
      vote,
      chips,
      note: includeNote && note.trim() ? note.trim() : undefined,
    });
    setSubmitted(true);
  }

  const isSubtle = variant === "subtle";

  return (
    <section
      className={cn(
        isSubtle
          ? "py-0.5"
          : "rounded-xl border border-border bg-neutral-50/60 p-4",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-3",
          isSubtle ? "ml-auto w-fit" : "justify-between",
        )}
      >
        <div className={cn(isSubtle ? "w-fit shrink-0" : undefined)}>
          <p
            className={cn(
              isSubtle
                ? "w-fit text-sm text-muted-foreground"
                : "text-sm font-semibold text-foreground",
            )}
          >
            {submitted ? "Thanks for the feedback" : title}
          </p>
          {!submitted && !isSubtle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Thumbs up — useful"
            aria-pressed={vote === "up"}
            disabled={submitted}
            onClick={() => onVote("up")}
            className={cn(
              "flex size-9 items-center justify-center text-muted-foreground transition-colors disabled:opacity-60",
              controlFocusClass,
              isSubtle
                ? cn(
                    "size-8 rounded-md hover:bg-neutral-100 hover:text-foreground",
                    vote === "up" &&
                      "bg-success-100 text-success-700 hover:bg-success-100",
                  )
                : cn(
                    "size-8 rounded-md hover:bg-neutral-100 hover:text-foreground",
                    vote === "up" &&
                      "bg-success-100 text-success-700 hover:bg-success-100",
                  ),
            )}
          >
            <ThumbsUp className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Thumbs down — not useful"
            aria-pressed={vote === "down"}
            disabled={submitted}
            onClick={() => onVote("down")}
            className={cn(
              "flex size-9 items-center justify-center text-muted-foreground transition-colors disabled:opacity-60",
              controlFocusClass,
              isSubtle
                ? cn(
                    "size-8 rounded-md hover:bg-neutral-100 hover:text-foreground",
                    vote === "down" &&
                      "bg-error-100 text-error-700 hover:bg-error-100",
                  )
                : cn(
                    "size-8 rounded-md hover:bg-neutral-100 hover:text-foreground",
                    vote === "down" &&
                      "bg-error-100 text-error-700 hover:bg-error-100",
                  ),
            )}
          >
            <ThumbsDown className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {vote && !submitted && (
        <div
          className={cn(
            "mt-3 space-y-3",
            !isSubtle && "border-t border-border pt-3",
          )}
        >
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
            <Button type="button" variant="ghost" size="sm" onClick={() => persist(false)}>
              Skip
            </Button>
            <Button type="button" size="sm" onClick={() => persist(true)}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

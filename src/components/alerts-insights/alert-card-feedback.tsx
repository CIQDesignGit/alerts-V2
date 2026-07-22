"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, controlFocusClass, fieldFocusClass } from "@/lib/utils";

type Vote = "up" | "down";

type AlertCardFeedbackProps = {
  /** Unique key so each alert keeps its own vote (e.g. issueKey) */
  feedbackKey: string;
  /** Title block shown on the left of the same row as the thumbs */
  children: ReactNode;
};

/**
 * Header-row feedback: title on the left, thumbs on the right.
 * Resets when feedbackKey changes; thumbs can be toggled / changed anytime.
 */
export function AlertCardFeedback({
  feedbackKey,
  children,
}: AlertCardFeedbackProps) {
  const [vote, setVote] = useState<Vote | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [askingNote, setAskingNote] = useState(false);

  // Fresh slate whenever the NAM opens a different alert
  useEffect(() => {
    setVote(null);
    setNote("");
    setSubmitted(false);
    setAskingNote(false);
  }, [feedbackKey]);

  function onVote(next: Vote) {
    // Clicking the same thumb again clears the vote
    if (vote === next) {
      setVote(null);
      setNote("");
      setSubmitted(false);
      setAskingNote(false);
      return;
    }
    // Switching to the other thumb (or voting after "Thanks!")
    setVote(next);
    setSubmitted(false);
    setAskingNote(true);
  }

  function onSubmit() {
    console.log("Alert feedback", {
      key: feedbackKey,
      vote,
      note: note.trim() || undefined,
    });
    setSubmitted(true);
    setAskingNote(false);
  }

  function onSkip() {
    console.log("Alert feedback", { key: feedbackKey, vote });
    setSubmitted(true);
    setAskingNote(false);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">{children}</div>

      {/* Thumbs stay in-flow; note floats over content below */}
      <div className="relative shrink-0">
        <div className="flex items-center gap-2">
          <p className="hidden text-xs text-muted-foreground sm:block">
            {submitted ? "Thanks!" : "Useful?"}
          </p>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Thumbs up — useful"
              aria-pressed={vote === "up"}
              onClick={() => onVote("up")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-neutral-100 hover:text-foreground",
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
              onClick={() => onVote("down")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-neutral-100 hover:text-foreground",
                controlFocusClass,
                vote === "down" &&
                  "bg-error-100 text-error-700 hover:bg-error-100",
              )}
            >
              <ThumbsDown className="size-4" />
            </button>
          </div>
        </div>

        {askingNote && !submitted && (
          <div
            className={cn(
              "absolute top-full right-0 z-20 mt-2 w-[450px]",
              "space-y-2 rounded-lg border border-border bg-background p-3 shadow-lg",
            )}
          >
            <label className="block">
              <span className="sr-only">Optional feedback note</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder={
                  vote === "up"
                    ? "What helped? (optional)"
                    : "What was wrong or missing? (optional)"
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
      </div>
    </div>
  );
}

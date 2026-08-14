"use client";

import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useState } from "react";

import type { AllyProcessingStep } from "@/lib/ally-processing-steps";
import { cn } from "@/lib/utils";

type AllyProcessingTrailProps = {
  steps: AllyProcessingStep[];
  /** Index of the step currently running (0-based). Ignored when status is done. */
  activeIndex: number;
  /** running = live stream; done = all steps finished, trail can collapse above the report */
  status: "running" | "done";
};

/**
 * Gap to Plan processing trail.
 * Live: only the current step title (unless user expands all).
 * Done: collapsed summary, expandable to the full list + per-step details.
 * Show / Hide toggle stays in one fixed spot so the cursor doesn’t jump.
 */
export function AllyProcessingTrail({
  steps,
  activeIndex,
  status,
}: AllyProcessingTrailProps) {
  const [showAll, setShowAll] = useState(false);
  const [openStepIds, setOpenStepIds] = useState<string[]>([]);

  const isDone = status === "done";
  const safeIndex = Math.min(Math.max(activeIndex, 0), steps.length - 1);
  const current = steps[safeIndex];

  function toggleStepDetail(id: string) {
    setOpenStepIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const toggleLabel = showAll
    ? "Hide steps"
    : isDone
      ? "View steps"
      : "Show all steps";

  return (
    <div
      className="flex flex-col gap-2"
      role="status"
      aria-live="polite"
      aria-label={
        isDone
          ? "Gap to Plan analysis complete"
          : current
            ? `AllyAI is working: ${current.label}`
            : "AllyAI is working"
      }
    >
      {/* Fixed meta row — toggle never moves between Show / Hide */}
      <div className="flex items-start gap-2">
        {isDone ? (
          <Check className="mt-0.5 size-3.5 shrink-0 text-success-600" aria-hidden />
        ) : (
          <LoaderCircle
            className="mt-0.5 size-3.5 shrink-0 animate-spin text-brand-500"
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            {isDone ? (
              <span>Analyzed in {steps.length} steps</span>
            ) : (
              <span>
                Processing your request
                <span className="mx-1 text-neutral-300" aria-hidden>
                  ·
                </span>
                Step {safeIndex + 1} of {steps.length}
              </span>
            )}
            <span className="mx-1 text-neutral-300" aria-hidden>
              ·
            </span>
            <button
              type="button"
              onClick={() => setShowAll((open) => !open)}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {toggleLabel}
            </button>
          </p>

          {/* Live compact: only the step title animates on change */}
          {!isDone && !showAll && current ? (
            <div className="mt-1 overflow-hidden">
              <p
                key={current.id}
                className="animate-in fade-in slide-in-from-bottom-1 duration-300 fill-mode-both text-sm text-neutral-700"
              >
                {current.label}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Expanded step list */}
      {showAll ? (
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {steps.map((step, index) => {
            const done = isDone || index < safeIndex;
            const active = !isDone && index === safeIndex;
            const upcoming = !isDone && index > safeIndex;
            const detailOpen = openStepIds.includes(step.id);
            const canOpenDetail = done || active;

            return (
              <li key={step.id}>
                <div
                  className={cn(
                    "rounded-md transition-colors duration-300",
                    active && "bg-brand-50/50",
                  )}
                >
                  <button
                    type="button"
                    disabled={!canOpenDetail}
                    onClick={() => canOpenDetail && toggleStepDetail(step.id)}
                    className={cn(
                      "flex w-full items-center gap-2 px-1.5 py-1.5 text-left transition-colors duration-300",
                      canOpenDetail
                        ? "cursor-pointer hover:bg-neutral-50"
                        : "cursor-default",
                    )}
                    aria-expanded={canOpenDetail ? detailOpen : undefined}
                  >
                    <StepStatusIcon done={done} active={active} />
                    {/* Title + chevron stay side-by-side (title is fit-content, not full width) */}
                    <span className="inline-flex min-w-0 max-w-full items-center gap-1">
                      <span
                        className={cn(
                          "text-sm transition-colors duration-300",
                          upcoming && "text-neutral-400",
                          active && "font-medium text-neutral-800",
                          done && "text-neutral-600",
                        )}
                      >
                        {step.label}
                      </span>
                      {canOpenDetail ? (
                        <ChevronDown
                          className={cn(
                            "size-3.5 shrink-0 text-neutral-400 transition-transform duration-200",
                            detailOpen && "rotate-180",
                          )}
                          aria-hidden
                        />
                      ) : null}
                    </span>
                  </button>

                  {detailOpen && canOpenDetail ? (
                    <p className="animate-in fade-in slide-in-from-top-1 duration-200 fill-mode-both border-l border-neutral-200 py-1 pr-2 pl-7 text-xs leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function StepStatusIcon({
  done,
  active,
}: {
  done: boolean;
  active: boolean;
}) {
  if (done) {
    return (
      <span
        key="done"
        className="flex size-4 shrink-0 animate-in fade-in zoom-in-75 duration-200 fill-mode-both items-center justify-center rounded-full bg-success-100 text-success-700"
      >
        <Check className="size-2.5 stroke-3" aria-hidden />
      </span>
    );
  }

  if (active) {
    return (
      <LoaderCircle
        key="active"
        className="size-4 shrink-0 animate-spin text-brand-500"
        aria-hidden
      />
    );
  }

  return (
    <span
      className="size-4 shrink-0 rounded-full border border-neutral-300 transition-colors duration-300"
      aria-hidden
    />
  );
}

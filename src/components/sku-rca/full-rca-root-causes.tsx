"use client";

import { ChevronDown, MessageSquareText } from "lucide-react";
import { useState } from "react";

import type {
  FullRcaCauseStatus,
  FullRcaRootCause,
} from "@/lib/mock-full-rca-report";
import { cn } from "@/lib/utils";

type FullRcaRootCausesProps = {
  causes: FullRcaRootCause[];
};

const STATUS_LABEL: Record<FullRcaCauseStatus, string> = {
  "still-an-issue": "Still an Issue",
  resolved: "Resolved",
};

/**
 * Top Issues list — nested cards with expand/collapse
 * (matches the Gap to Plan “Top Issues” reference; brand-agnostic copy).
 */
export function FullRcaRootCausesList({ causes }: FullRcaRootCausesProps) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 px-4 py-4">
      {causes.map((cause, index) => (
        <li key={cause.id}>
          <TopIssueCard cause={cause} defaultOpen={index < 2} />
        </li>
      ))}
    </ul>
  );
}

function TopIssueCard({
  cause,
  defaultOpen,
}: {
  cause: FullRcaRootCause;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isStillAnIssue = cause.status === "still-an-issue";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-start gap-2.5 border-l-2 px-3 py-3 text-left transition-colors",
          "hover:bg-neutral-50/80",
          open
            ? "border-l-brand-500 bg-brand-50/20"
            : "border-l-transparent",
        )}
      >
        <MessageSquareText
          className="mt-0.5 size-4 shrink-0 text-brand-500"
          aria-hidden
        />

        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-neutral-700">
          {cause.title}
        </span>

        <span
          className={cn(
            "mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-2xs font-semibold tracking-wide",
            isStillAnIssue
              ? "bg-error-50 text-error-700"
              : "bg-success-50 text-success-700",
          )}
        >
          {STATUS_LABEL[cause.status]}
        </span>

        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-foreground",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-border bg-neutral-50/70 px-3 py-3 pl-10">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {cause.body}
          </p>
        </div>
      ) : null}
    </div>
  );
}

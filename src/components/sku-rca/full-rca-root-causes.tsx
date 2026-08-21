"use client";

import { ChevronDown, MessageSquareText } from "lucide-react";
import { useState } from "react";

import type { FullRcaRootCause } from "@/lib/mock-full-rca-report";
import { cn } from "@/lib/utils";

type FullRcaRootCausesProps = {
  causes: FullRcaRootCause[];
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

        {cause.badge === "worth-watching" ? (
          <span className="mt-0.5 inline-flex shrink-0 rounded-full border border-warning-600/35 bg-warning-50 px-2 py-0.5 text-2xs font-semibold tracking-wide text-warning-700 uppercase">
            Worth Watching
          </span>
        ) : null}

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

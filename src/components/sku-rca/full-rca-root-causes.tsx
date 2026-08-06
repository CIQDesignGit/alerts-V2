"use client";

import { ChevronDown, Megaphone, ShoppingCart, Tag } from "lucide-react";
import { useState } from "react";

import { FullRcaCalloutBox } from "@/components/sku-rca/full-rca-callout";
import { FullRcaDataTable } from "@/components/sku-rca/full-rca-data-table";
import type { FullRcaRootCause } from "@/lib/mock-full-rca-report";
import { cn } from "@/lib/utils";

const ICONS = {
  megaphone: Megaphone,
  tag: Tag,
  cart: ShoppingCart,
} as const;

type FullRcaRootCausesProps = {
  causes: FullRcaRootCause[];
};

/** Nested causes — same header/body seam as parent sections. */
export function FullRcaRootCausesList({ causes }: FullRcaRootCausesProps) {
  return (
    <ul className="m-0 list-none divide-y divide-border overflow-hidden rounded-md bg-background p-0">
      {causes.map((cause, index) => (
        <li key={cause.id}>
          <RootCauseRow cause={cause} rank={index + 1} />
        </li>
      ))}
    </ul>
  );
}

function RootCauseRow({
  cause,
  rank,
}: {
  cause: FullRcaRootCause;
  rank: number;
}) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[cause.icon];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-neutral-50"
      >
        <Icon
          className="size-3.5 shrink-0 text-neutral-500"
          aria-hidden
        />

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          <span className="text-muted-foreground">{rank}.</span> {cause.title}
        </span>

        <span className="hidden shrink-0 flex-wrap items-center justify-end gap-1 sm:flex">
          <StatusBadge status={cause.status} />
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-foreground",
          )}
          aria-hidden
        />
      </button>

      <div className="flex flex-wrap gap-1 px-3 pb-2 sm:hidden">
        <StatusBadge status={cause.status} />
      </div>

      {open ? (
        <div className="space-y-4 border-t border-border bg-neutral-50/60 px-3 py-3">
          {cause.table ? <FullRcaDataTable table={cause.table} /> : null}

          <ul className="m-0 list-disc space-y-2 pl-4 text-sm leading-relaxed text-neutral-800 marker:text-neutral-400">
            {cause.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          {cause.callout ? <FullRcaCalloutBox callout={cause.callout} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: FullRcaRootCause["status"] }) {
  if (status === "resolved") {
    return (
      <span className="inline-flex rounded-md bg-success-50 px-1.5 py-0.5 text-2xs font-medium text-success-700">
        Resolved
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-md bg-error-50 px-1.5 py-0.5 text-2xs font-medium text-error-700">
      Still an Issue
    </span>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn, controlFocusClass } from "@/lib/utils";

type PlanHistoryPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function PlanHistoryPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PlanHistoryPaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            "flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
            controlFocusClass,
          )}
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="min-w-22 text-center text-xs font-medium text-foreground">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            "flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
            controlFocusClass,
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

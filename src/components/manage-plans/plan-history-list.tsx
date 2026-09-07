"use client";

import {
  AlertCircle,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { PlanStatusBadge } from "@/components/manage-plans/plan-status-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPlanDate, type SalesPlan } from "@/lib/mock-sales-plans";
import { cn, controlFocusClass } from "@/lib/utils";

type PlanHistoryListProps = {
  plans: SalesPlan[];
  onDownload: (plan: SalesPlan) => void;
  downloadingId: string | null;
};

export function PlanHistoryList({
  plans,
  onDownload,
  downloadingId,
}: PlanHistoryListProps) {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <FileSpreadsheet
          className="size-10 text-neutral-300"
          aria-hidden
        />
        <p className="mt-3 text-sm font-semibold text-foreground">
          No plans yet
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Upload a sales plan CSV to set gap-to-plan targets for your alerts.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {plans.map((plan) => (
        <PlanHistoryRow
          key={plan.id}
          plan={plan}
          onDownload={() => onDownload(plan)}
          isDownloading={plan.id === downloadingId}
        />
      ))}
    </ul>
  );
}

function PlanHistoryRow({
  plan,
  onDownload,
  isDownloading,
}: {
  plan: SalesPlan;
  onDownload: () => void;
  isDownloading: boolean;
}) {
  const isFailed = plan.status === "failed";
  const [showError, setShowError] = useState(false);

  return (
    <li
      className={cn(
        "px-5 py-4 transition-colors hover:bg-neutral-50/80",
        isFailed && "bg-error-25/40",
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100"
          aria-hidden
        >
          {isFailed ? (
            <AlertCircle className="size-4 text-neutral-500" />
          ) : (
            <FileSpreadsheet className="size-4 text-neutral-500" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <Tooltip>
              <TooltipTrigger className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-foreground">
                {plan.fileName}
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm break-all">
                {plan.fileName}
              </TooltipContent>
            </Tooltip>
            <PlanStatusBadge status={plan.status} />
          </div>

          <p className="mt-1.5 text-xs text-muted-foreground">
            {formatPlanDate(plan.uploadedAt)}
            <span className="mx-1.5 text-neutral-300" aria-hidden>
              ·
            </span>
            {plan.uploadedBy}
          </p>

          {isFailed && plan.errorMessage && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setShowError((open) => !open)}
                aria-expanded={showError}
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium text-error-700 hover:text-error-800",
                  controlFocusClass,
                )}
              >
                {showError ? "Hide error" : "View error"}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    showError && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {showError && (
                <div className="mt-2 rounded-md border border-error-100 bg-error-50 p-2.5 text-xs leading-relaxed text-error-700">
                  {plan.errorMessage}
                  <span className="mt-1 block text-error-600/80">
                    Download the file to review row-level errors.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={`Download ${plan.fileName}`}
          onClick={onDownload}
          disabled={isDownloading}
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-foreground disabled:pointer-events-none disabled:opacity-70",
            controlFocusClass,
          )}
        >
          {isDownloading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
        </button>
      </div>
    </li>
  );
}

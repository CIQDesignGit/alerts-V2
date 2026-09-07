"use client";

import { AlertCircle, ChevronDown, Download, FileSpreadsheet } from "lucide-react";
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
};

export function PlanHistoryList({ plans, onDownload }: PlanHistoryListProps) {
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
        />
      ))}
    </ul>
  );
}

function PlanHistoryRow({
  plan,
  onDownload,
}: {
  plan: SalesPlan;
  onDownload: () => void;
}) {
  const isFailed = plan.status === "failed";
  const [showError, setShowError] = useState(false);

  return (
    <li
      className={cn(
        "group px-4 py-3.5 transition-colors hover:bg-neutral-50/80",
        isFailed && "bg-error-25/40",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
            isFailed ? "bg-error-100" : "bg-brand-50",
          )}
          aria-hidden
        >
          {isFailed ? (
            <AlertCircle className="size-4 text-error-600" />
          ) : (
            <FileSpreadsheet className="size-4 text-brand-600" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <Tooltip>
              <TooltipTrigger className="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground">
                {plan.fileName}
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm break-all">
                {plan.fileName}
              </TooltipContent>
            </Tooltip>
            <PlanStatusBadge status={plan.status} />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {formatPlanDate(plan.uploadedAt)}
            <span className="mx-1.5 text-neutral-300" aria-hidden>
              ·
            </span>
            {plan.uploadedBy}
          </p>

          {isFailed && plan.errorMessage && (
            <div className="mt-2">
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
                <p className="mt-1.5 text-xs leading-relaxed text-error-700">
                  {plan.errorMessage}
                  <span className="mt-0.5 block text-error-600/80">
                    Download the file to review row-level errors.
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={`Download ${plan.fileName}`}
          onClick={onDownload}
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-neutral-50 hover:text-foreground focus-visible:opacity-100",
            isFailed && "opacity-100",
            controlFocusClass,
          )}
        >
          <Download className="size-4" />
        </button>
      </div>
    </li>
  );
}

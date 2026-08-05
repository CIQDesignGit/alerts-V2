"use client";

import { CircleHelp } from "lucide-react";
import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDealPageSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type DealPageSkuDetailProps = {
  sku: IssueSku;
};

/** Deal Page Visibility — missing-status card (issue aggregation SKU view). */
export function DealPageSkuDetail({ sku }: DealPageSkuDetailProps) {
  const detail = useMemo(() => getDealPageSkuDetail(sku), [sku]);

  // Split lead so “deals page” can carry the underline + tooltip affordance
  const dealsPhrase = "deals page";
  const dealsIndex = detail.leadText.lastIndexOf(dealsPhrase);
  const leadBefore =
    dealsIndex >= 0 ? detail.leadText.slice(0, dealsIndex) : detail.leadText;
  const leadAfter =
    dealsIndex >= 0
      ? detail.leadText.slice(dealsIndex + dealsPhrase.length)
      : "";

  return (
    <div className="flex flex-col gap-6">
      <TooltipProvider>
        <p className="flex flex-wrap items-center gap-1.5 text-sm text-foreground">
          <span>
            {leadBefore}
            {dealsIndex >= 0 && (
              <Tooltip>
                <TooltipTrigger className="cursor-help border-b border-dotted border-neutral-400 font-medium text-foreground">
                  {dealsPhrase}
                </TooltipTrigger>
                <TooltipContent>{detail.tooltip}</TooltipContent>
              </Tooltip>
            )}
            {leadAfter}
          </span>
          <Tooltip>
            <TooltipTrigger
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="About deals page"
            >
              <CircleHelp className="size-4" aria-hidden />
            </TooltipTrigger>
            <TooltipContent>{detail.tooltip}</TooltipContent>
          </Tooltip>
        </p>
      </TooltipProvider>

      {/* Status card — pink hero + missing message */}
      <div className="w-full max-w-xs overflow-hidden rounded-xl border border-border bg-background shadow-md">
        <div className="relative flex h-36 items-center justify-center bg-error-50">
          <div className="relative flex size-14 items-center justify-center rounded-full border-2 border-error-500 bg-background shadow-sm">
            <span className="text-2xl font-bold text-error-600" aria-hidden>
              ?
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-5 py-5">
          {/* Skeleton bars flank the headline — matches design placeholders */}
          <div className="h-2.5 w-3/4 rounded-full bg-error-100" aria-hidden />
          <p className="text-base font-semibold text-error-600">
            {detail.statusHeadline}
          </p>
          <div className="h-2.5 w-full rounded-full bg-error-100" aria-hidden />
          <div className="h-2.5 w-2/3 rounded-full bg-error-100" aria-hidden />
          <span className="sr-only">
            {detail.supportLines[0]} · {detail.supportLines[1]}
          </span>
        </div>
      </div>
    </div>
  );
}

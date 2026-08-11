"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import type { DealPageReviewedLink } from "@/lib/mock-issue-sku-detail";
import { getDealPageSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type DealPageSkuDetailProps = {
  sku: IssueSku;
};

/** Deal Page Visibility — missing-status card (issue aggregation SKU view). */
export function DealPageSkuDetail({ sku }: DealPageSkuDetailProps) {
  const detail = useMemo(() => getDealPageSkuDetail(sku), [sku]);

  // Split lead so “deals page” can carry the underline + hover menu
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
      <p className="flex flex-wrap items-center gap-1.5 text-sm text-foreground">
        <span>
          {leadBefore}
          {dealsIndex >= 0 && (
            <DealsPageHoverMenu pages={detail.reviewedPages} />
          )}
          {leadAfter}
        </span>
      </p>

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

/** White hover panel listing the 7 deals pages that were reviewed */
function DealsPageHoverMenu({ pages }: { pages: DealPageReviewedLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="cursor-help border-b border-dotted border-neutral-400 font-medium text-foreground"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        deals page
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Reviewed deals pages"
          className="absolute left-0 top-full z-50 mt-1.5 w-80 overflow-hidden rounded-lg border border-border bg-background shadow-md"
        >
          <p className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
            We have reviewed first fold of these 7 deals pages.
          </p>
          <ul className="m-0 list-none divide-y divide-border p-0">
            {pages.map((page) => (
              <li key={page.id}>
                <a
                  href={page.href}
                  onClick={(event) => event.preventDefault()}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-neutral-50"
                >
                  <span>{page.label}</span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-neutral-400"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </span>
  );
}

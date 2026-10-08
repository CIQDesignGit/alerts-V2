"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DealPageTopProducts } from "@/components/issue-sku-detail/deal-page-top-products";
import { DealPageWindow } from "@/components/issue-sku-detail/deal-page-window";
import { getDealPageSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { DealPageReviewedLink } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type DealPageSkuDetailProps = {
  sku: IssueSku;
};

/** Deal Page Visibility — one deal, switched across the pages that were checked. */
export function DealPageSkuDetail({ sku }: DealPageSkuDetailProps) {
  const detail = useMemo(() => getDealPageSkuDetail(sku), [sku]);
  const [pageId, setPageId] = useState(detail.defaultPageId);

  useEffect(() => {
    setPageId(detail.defaultPageId);
  }, [detail.defaultPageId, sku.id]);

  const page =
    detail.pages.find((item) => item.id === pageId) ?? detail.pages[0];
  const dealsPhrase = "deals page";
  const dealsIndex = detail.leadText.lastIndexOf(dealsPhrase);
  const leadBefore =
    dealsIndex >= 0 ? detail.leadText.slice(0, dealsIndex) : detail.leadText;
  const leadAfter =
    dealsIndex >= 0
      ? detail.leadText.slice(dealsIndex + dealsPhrase.length)
      : "";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">
        {leadBefore}
        {dealsIndex >= 0 ? (
          <DealsPageHoverMenu pages={detail.reviewedPages} />
        ) : null}
        {leadAfter}
      </p>

      {page ? (
        <>
          <DealPageWindow
            detail={{
              ...detail,
              dealsPageLabel: page.label,
              lastSeenDay: page.lastSeenDay,
              lastSeenTime: page.lastSeenTime,
              lastSeenRelative: page.lastSeenRelative,
              topProducts: page.topProducts,
            }}
          />
          <DealPageTopProducts
            pages={detail.pages}
            pageId={page.id}
            onPageChange={setPageId}
            products={page.topProducts}
          />
        </>
      ) : null}
    </div>
  );
}

/** Dotted “deals page” link listing the first-fold pages that were reviewed. */
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

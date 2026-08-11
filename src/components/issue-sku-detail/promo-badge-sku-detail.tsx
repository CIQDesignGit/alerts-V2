"use client";

import { Check, X } from "lucide-react";
import { useMemo } from "react";

import { getPromoBadgeSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type PromoBadgeSkuDetailProps = {
  sku: IssueSku;
};

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** Promo Badge — checklist + original/selling price cards (issue aggregation SKU view). */
export function PromoBadgeSkuDetail({ sku }: PromoBadgeSkuDetailProps) {
  const detail = useMemo(() => getPromoBadgeSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{detail.summary}</p>

      {/* Checklist card */}
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <ul className="divide-y divide-border">
          {detail.checks.map((check) => (
            <li
              key={check.id}
              className="flex items-center justify-between gap-4 px-4 py-3.5"
            >
              <span className="text-sm text-foreground">{check.label}</span>
              {check.ok ? (
                <Check
                  className="size-5 shrink-0 text-neutral-400"
                  strokeWidth={2.5}
                  aria-label="Pass"
                />
              ) : (
                <X
                  className="size-5 shrink-0 text-error-600"
                  strokeWidth={2.5}
                  aria-label="Fail"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Original vs Selling price cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className={cn(
            "rounded-lg border px-4 py-3",
            detail.originalCardError
              ? "border-error-200 bg-error-50"
              : "border-border bg-background",
          )}
        >
          <p className="text-xs text-muted-foreground">Original</p>
          <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
            {formatMoney(detail.originalPrice)}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <p className="text-xs text-muted-foreground">Selling</p>
          <p className="mt-2 text-xl font-bold tracking-tight text-foreground">
            {formatMoney(detail.sellingPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}

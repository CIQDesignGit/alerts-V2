"use client";

import {
  CircleDollarSign,
  Info,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useMemo } from "react";

import type { BuyBoxComparisonRow } from "@/lib/mock-issue-sku-detail";
import { getLostBuyBoxSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type LostBuyBoxSkuDetailProps = {
  sku: IssueSku;
};

export function LostBuyBoxSkuDetail({ sku }: LostBuyBoxSkuDetailProps) {
  const detail = useMemo(() => getLostBuyBoxSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{detail.alertMessage}</p>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-border bg-neutral-50/80">
          <div className="px-4 py-3" />
          <div className="border-l border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              {detail.brandLabel}
            </p>
          </div>
          <div className="border-l border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              {detail.competitorLabel}
            </p>
            <span className="mt-1 inline-flex rounded-md bg-neutral-100 px-2 py-0.5 text-2xs font-medium text-neutral-600">
              {detail.competitorBadge}
            </span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {detail.rows.map((row) => (
            <ComparisonRow key={row.id} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ row }: { row: BuyBoxComparisonRow }) {
  const Icon = ROW_ICONS[row.icon];

  return (
    <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex items-center gap-2 px-4 py-3.5">
        <Icon className="size-4 shrink-0 text-neutral-500" aria-hidden />
        <span className="flex items-center gap-1 text-sm text-foreground">
          {row.label}
          {row.icon === "winRate" && (
            <Info className="size-3.5 text-neutral-400" aria-hidden />
          )}
        </span>
      </div>
      <div className="border-l border-border px-4 py-3.5">
        <CellValue row={row} side="brand" />
      </div>
      <div className="border-l border-border px-4 py-3.5">
        <CellValue row={row} side="competitor" />
      </div>
    </div>
  );
}

function CellValue({
  row,
  side,
}: {
  row: BuyBoxComparisonRow;
  side: "brand" | "competitor";
}) {
  if (row.icon === "ratings") {
    const rating =
      side === "brand" ? row.brandRating : row.competitorRating;
    const label = side === "brand" ? row.brandValue : row.competitorValue;
    return (
      <div className="flex items-center gap-2">
        <StarRating rating={rating ?? 0} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
    );
  }

  if (row.icon === "winRate") {
    const value =
      side === "brand" ? row.brandWinRate : row.competitorWinRate;
    return (
      <button
        type="button"
        className="text-sm font-medium text-brand-600 underline-offset-2 hover:underline"
      >
        {value}
      </button>
    );
  }

  return (
    <span className="text-sm text-foreground">
      {side === "brand" ? row.brandValue : row.competitorValue}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full >= 0.25;

  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < full
              ? "fill-error-500 text-error-500"
              : index === full && partial
                ? "fill-error-200 text-error-500"
                : "fill-neutral-200 text-neutral-300",
          )}
        />
      ))}
    </span>
  );
}

const ROW_ICONS = {
  price: CircleDollarSign,
  availability: Package,
  ratings: Star,
  winRate: ShoppingCart,
} as const;

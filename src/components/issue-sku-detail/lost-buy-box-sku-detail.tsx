"use client";

import {
  CircleDollarSign,
  Info,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useMemo } from "react";

import { IssueDetailTableHeader, issueDetailTable } from "@/components/issue-sku-detail/issue-detail-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  BuyBoxComparisonRow,
  BuyBoxWinCheckDay,
} from "@/lib/mock-issue-sku-detail";
import { getLostBuyBoxSkuDetail } from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

/** Explains how Buy Box Wins % is calculated from PDP visits */
const BUY_BOX_WINS_TOOLTIP =
  "CommerceIQ Sales Agent visited the PDP of this SKU multiple times in a day. The Buy Box Wins is the percentage of times the Buy Box was owned by you across all such visits.";

type LostBuyBoxSkuDetailProps = {
  sku: IssueSku;
};

export function LostBuyBoxSkuDetail({ sku }: LostBuyBoxSkuDetailProps) {
  const detail = useMemo(() => getLostBuyBoxSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{detail.alertMessage}</p>

      <div className={issueDetailTable.frame}>
        <IssueDetailTableHeader title="Buy Box Comparison" />
        <div className="px-3 py-3">
          <div
            className={cn(
              "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]",
              issueDetailTable.headRow,
            )}
          >
            <div className="px-2 py-1 align-top">
              <span className={issueDetailTable.thCell} />
            </div>
            <div className="px-2 py-1 align-top">
              <span
                className={cn(
                  issueDetailTable.thCell,
                  "text-2xs font-medium tracking-wider text-muted-foreground uppercase",
                )}
              >
                {detail.brandLabel}
              </span>
            </div>
            <div className="px-2 py-1 align-top">
              <span className={cn(issueDetailTable.thCellCol, "gap-1")}>
                <span className="text-2xs font-medium tracking-wider text-muted-foreground uppercase">
                  {detail.competitorLabel}
                </span>
                <span className="inline-flex w-fit rounded-md bg-neutral-100 px-2 py-0.5 text-2xs font-medium text-neutral-600 normal-case tracking-normal">
                  {detail.competitorBadge}
                </span>
              </span>
            </div>
          </div>

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
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]",
        issueDetailTable.row,
      )}
    >
      <div className="px-2 py-1">
        <span className={cn(issueDetailTable.cell, "gap-2")}>
          <Icon className="size-4 shrink-0 text-neutral-500" aria-hidden />
          <span className="inline-flex items-center gap-1 text-xs font-medium">
            {row.label}
            {row.icon === "winRate" && (
              <Tooltip>
                <TooltipTrigger
                  className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
                  aria-label="About Buy Box Wins"
                >
                  <Info className="size-3.5" aria-hidden />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-left leading-snug">
                  {BUY_BOX_WINS_TOOLTIP}
                </TooltipContent>
              </Tooltip>
            )}
          </span>
        </span>
      </div>
      <div className="px-2 py-1">
        <span className={issueDetailTable.cell}>
          <CellValue row={row} side="brand" />
        </span>
      </div>
      <div className="px-2 py-1">
        <span className={issueDetailTable.cell}>
          <CellValue row={row} side="competitor" />
        </span>
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
      <span className="inline-flex items-center gap-2 text-xs font-medium">
        <StarRating rating={rating ?? 0} />
        {label}
      </span>
    );
  }

  if (row.icon === "winRate") {
    const value =
      side === "brand" ? row.brandWinRate : row.competitorWinRate;
    const checks =
      side === "brand" ? row.brandWinChecks : row.competitorWinChecks;

    return (
      <Tooltip>
        <TooltipTrigger
          className="text-xs font-medium text-brand-600 underline-offset-2 hover:underline"
          aria-label={`Buy Box wins ${value ?? ""} — view crawl times`}
        >
          {value}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="flex w-56 max-w-none flex-col items-stretch gap-2.5 px-3 py-2.5 text-left"
        >
          <BuyBoxWinChecksTooltip days={checks ?? []} />
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <span className="text-xs font-medium tabular-nums">
      {side === "brand" ? row.brandValue : row.competitorValue}
    </span>
  );
}

/** Dark tooltip body — crawl times when this seller held the Buy Box */
function BuyBoxWinChecksTooltip({ days }: { days: BuyBoxWinCheckDay[] }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <p className="text-xs font-medium leading-snug text-background">
        This seller owned the Buy Box during these checks
      </p>
      {days.map((day) => (
        <div key={day.date} className="flex flex-col gap-1">
          <p className="text-2xs font-medium text-background/65">{day.date}</p>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {day.checks.map((check) => (
              <li
                key={`${day.date}-${check.time}`}
                className="flex items-baseline justify-between gap-3 text-xs leading-5"
              >
                <span className="inline-flex items-baseline gap-1.5 text-background">
                  <span aria-hidden className="text-background/70">
                    •
                  </span>
                  {check.time}
                </span>
                <span className="shrink-0 text-background/65">
                  ({check.relative})
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
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

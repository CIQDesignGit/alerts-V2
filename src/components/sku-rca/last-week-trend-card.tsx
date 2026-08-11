"use client";

import { Check, Info, X } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  LastWeekTrendData,
  TrendTableCell,
  TrendTone,
  TrendTypeBadge,
} from "@/lib/mock-last-week-trend";
import { cn } from "@/lib/utils";

type LastWeekTrendCardProps = {
  trend: LastWeekTrendData;
};

/** Same padding for day headers + every cell type — used by all issue cards */
const DAY_COL_PAD = "px-1.5 py-1.5";
const DAY_COL_SHELL = cn(
  "flex min-h-9 flex-col items-end justify-center rounded-md",
  DAY_COL_PAD,
);

/**
 * Summary KPI value — if it ends with “days” (e.g. “7 / 7 days”),
 * render that word smaller and in a light neutral tint.
 */
function SummaryMetricValue({ value }: { value: string }) {
  const match = value.match(/^(.*?)\s+(days)$/i);
  if (!match) {
    return (
      <p className="text-base font-semibold tracking-tight text-foreground">
        {value}
      </p>
    );
  }

  return (
    <p className="text-base font-semibold tracking-tight text-foreground">
      {match[1]}{" "}
      <span className="text-xs font-medium text-neutral-400">{match[2]}</span>
    </p>
  );
}

function deltaClass(tone?: TrendTone) {
  if (tone === "positive") return "text-success-600";
  if (tone === "negative") return "text-error-600";
  return "text-muted-foreground";
}

function cellToneClass(tone: TrendTone) {
  if (tone === "positive") return "text-success-700";
  if (tone === "negative") return "text-error-700";
  return "text-foreground";
}

/** Soft wash always pairs with tone — same rule on every issue card */
function cellWashClass(tone: TrendTone) {
  if (tone === "positive") return "bg-success-50";
  if (tone === "negative") return "bg-error-50";
  return undefined;
}

function summaryGridClass(columns: 1 | 2 | 3 | 4 = 3) {
  if (columns === 1) return "grid-cols-1";
  if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
  if (columns === 4) return "grid-cols-2 sm:grid-cols-4";
  return "grid-cols-1 sm:grid-cols-3";
}

function TypeBadge({ type }: { type: TrendTypeBadge }) {
  const isPaid = type === "paid";
  return (
    <span
      className={cn(
        "inline-flex rounded px-1.5 py-0.5 text-2xs font-semibold tracking-wider uppercase",
        isPaid
          ? "bg-brand-100 text-brand-700"
          : "bg-neutral-100 text-neutral-600",
      )}
    >
      {isPaid ? "Paid" : "Organic"}
    </span>
  );
}

/** One daily table cell — text, check/X, N/A, or empty dash (right-aligned) */
function TrendCell({
  cell,
  emphasize,
}: {
  cell: TrendTableCell;
  emphasize?: boolean;
}) {
  if (cell.kind === "empty") {
    return (
      <span className={cn(DAY_COL_SHELL, "text-xs text-muted-foreground")}>
        —
      </span>
    );
  }

  if (cell.kind === "na") {
    return (
      <span className={cn(DAY_COL_SHELL, "text-xs text-muted-foreground")}>
        N/A
      </span>
    );
  }

  if (cell.kind === "check") {
    return (
      <span
        className={cn(
          DAY_COL_SHELL,
          "flex-row",
          cell.ok ? "bg-success-50" : "bg-error-50",
        )}
      >
        {cell.ok ? (
          <Check
            className="size-4 text-success-600"
            strokeWidth={2.5}
            aria-label="Yes"
          />
        ) : (
          <X
            className="size-4 text-error-600"
            strokeWidth={2.5}
            aria-label="No"
          />
        )}
      </span>
    );
  }

  return (
    <span
      className={cn(
        DAY_COL_SHELL,
        "text-xs tabular-nums",
        emphasize ? "font-semibold" : "font-medium",
        cellToneClass(cell.tone),
        cellWashClass(cell.tone),
      )}
    >
      {cell.value}
    </span>
  );
}

function InfoHint({ label, text }: { label: string; text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
        aria-label={label}
      >
        <Info className="size-3" aria-hidden />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{text}</TooltipContent>
    </Tooltip>
  );
}

/**
 * AllyAI reply card — “Last 7 Day Trend” summary + daily metric table.
 * One layout for every issue — day headers and values share the same padding.
 */
export function LastWeekTrendCard({ trend }: LastWeekTrendCardProps) {
  const showVsPrevWeek = trend.showVsPrevWeek !== false;
  const hasSummary = trend.summaryMetrics.length > 0;
  const rowHeaderLabel = trend.rowHeaderLabel ?? "Metric";

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h3 className="text-sm font-semibold text-foreground">{trend.title}</h3>
        {showVsPrevWeek ? (
          <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <span>vs prev week</span>
            <InfoHint
              label="About vs prev week"
              text={trend.vsPrevWeekTooltip}
            />
          </div>
        ) : null}
      </header>

      {hasSummary ? (
        <section
          className={cn(
            "grid gap-x-6 gap-y-5 border-b border-border px-5 py-5",
            summaryGridClass(trend.summaryColumns),
          )}
        >
          {trend.summaryMetrics.map((metric) => (
            <div key={metric.id} className="min-w-0">
              <div className="mb-1 flex items-center gap-1">
                <p className="text-2xs font-medium tracking-wider text-muted-foreground uppercase">
                  {metric.label}
                </p>
                {metric.infoTooltip ? (
                  <InfoHint
                    label={`About ${metric.label}`}
                    text={metric.infoTooltip}
                  />
                ) : null}
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <SummaryMetricValue value={metric.value} />
                {metric.delta ? (
                  <span
                    className={cn(
                      "text-xs font-medium tabular-nums",
                      deltaClass(metric.deltaTone),
                    )}
                  >
                    {metric.delta}
                  </span>
                ) : null}
              </div>
              {metric.sublabel ? (
                <p className="mt-0.5 text-2xs text-muted-foreground">
                  {metric.sublabel}
                </p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {/* Daily breakdown — day columns right-aligned (all issue types) */}
      <div className="overflow-x-auto px-3 py-3">
        <table className="w-full min-w-xl border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-background px-2 py-1 text-left text-2xs font-medium tracking-wider text-muted-foreground uppercase">
                <span className="flex min-h-9 items-center">
                  {rowHeaderLabel}
                </span>
              </th>
              {trend.showTypeColumn ? (
                <th className="px-2 py-1 text-left text-2xs font-medium tracking-wider text-muted-foreground uppercase">
                  <span className="flex min-h-9 items-center">Type</span>
                </th>
              ) : null}
              {trend.days.map((day) => (
                <th
                  key={day.id}
                  className="px-1 py-1 text-right text-2xs font-medium text-muted-foreground"
                >
                  <span className={DAY_COL_SHELL}>
                    <span className="block">{day.dateLabel}</span>
                    <span className="block font-normal">{day.dayLabel}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trend.rows.map((row) => {
              const showLabel = row.showLabel !== false;
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "align-middle border-b border-border last:border-b-0",
                    row.rowHighlight && "bg-error-50",
                    row.isFooter && "bg-neutral-50",
                  )}
                >
                  <th
                    scope="row"
                    className={cn(
                      "sticky left-0 z-10 px-2 py-1 text-left text-xs font-medium text-foreground",
                      row.isFooter
                        ? "bg-neutral-50 font-semibold"
                        : row.rowHighlight
                          ? "bg-error-50"
                          : "bg-background",
                    )}
                  >
                    {showLabel ? (
                      <span className="inline-flex min-h-9 items-center gap-1">
                        {row.label}
                        {row.infoTooltip ? (
                          <InfoHint
                            label={`About ${row.label}`}
                            text={row.infoTooltip}
                          />
                        ) : null}
                      </span>
                    ) : (
                      <span className="sr-only">{row.label}</span>
                    )}
                  </th>
                  {trend.showTypeColumn ? (
                    <td className="px-2 py-1">
                      <span className="flex min-h-9 items-center">
                        {row.typeBadge ? (
                          <TypeBadge type={row.typeBadge} />
                        ) : null}
                      </span>
                    </td>
                  ) : null}
                  {row.cells.map((cell, index) => (
                    <td
                      key={`${row.id}-${trend.days[index]?.id}`}
                      className="px-1 py-1 text-right"
                    >
                      <TrendCell cell={cell} emphasize={row.isFooter} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

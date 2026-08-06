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
} from "@/lib/mock-last-week-trend";
import { cn } from "@/lib/utils";

type LastWeekTrendCardProps = {
  trend: LastWeekTrendData;
};

function deltaClass(tone?: TrendTone) {
  if (tone === "positive") return "text-success-600";
  if (tone === "negative") return "text-error-600";
  return "text-muted-foreground";
}

function cellToneClass(tone: TrendTone) {
  if (tone === "positive") return "text-success-700";
  if (tone === "negative") return "text-error-700";
  return "text-muted-foreground";
}

/** One daily table cell — text (ratio/$), check/X, or empty dash */
function TrendCell({ cell }: { cell: TrendTableCell }) {
  if (cell.kind === "empty") {
    return (
      <span className="flex min-h-9 items-center justify-center rounded-md px-1 py-2 text-xs text-muted-foreground">
        —
      </span>
    );
  }

  if (cell.kind === "check") {
    return (
      <span className="flex min-h-9 items-center justify-center rounded-md px-1 py-2">
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
        "flex min-h-9 items-center justify-center px-1 py-2 text-xs font-medium tabular-nums",
        cellToneClass(cell.tone),
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
 * AllyAI reply card — “Last Week Trend” summary + daily metric table.
 * Layout matches the Lost Buy Box / Promo Badge design screenshots.
 */
export function LastWeekTrendCard({ trend }: LastWeekTrendCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <h3 className="text-sm font-semibold text-foreground">{trend.title}</h3>
        <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <span>vs prev week</span>
          <InfoHint label="About vs prev week" text={trend.vsPrevWeekTooltip} />
        </div>
      </header>

      {/* Summary KPIs — 3 columns, 2 rows on the designed mockups */}
      <section className="grid grid-cols-1 gap-x-6 gap-y-5 border-b border-border px-5 py-5 sm:grid-cols-3">
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
              <p className="text-base font-semibold tracking-tight text-slate-800">
                {metric.value}
              </p>
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
          </div>
        ))}
      </section>

      {/* Daily breakdown */}
      <div className="overflow-x-auto px-3 py-3">
        <table className="w-full min-w-xl border-collapse text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background px-2 py-2 text-2xs font-medium tracking-wider text-muted-foreground uppercase">
                Metric
              </th>
              {trend.days.map((day) => (
                <th
                  key={day.id}
                  className="px-1 py-2 text-center text-2xs font-medium text-muted-foreground"
                >
                  <span className="block">{day.dateLabel}</span>
                  <span className="block font-normal">{day.dayLabel}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trend.rows.map((row) => (
              <tr key={row.id} className="align-middle">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-background px-2 py-1.5 text-left text-xs font-medium text-foreground"
                >
                  <span className="inline-flex items-center gap-1">
                    {row.label}
                    {row.infoTooltip ? (
                      <InfoHint
                        label={`About ${row.label}`}
                        text={row.infoTooltip}
                      />
                    ) : null}
                  </span>
                </th>
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${trend.days[index]?.id}`} className="px-1 py-1">
                    <TrendCell cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

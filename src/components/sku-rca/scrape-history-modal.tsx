"use client";

import { Check } from "lucide-react";

import { ISSUE_SCRAPE_DETECTED_LABEL } from "@/components/alerts/issue-names";
import {
  LAST_WEEK_RANGE_LABEL,
  PeriodBadge,
} from "@/components/shared/period-badge";
import type { ScrapeHistoryData } from "@/lib/mock-scrape-history";
import { cn } from "@/lib/utils";

/**
 * AllyAI inline reply card — last-week scrape grid in Chat with Ally AI
 * (same pattern as LastWeekTrendCard).
 */
export function ScrapeHistoryCard({ data }: { data: ScrapeHistoryData }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Title row matching the product mock — SKU name + week badge */}
      <header className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="min-w-0 text-sm font-semibold text-foreground">
            Last week scrape history · {data.skuName}
          </h3>
          <PeriodBadge tone="historical">{LAST_WEEK_RANGE_LABEL}</PeriodBadge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Whether each issue was detected on that day ({data.scrapesPerDay}{" "}
          scrapes per day).
        </p>
      </header>

      <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-neutral-50/80 px-3 py-2">
          <p className="text-[11px] font-semibold tracking-wide text-neutral-600 uppercase">
            Last week scrape history ·{" "}
            <span className="font-mono normal-case">{data.asin}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
            <span>
              {data.scrapesPerDay} scrapes per day ·{" "}
              {data.scrapesPerDay * data.days.length} total per week
            </span>
            <span className="inline-flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1">
                <DetectedDot size="sm" />
                Detected
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="size-3 text-success-600" aria-hidden />
                No issue
              </span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-neutral-50/50">
                <th className="sticky left-0 z-10 bg-neutral-50/95 px-4 py-2 text-left text-[10px] font-semibold tracking-wide text-neutral-500 uppercase">
                  Issue type
                </th>
                {data.days.map((day) => (
                  <th
                    key={day.label}
                    className="min-w-28 px-1.5 py-2 text-left"
                  >
                    <span className="block text-[10px] font-semibold leading-tight text-neutral-700">
                      {day.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.issues.map((row) => (
                <tr
                  key={row.issueKey}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-background px-4 py-3 text-xs font-medium leading-tight text-foreground">
                    {row.issueLabel}
                  </td>
                  {row.detectedOnDay.map((detected, i) => (
                    <td key={i} className="px-1.5 py-3 text-left">
                      <ScrapeCell
                        detected={detected}
                        detectedLabel={
                          ISSUE_SCRAPE_DETECTED_LABEL[row.issueKey]
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DetectedDot({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-error-100",
        size === "sm" ? "size-4" : "size-5",
      )}
      aria-hidden
    >
      <span
        className={cn(
          "rounded-full bg-error-600",
          size === "sm" ? "size-1.5" : "size-2",
        )}
      />
    </span>
  );
}

function ScrapeCell({
  detected,
  detectedLabel,
}: {
  detected: boolean;
  detectedLabel: string;
}) {
  if (detected) {
    return (
      <span className="inline-flex items-center justify-start gap-1 text-[11px] font-medium text-neutral-500">
        <DetectedDot size="sm" />
        {detectedLabel}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-start">
      <Check className="size-3.5 text-success-600" aria-hidden />
      <span className="sr-only">No issue</span>
    </span>
  );
}

"use client";

import { Check } from "lucide-react";

import { getIssueIconForLabel } from "@/components/alerts/issue-icons";
import type { SkuWeeklyIssuesView } from "@/lib/sku-weekly-issues";
import { cn } from "@/lib/utils";

type SkuWeeklyIssueGridProps = {
  view: SkuWeeklyIssuesView;
};

/** Mon–Sun issue status matrix — green = clean, red = active issue. */
export function SkuWeeklyIssueGrid({ view }: SkuWeeklyIssueGridProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-neutral-50/80 text-2xs font-medium tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-2.5 text-left">Issue</th>
              <th className="px-3 py-2.5 text-left">Days</th>
              {view.dayLabels.map((day) => (
                <th key={day} className="px-2 py-2.5 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.rows.map((row) => {
              const Icon = getIssueIconForLabel(row.name);
              return (
                <tr
                  key={row.issueKey}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-600">
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                      <span className="font-medium text-foreground">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-2xs font-medium tabular-nums",
                        row.activeDayCount > 0
                          ? "bg-error-50 text-error-700"
                          : "bg-neutral-100 text-neutral-600",
                      )}
                    >
                      {row.activeDayCount}/7 days
                    </span>
                  </td>
                  {row.days.map((status, index) => (
                    <td key={`${row.issueKey}-${index}`} className="px-2 py-3">
                      <div className="flex justify-center">
                        <DayStatusPill status={status} />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-2.5 text-2xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <DayStatusPill status="active" />
          Active issue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <DayStatusPill status="clean" />
          Clean
        </span>
      </div>
    </section>
  );
}

function DayStatusPill({ status }: { status: "clean" | "active" }) {
  if (status === "clean") {
    return (
      <span
        className="inline-flex size-6 items-center justify-center rounded-full bg-success-50 text-success-700"
        aria-label="Clean"
      >
        <Check className="size-3.5 stroke-[2.5]" aria-hidden />
      </span>
    );
  }

  return (
    <span
      className="inline-flex size-6 items-center justify-center rounded-full bg-error-50"
      aria-label="Active issue"
    >
      <span className="size-2 rounded-full bg-error-600" aria-hidden />
    </span>
  );
}

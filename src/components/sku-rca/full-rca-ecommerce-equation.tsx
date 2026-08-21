"use client";

import type { FullRcaEcommerceEquation } from "@/lib/mock-full-rca-report";
import { cn } from "@/lib/utils";

type FullRcaEcommerceEquationSectionProps = {
  data: FullRcaEcommerceEquation;
};

/**
 * Ecommerce Equation body — summary strip + lever table + narrative
 * (matches the Quick Ecommerce Equation Breakdown reference).
 */
export function FullRcaEcommerceEquationSection({
  data,
}: FullRcaEcommerceEquationSectionProps) {
  const summaryItems = [
    {
      id: "behind",
      label: "SKUs behind plan",
      value: data.summary.skusBehindPlan,
    },
    {
      id: "ahead",
      label: "SKUs ahead of plan",
      value: data.summary.skusAheadOfPlan,
    },
    {
      id: "mover",
      label: "Biggest mover",
      value: data.summary.biggestMover,
    },
    {
      id: "lever",
      label: "Primary lever",
      value: data.summary.primaryLever,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <dl className="grid grid-cols-2 sm:grid-cols-4">
          {summaryItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "px-4 py-3",
                index > 0 && "border-t border-border sm:border-t-0 sm:border-l",
              )}
            >
              <dt className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 text-base font-semibold leading-snug text-foreground sm:text-lg">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-neutral-50/80">
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-2xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Lever
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-right text-2xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                {data.priorWeekLabel}
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-right text-2xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                {data.currentWeekLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/70 last:border-b-0"
              >
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-foreground"
                >
                  {row.lever}
                </th>
                <td className="px-4 py-3 text-right tabular-nums text-foreground">
                  {row.priorWeek}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-foreground">
                  {row.currentWeek}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
        {data.narrative}
      </p>
    </div>
  );
}

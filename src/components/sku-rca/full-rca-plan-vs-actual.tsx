"use client";

import type { FullRcaPlanVsActual } from "@/lib/mock-full-rca-report";
import { cn } from "@/lib/utils";

type FullRcaPlanVsActualSectionProps = {
  data: FullRcaPlanVsActual;
};

/**
 * Plan vs Actual body — summary strip + period table + narrative
 * (matches the Gap to Plan design reference).
 */
export function FullRcaPlanVsActualSection({
  data,
}: FullRcaPlanVsActualSectionProps) {
  const summaryItems = [
    { id: "plan", label: "Plan", value: data.summary.plan },
    { id: "actual", label: "Actual", value: data.summary.actual },
    { id: "gap", label: "Gap", value: data.summary.gap },
    { id: "attainment", label: "Attainment", value: data.summary.attainment },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Four-up last-week rollup */}
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
              <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Period breakdown */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-neutral-50/80">
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-2xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Period
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-right text-2xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Actual
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-right text-2xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Plan
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-right text-2xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Gap
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
                  {row.period}
                </th>
                <td className="px-4 py-3 text-right tabular-nums text-foreground">
                  {row.actual}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-foreground">
                  {row.plan}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-foreground">
                  {row.gap}
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

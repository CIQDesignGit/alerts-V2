"use client";

import type {
  FullRcaChangeTone,
  FullRcaCompareTable,
} from "@/lib/mock-full-rca-report";
import { cn } from "@/lib/utils";

type FullRcaDataTableProps = {
  table: FullRcaCompareTable;
};

/**
 * Comparison table — same shell as Affected SKUs / weekly issue grid /
 * issue-detail tables: rounded border, muted uppercase header, divide-y rows.
 */
export function FullRcaDataTable({ table }: FullRcaDataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-neutral-50/80 text-2xs font-medium tracking-wide text-muted-foreground uppercase">
              {table.columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-2.5 font-medium",
                    col.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {col.label || <span className="sr-only">Metric</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0"
              >
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-foreground"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={`${row.id}-${i}`}
                    className={cn(
                      "px-4 py-3 text-right tabular-nums",
                      toneClass(cell.tone),
                    )}
                  >
                    {cell.text}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function toneClass(tone?: FullRcaChangeTone) {
  if (tone === "negative") return "font-medium text-error-600";
  if (tone === "positive") return "font-medium text-success-600";
  return "text-foreground";
}

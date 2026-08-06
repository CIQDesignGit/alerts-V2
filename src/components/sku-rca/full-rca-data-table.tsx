"use client";

import type {
  FullRcaChangeTone,
  FullRcaCompareTable,
  FullRcaTableColumn,
} from "@/lib/mock-full-rca-report";
import { cn } from "@/lib/utils";

type FullRcaDataTableProps = {
  table: FullRcaCompareTable;
};

/**
 * Comparison table — header matches SKU metric / issue tables:
 * soft wash, METRIC uppercase muted, week cols as date + secondary line.
 */
export function FullRcaDataTable({ table }: FullRcaDataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] table-auto border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-neutral-50/80">
            {table.columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 py-2.5 font-medium",
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                <HeaderLabel column={col} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border/70 last:border-b-0"
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
  );
}

/** First column = uppercase METRIC; others = title + optional muted subline. */
function HeaderLabel({ column }: { column: FullRcaTableColumn }) {
  const isMetricCol = column.key === "metric";

  if (isMetricCol) {
    return (
      <span className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
        {column.label || "Metric"}
      </span>
    );
  }

  if (column.sublabel) {
    return (
      <span
        className={cn(
          "flex flex-col gap-0.5",
          column.align === "right" ? "items-end" : "items-start",
        )}
      >
        <span className="text-xs font-semibold text-foreground">
          {column.label}
        </span>
        <span className="text-2xs font-medium text-muted-foreground">
          {column.sublabel}
        </span>
      </span>
    );
  }

  return (
    <span className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
      {column.label}
    </span>
  );
}

function toneClass(tone?: FullRcaChangeTone) {
  if (tone === "negative") return "font-medium text-error-600";
  if (tone === "positive") return "font-medium text-success-600";
  return "text-foreground";
}

"use client";

import type { RcaDrillNode } from "@/lib/mock-rca-drill-tree";
import { cn } from "@/lib/utils";

type RcaDrillNodeCardProps = {
  node: RcaDrillNode;
  registerRef?: (id: string, element: HTMLDivElement | null) => void;
};

const toneText = {
  negative: "text-error-600",
  positive: "text-success-600",
  neutral: "text-muted-foreground",
} as const;

const toneBorder = {
  negative: "border-l-error-500",
  positive: "border-l-success-500",
  neutral: "border-l-neutral-400",
} as const;

/** Single node in the horizontal RCA drill-down tree. */
export function RcaDrillNodeCard({ node, registerRef }: RcaDrillNodeCardProps) {
  const hasDetails = (node.detailLines?.length ?? 0) > 0;
  const showChange =
    node.changePercent && node.changePercent.toLowerCase() !== "same";

  return (
    <div
      ref={(el) => registerRef?.(node.id, el)}
      data-rca-drill-node={node.id}
      className={cn(
        "w-[9.25rem] shrink-0 rounded-sm border border-border border-l-2 bg-background px-2.5 py-2 shadow-xs",
        toneBorder[node.deltaTone],
      )}
    >
      <p className="text-sm font-semibold leading-snug text-neutral-800">
        {node.label}
      </p>

      <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
        <span className="font-mono text-sm font-semibold tabular-nums text-neutral-900">
          {node.absoluteValue}
        </span>
        {showChange ? (
          <span
            className={cn(
              "font-mono text-xs font-semibold tabular-nums",
              toneText[node.deltaTone],
            )}
          >
            {node.changePercent}
          </span>
        ) : null}
      </div>

      {node.footnote ? (
        <p className="mt-1 line-clamp-2 text-2xs leading-snug text-muted-foreground">
          {node.footnote}
        </p>
      ) : null}

      {hasDetails ? (
        <ul className="mt-2 space-y-1 border-t border-border/70 pt-2">
          {node.detailLines!.map((line) => (
            <li
              key={line.label}
              className="flex items-baseline justify-between gap-2 text-2xs"
            >
              <span className="text-muted-foreground">{line.label}</span>
              <span className="font-mono tabular-nums text-neutral-800">
                {line.prior} → {line.current}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

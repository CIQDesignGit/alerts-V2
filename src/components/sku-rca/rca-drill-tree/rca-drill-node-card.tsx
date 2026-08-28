"use client";

import ReactMarkdown from "react-markdown";

import type { RcaDrillNode } from "@/lib/mock-rca-drill-tree";
import { cn } from "@/lib/utils";

type RcaDrillNodeCardProps = {
  node: RcaDrillNode;
  registerRef?: (id: string, element: HTMLDivElement | null) => void;
};

const toneStrong = {
  negative: "font-semibold text-error-600",
  positive: "font-semibold text-emerald-600",
  neutral: "font-semibold text-neutral-700",
} as const;

const toneEdge = {
  negative: "border-l-error-500",
  positive: "border-l-emerald-600",
  neutral: "border-l-neutral-400",
} as const;

/**
 * Causal tree tile — main insight first, supporting narrative below.
 * Only **markdown** change values are semibold + red/emerald.
 * Left edge matches the delta tone.
 * Card width w-[14rem] must match RCA_DRILL_CARD_WIDTH in mock-rca-drill-tree.
 */
export function RcaDrillNodeCard({ node, registerRef }: RcaDrillNodeCardProps) {
  return (
    <div
      ref={(el) => registerRef?.(node.id, el)}
      data-rca-drill-node={node.id}
      className={cn(
        // Keep w-[14rem] in sync with RCA_DRILL_CARD_WIDTH (224px)
        "w-[14rem] shrink-0 rounded-l-xs rounded-r-lg border border-border border-l-[3px] bg-background px-3 py-2.5 shadow-sm",
        toneEdge[node.deltaTone],
      )}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-sm font-medium leading-snug text-neutral-800">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className={toneStrong[node.deltaTone]}>{children}</strong>
          ),
        }}
      >
        {node.headline}
      </ReactMarkdown>

      {node.context ? (
        <p className="mt-1.5 text-xs leading-snug text-neutral-700">{node.context}</p>
      ) : null}
    </div>
  );
}

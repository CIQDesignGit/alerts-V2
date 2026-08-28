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
 * Causal tree tile — italic purple “why” + metric headline.
 * Only **markdown** change values are semibold + red/green.
 * Left edge matches the delta tone.
 */
export function RcaDrillNodeCard({ node, registerRef }: RcaDrillNodeCardProps) {
  return (
    <div
      ref={(el) => registerRef?.(node.id, el)}
      data-rca-drill-node={node.id}
      className={cn(
        "w-[11.5rem] shrink-0 rounded-lg border border-border border-l-2 bg-background px-3 py-2.5 shadow-sm",
        toneEdge[node.deltaTone],
      )}
    >
      {node.context ? (
        <p className="text-xs italic leading-snug text-brand-500">{node.context}</p>
      ) : null}

      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p
              className={cn(
                "text-sm font-medium leading-snug text-neutral-700",
                node.context && "mt-1.5",
              )}
            >
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
    </div>
  );
}

"use client";

import type { RcaDrillEdge } from "@/lib/mock-rca-drill-tree";

export type RcaDrillNodeRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type RcaDrillConnectorsProps = {
  edges: RcaDrillEdge[];
  rects: Map<string, RcaDrillNodeRect>;
  width: number;
  height: number;
};

/** SVG elbow connectors between parent and child node cards. */
export function RcaDrillConnectors({
  edges,
  rects,
  width,
  height,
}: RcaDrillConnectorsProps) {
  if (width <= 0 || height <= 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={width}
      height={height}
      aria-hidden
    >
      {edges.map((edge) => {
        const parent = rects.get(edge.parentId);
        const child = rects.get(edge.childId);
        if (!parent || !child) return null;

        const startX = parent.x + parent.width;
        const startY = parent.y + parent.height / 2;
        const endX = child.x;
        const endY = child.y + child.height / 2;
        const midX = startX + (endX - startX) / 2;

        const path = `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`;

        return (
          <path
            key={`${edge.parentId}-${edge.childId}`}
            d={path}
            fill="none"
            strokeWidth={1.5}
            className="stroke-neutral-400"
          />
        );
      })}
    </svg>
  );
}

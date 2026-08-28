"use client";

import { useMemo } from "react";

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

type BranchGroup = {
  parentId: string;
  parent: RcaDrillNodeRect;
  children: RcaDrillNodeRect[];
};

/** Group edges by parent so siblings share one trunk from the origin node. */
function groupByParent(
  edges: RcaDrillEdge[],
  rects: Map<string, RcaDrillNodeRect>,
): BranchGroup[] {
  const map = new Map<string, BranchGroup>();

  for (const edge of edges) {
    const parent = rects.get(edge.parentId);
    const child = rects.get(edge.childId);
    if (!parent || !child) continue;

    let group = map.get(edge.parentId);
    if (!group) {
      group = { parentId: edge.parentId, parent, children: [] };
      map.set(edge.parentId, group);
    }
    group.children.push(child);
  }

  return [...map.values()];
}

/**
 * Shared-trunk elbow connectors.
 * One stub leaves the parent, then a vertical bus fans to each child —
 * so multi-child branches (e.g. 3 keywords) clearly originate from one node.
 */
export function RcaDrillConnectors({
  edges,
  rects,
  width,
  height,
}: RcaDrillConnectorsProps) {
  const groups = useMemo(() => groupByParent(edges, rects), [edges, rects]);

  if (width <= 0 || height <= 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={width}
      height={height}
      aria-hidden
    >
      {groups.map((group) => {
        const { parent, children } = group;
        if (children.length === 0) return null;

        const startX = parent.x + parent.width;
        const startY = parent.y + parent.height / 2;

        const nearestChildLeft = Math.min(...children.map((c) => c.x));
        const gap = nearestChildLeft - startX;
        // Trunk sits in the gutter between parent and first child
        const trunkX = startX + Math.max(10, Math.min(gap * 0.45, 28));

        const childMids = children.map((c) => c.y + c.height / 2);
        const busTop = Math.min(startY, ...childMids);
        const busBottom = Math.max(startY, ...childMids);

        return (
          <g key={group.parentId}>
            {/* Stub out of the parent */}
            <path
              d={`M ${startX} ${startY} H ${trunkX}`}
              fill="none"
              strokeWidth={1.5}
              className="stroke-neutral-300"
            />

            {/* Vertical bus when children span different Y */}
            {busBottom - busTop > 1 ? (
              <path
                d={`M ${trunkX} ${busTop} V ${busBottom}`}
                fill="none"
                strokeWidth={1.5}
                className="stroke-neutral-300"
              />
            ) : null}

            {/* Horizontal into each child */}
            {children.map((child) => {
              const endX = child.x;
              const endY = child.y + child.height / 2;
              return (
                <path
                  key={`${group.parentId}-${child.id}`}
                  d={`M ${trunkX} ${endY} H ${endX}`}
                  fill="none"
                  strokeWidth={1.5}
                  className="stroke-neutral-300"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

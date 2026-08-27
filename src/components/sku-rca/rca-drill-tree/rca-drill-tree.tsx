"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  RcaDrillConnectors,
  type RcaDrillNodeRect,
} from "@/components/sku-rca/rca-drill-tree/rca-drill-connectors";
import { RcaDrillNodeCard } from "@/components/sku-rca/rca-drill-tree/rca-drill-node-card";
import {
  layoutRcaDrillGrid,
  layoutRcaDrillTree,
  RCA_DRILL_CARD_WIDTH,
  RCA_DRILL_COLUMN_STEP,
  RCA_DRILL_FAN_GAP,
  type RcaDrillGridLayout,
  type RcaDrillNodePlacement,
  type RcaDrillTreeData,
} from "@/lib/mock-rca-drill-tree";

const PADDING_X = 8;
const PADDING_Y = 8;

type RcaDrillTreeProps = {
  data: RcaDrillTreeData;
};

function leftForPlacement({ depth, hIndex = 0 }: RcaDrillNodePlacement): number {
  return (
    PADDING_X +
    depth * RCA_DRILL_COLUMN_STEP +
    hIndex * (RCA_DRILL_CARD_WIDTH + RCA_DRILL_FAN_GAP)
  );
}

/** Nudge nodes down when horizontal bands overlap; repeat until stable. */
function resolveColumnOverlaps(
  placements: RcaDrillNodePlacement[],
  heights: Map<string, number>,
): Map<string, number> {
  const tops = new Map(placements.map((p) => [p.node.id, p.top + PADDING_Y]));
  let changed = true;
  let passes = 0;

  while (changed && passes < 8) {
    changed = false;
    passes += 1;

    for (let i = 0; i < placements.length; i += 1) {
      for (let j = i + 1; j < placements.length; j += 1) {
        const a = placements[i];
        const b = placements[j];

        const aLeft = leftForPlacement(a);
        const bLeft = leftForPlacement(b);
        const horizontalOverlap =
          aLeft < bLeft + RCA_DRILL_CARD_WIDTH &&
          aLeft + RCA_DRILL_CARD_WIDTH > bLeft;
        if (!horizontalOverlap) continue;

        const aTop = tops.get(a.node.id) ?? 0;
        const bTop = tops.get(b.node.id) ?? 0;
        const aHeight = heights.get(a.node.id) ?? 52;
        const bHeight = heights.get(b.node.id) ?? 52;
        const minGap = 8;

        if (aTop <= bTop && bTop < aTop + aHeight + minGap) {
          tops.set(b.node.id, aTop + aHeight + minGap);
          changed = true;
        } else if (bTop < aTop && aTop < bTop + bHeight + minGap) {
          tops.set(a.node.id, bTop + bHeight + minGap);
          changed = true;
        }
      }
    }
  }

  return tops;
}

/** Horizontal causal tree on a compact grid — no overlap, minimal vertical space. */
export function RcaDrillTree({ data }: RcaDrillTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [rects, setRects] = useState<Map<string, RcaDrillNodeRect>>(new Map());
  const [nodeTops, setNodeTops] = useState<Map<string, number>>(new Map());

  const grid = useMemo<RcaDrillGridLayout>(
    () => layoutRcaDrillGrid(data.root),
    [data.root],
  );

  const { edges } = useMemo(
    () => layoutRcaDrillTree(data.root),
    [data.root],
  );

  const canvasWidth = grid.width + PADDING_X * 2;

  const registerRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  }, []);

  const measureAndResolve = useCallback(() => {
    const heights = new Map<string, number>();
    for (const [id, el] of nodeRefs.current.entries()) {
      heights.set(id, el.getBoundingClientRect().height);
    }

    const resolvedTops = resolveColumnOverlaps(grid.placements, heights);
    setNodeTops(resolvedTops);

    const nextRects = new Map<string, RcaDrillNodeRect>();
    for (const placement of grid.placements) {
      const id = placement.node.id;
      const height = heights.get(id) ?? 52;
      nextRects.set(id, {
        id,
        x: leftForPlacement(placement),
        y: resolvedTops.get(id) ?? placement.top + PADDING_Y,
        width: RCA_DRILL_CARD_WIDTH,
        height,
      });
    }
    setRects(nextRects);
  }, [grid.placements]);

  useEffect(() => {
    const frame = requestAnimationFrame(measureAndResolve);
    const container = containerRef.current;
    if (!container) return () => cancelAnimationFrame(frame);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measureAndResolve);
    });
    observer.observe(container);
    for (const el of nodeRefs.current.values()) observer.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [grid.placements, measureAndResolve]);

  const resolvedCanvasHeight = useMemo(() => {
    let maxBottom = PADDING_Y;
    for (const placement of grid.placements) {
      const top = nodeTops.get(placement.node.id) ?? placement.top + PADDING_Y;
      const height = rects.get(placement.node.id)?.height ?? 52;
      maxBottom = Math.max(maxBottom, top + height);
    }
    return maxBottom + PADDING_Y;
  }, [grid.placements, nodeTops, rects]);

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 rounded-sm bg-neutral-25"
      style={{
        width: canvasWidth,
        height: resolvedCanvasHeight,
        minWidth: canvasWidth,
      }}
    >
      <RcaDrillConnectors
        edges={edges}
        rects={rects}
        width={canvasWidth}
        height={resolvedCanvasHeight}
      />

      {grid.placements.map((placement) => (
        <div
          key={placement.node.id}
          className="absolute"
          style={{
            left: leftForPlacement(placement),
            top: nodeTops.get(placement.node.id) ?? placement.top + PADDING_Y,
          }}
        >
          <RcaDrillNodeCard node={placement.node} registerRef={registerRef} />
        </div>
      ))}
    </div>
  );
}

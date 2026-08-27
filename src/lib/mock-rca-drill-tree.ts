export type RcaDrillDeltaTone = "negative" | "positive" | "neutral";

export type RcaDrillDetailLine = {
  label: string;
  prior: string;
  current: string;
};

export type RcaDrillNode = {
  id: string;
  label: string;
  /** Current absolute metric — shown first, prominent */
  absoluteValue: string;
  /** Period change — smaller, color-coded beside absolute */
  changePercent?: string;
  deltaTone: RcaDrillDeltaTone;
  /** Marks the main causal chain (layout / connectors only) */
  isPrimaryPath?: boolean;
  footnote?: string;
  detailLines?: RcaDrillDetailLine[];
  children?: RcaDrillNode[];
};

export type RcaDrillTreeData = {
  headline: string;
  rootMetricLabel: string;
  root: RcaDrillNode;
};

/** Shared traffic → paid → ad spend → keyword chain (Examples 1 & 2). */
function buildTrafficChain(): RcaDrillNode {
  return {
    id: "traffic",
    label: "Traffic",
    absoluteValue: "4.9M",
    changePercent: "−15%",
    deltaTone: "negative",
    isPrimaryPath: true,
    children: [
      {
        id: "paid-traffic",
        label: "Paid traffic",
        absoluteValue: "820K",
        changePercent: "−40%",
        deltaTone: "negative",
        isPrimaryPath: true,
        children: [
          {
            id: "ad-spends",
            label: "Ad spends",
            absoluteValue: "$483",
            changePercent: "−50%",
            deltaTone: "negative",
            isPrimaryPath: true,
            footnote: "3 important keywords",
            children: [
              {
                id: "keyword-1",
                label: "Keyword 1",
                absoluteValue: "$20",
                changePercent: "−80%",
                deltaTone: "negative",
                isPrimaryPath: true,
              },
              {
                id: "keyword-2",
                label: "Keyword 2",
                absoluteValue: "$15",
                changePercent: "−81%",
                deltaTone: "negative",
                isPrimaryPath: true,
              },
              {
                id: "keyword-3",
                label: "Keyword 3",
                absoluteValue: "$10",
                changePercent: "−83%",
                deltaTone: "negative",
                isPrimaryPath: true,
              },
            ],
          },
        ],
      },
    ],
  };
}

/** Example 1 — traffic-driven sales drop; Conversion & ASP unchanged. */
function buildExample1Tree(): RcaDrillTreeData {
  return {
    headline:
      "Sales drop is **traffic driven**, primarily due to **ad spend reduction** on **3 keywords**.",
    rootMetricLabel: "Sales",
    root: {
      id: "sales",
      label: "Sales",
      absoluteValue: "$114K",
      changePercent: "−5%",
      deltaTone: "negative",
      isPrimaryPath: true,
      children: [
        buildTrafficChain(),
        {
          id: "conversion",
          label: "Conversion",
          absoluteValue: "3.4%",
          deltaTone: "neutral",
        },
        {
          id: "asp",
          label: "ASP",
          absoluteValue: "$135",
          deltaTone: "neutral",
        },
      ],
    },
  };
}

/** Example 2 — traffic chain plus conversion/ASP/promo branch. */
function buildExample2Tree(): RcaDrillTreeData {
  return {
    headline:
      "Sales drop is mostly **traffic-driven** (**ad spend cuts**), partially offset by **conversion lift** tied to a lower **ASP** from a **new promo**.",
    rootMetricLabel: "Sales",
    root: {
      id: "sales",
      label: "Sales",
      absoluteValue: "$112K",
      changePercent: "−2%",
      deltaTone: "negative",
      isPrimaryPath: true,
      children: [
        buildTrafficChain(),
        {
          id: "conversion",
          label: "Conversion",
          absoluteValue: "3.5%",
          changePercent: "+5%",
          deltaTone: "positive",
          footnote:
            "Historical pattern: ~5% conversion upside when ASP drops ~$20",
        },
        {
          id: "asp",
          label: "ASP",
          absoluteValue: "$130",
          changePercent: "−13%",
          deltaTone: "negative",
          children: [
            {
              id: "promo-started",
              label: "Promo started",
              absoluteValue: "Active",
              changePercent: "New",
              deltaTone: "neutral",
            },
          ],
        },
      ],
    },
  };
}

/** Pick drill tree mock by SKU — s1 = Example 1, s2 = Example 2, else fallback. */
export function getRcaDrillTreeForSku(skuId: string): RcaDrillTreeData {
  if (skuId === "s2") return buildExample2Tree();
  return buildExample1Tree();
}

/** Flatten tree into depth columns for horizontal layout. */
export type RcaDrillColumn = {
  depth: number;
  nodes: RcaDrillNode[];
};

export type RcaDrillEdge = {
  parentId: string;
  childId: string;
  isPrimaryPath: boolean;
};

export function layoutRcaDrillTree(root: RcaDrillNode): {
  columns: RcaDrillColumn[];
  edges: RcaDrillEdge[];
} {
  const columns: RcaDrillColumn[] = [{ depth: 0, nodes: [root] }];
  const edges: RcaDrillEdge[] = [];

  function walk(node: RcaDrillNode, depth: number) {
    const children = node.children ?? [];
    if (children.length === 0) return;

    const nextDepth = depth + 1;
    let column = columns.find((c) => c.depth === nextDepth);
    if (!column) {
      column = { depth: nextDepth, nodes: [] };
      columns.push(column);
    }

    for (const child of children) {
      column.nodes.push(child);
      edges.push({
        parentId: node.id,
        childId: child.id,
        isPrimaryPath: Boolean(node.isPrimaryPath && child.isPrimaryPath),
      });
      walk(child, nextDepth);
    }
  }

  walk(root, 0);
  return { columns, edges };
}

export type RcaDrillNodePlacement = {
  node: RcaDrillNode;
  depth: number;
  /** Pixel offset from canvas top (before outer padding) */
  top: number;
  /** Sibling leaves on one row, spread horizontally */
  hIndex?: number;
};

export type RcaDrillGridLayout = {
  placements: RcaDrillNodePlacement[];
  height: number;
  width: number;
};

/** Grid unit sizes — keep in sync with card component. */
export const RCA_DRILL_CARD_WIDTH = 148;
export const RCA_DRILL_CARD_HEIGHT = 52;
export const RCA_DRILL_CARD_HEIGHT_FOOTNOTE = 84;
export const RCA_DRILL_NODE_GAP = 8;
export const RCA_DRILL_FAN_GAP = 6;
export const RCA_DRILL_COLUMN_STEP = 160;

function estimateNodeHeight(node: RcaDrillNode): number {
  return node.footnote ? RCA_DRILL_CARD_HEIGHT_FOOTNOTE : RCA_DRILL_CARD_HEIGHT;
}

function isLeafNode(node: RcaDrillNode): boolean {
  return !(node.children?.length ?? 0);
}

type SubtreeLayout = {
  height: number;
  placements: RcaDrillNodePlacement[];
};

/**
 * Compact horizontal-tree grid:
 * - Single-child chains share one vertical band (no wasted rows).
 * - Sibling subtrees stack with NODE_GAP (no overlap).
 * - Leaf siblings fan horizontally on one row.
 * - Each parent centers vertically on its subtree block.
 */
function layoutSubtree(node: RcaDrillNode, depth: number): SubtreeLayout {
  const children = node.children ?? [];
  const selfHeight = estimateNodeHeight(node);

  if (children.length === 0) {
    return {
      height: selfHeight,
      placements: [{ node, depth, top: 0 }],
    };
  }

  if (children.every(isLeafNode)) {
    const bandHeight = Math.max(
      selfHeight,
      ...children.map((child) => estimateNodeHeight(child)),
    );
    return {
      height: bandHeight,
      placements: [
        { node, depth, top: 0 },
        ...children.map((child, index) => ({
          node: child,
          depth: depth + 1,
          top: 0,
          hIndex: index,
        })),
      ],
    };
  }

  const childLayouts = children.map((child) => layoutSubtree(child, depth + 1));
  let stackCursor = 0;
  const childPlacements: RcaDrillNodePlacement[] = [];

  for (const childLayout of childLayouts) {
    for (const placement of childLayout.placements) {
      childPlacements.push({
        ...placement,
        top: placement.top + stackCursor,
      });
    }
    stackCursor += childLayout.height + RCA_DRILL_NODE_GAP;
  }

  const blockHeight = Math.max(0, stackCursor - RCA_DRILL_NODE_GAP);
  const parentTop = Math.max(0, (blockHeight - selfHeight) / 2);
  const totalHeight = Math.max(blockHeight, parentTop + selfHeight);

  return {
    height: totalHeight,
    placements: [{ node, depth, top: parentTop }, ...childPlacements],
  };
}

/** Layout full tree on a compact grid; returns pixel positions + canvas size. */
export function layoutRcaDrillGrid(root: RcaDrillNode): RcaDrillGridLayout {
  const { height, placements } = layoutSubtree(root, 0);

  let maxRight = RCA_DRILL_CARD_WIDTH;
  for (const { depth, hIndex = 0 } of placements) {
    const left = depth * RCA_DRILL_COLUMN_STEP + hIndex * (RCA_DRILL_CARD_WIDTH + RCA_DRILL_FAN_GAP);
    maxRight = Math.max(maxRight, left + RCA_DRILL_CARD_WIDTH);
  }

  return {
    placements,
    height,
    width: maxRight,
  };
}

/** @deprecated Use layoutRcaDrillGrid — kept for edge extraction compatibility */
export type RcaDrillNodePosition = RcaDrillNodePlacement & { row: number };

export function computeRcaDrillPositions(root: RcaDrillNode): RcaDrillNodePosition[] {
  const grid = layoutRcaDrillGrid(root);
  return grid.placements.map((p) => ({ ...p, row: p.top }));
}

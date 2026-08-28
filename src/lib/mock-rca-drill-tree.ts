export type RcaDrillDeltaTone = "negative" | "positive" | "neutral";

export type RcaDrillNode = {
  id: string;
  /** Italic purple — causal link from parent (“why this followed”) */
  context?: string;
  /** Metric outcome — wrap change values in **markdown** for color */
  headline: string;
  deltaTone: RcaDrillDeltaTone;
  /** Marks the main causal chain (layout / connectors only) */
  isPrimaryPath?: boolean;
  children?: RcaDrillNode[];
};

export type RcaDrillTreeData = {
  headline: string;
  rootMetricLabel: string;
  root: RcaDrillNode;
};

/** Shared traffic → paid → ad spend → keyword chain (Examples 1 & 2). */
function buildTrafficChain(conversionAspFlat: boolean): RcaDrillNode {
  const trafficContext = conversionAspFlat
    ? "conversion and ASP held flat — the sales drop is traffic-driven"
    : "traffic fell while conversion and ASP moved — primary drag is still paid traffic";

  return {
    id: "traffic",
    context: trafficContext,
    headline: "Traffic down **15%** WoW",
    deltaTone: "negative",
    isPrimaryPath: true,
    children: [
      {
        id: "paid-traffic",
        context: "the traffic loss concentrated in paid sessions",
        headline: "Paid traffic down **40%** WoW",
        deltaTone: "negative",
        isPrimaryPath: true,
        children: [
          {
            id: "ad-spends",
            context: "paid clicks fell after sponsored spend was cut",
            headline: "Ad spend on 3 important keywords down **50%**",
            deltaTone: "negative",
            isPrimaryPath: true,
            children: [
              {
                id: "keyword-1",
                context: "budget pulled from this high-intent keyword",
                headline: "Keyword 1 spend cut from **$100** to **$20**",
                deltaTone: "negative",
                isPrimaryPath: true,
              },
              {
                id: "keyword-2",
                context: "budget pulled from this high-intent keyword",
                headline: "Keyword 2 spend cut from **$80** to **$15**",
                deltaTone: "negative",
                isPrimaryPath: true,
              },
              {
                id: "keyword-3",
                context: "budget pulled from this high-intent keyword",
                headline: "Keyword 3 spend cut from **$60** to **$10**",
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
      headline: "Sales down **5%** WoW (conversion & ASP unchanged)",
      deltaTone: "negative",
      isPrimaryPath: true,
      children: [
        buildTrafficChain(true),
        {
          id: "conversion",
          context: "not driving the gap — held steady vs prior week",
          headline: "Conversion unchanged",
          deltaTone: "neutral",
        },
        {
          id: "asp",
          context: "not driving the gap — held steady vs prior week",
          headline: "ASP unchanged",
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
      headline: "Sales down **2%** WoW",
      deltaTone: "negative",
      isPrimaryPath: true,
      children: [
        buildTrafficChain(false),
        {
          id: "conversion",
          context:
            "lower ASP lifted purchase rate — historically ~5% conv upside when ASP drops ~$20",
          headline: "Conversion up **5%** WoW",
          deltaTone: "positive",
        },
        {
          id: "asp",
          context: "promo pricing pulled average selling price down",
          headline: "ASP down from **$150** to **$130**",
          deltaTone: "negative",
          children: [
            {
              id: "promo-started",
              context: "a new promotional period started on shelf",
              headline: "Promo started",
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
export const RCA_DRILL_CARD_WIDTH = 184;
export const RCA_DRILL_NODE_GAP = 8;
export const RCA_DRILL_FAN_GAP = 12;
export const RCA_DRILL_COLUMN_STEP = 220;

function estimateNodeHeight(node: RcaDrillNode): number {
  if (!node.context) return 52;
  const lines = node.headline.length > 42 ? 2 : 1;
  return lines > 1 ? 88 : 72;
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
    const childHeights = children.map((child) => estimateNodeHeight(child));
    const stagger = children.length > 1 ? 18 : 0;
    const halfSpan = ((children.length - 1) / 2) * stagger;
    const bandHeight = Math.max(
      selfHeight,
      halfSpan * 2 + Math.max(...childHeights, selfHeight),
    );
    const parentTop = Math.max(0, (bandHeight - selfHeight) / 2);

    return {
      height: bandHeight,
      placements: [
        { node, depth, top: parentTop },
        ...children.map((child, index) => {
          const childHeight = childHeights[index] ?? 72;
          const centerY = bandHeight / 2 + (index - (children.length - 1) / 2) * stagger;
          return {
            node: child,
            depth: depth + 1,
            top: Math.max(0, centerY - childHeight / 2),
            hIndex: index,
          };
        }),
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
    const left =
      depth * RCA_DRILL_COLUMN_STEP + hIndex * (RCA_DRILL_CARD_WIDTH + RCA_DRILL_FAN_GAP);
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

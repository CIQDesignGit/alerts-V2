/**
 * Ordered Product Sales (OPS) helpers for Alerts lists.
 * Prototype only — real OPS would come from the backend.
 *
 * Mock lists keep their existing issue/SKU order; we stamp opsDollars so
 * each left-pane list already reads high → low (no re-sort).
 */

type OpsSku = { asin: string; opsDollars?: number };

/** Split a total into n decreasing amounts (weights n … 1). Sum stays exact. */
export function distributeDescending(total: number, count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [Math.round(total)];

  const weights = Array.from({ length: count }, (_, i) => count - i);
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  const rounded = weights.map((w) => Math.round((total * w) / weightSum));
  const drift = Math.round(total) - rounded.reduce((sum, v) => sum + v, 0);
  rounded[0] = (rounded[0] ?? 0) + drift;
  return rounded;
}

/** Stable fallback when a SKU has no painted opsDollars yet. */
function hashOpsDollars(asin: string): number {
  let hash = 0;
  for (const ch of asin) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return 130_000 + (hash % 80_000);
}

/** Mock 30-day OPS for a SKU — prefers explicit opsDollars when present. */
export function skuOpsDollars(sku: OpsSku): number {
  if (typeof sku.opsDollars === "number") return sku.opsDollars;
  return hashOpsDollars(sku.asin);
}

export function sumOpsDollars(skus: OpsSku[]): number {
  return skus.reduce((sum, sku) => sum + skuOpsDollars(sku), 0);
}

/**
 * Issue / category header total.
 * Mock lists often show skuCount larger than the SKUs we actually store —
 * scale the listed average up so the header matches the count.
 */
export function rolledUpOpsDollars(
  skus: OpsSku[],
  skuCount: number,
): number {
  const listed = sumOpsDollars(skus);
  if (skuCount <= skus.length || skus.length === 0) return listed;
  return Math.round((listed / skus.length) * skuCount);
}

/**
 * Stamp decreasing opsDollars onto SKUs in their current order.
 * `targetRollup` is what rolledUpOpsDollars(skus, skuCount) should show.
 */
export function withDescendingSkuOps<T extends OpsSku>(
  skus: T[],
  targetRollup: number,
  skuCount = skus.length,
): T[] {
  if (skus.length === 0) return skus;

  const listedTotal =
    skuCount > skus.length
      ? Math.round((targetRollup * skus.length) / skuCount)
      : Math.round(targetRollup);

  const parts = distributeDescending(
    Math.max(skus.length * 40_000, listedTotal),
    skus.length,
  );

  return skus.map((sku, i) => ({
    ...sku,
    opsDollars: parts[i] ?? skuOpsDollars(sku),
  }));
}

/**
 * Paint every issue’s SKU rows so OPS decreases down the list,
 * and issue headers decrease in sidebarOrder.
 */
export function paintIssueAlertsOps<
  T extends { issueKey: string; skus: OpsSku[]; skuCount: number },
>(alerts: T[], sidebarOrder: string[]): T[] {
  // Keep totals in the same ballpark as before (~$0.3M–$1.0M per issue)
  const topHeader = 990_000;
  const headerStep = 55_000;

  return alerts.map((issue) => {
    const rank = sidebarOrder.indexOf(issue.issueKey);
    const issueRank = rank >= 0 ? rank : sidebarOrder.length;
    const targetRollup = Math.max(220_000, topHeader - issueRank * headerStep);

    return {
      ...issue,
      skus: withDescendingSkuOps(issue.skus, targetRollup, issue.skuCount),
    };
  });
}

type TaxonomyOpsNode = {
  level: string;
  opsDollars: number;
  children: TaxonomyOpsNode[];
  skus?: OpsSku[];
};

/**
 * After a taxonomy tree is built (order already final), rewrite opsDollars
 * so each sibling list is strictly descending and parents = sum of children.
 */
export function paintTaxonomyOpsDescending<T extends TaxonomyOpsNode>(
  root: T,
): T {
  function paint(node: T): T {
    if (node.children.length === 0) {
      return node;
    }

    const paintedChildren = node.children.map((child) =>
      paint(child as T),
    ) as T["children"];

    const childrenAreSkus = paintedChildren.every((c) => c.level === "sku");

    if (childrenAreSkus) {
      // High → low ladder on SKU rows (same order as gap sort)
      const top = 210_000;
      const step = 12_000;
      const ladder = paintedChildren.map((_, i) =>
        Math.max(48_000, top - i * step),
      );
      const children = paintedChildren.map((child, i) => ({
        ...child,
        opsDollars: ladder[i] ?? child.opsDollars,
      }));
      const opsDollars = children.reduce((sum, c) => sum + c.opsDollars, 0);
      const skus = node.skus?.map((sku, i) => ({
        ...sku,
        opsDollars: children[i]?.opsDollars ?? skuOpsDollars(sku),
      }));
      return { ...node, children, opsDollars, skus };
    }

    // Brand / category siblings: scale each subtree onto a descending total
    const targets = distributeDescending(
      Math.max(400_000 * paintedChildren.length, 2_400_000),
      paintedChildren.length,
    );

    const children = paintedChildren.map((child, i) => {
      const target = targets[i] ?? child.opsDollars;
      const current = child.opsDollars || 1;
      return scaleOpsTree(child, target / current);
    });

    const opsDollars = children.reduce((sum, c) => sum + c.opsDollars, 0);
    return { ...node, children, opsDollars };
  }

  return paint(root);
}

/** Multiply every opsDollars in a subtree (keeps relative order inside). */
function scaleOpsTree<T extends TaxonomyOpsNode>(node: T, factor: number): T {
  const children = node.children.map((c) =>
    scaleOpsTree(c as T, factor),
  ) as T["children"];
  const opsDollars = Math.max(1, Math.round(node.opsDollars * factor));
  const skus = node.skus?.map((sku) => ({
    ...sku,
    opsDollars: Math.max(1, Math.round(skuOpsDollars(sku) * factor)),
  }));
  return { ...node, children, opsDollars, skus };
}

/** Compact sales amount — $33.0M, $162.4K, $840. No +/− (OPS is not a gap). */
export function formatOpsDollars(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(1)}K`;
  return `$${abs.toLocaleString()}`;
}

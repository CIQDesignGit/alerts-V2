"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import {
  formatGapDollars,
  type HierarchyNode,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type HierarchyTreeProps = {
  node: HierarchyNode;
  depth?: number;
  selectedId: string;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  /** Open the left-rail SKU list for this parent */
  onViewAllSkus: (parentId: string) => void;
};

/** True when this node opens the SKU list (not tree-expand). */
export function isSkuParent(node: HierarchyNode): boolean {
  const kids = node.children ?? [];
  // Empty subcategory = SKU list ready (may have 0 SKUs for now)
  if (kids.length === 0) return node.level === "subcategory";
  return kids.every((c) => c.level === "sku");
}

function depthPad(depth: number) {
  if (depth <= 0) return "pl-3";
  if (depth === 1) return "pl-6";
  if (depth === 2) return "pl-9";
  if (depth === 3) return "pl-12";
  return "pl-14";
}

export function HierarchyTree({
  node,
  depth = 0,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  onViewAllSkus,
}: HierarchyTreeProps) {
  const skuParent = isSkuParent(node);
  const treeChildren = (node.children ?? []).filter((c) => c.level !== "sku");
  const hasTreeChildren = treeChildren.length > 0;
  const expanded = expandedIds.has(node.id);
  const selected = selectedId === node.id;
  const positive = node.gapDollars > 0;

  return (
    <>
      {skuParent ? (
        // One card: parent row + smaller “View All SKUs” at the same indent
        <div
          className={cn(
            "border-l-2",
            selected
              ? "border-l-primary bg-brand-100/60"
              : "border-l-transparent hover:bg-neutral-100",
          )}
        >
          <button
            type="button"
            onClick={() => onSelect(node.id)}
            className={cn(
              "flex w-full items-center gap-1 py-2 pr-3 text-left text-sm",
              depthPad(depth),
              selected
                ? "font-semibold text-primary"
                : "text-foreground",
            )}
          >
            <span className="size-3.5 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">{node.name}</span>
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                positive ? "text-success-600" : "text-error-600",
              )}
            >
              {formatGapDollars(node.gapDollars)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(node.id);
              onViewAllSkus(node.id);
            }}
            className={cn(
              "flex w-full items-center gap-1 pb-2 text-left text-xs font-medium text-primary hover:underline",
              depthPad(depth),
            )}
          >
            <span className="size-3.5 shrink-0" aria-hidden />
            View All SKUs
            <span className="font-mono text-2xs font-normal text-muted-foreground">
              ({node.children?.length ?? 0})
            </span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            onSelect(node.id);
            if (hasTreeChildren) onToggle(node.id);
          }}
          className={cn(
            "flex w-full items-center gap-1 border-l-2 py-2 pr-3 text-left text-sm",
            depthPad(depth),
            selected
              ? "border-l-primary bg-brand-100/60 font-semibold text-primary"
              : "border-l-transparent text-foreground hover:bg-neutral-100",
          )}
        >
          {hasTreeChildren ? (
            expanded ? (
              <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
            )
          ) : (
            <span className="size-3.5 shrink-0" />
          )}
          <span className="min-w-0 flex-1 truncate">{node.name}</span>
          <span
            className={cn(
              "font-mono text-xs font-semibold",
              positive ? "text-success-600" : "text-error-600",
            )}
          >
            {formatGapDollars(node.gapDollars)}
          </span>
        </button>
      )}

      {hasTreeChildren &&
        expanded &&
        treeChildren.map((child) => (
          <HierarchyTree
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={onSelect}
            onToggle={onToggle}
            onViewAllSkus={onViewAllSkus}
          />
        ))}
    </>
  );
}

export function findHierarchyNode(
  node: HierarchyNode,
  id: string,
): HierarchyNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findHierarchyNode(child, id);
    if (found) return found;
  }
  return null;
}

/** Parent of a node in the hierarchy (for SKU back navigation). */
export function findHierarchyParent(
  root: HierarchyNode,
  id: string,
): HierarchyNode | null {
  for (const child of root.children ?? []) {
    if (child.id === id) return root;
    const found = findHierarchyParent(child, id);
    if (found) return found;
  }
  return null;
}

/** Brand node by display name (Alerts filter uses names). */
export function findBrandByName(
  root: HierarchyNode,
  brandName: string,
): HierarchyNode | null {
  return (
    (root.children ?? []).find(
      (c) => c.level === "brand" && c.name === brandName,
    ) ?? null
  );
}

/**
 * Find an Insights SKU node by product name.
 * Alert SKUs use ids like "s1"; hierarchy uses "sku-av970" — name is the bridge.
 */
export function findHierarchySkuByName(
  root: HierarchyNode,
  skuName: string,
): HierarchyNode | null {
  const target = skuName.trim().toLowerCase();
  if (!target) return null;

  function walk(node: HierarchyNode): HierarchyNode | null {
    if (node.level === "sku" && node.name.toLowerCase() === target) {
      return node;
    }
    for (const child of node.children ?? []) {
      const found = walk(child);
      if (found) return found;
    }
    return null;
  }

  return walk(root);
}

/** Category (or nested) under a brand by display name. */
export function findCategoryByName(
  brandNode: HierarchyNode,
  categoryName: string,
): HierarchyNode | null {
  for (const child of brandNode.children ?? []) {
    if (child.level === "category" && child.name === categoryName) return child;
    for (const grand of child.children ?? []) {
      if (grand.level === "category" && grand.name === categoryName) return grand;
    }
  }
  return null;
}

/** Collect ancestor ids from root → node (inclusive) for expand path. */
export function hierarchyPathIds(
  root: HierarchyNode,
  targetId: string,
): string[] {
  function walk(node: HierarchyNode, trail: string[]): string[] | null {
    const next = [...trail, node.id];
    if (node.id === targetId) return next;
    for (const child of node.children ?? []) {
      const found = walk(child, next);
      if (found) return found;
    }
    return null;
  }
  return walk(root, []) ?? [root.id];
}

/** Nodes from root → target (inclusive) for Insights breadcrumbs. */
export function hierarchyPath(
  root: HierarchyNode,
  targetId: string,
): HierarchyNode[] {
  function walk(
    node: HierarchyNode,
    trail: HierarchyNode[],
  ): HierarchyNode[] | null {
    const next = [...trail, node];
    if (node.id === targetId) return next;
    for (const child of node.children ?? []) {
      const found = walk(child, next);
      if (found) return found;
    }
    return null;
  }
  return walk(root, []) ?? [root];
}

"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import type { AlertsTaxonomyNode } from "@/lib/mock-alerts-insights";
import { cn, controlFocusClass } from "@/lib/utils";

/** Same cap as Issue Type expanded SKU lists before “View all” */
const VISIBLE_SKU_LIMIT = 5;

type AlertsTaxonomyTreeProps = {
  root: AlertsTaxonomyNode;
  selectedId: string;
  selectedSkuId: string | null;
  expandedIds: Set<string>;
  onSelectNode: (node: AlertsTaxonomyNode) => void;
  onToggle: (id: string) => void;
};

function depthPad(depth: number) {
  if (depth <= 0) return "pl-1";
  if (depth === 1) return "pl-4";
  if (depth === 2) return "pl-7";
  return "pl-10";
}

function metadataLine(node: AlertsTaxonomyNode): string {
  if (node.level === "overall") {
    const brands = node.brandCount ?? 0;
    return `${brands} brand${brands === 1 ? "" : "s"} · ${node.skuCount} SKUs`;
  }
  if (node.level === "brand") {
    const categories = node.categoryCount ?? 0;
    return `${categories} categor${categories === 1 ? "y" : "ies"} · ${node.skuCount} SKUs`;
  }
  if (node.level === "category") {
    return `${node.skuCount} SKU${node.skuCount === 1 ? "" : "s"}`;
  }
  const issues = node.issueCount ?? 1;
  return `${node.asin ?? ""} · ${issues} issue${issues === 1 ? "" : "s"}`;
}

function TaxonomyRow({
  node,
  depth,
  selected,
  expanded,
  onSelect,
  onToggle,
}: {
  node: AlertsTaxonomyNode;
  depth: number;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const hasChildren = node.children.length > 0;
  const isSku = node.level === "sku";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 rounded-lg px-2 py-2.5 transition-colors",
        depthPad(depth),
        selected
          ? "bg-brand-50 ring-1 ring-brand-200/80"
          : "hover:bg-neutral-100/80",
      )}
    >
      {hasChildren ? (
        <button
          type="button"
          aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
          aria-expanded={expanded}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "mt-0.5 shrink-0 rounded p-0.5 text-muted-foreground hover:bg-neutral-200/60",
            controlFocusClass,
          )}
        >
          {expanded ? (
            <ChevronDown className="size-4" aria-hidden />
          ) : (
            <ChevronRight className="size-4" aria-hidden />
          )}
        </button>
      ) : isSku ? (
        <SkuThumbnail
          name={node.name}
          size={32}
          className="mt-0.5 rounded-md"
        />
      ) : (
        <span className="size-4 shrink-0" aria-hidden />
      )}

      <button
        type="button"
        aria-current={selected ? "true" : undefined}
        onClick={onSelect}
        className={cn(
          "min-w-0 flex-1 text-left outline-none",
          controlFocusClass,
        )}
      >
        <span
          className={cn(
            "block text-sm text-foreground",
            selected ? "font-bold" : "font-semibold",
          )}
        >
          {node.name}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {metadataLine(node)}
        </span>
      </button>
    </div>
  );
}

function TaxonomyBranch({
  node,
  depth,
  selectedId,
  selectedSkuId,
  expandedIds,
  onSelectNode,
  onToggle,
}: {
  node: AlertsTaxonomyNode;
  depth: number;
  selectedId: string;
  selectedSkuId: string | null;
  expandedIds: Set<string>;
  onSelectNode: (node: AlertsTaxonomyNode) => void;
  onToggle: (id: string) => void;
}) {
  const expanded = expandedIds.has(node.id);
  const selected =
    selectedSkuId != null
      ? node.level === "sku" && node.skuId === selectedSkuId
      : selectedId === node.id;

  // Brand / category children stay fully listed; only SKU leaves are capped
  const childrenAreSkus =
    node.children.length > 0 && node.children.every((c) => c.level === "sku");
  const skuIdsKey = childrenAreSkus
    ? node.children.map((c) => c.id).join(",")
    : "";

  const [showAllSkus, setShowAllSkus] = useState(false);
  const hasHiddenSkus =
    childrenAreSkus && node.children.length > VISIBLE_SKU_LIMIT;
  const hiddenSkuCount = Math.max(
    node.children.length - VISIBLE_SKU_LIMIT,
    0,
  );

  // Collapse back to top 5 when the SKU set under this parent changes
  useEffect(() => {
    setShowAllSkus(false);
  }, [skuIdsKey]);

  // Keep a selected SKU past #5 visible by expanding the list
  useEffect(() => {
    if (!childrenAreSkus || !selectedSkuId || !hasHiddenSkus) return;
    const selectedIndex = node.children.findIndex(
      (child) => child.skuId === selectedSkuId,
    );
    if (selectedIndex >= VISIBLE_SKU_LIMIT) {
      setShowAllSkus(true);
    }
  }, [childrenAreSkus, selectedSkuId, skuIdsKey, hasHiddenSkus, node.children]);

  const visibleChildren =
    childrenAreSkus && hasHiddenSkus && !showAllSkus
      ? node.children.slice(0, VISIBLE_SKU_LIMIT)
      : node.children;

  return (
    <li className="flex flex-col">
      <TaxonomyRow
        node={node}
        depth={depth}
        selected={selected}
        expanded={expanded}
        onSelect={() => onSelectNode(node)}
        onToggle={() => onToggle(node.id)}
      />

      {expanded && node.children.length > 0 && (
        <ul className="flex flex-col gap-0.5">
          {visibleChildren.map((child) => (
            <TaxonomyBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              selectedSkuId={selectedSkuId}
              expandedIds={expandedIds}
              onSelectNode={onSelectNode}
              onToggle={onToggle}
            />
          ))}
          {hasHiddenSkus && (
            <li>
              <button
                type="button"
                onClick={() => setShowAllSkus((open) => !open)}
                className={cn(
                  "w-full border-t border-border px-3 py-2 text-left text-xs font-medium text-primary hover:underline",
                  depthPad(depth + 1),
                )}
              >
                {showAllSkus ? (
                  "Show less"
                ) : (
                  <>
                    View all SKUs
                    <span className="ml-1 text-2xs font-normal text-muted-foreground">
                      ({hiddenSkuCount} more)
                    </span>
                  </>
                )}
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
}

/** Nested Overall → Brand → Category → SKU tree for taxonomy grouping. */
export function AlertsTaxonomyTree({
  root,
  selectedId,
  selectedSkuId,
  expandedIds,
  onSelectNode,
  onToggle,
}: AlertsTaxonomyTreeProps) {
  return (
    <ul className="flex flex-col gap-0.5">
      <TaxonomyBranch
        node={root}
        depth={0}
        selectedId={selectedId}
        selectedSkuId={selectedSkuId}
        expandedIds={expandedIds}
        onSelectNode={onSelectNode}
        onToggle={onToggle}
      />
    </ul>
  );
}

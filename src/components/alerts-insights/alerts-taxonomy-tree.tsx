"use client";

import { ChevronDown, ChevronRight, Package } from "lucide-react";

import type { AlertsTaxonomyNode } from "@/lib/mock-alerts-insights";
import { cn, controlFocusClass } from "@/lib/utils";

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
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
          <Package className="size-4 text-neutral-500" aria-hidden />
        </span>
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

      {expanded &&
        node.children.map((child) => (
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

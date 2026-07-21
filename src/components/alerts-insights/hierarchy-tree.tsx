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
};

export function HierarchyTree({
  node,
  depth = 0,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: HierarchyTreeProps) {
  const hasChildren = Boolean(node.children?.length);
  const expanded = expandedIds.has(node.id);
  const selected = selectedId === node.id;
  const positive = node.gapDollars > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) onToggle(node.id);
        }}
        className={cn(
          "flex w-full items-center gap-1 border-l-2 py-2 pr-3 text-left text-sm",
          depth === 0 && "pl-3",
          depth === 1 && "pl-6",
          depth === 2 && "pl-9",
          depth === 3 && "pl-12",
          depth >= 4 && "pl-14",
          selected
            ? "border-l-primary bg-brand-100/60 font-semibold text-primary"
            : "border-l-transparent text-foreground hover:bg-neutral-100",
        )}
      >
        {hasChildren ? (
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
      {hasChildren &&
        expanded &&
        node.children!.map((child) => (
          <HierarchyTree
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={onSelect}
            onToggle={onToggle}
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

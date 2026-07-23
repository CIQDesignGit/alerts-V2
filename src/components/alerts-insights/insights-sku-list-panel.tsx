"use client";

import { ArrowLeft } from "lucide-react";

import {
  formatGapDollars,
  type HierarchyNode,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type InsightsSkuListPanelProps = {
  parent: HierarchyNode;
  skus: HierarchyNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  /** When set, empty list means “no matches” instead of “not loaded”. */
  filter?: string;
};

/** Left-rail SKU list — replaces the hierarchy tree until Back. */
export function InsightsSkuListPanel({
  parent,
  skus,
  selectedId,
  onSelect,
  onBack,
  filter = "",
}: InsightsSkuListPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border px-3 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to hierarchy
        </button>
        <p className="mt-1.5 truncate text-xs text-muted-foreground">
          SKUs in {parent.name}
        </p>
        <p className="font-mono text-2xs text-muted-foreground">
          {skus.length} SKUs · sorted by $ Gap
        </p>
      </div>

      <ul className="flex-1 overflow-y-auto py-1">
        {skus.length === 0 ? (
          <li className="px-3 py-6 text-center text-xs text-muted-foreground">
            {filter.trim()
              ? "No SKUs match this filter."
              : `No SKUs loaded for ${parent.name} yet.`}
          </li>
        ) : (
          [...skus]
            .sort((a, b) => a.gapDollars - b.gapDollars)
            .map((sku) => {
              const selected = selectedId === sku.id;
              return (
                <li key={sku.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(sku.id)}
                    className={cn(
                      "flex w-full items-start gap-2 border-l-2 px-3 py-2.5 text-left text-sm",
                      selected
                        ? "border-l-primary bg-brand-100/60 font-semibold text-primary"
                        : "border-l-transparent text-foreground hover:bg-neutral-100",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{sku.name}</span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-xs font-semibold",
                        sku.gapDollars > 0
                          ? "text-success-600"
                          : "text-error-600",
                      )}
                    >
                      {formatGapDollars(sku.gapDollars)}
                    </span>
                  </button>
                </li>
              );
            })
        )}
      </ul>
    </div>
  );
}

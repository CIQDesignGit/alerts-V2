"use client";

import { useMemo, useState } from "react";

import { ConfigureLevels } from "@/components/alerts-insights/configure-levels";
import {
  findHierarchyNode,
  HierarchyTree,
} from "@/components/alerts-insights/hierarchy-tree";
import {
  formatGapDollars,
  hierarchyTree,
  sharkBrandInsight,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

export function InsightsTab() {
  const [selectedId, setSelectedId] = useState("shark");
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(["biz", "shark"]),
  );
  const [configOpen, setConfigOpen] = useState(false);

  const selected = useMemo(
    () => findHierarchyNode(hierarchyTree, selectedId) ?? hierarchyTree,
    [selectedId],
  );
  const children = selected.children ?? [];

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-neutral-50">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-3">
          <p className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
            Hierarchy
          </p>
          <ConfigureLevels open={configOpen} onOpenChange={setConfigOpen} />
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          <HierarchyTree
            node={hierarchyTree}
            selectedId={selectedId}
            expandedIds={expandedIds}
            onSelect={setSelectedId}
            onToggle={(id) =>
              setExpandedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
              {selected.level} level
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              {selected.name}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-error-100 px-2 py-1 font-mono text-sm font-semibold text-error-700">
              {formatGapDollars(selected.gapDollars)} vs plan
            </span>
            {selected.id === "shark" && (
              <span className="rounded-md bg-neutral-100 px-2 py-1 text-sm text-neutral-700">
                82% attainment
              </span>
            )}
            <div className="flex overflow-hidden rounded-md border border-border">
              <span className="bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                Live
              </span>
              <span className="px-2.5 py-1 text-xs text-muted-foreground">
                Historical
              </span>
            </div>
          </div>
        </div>

        <section className="rounded-lg border border-border border-l-4 border-l-primary bg-brand-50/40 p-4">
          <p className="text-2xs font-semibold tracking-wider text-primary uppercase">
            AI {selected.level} Insights
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            {selected.id === "shark"
              ? sharkBrandInsight
              : `${selected.name} Gap is ${formatGapDollars(selected.gapDollars)}. Drill into child nodes to see drivers.`}
          </p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Show reasoning →
          </button>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-foreground">
            8-week revenue trend
          </h3>
          <div className="mt-2 flex h-36 items-center justify-center rounded-lg border border-dashed border-border bg-neutral-50 text-xs text-muted-foreground">
            [Bar chart with promo event vertical lines]
          </div>
        </section>

        {children.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-foreground">
              Breakdown for this level
            </h3>
            <p className="text-xs text-muted-foreground">
              Click any row to drill down
            </p>
            <div className="mt-2 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-2xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">$ Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((child) => (
                    <tr
                      key={child.id}
                      className="cursor-pointer border-t border-border hover:bg-neutral-50"
                      onClick={() => {
                        setSelectedId(child.id);
                        setExpandedIds((prev) => new Set(prev).add(selected.id));
                      }}
                    >
                      <td
                        className={cn(
                          "border-l-4 px-3 py-2.5 font-medium",
                          child.gapDollars > 0
                            ? "border-l-success-500"
                            : "border-l-error-500",
                        )}
                      >
                        {child.name}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 font-mono font-semibold",
                          child.gapDollars > 0
                            ? "text-success-600"
                            : "text-error-600",
                        )}
                      >
                        {formatGapDollars(child.gapDollars)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <p className="text-2xs text-muted-foreground">
          At SKU level (tree leaf): right panel shows the shared SKU detail page
          (format TBD).
        </p>
      </div>
    </div>
  );
}

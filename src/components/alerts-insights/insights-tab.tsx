"use client";

import { useMemo, useState } from "react";

import { ConfigureLevels } from "@/components/alerts-insights/configure-levels";
import {
  findHierarchyNode,
  HierarchyTree,
  isSkuParent,
} from "@/components/alerts-insights/hierarchy-tree";
import { InsightsHistoricalPanel } from "@/components/alerts-insights/insights-historical-panel";
import { InsightsLivePanel } from "@/components/alerts-insights/insights-live-panel";
import { InsightsModeToggle } from "@/components/alerts-insights/insights-mode-toggle";
import { InsightsSkuListPanel } from "@/components/alerts-insights/insights-sku-list-panel";
import { AllyChatFooter } from "@/components/shared/ally-chat-footer";
import type { InsightsMode } from "@/lib/insights-widgets";
import {
  formatGapDollars,
  getLiveMetrics,
  hierarchyTree,
} from "@/lib/mock-alerts-insights";
import { usePersistedWidgets } from "@/lib/use-persisted-widgets";
import { cn } from "@/lib/utils";

/** Match Alerts filter: name, id/ASIN-like text, or $ gap digits. */
function matchesSkuFilter(
  node: { id: string; name: string; gapDollars: number },
  filter: string,
) {
  if (!filter.trim()) return true;
  const q = filter.toLowerCase();
  return (
    node.name.toLowerCase().includes(q) ||
    node.id.toLowerCase().includes(q) ||
    String(node.gapDollars).includes(q)
  );
}

export function InsightsTab({ filter }: { filter: string }) {
  const [selectedId, setSelectedId] = useState("shark");
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(["biz", "shark"]),
  );
  const [configOpen, setConfigOpen] = useState(false);
  const [mode, setMode] = useState<InsightsMode>("live");
  const [chatExpanded, setChatExpanded] = useState(false);
  // When set, left rail shows SKU list for this parent instead of the tree
  const [skuListParentId, setSkuListParentId] = useState<string | null>(null);

  const selected = useMemo(
    () => findHierarchyNode(hierarchyTree, selectedId) ?? hierarchyTree,
    [selectedId],
  );
  const skuListParent = useMemo(
    () =>
      skuListParentId
        ? findHierarchyNode(hierarchyTree, skuListParentId)
        : null,
    [skuListParentId],
  );
  const children = selected.children ?? [];
  // Live breakdown: for SKU parents show SKUs; tree no longer expands them
  const liveConstituents = (
    isSkuParent(selected)
      ? children
      : children.filter((c) => c.level !== "sku")
  ).filter((c) =>
    c.level === "sku" ? matchesSkuFilter(c, filter) : true,
  );
  const filteredSkuList = useMemo(
    () => (skuListParent?.children ?? []).filter((s) => matchesSkuFilter(s, filter)),
    [skuListParent, filter],
  );
  const liveMetrics = getLiveMetrics(selected);
  const widgetsApi = usePersistedWidgets(selected.id);

  function drillTo(childId: string) {
    const child = findHierarchyNode(hierarchyTree, childId);
    setSelectedId(childId);
    setExpandedIds((prev) => new Set(prev).add(selected.id));
    // Drilling into a SKU opens the dedicated SKU list for its parent
    if (child?.level === "sku" && isSkuParent(selected)) {
      setSkuListParentId(selected.id);
    }
  }

  function openSkuList(parentId: string) {
    setSkuListParentId(parentId);
    setExpandedIds((prev) => new Set(prev).add(parentId));
  }

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-neutral-50">
        {skuListParent ? (
          <InsightsSkuListPanel
            parent={skuListParent}
            skus={filteredSkuList}
            selectedId={selectedId}
            filter={filter}
            onSelect={setSelectedId}
            onBack={() => {
              setSkuListParentId(null);
              setSelectedId(skuListParent.id);
            }}
          />
        ) : (
          <>
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
                onViewAllSkus={openSkuList}
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
          </>
        )}
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col bg-background">
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6",
            chatExpanded ? "pb-36" : "pb-16",
          )}
        >
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
              <span
                className={cn(
                  "rounded-md px-2 py-1 font-mono text-sm font-semibold",
                  selected.gapDollars < 0
                    ? "bg-error-100 text-error-700"
                    : "bg-success-100 text-success-700",
                )}
              >
                {formatGapDollars(selected.gapDollars)} vs plan
              </span>
              <span className="rounded-md bg-neutral-100 px-2 py-1 text-sm text-neutral-700">
                {liveMetrics.attainmentPct}% attainment
              </span>
              <InsightsModeToggle mode={mode} onChange={setMode} />
            </div>
          </div>

          {mode === "live" ? (
            <InsightsLivePanel
              selected={selected}
              constituents={liveConstituents}
              onDrill={drillTo}
            />
          ) : (
            <InsightsHistoricalPanel
              entityName={selected.name}
              widgets={widgetsApi.widgets}
              onAdd={widgetsApi.addWidget}
              onAddSuggestion={widgetsApi.addSuggestion}
              onUpdate={widgetsApi.updateWidget}
              onRemove={widgetsApi.removeWidget}
              onReset={widgetsApi.resetToDefaults}
            />
          )}
        </div>

        <AllyChatFooter
          expanded={chatExpanded}
          onExpandedChange={setChatExpanded}
          collapsedLabel={
            mode === "live"
              ? `Ask AllyAI about ${selected.name}…`
              : `Ask AllyAI about ${selected.name} trends…`
          }
          inputPlaceholder={
            mode === "live"
              ? "Ask about the current state of this level…"
              : "Ask about historical trends, or describe a widget to add…"
          }
        />
      </div>
    </div>
  );
}

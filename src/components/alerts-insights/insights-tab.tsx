"use client";

import { useEffect, useMemo, useState } from "react";

import { ConfigureLevels } from "@/components/alerts-insights/configure-levels";
import {
  findBrandByName,
  findCategoryByName,
  findHierarchyNode,
  findHierarchyParent,
  HierarchyTree,
  hierarchyPathIds,
  isSkuParent,
} from "@/components/alerts-insights/hierarchy-tree";
import { InsightsHistoricalPanel } from "@/components/alerts-insights/insights-historical-panel";
import { InsightsLevelHeader } from "@/components/alerts-insights/insights-level-header";
import { InsightsLivePanel } from "@/components/alerts-insights/insights-live-panel";
import { InsightsSkuListPanel } from "@/components/alerts-insights/insights-sku-list-panel";
import { SkuRca } from "@/components/sku-rca/sku-rca";
import { AllyChatFooter } from "@/components/shared/ally-chat-footer";
import {
  DEFAULT_INSIGHTS_DATE_RANGE,
  type InsightsDateRange,
} from "@/lib/insights-date-range";
import type { InsightsMode } from "@/lib/insights-widgets";
import {
  getLiveMetrics,
  hierarchyTree,
  issueSkuFromHierarchyNode,
  type AlertsFilters,
} from "@/lib/mock-alerts-insights";
import { usePersistedWidgets } from "@/lib/use-persisted-widgets";
import { cn } from "@/lib/utils";

/** SKU match for Brand/Category/SKU bar (same rules as Alerts search). */
function matchesSkuFilters(
  node: { id: string; name: string; gapDollars: number },
  filters: AlertsFilters,
) {
  if (filters.skuId && node.id !== filters.skuId) return false;
  if (!filters.skuQuery.trim()) return true;
  const q = filters.skuQuery.toLowerCase();
  return (
    node.name.toLowerCase().includes(q) ||
    node.id.toLowerCase().includes(q) ||
    String(node.gapDollars).includes(q)
  );
}

function hasActiveFilters(filters: AlertsFilters) {
  return Boolean(
    filters.brand ||
      filters.category ||
      filters.skuId ||
      filters.skuQuery.trim(),
  );
}

export function InsightsTab({ filters }: { filters: AlertsFilters }) {
  const [selectedId, setSelectedId] = useState("shark");
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(["biz", "shark"]),
  );
  const [configOpen, setConfigOpen] = useState(false);
  const [mode, setMode] = useState<InsightsMode>("live");
  const [dateRange, setDateRange] = useState<InsightsDateRange>(
    DEFAULT_INSIGHTS_DATE_RANGE,
  );
  const [chatExpanded, setChatExpanded] = useState(false);
  // When set, left rail shows SKU list for this parent instead of the tree
  const [skuListParentId, setSkuListParentId] = useState<string | null>(null);

  // Jump hierarchy when Brand / Category / SKU filters change
  useEffect(() => {
    if (filters.skuId) {
      const sku = findHierarchyNode(hierarchyTree, filters.skuId);
      const parent = sku
        ? findHierarchyParent(hierarchyTree, filters.skuId)
        : null;
      if (sku && parent) {
        setSelectedId(sku.id);
        setSkuListParentId(parent.id);
        setExpandedIds(new Set(hierarchyPathIds(hierarchyTree, parent.id)));
      }
      return;
    }

    if (filters.brand) {
      const brand = findBrandByName(hierarchyTree, filters.brand);
      if (!brand) return;

      if (filters.category) {
        const category = findCategoryByName(brand, filters.category);
        if (category) {
          setSelectedId(category.id);
          setSkuListParentId(null);
          setExpandedIds(new Set(hierarchyPathIds(hierarchyTree, category.id)));
          return;
        }
      }

      setSelectedId(brand.id);
      setSkuListParentId(null);
      setExpandedIds(new Set(hierarchyPathIds(hierarchyTree, brand.id)));
    }
  }, [filters.brand, filters.category, filters.skuId]);

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

  // Live breakdown: for SKU parents show filtered SKUs; else non-SKU kids
  const liveConstituents = (
    isSkuParent(selected)
      ? children
      : children.filter((c) => c.level !== "sku")
  ).filter((c) =>
    c.level === "sku" ? matchesSkuFilters(c, filters) : true,
  );

  const filteredSkuList = useMemo(
    () =>
      (skuListParent?.children ?? []).filter((s) =>
        matchesSkuFilters(s, filters),
      ),
    [skuListParent, filters],
  );
  const liveMetrics = getLiveMetrics(selected);
  const widgetsApi = usePersistedWidgets(selected.id);

  // Shared leaf with Alerts — full SkuRca, not the level Insights shell
  const selectedSku =
    selected.level === "sku" ? issueSkuFromHierarchyNode(selected) : null;

  function drillTo(childId: string) {
    const child = findHierarchyNode(hierarchyTree, childId);
    setSelectedId(childId);
    setExpandedIds((prev) => new Set(prev).add(selected.id));
    if (child?.level === "sku" && isSkuParent(selected)) {
      setSkuListParentId(selected.id);
    }
  }

  function openSkuList(parentId: string) {
    setSkuListParentId(parentId);
    setExpandedIds((prev) => new Set(prev).add(parentId));
  }

  function backFromSku() {
    const parent = findHierarchyParent(hierarchyTree, selected.id);
    if (parent) setSelectedId(parent.id);
  }

  const filterHint = hasActiveFilters(filters)
    ? filters.skuQuery || "filters"
    : "";

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-neutral-50">
        {skuListParent ? (
          <InsightsSkuListPanel
            parent={skuListParent}
            skus={filteredSkuList}
            selectedId={selectedId}
            filter={filterHint}
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

      {selectedSku ? (
        <SkuRca sku={selectedSku} onClose={backFromSku} />
      ) : (
        <div className="relative flex min-w-0 flex-1 flex-col bg-background">
          {/* Page header — outside scroll body (same pattern as SkuRca) */}
          <InsightsLevelHeader
            name={selected.name}
            gapDollars={selected.gapDollars}
            attainmentPct={liveMetrics.attainmentPct}
            mode={mode}
            onModeChange={setMode}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6",
              chatExpanded ? "pb-36" : "pb-16",
            )}
          >
            {mode === "live" ? (
              <InsightsLivePanel
                selected={selected}
                constituents={liveConstituents}
                dateRange={dateRange}
                onDrill={drillTo}
              />
            ) : (
              <InsightsHistoricalPanel
                entityName={selected.name}
                dateRange={dateRange}
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
                ? "Ask about metrics for this period…"
                : "Ask about issue trends, or describe a widget to add…"
            }
          />
        </div>
      )}
    </div>
  );
}

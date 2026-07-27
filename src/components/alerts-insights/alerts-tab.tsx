"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AlertDetailPanel } from "@/components/alerts-insights/alert-detail-panel";
import { IssueGroupCard } from "@/components/alerts-insights/alert-group-cards";
import { AlertsGroupBySelect } from "@/components/alerts-insights/alerts-group-by-select";
import { AlertsTaxonomyTree } from "@/components/alerts-insights/alerts-taxonomy-tree";
import { SkuDetailPanel } from "@/components/alerts-insights/sku-detail-panel";
import { TaxonomyRcaPanel } from "@/components/alerts-insights/taxonomy-rca-panel";
import {
  buildAlertsTaxonomyTree,
  DEFAULT_ALERTS_TIME_WINDOW,
  defaultTaxonomyExpandedIds,
  defaultTaxonomySelection,
  filterIssueAlerts,
  findIssueForSku,
  findTaxonomyNode,
  issueAlerts,
  issueLabel,
  type AlertsFilters,
  type AlertsGroupBy,
  type AlertsTaxonomyNode,
} from "@/lib/mock-alerts-insights";

export function AlertsTab({
  filters,
  groupBy = "issue",
  onGroupByChange,
}: {
  filters: AlertsFilters;
  groupBy?: AlertsGroupBy;
  onGroupByChange?: (value: AlertsGroupBy) => void;
}) {
  const visibleIssues = useMemo(
    () =>
      filterIssueAlerts(issueAlerts, filters, DEFAULT_ALERTS_TIME_WINDOW),
    [filters],
  );

  const taxonomyTree = useMemo(
    () =>
      buildAlertsTaxonomyTree(
        issueAlerts,
        filters,
        DEFAULT_ALERTS_TIME_WINDOW,
      ),
    [filters],
  );

  const [expandedId, setExpandedId] = useState<string | null>(
    visibleIssues[0]?.issueKey ?? null,
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    visibleIssues[0]?.issueKey ?? "lostBuyBox",
  );
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);

  const [taxonomySelectedId, setTaxonomySelectedId] = useState("overall");
  const [taxonomyExpandedIds, setTaxonomyExpandedIds] = useState<Set<string>>(
    () => new Set(["overall"]),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (groupBy === "issue") {
      const first = visibleIssues[0]?.issueKey ?? null;
      setExpandedId(first);
      setSelectedGroupId(first ?? "");
      setSelectedSkuId(null);
      return;
    }

    if (!taxonomyTree) {
      setTaxonomySelectedId("overall");
      setTaxonomyExpandedIds(new Set(["overall"]));
      setSelectedSkuId(null);
      return;
    }

    setTaxonomySelectedId(defaultTaxonomySelection(taxonomyTree));
    setTaxonomyExpandedIds(defaultTaxonomyExpandedIds(taxonomyTree));
    setSelectedSkuId(null);
  }, [groupBy, filters, visibleIssues, taxonomyTree]);

  const selectedIssue = useMemo(() => {
    if (groupBy !== "issue") return undefined;
    return (
      visibleIssues.find((i) => i.issueKey === selectedGroupId) ??
      visibleIssues[0]
    );
  }, [groupBy, selectedGroupId, visibleIssues]);

  const selectedTaxonomyNode = useMemo(() => {
    if (groupBy !== "category" || !taxonomyTree) return undefined;
    return findTaxonomyNode(taxonomyTree, taxonomySelectedId) ?? taxonomyTree;
  }, [groupBy, taxonomySelectedId, taxonomyTree]);

  const selectedSkuIssue = useMemo(() => {
    if (!selectedSkuId) return undefined;
    if (groupBy === "issue") return selectedIssue;
    return findIssueForSku(selectedSkuId);
  }, [groupBy, selectedIssue, selectedSkuId]);

  const selectedSku = useMemo(() => {
    if (!selectedSkuId || !selectedSkuIssue) return null;
    return selectedSkuIssue.skus.find((s) => s.id === selectedSkuId) ?? null;
  }, [selectedSkuId, selectedSkuIssue]);

  function onGroupCardClick(id: string) {
    setSelectedGroupId(id);
    setSelectedSkuId(null);
    setExpandedId((current) => (current === id ? null : id));
  }

  function selectSku(groupId: string, skuId: string) {
    setSelectedGroupId(groupId);
    setSelectedSkuId(skuId);
    setExpandedId(groupId);
  }

  function onTaxonomySelect(node: AlertsTaxonomyNode) {
    if (node.level === "sku" && node.skuId) {
      setSelectedSkuId(node.skuId);
      setTaxonomySelectedId(node.id);
      return;
    }
    setTaxonomySelectedId(node.id);
    setSelectedSkuId(null);
  }

  function onTaxonomyToggle(id: string) {
    setTaxonomyExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex min-h-0 flex-1">
      {sidebarOpen ? (
        <aside className="flex w-92 shrink-0 flex-col border-r border-border bg-neutral-50">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-100 px-2 text-2xs font-medium text-neutral-600">
                {visibleIssues.length}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {onGroupByChange && (
                <AlertsGroupBySelect
                  value={groupBy}
                  onChange={onGroupByChange}
                />
              )}
              <button
                type="button"
                aria-label="Close alerts panel"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground"
              >
                <PanelLeftClose className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
            {groupBy === "category" && !taxonomyTree && (
              <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                No taxonomy nodes match these filters. Try Clear.
              </p>
            )}

            {groupBy === "issue" ? (
              <ul className="flex flex-1 flex-col gap-2">
                {visibleIssues.length === 0 && (
                  <li className="px-2 py-6 text-center text-xs text-muted-foreground">
                    No alerts match these filters. Try Clear.
                  </li>
                )}
                {visibleIssues.map((issue) => (
                  <IssueGroupCard
                    key={issue.issueKey}
                    issue={issue}
                    open={expandedId === issue.issueKey}
                    groupSelected={
                      selectedGroupId === issue.issueKey && !selectedSkuId
                    }
                    selectedSkuId={selectedSkuId}
                    filter=""
                    onCardClick={() => onGroupCardClick(issue.issueKey)}
                    onSelectSku={(skuId) => selectSku(issue.issueKey, skuId)}
                  />
                ))}
              </ul>
            ) : (
              taxonomyTree && (
                <AlertsTaxonomyTree
                  root={taxonomyTree}
                  selectedId={taxonomySelectedId}
                  selectedSkuId={selectedSkuId}
                  expandedIds={taxonomyExpandedIds}
                  onSelectNode={onTaxonomySelect}
                  onToggle={onTaxonomyToggle}
                />
              )
            )}
          </div>
        </aside>
      ) : (
        <aside className="flex w-11 shrink-0 flex-col border-r border-border bg-neutral-50">
          <div className="flex items-center justify-center border-b border-border bg-background py-3">
            <button
              type="button"
              aria-label="Open alerts panel"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground"
            >
              <PanelLeftOpen className="size-4" aria-hidden />
            </button>
          </div>
        </aside>
      )}

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      {selectedSku && selectedSkuIssue ? (
        <SkuDetailPanel
          sku={selectedSku}
          onBackToAlert={() => setSelectedSkuId(null)}
        />
      ) : groupBy === "issue" && selectedIssue ? (
        <AlertDetailPanel
          group={{
            title: issueLabel(selectedIssue.issueKey),
            feedbackKey: selectedIssue.issueKey,
            skuCount: selectedIssue.skuCount,
            gapDollars: selectedIssue.gapDollars,
            aiSignal: selectedIssue.aiSignal,
            skus: selectedIssue.skus,
          }}
          selectedSkuId={selectedSkuId}
          onSelectSku={(skuId) => selectSku(selectedIssue.issueKey, skuId)}
        />
      ) : groupBy === "category" &&
        selectedTaxonomyNode &&
        selectedTaxonomyNode.level !== "sku" ? (
        <TaxonomyRcaPanel
          node={selectedTaxonomyNode}
          selectedSkuId={selectedSkuId}
          onSelectSku={(skuId) => {
            setSelectedSkuId(skuId);
          }}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          No alert selected. Adjust filters or Clear to see all alerts.
        </div>
      )}
      </div>
    </div>
  );
}

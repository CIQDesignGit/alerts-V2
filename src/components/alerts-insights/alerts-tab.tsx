"use client";

import { useEffect, useMemo, useState } from "react";

import { AlertDetailPanel } from "@/components/alerts-insights/alert-detail-panel";
import {
  CategoryGroupCard,
  IssueGroupCard,
} from "@/components/alerts-insights/alert-group-cards";
import { AlertsGroupBySelect } from "@/components/alerts-insights/alerts-group-by-select";
import { SkuDetailPanel } from "@/components/alerts-insights/sku-detail-panel";
import {
  categoryAlerts,
  DEFAULT_ALERTS_TIME_WINDOW,
  filterCategoryAlerts,
  filterIssueAlerts,
  findIssueForSku,
  issueAlerts,
  issueLabel,
  type AlertsFilters,
  type AlertsGroupBy,
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
  // Apply Brand / Category / SKU + fixed 24-hour lookback
  const visibleIssues = useMemo(
    () =>
      filterIssueAlerts(issueAlerts, filters, DEFAULT_ALERTS_TIME_WINDOW),
    [filters],
  );
  const visibleCategories = useMemo(
    () =>
      filterCategoryAlerts(
        categoryAlerts,
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

  // Reset selection when group-by or filters change the list
  useEffect(() => {
    if (groupBy === "issue") {
      const first = visibleIssues[0]?.issueKey ?? null;
      setExpandedId(first);
      setSelectedGroupId(first ?? "");
    } else {
      const first = visibleCategories[0]?.id ?? null;
      setExpandedId(first);
      setSelectedGroupId(first ?? "");
    }
    setSelectedSkuId(null);
  }, [groupBy, filters, visibleIssues, visibleCategories]);

  const selectedIssue = useMemo(() => {
    if (groupBy !== "issue") return undefined;
    return (
      visibleIssues.find((i) => i.issueKey === selectedGroupId) ??
      visibleIssues[0]
    );
  }, [groupBy, selectedGroupId, visibleIssues]);

  const selectedCategory = useMemo(() => {
    if (groupBy !== "category") return undefined;
    return (
      visibleCategories.find((c) => c.id === selectedGroupId) ??
      visibleCategories[0]
    );
  }, [groupBy, selectedGroupId, visibleCategories]);

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

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-neutral-50">
        {/* Title + list grouping control only */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
          {onGroupByChange && (
            <AlertsGroupBySelect
              value={groupBy}
              onChange={onGroupByChange}
            />
          )}
        </div>

        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
          {groupBy === "issue" && visibleIssues.length === 0 && (
            <li className="px-2 py-6 text-center text-xs text-muted-foreground">
              No alerts match these filters. Try Clear.
            </li>
          )}
          {groupBy === "category" && visibleCategories.length === 0 && (
            <li className="px-2 py-6 text-center text-xs text-muted-foreground">
              No categories match these filters. Try Clear.
            </li>
          )}

          {groupBy === "issue"
            ? visibleIssues.map((issue) => (
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
              ))
            : visibleCategories.map((category) => (
                <CategoryGroupCard
                  key={category.id}
                  category={category}
                  open={expandedId === category.id}
                  groupSelected={
                    selectedGroupId === category.id && !selectedSkuId
                  }
                  selectedSkuId={selectedSkuId}
                  filter=""
                  onCardClick={() => onGroupCardClick(category.id)}
                  onSelectSku={(skuId) => selectSku(category.id, skuId)}
                />
              ))}
        </ul>
      </aside>

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
            atRiskDollars: selectedIssue.atRiskDollars,
            aiSignal: selectedIssue.aiSignal,
            skus: selectedIssue.skus,
          }}
          selectedSkuId={selectedSkuId}
          onSelectSku={(skuId) => selectSku(selectedIssue.issueKey, skuId)}
        />
      ) : groupBy === "category" && selectedCategory ? (
        <AlertDetailPanel
          group={{
            title: selectedCategory.name,
            feedbackKey: `category:${selectedCategory.id}`,
            skuCount: selectedCategory.skuCount,
            atRiskDollars: selectedCategory.atRiskDollars,
            aiSignal: selectedCategory.aiSignal,
            skus: selectedCategory.skus,
          }}
          selectedSkuId={selectedSkuId}
          onSelectSku={(skuId) => selectSku(selectedCategory.id, skuId)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          No alert selected. Adjust filters or Clear to see all alerts.
        </div>
      )}
    </div>
  );
}

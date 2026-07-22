"use client";

import { useEffect, useMemo, useState } from "react";

import { AlertDetailPanel } from "@/components/alerts-insights/alert-detail-panel";
import {
  CategoryGroupCard,
  IssueGroupCard,
} from "@/components/alerts-insights/alert-group-cards";
import { AlertsTimeWindowLabel } from "@/components/alerts-insights/alerts-time-window";
import { SkuDetailPanel } from "@/components/alerts-insights/sku-detail-panel";
import {
  categoryAlerts,
  DEFAULT_ALERTS_TIME_WINDOW,
  filterCategoryAlerts,
  filterIssueAlerts,
  findIssueForSku,
  formatAtRisk,
  issueAlerts,
  issueLabel,
  type AlertsFilters,
  type AlertsGroupBy,
} from "@/lib/mock-alerts-insights";

export function AlertsTab({
  filters,
  groupBy = "issue",
}: {
  filters: AlertsFilters;
  groupBy?: AlertsGroupBy;
}) {
  // Apply Brand / Category / SKU + fixed 7-day lookback
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

  const totalAtRisk =
    groupBy === "issue"
      ? visibleIssues.reduce((sum, i) => sum + i.atRiskDollars, 0)
      : visibleCategories.reduce((sum, c) => sum + c.atRiskDollars, 0);

  const listHeader =
    groupBy === "issue"
      ? `${visibleIssues.length} Alerts · ${formatAtRisk(totalAtRisk)} at risk`
      : `${visibleCategories.length} Categories · ${formatAtRisk(totalAtRisk)} at risk`;

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-neutral-50">
        <div className="border-b border-border px-4 py-3">
          <p className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
            {listHeader}
          </p>
          <AlertsTimeWindowLabel />
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
          issue={selectedSkuIssue}
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

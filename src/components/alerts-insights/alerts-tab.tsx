"use client";

import { Info, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import { IssueGroupCard } from "@/components/alerts-insights/alert-group-cards";
import { AlertsGroupBySelect } from "@/components/alerts-insights/alerts-group-by-select";
import {
  AlertsIssueListCaption,
  AlertsIssueListExportButton,
  AlertsTaxonomyListCaption,
} from "@/components/alerts-insights/alerts-issue-list-toolbar";
import { AlertsTaxonomyTree } from "@/components/alerts-insights/alerts-taxonomy-tree";
import { SkuDetailPanel } from "@/components/alerts-insights/sku-detail-panel";
import { TaxonomyRcaPanel } from "@/components/alerts-insights/taxonomy-rca-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  buildAlertsTaxonomyTree,
  buildIssueTypeSidebarAlerts,
  DEFAULT_ALERTS_TIME_WINDOW,
  defaultTaxonomyExpandedIds,
  defaultTaxonomySelection,
  filterIssueAlerts,
  findIssueForSku,
  findTaxonomyNode,
  issueAlerts,
  type AlertsFilters,
  type AlertsGroupBy,
  type AlertsTaxonomyNode,
  type IssueAlert,
} from "@/lib/mock-alerts-insights";

/**
 * TEMPORARY (issue-type view): skip issue aggregate (`AlertDetailPanel`).
 * Clicking an issue opens its first SKU. Revert notes in `instructions.md`.
 * Keep `alert-detail-panel.tsx` — do not delete.
 */
function firstSkuIdForIssue(issue: IssueAlert | undefined): string | null {
  return issue?.skus[0]?.id ?? null;
}

/** Explains how the SKU count is calculated — differs by Group by mode. */
const SKU_COUNT_TOOLTIP = {
  issue:
    "Count of Distinct SKUs with Alerts flagged",
  category:
    "Count of Distinct SKUs in 90th Percentile by OPS",
} as const;

export function AlertsTab({
  filters,
  groupBy = "issue",
  onGroupByChange,
}: {
  filters: AlertsFilters;
  groupBy?: AlertsGroupBy;
  onGroupByChange?: (value: AlertsGroupBy) => void;
}) {
  const filteredIssues = useMemo(
    () =>
      filterIssueAlerts(issueAlerts, filters, DEFAULT_ALERTS_TIME_WINDOW),
    [filters],
  );

  // Search / Brand / Category / SKU / Issue filters: hide issue types with 0 matches
  const hasActiveFilters = Boolean(
    filters.brand ||
      filters.category ||
      filters.skuId ||
      filters.skuQuery.trim() ||
      filters.issueKey,
  );

  const sidebarIssues = useMemo(
    () =>
      buildIssueTypeSidebarAlerts(filteredIssues, {
        includeEmpty: !hasActiveFilters,
      }),
    [filteredIssues, hasActiveFilters],
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

  // Issue view: count every SKU under every issue (same SKU can count more than once).
  // Taxonomy view: unique SKUs only (one SKU lives under one branch).
  const listHeader = useMemo(() => {
    if (groupBy === "category") {
      return { title: "SKUs", count: taxonomyTree?.skuCount ?? 0 };
    }
    const skuAppearances = filteredIssues.reduce(
      (sum, issue) => sum + issue.skuCount,
      0,
    );
    return { title: "SKUs", count: skuAppearances };
  }, [groupBy, filteredIssues, taxonomyTree]);

  const [expandedId, setExpandedId] = useState<string | null>(
    filteredIssues[0]?.issueKey ?? null,
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    filteredIssues[0]?.issueKey ?? "lostBuyBox",
  );
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);

  const [taxonomySelectedId, setTaxonomySelectedId] = useState("overall");
  const [taxonomyExpandedIds, setTaxonomyExpandedIds] = useState<Set<string>>(
    () => new Set(["overall"]),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Keep the clicked accordion glued to the same place on screen when another
  // open card above it collapses (otherwise the list jumps).
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const expandAnchorTopRef = useRef<number | null>(null);

  useEffect(() => {
    if (groupBy === "issue") {
      const firstIssue =
        filteredIssues[0] ?? sidebarIssues[0] ?? undefined;
      const firstKey = firstIssue?.issueKey ?? null;
      setExpandedId(firstKey);
      setSelectedGroupId(firstKey ?? "");
      // TEMP: land on first SKU — skip issue aggregate panel
      setSelectedSkuId(firstSkuIdForIssue(firstIssue));
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
  }, [groupBy, filters, filteredIssues, sidebarIssues, taxonomyTree]);

  const selectedIssue = useMemo(() => {
    if (groupBy !== "issue") return undefined;
    return (
      sidebarIssues.find((i) => i.issueKey === selectedGroupId) ??
      sidebarIssues.find((i) => i.skuCount > 0) ??
      sidebarIssues[0]
    );
  }, [groupBy, selectedGroupId, sidebarIssues]);

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

  function onGroupCardClick(id: string, event: MouseEvent<HTMLElement>) {
    const card = event.currentTarget.closest("li");
    if (card) {
      expandAnchorTopRef.current = card.getBoundingClientRect().top;
    }
    const issue = sidebarIssues.find((i) => i.issueKey === id);
    setSelectedGroupId(id);
    // Always expand so the SKU list is visible under the issue
    setExpandedId(id);
    // TEMP: open first SKU instead of issue aggregate (`AlertDetailPanel`)
    setSelectedSkuId(firstSkuIdForIssue(issue));
  }

  useLayoutEffect(() => {
    const prevTop = expandAnchorTopRef.current;
    if (prevTop == null) return;
    expandAnchorTopRef.current = null;

    const scroller = sidebarScrollRef.current;
    if (!scroller || !selectedGroupId) return;

    const card = scroller.querySelector(
      `[data-issue-key="${selectedGroupId}"]`,
    );
    if (!(card instanceof HTMLElement)) return;

    const nextTop = card.getBoundingClientRect().top;
    scroller.scrollTop += nextTop - prevTop;
  }, [expandedId, selectedGroupId]);

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
          <div className="border-b border-border bg-background px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-1.5">
                <h2 className="text-sm font-semibold text-foreground">
                  {listHeader.title}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({listHeader.count})
                  </span>
                </h2>
                <Tooltip>
                  <TooltipTrigger
                    className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
                    aria-label="About SKU count"
                  >
                    <Info className="size-3.5" aria-hidden />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-left leading-snug">
                    {groupBy === "category"
                      ? SKU_COUNT_TOOLTIP.category
                      : SKU_COUNT_TOOLTIP.issue}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {onGroupByChange && (
                  <AlertsGroupBySelect
                    value={groupBy}
                    onChange={onGroupByChange}
                  />
                )}
                {groupBy === "issue" && (
                  <AlertsIssueListExportButton issues={filteredIssues} />
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
          </div>

          <div
            ref={sidebarScrollRef}
            className="flex flex-1 flex-col gap-2 overflow-y-auto p-3"
          >
            {groupBy === "issue" && (
              <AlertsIssueListCaption className="px-1" />
            )}
            {groupBy === "category" && taxonomyTree && (
              <AlertsTaxonomyListCaption className="px-1" />
            )}
            {groupBy === "category" && !taxonomyTree && (
              <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                No taxonomy nodes match these filters. Try Clear.
              </p>
            )}

            {groupBy === "issue" ? (
              <ul className="flex flex-1 flex-col gap-2">
                {sidebarIssues.length === 0 && (
                  <li className="px-2 py-6 text-center text-xs text-muted-foreground">
                    No alerts match these filters. Try Clear.
                  </li>
                )}
                {sidebarIssues.map((issue) => (
                  <IssueGroupCard
                    key={issue.issueKey}
                    issue={issue}
                    open={expandedId === issue.issueKey}
                    groupSelected={
                      selectedGroupId === issue.issueKey && !selectedSkuId
                    }
                    selectedSkuId={selectedSkuId}
                    filter=""
                    onCardClick={(event) =>
                      onGroupCardClick(issue.issueKey, event)
                    }
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
          aggregation={groupBy === "issue" ? "issue" : "taxonomy"}
          issueKey={
            groupBy === "issue"
              ? selectedIssue?.issueKey
              : selectedSkuIssue.issueKey
          }
          onBackToAlert={() => {
            // TEMP: issue aggregate is off — closing SKU keeps/reopens first SKU
            if (groupBy === "issue") {
              setSelectedSkuId(firstSkuIdForIssue(selectedIssue));
              return;
            }
            setSelectedSkuId(null);
          }}
        />
      ) : groupBy === "issue" && selectedIssue ? (
        // TEMP: `AlertDetailPanel` skipped — see instructions.md “Temporary: issue-type view”
        // If an issue has no SKUs, show empty state instead of aggregate insights.
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          No SKUs under this alert yet.
        </div>
      ) : groupBy === "category" &&
        selectedTaxonomyNode &&
        selectedTaxonomyNode.level !== "sku" ? (
        <TaxonomyRcaPanel
          key={selectedTaxonomyNode.id}
          node={selectedTaxonomyNode}
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

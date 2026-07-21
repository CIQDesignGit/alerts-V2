"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { AlertDetailPanel } from "@/components/alerts-insights/alert-detail-panel";
import { SkuDetailPanel } from "@/components/alerts-insights/sku-detail-panel";
import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import type { IssueKey } from "@/components/alerts/issue-names";
import {
  alertsSummary,
  formatAtRisk,
  formatGapDollars,
  issueAlerts,
  issueGroup,
  issueLabel,
  type IssueAlert,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

function severityText(severity: IssueAlert["severity"]) {
  if (severity === "high") return "text-error-600";
  if (severity === "mid") return "text-warning-700";
  return "text-neutral-500";
}

export function AlertsTab({ filter }: { filter: string }) {
  const [expandedKey, setExpandedKey] = useState<IssueKey | null>(
    issueAlerts[0]?.issueKey ?? null,
  );
  // null SKU = alert aggregate view; set SKU = leaf detail
  const [selectedIssueKey, setSelectedIssueKey] = useState<IssueKey>(
    issueAlerts[0]?.issueKey ?? "lostBuyBox",
  );
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);

  const selectedIssue = useMemo(
    () =>
      issueAlerts.find((i) => i.issueKey === selectedIssueKey) ?? issueAlerts[0],
    [selectedIssueKey],
  );

  const selectedSku = useMemo(
    () => selectedIssue?.skus.find((s) => s.id === selectedSkuId) ?? null,
    [selectedIssue, selectedSkuId],
  );

  // Whole card header: show alert details + toggle SKU accordion
  function onIssueCardClick(issueKey: IssueKey) {
    setSelectedIssueKey(issueKey);
    setSelectedSkuId(null);
    setExpandedKey((current) => (current === issueKey ? null : issueKey));
  }

  function selectSku(issueKey: IssueKey, skuId: string) {
    setSelectedIssueKey(issueKey);
    setSelectedSkuId(skuId);
    setExpandedKey(issueKey);
  }

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-neutral-50">
        <div className="border-b border-border px-4 py-3">
          <p className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
            {alertsSummary.count} Alerts · {formatAtRisk(alertsSummary.atRiskDollars)}{" "}
            at risk
          </p>
        </div>

        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
          {issueAlerts.map((issue) => {
            const open = expandedKey === issue.issueKey;
            const issueSelected =
              selectedIssueKey === issue.issueKey && !selectedSkuId;
            const filteredSkus = issue.skus.filter((sku) => {
              if (!filter.trim()) return true;
              const q = filter.toLowerCase();
              return (
                sku.name.toLowerCase().includes(q) ||
                sku.asin.toLowerCase().includes(q) ||
                String(sku.gapDollars).includes(q)
              );
            });

            return (
              <li
                key={issue.issueKey}
                className={cn(
                  // shrink-0: don't let the flex list crush these cards (overflow-hidden
                  // would otherwise allow min-height: 0 and clip the subtitle)
                  // overflow-hidden: keep the SKU panel inside rounded corners
                  "shrink-0 overflow-hidden rounded-lg border bg-background shadow-xs",
                  issueSelected ? "border-primary" : "border-border",
                  issue.severity === "low" && "opacity-70",
                )}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-start gap-2 px-3 py-3 text-left hover:bg-neutral-50"
                  onClick={() => onIssueCardClick(issue.issueKey)}
                >
                  {open ? (
                    <ChevronDown
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  ) : (
                    <ChevronRight
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {issueLabel(issue.issueKey)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {issue.skuCount} SKUs · {issueGroup(issue.issueKey)}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "shrink-0 font-mono text-sm font-bold",
                      severityText(issue.severity),
                    )}
                  >
                    {formatAtRisk(issue.atRiskDollars)}
                  </p>
                </button>

                {open && issue.skus.length > 0 && (
                  <div className="border-t border-border bg-neutral-50/80">
                    <ul className="flex flex-col gap-1 p-1">
                      {filteredSkus.map((sku) => {
                        const active = selectedSkuId === sku.id;
                        return (
                          <li key={sku.id}>
                            <button
                              type="button"
                              onClick={() => selectSku(issue.issueKey, sku.id)}
                              className={cn(
                                "flex w-full items-start justify-between gap-2 rounded-md px-3 py-2 text-left",
                                active
                                  ? "bg-brand-100/70"
                                  : "hover:bg-neutral-100",
                              )}
                            >
                              <div className="flex min-w-0 flex-1 items-start gap-2 pr-2">
                                <SkuThumbnail name={sku.name} size={36} />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-foreground">
                                    {sku.name}
                                  </p>
                                  <p className="truncate font-mono text-2xs text-muted-foreground">
                                    {sku.asin} · {sku.seller}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 font-mono text-xs font-semibold text-error-600">
                                {formatGapDollars(sku.gapDollars)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {issue.skuCount > issue.skus.length && (
                      <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground italic">
                        + {issue.skuCount - issue.skus.length} more SKUs · $66K
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {selectedSku && selectedIssue ? (
        <SkuDetailPanel
          issue={selectedIssue}
          sku={selectedSku}
          onBackToAlert={() => setSelectedSkuId(null)}
        />
      ) : selectedIssue ? (
        <AlertDetailPanel
          issue={selectedIssue}
          selectedSkuId={selectedSkuId}
          onSelectSku={(skuId) => selectSku(selectedIssue.issueKey, skuId)}
        />
      ) : null}
    </div>
  );
}

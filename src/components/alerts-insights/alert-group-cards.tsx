"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import type { IssueKey } from "@/components/alerts/issue-names";
import {
  formatAtRisk,
  formatGapDollars,
  issueGroup,
  issueLabel,
  type CategoryAlert,
  type IssueAlert,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

function severityText(severity: IssueAlert["severity"]) {
  if (severity === "high") return "text-error-600";
  if (severity === "mid") return "text-warning-700";
  return "text-neutral-500";
}

export function matchesSkuFilter(
  sku: { name: string; asin: string; gapDollars: number },
  filter: string,
) {
  if (!filter.trim()) return true;
  const q = filter.toLowerCase();
  return (
    sku.name.toLowerCase().includes(q) ||
    sku.asin.toLowerCase().includes(q) ||
    String(sku.gapDollars).includes(q)
  );
}

export function IssueGroupCard({
  issue,
  open,
  groupSelected,
  selectedSkuId,
  filter,
  onCardClick,
  onSelectSku,
}: {
  issue: IssueAlert;
  open: boolean;
  groupSelected: boolean;
  selectedSkuId: string | null;
  filter: string;
  onCardClick: () => void;
  onSelectSku: (skuId: string) => void;
}) {
  const filteredSkus = issue.skus.filter((sku) => matchesSkuFilter(sku, filter));

  return (
    <li
      className={cn(
        "shrink-0 overflow-hidden rounded-lg border bg-background shadow-xs",
        groupSelected ? "border-primary" : "border-border",
        issue.severity === "low" && "opacity-70",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full items-start gap-2 px-3 py-3 text-left hover:bg-neutral-50"
        onClick={onCardClick}
      >
        <ExpandIcon open={open} />
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
        <SkuList
          skus={filteredSkus}
          selectedSkuId={selectedSkuId}
          onSelectSku={onSelectSku}
          moreCount={Math.max(issue.skuCount - issue.skus.length, 0)}
        />
      )}
    </li>
  );
}

export function CategoryGroupCard({
  category,
  open,
  groupSelected,
  selectedSkuId,
  filter,
  onCardClick,
  onSelectSku,
}: {
  category: CategoryAlert;
  open: boolean;
  groupSelected: boolean;
  selectedSkuId: string | null;
  filter: string;
  onCardClick: () => void;
  onSelectSku: (skuId: string) => void;
}) {
  const filteredSkus = category.skus.filter((sku) =>
    matchesSkuFilter(sku, filter),
  );
  // Show which issue types sit under this category
  const issueChips = [
    ...new Set(category.skus.map((s) => issueLabel(s.issueKey))),
  ];

  return (
    <li
      className={cn(
        "shrink-0 overflow-hidden rounded-lg border bg-background shadow-xs",
        groupSelected ? "border-primary" : "border-border",
        category.severity === "low" && "opacity-70",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full items-start gap-2 px-3 py-3 text-left hover:bg-neutral-50"
        onClick={onCardClick}
      >
        <ExpandIcon open={open} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {category.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {category.skuCount} SKUs · {issueChips.slice(0, 2).join(", ")}
            {issueChips.length > 2 ? ` +${issueChips.length - 2}` : ""}
          </p>
        </div>
        <p
          className={cn(
            "shrink-0 font-mono text-sm font-bold",
            severityText(category.severity),
          )}
        >
          {formatAtRisk(category.atRiskDollars)}
        </p>
      </button>

      {open && category.skus.length > 0 && (
        <SkuList
          skus={filteredSkus}
          selectedSkuId={selectedSkuId}
          onSelectSku={onSelectSku}
          showIssueChip
        />
      )}
    </li>
  );
}

function ExpandIcon({ open }: { open: boolean }) {
  const Icon = open ? ChevronDown : ChevronRight;
  return (
    <Icon
      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
      aria-hidden
    />
  );
}

function SkuList({
  skus,
  selectedSkuId,
  onSelectSku,
  moreCount = 0,
  showIssueChip = false,
}: {
  skus: {
    id: string;
    name: string;
    asin: string;
    seller: string;
    gapDollars: number;
    issueKey?: IssueKey;
  }[];
  selectedSkuId: string | null;
  onSelectSku: (skuId: string) => void;
  moreCount?: number;
  showIssueChip?: boolean;
}) {
  return (
    <div className="border-t border-border bg-neutral-50/80">
      <ul className="flex flex-col gap-1 p-1">
        {skus.map((sku) => {
          const active = selectedSkuId === sku.id;
          return (
            <li key={sku.id}>
              <button
                type="button"
                onClick={() => onSelectSku(sku.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-2 rounded-md px-3 py-2 text-left",
                  active ? "bg-brand-100/70" : "hover:bg-neutral-100",
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
                      {showIssueChip && sku.issueKey
                        ? ` · ${issueLabel(sku.issueKey)}`
                        : ""}
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
      {moreCount > 0 && (
        <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground italic">
          + {moreCount} more SKUs
        </p>
      )}
    </div>
  );
}

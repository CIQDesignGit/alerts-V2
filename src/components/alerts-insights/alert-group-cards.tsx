"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import type { IssueKey } from "@/components/alerts/issue-names";
import {
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

/**
 * Selected card look for the Alerts master list.
 * Light brand tint — no left rail, no heavy purple outline.
 */
function groupCardShellClass(selected: boolean, deEmphasized: boolean) {
  return cn(
    "shrink-0 overflow-hidden rounded-lg border transition-[background-color,box-shadow,border-color]",
    selected
      ? "border-brand-200 bg-brand-50 shadow-sm"
      : "border-border bg-background shadow-xs",
    deEmphasized && !selected && "opacity-70",
  );
}

function groupCardButtonClass(selected: boolean) {
  return cn(
    "flex w-full items-start gap-2 px-3 py-3 text-left outline-none",
    "hover:bg-neutral-50/80",
    "focus-visible:bg-brand-50/80 focus-visible:ring-2 focus-visible:ring-brand-200/60 focus-visible:ring-inset",
    selected && "bg-transparent hover:bg-brand-100/40",
  );
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
      className={groupCardShellClass(
        groupSelected,
        issue.severity === "low",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-current={groupSelected ? "true" : undefined}
        className={groupCardButtonClass(groupSelected)}
        onClick={onCardClick}
      >
        <ExpandIcon open={open} selected={groupSelected} />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm text-foreground",
              groupSelected ? "font-bold" : "font-semibold",
            )}
          >
            {issueLabel(issue.issueKey)}
          </p>
          <p className="text-xs text-muted-foreground">
            {issue.skuCount} SKUs · {issueGroup(issue.issueKey)}
          </p>
        </div>
        <p
          className={cn(
            "shrink-0 font-mono text-sm font-bold tabular-nums",
            severityText(issue.severity),
          )}
        >
          {formatGapDollars(issue.gapDollars)}
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
  const issueChips = [
    ...new Set(category.skus.map((s) => issueLabel(s.issueKey))),
  ];

  return (
    <li
      className={groupCardShellClass(
        groupSelected,
        category.severity === "low",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-current={groupSelected ? "true" : undefined}
        className={groupCardButtonClass(groupSelected)}
        onClick={onCardClick}
      >
        <ExpandIcon open={open} selected={groupSelected} />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm text-foreground",
              groupSelected ? "font-bold" : "font-semibold",
            )}
          >
            {category.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {category.skuCount} SKUs · {issueChips.slice(0, 2).join(", ")}
            {issueChips.length > 2 ? ` +${issueChips.length - 2}` : ""}
          </p>
        </div>
        <p
          className={cn(
            "shrink-0 font-mono text-sm font-bold tabular-nums",
            severityText(category.severity),
          )}
        >
          {formatGapDollars(category.gapDollars)}
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

function ExpandIcon({
  open,
  selected,
}: {
  open: boolean;
  selected: boolean;
}) {
  const Icon = open ? ChevronDown : ChevronRight;
  return (
    <Icon
      className={cn(
        "mt-0.5 size-4 shrink-0",
        selected ? "text-brand-700" : "text-muted-foreground",
      )}
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
    category: string;
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
                  "flex w-full items-start justify-between gap-2 rounded-md px-3 py-2 text-left outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-inset",
                  active
                    ? "bg-brand-100/70 ring-1 ring-brand-200"
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
                      {sku.asin} · {sku.category}
                      {showIssueChip && sku.issueKey
                        ? ` · ${issueLabel(sku.issueKey)}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-xs font-semibold tabular-nums text-error-600">
                    {formatGapDollars(sku.gapDollars)}
                  </p>
                  <p className="mt-0.5 text-2xs text-muted-foreground">Gap</p>
                </div>
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

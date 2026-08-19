"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

import { ISSUE_ICONS } from "@/components/alerts/issue-icons";
import { SkuThumbnail } from "@/components/alerts-insights/sku-thumbnail";
import type { IssueKey } from "@/components/alerts/issue-names";
import { OpsValue } from "@/components/shared/ops-value";
import {
  issueGroup,
  issueLabel,
  skuShortCode,
  type CategoryAlert,
  type IssueAlert,
} from "@/lib/mock-alerts-insights";
import { rolledUpOpsDollars, skuOpsDollars } from "@/lib/ops";
import { cn } from "@/lib/utils";

/** How many SKUs show in an expanded group before “View all” */
const VISIBLE_SKU_LIMIT = 5;

/**
 * Selected card look for the Alerts master list.
 * Light brand tint — no left rail, no heavy purple outline.
 */
function groupCardShellClass(selected: boolean) {
  return cn(
    "shrink-0 overflow-hidden rounded-lg border transition-[background-color,box-shadow,border-color]",
    selected
      ? "border-brand-200 bg-brand-50 shadow-sm"
      : "border-border bg-background shadow-xs",
  );
}

function groupCardButtonClass(selected: boolean) {
  return cn(
    "flex w-full items-start gap-2.5 px-3 py-3 text-left outline-none",
    "hover:bg-neutral-50/80",
    "focus-visible:bg-brand-50/80 focus-visible:ring-2 focus-visible:ring-brand-200/60 focus-visible:ring-inset",
    selected && "bg-transparent hover:bg-brand-100/40",
  );
}

function IssueTypeIcon({ issueKey }: { issueKey: IssueKey }) {
  const Icon = ISSUE_ICONS[issueKey];

  return (
    <span
      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-100/80"
      aria-hidden
    >
      <Icon className="size-4 text-neutral-600" strokeWidth={1.75} />
    </span>
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
  onCardClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onSelectSku: (skuId: string) => void;
}) {
  const filteredSkus = issue.skus.filter((sku) => matchesSkuFilter(sku, filter));

  return (
    <li
      data-issue-key={issue.issueKey}
      className={groupCardShellClass(groupSelected)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-current={groupSelected ? "true" : undefined}
        className={groupCardButtonClass(groupSelected)}
        onClick={onCardClick}
      >
        <IssueTypeIcon issueKey={issue.issueKey} />
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm leading-5 text-foreground",
                groupSelected ? "font-bold" : "font-semibold",
              )}
            >
              {issueLabel(issue.issueKey)}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {issue.skuCount} SKUs · {issueGroup(issue.issueKey)}
            </p>
          </div>
          <OpsValue
            dollars={rolledUpOpsDollars(issue.skus, issue.skuCount)}
          />
        </div>
        <ExpandIcon open={open} selected={groupSelected} />
      </button>

      {open && issue.skus.length > 0 && (
        <SkuList
          skus={filteredSkus}
          selectedSkuId={selectedSkuId}
          onSelectSku={onSelectSku}
          moreCount={Math.max(issue.skuCount - issue.skus.length, 0)}
        />
      )}

      {open && issue.skus.length === 0 && (
        <p className="border-t border-border bg-neutral-50/80 px-3 py-2.5 text-xs text-muted-foreground">
          No SKUs affected for this issue.
        </p>
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
    <li className={groupCardShellClass(groupSelected)}>
      <button
        type="button"
        aria-expanded={open}
        aria-current={groupSelected ? "true" : undefined}
        className={groupCardButtonClass(groupSelected)}
        onClick={onCardClick}
      >
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm leading-5 text-foreground",
                groupSelected ? "font-bold" : "font-semibold",
              )}
            >
              {category.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {category.skuCount} SKUs · {issueChips.slice(0, 2).join(", ")}
              {issueChips.length > 2 ? ` +${issueChips.length - 2}` : ""}
            </p>
          </div>
          <OpsValue
            dollars={rolledUpOpsDollars(category.skus, category.skuCount)}
          />
        </div>
        <ExpandIcon open={open} selected={groupSelected} />
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
        "size-4 shrink-0 self-center",
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
  const [showAll, setShowAll] = useState(false);
  const hasHidden = skus.length > VISIBLE_SKU_LIMIT;
  const hiddenCount = Math.max(skus.length - VISIBLE_SKU_LIMIT, 0);
  // Stable id list — avoids collapsing when parent re-creates the array each render
  const skuIdsKey = skus.map((sku) => sku.id).join(",");

  // New filter / different SKUs → collapse back to the first 5
  useEffect(() => {
    setShowAll(false);
  }, [skuIdsKey]);

  // If the selected SKU is past the first 5, open the full list so it stays visible
  useEffect(() => {
    if (!selectedSkuId || skus.length <= VISIBLE_SKU_LIMIT) return;
    const selectedIndex = skus.findIndex((sku) => sku.id === selectedSkuId);
    if (selectedIndex >= VISIBLE_SKU_LIMIT) {
      setShowAll(true);
    }
  }, [selectedSkuId, skuIdsKey, skus]);

  const visibleSkus =
    showAll || !hasHidden ? skus : skus.slice(0, VISIBLE_SKU_LIMIT);

  return (
    <div className="border-t border-border bg-neutral-50/80">
      <ul className="flex flex-col gap-1 p-1">
        {visibleSkus.map((sku) => {
          const active = selectedSkuId === sku.id;
          return (
            <li key={sku.id}>
              <button
                type="button"
                onClick={() => onSelectSku(sku.id)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-inset",
                  active
                    ? "bg-brand-100/70 ring-1 ring-brand-200"
                    : "hover:bg-neutral-100",
                )}
              >
                <SkuThumbnail name={sku.name} size={36} />
                <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-x-2">
                  <p className="col-span-2 truncate text-sm font-medium leading-5 text-foreground">
                    {sku.name}
                  </p>
                  <p className="inline-flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <span className="shrink-0 font-mono">
                      {skuShortCode(sku.asin)}
                    </span>
                    <span
                      className="size-0.5 shrink-0 rounded-full bg-neutral-600"
                      aria-hidden
                    />
                    <span className="shrink-0 font-mono">{sku.asin}</span>
                    <span
                      className="size-0.5 shrink-0 rounded-full bg-neutral-600"
                      aria-hidden
                    />
                    <span className="truncate">
                      {sku.category}
                      {showIssueChip && sku.issueKey
                        ? ` · ${issueLabel(sku.issueKey)}`
                        : ""}
                    </span>
                  </p>
                  <OpsValue
                    dollars={skuOpsDollars(sku)}
                    showLabel={false}
                    alignWith="meta"
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {hasHidden && (
        <button
          type="button"
          onClick={() => setShowAll((open) => !open)}
          className="w-full border-t border-border px-3 py-2 text-left text-xs font-medium text-primary hover:underline"
        >
          {showAll ? (
            "Show less"
          ) : (
            <>
              View all
              <span className="ml-1 text-2xs font-normal text-muted-foreground">
                ({hiddenCount} more)
              </span>
            </>
          )}
        </button>
      )}
      {moreCount > 0 && showAll && (
        <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground italic">
          + {moreCount} more SKUs
        </p>
      )}
    </div>
  );
}

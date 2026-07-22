"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import {
  formatAtRisk,
  formatGapDollars,
  getBrandFilterOptions,
  getCategoryFilterOptions,
  summarizeFilterOptions,
  type AlertsFilters,
  type AlertsGroupBy,
  type FilterDimensionOption,
} from "@/lib/mock-alerts-insights";
import { cn, controlFocusClass, fieldFocusClass } from "@/lib/utils";

type AlertsFiltersBarProps = {
  filters: AlertsFilters;
  onChange: (next: AlertsFilters) => void;
  groupBy: AlertsGroupBy;
  onGroupByChange: (value: AlertsGroupBy) => void;
};

type OpenMenu = "brand" | "category" | "search" | "groupBy" | null;

const GROUP_BY_OPTIONS = [
  { id: "issue" as const, label: "Issue type" },
  { id: "category" as const, label: "Categories" },
];

export function AlertsFiltersBar({
  filters,
  onChange,
  groupBy,
  onGroupByChange,
}: AlertsFiltersBarProps) {
  const [open, setOpen] = useState<OpenMenu>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const groupByPanelId = useId();

  // Close popovers when clicking outside the filter cluster
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const brandOptions = getBrandFilterOptions(filters.skuQuery);
  const categoryOptions = getCategoryFilterOptions(
    filters.brand,
    filters.skuQuery,
  );
  const selectedBrand = brandOptions.find((o) => o.name === filters.brand);
  const selectedCategory = categoryOptions.find(
    (o) => o.name === filters.category,
  );
  const groupByLabel =
    GROUP_BY_OPTIONS.find((o) => o.id === groupBy)?.label ?? "Issue type";
  const hasActive =
    Boolean(filters.brand) ||
    Boolean(filters.category) ||
    Boolean(filters.skuQuery.trim());

  function clearAll() {
    onChange({ brand: null, category: null, skuQuery: "" });
    setOpen(null);
  }

  return (
    <div
      ref={rootRef}
      className="flex min-w-0 flex-1 items-center justify-end gap-4"
    >
      {/*
        Gestalt: Group by is a VIEW MODE (how the list is stacked).
        Own cluster + divider keeps it separate from filters.
      */}
      <div
        role="group"
        aria-label="Group alerts by"
        className="relative flex shrink-0 items-center gap-2"
      >
        <span className="text-xs font-medium text-muted-foreground">
          Group by
        </span>
        <button
          type="button"
          aria-expanded={open === "groupBy"}
          aria-controls={groupByPanelId}
          aria-haspopup="listbox"
          onClick={() =>
            setOpen((current) => (current === "groupBy" ? null : "groupBy"))
          }
          className={cn(
            "inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-neutral-50",
            controlFocusClass,
          )}
        >
          {groupByLabel}
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open === "groupBy" && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {open === "groupBy" && (
          <ul
            id={groupByPanelId}
            role="listbox"
            aria-label="Group by options"
            className="absolute top-9 right-0 z-30 min-w-40 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg"
          >
            {GROUP_BY_OPTIONS.map((option) => {
              const selected = groupBy === option.id;
              return (
                <li key={option.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onGroupByChange(option.id);
                      setOpen(null);
                    }}
                    className={cn(
                      "flex w-full px-3 py-2 text-left text-xs font-medium",
                      selected
                        ? "bg-neutral-50 text-foreground"
                        : "text-foreground hover:bg-neutral-50",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Divider = visual break between “arrange” and “narrow” */}
      <div className="h-5 w-px shrink-0 bg-border" aria-hidden />

      {/*
        Gestalt: Filters share one tight cluster (Similarity + Proximity).
        They answer “which SKUs?” — search, brand, category, clear.
      */}
      <div
        role="group"
        aria-label="Filter alerts"
        className="flex min-w-0 items-center gap-1.5"
      >
        {/* SKU search — icon only until opened */}
        <div className="relative">
          {open === "search" || filters.skuQuery ? (
            <label className="relative block w-48">
              <span className="sr-only">Filter by SKU name, ASIN, or $ gap</span>
              <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus={open === "search"}
                type="search"
                value={filters.skuQuery}
                onChange={(e) =>
                  onChange({ ...filters, skuQuery: e.target.value })
                }
                onFocus={() => setOpen("search")}
                placeholder="SKU, ASIN, $ gap..."
                className={cn(
                  "w-full rounded-md border border-border bg-background py-1.5 pr-7 pl-7 text-xs",
                  fieldFocusClass,
                )}
              />
              {filters.skuQuery && (
                <button
                  type="button"
                  aria-label="Clear SKU filter"
                  className={cn(
                    "absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground",
                    controlFocusClass,
                  )}
                  onClick={() => onChange({ ...filters, skuQuery: "" })}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </label>
          ) : (
            <button
              type="button"
              aria-label="Search SKUs"
              aria-expanded={false}
              onClick={() => setOpen("search")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-neutral-50 hover:text-foreground",
                controlFocusClass,
              )}
            >
              <Search className="size-3.5" />
            </button>
          )}
        </div>

        <FilterDimensionControl
          label="All Brands"
          dimension="brand"
          selected={selectedBrand}
          options={brandOptions}
          open={open === "brand"}
          onOpenChange={(next) => setOpen(next ? "brand" : null)}
          listHeading="Brands by $ gap"
          onSelect={(name) => {
            onChange({
              ...filters,
              brand: name,
              category:
                name && filters.category
                  ? getCategoryFilterOptions(name, filters.skuQuery).some(
                      (c) => c.name === filters.category,
                    )
                    ? filters.category
                    : null
                  : filters.category,
            });
            setOpen(null);
          }}
          onClear={() => onChange({ ...filters, brand: null })}
        />

        <FilterDimensionControl
          label="All Categories"
          dimension="category"
          selected={selectedCategory}
          options={categoryOptions}
          open={open === "category"}
          onOpenChange={(next) => setOpen(next ? "category" : null)}
          listHeading="Categories by $ gap"
          onSelect={(name) => {
            onChange({ ...filters, category: name });
            setOpen(null);
          }}
          onClear={() => onChange({ ...filters, category: null })}
        />

        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className={cn(
              "shrink-0 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground",
              controlFocusClass,
            )}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function FilterDimensionControl({
  label,
  dimension,
  selected,
  options,
  open,
  onOpenChange,
  listHeading,
  onSelect,
  onClear,
}: {
  label: string;
  dimension: "brand" | "category";
  selected?: FilterDimensionOption;
  options: FilterDimensionOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listHeading: string;
  onSelect: (name: string) => void;
  onClear: () => void;
}) {
  const panelId = useId();
  const summary = summarizeFilterOptions(options);
  const maxAbsGap = Math.max(
    ...options.map((o) => Math.abs(o.gapDollars)),
    1,
  );

  return (
    <div className="relative shrink-0">
      {selected ? (
        <div className="flex max-w-55 items-center rounded-md border border-brand-200 bg-brand-50 py-0.5 pr-0.5 pl-2.5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => onOpenChange(!open)}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-1.5 py-0.5 text-left rounded-sm",
              controlFocusClass,
            )}
          >
            <span className="truncate text-xs font-semibold text-brand-800">
              {selected.name}
            </span>
            <span className="shrink-0 font-mono text-2xs font-semibold text-error-600">
              {formatGapDollars(selected.gapDollars)}
            </span>
            <span className="hidden shrink-0 font-mono text-2xs text-muted-foreground sm:inline">
              {formatUnits(selected.unitsDelta)}
            </span>
          </button>
          <button
            type="button"
            aria-label={`Clear ${dimension} filter`}
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full text-brand-700 hover:bg-brand-100",
              controlFocusClass,
            )}
            onClick={() => {
              onClear();
              onOpenChange(false);
            }}
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onOpenChange(!open)}
          className={cn(
            "flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-neutral-50",
            controlFocusClass,
          )}
        >
          {label}
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      )}

      {open && (
        <div
          id={panelId}
          role="listbox"
          aria-label={label}
          className="absolute top-9 right-0 z-30 w-85 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
        >
          <div className="border-b border-border px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-error-600">
                  {formatGapDollars(summary.gapDollars)}
                </p>
                <p className="font-mono text-2xs text-muted-foreground">
                  {formatUnits(summary.unitsDelta)}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3 text-2xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Achieved {formatAtRisk(summary.achievedDollars)}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full border border-neutral-400" />
                Target {formatAtRisk(summary.targetDollars)}
              </span>
            </div>
            <ProgressTrack
              className="mt-2"
              ratio={
                summary.targetDollars > 0
                  ? summary.achievedDollars / summary.targetDollars
                  : 0
              }
            />
          </div>

          <p className="px-3 pt-2 text-2xs font-medium tracking-wide text-muted-foreground uppercase">
            {listHeading}
          </p>
          <ul className="max-h-64 overflow-y-auto p-1.5">
            {options.length === 0 ? (
              <li className="px-2 py-3 text-xs text-muted-foreground">
                No options match the current filters.
              </li>
            ) : (
              options.map((option) => {
                const isSelected = selected?.name === option.name;
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => onSelect(option.name)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left",
                        isSelected
                          ? "bg-brand-50"
                          : "hover:bg-neutral-50",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {option.name}
                        </p>
                        <span className="mt-0.5 inline-flex rounded-full bg-neutral-100 px-1.5 py-0.5 text-2xs font-medium text-neutral-600">
                          {option.issueCount}{" "}
                          {option.issueCount === 1 ? "Issue" : "Issues"}
                        </span>
                      </div>
                      <ProgressTrack
                        className="w-16 shrink-0"
                        ratio={Math.abs(option.gapDollars) / maxAbsGap}
                        dense
                      />
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-xs font-semibold text-error-600">
                          {formatGapDollars(option.gapDollars)}
                        </p>
                        <p className="font-mono text-2xs text-muted-foreground">
                          {formatUnits(option.unitsDelta)}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProgressTrack({
  ratio,
  className,
  dense = false,
}: {
  ratio: number;
  className?: string;
  dense?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div
      className={cn(
        "overflow-hidden rounded-full bg-neutral-100",
        dense ? "h-1.5" : "h-2",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-brand-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function formatUnits(value: number) {
  const abs = Math.abs(value);
  const formatted =
    abs >= 1000 ? `${(abs / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${abs}`;
  if (value < 0) return `−${formatted} units`;
  if (value > 0) return `+${formatted} units`;
  return `0 units`;
}

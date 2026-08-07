"use client";

import { Check, ChevronDown, List, X } from "lucide-react";
import { useId } from "react";

import { ISSUE_FILTER_SECTIONS } from "@/components/alerts/issue-filter-sections";
import { ISSUE_ICONS } from "@/components/alerts/issue-icons";
import type { IssueKey } from "@/components/alerts/issue-names";
import {
  formatGapDollars,
  issueLabel,
  type FilterDimensionOption,
} from "@/lib/mock-alerts-insights";
import { cn, controlFocusClass } from "@/lib/utils";

type AlertsIssueFilterProps = {
  options: FilterDimensionOption[];
  selectedKey: IssueKey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (issueKey: IssueKey | null) => void;
};

/** Taxonomy issue filter — grouped menu matching the product mock. */
export function AlertsIssueFilter({
  options,
  selectedKey,
  open,
  onOpenChange,
  onSelect,
}: AlertsIssueFilterProps) {
  const panelId = useId();
  const countByKey = new Map(options.map((o) => [o.id, o.issueCount]));
  const totalCount = options.reduce((sum, o) => sum + o.issueCount, 0);
  const selectedOption = options.find((o) => o.id === selectedKey);
  const allSelected = selectedKey == null;

  return (
    <div className="relative shrink-0">
      {selectedOption ? (
        <div className="flex max-w-55 items-center rounded-md border border-brand-200 bg-brand-50 py-0.5 pr-0.5 pl-2.5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-haspopup="listbox"
            onClick={() => onOpenChange(!open)}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-1.5 rounded-sm py-0.5 text-left",
              controlFocusClass,
            )}
          >
            <span className="truncate text-xs font-semibold text-brand-800">
              {selectedOption.name}
            </span>
            <span className="shrink-0 font-mono text-2xs font-semibold text-error-600">
              {formatGapDollars(selectedOption.gapDollars)}
            </span>
          </button>
          <button
            type="button"
            aria-label="Clear issue filter"
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full text-brand-700 hover:bg-brand-100",
              controlFocusClass,
            )}
            onClick={() => {
              onSelect(null);
              onOpenChange(false);
            }}
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Filter by issue type"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="listbox"
          onClick={() => onOpenChange(!open)}
          className={cn(
            "flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-neutral-50",
            controlFocusClass,
          )}
        >
          All Issues
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
          aria-label="Filter by issue type"
          className="absolute top-9 left-0 z-30 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-background shadow-lg"
        >
          <ul className="max-h-96 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                role="option"
                aria-selected={allSelected}
                onClick={() => {
                  onSelect(null);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm",
                  allSelected ? "bg-brand-50/50" : "hover:bg-neutral-50",
                )}
              >
                <List
                  className="size-4 shrink-0 text-neutral-600"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 font-medium text-neutral-800">
                  All Issues{" "}
                  <span className="font-medium text-brand-500">
                    ({totalCount})
                  </span>
                </span>
                {allSelected ? (
                  <Check
                    className="size-4 shrink-0 text-brand-500"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                ) : null}
              </button>
            </li>

            {ISSUE_FILTER_SECTIONS.map((section) => (
              <li key={section.id} className="border-t border-neutral-100">
                <p className="bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700">
                  {section.label}
                </p>
                <ul>
                  {section.issues.map((issueKey) => {
                    const count = countByKey.get(issueKey) ?? 0;
                    const Icon = ISSUE_ICONS[issueKey];
                    const selected = selectedKey === issueKey;
                    const muted = count === 0;

                    return (
                      <li key={issueKey}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          disabled={muted}
                          onClick={() => {
                            onSelect(issueKey);
                            onOpenChange(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm",
                            selected
                              ? "bg-brand-50/50"
                              : muted
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-neutral-50",
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-4 shrink-0",
                              muted ? "text-neutral-400" : "text-neutral-600",
                            )}
                            aria-hidden
                          />
                          <span
                            className={cn(
                              "min-w-0 flex-1 font-medium",
                              muted ? "text-neutral-400" : "text-neutral-800",
                            )}
                          >
                            {issueLabel(issueKey)}{" "}
                            <span
                              className={cn(
                                "font-medium",
                                muted ? "text-neutral-400" : "text-brand-500",
                              )}
                            >
                              ({count})
                            </span>
                          </span>
                          {selected ? (
                            <Check
                              className="size-4 shrink-0 text-brand-500"
                              strokeWidth={2.5}
                              aria-hidden
                            />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import { Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  levelDisplayName,
  MAX_VISIBLE_SNAPSHOT_METRICS,
  SNAPSHOT_METRIC_CATALOG,
  type HierarchyLevel,
  type MetricsApplyScope,
  type SnapshotMetricId,
} from "@/lib/insights-metrics-config";
import { cn, controlFocusClass } from "@/lib/utils";

type ConfigureMetricsProps = {
  level: HierarchyLevel;
  selectedIds: SnapshotMetricId[];
  hasLevelOverride: boolean;
  onSave: (ids: SnapshotMetricId[], scope: MetricsApplyScope) => void;
  onReset: (scope: MetricsApplyScope) => void;
};

/**
 * Pick which Snapshot metrics to show, and whether the choice applies to
 * this hierarchy level only or every level.
 */
export function ConfigureMetrics({
  level,
  selectedIds,
  hasLevelOverride,
  onSave,
  onReset,
}: ConfigureMetricsProps) {
  const [open, setOpen] = useState(false);
  const [draftIds, setDraftIds] = useState<SnapshotMetricId[]>(selectedIds);
  const [scope, setScope] = useState<MetricsApplyScope>(
    hasLevelOverride ? "this-level" : "all-levels",
  );

  // Sync draft when opening or when the resolved selection changes
  useEffect(() => {
    if (!open) return;
    setDraftIds(selectedIds);
    setScope(hasLevelOverride ? "this-level" : "all-levels");
  }, [open, selectedIds, hasLevelOverride]);

  function toggle(id: SnapshotMetricId) {
    setDraftIds((prev) => {
      if (prev.includes(id)) {
        // Keep at least one metric visible
        if (prev.length <= 1) return prev;
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_VISIBLE_SNAPSHOT_METRICS) return prev;
      return [...prev, id];
    });
  }

  function handleSave() {
    onSave(draftIds, scope);
    setOpen(false);
  }

  const levelName = levelDisplayName(level);
  const atMax = draftIds.length >= MAX_VISIBLE_SNAPSHOT_METRICS;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-label="Configure metrics"
        title="Configure metrics"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Settings2 className="size-3.5" />
      </Button>

      {open && (
        <div className="absolute top-9 right-0 z-20 w-80 rounded-lg border border-border bg-background p-3 shadow-lg">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Configure metrics
              </p>
              <p className="mt-0.5 text-2xs text-muted-foreground">
                Show up to {MAX_VISIBLE_SNAPSHOT_METRICS} · {draftIds.length}{" "}
                selected
                {hasLevelOverride ? ` · custom for ${levelName}` : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className={cn("rounded-sm p-0.5 hover:bg-neutral-50", controlFocusClass)}
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <fieldset className="mb-3 space-y-1.5">
            <legend className="mb-1 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
              Apply to
            </legend>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="radio"
                name="metrics-scope"
                checked={scope === "this-level"}
                onChange={() => setScope("this-level")}
                className="mt-0.5 size-3.5 accent-primary"
              />
              <span>
                <span className="font-medium text-foreground">
                  This level only
                </span>
                <span className="block text-2xs text-muted-foreground">
                  {levelName} views keep their own metric set
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="radio"
                name="metrics-scope"
                checked={scope === "all-levels"}
                onChange={() => setScope("all-levels")}
                className="mt-0.5 size-3.5 accent-primary"
              />
              <span>
                <span className="font-medium text-foreground">All levels</span>
                <span className="block text-2xs text-muted-foreground">
                  Same metrics for Business, Brand, Category, SKU…
                </span>
              </span>
            </label>
          </fieldset>

          <ul className="max-h-56 space-y-1 overflow-y-auto border-t border-border pt-2">
            {SNAPSHOT_METRIC_CATALOG.map((metric) => {
              const checked = draftIds.includes(metric.id);
              const disabled = !checked && atMax;
              return (
                <li key={metric.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-neutral-50",
                      disabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(metric.id)}
                      className="mt-0.5 size-3.5 accent-primary"
                    />
                    <span>
                      <span className="font-medium text-foreground">
                        {metric.label}
                      </span>
                      <span className="block text-2xs text-muted-foreground">
                        {metric.description}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex gap-1.5 border-t border-border pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => {
                onReset(scope);
                setOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              className="flex-1"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

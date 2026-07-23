"use client";

import { useEffect, useState } from "react";

import {
  applyMetricsSelection,
  DEFAULT_SNAPSHOT_METRIC_IDS,
  loadSnapshotMetricsConfig,
  resolveMetricIdsForLevel,
  saveSnapshotMetricsConfig,
  type HierarchyLevel,
  type MetricsApplyScope,
  type SnapshotMetricId,
  type SnapshotMetricsConfig,
} from "@/lib/insights-metrics-config";

/** Load / persist which Snapshot metrics show — globally or per hierarchy level. */
export function usePersistedMetricsConfig(level: HierarchyLevel) {
  const [config, setConfig] = useState<SnapshotMetricsConfig>(() =>
    loadSnapshotMetricsConfig(),
  );

  // Re-read once on mount (SSR-safe default → browser storage)
  useEffect(() => {
    setConfig(loadSnapshotMetricsConfig());
  }, []);

  const visibleIds = resolveMetricIdsForLevel(config, level);
  const hasLevelOverride = Boolean(config.byLevel[level]);

  function saveSelection(
    selectedIds: SnapshotMetricId[],
    scope: MetricsApplyScope,
  ) {
    const next = applyMetricsSelection(config, selectedIds, scope, level);
    setConfig(next);
    saveSnapshotMetricsConfig(next);
  }

  /** Restore defaults for the chosen scope. */
  function resetToDefaults(scope: MetricsApplyScope) {
    if (scope === "all-levels") {
      const next: SnapshotMetricsConfig = {
        allLevels: [...DEFAULT_SNAPSHOT_METRIC_IDS],
        byLevel: {},
      };
      setConfig(next);
      saveSnapshotMetricsConfig(next);
      return;
    }

    // Drop this level’s override so it falls back to all-levels defaults
    const byLevel = { ...config.byLevel };
    delete byLevel[level];
    const next = { ...config, byLevel };
    setConfig(next);
    saveSnapshotMetricsConfig(next);
  }

  return {
    config,
    visibleIds,
    hasLevelOverride,
    saveSelection,
    resetToDefaults,
  };
}

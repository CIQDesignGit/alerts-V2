/** Snapshot metrics visibility — which KPI cells show, and at which levels. */

import type { HierarchyNode } from "@/lib/mock-alerts-insights";

export type SnapshotMetricId =
  | "gap"
  | "ops"
  | "attain"
  | "org-sales"
  | "ad-sales"
  | "ad-spend"
  | "units"
  | "gv"
  | "conv"
  | "asp"
  | "org-traffic"
  | "clicks"
  | "sub-rev"
  | "sub-units"
  | "subs"
  | "on-hand"
  | "open-po"
  | "woc";

export type HierarchyLevel = HierarchyNode["level"];

/** Full catalog — labels match the Snapshot metrics strip. */
export const SNAPSHOT_METRIC_CATALOG: {
  id: SnapshotMetricId;
  label: string;
  description: string;
}[] = [
  { id: "gap", label: "Gap to Plan", description: "Gap to plan ($)" },
  {
    id: "ops",
    label: "Ordered Product Sales",
    description: "Ordered product sales",
  },
  { id: "attain", label: "Attainment", description: "Attainment vs plan" },
  { id: "org-sales", label: "Organic Sales", description: "Organic sales" },
  {
    id: "ad-sales",
    label: "Advertising Sales",
    description: "Advertising sales",
  },
  {
    id: "ad-spend",
    label: "Advertising Spend",
    description: "Advertising spend",
  },
  { id: "units", label: "Units", description: "Units sold" },
  { id: "gv", label: "Glance Views", description: "Glance views" },
  { id: "conv", label: "Conversion", description: "Conversion rate" },
  {
    id: "asp",
    label: "Average Selling Price",
    description: "Average selling price",
  },
  {
    id: "org-traffic",
    label: "Organic Traffic",
    description: "Organic traffic",
  },
  { id: "clicks", label: "Clicks", description: "Ad clicks" },
  {
    id: "sub-rev",
    label: "Subscription Revenue",
    description: "Subscription revenue",
  },
  {
    id: "sub-units",
    label: "Subscription Units",
    description: "Subscription units",
  },
  { id: "subs", label: "Subscribers", description: "Active subscribers" },
  { id: "on-hand", label: "On Hand", description: "Inventory on hand" },
  {
    id: "open-po",
    label: "Open Purchase Orders",
    description: "Open purchase orders",
  },
  { id: "woc", label: "Weeks of Coverage", description: "Weeks of coverage" },
];

/** Lookup a metric’s display label (full form). */
export function snapshotMetricLabel(id: SnapshotMetricId): string {
  return (
    SNAPSHOT_METRIC_CATALOG.find((m) => m.id === id)?.label ?? id
  );
}

/** Default visible set — 8 most useful at a glance. */
export const DEFAULT_SNAPSHOT_METRIC_IDS: SnapshotMetricId[] = [
  "gap",
  "ops",
  "attain",
  "org-sales",
  "units",
  "gv",
  "conv",
  "asp",
];

export const MAX_VISIBLE_SNAPSHOT_METRICS = 12;

export type MetricsApplyScope = "this-level" | "all-levels";

export type SnapshotMetricsConfig = {
  /** Fallback when a level has no override */
  allLevels: SnapshotMetricId[];
  /** Optional per-hierarchy-level overrides */
  byLevel: Partial<Record<HierarchyLevel, SnapshotMetricId[]>>;
};

const STORAGE_KEY = "alerts-v2:insights-snapshot-metrics";

export const DEFAULT_SNAPSHOT_METRICS_CONFIG: SnapshotMetricsConfig = {
  allLevels: [...DEFAULT_SNAPSHOT_METRIC_IDS],
  byLevel: {},
};

function isMetricId(id: string): id is SnapshotMetricId {
  return SNAPSHOT_METRIC_CATALOG.some((m) => m.id === id);
}

function sanitizeIds(ids: unknown): SnapshotMetricId[] | null {
  if (!Array.isArray(ids)) return null;
  const next = ids.filter((id): id is SnapshotMetricId => typeof id === "string" && isMetricId(id));
  return next.length > 0 ? next : null;
}

export function loadSnapshotMetricsConfig(): SnapshotMetricsConfig {
  if (typeof window === "undefined") {
    return {
      allLevels: [...DEFAULT_SNAPSHOT_METRIC_IDS],
      byLevel: {},
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        allLevels: [...DEFAULT_SNAPSHOT_METRIC_IDS],
        byLevel: {},
      };
    }
    const parsed = JSON.parse(raw) as Partial<SnapshotMetricsConfig>;
    const allLevels =
      sanitizeIds(parsed.allLevels) ?? [...DEFAULT_SNAPSHOT_METRIC_IDS];
    const byLevel: SnapshotMetricsConfig["byLevel"] = {};
    if (parsed.byLevel && typeof parsed.byLevel === "object") {
      for (const [level, ids] of Object.entries(parsed.byLevel)) {
        const clean = sanitizeIds(ids);
        if (clean) byLevel[level as HierarchyLevel] = clean;
      }
    }
    return { allLevels, byLevel };
  } catch {
    return {
      allLevels: [...DEFAULT_SNAPSHOT_METRIC_IDS],
      byLevel: {},
    };
  }
}

export function saveSnapshotMetricsConfig(config: SnapshotMetricsConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/** Visible metric ids for a hierarchy level. */
export function resolveMetricIdsForLevel(
  config: SnapshotMetricsConfig,
  level: HierarchyLevel,
): SnapshotMetricId[] {
  return config.byLevel[level] ?? config.allLevels;
}

export function levelDisplayName(level: HierarchyLevel): string {
  if (level === "business") return "Entire Business";
  if (level === "subcategory") return "Sub-category";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

/**
 * Apply editor selection.
 * - all-levels: updates shared defaults and clears per-level overrides
 * - this-level: stores an override for the current level only
 */
export function applyMetricsSelection(
  config: SnapshotMetricsConfig,
  selectedIds: SnapshotMetricId[],
  scope: MetricsApplyScope,
  level: HierarchyLevel,
): SnapshotMetricsConfig {
  const ids = selectedIds.length > 0 ? selectedIds : [...DEFAULT_SNAPSHOT_METRIC_IDS];

  if (scope === "all-levels") {
    return { allLevels: ids, byLevel: {} };
  }

  return {
    ...config,
    byLevel: { ...config.byLevel, [level]: ids },
  };
}

/** Filter full metric cells down to the configured visible set (order preserved). */
export function filterSnapshotMetrics<T extends { id: string }>(
  cells: T[],
  visibleIds: SnapshotMetricId[],
): T[] {
  const byId = new Map(cells.map((c) => [c.id, c]));
  return visibleIds
    .map((id) => byId.get(id))
    .filter((c): c is T => c != null);
}

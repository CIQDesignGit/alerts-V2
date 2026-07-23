/** Shared Insights date window — used by Snapshot and Trends modes. */

export type InsightsDateRangeId =
  | "wtd"
  | "7d"
  | "4w"
  | "8w"
  | "custom";

export type InsightsDateRange = {
  id: InsightsDateRangeId;
  /** Inclusive start (YYYY-MM-DD) when custom; ignored for presets */
  customFrom?: string;
  /** Inclusive end (YYYY-MM-DD) when custom */
  customTo?: string;
};

/**
 * How the selected period is compared (Gap Δ / WoW style).
 * Resolves concrete dates from the primary range.
 */
export type InsightsComparisonId =
  | "previous_period"
  | "prior_week"
  | "same_period_last_year"
  | "none";

export type InsightsComparisonPeriod = {
  id: InsightsComparisonId;
};

/** Snapshot default — current week (point-in-time). */
export const DEFAULT_INSIGHTS_DATE_RANGE: InsightsDateRange = { id: "wtd" };

/** Trends default — longer window for week-over-week movement. */
export const DEFAULT_TRENDS_DATE_RANGE: InsightsDateRange = { id: "4w" };

/** Default compare-to window for Snapshot / Trends. */
export const DEFAULT_INSIGHTS_COMPARISON: InsightsComparisonPeriod = {
  id: "previous_period",
};

export const INSIGHTS_DATE_RANGE_PRESETS: {
  id: Exclude<InsightsDateRangeId, "custom">;
  label: string;
}[] = [
  { id: "wtd", label: "Week to date" },
  { id: "7d", label: "Last 7 days" },
  { id: "4w", label: "Last 4 weeks" },
  { id: "8w", label: "Last 8 weeks" },
];

export const INSIGHTS_COMPARISON_PRESETS: {
  id: InsightsComparisonId;
  label: string;
}[] = [
  { id: "previous_period", label: "Previous period" },
  { id: "prior_week", label: "Prior week" },
  { id: "same_period_last_year", label: "Same period last year" },
  { id: "none", label: "No comparison" },
];

function startOfWeekMonday(d: Date): Date {
  const day = d.getDay(); // 0 Sun … 6 Sat
  const offset = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + offset);
  return start;
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function parseYmd(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function dayCountInclusive(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

/** Inclusive start/end for a primary Insights window. */
export function resolveInsightsDateBounds(
  range: InsightsDateRange,
  now = new Date(),
): { from: Date; to: Date } | null {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (range.id === "custom") {
    const from = range.customFrom ? parseYmd(range.customFrom) : null;
    const to = range.customTo ? parseYmd(range.customTo) : null;
    if (from && to) return { from, to };
    return null;
  }

  if (range.id === "wtd") {
    return { from: startOfWeekMonday(today), to: today };
  }
  if (range.id === "7d") {
    return { from: addDays(today, -6), to: today };
  }
  if (range.id === "4w") {
    return { from: addDays(today, -27), to: today };
  }
  // 8w
  return { from: addDays(today, -55), to: today };
}

/** Human-readable window for headers and chart captions. */
export function formatInsightsDateRange(
  range: InsightsDateRange,
  now = new Date(),
): { label: string; rangeText: string } {
  const bounds = resolveInsightsDateBounds(range, now);
  const presetLabel =
    INSIGHTS_DATE_RANGE_PRESETS.find((p) => p.id === range.id)?.label ??
    "Custom range";

  if (range.id === "custom") {
    if (bounds) {
      return {
        label: "Custom range",
        rangeText: `${formatShort(bounds.from)} – ${formatShort(bounds.to)}`,
      };
    }
    return {
      label: "Custom range",
      rangeText: "Pick start and end dates",
    };
  }

  if (!bounds) {
    return { label: presetLabel, rangeText: "—" };
  }

  return {
    label: presetLabel,
    rangeText: `${formatShort(bounds.from)} – ${formatShort(bounds.to)}`,
  };
}

/** Resolve comparison window dates from the primary period. */
export function resolveInsightsComparisonBounds(
  comparison: InsightsComparisonPeriod,
  primary: InsightsDateRange,
  now = new Date(),
): { from: Date; to: Date } | null {
  if (comparison.id === "none") return null;

  const primaryBounds = resolveInsightsDateBounds(primary, now);
  if (!primaryBounds) return null;

  const { from, to } = primaryBounds;
  const length = dayCountInclusive(from, to);

  if (comparison.id === "previous_period") {
    const compareTo = addDays(from, -1);
    const compareFrom = addDays(compareTo, -(length - 1));
    return { from: compareFrom, to: compareTo };
  }

  if (comparison.id === "prior_week") {
    // Full Mon–Sun week before the primary window’s week
    const primaryWeekStart = startOfWeekMonday(from);
    const priorWeekStart = addDays(primaryWeekStart, -7);
    return { from: priorWeekStart, to: addDays(priorWeekStart, 6) };
  }

  // same_period_last_year — shift both ends back one calendar year
  const compareFrom = new Date(from);
  compareFrom.setFullYear(compareFrom.getFullYear() - 1);
  const compareTo = new Date(to);
  compareTo.setFullYear(compareTo.getFullYear() - 1);
  return { from: compareFrom, to: compareTo };
}

/** Label + date text for the comparison control / AllyAI subtitle. */
export function formatInsightsComparison(
  comparison: InsightsComparisonPeriod,
  primary: InsightsDateRange,
  now = new Date(),
): { label: string; rangeText: string } {
  const label =
    INSIGHTS_COMPARISON_PRESETS.find((p) => p.id === comparison.id)?.label ??
    "Comparison";

  if (comparison.id === "none") {
    return { label, rangeText: "Off" };
  }

  const bounds = resolveInsightsComparisonBounds(comparison, primary, now);
  if (!bounds) {
    return { label, rangeText: "Pick a primary range first" };
  }

  return {
    label,
    rangeText: `${formatShort(bounds.from)} – ${formatShort(bounds.to)}`,
  };
}

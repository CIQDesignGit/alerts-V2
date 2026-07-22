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

export const DEFAULT_INSIGHTS_DATE_RANGE: InsightsDateRange = { id: "wtd" };

export const INSIGHTS_DATE_RANGE_PRESETS: {
  id: Exclude<InsightsDateRangeId, "custom">;
  label: string;
}[] = [
  { id: "wtd", label: "Week to date" },
  { id: "7d", label: "Last 7 days" },
  { id: "4w", label: "Last 4 weeks" },
  { id: "8w", label: "Last 8 weeks" },
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

/** Human-readable window for headers and chart captions. */
export function formatInsightsDateRange(
  range: InsightsDateRange,
  now = new Date(),
): { label: string; rangeText: string } {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (range.id === "custom") {
    const from = range.customFrom ? parseYmd(range.customFrom) : null;
    const to = range.customTo ? parseYmd(range.customTo) : null;
    if (from && to) {
      return {
        label: "Custom range",
        rangeText: `${formatShort(from)} – ${formatShort(to)}`,
      };
    }
    return {
      label: "Custom range",
      rangeText: "Pick start and end dates",
    };
  }

  if (range.id === "wtd") {
    const from = startOfWeekMonday(today);
    return {
      label: "Week to date",
      rangeText: `${formatShort(from)} – ${formatShort(today)}`,
    };
  }

  if (range.id === "7d") {
    const from = addDays(today, -6);
    return {
      label: "Last 7 days",
      rangeText: `${formatShort(from)} – ${formatShort(today)}`,
    };
  }

  if (range.id === "4w") {
    const from = addDays(today, -27);
    return {
      label: "Last 4 weeks",
      rangeText: `${formatShort(from)} – ${formatShort(today)}`,
    };
  }

  // 8w
  const from = addDays(today, -55);
  return {
    label: "Last 8 weeks",
    rangeText: `${formatShort(from)} – ${formatShort(today)}`,
  };
}

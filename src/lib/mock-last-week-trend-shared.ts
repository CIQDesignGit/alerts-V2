import type { IssueKey } from "@/components/alerts/issue-names";

/** How a delta / table cell should look (good vs bad) */
export type TrendTone = "positive" | "negative" | "neutral";

export type TrendDayColumn = {
  id: string;
  /** e.g. "Aug 9" */
  dateLabel: string;
  /** e.g. "Sat" */
  dayLabel: string;
};

export type TrendSummaryMetric = {
  id: string;
  label: string;
  value: string;
  /** Change vs previous week, e.g. "+16pp" */
  delta?: string;
  deltaTone?: TrendTone;
  /** Optional (i) tooltip on the label */
  infoTooltip?: string;
  /** Small line under the value, e.g. "20/24 crawls" */
  sublabel?: string;
};

/** One cell in the daily breakdown table */
export type TrendTableCell =
  | {
      kind: "text";
      value: string;
      /** Drives text color + soft wash everywhere (same rule on every issue) */
      tone: TrendTone;
    }
  | { kind: "empty" }
  | { kind: "check"; ok: boolean }
  | { kind: "na" };

export type TrendTypeBadge = "organic" | "paid";

export type TrendTableRow = {
  id: string;
  label: string;
  infoTooltip?: string;
  cells: TrendTableCell[];
  /** Soft red wash across the whole data row (e.g. SB SOV) */
  rowHighlight?: boolean;
  /** Bold footer row (e.g. media spend totals) */
  isFooter?: boolean;
  /** Keyword Rank — ORGANIC / PAID pill */
  typeBadge?: TrendTypeBadge;
  /** When false, leave the label cell blank (paired organic/paid rows) */
  showLabel?: boolean;
};

export type LastWeekTrendData = {
  issueKey: IssueKey;
  /** Card title, e.g. "Last 7 Day Trend (Aug 9–15)" */
  title: string;
  vsPrevWeekTooltip: string;
  /** Hide the header “vs prev week” control (table-only designs) */
  showVsPrevWeek?: boolean;
  summaryMetrics: TrendSummaryMetric[];
  /** Summary KPI grid columns — default 3 */
  summaryColumns?: 1 | 2 | 3 | 4;
  days: TrendDayColumn[];
  rows: TrendTableRow[];
  /** First column header — default "METRIC" */
  rowHeaderLabel?: string;
  /** Keyword Rank — show TYPE column between label and days */
  showTypeColumn?: boolean;
};

/** Shared last-week column headers (Aug 9–15) used by most trend designs */
export const JUN_1_7_DAYS: TrendDayColumn[] = [
  { id: "d0", dateLabel: "Aug 9", dayLabel: "Sun" },
  { id: "d1", dateLabel: "Aug 10", dayLabel: "Mon" },
  { id: "d2", dateLabel: "Aug 11", dayLabel: "Tue" },
  { id: "d3", dateLabel: "Aug 12", dayLabel: "Wed" },
  { id: "d4", dateLabel: "Aug 13", dayLabel: "Thu" },
  { id: "d5", dateLabel: "Aug 14", dayLabel: "Fri" },
  { id: "d6", dateLabel: "Aug 15", dayLabel: "Sat" },
];

/** Helpers — keep row builders readable */
export function textCells(
  values: string[],
  tone: TrendTone | TrendTone[] = "neutral",
): TrendTableCell[] {
  return values.map((value, index) => ({
    kind: "text" as const,
    value,
    tone: Array.isArray(tone) ? tone[index]! : tone,
  }));
}

export function checkCells(flags: (boolean | null)[]): TrendTableCell[] {
  return flags.map((flag) => {
    if (flag === null) return { kind: "empty" as const };
    return { kind: "check" as const, ok: flag };
  });
}

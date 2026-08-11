import type { IssueKey } from "@/components/alerts/issue-names";

/** How a delta / table cell should look (good vs bad) */
export type TrendTone = "positive" | "negative" | "neutral";

export type TrendDayColumn = {
  id: string;
  /** e.g. "May 3" */
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
  /** Card title, e.g. "Last 7 Day Trend (May 3–9)" */
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

/** Shared Jun 1–7 column headers used by most trend designs */
export const JUN_1_7_DAYS: TrendDayColumn[] = [
  { id: "d0", dateLabel: "Jun 1", dayLabel: "Sun" },
  { id: "d1", dateLabel: "Jun 2", dayLabel: "Mon" },
  { id: "d2", dateLabel: "Jun 3", dayLabel: "Tue" },
  { id: "d3", dateLabel: "Jun 4", dayLabel: "Wed" },
  { id: "d4", dateLabel: "Jun 5", dayLabel: "Thu" },
  { id: "d5", dateLabel: "Jun 6", dayLabel: "Fri" },
  { id: "d6", dateLabel: "Jun 7", dayLabel: "Sat" },
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

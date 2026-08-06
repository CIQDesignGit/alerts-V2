import type { IssueKey } from "@/components/alerts/issue-names";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import type { IssueSku } from "@/lib/mock-alerts-insights";

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
};

/** One cell in the daily breakdown table */
export type TrendTableCell =
  | { kind: "text"; value: string; tone: TrendTone }
  | { kind: "empty" }
  | { kind: "check"; ok: boolean };

export type TrendTableRow = {
  id: string;
  label: string;
  infoTooltip?: string;
  cells: TrendTableCell[];
};

export type LastWeekTrendData = {
  issueKey: IssueKey;
  /** Card title, e.g. "Last Week Trend (May 3–9)" */
  title: string;
  vsPrevWeekTooltip: string;
  summaryMetrics: TrendSummaryMetric[];
  days: TrendDayColumn[];
  rows: TrendTableRow[];
};

/** Issues that already have a designed last-week trend card */
const SUPPORTED_TREND_ISSUES = new Set<IssueKey>(["lostBuyBox", "promoBadge"]);

export function hasLastWeekTrendCard(issueKey: IssueKey): boolean {
  return SUPPORTED_TREND_ISSUES.has(issueKey);
}

/**
 * True when the user asked for the issue “how it changed in 7 days” chip prompt.
 * Chip label is short; the full prompt sent to Ally is the longer summarize line.
 */
export function isLastSevenDayTrendPrompt(text: string): boolean {
  return /evolved for .+ over the last 7 days and what changed most recently/i.test(
    text,
  );
}

/** Figure out which issue the 7-day trend prompt is about. */
export function resolveTrendIssueFromPrompt(
  text: string,
  preferredIssueKey?: IssueKey,
): IssueKey | null {
  if (preferredIssueKey && hasLastWeekTrendCard(preferredIssueKey)) {
    return preferredIssueKey;
  }

  // Match longest / most specific filter names first
  const candidates = (
    Object.entries(ISSUE_NAMES) as [IssueKey, (typeof ISSUE_NAMES)[IssueKey]][]
  ).sort((a, b) => b[1].filter.length - a[1].filter.length);

  for (const [key, names] of candidates) {
    if (text.includes(names.filter)) return key;
  }

  return preferredIssueKey ?? null;
}

/** Lost Buy Box — matches the May 3–9 design screenshot */
function getLostBuyBoxTrend(sku: IssueSku): LastWeekTrendData {
  // Prefer live competitor name from the alert when we have it
  const competitor = sku.bbOwner
    ? `${sku.bbOwner} (3P Seller)`
    : "ElectroHub Direct (3P Seller)";

  return {
    issueKey: "lostBuyBox",
    title: "Last Week Trend (May 3–9)",
    vsPrevWeekTooltip:
      "Compares this week’s Lost Buy Box metrics to the prior 7 days.",
    summaryMetrics: [
      {
        id: "lbb",
        label: "LBB %",
        value: "71%",
        delta: "+16pp",
        deltaTone: "negative",
      },
      {
        id: "rev",
        label: "AVG REVENUE LOST",
        value: "-$86.0K",
        delta: "+65%",
        deltaTone: "negative",
      },
      {
        id: "comp",
        label: "PRIMARY COMPETITOR",
        value: competitor,
        infoTooltip:
          "Seller who won the Buy Box most often when you lost it last week.",
      },
      {
        id: "our-price",
        label: "YOUR AVG PRICE",
        value: "$529.99",
        delta: "+6.0%",
        deltaTone: "negative",
      },
      {
        id: "comp-price",
        label: "COMPETITOR'S AVG PRICE",
        value: "$362.09",
        delta: "+6.5%",
        deltaTone: "positive",
      },
      {
        id: "gap",
        label: "AVG PRICE GAP",
        value: "+$37.60",
        delta: "+288%",
        deltaTone: "negative",
      },
    ],
    days: [
      { id: "d0", dateLabel: "May 3", dayLabel: "Sat" },
      { id: "d1", dateLabel: "May 4", dayLabel: "Sun" },
      { id: "d2", dateLabel: "May 5", dayLabel: "Mon" },
      { id: "d3", dateLabel: "May 6", dayLabel: "Tue" },
      { id: "d4", dateLabel: "May 7", dayLabel: "Wed" },
      { id: "d5", dateLabel: "May 8", dayLabel: "Thu" },
      { id: "d6", dateLabel: "May 9", dayLabel: "Fri" },
    ],
    rows: [
      {
        id: "win-rate",
        label: "Buy Box win rate (crawls)",
        cells: [
          { kind: "text", value: "6/6", tone: "positive" },
          { kind: "text", value: "1/6", tone: "negative" },
          { kind: "text", value: "0/6", tone: "negative" },
          { kind: "text", value: "1/6", tone: "negative" },
          { kind: "text", value: "5/6", tone: "positive" },
          { kind: "text", value: "0/6", tone: "negative" },
          { kind: "text", value: "1/6", tone: "negative" },
        ],
      },
      {
        id: "price-gap",
        label: "Price gap",
        infoTooltip:
          "Your price minus the Buy Box winner’s price. Negative means you were cheaper.",
        cells: [
          { kind: "text", value: "-$22.40", tone: "positive" },
          { kind: "text", value: "+$35.00", tone: "negative" },
          { kind: "text", value: "+$48.50", tone: "negative" },
          { kind: "text", value: "+$41.99", tone: "negative" },
          { kind: "text", value: "-$18.75", tone: "positive" },
          { kind: "text", value: "+$44.00", tone: "negative" },
          { kind: "text", value: "+$29.50", tone: "negative" },
        ],
      },
      {
        id: "revenue",
        label: "Revenue impact",
        cells: [
          { kind: "empty" },
          { kind: "text", value: "$17.2K", tone: "negative" },
          { kind: "text", value: "$16.8K", tone: "negative" },
          { kind: "text", value: "$17.9K", tone: "negative" },
          { kind: "empty" },
          { kind: "text", value: "$19.1K", tone: "negative" },
          { kind: "text", value: "$15.0K", tone: "negative" },
        ],
      },
    ],
  };
}

/** Promo Badge — matches the May 10–16 design screenshot */
function getPromoBadgeTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "promoBadge",
    title: "Last Week Trend (May 10–16)",
    vsPrevWeekTooltip:
      "Compares this week’s Promo Badge metrics to the prior 7 days.",
    summaryMetrics: [
      {
        id: "badge-missing",
        label: "PROMO BADGE MISSING",
        value: "7 / 7 days",
        delta: "+75%",
        deltaTone: "negative",
      },
      {
        id: "rev",
        label: "EST. REVENUE IMPACT",
        value: "-$4,200",
        delta: "+133%",
        deltaTone: "negative",
      },
      {
        id: "list-mismatch",
        label: "LIST PRICE MISMATCH",
        value: "7 / 7 days",
        delta: "+40%",
        deltaTone: "negative",
      },
      {
        id: "sell-mismatch",
        label: "SELLING PRICE MISMATCH",
        value: "7 / 7 days",
        delta: "+17%",
        deltaTone: "negative",
      },
      {
        id: "list-vis",
        label: "LIST PRICE VISIBILITY",
        value: "2 / 7 days",
        delta: "+100%",
        deltaTone: "positive",
      },
      {
        id: "strikethrough",
        label: "NO STRIKETHROUGH ON MSRP",
        value: "7 / 7 days",
        delta: "+40%",
        deltaTone: "negative",
      },
    ],
    days: [
      { id: "d0", dateLabel: "May 10", dayLabel: "Sat" },
      { id: "d1", dateLabel: "May 11", dayLabel: "Sun" },
      { id: "d2", dateLabel: "May 12", dayLabel: "Mon" },
      { id: "d3", dateLabel: "May 13", dayLabel: "Tue" },
      { id: "d4", dateLabel: "May 14", dayLabel: "Wed" },
      { id: "d5", dateLabel: "May 15", dayLabel: "Thu" },
      { id: "d6", dateLabel: "May 16", dayLabel: "Fri" },
    ],
    rows: [
      {
        id: "expected",
        label: "Expected on Promo",
        cells: [
          { kind: "check", ok: true },
          { kind: "check", ok: true },
          { kind: "check", ok: false },
          { kind: "check", ok: true },
          { kind: "check", ok: true },
          { kind: "check", ok: false },
          { kind: "check", ok: true },
        ],
      },
      {
        id: "badge-crawls",
        label: "Badge Missing (crawls)",
        cells: [
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
        ],
      },
      {
        id: "msrp-crawls",
        label: "MSRP Strikethrough Missing (crawls)",
        cells: [
          { kind: "text", value: "0/6", tone: "positive" },
          { kind: "text", value: "0/6", tone: "positive" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "text", value: "0/6", tone: "positive" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
        ],
      },
    ],
  };
}

/**
 * Return the designed last-week trend card for Lost Buy Box / Promo Badge.
 * Other issues return null until we have designs for them.
 */
export function getLastWeekTrend(
  issueKey: IssueKey,
  sku: IssueSku,
): LastWeekTrendData | null {
  if (issueKey === "lostBuyBox") return getLostBuyBoxTrend(sku);
  if (issueKey === "promoBadge") return getPromoBadgeTrend(sku);
  return null;
}

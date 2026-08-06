import type { IssueKey } from "@/components/alerts/issue-names";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { getLastWeekTrendForIssue } from "@/lib/mock-last-week-trend-issues";
import type { LastWeekTrendData } from "@/lib/mock-last-week-trend-shared";

export type {
  LastWeekTrendData,
  TrendDayColumn,
  TrendSummaryMetric,
  TrendTableCell,
  TrendTableRow,
  TrendTone,
  TrendTypeBadge,
} from "@/lib/mock-last-week-trend-shared";

/** Issues that have a designed last-week trend card */
const SUPPORTED_TREND_ISSUES = new Set<IssueKey>([
  "lostBuyBox",
  "promoBadge",
  "dealPageVisibility",
  "coupon",
  "creditOffer",
  "bestSellerRank",
  "ratingReviews",
  "stockAvailability",
  "sponsoredSov",
  "keywordRank",
  "conversionDrop",
  "mediaSpend",
]);

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

  // Match longest / more specific filter names first
  const candidates = (
    Object.entries(ISSUE_NAMES) as [IssueKey, (typeof ISSUE_NAMES)[IssueKey]][]
  ).sort((a, b) => b[1].filter.length - a[1].filter.length);

  for (const [key, names] of candidates) {
    if (text.includes(names.filter)) return key;
  }

  return preferredIssueKey ?? null;
}

/**
 * Return the designed last-week trend card for a supported issue.
 * Unsupported issues (e.g. Shipping Speed) return null.
 */
export function getLastWeekTrend(
  issueKey: IssueKey,
  sku: IssueSku,
): LastWeekTrendData | null {
  if (!hasLastWeekTrendCard(issueKey)) return null;
  return getLastWeekTrendForIssue(issueKey, sku);
}

import { ISSUE_NAMES, type IssueKey } from "@/components/alerts/issue-names";
import { getSkuActiveIssueKeys } from "@/lib/mock-sku-rca";
import {
  resolveInsightsDateBounds,
  type InsightsDateRange,
} from "@/lib/insights-date-range";

/** Issues tracked in the SKU Insights weekly grid (matches product checklist). */
export const SKU_INSIGHTS_ISSUE_KEYS: IssueKey[] = [
  "lostBuyBox",
  "promoBadge",
  "dealPageVisibility",
  "bestSellerRank",
  "ratingReviews",
  "stockAvailability",
  "shippingSpeed",
];

export type SkuDayStatus = "clean" | "active";

export type SkuWeeklyIssueRow = {
  issueKey: IssueKey;
  name: string;
  days: SkuDayStatus[];
  activeDayCount: number;
};

export type SkuActiveIssue = {
  issueKey: IssueKey;
  name: string;
  statusLabel: string;
  sinceLabel: string;
  recommendation: string;
};

export type SkuWeeklyIssuesView = {
  dayLabels: string[];
  rows: SkuWeeklyIssueRow[];
  activeIssues: SkuActiveIssue[];
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** Deterministic weekly pattern per SKU + issue (stable across renders). */
const WEEKLY_PATTERNS: Record<IssueKey, SkuDayStatus[]> = {
  lostBuyBox: ["clean", "active", "active", "clean", "clean", "clean", "clean"],
  promoBadge: [
    "clean",
    "clean",
    "clean",
    "clean",
    "clean",
    "clean",
    "active",
  ],
  dealPageVisibility: [
    "clean",
    "clean",
    "active",
    "active",
    "active",
    "clean",
    "clean",
  ],
  coupon: ["clean", "clean", "clean", "clean", "clean", "clean", "clean"],
  bestSellerRank: [
    "clean",
    "active",
    "clean",
    "clean",
    "active",
    "active",
    "clean",
  ],
  ratingReviews: [
    "clean",
    "clean",
    "clean",
    "active",
    "active",
    "clean",
    "clean",
  ],
  stockAvailability: [
    "active",
    "active",
    "clean",
    "clean",
    "clean",
    "clean",
    "clean",
  ],
  shippingSpeed: [
    "clean",
    "clean",
    "clean",
    "clean",
    "active",
    "active",
    "clean",
  ],
  sponsoredSov: ["clean", "clean", "clean", "clean", "clean", "clean", "clean"],
  conversionDrop: ["clean", "clean", "clean", "clean", "clean", "clean", "clean"],
  keywordRank: ["clean", "clean", "clean", "clean", "clean", "clean", "clean"],
  mediaSpend: ["clean", "clean", "clean", "clean", "clean", "clean", "clean"],
};

const STATUS_LABELS: Partial<Record<IssueKey, string>> = {
  lostBuyBox: "Lost",
  promoBadge: "Missing",
  dealPageVisibility: "Not visible",
  bestSellerRank: "Dropped",
  ratingReviews: "Declining",
  stockAvailability: "OOS",
  shippingSpeed: "Slow",
};

const SINCE_LABELS = [
  "Today",
  "1 day ago",
  "2 days ago",
  "3 days ago",
  "4 days ago",
];

const RECOMMENDATIONS: Partial<Record<IssueKey, string>> = {
  lostBuyBox:
    "Match competitor pricing within MAP tolerance and monitor Buy Box win rate hourly until reclaimed.",
  promoBadge:
    "Reingest promo through Amazon Promo Manager and confirm start/end dates; validate coupon stack eligibility.",
  dealPageVisibility:
    "Verify deal enrollment status in Vendor Central and confirm the ASIN is included in the active event window.",
  bestSellerRank:
    "Review recent price and promo changes that may have affected category rank; compare against top 3 competitors.",
  ratingReviews:
    "Audit recent 1–2 star reviews for fulfillment or product defects; respond to flagged reviews within 24h.",
  stockAvailability:
    "Confirm inbound PO ETA and enable backup fulfillment node if primary FC is constrained.",
  shippingSpeed:
    "Check FC transfer delays and consider shifting inventory to a faster-shipping node.",
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function rotatePattern(
  pattern: SkuDayStatus[],
  offset: number,
): SkuDayStatus[] {
  const n = pattern.length;
  return pattern.map((_, index) => pattern[(index + offset) % n]!);
}

/** Build weekly issue grid + active issue details for one SKU. */
export function getSkuWeeklyIssuesView(
  entityId: string,
  dateRange: InsightsDateRange,
): SkuWeeklyIssuesView {
  const activeKeySet = new Set(getSkuActiveIssueKeys(entityId));
  const offset = hashString(entityId) % 7;
  const bounds = resolveInsightsDateBounds(dateRange);
  const dayLabels = bounds
    ? buildDayLabels(bounds.to)
    : [...WEEKDAY_LABELS];

  const rows: SkuWeeklyIssueRow[] = SKU_INSIGHTS_ISSUE_KEYS.map((issueKey) => {
    if (!activeKeySet.has(issueKey)) {
      return {
        issueKey,
        name: ISSUE_NAMES[issueKey].chip,
        days: Array(7).fill("clean") as SkuDayStatus[],
        activeDayCount: 0,
      };
    }

    const base = WEEKLY_PATTERNS[issueKey] ?? Array(7).fill("clean");
    const days = rotatePattern(base, offset);
    const activeDayCount = days.filter((d) => d === "active").length;
    return {
      issueKey,
      name: ISSUE_NAMES[issueKey].chip,
      days,
      activeDayCount,
    };
  });

  const activeIssues: SkuActiveIssue[] = rows
    .filter((row) => row.activeDayCount > 0)
    .sort((a, b) => b.activeDayCount - a.activeDayCount)
    .map((row, index) => ({
      issueKey: row.issueKey,
      name: ISSUE_NAMES[row.issueKey].filter,
      statusLabel: STATUS_LABELS[row.issueKey] ?? "Active",
      sinceLabel: SINCE_LABELS[index % SINCE_LABELS.length]!,
      recommendation:
        RECOMMENDATIONS[row.issueKey] ??
        "Review listing health and confirm the latest catalog data for this SKU.",
    }));

  return { dayLabels, rows, activeIssues };
}

function buildDayLabels(rangeEnd: Date): string[] {
  const end = new Date(rangeEnd);
  end.setHours(0, 0, 0, 0);
  const labels: string[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    labels.push(
      d.toLocaleDateString("en-US", { weekday: "short" }),
    );
  }
  return labels;
}

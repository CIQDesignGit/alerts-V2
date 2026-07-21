import type { IssueKey } from "@/components/alerts/issue-names";
import type { IssueSku } from "@/lib/mock-alerts-insights";

export type RcaLiveStatus = "ok" | "warning" | "bad";

export type RcaIssueRow = {
  issueKey: IssueKey;
  liveStatus: RcaLiveStatus;
  /** Short status label on the pill — e.g. Lost, Dropped, OK */
  statusLabel: string;
  impactDollars?: number;
};

export type RcaIssueGroup = {
  id: string;
  label: string;
  issues: RcaIssueRow[];
};

export type RcaKpiCard = {
  id: string;
  title: string;
  value: string;
  /** red = negative gap, green = positive, default = neutral */
  tone: "negative" | "positive" | "neutral";
  subtitle: string;
};

export type RcaAnalysisBlock = {
  heading: string;
  body: string;
};

export type RcaTrendPoint = {
  week: string;
  plan: number;
  actual: number;
};

export type SkuRcaData = {
  category: string;
  modelId: string;
  asin: string;
  name: string;
  gapDollars: number;
  gapUnits?: number;
  summaryHeadline: string;
  kpis: RcaKpiCard[];
  alertBanner?: string;
  issuesLastUpdated: string;
  issueGroups: RcaIssueGroup[];
  trend: RcaTrendPoint[];
  trendCaption: string;
  analysis: RcaAnalysisBlock[];
  recommendations: string[];
};

/** Dollar-first compact label — e.g. −$46.5K */
export function formatCompactDollars(value: number): string {
  const abs = Math.abs(value);
  const formatted =
    abs >= 1_000_000
      ? `$${(abs / 1_000_000).toFixed(1)}M`
      : abs >= 1_000
        ? `$${(abs / 1_000).toFixed(1)}K`
        : `$${abs.toLocaleString()}`;
  if (value < 0) return `−${formatted}`;
  if (value > 0) return `+${formatted}`;
  return formatted;
}

/**
 * Fixed RCA accordion groups — every SKU shows the full checklist.
 * Labels match product UI (not Sales/Ops/Marketing tags).
 */
export const RCA_ISSUE_GROUP_ORDER: {
  id: string;
  label: string;
  issueKeys: IssueKey[];
}[] = [
  {
    id: "pdp-promos",
    label: "PDP & Promos",
    issueKeys: ["lostBuyBox", "promoBadge", "dealPageVisibility", "coupon"],
  },
  {
    id: "reputation",
    label: "Product Reputation",
    issueKeys: ["bestSellerRank", "ratingReviews"],
  },
  {
    id: "fulfilment",
    label: "Fulfilment",
    issueKeys: ["stockAvailability", "shippingSpeed"],
  },
  {
    id: "search-traffic",
    label: "Search & Traffic",
    issueKeys: [
      "sponsoredSov",
      "conversionDrop",
      "keywordRank",
      "mediaSpend",
    ],
  },
];

const DEFAULT_ISSUE_STATE: Record<
  IssueKey,
  Omit<RcaIssueRow, "issueKey">
> = {
  lostBuyBox: {
    liveStatus: "bad",
    statusLabel: "Lost",
    impactDollars: -119_700,
  },
  promoBadge: {
    liveStatus: "bad",
    statusLabel: "Missing",
    impactDollars: -42_100,
  },
  dealPageVisibility: {
    liveStatus: "warning",
    statusLabel: "Detected",
    impactDollars: -18_300,
  },
  coupon: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  bestSellerRank: {
    liveStatus: "bad",
    statusLabel: "Dropped",
    impactDollars: -18_400,
  },
  ratingReviews: {
    liveStatus: "bad",
    statusLabel: "Dropped",
    impactDollars: -24_500,
  },
  stockAvailability: {
    liveStatus: "bad",
    statusLabel: "OOS",
    impactDollars: -8_200,
  },
  shippingSpeed: {
    liveStatus: "warning",
    statusLabel: "Slow",
  },
  sponsoredSov: {
    liveStatus: "bad",
    statusLabel: "Dropped",
    impactDollars: -28_400,
  },
  conversionDrop: {
    liveStatus: "bad",
    statusLabel: "Dropped",
    impactDollars: -56_800,
  },
  keywordRank: {
    liveStatus: "bad",
    statusLabel: "Dropped",
    impactDollars: -31_200,
  },
  mediaSpend: {
    liveStatus: "bad",
    statusLabel: "Threshold Breached",
    impactDollars: -42_300,
  },
};

function buildIssueGroups(): RcaIssueGroup[] {
  return RCA_ISSUE_GROUP_ORDER.map((group) => ({
    id: group.id,
    label: group.label,
    issues: group.issueKeys.map((issueKey) => ({
      issueKey,
      ...DEFAULT_ISSUE_STATE[issueKey],
    })),
  }));
}

/** Build RCA payload for a selected alert SKU (mock narrative for layout). */
export function getSkuRcaData(sku: IssueSku): SkuRcaData {
  return {
    category: "Kitchen Appliances",
    modelId: sku.id.toUpperCase(),
    asin: sku.asin,
    name: sku.name,
    gapDollars: sku.gapDollars,
    gapUnits: -150,
    summaryHeadline:
      "Revenue collapsed after SAS price jumped to $529.99 on May 3, losing the buy box for the full week. Recovery has started this week, but a missing deal badge is still limiting conversion.",
    kpis: [
      {
        id: "last-week",
        title: "Last Week (May 3–9)",
        value: "−$227.7K",
        tone: "negative",
        subtitle: "$846 of $228.5K plan · 37.0% attainment",
      },
      {
        id: "wtd",
        title: "WTD (May 10–13)",
        value: "$126.3K",
        tone: "neutral",
        subtitle: "in sales · 49.2% of week elapsed",
      },
      {
        id: "eow",
        title: "Projected EOW (May 10–16)",
        value: "+$29.6K vs plan",
        tone: "positive",
        subtitle: "$229K plan · $258.3K projected · 112.9%",
      },
    ],
    issuesLastUpdated: "Last updated 11:35 AM today (2h ago)",
    issueGroups: buildIssueGroups(),
    trend: [
      { week: "W1", plan: 220, actual: 215 },
      { week: "W2", plan: 225, actual: 230 },
      { week: "W3", plan: 228, actual: 210 },
      { week: "W4", plan: 230, actual: 198 },
      { week: "W5", plan: 228, actual: 185 },
      { week: "W6", plan: 228, actual: 0.8 },
      { week: "W7", plan: 229, actual: 126 },
      { week: "W8", plan: 229, actual: 180 },
    ],
    trendCaption:
      "Plan vs actual revenue ($K). Week 6 shows the buy-box loss collapse; W7–W8 recovery underway.",
    analysis: [
      {
        heading: "Primary cause — Lost Buy Box (May 3–9)",
        body: "SAS price jumped to $529.99 on May 3 — ~$170 above 3P sellers at $344–$379. amazon.com lost the buy box all week; 3P captured ~$120K (~53% of the gap).",
      },
      {
        heading: "Secondary cause — media spend cuts",
        body: "Top keywords saw WoW spend cuts, including 'vacuum cleaners for home' (−$1.7K spend, −$37K ad sales). Less paid traffic while buy box was lost removed any recovery path.",
      },
      {
        heading: "This week — recovery in progress",
        body: "Buy box reclaimed at $349.99; RTS projects $258K (+13% vs plan). Deal badge still missing May 10–13, limiting conversion on the $180 price cut.",
      },
    ],
    recommendations: [
      "Hold buy box price at $349.99 through end of week; avoid SAS reversion above $400.",
      "Restore deal badge / deal page visibility on this ASIN within 24 hours.",
      "Reinstate spend on top converting keywords cut last week (−$1.7K).",
    ],
  };
}

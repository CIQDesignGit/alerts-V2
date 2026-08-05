import type { IssueKey } from "@/components/alerts/issue-names";
import {
  ISSUE_NAMES,
  ISSUE_UNHEALTHY_STATUS_LABEL,
} from "@/components/alerts/issue-names";
import type { AllyAiPrompt, IssueSku } from "@/lib/mock-alerts-insights";

export type RcaLiveStatus = "ok" | "warning" | "bad";

/** Red dot / error pill — active issues only (hide green "ok" and amber "warning"). */
export function isRedIssue(status: RcaLiveStatus): boolean {
  return status === "bad";
}

export type RcaIssueRow = {
  issueKey: IssueKey;
  liveStatus: RcaLiveStatus;
  /** Short status label on the pill — e.g. Lost, Dropped, OK */
  statusLabel: string;
  impactDollars?: number;
};

/** Last-week issue row — how many days the issue was active in the period */
export type RcaLastWeekIssue = {
  issueKey: IssueKey;
  daysPresent: number;
  daysTotal: number;
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
  /** Ranked by $ impact — drivers from the prior week */
  lastWeekTopIssues: RcaLastWeekIssue[];
  /** AllyAI summary for live issue checks */
  liveIssuesSummary: string;
  /** AllyAI summary for last-week issue trend */
  lastWeekIssuesSummary: string;
  suggestedPrompts: AllyAiPrompt[];
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
    issueKeys: [
      "lostBuyBox",
      "promoBadge",
      "dealPageVisibility",
      "coupon",
      "creditOffer",
    ],
  },
  {
    id: "reputation",
    label: "Product Reputation",
    issueKeys: ["bestSellerRank", "ratingReviews"],
  },
  {
    id: "fulfilment",
    label: "Fulfillment",
    issueKeys: ["stockAvailability", "shippingSpeed"],
  },
  {
    id: "search-traffic",
    label: "Search & Traffic",
    issueKeys: [
      "sponsoredSov",
      "keywordRank",
      "conversionDrop",
      "mediaSpend",
    ],
  },
];

/** Healthy default for inactive checklist rows — live list never shows these. */
const DEFAULT_ISSUE_STATE: Record<
  IssueKey,
  Omit<RcaIssueRow, "issueKey">
> = {
  lostBuyBox: {
    liveStatus: "ok",
    statusLabel: "OK",
    impactDollars: -899.4,
  },
  promoBadge: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  dealPageVisibility: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  coupon: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  creditOffer: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  bestSellerRank: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  ratingReviews: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  stockAvailability: {
    liveStatus: "ok",
    statusLabel: "OK",
    impactDollars: -1_800,
  },
  shippingSpeed: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  sponsoredSov: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  conversionDrop: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  keywordRank: {
    liveStatus: "ok",
    statusLabel: "OK",
  },
  mediaSpend: {
    liveStatus: "ok",
    statusLabel: "OK",
    impactDollars: -12_400,
  },
};

const ALL_ISSUE_KEYS: IssueKey[] = RCA_ISSUE_GROUP_ORDER.flatMap(
  (group) => group.issueKeys,
);

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Pick 2–5 red issues per SKU — stable for the same id across renders. */
export function getSkuActiveIssueKeys(entityId: string): IssueKey[] {
  const hash = hashString(entityId);
  const count = 2 + (hash % 4);

  const ranked = [...ALL_ISSUE_KEYS].sort((a, b) => {
    const scoreA = hashString(`${entityId}:${a}`);
    const scoreB = hashString(`${entityId}:${b}`);
    return scoreA - scoreB;
  });

  return ranked.slice(0, count);
}

function buildIssueGroupsForSku(skuId: string): RcaIssueGroup[] {
  const activeKeys = new Set(getSkuActiveIssueKeys(skuId));

  return RCA_ISSUE_GROUP_ORDER.map((group) => ({
    id: group.id,
    label: group.label,
    issues: group.issueKeys
      .filter((issueKey) => activeKeys.has(issueKey))
      .map((issueKey) => {
        const defaults = DEFAULT_ISSUE_STATE[issueKey];
        const unhealthyLabel = ISSUE_UNHEALTHY_STATUS_LABEL[issueKey];
        return {
          issueKey,
          ...defaults,
          liveStatus: "bad" as const,
          // Live rows only include unhealthy issues — use sheet labels, not “OK”
          statusLabel: unhealthyLabel ?? "Active",
        };
      }),
  })).filter((group) => group.issues.length > 0);
}

/** Top last-week drivers — ranked by days present, stable per SKU. */
function buildLastWeekTopIssuesForSku(skuId: string): RcaLastWeekIssue[] {
  const hash = hashString(`${skuId}:last-week`);
  const ranked = ALL_ISSUE_KEYS.map((issueKey) => ({
    issueKey,
    ...DEFAULT_ISSUE_STATE[issueKey],
  }))
    .filter((row) => row.impactDollars != null)
    .sort((a, b) => {
      const byImpact = (a.impactDollars ?? 0) - (b.impactDollars ?? 0);
      if (byImpact !== 0) return byImpact;
      return (
        hashString(`${skuId}:${a.issueKey}`) -
        hashString(`${skuId}:${b.issueKey}`)
      );
    });

  const count = 3 + (hash % 2);
  const daysTotal = 7;

  return ranked.slice(0, count).map((row) => {
    const dayHash = hashString(`${skuId}:${row.issueKey}:days`);
    const daysPresent = Math.max(1, daysTotal - (dayHash % 4));

    return {
      issueKey: row.issueKey,
      daysPresent,
      daysTotal,
    };
  });
}

function issuePane(issueKey: IssueKey): string {
  return ISSUE_NAMES[issueKey].pane;
}

function buildLiveIssuesSummary(
  sku: IssueSku,
  groups: RcaIssueGroup[],
): string {
  const live = groups
    .flatMap((group) => group.issues)
    .filter((issue) => isRedIssue(issue.liveStatus));

  if (live.length === 0) {
    return `No active issues on ${sku.name} right now — all monitored checks are passing.`;
  }

  const sorted = [...live].sort(
    (a, b) => (a.impactDollars ?? 0) - (b.impactDollars ?? 0),
  );
  const primary = sorted[0];
  const primaryName = issuePane(primary.issueKey);
  const impact =
    primary.impactDollars != null
      ? ` (~${formatCompactDollars(primary.impactDollars)} at risk)`
      : "";

  const others = sorted
    .slice(1, 3)
    .map((issue) => issuePane(issue.issueKey));

  if (others.length === 0) {
    return `${primaryName} is the only live flag on ${sku.name}${impact}. ${primary.statusLabel !== "OK" ? `Status: ${primary.statusLabel}.` : ""} Address this first to limit further gap widening today.`.trim();
  }

  return `${primaryName} is the top live driver on ${sku.name}${impact}. Also active now: ${others.join(" and ")}${sorted.length > 3 ? ` (+${sorted.length - 3} more)` : ""}.`;
}

function buildLastWeekIssuesSummary(
  sku: IssueSku,
  issues: RcaLastWeekIssue[],
): string {
  if (issues.length === 0) {
    return `No material issue patterns on ${sku.name} over the last 7 days.`;
  }

  const top = issues[0];
  const topName = issuePane(top.issueKey);
  const second = issues[1];

  const persistent = issues.filter(
    (issue) => issue.daysPresent >= issue.daysTotal - 1,
  );

  if (persistent.length >= 2) {
    const names = persistent
      .slice(0, 2)
      .map((issue) => issuePane(issue.issueKey))
      .join(" and ");
    return `Over the last 7 days, ${topName} led exposure (${top.daysPresent}/${top.daysTotal} days active). ${names} also persisted most of the week — the pattern suggests linked root causes rather than one-off noise.`;
  }

  if (second) {
    return `Last week's trend was led by ${topName} (${top.daysPresent}/${top.daysTotal} days active), then ${issuePane(second.issueKey)} (${second.daysPresent}/${second.daysTotal} days). Momentum improved mid-week but neither issue fully cleared.`;
  }

  return `${topName} dominated last week's issue trend on ${sku.name}, active ${top.daysPresent} of ${top.daysTotal} days.`;
}

function buildSkuSuggestedPrompts(sku: IssueSku): AllyAiPrompt[] {
  return [
    {
      id: "trends-7d",
      label: "See trends for Last 7 days",
      prompt: `Show issue trends for ${sku.name} over the last 7 days and highlight what changed.`,
    },
    {
      id: "summarize-issues",
      label: `Summarize all issues on ${sku.name}`,
      prompt: `Summarize all active and recent issues on ${sku.name}, ranked by revenue impact.`,
    },
    {
      id: "changes-24h",
      label: "What changed in the last 24 hours?",
      prompt: `What changed on ${sku.name} in the last 24 hours across buy box, promos, traffic, and conversion?`,
    },
  ];
}

/** Build RCA payload for a selected alert SKU (mock narrative for layout). */
export function getSkuRcaData(sku: IssueSku): SkuRcaData {
  const issueGroups = buildIssueGroupsForSku(sku.id);
  const lastWeekTopIssues = buildLastWeekTopIssuesForSku(sku.id);

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
    issueGroups,
    lastWeekTopIssues,
    liveIssuesSummary: buildLiveIssuesSummary(sku, issueGroups),
    lastWeekIssuesSummary: buildLastWeekIssuesSummary(sku, lastWeekTopIssues),
    suggestedPrompts: buildSkuSuggestedPrompts(sku),
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

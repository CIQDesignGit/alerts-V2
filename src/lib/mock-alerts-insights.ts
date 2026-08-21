import {
  ISSUE_NAMES,
  type IssueGroup,
  type IssueKey,
} from "@/components/alerts/issue-names";
import {
  FULL_RCA_LAST_WEEK_PROMPT,
  getTaxonomyRolledUpChips,
  isGapToPlanPrompt,
  type AllyAiPrompt,
  type TaxonomyChipLevel,
} from "@/lib/ally-chipsets";
import { snapshotMetricLabel } from "@/lib/insights-metrics-config";
import {
  EOW_KPI_TITLE,
  LAST_WEEK_KPI_TITLE,
  MOCK_NOW,
  PORTFOLIO_WTD_RANGE,
  WTD_KPI_TITLE,
} from "@/lib/mock-calendar";
import {
  paintIssueAlertsOps,
  paintTaxonomyOpsDescending,
  skuOpsDollars,
  sumOpsDollars,
  withDescendingSkuOps,
} from "@/lib/ops";

export type { AllyAiPrompt } from "@/lib/ally-chipsets";
export { FULL_RCA_LAST_WEEK_PROMPT, isGapToPlanPrompt };

export type BrandCard = {
  name: string;
  gapDollars: number;
  attainmentPct: number;
  /** Sales achieved so far this period */
  achievedDollars: number;
  /** Sales target (plan) for this period */
  targetDollars: number;
};

export type IssueSku = {
  id: string;
  name: string;
  asin: string;
  seller: string;
  gapDollars: number;
  /** Brand for Alerts filter chips / popovers */
  brand: string;
  /** Product category — used when Alerts are grouped by category */
  category: string;
  /**
   * Ordered Product Sales — stamped so left-pane lists already read
   * high → low without re-sorting issues/SKUs.
   */
  opsDollars?: number;
  /** Buy Box / competitive fields when relevant to the issue */
  bbOwner?: string;
  theirPrice?: number;
  ourPrice?: number;
  lostAt?: string;
};

/**
 * 4-character alphanumeric code shown first on SKU list rows
 * (before the full ASIN) in Issue Type + Taxonomy trees.
 */
export function skuShortCode(asin: string): string {
  const compact = asin.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  // Skip common B0 Amazon prefix so the code stays product-looking
  const body = compact.startsWith("B0") ? compact.slice(2) : compact;
  return `${body}0000`.slice(0, 4);
}

/** Active Alerts tab filters (Brand · Category · SKU · Issue in taxonomy) */
export type AlertsFilters = {
  brand: string | null;
  category: string | null;
  /** Selected SKU id — exact match when set */
  skuId: string | null;
  /** Free-text search (name / ASIN / $ gap) */
  skuQuery: string;
  /** Issue type filter — used in taxonomy view (single-select) */
  issueKey: IssueKey | null;
};

/**
 * How far back the Alerts list looks for issues that became active.
 * 24h = acute / just happened · 7D = default week · 30D = includes chronic.
 */
export type AlertsTimeWindow = "24h" | "7d" | "30d";

export const DEFAULT_ALERTS_TIME_WINDOW: AlertsTimeWindow = "7d";

/** Fixed "now" for the prototype so Lost At dates stay stable across machines */
export const ALERTS_MOCK_NOW = MOCK_NOW;

/**
 * Last retailer scrape clock — single source of truth for
 * Alerts “Last crawl” and SKU “Last updated” (see LastCrawlBadge).
 */
export const ALERTS_LAST_CRAWL_TIME = "4:00 PM today";
export const ALERTS_LAST_CRAWL_RELATIVE = "2h ago";
export const ALERTS_LAST_CRAWL_LABEL = `${ALERTS_LAST_CRAWL_TIME} (${ALERTS_LAST_CRAWL_RELATIVE})`;

const TIME_WINDOW_HOURS: Record<AlertsTimeWindow, number> = {
  "24h": 24,
  "7d": 7 * 24,
  "30d": 30 * 24,
};

export const ALERTS_TIME_WINDOW_OPTIONS: {
  value: AlertsTimeWindow;
  label: string;
}[] = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
];

/** Human copy under the Alerts list header, e.g. "last 7 days" */
export function alertsTimeWindowPhrase(window: AlertsTimeWindow): string {
  if (window === "24h") return "last 24 hours";
  if (window === "7d") return "last 7 days";
  return "last 30 days";
}

/** Turn "Aug 20 14:32" into a real Date (year taken from ALERTS_MOCK_NOW). */
export function parseLostAt(lostAt: string): Date | null {
  const match = lostAt.match(
    /^([A-Za-z]{3})\s+(\d{1,2})\s+(\d{1,2}):(\d{2})$/,
  );
  if (!match) return null;
  const [, mon, day, hour, minute] = match;
  const months: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const month = months[mon];
  if (month == null) return null;
  const parsed = new Date(
    ALERTS_MOCK_NOW.getFullYear(),
    month,
    Number(day),
    Number(hour),
    Number(minute),
  );
  // Dates after mock "now" wrap to the previous year
  if (parsed > ALERTS_MOCK_NOW) {
    parsed.setFullYear(parsed.getFullYear() - 1);
  }
  return parsed;
}

/** True when this SKU's Lost At falls inside the selected lookback window. */
export function skuWithinTimeWindow(
  sku: IssueSku,
  window: AlertsTimeWindow,
): boolean {
  if (!sku.lostAt) return true;
  const lost = parseLostAt(sku.lostAt);
  if (!lost) return true;
  const ms = TIME_WINDOW_HOURS[window] * 60 * 60 * 1000;
  const earliest = new Date(ALERTS_MOCK_NOW.getTime() - ms);
  return lost >= earliest && lost <= ALERTS_MOCK_NOW;
}

/** One row inside Brand / Category filter popovers */
export type FilterDimensionOption = {
  id: string;
  name: string;
  gapDollars: number;
  unitsDelta: number;
  issueCount: number;
  achievedDollars: number;
  targetDollars: number;
};

/** SKU row inside a category-aggregated alert (keeps issue link for detail/RCA) */
export type CategorySku = IssueSku & { issueKey: IssueKey };

/** Category-level rollup of alerts (same shape as IssueAlert for the left list) */
export type CategoryAlert = {
  id: string;
  name: string;
  skuCount: number;
  gapDollars: number;
  severity: "high" | "mid" | "low";
  aiSignal?: string;
  skus: CategorySku[];
};

export type AlertsGroupBy = "issue" | "category";

export type IssueAlert = {
  issueKey: IssueKey;
  skuCount: number;
  gapDollars: number;
  /** visual weight: high = error red, mid = warning, low = muted */
  severity: "high" | "mid" | "low";
  aiSignal?: string;
  skus: IssueSku[];
};

export type HierarchyIssueChip = {
  chip: string;
  count: number;
};

export type HierarchyLiveMetrics = {
  attainmentPct: number;
  unitsDelta: number;
  /** Average selling price change ($) */
  aspDelta: number;
  issueChips?: HierarchyIssueChip[];
};

/**
 * One cell in the Snapshot metrics strip (OPS, GV, CONV., …).
 * Matches the CommerceIQ consolidated-total metric row.
 */
export type SnapshotMetricCell = {
  id: string;
  label: string;
  value: string;
  /** % change vs comparison period — omit for inventory-style metrics */
  deltaPct?: number;
  /** Secondary line under the value (e.g. attainment plan dollars) */
  subtitle?: string;
  /** Render attainment as a colored % badge instead of a delta chip */
  variant?: "default" | "attainment";
};

export type HierarchyNode = {
  id: string;
  name: string;
  level: "business" | "brand" | "category" | "subcategory" | "sku";
  gapDollars: number;
  /** AllyAI live narrative for this node */
  insight?: string;
  /** Placeholder live KPIs shown on Live Insights */
  metrics?: HierarchyLiveMetrics;
  children?: HierarchyNode[];
};

/** Fill missing metrics so every parent level still shows KPI cards. */
export function getLiveMetrics(node: HierarchyNode): HierarchyLiveMetrics {
  if (node.metrics) return node.metrics;

  const attainmentPct =
    node.gapDollars >= 0
      ? Math.min(120, 100 + Math.round(node.gapDollars / 50_000))
      : Math.max(35, 100 + Math.round(node.gapDollars / 80_000));

  return {
    attainmentPct,
    unitsDelta: Math.round(node.gapDollars / 80),
    aspDelta: node.gapDollars < 0 ? -2.4 : 1.1,
    issueChips:
      node.gapDollars < 0
        ? [
            { chip: "Buy Box", count: 3 },
            { chip: "Stock", count: 1 },
          ]
        : undefined,
  };
}

function formatCompactCount(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatMoneyCompact(n: number): string {
  const abs = Math.abs(n);
  const formatted =
    abs >= 1_000_000
      ? `$${(abs / 1_000_000).toFixed(1)}M`
      : abs >= 1_000
        ? `$${(abs / 1_000).toFixed(1)}K`
        : `$${abs.toFixed(0)}`;
  return n < 0 ? `−${formatted}` : formatted;
}

/**
 * Snapshot performance strip — same columns as the CIQ consolidated metrics row.
 * Values are mock, scaled from the node’s Gap $ so levels look different.
 */
export function getSnapshotMetricCells(node: HierarchyNode): SnapshotMetricCell[] {
  const live = getLiveMetrics(node);
  const gapAbs = Math.max(5_000, Math.abs(node.gapDollars));
  // Rough “sales” scale so SKUs look smaller than brands
  const scale =
    node.level === "business"
      ? 1
      : node.level === "brand"
        ? 0.45
        : node.level === "category"
          ? 0.22
          : node.level === "subcategory"
            ? 0.12
            : 0.04;

  const ops = Math.round(4_600_000 * scale + gapAbs * 0.4);
  const plan = Math.round(ops / Math.max(0.35, live.attainmentPct / 100));
  const achieved = Math.round(plan * (live.attainmentPct / 100));
  const orgSales = Math.round(ops * 0.96);
  const adSales = Math.round(ops * 0.042);
  const adSpend = node.gapDollars < -40_000 ? 0 : Math.round(adSales * 0.35);
  const units = Math.round(188_600 * scale);
  const gv = Math.round(687_000 * scale);
  const convPct = Math.min(45, Math.max(8, 27.5 + live.unitsDelta / 500));
  const asp = Math.max(8, 24.65 + live.aspDelta);
  const orgTraffic = Math.round(677_800 * scale);
  const clicks = Math.round(9_210 * scale);
  const subRev = Math.round(271_600 * scale);
  const subUnits = Math.round(11_649 * scale);
  const subs = Math.round(80_840 * scale);
  const onHand = Math.round(318_300 * scale);
  const openPo = Math.round(83_072 * scale);
  const woc = Math.max(1.2, 9.7 + (node.gapDollars < 0 ? -1.4 : 0.6));

  // Comparison deltas — slightly worse when Gap is negative
  const miss = node.gapDollars < 0;
  const d = (up: number, down: number) => (miss ? down : up);

  return [
    {
      id: "gap",
      label: snapshotMetricLabel("gap"),
      value: formatGapDollars(node.gapDollars),
      deltaPct: d(3.2, -8.4),
    },
    {
      id: "ops",
      label: snapshotMetricLabel("ops"),
      value: formatMoneyCompact(ops),
      deltaPct: d(4.1, -5.2),
    },
    {
      id: "attain",
      label: snapshotMetricLabel("attain"),
      value: `${live.attainmentPct}%`,
      subtitle: `${formatMoneyCompact(achieved)} vs ${formatMoneyCompact(plan)} plan`,
      variant: "attainment",
    },
    {
      id: "org-sales",
      label: snapshotMetricLabel("org-sales"),
      value: formatMoneyCompact(orgSales),
      deltaPct: d(12.4, -3.1),
    },
    {
      id: "ad-sales",
      label: snapshotMetricLabel("ad-sales"),
      value: formatMoneyCompact(adSales),
      deltaPct: d(4.8, -61.6),
    },
    {
      id: "ad-spend",
      label: snapshotMetricLabel("ad-spend"),
      value: formatMoneyCompact(adSpend),
      deltaPct: adSpend === 0 ? -100 : d(2.1, -18.4),
    },
    {
      id: "units",
      label: snapshotMetricLabel("units"),
      value: formatCompactCount(units),
      deltaPct: d(2.5, -6.8),
    },
    {
      id: "gv",
      label: snapshotMetricLabel("gv"),
      value: formatCompactCount(gv),
      deltaPct: d(3.4, -11.1),
    },
    {
      id: "conv",
      label: snapshotMetricLabel("conv"),
      value: `${convPct.toFixed(1)}%`,
      deltaPct: d(15.2, -4.6),
    },
    {
      id: "asp",
      label: snapshotMetricLabel("asp"),
      value: `$${asp.toFixed(2)}`,
      deltaPct: d(1.6, -2.8),
    },
    {
      id: "org-traffic",
      label: snapshotMetricLabel("org-traffic"),
      value: formatCompactCount(orgTraffic),
      deltaPct: d(1.2, -8.9),
    },
    {
      id: "clicks",
      label: snapshotMetricLabel("clicks"),
      value: clicks.toLocaleString(),
      deltaPct: d(5.0, -67.5),
    },
    {
      id: "sub-rev",
      label: snapshotMetricLabel("sub-rev"),
      value: formatMoneyCompact(subRev),
      deltaPct: d(8.6, -1.4),
    },
    {
      id: "sub-units",
      label: snapshotMetricLabel("sub-units"),
      value: subUnits.toLocaleString(),
      deltaPct: d(6.3, -2.0),
    },
    {
      id: "subs",
      label: snapshotMetricLabel("subs"),
      value: subs.toLocaleString(),
      deltaPct: d(5.4, -0.8),
    },
    {
      id: "on-hand",
      label: snapshotMetricLabel("on-hand"),
      value: formatCompactCount(onHand),
    },
    {
      id: "open-po",
      label: snapshotMetricLabel("open-po"),
      value: openPo.toLocaleString(),
    },
    {
      id: "woc",
      label: snapshotMetricLabel("woc"),
      value: `${woc.toFixed(1)} wk`,
    },
  ];
}

export function childLevelLabel(
  parentLevel: HierarchyNode["level"],
): string {
  if (parentLevel === "business") return "Brand";
  if (parentLevel === "brand") return "Category";
  if (parentLevel === "category") return "Sub-category / SKU";
  if (parentLevel === "subcategory") return "SKU";
  return "Child";
}


export function formatGapDollars(value: number): string {
  const abs = Math.abs(value);
  const formatted =
    abs >= 1_000_000
      ? `$${(abs / 1_000_000).toFixed(1)}M`
      : abs >= 1_000
        ? `$${(abs / 1_000).toFixed(0)}K`
        : `$${abs.toLocaleString()}`;
  if (value < 0) return `−${formatted}`;
  if (value > 0) return `+${formatted}`;
  return formatted;
}

export function formatAtRisk(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}K`;
  return `$${abs.toLocaleString()}`;
}

/** Rich text segment inside an Ally Insight bullet */
export type AllyInsightSegment =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | {
      kind: "money";
      amount: number;
      /** emphasis = hero $ at risk; inline = parenthetical SKU amounts */
      variant?: "emphasis" | "inline";
    };

export type AllyInsightBullet = {
  id: string;
  segments: AllyInsightSegment[];
};

/** Bulleted Ally Insight copy for issue-type roll-ups */
export function buildAlertAllyInsightBullets(
  title: string,
  skus: IssueSku[],
  gapDollars: number,
  skuCount: number,
  _aiSignal?: string,
): AllyInsightBullet[] {
  const metrics = buildAlertMetricTiles(skus, gapDollars);
  const { recurringCount } = metrics.recency;
  const issueLabelLower = title.toLowerCase();

  const totalDollars =
    skus.reduce((sum, sku) => sum + Math.abs(sku.gapDollars), 0) ||
    Math.abs(gapDollars);
  const brandRows = rollupConcentration(skus, (sku) => sku.brand, totalDollars, 3);
  const categoryRows = rollupConcentration(
    skus,
    (sku) => sku.category,
    totalDollars,
    3,
  );
  const topBrand = brandRows[0];
  const topCategory = categoryRows[0];

  const bullets: AllyInsightBullet[] = [
    {
      id: "scope",
      segments: [
        {
          kind: "text",
          text: `${skuCount} SKUs are flagged for ${issueLabelLower} right now`,
        },
      ],
    },
  ];

  if (recurringCount > 0 && topBrand && topCategory) {
    const brandIsSingle = brandRows.length === 1 || topBrand.pct >= 100;
    bullets.push({
      id: "concentration",
      segments: brandIsSingle
        ? [
            {
              kind: "text",
              text: `All ${recurringCount} persistent flags sit under ${topBrand.name}, concentrated in ${topCategory.name}`,
            },
          ]
        : [
            {
              kind: "text",
              text: `${recurringCount} persistent flags sit under ${topBrand.name} (${topBrand.pct}%), concentrated in ${topCategory.name}`,
            },
          ],
    });
  } else if (topBrand && topCategory) {
    bullets.push({
      id: "concentration",
      segments: [
        {
          kind: "text",
          text: `Flags sit under ${topBrand.name}, concentrated in ${topCategory.name}`,
        },
      ],
    });
  }

  return bullets;
}

/** @deprecated Use AllyAiPrompt */
export type TaxonomyRcaPrompt = AllyAiPrompt;

/** One ranked issue in a taxonomy RCA summary */
export type TaxonomyRcaTopIssue = {
  rank: number;
  issueKey: IssueKey;
  name: string;
  skuCount: number;
  group: IssueGroup;
  gapDollars: number;
};

/** Level-scoped RCA view when grouping Alerts by taxonomy */
export type TaxonomyPerformanceKpi = {
  id: string;
  title: string;
  value: string;
  tone: "negative" | "positive" | "neutral";
  subtitle: string;
};

export type TaxonomyRcaView = {
  levelLabel: string;
  entityName: string;
  alertCount: number;
  skuCount: number;
  gapDollars: number;
  performanceKpis: TaxonomyPerformanceKpi[];
  /** Live right now — 3 standard bullets (latest scrape only) */
  liveNowBullets: string[];
  /** Last week — 3 standard bullets */
  lastWeekBullets: string[];
  narratives: AllyInsightBullet[];
  topIssues: TaxonomyRcaTopIssue[];
  skus: CategorySku[];
  /** Prompts beneath key insights — explain the narrative */
  insightPrompts: TaxonomyRcaPrompt[];
  /** Prompts beneath top issues — invite issue-level drill-down */
  issuePrompts: TaxonomyRcaPrompt[];
};

/** One actor or category in a concentration chart */
export type ConcentrationRow = {
  id: string;
  name: string;
  skuCount: number;
  dollars: number;
  pct: number;
};

/** Summary tiles above issue-level Ally insights */
export type AlertMetricTilesData = {
  recency: {
    /** Card label — includes L24h crawl framing */
    label: string;
    newCount: number;
    recurringCount: number;
    newPct: number;
    /** Optional line under the value (omit when label already carries framing) */
    subtitle?: string;
  };
  concentration: {
    title: string;
    value: string;
    subtitle: string;
    /** Category (or brand) name to emphasize inside the subtitle */
    subtitleEmphasis?: string;
  };
};

export type AlertStrategicInsights = {
  /** $ at risk grouped by when the issue became active */
  recency: ConcentrationRow[];
  sellers: ConcentrationRow[];
  categories: ConcentrationRow[];
  /** Card title — "Categories exposed" or "Brands most exposed" when only one category */
  categoryCardTitle: string;
  /** Short 6–7 word AllyAI header summary */
  headline: string;
  /** One-line takeaway for seller concentration */
  sellerTakeaway?: string;
  /** One-line takeaway for category concentration */
  categoryTakeaway?: string;
};

/** $ at risk by when each SKU’s alert became active (uses Lost At timestamps). */
function rollupRecency(
  skus: IssueSku[],
  totalDollars: number,
): ConcentrationRow[] {
  type BucketId = "24h" | "2-7d" | "older" | "unknown";
  const buckets: Record<
    BucketId,
    { name: string; skuCount: number; dollars: number }
  > = {
    "24h": { name: "Last 24 hours", skuCount: 0, dollars: 0 },
    "2-7d": { name: "2–7 days ago", skuCount: 0, dollars: 0 },
    older: { name: "Older than 7 days", skuCount: 0, dollars: 0 },
    unknown: { name: "Timing unknown", skuCount: 0, dollars: 0 },
  };

  for (const sku of skus) {
    const dollars = Math.abs(sku.gapDollars);
    if (!sku.lostAt) {
      buckets.unknown.skuCount += 1;
      buckets.unknown.dollars += dollars;
      continue;
    }
    const lost = parseLostAt(sku.lostAt);
    if (!lost) {
      buckets.unknown.skuCount += 1;
      buckets.unknown.dollars += dollars;
      continue;
    }
    const hoursAgo =
      (ALERTS_MOCK_NOW.getTime() - lost.getTime()) / (1000 * 60 * 60);
    if (hoursAgo <= 24) {
      buckets["24h"].skuCount += 1;
      buckets["24h"].dollars += dollars;
    } else if (hoursAgo <= 7 * 24) {
      buckets["2-7d"].skuCount += 1;
      buckets["2-7d"].dollars += dollars;
    } else {
      buckets.older.skuCount += 1;
      buckets.older.dollars += dollars;
    }
  }

  const safeTotal = totalDollars > 0 ? totalDollars : 1;
  const order: BucketId[] = ["24h", "2-7d", "older", "unknown"];

  return order
    .filter((id) => buckets[id].skuCount > 0)
    .map((id) => ({
      id,
      name: buckets[id].name,
      skuCount: buckets[id].skuCount,
      dollars: buckets[id].dollars,
      pct: Math.round((buckets[id].dollars / safeTotal) * 100),
    }));
}

/**
 * Roll up SKUs by a key. Keep the top `limit` rows, fold the rest into "Other"
 * so the chart stays a composition (never a single lonely 100% bar when possible).
 */
function rollupConcentration(
  skus: IssueSku[],
  keyOf: (sku: IssueSku) => string,
  totalDollars: number,
  limit = 3,
  otherLabel = "Other",
): ConcentrationRow[] {
  const map = new Map<string, { skuCount: number; dollars: number }>();
  for (const sku of skus) {
    const name = keyOf(sku);
    const existing = map.get(name) ?? { skuCount: 0, dollars: 0 };
    existing.skuCount += 1;
    existing.dollars += Math.abs(sku.gapDollars);
    map.set(name, existing);
  }

  const safeTotal = totalDollars > 0 ? totalDollars : 1;
  const ranked = [...map.entries()]
    .map(([name, data]) => ({
      id: name,
      name,
      skuCount: data.skuCount,
      dollars: data.dollars,
      pct: Math.round((data.dollars / safeTotal) * 100),
    }))
    .sort((a, b) => b.dollars - a.dollars);

  if (ranked.length <= limit) return ranked;

  const top = ranked.slice(0, limit);
  const rest = ranked.slice(limit);
  const otherDollars = rest.reduce((sum, r) => sum + r.dollars, 0);
  const otherSkus = rest.reduce((sum, r) => sum + r.skuCount, 0);

  return [
    ...top,
    {
      id: "__other__",
      name: otherLabel,
      skuCount: otherSkus,
      dollars: otherDollars,
      pct: Math.round((otherDollars / safeTotal) * 100),
    },
  ];
}

/**
 * Strategic middle-pane insights: how $ breaks down, which sellers drive it,
 * and which categories are most exposed.
 */
export function getAlertStrategicInsights(
  skus: IssueSku[],
  gapDollars: number,
  feedbackKey: string,
): AlertStrategicInsights {
  const totalFromSkus = skus.reduce(
    (sum, s) => sum + Math.abs(s.gapDollars),
    0,
  );
  // Charts use magnitude (absolute Gap $)
  const total = totalFromSkus > 0 ? totalFromSkus : Math.abs(gapDollars);
  const recency = rollupRecency(skus, total);

  // Retailers on the listing (seller) — drives the composition bar
  const sellers = rollupConcentration(skus, (sku) => sku.seller, total, 3);

  // Prefer a category mix. If everything is one category (e.g. category group
  // view), fall back to brands — then SKUs — so the card stays a composition.
  const uniqueCategories = new Set(skus.map((s) => s.category));
  const uniqueBrands = new Set(skus.map((s) => s.brand));
  const exposureMode: "category" | "brand" | "sku" =
    uniqueCategories.size > 1
      ? "category"
      : uniqueBrands.size > 1
        ? "brand"
        : "sku";

  const categories = rollupConcentration(
    skus,
    (sku) =>
      exposureMode === "category"
        ? sku.category
        : exposureMode === "brand"
          ? sku.brand
          : sku.name,
    total,
    3,
    "Other",
  );
  const categoryCardTitle =
    exposureMode === "category"
      ? "Categories exposed"
      : exposureMode === "brand"
        ? "Brands most exposed"
        : "SKUs most exposed";

  const topSeller = sellers[0];
  const sellerTakeaway =
    topSeller && sellers.length > 0
      ? topSeller.pct >= 70
        ? `${topSeller.pct}% of damage from one seller — treat as a single actor, not SKU-by-SKU.`
        : sellers.length === 1
          ? `All visible damage traces to ${topSeller.name}.`
          : `Top seller drives ${topSeller.pct}% of Gap $.`
      : undefined;

  const noun =
    exposureMode === "category"
      ? "category"
      : exposureMode === "brand"
        ? "brand"
        : "SKU";
  const plural =
    exposureMode === "category"
      ? "categories"
      : exposureMode === "brand"
        ? "brands"
        : "SKUs";
  const topCategory = categories[0];
  const categoryTakeaway =
    topCategory && categories.length > 0
      ? topCategory.pct >= 60
        ? `Concentrated in ${topCategory.name} — ${noun}-level conversation.`
        : categories.length >= 2 && topCategory.pct < 50
          ? `Spread across ${plural} — portfolio-level issue.`
          : `${topCategory.name} is the most exposed ${noun} (${topCategory.pct}%).`
      : undefined;

  // Short header line (~6–7 words) — pattern first, not a section title
  let headline = "Systemic pattern across affected SKUs";
  if (topSeller && topSeller.pct >= 70) {
    headline = "One seller drives most Gap";
  } else if (topSeller && sellers.length === 1) {
    headline = "Single seller behind the miss";
  } else if (topCategory && topCategory.pct >= 60) {
    headline =
      exposureMode === "category"
        ? "Gap concentrated in one category"
        : exposureMode === "brand"
          ? "Gap concentrated in one brand"
          : "Gap concentrated in top SKUs";
  } else if (categories.length >= 2 && (topCategory?.pct ?? 100) < 50) {
    headline =
      exposureMode === "category"
        ? "Gap spread across categories"
        : exposureMode === "brand"
          ? "Gap spread across brands"
          : "Gap spread across SKUs";
  } else if (topSeller && topSeller.pct >= 40) {
    headline = "Top seller drives the Gap";
  }

  return {
    recency,
    sellers,
    categories,
    categoryCardTitle,
    headline,
    sellerTakeaway,
    categoryTakeaway,
  };
}

/**
 * Issue roll-up insights are anchored on L24h for now.
 * Assume 4 crawls across 24h (~every 6h). Last crawl matches
 * ALERTS_LAST_CRAWL_LABEL ("4:00 PM today (2h ago)").
 *
 * Live right now copy is framed as the latest scrape snapshot.
 * (This mock treats currently open alert SKUs as that snapshot.)
 */
const CRAWLS_PER_DAY = 4;
const HOURS_PER_CRAWL = 24 / CRAWLS_PER_DAY;
const HOURS_SINCE_LAST_CRAWL = 2;

/** True when the SKU first appeared in the latest crawl (not earlier ones). */
function isNewInLatestCrawl(sku: IssueSku): boolean {
  const lost = sku.lostAt ? parseLostAt(sku.lostAt) : null;
  if (!lost) return false;
  const lastCrawlMs =
    ALERTS_MOCK_NOW.getTime() - HOURS_SINCE_LAST_CRAWL * 60 * 60 * 1000;
  const previousCrawlMs = lastCrawlMs - HOURS_PER_CRAWL * 60 * 60 * 1000;
  // New = first seen after the previous crawl, up through the latest scrape
  return lost.getTime() > previousCrawlMs && lost.getTime() <= lastCrawlMs;
}

/** Two headline metrics for issue-level alert panels (L24h · last 4 crawls) */
export function buildAlertMetricTiles(
  skus: IssueSku[],
  gapDollars: number,
): AlertMetricTilesData {
  let newCount = 0;
  let recurringCount = 0;

  for (const sku of skus) {
    if (isNewInLatestCrawl(sku)) {
      newCount += 1;
    } else {
      // Carried over across earlier crawls in the last 24h window
      recurringCount += 1;
    }
  }

  const newPct =
    skus.length > 0 ? Math.round((newCount / skus.length) * 100) : 0;

  const totalDollars =
    skus.reduce((sum, sku) => sum + Math.abs(sku.gapDollars), 0) ||
    Math.abs(gapDollars);

  const brandRows = rollupConcentration(skus, (sku) => sku.brand, totalDollars, 3);
  const categoryRows = rollupConcentration(
    skus,
    (sku) => sku.category,
    totalDollars,
    3,
  );

  const topBrand = brandRows[0];
  const topCategory = categoryRows[0];
  const secondCategory = categoryRows[1];

  const concentrationValue = topBrand ? `${topBrand.name} ${topBrand.pct}%` : "—";

  let concentrationSubtitle = "No brand or category mix yet.";
  let concentrationEmphasis: string | undefined;
  if (topCategory && categoryRows.length > 1 && secondCategory) {
    concentrationSubtitle = `${topCategory.name} is still the densest category (${topCategory.pct}%)`;
    concentrationEmphasis = topCategory.name;
  } else if (topCategory) {
    concentrationSubtitle = `${topCategory.name} is the only category flagged`;
    concentrationEmphasis = topCategory.name;
  }

  return {
    recency: {
      label: "New vs carried over (last 4 crawls · 24h)",
      newCount,
      recurringCount,
      newPct,
      subtitle:
        "SKUs appeared in latest crawl vs multiple crawls in last 24 hrs",
    },
    concentration: {
      title: "Brand / category concentration",
      value: concentrationValue,
      subtitle: concentrationSubtitle,
      subtitleEmphasis: concentrationEmphasis,
    },
  };
}

export function issueLabel(issueKey: IssueKey) {
  return ISSUE_NAMES[issueKey].filter;
}

export function issueGroup(issueKey: IssueKey): IssueGroup {
  return ISSUE_NAMES[issueKey].group;
}

/** Fixed order for the issue-type left sidebar — always show all canonical types. */
export const ISSUE_TYPE_SIDEBAR_ORDER: IssueKey[] = [
  "lostBuyBox",
  "promoBadge",
  "dealPageVisibility",
  "coupon",
  "creditOffer",
  "bestSellerRank",
  "ratingReviews",
  "stockAvailability",
  "shippingSpeed",
  "sponsoredSov",
  "keywordRank",
  "conversionDrop",
  "mediaSpend",
];

function emptyIssueAlert(issueKey: IssueKey): IssueAlert {
  return {
    issueKey,
    skuCount: 0,
    gapDollars: 0,
    severity: "low",
    skus: [],
  };
}

/**
 * Order filtered alerts for the issue-type sidebar.
 * Unfiltered: pads with empty placeholders so all canonical types show.
 * Filtered (brand / category / SKU / search): only issues with matching SKUs.
 */
export function buildIssueTypeSidebarAlerts(
  filtered: IssueAlert[],
  options?: { includeEmpty?: boolean },
): IssueAlert[] {
  const includeEmpty = options?.includeEmpty ?? true;
  const byKey = new Map(filtered.map((issue) => [issue.issueKey, issue]));

  if (!includeEmpty) {
    // Keep canonical sidebar order, drop types with no SKUs left after filter
    return ISSUE_TYPE_SIDEBAR_ORDER.flatMap((issueKey) => {
      const issue = byKey.get(issueKey);
      return issue && issue.skuCount > 0 ? [issue] : [];
    });
  }

  return ISSUE_TYPE_SIDEBAR_ORDER.map(
    (issueKey) => byKey.get(issueKey) ?? emptyIssueAlert(issueKey),
  );
}

/** Extra datapoints for Overview Active Alert cards (from SKUs + AI signal) */
export type IssueAlertInsights = {
  brands: string[];
  categories: string[];
  /** Worst Gap SKU name when available */
  topSkuName?: string;
  topSkuGap?: number;
  /** Newest lostAt among SKUs */
  lastSeen?: string;
  /** First sentence of AI signal for a one-line teaser */
  signalTeaser?: string;
};

export function getIssueAlertInsights(alert: IssueAlert): IssueAlertInsights {
  const brands = [...new Set(alert.skus.map((s) => s.brand))];
  const categories = [...new Set(alert.skus.map((s) => s.category))];
  const worst = [...alert.skus].sort((a, b) => a.gapDollars - b.gapDollars)[0];
  const lastSeen = alert.skus
    .map((s) => s.lostAt)
    .filter((v): v is string => Boolean(v))
    .sort()
    .at(-1);
  const signalTeaser = alert.aiSignal
    ? alert.aiSignal.split(/(?<=\.)\s/)[0]?.trim()
    : undefined;

  return {
    brands,
    categories,
    topSkuName: worst?.name,
    topSkuGap: worst?.gapDollars,
    lastSeen,
    signalTeaser,
  };
}

export const portfolioGap = {
  gapDollars: -4_200_000,
  attainmentPct: 79,
  /** Sales achieved so far this period */
  achievedDollars: 15_800_000,
  /** Sales target (plan) for this period */
  targetDollars: 20_000_000,
  /** Metric name only — period shown separately so the window is obvious */
  label: "Portfolio gap",
  /** Plain-language window (avoid cryptic “WTD” alone in the UI) */
  periodLabel: "Week to date",
  /** Inclusive dates for the current week-to-date window */
  periodRange: PORTFOLIO_WTD_RANGE,
};

export const brandCards: BrandCard[] = [
  {
    name: "PlayMax",
    gapDollars: -2_800_000,
    attainmentPct: 76,
    achievedDollars: 8_867_000,
    targetDollars: 11_667_000,
  },
  {
    name: "CleanPro",
    gapDollars: -1_800_000,
    attainmentPct: 82,
    achievedDollars: 8_200_000,
    targetDollars: 10_000_000,
  },
  {
    name: "KitchenPro",
    gapDollars: 400_000,
    attainmentPct: 104,
    achievedDollars: 10_400_000,
    targetDollars: 10_000_000,
  },
];

/** CIQ action win — quantifies what the platform did, not just “above plan” entities */
export type OverviewWin = {
  id: string;
  /** Short action title — what CIQ / AllyAI did */
  action: string;
  /** Narrative of the intervention + outcome */
  narrative: string;
  /** Dollar impact attributed to the action */
  impactDollars: number;
  /** Supporting metric label under the $ (e.g. “revenue protected”) */
  impactLabel: string;
  /** Where it happened — Brand · Category or SKU scope */
  scope: string;
  /** Optional count of SKUs / campaigns touched */
  skusTouched?: number;
};

export const overviewWins: OverviewWin[] = [
  {
    id: "bb-reprice",
    action: "Reclaimed Buy Box on 9 robot SKUs",
    narrative:
      "AllyAI flagged VacuMart undercutting. CIQ repriced within 4 hours — Buy Box back on 7 of 9 ASINs.",
    impactDollars: 180_000,
    impactLabel: "revenue protected WTD",
    scope: "CleanPro · Floor Care Robotics",
    skusTouched: 9,
  },
  {
    id: "deal-restore",
    action: "Restored Deal Page Visibility",
    narrative:
      "Content + Sales Agent restored missing deal badges on 6 ASINs after a syndication drop. Traffic recovered same day.",
    impactDollars: 95_000,
    impactLabel: "sales recovered",
    scope: "CleanPro · Floor Care",
    skusTouched: 6,
  },
  {
    id: "promo-budget",
    action: "Reallocated promo budget to KitchenPro kitchen",
    narrative:
      "AllyAI shifted $42K from weak SOV into KitchenPro cookware deals. Buy Box held while units lifted.",
    impactDollars: 120_000,
    impactLabel: "incremental sales",
    scope: "KitchenPro · Kitchen Appliances",
    skusTouched: 4,
  },
  {
    id: "oos-expedite",
    action: "Expedited replenishment on Hair Care",
    narrative:
      "Stock alert triggered PO acceleration on 3 launch ASINs — avoided projected weekend OOS.",
    impactDollars: 68_000,
    impactLabel: "stockout avoided",
    scope: "CleanPro · Hair Care",
    skusTouched: 3,
  },
];

/**
 * AllyAI Overview brief —
 * title = one-line portfolio performance summary;
 * points = Brand → Category → Issue insights.
 */
export const aiBrief = {
  title:
    "Week to date, the portfolio is −$4.2M vs plan (79% attainment) — PlayMax and CleanPro are driving the miss.",
  points: [
    {
      level: "Brand",
      text: "PlayMax is the largest gap at −$2.8M; CleanPro follows at −$1.8M, while KitchenPro is ahead at +$400K.",
    },
    {
      level: "Category",
      text: "CleanPro's miss is concentrated in floor care robotics.",
    },
    {
      level: "Issue",
      text: "Lost Buy Box on 12 SKUs (same 3P seller) is the primary cause.",
    },
  ],
};

/**
 * Issue-level alerts — sorted by Gap $ (most negative first).
 *
 * Shared SKU ids (same product under multiple issues) — used so Issue “Alerts”
 * count can double-count, while Taxonomy “SKUs” count stays unique:
 * - s1 CleanPro Robot Vac R900 → Lost Buy Box, SOV, Keyword Rank, Coupon
 * - s2 CleanPro Pro Upright → Lost Buy Box, SOV, Coupon
 * - s3 CleanPro StylePro S440 → Lost Buy Box, SOV
 */
const issueAlertsUnsorted: IssueAlert[] = [
  {
    issueKey: "lostBuyBox",
    skuCount: 6,
    gapDollars: -231_000,
    severity: "high",
    aiSignal:
      "VacuMart_US holds Buy Box on several high-gap SKUs at $20–30 below list. Damage spans robotics, uprights, hair care, and more — not a single-category problem.",
    skus: [
      {
        // Also listed under sponsoredSov, keywordRank, coupon (same id)
        id: "s1",
        name: "CleanPro Robot Vac R900",
        asin: "B08XYZ1234",
        seller: "VacuMart_US",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -62_000,
        bbOwner: "VacuMart_US",
        theirPrice: 289,
        ourPrice: 319,
        // New in latest crawl (after previous 10:00 crawl, at/before 16:00 scrape)
        lostAt: "Aug 21 15:40",
      },
      {
        // Also listed under sponsoredSov + coupon (same id)
        id: "s2",
        name: "CleanPro Pro Upright",
        asin: "B09ABC5678",
        seller: "VacuMart_US",
        brand: "CleanPro",
        // Different category so the exposure card is a mix, not 100% one bar
        category: "Floor Care",
        gapDollars: -48_000,
        bbOwner: "VacuMart_US",
        theirPrice: 248,
        ourPrice: 279,
        // Seen in an earlier crawl today — counts as recurring
        lostAt: "Aug 21 09:20",
      },
      {
        // Also listed under sponsoredSov (same id)
        id: "s3",
        name: "CleanPro StylePro S440",
        asin: "B07DEF9012",
        seller: "BeautyDealz",
        brand: "CleanPro",
        category: "Hair Care",
        gapDollars: -41_000,
        bbOwner: "BeautyDealz",
        theirPrice: 199,
        ourPrice: 219,
        lostAt: "Aug 19 09:17",
      },
      {
        id: "s4",
        name: "CleanPro Air Purifier 6",
        asin: "B06GHI3456",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Home Comfort",
        gapDollars: -35_000,
        bbOwner: "DealHunterPro",
        theirPrice: 149,
        ourPrice: 169,
        lostAt: "Aug 18 11:40",
      },
      {
        id: "s5",
        name: "CleanPro Oven Air Fryer",
        asin: "B05JKL7890",
        seller: "KitchenMart_US",
        brand: "CleanPro",
        category: "Kitchen Appliances",
        gapDollars: -27_000,
        bbOwner: "KitchenMart_US",
        theirPrice: 179,
        ourPrice: 199,
        lostAt: "Aug 17 09:15",
      },
      {
        id: "s6",
        name: "PlayMax Controllers Bundle",
        asin: "B04MNO1122",
        seller: "VacuMart_US",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -18_000,
        bbOwner: "VacuMart_US",
        theirPrice: 39,
        ourPrice: 49,
        lostAt: "Aug 16 16:05",
      },
    ],
  },
  {
    issueKey: "promoBadge",
    skuCount: 5,
    gapDollars: -145_000,
    severity: "high",
    aiSignal:
      "5 CleanPro and KitchenPro SKUs lost the Amazon promo badge this week. Conversion dropped 8–12% on affected ASINs while price held.",
    skus: [
      {
        id: "pb1",
        name: "CleanPro Pro Cordless",
        asin: "B0PRM001",
        seller: "Amazon.com",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -38_000,
        lostAt: "Aug 21 07:55",
      },
      {
        id: "pb2",
        name: "CleanPro DetectPro Auto-Empty",
        asin: "B0PRM002",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -32_000,
        lostAt: "Aug 21 07:55",
      },
      {
        id: "pb3",
        name: "KitchenPro DualZone Air Fryer",
        asin: "B0PRM003",
        seller: "KitchenMart_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -28_000,
        lostAt: "Aug 20 20:30",
      },
      {
        id: "pb4",
        name: "CleanPro StylePro S440",
        asin: "B0PRM004",
        seller: "BeautyDealz",
        brand: "CleanPro",
        category: "Hair Care",
        gapDollars: -25_000,
        lostAt: "Aug 20 14:12",
      },
      {
        id: "pb5",
        name: "KitchenPro NonStick Cookware Set",
        asin: "B0PRM005",
        seller: "Amazon.com",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -22_000,
        lostAt: "Aug 16 09:40",
      },
    ],
  },
  {
    issueKey: "dealPageVisibility",
    skuCount: 8,
    gapDollars: -180_000,
    severity: "mid",
    aiSignal:
      "8 SKUs lost Deal Page Visibility this week. Traffic and conversion drops concentrate on CleanPro floor care ASINs.",
    skus: [
      {
        id: "d1",
        name: "CleanPro Pro Cordless",
        asin: "B0DPV001",
        seller: "DealHub_US",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -42_000,
        lostAt: "Aug 21 08:12",
      },
      {
        id: "d2",
        name: "CleanPro DetectPro Auto-Empty",
        asin: "B0DPV002",
        seller: "DealHub_US",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -35_000,
        lostAt: "Aug 21 08:12",
      },
      {
        id: "d3",
        name: "CleanPro SensePro Upright",
        asin: "B0DPV003",
        seller: "DealHub_US",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -28_000,
        lostAt: "Aug 20 19:44",
      },
      {
        id: "d4",
        name: "CleanPro TwinBrush Vacuum",
        asin: "B0DPV004",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -22_000,
        lostAt: "Aug 20 11:05",
      },
      {
        id: "d5",
        name: "CleanPro MiniVac System",
        asin: "B0DPV005",
        seller: "Amazon.com",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -18_000,
        lostAt: "Aug 19 16:30",
      },
      {
        id: "d6",
        name: "CleanPro CarpetPro Stain Remover",
        asin: "B0DPV006",
        seller: "FloorCareOutlet",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -15_000,
        lostAt: "Aug 19 09:18",
      },
      {
        id: "d7",
        name: "KitchenPro NonStick Cookware Set",
        asin: "B0DPV007",
        seller: "KitchenDeals_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -12_000,
        lostAt: "Aug 16 16:10",
      },
      {
        id: "d8",
        name: "KitchenPro MultiCooker",
        asin: "B0DPV008",
        seller: "CIQ_Retail",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -8_000,
        lostAt: "Aug 15 11:25",
      },
    ],
  },
  {
    issueKey: "stockAvailability",
    skuCount: 5,
    gapDollars: -90_000,
    severity: "mid",
    aiSignal:
      "5 SKUs show Stock Availability risk. Expedite replenishment on the highest Gap ASINs first.",
    skus: [
      {
        id: "st1",
        name: "CleanPro AI Robot R2002",
        asin: "B0STK001",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -32_000,
        lostAt: "Aug 21 06:40",
      },
      {
        id: "st2",
        name: "CleanPro LiftAway Upright",
        asin: "B0STK002",
        seller: "Amazon.com",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -24_000,
        lostAt: "Aug 20 22:15",
      },
      {
        id: "st3",
        name: "CleanPro Breeze Fan",
        asin: "B0STK003",
        seller: "HomeComfort_US",
        brand: "CleanPro",
        category: "Home Comfort",
        gapDollars: -18_000,
        lostAt: "Aug 20 13:28",
      },
      {
        id: "st4",
        name: "PlayMax Enhanced Wired Controller",
        asin: "B0STK004",
        seller: "GameGear_Pro",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -10_000,
        lostAt: "Aug 16 08:30",
      },
      {
        id: "st5",
        name: "PlayMax Nano Enhanced Wireless",
        asin: "B0STK005",
        seller: "CIQ_Retail",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -6_000,
        lostAt: "Aug 15 14:20",
      },
    ],
  },
  {
    issueKey: "shippingSpeed",
    skuCount: 4,
    gapDollars: -40_000,
    severity: "low",
    aiSignal:
      "4 PlayMax and CleanPro SKUs slipped below 2-day shipping promise this week. Late FC handoffs are the main driver.",
    skus: [
      {
        id: "sh1",
        name: "PlayMax Fusion Pro Wired",
        asin: "B0SHP001",
        seller: "GameGear_Pro",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -14_000,
        lostAt: "Aug 21 11:20",
      },
      {
        id: "sh2",
        name: "PlayMax Spectra Infinity",
        asin: "B0SHP002",
        seller: "CIQ_Retail",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -11_000,
        lostAt: "Aug 21 09:05",
      },
      {
        id: "sh3",
        name: "CleanPro MiniVac System",
        asin: "B0SHP003",
        seller: "Amazon.com",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -9_000,
        lostAt: "Aug 20 16:40",
      },
      {
        id: "sh4",
        name: "CleanPro Breeze Fan",
        asin: "B0SHP004",
        seller: "HomeComfort_US",
        brand: "CleanPro",
        category: "Home Comfort",
        gapDollars: -6_000,
        lostAt: "Aug 16 10:05",
      },
    ],
  },
  {
    issueKey: "sponsoredSov",
    skuCount: 5,
    gapDollars: -68_000,
    severity: "mid",
    aiSignal:
      "Sponsored Share of Voice dropped below 40% on 5 priority keywords. Competitors increased bids while our campaigns were paused.",
    skus: [
      {
        // Same product as lostBuyBox s1 — multi-issue demo
        id: "s1",
        name: "CleanPro Robot Vac R900",
        asin: "B08XYZ1234",
        seller: "VacuMart_US",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -20_000,
        lostAt: "Aug 21 09:00",
      },
      {
        // Same product as lostBuyBox s2 — multi-issue demo
        id: "s2",
        name: "CleanPro Pro Upright",
        asin: "B09ABC5678",
        seller: "Amazon.com",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -16_000,
        lostAt: "Aug 21 09:00",
      },
      {
        id: "sov3",
        name: "PlayMax Enhanced Wired Controller",
        asin: "B0SOV003",
        seller: "GameGear_Pro",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -14_000,
        lostAt: "Aug 20 17:25",
      },
      {
        id: "sov4",
        name: "KitchenPro MultiCooker",
        asin: "B0SOV004",
        seller: "KitchenDeals_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -10_000,
        lostAt: "Aug 20 12:40",
      },
      {
        // Same product as lostBuyBox s3 — multi-issue demo
        id: "s3",
        name: "CleanPro StylePro S440",
        asin: "B07DEF9012",
        seller: "BeautyDealz",
        brand: "CleanPro",
        category: "Hair Care",
        gapDollars: -8_000,
        lostAt: "Aug 16 08:15",
      },
    ],
  },
  {
    issueKey: "keywordRank",
    skuCount: 6,
    gapDollars: -30_000,
    severity: "low",
    aiSignal:
      "6 SKUs lost page-1 keyword rank on high-intent terms. Sponsored coverage gap opened after budget pause.",
    skus: [
      {
        id: "kw1",
        name: "KitchenPro MultiCooker",
        asin: "B0KW001",
        seller: "KitchenDeals_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -8_000,
        lostAt: "Aug 21 07:30",
      },
      {
        // Same product as lostBuyBox s1 — multi-issue demo
        id: "s1",
        name: "CleanPro Robot Vac R900",
        asin: "B08XYZ1234",
        seller: "VacuMart_US",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -7_000,
        lostAt: "Aug 20 20:10",
      },
      {
        id: "kw3",
        name: "PlayMax Nano Enhanced Wireless",
        asin: "B0KW003",
        seller: "GameGear_Pro",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -5_000,
        lostAt: "Aug 20 14:55",
      },
      {
        id: "kw4",
        name: "CleanPro Pro Cordless",
        asin: "B0KW004",
        seller: "DealHub_US",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -4_500,
        lostAt: "Aug 20 11:20",
      },
      {
        id: "kw5",
        name: "KitchenPro NonStick Cookware Set",
        asin: "B0KW005",
        seller: "Amazon.com",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -3_000,
        lostAt: "Aug 19 18:05",
      },
      {
        id: "kw6",
        name: "CleanPro DetectPro Auto-Empty",
        asin: "B0KW006",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -2_500,
        lostAt: "Aug 18 09:30",
      },
    ],
  },
  {
    issueKey: "coupon",
    skuCount: 4,
    gapDollars: -52_000,
    severity: "mid",
    aiSignal:
      "Competitor coupons detected on 4 high-traffic SKUs. Subscribe & Save and dollar-off offers are undercutting list price.",
    skus: [
      {
        // Same product as lostBuyBox s1 — multi-issue demo
        id: "s1",
        name: "CleanPro Robot Vac R900",
        asin: "B08XYZ1234",
        seller: "VacuMart_US",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -18_000,
        bbOwner: "VacuMart_US",
        theirPrice: 279,
        ourPrice: 319,
        lostAt: "Aug 21 10:15",
      },
      {
        // Same product as lostBuyBox s2 — multi-issue demo
        id: "s2",
        name: "CleanPro Pro Upright",
        asin: "B09ABC5678",
        seller: "VacuMart_US",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -14_000,
        bbOwner: "VacuMart_US",
        theirPrice: 259,
        ourPrice: 279,
        lostAt: "Aug 21 08:29",
      },
      {
        id: "cp3",
        name: "KitchenPro MultiCooker",
        asin: "B0CPN003",
        seller: "KitchenDeals_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -12_000,
        lostAt: "Aug 20 16:45",
      },
      {
        id: "cp4",
        name: "CleanPro HydroClean W200",
        asin: "B0CPN004",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -8_000,
        lostAt: "Aug 16 11:29",
      },
    ],
  },
  {
    issueKey: "creditOffer",
    skuCount: 3,
    gapDollars: -41_000,
    severity: "mid",
    aiSignal:
      "Credit offers (cashback / statement credit) detected on 3 SKUs. Third-party cashback amounts are undercutting effective price.",
    skus: [
      {
        id: "cr1",
        name: "CleanPro SensePro Cordless",
        asin: "B0CRD001",
        seller: "DealHub_US",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -16_000,
        bbOwner: "DealHub_US",
        theirPrice: 289,
        ourPrice: 329,
        lostAt: "Aug 21 09:40",
      },
      {
        id: "cr2",
        name: "KitchenPro SoftServe Deluxe",
        asin: "B0CRD002",
        seller: "KitchenDeals_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -14_000,
        lostAt: "Aug 20 14:20",
      },
      {
        id: "cr3",
        name: "CleanPro MiniVac System",
        asin: "B0CRD003",
        seller: "VacuMart_US",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -11_000,
        bbOwner: "VacuMart_US",
        theirPrice: 149,
        ourPrice: 179,
        lostAt: "Aug 19 11:05",
      },
    ],
  },
  {
    issueKey: "bestSellerRank",
    skuCount: 3,
    gapDollars: -36_000,
    severity: "mid",
    aiSignal:
      "3 SKUs fell out of top-100 Best Seller Rank in their subcategories. Floor care robotics and kitchen appliances are most affected.",
    skus: [
      {
        id: "bsr1",
        name: "CleanPro AI Robot R2002",
        asin: "B0BSR001",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -16_000,
        lostAt: "Aug 21 06:20",
      },
      {
        id: "bsr2",
        name: "KitchenPro DualZone Air Fryer",
        asin: "B0BSR002",
        seller: "KitchenMart_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -12_000,
        lostAt: "Aug 20 22:08",
      },
      {
        id: "bsr3",
        name: "CleanPro LiftAway Upright",
        asin: "B0BSR003",
        seller: "Amazon.com",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -8_000,
        lostAt: "Aug 16 15:33",
      },
    ],
  },
  {
    issueKey: "ratingReviews",
    skuCount: 3,
    gapDollars: -20_000,
    severity: "low",
    aiSignal:
      "3 SKUs dropped below 4.2★ after a cluster of negative reviews. Conversion impact concentrated on KitchenPro kitchen.",
    skus: [
      {
        id: "rr1",
        name: "KitchenPro NonStick Cookware Set",
        asin: "B0RR001",
        seller: "Amazon.com",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -10_000,
        lostAt: "Aug 21 10:00",
      },
      {
        id: "rr2",
        name: "KitchenPro MultiCooker",
        asin: "B0RR002",
        seller: "KitchenDeals_US",
        brand: "KitchenPro",
        category: "Kitchen Appliances",
        gapDollars: -6_000,
        lostAt: "Aug 20 18:22",
      },
      {
        id: "rr3",
        name: "CleanPro HydroClean W200",
        asin: "B0RR003",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care",
        gapDollars: -4_000,
        lostAt: "Aug 16 16:40",
      },
    ],
  },
  {
    issueKey: "conversionDrop",
    skuCount: 2,
    gapDollars: -12_000,
    severity: "low",
    aiSignal:
      "2 CleanPro robot SKUs show conversion down >15% WoW with traffic flat — PDP content and price parity are the top suspects.",
    skus: [
      {
        id: "cd1",
        name: "CleanPro AI Robot R2010",
        asin: "B0CD001",
        seller: "VacuMart_US",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -7_000,
        lostAt: "Aug 21 08:45",
      },
      {
        id: "cd2",
        name: "CleanPro RX V2 Plus",
        asin: "B0CD002",
        seller: "CIQ_Retail",
        brand: "CleanPro",
        category: "Floor Care Robotics",
        gapDollars: -5_000,
        lostAt: "Aug 16 13:10",
      },
    ],
  },
  {
    issueKey: "mediaSpend",
    skuCount: 4,
    gapDollars: -8_000,
    severity: "low",
    aiSignal:
      "4 campaigns underspent vs plan while SOV slipped on Controllers. Budget pacing is behind by ~18%.",
    skus: [
      {
        id: "ms1",
        name: "PlayMax Enhanced Wired Controller",
        asin: "B0MS001",
        seller: "GameGear_Pro",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -3_000,
        lostAt: "Aug 21 06:15",
      },
      {
        id: "ms2",
        name: "PlayMax Nano Enhanced Wireless",
        asin: "B0MS002",
        seller: "CIQ_Retail",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -2_500,
        lostAt: "Aug 20 19:40",
      },
      {
        id: "ms3",
        name: "PlayMax Fusion Pro Wired",
        asin: "B0MS003",
        seller: "Amazon.com",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -1_500,
        lostAt: "Aug 16 12:00",
      },
      {
        id: "ms4",
        name: "PlayMax Spectra Infinity",
        asin: "B0MS004",
        seller: "GameGear_Pro",
        brand: "PlayMax",
        category: "Controllers",
        gapDollars: -1_000,
        lostAt: "Aug 15 09:45",
      },
    ],
  },
];

/** Fill missing BB owner / prices so detail tables never show blank "—" cells */
function enrichSkuCompetitiveFields(sku: IssueSku): IssueSku {
  if (
    sku.bbOwner != null &&
    sku.theirPrice != null &&
    sku.ourPrice != null
  ) {
    return sku;
  }

  // Plausible list vs competitor price from Gap magnitude (prototype only)
  const ourPrice =
    sku.ourPrice ??
    Math.max(39, Math.round(149 + Math.abs(sku.gapDollars) / 1500));
  const theirPrice =
    sku.theirPrice ??
    Math.max(29, ourPrice - 15 - Math.round(Math.abs(sku.gapDollars) / 8000));

  return {
    ...sku,
    bbOwner: sku.bbOwner ?? sku.seller,
    theirPrice,
    ourPrice,
  };
}

export const issueAlerts: IssueAlert[] = paintIssueAlertsOps(
  [...issueAlertsUnsorted]
    .map((issue) => ({
      ...issue,
      skus: issue.skus.map(enrichSkuCompetitiveFields),
    }))
    .sort((a, b) => a.gapDollars - b.gapDollars),
  ISSUE_TYPE_SIDEBAR_ORDER,
);

export const alertsSummary = {
  count: issueAlerts.length,
  gapDollars: issueAlerts.reduce((sum, a) => sum + a.gapDollars, 0),
};

const SEVERITY_RANK: Record<IssueAlert["severity"], number> = {
  high: 3,
  mid: 2,
  low: 1,
};

/** Roll issue SKUs up into category groups, sorted by Gap $ (most negative first). */
export function buildCategoryAlerts(alerts: IssueAlert[]): CategoryAlert[] {
  const byCategory = new Map<
    string,
    {
      skus: CategorySku[];
      gapDollars: number;
      severity: IssueAlert["severity"];
      issueKeys: Set<IssueKey>;
    }
  >();

  for (const issue of alerts) {
    for (const sku of issue.skus) {
      const existing = byCategory.get(sku.category) ?? {
        skus: [],
        gapDollars: 0,
        severity: "low" as IssueAlert["severity"],
        issueKeys: new Set<IssueKey>(),
      };
      existing.skus.push({ ...sku, issueKey: issue.issueKey });
      existing.gapDollars += sku.gapDollars;
      existing.issueKeys.add(issue.issueKey);
      if (SEVERITY_RANK[issue.severity] > SEVERITY_RANK[existing.severity]) {
        existing.severity = issue.severity;
      }
      byCategory.set(sku.category, existing);
    }
  }

  const groups: CategoryAlert[] = [...byCategory.entries()]
    .map(([name, data]) => {
      const skus = [...data.skus].sort((a, b) => a.gapDollars - b.gapDollars);
      const issueList = [...data.issueKeys].map((key) => issueLabel(key));
      return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        skuCount: skus.length,
        gapDollars: data.gapDollars,
        severity: data.severity,
        aiSignal: `${name} has ${skus.length} SKUs with Gap across ${issueList.join(", ")}. Focus on the highest Gap SKUs first.`,
        skus,
      };
    })
    .sort((a, b) => a.gapDollars - b.gapDollars);

  // Keep category/SKU order; stamp OPS so each list already reads high → low
  const topHeader = 2_800_000;
  const headerStep = 320_000;
  return groups.map((group, index) => ({
    ...group,
    skus: withDescendingSkuOps(
      group.skus,
      Math.max(280_000, topHeader - index * headerStep),
      group.skuCount,
    ),
  }));
}

export const categoryAlerts: CategoryAlert[] = buildCategoryAlerts(issueAlerts);

/** Taxonomy tree node for Alerts left panel — Overall → Brand → Category → SKU */
export type AlertsTaxonomyLevel = "overall" | "brand" | "category" | "sku";

export type AlertsTaxonomyNode = {
  id: string;
  name: string;
  level: AlertsTaxonomyLevel;
  skuCount: number;
  brandCount?: number;
  categoryCount?: number;
  issueCount?: number;
  asin?: string;
  skuId?: string;
  gapDollars: number;
  /** Rolled-up Ordered Product Sales for this node */
  opsDollars: number;
  skus: CategorySku[];
  children: AlertsTaxonomyNode[];
};

function taxonomyRcaLevelLabel(level: AlertsTaxonomyLevel): string {
  if (level === "overall") return "Portfolio RCA";
  if (level === "brand") return "Brand RCA";
  return "Category RCA";
}

function rollupIssuesByKey(skus: CategorySku[]) {
  const byIssue = new Map<
    IssueKey,
    { skuIds: Set<string>; gapDollars: number }
  >();

  for (const sku of skus) {
    const row = byIssue.get(sku.issueKey) ?? {
      skuIds: new Set<string>(),
      gapDollars: 0,
    };
    row.skuIds.add(sku.id);
    row.gapDollars += sku.gapDollars;
    byIssue.set(sku.issueKey, row);
  }

  return [...byIssue.entries()]
    .map(([issueKey, data]) => ({
      issueKey,
      name: issueLabel(issueKey),
      skuCount: data.skuIds.size,
      group: issueGroup(issueKey),
      gapDollars: data.gapDollars,
    }))
    .sort((a, b) => a.gapDollars - b.gapDollars);
}

/** Full issue-type rollup for a taxonomy node — uses every alert on those SKUs */
function rollupIssuesForTaxonomyNode(node: AlertsTaxonomyNode) {
  const skuIds = new Set(node.skus.map((sku) => sku.id));
  const byIssue = new Map<
    IssueKey,
    { skuIds: Set<string>; gapDollars: number }
  >();

  for (const issue of issueAlerts) {
    const matching = issue.skus.filter((sku) => skuIds.has(sku.id));
    if (matching.length === 0) continue;

    const row = byIssue.get(issue.issueKey) ?? {
      skuIds: new Set<string>(),
      gapDollars: 0,
    };
    for (const sku of matching) {
      row.skuIds.add(sku.id);
      row.gapDollars += sku.gapDollars;
    }
    byIssue.set(issue.issueKey, row);
  }

  return [...byIssue.entries()]
    .map(([issueKey, data]) => ({
      issueKey,
      name: issueLabel(issueKey),
      skuCount: data.skuIds.size,
      group: issueGroup(issueKey),
      gapDollars: data.gapDollars,
    }))
    .sort((a, b) => a.gapDollars - b.gapDollars);
}

function avgPriceUndercut(skus: CategorySku[]): number {
  const diffs = skus
    .filter((sku) => sku.theirPrice != null && sku.ourPrice != null)
    .map((sku) => sku.ourPrice! - sku.theirPrice!);

  if (diffs.length === 0) return 3.8;
  return diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
}

function buildTaxonomyInsightPrompts(
  node: AlertsTaxonomyNode,
): TaxonomyRcaPrompt[] {
  // SKU nodes use getTaxonomySkuChips elsewhere — rolled-up panels only
  if (node.level === "sku") return [];
  return getTaxonomyRolledUpChips(
    node.level as TaxonomyChipLevel,
    node.name,
  );
}

function countIssueOccurrences(node: AlertsTaxonomyNode): number {
  if (node.level === "sku") return node.issueCount ?? 1;
  if (node.children.length === 0) {
    return node.skus.length;
  }
  return node.children.reduce(
    (sum, child) => sum + countIssueOccurrences(child),
    0,
  );
}

/** Top child concentrations for bullet 2 — brands / categories / SKUs by level */
function topConcentrationRows(
  node: AlertsTaxonomyNode,
): { name: string; count: number }[] {
  const rows = node.children
    .map((child) => ({
      name: child.name,
      count: countIssueOccurrences(child),
    }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Category nodes sometimes omit populated children — fall back to top SKUs
  if (rows.length === 0 && node.skus.length > 0) {
    return [...node.skus]
      .sort((a, b) => a.gapDollars - b.gapDollars)
      .slice(0, 3)
      .map((sku) => ({ name: sku.name, count: 1 }));
  }

  return rows;
}

function formatConcentrationList(
  rows: { name: string; count: number }[],
  unit: "issues" | "SKUs",
): string {
  return rows
    .map((row) => {
      const label =
        unit === "SKUs"
          ? row.count === 1
            ? "1 SKU"
            : `${row.count} SKUs`
          : row.count === 1
            ? "1 issue"
            : `${row.count} issues`;
      return `${row.name} (${label})`;
    })
    .join(", ");
}

function concentrationPhrase(node: AlertsTaxonomyNode): string {
  const rows = topConcentrationRows(node);
  if (rows.length === 0) {
    return "No concentrated issue clusters in this view.";
  }

  const list = formatConcentrationList(rows, "issues");
  if (node.level === "overall") {
    return `Most issues in ${list}.`;
  }
  if (node.level === "brand") {
    return `Most issues in ${list}.`;
  }
  return `Most issues on ${list}.`;
}

function biggestIssuesPhrase(
  issueRollup: ReturnType<typeof rollupIssuesByKey>,
): string {
  const top = [...issueRollup]
    .sort((a, b) => b.skuCount - a.skuCount || a.gapDollars - b.gapDollars)
    .slice(0, 3);

  if (top.length === 0) {
    return "No active issues flagged in the latest scrape.";
  }

  const list = formatConcentrationList(
    top.map((issue) => ({ name: issue.name, count: issue.skuCount })),
    "SKUs",
  );
  return `Biggest issues: ${list}.`;
}

function taxonomyEntityLabel(node: AlertsTaxonomyNode): string {
  if (node.level === "overall") return "Portfolio";
  return node.name;
}

function uniqueSkuCount(node: AlertsTaxonomyNode): number {
  const fromSkus = new Set(node.skus.map((sku) => sku.id)).size;
  return fromSkus > 0 ? fromSkus : node.skuCount;
}

/**
 * Live right now — fixed 3-bullet shape; wording adapts by rollup level.
 * 1) Totals  2) Concentration by next level  3) Biggest issue types
 */
function buildTaxonomyLiveNowBullets(
  node: AlertsTaxonomyNode,
  issueRollup: ReturnType<typeof rollupIssuesByKey>,
): string[] {
  const entity = taxonomyEntityLabel(node);
  const issueTypeCount = issueRollup.length;
  const skuCount = uniqueSkuCount(node);
  const typeLabel =
    issueTypeCount === 1 ? "1 issue type" : `${issueTypeCount} issue types`;
  const skuLabel = skuCount === 1 ? "1 SKU" : `${skuCount} SKUs`;

  if (issueTypeCount === 0) {
    return [
      `${entity} has no live issue types that need fixing across ${skuLabel}.`,
      concentrationPhrase(node),
      "No active issues flagged in the latest scrape.",
    ];
  }

  return [
    `${entity} has ${typeLabel} that need fixing across ${skuLabel}.`,
    concentrationPhrase(node),
    biggestIssuesPhrase(issueRollup),
  ];
}

/**
 * Last week — same 3-bullet shape; lighter historical wording.
 */
function buildTaxonomyLastWeekBullets(
  node: AlertsTaxonomyNode,
  issueRollup: ReturnType<typeof rollupIssuesByKey>,
): string[] {
  const issueTypeCount = issueRollup.length;
  const skuCount = uniqueSkuCount(node);
  const typeLabel =
    issueTypeCount === 1 ? "1 issue type" : `${issueTypeCount} issue types`;
  const skuLabel = skuCount === 1 ? "1 SKU" : `${skuCount} SKUs`;
  const primary = issueRollup[0];

  if (issueTypeCount === 0) {
    return [
      `No issue types flagged across ${skuLabel} last week.`,
      concentrationPhrase(node),
      "No sustained issue patterns across the period.",
    ];
  }

  return [
    `${typeLabel.charAt(0).toUpperCase()}${typeLabel.slice(1)} flagged across ${skuLabel}.`,
    concentrationPhrase(node),
    `${primary.name} was the top issue; several remain open.`,
  ];
}

function buildTaxonomyIssuePrompts(
  entity: string,
  topIssues: TaxonomyRcaTopIssue[],
): TaxonomyRcaPrompt[] {
  if (topIssues.length === 0) return [];

  const templates: Array<(issue: TaxonomyRcaTopIssue) => TaxonomyRcaPrompt> = [
    (issue) => ({
      id: `drill-${issue.issueKey}`,
      label: `Break down ${issue.name} by SKU for ${entity}`,
      prompt: `Run a focused RCA on ${issue.name} for ${entity} — ${issue.skuCount} SKUs affected. Rank root causes and recommend actions.`,
    }),
    (issue) => ({
      id: `compare-${issue.issueKey}`,
      label: `How does ${issue.name} compare to last week on ${entity}?`,
      prompt: `Compare ${issue.name} gap and SKU exposure for ${entity} vs the prior 7 days. Highlight what got worse.`,
    }),
    (issue) => ({
      id: `fix-${issue.issueKey}`,
      label: `Fastest fix for ${issue.name} on ${entity}?`,
      prompt: `Recommend the highest-ROI actions to resolve ${issue.name} on ${entity} within the next 48 hours.`,
    }),
  ];

  return topIssues.slice(0, 3).map((issue, index) => templates[index](issue));
}

/** Performance tiles for taxonomy RCA — scaled from portfolio anchors in the design reference */
function buildTaxonomyPerformanceKpis(
  node: AlertsTaxonomyNode,
): TaxonomyPerformanceKpi[] {
  const portfolioGapRef = Math.abs(portfolioGap.gapDollars);
  const scale =
    node.level === "overall"
      ? 1
      : Math.min(1, Math.max(0.004, Math.abs(node.gapDollars) / portfolioGapRef));

  const planDollars = 23_100_000 * scale;
  const lastWeekGap = -12_300_000 * scale;
  const lastWeekAchieved = 11_800_000 * scale;
  const lastWeekAttainment = 51.0;

  const wtdSales = 5_000_000 * scale;
  const weekElapsedPct = 49.2;

  const projectedGap = 3_200_000 * scale;
  const projectedSales = 26_400_000 * scale;
  const eowAttainment = 114.0;

  const formatSignedMoney = (value: number) => {
    const base = formatMoneyCompact(Math.abs(value));
    if (value > 0) return `+${base}`;
    if (value < 0) return `−${base}`;
    return base;
  };

  return [
    {
      id: "last-week",
      title: LAST_WEEK_KPI_TITLE,
      value: formatSignedMoney(lastWeekGap),
      tone: "negative",
      subtitle: `${formatMoneyCompact(lastWeekAchieved)} of ${formatMoneyCompact(planDollars)} plan · ${lastWeekAttainment.toFixed(1)}% attainment`,
    },
    {
      id: "wtd",
      title: WTD_KPI_TITLE,
      value: formatMoneyCompact(wtdSales),
      tone: "neutral",
      subtitle: `in sales · ${weekElapsedPct.toFixed(1)}% of week elapsed`,
    },
    {
      id: "eow",
      title: EOW_KPI_TITLE,
      value: `${formatSignedMoney(projectedGap)} vs plan`,
      tone: "positive",
      subtitle: `${formatMoneyCompact(planDollars)} plan · ${formatMoneyCompact(projectedSales)} projected · ${eowAttainment.toFixed(1)}%`,
    },
  ];
}

/** Build portfolio / brand / category RCA copy from taxonomy node SKUs */
export function buildTaxonomyRcaView(node: AlertsTaxonomyNode): TaxonomyRcaView {
  const skus = node.skus;
  const issueRollup = rollupIssuesForTaxonomyNode(node);
  const topIssues = issueRollup.slice(0, 3).map((issue, index) => ({
    ...issue,
    rank: index + 1,
  }));

  const alertCount = issueRollup.length;
  const primaryIssue = issueRollup[0];
  const primaryGap = primaryIssue ? Math.abs(primaryIssue.gapDollars) : 0;

  const sellerRollup = new Map<string, number>();
  for (const sku of skus) {
    const seller = sku.bbOwner ?? sku.seller;
    sellerRollup.set(
      seller,
      (sellerRollup.get(seller) ?? 0) + Math.abs(sku.gapDollars),
    );
  }
  const topSellers = [...sellerRollup.entries()].sort(
    (a, b) => b[1] - a[1],
  );
  const sellerGapTotal = topSellers.reduce((sum, [, gap]) => sum + gap, 0);
  const topTwoShare =
    sellerGapTotal > 0 && topSellers.length >= 2
      ? Math.round(
          ((topSellers[0][1] + topSellers[1][1]) / sellerGapTotal) * 100,
        )
      : topSellers.length === 1
        ? 100
        : 0;

  const projectedCompound =
    topIssues.reduce((sum, issue) => sum + Math.abs(issue.gapDollars), 0) *
    2.2;

  const narratives: AllyInsightBullet[] = [];

  if (primaryIssue) {
    narratives.push({
      id: "primary-issue",
      segments: [
        { kind: "strong", text: primaryIssue.name },
        {
          kind: "text",
          text: ` is the biggest issue for ${node.name} based on last week's data — amounting to `,
        },
        { kind: "money", amount: -primaryGap, variant: "emphasis" },
        { kind: "text", text: " in lost revenue across " },
        { kind: "strong", text: `${primaryIssue.skuCount} SKUs` },
        { kind: "text", text: "." },
      ],
    });
  }

  if (topSellers.length >= 2 && topTwoShare > 0) {
    const undercut = avgPriceUndercut(skus);
    narratives.push({
      id: "sellers",
      segments: [
        { kind: "text", text: "Sellers " },
        { kind: "strong", text: `'${topSellers[0][0]}'` },
        { kind: "text", text: " and " },
        { kind: "strong", text: `'${topSellers[1][0]}'` },
        {
          kind: "text",
          text: ` contributed to ${topTwoShare}% of the total ${primaryIssue?.name ?? "alert"} revenue impact, undercutting price by an avg of `,
        },
        { kind: "strong", text: `$${undercut.toFixed(2)}` },
        { kind: "text", text: "." },
      ],
    });
  } else if (node.level === "overall" && (node.brandCount ?? 0) > 0) {
    narratives.push({
      id: "brands",
      segments: [
        { kind: "text", text: "Issues span " },
        { kind: "strong", text: `${node.brandCount} brands` },
        { kind: "text", text: " and " },
        { kind: "strong", text: `${node.skuCount} SKUs` },
        {
          kind: "text",
          text: ". CleanPro and KitchenPro account for the majority of revenue at risk this week.",
        },
      ],
    });
  } else if (node.level === "brand" && (node.categoryCount ?? 0) > 0) {
    narratives.push({
      id: "categories",
      segments: [
        { kind: "text", text: `${node.name} alerts are concentrated in ` },
        { kind: "strong", text: `${node.categoryCount} categories` },
        {
          kind: "text",
          text: ". Floor Care and Kitchen categories drive most of the gap this week.",
        },
      ],
    });
  }

  if (topIssues.length > 0) {
    narratives.push({
      id: "projection",
      segments: [
        {
          kind: "text",
          text: "If unresolved in the next 48h, the top 3 active issues are projected to compound to ",
        },
        { kind: "money", amount: -projectedCompound, variant: "emphasis" },
        { kind: "text", text: " in impact by end of week." },
      ],
    });
  }

  while (narratives.length < 3 && narratives.length > 0) {
    narratives.push({
      id: `pad-${narratives.length}`,
      segments: [
        {
          kind: "text",
          text: `${node.name} has ${alertCount} active alert types affecting ${node.skuCount} SKUs in this view.`,
        },
      ],
    });
  }

  return {
    levelLabel: taxonomyRcaLevelLabel(node.level),
    entityName: node.name,
    alertCount,
    skuCount: node.skuCount,
    gapDollars: node.gapDollars,
    performanceKpis: buildTaxonomyPerformanceKpis(node),
    liveNowBullets: buildTaxonomyLiveNowBullets(node, issueRollup),
    lastWeekBullets: buildTaxonomyLastWeekBullets(node, issueRollup),
    narratives: narratives.slice(0, 3),
    topIssues,
    skus,
    insightPrompts: buildTaxonomyInsightPrompts(node),
    issuePrompts: buildTaxonomyIssuePrompts(node.name, topIssues),
  };
}

function countIssuesPerSku(
  alerts: IssueAlert[],
  filters: AlertsFilters,
  timeWindow: AlertsTimeWindow,
): Map<string, number> {
  const counts = new Map<string, Set<IssueKey>>();

  for (const issue of alerts) {
    if (filters.issueKey && issue.issueKey !== filters.issueKey) continue;

    for (const sku of issue.skus) {
      if (
        !skuPassesFilters(sku, filters) ||
        !skuWithinTimeWindow(sku, timeWindow)
      ) {
        continue;
      }
      const set = counts.get(sku.id) ?? new Set<IssueKey>();
      set.add(issue.issueKey);
      counts.set(sku.id, set);
    }
  }

  return new Map(
    [...counts.entries()].map(([id, set]) => [id, set.size]),
  );
}

/** Build Overall → Brand → Category → SKU tree from filtered alert SKUs. */
export function buildAlertsTaxonomyTree(
  alerts: IssueAlert[],
  filters: AlertsFilters,
  timeWindow: AlertsTimeWindow = DEFAULT_ALERTS_TIME_WINDOW,
): AlertsTaxonomyNode | null {
  const issueCounts = countIssuesPerSku(alerts, filters, timeWindow);
  const skuById = new Map<string, CategorySku>();

  for (const issue of alerts) {
    if (filters.issueKey && issue.issueKey !== filters.issueKey) continue;

    for (const sku of issue.skus) {
      if (
        !skuPassesFilters(sku, filters) ||
        !skuWithinTimeWindow(sku, timeWindow)
      ) {
        continue;
      }
      if (!skuById.has(sku.id)) {
        skuById.set(sku.id, { ...sku, issueKey: issue.issueKey });
      }
    }
  }

  const skus = [...skuById.values()];
  if (skus.length === 0) return null;

  const brandMap = new Map<string, Map<string, CategorySku[]>>();

  for (const sku of skus) {
    const categories = brandMap.get(sku.brand) ?? new Map<string, CategorySku[]>();
    const list = categories.get(sku.category) ?? [];
    list.push(sku);
    categories.set(sku.category, list);
    brandMap.set(sku.brand, categories);
  }

  const brandNodes: AlertsTaxonomyNode[] = [...brandMap.entries()]
    .map(([brandName, categoryMap]) => {
      const categoryNodes: AlertsTaxonomyNode[] = [...categoryMap.entries()]
        .map(([categoryName, categorySkus]) => {
          const sortedSkus = [...categorySkus].sort(
            (a, b) => a.gapDollars - b.gapDollars,
          );
          const skuNodes: AlertsTaxonomyNode[] = sortedSkus.map((sku) => ({
            id: `sku:${sku.id}`,
            name: sku.name,
            level: "sku",
            skuCount: 1,
            issueCount: issueCounts.get(sku.id) ?? 1,
            asin: sku.asin,
            skuId: sku.id,
            gapDollars: sku.gapDollars,
            opsDollars: skuOpsDollars(sku),
            skus: [sku],
            children: [],
          }));

          return {
            id: `category:${brandName}:${categoryName}`.toLowerCase().replace(/\s+/g, "-"),
            name: categoryName,
            level: "category" as const,
            skuCount: sortedSkus.length,
            gapDollars: sortedSkus.reduce((sum, s) => sum + s.gapDollars, 0),
            opsDollars: sumOpsDollars(sortedSkus),
            skus: sortedSkus,
            children: skuNodes,
          };
        })
        .sort((a, b) => a.gapDollars - b.gapDollars);

      const brandSkus = categoryNodes.flatMap((c) => c.skus);

      return {
        id: `brand:${brandName}`.toLowerCase().replace(/\s+/g, "-"),
        name: brandName,
        level: "brand" as const,
        categoryCount: categoryNodes.length,
        skuCount: brandSkus.length,
        gapDollars: brandSkus.reduce((sum, s) => sum + s.gapDollars, 0),
        opsDollars: sumOpsDollars(brandSkus),
        skus: brandSkus,
        children: categoryNodes,
      };
    })
    .sort((a, b) => a.gapDollars - b.gapDollars);

  const tree: AlertsTaxonomyNode = {
    id: "overall",
    name: "Overall",
    level: "overall",
    brandCount: brandNodes.length,
    skuCount: skus.length,
    gapDollars: skus.reduce((sum, s) => sum + s.gapDollars, 0),
    opsDollars: sumOpsDollars(skus),
    skus,
    children: brandNodes,
  };

  // Keep taxonomy order; stamp OPS so every sibling list reads high → low
  return paintTaxonomyOpsDescending(tree);
}

export function findTaxonomyNode(
  root: AlertsTaxonomyNode,
  id: string,
): AlertsTaxonomyNode | undefined {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findTaxonomyNode(child, id);
    if (found) return found;
  }
  return undefined;
}

/** Default expanded ids — open Overall and the first brand + category. */
export function defaultTaxonomyExpandedIds(
  root: AlertsTaxonomyNode,
): Set<string> {
  const ids = new Set<string>([root.id]);
  const firstBrand = root.children[0];
  if (firstBrand) {
    ids.add(firstBrand.id);
    const firstCategory = firstBrand.children[0];
    if (firstCategory) ids.add(firstCategory.id);
  }
  return ids;
}

/** Default selected taxonomy node — first brand (matches design mock). */
export function defaultTaxonomySelection(root: AlertsTaxonomyNode): string {
  return root.children[0]?.id ?? root.id;
}

/** Find a taxonomy node by SKU id (leaf). */
export function findTaxonomyNodeBySkuId(
  root: AlertsTaxonomyNode,
  skuId: string,
): AlertsTaxonomyNode | undefined {
  if (root.level === "sku" && root.skuId === skuId) return root;
  for (const child of root.children) {
    const found = findTaxonomyNodeBySkuId(child, skuId);
    if (found) return found;
  }
  return undefined;
}

/** Find the issue alert that owns a SKU id (Alerts → Alert SKU detail). */
export function findIssueForSku(skuId: string): IssueAlert | undefined {
  return issueAlerts.find((issue) => issue.skus.some((s) => s.id === skuId));
}

/**
 * Map an Insights hierarchy SKU node → IssueSku for Alert SKU detail (`SkuRca`).
 * Prefer a matching Alerts SKU (same product name); otherwise synthesize fields.
 * Insights SKU page does not use this — it stays on the hierarchy node.
 */
export function issueSkuFromHierarchyNode(node: HierarchyNode): IssueSku {
  // Same product may already exist on an alert — reuse that richer row
  for (const issue of issueAlerts) {
    const match = issue.skus.find(
      (s) => s.name.toLowerCase() === node.name.toLowerCase(),
    );
    if (match) {
      return { ...match, gapDollars: node.gapDollars };
    }
  }

  // Hierarchy-only SKU — still enough for SkuRca (ASIN derived from id)
  const asinSeed = node.id.replace(/^sku-/, "").toUpperCase().replace(/-/g, "");
  return {
    id: node.id,
    name: node.name,
    asin: asinSeed.length >= 8 ? `B0${asinSeed.slice(0, 8)}` : `B0${asinSeed}XXXX`,
    seller: "Amazon.com",
    brand: "CleanPro",
    category: "Floor Care",
    gapDollars: node.gapDollars,
    lostAt: "Aug 21 09:20",
  };
}

/** Flat list of every alerted SKU (with owning issue) — filter option source */
function allAlertSkus(): CategorySku[] {
  return issueAlerts.flatMap((issue) =>
    issue.skus.map((sku) => ({ ...sku, issueKey: issue.issueKey })),
  );
}

function matchesSkuText(sku: IssueSku, query: string) {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    sku.name.toLowerCase().includes(q) ||
    sku.asin.toLowerCase().includes(q) ||
    String(sku.gapDollars).includes(q)
  );
}

function skuPassesFilters(
  sku: IssueSku,
  filters: AlertsFilters,
  /** When building category options, ignore category so the list stays complete for the brand */
  ignoreCategory = false,
) {
  if (filters.brand && sku.brand !== filters.brand) return false;
  if (!ignoreCategory && filters.category && sku.category !== filters.category)
    return false;
  if (filters.skuId && sku.id !== filters.skuId) return false;
  if (!matchesSkuText(sku, filters.skuQuery)) return false;
  return true;
}

function rollupDimension(
  skus: CategorySku[],
  key: "brand" | "category",
): FilterDimensionOption[] {
  const map = new Map<
    string,
    { gapDollars: number; unitsDelta: number; issueKeys: Set<IssueKey> }
  >();

  for (const sku of skus) {
    const name = sku[key];
    const existing = map.get(name) ?? {
      gapDollars: 0,
      unitsDelta: 0,
      issueKeys: new Set<IssueKey>(),
    };
    existing.gapDollars += sku.gapDollars;
    // Mock units from $ gap (prototype only)
    existing.unitsDelta += Math.round(sku.gapDollars / 400);
    existing.issueKeys.add(sku.issueKey);
    map.set(name, existing);
  }

  return [...map.entries()]
    .map(([name, data]) => {
      const gapAbs = Math.abs(data.gapDollars);
      const achievedDollars = Math.max(40_000, Math.round(gapAbs * 0.55));
      const targetDollars = achievedDollars + gapAbs;
      return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        gapDollars: data.gapDollars,
        unitsDelta: data.unitsDelta,
        issueCount: data.issueKeys.size,
        achievedDollars,
        targetDollars,
      };
    })
    .sort((a, b) => a.gapDollars - b.gapDollars);
}

/** Brand rows for the filter popover (optionally scoped by current text query) */
export function getBrandFilterOptions(
  skuQuery = "",
): FilterDimensionOption[] {
  const skus = allAlertSkus().filter((s) => matchesSkuText(s, skuQuery));
  return rollupDimension(skus, "brand");
}

/** Category rows — narrowed when a brand is already selected */
export function getCategoryFilterOptions(
  brand: string | null = null,
  skuQuery = "",
): FilterDimensionOption[] {
  const skus = allAlertSkus().filter((s) => {
    if (brand && s.brand !== brand) return false;
    return matchesSkuText(s, skuQuery);
  });
  return rollupDimension(skus, "category");
}

/**
 * Issue type rows for taxonomy filter — narrowed by brand / category / search.
 * Sorted by $ gap (worst first). issueCount = affected SKUs.
 */
export function getIssueFilterOptions(
  brand: string | null = null,
  category: string | null = null,
  skuQuery = "",
): FilterDimensionOption[] {
  const options: FilterDimensionOption[] = [];

  for (const issue of issueAlerts) {
    const skus = issue.skus.filter((sku) => {
      if (brand && sku.brand !== brand) return false;
      if (category && sku.category !== category) return false;
      if (!matchesSkuText(sku, skuQuery)) return false;
      return true;
    });
    if (skus.length === 0) continue;

    const gapDollars = skus.reduce((sum, sku) => sum + sku.gapDollars, 0);
    const gapAbs = Math.abs(gapDollars);
    const achievedDollars = Math.max(40_000, Math.round(gapAbs * 0.55));

    options.push({
      id: issue.issueKey,
      name: issueLabel(issue.issueKey),
      gapDollars,
      unitsDelta: Math.round(gapDollars / 400),
      issueCount: skus.length,
      achievedDollars,
      targetDollars: achievedDollars + gapAbs,
    });
  }

  return options.sort((a, b) => a.gapDollars - b.gapDollars);
}

/** SKU rows — narrowed by brand / category when those filters are on */
export function getSkuFilterOptions(
  brand: string | null = null,
  category: string | null = null,
  skuQuery = "",
): FilterDimensionOption[] {
  // Dedupe by SKU id (same ASIN can appear under multiple issues)
  const byId = new Map<string, CategorySku>();
  for (const sku of allAlertSkus()) {
    if (brand && sku.brand !== brand) continue;
    if (category && sku.category !== category) continue;
    if (!matchesSkuText(sku, skuQuery)) continue;
    const existing = byId.get(sku.id);
    if (!existing || sku.gapDollars < existing.gapDollars) {
      byId.set(sku.id, sku);
    }
  }

  return [...byId.values()]
    .map((sku) => {
      const gapAbs = Math.abs(sku.gapDollars);
      const achievedDollars = Math.max(5_000, Math.round(gapAbs * 0.55));
      return {
        id: sku.id,
        name: sku.name,
        gapDollars: sku.gapDollars,
        unitsDelta: Math.round(sku.gapDollars / 400),
        issueCount: 1,
        achievedDollars,
        targetDollars: achievedDollars + gapAbs,
      };
    })
    .sort((a, b) => a.gapDollars - b.gapDollars);
}

/** Totals for the open popover header */
export function summarizeFilterOptions(options: FilterDimensionOption[]) {
  const gapDollars = options.reduce((sum, o) => sum + o.gapDollars, 0);
  const unitsDelta = options.reduce((sum, o) => sum + o.unitsDelta, 0);
  const achievedDollars = options.reduce((sum, o) => sum + o.achievedDollars, 0);
  const targetDollars = options.reduce((sum, o) => sum + o.targetDollars, 0);
  return { gapDollars, unitsDelta, achievedDollars, targetDollars };
}

/** Apply Brand / Category / SKU / Issue filters (+ optional time window) to issue alerts */
export function filterIssueAlerts(
  alerts: IssueAlert[],
  filters: AlertsFilters,
  timeWindow: AlertsTimeWindow = DEFAULT_ALERTS_TIME_WINDOW,
): IssueAlert[] {
  return alerts
    .map((issue) => {
      if (filters.issueKey && issue.issueKey !== filters.issueKey) return null;

      const skus = issue.skus.filter(
        (sku) =>
          skuPassesFilters(sku, filters) &&
          skuWithinTimeWindow(sku, timeWindow),
      );
      if (skus.length === 0 && issue.skus.length > 0) return null;
      // Keep empty-SKU placeholder issues only when no dimension filters are on
      if (
        issue.skus.length === 0 &&
        (filters.brand ||
          filters.category ||
          filters.skuId ||
          filters.skuQuery.trim() ||
          filters.issueKey)
      ) {
        return null;
      }
      const gapDollars =
        skus.length > 0
          ? skus.reduce((sum, s) => sum + s.gapDollars, 0)
          : issue.gapDollars;
      return {
        ...issue,
        skus,
        skuCount: skus.length > 0 ? skus.length : issue.skuCount,
        gapDollars,
      };
    })
    .filter((issue): issue is IssueAlert => issue != null)
    .sort((a, b) => a.gapDollars - b.gapDollars);
}

/** Apply the same filters when the left list is grouped by category */
export function filterCategoryAlerts(
  alerts: CategoryAlert[],
  filters: AlertsFilters,
  timeWindow: AlertsTimeWindow = DEFAULT_ALERTS_TIME_WINDOW,
): CategoryAlert[] {
  return alerts
    .map((cat) => {
      const skus = cat.skus.filter(
        (sku) =>
          skuPassesFilters(sku, filters) &&
          skuWithinTimeWindow(sku, timeWindow),
      );
      if (skus.length === 0) return null;
      return {
        ...cat,
        skus,
        skuCount: skus.length,
        gapDollars: skus.reduce((sum, s) => sum + s.gapDollars, 0),
      };
    })
    .filter((cat): cat is CategoryAlert => cat != null)
    .sort((a, b) => a.gapDollars - b.gapDollars);
}

export const emptyAlertsFilters: AlertsFilters = {
  brand: null,
  category: null,
  skuId: null,
  skuQuery: "",
  issueKey: null,
};

export const hierarchyTree: HierarchyNode = {
  id: "biz",
  name: "Entire Business",
  level: "business",
  gapDollars: -4_200_000,
  insight:
    "Portfolio is −$4.2M vs plan this week (79% attainment). PlayMax (−$2.8M) and CleanPro (−$1.8M) drive the miss; KitchenPro is a bright spot at +$400K and partially offsets.",
  metrics: {
    attainmentPct: 79,
    unitsDelta: -48_000,
    aspDelta: -1.8,
    issueChips: [
      { chip: "Buy Box", count: 12 },
      { chip: "Stock", count: 5 },
      { chip: "SOV", count: 4 },
    ],
  },
  children: [
    {
      id: "cleanpro",
      name: "CleanPro",
      level: "brand",
      gapDollars: -1_800_000,
      insight:
        "CleanPro is down $1.8M vs plan this week. Floor care robotics is the primary driver at −$940K, largely from Lost Buy Box on 12 SKUs. Hair care is above plan at +$260K and partially offsets the miss.",
      metrics: {
        attainmentPct: 82,
        unitsDelta: -22_400,
        aspDelta: -3.2,
        issueChips: [
          { chip: "Buy Box", count: 12 },
          { chip: "Deal Page", count: 8 },
        ],
      },
      children: [
        {
          id: "fcr",
          name: "Floor Care Robotics",
          level: "category",
          gapDollars: -940_000,
          insight:
            "Floor Care Robotics is −$940K vs plan. Lost Buy Box on robot vacuums is the main driver; conversion and deal visibility are secondary.",
          metrics: {
            attainmentPct: 61,
            unitsDelta: -9_800,
            aspDelta: -4.5,
            issueChips: [
              { chip: "Buy Box", count: 9 },
              { chip: "Conversion", count: 2 },
            ],
          },
          children: [
            {
              id: "fcr-robot",
              name: "Robot Vacuums",
              level: "subcategory",
              gapDollars: -720_000,
              insight:
                "Robot Vacuums account for most of the category miss (−$720K). Top SKUs lost Buy Box to VacuMart_US mid-week.",
              metrics: {
                attainmentPct: 54,
                unitsDelta: -7_200,
                aspDelta: -5.1,
                issueChips: [{ chip: "Buy Box", count: 7 }],
              },
              children: [
                {
                  id: "sku-av970",
                  name: "CleanPro Robot Vac R900",
                  level: "sku",
                  gapDollars: -62_000,
                  insight:
                    "CleanPro Robot Vac R900 is the largest Gap SKU in Robot Vacuums (−$62K, 48% attainment). Lost Buy Box to a 3P seller is the primary driver; ASP is also down ~$30 vs plan.",
                  metrics: {
                    attainmentPct: 48,
                    unitsDelta: -410,
                    aspDelta: -30,
                    issueChips: [{ chip: "Buy Box", count: 1 }],
                  },
                },
                {
                  id: "sku-rv2310",
                  name: "CleanPro AI Robot R2010",
                  level: "sku",
                  gapDollars: -48_000,
                  insight:
                    "CleanPro AI Robot R2010 Gap (−$48K) tracks with Buy Box loss and softer conversion. Units are −320 vs plan for this period.",
                  metrics: {
                    attainmentPct: 52,
                    unitsDelta: -320,
                    aspDelta: -31,
                    issueChips: [{ chip: "Buy Box", count: 1 }],
                  },
                },
                {
                  id: "sku-rx-v2",
                  name: "CleanPro RX V2 Plus",
                  level: "sku",
                  gapDollars: -41_000,
                  metrics: {
                    attainmentPct: 55,
                    unitsDelta: -280,
                    aspDelta: -20,
                    issueChips: [{ chip: "Buy Box", count: 1 }],
                  },
                },
                {
                  id: "sku-ultrarv",
                  name: "CleanPro AI Robot R2002",
                  level: "sku",
                  gapDollars: -38_000,
                  metrics: {
                    attainmentPct: 58,
                    unitsDelta: -250,
                    aspDelta: -18,
                    issueChips: [{ chip: "Buy Box", count: 1 }],
                  },
                },
                {
                  id: "sku-detect",
                  name: "CleanPro DetectPro Auto-Empty",
                  level: "sku",
                  gapDollars: -35_000,
                  metrics: {
                    attainmentPct: 60,
                    unitsDelta: -210,
                    aspDelta: -12,
                    issueChips: [{ chip: "Deal Page", count: 1 }],
                  },
                },
              ],
            },
            {
              id: "fcr-stick",
              name: "Stick & Handheld",
              level: "subcategory",
              gapDollars: -220_000,
              insight:
                "Stick & Handheld is −$220K. Stock Availability on two ASINs is limiting recovery after price resets.",
              metrics: {
                attainmentPct: 74,
                unitsDelta: -2_600,
                aspDelta: -1.2,
                issueChips: [{ chip: "Stock", count: 2 }],
              },
              children: [
                {
                  id: "sku-stratos",
                  name: "CleanPro Pro Cordless",
                  level: "sku",
                  gapDollars: -42_000,
                  metrics: {
                    attainmentPct: 70,
                    unitsDelta: -380,
                    aspDelta: -2.0,
                    issueChips: [{ chip: "Stock", count: 1 }],
                  },
                },
                {
                  id: "sku-wandvac",
                  name: "CleanPro MiniVac System",
                  level: "sku",
                  gapDollars: -28_000,
                  metrics: {
                    attainmentPct: 76,
                    unitsDelta: -220,
                    aspDelta: -0.8,
                    issueChips: [{ chip: "Stock", count: 1 }],
                  },
                },
                {
                  id: "sku-vertex",
                  name: "CleanPro TwinBrush Vacuum",
                  level: "sku",
                  gapDollars: -22_000,
                  metrics: {
                    attainmentPct: 80,
                    unitsDelta: -160,
                    aspDelta: -0.5,
                  },
                },
              ],
            },
          ],
        },
        {
          id: "fcc",
          name: "Floor Care Corded",
          level: "category",
          gapDollars: -380_000,
          insight:
            "Floor Care Corded is −$380K vs plan. Softness is broad across uprights; no single SKU dominates the gap.",
          metrics: {
            attainmentPct: 78,
            unitsDelta: -4_100,
            aspDelta: -0.8,
            issueChips: [{ chip: "Conversion", count: 3 }],
          },
          children: [
            {
              id: "fcc-uprights",
              name: "Uprights",
              level: "subcategory",
              gapDollars: -260_000,
              insight:
                "Uprights drive most of the corded miss (−$260K). SKU detail list is stubbed for now.",
              metrics: {
                attainmentPct: 75,
                unitsDelta: -2_800,
                aspDelta: -0.9,
                issueChips: [{ chip: "Conversion", count: 2 }],
              },
              children: [],
            },
            {
              id: "fcc-canisters",
              name: "Canisters",
              level: "subcategory",
              gapDollars: -120_000,
              insight:
                "Canisters are −$120K. Light traffic week; SKU list empty in this prototype.",
              metrics: {
                attainmentPct: 82,
                unitsDelta: -1_300,
                aspDelta: -0.4,
              },
              children: [],
            },
          ],
        },
        {
          id: "hair",
          name: "Hair Care",
          level: "category",
          gapDollars: 260_000,
          insight:
            "Hair Care is above plan at +$260K. Strong conversion on new launches is carrying the category.",
          metrics: {
            attainmentPct: 112,
            unitsDelta: 3_200,
            aspDelta: 1.4,
          },
          children: [
            {
              id: "hair-dryers",
              name: "Dryers",
              level: "subcategory",
              gapDollars: 180_000,
              insight:
                "Dryers are the growth engine (+$180K). SKU list stubbed empty for now.",
              metrics: {
                attainmentPct: 118,
                unitsDelta: 2_100,
                aspDelta: 1.6,
              },
              children: [],
            },
            {
              id: "hair-styling",
              name: "Styling Tools",
              level: "subcategory",
              gapDollars: 80_000,
              insight:
                "Styling Tools are +$80K. SKU list empty in this prototype.",
              metrics: {
                attainmentPct: 105,
                unitsDelta: 1_100,
                aspDelta: 0.8,
              },
              children: [],
            },
          ],
        },
        {
          id: "air",
          name: "Air Treatment",
          level: "category",
          gapDollars: -120_000,
          insight:
            "Air Treatment is slightly under plan (−$120K). Seasonal demand soft; media efficiency is holding.",
          metrics: {
            attainmentPct: 91,
            unitsDelta: -900,
            aspDelta: -0.3,
            issueChips: [{ chip: "SOV", count: 1 }],
          },
          children: [
            {
              id: "air-purifiers",
              name: "Air Purifiers",
              level: "subcategory",
              gapDollars: -85_000,
              insight:
                "Air Purifiers are −$85K. SKU list stubbed empty for now.",
              metrics: {
                attainmentPct: 88,
                unitsDelta: -620,
                aspDelta: -0.4,
                issueChips: [{ chip: "SOV", count: 1 }],
              },
              children: [],
            },
            {
              id: "air-fans",
              name: "Fans & Coolers",
              level: "subcategory",
              gapDollars: -35_000,
              insight:
                "Fans & Coolers are −$35K. SKU list empty in this prototype.",
              metrics: {
                attainmentPct: 94,
                unitsDelta: -280,
                aspDelta: -0.1,
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "playmax",
      name: "PlayMax",
      level: "brand",
      gapDollars: -2_800_000,
      insight:
        "PlayMax is the largest portfolio miss at −$2.8M. Controllers (−$1.45M) and Headsets (−$780K) dominate; gaming accessories demand is soft vs plan.",
      metrics: {
        attainmentPct: 76,
        unitsDelta: -31_000,
        aspDelta: -1.1,
        issueChips: [
          { chip: "Conversion", count: 6 },
          { chip: "Keyword Rank", count: 4 },
        ],
      },
      children: [
        {
          id: "pa-controllers",
          name: "Controllers",
          level: "category",
          gapDollars: -1_450_000,
          insight:
            "Controllers are −$1.45M vs plan — the heaviest PlayMax category miss. Competitive pricing and keyword rank losses are the top drivers.",
          metrics: {
            attainmentPct: 68,
            unitsDelta: -18_200,
            aspDelta: -2.0,
            issueChips: [
              { chip: "Keyword Rank", count: 4 },
              { chip: "Conversion", count: 3 },
            ],
          },
        },
        {
          id: "pa-headsets",
          name: "Headsets",
          level: "category",
          gapDollars: -780_000,
          insight:
            "Headsets are −$780K. Share of voice dropped on top keywords after media cuts last week.",
          metrics: {
            attainmentPct: 72,
            unitsDelta: -8_400,
            aspDelta: -0.6,
            issueChips: [{ chip: "SOV", count: 3 }],
          },
        },
        {
          id: "pa-charging",
          name: "Charging & Cables",
          level: "category",
          gapDollars: -420_000,
          insight:
            "Charging & Cables is −$420K. Bundle attach rates are down; ASP pressure from 3P sellers.",
          metrics: {
            attainmentPct: 81,
            unitsDelta: -3_100,
            aspDelta: -1.5,
          },
        },
        {
          id: "pa-cases",
          name: "Cases & Protection",
          level: "category",
          gapDollars: -150_000,
          insight:
            "Cases & Protection is a smaller miss (−$150K). Inventory is healthy; traffic soft.",
          metrics: {
            attainmentPct: 88,
            unitsDelta: -1_300,
            aspDelta: 0.2,
          },
        },
      ],
    },
    {
      id: "kitchenpro",
      name: "KitchenPro",
      level: "brand",
      gapDollars: 400_000,
      insight:
        "KitchenPro is above plan at +$400K. Kitchen Appliances lead the win; cookware is flat-positive. Use KitchenPro strength to offset CleanPro/PlayMax misses in portfolio rollups.",
      metrics: {
        attainmentPct: 104,
        unitsDelta: 5_600,
        aspDelta: 0.9,
      },
      children: [
        {
          id: "nj-kitchen",
          name: "Kitchen Appliances",
          level: "category",
          gapDollars: 280_000,
          insight:
            "Kitchen Appliances are +$280K vs plan. Strong promo conversion and Buy Box hold rates.",
          metrics: {
            attainmentPct: 108,
            unitsDelta: 3_800,
            aspDelta: 1.2,
          },
        },
        {
          id: "nj-blenders",
          name: "Blenders & Smoothies",
          level: "category",
          gapDollars: 95_000,
          insight:
            "Blenders & Smoothies are +$95K. Seasonal lift continuing into WTD.",
          metrics: {
            attainmentPct: 106,
            unitsDelta: 1_400,
            aspDelta: 0.5,
          },
        },
        {
          id: "nj-cookware",
          name: "Cookware",
          level: "category",
          gapDollars: 25_000,
          insight:
            "Cookware is slightly above plan (+$25K). Low volatility week.",
          metrics: {
            attainmentPct: 101,
            unitsDelta: 400,
            aspDelta: 0.1,
          },
        },
      ],
    },
  ],
};

export const cleanProBrandInsight =
  "CleanPro is down $1.8M vs plan this week. Floor care robotics is the primary driver at −$940K, largely from Lost Buy Box on 12 SKUs. Hair care is above plan at +$260K and partially offsets the miss.";

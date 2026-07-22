import {
  ISSUE_NAMES,
  type IssueGroup,
  type IssueKey,
} from "@/components/alerts/issue-names";

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
  /** Buy Box / competitive fields when relevant to the issue */
  bbOwner?: string;
  theirPrice?: number;
  ourPrice?: number;
  lostAt?: string;
};

/** Active Alerts tab filters (Brand · Category · SKU) */
export type AlertsFilters = {
  brand: string | null;
  category: string | null;
  /** Selected SKU id — exact match when set */
  skuId: string | null;
  /** Free-text search (name / ASIN / $ gap) */
  skuQuery: string;
};

/**
 * How far back the Alerts list looks for issues that became active.
 * 24h = acute / just happened · 7D = default week · 30D = includes chronic.
 */
export type AlertsTimeWindow = "24h" | "7d" | "30d";

export const DEFAULT_ALERTS_TIME_WINDOW: AlertsTimeWindow = "24h";

/** Fixed "now" for the prototype so Lost At dates stay stable across machines */
export const ALERTS_MOCK_NOW = new Date("2026-01-16T18:00:00");

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

/** Turn "Jan 15 14:32" into a real Date (year taken from ALERTS_MOCK_NOW). */
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
  // Dec before a Jan "now" belongs to the previous year
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

/** One slice of Gap $ impact (conversion / margin / traffic) */
export type ImpactBucket = {
  id: "conversion" | "margin" | "traffic";
  label: string;
  /** Who typically owns fixing this slice */
  owner: string;
  dollars: number;
  pct: number;
};

/** One actor or category in a concentration chart */
export type ConcentrationRow = {
  id: string;
  name: string;
  skuCount: number;
  dollars: number;
  pct: number;
};

export type AlertStrategicInsights = {
  impact: ImpactBucket[];
  sellers: ConcentrationRow[];
  categories: ConcentrationRow[];
  /** Card title — "Categories exposed" or "Brands most exposed" when only one category */
  categoryCardTitle: string;
  /** One-line takeaway for seller concentration */
  sellerTakeaway?: string;
  /** One-line takeaway for category concentration */
  categoryTakeaway?: string;
};

/** Split total $ into conversion / margin / traffic (mock ratios by issue type). */
function impactMixForKey(
  feedbackKey: string,
): { conversion: number; margin: number; traffic: number } {
  // Competitive / Buy Box — mostly units lost, some price-match, some rank bleed
  if (feedbackKey === "lostBuyBox" || feedbackKey.includes("Buy Box")) {
    return { conversion: 0.58, margin: 0.27, traffic: 0.15 };
  }
  // Visibility / deal — traffic-heavy
  if (
    feedbackKey === "dealPageVisibility" ||
    feedbackKey === "promoBadge" ||
    feedbackKey === "keywordRank" ||
    feedbackKey === "sponsoredShareOfVoice" ||
    feedbackKey === "mediaSpend"
  ) {
    return { conversion: 0.32, margin: 0.18, traffic: 0.5 };
  }
  // Ops / availability
  if (
    feedbackKey === "stockAvailability" ||
    feedbackKey === "shippingSpeed"
  ) {
    return { conversion: 0.72, margin: 0.08, traffic: 0.2 };
  }
  // Default balanced mix
  return { conversion: 0.45, margin: 0.3, traffic: 0.25 };
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
  // Impact mix charts use magnitude (absolute Gap $)
  const total = totalFromSkus > 0 ? totalFromSkus : Math.abs(gapDollars);
  const mix = impactMixForKey(feedbackKey);

  const impactDefs: {
    id: ImpactBucket["id"];
    label: string;
    owner: string;
    weight: number;
  }[] = [
    {
      id: "conversion",
      label: "Conversion loss",
      owner: "Sales",
      weight: mix.conversion,
    },
    {
      id: "margin",
      label: "Margin loss",
      owner: "Pricing",
      weight: mix.margin,
    },
    {
      id: "traffic",
      label: "Traffic loss",
      owner: "Media",
      weight: mix.traffic,
    },
  ];

  // Round dollars so the three buckets still sum to total
  let allocated = 0;
  const impact: ImpactBucket[] = impactDefs.map((def, index) => {
    const isLast = index === impactDefs.length - 1;
    const dollars = isLast
      ? Math.max(0, total - allocated)
      : Math.round(total * def.weight);
    allocated += dollars;
    return {
      id: def.id,
      label: def.label,
      owner: def.owner,
      dollars,
      pct: total > 0 ? Math.round((dollars / total) * 100) : 0,
    };
  });

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

  return {
    impact,
    sellers,
    categories,
    categoryCardTitle,
    sellerTakeaway,
    categoryTakeaway,
  };
}

export function issueLabel(issueKey: IssueKey) {
  return ISSUE_NAMES[issueKey].filter;
}

export function issueGroup(issueKey: IssueKey): IssueGroup {
  return ISSUE_NAMES[issueKey].group;
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
  periodRange: "Mon Jul 20 – Wed Jul 22",
};

export const brandCards: BrandCard[] = [
  {
    name: "PowerA",
    gapDollars: -2_800_000,
    attainmentPct: 76,
    achievedDollars: 8_867_000,
    targetDollars: 11_667_000,
  },
  {
    name: "Shark",
    gapDollars: -1_800_000,
    attainmentPct: 82,
    achievedDollars: 8_200_000,
    targetDollars: 10_000_000,
  },
  {
    name: "Ninja",
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
      "AllyAI flagged VacuumKing undercutting. CIQ repriced within 4 hours — Buy Box back on 7 of 9 ASINs.",
    impactDollars: 180_000,
    impactLabel: "revenue protected WTD",
    scope: "Shark · Floor Care Robotics",
    skusTouched: 9,
  },
  {
    id: "deal-restore",
    action: "Restored Deal Page Visibility",
    narrative:
      "Content + Sales Agent restored missing deal badges on 6 ASINs after a syndication drop. Traffic recovered same day.",
    impactDollars: 95_000,
    impactLabel: "sales recovered",
    scope: "Shark · Floor Care",
    skusTouched: 6,
  },
  {
    id: "promo-budget",
    action: "Reallocated promo budget to Ninja kitchen",
    narrative:
      "AllyAI shifted $42K from weak SOV into Ninja cookware deals. Buy Box held while units lifted.",
    impactDollars: 120_000,
    impactLabel: "incremental sales",
    scope: "Ninja · Kitchen Appliances",
    skusTouched: 4,
  },
  {
    id: "oos-expedite",
    action: "Expedited replenishment on Hair Care",
    narrative:
      "Stock alert triggered PO acceleration on 3 launch ASINs — avoided projected weekend OOS.",
    impactDollars: 68_000,
    impactLabel: "stockout avoided",
    scope: "Shark · Hair Care",
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
    "Week to date, the portfolio is −$4.2M vs plan (79% attainment) — PowerA and Shark are driving the miss.",
  points: [
    {
      level: "Brand",
      text: "PowerA is the largest gap at −$2.8M; Shark follows at −$1.8M, while Ninja is ahead at +$400K.",
    },
    {
      level: "Category",
      text: "Shark’s miss is concentrated in floor care robotics.",
    },
    {
      level: "Issue",
      text: "Lost Buy Box on 12 SKUs (same 3P seller) is the primary cause.",
    },
  ],
};

/** Issue-level alerts — sorted by Gap $ (most negative first) */
const issueAlertsUnsorted: IssueAlert[] = [
  {
    issueKey: "lostBuyBox",
    skuCount: 6,
    gapDollars: -231_000,
    severity: "high",
    aiSignal:
      "VacuumKing_US holds Buy Box on several high-gap SKUs at $20–30 below list. Damage spans robotics, uprights, hair care, and more — not a single-category problem.",
    skus: [
      {
        id: "s1",
        name: "Shark IQ AV970",
        asin: "B08XYZ1234",
        seller: "VacuumKing_US",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -62_000,
        bbOwner: "VacuumKing_US",
        theirPrice: 289,
        ourPrice: 319,
        // Fresh — visible in 24h (acute)
        lostAt: "Jan 16 09:20",
      },
      {
        id: "s2",
        name: "Shark Stratos Upright",
        asin: "B09ABC5678",
        seller: "VacuumKing_US",
        brand: "Shark",
        // Different category so the exposure card is a mix, not 100% one bar
        category: "Floor Care",
        gapDollars: -48_000,
        bbOwner: "VacuumKing_US",
        theirPrice: 248,
        ourPrice: 279,
        lostAt: "Jan 16 09:20",
      },
      {
        id: "s3",
        name: "Shark FlexStyle HD440",
        asin: "B07DEF9012",
        seller: "BeautyDealz",
        brand: "Shark",
        category: "Hair Care",
        gapDollars: -41_000,
        bbOwner: "BeautyDealz",
        theirPrice: 199,
        ourPrice: 219,
        lostAt: "Jan 14 09:17",
      },
      {
        id: "s4",
        name: "Shark Air Purifier 6",
        asin: "B06GHI3456",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Home Comfort",
        gapDollars: -35_000,
        bbOwner: "DealHunterPro",
        theirPrice: 149,
        ourPrice: 169,
        // Inside 7D — feeds the "Other" slice with Kitchen below
        lostAt: "Jan 13 11:40",
      },
      {
        id: "s5",
        name: "Ninja Foodi DualZone",
        asin: "B05JKL7890",
        seller: "KitchenMart_US",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -27_000,
        bbOwner: "KitchenMart_US",
        theirPrice: 179,
        ourPrice: 199,
        lostAt: "Jan 12 09:15",
      },
      {
        id: "s6",
        name: "Shark Controllers Bundle",
        asin: "B04MNO1122",
        seller: "VacuumKing_US",
        brand: "Shark",
        category: "Controllers",
        gapDollars: -18_000,
        bbOwner: "VacuumKing_US",
        theirPrice: 39,
        ourPrice: 49,
        lostAt: "Jan 11 16:05",
      },
    ],
  },
  {
    issueKey: "dealPageVisibility",
    skuCount: 8,
    gapDollars: -180_000,
    severity: "mid",
    aiSignal:
      "8 SKUs lost Deal Page Visibility this week. Traffic and conversion drops concentrate on Shark floor care ASINs.",
    skus: [
      {
        id: "d1",
        name: "Shark Stratos Cordless",
        asin: "B0DPV001",
        seller: "DealHub_US",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -42_000,
        lostAt: "Jan 16 08:12",
      },
      {
        id: "d2",
        name: "Shark Detect Pro Auto-Empty",
        asin: "B0DPV002",
        seller: "DealHub_US",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -35_000,
        lostAt: "Jan 16 08:12",
      },
      {
        id: "d3",
        name: "Shark PowerDetect Upright",
        asin: "B0DPV003",
        seller: "DealHub_US",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -28_000,
        lostAt: "Jan 15 19:44",
      },
      {
        id: "d4",
        name: "Shark Vertex DuoClean",
        asin: "B0DPV004",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -22_000,
        lostAt: "Jan 15 11:05",
      },
      {
        id: "d5",
        name: "Shark Wandvac System",
        asin: "B0DPV005",
        seller: "Amazon.com",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -18_000,
        lostAt: "Jan 14 16:30",
      },
      {
        id: "d6",
        name: "Shark CarpetXpert Stain Striker",
        asin: "B0DPV006",
        seller: "FloorCareOutlet",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -15_000,
        lostAt: "Jan 14 09:18",
      },
      {
        id: "d7",
        name: "Ninja NeverStick Cookware Set",
        asin: "B0DPV007",
        seller: "KitchenDeals_US",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -12_000,
        lostAt: "Dec 19 16:10",
      },
      {
        id: "d8",
        name: "Ninja Foodi PossibleCooker",
        asin: "B0DPV008",
        seller: "CIQ_Retail",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -8_000,
        lostAt: "Jan 5 11:25",
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
        name: "Shark AI Ultra Robot RV2502",
        asin: "B0STK001",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -32_000,
        lostAt: "Jan 16 06:40",
      },
      {
        id: "st2",
        name: "Shark Navigator Lift-Away",
        asin: "B0STK002",
        seller: "Amazon.com",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -24_000,
        lostAt: "Jan 15 22:15",
      },
      {
        id: "st3",
        name: "Shark FlexBreeze Fan",
        asin: "B0STK003",
        seller: "HomeComfort_US",
        brand: "Shark",
        category: "Home Comfort",
        gapDollars: -18_000,
        lostAt: "Jan 15 13:28",
      },
      {
        id: "st4",
        name: "PowerA Enhanced Wired Controller",
        asin: "B0STK004",
        seller: "GameGear_Pro",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -10_000,
        lostAt: "Dec 20 08:30",
      },
      {
        id: "st5",
        name: "PowerA Nano Enhanced Wireless",
        asin: "B0STK005",
        seller: "CIQ_Retail",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -6_000,
        lostAt: "Jan 3 14:20",
      },
    ],
  },
  {
    issueKey: "shippingSpeed",
    skuCount: 4,
    gapDollars: -40_000,
    severity: "low",
    aiSignal:
      "4 PowerA and Shark SKUs slipped below 2-day shipping promise this week. Late FC handoffs are the main driver.",
    skus: [
      {
        id: "sh1",
        name: "PowerA Fusion Pro Wired",
        asin: "B0SHP001",
        seller: "GameGear_Pro",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -14_000,
        lostAt: "Jan 16 11:20",
      },
      {
        id: "sh2",
        name: "PowerA Spectra Infinity",
        asin: "B0SHP002",
        seller: "CIQ_Retail",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -11_000,
        lostAt: "Jan 16 09:05",
      },
      {
        id: "sh3",
        name: "Shark Wandvac System",
        asin: "B0SHP003",
        seller: "Amazon.com",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -9_000,
        lostAt: "Jan 15 16:40",
      },
      {
        id: "sh4",
        name: "Shark FlexBreeze Fan",
        asin: "B0SHP004",
        seller: "HomeComfort_US",
        brand: "Shark",
        category: "Home Comfort",
        gapDollars: -6_000,
        lostAt: "Jan 1 10:05",
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
        name: "Ninja Foodi PossibleCooker",
        asin: "B0KW001",
        seller: "KitchenDeals_US",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -8_000,
        lostAt: "Jan 16 07:30",
      },
      {
        id: "kw2",
        name: "Shark IQ AV970",
        asin: "B0KW002",
        seller: "VacuumKing_US",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -7_000,
        lostAt: "Jan 15 20:10",
      },
      {
        id: "kw3",
        name: "PowerA Nano Enhanced Wireless",
        asin: "B0KW003",
        seller: "GameGear_Pro",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -5_000,
        lostAt: "Jan 15 14:55",
      },
    ],
  },
  {
    issueKey: "ratingReviews",
    skuCount: 3,
    gapDollars: -20_000,
    severity: "low",
    aiSignal:
      "3 SKUs dropped below 4.2★ after a cluster of negative reviews. Conversion impact concentrated on Ninja kitchen.",
    skus: [
      {
        id: "rr1",
        name: "Ninja NeverStick Cookware Set",
        asin: "B0RR001",
        seller: "Amazon.com",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -10_000,
        lostAt: "Jan 16 10:00",
      },
      {
        id: "rr2",
        name: "Ninja Foodi PossibleCooker",
        asin: "B0RR002",
        seller: "KitchenDeals_US",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -6_000,
        lostAt: "Jan 15 18:22",
      },
      {
        id: "rr3",
        name: "Shark HydroVac WD200",
        asin: "B0RR003",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -4_000,
        lostAt: "Jan 2 16:40",
      },
    ],
  },
  {
    issueKey: "conversionDrop",
    skuCount: 2,
    gapDollars: -12_000,
    severity: "low",
    aiSignal:
      "2 Shark robot SKUs show conversion down >15% WoW with traffic flat — PDP content and price parity are the top suspects.",
    skus: [
      {
        id: "cd1",
        name: "Shark AI Robot RV2310",
        asin: "B0CD001",
        seller: "VacuumKing_US",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -7_000,
        lostAt: "Jan 16 08:45",
      },
      {
        id: "cd2",
        name: "Shark Rx V2 Plus",
        asin: "B0CD002",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -5_000,
        lostAt: "Jan 15 13:10",
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
        name: "PowerA Enhanced Wired Controller",
        asin: "B0MS001",
        seller: "GameGear_Pro",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -3_000,
        lostAt: "Jan 16 06:15",
      },
      {
        id: "ms2",
        name: "PowerA Nano Enhanced Wireless",
        asin: "B0MS002",
        seller: "CIQ_Retail",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -2_500,
        lostAt: "Jan 15 19:40",
      },
      {
        id: "ms3",
        name: "PowerA Fusion Pro Wired",
        asin: "B0MS003",
        seller: "Amazon.com",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -1_500,
        lostAt: "Dec 18 12:00",
      },
      {
        id: "ms4",
        name: "PowerA Spectra Infinity",
        asin: "B0MS004",
        seller: "GameGear_Pro",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -1_000,
        lostAt: "Jan 4 09:45",
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

export const issueAlerts: IssueAlert[] = [...issueAlertsUnsorted]
  .map((issue) => ({
    ...issue,
    skus: issue.skus.map(enrichSkuCompetitiveFields),
  }))
  .sort((a, b) => a.gapDollars - b.gapDollars);

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

  const groups: CategoryAlert[] = [...byCategory.entries()].map(
    ([name, data]) => {
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
    },
  );

  return groups.sort((a, b) => a.gapDollars - b.gapDollars);
}

export const categoryAlerts: CategoryAlert[] = buildCategoryAlerts(issueAlerts);

/** Find the issue alert that owns a SKU id (for shared SKU leaf). */
export function findIssueForSku(skuId: string): IssueAlert | undefined {
  return issueAlerts.find((issue) => issue.skus.some((s) => s.id === skuId));
}

/**
 * Map an Insights hierarchy SKU node → IssueSku for the shared SkuRca page.
 * Prefer a matching Alerts SKU (same product name); otherwise synthesize fields.
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
    brand: "Shark",
    category: "Floor Care",
    gapDollars: node.gapDollars,
    lostAt: "Jan 16 09:20",
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

/** Apply Brand / Category / SKU text filters (+ optional time window) to issue alerts */
export function filterIssueAlerts(
  alerts: IssueAlert[],
  filters: AlertsFilters,
  timeWindow: AlertsTimeWindow = DEFAULT_ALERTS_TIME_WINDOW,
): IssueAlert[] {
  return alerts
    .map((issue) => {
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
          filters.skuQuery.trim())
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
};

export const hierarchyTree: HierarchyNode = {
  id: "biz",
  name: "Entire Business",
  level: "business",
  gapDollars: -4_200_000,
  insight:
    "Portfolio is −$4.2M vs plan this week (79% attainment). PowerA (−$2.8M) and Shark (−$1.8M) drive the miss; Ninja is a bright spot at +$400K and partially offsets.",
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
      id: "shark",
      name: "Shark",
      level: "brand",
      gapDollars: -1_800_000,
      insight:
        "Shark is down $1.8M vs plan this week. Floor care robotics is the primary driver at −$940K, largely from Lost Buy Box on 12 SKUs. Hair care is above plan at +$260K and partially offsets the miss.",
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
                "Robot Vacuums account for most of the category miss (−$720K). Top SKUs lost Buy Box to VacuumKing_US mid-week.",
              metrics: {
                attainmentPct: 54,
                unitsDelta: -7_200,
                aspDelta: -5.1,
                issueChips: [{ chip: "Buy Box", count: 7 }],
              },
              children: [
                {
                  id: "sku-av970",
                  name: "Shark IQ AV970",
                  level: "sku",
                  gapDollars: -62_000,
                  metrics: {
                    attainmentPct: 48,
                    unitsDelta: -410,
                    aspDelta: -30,
                    issueChips: [{ chip: "Buy Box", count: 1 }],
                  },
                },
                {
                  id: "sku-rv2310",
                  name: "Shark AI Robot RV2310",
                  level: "sku",
                  gapDollars: -48_000,
                  metrics: {
                    attainmentPct: 52,
                    unitsDelta: -320,
                    aspDelta: -31,
                    issueChips: [{ chip: "Buy Box", count: 1 }],
                  },
                },
                {
                  id: "sku-rx-v2",
                  name: "Shark Rx V2 Plus",
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
                  name: "Shark AI Ultra Robot RV2502",
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
                  name: "Shark Detect Pro Auto-Empty",
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
                  name: "Shark Stratos Cordless",
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
                  name: "Shark Wandvac System",
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
                  name: "Shark Vertex DuoClean",
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
      id: "powera",
      name: "PowerA",
      level: "brand",
      gapDollars: -2_800_000,
      insight:
        "PowerA is the largest portfolio miss at −$2.8M. Controllers (−$1.45M) and Headsets (−$780K) dominate; gaming accessories demand is soft vs plan.",
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
            "Controllers are −$1.45M vs plan — the heaviest PowerA category miss. Competitive pricing and keyword rank losses are the top drivers.",
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
      id: "ninja",
      name: "Ninja",
      level: "brand",
      gapDollars: 400_000,
      insight:
        "Ninja is above plan at +$400K. Kitchen Appliances lead the win; cookware is flat-positive. Use Ninja strength to offset Shark/PowerA misses in portfolio rollups.",
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

export const sharkBrandInsight =
  "Shark is down $1.8M vs plan this week. Floor care robotics is the primary driver at −$940K, largely from Lost Buy Box on 12 SKUs. Hair care is above plan at +$260K and partially offsets the miss.";

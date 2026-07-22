import {
  ISSUE_NAMES,
  type IssueGroup,
  type IssueKey,
} from "@/components/alerts/issue-names";

export type BrandCard = {
  name: string;
  subtitle: string;
  gapDollars: number;
  attainmentPct: number;
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

/** Active Alerts tab filters (Brand · Category · SKU text) */
export type AlertsFilters = {
  brand: string | null;
  category: string | null;
  skuQuery: string;
};

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
  atRiskDollars: number;
  severity: "high" | "mid" | "low";
  aiSignal?: string;
  skus: CategorySku[];
};

export type AlertsGroupBy = "issue" | "category";

export type IssueAlert = {
  issueKey: IssueKey;
  skuCount: number;
  atRiskDollars: number;
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

export function issueLabel(issueKey: IssueKey) {
  return ISSUE_NAMES[issueKey].filter;
}

export function issueGroup(issueKey: IssueKey): IssueGroup {
  return ISSUE_NAMES[issueKey].group;
}

export const portfolioGap = {
  gapDollars: -4_200_000,
  attainmentPct: 79,
  label: "Portfolio gap · WTD",
};

export const brandCards: BrandCard[] = [
  {
    name: "PowerA",
    subtitle: "Gaming accessories",
    gapDollars: -2_800_000,
    attainmentPct: 76,
  },
  {
    name: "Shark",
    subtitle: "Floor care",
    gapDollars: -1_800_000,
    attainmentPct: 82,
  },
  {
    name: "Ninja",
    subtitle: "Kitchen",
    gapDollars: 400_000,
    attainmentPct: 104,
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
      "AllyAI flagged VacuumKing undercutting mid-week. CIQ ran the competitive reprice playbook within 4 hours — Buy Box recovered on 7 of 9 ASINs.",
    impactDollars: 180_000,
    impactLabel: "revenue protected WTD",
    scope: "Shark · Floor Care Robotics",
    skusTouched: 9,
  },
  {
    id: "deal-restore",
    action: "Restored Deal Page Visibility",
    narrative:
      "Content Agent + Sales Agent synced missing deal badges on 6 floor-care ASINs after a syndication drop. Traffic recovered same day.",
    impactDollars: 95_000,
    impactLabel: "sales recovered",
    scope: "Shark · Floor Care",
    skusTouched: 6,
  },
  {
    id: "promo-budget",
    action: "Reallocated promo budget to Ninja kitchen",
    narrative:
      "AllyAI recommended shifting $42K from underperforming SOV into Ninja cookware deals. Conversion held Buy Box while units lifted.",
    impactDollars: 120_000,
    impactLabel: "incremental sales",
    scope: "Ninja · Kitchen Appliances",
    skusTouched: 4,
  },
  {
    id: "oos-expedite",
    action: "Expedited replenishment on Hair Care",
    narrative:
      "Stock Availability alert triggered PO acceleration for 3 launch ASINs. Avoided projected OOS gap before weekend demand.",
    impactDollars: 68_000,
    impactLabel: "stockout avoided",
    scope: "Shark · Hair Care",
    skusTouched: 3,
  },
];

export const aiBrief =
  "Shark is driving the majority of this week’s miss — down $1.8M vs plan, with losses concentrated in floor care robotics. A Lost Buy Box problem affecting 12 SKUs (same 3P seller) is the primary cause. Ninja is above plan at +$400K.";

/** Issue-level alerts — sorted by $ at risk (highest first) */
const issueAlertsUnsorted: IssueAlert[] = [
  {
    issueKey: "lostBuyBox",
    skuCount: 12,
    atRiskDollars: 280_000,
    severity: "high",
    aiSignal:
      "VacuumKing_US holds Buy Box on 9 of 12 affected SKUs at $20–30 below list price. This is portfolio-wide — one seller undercutting systematically.",
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
        lostAt: "Jan 15 14:32",
      },
      {
        id: "s2",
        name: "Shark AI Robot RV2310",
        asin: "B09ABC5678",
        seller: "VacuumKing_US",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -48_000,
        bbOwner: "VacuumKing_US",
        theirPrice: 248,
        ourPrice: 279,
        lostAt: "Jan 15 14:32",
      },
      {
        id: "s3",
        name: "Shark Rx V2 Plus",
        asin: "B07DEF9012",
        seller: "VacuumKing_US",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -41_000,
        bbOwner: "VacuumKing_US",
        theirPrice: 199,
        ourPrice: 219,
        lostAt: "Jan 14 09:17",
      },
      {
        id: "s4",
        name: "Shark Lift-Away Pro",
        asin: "B06GHI3456",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -35_000,
        bbOwner: "DealHunterPro",
        theirPrice: 149,
        ourPrice: 169,
        lostAt: "Jan 13 22:45",
      },
      {
        id: "s5",
        name: "Shark HydroVac WD200",
        asin: "B05JKL7890",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -27_000,
        bbOwner: "VacuumKing_US",
        theirPrice: 179,
        ourPrice: 199,
        lostAt: "Jan 13 18:02",
      },
    ],
  },
  {
    issueKey: "dealPageVisibility",
    skuCount: 8,
    atRiskDollars: 180_000,
    severity: "mid",
    aiSignal:
      "8 SKUs lost Deal Page Visibility this week. Traffic and conversion drops concentrate on Shark floor care ASINs.",
    skus: [
      {
        id: "d1",
        name: "Shark Stratos Cordless",
        asin: "B0DPV001",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -42_000,
        lostAt: "Jan 16 08:12",
      },
      {
        id: "d2",
        name: "Shark Detect Pro Auto-Empty",
        asin: "B0DPV002",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care Robotics",
        gapDollars: -35_000,
        lostAt: "Jan 16 08:12",
      },
      {
        id: "d3",
        name: "Shark PowerDetect Upright",
        asin: "B0DPV003",
        seller: "CIQ_Retail",
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
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -18_000,
        lostAt: "Jan 14 16:30",
      },
      {
        id: "d6",
        name: "Shark CarpetXpert Stain Striker",
        asin: "B0DPV006",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -15_000,
        lostAt: "Jan 14 09:18",
      },
      {
        id: "d7",
        name: "Ninja NeverStick Cookware Set",
        asin: "B0DPV007",
        seller: "CIQ_Retail",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -12_000,
        lostAt: "Jan 13 21:50",
      },
      {
        id: "d8",
        name: "Ninja Foodi PossibleCooker",
        asin: "B0DPV008",
        seller: "CIQ_Retail",
        brand: "Ninja",
        category: "Kitchen Appliances",
        gapDollars: -8_000,
        lostAt: "Jan 13 14:02",
      },
    ],
  },
  {
    issueKey: "stockAvailability",
    skuCount: 5,
    atRiskDollars: 90_000,
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
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Floor Care",
        gapDollars: -24_000,
        lostAt: "Jan 15 22:15",
      },
      {
        id: "st3",
        name: "Shark FlexBreeze Fan",
        asin: "B0STK003",
        seller: "CIQ_Retail",
        brand: "Shark",
        category: "Home Comfort",
        gapDollars: -18_000,
        lostAt: "Jan 15 13:28",
      },
      {
        id: "st4",
        name: "PowerA Enhanced Wired Controller",
        asin: "B0STK004",
        seller: "CIQ_Retail",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -10_000,
        lostAt: "Jan 14 17:55",
      },
      {
        id: "st5",
        name: "PowerA Nano Enhanced Wireless",
        asin: "B0STK005",
        seller: "CIQ_Retail",
        brand: "PowerA",
        category: "Controllers",
        gapDollars: -6_000,
        lostAt: "Jan 14 10:03",
      },
    ],
  },
  {
    issueKey: "shippingSpeed",
    skuCount: 4,
    atRiskDollars: 40_000,
    severity: "low",
    skus: [],
  },
  {
    issueKey: "keywordRank",
    skuCount: 6,
    atRiskDollars: 30_000,
    severity: "low",
    skus: [],
  },
  {
    issueKey: "ratingReviews",
    skuCount: 3,
    atRiskDollars: 20_000,
    severity: "low",
    skus: [],
  },
  {
    issueKey: "conversionDrop",
    skuCount: 2,
    atRiskDollars: 12_000,
    severity: "low",
    skus: [],
  },
  {
    issueKey: "mediaSpend",
    skuCount: 4,
    atRiskDollars: 8_000,
    severity: "low",
    skus: [],
  },
];

export const issueAlerts: IssueAlert[] = [...issueAlertsUnsorted].sort(
  (a, b) => b.atRiskDollars - a.atRiskDollars,
);

export const alertsSummary = {
  count: issueAlerts.length,
  atRiskDollars: issueAlerts.reduce((sum, a) => sum + a.atRiskDollars, 0),
};

const SEVERITY_RANK: Record<IssueAlert["severity"], number> = {
  high: 3,
  mid: 2,
  low: 1,
};

/** Roll issue SKUs up into category groups, sorted by $ at risk (highest first). */
export function buildCategoryAlerts(alerts: IssueAlert[]): CategoryAlert[] {
  const byCategory = new Map<
    string,
    {
      skus: CategorySku[];
      atRiskDollars: number;
      severity: IssueAlert["severity"];
      issueKeys: Set<IssueKey>;
    }
  >();

  for (const issue of alerts) {
    for (const sku of issue.skus) {
      const existing = byCategory.get(sku.category) ?? {
        skus: [],
        atRiskDollars: 0,
        severity: "low" as IssueAlert["severity"],
        issueKeys: new Set<IssueKey>(),
      };
      existing.skus.push({ ...sku, issueKey: issue.issueKey });
      existing.atRiskDollars += Math.abs(sku.gapDollars);
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
        atRiskDollars: data.atRiskDollars,
        severity: data.severity,
        aiSignal: `${name} has ${skus.length} SKUs at risk across ${issueList.join(", ")}. Focus on the highest Gap SKUs first.`,
        skus,
      };
    },
  );

  return groups.sort((a, b) => b.atRiskDollars - a.atRiskDollars);
}

export const categoryAlerts: CategoryAlert[] = buildCategoryAlerts(issueAlerts);

/** Find the issue alert that owns a SKU id (for shared SKU leaf). */
export function findIssueForSku(skuId: string): IssueAlert | undefined {
  return issueAlerts.find((issue) => issue.skus.some((s) => s.id === skuId));
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

/** Totals for the open popover header */
export function summarizeFilterOptions(options: FilterDimensionOption[]) {
  const gapDollars = options.reduce((sum, o) => sum + o.gapDollars, 0);
  const unitsDelta = options.reduce((sum, o) => sum + o.unitsDelta, 0);
  const achievedDollars = options.reduce((sum, o) => sum + o.achievedDollars, 0);
  const targetDollars = options.reduce((sum, o) => sum + o.targetDollars, 0);
  return { gapDollars, unitsDelta, achievedDollars, targetDollars };
}

/** Apply Brand / Category / SKU text filters to issue-grouped alerts */
export function filterIssueAlerts(
  alerts: IssueAlert[],
  filters: AlertsFilters,
): IssueAlert[] {
  return alerts
    .map((issue) => {
      const skus = issue.skus.filter((sku) => skuPassesFilters(sku, filters));
      if (skus.length === 0 && issue.skus.length > 0) return null;
      // Keep empty-SKU placeholder issues only when no dimension filters are on
      if (
        issue.skus.length === 0 &&
        (filters.brand || filters.category || filters.skuQuery.trim())
      ) {
        return null;
      }
      const atRiskDollars =
        skus.length > 0
          ? skus.reduce((sum, s) => sum + Math.abs(s.gapDollars), 0)
          : issue.atRiskDollars;
      return {
        ...issue,
        skus,
        skuCount: skus.length > 0 ? skus.length : issue.skuCount,
        atRiskDollars,
      };
    })
    .filter((issue): issue is IssueAlert => issue != null)
    .sort((a, b) => b.atRiskDollars - a.atRiskDollars);
}

/** Apply the same filters when the left list is grouped by category */
export function filterCategoryAlerts(
  alerts: CategoryAlert[],
  filters: AlertsFilters,
): CategoryAlert[] {
  return alerts
    .map((cat) => {
      const skus = cat.skus.filter((sku) => skuPassesFilters(sku, filters));
      if (skus.length === 0) return null;
      return {
        ...cat,
        skus,
        skuCount: skus.length,
        atRiskDollars: skus.reduce((sum, s) => sum + Math.abs(s.gapDollars), 0),
      };
    })
    .filter((cat): cat is CategoryAlert => cat != null)
    .sort((a, b) => b.atRiskDollars - a.atRiskDollars);
}

export const emptyAlertsFilters: AlertsFilters = {
  brand: null,
  category: null,
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

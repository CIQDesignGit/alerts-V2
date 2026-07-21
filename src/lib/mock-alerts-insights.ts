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
  /** Buy Box / competitive fields when relevant to the issue */
  bbOwner?: string;
  theirPrice?: number;
  ourPrice?: number;
  lostAt?: string;
};

export type IssueAlert = {
  issueKey: IssueKey;
  skuCount: number;
  atRiskDollars: number;
  /** visual weight: high = error red, mid = warning, low = muted */
  severity: "high" | "mid" | "low";
  aiSignal?: string;
  skus: IssueSku[];
};

export type HierarchyNode = {
  id: string;
  name: string;
  level: "business" | "brand" | "category" | "subcategory" | "sku";
  gapDollars: number;
  children?: HierarchyNode[];
};

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
        gapDollars: -42_000,
        lostAt: "Jan 16 08:12",
      },
      {
        id: "d2",
        name: "Shark Detect Pro Auto-Empty",
        asin: "B0DPV002",
        seller: "CIQ_Retail",
        gapDollars: -35_000,
        lostAt: "Jan 16 08:12",
      },
      {
        id: "d3",
        name: "Shark PowerDetect Upright",
        asin: "B0DPV003",
        seller: "CIQ_Retail",
        gapDollars: -28_000,
        lostAt: "Jan 15 19:44",
      },
      {
        id: "d4",
        name: "Shark Vertex DuoClean",
        asin: "B0DPV004",
        seller: "CIQ_Retail",
        gapDollars: -22_000,
        lostAt: "Jan 15 11:05",
      },
      {
        id: "d5",
        name: "Shark Wandvac System",
        asin: "B0DPV005",
        seller: "CIQ_Retail",
        gapDollars: -18_000,
        lostAt: "Jan 14 16:30",
      },
      {
        id: "d6",
        name: "Shark CarpetXpert Stain Striker",
        asin: "B0DPV006",
        seller: "CIQ_Retail",
        gapDollars: -15_000,
        lostAt: "Jan 14 09:18",
      },
      {
        id: "d7",
        name: "Ninja NeverStick Cookware Set",
        asin: "B0DPV007",
        seller: "CIQ_Retail",
        gapDollars: -12_000,
        lostAt: "Jan 13 21:50",
      },
      {
        id: "d8",
        name: "Ninja Foodi PossibleCooker",
        asin: "B0DPV008",
        seller: "CIQ_Retail",
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
        gapDollars: -32_000,
        lostAt: "Jan 16 06:40",
      },
      {
        id: "st2",
        name: "Shark Navigator Lift-Away",
        asin: "B0STK002",
        seller: "CIQ_Retail",
        gapDollars: -24_000,
        lostAt: "Jan 15 22:15",
      },
      {
        id: "st3",
        name: "Shark FlexBreeze Fan",
        asin: "B0STK003",
        seller: "CIQ_Retail",
        gapDollars: -18_000,
        lostAt: "Jan 15 13:28",
      },
      {
        id: "st4",
        name: "PowerA Enhanced Wired Controller",
        asin: "B0STK004",
        seller: "CIQ_Retail",
        gapDollars: -10_000,
        lostAt: "Jan 14 17:55",
      },
      {
        id: "st5",
        name: "PowerA Nano Enhanced Wireless",
        asin: "B0STK005",
        seller: "CIQ_Retail",
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

export const hierarchyTree: HierarchyNode = {
  id: "biz",
  name: "Entire Business",
  level: "business",
  gapDollars: -4_200_000,
  children: [
    {
      id: "shark",
      name: "Shark",
      level: "brand",
      gapDollars: -1_800_000,
      children: [
        {
          id: "fcr",
          name: "Floor Care Robotics",
          level: "category",
          gapDollars: -940_000,
        },
        {
          id: "fcc",
          name: "Floor Care Corded",
          level: "category",
          gapDollars: -380_000,
        },
        {
          id: "hair",
          name: "Hair Care",
          level: "category",
          gapDollars: 260_000,
        },
        {
          id: "air",
          name: "Air Treatment",
          level: "category",
          gapDollars: -120_000,
        },
      ],
    },
    {
      id: "powera",
      name: "PowerA",
      level: "brand",
      gapDollars: -2_800_000,
    },
    {
      id: "ninja",
      name: "Ninja",
      level: "brand",
      gapDollars: 400_000,
    },
  ],
};

export const sharkBrandInsight =
  "Shark is down $1.8M vs plan this week. Floor care robotics is the primary driver at −$940K, largely from Lost Buy Box on 12 SKUs. Hair care is above plan at +$260K and partially offsets the miss.";

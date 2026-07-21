import type { IssueKey } from "@/components/alerts/issue-names";

export type GapEntity = {
  name: string;
  gapDollars: number;
  gapUnits: number;
  targetDollars: number;
};

export type BrandInsight = GapEntity & {
  categories: GapEntity[];
};

export type AlertItem = {
  id: string;
  sku: string;
  title: string;
  category: "Sales" | "Operations" | "Marketing";
  issueKey: IssueKey;
  gapDollars: number;
  recommendation: string;
  detectedAt: string;
};

/**
 * Sort by Gap precedence from product_context:
 * 1) dollar Gap most negative first
 * 2) unit Gap most negative
 * 3) target ascending
 */
export function sortByGapImpact<T extends GapEntity>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.gapDollars !== b.gapDollars) return a.gapDollars - b.gapDollars;
    if (a.gapUnits !== b.gapUnits) return a.gapUnits - b.gapUnits;
    return a.targetDollars - b.targetDollars;
  });
}

export const overallBusinessGap = {
  gapDollars: -4_820_000,
  gapUnits: -18_400,
  targetDollars: 42_000_000,
};

export const brandInsights: BrandInsight[] = sortByGapImpact([
  {
    name: "Kitchen Appliances",
    gapDollars: -3_100_000,
    gapUnits: -9_200,
    targetDollars: 12_500_000,
    categories: sortByGapImpact([
      {
        name: "Blenders",
        gapDollars: -1_400_000,
        gapUnits: -4_100,
        targetDollars: 4_200_000,
      },
      {
        name: "Air Fryers",
        gapDollars: -980_000,
        gapUnits: -2_800,
        targetDollars: 3_600_000,
      },
      {
        name: "Coffee Makers",
        gapDollars: -720_000,
        gapUnits: -2_300,
        targetDollars: 4_700_000,
      },
    ]),
  },
  {
    name: "Home Cleaning",
    gapDollars: -1_120_000,
    gapUnits: -5_600,
    targetDollars: 8_400_000,
    categories: sortByGapImpact([
      {
        name: "Vacuums",
        gapDollars: -640_000,
        gapUnits: -2_100,
        targetDollars: 3_100_000,
      },
      {
        name: "Mops",
        gapDollars: -310_000,
        gapUnits: -2_000,
        targetDollars: 2_400_000,
      },
      {
        name: "Air Purifiers",
        gapDollars: -170_000,
        gapUnits: -1_500,
        targetDollars: 2_900_000,
      },
    ]),
  },
  {
    name: "Personal Care",
    gapDollars: -600_000,
    gapUnits: -3_600,
    targetDollars: 6_200_000,
    categories: sortByGapImpact([
      {
        name: "Hair Care",
        gapDollars: -280_000,
        gapUnits: -1_400,
        targetDollars: 2_200_000,
      },
      {
        name: "Skin Care",
        gapDollars: -210_000,
        gapUnits: -1_200,
        targetDollars: 2_500_000,
      },
      {
        name: "Oral Care",
        gapDollars: -110_000,
        gapUnits: -1_000,
        targetDollars: 1_500_000,
      },
    ]),
  },
]);

const mockAlertsUnsorted: AlertItem[] = [
  {
    id: "a1",
    sku: "B0KX-BLEND-PRO",
    title: "Lost Buy Box on top blender SKU",
    category: "Sales",
    issueKey: "lostBuyBox",
    gapDollars: -420_000,
    recommendation: "Restore Buy Box eligibility — check price and fulfillment.",
    detectedAt: "2h ago",
  },
  {
    id: "a2",
    sku: "B0AF-FRY-XL",
    title: "Predictive OOS on air fryer",
    category: "Operations",
    issueKey: "stockAvailability",
    gapDollars: -310_000,
    recommendation: "Expedite PO and suppress ads on at-risk ASIN.",
    detectedAt: "4h ago",
  },
  {
    id: "a3",
    sku: "B0KW-RANK-12",
    title: "Keyword rank drop on 12 high-volume terms",
    category: "Marketing",
    issueKey: "keywordRank",
    gapDollars: -280_000,
    recommendation: "Increase bids on converting keywords; review content.",
    detectedAt: "6h ago",
  },
  {
    id: "a4",
    sku: "B0VC-CONV-01",
    title: "Conversion drop after content change",
    category: "Sales",
    issueKey: "conversionDrop",
    gapDollars: -95_000,
    recommendation: "Roll back PDP image set and A+ module.",
    detectedAt: "1d ago",
  },
];

export const mockAlerts: AlertItem[] = [...mockAlertsUnsorted].sort(
  (a, b) => a.gapDollars - b.gapDollars,
);

export function formatGapDollars(value: number): string {
  const abs = Math.abs(value);
  const formatted =
    abs >= 1_000_000
      ? `$${(abs / 1_000_000).toFixed(1)}M`
      : abs >= 1_000
        ? `$${(abs / 1_000).toFixed(0)}K`
        : `$${abs.toLocaleString()}`;
  return value < 0 ? `−${formatted}` : formatted;
}

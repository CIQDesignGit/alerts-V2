import { ALERTS_LAST_CRAWL_RELATIVE } from "@/lib/mock-alerts-insights";

/** One saved PDP html/screenshot from a crawl */
export type PdpSnapshot = {
  id: string;
  /** e.g. "Today, 4:00 PM" — newest must match LastCrawlBadge clock */
  whenLabel: string;
  /** e.g. "2h ago" */
  relativeLabel: string;
  city: string;
  zip: string;
  /** Amazon PDP for this SKU’s crawl snapshot */
  href: string;
};

/** Fixed PDP for CleanPro Robot Vac R900 */
export const PDP_URL_ROBOT_VAC_R900 =
  "https://www.amazon.com/dp/B0H86MVFRC";

/** Fixed PDP for CleanPro Pro Upright */
export const PDP_URL_PRO_UPRIGHT =
  "https://www.amazon.com/dp/B0FMWXLDCW";

/** Pool for every other SKU — pick is stable per SKU name */
const PDP_URL_POOL = [
  "https://www.amazon.com/dp/B0H7R5YZ1V",
  "https://www.amazon.com/dp/B0HC3G6RS5",
  "https://www.amazon.com/dp/B0FMNPVWR1",
  "https://www.amazon.com/dp/B0GXNRTZVT",
] as const;

const FIXED_PDP_BY_SKU_NAME: Record<string, string> = {
  "CleanPro Robot Vac R900": PDP_URL_ROBOT_VAC_R900,
  "CleanPro Pro Upright": PDP_URL_PRO_UPRIGHT,
};

/** Stable 0…n-1 index from a string (same SKU → same URL every time). */
function stableIndex(seed: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % 997;
  }
  return hash % modulo;
}

/**
 * Amazon PDP URL for a SKU.
 * Two hero SKUs are fixed; others rotate through a small vacuum PDP pool.
 */
export function getPdpUrlForSku(skuName: string): string {
  const fixed = FIXED_PDP_BY_SKU_NAME[skuName];
  if (fixed) return fixed;
  return PDP_URL_POOL[stableIndex(skuName, PDP_URL_POOL.length)];
}

/** Crawl metadata only — href is filled per SKU via getPdpSnapshotsForSku */
const PDP_SNAPSHOT_ROWS: Omit<PdpSnapshot, "href">[] = [
  {
    id: "snap-1",
    whenLabel: "Today, 4:00 PM",
    relativeLabel: ALERTS_LAST_CRAWL_RELATIVE,
    city: "New York",
    zip: "10025",
  },
  {
    id: "snap-2",
    whenLabel: "Today, 10:00 AM",
    relativeLabel: "8h ago",
    city: "Boston",
    zip: "02116",
  },
  {
    id: "snap-3",
    whenLabel: "Today, 4:00 AM",
    relativeLabel: "14h ago",
    city: "Los Angeles",
    zip: "90012",
  },
  {
    id: "snap-4",
    whenLabel: "Yesterday, 10:00 PM",
    relativeLabel: "20h ago",
    city: "Los Angeles",
    zip: "90028",
  },
  {
    id: "snap-5",
    whenLabel: "Yesterday, 4:00 PM",
    relativeLabel: "26h ago",
    city: "Los Angeles",
    zip: "90028",
  },
  {
    id: "snap-6",
    whenLabel: "Yesterday, 10:00 AM",
    relativeLabel: "32h ago",
    city: "Chicago",
    zip: "60611",
  },
];

/**
 * Snapshot list for the PDP Snapshots popover.
 * Every row opens that SKU’s Amazon PDP (same product, different crawl times).
 */
export function getPdpSnapshotsForSku(skuName: string): PdpSnapshot[] {
  const href = getPdpUrlForSku(skuName);
  return PDP_SNAPSHOT_ROWS.map((row) => ({ ...row, href }));
}

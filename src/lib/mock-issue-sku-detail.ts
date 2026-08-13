import type { IssueKey } from "@/components/alerts/issue-names";
import { getIssueSkuChips } from "@/lib/ally-chipsets";
import {
  formatGapDollars,
  type AllyAiPrompt,
  type IssueSku,
} from "@/lib/mock-alerts-insights";

export type BuyBoxComparisonRow = {
  id: string;
  label: string;
  icon: "price" | "availability" | "ratings" | "winRate";
  brandValue: string;
  competitorValue: string;
  /** Star rating 0–5 when icon is ratings */
  brandRating?: number;
  competitorRating?: number;
  /** Win rate fraction e.g. 1/6 — rendered as link */
  brandWinRate?: string;
  competitorWinRate?: string;
  /** Crawl times when this side owned the Buy Box (winRate rows) */
  brandWinChecks?: BuyBoxWinCheckDay[];
  competitorWinChecks?: BuyBoxWinCheckDay[];
};

/** One PDP scrape when a seller held the Buy Box */
export type BuyBoxWinCheck = {
  time: string;
  relative: string;
};

/** Win checks grouped by calendar day for the crawl tooltip */
export type BuyBoxWinCheckDay = {
  date: string;
  checks: BuyBoxWinCheck[];
};

export type LostBuyBoxSkuDetail = {
  alertMessage: string;
  brandLabel: string;
  competitorLabel: string;
  competitorBadge: string;
  rows: BuyBoxComparisonRow[];
};

export type CouponTimelineRow = {
  id: string;
  relativeTime: string;
  absoluteTime: string;
  couponDetected: boolean;
  couponValues: string[];
};

export type CouponSkuDetail = {
  alertMessage: string;
  rows: CouponTimelineRow[];
};

/** Credit Offer — same timeline shape as Coupon, cashback amounts instead of coupon value */
export type CreditOfferTimelineRow = {
  id: string;
  relativeTime: string;
  absoluteTime: string;
  offerDetected: boolean;
  /** e.g. "$10 cashback", "$5 statement credit" */
  offerAmounts: string[];
};

export type CreditOfferSkuDetail = {
  alertMessage: string;
  rows: CreditOfferTimelineRow[];
};

export type PromoBadgeCheckRow = {
  id: string;
  label: string;
  /** true = pass (grey check), false = fail (red X) */
  ok: boolean;
};

export type PromoBadgeSkuDetail = {
  /** One-line summary above the checklist */
  summary: string;
  checks: PromoBadgeCheckRow[];
  /** Original/list price card — highlighted when incorrect */
  originalPrice: number;
  mrpPrice: number;
  originalCardError: boolean;
  sellingPrice: number;
};

export type DealPageReviewedLink = {
  id: string;
  label: string;
  /** Prototype placeholder — keep users on-page */
  href: string;
};

export type DealPageSkuDetail = {
  /** Lead copy above the status card */
  leadText: string;
  /** Deal category pages shown when hovering “deals page” */
  reviewedPages: DealPageReviewedLink[];
  statusHeadline: string;
  /** Short supporting lines under the headline (mock skeleton text) */
  supportLines: [string, string];
};

export type BestSellerRankSkuDetail = {
  /** Text before the bold category name */
  summaryBefore: string;
  /** Category name emphasized in the summary */
  category: string;
  previousRank: number;
  /** e.g. "3d avg" */
  previousAvgLabel: string;
  currentRank: number;
  /** e.g. "24h avg" */
  currentAvgLabel: string;
};

export type RatingReviewsSkuDetail = {
  /** Lead copy above the Old → New rating cards */
  summary: string;
  oldRating: number;
  newRating: number;
};

export type StockCrawlRow = {
  id: string;
  /** e.g. "Today, 4:30 AM" */
  whenLabel: string;
  inStock: boolean;
  location: string;
  zip: string;
};

export type StockAvailabilitySkuDetail = {
  /** One-line inventory / unavailability summary above the card */
  summary: string;
  statusLabel: string;
  location: string;
  zip: string;
  timestamp: string;
  oosCrawlCount: number;
  totalCrawls: number;
  /** How many crawls are listed by default (e.g. latest 6) */
  visibleCrawlCount: number;
  /** Purple “Show all N crawls” link label */
  showAllLabel: string;
  crawls: StockCrawlRow[];
};

export type ShippingMarketPoint = {
  id: string;
  city: string;
  days: number;
  /** 0–1 position along the 1–8 day bar */
  position: number;
  tier: "prime" | "standard";
  /** Stagger height above the bar */
  level: 1 | 2 | 3;
};

export type ShippingSpeedSkuDetail = {
  summary: string;
  avgDays: number;
  marketCount: number;
  daysAbovePrime: number;
  barMinDays: number;
  barMaxDays: number;
  /** Where the bar turns from ok → late (0–1) */
  dangerAt: number;
  markets: ShippingMarketPoint[];
};

export type SovChange = {
  from: number;
  to: number;
  deltaPct: number;
};

export type SponsoredSovSkuDetail = {
  /** One-line diagnosis above the SP/SB metric cards */
  summary: string;
  sp: SovChange & { competitorPct: number };
  sb: SovChange & { competitorPct: number };
  keywords: {
    id: string;
    keyword: string;
    sp: SovChange;
    sb: SovChange;
  }[];
};

export type KeywordRankCard = {
  id: string;
  keyword: string;
  thresholdBreached: boolean;
  rankFrom: number;
  rankTo: number;
  /** Highlight destination rank in red when threshold breached */
  emphasizeDrop: boolean;
};

export type KeywordRankSkuDetail = {
  summary: string;
  thresholdNote: string;
  cards: KeywordRankCard[];
};

export type MediaSpendKeywordRow = {
  id: string;
  keyword: string;
  importance: "High" | "Medium";
  sfr: number;
  last7Days: number;
  previousDelta: number;
  rankFrom: number;
  rankTo: number;
};

export type MediaSpendSkuDetail = {
  summaryLead: string;
  totalSpendLastWeek: string;
  totalSpendPreviousWeek: string;
  periodLabel: string;
  /** Short date under “Spend LW”, e.g. "Aug 4–10" */
  spendLwDates: string;
  /** Sub-label under “Spend Change”, e.g. "vs. Jul 28–Aug 3" */
  spendChangeVs: string;
  rows: MediaSpendKeywordRow[];
};

export type ConversionMetricCard = {
  id: string;
  title: string;
  from: string;
  to: string;
  /** e.g. "Drop magnitude:" / "Deviation:" */
  detailLabel: string;
  /** e.g. "-1.6pp" / "-1,841 (-19.5%)" */
  detailValue: string;
};

export type ConversionDropSkuDetail = {
  summary: string;
  cards: ConversionMetricCard[];
};

/** Stable hash from SKU id — keeps mock numbers different per SKU but stable. */
function skuSeed(sku: IssueSku): number {
  let hash = 0;
  for (let i = 0; i < sku.id.length; i += 1) {
    hash = (hash * 31 + sku.id.charCodeAt(i)) % 97;
  }
  return hash;
}

function gapLabel(sku: IssueSku): string {
  return formatGapDollars(sku.gapDollars);
}

/**
 * Recent scrape times (newest first) used to fill Buy Box Wins tooltips.
 * Count of returned checks matches the win numerator (e.g. 2 for 2/6).
 */
const BUY_BOX_CRAWL_POOL: Array<BuyBoxWinCheck & { date: string }> = [
  { date: "11 Aug 2026", time: "4:36 AM", relative: "6h ago" },
  { date: "11 Aug 2026", time: "2:30 AM", relative: "9h ago" },
  { date: "11 Aug 2026", time: "12:30 AM", relative: "11h ago" },
  { date: "10 Aug 2026", time: "10:59 PM", relative: "12h ago" },
  { date: "10 Aug 2026", time: "8:38 PM", relative: "14h ago" },
  { date: "10 Aug 2026", time: "6:30 PM", relative: "17h ago" },
  { date: "10 Aug 2026", time: "4:30 PM", relative: "19h ago" },
  { date: "10 Aug 2026", time: "2:30 PM", relative: "21h ago" },
  { date: "10 Aug 2026", time: "12:30 PM", relative: "23h ago" },
  { date: "10 Aug 2026", time: "8:31 AM", relative: "1d ago" },
  { date: "10 Aug 2026", time: "6:30 AM", relative: "1d ago" },
];

function buildBuyBoxWinCheckDays(
  winCount: number,
  side: "brand" | "competitor",
): BuyBoxWinCheckDay[] {
  // Competitor starts one slot later so the two tooltips don’t look identical
  const offset = side === "competitor" ? 1 : 0;
  const selected = BUY_BOX_CRAWL_POOL.slice(offset, offset + winCount);

  const byDate = new Map<string, BuyBoxWinCheck[]>();
  for (const entry of selected) {
    const day = byDate.get(entry.date) ?? [];
    day.push({ time: entry.time, relative: entry.relative });
    byDate.set(entry.date, day);
  }

  return [...byDate.entries()].map(([date, checks]) => ({ date, checks }));
}

/** Issue-scoped Ally prompts — Issue Type · SKU: L7D trends chip only. */
export function getIssueSkuPrompts(
  issueKey: IssueKey,
  _sku: IssueSku,
): AllyAiPrompt[] {
  return getIssueSkuChips(issueKey);
}

/** Lost Buy Box — brand vs latest winner comparison (issue aggregation SKU view). */
export function getLostBuyBoxSkuDetail(sku: IssueSku): LostBuyBoxSkuDetail {
  const competitor = sku.bbOwner ?? "Choice Electronics";
  const ourPrice = sku.ourPrice ?? 18.99;
  const theirPrice = sku.theirPrice ?? 17.49;
  const seed = skuSeed(sku);
  const ourWin = 1 + (seed % 3);
  const theirWin = 2 + (seed % 4);
  const brandRating = 3.0 + (seed % 10) / 10;
  const competitorRating = Math.min(5, brandRating + 0.6 + (seed % 5) / 10);

  return {
    alertMessage: "You've lost the Buy Box on an important SKU.",
    brandLabel: sku.brand || "Shark",
    competitorLabel: competitor,
    competitorBadge: "Latest Winner",
    rows: [
      {
        id: "price",
        label: "Price",
        icon: "price",
        brandValue: `$${ourPrice.toFixed(2)}`,
        competitorValue: `$${theirPrice.toFixed(2)}`,
      },
      {
        id: "availability",
        label: "Availability",
        icon: "availability",
        brandValue: "In Stock",
        competitorValue: "In Stock",
      },
      {
        id: "ratings",
        label: "Ratings",
        icon: "ratings",
        brandValue: brandRating.toFixed(1),
        competitorValue: competitorRating.toFixed(1),
        brandRating,
        competitorRating,
      },
      {
        id: "winRate",
        label: "Buy Box Win Rate",
        icon: "winRate",
        brandValue: `${ourWin}/6`,
        competitorValue: `${theirWin}/6`,
        brandWinRate: `${ourWin}/6`,
        competitorWinRate: `${theirWin}/6`,
        brandWinChecks: buildBuyBoxWinCheckDays(ourWin, "brand"),
        competitorWinChecks: buildBuyBoxWinCheckDays(theirWin, "competitor"),
      },
    ],
  };
}

/** Coupon — timeline of coupon detections (issue aggregation SKU view). */
export function getCouponSkuDetail(sku: IssueSku): CouponSkuDetail {
  const seed = skuSeed(sku);
  const couponAmount = (2 + (seed % 5) + 0.95).toFixed(2);

  return {
    alertMessage:
      "An active vendor-promoted coupon was detected on the Amazon product page for this SKU",
    rows: [
      {
        id: "t-3h",
        relativeTime: "3 hours ago",
        absoluteTime: "2:29 PM",
        couponDetected: true,
        couponValues: [
          `Apply $${couponAmount} coupon`,
          "Save 10%: Coupon available when you select Subscribe & Save",
        ],
      },
      {
        id: "t-6h",
        relativeTime: "6 hours ago",
        absoluteTime: "11:29 AM",
        couponDetected: true,
        couponValues: [`Apply $${couponAmount} coupon`],
      },
      {
        id: "t-9h",
        relativeTime: "9 hours ago",
        absoluteTime: "8:29 AM",
        couponDetected: false,
        couponValues: [],
      },
      {
        id: "t-12h",
        relativeTime: "12 hours ago",
        absoluteTime: "5:29 AM",
        couponDetected: true,
        couponValues: [`Apply ${10 + (seed % 10)}% coupon`],
      },
    ],
  };
}

/** Credit Offer — same as Coupon timeline, but cashback / credit amounts. */
export function getCreditOfferSkuDetail(sku: IssueSku): CreditOfferSkuDetail {
  const seed = skuSeed(sku);
  const cashback = 5 + (seed % 6) * 5; // $5, $10, … $30

  return {
    alertMessage:
      "An active credit offer was detected on the Amazon product page for this SKU",
    rows: [
      {
        id: "t-3h",
        relativeTime: "3 hours ago",
        absoluteTime: "2:29 PM",
        offerDetected: true,
        offerAmounts: [
          `$${cashback} cashback`,
          `$${Math.max(5, cashback - 5)} statement credit with store card`,
        ],
      },
      {
        id: "t-6h",
        relativeTime: "6 hours ago",
        absoluteTime: "11:29 AM",
        offerDetected: true,
        offerAmounts: [`$${cashback} cashback`],
      },
      {
        id: "t-9h",
        relativeTime: "9 hours ago",
        absoluteTime: "8:29 AM",
        offerDetected: false,
        offerAmounts: [],
      },
      {
        id: "t-12h",
        relativeTime: "12 hours ago",
        absoluteTime: "5:29 AM",
        offerDetected: true,
        offerAmounts: [`$${10 + (seed % 4) * 5} Amazon credit`],
      },
    ],
  };
}

/** Promo Badge — checklist + original/selling price cards. */
export function getPromoBadgeSkuDetail(sku: IssueSku): PromoBadgeSkuDetail {
  const seed = skuSeed(sku);
  const ourPrice = sku.ourPrice ?? 129.99;
  // Original is slightly lower than selling — drives “prices incorrect” fail state
  const originalPrice = Number((ourPrice - 2 - (seed % 3) * 0.5).toFixed(2));
  const mrpPrice = Number((ourPrice + 18 + (seed % 5)).toFixed(2));
  const sellingPrice = Number(ourPrice.toFixed(2));

  return {
    summary:
      "Your product is on discount from 2 Aug to 5 Sep, but there is some issue with the display.",
    checks: [
      { id: "badge-visible", label: "Promo Badge Visible?", ok: false },
      { id: "original-correct", label: "Original Price is Correct?", ok: false },
      { id: "selling-correct", label: "Selling Price is Correct?", ok: false },
      {
        id: "struck-through",
        label: "Original price is struck through?",
        ok: true,
      },
    ],
    originalPrice,
    mrpPrice,
    originalCardError: true,
    sellingPrice,
  };
}

/** Deal Page Visibility — missing-status card (issue aggregation SKU view). */
export function getDealPageSkuDetail(sku: IssueSku): DealPageSkuDetail {
  return {
    leadText:
      "Despite ongoing offer on this product, it is not showing up on the deals page",
    reviewedPages: [
      { id: "small-appliances", label: "Small Appliances", href: "#" },
      { id: "hair-care", label: "Hair Care", href: "#" },
      { id: "toys-games", label: "Toys & Games", href: "#" },
      {
        id: "heating-cooling",
        label: "Heating, Cooling & Air Quality",
        href: "#",
      },
      {
        id: "vacuums-floor",
        label: "Vacuums & Floor Care",
        href: "#",
      },
      {
        id: "carpet-upholstery",
        label: "Carpet & Upholstery Cleaners & Accessories",
        href: "#",
      },
      { id: "kitchen-dining", label: "Kitchen & Dining", href: "#" },
    ],
    statusHeadline: "Your SKU is missing",
    supportLines: [sku.name, sku.asin],
  };
}

/** Best Seller Rank — previous vs current rank shields. */
export function getBestSellerRankSkuDetail(
  sku: IssueSku,
): BestSellerRankSkuDetail {
  const seed = skuSeed(sku);
  const previousRank = 3 + (seed % 4); // 3–6
  const currentRank = previousRank + 2 + (seed % 3); // dropped further
  const category = sku.category || "Ice Cream Machines";

  return {
    summaryBefore: "Your product's rank has dropped in ",
    category,
    previousRank,
    previousAvgLabel: "3d avg",
    currentRank,
    currentAvgLabel: "24h avg",
  };
}

/** Rating Dropped — Old → New star rating cards. */
export function getRatingReviewsSkuDetail(
  _sku: IssueSku,
): RatingReviewsSkuDetail {
  return {
    summary: "Your product's rating has dropped.",
    oldRating: 4.2,
    newRating: 4,
  };
}

/** Stock Availability — OOS stamp card + crawl timeline. */
export function getStockAvailabilitySkuDetail(
  _sku: IssueSku,
): StockAvailabilitySkuDetail {
  return {
    summary:
      "24 units on hand. 76% page unavailability. 0% rep OOS. Listing issue — not inventory.",
    statusLabel: "Currently unavailable",
    location: "Los Angeles",
    zip: "90028",
    timestamp: "Today, 4:30 AM",
    oosCrawlCount: 5,
    totalCrawls: 12,
    visibleCrawlCount: 6,
    showAllLabel: "Show all 11 crawls",
    crawls: [
      {
        id: "c1",
        whenLabel: "Today, 4:30 AM",
        inStock: false,
        location: "Los Angeles",
        zip: "90028",
      },
      {
        id: "c2",
        whenLabel: "Today, 2:31 AM",
        inStock: false,
        location: "New York",
        zip: "10019",
      },
      {
        id: "c3",
        whenLabel: "Today, 12:30 AM",
        inStock: false,
        location: "Chicago",
        zip: "60601",
      },
      {
        id: "c4",
        whenLabel: "Yesterday, 10:30 PM",
        inStock: false,
        location: "Seattle",
        zip: "98115",
      },
      {
        id: "c5",
        whenLabel: "Yesterday, 8:30 PM",
        inStock: false,
        location: "Los Angeles",
        zip: "90012",
      },
      {
        id: "c6",
        whenLabel: "Yesterday, 6:58 PM",
        inStock: false,
        location: "Chicago",
        zip: "60614",
      },
    ],
  };
}

/** Shipping Speed — avg delivery + market timeline. */
export function getShippingSpeedSkuDetail(
  sku: IssueSku,
): ShippingSpeedSkuDetail {
  const seed = skuSeed(sku);
  const avgDays = Number((3.8 + (seed % 8) / 10).toFixed(1));
  const daysAbovePrime = Number((avgDays - 2).toFixed(1));
  const marketCount = 5;

  return {
    summary:
      "Prime avg 1.1 days, Standard avg 5.0 days across 8 ZIP(s). Prime is 3.9 days faster.",
    avgDays,
    marketCount,
    daysAbovePrime,
    barMinDays: 0,
    barMaxDays: 8,
    // Blue→red split sits at 2 days on the 0–8 day bar
    dangerAt: 2 / 8,
    markets: [
      {
        id: "ny",
        city: "New York, NY",
        days: 2,
        position: (2 - 1) / 7,
        tier: "prime",
        level: 3,
      },
      {
        id: "chi",
        city: "Chicago, IL",
        days: 3,
        position: (3 - 1) / 7,
        tier: "prime",
        level: 1,
      },
      {
        id: "aus",
        city: "Austin, TX",
        days: 4,
        position: (4 - 1) / 7,
        tier: "prime",
        level: 2,
      },
      {
        id: "sa",
        city: "San Antonio, TX",
        days: 7,
        position: (6.6 - 1) / 7,
        tier: "standard",
        level: 3,
      },
      {
        id: "tah",
        city: "Tahoe, CA",
        days: 7,
        position: (7.35 - 1) / 7,
        tier: "standard",
        level: 1,
      },
    ],
  };
}

/** Sponsored Share of Voice — SP/SB cards + keyword table. */
export function getSponsoredSovSkuDetail(sku: IssueSku): SponsoredSovSkuDetail {
  const seed = skuSeed(sku);
  const brand = sku.brand || "Shark";
  return {
    summary:
      "Competitor ads detected on branded keywords resulting in a drop in SoV.",
    sp: { from: 5, to: 4, deltaPct: -20, competitorPct: 6 },
    sb: { from: 2.5, to: 2, deltaPct: -20, competitorPct: 6 },
    keywords: [
      {
        id: "k1",
        keyword: `${brand} Cordless Vacuum`,
        sp: { from: 11.4, to: 9.5, deltaPct: -17 },
        sb: { from: 11.4, to: 9.5, deltaPct: -17 },
      },
      {
        id: "k2",
        keyword: `${brand} Vacuum`,
        sp: { from: 16.3, to: 11.5, deltaPct: -29 },
        sb: { from: 16.3, to: 11.5, deltaPct: -29 },
      },
      {
        id: "k3",
        keyword: `${brand} Stick Vacuum`,
        sp: { from: 15.2, to: 11.3, deltaPct: -26 },
        sb: { from: 15.2, to: 11.3, deltaPct: -26 },
      },
      {
        id: "k4",
        keyword: `${brand} Pro cordless stick Vacuum`,
        sp: { from: 11, to: 7.8, deltaPct: -29 },
        sb: { from: 11, to: 7.8, deltaPct: -29 },
      },
      {
        id: "k5",
        keyword: `${brand} NX23 Vacuum`,
        sp: { from: 9, to: 6.4, deltaPct: -29 },
        sb: { from: 9, to: 6.4, deltaPct: -29 },
      },
    ].map((row, index) =>
      index === seed % 5
        ? {
            ...row,
            sp: {
              ...row.sp,
              to: Number((row.sp.to - 0.3).toFixed(1)),
            },
          }
        : row,
    ),
  };
}

/** Keyword Rank — drop cards with threshold callout. */
export function getKeywordRankSkuDetail(sku: IssueSku): KeywordRankSkuDetail {
  void sku;
  return {
    summary:
      "Your rank for some paid keywords has changed.",
    thresholdNote:
      "Threshold Breached: Organic keyword rank crossed the defined threshold of 5 ranks.",
    cards: [
      {
        id: "kw1",
        keyword: "food processor 8 cup",
        thresholdBreached: true,
        rankFrom: 3,
        rankTo: 9,
        emphasizeDrop: true,
      },
      {
        id: "kw2",
        keyword: "digital food processor",
        thresholdBreached: false,
        rankFrom: 8,
        rankTo: 12,
        emphasizeDrop: false,
      },
      {
        id: "kw3",
        keyword: "food chopper electric",
        thresholdBreached: false,
        rankFrom: 12,
        rankTo: 15,
        emphasizeDrop: false,
      },
    ],
  };
}

/** Media Spend — top contributing keywords table. */
export function getMediaSpendSkuDetail(sku: IssueSku): MediaSpendSkuDetail {
  void sku;
  return {
    summaryLead:
      "Spend cut on all top keywords last week. Total keyword spend (all KWs):",
    totalSpendLastWeek: "$0",
    totalSpendPreviousWeek: "$0",
    periodLabel: "Last week (Aug 4–10)",
    spendLwDates: "Aug 4–10",
    spendChangeVs: "vs. Jul 28–Aug 3",
    rows: [
      {
        id: "m1",
        keyword: "vacuum cleaners for home",
        importance: "High",
        sfr: 842,
        last7Days: 3100,
        previousDelta: -1720,
        rankFrom: 8,
        rankTo: 14,
      },
      {
        id: "m2",
        keyword: "robot vacuum cleaner",
        importance: "High",
        sfr: 1240,
        last7Days: 0,
        previousDelta: -12.4,
        rankFrom: 5,
        rankTo: 11,
      },
      {
        id: "m3",
        keyword: "cordless stick vacuum",
        importance: "Medium",
        sfr: 3450,
        last7Days: 3.2,
        previousDelta: -15.7,
        rankFrom: 12,
        rankTo: 10,
      },
      {
        id: "m4",
        keyword: "shark cordless vacuum",
        importance: "High",
        sfr: 2100,
        last7Days: 890,
        previousDelta: -420,
        rankFrom: 4,
        rankTo: 9,
      },
      {
        id: "m5",
        keyword: "upright vacuum",
        importance: "Medium",
        sfr: 5890,
        last7Days: 1780,
        previousDelta: -670,
        rankFrom: 18,
        rankTo: 16,
      },
      {
        id: "m6",
        keyword: "robot vacuum for pet hair",
        importance: "Medium",
        sfr: 4200,
        last7Days: 240,
        previousDelta: -95,
        rankFrom: 15,
        rankTo: 13,
      },
    ],
  };
}

/** Conversion Drop — conversion + glance views cards. */
export function getConversionDropSkuDetail(
  sku: IssueSku,
): ConversionDropSkuDetail {
  void sku;

  return {
    summary:
      "Conversion rate is declining faster than the 7-day baseline. Monitor PDP and pricing — may worsen if unchecked.",
    cards: [
      {
        id: "conversion",
        title: "Conversion Drop",
        from: "3.0%",
        to: "1.5%",
        detailLabel: "Drop magnitude:",
        detailValue: "-1.6pp",
      },
      {
        id: "glance",
        title: "Glance Views",
        from: "9,452",
        to: "7,611",
        detailLabel: "Deviation:",
        detailValue: "-1,841 (-19.5%)",
      },
    ],
  };
}

export const ISSUE_SKU_DETAIL_KEYS = new Set<IssueKey>([
  "lostBuyBox",
  "coupon",
  "creditOffer",
  "promoBadge",
  "dealPageVisibility",
  "bestSellerRank",
  "ratingReviews",
  "stockAvailability",
  "shippingSpeed",
  "sponsoredSov",
  "keywordRank",
  "mediaSpend",
  "conversionDrop",
]);

export function hasIssueSkuDetail(issueKey: IssueKey): boolean {
  return ISSUE_SKU_DETAIL_KEYS.has(issueKey);
}

import type { IssueKey } from "@/components/alerts/issue-names";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";
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
  checks: PromoBadgeCheckRow[];
  /** Original/list price card — highlighted when incorrect */
  originalPrice: number;
  mrpPrice: number;
  originalCardError: boolean;
  sellingPrice: number;
};

export type DealPageSkuDetail = {
  /** Lead copy above the status card */
  leadText: string;
  /** Tooltip for “deals page” helper */
  tooltip: string;
  statusHeadline: string;
  /** Short supporting lines under the headline (mock skeleton text) */
  supportLines: [string, string];
};

export type BestSellerRankMetricRow = {
  id: string;
  label: string;
  value: string;
};

export type BestSellerRankSkuDetail = {
  rows: BestSellerRankMetricRow[];
};

export type RatingReviewsRow = {
  id: string;
  label: string;
  icon: "rating" | "reviews" | "velocity" | "sentiment";
  brandValue: string;
  competitorValue: string;
  brandRating?: number;
  competitorRating?: number;
};

export type RatingReviewsSkuDetail = {
  alertMessage: string;
  brandLabel: string;
  competitorLabel: string;
  rows: RatingReviewsRow[];
};

export type StockCrawlRow = {
  id: string;
  relativeTime: string;
  absoluteTime: string;
  inStock: boolean;
  location: string;
  zip: string;
};

export type StockAvailabilitySkuDetail = {
  statusLabel: string;
  location: string;
  zip: string;
  timestamp: string;
  oosCrawlCount: number;
  totalCrawls: number;
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
  organicFrom: number;
  organicTo: number;
  paidFrom?: number;
  paidTo?: number;
  /** Highlight destination ranks in red when threshold breached */
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
  periodLabel: string;
  previousPeriodLabel: string;
  rows: MediaSpendKeywordRow[];
};

export type ConversionMetricCard = {
  id: string;
  title: string;
  from: string;
  to: string;
  changeLabel: string;
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

/** Issue-scoped Ally prompts — talk about this one issue, not the full SKU checklist. */
export function getIssueSkuPrompts(
  issueKey: IssueKey,
  sku: IssueSku,
): AllyAiPrompt[] {
  const issueName = ISSUE_NAMES[issueKey].filter;
  const gap = gapLabel(sku);

  return [
    {
      id: `${issueKey}-trend`,
      label: `How has ${issueName} changed in 7 days?`,
      prompt: `Summarize how ${issueName} evolved for ${sku.name} over the last 7 days and what changed most recently.`,
    },
    {
      id: `${issueKey}-why`,
      label: `Why is ${sku.name} flagged for ${issueName}?`,
      prompt: `Explain why ${sku.name} (${sku.asin}) is flagged for ${issueName} and what is driving the ${gap} gap.`,
    },
    {
      id: `${issueKey}-fix`,
      label: `Fastest fix for ${issueName} on this SKU?`,
      prompt: `Recommend the highest-ROI 24-hour fix for ${issueName} on ${sku.name}.`,
    },
  ];
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
    alertMessage: `${sku.name} lost the Buy Box on the latest scrape — ${gapLabel(sku)} at risk.`,
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
      },
    ],
  };
}

/** Coupon — timeline of coupon detections (issue aggregation SKU view). */
export function getCouponSkuDetail(sku: IssueSku): CouponSkuDetail {
  const seed = skuSeed(sku);
  const couponAmount = (2 + (seed % 5) + 0.95).toFixed(2);

  return {
    alertMessage: `Coupon activity on ${sku.name} is shifting Buy Box ownership — ${gapLabel(sku)} at risk.`,
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
    alertMessage: `Credit offer activity on ${sku.name} is lowering effective price vs Buy Box — ${gapLabel(sku)} at risk.`,
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
    tooltip:
      "Deals page is the retailer merchandising surface where Lightning Deals and Best Deals appear. Your SKU has an active offer but is not listed there.",
    statusHeadline: "Your SKU is missing",
    supportLines: [sku.name, sku.asin],
  };
}

/** Best Seller Rank — L7D key/value metrics card. */
export function getBestSellerRankSkuDetail(
  sku: IssueSku,
): BestSellerRankSkuDetail {
  const seed = skuSeed(sku);
  const current = 80 + (seed % 40);
  const highest = Math.max(10, current - 50 - (seed % 20));
  const lowest = current + 5 + (seed % 25);
  const median = Math.round((highest + lowest) / 2) - (seed % 10);
  const category = sku.category || "Appliances";

  return {
    rows: [
      { id: "category", label: "BSR Category", value: category },
      {
        id: "median",
        label: "Median Category Rank (L7D)",
        value: `#${median}`,
      },
      {
        id: "highest",
        label: "Highest Rank (L7D)",
        value: `#${highest}`,
      },
      {
        id: "lowest",
        label: "Lowest Rank (L7D)",
        value: `#${lowest}`,
      },
      {
        id: "current",
        label: "Current BSR",
        value: `#${current}`,
      },
    ],
  };
}

/** Rating & Reviews — brand vs competitor snapshot. */
export function getRatingReviewsSkuDetail(
  sku: IssueSku,
): RatingReviewsSkuDetail {
  const seed = skuSeed(sku);
  const competitor = sku.bbOwner ?? "Dyson";
  const brandRating = 3.4 + (seed % 8) / 10;
  const competitorRating = Math.min(5, brandRating + 0.5 + (seed % 4) / 10);
  const brandReviews = 800 + seed * 12;
  const competitorReviews = brandReviews + 400 + seed * 5;
  const brandVelocity = Math.max(1, 4 - (seed % 4));
  const competitorVelocity = brandVelocity + 3 + (seed % 3);

  return {
    alertMessage: `${sku.name} rating & review signals are underperforming peers — ${gapLabel(sku)} at risk.`,
    brandLabel: sku.brand || "Shark",
    competitorLabel: competitor,
    rows: [
      {
        id: "rating",
        label: "Star rating",
        icon: "rating",
        brandValue: brandRating.toFixed(1),
        competitorValue: competitorRating.toFixed(1),
        brandRating,
        competitorRating,
      },
      {
        id: "reviews",
        label: "Total reviews",
        icon: "reviews",
        brandValue: brandReviews.toLocaleString(),
        competitorValue: competitorReviews.toLocaleString(),
      },
      {
        id: "velocity",
        label: "New reviews (7d)",
        icon: "velocity",
        brandValue: String(brandVelocity),
        competitorValue: String(competitorVelocity),
      },
      {
        id: "sentiment",
        label: "Recent sentiment",
        icon: "sentiment",
        brandValue: seed % 2 === 0 ? "Mixed" : "Declining",
        competitorValue: "Positive",
      },
    ],
  };
}

/** Stock Availability — OOS stamp + crawl timeline. */
export function getStockAvailabilitySkuDetail(
  sku: IssueSku,
): StockAvailabilitySkuDetail {
  const seed = skuSeed(sku);
  return {
    statusLabel: "Currently unavailable",
    location: "New York",
    zip: "10001",
    timestamp: "4h ago · 1:09 PM",
    oosCrawlCount: 18 + (seed % 5),
    totalCrawls: 24,
    crawls: [
      {
        id: "c1",
        relativeTime: "4h ago",
        absoluteTime: "1:09 PM",
        inStock: false,
        location: "New York",
        zip: "10001",
      },
      {
        id: "c2",
        relativeTime: "9h ago",
        absoluteTime: "7:39 AM",
        inStock: false,
        location: "New York",
        zip: "10001",
      },
      {
        id: "c3",
        relativeTime: "15h ago",
        absoluteTime: "1:39 AM",
        inStock: false,
        location: "Beverly Hills",
        zip: "90210",
      },
      {
        id: "c4",
        relativeTime: "21h ago",
        absoluteTime: "7:39 PM",
        inStock: true,
        location: "Chicago",
        zip: "60601",
      },
      {
        id: "c5",
        relativeTime: "Yesterday",
        absoluteTime: "3:39 AM",
        inStock: false,
        location: "Houston",
        zip: "77001",
      },
      {
        id: "c6",
        relativeTime: "Aug 3",
        absoluteTime: "3:39 PM",
        inStock: true,
        location: "Atlanta",
        zip: "30301",
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
    summary: `Delivery is averaging ${avgDays} days across ${marketCount} markets — ${daysAbovePrime} days slower than standard Prime.`,
    avgDays,
    marketCount,
    daysAbovePrime,
    barMinDays: 1,
    barMaxDays: 8,
    dangerAt: (5.5 - 1) / (8 - 1),
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
      "Top keywords dropped 6–8 positions after a content update, pushing off page 1 for high-volume terms.",
    thresholdNote:
      "Threshold Breached: Organic keyword rank crossed the defined threshold of 5 ranks.",
    cards: [
      {
        id: "kw1",
        keyword: "food processor 8 cup",
        thresholdBreached: true,
        organicFrom: 3,
        organicTo: 9,
        paidFrom: 5,
        paidTo: 11,
        emphasizeDrop: true,
      },
      {
        id: "kw2",
        keyword: "digital food processor",
        thresholdBreached: false,
        organicFrom: 8,
        organicTo: 12,
        paidFrom: 10,
        paidTo: 14,
        emphasizeDrop: false,
      },
      {
        id: "kw3",
        keyword: "food chopper electric",
        thresholdBreached: false,
        organicFrom: 12,
        organicTo: 15,
        emphasizeDrop: false,
      },
    ],
  };
}

/** Media Spend — top contributing keywords table. */
export function getMediaSpendSkuDetail(sku: IssueSku): MediaSpendSkuDetail {
  void sku;
  return {
    periodLabel: "Last 7 Days (May 3–9)",
    previousPeriodLabel: "Previous 7 Days (Apr 26–May 2)",
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
  const seed = skuSeed(sku);
  const fromConv = 5.1;
  const toConv = Number((4.5 - (seed % 3) * 0.1).toFixed(1));
  const delta =
    (((toConv - fromConv) / fromConv) * 100).toFixed(1);

  return {
    summary:
      "Conversion rate is declining faster than the 7-day baseline. Monitor PDP and pricing — may worsen if unchecked.",
    cards: [
      {
        id: "conversion",
        title: "Conversion Drop",
        from: `${fromConv}%`,
        to: `${toConv}%`,
        changeLabel: `(${delta}%)`,
      },
      {
        id: "glance",
        title: "Glance Views",
        from: "12,480",
        to: "12,340",
        changeLabel: "(-1.1%)",
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

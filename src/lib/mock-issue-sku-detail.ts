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
  /** Win rate fraction e.g. 1/4 — rendered as link */
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

/** One recent crawl check in the Buy Box Comparison table — who held the Buy Box, where, and when. */
export type BuyBoxCrawlRow = {
  id: string;
  /** e.g. "Today, 10:30 AM" */
  whenLabel: string;
  location: string;
  zip: string;
  /** true = brand held the Buy Box at this crawl, false = competitor did */
  brandWon: boolean;
};

export type LostBuyBoxSkuDetail = {
  alertMessage: string;
  brandLabel: string;
  competitorLabel: string;
  competitorBadge: string;
  rows: BuyBoxComparisonRow[];
  /** Most recent 6 crawls — same window as the Buy Box Win Rate fractions above */
  crawlRows: BuyBoxCrawlRow[];
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

export type DealPageOption = {
  id: string;
  label: string;
  lastSeenDay: number;
  lastSeenTime: string;
  lastSeenRelative: string;
  topProducts: DealPageTopProduct[];
};

export type DealPageTopProduct = {
  rank: number;
  name: string;
  brand: string;
};

export type DealPageSkuDetail = {
  /** Lead copy above the deal window */
  leadText: string;
  /** First-fold pages listed from the “deals page” link in the lead */
  reviewedPages: DealPageReviewedLink[];
  /** Deals pages checked for this SKU. Dates and top 10 follow the selected page. */
  pages: DealPageOption[];
  /** Page shown before the user picks another one */
  defaultPageId: string;
  /** Promotion name shown on the deal card */
  dealType: string;
  /** August day numbers for the deal window (prototype crawl month). */
  startDay: number;
  endDay: number;
  nowDay: number;
  lastSeenDay: number;
  /** Clock time only, e.g. "8:12 AM" */
  lastSeenTime: string;
  /** e.g. "1 day ago" */
  lastSeenRelative: string;
  /** Deals page the top-10 list was read from */
  dealsPageLabel: string;
  topProducts: DealPageTopProduct[];
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
  /** e.g. "Today, 4:00 PM" — newest matches LastCrawlBadge */
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

export type KeywordRankMetricTone = "drop" | "stable";

export type KeywordRankMetric = {
  id: string;
  label: string;
  from: string;
  to: string;
  /** Signed change only — no comparison window or IQR note */
  delta: string;
  tone: KeywordRankMetricTone;
};

export type KeywordRankPlacement = {
  channel: "Organic" | "SP";
  /** Null when the SKU has no placement on this channel */
  from: number | null;
  to: number | null;
  emptyLabel?: string;
  /** Full competing SKU name — shown ahead of the ASIN */
  competitorName?: string;
  competitorAsin?: string;
  competitorFrom?: number;
  competitorTo?: number;
};

export type KeywordRankLostKeyword = {
  id: string;
  keyword: string;
  placements: KeywordRankPlacement[];
};

export type KeywordRankSkuDetail = {
  /** One line above the metrics — same role as other issue summaries */
  summary: string;
  metrics: KeywordRankMetric[];
  keywordsTitle: string;
  keywordsMeta: string;
  keywords: KeywordRankLostKeyword[];
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
  /** Short date under “Spend LW”, e.g. "Aug 9–15" */
  spendLwDates: string;
  /** Sub-label under “Spend Change”, e.g. "vs. Aug 2–8" */
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

/** Crawl window for Lost Buy Box win-rate fractions (X/4) and comparison timeline. */
const BUY_BOX_CRAWL_COUNT = 4;

/**
 * Recent scrape times (newest first) used to fill Buy Box Wins tooltips.
 * Count of returned checks matches the win numerator (e.g. 2 for 2/4).
 */
const BUY_BOX_CRAWL_POOL: Array<BuyBoxWinCheck & { date: string }> = [
  { date: "21 Aug 2026", time: "4:36 AM", relative: "6h ago" },
  { date: "21 Aug 2026", time: "2:30 AM", relative: "9h ago" },
  { date: "21 Aug 2026", time: "12:30 AM", relative: "11h ago" },
  { date: "20 Aug 2026", time: "10:59 PM", relative: "12h ago" },
  { date: "20 Aug 2026", time: "8:38 PM", relative: "14h ago" },
  { date: "20 Aug 2026", time: "6:30 PM", relative: "17h ago" },
  { date: "20 Aug 2026", time: "4:30 PM", relative: "19h ago" },
  { date: "20 Aug 2026", time: "2:30 PM", relative: "21h ago" },
  { date: "20 Aug 2026", time: "12:30 PM", relative: "23h ago" },
  { date: "20 Aug 2026", time: "8:31 AM", relative: "1d ago" },
  { date: "20 Aug 2026", time: "6:30 AM", relative: "1d ago" },
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

/** Crawl locations cycled behind the Buy Box comparison timeline (zips reused from other mock crawl data) */
const BUY_BOX_CRAWL_LOCATIONS: Array<{ city: string; zip: string }> = [
  { city: "New York", zip: "10019" },
  { city: "Chicago", zip: "60601" },
  { city: "Austin", zip: "78701" },
  { city: "Seattle", zip: "98115" },
  { city: "Los Angeles", zip: "90028" },
];

/**
 * Most recent crawls (same window as the "X/4" Win Rate fractions) with who held the
 * Buy Box at each check. Deterministic per SKU so the winner order varies but stays stable.
 */
function buildBuyBoxCrawlRows(seed: number, ourWin: number): BuyBoxCrawlRow[] {
  const entries = BUY_BOX_CRAWL_POOL.slice(0, BUY_BOX_CRAWL_COUNT);
  const order = entries
    .map((_, index) => index)
    .sort(
      (a, b) =>
        ((a + seed) % BUY_BOX_CRAWL_COUNT) - ((b + seed) % BUY_BOX_CRAWL_COUNT),
    );
  const brandWonAt = new Set(order.slice(0, ourWin));

  return entries.map((entry, index) => {
    const place =
      BUY_BOX_CRAWL_LOCATIONS[(seed + index) % BUY_BOX_CRAWL_LOCATIONS.length];
    return {
      id: `bb-crawl-${index}`,
      whenLabel: `${entry.date === "21 Aug 2026" ? "Today" : "Yesterday"}, ${entry.time}`,
      location: place.city,
      zip: place.zip,
      brandWon: brandWonAt.has(index),
    };
  });
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
  // Tied to ourWin (out of the same 4 crawls below) so the two fractions always add up to 4
  const theirWin = BUY_BOX_CRAWL_COUNT - ourWin;
  const brandRating = 3.0 + (seed % 10) / 10;
  const competitorRating = Math.min(5, brandRating + 0.6 + (seed % 5) / 10);

  return {
    alertMessage: "You've lost the Buy Box on an important SKU.",
    brandLabel: sku.brand || "CleanPro",
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
        brandValue: `${ourWin}/${BUY_BOX_CRAWL_COUNT}`,
        competitorValue: `${theirWin}/${BUY_BOX_CRAWL_COUNT}`,
        brandWinRate: `${ourWin}/${BUY_BOX_CRAWL_COUNT}`,
        competitorWinRate: `${theirWin}/${BUY_BOX_CRAWL_COUNT}`,
        brandWinChecks: buildBuyBoxWinCheckDays(ourWin, "brand"),
        competitorWinChecks: buildBuyBoxWinCheckDays(theirWin, "competitor"),
      },
    ],
    crawlRows: buildBuyBoxCrawlRows(seed, ourWin),
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
      "Your product is on discount from 9 Aug to 5 Sep, but there is some issue with the display.",
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

/** Prototype “today” matches the Aug 21 crawl window used by other issues. */
const DEAL_NOW_DAY = 21;
const DEAL_START_DAY = 14;
const DEAL_END_DAY = 26;

const FLOOR_CARE_TOP_PRODUCTS: Array<Omit<DealPageTopProduct, "rank">> = [
  { name: "VacuMax Cordless Pro", brand: "VacuMax" },
  { name: "ShineHome Robot S2", brand: "ShineHome" },
  { name: "FloorLite Stick Vac", brand: "FloorLite" },
  { name: "DustAway Auto-Empty", brand: "DustAway" },
  { name: "PureSweep Upright", brand: "PureSweep" },
  { name: "NovaVac Mini", brand: "NovaVac" },
  { name: "BrightPath Carpet Cleaner", brand: "BrightPath" },
  { name: "HomeGlide Robot", brand: "HomeGlide" },
  { name: "SwiftBrush Cordless", brand: "SwiftBrush" },
  { name: "AirLift Canister", brand: "AirLift" },
];

const KITCHEN_TOP_PRODUCTS: Array<Omit<DealPageTopProduct, "rank">> = [
  { name: "ChefPan Nonstick 10pc", brand: "ChefPan" },
  { name: "HeatWell MultiCooker", brand: "HeatWell" },
  { name: "CrispBox Dual Air Fryer", brand: "CrispBox" },
  { name: "BakeRight Dutch Oven", brand: "BakeRight" },
  { name: "SlicePro Knife Set", brand: "SlicePro" },
  { name: "SteamKettle Glass", brand: "SteamKettle" },
  { name: "MixWell Stand Mixer", brand: "MixWell" },
  { name: "GrillPlate Indoor", brand: "GrillPlate" },
  { name: "FreshKeep Container Set", brand: "FreshKeep" },
  { name: "PourEase Oil Dispenser", brand: "PourEase" },
];

/** Shared catalog so each deals page can show a different top 10. */
const DEAL_PAGE_CATALOG: Array<Omit<DealPageTopProduct, "rank">> = [
  ...FLOOR_CARE_TOP_PRODUCTS,
  ...KITCHEN_TOP_PRODUCTS,
];

const DEAL_PAGE_DEFS: Array<{ id: string; label: string }> = [
  { id: "small-appliances", label: "Small Appliances" },
  { id: "hair-care", label: "Hair Care" },
  { id: "toys-games", label: "Toys & Games" },
  { id: "heating-cooling", label: "Heating, Cooling & Air Quality" },
  { id: "vacuums-floor", label: "Vacuums & Floor Care" },
  {
    id: "carpet-upholstery",
    label: "Carpet & Upholstery Cleaners & Accessories",
  },
  { id: "kitchen-dining", label: "Kitchen & Dining" },
];

const REVIEWED_DEAL_PAGES: DealPageReviewedLink[] = DEAL_PAGE_DEFS.map(
  (page) => ({ ...page, href: "#" }),
);

function productsForPage(start: number): DealPageTopProduct[] {
  return rankedProducts(
    Array.from({ length: 10 }, (_, index) => {
      const item = DEAL_PAGE_CATALOG[(start + index) % DEAL_PAGE_CATALOG.length];
      return item ?? DEAL_PAGE_CATALOG[0]!;
    }),
  );
}

function formatLastSeen(lostAt: string | undefined): {
  day: number;
  time: string;
} {
  const match = lostAt?.match(/Aug\s+(\d+)\s+(\d{1,2}):(\d{2})/);
  if (!match) return { day: 20, time: "11:05 AM" };

  const day = Number(match[1]);
  let hour = Number(match[2]);
  const minutes = match[3];
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return { day, time: `${hour}:${minutes} ${suffix}` };
}

function lastSeenRelative(day: number): string {
  const diff = DEAL_NOW_DAY - day;
  if (diff <= 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

function rankedProducts(
  products: Array<Omit<DealPageTopProduct, "rank">>,
): DealPageTopProduct[] {
  return products.map((product, index) => ({ ...product, rank: index + 1 }));
}

/** Deal Page Visibility — deal window + who else is on the page. */
export function getDealPageSkuDetail(sku: IssueSku): DealPageSkuDetail {
  const lastSeen = formatLastSeen(sku.lostAt);
  const seenDay = Math.min(
    Math.max(lastSeen.day, DEAL_START_DAY),
    DEAL_NOW_DAY,
  );
  const kitchen = sku.category.toLowerCase().includes("kitchen");
  const defaultPageId = kitchen ? "kitchen-dining" : "vacuums-floor";
  const pages: DealPageOption[] = DEAL_PAGE_DEFS.map((page, index) => {
    const day = Math.min(
      DEAL_NOW_DAY,
      Math.max(DEAL_START_DAY, seenDay - index),
    );
    const isDefault = page.id === defaultPageId;
    return {
      ...page,
      lastSeenDay: isDefault ? seenDay : day,
      lastSeenTime: isDefault ? lastSeen.time : index % 2 === 0 ? "9:40 AM" : "4:15 PM",
      lastSeenRelative: lastSeenRelative(isDefault ? seenDay : day),
      topProducts: productsForPage(index * 3),
    };
  });

  return {
    leadText:
      "Despite ongoing offer on this product, it is not showing up on the deals page",
    reviewedPages: REVIEWED_DEAL_PAGES,
    pages,
    defaultPageId,
    dealType: "Black Friday Deal",
    startDay: DEAL_START_DAY,
    endDay: DEAL_END_DAY,
    nowDay: DEAL_NOW_DAY,
    lastSeenDay: seenDay,
    lastSeenTime: lastSeen.time,
    lastSeenRelative: lastSeenRelative(seenDay),
    dealsPageLabel:
      pages.find((page) => page.id === defaultPageId)?.label ??
      "Vacuums & Floor Care",
    topProducts:
      pages.find((page) => page.id === defaultPageId)?.topProducts ?? [],
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
      "SKU is currently Out of Stock, and has been unavailable at least once a day for 1 of the last 7 days.",
    statusLabel: "Currently out of stock",
    location: "Los Angeles",
    zip: "90028",
    timestamp: "Today, 4:00 PM",
    oosCrawlCount: 5,
    totalCrawls: 12,
    visibleCrawlCount: 6,
    showAllLabel: "Show all 11 crawls",
    crawls: [
      {
        id: "c1",
        whenLabel: "Today, 4:00 PM",
        inStock: false,
        location: "Los Angeles",
        zip: "90028",
      },
      {
        id: "c2",
        whenLabel: "Today, 10:00 AM",
        inStock: false,
        location: "New York",
        zip: "10019",
      },
      {
        id: "c3",
        whenLabel: "Today, 4:00 AM",
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
  const brand = sku.brand || "CleanPro";
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
        keyword: `${brand} X23 Vacuum`,
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

/** Keyword Rank — organic drop diagnosis, demand metrics, competitor gains. */
export function getKeywordRankSkuDetail(sku: IssueSku): KeywordRankSkuDetail {
  void sku;
  return {
    summary:
      "Organic search rank degraded across the keyword universe. SP rank held steady.",
    metrics: [
      {
        id: "organic-rank",
        label: "Organic Search Rank",
        from: "8.4",
        to: "31.7",
        delta: "+23.3",
        tone: "drop",
      },
      {
        id: "sp-rank",
        label: "SP Search Rank",
        from: "6.1",
        to: "6.8",
        delta: "+0.7",
        tone: "stable",
      },
      {
        id: "glance-views",
        label: "Glance Views",
        from: "9,240",
        to: "6,180",
        delta: "−33.1%",
        tone: "drop",
      },
      {
        id: "conversion",
        label: "Unit Conversion Rate",
        from: "4.9%",
        to: "4.8%",
        delta: "−0.1pp",
        tone: "stable",
      },
    ],
    keywordsTitle: "Top 3 keywords lost",
    keywordsMeta: "Competitor SKU that gained most",
    keywords: [
      {
        id: "air-fryer",
        keyword: "air fryer",
        placements: [
          {
            channel: "Organic",
            from: 3,
            to: 61,
            competitorName: "Ninja Foodi DualZone Air Fryer",
            competitorAsin: "B0C33CHG99",
            competitorFrom: 14,
            competitorTo: 4,
          },
          {
            channel: "SP",
            from: 5,
            to: 22,
            competitorName: "COSORI Pro II Air Fryer Oven",
            competitorAsin: "B0CSZ7WBYW",
            competitorFrom: 9,
            competitorTo: 3,
          },
        ],
      },
      {
        id: "ninja-air-fryer",
        keyword: "ninja air fryer",
        placements: [
          {
            channel: "Organic",
            from: 6,
            to: 61,
            competitorName: "Ninja AF101 Air Fryer",
            competitorAsin: "B09B7SB46",
            competitorFrom: 21,
            competitorTo: 7,
          },
          {
            channel: "SP",
            from: null,
            to: null,
            emptyLabel: "No SP placement",
          },
        ],
      },
      {
        id: "air-fryer-6qt",
        keyword: "air fryer 6 qt",
        placements: [
          {
            channel: "Organic",
            from: 14,
            to: 38,
            competitorName: "Instant Vortex Plus 6-Quart Air Fryer",
            competitorAsin: "B0B9TQWJKK",
            competitorFrom: 19,
            competitorTo: 11,
          },
          {
            channel: "SP",
            from: 8,
            to: 10,
            competitorName: "Chefman TurboFry 6-Quart Air Fryer",
            competitorAsin: "B0CS3V8M9H",
            competitorFrom: 12,
            competitorTo: 6,
          },
        ],
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
    periodLabel: "Last week (Aug 9–15)",
    spendLwDates: "Aug 9–15",
    spendChangeVs: "vs. Aug 2–8",
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
        keyword: "cleanpro cordless vacuum",
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

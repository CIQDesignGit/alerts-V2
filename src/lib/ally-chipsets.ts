import type { IssueKey } from "@/components/alerts/issue-names";
import { ISSUE_NAMES } from "@/components/alerts/issue-names";

/** Clickable AllyAI prompt chip — shared by Alerts + RCA surfaces. */
export type AllyAiPrompt = {
  id: string;
  /** Short chip label shown in the UI */
  label: string;
  /** Full prompt sent to Ally when selected */
  prompt: string;
  /** Primary chips (e.g. Run Gap to Plan Analysis) use brand styling; default chips are neutral */
  variant?: "primary" | "default";
};

/** Primary “Gap to Plan Analysis” chip — taxonomy / aggregate Ally surfaces. */
export const FULL_RCA_LAST_WEEK_PROMPT: AllyAiPrompt = {
  id: "full-rca",
  label: "Run Gap to Plan Analysis for the last week",
  prompt:
    "Run Gap to Plan Analysis for the last week. Summarize top drivers, seller behavior, and recommended actions for the next 48 hours.",
  variant: "primary",
};

/** Taxonomy levels that show rolled-up Ally chips (not SKU). */
export type TaxonomyChipLevel = "overall" | "brand" | "category";

/** Exactly 3 chip labels from the product chipset sheet (static copy). */
type ChipTrio = readonly [string, string, string];

/** Issue Type · Rolled Up — aggregate alert right panel. */
const ISSUE_ROLLED_UP_CHIPS: Record<IssueKey, ChipTrio> = {
  lostBuyBox: [
    "Which SKUs drive most of the Lost Buy Box gap?",
    "Who's the most frequent buy box competitor (last 7 days)?",
    "How much revenue is at risk from lost buy box this week?",
  ],
  promoBadge: [
    "How many SKUs were expected to be on Promo today?",
    "Which SKUs have a live promo with no badge showing?",
    "Which SKUs have a price mismatch vs. their planned promo?",
  ],
  dealPageVisibility: [
    "How many SKUs were expected to be on Promo today?",
    "Which SKUs are missing from the deals page during an active promo?",
    "Which SKUs have been missing from deals pages most often this week?",
  ],
  coupon: [
    "Which SKUs currently show an active coupon on the PDP?",
    "Which SKUs have had a coupon active most of this week?",
    "Which brands or categories are seeing the most active coupons?",
  ],
  creditOffer: [
    "Which SKUs currently show an active credit offer on the PDP?",
    "How much credit/savings is being offered on these SKUs?",
    "Which brands or categories are seeing the most credit offers?",
  ],
  bestSellerRank: [
    "Which SKUs have had a Best Seller Rank alert in the last 7 days?",
    "Which SKUs had the sharpest day-over-day BSR change?",
    "How does this week's BSR compare to last week?",
  ],
  ratingReviews: [
    "Which SKUs have the steepest rating drop right now?",
    "Is this a rating drop or a spike in negative reviews?",
    "Which brands or categories are seeing the most rating drops?",
  ],
  stockAvailability: [
    "Which SKUs have been out of stock the most days this week?",
    "Is this a replenishment issue or a genuine inventory outage?",
    "Which regions are seeing the most stockouts?",
  ],
  shippingSpeed: [
    "Which SKUs have the largest Prime vs. Standard delivery difference?",
    "Which markets show the slowest delivery speeds?",
    "How many markets have delivery data for these SKUs?",
  ],
  sponsoredSov: [
    "Which SKUs have the steepest Share of Voice drop right now?",
    "Is the drop bigger in Sponsored Products or Sponsored Brands?",
    "Which competitor is gaining share of voice on brand terms?",
  ],
  keywordRank: [
    "Which SKUs have the steepest keyword rank drop right now?",
    "Which keywords dropped the most in organic rank?",
    "Which top-spend keywords are losing sponsored rank?",
  ],
  conversionDrop: [
    "Which SKUs have the steepest conversion rate drop right now?",
    "Is the conversion drop tied to a drop in glance views?",
    "How does this week's conversion rate compare to last week?",
  ],
  mediaSpend: [
    "Which SKUs have the most severe Media Spend misallocation right now?",
    "Which keywords are most underfunded relative to their importance?",
    "How does spend compare to last week?",
  ],
};

/**
 * Issue Type · SKU chips from the product sheet.
 * CSV writes “L7D”; UI spells it out as “Last 7 days” but keeps the issue name.
 * Shipping Speed has three custom chips — no “See trends” entry.
 */
const ISSUE_SKU_CHIPS: Record<IssueKey, ChipTrio> = {
  lostBuyBox: [
    "See trends for Last 7 days for Lost Buy Box",
    "Why is this SKU losing buy box - price, stock, or shipping speed?",
    "Who's the most frequent buy box competitor on this SKU (last 7 days)?",
  ],
  promoBadge: [
    "See trends for Last 7 days for Promo Badge",
    "Why is this SKU flagged for Promo Badge?",
    "What's the expected vs. live price for this promo?",
  ],
  dealPageVisibility: [
    "See trends for Last 7 days for Deal Page Visibility",
    "Why is this SKU flagged for Deal Page Visibility?",
    "Which deals pages or categories were checked for this SKU?",
  ],
  coupon: [
    "See trends for Last 7 days for Coupon",
    "How long has this coupon been active?",
    "Is the Selling Price for the SKU Correct?",
  ],
  creditOffer: [
    "See trends for Last 7 days for Credit Offer",
    "How much credit/savings is being offered on this SKU?",
    "How long has this credit offer been active?",
  ],
  bestSellerRank: [
    "See trends for Last 7 days for Best Seller Rank",
    "Did this SKU's rank improve or worsen day-over-day?",
    "How does this SKU's rank compare to its own 7d average?",
  ],
  ratingReviews: [
    "See trends for Last 7 days for Rating & Reviews",
    "What's driving this - a rating drop or a spike in 1-2 star reviews?",
    "How much has the rating changed vs. last week?",
  ],
  stockAvailability: [
    "See trends for Last 7 days for Stock Availability",
    "Does the SKU have any On-Hand Inventory?",
    "What's the Unavailability % and Rep OOS % for this SKU?",
  ],
  shippingSpeed: [
    "What's the Prime vs. Standard delivery gap for this SKU?",
    "Which markets show the slowest delivery speeds for this SKU?",
    "Which Zipcodes have delivery data for this SKU today?",
  ],
  sponsoredSov: [
    "See trends for Last 7 days for Sponsored Share of Voice",
    "Is this SKU's SoV drop bigger in Sponsored Products or Sponsored Brands?",
    "What's the Top Competitor SOV %",
  ],
  keywordRank: [
    "See trends for Last 7 days for Keyword Rank",
    "Which keywords dropped rank for this SKU?",
    "Is the drop in organic or sponsored rank?",
  ],
  conversionDrop: [
    "See trends for Last 7 days for Conversion Drop",
    "Is this SKU's conversion drop tied to a drop in glance views?",
    "How does this SKU's conversion rate compare to last week?",
  ],
  mediaSpend: [
    "See trends for Last 7 days for Media Spend",
    "Which keywords on this SKU are most underfunded?",
    "How does this SKU's spend compare to last week?",
  ],
};

/** Taxonomy · Rolled Up Chip 2 + Chip 3 (Chip 1 is always Gap to Plan). */
const TAXONOMY_ROLLED_UP_FOLLOW_UPS: Record<TaxonomyChipLevel, readonly [string, string]> =
  {
    overall: [
      "Which brand or category is driving the biggest revenue gap right now?",
      "Show my top SKUs with open issues",
    ],
    brand: [
      "Which category is driving the biggest revenue gap right now?",
      "Show my top SKUs with open issues",
    ],
    category: [
      "Which SKUs are driving the biggest revenue gap in this category?",
      "Show my top SKUs with open issues",
    ],
  };

/** Taxonomy · SKU Chip 2 + Chip 3 (Chip 1 is Gap to Plan). */
const TAXONOMY_SKU_FOLLOW_UPS = [
  "Summarize all issues on this SKU",
  "What changed in the last 24 hours?",
] as const;

/** True when a chip label is the issue-specific L7D trends suggestion. */
function isSeeTrendsL7dLabel(label: string): boolean {
  return label.startsWith("See trends for Last 7 days for ");
}

/** Turn a static label into an Ally chip (label === prompt). */
function chipFromLabel(
  id: string,
  label: string,
  variant?: AllyAiPrompt["variant"],
): AllyAiPrompt {
  return { id, label, prompt: label, variant };
}

/** Build the three Issue Type · Rolled Up chips for an alert aggregate panel. */
export function getIssueRolledUpChips(issueKey: IssueKey): AllyAiPrompt[] {
  const [chip1, chip2, chip3] = ISSUE_ROLLED_UP_CHIPS[issueKey];
  return [
    chipFromLabel(`${issueKey}-skus`, chip1),
    chipFromLabel(`${issueKey}-follow-up-2`, chip2),
    chipFromLabel(`${issueKey}-follow-up-3`, chip3),
  ];
}

/**
 * Build the three Issue Type · SKU chips.
 * “See trends for Last 7 days for {Issue}” keeps a prompt the thread can route to a trend card.
 */
export function getIssueSkuChips(issueKey: IssueKey): AllyAiPrompt[] {
  const [chip1, chip2, chip3] = ISSUE_SKU_CHIPS[issueKey];
  const issueName = ISSUE_NAMES[issueKey].filter;

  const first: AllyAiPrompt =
    isSeeTrendsL7dLabel(chip1)
      ? {
          id: `${issueKey}-trend`,
          label: chip1,
          // Detected by isLastSevenDayTrendPrompt → opens last-week trend card
          prompt: `Show ${issueName} trends over the last 7 days and highlight what changed.`,
        }
      : chipFromLabel(`${issueKey}-sku-1`, chip1);

  return [
    first,
    chipFromLabel(`${issueKey}-sku-2`, chip2),
    chipFromLabel(`${issueKey}-sku-3`, chip3),
  ];
}

/** Build the three Taxonomy · Rolled Up chips (Overall / Brand / Category). */
export function getTaxonomyRolledUpChips(
  level: TaxonomyChipLevel,
): AllyAiPrompt[] {
  const [chip2, chip3] = TAXONOMY_ROLLED_UP_FOLLOW_UPS[level];
  return [
    FULL_RCA_LAST_WEEK_PROMPT,
    chipFromLabel(`taxonomy-${level}-2`, chip2),
    chipFromLabel(`taxonomy-${level}-3`, chip3),
  ];
}

/** Build the three Taxonomy · SKU chips (multi-issue SkuRca). */
export function getTaxonomySkuChips(): AllyAiPrompt[] {
  return [
    FULL_RCA_LAST_WEEK_PROMPT,
    chipFromLabel("taxonomy-sku-summarize", TAXONOMY_SKU_FOLLOW_UPS[0]),
    chipFromLabel("taxonomy-sku-24h", TAXONOMY_SKU_FOLLOW_UPS[1]),
  ];
}

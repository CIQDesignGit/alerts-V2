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
    "See trends for Last 7 days for Missing Promo Badge",
    "Why is this SKU flagged for Missing Promo Badge?",
    "What's the expected vs. live price for this promo?",
  ],
  dealPageVisibility: [
    "See trends for Last 7 days for Deal Page Visibility",
    "Why is this SKU flagged for Deal Page Visibility?",
    "Which deals pages or categories were checked for this SKU?",
  ],
  coupon: [
    "See trends for Last 7 days for Active Coupon",
    "How long has this coupon been active?",
    "Is the Selling Price for the SKU Correct?",
  ],
  creditOffer: [
    "See trends for Last 7 days for Credit Offer",
    "How much credit/savings is being offered on this SKU?",
    "How long has this credit offer been active?",
  ],
  bestSellerRank: [
    "See trends for Last 7 days for Best Seller Rank Drop",
    "Did this SKU's rank improve or worsen day-over-day?",
    "How does this SKU's rank compare to its own 7d average?",
  ],
  ratingReviews: [
    "See trends for Last 7 days for Rating Drop",
    "What's driving this - a rating drop or a spike in 1-2 star reviews?",
    "How much has the rating changed vs. last week?",
  ],
  stockAvailability: [
    "See trends for Last 7 days for OOS",
    "Does the SKU have any On-Hand Inventory?",
    "What's the Unavailability % and Rep OOS % for this SKU?",
  ],
  shippingSpeed: [
    "What's the Prime vs. Standard delivery gap for this SKU?",
    "Which markets show the slowest delivery speeds for this SKU?",
    "Which Zipcodes have delivery data for this SKU today?",
  ],
  sponsoredSov: [
    "See trends for Last 7 days for Share of Voice Drop",
    "Is this SKU's SoV drop bigger in Sponsored Products or Sponsored Brands?",
    "What's the Top Competitor SOV %",
  ],
  keywordRank: [
    "See trends for Last 7 days for Keyword Rank Drop",
    "Which keywords dropped rank for this SKU?",
    "Is the drop in organic or sponsored rank?",
  ],
  conversionDrop: [
    "See trends for Last 7 days for Conversion",
    "Is this SKU's conversion drop tied to a drop in glance views?",
    "How does this SKU's conversion rate compare to last week?",
  ],
  mediaSpend: [
    "See trends for Last 7 days for Media Spend",
    "Which keywords on this SKU are most underfunded?",
    "How does this SKU's spend compare to last week?",
  ],
};

/** True when a chip label is the issue-specific L7D trends suggestion. */
function isSeeTrendsL7dLabel(label: string): boolean {
  return label.startsWith("See trends for Last 7 days for ");
}

/**
 * Issue Type · SKU chips: only the “See trends for Last 7 days” chip.
 * Shipping Speed has no L7D trends chip in the sheet — returns none.
 */
export function getIssueSkuChips(issueKey: IssueKey): AllyAiPrompt[] {
  const [chip1] = ISSUE_SKU_CHIPS[issueKey];
  if (!isSeeTrendsL7dLabel(chip1)) return [];

  const issueName = ISSUE_NAMES[issueKey].filter;
  return [
    {
      id: `${issueKey}-trend`,
      label: chip1,
      // Detected by isLastSevenDayTrendPrompt → opens last-week trend card
      prompt: `Show ${issueName} trends over the last 7 days and highlight what changed.`,
      variant: "primary",
    },
  ];
}

/**
 * Taxonomy · Rolled Up (Overall / Brand / Category):
 * only the Gap to Plan chip — follow-ups are hidden for all taxonomy levels.
 */
export function getTaxonomyRolledUpChips(
  _level: TaxonomyChipLevel,
): AllyAiPrompt[] {
  return [FULL_RCA_LAST_WEEK_PROMPT];
}

/**
 * Taxonomy · SKU (multi-issue SkuRca):
 * only the Gap to Plan chip — same rule as rolled-up taxonomy levels.
 */
export function getTaxonomySkuChips(): AllyAiPrompt[] {
  return [FULL_RCA_LAST_WEEK_PROMPT];
}

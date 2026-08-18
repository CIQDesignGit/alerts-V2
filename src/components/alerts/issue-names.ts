/**
 * Canonical RCA / Alerts issue names by UI location + group tag.
 * - filter / Alerts header / left list titles = names shown in Alerts design
 * - chip = short label for compact badges
 * - pane = RCA accordion title
 * - group = Sales | Operations | Marketing (tag only; do not section lists by group yet)
 */
export type IssueGroup = "Sales" | "Operations" | "Marketing";

export const ISSUE_NAMES = {
  lostBuyBox: {
    filter: "Lost Buy Box",
    chip: "Buy Box",
    pane: "Buy Box",
    group: "Sales" as IssueGroup,
  },
  promoBadge: {
    filter: "Missing Promo Badge",
    chip: "Promo Badge",
    pane: "Promo Badge",
    group: "Marketing" as IssueGroup,
  },
  dealPageVisibility: {
    filter: "Deal Page Visibility",
    chip: "Deal Page",
    pane: "Deal Page Visibility",
    group: "Marketing" as IssueGroup,
  },
  coupon: {
    filter: "Active Coupon",
    chip: "Coupon",
    pane: "Coupon",
    group: "Marketing" as IssueGroup,
  },
  creditOffer: {
    filter: "Credit Offer",
    chip: "Offer",
    pane: "Credit Offer",
    group: "Marketing" as IssueGroup,
  },
  bestSellerRank: {
    filter: "Best Seller Rank Drop",
    chip: "Best Seller Rank",
    pane: "Best Seller Rank",
    group: "Sales" as IssueGroup,
  },
  ratingReviews: {
    filter: "Rating Drop",
    chip: "Rating",
    pane: "Rating & Reviews",
    group: "Sales" as IssueGroup,
  },
  stockAvailability: {
    filter: "OOS",
    chip: "Stock",
    pane: "Stock Availability",
    group: "Operations" as IssueGroup,
  },
  shippingSpeed: {
    filter: "Shipping Speed",
    chip: "Shipping",
    pane: "Shipping Speed",
    group: "Operations" as IssueGroup,
  },
  sponsoredSov: {
    filter: "Share of Voice Drop",
    chip: "SOV",
    pane: "Sponsored Share of Voice",
    group: "Marketing" as IssueGroup,
  },
  keywordRank: {
    filter: "Keyword Rank Drop",
    chip: "Keyword Rank",
    pane: "Keyword Rank",
    group: "Marketing" as IssueGroup,
  },
  mediaSpend: {
    filter: "Media Spend",
    chip: "Media Spend",
    pane: "Media Spend",
    group: "Marketing" as IssueGroup,
  },
  conversionDrop: {
    filter: "Conversion",
    chip: "Conversion",
    pane: "Conversion",
    group: "Sales" as IssueGroup,
  },
} as const;

export type IssueKey = keyof typeof ISSUE_NAMES;

/**
 * Short supporting copy next to the scrape-history detected icon.
 * Generic legend stays “Detected”; cells use this issue-specific word.
 */
export const ISSUE_SCRAPE_DETECTED_LABEL: Record<IssueKey, string> = {
  lostBuyBox: "LBB",
  promoBadge: "Missing",
  dealPageVisibility: "Missing",
  coupon: "Detected",
  creditOffer: "Detected",
  stockAvailability: "OOS",
  shippingSpeed: "Low",
  ratingReviews: "Drop",
  bestSellerRank: "Drop",
  sponsoredSov: "Drop",
  keywordRank: "Drop",
  conversionDrop: "Drop",
  mediaSpend: "Drop",
};

/**
 * Unhealthy-state pill copy for live issue rows.
 * Coupon has no defined label in the product sheet — omit the pill when empty.
 */
export const ISSUE_UNHEALTHY_STATUS_LABEL: Record<IssueKey, string | null> = {
  lostBuyBox: "Lost",
  promoBadge: "Missing",
  dealPageVisibility: "Missing",
  coupon: null,
  creditOffer: null,
  bestSellerRank: "Dropped",
  ratingReviews: "Dropped",
  stockAvailability: "OOS",
  shippingSpeed: "Slow",
  sponsoredSov: "Dropped",
  keywordRank: "Dropped",
  mediaSpend: "No/ Low spend on high value keywords",
  conversionDrop: "Dropped",
};

/**
 * Canonical RCA / Alerts issue names by UI location + group tag.
 * - filter / Alerts header = full name (prefer these over mock synonyms)
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
    filter: "Promo Badge",
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
    filter: "Coupon",
    chip: "Coupon",
    pane: "Coupon",
    group: "Marketing" as IssueGroup,
  },
  bestSellerRank: {
    filter: "Best Seller Rank",
    chip: "Best Seller Rank",
    pane: "Best Seller Rank",
    group: "Sales" as IssueGroup,
  },
  ratingReviews: {
    filter: "Rating & Reviews",
    chip: "Rating",
    pane: "Rating & Reviews",
    group: "Sales" as IssueGroup,
  },
  stockAvailability: {
    filter: "Stock Availability",
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
    filter: "Sponsored Share of Voice",
    chip: "SOV",
    pane: "Sponsored Share of Voice",
    group: "Marketing" as IssueGroup,
  },
  keywordRank: {
    filter: "Keyword Rank",
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
    filter: "Conversion Drop",
    chip: "Conversion",
    pane: "Conversion",
    group: "Sales" as IssueGroup,
  },
} as const;

export type IssueKey = keyof typeof ISSUE_NAMES;

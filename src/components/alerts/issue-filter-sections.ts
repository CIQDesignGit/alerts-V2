import type { IssueKey } from "@/components/alerts/issue-names";

/** Grouped issue picker sections — taxonomy Alerts filter menu */
export type IssueFilterSection = {
  id: string;
  label: string;
  issues: IssueKey[];
};

export const ISSUE_FILTER_SECTIONS: IssueFilterSection[] = [
  {
    id: "pdp-promos",
    label: "PDP & Promos",
    issues: [
      "lostBuyBox",
      "promoBadge",
      "dealPageVisibility",
      "coupon",
      "creditOffer",
    ],
  },
  {
    id: "product-reputation",
    label: "Product Reputation",
    issues: ["bestSellerRank", "ratingReviews"],
  },
  {
    id: "fulfiliment",
    label: "Fulfilment",
    issues: ["stockAvailability", "shippingSpeed"],
  },
  {
    id: "search-traffic",
    label: "Search & Traffic",
    issues: ["sponsoredSov", "keywordRank", "conversionDrop", "mediaSpend"],
  },
];

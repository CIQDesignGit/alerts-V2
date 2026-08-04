import type { IssueKey } from "@/components/alerts/issue-names";
import type { IssueSku } from "@/lib/mock-alerts-insights";

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
  buyBoxWinner: string;
};

export type CouponSkuDetail = {
  rows: CouponTimelineRow[];
};

/** Lost Buy Box — brand vs latest winner comparison (issue aggregation SKU view). */
export function getLostBuyBoxSkuDetail(sku: IssueSku): LostBuyBoxSkuDetail {
  const competitor = sku.bbOwner ?? "Choice Electronics";
  const ourPrice = sku.ourPrice ?? 18.99;
  const theirPrice = sku.theirPrice ?? 17.49;

  return {
    alertMessage:
      "You've lost the Buy Box on an important SKU in the last 24 hours.",
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
        brandValue: "3.2",
        competitorValue: "4.3",
        brandRating: 3.2,
        competitorRating: 4.3,
      },
      {
        id: "winRate",
        label: "Buy Box Win Rate",
        icon: "winRate",
        brandValue: "1/6",
        competitorValue: "2/6",
        brandWinRate: "1/6",
        competitorWinRate: "2/6",
      },
    ],
  };
}

/** Coupon — timeline of coupon detections and Buy Box winners (issue aggregation SKU view). */
export function getCouponSkuDetail(_sku: IssueSku): CouponSkuDetail {
  return {
    rows: [
      {
        id: "t-3h",
        relativeTime: "3 hours ago",
        absoluteTime: "2:29 PM",
        couponDetected: true,
        couponValues: [
          "Apply $2.95 coupon",
          "Save 10%: Coupon available when you select Subscribe & Save",
        ],
        buyBoxWinner: "Shark (You)",
      },
      {
        id: "t-6h",
        relativeTime: "6 hours ago",
        absoluteTime: "11:29 AM",
        couponDetected: true,
        couponValues: ["Apply $2.95 coupon"],
        buyBoxWinner: "Dyson (3P)",
      },
      {
        id: "t-9h",
        relativeTime: "9 hours ago",
        absoluteTime: "8:29 AM",
        couponDetected: false,
        couponValues: [],
        buyBoxWinner: "Shark (You)",
      },
      {
        id: "t-12h",
        relativeTime: "12 hours ago",
        absoluteTime: "5:29 AM",
        couponDetected: true,
        couponValues: ["Apply 15% coupon"],
        buyBoxWinner: "Hotwired (3P)",
      },
    ],
  };
}

export const ISSUE_SKU_DETAIL_KEYS = new Set<IssueKey>([
  "lostBuyBox",
  "coupon",
]);

export function hasIssueSkuDetail(issueKey: IssueKey): boolean {
  return ISSUE_SKU_DETAIL_KEYS.has(issueKey);
}

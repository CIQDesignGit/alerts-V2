"use client";

import type { IssueKey } from "@/components/alerts/issue-names";
import { BestSellerRankSkuDetail } from "@/components/issue-sku-detail/best-seller-rank-sku-detail";
import { ConversionDropSkuDetail } from "@/components/issue-sku-detail/conversion-drop-sku-detail";
import { CouponSkuDetail } from "@/components/issue-sku-detail/coupon-sku-detail";
import { CreditOfferSkuDetail } from "@/components/issue-sku-detail/credit-offer-sku-detail";
import { DealPageSkuDetail } from "@/components/issue-sku-detail/deal-page-sku-detail";
import { KeywordRankSkuDetail } from "@/components/issue-sku-detail/keyword-rank-sku-detail";
import { LostBuyBoxSkuDetail } from "@/components/issue-sku-detail/lost-buy-box-sku-detail";
import { MediaSpendSkuDetail } from "@/components/issue-sku-detail/media-spend-sku-detail";
import { PromoBadgeSkuDetail } from "@/components/issue-sku-detail/promo-badge-sku-detail";
import { RatingReviewsSkuDetail } from "@/components/issue-sku-detail/rating-reviews-sku-detail";
import { ShippingSpeedSkuDetail } from "@/components/issue-sku-detail/shipping-speed-sku-detail";
import { SponsoredSovSkuDetail } from "@/components/issue-sku-detail/sponsored-sov-sku-detail";
import { StockAvailabilitySkuDetail } from "@/components/issue-sku-detail/stock-availability-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type IssueSkuDetailBodyProps = {
  sku: IssueSku;
  issueKey: IssueKey;
};

/**
 * Issue-specific detail body — shared by issue-type SKU pages and
 * the taxonomy “Live right now” accordion.
 */
export function IssueSkuDetailBody({
  sku,
  issueKey,
}: IssueSkuDetailBodyProps) {
  switch (issueKey) {
    case "lostBuyBox":
      return <LostBuyBoxSkuDetail sku={sku} />;
    case "coupon":
      return <CouponSkuDetail sku={sku} />;
    case "creditOffer":
      return <CreditOfferSkuDetail sku={sku} />;
    case "promoBadge":
      return <PromoBadgeSkuDetail sku={sku} />;
    case "dealPageVisibility":
      return <DealPageSkuDetail sku={sku} />;
    case "bestSellerRank":
      return <BestSellerRankSkuDetail sku={sku} />;
    case "ratingReviews":
      return <RatingReviewsSkuDetail sku={sku} />;
    case "stockAvailability":
      return <StockAvailabilitySkuDetail sku={sku} />;
    case "shippingSpeed":
      return <ShippingSpeedSkuDetail sku={sku} />;
    case "sponsoredSov":
      return <SponsoredSovSkuDetail sku={sku} />;
    case "keywordRank":
      return <KeywordRankSkuDetail sku={sku} />;
    case "mediaSpend":
      return <MediaSpendSkuDetail sku={sku} />;
    case "conversionDrop":
      return <ConversionDropSkuDetail sku={sku} />;
    default:
      return null;
  }
}

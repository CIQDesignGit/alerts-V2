"use client";

import type { IssueKey } from "@/components/alerts/issue-names";
import { BestSellerRankSkuDetail } from "@/components/issue-sku-detail/best-seller-rank-sku-detail";
import { ConversionDropSkuDetail } from "@/components/issue-sku-detail/conversion-drop-sku-detail";
import { CouponSkuDetail } from "@/components/issue-sku-detail/coupon-sku-detail";
import { DealPageSkuDetail } from "@/components/issue-sku-detail/deal-page-sku-detail";
import { IssueSkuDetailShell } from "@/components/issue-sku-detail/issue-sku-detail-shell";
import { KeywordRankSkuDetail } from "@/components/issue-sku-detail/keyword-rank-sku-detail";
import { LostBuyBoxSkuDetail } from "@/components/issue-sku-detail/lost-buy-box-sku-detail";
import { MediaSpendSkuDetail } from "@/components/issue-sku-detail/media-spend-sku-detail";
import { PromoBadgeSkuDetail } from "@/components/issue-sku-detail/promo-badge-sku-detail";
import { RatingReviewsSkuDetail } from "@/components/issue-sku-detail/rating-reviews-sku-detail";
import { ShippingSpeedSkuDetail } from "@/components/issue-sku-detail/shipping-speed-sku-detail";
import { SponsoredSovSkuDetail } from "@/components/issue-sku-detail/sponsored-sov-sku-detail";
import { StockAvailabilitySkuDetail } from "@/components/issue-sku-detail/stock-availability-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";

type IssueSkuDetailPanelProps = {
  sku: IssueSku;
  issueKey: IssueKey;
  onClose: () => void;
};

/** Issue-type aggregation SKU detail — layout varies by alert issue. */
export function IssueSkuDetailPanel({
  sku,
  issueKey,
  onClose,
}: IssueSkuDetailPanelProps) {
  return (
    <IssueSkuDetailShell sku={sku} issueKey={issueKey} onClose={onClose}>
      {issueKey === "lostBuyBox" && <LostBuyBoxSkuDetail sku={sku} />}
      {issueKey === "coupon" && <CouponSkuDetail sku={sku} />}
      {issueKey === "promoBadge" && <PromoBadgeSkuDetail sku={sku} />}
      {issueKey === "dealPageVisibility" && <DealPageSkuDetail sku={sku} />}
      {issueKey === "bestSellerRank" && (
        <BestSellerRankSkuDetail sku={sku} />
      )}
      {issueKey === "ratingReviews" && <RatingReviewsSkuDetail sku={sku} />}
      {issueKey === "stockAvailability" && (
        <StockAvailabilitySkuDetail sku={sku} />
      )}
      {issueKey === "shippingSpeed" && <ShippingSpeedSkuDetail sku={sku} />}
      {issueKey === "sponsoredSov" && <SponsoredSovSkuDetail sku={sku} />}
      {issueKey === "keywordRank" && <KeywordRankSkuDetail sku={sku} />}
      {issueKey === "mediaSpend" && <MediaSpendSkuDetail sku={sku} />}
      {issueKey === "conversionDrop" && (
        <ConversionDropSkuDetail sku={sku} />
      )}
    </IssueSkuDetailShell>
  );
}

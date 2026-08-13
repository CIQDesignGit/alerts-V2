"use client";

import { useMemo } from "react";

import { AllyInsightContent } from "@/components/alerts-insights/ally-ai-surface";
import { AlertMetricTiles } from "@/components/alerts-insights/alert-metric-tiles";
import type { IssueKey } from "@/components/alerts/issue-names";
import { ContentFeedback } from "@/components/shared/content-feedback";
import { SkuAllyChatThread } from "@/components/sku-rca/sku-ally-chat-thread";
import { SKU_RCA_CONTENT_WIDTH } from "@/components/sku-rca/sku-rca-header";
import { useSkuAllyThread } from "@/components/sku-rca/use-sku-ally-thread";
import {
  buildAlertAllyInsightBullets,
  buildAlertMetricTiles,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

/** Shared right-pane aggregate for issue- or category-grouped alerts */
export type AlertGroupDetail = {
  title: string;
  /** Stable id for feedback (issueKey or category id) */
  feedbackKey: string;
  /** Issue Type · Rolled Up chipset key */
  issueKey: IssueKey;
  skuCount: number;
  gapDollars: number;
  aiSignal?: string;
  skus: IssueSku[];
};

type AlertDetailPanelProps = {
  group: AlertGroupDetail;
};

/** Top contributor SKU — used as the sample identity for the full RCA mock. */
function topGapSku(skus: IssueSku[]): IssueSku | undefined {
  if (skus.length === 0) return undefined;
  return [...skus].sort((a, b) => a.gapDollars - b.gapDollars)[0];
}

export function AlertDetailPanel({ group }: AlertDetailPanelProps) {
  const reportSku = useMemo(
    () =>
      topGapSku(group.skus) ?? {
        id: group.feedbackKey,
        name: group.title,
        asin: "—",
        seller: "—",
        gapDollars: group.gapDollars,
        brand: group.title,
        category: group.title,
      },
    [group],
  );

  const { messages } = useSkuAllyThread(reportSku);

  const allyInsightBullets = useMemo(
    () =>
      buildAlertAllyInsightBullets(
        group.title,
        group.skus,
        group.gapDollars,
        group.skuCount,
        group.aiSignal,
      ),
    [group.title, group.skus, group.gapDollars, group.skuCount, group.aiSignal],
  );

  const metricTiles = useMemo(
    () => buildAlertMetricTiles(group.skus, group.gapDollars),
    [group.skus, group.gapDollars],
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-background">
      <header className="relative shrink-0 border-b border-border bg-background">
        <div className="px-6 py-3">
          <div className={SKU_RCA_CONTENT_WIDTH}>
            <h2 className="min-w-0 truncate text-lg font-bold leading-snug text-foreground">
              {group.title}
            </h2>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
        <div className={cn(SKU_RCA_CONTENT_WIDTH, "flex flex-col gap-5")}>
          <AlertMetricTiles metrics={metricTiles} />
          <AllyInsightContent
            bullets={allyInsightBullets}
            title={`Key insights for ${group.title}`}
          />
          <ContentFeedback
            variant="subtle"
            feedbackKey={group.feedbackKey}
            surface="ally-insight"
            contextLabel={group.title}
            title="Was this alert helpful?"
          />

          <SkuAllyChatThread messages={messages} />
        </div>
      </div>
    </div>
  );
}

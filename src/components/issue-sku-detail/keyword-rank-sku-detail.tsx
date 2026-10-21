"use client";

import { useMemo } from "react";

import { KeywordRankLostKeywords } from "@/components/issue-sku-detail/keyword-rank-lost-keywords";
import {
  getKeywordRankSkuDetail,
  type KeywordRankMetric,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type KeywordRankSkuDetailProps = {
  sku: IssueSku;
};

/** Comparison windows — shared footnote under the four-up strip (see trigger logic spec). */
const KEYWORD_RANK_DEMAND_METRIC_COMPARISON = {
  current: "Yesterday (D-1)",
  baseline: "7-day average (D-2 through D-8)",
} as const;

const KEYWORD_RANK_SP_METRIC_COMPARISON = {
  current: "7-day average (D-1 through D-7)",
  baseline: "90-day average (D-8 through D-97)",
} as const;

/** Keyword Rank — one-line summary, then a single four-up metric strip. */
export function KeywordRankSkuDetail({ sku }: KeywordRankSkuDetailProps) {
  const detail = useMemo(() => getKeywordRankSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{detail.summary}</p>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="grid grid-cols-4 divide-x divide-border">
          {detail.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
        <KeywordRankMetricsFootnote />
      </div>

      <KeywordRankLostKeywords
        title={detail.keywordsTitle}
        meta={detail.keywordsMeta}
        keywords={detail.keywords}
      />
    </div>
  );
}

function MetricCard({ metric }: { metric: KeywordRankMetric }) {
  const dropped = metric.tone === "drop";

  return (
    <div className="min-w-0 px-4 py-3">
      <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
        {metric.label}
      </p>
      <p className="mt-1.5 text-sm tabular-nums">
        <span className="text-neutral-500">{metric.from}</span>
        <span className="mx-1 text-neutral-400">→</span>
        <span className={cn("font-semibold", dropped ? "text-error-600" : "text-foreground")}>
          {metric.to}
        </span>
      </p>
      <p className="mt-1.5">
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-2xs font-semibold tabular-nums",
            dropped
              ? "bg-error-100 text-error-700"
              : "bg-success-100 text-success-700",
          )}
        >
          {metric.delta}
        </span>
      </p>
    </div>
  );
}

function KeywordRankMetricsFootnote() {
  return (
    <div
      className="flex flex-col gap-1 border-t border-border px-4 py-2.5 text-xs leading-snug text-muted-foreground"
      role="note"
    >
      <p>
        <span className="font-medium text-foreground">
          Organic Search Rank, Glance Views, Unit Conversion Rate —
        </span>{" "}
        <ComparisonPeriodLine info={KEYWORD_RANK_DEMAND_METRIC_COMPARISON} />
      </p>
      <p>
        <span className="font-medium text-foreground">SP Search Rank —</span>{" "}
        <ComparisonPeriodLine info={KEYWORD_RANK_SP_METRIC_COMPARISON} />
      </p>
    </div>
  );
}

function ComparisonPeriodLine({
  info,
}: {
  info: { current: string; baseline: string };
}) {
  return (
    <>
      <span className="font-medium text-foreground">Current:</span>{" "}
      {info.current};{" "}
      <span className="font-medium text-foreground">Baseline:</span>{" "}
      {info.baseline}
    </>
  );
}

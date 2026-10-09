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

/** Keyword Rank — one-line summary, then a single four-up metric strip. */
export function KeywordRankSkuDetail({ sku }: KeywordRankSkuDetailProps) {
  const detail = useMemo(() => getKeywordRankSkuDetail(sku), [sku]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{detail.summary}</p>

      <div className="grid grid-cols-4 divide-x divide-border overflow-hidden rounded-xl border border-border bg-background">
        {detail.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
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

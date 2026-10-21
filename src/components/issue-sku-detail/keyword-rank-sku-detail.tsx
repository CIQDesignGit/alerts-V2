"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";

import { KeywordRankLostKeywords } from "@/components/issue-sku-detail/keyword-rank-lost-keywords";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getKeywordRankSkuDetail,
  type KeywordRankMetric,
} from "@/lib/mock-issue-sku-detail";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type KeywordRankSkuDetailProps = {
  sku: IssueSku;
};

/** Comparison windows — Organic vs SP use different grains (see trigger logic spec). */
const KEYWORD_RANK_METRIC_INFO: Record<
  string,
  { current: string; baseline: string }
> = {
  "organic-rank": {
    current: "Yesterday (D-1)",
    baseline: "7-day average (D-2 through D-8)",
  },
  "sp-rank": {
    current: "7-day average (D-1 through D-7)",
    baseline: "90-day average (D-8 through D-97)",
  },
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
  const comparisonInfo = KEYWORD_RANK_METRIC_INFO[metric.id];

  return (
    <div className="min-w-0 px-4 py-3">
      <div className="flex items-center gap-1">
        <p className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
          {metric.label}
        </p>
        {comparisonInfo ? (
          <Tooltip>
            <TooltipTrigger
              className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label={`About ${metric.label} comparison period`}
            >
              <Info className="size-3" aria-hidden />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs px-3 py-2 text-left leading-snug">
              <KeywordRankMetricInfoBody info={comparisonInfo} />
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
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

function KeywordRankMetricInfoBody({
  info,
}: {
  info: { current: string; baseline: string };
}) {
  return (
    <div className="flex flex-col gap-1.5 text-xs">
      <p>
        <span className="font-semibold">Current:</span> {info.current}
      </p>
      <p>
        <span className="font-semibold">Baseline:</span> {info.baseline}
      </p>
    </div>
  );
}

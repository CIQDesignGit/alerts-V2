"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  brandCards,
  formatAtRisk,
  formatGapDollars,
  portfolioGap,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type OverviewGapHeroProps = {
  onGoToInsights: () => void;
};

/**
 * Insights teaser — portfolio gap + brand breakdown.
 * CTA deep-links into the Insights tab (not a duplicate of Wins).
 */
export function OverviewGapHero({ onGoToInsights }: OverviewGapHeroProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Business Overview
          </h2>
          {/* Spell out the window — “WTD” alone is easy to miss */}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {portfolioGap.periodLabel}
            <span className="text-neutral-400"> · </span>
            {portfolioGap.periodRange}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToInsights}
          className="border-brand-500 text-brand-700 hover:bg-brand-50 hover:text-brand-800"
        >
          Go to Insights
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
        {/* Portfolio hero number */}
        <button
          type="button"
          onClick={onGoToInsights}
          className="border-b border-border p-5 text-left transition-colors hover:bg-neutral-50 lg:border-r lg:border-b-0 lg:p-6"
        >
          <p className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
            {portfolioGap.label}
          </p>
          <p
            className={cn(
              "mt-2 font-mono text-4xl font-bold tracking-tight",
              portfolioGap.gapDollars < 0 ? "text-error-600" : "text-success-600",
            )}
          >
            {formatGapDollars(portfolioGap.gapDollars)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {portfolioGap.periodLabel} · vs plan
          </p>
          <div className="mt-4 space-y-1.5">
            <AttainmentBar pct={portfolioGap.attainmentPct} />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {formatAtRisk(portfolioGap.achievedDollars)}
              </span>{" "}
              attained of{" "}
              <span className="font-medium text-foreground">
                {formatAtRisk(portfolioGap.targetDollars)}
              </span>{" "}
              target
            </p>
          </div>
        </button>

        {/* Brand columns — click into Insights */}
        <div className="grid sm:grid-cols-3">
          {brandCards.map((brand, i) => {
            const positive = brand.gapDollars > 0;
            return (
              <button
                key={brand.name}
                type="button"
                onClick={onGoToInsights}
                className={cn(
                  "flex flex-col p-4 text-left transition-colors hover:bg-neutral-50 sm:p-5",
                  i < brandCards.length - 1 &&
                    "border-b border-border sm:border-r sm:border-b-0",
                )}
              >
                <p className="text-sm font-semibold text-foreground">
                  {brand.name}
                </p>
                <p
                  className={cn(
                    "mt-3 font-mono text-xl font-bold tracking-tight",
                    positive ? "text-success-600" : "text-error-600",
                  )}
                >
                  {formatGapDollars(brand.gapDollars)}
                </p>
                <div className="mt-auto space-y-1.5 pt-3">
                  <AttainmentBar pct={brand.attainmentPct} compact />
                  <p className="text-2xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {formatAtRisk(brand.achievedDollars)}
                    </span>
                    {" / "}
                    {formatAtRisk(brand.targetDollars)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Map attainment % to a fixed Tailwind width class (no inline styles). */
const WIDTH_BY_BUCKET: Record<number, string> = {
  0: "w-0",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-1/5",
  25: "w-1/4",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-2/5",
  45: "w-[45%]",
  50: "w-1/2",
  55: "w-[55%]",
  60: "w-3/5",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-3/4",
  80: "w-4/5",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-full",
};

function AttainmentBar({ pct, compact }: { pct: number; compact?: boolean }) {
  const bucket = Math.min(100, Math.max(0, Math.round(pct / 5) * 5));
  const overPlan = pct >= 100;

  return (
    <div className="flex items-center gap-1">
      <div
        className={cn(
          "min-w-0 flex-1 overflow-hidden rounded-none bg-neutral-100",
          compact ? "h-3" : "h-3.5",
        )}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% attainment`}
      >
        <div
          className={cn(
            "h-full rounded-none",
            WIDTH_BY_BUCKET[bucket],
            overPlan ? "bg-success-500/35" : "bg-error-500/35",
          )}
        />
      </div>
      {/* Attainment % sits after the bar */}
      <span
        className={cn(
          "shrink-0 font-mono font-semibold tabular-nums text-neutral-600",
          compact ? "min-w-7 text-right text-2xs" : "min-w-8 text-right text-xs",
        )}
      >
        {pct}%
      </span>
    </div>
  );
}

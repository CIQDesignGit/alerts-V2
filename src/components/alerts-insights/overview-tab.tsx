"use client";

import { OverviewActiveAlerts } from "@/components/alerts-insights/overview-active-alerts";
import { OverviewAiBrief } from "@/components/alerts-insights/overview-ai-brief";
import { OverviewGapHero } from "@/components/alerts-insights/overview-gap-hero";
// OverviewWins kept in codebase but hidden from Overview for now.

type OverviewTabProps = {
  onGoToAlerts: () => void;
  onGoToInsights: () => void;
};

/**
 * Landing Overview — AllyAI brief first, then Insights hero (gap), then Active Alerts.
 * Wins panel is temporarily hidden (component still exists).
 */
export function OverviewTab({ onGoToAlerts, onGoToInsights }: OverviewTabProps) {
  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      {/*
        Page wash: rose + soft purple, rising from the bottom.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32rem]"
      >
        {/* Rose — left / center bottom */}
        <div className="absolute -bottom-28 left-[12%] size-[30rem] rounded-full bg-rose-50/90 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 size-[22rem] rounded-full bg-rose-50 blur-3xl" />
        {/* Slight purple — right bottom */}
        <div className="absolute -bottom-24 right-[8%] size-[28rem] rounded-full bg-brand-100/70 blur-3xl" />
        {/* Soft fade up so the wash dissolves into the page */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-rose-50/60 via-brand-50/25 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-5 p-6">
        <OverviewAiBrief />
        <OverviewGapHero onGoToInsights={onGoToInsights} />
        <OverviewActiveAlerts onGoToAlerts={onGoToAlerts} />
      </div>
    </div>
  );
}

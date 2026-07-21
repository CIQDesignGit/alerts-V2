"use client";

import { OverviewActiveAlerts } from "@/components/alerts-insights/overview-active-alerts";
import { OverviewAiBrief } from "@/components/alerts-insights/overview-ai-brief";
import { OverviewGapHero } from "@/components/alerts-insights/overview-gap-hero";
import { OverviewWins } from "@/components/alerts-insights/overview-wins";

type OverviewTabProps = {
  onGoToAlerts: () => void;
  onGoToInsights: () => void;
};

/**
 * Landing Overview — Insights hero (gap), AllyAI brief,
 * then Alerts (misses) + Wins side by side.
 */
export function OverviewTab({ onGoToAlerts, onGoToInsights }: OverviewTabProps) {
  return (
    <div className="min-h-full bg-neutral-50/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 p-6">
        <OverviewGapHero onGoToInsights={onGoToInsights} />
        <OverviewAiBrief />

        <div className="grid gap-5 lg:grid-cols-2">
          <OverviewActiveAlerts onGoToAlerts={onGoToAlerts} />
          <OverviewWins />
        </div>
      </div>
    </div>
  );
}

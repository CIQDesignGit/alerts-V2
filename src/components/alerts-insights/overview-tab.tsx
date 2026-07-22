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
 * Landing Overview — Insights hero (gap), AllyAI brief, then Active Alerts.
 * Wins panel is temporarily hidden (component still exists).
 */
export function OverviewTab({ onGoToAlerts, onGoToInsights }: OverviewTabProps) {
  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      {/*
        Soft mesh glow (like the reference) — pastel orbs behind content.
        Anchored at the bottom so the wash sits under the page, not the header.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28rem]"
      >
        {/* Warm cream — left */}
        <div className="absolute -bottom-24 left-[8%] size-[26rem] rounded-full bg-warning-100/70 blur-3xl" />
        {/* Soft rose — center */}
        <div className="absolute -bottom-16 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-error-50/80 blur-3xl" />
        {/* Lavender — right (brand) */}
        <div className="absolute -bottom-20 right-[6%] size-[28rem] rounded-full bg-brand-200/55 blur-3xl" />
        {/* Extra soft brand wash to blend the orbs */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-50/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-5 p-6">
        <OverviewGapHero onGoToInsights={onGoToInsights} />
        <OverviewAiBrief />
        <OverviewActiveAlerts onGoToAlerts={onGoToAlerts} />
      </div>
    </div>
  );
}

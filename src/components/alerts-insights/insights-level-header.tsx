"use client";

import { InsightsModeToggle } from "@/components/alerts-insights/insights-mode-toggle";
import type { InsightsMode } from "@/lib/insights-widgets";

type InsightsLevelHeaderProps = {
  name: string;
  mode: InsightsMode;
  onModeChange: (mode: InsightsMode) => void;
};

/**
 * Shared Insights header — level name + Snapshot/Trends toggle only.
 * Mode-specific metrics and date range live in the scroll body.
 */
export function InsightsLevelHeader({
  name,
  mode,
  onModeChange,
}: InsightsLevelHeaderProps) {
  return (
    <header className="relative shrink-0 border-b border-border bg-background">
      <div className="px-6 py-3">
        <div className="flex w-full min-w-0 items-center justify-between gap-4">
          <h2 className="min-w-0 flex-1 truncate text-lg font-bold leading-snug text-foreground">
            {name}
          </h2>
          <InsightsModeToggle mode={mode} onChange={onModeChange} />
        </div>
      </div>
    </header>
  );
}

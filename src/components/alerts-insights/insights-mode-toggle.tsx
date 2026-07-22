"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InsightsMode } from "@/lib/insights-widgets";

type InsightsModeToggleProps = {
  mode: InsightsMode;
  onChange: (mode: InsightsMode) => void;
  /** Accessible name for the control (defaults to View mode) */
  ariaLabel?: string;
};

/**
 * Snapshot = level metrics for a chosen period.
 * Trends = issue & performance movement over time (customizable widgets).
 * Internal values stay live | historical for existing state.
 */
export function InsightsModeToggle({
  mode,
  onChange,
  ariaLabel = "View mode",
}: InsightsModeToggleProps) {
  return (
    <Tabs
      value={mode}
      onValueChange={(value) => {
        if (value === "live" || value === "historical") onChange(value);
      }}
      className="gap-0"
    >
      <TabsList aria-label={ariaLabel} className="h-7 bg-neutral-100">
        <TabsTrigger value="live" className="px-2.5 text-xs">
          Snapshot
        </TabsTrigger>
        <TabsTrigger value="historical" className="px-2.5 text-xs">
          Trends
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

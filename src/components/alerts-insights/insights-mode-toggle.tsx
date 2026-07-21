"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InsightsMode } from "@/lib/insights-widgets";

type InsightsModeToggleProps = {
  mode: InsightsMode;
  onChange: (mode: InsightsMode) => void;
};

/** Live / Historical switch — shadcn Tabs (list only; panels stay in InsightsTab). */
export function InsightsModeToggle({
  mode,
  onChange,
}: InsightsModeToggleProps) {
  return (
    <Tabs
      value={mode}
      onValueChange={(value) => {
        if (value === "live" || value === "historical") onChange(value);
      }}
      className="gap-0"
    >
      <TabsList
        aria-label="Insights mode"
        className="h-8 bg-neutral-100"
      >
        <TabsTrigger value="live" className="px-3 text-xs">
          Live
        </TabsTrigger>
        <TabsTrigger value="historical" className="px-3 text-xs">
          Historical
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

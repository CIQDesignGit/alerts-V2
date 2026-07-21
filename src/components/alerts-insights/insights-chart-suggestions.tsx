"use client";

import {
  CHART_SUGGESTIONS,
  type ChartSuggestion,
  type InsightWidget,
} from "@/lib/insights-widgets";

type InsightsChartSuggestionsProps = {
  widgets: InsightWidget[];
  onAddSuggestion: (suggestion: ChartSuggestion) => void;
};

export function InsightsChartSuggestions({
  widgets,
  onAddSuggestion,
}: InsightsChartSuggestionsProps) {
  const usedKeys = new Set(widgets.map((w) => w.chartKey).filter(Boolean));
  const available = CHART_SUGGESTIONS.filter((s) => !usedKeys.has(s.chartKey));

  if (available.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-neutral-50 px-3 py-2.5">
      <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
        Suggested charts
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {available.map((suggestion) => (
          <button
            key={suggestion.chartKey}
            type="button"
            onClick={() => onAddSuggestion(suggestion)}
            className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-primary hover:text-primary"
            title={suggestion.prompt}
          >
            + {suggestion.title}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { InsightsChartSuggestions } from "@/components/alerts-insights/insights-chart-suggestions";
import { InsightsDateRangePicker } from "@/components/alerts-insights/insights-date-range";
import { InsightsWidgetChart } from "@/components/alerts-insights/insights-widget-chart";
import { InsightsWidgetForm } from "@/components/alerts-insights/insights-widget-form";
import { Button } from "@/components/ui/button";
import type {
  InsightsComparisonPeriod,
  InsightsDateRange,
} from "@/lib/insights-date-range";
import type { ChartSuggestion, InsightWidget } from "@/lib/insights-widgets";

type InsightsHistoricalPanelProps = {
  entityName: string;
  dateRange: InsightsDateRange;
  onDateRangeChange: (next: InsightsDateRange) => void;
  comparison: InsightsComparisonPeriod;
  onComparisonChange: (next: InsightsComparisonPeriod) => void;
  widgets: InsightWidget[];
  onAdd: (title: string, prompt: string) => void;
  onAddSuggestion: (suggestion: ChartSuggestion) => void;
  onUpdate: (id: string, patch: Partial<InsightWidget>) => void;
  onRemove: (id: string) => void;
};

/** Trends dashboard — issue & performance movement; widgets persist per entity. */
export function InsightsHistoricalPanel({
  entityName,
  dateRange,
  onDateRangeChange,
  comparison,
  onComparisonChange,
  widgets,
  onAdd,
  onAddSuggestion,
  onUpdate,
  onRemove,
}: InsightsHistoricalPanelProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Title + period/comparison/actions on one row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="min-w-0 text-sm font-semibold text-foreground">
          Trends for {entityName}
        </h3>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <InsightsDateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            comparison={comparison}
            onComparisonChange={onComparisonChange}
            variant="toolbar"
            menuAlign="right"
            showRangeInTrigger
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-brand-500 text-brand-700 hover:bg-brand-50 hover:text-brand-800"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
          >
            <Plus className="size-3.5" />
            Add widget
          </Button>
        </div>
      </div>

      <InsightsChartSuggestions
        widgets={widgets}
        onAddSuggestion={onAddSuggestion}
      />

      {adding && (
        <InsightsWidgetForm
          submitLabel="Add widget"
          onCancel={() => setAdding(false)}
          onSubmit={(title, prompt) => {
            onAdd(title, prompt);
            setAdding(false);
          }}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {widgets.map((widget) =>
          editingId === widget.id ? (
            <InsightsWidgetForm
              key={widget.id}
              initialTitle={widget.title}
              initialPrompt={widget.prompt}
              submitLabel="Save"
              onCancel={() => setEditingId(null)}
              onSubmit={(title, prompt) => {
                onUpdate(widget.id, { title, prompt });
                setEditingId(null);
              }}
            />
          ) : (
            <article
              key={widget.id}
              className="flex flex-col rounded-lg border border-border bg-background p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-foreground">
                    {widget.title}
                  </h4>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Edit ${widget.title}`}
                    onClick={() => {
                      setEditingId(widget.id);
                      setAdding(false);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Delete ${widget.title}`}
                    onClick={() => onRemove(widget.id)}
                  >
                    <Trash2 className="size-3.5 text-error-600" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                {widget.prompt}
              </p>
              <div className="mt-3 min-h-40">
                <InsightsWidgetChart widget={widget} />
              </div>
            </article>
          ),
        )}
      </div>

      {widgets.length === 0 && !adding && (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No widgets yet. Pick a suggestion above, add one, or reset to
          defaults.
        </p>
      )}
    </div>
  );
}

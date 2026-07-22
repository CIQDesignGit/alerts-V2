"use client";

import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

import { InsightsChartSuggestions } from "@/components/alerts-insights/insights-chart-suggestions";
import { InsightsWidgetChart } from "@/components/alerts-insights/insights-widget-chart";
import { InsightsWidgetForm } from "@/components/alerts-insights/insights-widget-form";
import { Button } from "@/components/ui/button";
import { formatInsightsDateRange } from "@/lib/insights-date-range";
import type { InsightsDateRange } from "@/lib/insights-date-range";
import type { ChartSuggestion, InsightWidget } from "@/lib/insights-widgets";

type InsightsHistoricalPanelProps = {
  entityName: string;
  dateRange: InsightsDateRange;
  widgets: InsightWidget[];
  onAdd: (title: string, prompt: string) => void;
  onAddSuggestion: (suggestion: ChartSuggestion) => void;
  onUpdate: (id: string, patch: Partial<InsightWidget>) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
};

/** Trends dashboard — issue & performance movement; widgets persist per entity. */
export function InsightsHistoricalPanel({
  entityName,
  dateRange,
  widgets,
  onAdd,
  onAddSuggestion,
  onUpdate,
  onRemove,
  onReset,
}: InsightsHistoricalPanelProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const period = formatInsightsDateRange(dateRange);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Trends for {entityName}
          </h3>
          <p className="text-xs text-muted-foreground">
            Issue and performance movement · {period.label} · {period.rangeText}.
            Add, edit, or remove widgets — changes save on this device.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            title="Reset to default widgets"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
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
                  <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {widget.kind}
                  </p>
                  <h4 className="mt-0.5 text-sm font-semibold text-foreground">
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

"use client";

import { useEffect, useState } from "react";

import {
  createCustomWidget,
  createWidgetFromSuggestion,
  DEFAULT_HISTORICAL_WIDGETS,
  loadWidgets,
  saveWidgets,
  type ChartSuggestion,
  type InsightWidget,
} from "@/lib/insights-widgets";

/** Load / persist Historical dashboard widgets per hierarchy entity. */
export function usePersistedWidgets(entityId: string) {
  const [widgets, setWidgets] = useState<InsightWidget[]>(() =>
    loadWidgets(entityId),
  );

  useEffect(() => {
    setWidgets(loadWidgets(entityId));
  }, [entityId]);

  function persist(next: InsightWidget[]) {
    setWidgets(next);
    saveWidgets(entityId, next);
  }

  function addWidget(title: string, prompt: string) {
    persist([...widgets, createCustomWidget(title, prompt)]);
  }

  function addSuggestion(suggestion: ChartSuggestion) {
    // Don't add the same chart twice
    if (widgets.some((w) => w.chartKey === suggestion.chartKey)) return;
    persist([...widgets, createWidgetFromSuggestion(suggestion)]);
  }

  function updateWidget(id: string, patch: Partial<InsightWidget>) {
    persist(widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }

  function removeWidget(id: string) {
    persist(widgets.filter((w) => w.id !== id));
  }

  function resetToDefaults() {
    persist(DEFAULT_HISTORICAL_WIDGETS.map((w) => ({ ...w })));
  }

  return {
    widgets,
    addWidget,
    addSuggestion,
    updateWidget,
    removeWidget,
    resetToDefaults,
  };
}

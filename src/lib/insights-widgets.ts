export type InsightsMode = "live" | "historical";

export type InsightWidgetKind =
  | "trend"
  | "comparison"
  | "summary"
  | "custom";

/** A saved chat-driven dashboard tile (Historical mode). */
export type InsightWidget = {
  id: string;
  title: string;
  /** Prompt AllyAI uses / user customized */
  prompt: string;
  kind: InsightWidgetKind;
  /** Which mock chart series to render (shadcn + Recharts) */
  chartKey?: string;
};

export type ChartSuggestion = {
  chartKey: string;
  title: string;
  prompt: string;
  kind: InsightWidgetKind;
};

export const DEFAULT_HISTORICAL_WIDGETS: InsightWidget[] = [
  {
    id: "rev-trend",
    title: "8-week revenue vs plan",
    prompt: "Show 8-week revenue vs plan with promo annotations for this entity.",
    kind: "trend",
    chartKey: "rev-trend",
  },
  {
    id: "gap-drivers",
    title: "Gap drivers over time",
    prompt: "Which issues drove Gap week-over-week for the last 8 weeks?",
    kind: "comparison",
    chartKey: "gap-drivers",
  },
  {
    id: "attainment",
    title: "Attainment trend",
    prompt: "Summarize attainment % trend and call out recovery or miss weeks.",
    kind: "summary",
    chartKey: "attainment",
  },
];

/** Suggested charts users can one-click add to the dashboard. */
export const CHART_SUGGESTIONS: ChartSuggestion[] = [
  {
    chartKey: "buy-box-win",
    title: "Buy Box win rate",
    prompt: "Track Buy Box win rate % over the last 8 weeks.",
    kind: "trend",
  },
  {
    chartKey: "media-vs-sales",
    title: "Media spend vs ad sales",
    prompt: "Compare weekly media spend to attributed ad sales.",
    kind: "comparison",
  },
  {
    chartKey: "conversion",
    title: "Conversion rate trend",
    prompt: "Show conversion rate (CVR) trend with miss weeks highlighted.",
    kind: "trend",
  },
  {
    chartKey: "oos-days",
    title: "Out-of-stock days",
    prompt: "How many OOS days did this entity see each week?",
    kind: "summary",
  },
];

const storageKey = (entityId: string) =>
  `alerts-v2:insights-widgets:${entityId}`;

export function loadWidgets(entityId: string): InsightWidget[] {
  if (typeof window === "undefined") return DEFAULT_HISTORICAL_WIDGETS;
  try {
    const raw = localStorage.getItem(storageKey(entityId));
    if (!raw) return DEFAULT_HISTORICAL_WIDGETS.map((w) => ({ ...w }));
    const parsed = JSON.parse(raw) as InsightWidget[];
    if (!Array.isArray(parsed)) {
      return DEFAULT_HISTORICAL_WIDGETS.map((w) => ({ ...w }));
    }
    return parsed;
  } catch {
    return DEFAULT_HISTORICAL_WIDGETS.map((w) => ({ ...w }));
  }
}

export function saveWidgets(entityId: string, widgets: InsightWidget[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(entityId), JSON.stringify(widgets));
}

export function createCustomWidget(
  title: string,
  prompt: string,
  extras?: { kind?: InsightWidgetKind; chartKey?: string },
): InsightWidget {
  return {
    id: `custom-${Date.now()}`,
    title: title.trim() || "Custom insight",
    prompt: prompt.trim() || "Describe what you want to track historically.",
    kind: extras?.kind ?? "custom",
    chartKey: extras?.chartKey,
  };
}

export function createWidgetFromSuggestion(
  suggestion: ChartSuggestion,
): InsightWidget {
  return {
    id: `${suggestion.chartKey}-${Date.now()}`,
    title: suggestion.title,
    prompt: suggestion.prompt,
    kind: suggestion.kind,
    chartKey: suggestion.chartKey,
  };
}

/** Snapshot = period metrics; Trends = over-time issue/performance widgets. */
export type InsightsMode = "live" | "historical";

export type InsightWidgetKind =
  | "trend"
  | "comparison"
  | "summary"
  | "custom";

/** A saved chat-driven dashboard tile (Trends mode). */
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

/** Defaults bias to issue + gap movement at this hierarchy level. */
export const DEFAULT_HISTORICAL_WIDGETS: InsightWidget[] = [
  {
    id: "issue-trends",
    title: "Issue trends over time",
    prompt:
      "How many SKUs at this level were hit by each issue week-over-week?",
    kind: "trend",
    chartKey: "issue-trends",
  },
  {
    id: "gap-drivers",
    title: "Gap $ by issue",
    prompt: "Which issues drove Gap $ week-over-week for this level?",
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

/** Suggested charts — issue / performance signals for this level. */
export const CHART_SUGGESTIONS: ChartSuggestion[] = [
  {
    chartKey: "buy-box-win",
    title: "Buy Box win rate",
    prompt: "Track Buy Box win rate % for SKUs at this level over time.",
    kind: "trend",
  },
  {
    chartKey: "rev-trend",
    title: "Revenue vs plan",
    prompt: "Show revenue vs plan with promo annotations for this level.",
    kind: "trend",
  },
  {
    chartKey: "conversion",
    title: "Conversion drop weeks",
    prompt: "Show conversion rate (CVR) trend and highlight miss weeks.",
    kind: "trend",
  },
  {
    chartKey: "oos-days",
    title: "Stock / OOS days",
    prompt: "How many out-of-stock days did this level see each week?",
    kind: "summary",
  },
  {
    chartKey: "media-vs-sales",
    title: "Media spend vs ad sales",
    prompt: "Compare weekly media spend to attributed ad sales at this level.",
    kind: "comparison",
  },
];

const storageKey = (entityId: string) =>
  `alerts-v2:insights-widgets:v2:${entityId}`;

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
    prompt: prompt.trim() || "Describe what issue or performance trend to track.",
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

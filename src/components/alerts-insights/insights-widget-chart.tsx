"use client";

import {
  AttainmentChart,
  BuyBoxWinChart,
  ConversionChart,
  GapDriversChart,
  IssueTrendsChart,
  MediaVsSalesChart,
  OosDaysChart,
  RevenueVsPlanChart,
} from "@/components/alerts-insights/insights-chart-variants";
import type { InsightWidget } from "@/lib/insights-widgets";

/** Picks the shadcn/Recharts chart for a Trends widget. */
export function InsightsWidgetChart({ widget }: { widget: InsightWidget }) {
  const key = widget.chartKey ?? widget.id;

  if (key === "issue-trends" || key.startsWith("issue-")) {
    return <IssueTrendsChart />;
  }
  if (key === "rev-trend" || key.startsWith("rev-")) return <RevenueVsPlanChart />;
  if (key === "gap-drivers" || key.startsWith("gap-")) return <GapDriversChart />;
  if (key === "attainment" || key.startsWith("att-")) return <AttainmentChart />;
  if (key === "buy-box-win") return <BuyBoxWinChart />;
  if (key === "media-vs-sales") return <MediaVsSalesChart />;
  if (key === "conversion") return <ConversionChart />;
  if (key === "oos-days") return <OosDaysChart />;

  // Freeform custom widgets — show issue trends as a generic placeholder
  return <IssueTrendsChart />;
}

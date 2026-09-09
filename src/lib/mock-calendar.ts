/**
 * Shared prototype calendar — one “now” so every screen agrees.
 *
 * Mock today: Friday Aug 21, 2026
 * Last week (Sun–Sat): Aug 9–15  ← Gap to Plan / period badges
 * Prior week: Aug 2–8
 * Current week: Aug 16–22
 */

/** Instant used for Lost At windows, CSV “since”, crawl relative times */
export const MOCK_NOW = new Date("2026-08-21T18:00:00");

/** Short range on period chips — Last week */
export const LAST_WEEK_RANGE_LABEL = "Aug 9–15";

/** KPI / header copy */
export const LAST_WEEK_KPI_TITLE = "Last Week (Aug 9–15)";
export const WTD_KPI_TITLE = "WTD (Aug 16–21)";
export const EOW_KPI_TITLE = "Projected EOW (Aug 16–22)";

/** Portfolio hero under “Week to date” */
export const PORTFOLIO_WTD_RANGE = "Mon Aug 17 – Fri Aug 21";

/** Full RCA / Gap to Plan week labels */
export const FULL_RCA_WEEK_LABEL = "Week of Aug 9–15, 2026";
export const FULL_RCA_PRIOR_WEEK_RANGE = "Aug 2–8";
export const FULL_RCA_THIS_WEEK_RANGE = "Aug 16–21";

/**
 * Overall portfolio last-week performance — single source for
 * taxonomy KPI tiles and Gap to Plan RCA (same metrics must match).
 */
export const OVERALL_LAST_WEEK = {
  planDollars: 23_100_000,
  actualDollars: 11_800_000,
  gapDollars: -12_300_000,
  attainmentPct: 51.0,
} as const;

/** Overall WTD / EOW anchors used on taxonomy KPI tiles */
export const OVERALL_WTD = {
  salesDollars: 5_000_000,
  weekElapsedPct: 49.2,
} as const;

export const OVERALL_EOW = {
  projectedGapVsPlan: 3_200_000,
  projectedSalesDollars: 26_400_000,
  attainmentPct: 114.0,
} as const;

/** Prior week (Aug 2–8) — used in Gap to Plan period table / equation */
export const OVERALL_PRIOR_WEEK = {
  planDollars: 22_000_000,
  actualDollars: 17_600_000,
  gapDollars: -4_400_000,
  attainmentPct: 80.0,
} as const;

/**
 * Portfolio gap used to scale brand/category KPI tiles + Gap to Plan RCA.
 * Must stay in sync with `portfolioGap.gapDollars` in mock-alerts-insights.
 */
export const TAXONOMY_SCALE_GAP_REF = 4_200_000;

export type ScaledLastWeekPerformance = {
  planDollars: number;
  actualDollars: number;
  gapDollars: number;
  attainmentPct: number;
  priorPlanDollars: number;
  priorActualDollars: number;
  priorGapDollars: number;
  wtdSalesDollars: number;
  weekElapsedPct: number;
  eowProjectedGapVsPlan: number;
  eowProjectedSalesDollars: number;
  eowAttainmentPct: number;
  scale: number;
};

/** Same scale math for taxonomy KPI tiles and Gap to Plan Plan vs Actual. */
export function getScaledLastWeekPerformance(
  level: "overall" | "brand" | "category" | "sku",
  entityGapDollars?: number,
): ScaledLastWeekPerformance {
  const scale =
    level === "overall" || entityGapDollars == null
      ? 1
      : Math.min(
          1,
          Math.max(0.004, Math.abs(entityGapDollars) / TAXONOMY_SCALE_GAP_REF),
        );

  return {
    planDollars: OVERALL_LAST_WEEK.planDollars * scale,
    actualDollars: OVERALL_LAST_WEEK.actualDollars * scale,
    gapDollars: OVERALL_LAST_WEEK.gapDollars * scale,
    attainmentPct: OVERALL_LAST_WEEK.attainmentPct,
    priorPlanDollars: OVERALL_PRIOR_WEEK.planDollars * scale,
    priorActualDollars: OVERALL_PRIOR_WEEK.actualDollars * scale,
    priorGapDollars: OVERALL_PRIOR_WEEK.gapDollars * scale,
    wtdSalesDollars: OVERALL_WTD.salesDollars * scale,
    weekElapsedPct: OVERALL_WTD.weekElapsedPct,
    eowProjectedGapVsPlan: OVERALL_EOW.projectedGapVsPlan * scale,
    eowProjectedSalesDollars: OVERALL_EOW.projectedSalesDollars * scale,
    eowAttainmentPct: OVERALL_EOW.attainmentPct,
    scale,
  };
}

export type ScaledPerformanceKpiCard = {
  id: string;
  title: string;
  value: string;
  tone: "negative" | "positive" | "neutral";
  subtitle: string;
};

function formatKpiMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(1)}K`;
  return `$${Math.round(abs).toLocaleString("en-US")}`;
}

function formatKpiSignedMoney(value: number): string {
  const body = formatKpiMoney(value);
  if (value > 0) return `+${body}`;
  if (value < 0) return `−${body}`;
  return body;
}

/** KPI tile rows — shared by taxonomy Overall/Brand/Category and SKU RCA. */
export function buildScaledPerformanceKpiCards(
  perf: ScaledLastWeekPerformance,
): ScaledPerformanceKpiCard[] {
  const gapTone =
    perf.gapDollars < 0
      ? "negative"
      : perf.gapDollars > 0
        ? "positive"
        : "neutral";
  const eowTone =
    perf.eowProjectedGapVsPlan < 0
      ? "negative"
      : perf.eowProjectedGapVsPlan > 0
        ? "positive"
        : "neutral";

  return [
    {
      id: "last-week",
      title: LAST_WEEK_KPI_TITLE,
      value: formatKpiSignedMoney(perf.gapDollars),
      tone: gapTone,
      subtitle: `${formatKpiMoney(perf.actualDollars)} of ${formatKpiMoney(perf.planDollars)} plan · ${perf.attainmentPct.toFixed(1)}% attainment`,
    },
    {
      id: "wtd",
      title: WTD_KPI_TITLE,
      value: formatKpiMoney(perf.wtdSalesDollars),
      tone: "neutral",
      subtitle: `in sales · ${perf.weekElapsedPct.toFixed(1)}% of week elapsed`,
    },
    {
      id: "eow",
      title: EOW_KPI_TITLE,
      value: `${formatKpiSignedMoney(perf.eowProjectedGapVsPlan)} vs plan`,
      tone: eowTone,
      subtitle: `${formatKpiMoney(perf.planDollars)} plan · ${formatKpiMoney(perf.eowProjectedSalesDollars)} projected · ${perf.eowAttainmentPct.toFixed(1)}%`,
    },
  ];
}

/** 7-day scrape grid for last week (Sun → Sat) */
export const SCRAPE_HISTORY_DAY_LABELS = [
  "SUN 08/09",
  "MON 08/10",
  "TUE 08/11",
  "WED 08/12",
  "THU 08/13",
  "FRI 08/14",
  "SAT 08/15",
] as const;

/** Shared last-7-day trend columns (Aug 9–15) */
export const LAST_WEEK_TREND_DAYS = [
  { id: "d0", dateLabel: "Aug 9", dayLabel: "Sun" },
  { id: "d1", dateLabel: "Aug 10", dayLabel: "Mon" },
  { id: "d2", dateLabel: "Aug 11", dayLabel: "Tue" },
  { id: "d3", dateLabel: "Aug 12", dayLabel: "Wed" },
  { id: "d4", dateLabel: "Aug 13", dayLabel: "Thu" },
  { id: "d5", dateLabel: "Aug 14", dayLabel: "Fri" },
  { id: "d6", dateLabel: "Aug 15", dayLabel: "Sat" },
] as const;

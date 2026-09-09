import type { IssueSku } from "@/lib/mock-alerts-insights";
import {
  FULL_RCA_PRIOR_WEEK_RANGE,
  FULL_RCA_THIS_WEEK_RANGE,
  FULL_RCA_WEEK_LABEL,
  LAST_WEEK_RANGE_LABEL,
  OVERALL_LAST_WEEK,
  OVERALL_PRIOR_WEEK,
  OVERALL_WTD,
  getScaledLastWeekPerformance,
  type ScaledLastWeekPerformance,
} from "@/lib/mock-calendar";

/** Status badge on a root-cause row — kept for older call sites if any */
export type FullRcaCauseStatus =
  | "still-an-issue"
  | "resolved"
  | "worth-watching";

/** Confidence / priority chip next to status */
export type FullRcaCauseTag = "primary" | "unconfirmed";

/** Tone for the Change column — drives red / green text */
export type FullRcaChangeTone = "negative" | "positive" | "neutral";

export type FullRcaTableColumn = {
  key: string;
  label: string;
  /**
   * Optional second line under the label (muted).
   * Used for week headers: primary date + “Week of”.
   */
  sublabel?: string;
  /** First column is the row label; others are numeric/compare */
  align?: "left" | "right";
};

export type FullRcaTableCell = {
  text: string;
  tone?: FullRcaChangeTone;
};

export type FullRcaTableRow = {
  id: string;
  label: string;
  cells: FullRcaTableCell[];
};

export type FullRcaCompareTable = {
  columns: FullRcaTableColumn[];
  rows: FullRcaTableRow[];
};

export type FullRcaCallout = {
  /** Bold lead-in e.g. "Finding:" or "Action required:" */
  label: string;
  body: string;
};

export type FullRcaRecommendation = {
  id: string;
  title: string;
  description: string;
};

/** One Top Issues card in the Gap to Plan report */
export type FullRcaRootCause = {
  id: string;
  title: string;
  /** Expanded narrative under the title */
  body: string;
  /** Header status pill — Still an Issue / Resolved */
  status: FullRcaCauseStatus;
};

export type FullRcaWeekPoint = {
  week: string;
  /** Plan $ (absolute dollars) */
  plan: number;
  /** Actual revenue $ (absolute dollars) */
  actual: number;
};

/** Recent Trend — 8 Weeks accordion */
export type FullRcaRevenueTrend = {
  series: FullRcaWeekPoint[];
  narrative: string;
  /** Y-axis max in dollars. Default matches Prime Day–scale SKU charts. */
  yMax?: number;
  yTicks?: number[];
};

/** Plan vs Actual accordion — summary strip + period rows + narrative */
export type FullRcaPlanVsActual = {
  summary: {
    plan: string;
    actual: string;
    gap: string;
    attainment: string;
  };
  /** Caption above the four-up (e.g. “Last week: Aug 30 – Sep 5”) */
  summaryCaption?: string;
  summaryLabels?: {
    plan?: string;
    actual?: string;
  };
  /** Image order: Actual, Plan, Gap, Attainment */
  leadWithActual?: boolean;
  rows: Array<{
    id: string;
    period: string;
    actual: string;
    plan: string;
    gap: string;
  }>;
  narrative: string;
};

/** Ecommerce Equation accordion — summary strip + lever table + narrative */
export type FullRcaEcommerceEquation = {
  summary: {
    skusBehindPlan: string;
    skusAheadOfPlan: string;
    biggestMover: string;
    primaryLever: string;
  };
  summaryLabels?: {
    biggestMover?: string;
    primaryLever?: string;
  };
  metricColumnLabel?: string;
  priorWeekLabel: string;
  currentWeekLabel: string;
  /** Image order: Focal week, then prior week */
  currentWeekFirst?: boolean;
  rows: Array<{
    id: string;
    metric: string;
    priorWeek: string;
    currentWeek: string;
  }>;
  narrative: string;
};

/** Where Gap to Plan was run — drives the report header copy. */
export type FullRcaScopeLevel = "sku" | "overall" | "brand" | "category";

export type FullRcaReportContext = {
  level: FullRcaScopeLevel;
  /** Overall / brand / category name from the taxonomy tree */
  entityName?: string;
  /**
   * Taxonomy node gap $ — scales Plan vs Actual to match KPI tiles
   * (same formula as buildTaxonomyPerformanceKpis).
   */
  entityGapDollars?: number;
};

export type FullRcaReportData = {
  asin: string;
  brand: string;
  /** Taxonomy level this report was generated for */
  level: FullRcaScopeLevel;
  weekLabel: string;
  periodLabel: string;
  /** Card title — portfolio/brand/category Gap to Plan, or ASIN line for SKU */
  headerTitle: string;
  /** Card subtitle — comparison period / scope line */
  headerSubtitle: string;
  keyFinding: string;
  planVsActual: FullRcaPlanVsActual;
  ecommerceEquation: FullRcaEcommerceEquation;
  revenueTrend: FullRcaRevenueTrend;
  rootCauses: FullRcaRootCause[];
  recommendations: FullRcaRecommendation[];
};

/** Analysis week + prior week (matches design reference). */
const WEEK_LABEL = FULL_RCA_WEEK_LABEL;
const PRIOR_WEEK_RANGE = FULL_RCA_PRIOR_WEEK_RANGE;

type FullRcaBody = Omit<
  FullRcaReportData,
  | "asin"
  | "brand"
  | "headerTitle"
  | "headerSubtitle"
  | "weekLabel"
  | "periodLabel"
  | "level"
>;

function buildReportHeader(
  sku: IssueSku,
  context?: FullRcaReportContext,
): Pick<
  FullRcaReportData,
  "headerTitle" | "headerSubtitle" | "weekLabel" | "periodLabel"
> {
  const level = context?.level ?? "sku";
  // Prefer the taxonomy name you clicked (Floor Care, CleanPro, Overall, …)
  const entity =
    context?.entityName?.trim() ||
    (level === "category" ? sku.category : undefined) ||
    sku.brand;

  if (level === "overall") {
    return {
      weekLabel: WEEK_LABEL,
      periodLabel: "last week",
      headerTitle: `Portfolio Gap to Plan — ${WEEK_LABEL}`,
      headerSubtitle: `Overall portfolio vs. comparison week (${PRIOR_WEEK_RANGE})`,
    };
  }

  if (level === "brand") {
    return {
      weekLabel: WEEK_LABEL,
      periodLabel: "last week",
      headerTitle: `${entity} Brand — Gap to plan analysis`,
      headerSubtitle: `${entity} vs. prior week (${PRIOR_WEEK_RANGE})`,
    };
  }

  if (level === "category") {
    return {
      weekLabel: WEEK_LABEL,
      periodLabel: "last week",
      headerTitle: `${entity} — Gap to plan analysis`,
      headerSubtitle: `${entity} vs. prior week (${PRIOR_WEEK_RANGE})`,
    };
  }

  // SKU / issue detail — keep ASIN framing
  return {
    weekLabel: WEEK_LABEL,
    periodLabel: "last week",
    headerTitle: `Amazon RCA · ASIN ${sku.asin}`,
    headerSubtitle: `${sku.brand} · ${WEEK_LABEL} · last week`,
  };
}

function formatCompactMoney(value: number, opts?: { signed?: boolean }): string {
  const abs = Math.abs(value);
  const body =
    abs >= 1_000_000
      ? `$${(abs / 1_000_000).toFixed(1)}M`
      : abs >= 1_000
        ? `$${(abs / 1_000).toFixed(1)}K`
        : `$${Math.round(abs).toLocaleString("en-US")}`;
  if (!opts?.signed) return body;
  if (value < 0) return `−${body}`;
  if (value > 0) return `+${body}`;
  return body;
}

function formatExactDollars(value: number): string {
  const abs = Math.abs(value);
  const body = `$${Math.round(abs).toLocaleString("en-US")}`;
  if (value < 0) return `−${body}`;
  return body;
}

/** Shared Plan vs Actual chrome — same labels at Overall / Brand / Category / SKU. */
function withConsistentPlanVsActualLabels(
  data: FullRcaPlanVsActual,
): FullRcaPlanVsActual {
  return {
    ...data,
    summaryCaption: `Last week: ${LAST_WEEK_RANGE_LABEL}`,
    summaryLabels: {
      actual: "Actual (Last Week)",
      plan: "Plan (Last Week)",
    },
    leadWithActual: true,
  };
}

/** Plan vs Actual built from the same anchors as taxonomy KPI tiles. */
function buildPlanVsActualFromPerformance(
  perf: ScaledLastWeekPerformance,
): FullRcaPlanVsActual {
  return withConsistentPlanVsActualLabels({
    summary: {
      plan: formatCompactMoney(perf.planDollars),
      actual: formatCompactMoney(perf.actualDollars),
      gap: formatCompactMoney(perf.gapDollars, { signed: true }),
      attainment: `${perf.attainmentPct.toFixed(1)}%`,
    },
    rows: [
      {
        id: "last-week",
        period: `${LAST_WEEK_RANGE_LABEL} (last week)`,
        actual: formatExactDollars(perf.actualDollars),
        plan: formatExactDollars(perf.planDollars),
        gap: formatExactDollars(perf.gapDollars),
      },
      {
        id: "week-before",
        period: `${PRIOR_WEEK_RANGE} (week before)`,
        actual: formatExactDollars(perf.priorActualDollars),
        plan: formatExactDollars(perf.priorPlanDollars),
        gap: formatExactDollars(perf.priorGapDollars),
      },
      {
        id: "this-week",
        period: `${FULL_RCA_THIS_WEEK_RANGE} (this week so far)`,
        actual: formatExactDollars(perf.wtdSalesDollars),
        plan: "—",
        gap: "—",
      },
    ],
    narrative: `Last week: ${formatCompactMoney(perf.gapDollars, { signed: true })} gap (${perf.attainmentPct.toFixed(1)}% attainment) vs ${formatCompactMoney(perf.priorGapDollars, { signed: true })} the week before. Plan moved from ${formatCompactMoney(perf.priorPlanDollars)} to ${formatCompactMoney(perf.planDollars)} while actual moved from ${formatCompactMoney(perf.priorActualDollars)} to ${formatCompactMoney(perf.actualDollars)}. This week so far shows ${formatCompactMoney(perf.wtdSalesDollars)} in sales (${perf.weekElapsedPct.toFixed(1)}% of the week elapsed).`,
  });
}

/** Keep ecommerce Revenue / Plan rows in lockstep with Plan vs Actual. */
function syncEquationRevenuePlanRows(
  equation: FullRcaEcommerceEquation,
  perf: ScaledLastWeekPerformance,
): FullRcaEcommerceEquation {
  const rows = equation.rows.map((row) => {
    if (row.id === "revenue" || row.metric === "Revenue") {
      return {
        ...row,
        priorWeek: formatExactDollars(perf.priorActualDollars),
        currentWeek: formatExactDollars(perf.actualDollars),
      };
    }
    if (row.id === "plan" || row.metric === "Plan") {
      return {
        ...row,
        priorWeek: formatExactDollars(perf.priorPlanDollars),
        currentWeek: formatExactDollars(perf.planDollars),
      };
    }
    return row;
  });
  return { ...equation, rows };
}

/** Build evenly spaced Y ticks for a given max (includes 0). */
function buildYAxisTicks(yMax: number): number[] {
  if (yMax <= 0) return [0];
  const rough = yMax;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const stepNorm =
    normalized <= 1.2
      ? 0.2
      : normalized <= 2.5
        ? 0.5
        : normalized <= 5
          ? 1
          : normalized <= 8
            ? 1
            : 2;
  const step = stepNorm * magnitude;
  const niceMax = Math.ceil(rough / step) * step;
  const ticks: number[] = [];
  for (let value = 0; value <= niceMax + step / 2; value += step) {
    ticks.push(Math.round(value));
  }
  return ticks;
}

/**
 * Realistic 8-week plan vs actual series ending on the shared last/prior week
 * anchors — visible WoW swings, one beat week, then a widening miss.
 */
function buildScaledRevenueTrend(
  perf: ScaledLastWeekPerformance,
): FullRcaRevenueTrend {
  const runRate = Math.max(perf.priorPlanDollars, perf.planDollars, 1);
  // Shape as multipliers of run-rate so every level (Overall → SKU) keeps motion
  const early: Array<{ week: string; plan: number; actual: number }> = [
    { week: "Jun 21", plan: 1.12, actual: 1.28 }, // event lift
    { week: "Jun 28", plan: 1.08, actual: 0.94 }, // lead-out miss
    { week: "Jul 5", plan: 1.02, actual: 0.9 },
    { week: "Jul 12", plan: 0.96, actual: 0.98 }, // only beat
    { week: "Jul 19", plan: 0.98, actual: 0.86 }, // demand dip
    { week: "Jul 26", plan: 1.0, actual: 0.88 },
  ];

  const series: FullRcaWeekPoint[] = [
    ...early.map((point) => ({
      week: point.week,
      plan: Math.round(runRate * point.plan),
      actual: Math.round(runRate * point.actual),
    })),
    {
      week: "Aug 2",
      plan: Math.round(perf.priorPlanDollars),
      actual: Math.round(perf.priorActualDollars),
    },
    {
      week: "Aug 9",
      plan: Math.round(perf.planDollars),
      actual: Math.round(perf.actualDollars),
    },
  ];

  const peak = Math.max(...series.map((p) => Math.max(p.plan, p.actual)));
  const yMax = Math.ceil(peak * 1.12);
  const yTicks = buildYAxisTicks(yMax);

  return {
    series,
    yMax,
    yTicks,
    narrative: `Jul 12 was the only recent week to beat plan. From Jul 19 onward the view stayed under plan. Aug 2 closed at ${formatCompactMoney(perf.priorActualDollars)} vs a ${formatCompactMoney(perf.priorPlanDollars)} plan (${formatCompactMoney(perf.priorGapDollars, { signed: true })}). Aug 9–15 is the deepest miss in the window — ${formatCompactMoney(perf.actualDollars)} actual vs ${formatCompactMoney(perf.planDollars)} plan (${formatCompactMoney(perf.gapDollars, { signed: true })}, ${perf.attainmentPct.toFixed(1)}% attainment).`,
  };
}

function applyTaxonomyPerformanceAnchors(
  body: FullRcaBody,
  perf: ScaledLastWeekPerformance,
): FullRcaBody {
  return {
    ...body,
    planVsActual: buildPlanVsActualFromPerformance(perf),
    ecommerceEquation: syncEquationRevenuePlanRows(body.ecommerceEquation, perf),
    revenueTrend: buildScaledRevenueTrend(perf),
  };
}

/** Portfolio roll-up — numbers shared with Overall taxonomy KPI tiles. */
function buildOverallReportBody(): FullRcaBody {
  const last = OVERALL_LAST_WEEK;
  const prior = OVERALL_PRIOR_WEEK;
  const wtd = OVERALL_WTD;
  const perf = getScaledLastWeekPerformance("overall");

  return {
    keyFinding:
      `The overall portfolio recorded ${formatCompactMoney(last.actualDollars)} in actual sales against a ${formatCompactMoney(last.planDollars)} plan last week (${LAST_WEEK_RANGE_LABEL}) — a ${formatCompactMoney(last.gapDollars, { signed: true })} miss (${last.attainmentPct.toFixed(1)}% attainment). That's a sharp deterioration from the prior week (${PRIOR_WEEK_RANGE}), when the gap was ${formatCompactMoney(prior.gapDollars, { signed: true })}. PlayMax was the single biggest drag at about −$8.2M under plan, CleanPro followed at about −$5.3M, while KitchenPro partially offset at about +$1.2M. The overall number hides SKU-level pressure: 38 SKUs are behind plan by a combined −$18.5M, offset by 14 SKUs ahead by +$6.2M.`,
    planVsActual: {
      summary: {
        plan: formatCompactMoney(last.planDollars),
        actual: formatCompactMoney(last.actualDollars),
        gap: formatCompactMoney(last.gapDollars, { signed: true }),
        attainment: `${last.attainmentPct.toFixed(1)}%`,
      },
      summaryCaption: `Last week: ${LAST_WEEK_RANGE_LABEL}`,
      summaryLabels: {
        actual: "Actual (Last Week)",
        plan: "Plan (Last Week)",
      },
      leadWithActual: true,
      rows: [
        {
          id: "last-week",
          period: `${LAST_WEEK_RANGE_LABEL} (last week)`,
          actual: formatExactDollars(last.actualDollars),
          plan: formatExactDollars(last.planDollars),
          gap: formatExactDollars(last.gapDollars),
        },
        {
          id: "week-before",
          period: `${PRIOR_WEEK_RANGE} (week before)`,
          actual: formatExactDollars(prior.actualDollars),
          plan: formatExactDollars(prior.planDollars),
          gap: formatExactDollars(prior.gapDollars),
        },
        {
          id: "this-week",
          period: `${FULL_RCA_THIS_WEEK_RANGE} (this week so far)`,
          actual: formatExactDollars(wtd.salesDollars),
          plan: "—",
          gap: "—",
        },
      ],
      narrative:
        `Last week: ${formatCompactMoney(last.gapDollars, { signed: true })} gap (${last.attainmentPct.toFixed(1)}% attainment) vs ${formatCompactMoney(prior.gapDollars, { signed: true })} the week before. Plan stepped up from ${formatCompactMoney(prior.planDollars)} to ${formatCompactMoney(last.planDollars)} while actual fell from ${formatCompactMoney(prior.actualDollars)} to ${formatCompactMoney(last.actualDollars)} — both a demand miss and a higher target. This week so far shows ${formatCompactMoney(wtd.salesDollars)} in sales (${wtd.weekElapsedPct.toFixed(1)}% of the week elapsed).`,
    },
    ecommerceEquation: {
      summary: {
        skusBehindPlan: "38 / −$18.5M",
        skusAheadOfPlan: "14 / +$6.2M",
        biggestMover: "PlayMax −$8.2M",
        primaryLever: "3.29% (from 3.41%)",
      },
      summaryLabels: {
        biggestMover: "Biggest driver (WoW)",
        primaryLever: "Conversion rate",
      },
      metricColumnLabel: "Driver",
      priorWeekLabel: "Prior Week",
      currentWeekLabel: "Focal Week",
      currentWeekFirst: true,
      rows: [
        {
          id: "revenue",
          metric: "Revenue",
          priorWeek: formatExactDollars(prior.actualDollars),
          currentWeek: formatExactDollars(last.actualDollars),
        },
        {
          id: "plan",
          metric: "Plan",
          priorWeek: formatExactDollars(prior.planDollars),
          currentWeek: formatExactDollars(last.planDollars),
        },
        {
          id: "pdp-views",
          metric: "PDP Views",
          priorWeek: "5,784,675",
          currentWeek: "5,883,648",
        },
        {
          id: "cvr",
          metric: "Conversion Rate",
          priorWeek: "3.41%",
          currentWeek: "3.29%",
        },
        {
          id: "asp",
          metric: "Avg Selling Price (ASP)",
          priorWeek: "$137.81",
          currentWeek: "$135.07",
        },
      ],
      narrative:
        "Traffic rose slightly last week (+99K views), so volume wasn't the full story. Conversion slipped from 3.41% to 3.29% and ASP dropped from $137.81 to $135.07 — together explaining most of the revenue decline from the prior week. The shortfall is concentrated: 38 SKUs are behind plan at a combined −$18.5M, partially offset by 14 SKUs ahead at +$6.2M (net −$12.3M, matching the portfolio gap).",
    },
    revenueTrend: buildScaledRevenueTrend(perf),
    rootCauses: [
      {
        id: "playmax",
        title:
          "PlayMax finished about −$8.2M under plan — the largest brand shortfall",
        body: "Controllers and Headsets dominate the PlayMax miss. Keyword rank and share-of-voice losses after media cuts are the primary story — dig into those category Gap to Plans before the swing compounds.",
        status: "still-an-issue",
      },
      {
        id: "cleanpro",
        title:
          "CleanPro finished about −$5.3M under plan, concentrated in floor care",
        body: "Floor Care Robotics flipped into a deep miss as Buy Box losses piled up on robot vacuums. Confirm whether a deal or promo window ended between Aug 2–8 and Aug 9–15.",
        status: "still-an-issue",
      },
      {
        id: "kitchenpro",
        title:
          "KitchenPro stays ahead at about +$1.2M and partially offsets, but cannot cover PlayMax + CleanPro",
        body: "Kitchen Appliances and Blenders remain the bright spots. Use KitchenPro strength in portfolio rollups, but do not treat it as a fix for the two brands driving the miss.",
        status: "resolved",
      },
    ],
    recommendations: [
      {
        id: "playmax-deep-dive",
        title: "Run a brand deep dive on PlayMax",
        description:
          "PlayMax is carrying the largest dollar shortfall in the portfolio last week — identifying which categories and SKUs are driving the ~−$8.2M miss is the highest-priority next step.",
      },
      {
        id: "conversion-decline",
        title: "Investigate the portfolio-wide conversion decline",
        description:
          "Conversion slipped from 3.41% (prior week) to 3.29% last week while traffic grew slightly — diagnose at the category level (Controllers, Floor Care Robotics) before the gap compounds further.",
      },
      {
        id: "cleanpro-floor-care",
        title: "Run a category Gap to Plan on Floor Care Robotics",
        description:
          "CleanPro's miss is concentrated in floor care. Confirm Buy Box, deal badge, and media spend on the highest-OPS ASINs before treating the brand recovery as durable.",
      },
    ],
  };
}

/** Brand roll-up — category flips, brand traffic/price, brand-scoped next steps. */
function buildBrandReportBody(entityName: string): FullRcaBody {
  const brand = entityName.trim() || "Brand";
  const isCleanPro = /cleanpro/i.test(brand);
  const isPlayMax = /playmax/i.test(brand);
  const isKitchenPro = /kitchenpro/i.test(brand);

  if (isPlayMax) {
    return {
      keyFinding:
        "PlayMax’s gap deepened from −$1.9M to −$2.8M week over week. Controllers (−$1.45M) and Headsets (−$780K) dominate — keyword rank and share-of-voice losses after media cuts are the primary story, not a plan reset.",
      planVsActual: {
        summary: {
          plan: "$11.7M",
          actual: "$8.9M",
          gap: "−$2.8M",
          attainment: "76.0%",
        },
        rows: [
          {
            id: "last-week",
            period: "Aug 9–15 (last week)",
            actual: "$8,900,000",
            plan: "$11,700,000",
            gap: "−$2,800,000",
          },
          {
            id: "week-before",
            period: "Aug 2–8 (week before)",
            actual: "$9,650,000",
            plan: "$11,550,000",
            gap: "−$1,900,000",
          },
          {
            id: "this-week",
            period: "Aug 16–21 (this week so far)",
            actual: "—",
            plan: "—",
            gap: "—",
          },
        ],
        narrative:
          "Gap widened −$1.9M → −$2.8M WoW on a flat plan. Attainment: 76%.",
      },
      ecommerceEquation: {
        summary: {
          skusBehindPlan: "38 / −$3.1M",
          skusAheadOfPlan: "11 / +$310K",
          biggestMover: "Controllers −$420K WoW",
          primaryLever: "Traffic & keyword rank",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: "$9,650,000",
            currentWeek: "$8,900,000",
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: "$11,550,000",
            currentWeek: "$11,700,000",
          },
          {
            id: "page-views",
            metric: "Page Views",
            priorWeek: "1,842,000",
            currentWeek: "1,510,000",
          },
          {
            id: "cvr",
            metric: "Conversion Rate",
            priorWeek: "4.12%",
            currentWeek: "4.05%",
          },
          {
            id: "asp",
            metric: "Avg Selling Price",
            priorWeek: "$48.20",
            currentWeek: "$47.90",
          },
        ],
        narrative:
          "Traffic did most of the damage — PDP views fell ~18% WoW after media and keyword-rank losses. Conversion and ASP held nearly flat, so the Gap is a traffic story concentrated in Controllers and Headsets.",
      },
      revenueTrend: {
        series: [
          { week: "Jun 21", plan: 14_200_000, actual: 22_400_000 },
          { week: "Jun 28", plan: 13_800_000, actual: 12_100_000 },
          { week: "Jul 5", plan: 12_900_000, actual: 11_200_000 },
          { week: "Jul 12", plan: 12_100_000, actual: 11_800_000 },
          { week: "Jul 19", plan: 12_400_000, actual: 10_600_000 },
          { week: "Jul 26", plan: 12_200_000, actual: 10_900_000 },
          { week: "Aug 2", plan: 11_550_000, actual: 9_650_000 },
          { week: "Aug 9", plan: 11_700_000, actual: 8_900_000 },
        ],
        narrative:
          "Post–Prime Day, PlayMax settled below plan and the miss widened into August. Controllers remain the heaviest drag; Headsets deteriorated after SOV dropped on top keywords.",
      },
      rootCauses: [
        {
          id: "controllers",
          title:
            "Controllers are −$1.45M vs plan — competitive pricing and keyword rank losses are the top drivers",
          body: "Rank losses on hero keywords after media cuts pulled traffic off Controllers PDPs. Run a category Gap to Plan and restore coverage on the highest-OPS ASINs first.",
        status: "still-an-issue",
        },
        {
          id: "headsets",
          title:
            "Headsets are −$780K as share of voice dropped on top keywords after media cuts",
          body: "SOV and traffic moved together. Confirm whether spend was cut intentionally or lost to auction pressure before restoring budget.",
        status: "still-an-issue",
        },
        {
          id: "charging",
          title:
            "Charging & Cables (−$420K) show ASP pressure from 3P sellers",
          body: "Bundle attach rates are soft and 3P pricing is undercutting. Worth watching, but Controllers and Headsets are the priority dollar levers.",
        status: "still-an-issue",
        },
      ],
      recommendations: [
        {
          id: "controllers-gtp",
          title: "Run a category gap to plan on Controllers",
          description:
            "Controllers alone are −$1.45M — identify which ASINs lost keyword rank and whether media spend recovered on the hero SKUs.",
        },
        {
          id: "restore-sov",
          title: "Restore share of voice on Headsets hero keywords",
          description:
            "SOV dropped after last week’s media cut and is tied directly to the −$780K Headsets miss.",
        },
        {
          id: "controller-skus",
          title: "Diagnose PlayMax Controllers Bundle (B04MNO1122) first",
          description:
            "Highest-visibility Controllers ASIN with an active Buy Box loss — confirm price vs 3P and whether rank recovered after spend changes.",
        },
      ],
    };
  }

  if (isKitchenPro) {
    return {
      keyFinding:
        "KitchenPro is ahead of plan at +$400K (104% attainment). Kitchen Appliances lead the win; cookware is flat-positive. Use this strength to offset CleanPro and PlayMax misses in portfolio rollups — not as a reason to ignore those brands.",
      planVsActual: {
        summary: {
          plan: "$9.6M",
          actual: "$10.0M",
          gap: "+$400K",
          attainment: "104.2%",
        },
        rows: [
          {
            id: "last-week",
            period: "Aug 9–15 (last week)",
            actual: "$10,000,000",
            plan: "$9,600,000",
            gap: "+$400,000",
          },
          {
            id: "week-before",
            period: "Aug 2–8 (week before)",
            actual: "$9,820,000",
            plan: "$9,550,000",
            gap: "+$270,000",
          },
          {
            id: "this-week",
            period: "Aug 16–21 (this week so far)",
            actual: "—",
            plan: "—",
            gap: "—",
          },
        ],
        narrative:
          "Beat widened +$270K → +$400K WoW. Attainment: 104%.",
      },
      ecommerceEquation: {
        summary: {
          skusBehindPlan: "9 / −$180K",
          skusAheadOfPlan: "22 / +$580K",
          biggestMover: "Kitchen Appliances +$95K WoW",
          primaryLever: "Conversion",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: "$9,820,000",
            currentWeek: "$10,000,000",
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: "$9,550,000",
            currentWeek: "$9,600,000",
          },
          {
            id: "page-views",
            metric: "Page Views",
            priorWeek: "980,000",
            currentWeek: "1,015,000",
          },
          {
            id: "cvr",
            metric: "Conversion Rate",
            priorWeek: "3.55%",
            currentWeek: "3.72%",
          },
          {
            id: "asp",
            metric: "Avg Selling Price",
            priorWeek: "$89.40",
            currentWeek: "$90.10",
          },
        ],
        narrative:
          "Traffic, conversion, and ASP all moved slightly in KitchenPro’s favor. The beat is broad across Kitchen Appliances and Blenders — keep Buy Box and promo coverage intact so the offset holds.",
      },
      revenueTrend: {
        series: [
          { week: "Jun 21", plan: 11_200_000, actual: 18_500_000 },
          { week: "Jun 28", plan: 10_800_000, actual: 10_200_000 },
          { week: "Jul 5", plan: 10_100_000, actual: 9_900_000 },
          { week: "Jul 12", plan: 9_700_000, actual: 10_050_000 },
          { week: "Jul 19", plan: 9_800_000, actual: 9_750_000 },
          { week: "Jul 26", plan: 9_700_000, actual: 9_900_000 },
          { week: "Aug 2", plan: 9_550_000, actual: 9_820_000 },
          { week: "Aug 9", plan: 9_600_000, actual: 10_000_000 },
        ],
        narrative:
          "After Prime Day, KitchenPro returned to a steady beat. Jul 12 onward shows consistent attainment above plan — protect conversion and Buy Box rather than chasing growth experiments this week.",
      },
      rootCauses: [
        {
          id: "appliances-win",
          title:
            "Kitchen Appliances (+$280K) lead on promo conversion and Buy Box hold",
          body: "Hold rates and deal display look healthy. Keep monitoring Buy Box on DualZone Air Fryer and MultiCooker so the beat does not reverse.",
        status: "resolved",
        },
        {
          id: "blenders-win",
          title: "Blenders & Smoothies remain +$95K on seasonal lift",
          body: "Seasonal demand is still supporting the category. No action required beyond standard alert triage.",
        status: "resolved",
        },
        {
          id: "long-tail-miss",
          title: "A small set of SKUs still miss plan (−$180K combined)",
          body: "These do not threaten the brand beat, but worth a light scan for Buy Box or stock alerts so they do not grow.",
        status: "still-an-issue",
        },
      ],
      recommendations: [
        {
          id: "protect-bb",
          title: "Protect Buy Box on Kitchen Appliances hero SKUs",
          description:
            "The brand beat depends on hold rates — alert if DualZone Air Fryer or MultiCooker loses Buy Box this week.",
        },
        {
          id: "keep-promo",
          title: "Keep live deal badges intact on winning ASINs",
          description:
            "Promo conversion is carrying Kitchen Appliances. Confirm deal-page visibility stays green on the top OPS SKUs.",
        },
        {
          id: "scan-misses",
          title: "Light-touch triage the 9 SKUs still behind plan",
          description:
            "Small dollar drag (−$180K). Clear any Buy Box or stock alerts so they do not erode the brand beat.",
        },
      ],
    };
  }

  // Default + CleanPro — brand traffic/price story patterned on the Shark reference
  const label = isCleanPro ? "CleanPro" : brand;
  return {
    keyFinding: isCleanPro
      ? "CleanPro’s gap widened from −$1.1M to −$1.8M week over week as traffic softened across floor care. Floor Care Robotics flipped from a +$120K beat to a −$940K miss — largely Lost Buy Box on robot vacuums — while Hair Care stayed ahead at +$260K and only partially offsets. CleanPro’s average offer sits ~$30 above VacuMart_US on key uprights and robots."
      : `${label}’s gap widened week over week as sales fell while the plan held relatively flat. Dig into the heaviest category miss first — that is where Gap $ and alert density concentrate.`,
    planVsActual: {
      summary: {
        plan: "$10.0M",
        actual: "$8.2M",
        gap: "−$1.8M",
        attainment: "82.0%",
      },
      rows: [
        {
          id: "last-week",
          period: "Aug 9–15 (last week)",
          actual: "$8,200,000",
          plan: "$10,000,000",
          gap: "−$1,800,000",
        },
        {
          id: "week-before",
          period: "Aug 2–8 (week before)",
          actual: "$8,900,000",
          plan: "$10,000,000",
          gap: "−$1,100,000",
        },
        {
          id: "this-week",
          period: "Aug 16–21 (this week so far)",
          actual: "—",
          plan: "—",
          gap: "—",
        },
      ],
      narrative:
        "Gap widened −$1.1M → −$1.8M WoW; plan held flat at $10.0M. Attainment: 82%.",
    },
    ecommerceEquation: {
      summary: {
        skusBehindPlan: "22 / −$2.1M",
        skusAheadOfPlan: "7 / +$310K",
        biggestMover: "Floor Care Robotics −$940K",
        primaryLever: "Traffic (−$1.1M effect)",
      },
      priorWeekLabel: "Aug 2–8",
      currentWeekLabel: "Aug 9–15",
      rows: [
        {
          id: "revenue",
          metric: "Revenue",
          priorWeek: "$8,900,000",
          currentWeek: "$8,200,000",
        },
        {
          id: "plan",
          metric: "Plan",
          priorWeek: "$10,000,000",
          currentWeek: "$10,000,000",
        },
        {
          id: "page-views",
          metric: "Page Views",
          priorWeek: "1,248,000",
          currentWeek: "1,035,000",
        },
        {
          id: "cvr",
          metric: "Conversion Rate",
          priorWeek: "3.62%",
          currentWeek: "3.71%",
        },
        {
          id: "asp",
          metric: "Avg Selling Price",
          priorWeek: "$214.40",
          currentWeek: "$211.80",
        },
      ],
      narrative:
        "Traffic did almost all the damage — PDP views fell ~17% WoW (−$1.1M effect). Conversion rose slightly and ASP held, which softened the blow but could not offset the traffic collapse. Buy Box losses on robotics SKUs are the most plausible traffic/conversion funnel break.",
    },
    revenueTrend: {
      series: [
        { week: "Jun 21", plan: 12_400_000, actual: 19_800_000 },
        { week: "Jun 28", plan: 11_900_000, actual: 10_600_000 },
        { week: "Jul 5", plan: 11_200_000, actual: 9_800_000 },
        { week: "Jul 12", plan: 10_400_000, actual: 10_550_000 },
        { week: "Jul 19", plan: 10_600_000, actual: 9_400_000 },
        { week: "Jul 26", plan: 10_500_000, actual: 9_700_000 },
        { week: "Aug 2", plan: 10_000_000, actual: 8_900_000 },
        { week: "Aug 9", plan: 10_000_000, actual: 8_200_000 },
      ],
      narrative:
        "Post–Prime Day, CleanPro settled below plan. Jul 12 briefly beat after a soft plan week; August shows a widening miss as Floor Care Robotics Buy Box losses compounded and Hair Care’s offset was not enough.",
    },
    rootCauses: [
      {
        id: "traffic-price",
        title:
          "Traffic is falling across the brand — and a persistent price premium vs VacuMart_US is likely amplifying Buy Box loss",
        body: "Page views dropped ~17% week-over-week. On key uprights and robots, CleanPro’s average offer is ~$30 above VacuMart_US (e.g. Pro Upright $279 vs $248). Competitor Buy Box wins and delivery-promise alerts are also showing on the same ASINs.",
        status: "still-an-issue",
      },
      {
        id: "robotics-flip",
        title:
          "Floor Care Robotics flipped from a +$120K beat to a −$940K miss — the brand’s single largest swing",
        body: "Robot Vac R900, AI Robot R2010, and DetectPro lost Buy Box mid-week. Run a category Gap to Plan on Floor Care Robotics before chasing smaller category misses.",
        status: "still-an-issue",
      },
      {
        id: "hair-offset",
        title: "Hair Care stays ahead at +$260K and partially offsets the miss",
        body: "StylePro and dryers are converting well. Protect Buy Box and deal badges here so the offset does not disappear while floor care is repaired.",
        status: "resolved",
      },
      {
        id: "deal-page",
        title:
          "Deal Page Visibility alerts cluster on Floor Care corded and cordless ASINs",
        body: "Eight CleanPro floor-care SKUs lost deal-page visibility this week. Traffic and conversion drops concentrate on those ASINs — worth confirming promo calendar vs live PDP state.",
        status: "still-an-issue",
      },
    ],
    recommendations: [
      {
        id: "robotics-gtp",
        title: "Run a category gap to plan on Floor Care Robotics",
        description:
          "Robotics alone is −$940K and drove almost all of CleanPro’s WoW widening — identify which ASINs lost Buy Box and whether price vs VacuMart_US needs a response.",
      },
      {
        id: "diagnose-r900",
        title: "Diagnose B08XYZ1234 (CleanPro Robot Vac R900) immediately",
        description:
          "Largest Gap SKU in robotics (−$62K, 48% attainment). VacuMart_US holds Buy Box at $289 vs CleanPro $319 — confirm map, stock, and whether a deal badge should be live.",
      },
      {
        id: "upright-bb",
        title: "Recover Buy Box on CleanPro Pro Upright (B09ABC5678)",
        description:
          "−$48K Gap with VacuMart_US at $248 vs CleanPro $279. Closing the Buy Box loss is the fastest lever inside Floor Care.",
      },
      {
        id: "deal-badges",
        title: "Restore deal-page visibility on the 8 Floor Care ASINs flagged",
        description:
          "Missing deal badges suppress conversion on ASINs already missing plan. Confirm those deals are displaying at the right price before the weekend.",
      },
      {
        id: "protect-hair",
        title: "Protect Hair Care Buy Box so the +$260K offset holds",
        description:
          "Hair Care is the only CleanPro category ahead of plan. Alert immediately if StylePro S440 loses Buy Box or deal badge.",
      },
    ],
  };
}

/** Category roll-up — SKU concentration, category levers, SKU-level next steps. */
function buildCategoryReportBody(
  entityName: string,
  sku: IssueSku,
): FullRcaBody {
  const category = entityName.trim() || sku.category || "Category";
  const isFloorCareRobotics = /robotics/i.test(category);
  const isFloorCare =
    /^floor care$/i.test(category) || /floor care corded/i.test(category);
  const isControllers = /controllers/i.test(category);

  if (isControllers) {
    return {
      keyFinding:
        "Controllers are −$1.45M vs plan (68% attainment) — the heaviest PlayMax category miss. Keyword rank losses and competitive pricing on hero ASINs drove traffic down; conversion held roughly flat.",
      planVsActual: {
        summary: {
          plan: "$4.5M",
          actual: "$3.05M",
          gap: "−$1.45M",
          attainment: "68.0%",
        },
        rows: [
          {
            id: "last-week",
            period: "Aug 9–15 (last week)",
            actual: "$3,050,000",
            plan: "$4,500,000",
            gap: "−$1,450,000",
          },
          {
            id: "week-before",
            period: "Aug 2–8 (week before)",
            actual: "$3,470,000",
            plan: "$4,500,000",
            gap: "−$1,030,000",
          },
          {
            id: "this-week",
            period: "Aug 16–21 (this week so far)",
            actual: "—",
            plan: "—",
            gap: "—",
          },
        ],
        narrative:
          "Gap widened −$1.03M → −$1.45M WoW on a flat $4.5M plan. Attainment: 68%.",
      },
      ecommerceEquation: {
        summary: {
          skusBehindPlan: "14 / −$1.6M",
          skusAheadOfPlan: "3 / +$150K",
          biggestMover: "Controllers Bundle −$85K WoW",
          primaryLever: "Traffic & keyword rank",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: "$3,470,000",
            currentWeek: "$3,050,000",
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: "$4,500,000",
            currentWeek: "$4,500,000",
          },
          {
            id: "page-views",
            metric: "Page Views",
            priorWeek: "920,000",
            currentWeek: "710,000",
          },
          {
            id: "cvr",
            metric: "Conversion Rate",
            priorWeek: "4.40%",
            currentWeek: "4.35%",
          },
          {
            id: "asp",
            metric: "Avg Selling Price",
            priorWeek: "$46.80",
            currentWeek: "$46.20",
          },
        ],
        narrative:
          "PDP views fell ~23% WoW after keyword-rank and media losses. Conversion and ASP barely moved — restore rank and coverage on the top OPS ASINs first.",
      },
      revenueTrend: {
        series: [
          { week: "Jun 21", plan: 5_800_000, actual: 9_200_000 },
          { week: "Jun 28", plan: 5_400_000, actual: 4_600_000 },
          { week: "Jul 5", plan: 5_100_000, actual: 4_200_000 },
          { week: "Jul 12", plan: 4_800_000, actual: 4_500_000 },
          { week: "Jul 19", plan: 4_700_000, actual: 3_900_000 },
          { week: "Jul 26", plan: 4_600_000, actual: 4_000_000 },
          { week: "Aug 2", plan: 4_500_000, actual: 3_470_000 },
          { week: "Aug 9", plan: 4_500_000, actual: 3_050_000 },
        ],
        narrative:
          "Controllers have missed plan every post–Prime week, with August the weakest stretch. Rank recovery on hero keywords is the gating action.",
      },
      rootCauses: [
        {
          id: "keyword-rank",
          title: "Keyword rank drops on hero terms pulled traffic off Controllers PDPs",
          body: "Rank losses align with the media cut window. Re-bid on the top revenue keywords before expanding into new terms.",
        status: "still-an-issue",
        },
        {
          id: "bundle-bb",
          title: "PlayMax Controllers Bundle lost Buy Box mid-week",
          body: "B04MNO1122 shows an active Buy Box loss — price and 3P competition are compounding the traffic miss.",
        status: "still-an-issue",
        },
      ],
      recommendations: [
        {
          id: "restore-rank",
          title: "Restore keyword rank on Controllers hero terms",
          description:
            "Traffic is the primary lever (−$420K WoW). Fix rank on the top 5 revenue keywords before chasing secondary ASINs.",
        },
        {
          id: "bundle",
          title: "Diagnose PlayMax Controllers Bundle (B04MNO1122)",
          description:
            "Active Buy Box loss on a high-visibility ASIN — confirm price vs 3P and whether a deal badge should be live.",
        },
      ],
    };
  }

  if (isFloorCareRobotics) {
    return {
      keyFinding:
        "Floor Care Robotics is −$940K vs plan (61% attainment). Lost Buy Box on robot vacuums is the main driver; conversion and deal visibility are secondary. Robot Vac R900 alone is −$62K at 48% attainment.",
      planVsActual: {
        summary: {
          plan: "$2.41M",
          actual: "$1.47M",
          gap: "−$940K",
          attainment: "61.0%",
        },
        rows: [
          {
            id: "last-week",
            period: "Aug 9–15 (last week)",
            actual: "$1,470,000",
            plan: "$2,410,000",
            gap: "−$940,000",
          },
          {
            id: "week-before",
            period: "Aug 2–8 (week before)",
            actual: "$2,180,000",
            plan: "$2,060,000",
            gap: "+$120,000",
          },
          {
            id: "this-week",
            period: "Aug 16–21 (this week so far)",
            actual: "—",
            plan: "—",
            gap: "—",
          },
        ],
        narrative:
          "Flipped +$120K → −$940K WoW ($1.06M swing). Attainment: 61%.",
      },
      ecommerceEquation: {
        summary: {
          skusBehindPlan: "11 / −$1.05M",
          skusAheadOfPlan: "2 / +$110K",
          biggestMover: "Robot Vac R900 −$62K",
          primaryLever: "Buy Box / traffic",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: "$2,180,000",
            currentWeek: "$1,470,000",
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: "$2,060,000",
            currentWeek: "$2,410,000",
          },
          {
            id: "page-views",
            metric: "Page Views",
            priorWeek: "412,000",
            currentWeek: "298,000",
          },
          {
            id: "cvr",
            metric: "Conversion Rate",
            priorWeek: "3.95%",
            currentWeek: "3.40%",
          },
          {
            id: "asp",
            metric: "Avg Selling Price",
            priorWeek: "$289.00",
            currentWeek: "$278.00",
          },
        ],
        narrative:
          "PDP views fell ~28% and conversion slipped 55 bps as VacuMart_US took Buy Box on multiple robots. ASP also softened ~$11 — traffic and Buy Box explain nearly the full category swing.",
      },
      revenueTrend: {
        series: [
          { week: "Jun 21", plan: 3_100_000, actual: 5_400_000 },
          { week: "Jun 28", plan: 2_900_000, actual: 2_600_000 },
          { week: "Jul 5", plan: 2_700_000, actual: 2_300_000 },
          { week: "Jul 12", plan: 2_400_000, actual: 2_450_000 },
          { week: "Jul 19", plan: 2_350_000, actual: 2_100_000 },
          { week: "Jul 26", plan: 2_300_000, actual: 2_200_000 },
          { week: "Aug 2", plan: 2_060_000, actual: 2_180_000 },
          { week: "Aug 9", plan: 2_410_000, actual: 1_470_000 },
        ],
        narrative:
          "Aug 2 was still a beat; Aug 9 collapsed after clustered Buy Box losses. Recovering Buy Box on the top 5 robots is the gating action for category recovery.",
      },
      rootCauses: [
        {
          id: "buy-box-cluster",
          title:
            "VacuMart_US holds Buy Box on Robot Vac R900, AI Robot R2010, and DetectPro",
          body: "Price gaps of $20–30 below CleanPro list are winning Buy Box. Until ownership returns, traffic and conversion will stay suppressed on those ASINs.",
        status: "still-an-issue",
        },
        {
          id: "r900",
          title: "Robot Vac R900 is the largest Gap SKU (−$62K, 48% attainment)",
          body: "Single-ASIN diagnosis should lead — map compliance, stock cover, and whether a deal badge should be live at the competitive price.",
        status: "still-an-issue",
        },
        {
          id: "deal-visibility",
          title: "Deal-page visibility dropped on DetectPro Auto-Empty",
          body: "Secondary to Buy Box, but compounding conversion loss on an already-missed ASIN.",
        status: "still-an-issue",
        },
      ],
      recommendations: [
        {
          id: "r900",
          title: "Diagnose B08XYZ1234 (CleanPro Robot Vac R900) immediately",
          description:
            "Majority of the robotics Gap. Confirm Buy Box vs VacuMart_US ($289 vs $319), stock, and plan accuracy before expanding triage.",
        },
        {
          id: "bb-cluster",
          title: "Recover Buy Box on the three robots VacuMart_US owns",
          description:
            "R900, R2010, and DetectPro share the same 3P winner — a coordinated price or MAP response likely beats one-off ASIN fixes.",
        },
        {
          id: "detect-deal",
          title: "Restore deal-page visibility on DetectPro Auto-Empty",
          description:
            "Missing badge on a live deal suppresses conversion on an ASIN already behind plan.",
        },
      ],
    };
  }

  // Floor Care (and generic category fallback) — SKU-dense, category-scoped
  const label = isFloorCare ? "Floor Care" : category;
  return {
    keyFinding: isFloorCare
      ? "Floor Care is behind plan with the miss concentrated in uprights and cordless sticks. CleanPro Pro Upright (B09ABC5678) is the largest Gap SKU (−$48K); deal-page and Buy Box alerts cluster on the same ASINs. Traffic soft, conversion slightly down — not a plan-reset story."
      : `${label} missed plan last week. The Gap concentrates in a handful of SKUs — start with the largest Gap ASIN (${sku.name}, ${sku.asin}) before spreading effort across the full category.`,
    planVsActual: {
      summary: {
        plan: "$520K",
        actual: "$400K",
        gap: "−$120K",
        attainment: "76.9%",
      },
      rows: [
        {
          id: "last-week",
          period: "Aug 9–15 (last week)",
          actual: "$400,000",
          plan: "$520,000",
          gap: "−$120,000",
        },
        {
          id: "week-before",
          period: "Aug 2–8 (week before)",
          actual: "$455,000",
          plan: "$510,000",
          gap: "−$55,000",
        },
        {
          id: "this-week",
          period: "Aug 16–21 (this week so far)",
          actual: "—",
          plan: "—",
          gap: "—",
        },
      ],
      narrative:
        "Gap more than doubled −$55K → −$120K WoW. Attainment: 77%.",
    },
    ecommerceEquation: {
      summary: {
        skusBehindPlan: "11 / −$155K",
        skusAheadOfPlan: "4 / +$35K",
        biggestMover: "Pro Upright −$48K",
        primaryLever: "Conversion & Buy Box",
      },
      priorWeekLabel: "Aug 2–8",
      currentWeekLabel: "Aug 9–15",
      rows: [
        {
          id: "revenue",
          metric: "Revenue",
          priorWeek: "$455,000",
          currentWeek: "$400,000",
        },
        {
          id: "plan",
          metric: "Plan",
          priorWeek: "$510,000",
          currentWeek: "$520,000",
        },
        {
          id: "page-views",
          metric: "Page Views",
          priorWeek: "186,000",
          currentWeek: "172,000",
        },
        {
          id: "cvr",
          metric: "Conversion Rate",
          priorWeek: "3.55%",
          currentWeek: "3.28%",
        },
        {
          id: "asp",
          metric: "Avg Selling Price",
          priorWeek: "$268.00",
          currentWeek: "$262.00",
        },
      ],
      narrative:
        "Traffic dipped ~8%, but conversion did more damage (−27 bps, roughly −$55K effect) as Buy Box and deal-badge losses hit uprights and cordless sticks. ASP also softened ~$6. The 11 SKUs behind plan (−$155K) swamp the 4 ahead (+$35K).",
    },
    revenueTrend: {
      series: [
        { week: "Jun 21", plan: 680_000, actual: 1_120_000 },
        { week: "Jun 28", plan: 640_000, actual: 580_000 },
        { week: "Jul 5", plan: 600_000, actual: 520_000 },
        { week: "Jul 12", plan: 560_000, actual: 570_000 },
        { week: "Jul 19", plan: 550_000, actual: 490_000 },
        { week: "Jul 26", plan: 540_000, actual: 510_000 },
        { week: "Aug 2", plan: 510_000, actual: 455_000 },
        { week: "Aug 9", plan: 520_000, actual: 400_000 },
      ],
      narrative:
        "Floor Care beat only once post–Prime (Jul 12). August shows a clear miss widening — recover Buy Box and deal visibility on Pro Upright and cordless sticks before the Gap compounds further.",
    },
    rootCauses: [
      {
        id: "pro-upright",
        title:
          "CleanPro Pro Upright (B09ABC5678) is the #1 Gap SKU — VacuMart_US holds Buy Box at $248 vs $279",
        body: "−$48K Gap with recurring Buy Box loss. Closing ownership on this ASIN is the single fastest dollar recovery inside Floor Care.",
        status: "still-an-issue",
      },
      {
        id: "deal-cluster",
        title:
          "Deal Page Visibility alerts on Pro Cordless, SensePro, TwinBrush, MiniVac, and CarpetPro",
        body: "Five Floor Care ASINs lost deal-page visibility this week. Traffic and conversion drops concentrate on those listings — confirm promo calendar vs live PDP state.",
        status: "still-an-issue",
      },
      {
        id: "cordless-stock",
        title: "Pro Cordless shows Stock Availability pressure after price resets",
        body: "Units are constrained on B0PRM001 while the ASIN is already behind plan — stock recovery matters as much as price/Buy Box here.",
        status: "still-an-issue",
      },
    ],
    recommendations: [
      {
        id: "diagnose-upright",
        title: "Diagnose B09ABC5678 (CleanPro Pro Upright) immediately",
        description:
          "Largest Gap in Floor Care (−$48K). VacuMart_US holds Buy Box at $248 vs CleanPro $279 — confirm MAP, stock, and whether a deal badge should be live.",
      },
      {
        id: "deal-badges",
        title:
          "Restore deal-page visibility on the five Floor Care ASINs flagged",
        description:
          "Pro Cordless, SensePro, TwinBrush, MiniVac, and CarpetPro lost deal badges this week — conversion is suppressed on ASINs already missing plan.",
      },
      {
        id: "cordless-stock",
        title: "Clear stock cover on CleanPro Pro Cordless (B0PRM001)",
        description:
          "Stock Availability is limiting recovery after price resets. Pull weeks-of-cover and expedite replenishment if cover is below category average.",
      },
      {
        id: "sku-scan",
        title: "Rank the remaining Floor Care Gap SKUs by $ and clear Buy Box first",
        description:
          "After Pro Upright, work the next three Gap $ ASINs — Buy Box recovery usually pays faster than broad media tests inside this category.",
      },
    ],
  };
}

/** Single-SKU diagnosis — ad spend / listing events on one ASIN. */
function buildSkuReportBody(sku: IssueSku): FullRcaBody {
  return {
    keyFinding: `Revenue on ${sku.name} (${sku.asin}) collapsed –50% WoW ($228K → $114K). A 93% cut in ad spend ($6,538 → $483) was the dominant cause — it wiped out $118K of ad-attributed sales and pulled 30% of traffic off the page. A missing deal badge and a one-day Buy Box loss on Aug 12 added pressure but are secondary by a wide margin.`,
    planVsActual: {
      summary: {
        plan: "$190K",
        actual: "$114K",
        gap: "−$76K",
        attainment: "60.0%",
      },
      rows: [
        {
          id: "last-week",
          period: "Aug 9–15 (last week)",
          actual: "$114,000",
          plan: "$190,000",
          gap: "−$76,000",
        },
        {
          id: "week-before",
          period: "Aug 2–8 (week before)",
          actual: "$228,000",
          plan: "$195,000",
          gap: "+$33,000",
        },
        {
          id: "this-week",
          period: "Aug 16–21 (this week so far)",
          actual: "—",
          plan: "—",
          gap: "—",
        },
      ],
      narrative: `Flipped +$33K → −$76K WoW; plan barely moved. Attainment: 60%.`,
    },
    ecommerceEquation: {
      summary: {
        skusBehindPlan: "1 / −$76K",
        skusAheadOfPlan: "0 / $0",
        biggestMover: `${sku.name} −$114K WoW`,
        primaryLever: "Ad spend / traffic",
      },
      priorWeekLabel: "Aug 2–8",
      currentWeekLabel: "Aug 9–15",
      rows: [
        {
          id: "revenue",
          metric: "Revenue",
          priorWeek: "$228,000",
          currentWeek: "$114,000",
        },
        {
          id: "plan",
          metric: "Plan",
          priorWeek: "$195,000",
          currentWeek: "$190,000",
        },
        {
          id: "page-views",
          metric: "Page Views",
          priorWeek: "42,800",
          currentWeek: "29,960",
        },
        {
          id: "cvr",
          metric: "Conversion Rate",
          priorWeek: "3.90%",
          currentWeek: "3.55%",
        },
        {
          id: "asp",
          metric: "Avg Selling Price",
          priorWeek: `$${sku.ourPrice ?? 279}`,
          currentWeek: `$${(sku.ourPrice ?? 279) - 8}`,
        },
      ],
      narrative:
        "Traffic fell ~30% after the ad-spend cut and explains most of the revenue drop. Conversion dipped modestly; a missing deal badge and a one-day Buy Box loss on Aug 12 were secondary.",
    },
    revenueTrend: {
      series: [
        { week: "Jun 21", plan: 240_000, actual: 410_000 },
        { week: "Jun 28", plan: 220_000, actual: 198_000 },
        { week: "Jul 5", plan: 210_000, actual: 185_000 },
        { week: "Jul 12", plan: 200_000, actual: 205_000 },
        { week: "Jul 19", plan: 195_000, actual: 178_000 },
        { week: "Jul 26", plan: 192_000, actual: 188_000 },
        { week: "Aug 2", plan: 195_000, actual: 228_000 },
        { week: "Aug 9", plan: 190_000, actual: 114_000 },
      ],
      narrative: `${sku.name} was ahead of plan on Aug 2; Aug 9 collapsed after paid coverage was pulled. Restoring spend to the prior-week level is the first recovery test.`,
    },
    rootCauses: [
      {
        id: "ad-spend",
        title: "Ad spend cut 93% ($6,538 → $483) — dominant cause of the traffic collapse",
        body: "Ad-attributed sales fell ~$118K. Confirm whether the cut was intentional budget reallocation or an automation / campaign status error.",
        status: "still-an-issue",
      },
      {
        id: "deal-badge",
        title: "Missing deal badge (likely an expired promotional price)",
        body: "Secondary pressure on conversion while traffic was already down. Confirm the promo calendar vs live PDP state.",
        status: "still-an-issue",
      },
      {
        id: "buy-box-day",
        title: "One-day Buy Box loss on Aug 12",
        body: "Added pressure but is secondary by a wide margin to the ad-spend cut.",
        status: "still-an-issue",
      },
    ],
    recommendations: [
      {
        id: "restore-spend",
        title: `Restore paid coverage on ${sku.asin} to prior-week levels`,
        description:
          "The 93% spend cut explains the traffic collapse. Re-enable campaigns and watch PDP views over the next 48 hours.",
      },
      {
        id: "deal-badge",
        title: "Confirm deal badge / promo price is live on the PDP",
        description:
          "A missing badge suppresses conversion while traffic recovers — verify promo calendar vs scrape state.",
      },
      {
        id: "buy-box",
        title: "Verify Buy Box ownership stayed with CIQ after Aug 12",
        description:
          "One-day loss should not recur. Alert if 3P takes Buy Box again this week.",
      },
    ],
  };
}

function resolveEntityName(
  sku: IssueSku,
  context?: FullRcaReportContext,
): string {
  const level = context?.level ?? "sku";
  return (
    context?.entityName?.trim() ||
    (level === "category" ? sku.category : undefined) ||
    sku.brand
  );
}

/**
 * Full weekly Amazon RCA card — shown in AllyAI chat after
 * "Run Gap to Plan Analysis for the last week".
 *
 * Body content is scoped to the taxonomy level (Overall / Brand / Category / SKU)
 * so each selection gets a contextual Gap to Plan — not a renamed SKU report.
 */
export function getFullRcaReport(
  sku: IssueSku,
  context?: FullRcaReportContext,
): FullRcaReportData {
  const header = buildReportHeader(sku, context);
  const level = context?.level ?? "sku";
  const entityName = resolveEntityName(sku, context);

  let body =
    level === "overall"
      ? buildOverallReportBody()
      : level === "brand"
        ? buildBrandReportBody(entityName)
        : level === "category"
          ? buildCategoryReportBody(entityName, sku)
          : buildSkuReportBody(sku);

  // Taxonomy levels + SKU: Plan vs Actual must match KPI tiles (same scale + labels)
  if (
    level === "overall" ||
    level === "brand" ||
    level === "category" ||
    level === "sku"
  ) {
    const gapDollars =
      level === "sku" ? (context?.entityGapDollars ?? sku.gapDollars) : context?.entityGapDollars;
    const perf = getScaledLastWeekPerformance(level, gapDollars);
    body = applyTaxonomyPerformanceAnchors(body, perf);
  } else {
    body = {
      ...body,
      planVsActual: withConsistentPlanVsActualLabels(body.planVsActual),
    };
  }

  return {
    asin: sku.asin,
    brand: sku.brand,
    level,
    ...header,
    ...body,
  };
}

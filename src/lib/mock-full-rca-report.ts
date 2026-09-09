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

/**
 * Absolute alert-tree gaps (Overall → brand → category → hero SKUs).
 * Must match `buildAlertsTaxonomyTree` rollups so Gap to Plan copy composes
 * across levels when scaled through `getScaledLastWeekPerformance`.
 */
const TREE_GAP = {
  cleanPro: 639_000,
  kitchenPro: 145_000,
  playMax: 86_000,
  floorCare: 295_500,
  floorCareRobotics: 191_500,
  hairCare: 66_000,
  homeComfort: 59_000,
  cleanProKitchen: 27_000,
  controllers: 86_000,
  controllersBundle: 18_000,
  proUpright: 48_000,
  robotVacR900: 62_000,
} as const;

/** Last-week Gap $ for an alert-tree node (same math as Plan vs Actual). */
function treePerf(treeGapAbs: number): ScaledLastWeekPerformance {
  return getScaledLastWeekPerformance("brand", -treeGapAbs);
}

function treeGapDollars(treeGapAbs: number): number {
  return treePerf(treeGapAbs).gapDollars;
}

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
      ? `$${(Math.round(abs / 100_000) / 10).toFixed(1)}M`
      : abs >= 1_000
        ? `$${(Math.round(abs / 100) / 10).toFixed(1)}K`
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
  const cleanProGap = treeGapDollars(TREE_GAP.cleanPro);
  const kitchenProGap = treeGapDollars(TREE_GAP.kitchenPro);
  const playMaxGap = treeGapDollars(TREE_GAP.playMax);
  const floorCareGap = treeGapDollars(TREE_GAP.floorCare);
  // Portfolio SKU split: behind + ahead = last-week gap (−$12.3M)
  const skusBehindGap = -18_500_000;
  const skusAheadGap = 6_200_000;

  return {
    keyFinding:
      `The overall portfolio recorded ${formatCompactMoney(last.actualDollars)} in actual sales against a ${formatCompactMoney(last.planDollars)} plan last week (${LAST_WEEK_RANGE_LABEL}) — a ${formatCompactMoney(last.gapDollars, { signed: true })} miss (${last.attainmentPct.toFixed(1)}% attainment). That's a sharp deterioration from the prior week (${PRIOR_WEEK_RANGE}), when the gap was ${formatCompactMoney(prior.gapDollars, { signed: true })}. CleanPro was the single biggest drag at ${formatCompactMoney(cleanProGap, { signed: true })} under plan, KitchenPro followed at ${formatCompactMoney(kitchenProGap, { signed: true })}, and PlayMax at ${formatCompactMoney(playMaxGap, { signed: true })}. The overall number hides SKU-level pressure: 38 SKUs are behind plan by a combined ${formatCompactMoney(skusBehindGap, { signed: true })}, offset by 14 SKUs ahead by ${formatCompactMoney(skusAheadGap, { signed: true })}.`,
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
        skusBehindPlan: `38 / ${formatCompactMoney(skusBehindGap, { signed: true })}`,
        skusAheadOfPlan: `14 / ${formatCompactMoney(skusAheadGap, { signed: true })}`,
        biggestMover: `CleanPro ${formatCompactMoney(cleanProGap, { signed: true })}`,
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
        `Traffic rose slightly last week (+99K views), so volume wasn't the full story. Conversion slipped from 3.41% to 3.29% and ASP dropped from $137.81 to $135.07 — together explaining most of the revenue decline from the prior week. The shortfall is concentrated: 38 SKUs are behind plan at a combined ${formatCompactMoney(skusBehindGap, { signed: true })}, partially offset by 14 SKUs ahead at ${formatCompactMoney(skusAheadGap, { signed: true })} (net ${formatCompactMoney(last.gapDollars, { signed: true })}, matching the portfolio gap).`,
    },
    revenueTrend: buildScaledRevenueTrend(perf),
    rootCauses: [
      {
        id: "cleanpro",
        title: `CleanPro finished ${formatCompactMoney(cleanProGap, { signed: true })} under plan — the largest brand shortfall`,
        body: `Floor Care alone is ${formatCompactMoney(floorCareGap, { signed: true })} and Floor Care Robotics is next. Buy Box losses on uprights and robots are the primary story — dig into those category Gap to Plans before the swing compounds.`,
        status: "still-an-issue",
      },
      {
        id: "kitchenpro",
        title: `KitchenPro finished ${formatCompactMoney(kitchenProGap, { signed: true })} under plan across Kitchen Appliances`,
        body: "DualZone Air Fryer and cookware SKUs drive most of the KitchenPro miss. Confirm Buy Box and promo coverage before treating the brand as an offset.",
        status: "still-an-issue",
      },
      {
        id: "playmax",
        title: `PlayMax finished ${formatCompactMoney(playMaxGap, { signed: true })} under plan — Controllers only`,
        body: "Keyword rank and share-of-voice losses after media cuts are the primary Controllers story. Smaller dollar drag than CleanPro, but still material at portfolio scale.",
        status: "still-an-issue",
      },
    ],
    recommendations: [
      {
        id: "cleanpro-deep-dive",
        title: "Run a brand deep dive on CleanPro",
        description: `CleanPro is carrying the largest dollar shortfall last week (${formatCompactMoney(cleanProGap, { signed: true })}) — identifying which categories and SKUs are driving Floor Care and Robotics is the highest-priority next step.`,
      },
      {
        id: "conversion-decline",
        title: "Investigate the portfolio-wide conversion decline",
        description:
          "Conversion slipped from 3.41% (prior week) to 3.29% last week while traffic grew slightly — diagnose at the category level (Floor Care, Floor Care Robotics, Controllers) before the gap compounds further.",
      },
      {
        id: "cleanpro-floor-care",
        title: "Run a category Gap to Plan on Floor Care",
        description: `Floor Care is CleanPro’s heaviest category miss (${formatCompactMoney(floorCareGap, { signed: true })}). Confirm Buy Box, deal badge, and media spend on the highest-OPS ASINs before treating brand recovery as durable.`,
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
    const perf = treePerf(TREE_GAP.playMax);
    const controllersGap = treeGapDollars(TREE_GAP.controllers);
    const behindGap = perf.gapDollars * 1.15;
    return {
      keyFinding: `PlayMax’s gap is ${formatCompactMoney(perf.gapDollars, { signed: true })} vs plan (${perf.attainmentPct.toFixed(1)}% attainment) last week — entirely Controllers (${formatCompactMoney(controllersGap, { signed: true })}). Keyword rank and share-of-voice losses after media cuts are the primary story, not a plan reset.`,
      planVsActual: buildPlanVsActualFromPerformance(perf),
      ecommerceEquation: {
        summary: {
          skusBehindPlan: `11 / ${formatCompactMoney(behindGap, { signed: true })}`,
          skusAheadOfPlan: `0 / $0`,
          biggestMover: `Controllers ${formatCompactMoney(controllersGap, { signed: true })}`,
          primaryLever: "Traffic & keyword rank",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: formatExactDollars(perf.priorActualDollars),
            currentWeek: formatExactDollars(perf.actualDollars),
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: formatExactDollars(perf.priorPlanDollars),
            currentWeek: formatExactDollars(perf.planDollars),
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
          "Traffic did most of the damage — PDP views fell ~18% WoW after media and keyword-rank losses. Conversion and ASP held nearly flat, so the Gap is a traffic story concentrated in Controllers.",
      },
      revenueTrend: buildScaledRevenueTrend(perf),
      rootCauses: [
        {
          id: "controllers",
          title: `Controllers are ${formatCompactMoney(controllersGap, { signed: true })} vs plan — keyword rank losses are the top driver`,
          body: "Rank losses on hero keywords after media cuts pulled traffic off Controllers PDPs. Run a category Gap to Plan and restore coverage on the highest-OPS ASINs first.",
          status: "still-an-issue",
        },
        {
          id: "bundle-bb",
          title: "PlayMax Controllers Bundle lost Buy Box mid-week",
          body: "B04MNO1122 shows an active Buy Box loss — price and 3P competition are compounding the traffic miss.",
          status: "still-an-issue",
        },
        {
          id: "sov",
          title: "Share of voice dropped on Controllers hero keywords after media cuts",
          body: "SOV and traffic moved together. Confirm whether spend was cut intentionally or lost to auction pressure before restoring budget.",
          status: "still-an-issue",
        },
      ],
      recommendations: [
        {
          id: "controllers-gtp",
          title: "Run a category gap to plan on Controllers",
          description: `Controllers alone are ${formatCompactMoney(controllersGap, { signed: true })} — identify which ASINs lost keyword rank and whether media spend recovered on the hero SKUs.`,
        },
        {
          id: "restore-sov",
          title: "Restore share of voice on Controllers hero keywords",
          description:
            "SOV dropped after last week’s media cut and is tied directly to the Controllers miss.",
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
    const perf = treePerf(TREE_GAP.kitchenPro);
    const behindGap = perf.gapDollars * 1.12;
    return {
      keyFinding: `KitchenPro is ${formatCompactMoney(perf.gapDollars, { signed: true })} vs plan (${perf.attainmentPct.toFixed(1)}% attainment) last week — Kitchen Appliances is the only category in the alert tree and accounts for the full brand miss. DualZone Air Fryer and cookware SKUs lead the Gap.`,
      planVsActual: buildPlanVsActualFromPerformance(perf),
      ecommerceEquation: {
        summary: {
          skusBehindPlan: `12 / ${formatCompactMoney(behindGap, { signed: true })}`,
          skusAheadOfPlan: `0 / $0`,
          biggestMover: `Kitchen Appliances ${formatCompactMoney(perf.gapDollars, { signed: true })}`,
          primaryLever: "Conversion & Buy Box",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: formatExactDollars(perf.priorActualDollars),
            currentWeek: formatExactDollars(perf.actualDollars),
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: formatExactDollars(perf.priorPlanDollars),
            currentWeek: formatExactDollars(perf.planDollars),
          },
          {
            id: "page-views",
            metric: "Page Views",
            priorWeek: "980,000",
            currentWeek: "910,000",
          },
          {
            id: "cvr",
            metric: "Conversion Rate",
            priorWeek: "3.55%",
            currentWeek: "3.38%",
          },
          {
            id: "asp",
            metric: "Avg Selling Price",
            priorWeek: "$89.40",
            currentWeek: "$88.20",
          },
        ],
        narrative:
          "Traffic and conversion both softened WoW. The miss is broad across Kitchen Appliances — recover Buy Box and promo coverage on DualZone Air Fryer and MultiCooker before the Gap compounds.",
      },
      revenueTrend: buildScaledRevenueTrend(perf),
      rootCauses: [
        {
          id: "appliances-miss",
          title: `Kitchen Appliances are ${formatCompactMoney(perf.gapDollars, { signed: true })} — Buy Box and conversion softness on hero SKUs`,
          body: "DualZone Air Fryer and cookware rows concentrate the Gap. Confirm hold rates and deal display before expanding triage.",
          status: "still-an-issue",
        },
        {
          id: "air-fryer",
          title: "DualZone Air Fryer is the largest KitchenPro Gap SKU",
          body: "Highest OPS row in the category with recurring Buy Box pressure — diagnose price vs 3P and whether a deal badge should be live.",
          status: "still-an-issue",
        },
        {
          id: "cookware",
          title: "NonStick Cookware Set adds secondary Gap pressure",
          body: "Multiple cookware ASINs are behind plan. Worth a light scan for Buy Box or stock alerts so they do not grow.",
          status: "still-an-issue",
        },
      ],
      recommendations: [
        {
          id: "protect-bb",
          title: "Recover Buy Box on Kitchen Appliances hero SKUs",
          description:
            "Alert if DualZone Air Fryer or MultiCooker loses Buy Box this week — hold rates are the fastest lever.",
        },
        {
          id: "keep-promo",
          title: "Confirm deal badges are live on top OPS ASINs",
          description:
            "Missing promo display suppresses conversion on ASINs already missing plan.",
        },
        {
          id: "scan-misses",
          title: "Triage the KitchenPro SKUs behind plan by Gap $",
          description: `Work the largest Gap ASINs first — the brand miss is ${formatCompactMoney(perf.gapDollars, { signed: true })} and concentrated in Kitchen Appliances.`,
        },
      ],
    };
  }

  // Default + CleanPro — brand traffic/price story patterned on the Shark reference
  const label = isCleanPro ? "CleanPro" : brand;
  const perf = isCleanPro
    ? treePerf(TREE_GAP.cleanPro)
    : getScaledLastWeekPerformance("brand", -TREE_GAP.cleanPro);
  const floorCareGap = treeGapDollars(TREE_GAP.floorCare);
  const roboticsGap = treeGapDollars(TREE_GAP.floorCareRobotics);
  const hairGap = treeGapDollars(TREE_GAP.hairCare);
  const homeGap = treeGapDollars(TREE_GAP.homeComfort);
  const uprightGap = treeGapDollars(TREE_GAP.proUpright);
  const behindGap = perf.gapDollars * 1.12;

  return {
    keyFinding: isCleanPro
      ? `${label}’s gap is ${formatCompactMoney(perf.gapDollars, { signed: true })} vs plan (${perf.attainmentPct.toFixed(1)}% attainment) last week — down from ${formatCompactMoney(perf.priorGapDollars, { signed: true })} the week before. Floor Care (${formatCompactMoney(floorCareGap, { signed: true })}) and Floor Care Robotics (${formatCompactMoney(roboticsGap, { signed: true })}) dominate; Hair Care (${formatCompactMoney(hairGap, { signed: true })}) and Home Comfort (${formatCompactMoney(homeGap, { signed: true })}) add secondary pressure. CleanPro’s average offer sits ~$30 above VacuMart_US on key uprights and robots.`
      : `${label}’s gap is ${formatCompactMoney(perf.gapDollars, { signed: true })} vs plan last week. Dig into the heaviest category miss first — that is where Gap $ and alert density concentrate.`,
    planVsActual: buildPlanVsActualFromPerformance(perf),
    ecommerceEquation: {
      summary: {
        skusBehindPlan: `29 / ${formatCompactMoney(behindGap, { signed: true })}`,
        skusAheadOfPlan: `0 / $0`,
        biggestMover: `Floor Care ${formatCompactMoney(floorCareGap, { signed: true })}`,
        primaryLever: "Traffic & Buy Box",
      },
      priorWeekLabel: "Aug 2–8",
      currentWeekLabel: "Aug 9–15",
      rows: [
        {
          id: "revenue",
          metric: "Revenue",
          priorWeek: formatExactDollars(perf.priorActualDollars),
          currentWeek: formatExactDollars(perf.actualDollars),
        },
        {
          id: "plan",
          metric: "Plan",
          priorWeek: formatExactDollars(perf.priorPlanDollars),
          currentWeek: formatExactDollars(perf.planDollars),
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
      narrative: `Traffic did almost all the damage — PDP views fell ~17% WoW. Conversion rose slightly and ASP held, which softened the blow but could not offset the traffic collapse. Floor Care (${formatCompactMoney(floorCareGap, { signed: true })}) and Floor Care Robotics (${formatCompactMoney(roboticsGap, { signed: true })}) explain most of the ${formatCompactMoney(perf.gapDollars, { signed: true })} brand miss.`,
    },
    revenueTrend: buildScaledRevenueTrend(perf),
    rootCauses: [
      {
        id: "traffic-price",
        title:
          "Traffic is falling across the brand — and a persistent price premium vs VacuMart_US is likely amplifying Buy Box loss",
        body: "Page views dropped ~17% week-over-week. On key uprights and robots, CleanPro’s average offer is ~$30 above VacuMart_US (e.g. Pro Upright $279 vs $248). Competitor Buy Box wins and delivery-promise alerts are also showing on the same ASINs.",
        status: "still-an-issue",
      },
      {
        id: "floor-care",
        title: `Floor Care is ${formatCompactMoney(floorCareGap, { signed: true })} — the brand’s single largest category miss`,
        body: `Pro Upright alone is ${formatCompactMoney(uprightGap, { signed: true })}. Run a category Gap to Plan on Floor Care before chasing smaller category misses.`,
        status: "still-an-issue",
      },
      {
        id: "robotics",
        title: `Floor Care Robotics is ${formatCompactMoney(roboticsGap, { signed: true })} after clustered Buy Box losses`,
        body: "Robot Vac R900, AI Robot R2010, and DetectPro lost Buy Box mid-week. Confirm price vs VacuMart_US before treating robotics as a secondary issue.",
        status: "still-an-issue",
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
        id: "floor-care-gtp",
        title: "Run a category gap to plan on Floor Care",
        description: `Floor Care alone is ${formatCompactMoney(floorCareGap, { signed: true })} and drove the largest share of CleanPro’s miss — identify which ASINs lost Buy Box and whether price vs VacuMart_US needs a response.`,
      },
      {
        id: "diagnose-upright",
        title: "Diagnose B09ABC5678 (CleanPro Pro Upright) immediately",
        description: `Largest Gap SKU in Floor Care (${formatCompactMoney(uprightGap, { signed: true })}). VacuMart_US holds Buy Box at $248 vs CleanPro $279 — confirm MAP, stock, and whether a deal badge should be live.`,
      },
      {
        id: "robotics-gtp",
        title: "Run a category gap to plan on Floor Care Robotics",
        description: `Robotics is ${formatCompactMoney(roboticsGap, { signed: true })} after clustered Buy Box losses — coordinate price/MAP response on R900, R2010, and DetectPro.`,
      },
      {
        id: "deal-badges",
        title: "Restore deal-page visibility on the 8 Floor Care ASINs flagged",
        description:
          "Missing deal badges suppress conversion on ASINs already missing plan. Confirm those deals are displaying at the right price before the weekend.",
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
    const perf = treePerf(TREE_GAP.controllers);
    const behindGap = perf.gapDollars;
    return {
      keyFinding: `Controllers are ${formatCompactMoney(perf.gapDollars, { signed: true })} vs plan (${perf.attainmentPct.toFixed(1)}% attainment) — PlayMax’s only alerted category. Keyword rank losses and competitive pricing on hero ASINs drove traffic down; conversion held roughly flat.`,
      planVsActual: buildPlanVsActualFromPerformance(perf),
      ecommerceEquation: {
        summary: {
          skusBehindPlan: `11 / ${formatCompactMoney(behindGap, { signed: true })}`,
          skusAheadOfPlan: `0 / $0`,
          biggestMover: `Controllers Bundle ${formatCompactMoney(treeGapDollars(TREE_GAP.controllersBundle), { signed: true })}`,
          primaryLever: "Traffic & keyword rank",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: formatExactDollars(perf.priorActualDollars),
            currentWeek: formatExactDollars(perf.actualDollars),
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: formatExactDollars(perf.priorPlanDollars),
            currentWeek: formatExactDollars(perf.planDollars),
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
      revenueTrend: buildScaledRevenueTrend(perf),
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
            "Traffic is the primary lever. Fix rank on the top 5 revenue keywords before chasing secondary ASINs.",
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
    const perf = treePerf(TREE_GAP.floorCareRobotics);
    const r900Gap = treeGapDollars(TREE_GAP.robotVacR900);
    const behindGap = perf.gapDollars * 1.1;
    return {
      keyFinding: `Floor Care Robotics is ${formatCompactMoney(perf.gapDollars, { signed: true })} vs plan (${perf.attainmentPct.toFixed(1)}% attainment). Lost Buy Box on robot vacuums is the main driver; conversion and deal visibility are secondary. Robot Vac R900 alone is ${formatCompactMoney(r900Gap, { signed: true })}.`,
      planVsActual: buildPlanVsActualFromPerformance(perf),
      ecommerceEquation: {
        summary: {
          skusBehindPlan: `8 / ${formatCompactMoney(behindGap, { signed: true })}`,
          skusAheadOfPlan: `0 / $0`,
          biggestMover: `Robot Vac R900 ${formatCompactMoney(r900Gap, { signed: true })}`,
          primaryLever: "Buy Box / traffic",
        },
        priorWeekLabel: "Aug 2–8",
        currentWeekLabel: "Aug 9–15",
        rows: [
          {
            id: "revenue",
            metric: "Revenue",
            priorWeek: formatExactDollars(perf.priorActualDollars),
            currentWeek: formatExactDollars(perf.actualDollars),
          },
          {
            id: "plan",
            metric: "Plan",
            priorWeek: formatExactDollars(perf.priorPlanDollars),
            currentWeek: formatExactDollars(perf.planDollars),
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
      revenueTrend: buildScaledRevenueTrend(perf),
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
          title: `Robot Vac R900 is the largest Gap SKU (${formatCompactMoney(r900Gap, { signed: true })})`,
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
          description: `Largest robotics Gap (${formatCompactMoney(r900Gap, { signed: true })}). Confirm Buy Box vs VacuMart_US ($289 vs $319), stock, and plan accuracy before expanding triage.`,
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
  const perf = isFloorCare
    ? treePerf(TREE_GAP.floorCare)
    : getScaledLastWeekPerformance(
        "category",
        sku.gapDollars ? sku.gapDollars * 6 : -TREE_GAP.floorCare,
      );
  const uprightGap = treeGapDollars(TREE_GAP.proUpright);
  const behindGap = perf.gapDollars * 1.08;

  return {
    keyFinding: isFloorCare
      ? `Floor Care is ${formatCompactMoney(perf.gapDollars, { signed: true })} vs plan (${perf.attainmentPct.toFixed(1)}% attainment) — CleanPro’s heaviest category miss. CleanPro Pro Upright (B09ABC5678) is the largest Gap SKU (${formatCompactMoney(uprightGap, { signed: true })}); deal-page and Buy Box alerts cluster on the same ASINs. Traffic soft, conversion slightly down — not a plan-reset story.`
      : `${label} missed plan last week (${formatCompactMoney(perf.gapDollars, { signed: true })}). The Gap concentrates in a handful of SKUs — start with the largest Gap ASIN (${sku.name}, ${sku.asin}) before spreading effort across the full category.`,
    planVsActual: buildPlanVsActualFromPerformance(perf),
    ecommerceEquation: {
      summary: {
        skusBehindPlan: `15 / ${formatCompactMoney(behindGap, { signed: true })}`,
        skusAheadOfPlan: `0 / $0`,
        biggestMover: `Pro Upright ${formatCompactMoney(uprightGap, { signed: true })}`,
        primaryLever: "Conversion & Buy Box",
      },
      priorWeekLabel: "Aug 2–8",
      currentWeekLabel: "Aug 9–15",
      rows: [
        {
          id: "revenue",
          metric: "Revenue",
          priorWeek: formatExactDollars(perf.priorActualDollars),
          currentWeek: formatExactDollars(perf.actualDollars),
        },
        {
          id: "plan",
          metric: "Plan",
          priorWeek: formatExactDollars(perf.priorPlanDollars),
          currentWeek: formatExactDollars(perf.planDollars),
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
      narrative: `Traffic dipped ~8%, but conversion did more damage (−27 bps) as Buy Box and deal-badge losses hit uprights and cordless sticks. ASP also softened ~$6. All 15 alerted Floor Care SKUs are behind plan (combined ${formatCompactMoney(behindGap, { signed: true })}), led by Pro Upright at ${formatCompactMoney(uprightGap, { signed: true })}.`,
    },
    revenueTrend: buildScaledRevenueTrend(perf),
    rootCauses: [
      {
        id: "pro-upright",
        title: `CleanPro Pro Upright (B09ABC5678) is the #1 Gap SKU (${formatCompactMoney(uprightGap, { signed: true })}) — VacuMart_US holds Buy Box at $248 vs $279`,
        body: "Recurring Buy Box loss. Closing ownership on this ASIN is the single fastest dollar recovery inside Floor Care.",
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
        description: `Largest Gap in Floor Care (${formatCompactMoney(uprightGap, { signed: true })}). VacuMart_US holds Buy Box at $248 vs CleanPro $279 — confirm MAP, stock, and whether a deal badge should be live.`,
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
  const treeGapAbs =
    /pro upright/i.test(sku.name)
      ? TREE_GAP.proUpright
      : /r900|robot vac/i.test(sku.name)
        ? TREE_GAP.robotVacR900
        : Math.max(5_000, Math.abs(sku.gapDollars));
  const perf = treePerf(treeGapAbs);
  const wowDelta = perf.actualDollars - perf.priorActualDollars;

  return {
    keyFinding: `Revenue on ${sku.name} (${sku.asin}) fell from ${formatCompactMoney(perf.priorActualDollars)} to ${formatCompactMoney(perf.actualDollars)} WoW (${formatCompactMoney(wowDelta, { signed: true })}). Last week closed ${formatCompactMoney(perf.gapDollars, { signed: true })} vs a ${formatCompactMoney(perf.planDollars)} plan (${perf.attainmentPct.toFixed(1)}% attainment). A 93% cut in ad spend ($6,538 → $483) was the dominant cause — it wiped out most ad-attributed sales and pulled ~30% of traffic off the page. A missing deal badge and a one-day Buy Box loss on Aug 12 added pressure but are secondary by a wide margin.`,
    planVsActual: buildPlanVsActualFromPerformance(perf),
    ecommerceEquation: {
      summary: {
        skusBehindPlan: `1 / ${formatCompactMoney(perf.gapDollars, { signed: true })}`,
        skusAheadOfPlan: "0 / $0",
        biggestMover: `${sku.name} ${formatCompactMoney(wowDelta, { signed: true })} WoW`,
        primaryLever: "Ad spend / traffic",
      },
      priorWeekLabel: "Aug 2–8",
      currentWeekLabel: "Aug 9–15",
      rows: [
        {
          id: "revenue",
          metric: "Revenue",
          priorWeek: formatExactDollars(perf.priorActualDollars),
          currentWeek: formatExactDollars(perf.actualDollars),
        },
        {
          id: "plan",
          metric: "Plan",
          priorWeek: formatExactDollars(perf.priorPlanDollars),
          currentWeek: formatExactDollars(perf.planDollars),
        },
        {
          id: "ad-spend",
          metric: "Ad Spend",
          priorWeek: "$6,538",
          currentWeek: "$483",
        },
        {
          id: "page-views",
          metric: "Page Views",
          priorWeek: "48,200",
          currentWeek: "33,700",
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
          priorWeek: `$${sku.ourPrice ?? 279}`,
          currentWeek: `$${(sku.ourPrice ?? 279) - 8}`,
        },
      ],
      narrative: `Ad spend collapsed 93% and PDP views fell ~30%. Revenue moved from ${formatCompactMoney(perf.priorActualDollars)} to ${formatCompactMoney(perf.actualDollars)} while plan held near ${formatCompactMoney(perf.planDollars)} — producing a ${formatCompactMoney(perf.gapDollars, { signed: true })} miss. Restore paid coverage first, then confirm deal badge and Buy Box.`,
    },
    revenueTrend: buildScaledRevenueTrend(perf),
    rootCauses: [
      {
        id: "ad-spend",
        title: "Ad spend cut 93% ($6,538 → $483) — dominant cause of the traffic collapse",
        body: "Paid coverage explains most of the WoW revenue drop. Re-enable campaigns and watch PDP views over the next 48 hours before chasing secondary listing issues.",
        status: "still-an-issue",
      },
      {
        id: "deal-badge",
        title: "Missing deal badge (likely an expired promotional price)",
        body: "Suppresses conversion while traffic recovers — verify promo calendar vs scrape state.",
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

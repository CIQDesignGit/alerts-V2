import type { IssueSku } from "@/lib/mock-alerts-insights";
import {
  FULL_RCA_PRIOR_WEEK_RANGE,
  FULL_RCA_WEEK_LABEL,
} from "@/lib/mock-calendar";

/** Status badge on a root-cause row — kept for older call sites if any */
export type FullRcaCauseStatus = "still-an-issue" | "resolved";

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
  /** Optional orange pill — secondary / monitor signals */
  badge?: "worth-watching";
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
};

/** Plan vs Actual accordion — summary strip + period rows + narrative */
export type FullRcaPlanVsActual = {
  summary: {
    plan: string;
    actual: string;
    gap: string;
    attainment: string;
  };
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
  priorWeekLabel: string;
  currentWeekLabel: string;
  rows: Array<{
    id: string;
    lever: string;
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
};

export type FullRcaReportData = {
  asin: string;
  brand: string;
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

function buildReportHeader(
  sku: IssueSku,
  context?: FullRcaReportContext,
): Pick<FullRcaReportData, "headerTitle" | "headerSubtitle" | "weekLabel" | "periodLabel"> {
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
      headerTitle: `${entity} — Gap to plan analysis`,
      headerSubtitle: `${entity} vs. prior week (${PRIOR_WEEK_RANGE})`,
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

/**
 * Full weekly Amazon RCA card — shown in AllyAI chat after
 * "Run Gap to Plan Analysis for the last week".
 */
export function getFullRcaReport(
  sku: IssueSku,
  context?: FullRcaReportContext,
): FullRcaReportData {
  const header = buildReportHeader(sku, context);

  return {
    asin: sku.asin,
    brand: sku.brand,
    ...header,
    keyFinding:
      "Revenue collapsed –50% WoW ($228K → $114K). A 93% cut in ad spend ($6,538 → $483) was the dominant cause — it wiped out $118K of ad-attributed sales and pulled 30% of traffic off the page. A missing deal badge (likely: a promotional price that expired) and a one-day buy-box loss on Aug 12 added pressure but are secondary by a wide margin.",
    planVsActual: {
      summary: {
        plan: "$27.8M",
        actual: "$26.1M",
        gap: "−$1.7M",
        attainment: "93.9%",
      },
      rows: [
        {
          id: "last-week",
          period: "Aug 9–15 (last week)",
          actual: "$26,116,686",
          plan: "$27,815,894",
          gap: "−$1,699,208",
        },
        {
          id: "week-before",
          period: "Aug 2–8 (week before)",
          actual: "$27,145,090",
          plan: "$28,157,468",
          gap: "−$1,012,378",
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
        "Both complete weeks missed plan, and the gap widened by about $687K last week. Sales fell $1.0M versus the prior week while the plan also stepped down ~$342K — so most of the gap widening reflects real softness in demand, not a plan jump. This-week figures aren't yet available in the data.",
    },
    ecommerceEquation: {
      summary: {
        skusBehindPlan: "474 / −$11.4M",
        skusAheadOfPlan: "339 / +$9.7M",
        biggestMover: "Ninja −$615K WoW",
        primaryLever: "Conversion & price",
      },
      priorWeekLabel: "Aug 2–8",
      currentWeekLabel: "Aug 9–15",
      rows: [
        {
          id: "pdp-views",
          lever: "PDP Views",
          priorWeek: "5,784,675",
          currentWeek: "5,883,648",
        },
        {
          id: "cvr",
          lever: "Conversion Rate",
          priorWeek: "3.41%",
          currentWeek: "3.29%",
        },
        {
          id: "asp",
          lever: "Avg Selling Price",
          priorWeek: "$137.81",
          currentWeek: "$135.07",
        },
      ],
      narrative:
        "Traffic actually rose slightly last week (+99K views, a +1.7% lift), so that wasn't the problem. Instead, conversion slipped from 3.41% to 3.29% — worth about −$963K in the decomposition — while average selling price dropped from $137.81 to $135.07, contributing roughly −$529K. Those two together account for more than the full $1.0M revenue decline, offset partially by the traffic tailwind. The shortfall is broad — 474 SKUs are behind plan at a combined −$11.4M, partially offset by 339 SKUs ahead at +$9.7M.",
    },
    // Recent Trend — 8 weeks ending Aug 9 (portfolio-scale dollars)
    revenueTrend: {
      series: [
        { week: "Jun 21", plan: 38_300_000, actual: 119_600_000 },
        { week: "Jun 28", plan: 36_100_000, actual: 30_800_000 },
        { week: "Jul 5", plan: 33_800_000, actual: 25_400_000 },
        { week: "Jul 12", plan: 28_200_000, actual: 28_332_000 },
        { week: "Jul 19", plan: 29_400_000, actual: 23_100_000 },
        { week: "Jul 26", plan: 30_100_000, actual: 25_800_000 },
        { week: "Aug 2", plan: 28_157_468, actual: 27_145_090 },
        { week: "Aug 9", plan: 27_815_894, actual: 26_116_686 },
      ],
      narrative:
        "Jun 21 was Prime Day — revenue hit $119.6M against a $38.3M plan, a massive event-driven spike. The Jun 28 lead-out week fell to $30.8M vs a $36.1M plan (a miss). From Jul 5 onward, revenue settled into a $23–27M band. Jul 12 was the only week to beat plan (+$132K), helped by a plan reset. Jul 19 dipped to $23.1M, the lowest post-Prime week. Aug 2 and Aug 9 both missed plan, with the gap widening as key competitors pulled back.",
    },
    rootCauses: [
      {
        id: "top-wow-swing",
        title:
          "The #1 brand by WoW swing moved from breakeven to −$615K gap — the single biggest week-over-week move",
        body: "That brand was roughly flat to plan the week before, then deteriorated sharply in Aug 9–15. Dig into its SKU-level Gap to Plan to find which products drove the swing.",
      },
      {
        id: "second-wow-swing",
        title:
          "The #2 brand by WoW swing reversed from +$473K ahead of plan to −$47K behind — a $520K swing",
        body: "A $520K week-over-week reversal is rare without a discrete event — often the end of a deal or promotional period. Confirm whether a promotion ended between Aug 2–8 and Aug 9–15.",
      },
      {
        id: "long-tail-gap",
        title:
          "'Other' brands carry the largest absolute gap at −$1.0M, though it improved from −$1.5M",
        body: "The long-tail bucket improved by about $0.5M week-over-week, but it is still the largest absolute gap in the portfolio. Prioritize the worst SKUs inside this roll-up before chasing smaller brand swings.",
      },
      {
        id: "broad-alerts",
        title:
          "Ad spend changes and delivery promise issues flag 300+ SKUs each — the two broadest alert signals",
        body: "These two alert types touch more SKUs than any other signal this week. They are not always the largest dollar drivers, but their breadth makes them useful starting points for triage.",
        badge: "worth-watching",
      },
      {
        id: "supply-chain",
        title:
          "Supply chain is broadly healthy, though purchase order acceptance is running below ordered volume",
        body: "Overall inventory and fulfillment look stable. The soft spot is PO acceptance lagging ordered volume — monitor so it does not turn into a stock or shipping-speed issue next week.",
        badge: "worth-watching",
      },
    ],
    recommendations: [
      {
        id: "analyze-top-swing",
        title: "Run a gap to plan analysis on the #1 brand by WoW swing",
        description:
          "That brand swung −$615K week-over-week and is now one of the portfolio’s largest drags — identify which categories or SKUs drove that move before it compounds further.",
      },
      {
        id: "verify-deal-end",
        title: "Check whether a deal ended around Aug 8–9 for the #2 brand swing",
        description:
          "That brand reversed from +$473K ahead of plan to −$47K behind in one week; a deal ending at the wrong time is the most likely explanation, and verifying the promo calendar takes minutes.",
      },
      {
        id: "missing-deal-badge",
        title: "Investigate the 46 SKUs whose deal badge isn't showing",
        description:
          "A badge missing on a live deal suppresses conversion directly — confirm those deals are displaying at the right price, particularly on brands where the plan gap is already material.",
      },
      {
        id: "monitor-po",
        title: "Monitor PO fulfillment for high-velocity SKUs",
        description:
          "With 80% case acceptance and $11.7M unfulfilled, any SKU running below average cover is at near-term stock risk — pull weeks-of-cover at SKU grain for the top 20 revenue drivers.",
      },
    ],
  };
}

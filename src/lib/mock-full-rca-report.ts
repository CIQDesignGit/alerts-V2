import type { IssueSku } from "@/lib/mock-alerts-insights";

/** Status badge on a root-cause row */
export type FullRcaCauseStatus = "still-an-issue" | "resolved";

/** Confidence / priority chip next to status */
export type FullRcaCauseTag = "primary" | "unconfirmed";

/** Tone for the Change column — drives red / green text */
export type FullRcaChangeTone = "negative" | "positive" | "neutral";

export type FullRcaTableColumn = {
  key: string;
  label: string;
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
  urgency: "TODAY" | "THIS WEEK" | "THIS QUARTER";
  title: string;
  description: string;
};

export type FullRcaRootCause = {
  id: string;
  /** Lucide icon name key resolved in the report UI */
  icon: "megaphone" | "tag" | "cart";
  title: string;
  status: FullRcaCauseStatus;
  tag?: FullRcaCauseTag;
  /** Optional metrics table (e.g. Ad Spend) */
  table?: FullRcaCompareTable;
  bullets: string[];
  callout?: FullRcaCallout;
};

export type FullRcaWeekPoint = {
  week: string;
  /** Plan $ in thousands */
  plan: number;
  /** Actual revenue $ in thousands */
  actual: number;
};

export type FullRcaReportData = {
  asin: string;
  brand: string;
  weekLabel: string;
  periodLabel: string;
  keyFinding: string;
  planVsActual: FullRcaCompareTable;
  ecommerceEquation: {
    table: FullRcaCompareTable;
    summary: string;
  };
  revenueSeries: FullRcaWeekPoint[];
  rootCauses: FullRcaRootCause[];
  recommendationsUrgency: string;
  recommendations: FullRcaRecommendation[];
};

const WEEK_COLS: FullRcaTableColumn[] = [
  { key: "metric", label: "", align: "left" },
  { key: "prev", label: "Week of Jul 19", align: "right" },
  { key: "curr", label: "Week of Jul 26", align: "right" },
  { key: "change", label: "Change", align: "right" },
];

const EQUATION_COLS: FullRcaTableColumn[] = [
  { key: "metric", label: "Metric", align: "left" },
  { key: "prev", label: "Week of Jul 19", align: "right" },
  { key: "curr", label: "Week of Jul 26", align: "right" },
  { key: "change", label: "Change", align: "right" },
];

/**
 * Full weekly Amazon RCA card — shown in AllyAI chat after
 * "Run full RCA for the last week".
 */
export function getFullRcaReport(sku: IssueSku): FullRcaReportData {
  return {
    asin: sku.asin,
    brand: sku.brand,
    weekLabel: "Week of Jul 26 – Aug 1, 2026",
    periodLabel: "last week",
    keyFinding:
      "Revenue collapsed –50% WoW ($228K → $114K). A 93% cut in ad spend ($6,538 → $483) was the dominant cause — it wiped out $118K of ad-attributed sales and pulled 30% of traffic off the page. A missing deal badge (likely: a promotional price that expired) and a one-day buy-box loss on Jul 29 added pressure but are secondary by a wide margin.",
    planVsActual: {
      columns: WEEK_COLS,
      rows: [
        {
          id: "revenue",
          label: "Revenue (Actual)",
          cells: [
            { text: "$227,666" },
            { text: "$113,597" },
            { text: "−$114,069 (−50.1%)", tone: "negative" },
          ],
        },
        {
          id: "plan",
          label: "Plan",
          cells: [
            { text: "$528,911" },
            { text: "$547,848" },
            { text: "+$19K", tone: "positive" },
          ],
        },
        {
          id: "gap",
          label: "Gap to Plan",
          cells: [
            { text: "−$301,245" },
            { text: "−$434,251" },
            { text: "−$133K wider", tone: "negative" },
          ],
        },
      ],
    },
    ecommerceEquation: {
      table: {
        columns: EQUATION_COLS,
        rows: [
          {
            id: "traffic",
            label: "Page Views (Traffic)",
            cells: [
              { text: "65,950" },
              { text: "46,295" },
              { text: "−29.8%", tone: "negative" },
            ],
          },
          {
            id: "cvr",
            label: "Conversion Rate",
            cells: [
              { text: "2.17%" },
              { text: "1.37%" },
              { text: "−0.80 pp (−36.9%)", tone: "negative" },
            ],
          },
          {
            id: "asp",
            label: "Avg Selling Price (ASP)",
            cells: [
              { text: "$159.10" },
              { text: "$178.61" },
              { text: "+$19.51 (+12.3%)", tone: "positive" },
            ],
          },
          {
            id: "units",
            label: "Units Sold",
            cells: [
              { text: "1,431" },
              { text: "636" },
              { text: "−55.6%", tone: "negative" },
            ],
          },
          {
            id: "revenue",
            label: "Revenue",
            cells: [
              { text: "$227,666" },
              { text: "$113,597" },
              { text: "−50.1%", tone: "negative" },
            ],
          },
        ],
      },
      summary:
        "Both traffic and conversion fell sharply. The ASP increase partially offset the decline but also likely contributed to lower conversion (the product became ~$20 more expensive with no promotional badge). The price rise is consistent with a promotional discount expiring in the prior week.",
    },
    // Rough shape from the design screenshot (values in $K)
    revenueSeries: [
      { week: "Jun 7", plan: 480, actual: 140 },
      { week: "Jun 14", plan: 420, actual: 280 },
      { week: "Jun 21", plan: 180, actual: 520 },
      { week: "Jun 28", plan: 760, actual: 160 },
      { week: "Jul 5", plan: 560, actual: 200 },
      { week: "Jul 12", plan: 500, actual: 210 },
      { week: "Jul 19", plan: 540, actual: 190 },
      { week: "Jul 26", plan: 520, actual: 114 },
    ],
    rootCauses: [
      {
        id: "ad-spend",
        icon: "megaphone",
        title: "Ad Spend Collapse — ~$118K revenue lost",
        status: "still-an-issue",
        tag: "primary",
        table: {
          columns: WEEK_COLS,
          rows: [
            {
              id: "spend",
              label: "Ad Spend",
              cells: [
                { text: "$6,538" },
                { text: "$483" },
                { text: "−92.6%", tone: "negative" },
              ],
            },
            {
              id: "attr",
              label: "Ad-Attributed Sales",
              cells: [
                { text: "$145,561" },
                { text: "$26,882" },
                { text: "−$118,679", tone: "negative" },
              ],
            },
          ],
        },
        bullets: [
          "The drop in ad-attributed sales (−$118,679) accounts for essentially all of the total revenue decline (−$114,069). Paid search was the primary sales engine.",
          'A 93% spend cut pulled spend from five high-importance keywords: "ninja crispi", "glass air fryer", "ninja air fryer", "crispi", and "air fryer glass".',
          "Direct consequences: ~30% traffic drop and ~37% conversion drop on the page.",
        ],
        callout: {
          label: "Finding:",
          body: "'Espresso machine' shows $0 spend in both weeks — likely a miscategorised or mistargeted keyword. Flag for cleanup.",
        },
      },
      {
        id: "deal-badge",
        icon: "tag",
        title: "Missing Deal Badge / Price Normalisation — ~$10–30K",
        status: "still-an-issue",
        tag: "unconfirmed",
        bullets: [
          "The DEAL_BADGE_LIVE_MISSING alert fired. The promo calendar returned no scheduled deals — a contradiction.",
          "Most likely explanation: a promotional price expired around Jul 19–26. Evidence: ASP jumped $20 ($159 → $179) with no other price change signal. A $20 dearer product with no badge drives lower conversion independently of the traffic drop.",
        ],
        callout: {
          label: "Action required:",
          body: "Cross-check with the promotions team. Was a Lightning Deal or Coupon submitted that isn't in the calendar? If a deal expired, evaluate resubmission.",
        },
      },
      {
        id: "buy-box",
        icon: "cart",
        title: "Buy Box Lost (Jul 29 only, recovered) — $7,123",
        status: "resolved",
        bullets: [
          "Buy box lost for ~6 hours on Wednesday Jul 29 (25% of the day). Recovered by Jul 30.",
          "Revenue lost: $7,123 — ~6% of the week's total decline. Single-day, resolved.",
          "At the higher ASP ($179 vs $159), the product is more exposed to third-party undercutting. Monitor through this week.",
        ],
      },
    ],
    recommendationsUrgency:
      "Urgency: TODAY = do before EOD · THIS WEEK = resolve by Aug 8 · THIS QUARTER = structural",
    recommendations: [
      {
        id: "restore-spend",
        urgency: "TODAY",
        title: "Restore ad spend",
        description:
          "Reinstate sponsored product + brand spend on the five flagged keywords. Target ≥$6,500 budget (Jul 19 level). Confirm: was budget paused manually or by a budget cap?",
      },
      {
        id: "reconcile-badge",
        urgency: "THIS WEEK",
        title: "Reconcile the deal badge",
        description:
          "Check with promotions: was a Lightning Deal or Coupon submitted but unrecorded in the calendar? The $20 ASP step-up strongly implies a deal expired. If resubmission is feasible, act now.",
      },
      {
        id: "monitor-bb",
        urgency: "THIS WEEK",
        title: "Monitor buy box at $179",
        description:
          "Jul 29 loss was one-day and recovered, but higher ASP increases exposure to undercutting. Set a price-floor alert or check daily buy-box status through this week.",
      },
    ],
  };
}

import type { IssueKey } from "@/components/alerts/issue-names";
import type { IssueSku } from "@/lib/mock-alerts-insights";
import {
  checkCells,
  JUN_1_7_DAYS,
  textCells,
  type LastWeekTrendData,
  type TrendTableCell,
  type TrendTableRow,
} from "@/lib/mock-last-week-trend-shared";

/** Lost Buy Box — matches the Aug 9–15 design screenshot */
function getLostBuyBoxTrend(sku: IssueSku): LastWeekTrendData {
  const competitor = sku.bbOwner
    ? `${sku.bbOwner} (3P Seller)`
    : "ElectroHub Direct (3P Seller)";

  return {
    issueKey: "lostBuyBox",
    title: "Last Week Trend (Aug 9–15)",
    vsPrevWeekTooltip:
      "Compares this week’s Lost Buy Box metrics to the prior 7 days.",
    summaryMetrics: [
      {
        id: "lbb",
        // Label above, large value below (same pattern as design “LBB DAYS / 5 / 7”)
        label: "LBB DAYS",
        value: "5 / 7",
        delta: "+16%",
        deltaTone: "negative",
      },
      {
        id: "rev",
        label: "REVENUE LOST",
        value: "-$86.0K",
        delta: "+65%",
        deltaTone: "negative",
      },
      {
        id: "comp",
        label: "BUY BOX WINNER",
        value: competitor,
        infoTooltip:
          "Seller who won the Buy Box most often when you lost it last week.",
      },
      {
        id: "our-price",
        label: "YOUR AVG PRICE",
        value: "$529.99",
        delta: "+6.0%",
        deltaTone: "negative",
      },
      {
        id: "comp-price",
        label: "COMPETITOR'S AVG PRICE",
        value: "$362.09",
        delta: "+6.5%",
        deltaTone: "positive",
      },
      {
        id: "gap",
        label: "AVG PRICE GAP",
        value: "+$37.60",
        delta: "+288%",
        deltaTone: "negative",
      },
    ],
    days: [
      { id: "d0", dateLabel: "Aug 9", dayLabel: "Sun" },
      { id: "d1", dateLabel: "Aug 10", dayLabel: "Mon" },
      { id: "d2", dateLabel: "Aug 11", dayLabel: "Tue" },
      { id: "d3", dateLabel: "Aug 12", dayLabel: "Wed" },
      { id: "d4", dateLabel: "Aug 13", dayLabel: "Thu" },
      { id: "d5", dateLabel: "Aug 14", dayLabel: "Fri" },
      { id: "d6", dateLabel: "Aug 15", dayLabel: "Sat" },
    ],
    rows: [
      {
        id: "win-rate",
        label: "Buy Box win rate (crawls)",
        cells: textCells(
          ["6/6", "1/6", "0/6", "1/6", "5/6", "0/6", "1/6"],
          [
            "positive",
            "negative",
            "negative",
            "negative",
            "positive",
            "negative",
            "negative",
          ],
        ),
      },
      {
        id: "price-gap",
        label: "Price gap",
        infoTooltip:
          "Average amount by which your price exceeds the Buy Box winner's price when you lose the Buy Box.",
        cells: textCells(
          [
            "-$22.40",
            "+$35.00",
            "+$48.50",
            "+$41.99",
            "-$18.75",
            "+$44.00",
            "+$29.50",
          ],
          [
            "positive",
            "negative",
            "negative",
            "negative",
            "positive",
            "negative",
            "negative",
          ],
        ),
      },
      {
        id: "revenue",
        label: "Est. Revenue Impact",
        cells: [
          { kind: "empty" },
          { kind: "text", value: "$17.2K", tone: "negative" },
          { kind: "text", value: "$16.8K", tone: "negative" },
          { kind: "text", value: "$17.9K", tone: "negative" },
          { kind: "empty" },
          { kind: "text", value: "$19.1K", tone: "negative" },
          { kind: "text", value: "$15.0K", tone: "negative" },
        ],
      },
    ],
  };
}

/** Promo Badge — matches the Aug 9–15 design screenshot */
function getPromoBadgeTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "promoBadge",
    title: "Last Week Trend (Aug 9–15)",
    vsPrevWeekTooltip:
      "Compares this week’s Promo Badge metrics to the prior 7 days.",
    summaryMetrics: [
      {
        id: "badge-missing",
        label: "PROMO BADGE MISSING",
        value: "7 / 7 days",
        delta: "+75%",
        deltaTone: "negative",
      },
      {
        id: "rev",
        label: "EST. REVENUE IMPACT",
        value: "-$4,200",
        delta: "+133%",
        deltaTone: "negative",
      },
      {
        id: "list-mismatch",
        label: "LIST PRICE MISMATCH",
        value: "7 / 7 days",
        delta: "+40%",
        deltaTone: "negative",
      },
      {
        id: "sell-mismatch",
        label: "SELLING PRICE MISMATCH",
        value: "7 / 7 days",
        delta: "+17%",
        deltaTone: "negative",
      },
      {
        id: "list-vis",
        label: "LIST PRICE VISIBILITY",
        value: "2 / 7 days",
        delta: "+100%",
        deltaTone: "positive",
      },
      {
        id: "strikethrough",
        label: "NO STRIKETHROUGH ON MSRP",
        value: "7 / 7 days",
        delta: "+40%",
        deltaTone: "negative",
      },
    ],
    days: [
      { id: "d0", dateLabel: "Aug 9", dayLabel: "Sun" },
      { id: "d1", dateLabel: "Aug 10", dayLabel: "Mon" },
      { id: "d2", dateLabel: "Aug 11", dayLabel: "Tue" },
      { id: "d3", dateLabel: "Aug 12", dayLabel: "Wed" },
      { id: "d4", dateLabel: "Aug 13", dayLabel: "Thu" },
      { id: "d5", dateLabel: "Aug 14", dayLabel: "Fri" },
      { id: "d6", dateLabel: "Aug 15", dayLabel: "Sat" },
    ],
    rows: [
      {
        id: "expected",
        label: "Expected on Promo",
        cells: checkCells([true, true, false, true, true, false, true]),
      },
      {
        id: "badge-crawls",
        label: "Badge Missing (crawls)",
        cells: [
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
        ],
      },
      {
        id: "msrp-crawls",
        label: "MSRP Strikethrough Missing (crawls)",
        cells: [
          { kind: "text", value: "0/6", tone: "positive" },
          { kind: "text", value: "0/6", tone: "positive" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
          { kind: "text", value: "0/6", tone: "positive" },
          { kind: "empty" },
          { kind: "text", value: "6/6", tone: "negative" },
        ],
      },
    ],
  };
}

/** Deal Page Visibility — check / X / rank table only */
function getDealPageVisibilityTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "dealPageVisibility",
    title: "Last Week Trend (Aug 9–15)",
    showVsPrevWeek: false,
    vsPrevWeekTooltip:
      "Compares this week’s Deal Page Visibility metrics to the prior 7 days.",
    summaryMetrics: [],
    days: JUN_1_7_DAYS,
    rows: [
      {
        id: "expected",
        label: "Expected on deals page",
        cells: checkCells([true, true, false, true, true, false, true]),
      },
      {
        id: "visible",
        label: "Visible on deals page",
        cells: checkCells([false, true, null, true, false, null, true]),
      },
      {
        id: "rank",
        label: "Deal-Page Rank",
        cells: [
          { kind: "text", value: "#12", tone: "neutral" },
          { kind: "text", value: "#4", tone: "neutral" },
          { kind: "empty" },
          { kind: "text", value: "#7", tone: "neutral" },
          { kind: "text", value: "#15", tone: "neutral" },
          { kind: "empty" },
          { kind: "text", value: "#2", tone: "neutral" },
        ],
      },
    ],
  };
}

/** Coupon — crawl detection ratio */
function getCouponTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "coupon",
    title: "Last Week Trend (Aug 9–15)",
    vsPrevWeekTooltip:
      "Compares this week’s Coupon detection crawls to the prior 7 days.",
    summaryColumns: 1,
    summaryMetrics: [
      {
        id: "total",
        label: "TOTAL COUPON DETECTED (CRAWLS)",
        value: "18/35",
        delta: "-28%",
        deltaTone: "negative",
      },
    ],
    days: JUN_1_7_DAYS,
    rows: [
      {
        id: "detected",
        label: "Coupon Detected",
        cells: textCells(["5/5", "0/5", "4/5", "5/5", "1/5", "3/5", "0/5"]),
      },
    ],
  };
}

/** Credit Offer — same layout as Coupon, different labels */
function getCreditOfferTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "creditOffer",
    title: "Last Week Trend (Aug 9–15)",
    vsPrevWeekTooltip:
      "Compares this week’s Credit Offer detection crawls to the prior 7 days.",
    summaryColumns: 1,
    summaryMetrics: [
      {
        id: "total",
        label: "TOTAL CREDIT OFFER DETECTED (CRAWLS)",
        value: "18/35",
        delta: "-28%",
        deltaTone: "negative",
      },
    ],
    days: JUN_1_7_DAYS,
    rows: [
      {
        id: "detected",
        label: "Credit Offer Detected",
        cells: textCells(["5/5", "0/5", "4/5", "5/5", "1/5", "3/5", "0/5"]),
      },
    ],
  };
}

/** Best Seller Rank — avg rank + median / high / low */
function getBestSellerRankTrend(_sku: IssueSku): LastWeekTrendData {
  const medianTones = [
    "neutral",
    "negative",
    "positive",
    "negative",
    "positive",
    "positive",
    "negative",
  ] as const;

  return {
    issueKey: "bestSellerRank",
    title: "Last Week Trend (Aug 9–15)",
    vsPrevWeekTooltip:
      "Compares this week’s Best Seller Rank metrics to the prior 7 days.",
    summaryColumns: 1,
    summaryMetrics: [
      {
        id: "avg-rank",
        label: "LAST WEEK AVG RANK",
        value: "#19",
        delta: "+36%",
        deltaTone: "negative",
      },
    ],
    days: JUN_1_7_DAYS,
    rows: [
      {
        id: "median",
        label: "Median Category Rank",
        cells: textCells(
          ["#14", "#17", "#15", "#22", "#20", "#18", "#24"],
          [...medianTones],
        ),
      },
      {
        id: "highest",
        label: "Highest Rank",
        cells: textCells(["#8", "#12", "#9", "#15", "#11", "#10", "#14"]),
      },
      {
        id: "lowest",
        label: "Lowest Rank",
        cells: textCells(["#22", "#28", "#21", "#35", "#29", "#26", "#38"]),
      },
    ],
  };
}

/** Rating & Reviews — 4 KPIs + daily rating quality */
function getRatingReviewsTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "ratingReviews",
    title: "Last Week Trend (Aug 9–15)",
    vsPrevWeekTooltip:
      "Compares this week’s Rating & Reviews metrics to the prior 7 days.",
    summaryColumns: 4,
    summaryMetrics: [
      {
        id: "avg",
        label: "AVG RATING",
        value: "4.0 / 5.0",
        delta: "-7.0%",
        deltaTone: "negative",
      },
      {
        id: "count",
        label: "REVIEW COUNT",
        value: "736",
        delta: "+8.2%",
        deltaTone: "positive",
      },
      {
        id: "one-star",
        label: "1-STAR %",
        value: "14.2%",
        delta: "+3.1pp",
        deltaTone: "negative",
      },
      {
        id: "two-star",
        label: "2-STAR %",
        value: "8.3%",
        delta: "+1.8pp",
        deltaTone: "negative",
      },
    ],
    days: [
      { id: "d0", dateLabel: "Aug 9", dayLabel: "Sun" },
      { id: "d1", dateLabel: "Aug 10", dayLabel: "Mon" },
      { id: "d2", dateLabel: "Aug 11", dayLabel: "Tue" },
      { id: "d3", dateLabel: "Aug 12", dayLabel: "Wed" },
      { id: "d4", dateLabel: "Aug 13", dayLabel: "Thu" },
      { id: "d5", dateLabel: "Aug 14", dayLabel: "Fri" },
      { id: "d6", dateLabel: "Aug 15", dayLabel: "Sat" },
    ],
    rows: [
      {
        id: "avg-star",
        label: "Avg Star Rating",
        cells: textCells(
          ["4.3", "4.2", "4.1", "3.9", "3.7", "3.4", "3.2"],
          [
            "neutral",
            "neutral",
            "neutral",
            "negative",
            "negative",
            "negative",
            "negative",
          ],
        ),
      },
      {
        id: "delta",
        label: "Rating Δ vs prev day",
        cells: [
          { kind: "empty" },
          { kind: "text", value: "-0.1", tone: "negative" },
          { kind: "text", value: "-0.1", tone: "negative" },
          { kind: "text", value: "-0.2", tone: "negative" },
          { kind: "text", value: "-0.2", tone: "negative" },
          { kind: "text", value: "-0.3", tone: "negative" },
          { kind: "text", value: "-0.2", tone: "negative" },
        ],
      },
      {
        id: "reviews",
        label: "Total Reviews",
        cells: textCells([
          "718",
          "740",
          "755",
          "728",
          "712",
          "701",
          "736",
        ]),
      },
      {
        id: "one-star",
        label: "New 1★",
        cells: textCells(
          ["37", "50", "57", "83", "91", "95", "103"],
          [
            "neutral",
            "neutral",
            "neutral",
            "negative",
            "negative",
            "negative",
            "negative",
          ],
        ),
      },
      {
        id: "two-star",
        label: "New 2★",
        cells: textCells(
          ["22", "26", "30", "38", "61", "60", "61"],
          [
            "neutral",
            "neutral",
            "neutral",
            "neutral",
            "negative",
            "negative",
            "negative",
          ],
        ),
      },
    ],
  };
}

/** Sep 27–Oct 3 day headers — single-line uppercase (Stock Availability design) */
const SEP_27_OCT_3_DAYS = [
  { id: "d0", dateLabel: "SEP 27", dayLabel: "" },
  { id: "d1", dateLabel: "SEP 28", dayLabel: "" },
  { id: "d2", dateLabel: "SEP 29", dayLabel: "" },
  { id: "d3", dateLabel: "SEP 30", dayLabel: "" },
  { id: "d4", dateLabel: "OCT 1", dayLabel: "" },
  { id: "d5", dateLabel: "OCT 2", dayLabel: "" },
  { id: "d6", dateLabel: "OCT 3", dayLabel: "" },
] as const;

/** Shared daily crawl fractions for Unavailable crawls + breakdown rows */
const UNAVAILABLE_CRAWL_CELLS = textCells([
  "0/12",
  "0/11",
  "0/12",
  "0/7",
  "0/4",
  "0/5",
  "0/4",
]);

/** Stock Availability — days unavailable / crawl unavailability / on-hand inventory */
function getStockAvailabilityTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "stockAvailability",
    title: "Last Week Trend (Sep 27–Oct 3)",
    vsPrevWeekTooltip:
      "Compares this week’s Stock Availability metrics to the prior 7 days.",
    showVsPrevWeek: false,
    summaryColumns: 3,
    summaryMetrics: [
      {
        id: "days-unavailable",
        label: "DAYS UNAVAILABLE",
        value: "0",
      },
      {
        id: "unavail",
        label: "UNAVAILABILITY",
        value: "0/55",
        valueInfoTooltip:
          "Unavailable crawls over total crawls in the last 7 days.",
      },
      {
        id: "oh",
        label: "ON HAND INVENTORY",
        value: "808",
        delta: "↓ vs 2,410",
        deltaTone: "negative",
        valueInfoTooltip:
          "Ending on-hand units versus inventory at the start of the prior week.",
      },
    ],
    days: [...SEP_27_OCT_3_DAYS],
    rows: [
      {
        id: "unavailable-crawls",
        label: "Unavailable crawls",
        cells: UNAVAILABLE_CRAWL_CELLS,
      },
      {
        id: "oos-crawls",
        label: "OOS crawls",
        nested: true,
        cells: UNAVAILABLE_CRAWL_CELLS,
      },
      {
        id: "1p-unavailable-crawls",
        label: "1P Unavailable crawls",
        nested: true,
        cells: UNAVAILABLE_CRAWL_CELLS,
      },
      {
        id: "suppressed-crawls",
        label: "Suppressed crawls",
        nested: true,
        cells: UNAVAILABLE_CRAWL_CELLS,
      },
      {
        id: "unavailable-other-crawls",
        label: "Unavailable - Other Reasons crawls",
        nested: true,
        cells: UNAVAILABLE_CRAWL_CELLS,
      },
      {
        id: "inventory",
        label: "On hand inventory",
        cells: textCells([
          "2,126",
          "1,857",
          "1,606",
          "1,381",
          "1,183",
          "986",
          "808",
        ]),
      },
      {
        id: "open-po",
        label: "Open PO units",
        cells: textCells(["0", "0", "0", "0", "0", "0", "0"]),
      },
      {
        id: "woc",
        label: "Weeks of Cover (CIQ)",
        cells: textCells([
          "2.64",
          "2.31",
          "1.99",
          "1.72",
          "1.47",
          "1.20",
          "0.00",
        ]),
      },
    ],
  };
}

/** Sponsored Share of Voice — SP vs SB branded */
function getSponsoredSovTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "sponsoredSov",
    title: "Last Week Trend (Aug 9–15)",
    showVsPrevWeek: false,
    vsPrevWeekTooltip:
      "Compares this week’s Sponsored Share of Voice to the prior 7 days.",
    summaryMetrics: [],
    days: JUN_1_7_DAYS,
    rows: [
      {
        id: "sp",
        label: "SP Branded SOV %",
        cells: textCells([
          "5.2%",
          "5.0%",
          "4.8%",
          "4.5%",
          "4.2%",
          "4.0%",
          "3.8%",
        ]),
      },
      {
        id: "sb",
        label: "SB Branded SOV %",
        rowHighlight: true,
        cells: textCells(
          ["3.1%", "3.0%", "2.9%", "2.7%", "2.4%", "2.1%", "2.0%"],
          "negative",
        ),
      },
      {
        id: "top-comp",
        label: "Top Competitor SOV %",
        cells: textCells([
          "0.0%",
          "0.0%",
          "0.0%",
          "0.0%",
          "0.0%",
          "0.0%",
          "0.0%",
        ]),
      },
    ],
  };
}

/** Conversion Drop — CVR with late-week emphasis */
function getConversionDropTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "conversionDrop",
    title: "Last Week Trend (Aug 9–15)",
    showVsPrevWeek: false,
    vsPrevWeekTooltip:
      "Compares this week’s Conversion metrics to the prior 7 days.",
    summaryMetrics: [],
    days: JUN_1_7_DAYS,
    rows: [
      {
        id: "cvr",
        label: "Unit CVR %",
        cells: textCells(
          ["5.1%", "4.9%", "4.8%", "4.6%", "4.2%", "4.0%", "3.8%"],
          [
            "neutral",
            "neutral",
            "neutral",
            "neutral",
            "negative",
            "negative",
            "negative",
          ],
        ),
      },
      {
        id: "glances",
        label: "Glance Views",
        cells: textCells([
          "12,480",
          "12,510",
          "12,440",
          "12,390",
          "12,280",
          "12,200",
          "12,190",
        ]),
      },
      {
        id: "units",
        label: "Ordered Units",
        cells: textCells(["637", "613", "597", "570", "516", "488", "463"]),
      },
    ],
  };
}

/** Build one organic + paid pair for Keyword Rank */
function keywordRankPair(
  id: string,
  keyword: string,
  organic: TrendTableCell[],
  paid: TrendTableCell[],
): TrendTableRow[] {
  return [
    {
      id: `${id}-org`,
      label: keyword,
      showLabel: true,
      typeBadge: "organic",
      cells: organic,
    },
    {
      id: `${id}-paid`,
      label: keyword,
      showLabel: false,
      typeBadge: "paid",
      cells: paid,
    },
  ];
}

function rankCell(
  value: string | null,
  tone: "positive" | "negative" | "neutral" = "neutral",
): TrendTableCell {
  if (value === null) return { kind: "na" };
  return { kind: "text", value, tone };
}

/** Keyword Rank — organic / paid median by keyword */
function getKeywordRankTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "keywordRank",
    title: "Last Week Trend (Aug 9–15)",
    showVsPrevWeek: false,
    vsPrevWeekTooltip:
      "Compares this week’s Keyword Rank metrics to the prior 7 days.",
    summaryMetrics: [],
    rowHeaderLabel: "KEYWORD (MEDIAN RANK)",
    showTypeColumn: true,
    days: JUN_1_7_DAYS,
    rows: [
      ...keywordRankPair(
        "kw1",
        "vacuum cleaners for home",
        [
          rankCell("#8"),
          rankCell("#10"),
          rankCell("#12"),
          rankCell("#19", "negative"),
          rankCell("#16"),
          rankCell("#14", "positive"),
          rankCell("#21", "negative"),
        ],
        [
          rankCell("#2"),
          rankCell("#3"),
          rankCell("#2"),
          rankCell("#4"),
          rankCell("#5"),
          rankCell("#3"),
          rankCell("#8", "negative"),
        ],
      ),
      ...keywordRankPair(
        "kw2",
        "cleanpro cordless vacuum",
        [
          rankCell("#6"),
          rankCell("#8"),
          rankCell("#11"),
          rankCell("#15", "negative"),
          rankCell("#13"),
          rankCell("#10", "positive"),
          rankCell("#19", "negative"),
        ],
        [
          rankCell("#1"),
          rankCell("#1"),
          rankCell("#2"),
          rankCell("#3"),
          rankCell("#2"),
          rankCell("#2"),
          rankCell("#4"),
        ],
      ),
      ...keywordRankPair(
        "kw3",
        "cordless stick vacuum",
        [
          rankCell("#12"),
          rankCell("#13"),
          rankCell("#15"),
          rankCell("#18", "negative"),
          rankCell("#16"),
          rankCell("#14", "positive"),
          rankCell("#17"),
        ],
        [
          rankCell("#3"),
          rankCell("#4"),
          rankCell(null),
          rankCell(null),
          rankCell(null),
          rankCell("#5"),
          rankCell("#4"),
        ],
      ),
    ],
  };
}

/** Media Spend — daily $ by keyword + totals footer */
function getMediaSpendTrend(_sku: IssueSku): LastWeekTrendData {
  return {
    issueKey: "mediaSpend",
    title: "Last Week Trend (Aug 9–15)",
    showVsPrevWeek: false,
    vsPrevWeekTooltip:
      "Compares this week’s Media Spend by keyword to the prior 7 days.",
    summaryMetrics: [],
    rowHeaderLabel: "KEYWORD",
    days: JUN_1_7_DAYS,
    rows: [
      {
        id: "kw1",
        label: "vacuum cleaners for home",
        cells: textCells([
          "$480",
          "$420",
          "$390",
          "$360",
          "$340",
          "$310",
          "$290",
        ]),
      },
      {
        id: "kw2",
        label: "robot vacuum cleaner",
        cells: textCells([
          "$320",
          "$300",
          "$280",
          "$260",
          "$240",
          "$220",
          "$200",
        ]),
      },
      {
        id: "kw3",
        label: "cleanpro cordless vacuum",
        cells: textCells([
          "$280",
          "$260",
          "$240",
          "$220",
          "$200",
          "$180",
          "$160",
        ]),
      },
      {
        id: "kw4",
        label: "cordless stick vacuum",
        cells: textCells(["$140", "$120", "$0", "$0", "$0", "$110", "$100"]),
      },
      {
        id: "kw5",
        label: "stick vacuum cleaner",
        cells: textCells([
          "$110",
          "$100",
          "$90",
          "$80",
          "$70",
          "$60",
          "$50",
        ]),
      },
      {
        id: "total",
        label: "Total (all KWs)",
        isFooter: true,
        cells: textCells([
          "$1.3K",
          "$1.2K",
          "$1.0K",
          "$920",
          "$850",
          "$880",
          "$800",
        ]),
      },
    ],
  };
}

const BUILDERS: Record<
  Exclude<IssueKey, "shippingSpeed">,
  (sku: IssueSku) => LastWeekTrendData
> = {
  lostBuyBox: getLostBuyBoxTrend,
  promoBadge: getPromoBadgeTrend,
  dealPageVisibility: getDealPageVisibilityTrend,
  coupon: getCouponTrend,
  creditOffer: getCreditOfferTrend,
  bestSellerRank: getBestSellerRankTrend,
  ratingReviews: getRatingReviewsTrend,
  stockAvailability: getStockAvailabilityTrend,
  sponsoredSov: getSponsoredSovTrend,
  keywordRank: getKeywordRankTrend,
  conversionDrop: getConversionDropTrend,
  mediaSpend: getMediaSpendTrend,
};

/** Dispatch to the issue-specific mock builder */
export function getLastWeekTrendForIssue(
  issueKey: IssueKey,
  sku: IssueSku,
): LastWeekTrendData | null {
  if (issueKey === "shippingSpeed") return null;
  return BUILDERS[issueKey](sku);
}

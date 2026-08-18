import {
  ISSUE_NAMES,
  type IssueKey,
} from "@/components/alerts/issue-names";

/** One day column in the 7-day scrape history grid */
export type ScrapeHistoryDay = {
  label: string;
};

export type ScrapeHistoryIssueRow = {
  issueKey: IssueKey;
  issueLabel: string;
  /** One boolean per day — true when the issue was detected on that day */
  detectedOnDay: boolean[];
};

export type ScrapeHistoryData = {
  asin: string;
  skuName: string;
  scrapesPerDay: number;
  days: ScrapeHistoryDay[];
  issues: ScrapeHistoryIssueRow[];
};

const SCRAPES_PER_DAY = 4;

/** Row order matches the scrape-history detected-label list. */
const SCRAPE_ISSUE_ROWS: Array<{
  issueKey: IssueKey;
  detectedOnDay: boolean[];
}> = [
  {
    issueKey: "lostBuyBox",
    detectedOnDay: [false, false, false, true, false, false, false],
  },
  {
    issueKey: "promoBadge",
    detectedOnDay: [false, false, true, true, true, true, true],
  },
  {
    issueKey: "dealPageVisibility",
    detectedOnDay: [false, false, false, false, false, true, true],
  },
  {
    issueKey: "coupon",
    detectedOnDay: [true, true, true, true, true, true, true],
  },
  {
    issueKey: "creditOffer",
    detectedOnDay: [false, true, true, false, false, true, false],
  },
  {
    issueKey: "stockAvailability",
    detectedOnDay: [true, true, true, true, true, true, true],
  },
  {
    issueKey: "shippingSpeed",
    detectedOnDay: [false, false, true, false, false, false, false],
  },
  {
    issueKey: "ratingReviews",
    detectedOnDay: [false, false, false, false, false, false, true],
  },
  {
    issueKey: "bestSellerRank",
    detectedOnDay: [false, false, true, false, false, true, true],
  },
  {
    issueKey: "sponsoredSov",
    detectedOnDay: [false, true, false, false, true, false, false],
  },
  {
    issueKey: "keywordRank",
    detectedOnDay: [true, false, false, true, false, false, true],
  },
  {
    issueKey: "conversionDrop",
    detectedOnDay: [false, false, true, true, false, false, false],
  },
  {
    issueKey: "mediaSpend",
    detectedOnDay: [false, false, false, true, true, false, false],
  },
];

/** Prototype scrape grid — binary issue detection per day (any scrape flagged = detected). */
export function getScrapeHistoryData(
  asin: string,
  skuName: string,
): ScrapeHistoryData {
  return {
    asin,
    skuName,
    scrapesPerDay: SCRAPES_PER_DAY,
    days: [
      { label: "SUN 08/02" },
      { label: "MON 08/03" },
      { label: "TUE 08/04" },
      { label: "WED 08/05" },
      { label: "THU 07/30" },
      { label: "FRI 07/31" },
      { label: "SAT 08/01" },
    ],
    issues: SCRAPE_ISSUE_ROWS.map((row) => ({
      issueKey: row.issueKey,
      issueLabel: ISSUE_NAMES[row.issueKey].filter,
      detectedOnDay: row.detectedOnDay,
    })),
  };
}

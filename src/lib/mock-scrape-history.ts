/** One day column in the 7-day scrape history grid */
export type ScrapeHistoryDay = {
  label: string;
};

export type ScrapeHistoryIssueRow = {
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

/** Prototype scrape grid — binary issue detection per day (any scrape flagged = detected). */
export function getScrapeHistoryData(asin: string, skuName: string): ScrapeHistoryData {
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
    issues: [
      {
        issueLabel: "Lost Buy Box",
        detectedOnDay: [false, false, false, true, false, false, false],
      },
      {
        issueLabel: "Missing Promo Badge",
        detectedOnDay: [false, false, true, true, true, true, true],
      },
      {
        issueLabel: "Deal Page Visibility",
        detectedOnDay: [false, false, false, false, false, true, true],
      },
      {
        issueLabel: "Active Coupon",
        detectedOnDay: [true, true, true, true, true, true, true],
      },
      {
        issueLabel: "OOS",
        detectedOnDay: [true, true, true, true, true, true, true],
      },
      {
        issueLabel: "Shipping Speed",
        detectedOnDay: [false, false, true, false, false, false, false],
      },
      {
        issueLabel: "Rating Dropped",
        detectedOnDay: [false, false, false, false, false, false, true],
      },
      {
        issueLabel: "Best Seller Rank Change",
        detectedOnDay: [false, false, true, false, false, true, true],
      },
    ],
  };
}

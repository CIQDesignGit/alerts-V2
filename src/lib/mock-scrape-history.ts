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
  zipcodeDays: ScrapeZipcodeDayRow[];
};

export type ScrapeZipcodeCity = {
  city: string;
  count: number;
};

export type ScrapeZipcodeDayRow = {
  dayLabel: string;
  scrapeCount: number;
  cities: ScrapeZipcodeCity[];
  rawZips: string[];
};

const SCRAPES_PER_DAY = 4;

const SCRAPE_ZIPCODE_DAYS: ScrapeZipcodeDayRow[] = [
  {
    dayLabel: "Sun 08/02",
    scrapeCount: 4,
    cities: [
      { city: "Los Angeles", count: 3 },
      { city: "New York", count: 1 },
    ],
    rawZips: ["90012", "90049", "10001"],
  },
  {
    dayLabel: "Mon 08/03",
    scrapeCount: 4,
    cities: [
      { city: "Seattle", count: 2 },
      { city: "Boston", count: 2 },
    ],
    rawZips: ["98115", "02108", "98109", "02215"],
  },
  {
    dayLabel: "Tue 08/04",
    scrapeCount: 4,
    cities: [{ city: "Seattle", count: 4 }],
    rawZips: ["98101", "98115", "98109"],
  },
  {
    dayLabel: "Wed 08/05",
    scrapeCount: 4,
    cities: [
      { city: "Los Angeles", count: 2 },
      { city: "Boston", count: 2 },
    ],
    rawZips: ["90028", "02108", "90049"],
  },
  {
    dayLabel: "Thu 07/30",
    scrapeCount: 4,
    cities: [
      { city: "Boston", count: 2 },
      { city: "Seattle", count: 1 },
      { city: "Chicago", count: 1 },
    ],
    rawZips: ["02215", "98115", "60611"],
  },
  {
    dayLabel: "Fri 07/31",
    scrapeCount: 4,
    cities: [
      { city: "Seattle", count: 2 },
      { city: "Chicago", count: 1 },
      { city: "Boston", count: 1 },
    ],
    rawZips: ["98109", "60601", "02215"],
  },
  {
    dayLabel: "Sat 08/01",
    scrapeCount: 4,
    cities: [
      { city: "Los Angeles", count: 2 },
      { city: "Boston", count: 1 },
      { city: "Seattle", count: 1 },
    ],
    rawZips: ["90049", "02108", "98109"],
  },
];

/** Prototype scrape grid — binary issue detection per day (any scrape flagged = detected). */
export function getScrapeHistoryData(asin: string, skuName: string): ScrapeHistoryData {
  return {
    asin,
    skuName,
    scrapesPerDay: SCRAPES_PER_DAY,
    zipcodeDays: SCRAPE_ZIPCODE_DAYS,
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

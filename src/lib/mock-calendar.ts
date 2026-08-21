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

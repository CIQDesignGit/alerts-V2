import {
  ALERTS_MOCK_NOW,
  issueLabel,
  parseLostAt,
  type IssueAlert,
  type IssueSku,
} from "@/lib/mock-alerts-insights";
import { skuOpsDollars } from "@/lib/ops";

/** Exact column order from the Alert Export CSV template */
const CSV_HEADERS = [
  "Issue type",
  "Brand",
  "ASIN",
  "ASIN Name",
  "Category",
  "OPS_30d",
  "Since",
] as const;

/**
 * Turn Lost At ("Jan 16 15:40") into sample-style "Since"
 * labels like "4 days ago" or "6 hr ago".
 */
function formatSinceLabel(lostAt: string | undefined): string {
  if (!lostAt) return "";
  const lost = parseLostAt(lostAt);
  if (!lost) return lostAt;

  const ms = ALERTS_MOCK_NOW.getTime() - lost.getTime();
  const hours = Math.max(0, Math.round(ms / (60 * 60 * 1000)));

  if (hours < 24) {
    return hours === 1 ? "1 hr ago" : `${hours} hr ago`;
  }

  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

/** Quote a CSV cell when it contains commas, quotes, or newlines */
function escapeCsvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Flatten visible (filtered) issue → SKU rows into CSV text.
 * One row per SKU under each issue type.
 */
export function buildAlertsExportCsv(issues: IssueAlert[]): string {
  const lines: string[] = [CSV_HEADERS.join(",")];

  for (const issue of issues) {
    const issueType = issueLabel(issue.issueKey);
    for (const sku of issue.skus) {
      lines.push(
        [
          issueType,
          sku.brand,
          sku.asin,
          sku.name,
          sku.category,
          skuOpsDollars(sku),
          formatSinceLabel(sku.lostAt),
        ]
          .map(escapeCsvCell)
          .join(","),
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

/** e.g. Alert_Export_8_11_2026.csv — matches the attached sample naming */
function alertsExportFileName(now = new Date()): string {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();
  return `Alert_Export_${month}_${day}_${year}.csv`;
}

/** Trigger a browser download of the alerts CSV for the given list */
export function downloadAlertsCsv(issues: IssueAlert[]): void {
  const csv = buildAlertsExportCsv(issues);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = alertsExportFileName();
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

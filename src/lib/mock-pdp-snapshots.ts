import { ALERTS_LAST_CRAWL_RELATIVE } from "@/lib/mock-alerts-insights";

/** One saved PDP html/screenshot from a crawl */
export type PdpSnapshot = {
  id: string;
  /** e.g. "Today, 4:00 PM" — newest must match LastCrawlBadge clock */
  whenLabel: string;
  /** e.g. "2h ago" */
  relativeLabel: string;
  city: string;
  zip: string;
  /** Prototype placeholder — keep users on-page */
  href: string;
};

/**
 * Recent crawl snapshots for the PDP Snapshots popover.
 * Stable mock list — same for every SKU in the prototype.
 * Newest row uses the same clock as LastCrawlBadge (4:00 PM today / 2h ago).
 */
export const PDP_SNAPSHOTS: PdpSnapshot[] = [
  {
    id: "snap-1",
    whenLabel: "Today, 4:00 PM",
    relativeLabel: ALERTS_LAST_CRAWL_RELATIVE,
    city: "New York",
    zip: "10025",
    href: "#",
  },
  {
    id: "snap-2",
    whenLabel: "Today, 10:00 AM",
    relativeLabel: "8h ago",
    city: "Boston",
    zip: "02116",
    href: "#",
  },
  {
    id: "snap-3",
    whenLabel: "Today, 4:00 AM",
    relativeLabel: "14h ago",
    city: "Los Angeles",
    zip: "90012",
    href: "#",
  },
  {
    id: "snap-4",
    whenLabel: "Yesterday, 10:00 PM",
    relativeLabel: "20h ago",
    city: "Los Angeles",
    zip: "90028",
    href: "#",
  },
  {
    id: "snap-5",
    whenLabel: "Yesterday, 4:00 PM",
    relativeLabel: "26h ago",
    city: "Los Angeles",
    zip: "90028",
    href: "#",
  },
  {
    id: "snap-6",
    whenLabel: "Yesterday, 10:00 AM",
    relativeLabel: "32h ago",
    city: "Chicago",
    zip: "60611",
    href: "#",
  },
];

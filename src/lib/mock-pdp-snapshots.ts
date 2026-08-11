/** One saved PDP html/screenshot from a crawl */
export type PdpSnapshot = {
  id: string;
  /** e.g. "Today, 4:30 AM" */
  whenLabel: string;
  /** e.g. "8 hrs ago" */
  relativeLabel: string;
  city: string;
  zip: string;
  /** Prototype placeholder — keep users on-page */
  href: string;
};

/**
 * Recent crawl snapshots for the PDP Snapshots popover.
 * Stable mock list — same for every SKU in the prototype.
 */
export const PDP_SNAPSHOTS: PdpSnapshot[] = [
  {
    id: "snap-1",
    whenLabel: "Today, 4:30 AM",
    relativeLabel: "8 hrs ago",
    city: "New York",
    zip: "10025",
    href: "#",
  },
  {
    id: "snap-2",
    whenLabel: "Today, 3:02 AM",
    relativeLabel: "9 hrs ago",
    city: "Boston",
    zip: "02116",
    href: "#",
  },
  {
    id: "snap-3",
    whenLabel: "Today, 12:30 AM",
    relativeLabel: "12 hrs ago",
    city: "Los Angeles",
    zip: "90012",
    href: "#",
  },
  {
    id: "snap-4",
    whenLabel: "Yesterday, 10:30 PM",
    relativeLabel: "14 hrs ago",
    city: "Los Angeles",
    zip: "90028",
    href: "#",
  },
  {
    id: "snap-5",
    whenLabel: "Yesterday, 8:33 PM",
    relativeLabel: "16 hrs ago",
    city: "Los Angeles",
    zip: "90028",
    href: "#",
  },
  {
    id: "snap-6",
    whenLabel: "Yesterday, 6:30 PM",
    relativeLabel: "18 hrs ago",
    city: "Chicago",
    zip: "60611",
    href: "#",
  },
];

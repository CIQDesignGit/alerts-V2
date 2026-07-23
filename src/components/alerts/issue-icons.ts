import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Award,
  Box,
  CalendarDays,
  DollarSign,
  Filter,
  Megaphone,
  PieChart,
  Shield,
  ShoppingCart,
  Star,
  Tag,
  Truck,
} from "lucide-react";

import { ISSUE_NAMES, type IssueKey } from "@/components/alerts/issue-names";

/** Lucide icon per canonical issue key — shared by Alerts RCA + Insights chips. */
export const ISSUE_ICONS: Record<IssueKey, LucideIcon> = {
  lostBuyBox: ShoppingCart,
  promoBadge: Megaphone,
  dealPageVisibility: CalendarDays,
  coupon: Tag,
  bestSellerRank: Award,
  ratingReviews: Star,
  stockAvailability: Box,
  shippingSpeed: Truck,
  sponsoredSov: PieChart,
  conversionDrop: Filter,
  keywordRank: Shield,
  mediaSpend: DollarSign,
};

/** Resolve icon from a chip / filter / pane label (e.g. "Buy Box", "Stock"). */
export function getIssueIconForLabel(label: string): LucideIcon {
  const normalized = label.trim().toLowerCase();
  for (const key of Object.keys(ISSUE_NAMES) as IssueKey[]) {
    const names = ISSUE_NAMES[key];
    if (
      names.chip.toLowerCase() === normalized ||
      names.filter.toLowerCase() === normalized ||
      names.pane.toLowerCase() === normalized
    ) {
      return ISSUE_ICONS[key];
    }
  }
  return AlertCircle;
}

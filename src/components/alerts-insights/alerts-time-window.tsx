"use client";

import {
  alertsTimeWindowPhrase,
  DEFAULT_ALERTS_TIME_WINDOW,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

type AlertsTimeWindowLabelProps = {
  className?: string;
};

/**
 * Quiet caption under the Alerts list summary
 * (no selector — always the default window, currently last 24 hours).
 */
export function AlertsTimeWindowLabel({ className }: AlertsTimeWindowLabelProps) {
  return (
    <span className={cn("text-xs leading-snug text-muted-foreground", className)}>
      Active in the {alertsTimeWindowPhrase(DEFAULT_ALERTS_TIME_WINDOW)}
    </span>
  );
}

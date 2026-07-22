"use client";

/**
 * Static label so NAMs know the Alerts list lookback
 * (no selector — always the last 7 days).
 */
export function AlertsTimeWindowLabel() {
  return (
    <p className="mt-2 text-2xs leading-snug text-muted-foreground">
      Showing issues active in the last 7 days
    </p>
  );
}

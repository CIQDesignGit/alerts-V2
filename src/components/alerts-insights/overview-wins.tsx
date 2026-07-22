"use client";

import {
  formatGapDollars,
  overviewWins,
} from "@/lib/mock-alerts-insights";

/**
 * Wins panel — CIQ / AllyAI actions with quantified $ impact.
 * Not a list of above-plan categories; each card is an intervention story.
 * Temporarily hidden from OverviewTab — keep this file for when we re-enable it.
 */
export function OverviewWins() {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-border bg-background shadow-xs">
      {/* Same header pattern as Active Alerts: title + subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Wins</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            CIQ actions this week · impact quantified
          </p>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {overviewWins.map((win) => (
          <li key={win.id} className="flex gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{win.action}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {win.narrative}
              </p>
              <p className="mt-1.5 text-2xs text-neutral-500">
                {win.scope}
                {win.skusTouched != null ? ` · ${win.skusTouched} SKUs` : ""}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm font-semibold tabular-nums text-success-600">
                {formatGapDollars(win.impactDollars)}
              </p>
              <p className="mt-0.5 max-w-28 text-2xs text-muted-foreground">
                {win.impactLabel}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { TrendingUp } from "lucide-react";

import {
  formatGapDollars,
  overviewWins,
} from "@/lib/mock-alerts-insights";

/**
 * Wins panel — above-plan brands/categories only.
 * Complements Active Alerts (misses) without repeating the Insights hero brands.
 */
export function OverviewWins() {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-border bg-background shadow-xs">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="flex size-7 items-center justify-center rounded-lg bg-success-100 text-success-700">
          <TrendingUp className="size-3.5" aria-hidden />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Wins</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Above plan this week · dollar impact first
          </p>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {overviewWins.map((win) => (
          <li key={win.id} className="flex items-center gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{win.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {win.path} · {win.note}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm font-semibold tabular-nums text-success-600">
                {formatGapDollars(win.gapDollars)}
              </p>
              <p className="mt-0.5 text-2xs text-muted-foreground">
                {win.attainmentPct}% attainment
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

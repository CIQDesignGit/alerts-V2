"use client";

import { Sparkles } from "lucide-react";

import {
  formatGapDollars,
  overviewWins,
} from "@/lib/mock-alerts-insights";

/**
 * Wins panel — CIQ / AllyAI actions with quantified $ impact.
 * Not a list of above-plan categories; each card is an intervention story.
 */
export function OverviewWins() {
  return (
    <section className="flex min-h-0 flex-col rounded-xl border border-border bg-background shadow-xs">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="flex size-7 items-center justify-center rounded-lg bg-success-100 text-success-700">
          <Sparkles className="size-3.5" aria-hidden />
        </span>
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
              {/* What CIQ did */}
              <p className="text-sm font-medium text-foreground">{win.action}</p>
              {/* Short story: signal → action → outcome */}
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
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

"use client";

import type { ReactNode } from "react";

import {
  formatAtRisk,
  type AlertStrategicInsights,
} from "@/lib/mock-alerts-insights";
import { cn } from "@/lib/utils";

/**
 * Light sky-blue family — soft enough for cards, stepped for segment contrast.
 * No navy, no grey fillers.
 */
const COMPOSITION_COLORS = [
  "bg-info-500", // clear sky
  "bg-info-100", // pale sky
  "bg-info-500/70", // mid sky
  "bg-info-600", // slightly deeper sky
  "bg-info-100/80",
  "bg-info-500/40",
] as const;

type CompositionRow = {
  id: string;
  name: string;
  dollars: number;
  pct: number;
  /** Optional second line under the name (e.g. "3 SKUs") */
  subtitle?: string;
};

type AlertImpactInsightsProps = {
  insights: AlertStrategicInsights;
};

/**
 * Alert-level metric strip: impact mix · seller mix · category mix.
 * All three cards use the same composition pattern (one bar + legend).
 */
export function AlertImpactInsights({ insights }: AlertImpactInsightsProps) {
  const impactRows: CompositionRow[] = insights.impact.map((bucket) => ({
    id: bucket.id,
    name: bucket.label,
    dollars: bucket.dollars,
    pct: bucket.pct,
  }));

  const sellerRows: CompositionRow[] = insights.sellers.map((row) => ({
    id: row.id,
    name: row.name,
    dollars: row.dollars,
    pct: row.pct,
    subtitle: `${row.skuCount} ${row.skuCount === 1 ? "SKU" : "SKUs"}`,
  }));

  const categoryRows: CompositionRow[] = insights.categories.map((row) => ({
    id: row.id,
    name: row.name,
    dollars: row.dollars,
    pct: row.pct,
    subtitle: `${row.skuCount} ${row.skuCount === 1 ? "SKU" : "SKUs"}`,
  }));

  return (
    <section
      aria-label="Issue strategic insights"
      className="grid items-stretch gap-4 lg:grid-cols-3"
    >
      <InsightCard title="What's driving the $">
        <CompositionBlock rows={impactRows} />
      </InsightCard>

      <InsightCard title="Sellers behind it">
        {sellerRows.length === 0 ? (
          <EmptyNote text="No seller attribution on these SKUs yet." />
        ) : (
          <CompositionBlock rows={sellerRows} />
        )}
      </InsightCard>

      <InsightCard title={insights.categoryCardTitle}>
        {categoryRows.length === 0 ? (
          <EmptyNote text="No category rollup available." />
        ) : (
          <CompositionBlock rows={categoryRows} />
        )}
      </InsightCard>
    </section>
  );
}

function InsightCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xs">
      <header className="border-b border-border bg-neutral-50/80 px-5 py-3">
        <h3 className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
          {title}
        </h3>
      </header>

      <div className="flex flex-1 flex-col px-5 py-4">{children}</div>
    </article>
  );
}

function CompositionBlock({ rows }: { rows: CompositionRow[] }) {
  const totalDollars = rows.reduce((sum, r) => sum + r.dollars, 0) || 1;

  return (
    <div className="flex flex-col gap-4">
      {/* One shared bar — each color = one slice of the same total $ */}
      <div
        className="flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-neutral-200"
        role="img"
        aria-label={rows.map((r) => `${r.name} ${r.pct}%`).join(", ")}
      >
        {rows.map((row, index) => {
          const widthPct = (row.dollars / totalDollars) * 100;
          return (
            <div
              key={row.id}
              title={`${row.name}: ${formatAtRisk(row.dollars)} (${row.pct}%)`}
              className={cn(
                "h-full min-w-0.5 shrink-0 first:rounded-l-full last:rounded-r-full",
                COMPOSITION_COLORS[index % COMPOSITION_COLORS.length],
              )}
              style={{ width: `${Math.max(widthPct, widthPct > 0 ? 2 : 0)}%` }}
            />
          );
        })}
      </div>

      {/* Legend under the bar — color swatch · name · $ */}
      <ul className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <li key={row.id} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-1.5 size-2.5 shrink-0 rounded-sm",
                COMPOSITION_COLORS[index % COMPOSITION_COLORS.length],
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-semibold text-foreground">
                  {row.name}
                </p>
                <p className="shrink-0 font-mono text-sm font-bold tabular-nums text-error-600">
                  {formatAtRisk(row.dollars)}
                </p>
              </div>
              {row.subtitle ? (
                <p className="mt-0.5 text-2xs text-muted-foreground">
                  {row.subtitle}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
  );
}

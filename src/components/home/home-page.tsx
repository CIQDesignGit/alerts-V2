"use client";

import { AlertsPanel } from "@/components/home/alerts-panel";
import { BrandInsightCard } from "@/components/home/brand-insight-card";
import { GapBanner } from "@/components/home/gap-banner";
import {
  brandInsights,
  mockAlerts,
  overallBusinessGap,
} from "@/lib/mock-home-data";

export function HomePage() {
  return (
    <div className="flex min-h-0 flex-1">
      <AlertsPanel alerts={mockAlerts} />

      <div className="flex min-w-0 flex-1 flex-col gap-6 p-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Alerts and insights
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AllyAI ranked brands and categories by Gap to plan — dollar impact
            first.
          </p>
        </header>

        <GapBanner
          gapDollars={overallBusinessGap.gapDollars}
          gapUnits={overallBusinessGap.gapUnits}
        />

        <section>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              Top brands by Gap
            </h2>
            <p className="text-xs text-muted-foreground">
              Up to 3 brands · most negative first
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {brandInsights.map((brand) => (
              <BrandInsightCard key={brand.name} brand={brand} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

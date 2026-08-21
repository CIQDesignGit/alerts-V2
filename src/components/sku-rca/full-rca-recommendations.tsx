"use client";

import type { FullRcaRecommendation } from "@/lib/mock-full-rca-report";

type FullRcaRecommendationsProps = {
  items: FullRcaRecommendation[];
};

/**
 * Recommendations body — stacked action cards
 * (matches the Gap to Plan design reference).
 */
export function FullRcaRecommendationsList({
  items,
}: FullRcaRecommendationsProps) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 bg-neutral-50/70 px-4 py-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-border bg-background px-4 py-3.5"
        >
          <p className="text-sm font-semibold leading-snug text-foreground">
            {item.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

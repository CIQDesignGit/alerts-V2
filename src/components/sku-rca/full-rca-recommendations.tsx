"use client";

import type { FullRcaRecommendation } from "@/lib/mock-full-rca-report";

type FullRcaRecommendationsProps = {
  items: FullRcaRecommendation[];
};

/** Urgency list — typography + spacing over nested boxes. */
export function FullRcaRecommendationsList({
  items,
}: FullRcaRecommendationsProps) {
  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      {items.map((item) => (
        <li key={item.id} className="border-l-2 border-brand-300 pl-3">
          <p className="text-2xs font-semibold tracking-wider text-brand-600 uppercase">
            {item.urgency}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{item.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

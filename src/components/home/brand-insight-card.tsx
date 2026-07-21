import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatGapDollars,
  type BrandInsight,
} from "@/lib/mock-home-data";

type BrandInsightCardProps = {
  brand: BrandInsight;
};

export function BrandInsightCard({ brand }: BrandInsightCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-background p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {brand.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Gap to plan · top categories
          </p>
        </div>
        <p className="font-mono text-lg font-bold text-error-600">
          {formatGapDollars(brand.gapDollars)}
        </p>
      </div>

      <ul className="mt-4 space-y-2">
        {brand.categories.map((category) => (
          <li
            key={category.name}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="text-neutral-700">{category.name}</span>
            <span className="font-mono text-error-600">
              {formatGapDollars(category.gapDollars)}
            </span>
          </li>
        ))}
      </ul>

      <Button variant="outline" size="sm" className="mt-4 w-full justify-between">
        Ask AllyAI for RCA
        <ArrowRight className="size-4" />
      </Button>
    </article>
  );
}
